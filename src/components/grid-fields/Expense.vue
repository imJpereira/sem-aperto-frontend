<script setup>
import { formatDate, formatValue, removeDots } from '@/assets/functions/functions';
import expensesService from '@/services/expensesService';
import ExpensesView from '@/views/app/ExpensesView.vue';
import { ref, watch } from 'vue';

const props = defineProps({
    expense: Object,
});

const expenseDescription = ref(props.expense.description);

const expenseValue = ref(props.expense.value);
const expenseValueDisplay = ref(formatValue(props.expense.value));
const expenseDate = ref(props.expense.expenseDate);

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

const updateExpenseDate = async (expenseId, expenseDate) => {
    if (expenseDate === props.expense.expenseDate) return;

    const response = await expensesService.updateExpense(expenseId, { expenseDate });

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
    if (expenseValueDisplay.value === formatValue(props.expense.value)) return;

    const cleanValue = expenseValueDisplay.value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
    expenseValue.value = cleanValue;

    updateExpenseValue(props.expense.expenseId, expenseValue.value);

    const formatted = formatValue(cleanValue);
    expenseValueDisplay.value = formatted;
};

watch(() => props.expense, (newValue) => {
    expenseDescription.value = newValue.description;
    expenseValueDisplay.value = formatValue(newValue.value);
    expenseDate.value = newValue.expenseDate;
});

</script>

<template>
    <div  class="grid grid-cell gap-2">
        <input 
          type="text"
          v-model="expenseDescription"
          @blur="updateExpenseDescription(expense.expenseId, expenseDescription)"
        />
        <input type="text"
          v-model="expenseValueDisplay"
          @blur="handleBlur()"
          @focus="expenseValueDisplay = removeDots(expenseValueDisplay)"
          >
        <p>{{ expense.category?.description }}</p>
        <input type="date" 
            v-model="expenseDate"
            @change="updateExpenseDate(expense.expenseId, expenseDate)"
            />
        <div class="d-flex justify-content-end cursor-pointer" @click="deleteExpense(expense.expenseId)">
            <i class="fa fa-trash text-danger" aria-hidden="true"></i>
        </div>
    </div>

</template>

<style scoped>

</style>
