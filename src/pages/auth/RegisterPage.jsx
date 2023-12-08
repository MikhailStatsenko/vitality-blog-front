import React, {useContext, useEffect} from 'react';
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {Context} from "../../index";
import {Button, Card, Form, Input} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

const RegisterPage = () => {
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
            <Card className={'max-w-xl mx-auto mt-48'} title={'Регистрация'}
                  extra={<Link to={'/login'} className={'text-gray-400'}>Войти</Link>}>
                <Form
                    form={form}
                    name="register"
                    onFinish={store.users.register}
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
                                min: 4,
                                message: 'Минимальная длина 4 символа'
                            },
                            {
                                max: 20,
                                message: 'Максимальная длина 20 символов'
                            },
                            {
                                pattern: /^[a-zA-Z0-9_]+$/,
                                message: 'Имя пользователя может содержать только латинские буквы и цифры'
                            }
                        ]}
                        hasFeedback
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'Неверный формат E-mail',
                            },
                            {
                                required: true,
                                message: 'Введите E-mail',
                            }, {
                                max: 100,
                                message: 'Максимальная длина 100 символов'
                            }
                        ]}
                        hasFeedback
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
                                max: 50,
                                message: 'Максимальная длина 50 символов'
                            }
                        ]}
                        hasFeedback
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Подтвердите пароль"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Подтвердите пароль',
                            },
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Пароли не совпадают'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>


                    <Form.Item>
                        <Button className={'w-full'}
                                loading={store.users.isLoading}
                                htmlType="submit"
                        >
                            Зарегистрироваться
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </PageTemplate>
    );
};

export default observer(RegisterPage);