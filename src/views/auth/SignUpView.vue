<script setup>
import { useLoginStore } from '@/stores/loginStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter(); 
const loginStore = useLoginStore();

const username = ref("");
const email = ref("");
const password = ref("");

const handleSignUp = async () => {
    let msg = "";
    
    if (!username.value) msg += "Informe um usuário. ";
    if (!email.value) msg += "Informe um email. ";     
    if (!password.value) msg += "Informe uma senha. ";

    if (msg !== "") {
        alert(msg);
        return
    }

    try {
        const response = await loginStore.signUp(username.value, email.value, password.value);

        if (response.status === 201) {
            await loginStore.signIn(username.value, password.value);

            if (loginStore.user.jsonWebToken) {
                router.push("/planos");
            } 
        } 

    } catch (e) {
        console.error(e);
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
                <form @submit.prevent="handleSignUp" class="py-5">
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