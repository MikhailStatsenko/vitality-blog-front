import {makeAutoObservable} from "mobx";
import type AppStore from "../AppStore";
import $api from "../../http";
import {message} from "antd";

export default class CommentStore {
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

    create = async (postId, values) => {
        try {
            this.loading = true;
            const json = JSON.stringify({
                postId: postId,
                content: values.content,
                isAnonymous: values.isAnonymous
            });
            const response = await $api.post('/comments', json);
            message.success('Комментарий успешно создан');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }

    findByFilter = async (postId, page, pageSize) => {
        try {
            this.loading = true;
            const json = JSON.stringify({
                postId: Number(postId),
                page: page,
                size: pageSize
            });
            const response = await $api.post(`/comments/post`, json);
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }

    delete = async (id) => {
        try {
            this.loading = true;
            await $api.delete(`/comments/${id}`);
            message.success('Комментарий успешно удален');
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }
}