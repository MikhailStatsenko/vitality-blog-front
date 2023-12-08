import React, {useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {Context} from "../../index";
import {Button, Card, Form, Input, Select} from "antd";
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {ArrowLeftOutlined} from "@ant-design/icons";

const Settings = () => {
    const {store} = useContext(Context);
    const [user, setUser] = useState({});

    const [changePasswordForm] = Form.useForm();
    const [changeEmailForm] = Form.useForm();
    const [changeUsernameForm] = Form.useForm();
    const [changeProfileInfoForm] = Form.useForm();

    const [checkDone, setCheckDone] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await store.users.getProfileInfo(store.user?.username).then((response) => {
                setUser(response);
                setCheckDone(true);
            });
        };
        fetchData();
    }, [store.user, store.users, setCheckDone]);

    const updateProfileInfo = async () => {
        await store.users.getProfileInfo(store.user?.username).then((response) => {
            setUser(response);
        });
    }


    if (!checkDone) {
        return <></>
    }

    return (
        <PageTemplate title={'Настройки аккаунта'}>
            <div className={'max-w-6xl mx-auto'}>
                <Link to={`/users/${store.user?.username}`}>
                    <Button
                        icon={<ArrowLeftOutlined/>}
                    >
                        Вернуться к
                        профилю
                    </Button>
                </Link>
                <div className={'grid grid-cols-2 gap-4 mt-4'}>
                    <div className={'flex flex-col gap-y-4'}>
                        <Card title={'Изменить пароль'}>
                            <Form form={changePasswordForm} layout={'vertical'}
                                  onFinish={async values => {
                                      if (await store.users.changePassword(values)) {
                                          changePasswordForm.resetFields();
                                          await updateProfileInfo();
                                      }
                                  }}>
                                <Form.Item label={'Старый пароль'} name={'oldPassword'}
                                           rules={[
                                               {
                                                   required: true,
                                                   message: 'Введите пароль',
                                               },
                                               {
                                                   min: 8,
                                                   message: 'Минимальная длина 8 символов'
                                               },
                                               {
                                                   max: 50,
                                                   message: 'Максимальная длина 50 символов'
                                               }
                                           ]}
                                           hasFeedback
                                >
                                    <Input.Password className={'w-full'}/>
                                </Form.Item>
                                <Form.Item label={'Новый пароль'} name={'newPassword'}
                                           rules={[
                                               {
                                                   required: true,
                                                   message: 'Введите пароль',
                                               },
                                               {
                                                   min: 8,
                                                   message: 'Минимальная длина 8 символов'
                                               },
                                               {
                                                   max: 50,
                                                   message: 'Максимальная длина 50 символов'
                                               }
                                           ]}
                                           hasFeedback
                                >
                                    <Input.Password className={'w-full'}/>
                                </Form.Item>
                                <Form.Item
                                    label={'Повторите новый пароль'} name={'newPasswordRepeat'}
                                    dependencies={['newPassword']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Введите пароль',
                                        }, {
                                            min: 8,
                                            message: 'Минимальная длина 8 символов'
                                        },
                                        {
                                            max: 50,
                                            message: 'Максимальная длина 50 символов'
                                        },
                                        ({getFieldValue}) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Пароли не совпадают'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password className={'w-full'}/>
                                </Form.Item>
                                <Form.Item>
                                    <Button type={'primary'} htmlType={'default'}
                                            className={'w-full'}>Изменить</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                        <Card title={'Изменить никнейм'}>
                            <Form form={changeUsernameForm}
                                  layout={'vertical'}
                                  initialValues={{
                                      username: user?.username
                                  }}

                                  onFinish={async values => {
                                      if (await store.users.changeUsername(values)) {
                                          // changeUsernameForm.resetFields();
                                          // await updateProfileInfo();
                                      }
                                  }}>
                                <Form.Item label={'Новое имя пользователя'}
                                           name={'username'}
                                           rules={[
                                               {
                                                   required: true,
                                                   message: 'Введите имя пользователя',
                                                   whitespace: true,
                                               },
                                               {
                                                   min: 4,
                                                   message: 'Минимальная длина 4 символа'
                                               },
                                               {
                                                   max: 20,
                                                   message: 'Максимальная длина 20 символов'
                                               },
                                               {
                                                   pattern: /^[a-zA-Z0-9]+$/,
                                                   message: 'Имя пользователя может содержать только латинские буквы и цифры'
                                               }
                                           ]}
                                           hasFeedback
                                >
                                    <Input className={'w-full'}/>
                                </Form.Item>
                                <Form.Item>
                                    <Button type={'primary'} htmlType={'default'}
                                            className={'w-full'}>Изменить</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                    <div className={'flex flex-col gap-y-4'}>
                        <Card title={'Изменить почту'}>
                            <Form form={changeEmailForm}
                                  layout={'vertical'}
                                  initialValues={{
                                      email: user?.email
                                  }}
                                  onFinish={async values => {
                                      if (await store.users.changeEmail(values)) {
                                          // changeEmailForm.resetFields();
                                          // await updateProfileInfo();
                                      }
                                  }}>
                                <Form.Item
                                    label={'Новый E-mail'}
                                    name={'email'}
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'Неверный формат E-mail',
                                        },
                                        {
                                            required: true,
                                            message: 'Введите E-mail',
                                        }, {
                                            max: 100,
                                            message: 'Максимальная длина 100 символов'
                                        }
                                    ]}
                                    hasFeedback
                                >
                                    <Input className={'w-full'}/>
                                </Form.Item>
                                <Form.Item>
                                    <Button type={'primary'} htmlType={'default'}
                                            className={'w-full'}>Изменить</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                        <Card title={'Изменить данные профиля'}>
                            <Form form={changeProfileInfoForm}
                                  layout={'vertical'}
                                  initialValues={{
                                      realName: user?.realName,
                                      about: user?.about,
                                      gender: user?.gender,
                                  }}
                                  onFinish={async values => {
                                      if (await store.users.changeInfo(values)) {
                                          // await updateProfileInfo();
                                          // changeProfileInfoForm.resetFields();
                                      }
                                  }}>
                                <Form.Item
                                    label={'Настоящее имя'}
                                    name={'realName'}
                                    rules={[
                                        {
                                            max: 60,
                                            message: 'Максимальная длина 60 символов'
                                        }
                                    ]}
                                    hasFeedback
                                >
                                    <Input className={'w-full'}/>
                                </Form.Item>
                                <Form.Item
                                    label={'О себе'}
                                    name={'about'}
                                    rules={[
                                        {
                                            max: 500,
                                            message: 'Максимальная длина 500 символов'
                                        }
                                    ]}
                                    hasFeedback
                                >
                                    <Input.TextArea className={'w-full'}/>
                                </Form.Item>
                                <Form.Item
                                    label={"Пол"}
                                    name={"gender"}
                                    hasFeedback
                                >
                                    <Select
                                        placeholder="Выберите пол"
                                        allowClear
                                        options={[
                                            {label: 'Не указан', value: null},
                                            {label: 'Мужской', value: 'MALE'},
                                            {label: 'Женский', value: 'FEMLAE'},
                                            {label: 'Другой', value: 'OTHER'}
                                        ]}/>
                                </Form.Item>
                                <Form.Item>
                                    <Button type={'primary'} htmlType={'default'}
                                            className={'w-full'}>Изменить</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </div>
            </div>
        </PageTemplate>
    );
};

export default Settings;