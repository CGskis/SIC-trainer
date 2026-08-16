import assert from "node:assert/strict";
import test from "node:test";
import { syntheticScenario } from "../src/data/syntheticScenario.js";
import { createScenarioSession, dispatchAction } from "../src/engine/scenarioEngine.js";
import { createSessionRecord } from "../src/persistence/trainingHistory.js";
import { scoreScenario } from "../src/scoring/scoreScenario.js";
test("session record is versioned and retains replay inputs, source, score, state, and duration",()=>{let s=createScenarioSession(syntheticScenario,{clock:()=>"2026-01-01T00:00:00.000Z"});s=dispatchAction(syntheticScenario,s,"START",{clock:()=>"2026-01-01T00:00:01.000Z",source:"HARDWARE"});const r=createSessionRecord({session:s,scenario:syntheticScenario,applicationVersion:"0.2.0",startedAt:"2026-01-01T00:00:00.000Z",endedAt:"2026-01-01T00:00:05.000Z"});r.finalScore=scoreScenario(syntheticScenario,s);assert.equal(r.schemaVersion,1);assert.equal(r.durationMs,5000);assert.equal(r.inputEvents[1].source,"HARDWARE");assert.equal(r.finalState,"BRIEFING")});
