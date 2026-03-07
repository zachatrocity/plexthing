# PlexThing - Beads (Task Tracking)

**Beads** = Discrete units of work with clear acceptance criteria

Each bead is a single-issue task that's completable in one sitting (1-3 hours).

---

## Active Beads

_The next bead to work on._

| Bead ID | Issue | Title | Status | Notes |
|---------|-------|-------|--------|-------|
| #2 | [#7](https://github.com/zachatrocity/plexthing/issues/7) | Create Plex API client module | 🔧 In Progress | Working on TypeScript Plex API wrapper |

---

## Ready for Pickup

| Bead ID | Issue | Title | Estimate | Priority |
|---------|-------|-------|----------|----------|
| #3 | [#8](https://github.com/zachatrocity/plexthing/issues/8) | Build settings/config UI for Plex connection | 2-3h | High |

---

## Completed Beads

| Bead ID | Issue | Title | Completed | Notes |
|---------|-------|-------|-----------|-------|
| #0 | - | Initialize project from template | 2026-03-06 | Repo created at github.com/zachatrocity/plexthing |
| #1 | [#1](https://github.com/zachatrocity/plexthing/issues/1) | Update package.json with proper app metadata | 2026-03-06 | Added PlexThing branding and settings schema |

---

## Backlog (Future Beads)

### Milestone 2: Music Library Browser
- #4: Build artist list view (estimate: 3-4h)
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
| Week 1 | 1 | ~1h | Setup complete, starting M1 |
| Week 2 | | | |
| Week 3 | | | |
| Week 4 | | | |

---

## Progress Summary

| Milestone | Beads | % Complete | Target |
|-----------|-------|------------|--------|
| M0: Bootstrap | 2/2 | 100% | Done |
| M1: Plex Connection | 1/3 | 33% | Week 1-2 |
| M2: Library Browser | 0/Pend | 0% | Week 2-3 |
| M3: Player Discovery | 0/Pend | 0% | Week 3 |
| M4: Now Playing | 0/Pend | 0% | Week 3-4 |
| M5: Car Thing | 0/Pend | 0% | Week 4 |
| M6: Release | 0/Pend | 0% | Week 5 |

**Overall Progress:** ~5% (2/40+ beads)

---

## Open Issues

See [GitHub Issues](https://github.com/zachatrocity/plexthing/issues) for full list:
- #7: M1 - Create Plex API client module (In Progress)
- #8: M1 - Build settings/config UI for Plex connection
- #9: M2 - Build artist list view
- #10: M2 - Implement navigation (Artist → Album → Track)
- #11: M4 - Build Now Playing screen
- #12: M3 - Implement timeline subscription for playback state

---

**Last Updated:** March 6, 2026
