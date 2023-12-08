import {makeAutoObservable} from "mobx";
import type AppStore from "../AppStore";
import $api from "../../http";

export default class SystemStore {
    rootStore: AppStore;

    constructor(rootStore: AppStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    getProperties = async () => {
        try {
            const response = await $api.get('/config');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }
    updateProperty = async (key, value) => {
        try {
            const json = JSON.stringify({
                key: key,
                value: value
            });
            const response = await $api.put('/config', json);
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }

    async updateInterval(jobName, data) {
        try {
            const response = await $api.put(`/config/interval/${jobName}`, data);
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }
}