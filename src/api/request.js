import axios from 'axios';
import store from '../store'; // 如果需要从 Vuex 获取 token
import Cookies from 'js-cookie'

const TokenKey = 'token'

// 创建 axios 实例
const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL, // 基础 URL，可以从环境变量中读取
    withCredentials: false, // 是否允许跨域请求携带凭证
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
apiClient.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem('token') || ''; // 从 localStorage 中获取 token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // 添加 token 到请求头
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
apiClient.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        return response;
    },
    (error) => {
        // 对响应错误做点什么
        if (error.response.status === 401) {
            // 处理未授权的情况，例如清除 token 并跳转到登录页面
            localStorage.removeItem('token');
            store.dispatch('logout'); // 调用 Vuex 的 logout action
            window.location.href = '/login'; // 跳转到登录页面
        }
        return Promise.reject(error);
    }
);

// 封装常用的请求方法
export default {
    get(endpoint) {
        return apiClient.get(endpoint);
    },
    post(endpoint, data) {
        return apiClient.post(endpoint, data);
    },
    put(endpoint, data) {
        return apiClient.put(endpoint, data);
    },
    delete(endpoint) {
        return apiClient.delete(endpoint);
    },
    setToken(token) {
        return Cookies.set(TokenKey, token)
    },
    getToken() {
        return Cookies.get(TokenKey)
    },
    removeToken() {
        // 移除本地存储残留
        localStorage.removeItem(TokenKey)

        // 移除cookie
        return Cookies.remove(TokenKey)
    }
};