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
  if (e.target.closest('.btn-add') || e.target.closest('.btn-success')) return;

  const modalElement = modal.value?.$el;
  if (!modalElement?.contains(e.target)) toggleVisibility(false);
}


const handleModalClose = () => {
  toggleVisibility(false)
  showCategories()
}

const toggleVisibility = (visibility) => {
  console.log("toggle visibility " + visibility);
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
    <header>
      <div class="header-left">
        <button class="invisible-button" @click="redirectToPlanRoute">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <input
          v-model="plan.title"
          class="plan-title"
          type="text"
          placeholder="Título do Plano"
          @blur="updatePlanTitle()"
        />
      </div>
      <button @click="deletePlan(plan.planId)" class="btn-delete">
        Excluir Plano
      </button>
    </header>

    <div class="plan-info-container">
      <SimpleInfoCard
        v-if="!isLoading"
        :inputValue="plan.initialCapital"
        label="Capital Inicial"
        :onBlur="updatePlanInitialCapital"
      />
      <DateInfoCard
        v-if="!isLoading"
        :inputValue="plan.startDate"
        label="Data Inicial"
        :onBlur="updatePlanStartDate"
      />
      <DateInfoCard
        v-if="!isLoading"
        :inputValue="plan.finalDate"
        label="Data Final"
        :onBlur="updatePlanFinalDate"
      />
    </div>

    <div class="py-2">
      <button @click="toggleVisibility(true)" class="btn-add">
        + Adicionar Categoria
      </button>
    </div>

    <div class="main-content">
      <section class="categories">
        <div class="grid grid-header">
          <p class="caption">Descrição</p>
          <p class="caption">Meta (R$)</p>
          <p class="caption">Valor Gasto (R$)</p>
          <p class="caption">Saldo (R$)</p>
        </div>

        <div class="categories-grid">
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

        <div class="grid grid-footer">
          <p><b>Total</b></p>
          <p><b>{{ formatValue(categoryTotals.targetValue) }}</b></p>
          <p><b>{{ formatValue(categoryTotals.actualValue) }}</b></p>
          <p>
            <b>{{ formatValue(categoryTotals.targetValue - categoryTotals.actualValue) }}</b>
          </p>
        </div>
      </section>

      <section class="category-expenses">
        <div class="grid grid-header">
          <p class="caption">Descrição</p>
          <p class="caption">Data</p>
          <p class="caption">Valor</p>
        </div>

        <div
          v-for="categoryExpense in categoryExpenses"
          :key="categoryExpense.id"
          class="grid grid-expense"
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
.plan-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eaeaea;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-grow: 1;
}

.btn-back {
  height: 32px;
  width: 32px;
  cursor: pointer;
  color: #444;
  transition: transform 0.2s ease, color 0.2s ease;
}

.btn-back:hover {
  transform: translateX(-3px);
  color: #007bff;
}

.plan-title {
  font-size: 1.6rem;
  font-weight: 600;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.2rem 0.5rem;
  outline: none;
  width: 100%;
  background: transparent;
  transition: border-color 0.3s ease;
}

.plan-title:focus {
  border-color: #007bff;
}

.btn-delete {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
}

.btn-delete:hover {
  background: #b02a37;
}

.plan-info-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.5rem 0;
}

.btn-add {
  background: #198754;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
}

.btn-add:hover {
  background: #157347;
}

.main-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  flex-grow: 1; 
}

.categories {
  width: 100%;
  flex: 2;
  min-width: 60%;
  background-color: #fdfdfd;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #ececec;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
}

.categories-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

grid-header {
  border-bottom: 1px solid #ececec;
  font-weight: 600;
  color: #666;
}

.grid-footer {
  border-top: 1px solid #ececec;
  margin-top: 0.5rem;
}

.grid-expense {
  grid-template-columns: 2fr 1fr 1fr;
  padding: 0.6rem 0;
  border-bottom: 1px solid #ececec;
}

.category-expenses {
  flex: 1;
  background-color: #fff;
  min-width: 35%;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #ececec;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
}

.base-category {
  background-color: #e8f8f2;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.base-category:hover {
  background-color: #cdeee0;
}

.categories {
  overflow-y: auto;
  scrollbar-width: none; 
  -ms-overflow-style: none;
}

.categories::-webkit-scrollbar {
  display: none;
}


</style>