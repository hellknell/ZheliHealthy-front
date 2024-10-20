import {reactive, ref} from 'vue'
import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', () => {
    const username = ref('')
    const avatar = ref([]);
    const updatePasswordVisible = ref(false)
    const User = reactive({
        name: null,
        sex: null,
        status: null,
        role: undefined,
        deptId: null,
        deptList: [],
        roleList: []
    })

    const password = ref()
    const newPassword = ref()
    const confirmPass = ref()
    return {
        username,
        avatar,
        updatePasswordVisible,
        User,
        newPassword,
        password,
        confirmPass
    }
})