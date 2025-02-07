<script setup>
import NewPlanModal from '@/components/NewPlanModal.vue';
// import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePlanStore } from '@/stores/planStore';

const router = useRouter();
const planStore = usePlanStore();
const visible = ref(false);
const modal = ref(null);

const handleDocumentClick = (e) => {
  if (e.target.classList.contains('btn-success')) return;

  const modalElement = modal.value?.$el;
  if (!modalElement?.contains(e.target)) toggleVisibility(false);
}

const showPlanDetail = (plan) => {
  router.push({
                name: "PlanDetail", 
                params: { id: plan.planId }
              });
}       

const handleModalClose = async () => {
  toggleVisibility(false);
  planStore.getPlans();
}

const  toggleVisibility = (visibility) => {
  visible.value = visibility;
}

onMounted(async () => {
  document.addEventListener('click', handleDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
})

</script>

<template>
  <header>
    <h1>Planos</h1>
  </header>
  <section class="tab-content">
    <div class="button-container">
      <button class="btn btn-success btn-lg" @click="toggleVisibility(true)">Novo Plano</button>
    </div>

    <div class="plans-container py-3 d-flex flex-wrap" >
      <div 
        class="plan d-flex align-items-center p-4" 
        v-for="plan in planStore.plans" 
        :key="plan.id"
         @click="showPlanDetail(plan)"
      >
        <h2>{{ plan.title }}</h2>
        <div class="d-flex align-items-center justify-content-center">
          <span>Capital Inicial: R$ {{ plan.initialCapital }}</span><br>
          <span>Total Gasto: R$ {{ plan.totalSpent }}</span>
        </div>
        <span><b>Saldo: R$ {{ plan.initialCapital - plan.totalSpent }}</b></span>
      </div>
    </div>

  </section>

  <NewPlanModal v-if="visible" ref="modal" @close="handleModalClose"/>
</template>

<style scoped>

.plans-container {
  gap: 0.5rem;
  /* max-width: 84rem; */
  /* background-color: rgb(171, 101, 211); */
}

.plan {
  position: relative;
  flex-direction: column;
  height: 17rem;
  width: 21rem;
  color: var(--vt-c-white);
  border-radius: 10px;
  background-color: var(--plan-bg);
  cursor: pointer;
}

.plan:hover {
  filter: brightness(90%);
} 

.plan > :nth-child(2) {
  flex-direction: column;
  flex-grow: 1;
  /* background-color: blue; */
}


</style>
