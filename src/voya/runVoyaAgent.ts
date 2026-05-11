import { applyVoyaPolicy } from "./agentPolicy.js";
import { runMockVoyaAgent } from "./mockAgent.js";
import type { AgentRunRequest, AgentRunResponse } from "./types.js";

export async function runVoyaAgent(request: AgentRunRequest): Promise<AgentRunResponse> {
  const generated = runMockVoyaAgent(request);
  const policy = applyVoyaPolicy(generated.actions);

  return {
    ...generated,
    actions: policy.actions,
    trace: [...generated.trace, ...policy.trace]
  };
}
