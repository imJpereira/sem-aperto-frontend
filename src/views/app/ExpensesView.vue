<script setup>
import NewExpenseModal from '@/components/modal/NewExpenseModal.vue'
import Expense from '@/components/grid-fields/Expense.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { formatDate, formatValue } from '@/assets/functions/functions'
import expensesService from '@/services/expensesService'

const modalVisible = ref(false);
const modal = ref(null);

const expenses = ref([]);

const showExpenses = async () => {
  expenses.value = await expensesService.fetchAllExpenses();
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
    <Expense 
      v-for="expense in expenses" 
      :key="expense.expenseId" 
      :expense="expense"
      @updated="showExpenses" 
    />
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
