# Mesba7a-Inspired Tasbeeh Counter App - Design Guidelines

## Brand Identity

**Purpose**: A digital tasbeeh counter for Muslims to track dhikr (remembrance prayers) with elegance and simplicity. The app should feel spiritually calming yet modern—like a thoughtful tool for devotion, not a gamified distraction.

**Aesthetic Direction**: **Refined Serenity** — Soft gradients, generous whitespace, calming tones inspired by prayer times (dawn blues, twilight purples). Minimal ornamentation with intentional use of Islamic geometric patterns only in empty states/backgrounds. NEVER use mosque imagery or literal religious symbols—keep it abstract and tasteful.

**Memorable Element**: The central counter uses a **breathing animation** when idle (subtle scale pulse, 2s cycle) to evoke the rhythm of recitation. This makes the app feel alive without being distracting.

## Navigation Architecture

**Root Navigation**: Tab Bar (3 tabs)
1. **Counter** (default) - Main counting screen
2. **Presets** - Dhikr preset library
3. **Profile** - History, settings, user preferences

No authentication needed (local app). Profile tab includes history/analytics and settings.

## Screen-by-Screen Specifications

### 1. Counter Screen (Home)
**Purpose**: Primary counting interface with large tap area.

**Layout**:
- **Header**: Transparent, left button: Preset selector (dropdown icon), right button: Undo (arrow.counterclockwise icon)
- **Main Content**: Non-scrollable, centered vertically
  - Current preset name (small, subtle, at top of safe area)
  - **Counter Display**: Massive centered number (120pt), bold weight, with subtle drop shadow
  - **Progress Ring**: Circular progress indicator around counter (stroke width: 8, shows progress to target)
  - **Target Label**: Below counter (e.g., "of 99"), small gray text
  - **Stats Row**: Today's total + All-time total in small cards below counter
- **Tap Area**: Entire screen below header is tappable (adds haptic feedback + ripple animation originating from tap point)
- **Floating Button**: Reset button (bottom-right, 16px from edges), circular, with confirmation alert on press
- **Safe Area**: 
  - Top: headerHeight + Spacing.xl
  - Bottom: tabBarHeight + Spacing.xl

**Components**: Progress ring (custom painter), large text display, floating action button, subtle gradient background.

**Empty State**: When counter is 0, show gentle pulsing "Tap anywhere to begin" text below counter.

### 2. Presets Screen
**Purpose**: Browse and manage dhikr presets.

**Layout**:
- **Header**: Non-transparent white/dark surface, centered title "Presets", right button: Add (+)
- **Main Content**: Scrollable list
  - Built-in presets section (header: "Recommended")
  - Custom presets section (header: "Custom")
  - Each preset card shows: name, current count, target, progress bar, accent color stripe (left edge)
- **Tap Behavior**: Tapping preset switches to it on Counter screen and navigates back
- **Long Press**: Edit/delete menu (custom presets only)
- **Safe Area**:
  - Top: Spacing.xl (has non-transparent header)
  - Bottom: tabBarHeight + Spacing.xl

**Components**: List with sectioned cards, swipeable actions for delete.

**Empty State (Custom)**: Illustration of geometric pattern with text "Add your own dhikr presets" + CTA button.

### 3. Profile Screen
**Purpose**: User stats, history, and settings.

**Layout**:
- **Header**: Transparent, centered title "Profile"
- **Main Content**: Scrollable
  - **User Section**: Avatar (generated), display name field, edit button
  - **Analytics Card**: 
    - 7-day chart (bar or line graph)
    - Current streak counter with fire icon
    - Total counts this week
  - **Settings List**:
    - Theme (Light/Dark/System) with color picker
    - Language (Arabic/English toggle)
    - Haptics (toggle)
    - Sound (toggle)
    - Keep screen on (toggle)
    - Export data (button)
    - About (navigates to About screen)
- **Safe Area**:
  - Top: headerHeight + Spacing.xl
  - Bottom: tabBarHeight + Spacing.xl

**Components**: Profile card, chart widget, settings list with toggles.

### 4. Add/Edit Preset Modal
**Purpose**: Create or modify custom preset.

**Layout**:
- **Header**: Non-transparent, left: Cancel, title: "New Preset" or "Edit Preset", right: Save
- **Form** (scrollable):
  - Preset name field (supports Arabic/English)
  - Target number picker (33, 99, 100, 1000, Custom)
  - Color picker (6 preset colors)
- **Safe Area**:
  - Top: Spacing.xl (has header)
  - Bottom: insets.bottom + Spacing.xl

**Validation**: Save button disabled until name is filled.

### 5. About Screen
**Purpose**: App info, credits.

**Layout**:
- **Header**: Non-transparent, left: Back, title: "About"
- **Content**: Scrollable
  - App icon + version
  - Description
  - Privacy statement (no data collection)
  - Credits/open source licenses
- **Safe Area**:
  - Top: Spacing.xl
  - Bottom: insets.bottom + Spacing.xl

## Color Palette

**Primary**: #5B7C99 (Muted slate blue, evokes dawn sky)
**Accent**: #8B6F9D (Soft lavender, for highlights)
**Background (Light)**: #F8F9FA (Warm off-white)
**Background (Dark)**: #1A1D23 (Deep charcoal with blue tint)
**Surface (Light)**: #FFFFFF
**Surface (Dark)**: #25282E
**Text Primary (Light)**: #2C3E50
**Text Primary (Dark)**: #E8EAED
**Text Secondary (Light)**: #6C757D
**Text Secondary (Dark)**: #9CA3AF
**Success**: #4CAF50
**Error**: #EF5350

**Gradient**: Subtle top-to-bottom gradient on Counter screen background (Primary at 5% opacity to transparent).

## Typography

**Font**: System font (SF Pro for iOS, Roboto for Android) ensures excellent Arabic support.

**Type Scale**:
- Counter Display: 120pt, Bold
- H1 (Screen Titles): 28pt, Semibold
- H2 (Section Headers): 20pt, Semibold
- Body: 16pt, Regular
- Caption: 14pt, Regular
- Small: 12pt, Regular

**Arabic Considerations**: Arabic text should use native font stack, ensure adequate line height (1.6) for readability.

## Visual Design

- **Icons**: Use Material Icons for cross-platform consistency
- **Cards**: 16px corner radius, subtle elevation (4dp)
- **Buttons**: 12px corner radius, minimum tap target 48x48
- **Animations**: 
  - Counter increment: Number scales up 1.1x then back (200ms, ease-out)
  - Progress ring: Animates smoothly with spring physics
  - Tap ripple: Expands from tap point (300ms)
- **Floating Button Shadow**:
  - shadowOffset: width: 0, height: 2
  - shadowOpacity: 0.10
  - shadowRadius: 2

## Assets to Generate

**Required**:
1. **icon.png** - App icon featuring abstract geometric Islamic pattern in Primary/Accent colors, clean minimal style. USED: Device home screen.
2. **splash-icon.png** - Simplified version of app icon for splash screen. USED: App launch.
3. **empty-presets.png** - Abstract illustration of connected circles/nodes forming subtle geometric pattern. USED: Presets screen when no custom presets exist.
4. **avatar-1.png** - Simple geometric avatar (circular, uses Primary color). USED: Profile screen default avatar.

**Recommended**:
5. **pattern-bg.png** - Subtle Islamic geometric pattern (very low opacity) for Counter screen background overlay. USED: Counter screen background.
6. **chart-placeholder.png** - Empty state for analytics chart showing subtle grid. USED: Profile screen when no data exists.

All assets should use the app's color palette and maintain the refined, minimal aesthetic. Avoid literal religious imagery.