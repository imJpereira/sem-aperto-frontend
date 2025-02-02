<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { formatDate } from '@/functions/functions'

const defaultDate = new Date().toISOString().split('T')[0]

const expenses = ref([])

const expenseCategory = null
const expenseValue = ref(null)
const expenseDate = ref(defaultDate)
const expenseDescription = ref(null)

const createExpense = async (event) => {
  event.preventDefault()

  if (expenseValue.value <= 0 || isNaN(expenseValue.value)) {
    alert('Informe um valor')
    return
  }

  if (new Date(expenseDate.value) > new Date()) {
    alert('Não é possível informara data futura')
    return
  }

  try {
    await axios.post('http://192.168.100.17:8080/expenses/create', {
      category: null,
      value: expenseValue.value,
      expenseDate: expenseDate.value,
      description: expenseDescription.value,
    })
  } catch (e) {
    //fazer componente de mensagem de erro
    alert(e)
    return
  }

  //fazer componenente de sucesso

  showExpenses()

  expenseValue.value = null
  expenseDescription.value = null
}

const showExpenses = async () => {
  expenses.value = await axios.get('http://192.168.100.17:8080/expenses/all')
  expenses.value = expenses.value.data
}

const deleteExpense = async (expenseId) => {
  const userResponse = confirm('Tem certeza que deseja excluír essa despesa? ')
  if (!userResponse) return

  const response = await axios.delete(`http://192.168.100.17:8080/expenses/delete/${expenseId}`)
  if (response.status == 200) {
    alert('Excluído com sucesso!')
    showExpenses()
    return;
  }
  alert('Erro ao excluir registro!')
}

onMounted(showExpenses)
</script>

<template>
  <header>
    <h1>Despesas</h1>
  </header>

  <section class="form-container tab-content">
    <form @submit.prevent="createExpense">
      <div class="mb-3 date">
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

      <div class="mb-3 category">
        <label for="expense_category">Categoria</label>
        <input
          v-model="expenseCategory"
          id="expense_category"
          name="expense_category"
          type="text"
          disabled
          class="form-control"
        />
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
  </section>

  <section class="tab-content">
    <div class="grid border-bottom border-dark pb-2">
      <p class="caption">Descrição</p>
      <p class="caption">Valor</p>
      <p class="caption">Categoria</p>
      <p class="caption">Data</p>
    </div>
    <div v-for="expense in expenses" :key="expense.id" class="grid border-bottom py-3">
      <p>{{ expense.description }}</p>
      <p>R$ {{ expense.value }}</p>
      <p>{{ expense.category?.description }}</p>
      <p>{{ formatDate(expense.expenseDate) }}</p>
      <div class="d-flex justify-content-end">
        <img
          @click="deleteExpense(expense.expenseId)"
          class="delete-expense-img"
          src="../assets/icons/delete-reg-icon.svg"
          alt="delete"
          width="30px"
          height="30px"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.form-container form > :nth-child(1),
.form-container form > :nth-child(2) {
  flex-grow: 1;
}
.form-container form > :nth-child(3) {
  flex-grow: 4;
}

.form-container form > :nth-child(4) {
  width: 100%;
}

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
