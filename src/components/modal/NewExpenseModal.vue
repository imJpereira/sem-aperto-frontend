<script setup> 
import { usePlanStore } from '@/stores/planStore';
import BaseModal from './BaseModal.vue';
import { ref } from 'vue';
import { useModal } from '@/composables/useModal';
import categoryService from '@/services/categoryService';
import expensesService from '@/services/expensesService';

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

    return response.status >= 200 ? "Despesa criada com sucesso!" : "Erro ao criar despesa";
}

const handlePlanBlur = async () => {
  categories.value = await categoryService.fetchAllCategoriesByPlan(expensePlan.value);
}

</script>

<template>  
    <BaseModal class="new-expense-modal">
        <img class="close" @click="closeModal()" width="20" height="20" src="../assets/icons/cancel-white.svg" alt="cancelar">
        <form @submit.prevent="handleSubmit">
            <div class="mb-3 ">
                <label for="expense_date">Data</label>
                <input
                v-model="expenseDate"
                id="expense_date"
                name="expense_date"
                type="date"
                class="form-control"
                />
            </div>

            <div class="mb-3 value">
                <label for="expense_value">Valor</label>
                <input
                v-model="expenseValue"
                id="expense_value"
                name="expense_value"
                type="number"
                step="0.01"
                class="form-control"
                />
            </div>

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

            <div class="mb-3 description">
                <label for="expense_description">Descrição</label>
                <input
                v-model="expenseDescription"
                id="expense_description"
                name="expense_description"
                type="text"
                class="form-control"
                />
            </div>

            <div class="w-100 d-flex justify-content-center">
                <button class="btn btn-success btn-lg" type="submit">Adicionar</button>
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

.new-expense-modal {
    top: 50%;
    left: 50%;
}

</style>