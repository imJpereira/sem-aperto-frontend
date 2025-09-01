<script setup>
import { ref, defineEmits } from 'vue';
import BaseModal from './BaseModal.vue';
import { useModal } from '@/composables/useModal';
import planService from '@/services/planService';
import SimpleInput from '../inputs/SimpleInput.vue';
import DateInput from '../inputs/DateInput.vue';

const emit = defineEmits(["close"]);
const { closeModal } = useModal(emit);

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
    
    return response.status >= 200 ? "Plano criado com sucesso" : "Erro ao criar plano";
}
</script>

<template>
    
<BaseModal class="new-plan-modal">
    <button class="close invisible-button" @click="closeModal()"><i class="fa-solid fa-x text-white" @click="closeModal()"></i></button>
    <form action="POST" @submit.prevent="handleSubmit()">
        <SimpleInput v-model="title" label="Título" />
        <DateInput v-model="startDate" label="Início" />
        <DateInput v-model="finalDate" label="Fim" />
        <SimpleInput v-model="capital" label="Capital" :decimal="true" />
        <div class="d-flex align-items-center justify-content-center">
            <button class="btn btn-dark btn-lg" type="submit" :disabled="!isFormValid()">Criar</button>
        </div>
    </form>
</BaseModal>
    
</template>

<style scoped>

.new-plan-modal {
        top: 40%;
        left: 10%;
    }

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