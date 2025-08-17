<script setup>
import { formatValue } from '@/assets/functions/functions';
import categoryService from '@/services/categoryService';
import { ref, watch } from 'vue';

const props = defineProps({
    showCategories: Function,
    category: Object, 
    selected: String
});

const emit = defineEmits(["updated"]);

const description = ref(props.category.description);
const targetValue = ref(props.category.targetValue);


const deleteCategory = async (categoryId) => {
  const userResponse = confirm('Tem certeza que deseja excluír essa despesa? ')
  if (!userResponse) return

  const response = await categoryService.deleteCategory(categoryId);

  if (response.status >= 200) {
    alert('Categoria excluída com sucesso');
    props.showCategories();
    return;
  }

  alert('Erro ao excluir categoria');
}

const isBaseCategory = (type) => {
   return type == 'BASE';
}

const isSelected = (categoryId) => {
  return categoryId === props.selected;
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

watch(() => props.category, (newVal) => {
  description.value = newVal.description;
  targetValue.value = newVal.targetValue;
});


</script>

<template>
    <div 
      class="grid category-container"
      :class="{
        'base-category': isBaseCategory(category.type),
        'selected': isSelected(category.categoryId)
      }"
      @click="selectedCategory = category.categoryId"
      >
        <input 
          type="text"
          v-model="description"
          @blur="updateCategoryDescription(category.categoryId, description)"
        />
        <input 
          type="text"
          v-model="targetValue"
          @blur="updateCategoryTargetValue(category.categoryId , targetValue)"
        />
        <p>{{ formatValue(category.actualValue) }}</p>
        <p>{{ formatValue(category.targetValue - category.actualValue) }}</p>
        <div class="d-flex justify-content-end">
            <i class="fa fa-trash text-danger" aria-hidden="true" @click="deleteCategory(category.categoryId)"></i>
        </div>
    </div>
</template>

<style scoped>

  .category-container {
    padding: 3px 0;
    border-bottom: 1px solid #000;
    
    &:hover {
      background-color: #c0dbd1;
      cursor: pointer;
    }
  }

  .base-category {
    background-color: #e2f3ed;
    font-weight: 500;

    &:hover {
      background-color: #c0dbd1;

    }
  }

  .selected {
    background-color: #c0dbd1;
  }

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
