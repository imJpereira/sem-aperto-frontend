<script setup>
import { formatValue } from '@/assets/functions/functions';
import categoryService from '@/services/categoryService';
import { useLoginStore } from '@/stores/loginStore';

const props = defineProps({
    showCategories: Function,
    category: Object, 
    selected: String
});

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
        <p>{{ category.description }}</p>
        <input type="text" v-model="category.targetValue"></input>
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
