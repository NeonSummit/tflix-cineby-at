# TFlix Cineby AT

Standalone Next Generation TizenBrew app for Samsung TVs.

This fork no longer loads `https://www.cineby.at` as the host page. The current Cineby site uses a modern Next.js bundle, ads scripts, and anti-devtool logic that can crash older Tizen WebViews into a black screen. Version `1.7.0` starts a lightweight TV UI from a single-file root `index.html`, renders a fixed 1920x1080 TV stage scaled to the actual WebView, fetches catalog metadata from `db.videasy.to`, and launches playback through `player.videasy.to`.

## Features

- Standalone TizenBrew `app` module.
- TV remote navigation with arrows, OK/Enter, and Back.
- Trending, popular movies, popular TV, and search.
- Movie details with direct Videasy player launch.
- TV details with season and episode selection.
- Alternate player fallback button.
- On-screen error and health diagnostics instead of a silent black screen.

## Installation

1. Open Next Generation TizenBrew on the TV.
2. Go to the module manager.
3. Add this GitHub module name:

   ```text
   NeonSummit/tflix-cineby-at@v1.7.0
   ```

   In TizenBrew this becomes `gh/NeonSummit/tflix-cineby-at@v1.7.0`.
   Do not paste the full `https://github.com/...` URL into the GitHub module field.

4. Restart or refresh TizenBrew if it keeps an older module cache. TizenBrew uses jsDelivr behind the scenes, so the pinned tag above avoids stale branch installs.
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
  "appPath": "index.html",
  "keys": []
}
```

The root `index.html` shows a large `BOOT OK` diagnostic before the inline app JavaScript runs. If that screen stays visible, TizenBrew loaded the module but did not execute inline JavaScript. After boot, the bottom-right health line shows the latest API, focus, remote-control, or player-launch step, which makes TV photos actionable when a model-specific runtime issue remains. The active app uses a fixed 1920x1080 TV stage and scales it to the WebView to avoid partial-width layouts on Samsung TVs. The older `mods/` source is kept in the repository for reference, but it is not the active launch path for this module.

## Development

The standalone app is plain HTML/CSS/JavaScript and does not need a build step. TizenBrew launches the root single-file entrypoint:

```text
index.html
```

The app intentionally does not use a TizenBrew `serviceFile` and leaves manifest `keys` empty, so launch does not depend on model-specific key registration before the app opens. Remote navigation uses the mandatory DOM key events that Samsung TVs expose automatically.

## License

MIT

TFlix Cineby AT is a community-created TizenBrew module and is not officially affiliated with Cineby or Videasy.
