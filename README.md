# PlexThing

A Plex music controller app for DeskThing (Spotify Car Thing).

## Features

- 🎵 Browse your Plex music library (Artists → Albums → Tracks)
- 🔍 Search your library
- 🎮 Control playback on Plexamp or other Plex players
- 📺 Now Playing display with album artwork
- 🎨 Optimized for Car Thing touchscreen display

## Requirements

- DeskThing Server installed on your computer
- Plex Media Server (local or remote)
- Plex player (Plexamp recommended)
- Spotify Car Thing (flashed with DeskThing firmware)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Plex connection (in app settings):
   - Plex Server URL (e.g., `http://localhost:32400`)
   - Plex Token (Settings → Advanced → Show Token)

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for distribution:
   ```bash
   npm run build
   ```

5. Load the built ZIP file into DeskThing Server

## Development

See `DEVELOPMENT_PLAN.md` for detailed development roadmap.

## License

MIT
