<script setup>
import { useLoginStore } from '@/stores/loginStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const loginStore = useLoginStore();
const router = useRouter();

const username = ref("");
const password = ref("");

const handleSignIn = async () => {
    let msg = "";
    if (!username.value) msg += "Informe um usuário. ";
    if (!password.value) msg += "Informe uma senha. ";         
    if (msg !== "") {
        alert(msg);
        return
    }

    try {
        const response = await loginStore.signIn(username.value, password.value);
        if (response.status !== 200) {
            alert("Usuário ou senha inválidos.");
            return;
        }

        console.log("login store token: " + loginStore.user.jsonWebToken);
        if (loginStore.user.jsonWebToken) {
            router.push("/planos");
        } else {
            alert("Usuário ou senha inválidos.");
        }
    } catch (e) {
        console.error(e);
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
                <h1 class="text-center">Entre na sua conta</h1>
                <div class="text-center">
                    <span >Não tem uma conta? <RouterLink to="/signup" class="text-success">Clique aqui para fazer cadastrar</RouterLink></span>
                </div>
                <form @submit.prevent="handleSignIn" class="py-5 d-flex flex-column">
                    <div class="pb-3 full-width">
                        <label for="username" class="form-label">Usuário</label>
                        <input v-model="username" id="username" type="text" class="form-control">
                    </div>
                    <div class="pb-3 full-width">
                        <label for="password" class="form-label">Senha</label>
                        <input v-model="password" id="password" type="password" class="form-control">
                    </div>
                    <div class="w-100 d-flex justify-content-center py-3">
                        <button type="submit" class="btn btn-lg btn-success w-50">Entrar</button>
                    </div>
                </form>
            </div>
        </div>
        
    </main>
</template>
