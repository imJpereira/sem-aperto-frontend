<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { formatDate, formatValue } from '@/assets/functions/functions'
import { usePlanStore } from '@/stores/planStore'
import { useLoginStore } from '@/stores/loginStore'
import categoryService from '@/services/categoryService'
import expensesService from '@/services/expensesService'

const planStore = usePlanStore()

const defaultDate = new Date().toISOString().split('T')[0]

const categories = ref([])
const expenses = ref([])

const expenseValue = ref(null)
const expenseDate = ref(defaultDate)
const expenseDescription = ref(null)
const expensePlan = ref(null)
const expenseCategory = ref(null)

const createExpense = async (event) => {
  event.preventDefault()
  let msg;

  if (expenseValue.value <= 0 || isNaN(expenseValue.value)) msg += 'Informe um valor\n';
  if (!expensePlan.value) msg += 'Informe um plano\n';

  if (msg) {
    alert(msg);
    return;
  }

  await expensesService.createExpense({
    planId: expensePlan.value,
    category: expenseCategory.value,
    value: expenseValue.value,
    expenseDate: expenseDate.value,
    description: expenseDescription.value,
  });

  showExpenses()

  expenseValue.value = null
  expenseDescription.value = null
}

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

const handlePlanBlur = async () => {
  categories.value = await categoryService.fetchAllCategoriesByPlan(expensePlan.value);
}

onMounted(() => showExpenses())

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
  </section>

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

.form-container form > :nth-child(1),
.form-container form > :nth-child(2),
.form-container form > :nth-child(3),
.form-container form > :nth-child(4) {
  flex-grow: 1;
}

.form-container form > :nth-child(5) {
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
