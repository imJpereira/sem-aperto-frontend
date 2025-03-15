import axios from 'axios';
import { defineStore } from 'pinia'
import { ref } from 'vue';
import { useLoginStore } from './loginStore';

export const usePlanStore = defineStore('plan', () => {
    
    const plans = ref([]);
    const loginStore = useLoginStore();

    const getPlans = async () => {
        try {
           plans.value = await axios("http://192.168.100.17:8080/plans/all", {
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
