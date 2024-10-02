import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useHeaderStore = defineStore('header', () => {
    const keyword = ref('')
    const tags = ref([]);

    function addTags() {
        tags.value.push({
            type: 'info',
            label: '父母体检'
        })
    }

    return {
        keyword,
        tags,
        addTags
    }
})