import React, {useCallback, useContext, useEffect, useState} from 'react';
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {useNavigate, useSearchParams} from "react-router-dom";
import {
    Button,
    Card,
    Divider,
    Form,
    Input,
    InputNumber,
    Modal,
    Pagination,
    Radio,
    Select,
    Space,
    Statistic,
    Table,
    Tag,
    Tooltip
} from "antd";
import {Context} from "../../index";
import DateTimeService from "../../service/DateTimeService";
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    LockOutlined,
    SearchOutlined,
    UnlockOutlined,
    UserSwitchOutlined
} from '@ant-design/icons';

const {Countdown} = Statistic;

const UsersTablePage = () => {

    const {store} = useContext(Context);
    const [searchParams, setSearchParams] = useSearchParams();

    const [firstCheckDone, setFirstCheckDone] = useState(false);
    const [firstFetchDone, setFirstFetchDone] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [data, setData] = useState();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [selectedRole, setSelectedRole] = useState(null);
    const [isBanned, setIsBanned] = useState(null);

    const [defaultRole, setDefaultRole] = useState(undefined);
    const [defaultIsBanned, setDefaultIsBanned] = useState(undefined);
    const [selectedForChangeRole, setSelectedForChangeRole] = useState(null);
    const [selectedForDelete, setSelectedForDelete] = useState(null);

    const [form] = Form.useForm();
    const [deleteForm] = Form.useForm();

    const navigate = useNavigate();

    useEffect(() => {
        if (data?.content && data.content.length > 0) {
            const firstUser = data.content[0];
            setDefaultRole(firstUser.role);
        }
    }, [data]);

    const handleChangeRole = (value) => {
        if (value === "ALL") {
            setSelectedRole(null);
        } else {
            setSelectedRole(value);
        }
    };

    const handleChangeBanned = (value) => {
        if (value === "Да") {
            setIsBanned(true)
        } else if (value === "Нет") {
            setIsBanned(false)
        } else {
            setIsBanned(null)
        }
    };

    const handleChangePage = async (value) => {
        setPage(value);
        setSearchParams(searchParams => {
            searchParams.set('page', value);
            return searchParams;
        });
    };

    const handleChangePageSize = async (p, s) => {
        setPageSize(s);
        setPage(p);

        setSearchParams(searchParams => {
            searchParams.set('page', p);
            searchParams.set('size', s);
            return searchParams;
        });
    };


    const updateData = useCallback(async () => {
        if (!firstCheckDone) return;

        const filters = {
            page: page - 1,
            size: pageSize,
            id: document.getElementById('idFilter').value || undefined,
            username: document.getElementById('usernameFilter').value || undefined,
            email: document.getElementById('emailFilter').value || undefined,
            role: selectedRole || undefined,
            isBanned: isBanned ?? undefined,
        };

        setData(await store.users.getUsersByFilter(filters));
        setFirstFetchDone(true);
    }, [firstCheckDone, store.users, page, pageSize, selectedRole, isBanned, setFirstFetchDone, setData]);

    useEffect(() => {
        updateData();
    }, [updateData, page, pageSize, selectedRole, isBanned]);

    useEffect(() => {
        const fetchData = async () => {
            setFirstCheckDone(true);
            updateData();
        }
        if (firstFetchDone) return;
        fetchData();
        console.log('fetchData')
    }, [searchParams, store, setFirstCheckDone, updateData, firstFetchDone]);

    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const handleDaysChange = (value) => {
        if (value >= 0 && value <= 365000) {
            setDays(value);
        }
    };

    const handleHoursChange = (value) => {
        if (value >= 0 && value < 24) {
            setHours(value);
        }
    };

    const handleMinutesChange = (value) => {
        if (value >= 0 && value < 60) {
            setMinutes(value);
        }
    };

    const handleCancel = () => {
        Modal.destroyAll(); // Закрыть все модальные окна
    };

    const banUser = (userId, username) => {

        Modal.confirm({
            // title: 'На какой срок Вы желаете забанить пользователя "' + username + '"?',
            title: <span>На какой срок Вы желаете забанить пользователя <Tag>{username}</Tag>?</span>,
            icon: <ExclamationCircleOutlined/>,
            content: (
                <Form layout="vertical"
                      initialValues={{
                          daysFilter: 1,
                          hoursFilter: 0,
                          minutesFilter: 0,
                      }}
                >
                    <Space wrap>
                        <Form.Item label="Дни" name="daysFilter" rules={[{required: true}]}>
                            <InputNumber min={0} max={365000} value={days} onChange={handleDaysChange}/>
                        </Form.Item>
                        <Form.Item label="Часы" name="hoursFilter" rules={[{required: true}]}>
                            <InputNumber min={0} max={23} value={hours} onChange={handleHoursChange}/>
                        </Form.Item>
                        <Form.Item label="Минуты" name="minutesFilter" rules={[{required: true}]}>
                            <InputNumber min={0} max={59} value={minutes} onChange={handleMinutesChange}/>
                        </Form.Item>
                    </Space>

                </Form>),
            okText: 'Забанить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk() {
                store.users.ban(userId, document.getElementById('daysFilter').value || undefined, document.getElementById('hoursFilter').value || undefined, document.getElementById('minutesFilter').value || undefined).then(async () => {
                    await updateData();
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const unbanUser = (userId, username) => {
        Modal.confirm({
            title: `Вы уверены, что хотите разблокировать пользователя "${username}"?`,
            icon: <ExclamationCircleOutlined/>,
            okText: 'Разбанить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk() {
                store.users.unban(userId).then(async () => {
                    await updateData();
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    useEffect(() => {
        if (!store.isModerator()) {
            navigate('/404')
        }
    }, [store, navigate]);

    return (
        <PageTemplate title={'Список пользователей'}>
            <Modal
                title="Изменение роли пользователя"
                open={open}
                onCancel={() => setOpen(false)}
                okType={'default'}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            store.users.changeRole(selectedForChangeRole.id, values.userRole).then(async () => {
                                await updateData();
                                setOpen(false);
                            });
                        });
                }}
                okText={"Назначить"}
                cancelText={"Отмена"}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal_change_role"
                    initialValues={{
                        userRole: selectedForChangeRole?.role,
                    }}
                >

                    <Form.Item
                        label={'Пользователь'}
                    >
                        <Input disabled={true} value={selectedForChangeRole?.username}/>
                    </Form.Item>

                    <Form.Item label={"Текущая роль"}>
                        {
                            selectedForChangeRole?.role === "ROLE_ADMIN" ? <Tag color="red">Администратор</Tag> :
                                selectedForChangeRole?.role === "ROLE_MODERATOR" ? <Tag color="orange">Модератор</Tag> :
                                    selectedForChangeRole?.role === "ROLE_USER" ?
                                        <Tag color="blue">Пользователь</Tag> : null
                        }
                    </Form.Item>


                    <Form.Item label={"Роль"}
                               name="userRole"
                               rules={[{required: true}]}
                    >
                        <Select
                            options={[
                                {
                                    label: <Tag color="red">Администратор</Tag>,
                                    value: 'ROLE_ADMIN',
                                },
                                {
                                    label: <Tag color="orange">Модератор</Tag>,
                                    value: 'ROLE_MODERATOR',
                                },
                                {
                                    label: <Tag color="blue">Пользователь</Tag>,
                                    value: 'ROLE_USER',
                                }
                            ]}
                        />
                    </Form.Item>

                </Form>
            </Modal>

            <Modal
                title="Удаление пользователя"
                open={openDelete}
                onCancel={() => setOpenDelete(false)}
                okType={'danger'}
                onOk={() => {
                    deleteForm
                        .validateFields()
                        .then(async values => {
                            store.users.delete(values).then(async () => {
                                await updateData();
                                setOpenDelete(false);
                            });
                        });
                }}
                okText={"Удалить"}
                cancelText={"Отмена"}
            >
                <Form
                    form={deleteForm}
                    layout="vertical"
                    name="form_in_modal_delete_user"
                    initialValues={{
                        deletePosts: true,
                        deleteComments: true,
                    }}
                >

                    <Form.Item
                        label={'Пользователь'}
                    >
                        <Input disabled={true} value={selectedForDelete?.username}/>
                    </Form.Item>

                    <Form.Item
                        name={'userId'}
                        hidden={true}
                        initialValue={selectedForDelete?.id}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label={'Удалить посты пользователя'}
                        name={'deletePosts'}
                    >
                        <Radio.Group
                            optionType="button"
                            buttonStyle="default"
                        >
                            <Radio value={true}
                                   style={{color: 'red'}}
                            >Удалить</Radio>
                            <Radio
                                style={{color: 'green'}}
                                value={false}>Оставить</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label={'Удалить комментарии пользователя'}
                        name={'deleteComments'}
                    >
                        <Radio.Group
                            optionType="button"
                            buttonStyle="default"
                        >
                            <Radio value={true}
                                   style={{color: 'red'}}
                            >Удалить</Radio>
                            <Radio
                                style={{color: 'green'}}
                                value={false}>Оставить</Radio>
                        </Radio.Group>
                    </Form.Item>

                </Form>
            </Modal>

            {firstCheckDone && <div className={'max-w-7xl mx-auto'}>
                <Form layout="vertical"
                      initialValues={{
                          idFilter: searchParams.get('id') || undefined,
                          usernameFilter: searchParams.get('username') || undefined,
                          emailFilter: searchParams.get('email') || undefined,
                          roleFilter: searchParams.get('role') || 'ALL',
                          isBannedFilter: searchParams.get('isBanned') || 'ALL',
                      }}
                >
                    <Card>
                        <Space wrap>
                            <Form.Item label="ID"
                                       name="idFilter"
                            >
                                <Input id="idFilter" placeholder="Введите ID" style={{width: 120}}/>
                            </Form.Item>
                            <Form.Item label="Имя пользователя">
                                <Input id="usernameFilter" placeholder="Введите Username" style={{width: 180}}/>
                            </Form.Item>
                            <Form.Item label="Почта">
                                <Input id="emailFilter" placeholder="Введите Email"/>
                            </Form.Item>
                            <Form.Item label={"Роль"}
                                       name="roleFilter"
                            >
                                <Select
                                    style={{width: 180}}
                                    onChange={handleChangeRole}
                                    options={[
                                        {
                                            label: <Tag>Все</Tag>,
                                            value: 'ALL',
                                        },
                                        {
                                            label: <Tag color="red">Администратор</Tag>,
                                            value: 'ROLE_ADMIN',
                                        },
                                        {
                                            label: <Tag color="orange">Модератор</Tag>,
                                            value: 'ROLE_MODERATOR',
                                        },
                                        {
                                            label: <Tag color="blue">Пользователь</Tag>,
                                            value: 'ROLE_USER',
                                        }
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item label={"Забанен?"}
                                       name="isBannedFilter"
                            >
                                <Select
                                    style={{width: 90}}
                                    onChange={handleChangeBanned}
                                    value={defaultIsBanned}
                                    options={[
                                        {
                                            label: <Tag color="red">Да</Tag>,
                                            value: 'Да',
                                        },
                                        {
                                            label: <Tag color="green">Нет</Tag>,
                                            value: 'Нет',
                                        },
                                        {
                                            label: <Tag>Все</Tag>,
                                            value: 'ALL',
                                        }
                                    ]}
                                />
                            </Form.Item>
                            <Button
                                type="primary"
                                icon={<SearchOutlined/>}
                                onClick={updateData}
                            />
                        </Space>
                    </Card>
                    {data && <Card className={'mt-2'} size={"small"}>
                        <div className="flex flex-row justify-between items-center px-2">
                            <Pagination defaultCurrent={1}
                                        showTotal={(total, range) => `${range[0]}-${range[1]} из ${total}`}
                                        total={data?.totalSize}
                                        current={page}
                                        showSizeChanger
                                        onChange={handleChangePage}
                                        onShowSizeChange={handleChangePageSize}
                                        pageSizeOptions={['5', '10', '20', '50', '100']}
                                        defaultPageSize={5}
                            />
                        </div>
                    </Card>}
                </Form>

                <Divider dashed className={'my-2'}/>
                <div className={'scroll-auto'}>

                    <Table
                        dataSource={data?.content}
                        columns={[{
                            title: "ID", dataIndex: "id", key: "id"
                        }, {
                            title: "Имя пользователя", dataIndex: "username", key: "username"
                        }, {
                            title: "Почта", dataIndex: "email", key: "email"
                        },
                            {
                                title: "Забанен",
                                dataIndex: "bannedAt",
                                key: "banned",
                                // Если дата не установлена либо она меньше текущей, то пользователь не забанен
                                // Data хранится в unix timestamp
                                render: (bannedAt) => {
                                    if (bannedAt === null || DateTimeService.convertBackDateToDate(bannedAt) < new Date()) {
                                        return <Tag color="green">Нет</Tag>
                                    } else {
                                        return <Tooltip
                                            title={'до: ' + DateTimeService.convertBackDateToString(bannedAt)}>
                                            <Tag
                                                className={'cursor-pointer'}
                                                color="red">Да</Tag>
                                        </Tooltip>
                                    }
                                }
                            }, {
                                // До конца бана
                                title: "До конца бана",
                                dataIndex: "bannedAt",
                                key: "banEnd",
                                render: (bannedAt) => {
                                    // Провреяем забанен ли, если да, то вычисляем сколько осталось до конца бана
                                    if (bannedAt !== null && DateTimeService.convertBackDateToDate(bannedAt) > new Date()) {
                                        const diff = DateTimeService.convertBackDateToDate(bannedAt) - new Date();
                                        return <Countdown
                                            valueStyle={{fontSize: 14}}
                                            value={(DateTimeService.convertBackDateToDate(bannedAt)) + 10 * 1000}
                                        />

                                    } else {
                                        return null;
                                    }
                                }
                            }, {
                                title: "Роль",
                                dataIndex: "role",
                                key: "role",
                                render: (role) => {
                                    if (role === "ROLE_ADMIN") {
                                        return <Tag color="red">Администратор</Tag>
                                    } else if (role === "ROLE_MODERATOR") {
                                        return <Tag color="orange">Модератор</Tag>
                                    } else if (role === "ROLE_USER") {
                                        return <Tag color="blue">Пользователь</Tag>
                                    }
                                }
                            },
                            {
                                title: "Удалён",
                                dataIndex: "deletedAt",
                                key: "deletedAt",
                                render: (deletedAt) => {
                                    if (deletedAt === null) {
                                        return <Tag color="green">Нет</Tag>
                                    } else {
                                        return <Tooltip
                                            title={'Удалён: ' + DateTimeService.convertBackDateToString(deletedAt)}>
                                            <Tag
                                                className={'cursor-pointer'}
                                                color="red">Да</Tag>
                                        </Tooltip>
                                    }
                                }

                            },
                            {
                                title: "Действия", key: "actions", render: (text, record) => (
                                    <>
                                        {
                                            record?.deletedAt === null ?
                                                <span>
                                                <LockOutlined key="ellipsis"
                                                              onClick={() => banUser(record.id, record.username)}
                                                              style={{marginRight: 8}}/>
                                                    {
                                                        record.bannedAt !== null && DateTimeService.convertBackDateToDate(record.bannedAt) > new Date()
                                                        && (
                                                            <UnlockOutlined
                                                                key="lock"
                                                                onClick={() => unbanUser(record.id, record.username)}
                                                                style={{marginRight: 8}}
                                                            />
                                                        )
                                                    }
                                                    <UserSwitchOutlined
                                                        key="switchRole"
                                                        onClick={() => {
                                                            setSelectedForChangeRole(record);
                                                            setOpen(true);
                                                        }}
                                                        style={{marginRight: 8}}
                                                    />
                                                    <DeleteOutlined
                                                        className={'text-red-700'}
                                                        onClick={() => {
                                                            setSelectedForDelete(record);
                                                            setOpenDelete(true);
                                                        }}
                                                    />

                                </span> : <>
                                                    ...
                                                </>
                                        }
                                    </>)
                            }]}
                        pagination={false}
                    />

                </div>
            </div>}
        </PageTemplate>);
};
export default UsersTablePage;
