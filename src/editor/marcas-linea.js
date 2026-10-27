import { RangeSetBuilder, StateEffect, StateField } from '@codemirror/state'
import { Decoration, EditorView } from '@codemirror/view'

const fijarMarcas = StateEffect.define()
const decoError = Decoration.line({ class: 'linea-error' })
const decoActiva = Decoration.line({ class: 'linea-activa' })

function construir(doc, { error, activa }) {
  const builder = new RangeSetBuilder()
  ;[
    [activa, decoActiva],
    [error, decoError],
  ]
    .filter(([n]) => n && n >= 1 && n <= doc.lines)
    .sort((a, b) => a[0] - b[0])
    .forEach(([n, deco]) => {
      const linea = doc.line(n)
      builder.add(linea.from, linea.from, deco)
    })
  return builder.finish()
}

/** Resalta la línea con error y la línea del paso actual. */
export const marcasDeLinea = StateField.define({
  create: () => Decoration.none,
  update(decoraciones, tr) {
    let resultado = decoraciones.map(tr.changes)
    for (const efecto of tr.effects) {
      if (efecto.is(fijarMarcas)) resultado = construir(tr.state.doc, efecto.value)
    }
    return resultado
  },
  provide: (campo) => EditorView.decorations.from(campo),
})

export function marcarLineas(vista, marcas) {
  vista.dispatch({ effects: fijarMarcas.of(marcas) })
}