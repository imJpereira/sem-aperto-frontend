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

    const response = await loginStore.signUp(username.value, email.value, password.value);

    if (response.status === 201) {
        await loginStore.signIn(username.value, password.value);

        if (loginStore.user.jsonWebToken) {
            router.push("/planos");
        } 
    } else {
        alert("Erro ao cadastrar usuário.\n" + response.response.data);
    }
}

</script>

<template>
   <main class="main-container d-flex align-items-center justify-content-center bg-main-theme">       
        
        <div class="form-container d-flex justify-content-center align-items-center">
            <div>
                <div class="logo-container">
                    <img src="../../assets/icons/logo.png" alt="Logo" class="logo"/>
                </div>
                <h1 class="text-center">Crie uma nova conta</h1>
                <div class="text-center">
                    <span >Já tem uma conta? <RouterLink to="/signin" class="text-success">Clique aqui para fazer login</RouterLink></span>
                </div>
                <form @submit.prevent="handleSignUp" class="py-5 d-flex flex-column">
                    <div class="pb-3 full-width">
                        <label for="username" class="form-label">Usuário</label>
                        <input v-model="username" id="username" type="text" class="form-control">
                    </div>
                    <div class="pb-3 full-width">
                        <label for="email" class="form-label">Email</label>
                        <input v-model="email" id="email" type="email" class="form-control">
                    </div>
                    <div class="pb-3 full-width">
                        <label for="password" class="form-label">Senha</label>
                        <input v-model="password" id="password" type="password" class="form-control">
                    </div>
                    <div class="w-100 d-flex justify-content-center py-3">
                        <button type="submit" class="btn btn-lg btn-success w-50">Cadastrar</button>
                    </div>
                </form>
            </div>
        </div>
    </main> 
</template>