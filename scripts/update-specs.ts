import fs from "fs";
import path from "path";

const SPEC_URL = "https://docs.google.com/document/d/1sNbaWNmp2qaHzpQtT9f2SPzSlSQKI-hUVQmwXbTmw5U/edit?tab=t.0/export?format=txt";

const OUTPUT_PATH = path.join(process.cwd(), "specs.md");

async function updateSpecs() {
  console.log("Fetching spec from:", SPEC_URL);

  const res = await fetch(SPEC_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();

// Opcional: añade marca de sincronización arriba
  const stamped =
    `<!-- Source: ${SPEC_URL} -->\n` +
    `<!-- Last sync: ${new Date().toISOString()} -->\n\n` +
    text.trim() +
    "\n";

  fs.writeFileSync(OUTPUT_PATH, stamped, "utf8");

  console.log("specs.md updated successfully ✅");
}

updateSpecs().catch((err) => {
  console.error("Error updating specs:", err);
  process.exit(1);
});
