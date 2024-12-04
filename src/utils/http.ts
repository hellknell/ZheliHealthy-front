/**
 * Created by rubin on 2020/6/4.
 */
'use strict'
import axios from 'axios'
import {ElMessage} from "element-plus";
import {getCurrentInstance} from 'vue'
import router from "../router";

let app = getCurrentInstance()
// let baseUrl = app?.appContext.config.globalProperties.$baseUrl;
let baseUrl ="http://139.9.192.29:7900/api"
// let minioUrl = 'localhost:9000/his'
const http = axios.create({
    baseURL: baseUrl,
    timeout: 1000 * 60,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
})
http.interceptors.request.use(config => {
    if (config.data) {
        config.data = JSON.stringify(config.data)
    }
    let token = localStorage.getItem("token") || null
    if (token) {
        config.headers.token = token
    }
    return config
}, error => {
    ElMessage.error('请求失败')
    return
})
http.interceptors.response.use(response => {
    let res = response.data

    if (res.code !== 200) {

        return Promise.reject(res)
    }
    return res;
}, error => {
    if (error.status === 401) {
        localStorage.removeItem("token")
        ElMessage.error({
            message: 'error.response.data.error',
            type: 'error'
        })
        router.push({
            name: 'MisLogin'
        })
    }
    let err = error.response.data
    ElMessage.error({
        message: err.error,
        type: 'error'
    })
})
export default http
