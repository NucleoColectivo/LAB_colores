# Fase 0 — Auditoría técnica y baseline

**Proyecto:** NÚCLEO COLECTIVO · VISUAL LAB  
**Rama de trabajo:** `backup/visual-lab-migration-plan`  
**Alcance:** inspección estática del repositorio; sin cambios funcionales ni despliegues.

## 1. Estado de seguridad

- La auditoría se realizó sobre la rama de respaldo.
- No se modificó `main`.
- No se eliminaron, renombraron ni migraron archivos.
- No se desplegó la aplicación.
- No se copiaron valores de secretos ni datos personales al presente informe.

## 2. Stack y comandos disponibles

| Elemento | Hallazgo |
|---|---|
| UI | React 19 |
| Lenguaje | TypeScript |
| Bundler/dev server | Vite 8 |
| Estilos | Tailwind CSS 4 mediante plugin de Vite |
| IA | `@google/genai` |
| Backend | Express 4 en `server.ts` |
| Runtime de desarrollo | `tsx` |
| Package manager lock | `bun.lock` |
| Build | `npm run build` → `vite build` |
| Verificación TypeScript | `npm run lint` → `tsc --noEmit` |
| Desarrollo | `npm run dev` → `tsx server.ts` |
| Inicio producción | `npm start` → `node server.ts` |

**Nota de validación:** estos comandos se leyeron de `package.json`. No se ejecutaron en un entorno local del repositorio durante esta auditoría; por tanto, no se declara que build o TypeScript estén aprobados. La compatibilidad del comando `node server.ts` con el runtime de despliegue también queda pendiente de prueba.

## 3. Inventario de arquitectura

### Aplicación y componentes

- `src/App.tsx` concentra navegación por hash, estado global, sincronización de datos y composición de módulos.
- `src/components/Header.tsx` mantiene navegación desktop/móvil para Bienvenida, Herramientas, Sistema, Avances y QR.
- `src/components/VisualPromptLab.tsx` existe como módulo autónomo con 40 fichas iniciales, búsqueda, filtro por modo/categoría, favoritos en localStorage, combinación de recursos, copia y exportación TXT.
- La importación e integración de `VisualPromptLab` en `App.tsx` no está presente en el estado inspeccionado.
- Se identificaron componentes comunitarios, de taller, perfiles, QR, notificaciones, avances, proyector y sistema creativo. Se conservarán durante la reorganización.

### Backend y endpoints detectados

| Método | Ruta | Función |
|---|---|---|
| GET / POST / DELETE | `/api/contributions` | Lectura, registro y borrado de participantes |
| GET / POST / DELETE | `/api/advances` | Lectura, creación y borrado de avances |
| DELETE | `/api/advances/:id` | Borrado individual de avance |
| GET / POST | `/api/creative-system/project` | Lectura y guardado del proyecto creativo |
| POST | `/api/creative-system/assist` | Asistencia mediante Gemini o respuesta alternativa |

### Persistencia y riesgos

1. `server.ts` lee y escribe `data/contributions.json`, `data/advances.json` y `data/creative-project.json` directamente con el sistema de archivos.
2. Esa estrategia no debe considerarse persistente en despliegues serverless. No migrar ni borrar estos datos hasta elegir destino, exportar respaldo y probar reconciliación.
3. Los JSON de datos contienen información de participantes y proyecto. Los datos de contacto son información personal: revisar si esos archivos deben permanecer versionados en Git, limitar su exposición y definir controles de acceso/consentimiento. Este informe no reproduce sus valores.
4. La ruta DELETE de participantes borra el contenido persistido; debe protegerse con autorización antes de una publicación abierta.
5. Los endpoints de escritura necesitan validación de esquema, autorización, límites de abuso y respuestas de error consistentes antes de producción.
6. La API de Gemini lee `GEMINI_API_KEY` desde el entorno. El repositorio incluye `.env.example` con nombres y placeholders, no se copiaron secretos al informe.
7. El backend es un servidor Express de proceso único. No hay evidencia en los archivos inspeccionados de una capa serverless o de almacenamiento externo ya configurada.

