import axios from "axios";
import api from "@/utils/api";
import { useLoginStore } from "@/stores/loginStore";

export const signUp = async (username, email, password) => {
    try {
        const response = await api.post("/auth/signup", {
            username,
            email,
            password
        });

        return response;
    } catch (e) {
        console.error(e);
    } 
}

export const signIn = async (username, password) => {
    const loginStore = useLoginStore();
    
    try {
        const response = await api.post("/auth/signin", {
            username,
            password
        });

        loginStore.user.username = response.data.user.username;
        loginStore.user.email = response.data.user.email;
        loginStore.user.jsonWebToken = response.data.token;

        return response;

    } catch (e) {
        console.error(e);
    } 
}

