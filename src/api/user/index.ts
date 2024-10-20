/**
 * Created by rubin on 2020/6/26.
 */

'use strict'
import http from '../../utils/http.ts'

let userService = {
    login: function (data, resolve, reject) {
        http({
            url: '/mis/user/login',
            data: data,
            method: 'post'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    logout: function (resolve, reject) {

        http({
            url: '/mis/user/logout',
            method: 'get'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    updatePass: function (data, resolve, reject) {
        http({
            url: '/mis/user/updatePass',
            data: data,
            method: 'post'
        }).then(res => resolve(res)).catch(err => reject(err))
    },
    getUserList: function (params, resolve, reject) {
        http({
            url: '/mis/user/searchByPage',
            method: 'get',
            params: params
        }).then(res => resolve(res)).catch(err => reject(err))
    }
}
export default userService;
