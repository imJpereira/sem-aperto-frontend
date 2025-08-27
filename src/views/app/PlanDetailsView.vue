<script setup>
import NewCategoryModal from '@/components/modal/NewCategoryModal.vue'
import { formatDate, formatValue } from '@/assets/functions/functions'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Category from '@/components/grid-fields/Category.vue'
import planService from '@/services/planService'
import categoryService from '@/services/categoryService'
import expensesService from '@/services/expensesService'
import SimpleInfoCard from '@/components/info-cards/SimpleInfoCard.vue'
import DateInfoCard from '@/components/info-cards/DateInfoCard.vue'

const route = useRoute()
const router = useRouter()

const plan = ref([])

const planTitleInput = ref('')

const categories = ref([])
const selectedCategory = ref(null);
const categoryExpenses = ref([])

const modalVisible = ref(false)
const modal = ref(null);
const isLoading = ref(false);


const redirectToPlanRoute = () => {
  router.push({ name: 'Plan' })
}

const handleDocumentClick = (e) => {
  if (e.target.classList.contains('btn-success')) return;

  const modalElement = modal.value?.$el;
  if (!modalElement?.contains(e.target)) toggleVisibility(false);
}

const handleModalClose = () => {
  toggleVisibility(false)
  showCategories()
}

const toggleVisibility = (visibility) => {
  modalVisible.value = visibility
}

const isBaseCategory = (type) => {
   return type == 'BASE';
}

const isSelected = (categoryId) => {
  return categoryId === selectedCategory.value;
}

const showCategories = async () => {
  categories.value = await categoryService.fetchAllCategoriesByPlan(route.params.id);
  console.log("show categories  " + JSON.stringify(categories.value));
  selectedCategory.value = categories.value[0].categoryId;
}

const categoryTotals = computed(() => {
  return {
    targetValue: categories.value.reduce(
      (sum, c) => sum + Number(c.targetValue), 0
    ),
    actualValue: categories.value.reduce(
      (sum, c) => sum + Number(c.actualValue), 0
    )
  }
});

const showCategoryExpenses = async (categoryId) => {
  categoryExpenses.value = await expensesService.fetchAllByCategory(categoryId);
}

const findPlan = async () => {
  plan.value = await planService.fetchPlanById(route.params.id);
  console.log(plan.value.initialCapital);
}

const updatePlanTitle = async () => {
  if (plan.value.title === planTitleInput.value) return;
  await planService.updatePlan(route.params.id, { title: plan.value.title});
}

const updatePlanStartDate = async (newDate) => {
  if (plan.value.startDate === newDate) return
  await planService.updatePlan(route.params.id, { startDate: newDate });
}

const updatePlanFinalDate = async () => {
  await planService.updatePlan(route.params.id, { finalDate: plan.value.finalDate});
}

const updatePlanInitialCapital = async (newValue) => {
  await planService.updatePlan(route.params.id, { initialCapital: newValue });
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
  isLoading.value = true;
  await findPlan();
  await showCategories();
  document.addEventListener('click', handleDocumentClick);
  await planService.fetchAllPlans();
  isLoading.value = false;
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
})

</script>

<template>
  <div class="plan-container overflow-hidden">
    <header class="my-4">
      <div @click="redirectToPlanRoute">
        <i class="fa-solid fa-arrow-left btn-back"></i>
      </div>
        
      <div class="input-container">
        <input
          v-model="plan.title"
          class="plan-input h1-input"
          type="text"
          @blur="updatePlanTitle()"
        />
      </div>
      <button @click="deletePlan(plan.planId)" class="btn btn-danger btn-large">
        Excluir Plano
      </button> 
    </header>

    <div class="plan-info-container">
      <SimpleInfoCard 
        v-if="!isLoading"
        :inputValue="plan.initialCapital" 
        :label="'Capital Inicial'"
        :onBlur="updatePlanInitialCapital" 
      />
      <DateInfoCard 
        v-if="!isLoading"
        :inputValue="plan.startDate" 
        :label="'Data Inicial'"
        :onBlur="updatePlanStartDate"
      />
      <DateInfoCard 
        v-if="!isLoading"
        :inputValue="plan.finalDate" 
        :label="'Data Final'"
        :onBlur="updatePlanFinalDate"
      />

    </div>

    <div class="py-2">
      <button @click="toggleVisibility(true)" class="btn btn-success">Adicionar Categoria</button>
    </div>

    <div class="main-content">
      <section class="categories">
        <div class="grid pb-3 border-bottom border-dark">
          <p class="caption">Descrição</p>
          <p class="caption">Meta (R$)</p>
          <p class="caption">Valor Gasto (R$)</p>
          <p class="caption">Saldo (R$)</p>
        </div>
        <div>
          <Category  
            v-if="!isLoading"
            v-for="category in categories"
            :key="category.categoryId"  
            :class="{
              'base-category': isBaseCategory(category.type),
              'selected': isSelected(category.categoryId)
            }"
            :category="category"
            :showCategories="showCategories"
            @updated="showCategories"
            @click="showCategoryExpenses(category.categoryId); selectedCategory = category.categoryId"
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

.h1-input {
  font-size: 30px;
}

.h1-input ~ .input-icon {
  width: 40px;
  height: 40px;
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
  flex-direction: flex-start;
  gap: 1rem;
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

.base-category {
    background-color: #e2f3ed;
    font-weight: 500;

    &:hover {
      background-color: #c0dbd1;

    }
  }

</style>
