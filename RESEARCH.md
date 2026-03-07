# DeskThing Plex Music App - Research

**Research Date:** March 6, 2026  
**Research Purpose:** Evaluate effort to build a Plex music listening and control app for DeskThing

---

## What is DeskThing?

[DeskThing](https://deskthing.app/) is an open-source project that upcycles the discontinued Spotify **Car Thing** (a small touchscreen device originally made by Spotify) into a versatile desktop assistant. It replaces Spotify's firmware with custom software that can run various community-made apps.

- **Community:** 5,000+ Discord members, 208K+ server downloads, 1.1M+ app downloads
- **Developer:** Riprod
- **Platform:** Electron-based desktop app + web interface for the Car Thing device

---

## DeskThing App Architecture

### App Structure

```
my-deskthing-app/
├── src/            # React frontend (runs on the Car Thing display)
├── public/         # Static assets, manifest.json
└── server/         # Backend code (runs on your computer)
    └── index.ts    # Server-side logic
```

### Tech Stack

- **Frontend:** React (runs in a Chromium-based webview on the Car Thing)
- **Backend:** TypeScript/Node.js (runs on the desktop)
- **Communication:** IPC between server and client via `@deskthing/types`
- **Build:** Creates a zip file you load into DeskThingServer

### Creating an App

```bash
# Create new app from template
npm create deskthing@latest

# Development
npm run dev      # Start dev server
npm run build    # Build for distribution
```

### Reference Apps

The existing **Spotify App** (35.9K downloads) is the closest analog to what a Plex app would need to do:
- Display currently playing track, album, artist
- Show album artwork
- Control playback (play, pause, skip, rewind)
- Handle shuffle, repeat
- Navigate library

---

## Plex API Capabilities

### Official API Documentation

- **Plex Media Server API:** https://developer.plex.tv/
- **Python PlexAPI:** https://python-plexapi.readthedocs.io/
- **Remote Control API:** https://github.com/plexinc/plex-media-player/wiki/Remote-control-API

### Key API Endpoints for Music

#### 1. **Get Music Library Sections**
```
GET http://{ip}:32400/library/sections?X-Plex-Token={token}
```

#### 2. **Get All Artists**
```
GET http://{ip}:32400/library/sections/{section_id}/all?X-Plex-Token={token}
```

#### 3. **Get Albums for Artist**
```
GET http://{ip}:32400/library/metadata/{artist_id}/children?X-Plex-Token={token}
```

#### 4. **Get Tracks for Album**
```
GET http://{ip}:32400/library/metadata/{album_id}/children?X-Plex-Token={token}
```

#### 5. **Playback Control Commands**
The Plex Remote Control API supports:
- `/player/playback/play` - Start playing
- `/player/playback/pause` - Pause playback
- `/player/playback/skipNext` - Next track
- `/player/playback/skipPrevious` - Previous track
- `/player/playback/stop` - Stop playback
- `/player/playback/seekTo?offset=xxx` - Seek to position (ms)
- `/player/playback/setParameters?volume=0-100&shuffle=0/1&repeat=0/1/2`

#### 6. **Timeline Subscriptions**
```
GET /player/timeline/subscribe
POST /:/timeline (receives playback state updates)
```

### Important Notes on Plex Music Control

1. **Two approaches to control:**
   - **Remote control existing Plex player** (like Plexamp, web app) - This is the Remote Control API
   - **Direct playback from your app** - Would need to stream from Plex's `/library/parts/{id}` endpoints

2. **The Remote Control API** requires:
   - Player must advertise itself as a Plex player
   - Subscription via timeline/subscribe
   - Commands sent with `X-Plex-Client-Identifier` header

3. **Metadata available:**
   - Track title, album, artist
   - Album artwork URLs (via `/library/metadata/{id}/thumb`)
   - Duration, bitrate, codec
   - Play count, ratings
   - Sonic Analysis data (BPM, key, loudness) - Plex Pass feature

---

## Level of Effort Assessment

### Scope Options

#### Option A: "Now Playing" + Basic Controls (Remote Control Mode)
**Estimated: 1-2 weekends**

**Features:**
- Display currently playing track from an existing Plex player
- Show album artwork
- Basic controls: play/pause, skip, previous
- Volume control

**Why this scope:**
- Leverages Plex's Remote Control API
- Similar to existing Spotify app architecture
- No audio streaming complexity

**Key tasks:**
1. Set up DeskThing app template
2. Implement Plex server connection (token + server address)
3. Subscribe to player timeline updates
4. Display artwork + metadata on the Car Thing screen
5. Map buttons to control commands
6. Handle player discovery (select which Plex player to control)

#### Option B: Full Music Browser + Remote Control
**Estimated: 2-3 weeks**

**Features:**
- Browse artists, albums, tracks
- Search library
- Select and play music (sends to a player)
- Queue management
- Quick access to recently played

**Additional tasks:**
- Implement library browsing UI (artists → albums → tracks)
- Cache/preload artwork for display
- Handle library refresh state
- Search implementation

#### Option C: Standalone Player (Direct Audio Streaming)
**Estimated: 4-6+ weeks**

**Features:**
- Browse library directly
- Stream and play audio through the computer/connected audio
- Full player functionality without another Plex client

**Why this is harder:**
- Audio streaming from Plex requires handling transcoding/quality selection
- Must implement actual audio player on the host computer
- More state management (buffering, seeking, etc.)
- Legal considerations around downloads/caching

---

## Technical Considerations

### Challenges

1. **Player Discovery:** The DeskThing app would need to either:
   - Target a specific Plex player (requires user setup)
   - Discover available players on the network (via GDM or polling `/clients`)

2. **Token Management:** User needs to provide Plex token (manual setup or OAuth flow)

3. **Artwork Caching:** Album artwork should be cached locally for smooth UI

4. **Navigation:** The Car Thing has limited buttons (4 physical buttons + touchscreen). Need efficient UI design.

5. **Button Mapping:** DeskThing allows configuring physical buttons to actions - this would need documentation

### Existing Resources to Reference

| Resource | URL | Why Useful |
|----------|-----|------------|
| DeskThing GitHub | https://github.com/ItsRiprod/DeskThing | Core architecture |
| Deskthing-Apps | https://github.com/ItsRiprod/Deskthing-Apps | Reference app implementations |
| App Template | https://github.com/itsriprod/deskthing-template | Starting point |
| DeskThing Wiki | https://github.com/ItsRiprod/Deskthing-Apps/wiki | App development docs |
| Car Thing Wiki | https://carthing.wiki/thinglabs-apps/deskthing/introduction/ | Hardware setup |
| Plex Remote Control API | https://github.com/plexinc/plex-media-player/wiki/Remote-control-API | Playback commands |
| Plexopedia API Docs | https://www.plexopedia.com/plex-media-server/api/ | API examples |

---

## Recommendation

### Recommended Scope: Option B (Full Browser + Remote Control)

This provides a complete, useful experience without the complexity of building a full audio player.

**Why not Option A:** Basic control is too limited - you'd still need your phone/computer to select music.

**Why not Option C:** Overkill - you likely already have Plexamp or a Plex client. Just need a nice physical controller for it.

### Implementation Priority

**Phase 1 (Weekend 1):**
- [ ] Scaffold app with `npm create deskthing@latest`
- [ ] Implement Plex token + server URL input
- [ ] Connect to Plex and retrieve basic library info
- [ ] Display test metadata on screen

**Phase 2 (Weekend 2):**
- [ ] Implement player discovery/subscription
- [ ] Display currently playing track + artwork
- [ ] Basic controls (play/pause, skip, prev)

**Phase 3 (Weekends 3-4):**
- [ ] Library browsing (Artists → Albums → Tracks)
- [ ] Search functionality
- [ ] Queue view/management
- [ ] Settings screen (button mapping, prefs)

---

## Risk Factors

1. **Audio Quality:** Remote control doesn't affect how the audio plays - it just controls another player. This is fine for most use cases.

2. **Plexamp Integration:** Plexamp is the desktop music player - need to ensure it properly exposes itself to the Remote Control API (it should).

3. **Sync Issues:** Timeline updates are every 1-30 seconds. UI won't be frame-perfect but will be functional.

4. **Community App:** This would be a community app, not an official DeskThing app. Distribution via the community app store.

---

## Alternatives Worth Considering

1. **Controller for Plexamp specifically** - Could simplify by targeting just Plexamp if that's Zach's primary player

2. **Custom "Now Playing" view** - Just a nice display of what's playing, less interaction

3. **Hybrid approach** - Use existing Local Audio app to see what's playing, but control Plex via separate mechanism

---

## Conclusion

**Moderate effort project.** If you're comfortable with TypeScript/React and have experience with REST APIs, this is very achievable.

The biggest value-add is the physical hardware (Car Thing) + good UX. The technical challenges are well-understood and there are good reference implementations.

**Go/No-Go Criteria:**
- ✅ You have or can get a Car Thing
- ✅ You use Plex for music regularly
- ✅ You have Plexamp or another Plex player you want to control
- ✅ You're okay with community/self-hosted app (not official)

**Next Step:** If proceeding, start by buying/flashing a Car Thing, then build Phase 1 to validate the concept.

---

## Related Projects

- [DeskThing-GMP](https://github.com/RandomDebugGuy/DeskThing-GMP) - Global Media Player, controls local playback (similar concept, different media source)
- Existing Plex desktop players on Reddit - several communities have discussed this use case

---

**Questions? Reach out on the DeskThing Discord or Plex subreddits.**
