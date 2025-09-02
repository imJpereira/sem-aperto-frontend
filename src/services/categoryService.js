import { useLoginStore } from "@/stores/loginStore";
import api from "@/utils/api";

const categoryService = {

    createCategory: async (planId, body) => {
        const loginStore = useLoginStore();
        try {
            const response = await api.post(`/categories/create/plan/${planId}`, body, {
                headers: {
                    Authorization: `Bearer ${loginStore.user.jsonWebToken}`,
                },
            });
            return response;
        } catch (e) {
            return e;
        }
    },   
    
    updateCategory: async (categoryId, body) => {
        const loginStore = useLoginStore();

        try {
            const response = await api.patch(`/categories/update/${categoryId}`, body, {
                headers: {
                    Authorization: `Bearer ${loginStore.user.jsonWebToken}`
                }
            });

            return response;
        } catch (e) {
            return e;
        }
    },

    deleteCategory: async (categoryId) => {
        const loginStore = useLoginStore();

        try {
            const response = await api.delete(`/categories/delete/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${loginStore.user.jsonWebToken}`
                }
            });

            return response;
        } catch (e) {
            return e;
        }
    },

    fetchAllCategoriesByPlan: async (planId) => {
        const loginStore = useLoginStore();

        try {
            const response = await api.get(`/categories/plan/${planId}`, {
                headers: {
                    Authorization: `Bearer ${loginStore.user.jsonWebToken}`
                }
            });

            console.log(response.data);

            return response.data;
        } catch (e) {
            return e;
        }
    },

}

export default categoryService;