import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { calculateEstimate, createEstimateAnswers, estimatePricing, formatEstimateAmount, formatEstimateRange, formatEstimateTotal, getEstimateLabel, getVisibleFeatures, normalizeEstimateAnswers } from "../src/data/estimate-pricing.ts";
import { submitWeb3Forms } from "../src/lib/web3forms.ts";

const answers = (overrides = {}) => ({ ...createEstimateAnswers(), projectType: "web-app", applicationSize: "small", design: "completed", ...overrides });
const scenarios = [
  ["website page count and features", { projectType: "static-website", websiteSize: "4-7", features: ["contact-forms", "galleries"] }, { min: 4200, max: 7000 }],
  ["scope, design, and shared-feature credits", { applicationSize: "medium", design: "custom", features: ["login", "profiles", "stripe", "subscriptions", "ecommerce"] }, { min: 23300, max: 41500 }],
  ["included backend database, admin, and API", { projectType: "backend", features: ["database", "admin", "custom-api"] }, { min: 8000, max: 12000 }],
  ["profiles without login", { features: ["profiles"] }, { min: 8600, max: 13000 }],
  ["profiles included with login", { features: ["login", "profiles"] }, { min: 10000, max: 16000 }],
  ["shared Stripe setup without explicit Stripe selection", { features: ["subscriptions", "ecommerce"] }, { min: 14300, max: 24500 }],
  ["combined base and shared features charged once", { projectType: "web-ios", websiteSize: "1-3", features: ["login", "profiles", "push", "ecommerce", "stripe", "location", "location"] }, { min: 31300, max: 48500 }],
  ["combined website and application scope", { projectType: "web-ios", websiteSize: "4-7", applicationSize: "medium", design: "custom", features: ["maps", "location"] }, { min: 32200, max: 49000 }],
  ["unknown category sums known ranges without inferring size fees", { projectType: "not-sure", applicationSize: "large", design: "custom", features: ["contact-forms", "camera", "workflows"] }, { min: 4300, max: 8500 }],
  ["uncertain size/design with static CMS", { projectType: "static-website", websiteSize: "16-plus", design: "not-sure", features: ["cms"] }, { min: 4500, max: 7500 }],
  ["hidden, unknown, and duplicate features cannot add charges", { projectType: "static-website", websiteSize: "1-3", features: ["push", "login", "galleries", "galleries", "unknown"] }, { min: 2500, max: 4000 }],
];
for (const [label, overrides, expected] of scenarios) test("pricing: " + label, () => assert.deepEqual(calculateEstimate(answers(overrides)).subtotal, expected));

test("approved base ranges include the basic scope without additional selection", () => {
  const baseRanges = [
    ["static-website", { min: 2000, max: 3000 }],
    ["dynamic-website", { min: 4000, max: 5000 }],
    ["web-app", { min: 8000, max: 12000 }],
    ["backend", { min: 8000, max: 12000 }],
    ["ios", { min: 15000, max: 20000 }],
    ["web-ios", { min: 22000, max: 30000 }],
  ];
  for (const [projectType, expected] of baseRanges) {
    const result = calculateEstimate(answers({ projectType, websiteSize: "1-3" }));
    assert.deepEqual(result.subtotal, expected);
    assert.equal(result.hasUnpricedWork, false);
    assert.equal(getEstimateLabel(result), "Preliminary development range");
    assert.ok(result.lineItems.find((item) => item.kind === "base").note);
  }
});

test("CMS and database are included in the editable business website", () => {
  const result = calculateEstimate(answers({ projectType: "dynamic-website", websiteSize: "1-3", features: ["cms", "database"] }));
  assert.deepEqual(result.subtotal, { min: 4000, max: 5000 });
  for (const feature of ["cms", "database"]) {
    const item = result.lineItems.find((entry) => entry.id === feature);
    assert.deepEqual(item.amount, { min: 0, max: 0 });
    assert.ok(item.note);
  }
  assert.match(result.lineItems.find((item) => item.id === "cms").note, /one content collection/);
});

