'use strict'

import http from "../../utils/http.ts";

let deptService = {
    getAllDepts: function (resolve, reject) {
        http({
            url: "/mis/dept/searchAllDept",
            method: 'get'
        }).then(res => resolve(res)).catch(err => reject(err))

    }
}
export default deptService;


