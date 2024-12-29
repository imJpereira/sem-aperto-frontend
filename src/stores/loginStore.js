import { ref } from 'vue'
import { defineStore } from 'pinia'

export const loginStore = defineStore('login', () => {
  const jsonWebToken = ref(1) //Autenticação (fixo por enquanto)

  return { jsonWebToken }
})
