// Edit USD development ranges, scope explanations, inclusions, and shared components here.
// Monthly hosting/maintenance and third-party fees are quoted separately.
export type PriceRange = { min: number; max: number };
export type ProjectTypeId = "static-website" | "dynamic-website" | "web-app" | "backend" | "ios" | "web-ios" | "improvements" | "not-sure";
export type FeatureGroupId = "website" | "accounts" | "business" | "payments" | "media" | "mobile";
export type ScopeKind = "website" | "application" | "both" | "general";

type PriceOption = { id: string; label: string; amount: PriceRange | null; description?: string; scopeNote?: string };
type ProjectType = PriceOption & {
  id: ProjectTypeId; description: string; scopeNote: string; scope: ScopeKind;
  includedFeatures: readonly string[]; includedFeatureNotes?: Readonly<Partial<Record<string, string>>>;
};
export type Feature = PriceOption & { group: FeatureGroupId; description: string; projects: readonly ProjectTypeId[]; reviewFor?: readonly ProjectTypeId[] };

function range(min: number, max = min): PriceRange {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min < 0 || max < min) {
    throw new Error("Development prices must be nonnegative integer USD ranges with min <= max.");
  }
  return { min, max };
}

const allProjects: readonly ProjectTypeId[] = ["static-website", "dynamic-website", "web-app", "backend", "ios", "web-ios", "improvements", "not-sure"];
const websiteProjects: readonly ProjectTypeId[] = ["static-website", "dynamic-website", "web-app", "web-ios", "improvements", "not-sure"];
const advancedProjects: readonly ProjectTypeId[] = allProjects.filter((id) => id !== "static-website");
const visualProjects: readonly ProjectTypeId[] = allProjects.filter((id) => id !== "backend");
const mobileProjects: readonly ProjectTypeId[] = ["ios", "web-ios", "improvements", "not-sure"];

