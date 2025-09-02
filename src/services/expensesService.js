import { useLoginStore } from "@/stores/loginStore";
import api from "@/utils/api";

const expensesService = {

    createExpense: async (body) => {
        const loginStore = useLoginStore();

        try {
            const response = await api.post("/expenses/create", body, {
                headers: {
                    Authorization: `Bearer ${loginStore.user.jsonWebToken}`
                }
            });

            return response;
        } catch (e) {
            return e;
        }
    },

    updateExpense: async (expenseId, body) => {
        const loginStore = useLoginStore();

        try {
            const response = await api.patch(`/expenses/update/${expenseId}`, body, {
                headers: {
                    Authorization: `Bearer ${loginStore.user.jsonWebToken}`
                }
            });

            return response;
        } catch (e) {
            return e;
        }
    },

    deleteExpense: async (expenseId) => {
        const loginStore = useLoginStore();

        try {
            const response = await api.delete(`/expenses/delete/${expenseId}`, {
                headers: {
                    Authorization: `Bearer ${loginStore.user.jsonWebToken}`
                }
            });

            return response;
        } catch (e) {
            return e;
        }
    },

    fetchAllByCategory: async (categoryId) => {
        const loginStore = useLoginStore();

        try {
            const response = await api.get(`/expenses/category/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${loginStore.user.jsonWebToken}`
                }
            });

            return response.data;
        } catch (e) {
            return e;
        }
    },

    fetchAllExpenses: async () => {
        const loginStore = useLoginStore();

        try {
            const response = await api.get("/expenses/all", {
                headers: {
                    Authorization: `Bearer ${loginStore.user.jsonWebToken}`
                }
            });

            return response.data;
        } catch (e) {
            return e;
        }
    },
}

export default expensesService;