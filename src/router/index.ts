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
            },
            {
                path: "goods_snapshot/:id/:mode",
                name: "GoodsSnapshot",
                component: () => import("../views/front/goods_snapshot/goods_snapshot.vue")
            },
            {
                path: "goods/:id",
                name: "FrontGoods",
                component: () => import("../views/front/goods/goods.vue")
            },
            {
                path: "goods_list",
                name: "FrontGoodsList",
                component: () => import("../views/front/goods_list/goods_list.vue")
            },

            {
                path: "goods/customer",
                name: "FrontCustomer",
                component: () => import("../views/front/customer/customer.vue"),
                children: [
                    {
                        path: "order",
                        name: "FrontOrder",
                        component: () => import("../views/front/customer/order.vue")
                    },
                    {
                        path: "chat",
                        name: "FrontIM",
                        component: () => import("../views/front/customer/aichat.vue")
                    },
                    {
                        path: "mine",
                        name: "FrontMine",
                        component: () => import("../views/front/customer/mine.vue")
                    },
                    {
                        path: "appointment",
                        name: "FrontAppointment",
                        component: () => import("../views/front/customer/appointment.vue")
                    },
                ]

            }
        ]
    },
    {
        path: '/mis',
        name: "Mis",
        component: () => import("../views/mis/main.vue"),
        children: [
            {
                path: "home",
                name: "MisHome",
                component: () => import("../views/mis/main/home.vue"),
                meta: {
                    title: '首页',
                    isTab: false
                }
            },
            {
                path: "rule",
                name: "MisRule",
                component: () => import("../views/mis/main/rule/rule.vue"),
                meta: {
                    title: '促销规则',
                    isTab: true
                }
            },
            {
                path: "user",
                name: "MisUser",
                component: () => import("../views/mis/main/user/user.vue"),
                meta: {
                    title: '用户管理',
                    isTab: true
                }
            },
            {
                path: "order",
                name: "MisOrder",
                component: () => import("../views/mis/main/order/order.vue"),
                meta: {
                    title: '订单管理',
                    isTab: true
                }
            },
            {
                path: "appointment",
                name: "MisAppointment",
                component: () => import("../views/mis/main/appointment/appointment.vue"),
                meta: {
                    title: '预约管理',
                    isTab: true
                }
            },
            {
                path: "goods",
                name: "MisGoods",
                component: () => import("../views/mis/main/Goods/Goods.vue"),
                meta: {
                    title: '体检套餐',
                    isTab: true
                }
            },
            {
                path: "dept",
                name: "MisDept",
                component: () => import("../views/mis/main/dept.vue"),
                meta: {
                    title: '部门管理',
                    isTab: true
                }
            },
            {
                path: "role",
                name: "MisRole",
                component: () => import("../views/mis/main/role.vue"),
                meta: {
                    title: '角色管理',
                    isTab: true
                }
            }
        ]
    },
    {
        path: '/mis/login',
        name: "MisLogin",
        component: () => import("../views/mis/login.vue"),
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
//         } else if (fullPath.startsWith("/mis/") && fullPath != ("/mis/login")) {
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