export const estimatePricing = {
  currency: "USD",
  locale: "en-US",
  baseNote: "Starting ranges assume a completed design, copy, and assets supplied by you. Development includes security essentials, functional and accessibility checks, and initial deployment or handoff. App Store submission assistance is a separate selection.",
  scopeNote: "Page and screen counts are planning guides. Unusual workflows or architecture may need a custom quote.",
  ongoingServiceNote: "Hosting, maintenance, support allowances, and usage costs are quoted separately after I review your project. Third-party charges, domains, and App Store fees are also separate. An offline app may need maintenance without any hosting.",
  paymentNote: "Payment schedules are agreed after scoping. Development installments spread the agreed project fee; they are separate from hosting and maintenance charges.",
  projectTypes: [
    { id: "static-website", label: "Static website", description: "An informational site, such as a brochure, portfolio, or service website.", scopeNote: "Covers 1–3 main pages using your completed design, copy, and assets.", amount: range(2000, 3000), scope: "website", includedFeatures: [] },
    { id: "dynamic-website", label: "Business website with editable content", description: "A business site where you can update pages, service listings, or company news yourself.", scopeNote: "Covers 1–3 main pages, basic page editing, one content collection (such as news articles), and its database.", amount: range(4000, 5000), scope: "website", includedFeatures: ["database", "cms"], includedFeatureNotes: { cms: "Basic page editing and one content collection, such as news articles, are included. Complex publishing or approval workflows need review.", database: "The database supporting your included content system is included." } },
    { id: "web-app", label: "Custom web application", description: "A product people use in a browser, such as a client portal or a focused business tool.", scopeNote: "Covers roughly 3–5 main screens, one core workflow, and a basic backend/database. Additional capabilities are selected below.", amount: range(8000, 12000), scope: "application", includedFeatures: ["database"], includedFeatureNotes: { database: "A basic backend/database for the small application scope is included." } },
    { id: "backend", label: "Backend and admin system", description: "Staff tools for managing business information, such as customers and appointments, or connecting your products.", scopeNote: "Covers one core workflow, up to three types of related records, basic admin screens, secure staff access, and a basic API for connecting products.", amount: range(8000, 12000), scope: "application", includedFeatures: ["database", "admin", "custom-api"], includedFeatureNotes: { database: "Up to three types of related records for the base business workflow are included.", admin: "Basic admin screens and secure staff access for the base workflow are included. More extensive management tools need review.", "custom-api": "A basic API for the base workflow is included. More extensive endpoints or external integration requirements need review." } },
    { id: "ios", label: "iOS application", description: "An app for iPhone, such as a focused customer tool or on-device workflow.", scopeNote: "Covers roughly 3–5 main screens and one core workflow. Hosted backend capabilities are additional when needed.", amount: range(15000, 20000), scope: "application", includedFeatures: [] },
    { id: "web-ios", label: "Website + iOS application", description: "An informational website and iPhone app built around a shared system.", scopeNote: "Covers a 1–3-page website, a focused 3–5-screen iPhone app, and one shared basic backend/database. Shared development is already included.", amount: range(22000, 30000), scope: "both", includedFeatures: ["database"], includedFeatureNotes: { database: "One basic database shared by the website and iPhone app is included." } },
    { id: "improvements", label: "Existing project improvements", description: "New features, fixes, or a redesign for something you already have.", scopeNote: "I’ll review the existing product and requirements before quoting. Separately priced selections can still appear in your range.", amount: null, scope: "general", includedFeatures: [] },
    { id: "not-sure", label: "Not sure yet", description: "Tell me the problem you want to solve, and we can choose the right approach together.", scopeNote: "The project needs a custom quote. Any priced choices below cover only those selected items.", amount: null, scope: "general", includedFeatures: [] },
  ] satisfies ProjectType[],
  websiteSizes: [
    { id: "1-3", label: "1–3 pages", description: "A few main page layouts, such as Home, Services, and Contact. Repeated articles/products do not add pages.", amount: range(0) },
    { id: "4-7", label: "4–7 pages", description: "Additional main page layouts and implementation, such as separate service or company pages.", amount: range(1200, 2000) },
    { id: "8-15", label: "8–15 pages", description: "A larger informational or content site with more main pages and navigation.", amount: range(3000, 5000) },
    { id: "16-plus", label: "16+ pages", description: "We’ll confirm the page structure and content requirements before pricing.", amount: null },
    { id: "not-sure", label: "Not sure", description: "Share what the site should contain; I’ll help work out the page count.", amount: null },
  ] satisfies PriceOption[],
  applicationSizes: [
    { id: "small", label: "Small, focused application", description: "Roughly 3–5 main app screens for one core workflow, or a small backend supporting that workflow.", amount: range(0) },
    { id: "medium", label: "Medium application", description: "Roughly 6–10 main app screens, or several connected modules in a backend system.", amount: range(4000, 7000) },
    { id: "large", label: "Large, complex application", description: "11+ main app screens or substantial workflow/architecture complexity. This scope needs a custom quote.", amount: null },
    { id: "not-sure", label: "Not sure", description: "Describe the tasks users or staff need to complete; we can define the screen or module scope together.", amount: null },
  ] satisfies PriceOption[],
  designOptions: [
    { id: "completed", label: "I already have a completed design.", description: "Ready-to-build desktop/mobile layouts, relevant screen states, and supplied assets.", amount: range(0) },
    { id: "branding", label: "I have branding but need a design.", description: "Create the layouts using your existing logo, colors, and brand direction.", amount: range(1500, 3000) },
    { id: "custom", label: "I need a completely custom design.", description: "Create the interface structure and visual direction for the agreed scope. Branding and copywriting are separately scoped.", amount: range(3000, 6000) },
    { id: "redesign", label: "I want to redesign something existing.", description: "Redesign the current interface using its existing content and requirements.", amount: range(2500, 5000) },
    { id: "not-sure", label: "Not sure.", description: "We’ll review what you have and the design work your project needs.", amount: null },
  ] satisfies PriceOption[],
  featureGroups: [
    { id: "website", label: "Website features", description: "Add-on website capabilities; page layouts are sized separately. Each range covers the standard version described below." },
    { id: "accounts", label: "Accounts and sign-in", description: "Customer accounts and access. Basic profiles are included with registration/login; shared setup is credited once." },
    { id: "business", label: "Backend and business tools", description: "Manage information and everyday operations. Included items cover the basic scope in your project’s starting range." },
    { id: "payments", label: "Payments and scheduling", description: "Payments, sales, and appointments. Standard Stripe setup is shared across payments, subscriptions, and e-commerce and credited once." },
    { id: "media", label: "Media and integrations", description: "Files, notifications, and other services. Larger or specialized versions need review; service usage fees are separate." },
    { id: "mobile", label: "iPhone app features", description: "Device features and app delivery. Each range covers the limited workflow described; extensive variants need review." },
  ] satisfies { id: FeatureGroupId; label: string; description: string }[],
  features: [
    { id: "contact-forms", group: "website", label: "Contact forms", description: "One working inquiry form that delivers visitor messages, with validation and spam protection. The Contact page layout/content counts under website size; this price covers the form behavior.", amount: range(500, 1000), projects: websiteProjects },
    { id: "blog", group: "website", label: "Blog", description: "Article views and categories using the content system. Writing articles is separately scoped.", amount: range(1000, 2000), projects: websiteProjects },
    { id: "cms", group: "website", label: "Content management", description: "Edit basic pages and one content collection yourself. Complex publishing or approval workflows need review.", amount: range(2500, 4500), projects: websiteProjects, reviewFor: ["static-website"] },
    { id: "galleries", group: "website", label: "Image galleries", description: "One gallery with supplied images and standard viewing controls.", amount: range(500, 1000), projects: websiteProjects },
    { id: "animations", group: "website", label: "Custom animations", description: "A small set of interface interactions, such as section entrances or button feedback.", amount: range(800, 1500), projects: websiteProjects },
    { id: "search", group: "website", label: "Search and filtering", description: "Search one content set with a small set of filters, such as categories or dates.", amount: range(2000, 4000), projects: websiteProjects },
    { id: "multilingual", group: "website", label: "Multilingual support", description: "Offer the interface in two languages using translations you supply. Translation services are separate.", amount: range(1500, 3000), projects: websiteProjects },
    { id: "login", group: "accounts", label: "User registration and login", description: "Account creation, sign-in, password recovery, and basic personal profiles.", amount: range(2000, 4000), projects: advancedProjects },
    { id: "profiles", group: "accounts", label: "User profiles", description: "Basic personal details and preferences. Already included with registration/login; selecting both does not add this setup twice.", amount: range(600, 1000), projects: advancedProjects },
    { id: "permissions", group: "accounts", label: "Role-based permissions", description: "Define access for up to three standard user roles, such as customer, staff, and manager.", amount: range(1500, 3000), projects: advancedProjects },
    { id: "social-login", group: "accounts", label: "Social login", description: "Sign in with up to two standard providers, such as Google or Apple. Enterprise sign-in needs review.", amount: range(1000, 2000), projects: advancedProjects },
    { id: "mfa", group: "accounts", label: "Multi-factor authentication", description: "One standard additional verification method for sign-in, beyond the included security essentials.", amount: range(1200, 2500), projects: advancedProjects },
    { id: "admin", group: "business", label: "Admin dashboard", description: "Manage up to two standard record modules with restricted staff access. More extensive administration needs review.", amount: range(4000, 8000), projects: advancedProjects },
    { id: "database", group: "business", label: "Database functionality", description: "Store up to three types of related records, such as customers, appointments, and services.", amount: range(2500, 4500), projects: advancedProjects },
    { id: "customers", group: "business", label: "Customer management", description: "Create, view, and update basic customer records. Extensive sales or CRM automation needs review.", amount: range(2500, 5000), projects: advancedProjects },
    { id: "employees", group: "business", label: "Employee management", description: "Manage basic staff records and a directory. Payroll and broader HR systems are separately scoped.", amount: range(2500, 5000), projects: advancedProjects },
    { id: "inventory", group: "business", label: "Inventory management", description: "Track stock and adjustments for one location. Multiple warehouses or specialized fulfillment need review.", amount: range(4000, 8000), projects: advancedProjects },
    { id: "reports", group: "business", label: "Reports and analytics", description: "Up to three defined reports showing useful summaries from your application’s data.", amount: range(2500, 5000), projects: advancedProjects },
    { id: "custom-api", group: "business", label: "Custom API", description: "Documented endpoints for one core workflow so other products can connect. External service integration is a separate selection.", amount: range(4000, 8000), projects: advancedProjects },
    { id: "workflows", group: "business", label: "Automated business workflows", description: "Automate a process specific to your business. The number of steps, rules, and services needs review before pricing.", amount: null, projects: advancedProjects },
    { id: "stripe", group: "payments", label: "Stripe payments", description: "Standard checkout and payment confirmation for one currency. This setup is included in subscriptions and e-commerce; processing fees are separate.", amount: range(1200, 2500), projects: advancedProjects },
    { id: "subscriptions", group: "payments", label: "Recurring subscriptions", description: "Standard recurring customer billing with up to three plans, including shared Stripe setup. Service fees are separate.", amount: range(2500, 5000), projects: advancedProjects },
    { id: "booking", group: "payments", label: "Appointment booking", description: "One appointment and availability workflow, such as choosing an available service time.", amount: range(3000, 6000), projects: advancedProjects },
    { id: "calendar", group: "payments", label: "Calendar integration", description: "Connect one calendar provider with basic one-way event integration. Two-way synchronization needs review.", amount: range(1000, 2000), projects: advancedProjects },
    { id: "invoicing", group: "payments", label: "Invoicing", description: "A basic invoice creation and sending workflow. Broader accounting systems are separately scoped.", amount: range(2000, 4000), projects: advancedProjects },
    { id: "ecommerce", group: "payments", label: "E-commerce functionality", description: "A standard product catalog, cart, and checkout for one currency, including Stripe setup. Specialized fulfillment or marketplaces need review.", amount: range(5000, 10000), projects: advancedProjects },
    { id: "uploads", group: "media", label: "Image and document uploads", description: "One file-submission workflow with validation using available storage. Setting up new cloud storage is a separate selection.", amount: range(1000, 2000), projects: advancedProjects },
    { id: "cloud-storage", group: "media", label: "Cloud storage", description: "Set up one online file-storage use case with access controls. Storage and usage fees are separate.", amount: range(1000, 2000), projects: advancedProjects },
    { id: "email-notifications", group: "media", label: "Automated email notifications", description: "Up to three transactional notification events, such as confirmations or status updates. Email service fees are separate.", amount: range(600, 1200), projects: advancedProjects },
    { id: "integration", group: "media", label: "Third-party API integration", description: "Connect an external service. Its requirements and the workflow need review before pricing; provider fees are separate.", amount: null, projects: advancedProjects },
    { id: "maps", group: "media", label: "Interactive maps", description: "One interactive map with standard markers and search. Advanced routing or tracking needs review; map service fees are separate.", amount: range(1200, 2500), projects: visualProjects },
    { id: "location", group: "media", label: "Device location", description: "Use device location, with permission, for one workflow. Continuous tracking or specialized location rules need review.", amount: range(800, 1500), projects: visualProjects },
    { id: "push", group: "mobile", label: "Push notifications", description: "Up to three app notification events with device permissions and standard delivery setup.", amount: range(1500, 3000), projects: mobileProjects },
    { id: "camera", group: "mobile", label: "Camera integration", description: "Basic photo capture inside your app. Specialized scanning or video processing needs review.", amount: range(800, 1500), projects: mobileProjects },
    { id: "offline", group: "mobile", label: "Offline functionality", description: "Limited caching and one offline workflow with straightforward synchronization. Advanced conflict handling needs review.", amount: range(4000, 8000), projects: mobileProjects },
    { id: "biometrics", group: "mobile", label: "Biometric authentication", description: "Device-level Face ID or Touch ID access for supported actions, such as unlocking the app.", amount: range(600, 1200), projects: mobileProjects },
    { id: "in-app-purchases", group: "mobile", label: "In-app purchases", description: "One standard Apple purchase workflow or product type. Purchase requirements need review, and Apple’s fees are separate.", amount: range(3000, 6000), projects: mobileProjects },
    { id: "app-store", group: "mobile", label: "App Store submission assistance", description: "Prepare one listing, build, and submission. Approval remains Apple’s decision; account fees are separate.", amount: range(800, 1500), projects: mobileProjects },
  ] satisfies Feature[],
  // Each named feature's full range contains this identical, correlated component.
  // Remove duplicate components at their matching endpoints, rather than subtracting independent intervals.
  sharedCosts: [
    { id: "account-profile", label: "Shared account/profile setup", amount: range(600, 1000), features: ["login", "profiles"] },
    { id: "stripe-setup", label: "Shared Stripe setup", amount: range(1200, 2500), features: ["stripe", "subscriptions", "ecommerce"] },
  ],
  timelines: [
    { id: "flexible", label: "Flexible", description: "We can agree on a schedule after reviewing the scope and availability.", review: false },
    { id: "3-6-months", label: "3–6 months", description: "Your preferred delivery window; the schedule is confirmed after review.", review: false },
    { id: "1-3-months", label: "1–3 months", description: "Your preferred delivery window; the schedule is confirmed after review.", review: false },
    { id: "within-month", label: "Within 1 month", description: "An expedited request that needs a scope and availability review.", review: true },
    { id: "asap", label: "As soon as possible", description: "Share any deadline in your project details so I can review what is practical.", review: true },
  ],
  budgets: [
    { id: "under-2500", label: "Under $2,500" },
    { id: "2500-5000", label: "$2,500–$5,000" },
    { id: "5000-10000", label: "$5,000–$10,000" },
    { id: "10000-20000", label: "$10,000–$20,000" },
    { id: "20000-50000", label: "$20,000–$50,000" },
    { id: "50000-plus", label: "$50,000+" },
    { id: "not-sure", label: "Not sure" },
  ],
  maintenance: [
    { id: "yes", label: "Yes", description: "I’d like help with hosting and maintenance after launch. These services will be quoted separately." },
    { id: "no", label: "No", description: "I’ll arrange my own hosting and maintenance after handoff." },
    { id: "not-sure", label: "Not sure", description: "Explain the hosting and maintenance options suitable for my project." },
  ],
  paymentPreferences: [
    { id: "one-payment", label: "One payment", description: "Pay the agreed development fee in one payment on an agreed schedule." },
    { id: "milestones", label: "Agreed milestones", description: "Split the development fee across agreed project milestones." },
    { id: "monthly", label: "Monthly development installments", description: "Discuss spreading the development fee over an agreed monthly schedule." },
    { id: "discuss", label: "Discuss payment options", description: "Work out a suitable payment arrangement together after scoping." },
  ],
};

