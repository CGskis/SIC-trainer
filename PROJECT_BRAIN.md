# SIC Trainer — Project Brain

## Project vision

SIC Trainer is a physical and software-based procedural training system for practicing the role of a Second-in-Command (SIC). It will combine structured scenarios, an AI-powered simulated PIC, voice interaction, physical cockpit-style controls, and objective scoring. Microsoft Flight Simulator integration is a future extension, not a prerequisite for the foundation.

Training procedure data is supplied, reviewed, and versioned by humans. AI may facilitate role-play and explanation but must not create or validate real-world aircraft procedures.

## Current architecture

This repository is in its initial foundation state. It currently contains this shared technical baseline and no application code, dependency manifest, tests, or training/procedure data.

## Recommended architecture

Begin as a single deployable application with well-separated modules; introduce separate network services only when hardware deployment or scale requires them.

| Module | Responsibility | Must not own |
| --- | --- | --- |
| Procedure/content library | Versioned, human-reviewed training content | AI-generated procedure truth or runtime scoring state |
| Scenario engine | State machine, events, expected actions, timing, progression | UI, audio transport, or hardware protocols |
| Conversation adapter | Constrained AI PIC prompts and structured intents/events | Procedure authority or final scoring |
| Voice adapter | Speech-to-text, text-to-speech, and push-to-talk | Scenario rules |
| Hardware adapter | ESP32/device protocol and input normalization | Training rules |
| Scoring engine | Deterministic evaluation against content-defined criteria | Unreviewable LLM judgments |
| User interface | Trainee/instructor controls, feedback, diagnostics | Duplicated business logic |
| Persistence/audit layer | Sessions, event log, content versions, scores | Live domain decisions |

Core flow: `authoritative content -> scenario engine -> normalized event log -> scoring + UI`

Voice, AI, and hardware adapters produce validated normalized events. The scenario engine owns runtime state, and the append-only event log supports review and replay.

## Development roadmap

1. Create the application structure, shared domain types, formatting/linting/tests, and synthetic sample content schema.
2. Build a deterministic scenario-engine vertical slice with event log, local persistence, and minimal trainee/instructor UI.
3. Add content-defined scoring and post-session review driven by recorded events.
4. Define a versioned ESP32 protocol, create a mock device, and connect one physical input end-to-end.
5. Add provider-abstracted voice and constrained AI PIC adapters.
6. Add content authoring/review, device diagnostics, observability, replay tests, and optional MSFS integration.

## Important technical decisions

- Only reviewed, versioned content is authoritative; every run records its content version.
- Scenario transitions and scoring are deterministic and testable; AI output is untrusted input until validated.
- Define one timestamped event envelope shared by UI, hardware, voice, AI, scoring, and replay.
- Keep Vapi, LLM, speech, ESP32, and MSFS behind replaceable adapter interfaces.
- Do not ship unreviewed real-world aviation procedures or represent AI output as operational guidance.
- Start local-first and runnable without hardware or paid external services.

## Open questions

- Which aircraft type(s), operating context, and approved source material define the first training content?
- What is the first platform: desktop, local web application, or browser-hosted application?
- Which first trainee actions and measurable outcomes should the product train?
- What connectivity and operating systems are required for the ESP32 prototype?
- What instructor controls, debrief reports, privacy, and retention requirements apply?
- Which voice/AI providers are acceptable, and what cost constraints apply?
- Will content begin as version-controlled files or require an authoring interface?

## Current status

**Phase:** Foundation definition.

**Completed:** Initial repository created locally with this project brief.

**Next build:** An event-driven scenario-engine slice using synthetic placeholder content, deterministic scoring, automated tests, and a minimal UI. Hardware, voice, AI, and MSFS follow behind adapters.
