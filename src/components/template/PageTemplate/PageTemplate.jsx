import React, {useContext, useEffect, useState} from 'react';
import st from "./PageTemplate.module.css"
import {Link} from "react-router-dom";
import {Button, Dropdown} from "antd";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import {ApiOutlined, SettingOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";

const PageTemplate = ({children, title}) => {
    const {store} = useContext(Context);
    const [items, setItems] = useState([])

    useEffect(() => {
        const tmp = [
            {
                icon: <UserOutlined/>,
                label: <Link to={`/users/${store.user?.username}`}>Мой Профиль</Link>
            },
            {
                icon: <SettingOutlined/>,
                label: <Link to={"/users/settings"}>Настройки</Link>
            }, {
                type: "divider"
            }
        ]


        if (store.isAdmin()) {

        }

        if (store.isModerator()) {
            tmp.push({
                icon: <TeamOutlined/>,
                label: <Link to={"/users"}>Пользователи</Link>
            }, {
                type: "divider"
            })
        }

        console.log(store.isSuperAdmin)
        if (store.isAdmin()) {
            tmp.push({
                icon: <ApiOutlined/>,
                label: <Link to={"/system-properties"}>Системные настройки</Link>
            }, {
                type: "divider"
            })
        }


        tmp.push({
            label: <Link to={'/logout'}>Выйти</Link>,
            danger: true,
        })

        setItems(tmp)
    }, [store, setItems])

    // const items = [
    //     {
    //         label: <Link to={"/profile"}>Профиль</Link>
    //     },
    //     {
    //         label: "Настройки",
    //
    //     },
    //     {
    //         type: "divider"
    //     },
    //
    //     {
    //         label: <span
    //             onClick={() => {
    //                 store.logout()
    //             }}
    //         >Выйти</span>,
    //         danger: true,
    //
    //     }
    // ]
    //
    // if ()

    return (
        <div className={st.pageContainer}>
            {
                store.isAuth &&
                <>
                    <div className={st.goHome}>
                        <Link to={"/"}>
                            <Button type={"dashed"}>
                                На главную
                            </Button>
                        </Link>
                        <Button type={"dashed"} onClick={() => window.history.back()}>
                            Назад
                        </Button>
                    </div>
                    <div className={st.goPosts}>

                        <Link to={"/securities"}>
                            <Button type={"dashed"}>
                                Ценные бумаги
                            </Button>
                        </Link>
                        <Link to={"/news"}>
                            <Button type={"dashed"}>
                                Новости и аналитика
                            </Button>
                        </Link>

                        <Link to={"/posts"}>
                            <Button type={"dashed"}>
                                Talk
                            </Button>
                        </Link>


                        {/*<Button type={"dashed"} danger onClick={store.logout}>*/}
                        {/*    Выйти*/}
                        {/*</Button>*/}
                        <Dropdown
                            placement={"bottomRight"}
                            // trigger={"click"}
                            overlayStyle={{
                                width: "220px",
                                paddingTop: "10px",

                            }}
                            menu={{
                                items
                            }}
                        >
                            <Button type={"default"}>
                                {store.user.username}
                            </Button>
                        </Dropdown>
                    </div>
                </>
            }
            {
                title &&
                <div className={st.header}>
                    {title}
                </div>
            }
            <div className={st.content}>
                {children}
            </div>
        </div>
    );
};

export default observer(PageTemplate);