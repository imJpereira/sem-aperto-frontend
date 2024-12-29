<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute();

const isActive = (path) => {
  return path === route.path;
}

</script>

<template>
  <main>
    <aside class="main-menu">
      <div class="main-menu-profile">
        <h1>Nome</h1>
      </div>
      <nav class="main-menu-content">
        <ul>
          <li :class="{ menuActive: isActive('/despesas') }">
            <RouterLink to="/despesas" >Despesas</RouterLink
            >
          </li>
          <li :class="{ menuActive: isActive('/planos') }">
            <RouterLink to="/planos" 
              >Planos</RouterLink
            >
          </li>
        </ul>
      </nav>
    </aside>

    <div class="tab-container">
      <RouterView />
    </div>


  </main>
</template>

<style scoped>

.main-menu {
  width: 20rem;

  color: var(--vt-c-white);
  background-color: var(--color-main-theme);

  & a {
    font-size: 20px;
    color: var(--vt-c-text-dark-2);
    text-decoration: none;
  }
}

.main-menu-content {
  padding: 2rem 1.5rem;

  li {
    margin-bottom: 1rem;
    position: relative;
  }
}

.main-menu-profile {
  padding: 5rem 1.5rem;
  border-bottom: 2px solid var(--vt-c-divider-dark-2);
}

.menuActive a {
  color: var(--vt-c-white);
}

</style>
