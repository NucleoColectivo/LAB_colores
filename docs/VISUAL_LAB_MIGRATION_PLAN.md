# Plan de migración — Núcleo Colectivo · Visual Lab

**Estado:** propuesta aprobada; planificación únicamente  
**Rama:** `backup/visual-lab-migration-plan`  
**Base:** `main`  
**Regla de seguridad:** no modificar `main`, no eliminar módulos existentes y no desplegar a producción durante esta etapa.

## 1. Dirección de producto y marca

**Marca principal:** NÚCLEO COLECTIVO · VISUAL LAB  
**Descriptor:** Photography · Cinematography · Generative Visual Arts

Visual Lab será la experiencia principal para aprender, investigar y producir con lenguaje visual y audiovisual. Núcleo Colectivo conserva la dimensión comunitaria, educativa y colaborativa.

## 2. Objetivos

1. Convertir el catálogo de prompts en una biblioteca educativa y de producción.
2. Dar protagonismo a fotografía, cinematografía, iluminación, óptica, color, movimiento y sonido.
3. Crear un constructor modular de prompts para imagen y video.
4. Integrar los documentos PDF existentes como recursos de Academy.
5. Preservar los módulos de comunidad, talleres y proyectos.
6. Mantener la arquitectura React + TypeScript + Vite y la integración Gemini, mejorando persistencia y seguridad antes de ampliar producción.

## 3. Inventario y decisión de conservación

| Área existente | Decisión | Trabajo previsto |
|---|---|---|
| React, TypeScript, Vite, Tailwind | Conservar | Reorganizar por dominios sin reescritura total |
| Header, Hero, WelcomeSection | Rediseñar | Nueva identidad y navegación |
| AiToolsSection / AiToolsLibrary | Conservar | Reubicar en Comunidad/Recursos o Academy |
| VisualPromptLab.tsx | Conservar y ampliar | Integrarlo en App y convertirlo en módulo principal |
| CreativeSystemSection | Conservar | Mantener fichas, rutas, catálogo y espacio de proyecto |
| ParticipantForm, UserNetwork, UserAuthProfileModal | Conservar | Mantener registro, red y perfiles |
| CoCreationAdvances | Conservar | Mantener aportes y avances colectivos |
| NotificationCenterModal / Toast | Conservar | Validar eventos tras reorganizar navegación |
| ConnectionQR | Conservar | Revisar URL de destino y comportamiento multidispositivo |
| ProjectorModal | Conservar | Adaptar a presentaciones de biblioteca y talleres |
| WorkshopRoute / WelcomeModal | Conservar | Reubicar como recursos de Academy/Comunidad |
| Gemini API | Conservar | Revisar límites, validación y protección de secretos |
| JSON de participantes, avances y proyecto | Preservar | Respaldar y migrar con verificación |
| PDF existentes en public/assets/aistudio | Conservar | Integrar en Academy sin moverlos hasta validar rutas |

## 4. Arquitectura de información propuesta

### Navegación principal
1. Inicio
2. Biblioteca
3. Fotografía
4. Video
5. Color & Light
6. Prompt Builder
7. Academy
8. Comunidad
9. Colecciones

### Módulos
- **Visual Lab:** biblioteca, filtros, fichas y referencias.
- **Photography:** géneros, cámaras, sensores, óptica, exposición, iluminación, composición y textura.
- **Cinematography:** movimientos, planos, continuidad, FPS, edición, transiciones y sonido.
- **Color & Light:** temperatura, balance de blancos, exposición, esquemas de luz y color grading.
- **Prompt Builder:** composición por bloques, prompts negativos, idioma, presets, copia y exportación.
- **Academy:** guías PDF, glosario, tutoriales, ejercicios y rutas por nivel.
- **Comunidad:** participantes, proyectos, avances, notificaciones, QR y proyector.
- **Colecciones:** favoritos y conjuntos guardados.

## 5. Modelo de datos para la biblioteca

Cada ficha deberá incluir:
- id estable y slug;
- nombre ES/EN;
- dominio, categoría y subcategoría;
- tipo: parámetro técnico, técnica, concepto descriptivo o referencia estética;
- comando o término;
- definición didáctica;
- ejemplo de prompt;
- etiquetas;
- campos compatibles con imagen, video o ambos;
- referencias visuales con procedencia/licencia;
- notas de compatibilidad, evitando prometer soporte universal entre modelos.

Los recursos actuales de VisualPromptLab (40 fichas) serán la semilla. La meta de expansión se hará por lotes revisados; la cifra objetivo de 420 es una meta editorial, no un requisito de lanzamiento.

## 6. Estructura técnica objetivo

La reorganización se hará gradualmente. Estructura orientativa:

