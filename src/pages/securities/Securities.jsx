import React, {useCallback, useContext, useEffect, useState} from 'react';
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {
    Button,
    Card,
    Divider,
    Form,
    Input,
    Modal,
    Pagination,
    Select,
    Space,
    Statistic,
    Switch,
    Table,
    Tag
} from "antd";
import {Context} from "../../index";
import {ExclamationCircleOutlined, SearchOutlined, StarOutlined} from '@ant-design/icons';

const {Countdown} = Statistic;

const UsersTablePage = () => {

    const {store} = useContext(Context);
    const [searchParams, setSearchParams] = useSearchParams();

    const [firstCheckDone, setFirstCheckDone] = useState(false);
    const [firstFetchDone, setFirstFetchDone] = useState(false);
    const [open, setOpen] = useState(false);

    const [data, setData] = useState();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [selectedRole, setSelectedRole] = useState(null);
    const [isBanned, setIsBanned] = useState(null);

    const [defaultRole, setDefaultRole] = useState(undefined);
    // const [defaultIsBanned, setDefaultIsBanned] = useState(undefined);
    const [selectedForChangeRole, setSelectedForChangeRole] = useState(null);
    // const [selectedForDelete, setSelectedForDelete] = useState(null);

    const [selectedTypeId, setSelectedTypeId] = useState(null);

    const [form] = Form.useForm();
    const [deleteForm] = Form.useForm();
    const handleChangeTypeId = (value) => {
        setSelectedTypeId(value); // Обновляем выбранный typeId при изменении в поле Select
    };

    const [subscribes, setSubscribes] = useState([]);

    const [userIdFilter, setUserIdFilter] = useState(false);

    const [userIdFilter1, setUserIdFilter1] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            const currentUser = await store.users.getCurrent();
            setSubscribes(currentUser.subscribes || []);
            setUserIdFilter1(currentUser.id)
        };

        fetchData();
    }, [store.users]);
    console.log(subscribes)

    const [types, setTypes] = useState([]);

    const fetchData = async () => {
        const currentUser = await store.users.getCurrent();
        setSubscribes(currentUser.subscribes || []);
    };

    useEffect(() => {
        fetchData();
    }, [store.users]);


    const updateTypes = useCallback(async () => {
        const fetchedTopics = await store.securityType.getAll();
        setTypes(fetchedTopics);
    }, [store.securityType, setTypes]);







    useEffect(() => {
        const fetchSecurityTypes = async () => {
            await updateTypes();
        };
        fetchSecurityTypes(); // Загружаем все предметы при монтировании компонента
    }, [updateTypes]);




    const navigate = useNavigate();

    useEffect(() => {
        if (data?.content && data.content.length > 0) {
            const firstUser = data.content[0];
            setDefaultRole(firstUser.role);
        }
    }, [data]);



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
            name: document.getElementById('nameSec').value || undefined,
            shortname: document.getElementById('shortnameSec').value || undefined,
            typeId: selectedTypeId,
            primaryBoardId: document.getElementById('primaryBoardId').value || undefined,
        };
        if (userIdFilter) {
            filters.userId = userIdFilter1; // Здесь добавьте логику для userId в фильтре
        }

        setData(await store.security.getSecuritiesByFilter(filters));
        setFirstFetchDone(true);
    }, [firstCheckDone, page, pageSize, selectedTypeId, userIdFilter, store.security, userIdFilter1]);

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

    return (
        <PageTemplate title={'Список ценных бумаг'}>
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
                            // style={{width: 100}}
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

            {firstCheckDone && <div className={'max-w-7xl mx-auto'}>
                <Form layout="vertical"
                      initialValues={{
                          idFilter: searchParams.get('id') || undefined,
                          usernameFilter: searchParams.get('nameSec') || undefined,
                          emailFilter: searchParams.get('shortnameSec') || undefined,
                          typeId: searchParams.get('typeId') || undefined,
                          primaryBoardId: searchParams.get('primaryBoardId') || undefined,
                      }}
                >

                    <Card>
                        <Space wrap>
                            <Form.Item label="Идентификатор бумаги"
                                       name="idSec"
                            >
                                <Input id="idFilter" placeholder="Введите ID" style={{width: 180}}/>
                            </Form.Item>
                            <Form.Item label="Название бумаги">
                                <Input id="nameSec" placeholder="Введите название" style={{width: 180}}/>
                            </Form.Item>
                            <Form.Item label="Короткое название бумаги">
                                <Input id="shortnameSec" placeholder="Введите короткое название"/>
                            </Form.Item>
                            <Form.Item label="Основное место торгов">
                                <Input id="primaryBoardId" placeholder="Введите место торгов"/>
                            </Form.Item>
                            <Form.Item label="Тип бумаги" name="typeId" style={{ width: 180 }}>
                                <Select onChange={handleChangeTypeId}>
                                    <Select.Option key="null" value={null}>Все</Select.Option>
                                    {types.map((type) => (
                                        <Select.Option key={type.id} value={type.id}>
                                            {type.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={'Избранное'}
                                name="userId"
                                initialValue={false}
                            >
                                <Switch onChange={(checked) => setUserIdFilter(checked)} />
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
                                        defaultPageSize={20}
                            />
                        </div>
                    </Card>}
                </Form>

                <Divider dashed className={'my-2'}/>
                <div className={'scroll-auto'}>

                    <Table
                        dataSource={data?.content}
                        columns={[        {
                            title: 'Идентификатор',
                            dataIndex: 'secId',
                            key: 'secId',
                            render: (secId, record) => (
                                <Link to={`/securities/history/${record.id}`}>
                                    {secId}
                                </Link>
                            )
                        }, {
                            title: "Название", dataIndex: "name", key: "name"
                        }, {
                            title: "Короткое название", dataIndex: "shortname", key: "shortname"
                        }, {
                            title: "Тип бумаги",
                            dataIndex: "type",
                            key: "type",
                            render: (type) => type.title // Получить доступ к свойству title внутри объекта type
                        }, {
                            title: "Место торгов", dataIndex: "primaryBoardId", key: "primaryBoardId"
                        },
                            {
                                title: "Действия",
                                dataIndex: "id",
                                key: "actions",
                                render: (id) => (
                                    <StarOutlined
                                        style={{
                                            color: subscribes.includes(id) ? "yellow" : "gray",
                                            cursor: "pointer",
                                        }}
                                        onClick={async () => {
                                            if (subscribes.includes(id)) {
                                                await store.users.unsubscribe(id);
                                            } else {
                                                await store.users.subscribe(id);
                                            }
                                            fetchData(); // Обновление данных после подписки/отписки
                                        }}
                                    />
                                ),
                            },
                        ]}
                        pagination={false}
                    />

                </div>
            </div>}
        </PageTemplate>);
};
export default UsersTablePage;
