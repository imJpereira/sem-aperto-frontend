<script setup> 
import { usePlanStore } from '@/stores/planStore';
import BaseModal from './BaseModal.vue';
import { ref } from 'vue';
import { useModal } from '@/composables/useModal';
import categoryService from '@/services/categoryService';
import expensesService from '@/services/expensesService';
import SimpleInput from '../inputs/SimpleInput.vue';
import DateInput from '../inputs/DateInput.vue';

const planStore = usePlanStore();

const defaultDate = new Date().toISOString().split('T')[0]

const categories = ref([])

const expenseValue = ref(null)
const expenseDate = ref(defaultDate)
const expenseDescription = ref(null)
const expensePlan = ref(null)
const expenseCategory = ref(null)

const emit = defineEmits(["close"]);
const { closeModal } = useModal(emit);

const handleSubmit = async(event) => {
    event.preventDefault();
    alert(await createExpense());
    closeModal();
}

const createExpense = async () => {
    let msg = '';

    if (expenseValue.value <= 0 || isNaN(expenseValue.value)) msg += 'Informe um valor\n';
    if (!expensePlan.value) msg += 'Informe um plano\n';

    if (msg) {
        alert(msg);
        return;
    }

    const response = await expensesService.createExpense({
        plan: expensePlan.value,
        category: expenseCategory.value,
        value: expenseValue.value,
        expenseDate: expenseDate.value,
        description: expenseDescription.value,
    });

    return (response.status >= 200) && (response.status < 300) ? "Despesa criada com sucesso!" : "Erro ao criar despesa\n" + response.response.data;
}

const handlePlanBlur = async () => {
  categories.value = await categoryService.fetchAllCategoriesByPlan(expensePlan.value);
}

const isFormValid = () => {
    return expensePlan.value && expenseDate.value && Number(expenseValue.value) > 0;
};


</script>

<template>  
    <BaseModal class="new-expense-modal">
        <button class="close invisible-button" @click="closeModal()"><i class="fa-solid fa-x text-black" @click="closeModal()"></i></button>
        <form @submit.prevent="handleSubmit">
            
            <DateInput v-model="expenseDate" label="Data" />
            <SimpleInput v-model="expenseValue" label="Valor" :decimal="true" />
    
            <div class="mb-3 plan">
                <label for="expense_plan">Plano</label>
                <select 
                v-model="expensePlan" 
                id="expense_plan" 
                name="expense_plan" 
                class="form-select"
                @blur="handlePlanBlur()"
                @change="expenseCategory = ''"
                >
                <option v-for="plan in planStore.plans" :key="plan.id" :value="plan.planId">
                    {{ plan.title }}
                </option>
                </select>
            </div>

            <div class="mb-3 category">
                <label for="expense_category">Categoria</label>
                <select
                v-model="expenseCategory"
                id="expense_category"
                name="expense_category"
                class="form-select" 
                >
                <option v-for="category in categories" :key="category.id" :value="category.categoryId">
                    {{ category.description }}
                </option>
                </select>
            </div>

            <SimpleInput v-model="expenseDescription" label="Descrição" />

            <div class="w-100 d-flex justify-content-center">
                <button class="btn btn-success btn-lg" type="submit" :disabled="!isFormValid()">Adicionar</button>
            </div>
        </form>
    </BaseModal>
</template>

<style scoped>

form :nth-child(1),
form :nth-child(2),
form :nth-child(3), 
form :nth-child(4),
form :nth-child(5) {
    flex-basis: 100%;
}

</style>