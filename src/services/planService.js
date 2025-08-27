import { useLoginStore } from "@/stores/loginStore";
import { usePlanStore } from "@/stores/planStore";
import api from "@/utils/api";

const planService = {
    createPlan: async (body) => {
        const loginStore = useLoginStore();

        try {
            const response = await api.post("/plans/create", body, {
                headers: {
                    Authorization: `Bearer ${loginStore.user.jsonWebToken}`
                }
            });
            return response;
        } catch (e) {
            console.error(e);
        }
},

    updatePlan: async (planId, body) => {
        const loginStore = useLoginStore();
        console.log(body);

        try {
            const response = await api.patch(`/plans/update/${planId}`, body, {
                headers: {
                    Authorization: `Bearer ${loginStore.user.jsonWebToken}`
                }
            });

            return response;
        } catch (e) {
            console.error(e);
        }
    },

    deletePlan: async (id) => {
        const loginStore = useLoginStore();

        try {
            const response = await api.delete(`/plans/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${loginStore.user.jsonWebToken}`
                }
            });

            return response;
        } catch (e) {
            console.error(e);
        }
    },

    fetchAllPlans: async () => {
        const loginStore = useLoginStore();
        const planStore = usePlanStore();

        try {
            const response = await api.get("/plans/all", {
                headers: {
                    Authorization: `Bearer ${loginStore.user.jsonWebToken}`
                }
            });

            planStore.plans = response.data;
            return response.data;
        } catch (e) {
            console.error(e);
        }
    },

    fetchPlanById: async (id) => {
        const loginStore = useLoginStore();

        try {
            const response = await api.get(`/plans/${id}`, {
                headers: {
                    Authorization: `Bearer ${loginStore.user.jsonWebToken}`
                }
            });

            return response.data;
        } catch (e) {
            console.error(e);
        }
    }
}

export default planService;