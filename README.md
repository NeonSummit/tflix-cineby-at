# TFlix Cineby AT

Private TizenBrew module that opens the current [Cineby.at](https://www.cineby.at/) site and makes it more usable on Samsung TVs.

This fork is tuned for Next Generation TizenBrew and the Cineby `cineby.gd` to `cineby.at` migration. It keeps the original remote navigation and video-control work, but removes the old `cineby.gd` hostname gates and avoids DOM APIs that are risky on older Tizen WebViews.

## Features

- **TV-Remote Friendly Navigation** - Navigate using only the directional keys
- **Enhanced Visual Focus** - Clear indicators showing selected elements
- **Streamlined Video Playback** - Control playback with media keys on your remote
- **Smart Navigation** - Natural movement between elements with arrow keys
- **Automatic Scrolling** - Scrolls the page when navigating outside visible area
- **Visual Enhancements** - Focus highlighting and scaling for better visibility

## Installation

### Prerequisites

- Samsung Tizen TV with TizenBrew installed
- Internet connection

### Installing from npm (Recommended)

1. On your TV with Next Generation TizenBrew installed, open the module manager.
2. Add this private GitHub repository as a module.
3. Open `TFlix Cineby AT`; it should launch `https://www.cineby.at`.

### Manual Installation

1. Build the module:
   ```
   ./build.bat
   ```

2. Package the module for TizenBrew:
   - Copy the entire TFlix folder to your TizenBrew modules directory
  - Alternatively, package the repository as a ZIP file and install it via TizenBrew if your build supports local module imports.

3. Open TizenBrew on your TV and select TFlix from the modules list

## Usage

- Use the directional keys (up, down, left, right) on your TV remote to navigate
- Press OK/Enter to select items
- Use media keys (Play, Pause, etc.) to control video playback
- Press Back to return to previous screens

## Development

### Project Structure

- `mods/` - Contains the JavaScript modules for enhancing Cineby.at
- `service/` - Contains the service code for handling TV functionality
- `dist/` - Contains the built module files

### Building

To build the project, run:

```
./build.bat
```

This will install dependencies and build both the mods and service modules.

## License

MIT

---

*TFlix Cineby AT is a private community-created module for TizenBrew and is not officially affiliated with Cineby.*
