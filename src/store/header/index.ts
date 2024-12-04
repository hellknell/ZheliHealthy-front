import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useHeaderStore = defineStore('header', () => {
    const keyword = ref('')
    const tags = ref([{
        label: '父母体检',
        type: 'success'
    }, {
        label: '入职体检',
        type: 'info'
    }]);


    return {
        keyword,
        tags
    }
})