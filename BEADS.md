# PlexThing - Beads (Task Tracking)

**Beads** = Discrete units of work with clear acceptance criteria

Each bead is a single-issue task that's completable in one sitting (1-3 hours).

---

## Active Beads

_The next bead to work on._

| Bead ID | Issue | Title | Status | Notes |
|---------|-------|-------|--------|-------|
| #4 | [#9](https://github.com/zachatrocity/plexthing/issues/9) | Build artist list view | 🔧 Ready | Can start browsing UI |

---

## Ready for Pickup

| Bead ID | Issue | Title | Estimate | Priority |
|---------|-------|-------|----------|----------|
| #4 | [#9](https://github.com/zachatrocity/plexthing/issues/9) | Build artist list view | 3-4h | Medium |
| #5 | [#10](https://github.com/zachatrocity/plexthing/issues/10) | Implement navigation (Artist → Album → Track) | 3-4h | Medium |
| #6 | [#11](https://github.com/zachatrocity/plexthing/issues/11) | Build Now Playing screen | 4-5h | Medium |
| #7 | [#12](https://github.com/zachatrocity/plexthing/issues/12) | Implement timeline subscription | 3-4h | High |

---

## Completed Beads

| Bead ID | Issue | Title | Completed | Notes |
|---------|-------|-------|-----------|-------|
| #0 | - | Initialize project from template | 2026-03-06 | Repo created |
| #1 | [#1](https://github.com/zachatrocity/plexthing/issues/1) | Update package.json with proper app metadata | 2026-03-06 | Branding + settings schema |
| #2 | [#7](https://github.com/zachatrocity/plexthing/issues/7) | Create Plex API client module | 2026-03-06 | Full TypeScript client |
| #3 | [#8](https://github.com/zachatrocity/plexthing/issues/8) | Build settings/config UI | 2026-03-06 | React settings + connection UI |

---

## Backlog (Future Beads)

### Milestone 2: Music Library Browser
- #4: Build artist list view (estimate: 3-4h) - **Next up**
- #5: Implement navigation (Artist → Album → Track) (estimate: 3-4h)
- Album grid view
- Track list view
- Album detail view
- Search functionality
- Artwork caching
- Empty states
- Loading states

### Milestone 3: Player Discovery
- #7: Implement timeline subscription for playback state (estimate: 3-4h)
- Plex client discovery (poll /clients)
- Player selection UI
- Connection management
- Player disconnect/reconnect handling

### Milestone 4: Now Playing & Controls
- #6: Build Now Playing screen (estimate: 4-5h)
- Playback controls (play/pause/skip/seek)
- Progress bar with scrubbing
- Volume control
- Shuffle/repeat toggles
- Queue view
- Up next display

### Milestone 5: Car Thing Integration
- DeskThing button mapping
- Physical button handler
- Touchscreen optimization
- Idle screensaver
- Dark mode

### Milestone 6: Polish & Release
- Error boundaries
- Loading skeletons
- User documentation
- App icon
- GitHub release
- Community announcement

### Future Ideas & Investigation

**Bead #10: Universal Now Playing Screen**
- Display album art and seeker bar for ANY device playing via Plex
- Not just controlling a specific player - show what's playing anywhere
- Auto-detect active playback sessions
- Show track info, album art, progress bar
- Pause/skip controls if permissions allow
- *Investigation needed: Plex API for active sessions*

**Bead #11: DeskThing Audio Source**
- Investigate registering as DeskThing audio source
- Would allow Car Thing buttons to control Plex directly
- Might enable system-wide media key integration
- Need to research DeskThing's audio source API
- *Question: Is this better than current player-control approach?*

**Bead #12: Global Music Search**
- Search across all Plex libraries
- Quick access to artists, albums, tracks
- Recent searches cache
- Voice search integration (if DeskThing supports)
- Search results with artwork thumbnails
- One-tap play to default player

---

## Development Workflow

1. **Start bead:** Pick the top item from "Ready for Pickup"
2. **Create branch:** `git checkout -b feature/bead-#-description`
3. **Work:** 1-3 hours focused work
4. **Commit:** `git commit -m "BEAD-#: Description

- What changed
- Why"

Refs: #issue-number`
5. **Test:** Run locally, verify on DeskThing if possible
6. **PR:** Open pull request referencing the issue
7. **Merge:** Let CI/build pass, merge to main
8. **Close:** Issue auto-closes, update this file

---

## Time Tracking

| Week | Beads Completed | Hours | Notes |
|------|-----------------|-------|-------|
| Week 1 | 5 | ~5h | Foundation + UI redesign complete |
| Week 2 | | | |
| Week 3 | | | |
| Week 4 | | | |

---

## Progress Summary

| Milestone | Beads | % Complete | Target |
|-----------|-------|------------|--------|
| M0: Bootstrap | 2/2 | 100% | Done |
| M1: Plex Connection | 2/2 | 100% | Done |
| M2: Library Browser | 0/Pend | 0% | Week 2 |
| M3: Player Discovery | 0/Pend | 0% | Week 3 |
| M4: Now Playing | 0/Pend | 0% | Week 3-4 |
| M5: Car Thing | 0/Pend | 0% | Week 4 |
| M6: Release | 0/Pend | 0% | Week 5 |

**Overall Progress:** ~15% (4 beads complete)

---

## Open Issues

See [GitHub Issues](https://github.com/zachatrocity/plexthing/issues) for full list:
- #9: M2 - Build artist list view (Ready)
- #10: M2 - Implement navigation
- #11: M4 - Build Now Playing screen
- #12: M3 - Implement timeline subscription

---

## Summary of Completed Work

### ✅ Foundation Phase (DONE)
1. **Project Setup** - Repo initialized at github.com/zachatrocity/plexthing
2. **Plex API Client** - Full TypeScript client with library/artists/albums/tracks/players
3. **Server Architecture** - Settings via `initSettings()`, request handlers, no loops
4. **UI Foundation** - Plexamp-inspired black theme with yellow (#E5A00D) accents
5. **Connection Status** - Visual connected/not connected states

### 📋 Remaining Work

**Milestone 2: Library Browser (Priority)**
- Artist list view with thumbnails
- Album grid view
- Track list view
- Navigation stack (back/forward)
- Search functionality

**Milestone 3-4: Player & Controls**
- Timeline subscription
- Player discovery
- Now Playing screen
- Playback controls

**Milestone 5-6: Polish**
- Car Thing button mapping
- Touch optimizations
- Release packaging

---

**Ready to resume - all context preserved in GitHub issues and BEADS.md**

**Last Updated:** March 7, 2026
