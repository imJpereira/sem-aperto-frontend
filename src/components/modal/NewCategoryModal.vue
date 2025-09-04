<script setup>
import { onMounted, ref } from 'vue';
import BaseModal from './BaseModal.vue';
import { useModal } from '@/composables/useModal';
import categoryService from '@/services/categoryService';
import { formatValue, removeDots } from '@/assets/functions/functions';
import SimpleInput from '../inputs/SimpleInput.vue';

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

const isFormValid = () => {
    return description.value && targetValue.value && Number(targetValue.value) > 0;
};

const handleSubmit = async() => {
    alert(await createCategory());
    closeModal();
}

const createCategory = async () => {
    if (description.value ==  "") return "Descrição Inválida";
    if (targetValue.value <= 0 ) return "Valor inválido";

    const response = await categoryService.createCategory(props.planId, {
        description: description.value,
        targetValue: removeDots(targetValue.value),
        planId: props.planId
    });


    return (response.status >= 200) && (response.status < 300) ? "Categoria criada com sucesso!" : "Erro ao criar categoria\n" + response.response.data;
}

</script>

<template>
    <BaseModal class="new-category-modal">
        <button class="close invisible-button" @click="closeModal()"><i class="fa-solid fa-x text-black" @click="closeModal()"></i></button>
        <form action="POST" @submit.prevent="handleSubmit()">
            <SimpleInput v-model="description" label="Descrição" />
            <SimpleInput v-model="targetValue" label="Meta" :decimal="true" />
            <div class="w-100 d-flex justify-content-center">
                <button class="w-100 btn btn-success btn-lg" type="submit" :disabled="!isFormValid()">Criar</button>
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