import React, {useCallback, useContext, useEffect, useState} from 'react';
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {Link, useSearchParams} from "react-router-dom";
import {Button, Card, Divider, Form, Pagination, Select, Switch} from "antd";
import {Context} from "../../index";
import PostCard from "../../components/post/PostCard";

const PostsPage = () => {
    const {store} = useContext(Context)
    const [searchParams, setSearchParams] = useSearchParams();

    const [firstCheckDone, setFirstCheckDone] = useState(false)
    const [firstFetchDone, setFirstFetchDone] = useState(false)

    const [sortOrder, setSortOrder] = useState("asc");
    const [activeCategory, setActiveCategory] = useState(undefined);

    const [categories, setCategories] = useState([]);

    const [data, setData] = useState();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const updateData = useCallback(async () => {
        if (!firstCheckDone) return;

        const postsData = await getPosts();

        await sortPosts(postsData);
        await loadCategories();

        setFirstFetchDone(true);
    }, [firstCheckDone, store.posts, page, pageSize, setFirstFetchDone, setData, sortOrder, setCategories, activeCategory]);

    const getPosts = async () => {
        return await store.posts.getPostsByFilter(
            {
                page: page - 1,
                size: pageSize,
                categoryId: activeCategory
            });
    }

    const sortPosts = async(postsData) => {
        const sortedPosts = sortOrder === "desc" ?
            postsData.content.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            : postsData.content.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setData({ ...postsData, content: sortedPosts });
    }

    const loadCategories = async () => {
        const categories = await store.categories.getAll();
        const formattedCategories = categories.map(item => ({
            label: item.title,
            value: item.id
        }));
        setCategories(formattedCategories);
    }

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

    useEffect(() => {
        updateData();
    }, [updateData, page])

    useEffect(() => {
        const fetchData = async () => {
            setFirstCheckDone(true);
            updateData();
        }
        if (firstFetchDone) return;
        fetchData();
    }, [searchParams, store, setFirstCheckDone, updateData, firstFetchDone]);


    return (
        <PageTemplate title={'Посты'}>
            {
                firstCheckDone &&
                <div className={'max-w-4xl mx-auto'}>
                    <Form
                        layout="vertical"
                    >

                        {
                            data &&
                            <Card className={'mt-2'} size={"small"}>
                                <div className="flex flex-row justify-between items-center gap-5">
                                    <Select
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder="Выберите категорию"
                                        onChange={setActiveCategory}
                                        options={categories}
                                    />
                                    {/*TODO: Сортировка работает неправильно, потому что сервер возвращает данные в неотсортированном виде*/}
                                    <Select defaultValue="asc" onChange={setSortOrder}>
                                        <Select.Option value="asc">Сначала новые</Select.Option>
                                        <Select.Option value="desc">Сначала старые</Select.Option>
                                    </Select>
                                    <Link to={'/posts/create'}>
                                        <Button type="dashed">Создать пост</Button>
                                    </Link>
                                </div>
                            </Card>
                        }
                    </Form>

                    <Divider dashed className={'my-2'}/>
                    <div className={'scroll-auto'}>
                        <div className={'flex flex-col gap-2'}>
                            {
                                data?.content?.map(post => (
                                    <PostCard key={post.id} post={post}/>
                                ))
                            }
                        </div>
                    </div>

                    <Divider dashed className={'my-2'}/>
                    <Form
                        layout="vertical"
                    >
                        {
                            data &&
                            <Card className={'mt-2'} size={"small"}>
                                <div className="flex flex-row justify-center items-center">
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
                            </Card>
                        }
                    </Form>
                </div>
            }
        </PageTemplate>
    );
};

export default PostsPage;