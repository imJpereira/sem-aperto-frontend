<script setup>
import NewCategoryModal from '@/components/NewCategoryModal.vue'
import { formatDate, formatValue } from '@/assets/functions/functions'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Category from '@/components/Category.vue'
import planService from '@/services/planService'
import categoryService from '@/services/categoryService'
import expensesService from '@/services/expensesService'

const route = useRoute()
const router = useRouter()

const plan = ref([])

const planTitle = ref('')
const planInitialCapital = ref('')
const planStartDate = ref('')
const planFinalDate = ref('')

const categoryTotals = {}

const categories = ref([])
const selectedCategory = ref(null);
const categoryExpenses = ref([])

const modalVisible = ref(false)

const redirectToPlanRoute = () => {
  router.push({ name: 'Plan' })
}

const handleModalClose = () => {
  toggleVisibility(false)
  showCategories()
}

const toggleVisibility = (visibility) => {
  modalVisible.value = visibility
}

const showCategories = async () => {
  categories.value = await categoryService.fetchAllCategoriesByPlan(route.params.id);
  getCategoryTotals();
  selectedCategory.value = categories.value[0].categoryId;
}

const getCategoryTotals = () => {
  categoryTotals.targetValue = categories.value.reduce(
    (sum, category) => sum + Number(category.targetValue),
    0,
  )
  categoryTotals.actualValue = categories.value.reduce(
    (sum, category) => sum + Number(category.actualValue),
    0,
  )
}

const showCategoryExpenses = async (categoryId) => {
  categoryExpenses.value = await expensesService.fetchAllByCategory(categoryId);
}

const findPlan = async () => {
  plan.value = await planService.fetchPlanById(route.params.id);
}

const updatePlanTitle = async () => {
  if (plan.value.title === planTitle.value) return;
  await planService.updatePlan(route.params.id, { title: plan.value.title});
}

const updatePlanStartDate = async () => {
  if (plan.value.startDate === planStartDate.value) return
  await planService.updatePlan(route.params.id, { startDate: plan.value.startDate});
}

const updatePlanFinalDate = async () => {
  if (plan.value.finalDate === planFinalDate.value) return
  await planService.updatePlan(route.params.id, { finalDate: plan.value.finalDate});
}

const updatePlanInitialCapital = async () => {
  console.log(planInitialCapital.value);
  if (plan.value.initialCapital === planInitialCapital.value) return;
  await planService.updatePlan(route.params.id, { initialCapital: plan.value.initialCapital});
  await showCategories();
}

const deletePlan = async (id) => {
  const userResponse = confirm('Tem certeza que deseja excluír esse plano? ')
  if (!userResponse) return;

  await planService.deletePlan(id);
  alert('plano excluído com sucesso!')
  await planService.fetchAllPlans();
  redirectToPlanRoute();
}

onMounted(async () => {
  await findPlan()
  await showCategories()
})
</script>

