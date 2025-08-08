<script setup>
import { ref } from 'vue';
import BaseModal from './BaseModal.vue';
import { useModal } from '@/composables/useModal';
import categoryService from '@/services/categoryService';

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

const handleSubmit = async() => {
    alert(await createCategory());
    closeModal();
}

const createCategory = async () => {
    if (description.value ==  "") return "Descrição Inválida";
    if (targetValue.value <= 0 ) return "Valor inválido";

    const response = await categoryService.createCategory(props.planId, {
        description: description.value,
        targetValue: targetValue.value,
        planId: props.planId
    });

    return response.status >= 200 ? "Categoria criada com sucesso!" : "Erro ao criar categoria";
}

</script>

<template>
    <BaseModal class="new-category-modal">
        <img class="close" @click="closeModal()" width="20" height="20" src="../assets/icons/cancel-white.svg" alt="cancelar">
        <form action="POST" @submit.prevent="handleSubmit()">
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
    .new-category-modal {
        top: 40%;
        left: 10%;
    }

    form {
        gap: 1rem;
    }

    form > :nth-child(1),
    form > :nth-child(2) {
        flex-basis: 100%;
    }


</style>