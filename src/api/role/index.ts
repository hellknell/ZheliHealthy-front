'use strict'

import http from "../../utils/http.ts";

let roleService = {
    getAllRoles: function (resolve, reject) {
        http({
            url: "/mis/role/searchAllRole",
            method: 'get'
        }).then(res => resolve(res)).catch(err => reject(err))

    }
}
export default roleService;


