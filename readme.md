# Armin, Simply the best

Página de fan de Armin van Buuren: trayectoria, seis sesiones en directo y diez canciones
imprescindibles.

## Requisitos

- Node.js y `pnpm` (la versión se fija en `package.json` mediante `packageManager`).

## Puesta en marcha

```bash
pnpm install
pnpm dev
```

El servidor de desarrollo se abre en `http://localhost:5173` (Vite usa `src/` como raíz).

## Comandos

| Comando        | Descripción                                        |
| -------------- | -------------------------------------------------- |
| `pnpm dev`     | Servidor de desarrollo                             |
| `pnpm build`   | Genera la versión de producción en `dist/`          |
| `pnpm deploy`  | Compila y publica `dist/` en GitHub Pages          |
| `pnpm check`   | Lint de JS y CSS + comprobación de formato          |
| `pnpm fix`     | Aplica correcciones automáticas de lint y formato   |

## Estructura

```
src/
  index.html          Marcado semántico de la página
  main.js             Punto de entrada: importa estilos e inicializa módulos
  css/
    main.css          Punto de entrada de estilos (importa el resto en orden)
    base.css          Variables, reset y tipografía
    utilities.css     Helpers, botones e icono de YouTube con tooltip
    header.css        Skip link, cabecera, navegación y botón de menú móvil
    hero.css          Portada
    layout.css        Secciones, trayectoria, pie con mapa de sitio y volver arriba
    cards.css         Sesiones y tarjetas de enlaces
    embed.css         Fachada lazy de YouTube
    tracks.css        Listado de canciones
    states.css        Revelado al scroll, resaltado de :target y movimiento reducido
    responsive.css    Puntos de ruptura y panel de menú móvil
  modules/
    embeds.js         Fachadas de vídeo y carga diferida del iframe
    mobile-menu.js    Apertura y cierre del menú móvil
    scroll-spy.js     Marca con `aria-current` la sección visible
    scroll-top.js     Botón de volver arriba
    surprise.js       Botón «Sorpréndeme»: salta a una sesión o canción aleatoria
    waveform.js       Barras decorativas del hero
  public/
    robots.txt        Directivas para rastreadores
    sitemap.xml       Mapa de sitio para motores de búsqueda
```

Los estilos son CSS nativo (sin frameworks) y el JavaScript son módulos ESM.
Se prioriza el HTML estático y el progressive enhancement: sin JavaScript se ve todo el
contenido, y los vídeos solo cargan el iframe cuando se pulsa sobre su miniatura.
