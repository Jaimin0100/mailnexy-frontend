export const WORKFLOWS_KEY = 'mailnexy-flows';

export function getAllFlows(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  const saved = localStorage.getItem(WORKFLOWS_KEY);
  return saved ? JSON.parse(saved) : {};
}

export function saveFlow(name: string, flow: { name: string; nodes: any[]; edges: any[] }) {
  const all = getAllFlows();
  all[name] = flow;
  localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(all));
}

export function deleteFlow(name: string) {
  const all = getAllFlows();
  delete all[name];
  localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(all));
}

export function loadFlow(name: string) {
  return getAllFlows()[name] || null;
}