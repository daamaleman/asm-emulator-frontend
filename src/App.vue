¿<script setup>
import { RouterLink, RouterView } from 'vue-router'
import EstadoBackend from '@/components/EstadoBackend.vue'
</script>

<template>
  <header class="barra">
    <h1 class="logo">ASM <span>x86-64</span></h1>
    <nav class="nav">
      <RouterLink to="/emulador">Emulador</RouterLink>
      <RouterLink to="/traductor">Traductor a C++</RouterLink>
    </nav>
    <EstadoBackend />
  </header>
  <main class="contenido">
    <RouterView />
  </main>
</template>

<style scoped>
.barra {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0.75rem 1.5rem;
  background: var(--panel);
  border-bottom: 1px solid var(--borde);
}
.logo {
  font-family: var(--mono);
  font-size: 1.1rem;
}
.logo span {
  color: var(--acento);
}
.nav {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}
.nav a {
  padding: 0.35rem 0.85rem;
  border-radius: 6px;
  color: var(--tenue);
}
.nav a.router-link-active {
  background: var(--borde);
  color: var(--texto);
}
.contenido {
  padding: 1.5rem;
}
</style>