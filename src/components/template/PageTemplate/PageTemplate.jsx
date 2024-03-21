import React, {useContext, useEffect, useState} from 'react';
import st from "./PageTemplate.module.css"
import {Link} from "react-router-dom";
import {Button, Dropdown} from "antd";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import {ApiOutlined, FolderOpenOutlined, SettingOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";

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

        if (store.isAdmin()) {
            tmp.push({
                icon: <ApiOutlined/>,
                label: <Link to={"/system-properties"}>Системные настройки</Link>
            })
            tmp.push({
                icon: <FolderOpenOutlined />,
                label: <Link to={"/categories"}>Категории</Link>
            },
            {
                type: "divider"
            })
        }


        tmp.push({
            label: <Link to={'/logout'}>Выйти</Link>,
            danger: true,
        })

        setItems(tmp)
    }, [store, setItems])

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

                        <Dropdown
                            placement={"bottomRight"}
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