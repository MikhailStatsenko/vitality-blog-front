import {makeAutoObservable} from "mobx";
import PostStore from "./modules/PostStore";
import UserStore from "./modules/UserStore";
import CommentStore from "./modules/CommentStore";
import {message, notification} from "antd";
import $api from "../http";
import SystemStore from "./modules/SystemStore";
import CategoryStore from "./modules/CategoryStore";

export default class AppStore {

    // courses = new CourseStore(this);
    // topics = new TopicStore(this);
    // postTypes = new PostTypeStore(this);
    posts = new PostStore(this);
    users = new UserStore(this);
    comments = new CommentStore(this);
    // subjects = new SubjectStore(this);
    system = new SystemStore(this);
    categories = new CategoryStore(this);
    userState = null;
    isAuthState = false;
    isSuperAdminState = null;

    get isAuth() {
        return this.isAuthState;
    }

    set isAuth(value) {
        this.isAuthState = value;
    }

    get user() {
        return this.userState;
    }

    set user(value) {
        this.userState = value;
    }

    get isSuperAdmin() {
        return this.isSuperAdminState;
    }

    set isSuperAdmin(value) {
        this.isSuperAdminState = value;
    }

    constructor() {
        makeAutoObservable(this, {
                courses: false,
                topics: false,
                postTypes: false,
                posts: false,
                users: false,
                categories: false,
                comments: false,
                subjects: false,
                system: false
            },
            {
                deep: true
            });

        // Проверка авторизации
        this.checkAuth();
    }

    checkAuth = () => {
        const token = localStorage.getItem('token');
        if (token) {
            this.loadUser(token);
        }
    }

    loadUser = (token) => {
        const {id, email, role} = JSON.parse(atob(token.split('.')[1]));
        const username = JSON.parse(atob(token.split('.')[1])).sub;
        this.user = {id, username, email, role};
        this.isAuth = true;

        this.checkSuperAdmin();
    }

    checkSuperAdmin = async () => {
        if (this.user.role === 'ROLE_ADMIN') {
            try {
                const response = await $api.get('/users/is-superuser');
                this.isSuperAdmin = response.data;
            } catch (e) {
                this.isSuperAdmin = false;
            }
        } else {
            this.isSuperAdmin = false;
        }
    }

    logout = () => {
        console.log('logout')
        localStorage.removeItem('token');
        this.user = null;
        this.isAuth = false;
    }

    httpError = (e) => {
        // switch-case by http code
        const msg = 'Ошибка сервера';
        if (e.response) {
            switch (e.response?.status) {
                case 400 || 401:
                    if (e.response.data?.title === 'Constraint Violation') {
                        notification.error({
                            message: 'Ошибка валидации данных',
                            description: e.response.data?.violations?.map(v => <p>{v.message}</p>),
                        }, 10);
                    } else {
                        notification.error({
                            message: e.response.data?.title,
                            description: e.response.data?.detail,
                        }, 10);
                    }
                    break;
                case 403:
                    message.error('Недостаточно прав');
                    break;
                case 404:
                    message.error('Не найдено');
                    break;
                default:
                    notification.error({
                        message: e.response.data.title,
                        description: e.response.data.detail,
                    }, 10);
            }
        } else {
            message.error(msg);
        }
    }

    isAdmin(): boolean {
        return this.user?.role === 'ROLE_ADMIN';
    }

    isModerator(): boolean {
        return this.user?.role === 'ROLE_MODERATOR' || this.isAdmin();
    }
}