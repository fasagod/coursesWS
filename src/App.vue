<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/"><v-btn class="text-uppercase text-subtitle-2" rounded="lg" variant="plain">Мои курсы</v-btn></RouterLink>
        <RouterLink to="/courses"><v-btn class="text-uppercase text-subtitle-2"  rounded="lg" variant="plain">Все курсы</v-btn></RouterLink>
      </nav>
    </div>
  </header>
  <main class="flex-grow-1">
    <v-sheet elevation="2" class="pa-3 mt-4">

    <RouterView />

    </v-sheet>
  </main>

</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: black;
}

nav a.router-link-active button{
  border-radius: 15px;
  background-color: #90b4f130;
}

nav a {
  display: inline-block;
  color: black;

}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    padding-right: calc(var(--section-gap) / 2);
    flex-grow: 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