## 4. Datos y assets

Los tres archivos JSON existen y son JSON válido en la rama auditada:

| Archivo | Estructura | Registros |
|---|---|---:|
| `data/contributions.json` | Array | 1 |
| `data/advances.json` | Array | 1 |
| `data/creative-project.json` | Objeto | — |

Los recuentos son una fotografía del repositorio en esta rama, no una garantía de que representen los datos actuales de producción.

Se verificó la presencia de cuatro PDF en `public/assets/aistudio/`:

- `biblioteca_prompts_generacion_imagenes_nucleo_colectivo_6a75b27d.pdf`
- `guia_parte1_prompts_generacion_imagen_video_nucleo_colectivo_27ed0461.pdf`
- `guia_practica_fotografia_IA_JSON_nucleo_colectivo_bee3d37d.pdf`
- `Planeacion_Taller_Medios_Digitales_IA_Casa_Los_Colores.docx_8c5c37b9.pdf`

Se verificó su presencia en el árbol Git; la apertura visual, integridad interna y enlaces desde la interfaz quedan pendientes de prueba en navegador.

## 5. Configuración y observaciones

- `vite.config.ts` usa los plugins React y Tailwind, alias `@` y una opción de HMR específica para AI Studio.
- `tsconfig.json` configura resolución `bundler`, JSX React y no emite archivos.
- `.gitignore` excluye `.env*` salvo `.env.example`, además de `node_modules` y `dist`.
- `index.html` conserva el título anterior “Laboratorio de Ideas” y declara el documento en inglés (`lang="en"`); ambos deberán alinearse con la identidad y el contenido en español durante la fase de shell.
- No se encontró `vercel.json` ni `firebase.json` en la raíz de esta rama durante la comprobación. Esto no demuestra por sí solo cómo está configurado el proyecto en los paneles externos.

## 6. Bloqueos y tareas antes de modificar componentes

### Prioridad crítica
- [ ] Confirmar qué datos son reales y vigentes en el entorno de producción; no asumir que los JSON versionados son el origen actual.
- [ ] Exportar una copia de seguridad de datos desde la fuente real y custodiarla fuera del repositorio.
- [ ] Revisar exposición de información personal en Git y definir acceso, retención y consentimiento.
- [ ] Definir el destino de persistencia compatible con el hosting antes de cambiar APIs.

### Prioridad alta
- [ ] Ejecutar instalación reproducible con el package manager acordado y lockfile.
- [ ] Ejecutar `npm run lint` y `npm run build` (o equivalentes con Bun) y registrar logs completos.
- [ ] Levantar la app y probar todos los endpoints, incluyendo escrituras y borrados, con datos de prueba.
- [ ] Verificar runtime de producción: `node server.ts`, Express, rutas SPA y disponibilidad de almacenamiento.
- [ ] Verificar integridad y apertura de los cuatro PDF.
- [ ] Revisar validación/autorización de endpoints y configuración de CORS/headers según el hosting.

### Prioridad media
- [ ] Corregir metadatos de idioma y título en la fase visual.
- [ ] Añadir pruebas automatizadas para navegación, biblioteca y constructor.
- [ ] Verificar accesibilidad por teclado, contraste, foco y comportamiento responsive.

## 7. Resultado de Fase 0

**Auditoría estática: completada.**  
**Build y TypeScript: pendientes de ejecución local.**  
**Pruebas de navegador/API: pendientes.**  
**Migración de persistencia: no iniciada.**  
**Cambios funcionales: ninguno.**  
**Producción: sin cambios.**

### Recomendación

No iniciar todavía la migración de datos ni abrir el rediseño de navegación como cambio funcional. El siguiente paso seguro es ejecutar baseline local y confirmar respaldo/estado real de los datos. Una vez resueltos esos puntos, se puede avanzar con la Fase 1 en esta misma rama.
