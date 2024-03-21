import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {Context} from "../../index";
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {Card, Divider, Badge, Tag, Avatar} from "antd";
import TextArea from "antd/es/input/TextArea";
import DateTimeService from "../../service/DateTimeService";

const Profile = () => {
    const {username} = useParams();
    const {store} = useContext(Context);
    const [user, setUser] = useState({});
    const [actions, setActions] = useState([]);

    useEffect(() => {
        store.users.getProfileInfo(username).then(data => setUser(data))
        const tmp = [];
        if (store.user?.username === username) {
            tmp.push(
                <Link to={`/users/settings`}>
                    Настройки
                </Link>
            )
        } else {
            tmp.push(
                <Link to={`/users/${user?.id}/message`}>
                    Написать сообщение
                </Link>
            )
        }

        if (store.isModerator()) {
            tmp.push(
                <Link to={`/users?id=${user?.id}`}>
                    Показать в админке
                </Link>
            )
        }
        setActions(tmp);

    }, [store, store.users, user?.id, username]);

    const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];


    return (
        <PageTemplate title={`Профиль ${user?.username}`}>
            <div className={'max-w-4xl mx-auto'}>
                <Badge.Ribbon color={'red'}
                              text={(user?.bannedAt && DateTimeService.convertBackDateToDate(user?.bannedAt) > new Date()) && 'Заблокирован'}>
                    <Card
                        actions={actions}
                    >
                        <div className={'flex flex-row gap-4'}>
                            <div className={'flex flex-col items-center pr-5 border-r border-gray-400'}>
                                <Avatar className={'w-32 h-32 flex justify-center items-center'} style={{backgroundColor: colors[user?.id % colors.length], verticalAlign: 'middle'}} size="large">
                                    {user?.username}
                                </Avatar>
                                {/*<img src={user?.avatar || 'https://via.placeholder.com/150'*/}
                                {/*} alt={user?.username} className={'w-32 h-32 rounded-full'}/>*/}
                                <h1 className={'text-2xl font-bold'}>{user?.username}</h1>
                                <p className={'text-gray-500'}>{user?.realName}</p>
                            </div>
                            <div className={'flex flex-col w-60 pr-5 border-r border-gray-400'}>
                                <TextArea value={user?.about} disabled={true} autoSize={{minRows: 3}}/>
                                <Divider/>
                                {/*     Почта, пол   */}
                                <div className={'flex flex-col'}>
                                    <div
                                        className={'flex flex-row justify-between border-b border-gray-400 mb-1.5 pb-1'}>
                                        <p className={'text-gray-500'}>Почта</p>
                                        <p><a href={`mailto:${user?.email}`}>{user?.email}</a></p>
                                    </div>
                                    <div className={'flex flex-row justify-between'}>
                                        <p className={'text-gray-500'}>Гендер</p>
                                        <p className={'-mr-2'}>
                                            {
                                                user?.gender === 'MALE' ?
                                                    <Tag color={'blue'}>
                                                        Мужчина
                                                    </Tag> : user?.gender === 'FEMALE' ?
                                                        <Tag color={'magenta'}>
                                                            Женщина
                                                        </Tag> : user?.gender === 'OTHER' ?
                                                            <Tag color={'green'}>
                                                                Другое
                                                            </Tag> :
                                                            <Tag color={'gray'}>
                                                                Не указан
                                                            </Tag>
                                            }
                                        </p>
                                    </div>
                                </div>

                            </div>
                            {/*<div className={'flex flex-col w-60 pr-5 border-r border-gray-400'}>*/}
                            {/*    /!*     Почта, пол   *!/*/}
                            {/*    <div className={'flex flex-col'}>*/}
                            {/*        <div className={'flex flex-row justify-between border-b border-gray-400 mb-1.5 pb-1'}>*/}
                            {/*            <p className={'text-gray-500'}>Почта</p>*/}
                            {/*            <p><a href={`mailto:${user?.email}`}>{user?.email}</a></p>*/}
                            {/*        </div>*/}
                            {/*        <div className={'flex flex-row justify-between'}>*/}
                            {/*            <p className={'text-gray-500'}>Гендер</p>*/}
                            {/*            <p className={'-mr-2'}>*/}
                            {/*                {*/}
                            {/*                    user?.gender === 'MALE' ?*/}
                            {/*                        <Tag color={'blue'}>*/}
                            {/*                            Мужчина*/}
                            {/*                        </Tag> : user?.gender === 'FEMALE' ?*/}
                            {/*                            <Tag color={'magenta'}>*/}
                            {/*                                Женщина*/}
                            {/*                            </Tag> : user?.gender === 'OTHER' ?*/}
                            {/*                                <Tag color={'green'}>*/}
                            {/*                                    Другое*/}
                            {/*                                </Tag> :*/}
                            {/*                                <Tag color={'gray'}>*/}
                            {/*                                    Не указан*/}
                            {/*                                </Tag>*/}
                            {/*                }*/}
                            {/*            </p>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}

                            {/*</div>*/}
                        </div>
                    </Card>
                </Badge.Ribbon>
            </div>

        </PageTemplate>
    );
};

export default Profile;