/**
 * Created by rubin on 2020/6/26.
 */

'use strict'

import http from '../../utils/http.ts'
let userService = {
    login: function (data, resolve, reject) {
        http({
            url: '/user',
            data: data,
            method: 'post'
        }).then(res => resolve(res)).catch(err => reject(err))
    }
}
export default userService;
