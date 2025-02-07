<script setup>
import NewCategoryModal from '@/components/NewCategoryModal.vue'
import { formatDate, getCategoriesByPlanId } from '@/functions/functions'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlanStore } from '@/stores/planStore'

const route = useRoute()
const router = useRouter()
const planStore = usePlanStore();

const plan = ref([])
const categories = ref([])
const categoryExpenses = ref([])

const titleEditable = ref(false)
const capitalEditable = ref(false)
const startDateEditable = ref(false)
const finalDateEditable = ref(false)

const modalVisible = ref(false);

const redirectToPlanRoute = () => {
  router.push({ name: 'Plan' })
}

const handleModalClose = () => {
  toggleVisibility(false);
  showCategories();
}

const  toggleVisibility = (visibility) => {
  modalVisible.value = visibility;
}

const deletePlan = (id) => {
  const userResponse = confirm('Tem certeza que deseja excluír esse plano? ')
  if (!userResponse) return

  try {
    axios.delete(`http://192.168.100.17:8080/plans/delete/${id}`)
  } catch (e) {
    console.log(e)
    return
  }

  alert('plano excluído com sucesso!')
  planStore.getPlans();
  redirectToPlanRoute();
}

const showCategories = async () => {
  categories.value = await getCategoriesByPlanId(route.params.id);
}

const deleteCategory = async (categoryId) => {
  const userResponse = confirm('Tem certeza que deseja excluír essa despesa? ')
  if (!userResponse) return
  
  try {
    await axios.delete(`http://192.168.100.17:8080/categories/delete/${categoryId}`)
    alert("deletado com sucesso");
    showCategories();
    return;
  } catch (e) {
    console.log(e)
  }

}

const showCategoryExpenses = async (categoryId) => {
  try {
    categoryExpenses.value = await axios(
      `http://192.168.100.17:8080/expenses/category/${categoryId}`,
    )
    categoryExpenses.value = categoryExpenses.value.data
  } catch (e) {
    console.log(e)
  }
}

const findPlan = async () => {
  try {
    plan.value = await axios(`http://192.168.100.17:8080/plans/${route.params.id}`)
    plan.value = plan.value.data
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  findPlan();
  showCategories();
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
          :disabled="!titleEditable"
        />
        <img
          v-if="!titleEditable"
          class="input-icon edit"
          @click="titleEditable = !titleEditable"
          src="../assets/icons/edit.svg"
          alt="edit"
        />
        <img
          v-else
          class="input-icon confirm"
          @click="titleEditable = !titleEditable"
          src="../assets/icons/confirm.svg"
          alt="checkmark--v1"
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
            :disabled="!capitalEditable"
          />
          <img
            v-if="!capitalEditable"
            class="input-icon edit"
            @click="capitalEditable = !capitalEditable"
            src="../assets/icons/edit.svg"
            alt="edit"
          />
          <img
            v-else
            class="input-icon confirm"
            @click="capitalEditable = !capitalEditable"
            src="../assets/icons/confirm.svg"
            alt="checkmark--v1"
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
            :disabled="!startDateEditable"
          />
          <img
            v-if="!startDateEditable"
            class="input-icon edit"
            @click="startDateEditable = !startDateEditable"
            src="../assets/icons/edit.svg"
            alt="edit"
          />
          <img
            v-else
            class="input-icon confirm"
            @click="startDateEditable = !startDateEditable"
            src="../assets/icons/confirm.svg"
            alt="checkmark--v1"
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
            :disabled="!finalDateEditable"
          />
          <img
            v-if="!finalDateEditable"
            class="input-icon edit"
            @click="finalDateEditable = !finalDateEditable"
            src="../assets/icons/edit.svg"
            alt="edit"
          />
          <img
            v-if="finalDateEditable"
            class="input-icon confirm"
            @click="finalDateEditable = !finalDateEditable"
            src="../assets/icons/confirm.svg"
            alt="checkmark--v1"
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
        <div
          v-for="category in categories"
          :key="category.id"
          class="category grid border-bottom py-3"
          @click="showCategoryExpenses(category.categoryId)"
        >
          <p>{{ category.description }}</p>
          <p>{{ category.targetValue }}</p>
          <p>{{ category.actualValue }}</p>
          <p>{{ category.targetValue - category.actualValue }}</p>
          <div class="d-flex justify-content-end">
            <img
              @click="deleteCategory(category.categoryId)"
              class="delete-category-img"
              src="../assets/icons/delete-reg-icon.svg"
              alt="delete"
              width="30px"
              height="30px"
            />
          </div>
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
          class="expenses-grid grid border-bottom py-3"
        >
          <p>{{ categoryExpense.description }}</p>
          <p>{{ formatDate(categoryExpense.expenseDate) }}</p>
          <p>{{ categoryExpense.value }}</p>
        </div>
      </section>
    </div>
  </div>


  <NewCategoryModal v-if="modalVisible" ref="modal"  :plan-id="plan.planId" @close="handleModalClose()"/>
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
  border-bottom: 1px solid rgb(221, 221, 221);
  padding: 0.5rem;
  /* color: white; */
  outline: none;
  font-weight: 500;
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
  background-color: rgb(238, 238, 238);
  padding: 1rem;
  border-radius: 10px;
}

.category-expenses {
  background-color: rgb(241, 241, 241);
  min-width: 40%;
  padding: 1rem;
  border-radius: 10px;
}

.category {
  background-color: inherit;
}

.category:hover {
  filter: brightness(97%);
  cursor: pointer;
}

.delete-category-img {
  cursor: pointer;
  transition: all 300ms ease;

  &:hover {
    transform: scale(1.1);
  }
}

</style>
