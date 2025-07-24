import { defineStore } from 'pinia'
import { ref } from 'vue';
import planService from '@/services/planService';   

export const usePlanStore = defineStore('plan', () => {
    const plans = ref([]);

    const getPlans = async () => {
        const response = await planService.fetchAllPlans();
        if (response) {
            plans.value = response;
        }
    }

    return { plans, getPlans }
})
