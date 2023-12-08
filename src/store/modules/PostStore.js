import {makeAutoObservable} from "mobx";
import type AppStore from "../AppStore";
import $api from "../../http";
import {message} from "antd";

export default class PostStore {
    rootStore: AppStore;

    loading = false;

    constructor(rootStore: AppStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    getPostsByFilter = async (filter) => {
        try {
            // console.log(filter);
            const json = JSON.stringify(filter);
            const response = await $api.post('/posts/filter', json);
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }

    getById = async (id: number) => {
        try {
            const response = await $api.get(`/posts/${id}`);
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }

    create = async (values, files) => {
        this.loading = true;
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('isNews', values.isNews);

            if (values.content) formData.append('content', values.content);
            files.forEach((file) => {
                formData.append('attachments', file.originFileObj);
            });
            const response = await $api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            message.success('Пост успешно создан');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }

    delete = async (postId) => {
        try {
            await $api.delete(`/posts/${postId}`);
            message.success('Пост успешно удален');
            return true;
        } catch (e) {
            this.rootStore.httpError(e);
        }
        return false;
    }
}