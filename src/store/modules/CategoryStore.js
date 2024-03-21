import {makeAutoObservable} from "mobx";
import type AppStore from "../AppStore";
import $api from "../../http";
import {message} from "antd";

export default class CategoryStore {
    rootStore: AppStore;

    constructor(rootStore: AppStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    isLoadingState = false;

    get loading() {
        return this.isLoadingState;
    }

    set loading(value) {
        this.isLoadingState = value;
    }

    create = async (values) => {
        this.loading = true;
        try {
            const formData = new FormData();
            formData.append('title', values.title);

            const response = await $api.post('/category', formData);
            message.success('Категория добавлена');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }


    getAll = async () => {
        try {
            this.loading = true;
            const response = await $api.get('/category');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }

    delete = async (id) => {
        try {
            await $api.delete(`/category/${id}`);
            message.success('Категория успешно удалена');
            return true;
        } catch (e) {
            this.rootStore.httpError(e);
        }
        return false;
    }

    update = async (id, values) => {
        this.loading = true;
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            const response = await $api.put(`/category/${id}`, formData);
            message.success('Категория успешно обновлена');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }
}