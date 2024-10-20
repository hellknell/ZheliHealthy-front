import {createApp} from 'vue'
import App from './App.vue'
import 'virtual:svg-icons-register';
import {createPinia} from 'pinia'
import router from "./router"
import "element-plus/dist/index.css"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

let baseUrl = "https://localhost:7900/api"
app.config.globalProperties.$baseUrl = baseUrl;
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
app.use(router).use(createPinia()).use(ElementPlus).mount('#app')
