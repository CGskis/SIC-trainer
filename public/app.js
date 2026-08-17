import { syntheticScenario } from "/src/data/syntheticScenario.js";
import { syntheticRecoveryScenario } from "/src/data/syntheticRecoveryScenario.js";
import { createScenarioSession, dispatchAction, getAvailableActions } from "/src/engine/scenarioEngine.js";
import { scoreScenario } from "/src/scoring/scoreScenario.js";
import { createTrainingHistoryStore, createSessionRecord } from "/src/persistence/trainingHistory.js";
import { replaySession } from "/src/persistence/replaySession.js";

const scenarios=[syntheticScenario,syntheticRecoveryScenario], history=createTrainingHistoryStore(), $=s=>document.querySelector(s);
let scenario=scenarios[0],session=createScenarioSession(scenario),startedAt=null,lastRecord=null;
const select=$("#scenario-select"),messages=$("#messages");
scenarios.forEach(item=>select.add(new Option(item.title,item.id)));
select.onchange=()=>{scenario=scenarios.find(item=>item.id===select.value);reset()};
$("#start").onclick=()=>{reset();show("live")};$("#restart").onclick=reset;$("#end").onclick=finish;
$("#nav").onclick=e=>{if(e.target.dataset.screen)show(e.target.dataset.screen)};
document.querySelector(".appbar").onclick=e=>{if(e.target.dataset.screen)show(e.target.dataset.screen)};
$("#replay-last").onclick=()=>{const record=history.list()[0];if(!record)return $("#replay-content").textContent="No completed session saved.";scenario=scenarios.find(item=>item.id===record.scenarioId);const replayed=replaySession(scenario,{events:record.inputEvents});const score=scoreScenario(scenario,replayed);$("#replay-content").textContent=replayed.state===record.finalState&&score.earned===record.finalScore.earned?`Replay verified: ${replayed.state}, ${score.earned}/${score.possible}.`:"Replay mismatch."};
function show(id){document.querySelectorAll(".screen").forEach(item=>item.classList.toggle("active",item.id===id));if(id==="history")renderHistory();if(id==="debrief")renderDebrief()}
function reset(){session=createScenarioSession(scenario);startedAt=new Date().toISOString();lastRecord=null;messages.textContent="Session ready.";render()}
function finish(){if(!startedAt)return;const endedAt=new Date().toISOString(),record=createSessionRecord({session,scenario,applicationVersion:"0.2.0",startedAt,endedAt});record.finalScore=scoreScenario(scenario,session);history.add(record);lastRecord=record;render();show("debrief")}
function render(){const score=scoreScenario(scenario,session);$("#current-scenario").textContent=`${scenario.title} · v${scenario.version}`;$("#state").textContent=session.state;$("#timer").textContent=startedAt?`${Math.floor((Date.now()-new Date(startedAt))/1000)} sec`:"Not started";$("#score").textContent=`${score.earned}/${score.possible} points`;$("#actions").replaceChildren(...getAvailableActions(scenario,session).map(action=>{const button=document.createElement("button");button.textContent=scenario.actionLabels[action];button.onclick=()=>{try{session=dispatchAction(scenario,session,action,{source:"UI"});messages.textContent=""}catch(error){session={...session,events:error.events};messages.textContent=error.message}render();if(session.state==="COMPLETE")finish()};return button}));$("#events").replaceChildren(...session.events.map(event=>{const li=document.createElement("li");li.textContent=`#${event.sequence} ${event.type} · ${event.action??event.state} · ${event.source??"SYSTEM"}`;return li}))}
function renderDebrief(){if(!lastRecord)return;$("#debrief-content").textContent=`Final state: ${lastRecord.finalState}. Score: ${lastRecord.finalScore.earned}/${lastRecord.finalScore.possible}. Duration: ${lastRecord.durationMs} ms. Invalid actions: ${lastRecord.errors.length}.`}
function renderHistory(){const records=history.list();$("#history-content").textContent=records.length?records.map(record=>`${record.scenarioId} · ${record.finalState} · ${record.finalScore.earned}/${record.finalScore.possible}`).join("\n"):"No completed sessions yet."}
show("live");render();setInterval(()=>{if(startedAt&&!lastRecord)render()},1000);
