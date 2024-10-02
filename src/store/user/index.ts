import {ref} from 'vue'
import {defineStore} from 'pinia'
import userService from "../../api/user";
export const useUserStore = defineStore('user', () => {
    const username = ref('')
    const avatar = ref([]);
    const updatePasswordVisible = ref(false)
    function login(){
    userService.login()

    }
    return {
        username,
        avatar,
        updatePasswordVisible
    }
})