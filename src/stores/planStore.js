import axios from 'axios';
import { defineStore } from 'pinia'
import { ref } from 'vue';
import { useLoginStore } from './loginStore';

export const usePlanStore = defineStore('plan', () => {
    
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const plans = ref([]);
    const loginStore = useLoginStore();

    const getPlans = async () => {
        try {
           plans.value = await axios(`${apiBaseUrl}/plans/all`, {
            headers: {
                Authorization: `Bearer ${loginStore.jsonWebToken}`
            }
           });
           plans.value = plans.value.data;
        } catch (e) {
            console.log(e);
        }
    }
      
    return { plans, getPlans }
})