```text
src/
  modules/
    visual-lab/
    photography/
    cinematography/
    color-light/
    prompt-builder/
    academy/
    collections/
  community/
    participants/
    projects/
    advances/
    notifications/
  services/
  hooks/
  types/
  utils/
  styles/
data/
  visual-library/
    photography.json
    cameras.json
    lenses.json
    lighting.json
    color.json
    video.json
    motion.json
    vfx.json
    sound.json
```

No mover archivos hasta comprobar imports, rutas y referencias. No crear duplicados de componentes existentes.

## 7. Persistencia y backend: riesgo prioritario

La implementación actual de `server.ts` escribe datos mediante `fs` en `data/` para participantes, avances y proyecto creativo. No se debe asumir que esas escrituras serán persistentes en un despliegue serverless.

Antes de cambiar despliegue:
1. documentar endpoints y formatos actuales;
2. exportar y respaldar los JSON actuales;
3. definir almacenamiento persistente compatible con el hosting;
4. migrar y comparar recuentos/IDs;
5. probar lectura, creación, actualización y borrado;
6. mantener estrategia de rollback.

No cambiar de base de datos ni borrar JSON hasta aprobar el destino y verificar la migración.

## 8. Identidad visual y accesibilidad

- Base editorial oscura, tipografía legible y acentos lima.
- Mantener contraste suficiente y estados de foco visibles.
- Diseño responsive desde móvil.
- Controles operables por teclado y etiquetas accesibles.
- Fichas con jerarquía clara, texto explicativo y ejemplos copiables.
- Evitar que el color sea el único indicador de categoría o estado.
- Respetar derechos, licencias y atribución de imágenes de referencia.

## 9. Fases de implementación

### Fase 0 — Seguridad y baseline
- Registrar commit base y rama de trabajo.
- Capturar inventario de rutas, componentes, APIs, datos y assets.
- Ejecutar build y TypeScript baseline.
- Crear copias exportables de JSON y verificar PDFs.
- Registrar variables de entorno requeridas sin copiar secretos al repositorio.

### Fase 1 — Shell de marca y navegación
- Crear sistema de navegación nuevo.
- Diseñar portada de Núcleo Colectivo · Visual Lab.
- Añadir rutas/estados para módulos.
- Integrar VisualPromptLab en el flujo principal.
- Mantener rutas antiguas o accesos equivalentes.

### Fase 2 — Biblioteca
- Separar datos del componente UI.
- Normalizar las 40 fichas existentes.
- Implementar búsqueda, filtros combinables, etiquetas y favoritos.
- Incorporar vistas por fotografía, video y dominio.
- Añadir fichas accesibles y referencias verificadas.

### Fase 3 — Prompt Builder
- Constructor de imagen y video.
- Orden y edición de bloques.
- Campos de sujeto, acción, escenario, medio, estilo, luz, composición y movimiento.
- Prompts negativos y control de idioma.
- Copiar, exportar TXT y JSON.
- Guardar presets localmente; sincronización solo tras definir backend.

### Fase 4 — Academy
- Integrar los cuatro PDF ya existentes.
- Crear glosario y recorridos didácticos.
- Añadir ejercicios y ejemplos.
- Verificar accesibilidad, enlaces y atribuciones.

### Fase 5 — Comunidad y datos
- Reintegrar módulos comunitarios bajo la nueva identidad.
- Resolver persistencia serverless.
- Migrar datos con validación y rollback.
- Probar QR, perfiles, notificaciones, avances y proyector.

### Fase 6 — QA y publicación controlada
- TypeScript, build y lint.
- Pruebas de navegación, filtros, constructor y exportación.
- Pruebas responsive y accesibilidad.
- Pruebas API y sincronización multidispositivo.
- Preview deployment separado.
- Aprobación explícita antes de merge o producción.

## 10. Criterios de aceptación

- [ ] `main` no recibe cambios durante la migración.
- [ ] Los módulos existentes siguen disponibles.
- [ ] Los datos de participantes, avances y proyectos están respaldados.
- [ ] Los PDF siguen accesibles.
- [ ] Visual Lab es la entrada principal.
- [ ] La biblioteca tiene búsqueda y filtros combinables.
- [ ] Favoritos sobreviven a recarga.
- [ ] El constructor combina, copia y exporta.
- [ ] Comunidad y proyector funcionan.
- [ ] Persistencia probada en el hosting objetivo.
- [ ] Build y TypeScript pasan.
- [ ] No hay secretos ni credenciales en el repositorio.
- [ ] La publicación se realiza solo después de aprobación.

## 11. Fuera de alcance de esta etapa

- No modificar `main`.
- No borrar ni renombrar componentes existentes.
- No sustituir la API ni migrar datos sin respaldo.
- No desplegar cambios de producción.
- No ampliar masivamente el catálogo sin revisión editorial.
- No cambiar el dominio ni configuración DNS.

## 12. Próximo paso técnico

Completar la Fase 0 en esta rama: validar el estado base con build/TypeScript, inventariar datos y rutas, y preparar una propuesta de navegación/portada antes de tocar componentes funcionales.
