# Paula & Miguel - Proyecto limpio

Esta es una reconstrucción limpia de la web, preparada para seguir creciendo sin romper versiones anteriores.

## Cómo probarla

1. Abre la carpeta `paula-game` en VS Code.
2. Instala la extensión **Live Server** si no la tienes.
3. Clic derecho en `index.html`.
4. Pulsa **Open with Live Server**.

## Flujo de pantallas

1. Selección de jugador.
2. Presentación/intro.
3. Página principal.

Si ya se seleccionó jugador antes, la web lo recuerda con `localStorage` y entra directamente en la presentación.

Para simular primera visita, abre la consola del navegador y ejecuta:

```js
localStorage.removeItem('paulaGame.selectedPlayer');
location.reload();
```

Para borrar todo lo guardado por esta web:

```js
localStorage.clear();
location.reload();
```

## Imágenes

Coloca tus PNG en:

```txt
assets/img/
```

Nombres esperados:

```txt
paula.png
miguel.png
besar.png
besar2.png
morder.png
morder2.png
abrazar.png
abrazar2.png
manitas.png
manitas2.png
```

- `besar.png`, `morder.png`, etc. se usan en modo Paula.
- `besar2.png`, `morder2.png`, etc. se usan en modo Miguel.
- Si falta una imagen, la web muestra un emoji temporal.

## Música y sonidos

Coloca archivos en:

```txt
assets/music/selectcharacter.mp3
assets/music/01.mp3
assets/music/02.mp3
assets/music/03.mp3
assets/sounds/aww.mp3
assets/sounds/sonidobeso.mp3
assets/sounds/click.mp3
```

- En la selección de jugador solo suena `selectcharacter.mp3`.
- Después de la intro, suenan las canciones `01.mp3`, `02.mp3`, etc.
- La canción se elige según el número de visitas guardado para ese jugador.
- El sonido especial de combo de beso es `sonidobeso.mp3`.

Nota: en móviles, el navegador no deja reproducir audio hasta que la persona toca la pantalla.

## Cambiar frases de la intro

Edita `js/config.js`:

```js
introPhrases: [
  'FELIZ ANIVERSARIO',
  'Paula, te quiero',
  'Has sido el rayo de luz que ha iluminado el mes que llevamos juntos.'
]
```

## Spotify

El botón de playlist está en `js/config.js`:

```js
spotifyUrl: 'https://open.spotify.com/'
```

Cambia ese enlace por el de tu playlist.

## Marcadores

Ahora mismo los marcadores están en `localStorage`, es decir, solo en el dispositivo donde se pulsa.

La próxima fase recomendada es conectar Firebase Firestore para que:

- Paula vea lo que Miguel le ha enviado.
- Miguel vea lo que Paula le ha enviado.
- Los marcadores se actualicen online.

