<script setup>
import { formatDate, formatValue, removeDots } from '@/assets/functions/functions';
import expensesService from '@/services/expensesService';
import { ref, watch } from 'vue';

const props = defineProps({
    expense: Object,
});

const expenseDescription = ref(props.expense.description);

const expenseValue = ref(props.expense.value);
const expoenseValueDisplay = ref(formatValue(props.expense.value));

const emit = defineEmits(["updated"]);

const updateExpenseDescription = async (expenseId, description) => {
    if (description === props.expense.description) return;

    const response = await expensesService.updateExpense(expenseId, { description });
    emit("updated");

    if (response.status > 300 || response.status < 200) {
        alert('Erro ao atualizar despesa');
        return;
    }
}

const updateExpenseValue = async (expenseId, value) => {
    if (value === props.expense.value) return;

    const response = await expensesService.updateExpense(expenseId, { value });

    emit("updated");

    if (response.status > 300 || response.status < 200) {
        alert('Erro ao atualizar despesa');
        return;
    }
}

const deleteExpense = async (expenseId) => {
    const userResponse = confirm('Tem certeza que deseja excluír essa despesa? ')
    if (!userResponse) return

    const response = await expensesService.deleteExpense(expenseId);

    if (response.status >= 200) {
        alert('Despesa excluída com sucesso');
        emit("updated");   
        return;
    }

    alert('Erro ao excluir despesa');
}

const handleBlur = () => {
    if (expoenseValueDisplay.value === formatValue(props.expense.value)) return;

    const cleanValue = expoenseValueDisplay.value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
    expenseValue.value = cleanValue;

    updateExpenseValue(props.expense.expenseId, expenseValue.value);

    const formatted = formatValue(cleanValue);
    expoenseValueDisplay.value = formatted;
};

watch(() => props.expense, (newValue) => {
    expenseDescription.value = newValue.description;
    expoenseValueDisplay.value = formatValue(newValue.value);
});

</script>

<template>
    <div  class="grid grid-cell">
        <input 
          type="text"
          v-model="expenseDescription"
          @blur="updateExpenseDescription(expense.expenseId, expenseDescription)"
        />
        <input type="text"
          v-model="expoenseValueDisplay"
          @blur="handleBlur()"
          @focus="expoenseValueDisplay = removeDots(expoenseValueDisplay)"
          >
        <p>{{ expense.category?.description }}</p>
        <p>{{ formatDate(expense.expenseDate) }}</p>
        <div class="d-flex justify-content-end cursor-pointer" @click="deleteExpense(expense.expenseId)">
            <i class="fa fa-trash text-danger" aria-hidden="true"></i>
        </div>
    </div>

</template>

<style scoped>

p, i {
    padding: 0.3rem;
}

.grid input {
    width: 100%;
    border: none;
    padding: 0.3rem;
    background-color: transparent;
    outline: none;
}

</style>
