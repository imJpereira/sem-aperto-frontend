import { defineStore } from 'pinia'

export const loginStore = defineStore('login', () => {
  const jsonWebToken = '8dee3662-7001-43a9-a23a-d8366e7a9e80'//Autenticação (fixo por enquanto)

  return { jsonWebToken }
})
