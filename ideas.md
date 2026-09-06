# Design Directions — Tamil Nadu Transformer Fault Diagnosis Dashboard

## Three stylistic approaches

### 1. Civic Command Centre
**Very Brief Intro:** A composed operations dashboard with navy infrastructure panels, restrained brass-gold authority markers, and measured data visualisation. It conveys a state-level control room rather than a consumer application.

**Probability:** 0.07

### 2. Blueprint Grid
**Very Brief Intro:** A high-contrast engineering aesthetic built around technical gridlines, diagnostic overlays, and luminous system paths. The mood is precise and investigative, appropriate for maintenance teams.

**Probability:** 0.03

### 3. Public-Service Ledger
**Very Brief Intro:** An archival government-record visual language using formal document divisions, seal-inspired motifs, and dense status registers. It foregrounds traceability and operational accountability.

**Probability:** 0.09

## Selected direction — Civic Command Centre

### Design Movement
The interface combines **contemporary public-sector service design** with the calm, information-dense visual discipline of a **regional utility control room**. It uses an institutional dark-blue field rather than a generic cyber interface.

### Core Principles
1. **Operational legibility first:** At a glance, a field engineer must see which regional condition is unsafe, why it is unsafe, and what action is proposed.
2. **Authority without clutter:** Government affiliation is represented through a disciplined masthead, the Tamil Nadu emblem, departmental names, and a brass-gold accent rather than decorative ornament.
3. **Faults remain spatial:** Thermal, loading, electrical, and communication signals always keep their own identifiable regions and colour system.
4. **Simulation is transparent:** All generated readings, health scores, and suggested protective actions are visibly presented as a live training simulation—not as an uncontrolled automated command.

### Color Philosophy
The foundation is **deep state navy** (#061B37) and **midnight blue** (#0A2A52), invoking reliability, civic governance, and night-shift control rooms. **Brass-gold** (#D8A63A) provides authority for badges, bearings, and government separators. **Service cyan** (#40C6E9) connects telemetry and electrical data; **thermal amber** (#F6B84A), **warning vermilion** (#F46A50), and **safe jade** (#40C29B) reveal severity without replacing the institutional palette. Near-white ink is used for contrast, while mist-blue panels make dense data comfortable to read.

### Layout Paradigm
The shell resembles a control-room console: a fixed institutional **left rail**, a short **government masthead**, and an asymmetric **command canvas**. The canvas begins with a live regional situation strip and then splits into a central transformer-diagnosis stage, a right-side decision column, and a lower data/simulation deck. The user never loses the current feeder, division, or simulator state.

### Signature Elements
1. **Diagnostic compass:** Four named regions radiate around a transformer core, creating a stable visual index for temperature, loading, electrical, and communication health.
2. **Government ribbon:** A navy-and-gold masthead joins the Tamil Nadu identity, department hierarchy, system availability, and operator context.
3. **Action ledger:** Suggested isolation, solar support, field inspection, and escalation steps appear in a clear sequential decision register.

### Interaction Philosophy
The simulator responds immediately but deliberately. Sliders and scenario chips cause health, region alerts, topology paths, and recommended actions to recalculate as a single system. Users can inject realistic faults, reset to nominal values, choose a feeder, and view an explanation for every diagnosis. High-risk actions require a confirmation dialog and are labelled as training simulations.

### Animation
On initial load, telemetry paths draw in softly, status cards rise by 6px with a 50ms stagger, and the diagnostic compass resolves from a 0.95 scale. Live signal dots pulse once every two seconds; abnormal regions use a restrained 1.2-second opacity pulse, never strobing. Hover and slider feedback remain under 180ms, while scenario changes crossfade within 220ms. Motion respects reduced-motion settings.

### Typography System
Headlines use **Sora** at 600–700 weight for compact authority; numeric and tabular readings use **IBM Plex Mono** for audit-friendly alignment; explanatory text uses **Manrope** for calm readability. All-caps is reserved for small section labels, badges, and dashboard status only. Main readings use 30–42px, section headings 17–21px, and metadata 11–13px.

### Brand Essence
**A training-ready regional utility command dashboard that translates transformer telemetry into safe, accountable field action for Tamil Nadu’s electricity network.**

**Personality:** Authoritative, measured, service-oriented.

### Brand Voice
Headlines are plainspoken, technical, and action-led. Calls to action make operational consequences explicit rather than relying on generic urgency.

> “North Chennai feeder is stable. Continue scheduled monitoring.”

> “Thermal risk detected. Simulate load relief before authorising field dispatch.”

### Wordmark & Logo
The masthead uses the official Tamil Nadu emblem at a clearly visible scale alongside a two-line government wordmark: **Government of Tamil Nadu** over **Tamil Nadu Electricity Board — Transformer Health Command**. The product mark is a circular navy-and-gold diagnostic compass surrounding a simplified transformer coil, set apart from the official government emblem.

### Signature Brand Color
**Civic Navy — #061B37**

## Visual Verification

The implemented command-centre dashboard has been reviewed at desktop size across the command centre, interactive fault simulator, regional network, and alert-ledger pages. The persistent navigation, government masthead, four-region compass, decision ledger, and training labels remain coherent across the page system. The dark-blue hierarchy, brass-gold authority accents, and restrained cyan telemetry signals reinforce the selected Civic Command Centre direction without resorting to generic cyberpunk treatment.

## Style Decisions — Monitoring Redesign

The product is now a **government-side monitoring atlas**, not a fault simulator. The design changes from an illustrated transformer-centred dashboard to a map-first operations surface focused on two named administrative zones: **Avadi** and **Ambattur**.

The revised layout uses a wide geographic canvas as the main workspace, a narrow civic status rail, a segmented zone switcher, small labelled transformer points, coverage rings, and a fault bulletin. Panels are deliberately less uniform: zone plaques attach to the map edge, the active transformer inspector reads as a field register, and the fault list is treated as a time-ordered operational notice rather than a decorative card collection. Large gradients, dense repeated rounded cards, and decorative 3D illustrations are removed from the primary view.

The visual language is called **Civic Operations Atlas**. It keeps Civic Navy as the foundation but uses chalky map lines, muted route fills, warm paper-coloured labels, and a compact Public Sans plus IBM Plex Mono type system. Live state is communicated through calm service colours and single-direction motion, while fault conditions use a single amber-to-vermilion escalation path. The result should feel like a bespoke utility atlas pinned to a control-room wall, not a generic AI dashboard.

The atlas canvas now holds visible administrative boundaries, route traces, labelled transformer points, coverage rings, and Avadi/Ambattur field markers before interaction. Map plaques and adjacent field registers replace repeated generic cards across the primary monitoring routes. Warm paper labels and brass dividers form the atlas material language; cyan remains limited to telemetry paths, and amber-to-vermilion signals only procedural fault escalation.
