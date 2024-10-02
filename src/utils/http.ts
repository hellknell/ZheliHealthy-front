/**
 * Created by rubin on 2020/6/4.
 */
'use strict'
import axios from 'axios'
import {ElMessage} from "element-plus";

let baseUrl = 'localhost:7700/his-api'
let minioUrl = 'localhost:9000/his'
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
        config.headers['token'] = token
    }
    return config
}, error => {
    ElMessage.error('请求失败')
    return
})
http.interceptors.response.use(response => {
    let res = response.data
    if (res.code === 401) {
        ElMessage.error({
            message: res.msg,
            duration: 1500
        })
    }
    if (res.code !== 200) {
        return Promise.reject(res)
    }
    return res;
}, error => {
    ElMessage.error('请求失败')
    return
})
export default http
