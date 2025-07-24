<script setup>
import axios from 'axios';
import { ref, defineEmits } from 'vue';
import BaseModal from './BaseModal.vue';
import { useModal } from '@/composables/useModal';
import { useLoginStore } from '@/stores/loginStore';
import planService from '@/services/planService';

const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
const emit = defineEmits(["close"]);
const { closeModal } = useModal(emit);

const loginStore = useLoginStore();

const title = ref("");
const startDate = ref("");
const finalDate = ref("");
const capital = ref("");

const isFormValid = () => title.value && startDate.value && finalDate.value && capital.value;

const handleSubmit = async () => {
    alert(await createPlan()); 
    closeModal();
}

const createPlan = async () => {
    if (!title.value) return "Título inválido";
    if (startDate.value === null) return "Data Inicial Inválida";
    if (finalDate.value === null) return "Data Final Inválida";
    if (new Date(startDate.value) > new Date(finalDate.value)) return "Data final maior que a data inicial";
    if (capital.value < 0) return "O Capital não pode ser menor que 0";
    
    const response = await planService.createPlan({
        title: title.value,
        startDate: startDate.value,
        finalDate: finalDate.value,
        initialCapital: capital.value
    });
    console.log(response.status);

    return response.status === 201 ? "Plano criado com sucesso" : "Erro ao criar plano";
}
</script>

<template>
    
<BaseModal>
    <img class="close" @click="closeModal()" width="20" height="20" src="../assets/icons/cancel-white.svg" alt="cancelar">
    <form action="POST" @submit.prevent="handleSubmit()">
        <div>
            <label for="">Título</label>
            <input v-model="title" class="form-control" type="text">
        </div>
        <div>
            <label for="">Início</label>
            <input v-model="startDate" class="form-control" type="date">
        </div>
        <div>
            <label for="">Fim</label>
            <input v-model="finalDate" class="form-control" type="date">
        </div>
        <div>
            <label for="">Capital</label>
            <input v-model="capital" class="form-control" type="number" step="0.01">
        </div>
        <div class="d-flex align-items-center justify-content-center">
            <button class="btn btn-dark btn-lg" type="submit" :disabled="!isFormValid()">Criar</button>
        </div>
    </form>
</BaseModal>

</template>

<style scoped>

form {
    gap: 1rem;
}

form > :nth-child(1),
form > :nth-child(5) {
    flex-basis: 100%;
}

form > :nth-child(2),
form > :nth-child(3),
form > :nth-child(4) {
    flex-grow: 1;
}



</style>