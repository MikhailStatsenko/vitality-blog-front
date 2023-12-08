import React, {useCallback, useContext, useEffect, useState} from 'react';
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {Link, useSearchParams} from "react-router-dom";
import {Button, Card, Divider, Form, Pagination} from "antd";
import {Context} from "../../index";
import PostCard from "../../components/post/PostCard";

const NewsPage = () => {

    const {store} = useContext(Context)
    const [searchParams, setSearchParams] = useSearchParams();

    const [firstCheckDone, setFirstCheckDone] = useState(false)
    const [firstFetchDone, setFirstFetchDone] = useState(false)


    const [data, setData] = useState();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const updateData = useCallback(async () => {
        if (!firstCheckDone) return;
        console.log(
            {
                page: page - 1,
                size: pageSize,
            }
        )
        setData(await store.posts.getPostsByFilter(
            {
                page: page - 1,
                size: pageSize,
                isNews: true
            }
        ));
        setFirstFetchDone(true);
    }, [firstCheckDone, store.posts, page, pageSize, setFirstFetchDone, setData]);


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
    }, [updateData, page]);


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
        <PageTemplate title={'Новости и аналитика'}>
            {
                firstCheckDone &&
                <div className={'max-w-4xl mx-auto'}>
                    <Form
                        layout="vertical"
                    >

                        {
                            data &&
                            <Card className={'mt-2'} size={"small"}>
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
                                    {store.isModerator() &&
                                        <Link to={'/posts/create'}>
                                            <Button type="dashed">Создать пост</Button>
                                        </Link>
                                    }
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
                </div>
            }
        </PageTemplate>
    );
};

export default NewsPage;