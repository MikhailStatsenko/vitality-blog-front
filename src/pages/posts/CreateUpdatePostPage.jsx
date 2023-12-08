import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {useNavigate, useParams} from "react-router-dom";
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {Button, Card, Form, Input, Select, Spin, Switch, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import {observer} from "mobx-react-lite";
import {InboxOutlined} from "@ant-design/icons";

const {Dragger} = Upload;


const CreateUpdatePostPage = ({ isNews = false }) => {
    const {postId} = useParams();
    const {store} = useContext(Context);

    const [form] = Form.useForm();
    const postTitle = Form.useWatch('title', form);

    // const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [postTypes, setPostTypes] = useState([]);
    const [files, setFiles] = useState([]);

    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await store.courses.getAll();
    //         setCourses(response);
    //     };
    //     fetchData();
    // }, [store, setCourses]);


    const subjectsByCourse = (courseId) => {
        const fetchData = async () => {
            const response = await store.topics.getTopicsByCourseId(courseId);
            setSubjects(response);
        };
        fetchData();
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await store.subjects.getAll();
    //         setSubjects(response);
    //     };
    //     if (courses.length) {
    //         fetchData();
    //     } else {
    //         setSubjects([]);
    //     }
    // }, [store, setSubjects, courses]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await store.postTypes.getAll();
    //         setPostTypes(response);
    //     };
    //     fetchData();
    // }, [store, setPostTypes]);

    const handleFileChange = ({fileList}) => {
        setFiles(fileList);
    };

    useEffect(() => {
        if (postId) {
            const fetchData = async () => {
                const response = await store.posts.getById(postId);
                form.setFieldsValue({
                    title: response?.title,
                    content: response?.content,
                    files: [
                        ...response?.attachments?.map(file => ({
                            uid: file?.id,
                            name: file?.originalName + '.' + file?.extension,
                            status: 'done',
                            url: `http://localhost:8080/files/download/${file?.id}`
                        }))
                    ]
                });
                setFiles(response?.attachments?.map(file => ({
                    uid: file?.id,
                    name: file?.originalName + '.' + file?.extension,
                    status: 'done',
                    url: `http://localhost:8080/files/download/${file?.id}`
                })));
            };
            fetchData();
        }
    }, [form, postId, store.posts]);

    // const [post, setPost] = useState(null);
    // const [images, setImages] = useState([]);
    // const [openModal, setOpenModal] = useState(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await store.posts.getById(postId);
    //         setPost(response);
    //         setImages(response?.attachments.filter(
    //             file => file?.extension.toLowerCase() === 'png' ||
    //                 file?.extension.toLowerCase() === 'jpg' ||
    //                 file?.extension.toLowerCase() === 'jpeg' ||
    //                 file?.extension.toLowerCase() === 'gif' ||
    //                 file?.extension.toLowerCase() === 'bmp' ||
    //                 file?.extension.toLowerCase() === 'svg' ||
    //                 file?.extension.toLowerCase() === 'webp'
    //         ));
    //     };
    //     fetchData();
    // }, [store, setPost, postId, setImages]);

    // const colors = [
    //     'magenta',
    //     'red',
    //     'volcano',
    //     'orange',
    //     'gold',
    //     'lime',
    //     'green',
    //     'cyan',
    //     'blue',
    //     'geekblue',
    //     'purple'
    // ];

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
                            attachments: []
                        }}
                        onFinish={async (values) => {
                            const result = await store.posts.create(values, files);
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
                        {/*<Form.Item*/}
                        {/*    label="Тип поста"*/}
                        {/*    name="postTypeId"*/}
                        {/*>*/}
                        {/*    <Select>*/}
                        {/*        {postTypes?.map(postType =>*/}
                        {/*            <Select.Option key={postType.id}*/}
                        {/*                           value={postType.id}>{postType.title}</Select.Option>*/}
                        {/*        )}*/}
                        {/*    </Select>*/}
                        {/*</Form.Item>*/}

                        {/*<Form.Item*/}
                        {/*    label={'Курс'}*/}
                        {/*    name={'courseId'}*/}
                        {/*>*/}
                        {/*    <Select*/}
                        {/*        onChange={subjectsByCourse}*/}
                        {/*        options={*/}
                        {/*            courses?.map(course => ({*/}
                        {/*                label: course.title,*/}
                        {/*                value: course.id*/}
                        {/*            }))*/}
                        {/*        }*/}
                        {/*    />*/}
                        {/*</Form.Item>*/}

                        {/*<Form.Item*/}
                        {/*    label="Тема"*/}
                        {/*    name="topicId"*/}
                        {/*    hasFeedback*/}
                        {/*    // Если выбран курс, обязательно выбрать тему*/}
                        {/*    rules={[*/}
                        {/*        ({getFieldValue}) => ({*/}
                        {/*            validator(_, value) {*/}
                        {/*                if (getFieldValue('courseId') && !value) {*/}
                        {/*                    return Promise.reject('Выберите тему');*/}
                        {/*                }*/}
                        {/*                return Promise.resolve();*/}
                        {/*            },*/}
                        {/*        }),*/}
                        {/*    ]}*/}
                        {/*>*/}
                        {/*    <Select*/}
                        {/*        disabled={!subjects.length && !form.getFieldValue('courseId')}*/}
                        {/*        options={*/}
                        {/*            subjects?.map(t => ({*/}
                        {/*                label: t.subject.title,*/}
                        {/*                value: t.id*/}
                        {/*            }))*/}
                        {/*        }*/}
                        {/*    />*/}
                        {/*</Form.Item>*/}

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
                                // fileList={fileList}
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
                        <Form.Item
                            name="isNews"
                            initialValue={isNews}
                        >
                            {store.isModerator() && <Switch disabled={!store.isModerator()} />}
                        </Form.Item>

                        {/*<Form.Item*/}
                        {/*    label="Тип поста"*/}
                        {/*    name="postType"*/}
                        {/*    rules={[{required: true, message: 'Выберите тип поста'}]}*/}
                        {/*>*/}
                        {/*</Form.Item>*/}
                        {/*<Form.Item*/}
                        {/*    label="Тема"*/}
                        {/*    name="topic"*/}
                        {/*    rules={[{required: true, message: 'Выберите тему'}]}*/}
                        {/*>*/}
                        {/*    <TextArea/>*/}
                        {/*</Form.Item>*/}
                        {/*<Form.Item*/}
                        {/*    label="Прикрепленные файлы"*/}
                        {/*    name="attachments"*/}
                        {/*>*/}
                        {/*    <TextArea/>*/}
                        {/*</Form.Item>*/}
                        <Form.Item>
                            <Button type="dashed" htmlType="submit">
                                {postId ? 'Сохранить' : 'Создать'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Spin>
            {/*<Modal*/}
            {/*    open={openModal}*/}
            {/*    onOk={() => setOpenModal(false)}*/}
            {/*    onCancel={() => setOpenModal(false)}*/}
            {/*    footer={[*/}
            {/*        <Button key="back" onClick={() => setOpenModal(false)}>*/}
            {/*            Закрыть*/}
            {/*        </Button>,*/}
            {/*    ]}*/}
            {/*>*/}
            {/*    <QRCode*/}
            {/*        size={380}*/}
            {/*        iconSize={90}*/}
            {/*        className={'mx-auto'}*/}
            {/*        value={`http://localhost:3000/posts/${post?.id}`}*/}
            {/*        icon="https://acdn.tinkoff.ru/static/pages/files/ba002123-6b93-4af2-855e-3a33b8bc0a08.png"*/}
            {/*    />*/}
            {/*</Modal>*/}
            {/*<div className={'max-w-4xl mx-auto'}>*/}
            {/*    <Card*/}
            {/*        actions={*/}
            {/*            [*/}
            {/*                <div className={'text-gray-400'}>{post?.topic?.course?.title}</div>,*/}
            {/*                <div className={'text-gray-400'}>{post?.topic?.subject?.title}</div>,*/}
            {/*                <div className={'text-gray-400'}>{post?.postType?.title}</div>*/}
            {/*            ]*/}
            {/*        }*/}
            {/*    >*/}
            {/*        <div className={'flex flex-col'}>*/}
            {/*            {post?.content}*/}
            {/*            {images.length && <Divider/>}*/}
            {/*            <div>*/}
            {/*                <Image.PreviewGroup>*/}
            {/*                    {images?.map(image =>*/}
            {/*                        (*/}
            {/*                            <Image*/}
            {/*                                width={200}*/}
            {/*                                height={200}*/}
            {/*                                className={'object-cover'}*/}
            {/*                                src={`http://localhost:8080/files/download/${image?.id}`}*/}
            {/*                            />*/}
            {/*                        )*/}
            {/*                    )}*/}
            {/*                </Image.PreviewGroup>*/}

            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Card>*/}


            {/*    <h2 className={'text-xl font-bold mt-4 mb-2'}>Дополнительная информация</h2>*/}
            {/*    <Card>*/}
            {/*        <div className={'flex flex-row gap-2 justify-between'}>*/}
            {/*            {post?.attachments?.length ?*/}
            {/*                <Tree*/}
            {/*                    showLine*/}
            {/*                    showIcon*/}
            {/*                    defaultExpandAll*/}
            {/*                    selectable={false}*/}
            {/*                    treeData={[*/}
            {/*                        {*/}
            {/*                            title: 'Прикрепленные файлы',*/}
            {/*                            key: '0-0',*/}
            {/*                            children: post?.attachments?.map(file => ({*/}
            {/*                                // title: file?.originalName + '.' + file?.extension,*/}
            {/*                                title: <div className={'flex flex-row gap-1 items-center'}><a*/}
            {/*                                    className={'text-blue-600 hover:text-blue-700'}*/}
            {/*                                    href={`http://localhost:8080/files/download/${file?.id}`}*/}
            {/*                                    target={'_blank'}*/}
            {/*                                    rel="noreferrer">{file?.originalName + '.' + file?.extension}</a>*/}
            {/*                                    <div*/}
            {/*                                        className={'text-gray-400 text-xs'}>{SizeService.formatBytes(file?.size)}</div>*/}
            {/*                                </div>,*/}
            {/*                                key: file?.id,*/}
            {/*                                isLeaf: true*/}
            {/*                            }))*/}
            {/*                        },*/}
            {/*                    ]*/}
            {/*                    }*/}
            {/*                /> :*/}
            {/*                <div className={'text-gray-400'}>Файлы не прикреплены</div>*/}
            {/*            }*/}
            {/*            <div className={'flex flex-col gap-2'}>*/}
            {/*                <div>*/}
            {/*                    <div className={'text-gray-400'}>Автор</div>*/}
            {/*                    <Link to={`/users/${post?.author?.id}`}>*/}
            {/*                        <Tag color={colors[post?.author?.id % colors.length]}*/}
            {/*                        >Дмитрий Луковников</Tag>*/}
            {/*                    </Link>*/}

            {/*                </div>*/}
            {/*                <div>*/}
            {/*                    <div className={'text-gray-400'}>Количество просмотров</div>*/}
            {/*                    <Tag className={'text-gray-400'}>{post?.views}</Tag>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*            <div className={'flex flex-col gap-2'}>*/}
            {/*                <div>*/}
            {/*                    <div className={'text-gray-400'}>Дата создания</div>*/}
            {/*                    <Tag*/}
            {/*                        className={'text-gray-400'}>{DateTimeService.convertBackDateToString(post?.createdAt)}</Tag>*/}
            {/*                </div>*/}
            {/*                <div>*/}
            {/*                    <div className={'text-gray-400'}>Дата обновления</div>*/}
            {/*                    <Tag*/}
            {/*                        className={'text-gray-400'}>{DateTimeService.convertBackDateToString(post?.updatedAt)}</Tag>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Card>*/}

            {/*    <h2 className={'text-xl font-bold mt-4 mb-2'}>Комментарии</h2>*/}
            {/*    <div className={'flex flex-col gap-2'}>*/}
            {/*        {post?.comments?.map(comment =>*/}
            {/*            <Badge.Ribbon text={DateTimeService.convertBackDateToString(comment?.createdAt)}*/}
            {/*                          color="blue">*/}
            {/*                <Card>{comment?.content}</Card>*/}
            {/*            </Badge.Ribbon>*/}
            {/*        )}*/}
            {/*    </div>*/}

            {/*    /!*  Форма отправки комментарии  *!/*/}
            {/*    <div className={'flex flex-col gap-2'}>*/}
            {/*        <h2 className={'text-xl font-bold mt-4 mb-2'}>Добавить комментарий</h2>*/}
            {/*        <Card>*/}
            {/*            <form className={'flex flex-col gap-2'}>*/}
            {/*                <TextArea name="content" id="content"*/}
            {/*                          cols="30" rows="10"/>*/}
            {/*                <Button type="dashed">Отправить</Button>*/}
            {/*            </form>*/}
            {/*        </Card>*/}
            {/*    </div>*/}


            {/*</div>*/}
        </PageTemplate>
    )
        ;
};

export default observer(CreateUpdatePostPage);