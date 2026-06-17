# TFlix Cineby AT

Standalone Next Generation TizenBrew app for Samsung TVs.

This fork no longer loads `https://www.cineby.at` as the host page. The current Cineby site uses a modern Next.js bundle, ads scripts, and anti-devtool logic that can crash older Tizen WebViews into a black screen. Version `1.5.0` starts a lightweight TV UI from `app/index.html`, fetches catalog metadata from `db.videasy.to`, and launches playback through `player.videasy.to`.

## Features

- Standalone TizenBrew `app` module.
- TV remote navigation with arrows, OK/Enter, and Back.
- Trending, popular movies, popular TV, and search.
- Movie details with direct Videasy player launch.
- TV details with season and episode selection.
- Alternate player fallback button.
- On-screen error diagnostics instead of a silent black screen.

## Installation

1. Open Next Generation TizenBrew on the TV.
2. Go to the module manager.
3. Add this GitHub repository:

   ```text
   https://github.com/NeonSummit/tflix-cineby-at
   ```

4. Restart or refresh TizenBrew if it keeps an older module cache.
5. Launch `TFlix Cineby AT`.

## Usage

- Arrow keys move focus.
- OK/Enter opens the focused item.
- Back returns from player, detail, or search.
- `Alt` in the player switches to the fallback player URL.

## Package Fields

The root `package.json` is configured for TizenBrew app mode:

```json
{
  "packageType": "app",
  "appPath": "app/index.html",
  "serviceFile": "dist/service.js"
}
```

The older `mods/` source is kept in the repository for reference, but it is not the active launch path for this module.

## Development

The standalone app is plain HTML/CSS/JavaScript and does not need a build step:

```text
app/index.html
app/styles.css
app/app.js
```

The legacy service bundle is still present in `dist/service.js` for TV key registration.

## License

MIT

TFlix Cineby AT is a community-created TizenBrew module and is not officially affiliated with Cineby or Videasy.
