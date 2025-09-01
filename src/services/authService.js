import api from "@/utils/api";

const authService = {
    
    signUp: async (username, email, password) => {
        try {
            const response = await api.post("/auth/signup", {
                username,
                email,
                password
            });
            
            return response;
        } catch (e) {
            return e;
        }
    },

    signIn: async (username, password) => {    
        try {
            const response = await api.post("/auth/signin", {
                username,
                password
            });
            return response;

        } catch (e) {
            return e;
        } 
    }

};

export default authService;