export type EstimateAnswers = {
  projectType: ProjectTypeId | "";
  websiteSize: string;
  applicationSize: string;
  design: string;
  features: string[];
  timeline: string;
  budget: string;
  maintenance: string;
  paymentPreference: string;
  name: string;
  email: string;
  organization: string;
  phone: string;
  website: string;
  references: string;
  description: string;
  acknowledged: boolean;
};

export type EstimateLineItem = {
  id: string;
  label: string;
  // Credits store positive deduction magnitudes. Their kind determines arithmetic and display.
  amount: PriceRange | null;
  kind: "base" | "scope" | "design" | "feature" | "credit";
  note?: string;
};

export type EstimateResult = {
  hasProject: boolean;
  hasCustomBase: boolean;
  subtotal: PriceRange;
  hasUnpricedWork: boolean;
  needsReview: boolean;
  lineItems: EstimateLineItem[];
  reviewReasons: string[];
};

export function createEstimateAnswers(): EstimateAnswers {
  return { projectType: "", websiteSize: "", applicationSize: "", design: "", features: [], timeline: "", budget: "", maintenance: "", paymentPreference: "", name: "", email: "", organization: "", phone: "", website: "", references: "", description: "", acknowledged: false };
}

export function getProjectType(id: string): ProjectType | undefined {
  return estimatePricing.projectTypes.find((project) => project.id === id);
}

