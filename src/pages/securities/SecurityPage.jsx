// import React, {useContext, useEffect, useState} from 'react';
// import {Context} from "../../index";
// import {useNavigate, useParams} from "react-router-dom";
// import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
// import {Form, Modal} from "antd";
// import {DeleteOutlined} from "@ant-design/icons";
//
//
// const SecurityPage = () => {
//     const {securityId} = useParams();
//     const {store} = useContext(Context);
//     const [security, setSecurity] = useState(null);
//     const [comments, setComments] = useState([]);
//     const [totalComments, setTotalComments] = useState(0);
//     const [page, setPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     const [images, setImages] = useState([]);
//     const [openModal, setOpenModal] = useState(false);
//     const [updteTrigger, setUpdateTrigger] = useState(false);
//     const [modal, contextHolder] = Modal.useModal();
//     const [deletePostModal, contextHolderDeletePostModal] = Modal.useModal();
//
//
//     const [form] = Form.useForm();
//     const navigate = useNavigate();
//
//
//     useEffect(() => {
//         const fetchData = async () => {
//             const response = await store.security.historyData(securityId);
//             setSecurity(response);
//             console.log(response)
//         };
//         fetchData();
//     }, [store, setSecurity, securityId, setImages]);
//
//     // useEffect(() => {
//     //     const fetchData = async () => {
//     //         const response = await store.comments.findByFilter(postId, page - 1, pageSize);
//     //         setComments(response?.content?.sort((a, b) => b?.createdAt - a?.createdAt));
//     //         setTotalComments(response?.totalSize);
//     //     };
//     //     fetchData();
//     // }, [store, setComments, postId, page, pageSize, setTotalComments, updteTrigger]);
//
//     const confirmDelete = (index) => {
//         modal.confirm({
//             title: 'Вы уверены, что хотите удалить комментарий?',
//             icon: <DeleteOutlined/>,
//             content: 'Это действие необратимо',
//             okText: 'Да',
//             okType: 'danger',
//             cancelText: 'Нет',
//             onOk: async () => {
//                 await store.comments.delete(comments[index]?.id);
//                 setUpdateTrigger(!updteTrigger);
//             },
//             onCancel() {
//             },
//         });
//     };
//
//     // const confirmPostDelete = () => {
//     //     deletePostModal.confirm({
//     //         title: 'Вы уверены, что хотите удалить пост?',
//     //         icon: <DeleteOutlined/>,
//     //         content: 'Это действие необратимо',
//     //         okText: 'Да',
//     //         okType: 'danger',
//     //         cancelText: 'Нет',
//     //         onOk: async () => {
//     //             if (await store.posts.delete(postId)) {
//     //                 navigate('/posts');
//     //             }
//     //         },
//     //     })
//     // }
//
//     const colors = [
//         'magenta',
//         'red',
//         'volcano',
//         'orange',
//         'gold',
//         'lime',
//         'green',
//         'cyan',
//         'blue',
//         'geekblue',
//         'purple'
//     ];
//
//     return (
//         <PageTemplate>
//
//         </PageTemplate>
//     );
// };
//
// export default SecurityPage;

// import React, { useContext, useEffect, useState } from 'react';
// import { Context } from '../../index';
// import { useParams } from 'react-router-dom';
// import PageTemplate from '../../components/template/PageTemplate/PageTemplate';
// import SecurityBarChart from './SecurityBarChart'; // Путь к вашему компоненту с графиком
//
// const SecurityPage = () => {
//     const { securityId } = useParams();
//     const { store } = useContext(Context);
//     const [securityData, setSecurityData] = useState(null);
//
//     useEffect(() => {
//         const fetchData = async () => {
//             const response = await store.security.historyData(securityId);
//             setSecurityData(response?.data); // Предполагая, что данные хранятся в свойстве 'data' ответа
//         };
//         fetchData();
//     }, [store, securityId]);
//
//     return (
//         <PageTemplate>
//             {securityData && <SecurityBarChart data={securityData} />}
//         </PageTemplate>
//     );
// };
//
// export default SecurityPage;


import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import { useParams } from 'react-router-dom';
import PageTemplate from '../../components/template/PageTemplate/PageTemplate';
import SecurityCandlestickChart from './SecurityCandlestickChart';

const SecurityPage = () => {
    const { securityId } = useParams();
    const { store } = useContext(Context);
    const [securityData, setSecurityData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await store.security.historyData(securityId);
            setSecurityData(response); // Предполагая, что данные хранятся в свойстве 'data' ответа
        };
        fetchData();
    }, [store, securityId]);

    return (
        <PageTemplate>
            {securityData && <SecurityCandlestickChart data={securityData} />}
        </PageTemplate>
    );
};

export default SecurityPage;
