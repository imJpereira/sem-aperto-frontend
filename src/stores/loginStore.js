import authService from '@/services/authService';
import { defineStore } from 'pinia'
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

export const useLoginStore = defineStore('login', () => {
  const route = useRouter();

  const user = ref(
    JSON.parse(localStorage.getItem('user')) || 
    {
    username: '',
    email: '',
    jsonWebToken: ''
  });

  const signUp = async (username, email, password) => {
    return await authService.signUp(username, email, password);
  }

  const signIn = async (username, password) => {
    const response = await authService.signIn(username, password);
  
    if (response.status !== 200) {
      return response;
    }

    user.value.username = response.data.user.username;
    user.value.email = response.data.user.email;
    user.value.jsonWebToken = response.data.token;
    return response;
  }

  const signOut = () => {
      user.value = {
          username: '',
          email: '',
          jsonWebToken: ''
      };

      route.push('/signin');
  }

  watch(user, (newUser) => {
    if (newUser && newUser.jsonWebToken) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  }, { deep: true });

  return { user, signIn, signUp, signOut }
})
