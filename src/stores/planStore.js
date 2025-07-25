import { defineStore } from 'pinia'
import { ref } from 'vue';

export const usePlanStore = defineStore('plan', () => {
    const plans = ref([]);

    return { plans }
})
