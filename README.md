# ASM Emulator – Frontend

Interfaz (Vue 3 + Vite) del emulador didáctico de ensamblador x86-64
con traducción a C++. Consume la API de `asm-emulator-backend`.

## Requisitos
- Node 22 LTS o superior
- Backend corriendo en `http://localhost:8080`

## Ejecutar
```bash
npm install
npm run dev
```
Abre `http://localhost:5173`.

## Scripts
| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run test:unit` | Pruebas con Vitest |
| `npm run lint` | ESLint |

## Configuración
`VITE_API_BASE_URL` en `.env.development` (por defecto `http://localhost:8080/api`).

