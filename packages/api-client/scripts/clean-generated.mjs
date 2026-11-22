// Removes previously generated code so renamed or deleted endpoints don't linger.
import { rm } from 'node:fs/promises';

await rm(new URL('../src/generated', import.meta.url), { recursive: true, force: true });
