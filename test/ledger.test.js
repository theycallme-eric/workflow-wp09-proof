import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const featureDirectory = join(process.cwd(), "features");

test("every synthetic build record is non-empty plain text", () => {
  if (!existsSync(featureDirectory)) {
    return;
  }

  for (const name of readdirSync(featureDirectory)) {
    assert.match(name, /^[a-z-]+\.txt$/);
    assert.notEqual(readFileSync(join(featureDirectory, name), "utf8").trim(), "");
  }
});

test("the integration record references both completed branches", () => {
  const integrationPath = join(featureDirectory, "integration.txt");
  if (!existsSync(integrationPath)) {
    return;
  }

  assert.equal(existsSync(join(featureDirectory, "alpha-complete.txt")), true);
  assert.equal(existsSync(join(featureDirectory, "beta-complete.txt")), true);
  const integration = readFileSync(integrationPath, "utf8");
  assert.match(integration, /alpha-complete/);
  assert.match(integration, /beta-complete/);
});