test("included database/admin/API requirements appear even without manual selection", () => {
  for (const projectType of ["dynamic-website", "web-app", "backend", "web-ios"]) {
    const result = calculateEstimate(answers({ projectType, websiteSize: "1-3" }));
    assert.deepEqual(result.lineItems.find((item) => item.id === "database").amount, { min: 0, max: 0 });
  }
  const backend = calculateEstimate(answers({ projectType: "backend" }));
  for (const feature of ["admin", "custom-api"]) {
    const item = backend.lineItems.find((entry) => entry.id === feature);
    assert.deepEqual(item.amount, { min: 0, max: 0 });
    assert.match(item.note, /basic/i);
  }
});

test("profile and Stripe credits are positive magnitudes with matching-endpoint deductions", () => {
  const result = calculateEstimate(answers({ features: ["login", "profiles", "stripe", "subscriptions", "ecommerce"] }));
  const profileCredit = result.lineItems.find((item) => item.id === "account-profile");
  const stripeCredit = result.lineItems.find((item) => item.id === "stripe-setup");
  assert.equal(profileCredit.kind, "credit");
  assert.deepEqual(profileCredit.amount, { min: 600, max: 1000 });
  assert.deepEqual(stripeCredit.amount, { min: 2400, max: 5000 });
  assert.deepEqual(result.subtotal, { min: 16300, max: 28500 });
});

test("selecting included profile/payment setup adds no cost beyond the containing feature", () => {
  const profiles = calculateEstimate(answers({ features: ["login"] }));
  assert.deepEqual(calculateEstimate(answers({ features: ["login", "profiles"] })).subtotal, profiles.subtotal);
  for (const feature of ["subscriptions", "ecommerce"]) {
    const containing = calculateEstimate(answers({ features: [feature] }));
    assert.deepEqual(calculateEstimate(answers({ features: [feature, "stripe"] })).subtotal, containing.subtotal);
  }
});

test("project changes preserve compatible information, payment preference, and input data", () => {
  const original = answers({ projectType: "static-website", websiteSize: "8-15", applicationSize: "medium", design: "custom", features: ["login", "push", "blog", "location", "location"], name: "Alex", email: "alex@example.com", description: "A useful app", budget: "20000-50000", timeline: "flexible", maintenance: "yes", paymentPreference: "monthly" });
  const snapshot = structuredClone(original);
  const normalized = normalizeEstimateAnswers(original);
  assert.deepEqual(normalized.features, ["blog", "location"]);
  assert.equal(normalized.websiteSize, "8-15");
  assert.equal(normalized.applicationSize, "");
  for (const field of ["design", "name", "email", "description", "budget", "timeline", "maintenance", "paymentPreference"]) assert.equal(normalized[field], original[field]);
  assert.deepEqual(original, snapshot);
  const ios = normalizeEstimateAnswers({ ...normalized, projectType: "ios" });
  assert.equal(ios.websiteSize, "");
  assert.deepEqual(ios.features, ["location"]);
  assert.equal(getVisibleFeatures("invalid").length, 0);
  assert.equal(getVisibleFeatures("static-website").some((feature) => feature.group === "mobile"), false);
  assert.equal(getVisibleFeatures("web-ios").filter((feature) => feature.id === "location").length, 1);
});

test("large and unknown scopes retain priced items and require a custom quote", () => {
  for (const applicationSize of ["large", "not-sure", "invalid-size"]) {
    const result = calculateEstimate(answers({ applicationSize }));
    assert.deepEqual(result.subtotal, { min: 8000, max: 12000 });
    assert.equal(result.needsReview, true);
    assert.equal(result.hasUnpricedWork, true);
    assert.equal(getEstimateLabel(result), "Priced-items range");
  }
  const website = calculateEstimate(answers({ projectType: "static-website", websiteSize: "16-plus" }));
  assert.deepEqual(website.subtotal, { min: 2000, max: 3000 });
  assert.equal(website.hasUnpricedWork, true);
});

