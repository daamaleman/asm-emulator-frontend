import { StreamLanguage } from '@codemirror/language'

const REGISTROS = new Set()
for (const l of ['A', 'B', 'C', 'D']) {
  ;[`R${l}X`, `E${l}X`, `${l}X`, `${l}L`].forEach((r) => REGISTROS.add(r))
}
for (const n of ['SI', 'DI', 'BP', 'SP']) {
  ;[`R${n}`, `E${n}`, n, `${n}L`].forEach((r) => REGISTROS.add(r))
}
for (let i = 8; i <= 15; i++) {
  ;[`R${i}`, `R${i}D`, `R${i}W`, `R${i}B`].forEach((r) => REGISTROS.add(r))
}

const NUMERO = /^-?(0x[0-9a-f]+|0b[01]+|[0-9][0-9a-f]*h|[0-9]+)(?![\w.])/i
const IDENTIFICADOR = /^[a-z_.][\w.]*/i

/**
 * Lenguaje x86-64 (sintaxis Intel) para CodeMirror:
 * etiquetas, mnemónicos, registros, números y comentarios con ';'.
 */
export const asmX86 = StreamLanguage.define({
  name: 'asm-x86',
  startState: () => ({ enOperandos: false }),
  token(stream, state) {
    if (stream.sol()) state.enOperandos = false
    if (stream.eatSpace()) return null

    if (stream.peek() === ';') {
      stream.skipToEnd()
      return 'comment'
    }
    if (stream.match(NUMERO)) return 'number'

    if (stream.match(IDENTIFICADOR)) {
      if (stream.peek() === ':') {
        stream.next()
        return 'def' // definición de etiqueta
      }
      if (REGISTROS.has(stream.current().toUpperCase())) return 'atom'
      if (!state.enOperandos) {
        state.enOperandos = true
        return 'keyword' // mnemónico
      }
      return 'variable' // referencia a etiqueta
    }

    stream.next()
    return null
  },
  languageData: { commentTokens: { line: ';' } },
})