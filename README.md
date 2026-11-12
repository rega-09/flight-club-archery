<p align="center">
  <img src="dist/archer.png" width="140" alt="Flight Club Archery Emblem" />
</p>

<h1 align="center">FLIGHT CLUB</h1>
<p align="center">
  <strong>The Archery Range &bull; A 3D WebGL Ballistic Simulator</strong><br>
  <em>"A quiet mind. A steady hand. One perfect shot."</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Three.js-r170-black?style=for-the-badge&logo=threedotjs" alt="Three.js r170" />
  <img src="https://img.shields.io/badge/WebGL-Hardware_Accelerated-blue?style=for-the-badge&logo=webgl" alt="WebGL" />
  <img src="https://img.shields.io/badge/Web_Audio-Procedurally_Synthesized-success?style=for-the-badge" alt="Procedural Web Audio" />
  <img src="https://img.shields.io/badge/Dependencies-Zero_Build_Step-brightgreen?style=for-the-badge" alt="Zero Dependencies" />
  <img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> &bull;
  <a href="#-features--systems">Features</a> &bull;
  <a href="#-gameplay--controls">Controls</a> &bull;
  <a href="#-ballistics--physics-engine">Physics Engine</a> &bull;
  <a href="#-target-geometry--scoring">Scoring</a> &bull;
  <a href="#-project-structure">Project Structure</a> &bull;
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 🌲 Overview

**Flight Club** is an authentic, lightweight 3D recurve archery simulation built entirely in client-side WebGL and Vanilla ES modules. Set against a serene procedural pinewood forest, the game models real-world aerodynamics, draw mechanics, variable lateral crosswinds, and cinematic camera tracking.

Built with **zero build dependencies**, **zero remote asset downloads**, and **fully procedural Web Audio**, Flight Club delivers high-fidelity simulation and instant startup directly in any modern browser.

---

## ✨ Features & Systems

### 🏹 Dynamic Recurve Bow Rig
- **Tension & Draw Physics**: Hold to smoothly zoom in on the target line (up to $1.8\times$) and increase potential launch energy.
- **Breath & Stamina Sway**: Holding full draw for longer than 3 seconds introduces realistic physiological sway harmonics ($\sin / \cos$ oscillations) that challenge your aim.
- **Minimum Draw Check**: Distance-calibrated minimum draw power (from 20% at 10m to 100% at 90m). An underpowered release safely retains the arrow and warns the archer.

### 💨 Ballistics & Environmental Crosswind
- **240 Hz Sub-stepped Numerical Integrator**: Simulates gravity, atmospheric air density ($\rho = 1.225\,\text{kg/m}^3$), quadratic velocity drag, and lateral crosswind deflection.
- **Dynamic Wind Patterns**: Wind speeds fluctuate (0.5 to 5.5 m/s) with directional alternating sequences between shots.
- **Procedural Wind Leaves**: Forest foliage and drifting leaves flutter in real-time according to the active crosswind velocity, giving subtle visual cues before you release.

### 🎬 Cinematic Camera Director
- **Chase Camera**: Seamlessly flies behind the arrow shaft upon release.
- **Bullet-Time Slow Motion**: Trajectory calculations automatically trigger $0.25\times$ slow-motion whenever a shot is on course for the gold ring.
- **Orbiting Impact Cam**: Dynamic camera cut on impact showcasing arrow vibration, wood splinters, and landing angle.

### 🔊 Procedural Web Audio Engine
- **No MP3/WAV files required**: 100% procedurally synthesized audio using the browser's Web Audio API.
- Custom synthesizer nodes emulate:
  - *Bow draw*: Wooden stress creak and limb tension.
  - *Release*: Sharp string snap with resonant harmonic tail.
  - *Flight*: Low-pass filtered aerodynamic air swish that fades with distance.
  - *Impact*: Heavy wooden target thud or soft ground-miss dirt strike.

---

## 🎯 Gameplay & Controls

| Action | Input (Mouse / Touch) | Keyboard Shortcut |
| :--- | :--- | :--- |
| **Draw Bow** | Press & Hold Left Mouse Button / Touch | Hold `Space` |
| **Aim** | Move Pointer while holding draw | Pointer Position |
| **Shoot** | Release Mouse Button / Touch | Release `Space` |
| **Cancel Draw** | Move off-screen or cancel gesture | Blur / Escape |
| **Toggle Trajectory Preview** | UI Checkbox | `T` |
| **Reset / New Round** | Reset Button | `R` |
| **Change Distance** | Distance Selector (10m &ndash; 90m) | Click Distance buttons |
| **Toggle Audio** | Sound Button in header | Click Sound button |

> [!TIP]
> **Drop & Trajectory Assist:** The aiming reticle solves ballistic drop compensation for **still air only**. It deliberately **never** compensates for crosswind:
> - **Wind blowing Right ($\rightarrow$)**: Aim to the **LEFT**.
> - **Wind blowing Left ($\leftarrow$)**: Aim to the **RIGHT**.

---

## 📐 Ballistics & Physics Engine

Arrow trajectories are calculated using discrete aerodynamic step integration at up to $240\,\text{Hz}$:

