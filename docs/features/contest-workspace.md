# Contest Workspace (CW) Feature Documentation

CPKit Contest Workspace (CW) provides a comprehensive, distraction-free productivity space matching Codeforces contest timers, markdown scratchpads, and side panel quick calculators.

---

## 🛠️ Implemented Features

### 1. Unified State & Local Storage Persistence
- Saves active contest platforms, countdown clock parameters, custom problem statuses, estimated vs actual task durations, and scratchpad content within browser Local Storage.

### 2. Multi-column Resizeable Visualizer Layout
- **Left Panel**: Contains custom problems lists board with adding options and solves count indexes.
- **Center Panel**: Renders active problems status controls (solving, reading, review, solved), estimated timing blocks, and markdown scratchpad inputs.
- **Right Panel**: Integrates quick calculation buttons tools.

### 3. Distraction-Free Focus Mode
- Toggling Focus Mode via header controls hides top headers and navigation margins, scaling the workspace layout to a full-bleed display.
- Pressing `Ctrl + B` toggles Focus Mode instantly.
