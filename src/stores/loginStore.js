import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useLoginStore = defineStore('login', () => {

  const user = ref({
    username: '',
    email: '',
    jsonWebToken: ''
  });

  return { user }
})