test("unpriced features remain explicit requirements alongside known ranges", () => {
  const unknown = calculateEstimate(answers({ projectType: "not-sure", applicationSize: "large", features: ["workflows"] }));
  assert.equal(unknown.hasCustomBase, true);
  assert.equal(unknown.needsReview, true);
  assert.equal(unknown.hasUnpricedWork, true);
  assert.equal(unknown.lineItems.find((item) => item.id === "general-scope").amount, null);
  assert.equal(unknown.lineItems.find((item) => item.id === "workflows").amount, null);
  const integration = calculateEstimate(answers({ features: ["integration"] }));
  assert.deepEqual(integration.subtotal, { min: 8000, max: 12000 });
  assert.ok(integration.reviewReasons.some((reason) => reason.includes("Third-party")));
  assert.equal(getEstimateLabel(integration), "Priced-items range");
});

test("budget, ongoing services, and payment preferences never influence either endpoint", () => {
  const original = calculateEstimate(answers({ features: ["login", "booking"] }));
  for (const budget of estimatePricing.budgets) for (const maintenance of estimatePricing.maintenance) for (const paymentPreference of ["", ...estimatePricing.paymentPreferences.map((option) => option.id)]) {
    assert.deepEqual(calculateEstimate(answers({ features: ["login", "booking"], budget: budget.id, maintenance: maintenance.id, paymentPreference })), original);
  }
});

test("urgency requires review without unpriced work, a surcharge, or a delivery promise", () => {
  const regular = calculateEstimate(answers({ timeline: "flexible" }));
  for (const timeline of ["within-month", "asap"]) {
    const urgent = calculateEstimate(answers({ timeline }));
    assert.deepEqual(urgent.subtotal, regular.subtotal);
    assert.equal(urgent.needsReview, true);
    assert.equal(urgent.hasUnpricedWork, false);
    assert.equal(getEstimateLabel(urgent), "Preliminary development range");
    assert.ok(urgent.reviewReasons.some((reason) => reason.includes("not guaranteed")));
  }
});

test("range formatting says to between endpoints and labels credits without a subtraction sign", () => {
  assert.equal(formatEstimateRange({ min: 2000, max: 3000 }), "$2,000 to $3,000");
  assert.equal(formatEstimateRange({ min: 4000, max: 4000 }), "$4,000");
  assert.equal(formatEstimateAmount({ min: 0, max: 0 }), "Included");
  assert.equal(formatEstimateAmount(null), "Custom quote required");
  assert.equal(formatEstimateAmount({ min: 600, max: 1000 }, true), "$600 to $1,000 credit");
});

test("unresolved projects with no priced work show custom quote instead of a zero-price offer", () => {
  const result = calculateEstimate(answers({ projectType: "not-sure", applicationSize: "not-sure", design: "not-sure" }));
  assert.deepEqual(result.subtotal, { min: 0, max: 0 });
  assert.equal(formatEstimateTotal(result), "Custom quote required");
  const partiallyPriced = calculateEstimate(answers({ projectType: "improvements", design: "custom" }));
  assert.equal(formatEstimateTotal(partiallyPriced), "$3,000 to $6,000");
  assert.equal(getEstimateLabel(partiallyPriced), "Priced-items range");
});

