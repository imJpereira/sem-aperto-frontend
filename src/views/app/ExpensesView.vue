<script setup>
import NewExpenseModal from '@/components/NewExpenseModal.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { formatDate, formatValue } from '@/assets/functions/functions'
import expensesService from '@/services/expensesService'

const modalVisible = ref(false);
const modal = ref(null);

const expenses = ref([]);

const showExpenses = async () => {
  expenses.value = await expensesService.fetchAllExpenses();
}

const deleteExpense = async (expenseId) => {
  const userResponse = confirm('Tem certeza que deseja excluír essa despesa? ')
  if (!userResponse) return;

  const response = await expensesService.deleteExpense(expenseId);
  
  if (response.status > 200) {
    alert('Excluído com sucesso!');
    showExpenses();
  } else {
    alert('Erro ao excluir despesa');
  }
}

const handleDocumentClick = (e) => {
  if (e.target.classList.contains('btn-success')) return;

  const modalElement = modal.value?.$el;
  if (!modalElement?.contains(e.target)) toggleVisibility(false);
}

const handleModalClose = () => {
  toggleVisibility(false);
  showExpenses();
}

const toggleVisibility = (visibility) => {
  modalVisible.value = visibility;
}

onMounted(async () => {
  document.addEventListener('click', handleDocumentClick);
  showExpenses()
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
})

</script>

<template>
  
  <NewExpenseModal 
    v-if="modalVisible"
    ref="modal" 
    @close="handleModalClose" 
  />
  
  <header>
    <h1>Despesas</h1>
  </header>
   
  <div class="w-100 d-flex justify-content-center">
    <button class="btn btn-success btn-lg" type="submit" @click="toggleVisibility(true)">Adicionar Despesa</button>
  </div>

  <section class="tab-content">
    <div class="grid border-bottom border-dark pb-2">
      <p class="caption">Descrição</p>
      <p class="caption">Valor</p>
      <p class="caption">Categoria</p>
      <p class="caption">Data</p>
    </div>
    <div v-for="expense in expenses" :key="expense.id" class="grid border-bottom py-2">
      <p>{{ expense.description }}</p>
      <p>{{ formatValue(expense.value) }}</p>
      <p>{{ expense.category?.description }}</p>
      <p>{{ formatDate(expense.expenseDate) }}</p>
      <div class="d-flex justify-content-end">
        <i class="fa fa-trash text-danger" aria-hidden="true" @click="deleteExpense(expense.expenseId)"></i>
      </div>
    </div>
  </section>
</template>

<style scoped>


.delete-expense-img {
  cursor: pointer;
  transition: all 300ms ease;

  &:hover {
    transform: scale(1.1);
  }
}

@media (max-width: 1200px) {
  h1 {
    text-align: center;
  }

  section {
    padding: 1rem;
  }
}
</style>
