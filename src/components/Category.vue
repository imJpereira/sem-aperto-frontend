<script setup>
import { formatValue } from '@/functions/functions';
import { useLoginStore } from '@/stores/loginStore';
import axios from 'axios';

const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
const loginStore = useLoginStore();

const props = defineProps({
    showCategories: Function,
    category: String
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

</script>

<template>
    <div 
      class="grid category-container"
      :class="{'base-category': isBaseCategory(category.type)}"
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
    background-color: #d4e7e0;
    font-weight: 500;

    &:hover {
      background-color: #c0dbd1;

    }
  }

</style>