export function getVisibleFeatures(projectType: string): Feature[] {
  if (!getProjectType(projectType)) return [];
  return estimatePricing.features.filter((feature) => feature.projects.includes(projectType as ProjectTypeId));
}

export function getIncludedFeatureNote(projectType: string, featureId: string): string {
  return getProjectType(projectType)?.includedFeatureNotes?.[featureId] ?? "Included at the basic scope described in your project’s starting range.";
}

export function normalizeEstimateAnswers(answers: EstimateAnswers): EstimateAnswers {
  const project = getProjectType(answers.projectType);
  const compatibleFeatures = new Set(getVisibleFeatures(answers.projectType).map((feature) => feature.id));
  return {
    ...answers,
    features: [...new Set(answers.features)].filter((id) => compatibleFeatures.has(id)),
    websiteSize: project && (project.scope === "website" || project.scope === "both") ? answers.websiteSize : "",
    applicationSize: project && project.scope !== "website" ? answers.applicationSize : "",
  };
}

export function calculateEstimate(input: EstimateAnswers): EstimateResult {
  const answers = normalizeEstimateAnswers(input);
  const project = getProjectType(answers.projectType);
  const result: EstimateResult = { hasProject: Boolean(project), hasCustomBase: Boolean(project && project.amount === null), subtotal: range(0), hasUnpricedWork: false, needsReview: false, lineItems: [], reviewReasons: [] };
  if (!project) return result;

  function addItem(item: EstimateLineItem) {
    result.lineItems.push(item);
    if (item.amount === null) {
      result.hasUnpricedWork = true;
    } else {
      const direction = item.kind === "credit" ? -1 : 1;
      result.subtotal.min += direction * item.amount.min;
      result.subtotal.max += direction * item.amount.max;
    }
  }

  addItem({ id: "base", label: project.label, amount: project.amount, kind: "base", note: project.scopeNote });
  if (project.amount === null) result.reviewReasons.push("The project category needs a custom quote.");

  function addAdjustment(id: string, choices: readonly PriceOption[], kind: "scope" | "design", prefix: string) {
    if (!id) return;
    const choice = choices.find((option) => option.id === id);
    if (!choice) {
      result.hasUnpricedWork = true;
      result.reviewReasons.push(prefix + " needs to be confirmed.");
      return;
    }
    addItem({ id: kind + "-" + prefix, label: prefix + ": " + choice.label, amount: choice.amount, kind, note: choice.description });
    if (choice.amount === null) result.reviewReasons.push(prefix + " needs a custom quote.");
  }

  addAdjustment(answers.websiteSize, estimatePricing.websiteSizes, "scope", "Website size");
  // General inquiries describe size without inferring category-specific development fees.
  if (project.scope === "general" && answers.applicationSize) {
    const size = estimatePricing.applicationSizes.find((option) => option.id === answers.applicationSize);
    if (size) addItem({ id: "general-scope", label: "Project size: " + size.label, amount: null, kind: "scope", note: size.description });
  } else {
    addAdjustment(answers.applicationSize, estimatePricing.applicationSizes, "scope", "Application size");
  }
  addAdjustment(answers.design, estimatePricing.designOptions, "design", "Design");

  const included = new Set<string>(project.includedFeatures);
  const selected = new Set(answers.features);
  const visible = getVisibleFeatures(project.id);
  for (const feature of visible) {
    if (!selected.has(feature.id) && !included.has(feature.id)) continue;
    addItem({ id: feature.id, label: feature.label, amount: included.has(feature.id) ? range(0) : feature.amount, kind: "feature", note: included.has(feature.id) ? getIncludedFeatureNote(project.id, feature.id) : feature.description });
    if (!included.has(feature.id) && feature.amount === null) result.reviewReasons.push(feature.label + " requires a custom quote.");
    if (feature.reviewFor?.includes(project.id)) result.reviewReasons.push(feature.label + " needs a scope review for this project type.");
  }

  for (const shared of estimatePricing.sharedCosts) {
    const billed = shared.features.filter((id) => selected.has(id) && !included.has(id) && visible.some((feature) => feature.id === id));
    if (billed.length > 1) {
      const duplicates = billed.length - 1;
      addItem({ id: shared.id, label: shared.label, amount: range(duplicates * shared.amount.min, duplicates * shared.amount.max), kind: "credit", note: "The same setup component is included in these selected features and charged once." });
    }
  }

  const timeline = estimatePricing.timelines.find((option) => option.id === answers.timeline);
  if (timeline?.review) result.reviewReasons.push("An expedited timeline needs review; delivery is not guaranteed and there is no automatic rush fee.");
  result.reviewReasons = [...new Set(result.reviewReasons)];
  result.needsReview = result.reviewReasons.length > 0;
  return result;
}

const currencyFormatter = new Intl.NumberFormat(estimatePricing.locale, { style: "currency", currency: estimatePricing.currency, maximumFractionDigits: 0 });

export function formatEstimateRange(amount: PriceRange): string {
  return currencyFormatter.format(amount.min) + (amount.min === amount.max ? "" : " to " + currencyFormatter.format(amount.max));
}

export function formatEstimateAmount(amount: PriceRange | null, credit = false): string {
  if (amount === null) return "Custom quote required";
  if (amount.min === 0 && amount.max === 0) return "Included";
  return formatEstimateRange(amount) + (credit ? " credit" : "");
}

export function formatEstimateTotal(result: EstimateResult): string {
  if (result.hasProject && result.hasUnpricedWork && result.subtotal.max === 0) return "Custom quote required";
  return formatEstimateRange(result.subtotal);
}

export function getEstimateLabel(result: EstimateResult): string {
  return result.hasUnpricedWork ? "Priced-items range" : "Preliminary development range";
}

export function getAnswerLabel(options: readonly { id: string; label: string }[], id: string): string {
  return options.find((option) => option.id === id)?.label ?? "Not selected";
}
