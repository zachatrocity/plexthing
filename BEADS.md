# PlexThing - Beads (Task Tracking)

**Beads** = Discrete units of work with clear acceptance criteria

Each bead is a single-issue task that's completable in one sitting (1-3 hours).

---

## Active Beads

_The next bead to work on._

| Bead ID | Issue | Title | Status | Notes |
|---------|-------|-------|--------|-------|
| #1 | [#1](https://github.com/zachatrocity/plexthing/issues/1) | Update package.json with proper app metadata | 🔧 In Progress | | |

---

## Ready for Pickup

| Bead ID | Issue | Title | Estimate | Priority |
|---------|-------|-------|----------|----------|
| #2 | [#7](https://github.com/zachatrocity/plexthing/issues/7) | Create Plex API client module | 2-3h | High |
| #3 | [#8](https://github.com/zachatrocity/plexthing/issues/8) | Build settings/config UI for Plex connection | 2-3h | High |
| #4 | [#9](https://github.com/zachatrocity/plexthing/issues/9) | Build artist list view | 3-4h | Medium |
| #5 | [#10](https://github.com/zachatrocity/plexthing/issues/10) | Implement navigation (Artist → Album → Track) | 3-4h | Medium |
| #6 | [#11](https://github.com/zachatrocity/plexthing/issues/11) | Build Now Playing screen | 4-5h | Medium |
| #7 | [#12](https://github.com/zachatrocity/plexthing/issues/12) | Implement timeline subscription for playback state | 3-4h | High |

---

## Backlog (Future Beads)

_These will be split into beads as we approach them._

### Milestone 2: Music Library Browser
- Album grid view
- Track list view
- Album detail view
- Search functionality
- Artwork caching
- Empty states
- Loading states

### Milestone 3: Player Discovery
- Plex client discovery (poll /clients)
- Player selection UI
- Connection management
- Player disconnect/reconnect handling

### Milestone 4: Now Playing & Controls
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

## Completed Beads

| Bead ID | Issue | Title | Completed | Notes |
|---------|-------|-------|-----------|-------|
| #0 | - | Initialize project from template | 2026-03-06 | Repo created at github.com/zachatrocity/plexthing |

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
| Week 1 | | | |
| Week 2 | | | |
| Week 3 | | | |
| Week 4 | | | |

---

## Progress Summary

| Milestone | Beads | % Complete | Target |
|-----------|-------|------------|--------|
| M0: Bootstrap | 1/1 | 100% | Done |
| M1: Plex Connection | 0/2 | 0% | Week 1-2 |
| M2: Library Browser | 0/2 | 0% | Week 2-3 |
| M3: Player Discovery | 0/1 | 0% | Week 3 |
| M4: Now Playing | 0/1 | 0% | Week 3-4 |
| M5: Car Thing | 0/Pend | 0% | Week 4 |
| M6: Release | 0/Pend | 0% | Week 5 |

---

**Last Updated:** March 6, 2026