```
                    ┌─────────────────────────┐
                    │      Launch Vector      │
                    │  v₀ = f(aim, drawPower) │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  240 Hz Integrator Loop │
                    │                         │
                    │   • Gravity: -9.81 m/s² │
                    │   • Air Drag: -k|v_rel|v│
                    │   • Lateral Crosswind   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Swept-Plane Collision  │
                    │  & Shaft-Radius Cutters │
                    └─────────────────────────┘
```

### Physical Parameters
- **Draw Force**: $5.1\,\text{N}$ effective prototype draw constant
- **Arrow Mass**: $25\,\text{g}$ ($0.025\,\text{kg}$)
- **Shaft Radius**: $4\,\text{mm}$ ($0.004\,\text{m}$)
- **Drag Coefficient ($C_d$)**: $1.1$
- **Cross-Sectional Area**: $0.00004\,\text{m}^2$
- **Air Density ($\rho$)**: $1.225\,\text{kg/m}^3$

---

## 🏆 Target Geometry & Scoring

Official target rings conform to standard target-archery concentric proportions:

<div align="center">

| Ring | Radius | Score | Point Label |
| :--- | :--- | :--- | :--- |
| **Inner X-Ring** | $0.90\,\text{cm}$ | **10** (+10 Bonus) | `PERFECT X` |
| **10-Ring (Bullseye)** | $3.25\,\text{cm}$ | **10** (+5 Bonus) | `BULLSEYE` |
| **Gold (9)** | $6.50\,\text{cm}$ | **9** | `IN THE GOLD` |
| **Red (7–8)** | $13.0–19.5\,\text{cm}$ | **7–8** | `ON THE BOARD` |
| **Blue (5–6)** | $26.0–32.5\,\text{cm}$ | **5–6** | `ON THE BOARD` |
| **Black (3–4)** | $39.0–45.5\,\text{cm}$ | **3–4** | `ON THE BOARD` |
| **White (1–2)** | $52.0–65.0\,\text{cm}$ | **1–2** | `ON THE BOARD` |
| **Miss** | $> 65.0\,\text{cm}$ | **0** | `JUST WIDE / OUT OF RANGE` |

</div>

> [!NOTE]
> **Line Cutters**: A true line-cutter rule evaluates the arrow's outer shaft boundary ($4\,\text{mm}$ radius), granting the higher point score if any part of the shaft touches the inner scoring ring.
> 
> **Robin Hood**: Splitting a previously embedded arrow on the board triggers an exclusive `ROBIN HOOD` accolade!

---

## ⚡ Quick Start

No Node.js, `npm install`, or bundler required! Run using any standard static file server:

### Python 3
```bash
python3 -m http.server 8080 --directory dist
```

### Node.js (`npx serve`)
```bash
npx serve dist -l 8080
```

### PHP
```bash
php -S localhost:8080 -t dist
```

Then open your browser to **[http://localhost:8080](http://localhost:8080)**.

---

## 📁 Project Structure

```text
flight-club-archery/
├── README.md               # Project documentation
├── .gitignore              # Git ignore rules
└── dist/                   # Zero-build application root
    ├── index.html          # Semantic HTML5 layout & Range UI
    ├── style.css           # Clean typography & HUD overlays
    ├── game.js             # Game loop, physics engine, scoring & state
    ├── scene3d.js          # Three.js scene, lighting, bow rig & foliage
    ├── audio.js            # Synthesized procedural Web Audio engine
    ├── wind-leaves.js      # Wind particle physics & leaf simulation
    ├── target-config.js    # Shared target ring geometry constants
    ├── archer.png          # High-resolution brand logo & emblem
    ├── logo.jpg            # Artwork & visual branding
    └── vendor/
        ├── three.module.js # Vendored Three.js r170 (ES Module)
        └── THREE-LICENSE.txt # MIT License for Three.js
```

---

## 🛠️ Architecture & Extension Hooks

The simulation follows a modular, decoupled architecture centered around an internal `EventBus`:

- `PhysicsEngine`: Pure ballistic math and analytical trajectory solvers.
- `BowController`: Manages draw power accumulation, pointer mapping, and sway.
- `CinematicCameraDirector`: Handles camera transitions, orbit controls, and slow-motion pacing.
- `TargetManager`: Handles target coordinates and embedded arrow collections.
- `ArcheryAudio`: Independent procedural audio synthesis.

Pre-wired extension points in `game.js` include hooks for:
- JSON equipment presets (draw weight, arrow spine flex, arrow mass).
- Moving, pendulum, and rail targets.
- Seeded tournament modes and online leaderboards.

---

## 🗺️ Roadmap

- [ ] Articulated hand and glove animation on bow grip and nock release.
- [ ] Equipment JSON presets for compound bows and carbon-shaft competition arrows.
- [ ] Moving target tracks and pendulum swing targets.
- [ ] Dynamic weather variations (rain drag modifiers, dusk & night lighting).
- [ ] Online asynchronous tournament challenges and replay capture.

---

## 📄 License

- **Source Code**: Released under the [MIT License](LICENSE).
- **Three.js**: Vendored under the MIT License (see [THREE-LICENSE.txt](dist/vendor/THREE-LICENSE.txt)).
- **Media & Assets**: Original assets created for Flight Club.
