import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // 如果使用 Vuex 状态管理
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 引入 Element UI 的样式

Vue.config.productionTip = false;

// 全局注册 Element UI
Vue.use(ElementUI);

new Vue({
    router,
    store, // 如果使用 Vuex
    render: h => h(App),
}).$mount('#app');

// 在应用启动时初始化用户状态
// store.dispatch('initAuth').then(() => {
//     new Vue({
//         router,
//         store,
//         render: h => h(App)
//     }).$mount('#app');
// });