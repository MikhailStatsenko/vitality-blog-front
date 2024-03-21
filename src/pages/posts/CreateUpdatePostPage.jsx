import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {useNavigate, useParams} from "react-router-dom";
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {Button, Card, Form, Input, Select, Spin, Switch, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import {observer} from "mobx-react-lite";
import {InboxOutlined} from "@ant-design/icons";
import {API_URL} from "../../http";

const {Dragger} = Upload;


const CreateUpdatePostPage = ({ isNews = false }) => {
    const {postId} = useParams();
    const {store} = useContext(Context);

    const [form] = Form.useForm();
    const postTitle = Form.useWatch('title', form);

    const [categories, setCategories] = useState([]);

    const [files, setFiles] = useState([]);

    const navigate = useNavigate();

    const handleFileChange = ({fileList}) => {
        setFiles(fileList);
    };

    useEffect(() => {
        store.categories.getAll().then(categories => {
                const formattedCategories = categories.map(item => ({
                    label: item.title,
                    value: item.id
                }));
                setCategories(formattedCategories);
            }
        )
    }, [form, store.categories, store.posts])

    useEffect(() => {
        if (postId) {
            const fetchData = async () => {
                const response = await store.posts.getById(postId);
                form.setFieldsValue({
                    title: response?.title,
                    content: response?.content,
                    categoryId: ({
                        label: response.category.title,
                        value: response.category.id
                    }),
                    files: [
                        ...response?.attachments?.map(file => ({
                            uid: file?.id,
                            name: file?.originalName + '.' + file?.extension,
                            status: 'done',
                            url: `${API_URL}/files/download/${file?.id}`
                        }))
                    ]
                });
                setFiles(response?.attachments?.map(file => ({
                    uid: file?.id,
                    name: file?.originalName + '.' + file?.extension,
                    status: 'done',
                    url: `${API_URL}/files/download/${file?.id}`
                })));
            };
            fetchData();
        }
    }, [form, postId, store.posts]);

    return (
        <PageTemplate
            title={postId ? 'Редактирование поста' : 'Создание поста'}>
            <Spin spinning={store.posts.loading}>
                <Card className={'max-w-4xl mx-auto'}
                      title={postTitle || 'Начните вводить заголовок'}
                >
                    <Form
                        form={form}
                        layout={'vertical'}
                        initialValues={{
                            title: '',
                            content: '',
                            categoryId: '',
                            attachments: []
                        }}
                        onFinish={async (values) => {
                            let result;
                            if (postId) {
                                result = await store.posts.update(values, files, postId);
                            } else {
                                result = await store.posts.create(values, files);
                            }
                            if (!!result) {
                                form.resetFields();
                                setFiles([]);
                                navigate(`/posts/${result?.id}`);
                            }
                        }}
                    >
                        <Form.Item
                            label="Заголовок"
                            name="title"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Введите заголовок'
                                },
                                {
                                    min: 5,
                                    message: 'Минимальная длина заголовка 5 символов'
                                },
                                {
                                    max: 255,
                                    message: 'Максимальная длина заголовка 255 символов'
                                }
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Содержание"
                            name="content"
                            rules={[
                                {
                                    max: 9999,
                                    message: 'Максимальная длина содержания 9999 символов'
                                }
                            ]}
                            hasFeedback
                        >
                            <TextArea

                                autoSize={{minRows: 5, maxRows: 10}}

                            />
                        </Form.Item>

                        {!postId ? (
                            <Form.Item
                                label="Категория"
                                name="categoryId"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Пожалуйста, выберите категорию',
                                    }
                                ]}
                            >
                                <Select
                                    allowClear
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder="Выберите категорию"
                                    options={categories}
                                />
                            </Form.Item>
                        ) : null}

                        <Form.Item
                            label="Прикрепленные файлы"
                            name="files"
                        >
                            {/* Загрузка файлов вместе с отправкой формы */}
                            <Dragger name="files"
                                // В качестве буфера для файлов используется массив, который необходимо очищать после отправки формы
                                     beforeUpload={file => {
                                         setFiles([...files, file]);
                                         return false;
                                     }}
                                     onChange={handleFileChange}
                                     fileList={files}
                                     onRemove={file => {
                                         setFiles(files.filter(f => f.uid !== file.uid));
                                     }}
                                     multiple={true}
                                     maxCount={10}
                                     accept={'.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.zip,.rar,.7z'}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined/>
                                </p>
                                <p className="ant-upload-text">Нажмите или перетащите файлы в эту область</p>
                                <p className="ant-upload-hint">
                                    Поддерживается одиночная или массовая загрузка.
                                </p>
                            </Dragger>
                        </Form.Item>
                        <Form.Item>
                            <Button type="dashed" htmlType="submit">
                                {postId ? 'Сохранить' : 'Создать'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Spin>
        </PageTemplate>
    );
};

export default observer(CreateUpdatePostPage);