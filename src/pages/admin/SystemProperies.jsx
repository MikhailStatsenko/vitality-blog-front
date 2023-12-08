import React, {useContext, useEffect, useState} from 'react';
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import {Button, Radio, Form, Input, Modal, Table, Tag, InputNumber} from "antd";

const SystemProperties = () => {
    const {store} = useContext(Context);
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [commonModal, setCommonModal] = useState(false);
    const [commonEditForm] = Form.useForm();

    const [selectedForEdit, setSelectedForEdit] = useState(null);

    const [changeIntervalModal, setChangeIntervalModal] = useState(false);
    const [changeIntervalForm] = Form.useForm();


    useEffect(() => {
        if (!store.isAdmin()) {
            navigate('/404')
        }
        const fetchData = async () => {
            const response = await store.system.getProperties();
            setProperties(response);
        }
        fetchData();

    }, [store, store.isSuperAdmin, navigate, setProperties]);

    const updateData = async () => {
        const response = await store.system.getProperties();
        setProperties(response);
    }

    const prDesc = {
        'QUARTZ_COMMENT_DELETE_JOB_INTERVAL': 'Интервал запуска задачи удаления комментариев, секунды',
        'QUARTZ_OLD_COMMENT_DELETE_MINUTES': 'Время жизни комментария в минутах',
        'SYSTEM_REGISTRATION_ENABLED': 'Включена ли регистрация',
    }

    const prType = {
        'NUMBER': 'Число',
        'STRING': 'Строка',
        'BOOLEAN': 'Логический тип',
    }

    const openCustomEditModal = (property) => {
        if (property.key === 'QUARTZ_COMMENT_DELETE_JOB_INTERVAL') {
            setChangeIntervalModal(true);
            // разбиваем значение на секунды, минуты, часы, дни
            const value = property.value;
            const seconds = value % 60;
            const minutes = Math.floor(value / 60) % 60;
            const hours = Math.floor(value / 60 / 60) % 24;
            const days = Math.floor(value / 60 / 60 / 24);

            changeIntervalForm.setFieldsValue({
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds,
            })
        }
    }


    return (
        <PageTemplate title={'Системные настройки'}>
            <Modal
                open={changeIntervalModal}
                onCancel={() => setChangeIntervalModal(false)}
                title={'Изменение интервала задания'}
                okText={'Изменить'}
                cancelText={'Отмена'}
                onOk={() => {
                    changeIntervalForm.validateFields()
                        .then(async (values) => {
                            const seconds = values.seconds || 0;
                            const minutes = values.minutes || 0;
                            const hours = values.hours || 0;
                            const days = values.days || 0;

                            await store.system.updateInterval(
                                "comments",
                                {
                                    days: days,
                                    hours: hours,
                                    minutes: minutes,
                                    seconds: seconds,
                                }
                            )
                            setChangeIntervalModal(false);
                            updateData();
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }}>
                <Form
                    form={changeIntervalForm}
                    layout={'vertical'}
                >
                    <Form.Item
                        label={'Дни'}
                        name={'days'}
                    >
                        <InputNumber max={3650} className={'w-full'}/>
                    </Form.Item>
                    <Form.Item
                        label={'Часы'}
                        name={'hours'}
                    >
                        <InputNumber max={23} className={'w-full'}/>
                    </Form.Item>
                    <Form.Item
                        label={'Минуты'}
                        name={'minutes'}
                    >
                        <InputNumber max={59} className={'w-full'}/>
                    </Form.Item>
                    <Form.Item
                        label={'Секунды'}
                        name={'seconds'}
                    >
                        <InputNumber max={59} className={'w-full'}/>
                    </Form.Item>
                </Form>
            </Modal>


            <Modal
                open={commonModal}
                onCancel={() => setCommonModal(false)}
                title={'Изменение настройки'}
                okText={'Изменить'}
                cancelText={'Отмена'}
                onOk={() => {
                    commonEditForm.validateFields()
                        .then(async (values) => {
                            await store.system.updateProperty(selectedForEdit.key, values.value);
                            setCommonModal(false);
                            updateData();
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }}
                okType={'dashed'}
            >
                <Form
                    form={commonEditForm}
                    layout={'vertical'}
                >
                    <Form.Item
                        label={'Ключ'}
                        name={'key'}
                        disabled={true}
                    >
                        <Input disabled/>
                    </Form.Item>
                    <Tag className={'mb-5'}>
                        {prDesc[selectedForEdit?.key] || 'Описание отсутствует'}
                    </Tag>

                    <Form.Item
                        label={'Значение'}
                        name={'value'}
                        rules={[{required: true, message: 'Введите значение'}]}
                    >
                        {
                            selectedForEdit?.type === 'BOOLEAN' ?
                                <Radio.Group
                                    optionType="button"
                                    buttonStyle="default"
                                >
                                    <Radio value={'true'}
                                           style={{color: 'green'}}
                                    >True</Radio>
                                    <Radio
                                        style={{color: 'red'}}
                                        value={'false'}>False</Radio>
                                </Radio.Group>
                                :
                                selectedForEdit?.type === 'NUMBER' ?
                                    <InputNumber className={'w-full'}/>
                                    :
                                    <Input/>
                        }
                    </Form.Item>
                </Form>


            </Modal>


            <div className={'max-w-7xl mx-auto'}>
                {/*<div className={'flex flex-col gap-4'}>*/}
                {/*    <Card title={''}>*/}
                {/*    </Card>*/}
                {/*</div>*/}

                <Table
                    dataSource={properties}
                    columns={[
                        {
                            title: 'Ключ',
                            dataIndex: 'key',
                            key: 'key',
                        },
                        {
                            title: 'Описание',
                            dataIndex: 'key',
                            key: 'description',
                            render: (key) => {
                                return prDesc[key] || 'Описание отсутствует'
                            }
                        },
                        {
                            title: 'Тип',
                            dataIndex: 'type',
                            key: 'type',
                            render: (key) => {
                                return <Tag>{prType[key]}</Tag>
                            }
                        },
                        {
                            title: 'Значение',
                            dataIndex: 'value',
                            key: 'value',
                        },
                        {
                            title: 'Действия',
                            dataIndex: 'key',
                            key: 'actions',
                            render: (key) => {
                                return <Button
                                    onClick={() => {
                                        const property = properties.find(p => p.key === key);
                                        setSelectedForEdit(property);
                                        if (property?.customHandler) {
                                            openCustomEditModal(property)
                                            return;
                                        }

                                        commonEditForm.setFieldsValue(property);
                                        setCommonModal(true);
                                    }}
                                >Изменить</Button>
                            }
                        }
                    ]}
                />
            </div>
        </PageTemplate>
    );
};

export default SystemProperties;