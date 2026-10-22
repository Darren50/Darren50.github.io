---
layout: page
title: Locked-In
heading: Locked-In
subtitle: NUS Orbital 2026 · Apollo 11 · A focus bot and web app that keeps students on task
permalink: /work/locked-in/
back:
  title: All work
  url: /work/
---

![Pomodoro timer screen on the bot](/images/locked-in/timer.jpg)

Locked-In is a physical study companion: a padlock-shaped desk bot running on a Raspberry Pi 5, paired with a React
web app. You plan tasks on the web, then run Pomodoro sessions on the bot while its camera notices when you drift off.
Both halves stay in sync through Firestore in real time.

[Source on GitHub](https://github.com/Darren50/Locked-In)

## Why

Students are distracted for around 38% of their homework time, and digital devices are the main culprit. Even a
face-down, silent phone within reach measurably reduces attention. Existing tools fall into two camps: phone apps like
Forest, which run on the very device causing the distraction, and hardware Pomodoro timers, which buzz at the end but
have no idea whether you actually stayed on task.

Locked-In sits between the two. Everything study-related (timers, the to-do list, focus stats and even quick factual
questions) lives on a dedicated device, so the phone can go out of sight.

## The bot

The bot is a Raspberry Pi 5 with a 2.8" Waveshare SPI LCD, four GPIO buttons, a Pi Camera 3, and a USB microphone and
speaker, all in a custom 3D-printed enclosure.

![The finished Locked-In bot](/images/locked-in/assembled.jpg){: .portrait}

- **Pomodoro timer.** A thread-safe state machine running the classic 25/5 cycle with a long break every fourth
  session. It keeps counting in a background thread while you browse other screens, and logs every session to
  Firestore.
- **Custom LCD UI.** There's no GUI toolkit: each screen is drawn with Pillow and written straight to the framebuffer
  (`/dev/fb1`) with manual RGB565 conversion, running at about 20 FPS within the SPI bandwidth limit. The idle face
  blinks and bobs, then swaps to sunglasses when a session is running.
- **Tasks on the desk.** A real-time Firestore listener keeps the bot's task list in sync with the web app. You can
  scroll and tick off tasks with the buttons, and the change shows up on the web instantly.
- **AI voice assistant.** Press a button and ask a quick question. Audio goes through Groq Whisper for speech-to-text,
  Llama 3.3 answers with the current session as context, and gTTS reads the answer back through the speaker.

## Camera-based focus detection

![Focus face shown while a session is running](/images/locked-in/focus-face.jpg)

The first version only checked whether a face was present, which is too crude: you can face the camera while asleep.
It was rebuilt on MediaPipe FaceMesh's 468 landmarks, with two extra derived signals:

- an **Eye Aspect Ratio** to catch closed eyes, and
- a **nose-position ratio** to catch the head turning away.

These are fused into four states (FOCUSED, AWAY, DISTRACTED and DROWSY), each with its own grace period before the
timer auto-pauses. Since nobody sits the same way, the bot calibrates your neutral head pose in the first few seconds
of every session. OpenCV's `solvePnP` was also tried for head pose, but its Euler angles were unstable on the Pi camera,
so the lighter landmark ratio won out.

## The web app

![Statistics page of the web app](/images/locked-in/web-stats.jpg)

A React app on Firebase Hosting, used outside study sessions:

- **To-do list** with due dates, drag-and-drop reordering, inline editing and automatic overdue flags
- **Calendar** with week and month views of every task
- **Statistics** with total focus time, a focus streak, an adjustable daily goal, a weekly chart and insights such as
  peak focus time and most productive day
- **Login** with email or Google sign-in, "remember me" and password reset

## Enclosure

![Fusion 360 model of the enclosure](/images/locked-in/cad-model.jpg){: .portrait}

The case was modelled in Fusion 360 around measurements of each component, and went through three iterations to get
the tolerances right. Later versions widened the front panel for the speaker cable and added microphone holes, a fan
opening and heat vents. It was printed in blue and white PLA, and the front panel attaches to the base with magnets so
nothing shifts when you carry it around.

## Architecture

![System architecture](/images/locked-in/architecture.jpg)

Both the bot and the web app talk to Firestore directly. The original plan had a Flask server in the middle, but the
Firestore SDKs already handle auth and rate limiting, and a middleware layer would have doubled the deployment surface
for no real benefit.

The bot's code is split into `core/` (pure logic), `hardware/`, `services/` and `screens/`. Keeping the logic free of
hardware made it testable anywhere, and a few design patterns fell out naturally: a State pattern for screens,
dependency injection so the timer doesn't know about the database, and facades around the Firebase and Groq SDKs.

## Testing

- Unit tests with **Vitest** (web) and **pytest** (bot), including regression tests that lock in past bug fixes
- Integration tests for the focus monitor auto-pausing and resuming the timer, using a mocked clock
- 14 end-to-end system tests, all passing, on Chrome and the Raspberry Pi 5
- CI on **GitHub Actions** for every push and PR, with the web app auto-deploying to Firebase Hosting on merge

## Challenges

- **Gemini didn't work out.** An organisation policy rejected the API key format, and a fresh project had zero
  free-tier quota. Switching to Groq gave free speech-to-text and an LLM with no card needed, and because the AI code
  sat behind a facade, only one module had to change.
- **Kernel hangs.** Kernel logs traced intermittent freezes to the staging SPI display driver corrupting memory
  under constant framebuffer writes. Capping the frame rate fixed most of it, with no visible cost.
- **Out-of-sync stats.** A session counter maintained separately from the sessions drifted when sessions were
  deleted on the web. Deriving the count from the sessions themselves made adding and deleting symmetric.
- **3D printing.** Tolerances, cramped cable routing and heat build-up all needed design changes and some sanding.

**Stack:** Raspberry Pi 5 · Python · MediaPipe · Pillow · lgpio · Groq (Whisper, Llama 3.3) · React · Firebase ·
Firestore · Vitest · pytest · GitHub Actions · Fusion 360
