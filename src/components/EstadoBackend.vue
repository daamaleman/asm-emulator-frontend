<script setup>
import { ref, onMounted } from 'vue'
import { obtenerEstado } from '@/api/cliente'

const estado = ref('verificando')
const version = ref('')

onMounted(async () => {
  try {
    const data = await obtenerEstado()
    estado.value = data.status === 'UP' ? 'conectado' : 'desconectado'
    version.value = data.version
  } catch {
    estado.value = 'desconectado'
  }
})
</script>

<template>
  <div class="estado" :class="estado">
    <span class="punto"></span>
    <span v-if="estado === 'verificando'">Verificando…</span>
    <span v-else-if="estado === 'conectado'">Backend v{{ version }}</span>
    <span v-else>Backend no disponible</span>
  </div>
</template>

<style scoped>
.estado {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--tenue);
}
.punto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--tenue);
}
.conectado .punto {
  background: var(--ok);
}
.desconectado .punto {
  background: var(--error);
}
</style>