export function scoreScenario(scenario, session) {
  const completedActions = new Set(session.events.filter((event) => event.type === "ACTION_COMPLETED").map((event) => event.action));
  const items = Object.entries(scenario.scoring).map(([action, points]) => ({ action, points, earned: completedActions.has(action) ? points : 0 }));
  const earned = items.reduce((total, item) => total + item.earned, 0);
  const possible = items.reduce((total, item) => total + item.points, 0);
  return { earned, possible, percentage: possible === 0 ? 0 : Math.round((earned / possible) * 100), complete: session.state === "COMPLETE", items };
}
