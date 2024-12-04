import {createApp} from 'vue'
import App from './App.vue'
import 'virtual:svg-icons-register';
import {createPinia} from 'pinia'
import router from "./router"
import "element-plus/dist/index.css"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import VueNativeSock from "vue-native-websocket-vue3";

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

let baseUrl = "http://139.9.192.29/:7900/api"
let minioUrl =  "http://139.9.192.29:9000"
app.config.globalProperties.$baseUrl = baseUrl;
app.config.globalProperties.$minioUrl = minioUrl;
app.config.globalProperties.isAuth = (permission: string[]) => {
    let permissions = localStorage.getItem("permissions") || 'ROOT';
    let flag: boolean = false;
    if (permissions) {
        for (let one of permission) {
            if (permissions.includes(one)) {
                flag = true
                break
            }
        }
        return flag;
    } else {
        return false;
    }
}
// 使用VueNativeSock插件，并进行相关配置
app.use(VueNativeSock, "ws://139.9.192.29:7900/api/socket", {
    format: 'json',
    reconnection: true,
})
app.use(router).use(createPinia()).use(ElementPlus).mount('#app')
