<script setup>
import { formatValue } from '@/assets/functions/functions';
import { useLoginStore } from '@/stores/loginStore';
import axios from 'axios';

const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
const loginStore = useLoginStore();

const props = defineProps({
    showCategories: Function,
    category: Object, 
    selected: String
});

const deleteCategory = async (categoryId) => {
  const userResponse = confirm('Tem certeza que deseja excluír essa despesa? ')
  if (!userResponse) return

  try {
    await axios.delete(`${baseApiUrl}/categories/delete/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${loginStore.jsonWebToken}`,
      },
    })
    alert('deletado com sucesso');
    
    props.showCategories();
    return
  } catch (e) {
    console.log(e)
  }
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
        <p>{{ formatValue(category.targetValue) }}</p>
        <p>{{ formatValue(category.actualValue) }}</p>
        <p>{{ formatValue(category.targetValue - category.actualValue) }}</p>
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

</style>
