'use strict'

import http from "../../utils/http.ts";

let customerService = {
    sendSmsCode: function (params, resolve, reject) {
        http({
            params: params,
            url: "/front/customer/sendSmsCode",
            method: 'get'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    login: function (data, resolve, reject) {
        http({
            data: data,
            url: "/front/customer/login",
            method: 'post'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    logout: function (resolve, reject) {
        http({
            url: "/front/customer/logout",
            method: 'get'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    checkLogin: function (resolve, reject) {
        http({
            url: "/front/customer/checkLogin",
            method: 'get'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    searchSummary: function (resolve, reject) {
        http({
            url: "/front/customer/searchSummary",
            method: 'get'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    update: function (data, resolve, reject) {
        http({
            data: data,
            url: "/front/customer/update",
            method: 'post'
        }).then(res => resolve(res)).catch(err => reject(err))
    }
}
export default customerService;


