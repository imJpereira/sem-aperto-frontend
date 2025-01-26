<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const plan = ref([]);

const findPlan = async (id) => {
    try {
        plan.value = await axios(`http://localhost:8080/plans/${id}`);
        plan.value = plan.value.data;
    } catch(e) {
        console.log(e)
    }

}

onMounted(() => findPlan(route.params.id));

</script>

<template>
    <div class="plan-container overflow-hidden">
        <header>
            <h1>{{ plan.title }}</h1>
        </header>
        <section class="categories">
            <div class="category">
                
            </div>
        </section>
        <section class="category-expenses">

        </section>
    </div>
</template>

<style scoped>

header {
    width: 100%;
    background-color: blueviolet;
}

.plan-container {
    background-color: rgb(87, 153, 190);
    display: flex;
    flex-wrap: wrap;
}

.categories {
    flex-grow: 1;
    background-color: bisque;
    padding: 1rem;
}

.category {
    background-color: blue;
}

.category-expenses {
    background-color: red;
    min-width: 20%;
}

</style>

