# DOC ROI — Treatment Pill: Objectives & Initiatives

Aplicación HTML estática publicada automáticamente con Vercel.

## Fuente oficial

- Repositorio: `docr-ROI-diagostic-ecuacion-KAI/doc-roi-treatment-pill-objectives-initiatives`
- Rama de producción: `main`
- Archivo que se publica: `/index.html`
- URL de producción: https://doc-roi-treatment-pill-objectives-i.vercel.app/

## Configuración correcta en Vercel

En **Project Settings → Build and Deployment**:

| Opción | Valor |
|---|---|
| Framework Preset | Other |
| Root Directory | `./` |
| Build Command | Vacío |
| Output Directory | Vacío |
| Install Command | Vacío |
| Production Branch | `main` |
| Automatic Deployments | Activados |

Vercel debe estar conectado a este repositorio exacto. Cada cambio confirmado en `main` debe crear automáticamente un nuevo despliegue de producción.

## Regla esencial del proyecto

El archivo final siempre debe llamarse exactamente:

```text
index.html
```

Debe estar en la raíz del repositorio. No debe conservarse únicamente con un nombre como `DOC_ROI_...html`, porque Vercel usa `index.html` como entrada de la aplicación.

## Codificación UTF-8

El HTML debe guardarse como UTF-8 y contener al principio de `<head>`:

```html
<meta charset="utf-8">
```

Los separadores deben escribirse así:

```html
STRATEGY SPECIALIZATION · MARKET RESEARCH STRATEGY
TREATMENT · PILL · OBJECTIVES & INITIATIVES
```

Si aparece `Â·`, el archivo fue guardado o interpretado con una codificación incorrecta. No se debe reemplazar por `Â·`; debe conservarse únicamente `·`, o usarse `&middot;`.

## Cómo publicar una nueva versión

1. Abrir el repositorio en GitHub.
2. Sustituir el archivo raíz `index.html` por el HTML final.
3. Confirmar que el nombre siga siendo `index.html`.
4. Hacer el commit directamente en `main`.
5. Abrir Vercel y comprobar que el nuevo deployment llegue a estado **Ready**.
6. Verificar la URL de producción en una ventana privada para evitar caché del navegador.

## Comprobación rápida antes de publicar

- El documento comienza con `<!doctype html>`.
- Existe `<meta charset="utf-8">`.
- El título del navegador es `DOC ROI Objectives & Initiatives`.
- Los separadores se ven como `·`, nunca como `Â·`.
- El favicon está definido.
- No hay otro archivo HTML que Vercel pueda confundir con la entrada principal.
- La rama conectada en Vercel es `main`.

## Recuperación

Si un despliegue falla, no debe borrarse el proyecto de Vercel. Se puede seleccionar el último deployment correcto y usar **Promote to Production**, o revertir el último commit defectuoso en GitHub.
