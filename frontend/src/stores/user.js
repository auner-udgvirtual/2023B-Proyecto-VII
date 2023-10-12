import { ref, onMounted, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import AuthAPI from '../api/AuthAPI'

export const useUserStore = defineStore('user', () => {

    const router = useRouter()
    const user = ref({})
    const loading = ref(true)

    onMounted(async () => {
        try {
            const { data } = await AuthAPI.auth()
            user.value = data
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    })

    function logout() {
        localStorage.removeItem('AUTH_TOKEN')
        user.value = {}
        router.push({ name: 'login' })
    }

    const getUserName = computed(() => user.value?.name ? user.value?.name : '')

    return {
        user,
        loading,
        logout,
        getUserName,
    }
})