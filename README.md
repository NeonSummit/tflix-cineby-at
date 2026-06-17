# TFlix Cineby AT

Standalone Next Generation TizenBrew app for Samsung TVs.

This fork no longer loads `https://www.cineby.at` as the host page. The current Cineby site uses a modern Next.js bundle, ads scripts, and anti-devtool logic that can crash older Tizen WebViews into a black screen. Version `1.6.0` starts a lightweight TV UI from a single-file root `index.html`, renders a fixed 1920x1080 TV stage scaled to the actual WebView, fetches catalog metadata from `db.videasy.to`, and launches playback through `player.videasy.to`.

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
3. Add this GitHub module name:

   ```text
   NeonSummit/tflix-cineby-at
   ```

   In TizenBrew this becomes `gh/NeonSummit/tflix-cineby-at`.
   Do not paste the full `https://github.com/...` URL into the GitHub module field.

4. Restart or refresh TizenBrew if it keeps an older module cache. TizenBrew uses jsDelivr behind the scenes, so branch installs can stay cached.
5. Launch `TFlix Cineby AT`.

If a pinned ref is needed while testing, use:

```text
NeonSummit/tflix-cineby-at@v1.6.0
```

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
  "appPath": "index.html",
  "serviceFile": "dist/service.js"
}
```

The root `index.html` shows a large `BOOT OK` diagnostic before the inline app JavaScript runs. If that screen stays visible, TizenBrew loaded the module but did not execute inline JavaScript. The active app uses a fixed 1920x1080 TV stage and scales it to the WebView to avoid partial-width layouts on Samsung TVs. The older `mods/` source is kept in the repository for reference, but it is not the active launch path for this module.

## Development

The standalone app is plain HTML/CSS/JavaScript and does not need a build step. TizenBrew launches the root single-file entrypoint:

```text
index.html
```

The legacy service bundle is still present in `dist/service.js` for TV key registration.

## License

MIT

TFlix Cineby AT is a community-created TizenBrew module and is not officially affiliated with Cineby or Videasy.
