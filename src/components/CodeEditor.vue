<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { asmX86 } from '@/editor/asm-lenguaje'
import { marcasDeLinea, marcarLineas } from '@/editor/marcas-linea'

const props = defineProps({
  modelValue: { type: String, required: true },
  lineaError: { type: Number, default: null },
  lineaActiva: { type: Number, default: null },
})
const emit = defineEmits(['update:modelValue'])

const contenedor = ref(null)
let vista = null

onMounted(() => {
  vista = new EditorView({
    parent: contenedor.value,
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        basicSetup,
        oneDark,
        asmX86,
        marcasDeLinea,
        EditorView.updateListener.of((u) => {
          if (u.docChanged) emit('update:modelValue', u.state.doc.toString())
        }),
      ],
    }),
  })
  aplicarMarcas()
})

// Si el código cambia desde fuera (al elegir un ejemplo), se actualiza el editor
watch(
  () => props.modelValue,
  (nuevo) => {
    if (vista && nuevo !== vista.state.doc.toString()) {
      vista.dispatch({ changes: { from: 0, to: vista.state.doc.length, insert: nuevo } })
    }
  },
)

watch(() => [props.lineaError, props.lineaActiva], aplicarMarcas)

function aplicarMarcas() {
  if (vista) marcarLineas(vista, { error: props.lineaError, activa: props.lineaActiva })
}

onBeforeUnmount(() => vista?.destroy())
</script>

<template>
  <div ref="contenedor" class="editor"></div>
</template>

<style scoped>
.editor {
  border: 1px solid var(--borde);
  border-radius: 8px;
  overflow: hidden;
}
.editor :deep(.cm-editor) {
  height: 380px;
  font-size: 14px;
}
.editor :deep(.cm-scroller) {
  font-family: var(--mono);
}
.editor :deep(.linea-error) {
  background: rgba(248, 81, 73, 0.22);
}
.editor :deep(.linea-activa) {
  background: rgba(79, 179, 255, 0.22);
}
</style>