# SIC Trainer

SIC Trainer is a local-first, deterministic training-platform foundation: reusable SIC Core + replaceable aircraft modules + synthetic scenario content.

All current scenarios and the A321-style panel are fictional development/test material. They are not real aircraft procedures. AI, visuals, and device inputs are never procedure authority.

## Current capabilities

- Deterministic state-machine scenarios, scoring, local persistence, and replay
- Ten synthetic scenarios, including a fictional recovery branch and instructor-injected test event
- Replaceable aircraft-module definition with normalized hardware events and mismatch detection
- Browser-simulated hardware self-test and simulated-gaze/reaction contracts
- Home, Train, Scenarios, Cockpit, Hardware, Replays, Instructor, Editor, and Settings screens

Run `npm test`, then `npm start` and open the shown local address.

Synthetic, deterministic Windows PC training foundation. It contains no real aircraft procedures.

## Windows launch

Install [Node.js LTS](https://nodejs.org/) once, then double-click `START_SIC_TRAINER.bat`. The browser opens at `http://localhost:3000`.

For development, run `npm test` and `npm start` from the project folder.
