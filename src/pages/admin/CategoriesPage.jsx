import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import { Context } from "../../index";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {Button, Form, Input, Space, Table, Popconfirm, message, Tag, Col, Row} from "antd";
import {DeleteOutlined, EditOutlined, HeartFilled, HeartOutlined, PlusOutlined} from "@ant-design/icons";

const CategoriesPage = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editableRowKey, setEditableRowKey] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (!store.isAdmin()) {
            navigate('/404');
        }
        fetchData();
    }, [store, navigate]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await store.categories.getAll();
            setCategories(data.sort((a, b) => a.id - b.id));
        } catch (error) {
            message.error("При загрузке категорий возникла ошибка");
        } finally {
            setLoading(false);
        }
    }, [store.categories]);

    const handleEdit = (id) => {
        setEditableRowKey(id);
    };

    const handleCancel = () => {
        setEditableRowKey(null);
    };

    const handleSave = async (id, values) => {
        await store.categories.update(id, values);
        setEditableRowKey(null);
        fetchData();
    };

    const handleCreate = async (values) => {
        try {
            await store.categories.create(values);
            fetchData();
            form.resetFields();
        } catch (error) {
            console.error("Error creating category:", error);
            message.error("Failed to create category");
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: "4em",
        },
        {
            title: "Название",
            dataIndex: "title",
            key: "title",
            width: "50%",
            render: (text, record) => {
                if (record.id === editableRowKey) {
                    return (
                        <Form
                            initialValues={{title: text}}
                            onFinish={(values) => handleSave(record.id, values)}
                        >
                            <div className={'flex justify-between gap-3'}>
                                <Form.Item name="title" className={"w-full m-0"} rules={[{ required: true, message: 'Введите название категории' }]}>
                                    <Input className={"border-0 outline-0"} autoFocus={true}/>
                                </Form.Item>
                                <Button htmlType="submit" size="small" className={"border-0 m-0 mt-1"}>
                                    Сохранить
                                </Button>
                                <Button onClick={() => handleCancel()} size="small" className={"border-0 m-0 mt-1"}>
                                    Отмена
                                </Button>
                            </div>
                        </Form>
                    );
                }
                return text;
            },
        },
        {
            title: "Действия",
            key: "action",
            width: "1em",
            render: (_, record) => (
                <Space size="small">
                    <EditOutlined onClick={() => handleEdit(record.id)} />

                    <Popconfirm title="Удалить категорию?" onConfirm={
                        async () => {
                            await store.categories.delete(record.id);
                            setCategories(categories.filter((category) => category.id !== record.id));
                    }}>
                        <DeleteOutlined
                            className={'text-red-700'}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <PageTemplate title={"Категории"}>
            <Space direction="vertical" style={{width: '100%'}}>
                <div className={'max-w-7xl mx-auto'}>
                    <Form form={form} onFinish={handleCreate} layout="inline" className={"mb-3"}>
                        <Form.Item name="title" rules={[{ required: true, message: 'Введите название категории' }]}>
                            <Input placeholder="Название категории" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} size="small">
                                Создать
                            </Button>
                        </Form.Item>
                    </Form>
                    <Table
                        loading={loading}
                        dataSource={categories}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                    />
                </div>
            </Space>
        </PageTemplate>
    );
};

export default CategoriesPage;
