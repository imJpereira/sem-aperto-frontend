<script setup>
import { formatValue, removeDots } from '@/assets/functions/functions';
import categoryService from '@/services/categoryService';
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
    showCategories: Function,
    category: Object, 
});

const emit = defineEmits(["updated"]);

const description = ref(props.category.description);

const targetValue = ref(props.category.targetValue);
const targetValueDisplay = ref(formatValue(props.category.targetValue));

const deleteCategory = async (categoryId) => {
  const userResponse = confirm('Tem certeza que deseja excluír essa despesa? ')
  if (!userResponse) return;

  const response = await categoryService.deleteCategory(categoryId);

  if (response.status >= 200) {
    alert('Categoria excluída com sucesso');
    props.showCategories();
    return;
  }

  alert('Erro ao excluir categoria');
}

const updateCategoryDescription = async (categoryId, description) => {
  if (description === props.category.description) return;

  const response = await categoryService.updateCategory(categoryId, { description });
  emit("updated");

  if (response.status > 300 || response.status < 200) {
    alert('Erro ao atualizar categoria');
    return;
  }
}

const updateCategoryTargetValue = async (categoryId, targetValue) => {
  if (targetValue === props.category.targetValue) return;

  const response = await categoryService.updateCategory(categoryId, { targetValue });

  console.log("category component");

  emit("updated");

  if (response.status > 300 || response.status < 200) {
    alert('Erro ao atualizar categoria');
    return;
  }
}

const handleTargetValueBlur = () => {
  if (targetValue.value === props.category.targetValue) return;

  const cleanValue = targetValueDisplay.value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
  targetValueDisplay.value = cleanValue;

  updateCategoryTargetValue(props.category.categoryId, targetValueDisplay.value);

  const formatted = formatValue(cleanValue);
  targetValueDisplay.value = formatted;
};

watch(() => props.category, (newVal) => {
  description.value = newVal.description;
  targetValueDisplay.value = formatValue(newVal.targetValue);
});

onMounted(() => {
  targetValueDisplay.value = formatValue(props.category.targetValue);
});

</script>

<template>
  <div class="grid grid-cell"> 
    <input 
      type="text"
      v-model="description"
      @blur="updateCategoryDescription(category.categoryId, description)"
    />
    <input 
      type="text"
      v-model="targetValueDisplay"
      @blur="handleTargetValueBlur()"
      @focus="targetValueDisplay = removeDots(targetValueDisplay)"
    />
    <p>{{ formatValue(category.actualValue) }}</p>
    <p>{{ formatValue(category.targetValue - category.actualValue) }}</p>
    <div class="d-flex justify-content-end cursor-pointer" @click="deleteCategory(category.categoryId)">
        <i class="fa fa-trash text-danger" aria-hidden="true"></i>
    </div>
  </div>
</template>

<style scoped>

  p, i {
    padding: 0.3rem;
  }

  .grid input {
    width: 100%;
    border: none;
    padding: 0.3rem;
    background-color: transparent;
    outline: none;
  }

</style>
