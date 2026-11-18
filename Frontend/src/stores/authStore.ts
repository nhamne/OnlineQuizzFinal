import { defineStore } from "pinia";

import { computed, ref } from 'vue';

// định nghĩa kiểu dữ liệu (typescript)
export interface UserData {
    id: number;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
}

//khởi tạo store có mã định danh id là user_store
export const useAuthStore = defineStore('user_store', () => {
    //  khởi tạo state 
    // lấy dữ liệu trong localstorage lên để F5 không bị mất khi đã đăng nhập
    const user = ref<UserData | null>(JSON.parse(localStorage.getItem('user') || 'null'));
    const token = ref<string | null>(localStorage.getItem('token') || null);
    // khởi tạo action
    // hàm này được gọi khi bạn gọi api đăng nhập thành công -> truyền dữ liệu nhận được từ BE vào hàm này
    const setAuth = (newUser: UserData, newtoken: string) => {
        user.value = newUser;
        token.value = newtoken;
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', newtoken)
    }
    // hàm xử lý đăng xuất
    const reset = () => {
        user.value = null;
        token.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    // khởi tạo getter
    const isLoggedIn = computed(() => {
        return token.value !== null;
    });
    return {
        user, token, setAuth, reset, isLoggedIn
    }
})