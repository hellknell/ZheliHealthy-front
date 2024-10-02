import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";

const history = createWebHistory();
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: "Front",
        component: () => import("../views/front/main.vue"),
        redirect: "/index",
        children: [
            {
                path: "index",
                name: "FrontIndex",
                component: () => import("../views/front/index.vue")
            }
        ]
    },
    {
        path: '/mis',
        name: "Mis",
        component: () => import("../views/mis/main.vue")
    },
    {
        path: '/mis/login',
        name: "MisLogin",
        component: () => import("../views/mis/login.vue")
    },
    {
        path: '/404',
        name: "/404",
        component: () => import("../views/404.vue")
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    }
]

const router = createRouter({
    history,
    routes
})
// router.beforeEach((from, to, next) => {
//         let permissions = localStorage.getItem("permissions")
//         let token = localStorage.getItem("token")
//         let fullPath = to.fullPath
//
//         if (fullPath.startsWith("/front/goods_snapshot") || fullPath.startsWith("/front/customer")) {
//             //前端用户不需要鉴权
//             if (token === '' || token === null) {
//                 next({name: 'FrontIndex'})
//             } else {
//                 next()
//             }
//         } else if (fullPath.startsWith("/mis/") || fullPath != ("/mis/login")) {
//             if (permissions == '' || permissions == null || token === '' || token === null) {
//                 next({name: 'MisLogin'})
//             } else {
//                 next()
//             }
//         } else {
//             next()
//         }
//     }
// )
export default router;