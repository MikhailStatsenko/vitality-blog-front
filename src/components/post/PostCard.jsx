import React, {useContext, useState} from 'react';
import {Card, Tag} from "antd";
import DateTimeService from "../../service/DateTimeService";
import {Link} from "react-router-dom";

const PostCard = ({post}) => {
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
        <Link to={`/posts/${post.id}`}>
        {/*<div>*/}
            <Card hoverable={true}
                  title={<div className={'text-xl font-bold'}>{post.title}</div>}
                  extra={<div
                      className={'text-gray-500'}>{DateTimeService.convertBackDateToString(post.createdAt)}</div>}
                  actions={
                      [
                          <div className={'text-gray-400'}>{post.category?.title}</div>,
                          <Tag color={colors[post?.author?.id % colors.length]}>{post?.author?.username}</Tag>,
                      ]
                  }
            >
                <span>{post?.content?.length > 100 ? post?.content?.slice(0, 100) + '...' : post?.content}</span>
            </Card>
        </Link>
        // </div>
    );
};


export default PostCard;