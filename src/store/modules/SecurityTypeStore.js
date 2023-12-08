import {makeAutoObservable} from "mobx";
import type AppStore from "../AppStore";
import $api from "../../http";

export default class SecurityTypeStore {
    rootStore: AppStore;

    isLoading = false;

    constructor(rootStore: AppStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    get isLoadingState() {
        return this.isLoading;
    }

    set isLoadingState(state) {
        this.isLoading = state;
    }

    getAll = async () => {
        try {
            const response = await $api.get('/security-types');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }


    // register = async (values) => {
    //     try {
    //         this.isLoadingState = true;
    //         delete values.confirm;
    //         const response = await $api.post('/auth/sign-up', values);
    //         localStorage.setItem('token', response.data.token);
    //         this.rootStore.loadUser(response.data.token);
    //         message.info('Добро пожаловать, ' + this.rootStore.user.username + "!");
    //     } catch (e) {
    //         this.rootStore.httpError(e);
    //     } finally {
    //         this.isLoadingState = false;
    //     }
    // }

    // login = async (values) => {
    //     try {
    //         this.isLoadingState = true;
    //         const response = await $api.post('/auth/sign-in', values);
    //         localStorage.setItem('token', response.data.token);
    //         this.rootStore.loadUser(response.data.token);
    //
    //         message.info('С возращением, ' + this.rootStore.user.username + "!");
    //     } catch (e) {
    //         this.rootStore.httpError(e);
    //     } finally {
    //         this.isLoadingState = false;
    //     }
    // }


    // getSecuritiesByFilter = async (filter) => {
    //     try {
    //         const json = JSON.stringify(filter);
    //         const response = await $api.post('/securities/filter', json);
    //         return response.data;
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    //
    // ban = async (id, days, hours, minutes) => {
    //     try {
    //         const requestData = {
    //             id: id,
    //             days: days,
    //             hours: hours,
    //             minutes: minutes
    //             // другие поля, если они есть
    //         };
    //
    //         const json = JSON.stringify(requestData);
    //         await $api.put('/users/ban', json);
    //         message.success('Пользователь успешно забанен');
    //     } catch (e) {
    //         this.rootStore.httpError(e);
    //     }
    // }
    //
    //
    // unban = async (id) => {
    //     try {
    //         await $api.put(`/users/unban/${id}`);
    //         message.success('Пользователь успешно разбанен');
    //     } catch (e) {
    //         this.rootStore.httpError(e);
    //     }
    // }

    // changeRole = async (id, role) => {
    //     const requestData = {
    //         id: id,
    //         role: role
    //         // другие поля, если они есть
    //     };
    //
    //     const json = JSON.stringify(requestData);
    //     try {
    //         await $api.put(`/users/change-role`, json);
    //         message.success('Роль успешно изменена');
    //     } catch (e) {
    //         this.rootStore.httpError(e);
    //     }
    // }

    // getProfileInfo = async (username) => {
    //     try {
    //         const response = await $api.get(`/users/profile/${username}`);
    //         return response.data;
    //     } catch (e) {
    //         this.rootStore.httpError(e);
    //     }
    // }

    // changePassword = async (values) => {
    //     try {
    //         const json = JSON.stringify({
    //             oldPassword: values.oldPassword,
    //             newPassword: values.newPassword
    //         });
    //         await $api.post(`/users/change-password`, json);
    //         message.success('Пароль успешно изменен');
    //         return true;
    //     } catch (e) {
    //         this.rootStore.httpError(e);
    //     }
    //     return false;
    // }
    // changeUsername = async (values) => {
    //     try {
    //         const json = JSON.stringify({
    //             username: values.username
    //         });
    //         await $api.post(`/users/change-username`, json);
    //         message.success('Имя пользователя успешно изменено');
    //         return true;
    //     } catch (e) {
    //         this.rootStore.httpError(e);
    //     }
    //     return false;
    // }
    //
    // changeEmail = async (values) => {
    //     try {
    //         const json = JSON.stringify({
    //             email: values.email
    //         });
    //         await $api.post(`/users/change-email`, json);
    //         message.success('Email успешно изменен');
    //         return true;
    //     } catch (e) {
    //         this.rootStore.httpError(e);
    //     }
    //     return false;
    // }
    // changeInfo = async (values) => {
    //     try {
    //         const json = JSON.stringify({
    //             realName: values.realName,
    //             about: values.about,
    //             gender: values.gender
    //         });
    //         await $api.post(`/users/change-info`, json);
    //         message.success('Информация успешно изменена');
    //         return true;
    //     } catch (e) {
    //         this.rootStore.httpError(e);
    //     }
    //     return false;
    // }

    // delete = async (values) => {
    //     try {
    //         const json = JSON.stringify(values);
    //         console.log(json)
    //         await $api.post(`/users/delete`, json);
    //         message.success('Аккаунт успешно удален');
    //         return true;
    //     } catch (e) {
    //         this.rootStore.httpError(e);
    //     }
    //     return false;
    // }
}