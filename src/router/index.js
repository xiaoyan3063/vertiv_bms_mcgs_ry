import Vue from 'vue';
import Router from 'vue-router';
// import store from '../store';
// import loginView from '@/views/loginView.vue'; 
import handleExcel from '@/views/handleExcel.vue';

Vue.use(Router);

const routes = [{
        path: '/',
        redirect: '/excel', // 默认重定向到登录页面
    },
    {
        path: '/excel',
        name: 'handleExcel',
        component: handleExcel
    },
    // 其他路由配置...
];

// const router = new Router({
//     mode: 'history', // 使用 HTML5 History 模式
//     base: process.env.BASE_URL,
//     routes,
// });

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    base: process.env.BASE_URL,
    routes: routes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}


// // 添加全局前置守卫
// router.beforeEach((to, from, next) => {
//     const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//     const isAuthenticated = store.getters.isAuthenticated;
//     console.log('Navigating to:', to.path);
//     console.log('User is authenticated:', isAuthenticated);

//     if (to.path === '/login') {
//         if (isAuthenticated) {
//             // 如果用户已经登录，则直接跳转到首页
//             next('/home');
//         } else {
//             // 如果用户未登录且试图访问登录页，则放行
//             next();
//         }
//     } else if (requiresAuth && !isAuthenticated) {
//         // 如果需要认证但用户未登录，则重定向到登录页，并记录重定向目标
//         next({
//             path: '/login',
//             query: { redirect: to.fullPath }
//         });
//     } else {
//         // 其他情况直接放行
//         next();
//     }
// });

export default router;