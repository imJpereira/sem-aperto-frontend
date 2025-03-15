<script setup>
import { useLoginStore } from '@/stores/loginStore';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const loginStore = useLoginStore();
const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");

const createUser = async () => {
    //validações
    try {
        await axios.post("http://192.168.100.17:8080/auth/signup", {
            username: username.value,
            email: email.value,
            password: password.value
        });

        signin();
    } catch (e) {
        console.log(e);
    } 
}

const signin = async () => {
    console.log(username.value)
    console.log(password.value)

    try {
        const jwt = await axios.post("http://192.168.100.17:8080/auth/signin", {
            username: username.value,
            password: password.value
        });

        loginStore.jsonWebToken = jwt.data.token;
        router.push("/planos");

    } catch (e) {
        console.log(e);
    }
}

</script>

<template>
   <main class="main-container d-flex">       
        
        <div class="form-container d-flex justify-content-center align-items-center">
            <div class="w-50 h-75">
                <h1 class="text-center">Crie uma nova conta</h1>
                <div class="text-center">
                    <span >Já tem uma conta? <RouterLink to="/signin" class="text-success">Clique aqui para fazer login</RouterLink></span>
                </div>
                <form @submit.prevent="createUser" class="py-5">
                    <div class="w-100 pb-3">
                        <label for="username" class="form-label">Usuário</label>
                        <input v-model="username" id="username" type="text" class="form-control">
                    </div>
                    <div class="w-100 pb-3">
                        <label for="email" class="form-label">Email</label>
                        <input v-model="email" id="email" type="email" class="form-control">
                    </div>
                    <div class="w-100 pb-3">
                        <label for="password" class="form-label">Senha</label>
                        <input v-model="password" id="password" type="password" class="form-control">
                    </div>
                    <div class="w-100 d-flex justify-content-center py-3">
                        <button type="submit" class="btn btn-lg btn-success w-50">Cadastrar</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="description-container">
        </div>
    </main> 
</template>

<style scoped>

.main-container {
    height: 100vh;
    width: 100vw;
}

.form-container {
    flex-grow: 1;
    background-color: #ffffff;
}

.description-container {
    flex-grow: 3;
    background-color: var(--color-main-theme);
}


</style>