<template>
  <div class="plan-container overflow-hidden">
    <header class="my-4">
      <img
        @click="redirectToPlanRoute"
        class="btn-back"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAArklEQVR4nO3Y0QqCQBRF0f2FZTGDD/bvQUEFfYKBMjAQhD537uUs8N3DVnAEs9ROwBN4A4WgRmAGln61MeFHLMCLBCNm4EwgdWPEB5gIxCNUuIQKl1DhEipcQoVLqKj+ABRRM5QYdg5F7bAUyj3DiFRDhiyPFv3/09bLfiGg4jGiisuIKi4jqriMKJdR5TKqXEZVqjLjzuHsSJIxN4L6HfMgsPY4XXuNw79vxoyvFeVU7Pycczv1AAAAAElFTkSuQmCC"
        alt="back"
      />
      <div class="input-container">
        <input
          v-model="plan.title"
          class="no-input h1-input"
          type="text"
          @focus="planTitle = plan.title"
          @blur="updatePlanTitle()"
        />
      </div>
      <button @click="deletePlan(plan.planId)" class="btn btn-danger btn-large">
        Excluir Plano
      </button>
    </header>

    <div class="plan-info-container">
      <div class="plan-info">
        <label for="">Capital: </label>
        <div class="input-container">
          <input
            v-model="plan.initialCapital"
            class="no-input"
            type="text"
            @focus="planInitialCapital = plan.initialCapital"
            @blur="updatePlanInitialCapital()"
          />
        </div>
      </div>

      <div class="plan-info">
        <label for="">Data Inicial:</label>
        <div class="input-container">
          <input
            v-model="plan.startDate"
            class="no-input"
            type="date"
            @focus="planStartDate = plan.startDate"
            @blur="updatePlanStartDate()"
          />
        </div>
      </div>

      <div class="plan-info">
        <label for="">Data Final:</label>
        <div class="input-container">
          <input
            v-model="plan.finalDate"
            class="no-input"
            type="date"
            @focus="planFinalDate = plan.finalDate"
            @blur="updatePlanFinalDate()"
          />
        </div>
      </div>
    </div>

    <div class="py-2">
      <button @click="toggleVisibility(true)" class="btn btn-success">Adicionar Categoria</button>
    </div>

    <div class="main-content">
      <section class="categories">
        <div class="grid pb-3 border-bottom border-dark">
          <p class="caption">Descrição</p>
          <p class="caption">Meta</p>
          <p class="caption">Valor Gasto</p>
          <p class="caption">Saldo</p>
        </div>
        <div>
          <Category 
            v-for="category in categories"
            :key="category.id"  
            @click="showCategoryExpenses(category.categoryId); selectedCategory = category.categoryId"
            :selected="selectedCategory"
            :category="category"
            :showCategories="showCategories"
          />
        </div>
        <div class="grid pb-3">
          <p><b>Total</b></p>
          <p>
            <b>{{ formatValue(categoryTotals.targetValue) }}</b>
          </p>
          <p>
            <b>{{ formatValue(categoryTotals.actualValue) }}</b>
          </p>
          <p>
            <b>{{ formatValue(categoryTotals.targetValue - categoryTotals.actualValue) }}</b>
          </p>
        </div>
      </section>
      <section class="category-expenses">
        <div class="grid expenses-grid pb-3 border-bottom border-dark">
          <p class="caption">Descrição</p>
          <p class="caption">Data</p>
          <p class="caption">Valor</p>
        </div>
        <div
          v-for="categoryExpense in categoryExpenses"
          :key="categoryExpense.id"
          class="expenses-grid grid border-bottom py-2"
        >
          <p>{{ categoryExpense.description }}</p>
          <p>{{ formatDate(categoryExpense.expenseDate) }}</p>
          <p>{{ formatValue(categoryExpense.value) }}</p>
        </div>
      </section>
    </div>
  </div>

  <NewCategoryModal
    v-if="modalVisible"
    ref="modal"
    :plan-id="plan.planId"
    @close="handleModalClose()"
  />
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* background-color: violet; */
}

.btn-back {
  height: 30px;
  width: 30px;
  margin-right: 20px;
  cursor: pointer;
}

.expenses-grid {
  grid-template-columns: 2fr 1fr 1fr;
}

.input-container {
  position: relative;
  display: inline-block;
  flex-grow: 1;
  /* background-color: grey; */
}

.no-input {
  background: none;
  border: none;
  /* border-bottom: 1px solid rgb(221, 221, 221); */
  padding: 0.5rem;
  /* color: white; */
  outline: none;
  font-weight: 500;
}

.no-input:hover {
  background-color: rgb(250, 250, 250);
}

.no-input:focus {
  background-color: rgb(250, 250, 250);
}

.h1-input {
  font-size: 30px;
}

.h1-input ~ .input-icon {
  width: 40px;
  height: 40px;
}

.no-input:disabled {
  color: inherit;
  opacity: 1;
  background-color: transparent;
}

.input-icon {
  position: absolute;
  /* right: 10px; */
  top: 50%;
  transform: translateY(-65%);
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.plan-info-container {
  display: flex;
  gap: 10rem;
  /* background-color: blue; */
  padding: 1rem 0 2rem 0;
}

.plan-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0.5rem;
  /* border-radius: 10px;
    background-color: var(--plan-bg) */
}

.main-content {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex-grow: 1;
  /* background-color: rgb(82, 224, 153); */
}

.categories {
  flex-grow: 1;
  width: 100%;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 10px;
}

.category-expenses {
  flex-grow: 1;
  width: 100%;
  background-color: #f9f9f9;
  min-width: 40%;
  padding: 1rem;
  border-radius: 10px;
}

.delete-category-img {
  cursor: pointer;
  transition: all 300ms ease;

  &:hover {
    transform: scale(1.1);
  }
}
</style>
