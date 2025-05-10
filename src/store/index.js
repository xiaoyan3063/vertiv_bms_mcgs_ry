import Vue from 'vue';
import Vuex from 'vuex';
// import api from '../api/request'; // 导入封装好的 API 请求模块
// import router from '../router'; // 导入 router 实例
// import { resetRouter } from '@/router'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // token: null, //api.getToken(),
        user: null, // 当前登录用户信息
    },
    mutations: {
        // SET_TOKEN: (state, token) => {
        //     state.token = token
        // },
        SET_USER(state, user) {
            state.user = user;
        },
    },
    actions: {

    },
    getters: {
        isAuthenticated: state => !!state.user,
    },
});