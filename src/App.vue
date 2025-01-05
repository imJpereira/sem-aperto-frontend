<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute();

const isActive = (path) => {
  return path === route.path;
}

const toggleMenuHamburger = () => {
  const mainMenu = document.getElementById("main-menu");
  const menuHamburger = document.getElementById("menu-hamburguer");
  
  if (menuHamburger.style.display === "none") return;

  
  if (mainMenu.style.display === "none" || mainMenu.style.display === "") {
    mainMenu.style.display = "block";
    return;
  }
  mainMenu.style.display = "none";
}

</script>

<template>
  <main>
    <button id="menu-hamburguer" @click="toggleMenuHamburger()" class="hamburger">☰</button>

    <aside id="main-menu" class="main-menu">
      <div class="main-menu-profile">
        <h1>Nome</h1>
      </div>
      <nav class="main-menu-content">
        <ul>
          <li @click="toggleMenuHamburger()" :class="{ menuActive: isActive('/despesas') }">
            <RouterLink to="/despesas" >Despesas</RouterLink
            >
          </li>
          <li @click="toggleMenuHamburger()" :class="{ menuActive: isActive('/planos') }">
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

.hamburger {
  display: none;
  position: fixed;
  top: 5px;
  right: 5px;
  padding: 0 0.5rem;
  font-size: 30px;
  border-radius: 5px;
  background: none;
  border: none;
  z-index: 1000;
}

.main-menu {
  width: 15%;

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

@media (max-width: 1200px) {

  .main-menu {
    display: none;
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 100;
  }

  .hamburger {
    display: block;
  }
}

</style>
