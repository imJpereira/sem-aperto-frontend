<script setup>

const createExpense = (event) => {
  event.preventDefault();
}

</script>

<template>
  <h1>Despesas</h1>

  <section class="form-container">
    <form action="">
      <div class="mb-3 date">
        <label for="expenses_date">Data</label>
        <input
        id="expenses_date"
        name="expenses_date" 
        type="date" 
        class="form-control"/>
      </div>
 
      <div class="mb-3 value">
        <label for="expenses_value">Valor</label>
        <input
        id="expenses_value"
        name="expenses_value"
        type="text" 
        class="form-control" />
      </div>

      <div class="mb-3 category">
        <label for="expenses_category">Categoria</label>
        <input 
        id="expenses_category"
        name="expenses_category"
        type="text"
        class="form-control"/>
      </div>

      <div class="mb-3 description">
        <label for="expenses_description">Descrição</label>
        <input
        id="expenses_description"
        name="expenses_description" 
        type="text" 
        class="form-control"/>
      </div>

      <div class="w-100 d-flex justify-content-center">
        <button
        @click="createExpense" 
        class="btn btn-success btn-lg" 
        type="submit">
        Adicionar</button>
      </div>
    </form>
  </section>

  <section class="expenses-container">
    <!-- Fazer listagem de desepesas cadastradas -->
    <!-- v-for -->
     <div class="grid">
      <p>Descrição</p>
      <p>Valor</p>
      <p>Categoria</p>
     </div>
     <div class="grid rounded border-top border-bottom">
        <p class="fs-4 p-3">Calça Jeans</p>
        <p class="fs-4 p-3">R$ 170,00</p>
        <p class="fs-4 p-3">ROUPAS</p>
     </div>

  </section>
</template>

<style scoped>

  section {
    padding: 2rem 5rem;
    /* background: #000; */
  }

  .form-container form {
    display: flex;
    flex-wrap: wrap;
    gap: 0 1rem;
  }

/* 
  .form-container form > :nth-child(1),
  .form-container form > :nth-child(2) {
    flex-grow: 0;
  } */
  .form-container form > :nth-child(3) {
    flex-grow: 2;
  }
  
  .form-container form > :nth-child(4) {
    width: 100%;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;

    & p {
      text-align: center;
    }
  }

  @media (max-width: 800px) {  
    .form-container form div {
      min-width: 10rem;
  }
  }

</style>
