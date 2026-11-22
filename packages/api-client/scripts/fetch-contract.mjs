// Downloads the API's OpenAPI contract and saves a snapshot inside this
// package (./openapi.json). The API is reached only over HTTP — this package
// never reads files from the API's folder.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const url = process.env.API_CONTRACT_URL ?? 'http://localhost:4000/api/docs-json';
const target = fileURLToPath(new URL('../openapi.json', import.meta.url));

let res;
try {
  res = await fetch(url);
} catch {
  console.error(`Could not reach ${url}. Start the API first (npm run dev), or set API_CONTRACT_URL.`);
  process.exit(1);
}
if (!res.ok) {
  console.error(`GET ${url} returned ${res.status}. Is Swagger enabled (not NODE_ENV=production)?`);
  process.exit(1);
}

const contract = await res.json();
if (typeof contract.openapi !== 'string' || typeof contract.paths !== 'object') {
  console.error(`${url} did not return an OpenAPI document.`);
  process.exit(1);
}

await writeFile(target, JSON.stringify(contract, null, 2) + '\n');
console.log(`Saved contract (${Object.keys(contract.paths).length} paths) from ${url}`);