test("configured ranges and shared components stay valid when prices are edited", () => {
  const choices = [...estimatePricing.projectTypes, ...estimatePricing.websiteSizes, ...estimatePricing.applicationSizes, ...estimatePricing.designOptions, ...estimatePricing.features, ...estimatePricing.sharedCosts];
  for (const choice of choices) {
    if (choice.amount === null) continue;
    assert.ok(Number.isSafeInteger(choice.amount.min) && choice.amount.min >= 0, choice.id);
    assert.ok(Number.isSafeInteger(choice.amount.max) && choice.amount.max >= choice.amount.min, choice.id);
  }
  for (const shared of estimatePricing.sharedCosts) for (const id of shared.features) {
    const feature = estimatePricing.features.find((entry) => entry.id === id);
    assert.ok(feature.amount.min >= shared.amount.min && feature.amount.max >= shared.amount.max, id);
  }
});

test("calculations do not mutate pricing or feature ranges", () => {
  const snapshot = structuredClone(estimatePricing);
  calculateEstimate(answers({ applicationSize: "medium", design: "custom", features: ["login", "profiles", "stripe", "subscriptions", "ecommerce"] }));
  assert.deepEqual(estimatePricing, snapshot);
});

test("an unanswered project does not produce a quote", () => {
  const result = calculateEstimate(createEstimateAnswers());
  assert.equal(result.hasProject, false);
  assert.deepEqual(result.lineItems, []);
});

afterEach(() => mock.restoreAll());
const payload = { name: "Test visitor", email: "visitor@example.com", message: "A project request", botcheck: false };
const response = (body, status = 200) => new Response(JSON.stringify(body), { status });

test("delivery requires both successful HTTP and explicit provider success", async () => {
  const calls = mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://api.web3forms.com/submit");
    assert.equal(options.method, "POST");
    const body = JSON.parse(options.body);
    assert.equal(body.access_key, "test-access-key");
    assert.equal(body.message, payload.message);
    assert.equal(body.botcheck, false);
    assert.ok(options.signal);
    return response({ success: true, body: { message: "Sent" } });
  });
  await submitWeb3Forms(payload, "test-access-key");
  assert.equal(calls.mock.callCount(), 1);
});

test("missing configuration and populated honeypots never make network requests", async () => {
  const calls = mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected request"); });
  await assert.rejects(submitWeb3Forms(payload, ""), /not connected/);
  await assert.rejects(submitWeb3Forms({ ...payload, botcheck: true }, "test-access-key"), /could not be sent/);
  assert.equal(calls.mock.callCount(), 0);
});

const failureCases = [
  ["documented nested rejection", { success: false, body: { message: "Please check your email address" } }, 400, /Please check your email address/],
  ["existing top-level rejection", { success: false, message: "Request rejected" }, 200, /Request rejected/],
  ["HTTP error with success-looking body", { success: true }, 500, /could not be confirmed/],
  ["non-boolean success", { success: "true" }, 200, /could not be confirmed/],
  ["rate limit without automatic retry", { success: false }, 429, /wait a few minutes/],
];
for (const [label, body, status, expected] of failureCases) test(`delivery: ${label}`, async () => {
  const calls = mock.method(globalThis, "fetch", async () => response(body, status));
  await assert.rejects(submitWeb3Forms(payload, "test-access-key"), expected);
  assert.equal(calls.mock.callCount(), 1);
});

test("malformed bodies cannot confirm delivery", async () => {
  mock.method(globalThis, "fetch", async () => new Response("<html>Unavailable</html>", { status: 200 }));
  await assert.rejects(submitWeb3Forms(payload, "test-access-key"), /could not be confirmed/);
});

test("network errors explain uncertain delivery without retrying", async () => {
  const calls = mock.method(globalThis, "fetch", async () => { throw new TypeError("Failed to fetch"); });
  await assert.rejects(submitWeb3Forms(payload, "test-access-key"), /Check your connection/);
  assert.equal(calls.mock.callCount(), 1);
});

test("stalled requests abort within the bounded timeout", async () => {
  const calls = mock.method(globalThis, "fetch", async (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
  }));
  await assert.rejects(submitWeb3Forms(payload, "test-access-key", { timeoutMs: 15 }), /connection timed out/);
  assert.equal(calls.mock.callCount(), 1);
});
