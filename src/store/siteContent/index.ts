import {ref} from 'vue'
import {defineStore} from 'pinia'
import {TabPaneName} from "element-plus";
import router from "../../router";

export const useSiteContentStore = defineStore('siteContent', () => {

    const documentClientHeight = ref(0)
    const siteContentViewHeight = ref({})
    const mainTabs = ref([])
    const height = ref(null)
    const mainTabActiveName = ref('')
    const menuActiveName = ref('')


    function routeHandle(route) {
        resetDocumentClientHeight();
        loadSiteContentClientHeight(route)
        if (route.meta.isTab) {
            let tab = mainTabs.value.filter(item => item.name == route.name)[0]
            if (tab == null) {
                tab = {
                    title: route.meta.title,
                    name: route.name
                }
                mainTabs.value.push(tab)
            }
            menuActiveName.value = tab.name
            mainTabActiveName.value = tab.name
        } else {
            mainTabs.value = []
            mainTabActiveName.value = ''
            menuActiveName.value = 'Home'
        }
    }

    function resetDocumentClientHeight() {
        documentClientHeight.value = document.documentElement.clientHeight;
    }

    function loadSiteContentClientHeight(route) {
        let high = documentClientHeight.value - 50 - 30 - 30 - 40;
        if (route.meta.isTab) {
            high -= 40;
        }

        height.value = high
        siteContentViewHeight.value = {minHeight: height.value + 'px'}
        console.log(siteContentViewHeight.value)
    }

    function removeTab(name: TabPaneName) {
        mainTabs.value = mainTabs.value.filter(item => item.name != name)
        if (mainTabs.value.length >= 1) {
            var tab = mainTabs.value[mainTabs.value.length - 1];
            menuActiveName.value = tab.name
            router.push({
                name: tab.name
            })
        } else {
            menuActiveName.value = ''
            router.push({name: 'MisHome'})
        }
    }

    return {
        documentClientHeight,
        siteContentViewHeight,
        mainTabs,
        height,
        mainTabActiveName,
        menuActiveName,
        routeHandle,
        resetDocumentClientHeight,
        loadSiteContentClientHeight,
        removeTab
    }
})