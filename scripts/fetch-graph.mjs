import { writeFileSync, existsSync } from "fs";

const GRAPH_URL =
  "https://raw.githubusercontent.com/anbarsaleem/cv-graph/main/graph.json";
const OUT_PATH = "public/graph.json";

async function fetchGraph() {
  if (existsSync(OUT_PATH) && !process.env.CI) {
    console.log(`[fetch-graph] ${OUT_PATH} exists locally, skipping fetch`);
    return;
  }

  console.log(`[fetch-graph] Fetching from ${GRAPH_URL}`);
  const res = await fetch(GRAPH_URL);
  if (!res.ok) {
    console.warn(
      `[fetch-graph] Failed to fetch (${res.status}), using existing file`
    );
    return;
  }

  const data = await res.text();
  writeFileSync(OUT_PATH, data);
  const parsed = JSON.parse(data);
  console.log(
    `[fetch-graph] Wrote ${parsed.meta.total_nodes} nodes, ${parsed.meta.total_edges} edges`
  );
}

fetchGraph();
