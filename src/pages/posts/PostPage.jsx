import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {Link, useNavigate, useParams} from "react-router-dom";
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {Badge, Button, Card, Checkbox, Divider, Form, Image, Modal, Pagination, QRCode, Tag, Tree} from "antd";
import DateTimeService from "../../service/DateTimeService";
import TextArea from "antd/es/input/TextArea";
import SizeService from "../../service/SizeService";
import {DeleteOutlined, EditOutlined, HeartFilled, HeartOutlined} from "@ant-design/icons";


const PostPage = () => {
    const {postId} = useParams();
    const {store} = useContext(Context);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [images, setImages] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [updteTrigger, setUpdateTrigger] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [deletePostModal, contextHolderDeletePostModal] = Modal.useModal();
    const [isLiked, setIsLiked] = useState(false);
    const [iconColor, setIconColor] = useState("white");


    const [form] = Form.useForm();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            const response = await store.posts.getById(postId);
            setPost(response);
            setImages(response?.attachments.filter(
                file => file?.extension.toLowerCase() === 'png' ||
                    file?.extension.toLowerCase() === 'jpg' ||
                    file?.extension.toLowerCase() === 'jpeg' ||
                    file?.extension.toLowerCase() === 'gif' ||
                    file?.extension.toLowerCase() === 'bmp' ||
                    file?.extension.toLowerCase() === 'svg' ||
                    file?.extension.toLowerCase() === 'webp'
            ));
        };
        fetchData();
    }, [store, setPost, postId, setImages]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await store.comments.findByFilter(postId, page - 1, pageSize);
            setComments(response?.content?.sort((a, b) => b?.createdAt - a?.createdAt));
            setTotalComments(response?.totalSize);
        };
        fetchData();
    }, [store, setComments, postId, page, pageSize, setTotalComments, updteTrigger]);

    const handleLikeToggle = async (event) => {
        setIsLiked(!isLiked);
        setIconColor(isLiked ? "white" : "#ff4d4f" );

        const postId = post.id;
        if (!isLiked) {
            await store.posts.like(postId);
        } else {
            await  store.posts.unlike(postId);
        }
        event.stopPropagation();
    }

    const confirmDelete = (index) => {
        modal.confirm({
            title: 'Вы уверены, что хотите удалить комментарий?',
            icon: <DeleteOutlined/>,
            content: 'Это действие необратимо',
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            onOk: async () => {
                await store.comments.delete(comments[index]?.id);
                setUpdateTrigger(!updteTrigger);
            },
            onCancel() {
            },
        });
    };

    const confirmPostDelete = () => {
        deletePostModal.confirm({
            title: 'Вы уверены, что хотите удалить пост?',
            icon: <DeleteOutlined/>,
            content: 'Это действие необратимо',
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            onOk: async () => {
                if (await store.posts.delete(postId)) {
                    navigate('/');
                }
            },
        })
    }

    const colors = [
        'magenta',
        'red',
        'volcano',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'geekblue',
        'purple'
    ];

    return (
        <PageTemplate
            title={<div>
                {post?.title}
            </div>}>
            <div className={'max-w-4xl mx-auto'}>
                <Card
                    actions={
                        [
                            <div className={'text-gray-400'}>{post?.category?.title}</div>,

                            (post?.author?.id === store.user?.id) &&
                            <Button
                                onClick={() => {
                                    navigate(`/posts/update/${post?.id}`);
                                }}
                                size={"small"}
                                icon={<EditOutlined />}
                            >Изменить</Button>,

                            (store.isAdmin() || post?.author?.id === store.user?.id) &&
                            <Button
                                onClick={() => {
                                    confirmPostDelete();
                                }}
                                danger
                                size={"small"}
                                icon={<DeleteOutlined/>}
                            >Удалить</Button>,

                            <Tag
                                style={{ color: iconColor }}
                                onClick={handleLikeToggle}
                                type={isLiked ? "primary" : "default"}
                                icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                            />
                        ]
                    }
                >
                    <div className={'flex flex-col'}>
                        {post?.content}
                        <div>
                            <Image.PreviewGroup>
                                {images?.map(image =>
                                    (
                                        <Image
                                            width={200}
                                            height={200}
                                            className={'object-cover'}
                                            src={`http://localhost:8080/files/download/${image?.id}`}
                                        />
                                    )
                                )}
                            </Image.PreviewGroup>

                        </div>
                    </div>
                </Card>


                <h2 className={'text-xl font-bold mt-4 mb-2'}>Дополнительная информация</h2>
                <Card>
                    <div className={'flex flex-row gap-2 justify-between'}>
                        {post?.attachments?.length ?
                            <Tree
                                showLine
                                showIcon
                                defaultExpandAll
                                selectable={false}
                                treeData={[
                                    {
                                        title: 'Прикрепленные файлы',
                                        key: '0-0',
                                        children: post?.attachments?.map(file => ({
                                            title: <div className={'flex flex-row gap-1 items-center'}><a
                                                className={'text-blue-600 hover:text-blue-700'}
                                                href={`http://localhost:8080/files/download/${file?.id}`}
                                                target={'_blank'}
                                                rel="noreferrer">{file?.originalName + '.' + file?.extension}</a>
                                                <div
                                                    className={'text-gray-400 text-xs'}>{SizeService.formatBytes(file?.size)}</div>
                                            </div>,
                                            key: file?.id,
                                            isLeaf: true
                                        }))
                                    },
                                ]
                                }
                            /> :
                            <div className={'text-gray-400'}>Файлы не прикреплены</div>
                        }
                        <div className={'flex flex-col gap-2'}>
                            <div>
                                <div className={'text-gray-400'}>Автор</div>
                                <Link to={`/users/${post?.author?.username}`}>
                                    <Tag color={colors[post?.author?.id % colors.length]}
                                    >
                                        {post?.author?.username || 'Аноним'}
                                    </Tag>
                                </Link>
                            </div>
                            <div>
                                {/*TODO: нет эндпоинта для получения лайков на посте*/}
                                <div className={'text-gray-400'}>Количество лайков</div>
                                <Tag className={'text-gray-400'}>{post?.views}</Tag>
                            </div>
                        </div>
                        <div className={'flex flex-col gap-2'}>
                            <div>
                                <div className={'text-gray-400'}>Дата создания</div>
                                <Tag
                                    className={'text-gray-400'}>{DateTimeService.convertBackDateToString(post?.createdAt)}</Tag>
                            </div>
                            <div>
                                <div className={'text-gray-400'}>Дата обновления</div>
                                <Tag
                                    className={'text-gray-400'}>{DateTimeService.convertBackDateToString(post?.updatedAt)}</Tag>
                            </div>
                        </div>
                    </div>
                </Card>

                <h2 className={'text-xl font-bold mt-4 mb-2'}>Комментарии</h2>
                <Divider/>
                <Form
                    form={form}
                    name="comment"
                    layout={'vertical'}
                    initialValues={{remember: true}}
                    onFinish={async (values) => {
                        await store.comments.create(postId, values);
                        form.resetFields();
                        setUpdateTrigger(!updteTrigger);
                        setPage(1);
                    }}
                >
                    <Form.Item
                        className={'mt-4'}
                        label="Комментарий"
                        name="content"
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста, введите комментарий!'
                            },
                            {
                                max: 999,
                                message: 'Комментарий должен содержать не более 999 символов!'
                            }
                        ]}
                    >
                        <TextArea/>
                    </Form.Item>

                    <Form.Item
                        name={'isAnonymous'}
                        valuePropName="checked"
                    >
                        <Checkbox>Анонимный комментарий</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            loading={store.comments.loading}
                            className={'w-full'} type="dashed" htmlType="submit">
                            Отправить
                        </Button>
                    </Form.Item>
                </Form>
                <Divider/>
                <Pagination
                    className={'mb-4'}
                    current={page}
                    pageSize={pageSize}
                    total={totalComments}
                    showSizeChanger
                    showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} комментариев`}
                    onChange={(page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                    }}
                />

                <div className={'flex flex-col gap-2'}>
                    {comments?.map((comment, index) =>
                        <Badge.Ribbon
                            key={comment?.id}
                            text={DateTimeService.convertBackDateToString(comment?.createdAt)}
                            color="geekblue">
                            <Card
                                className={'p-2'}
                                title={<div className={'flex flex-row gap-2 items-center'}>
                                    <Link to={`/users/${comment?.author?.username}`}>
                                        <Tag
                                            color={colors[comment?.author?.id % colors.length]}
                                        ><span
                                            className={'text-base'}>{comment?.author?.username || 'Аноним'}</span></Tag
                                        >
                                    </Link>
                                </div>}
                                actions={[
                                    null,
                                    (store.isModerator() || comment?.author?.id === store.user?.id || post?.author?.id === store.user?.id) &&
                                    <Button
                                        onClick={() => {
                                            confirmDelete(index);
                                        }}
                                        danger
                                        size={"small"}
                                        icon={<DeleteOutlined/>}
                                    >Удалить</Button>
                                ]}
                            >
                                {comment?.content}
                            </Card>
                        </Badge.Ribbon>
                    )}
                </div>
            </div>
            {contextHolder}
            {contextHolderDeletePostModal}
        </PageTemplate>
    );
};

export default PostPage;