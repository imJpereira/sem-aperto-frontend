<script setup>
import { ref } from 'vue';
import BaseModal from './BaseModal.vue';
import { useModal } from '@/composables/useModal';
import axios from 'axios';
import { useLoginStore } from '@/stores/loginStore';

const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
const loginStore = useLoginStore();

const description = ref("");
const targetValue = ref("");

const emit = defineEmits(["close"]);
const { closeModal } = useModal(emit);

const props = defineProps({
  planId: {
    type: String,
    required: true,
  }
});

const isFormValid = () => description.value && targetValue.value && targetValue.value > 0;

const createCategory = async() => {
    alert(await categoryPostRequest());
    closeModal();
}

const categoryPostRequest = async () => {
    if (description.value ==  "") return "Descrição Inválida";
    if (targetValue.value <= 0 ) return "Valor inválido";

    try {
        await axios.post(`${baseApiUrl}/categories/create/plan/${props.planId}`, {
            description: description.value,
            targetValue: targetValue.value
        }, {
            headers: {
                Authorization: `Bearer ${loginStore.jsonWebToken}`
            }
        });
        return "Categoria criada com sucesso"
    } catch(e) {
        console.log(e);
    }

}

</script>

<template>
    <BaseModal>
        <img class="close" @click="closeModal()" width="20" height="20" src="../assets/icons/cancel-white.svg" alt="cancelar">
        <form action="POST" @submit.prevent="createCategory()">
            <div>
                <label for="">Descrição</label>
                <input v-model="description" class="form-control" type="text">
            </div>
            <div>
                <label for="">Meta</label>
                <input v-model="targetValue" class="form-control" type="text">
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
    form > :nth-child(2) {
        flex-basis: 100%;
    }


</style>