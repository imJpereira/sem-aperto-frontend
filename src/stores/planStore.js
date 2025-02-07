import axios from 'axios';
import { defineStore } from 'pinia'
import { ref } from 'vue';

export const usePlanStore = defineStore('plan', () => {
    
    const plans = ref([]);

    const getPlans = async () => {
        try {
           plans.value = await axios("http://192.168.100.17:8080/plans/all");
           plans.value = plans.value.data;
        } catch (e) {
            console.log(e);
        }
    }
      
    return { plans, getPlans }
})
