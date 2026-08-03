import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { links, profile } from "@/data/profile";

/**
 * The workflow definition lives in the repo so it cannot silently drift from
 * the endpoint it consumes. If someone changes the site URL in `data/`, these
 * tests fail rather than letting the agent fetch a dead address in production.
 */
const workflow = JSON.parse(
  readFileSync(join(process.cwd(), "n8n/rudy-portfolio-agent.json"), "utf8"),
) as {
  nodes: {
    id: string;
    name: string;
    type: string;
    webhookId?: string;
    parameters: Record<string, unknown>;
  }[];
  connections: Record<string, Record<string, { node: string }[][]>>;
};

const nodeNamed = (name: string) => {
  const node = workflow.nodes.find((candidate) => candidate.name === name);
  if (!node) throw new Error(`node "${name}" is missing from the workflow`);
  return node;
};

const agentSystemMessage = () => {
  const options = nodeNamed("AI Agent").parameters.options as { systemMessage: string };
  return options.systemMessage;
};

describe("knowledge wiring", () => {
  it("fetches the knowledge endpoint on the deployed site", () => {
    expect(nodeNamed("Fetch knowledge").parameters.url).toBe(`${links.site}/api/knowledge`);
  });

  it("asks for the response as text under the property the prompt reads", () => {
    const options = nodeNamed("Fetch knowledge").parameters.options as {
      response: { response: { responseFormat: string; outputPropertyName: string } };
    };

    expect(options.response.response.responseFormat).toBe("text");
    expect(options.response.response.outputPropertyName).toBe("data");
    expect(agentSystemMessage()).toContain("$('Fetch knowledge').item.json.data");
  });

  it("reads the question from the trigger, not from the node before it", () => {
    // An extra node now sits between the trigger and the agent, so the default
    // "take chatInput from the incoming item" would pick up the HTTP response.
    const params = nodeNamed("AI Agent").parameters as { promptType: string; text: string };

    expect(params.promptType).toBe("define");
    expect(params.text).toContain("When chat message received");
    expect(params.text).toContain("chatInput");
  });
});

describe("retrieval is gone", () => {
  const serialised = JSON.stringify(workflow).toLowerCase();

  it.each(["pinecone", "vectorstore", "embeddings", "rudy-q"])(
    "contains no trace of %s",
    (term) => {
      expect(serialised).not.toContain(term);
    },
  );

  it("makes a single LLM call per question", () => {
    const models = workflow.nodes.filter((node) => node.type.includes("lmChat"));
    expect(models).toHaveLength(1);
  });
});

describe("what must be preserved", () => {
  it("keeps the webhook id so N8N_WEBHOOK_URL stays valid", () => {
    expect(nodeNamed("When chat message received").webhookId).toBe(
      "7971e831-7c4e-42fe-9f7c-fa6c96756dab",
    );
  });

  it("keeps the Gmail contact tool pointed at the right address", () => {
    expect(nodeNamed("Send a message in Gmail").parameters.sendTo).toBe(profile.email);
  });

  it("keeps conversation memory", () => {
    const params = nodeNamed("Simple Memory").parameters as { contextWindowLength: number };
    expect(params.contextWindowLength).toBeGreaterThanOrEqual(10);
  });
});

describe("graph integrity", () => {
  it("only connects nodes that exist", () => {
    const names = new Set(workflow.nodes.map((node) => node.name));

    for (const [source, outputs] of Object.entries(workflow.connections)) {
      expect(names, `unknown source ${source}`).toContain(source);

      for (const groups of Object.values(outputs)) {
        for (const group of groups) {
          for (const connection of group) {
            expect(names, `unknown target ${connection.node}`).toContain(connection.node);
          }
        }
      }
    }
  });

  it("routes trigger → fetch → agent in that order", () => {
    expect(workflow.connections["When chat message received"].main[0][0].node).toBe(
      "Fetch knowledge",
    );
    expect(workflow.connections["Fetch knowledge"].main[0][0].node).toBe("AI Agent");
  });

  it("gives every node a unique id", () => {
    const ids = workflow.nodes.map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("system prompt", () => {
  it("is free of the mis-decoded characters the old prompt carried", () => {
    // The previous prompt had UTF-8 read as Latin-1: "Rudyâs", "âI donâtâ.
    for (const artefact of ["â€", "Ã©", "â¢", "Â"]) {
      expect(agentSystemMessage()).not.toContain(artefact);
    }
  });

  it("forbids inventing facts and pins the answer language", () => {
    const prompt = agentSystemMessage();
    expect(prompt).toMatch(/never invent/i);
    expect(prompt).toMatch(/same language/i);
  });

  it("offers the real contact address when knowledge is missing", () => {
    expect(agentSystemMessage()).toContain(profile.email);
  });
});
