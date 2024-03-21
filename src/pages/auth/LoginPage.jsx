import React, {useContext, useEffect} from 'react';
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {Context} from "../../index";
import {Button, Card, Form, Input} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

const LoginPage = () => {
    const {store} = useContext(Context);

    const [form] = Form.useForm();

    const navigate = useNavigate();

    useEffect(() => {
        if (store.isAuth) {
            navigate('/');
        }
    }, [navigate, store.isAuth]);

    return (
        <PageTemplate>
            <Card className={'max-w-lg mx-auto mt-48'} title={'Вход в аккаунт'}
                  extra={<Link to={'/register'} className={'text-gray-400'}>Регистрация</Link>}>
                <Form
                    form={form}
                    name="login"
                    onFinish={store.users.login}
                    scrollToFirstError
                    autoComplete={'off'}
                    layout="vertical"
                >

                    <Form.Item
                        name="username"
                        label="Имя пользователя"
                        rules={[
                            {
                                required: true,
                                message: 'Введите имя пользователя',
                                whitespace: true,
                            },
                            {
                                min: 5,
                                message: 'Минимальная длина 4 символа'
                            },
                            {
                                max: 50,
                                message: 'Максимальная длина 50 символов'
                            }
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Пароль"
                        rules={[
                            {
                                required: true,
                                message: 'Введите пароль',
                            },
                            {
                                min: 8,
                                message: 'Минимальная длина 8 символов'
                            },
                            {
                                max: 255,
                                message: 'Максимальная длина 255 символов'
                            }
                        ]}
                        hasFeedback
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item>
                        <Button className={'w-full'}
                                loading={store.users.isLoading}
                                htmlType="submit"
                        >
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </PageTemplate>
    );
};

export default observer(LoginPage);