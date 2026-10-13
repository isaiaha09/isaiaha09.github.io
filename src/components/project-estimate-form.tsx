"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { portfolio } from "@/data/portfolio";
import {
  calculateEstimate, createEstimateAnswers, estimatePricing, formatEstimateAmount,
  formatEstimateTotal, getAnswerLabel, getEstimateLabel, getProjectType,
  getVisibleFeatures, getIncludedFeatureNote, normalizeEstimateAnswers,
} from "@/data/estimate-pricing";
import type { EstimateAnswers, EstimateLineItem, EstimateResult, PriceRange, ProjectTypeId } from "@/data/estimate-pricing";
import { submitWeb3Forms } from "@/lib/web3forms";
import type { Web3FormsPayload } from "@/lib/web3forms";

type Errors = Partial<Record<keyof EstimateAnswers, string>>;
type ContactField = "name" | "email" | "organization" | "phone" | "website" | "references" | "description";
type Choice = { id: string; label: string; description?: string; scopeNote?: string; amount?: PriceRange | null };
type SendState = "idle" | "sending" | "error" | "success";

const steps = [
  { label: "Project", title: "What would you like me to build?", description: "Choose the closest match. It’s okay if you’re still figuring it out." },
  { label: "Scope & design", title: "How big is your idea?", description: "A little context about size and design helps shape the estimate." },
  { label: "Features", title: "What should it do?", description: "Select the features you need. You can leave this step empty and describe your idea later." },
  { label: "Timing & budget", title: "What works for you?", description: "Share your timing, budget, and plans after launch. Payment preference is optional." },
  { label: "Your details", title: "Tell me about your project.", description: "Share your idea and how I can get in touch. Fields marked * are required." },
  { label: "Review", title: "Let’s check the details.", description: "Review your scope and preliminary development range before sending your request." },
];

function fieldTarget(field: keyof EstimateAnswers): string {
  const firstOptions: Partial<Record<keyof EstimateAnswers, string>> = {
    projectType: estimatePricing.projectTypes[0].id,
    websiteSize: estimatePricing.websiteSizes[0].id,
    applicationSize: estimatePricing.applicationSizes[0].id,
    design: estimatePricing.designOptions[0].id,
    timeline: estimatePricing.timelines[0].id,
    budget: estimatePricing.budgets[0].id,
    maintenance: estimatePricing.maintenance[0].id,
  };
  return firstOptions[field] ? `estimate-${field}-${firstOptions[field]}` : `estimate-${field}`;
}

function validateStep(step: number, answers: EstimateAnswers): Errors {
  const errors: Errors = {};
  const project = getProjectType(answers.projectType);
  if (step === 0 && !project) errors.projectType = "Choose a project type, or select ‘Not sure yet’.";
  if (step === 1) {
    if (project && (project.scope === "website" || project.scope === "both") && !estimatePricing.websiteSizes.some((option) => option.id === answers.websiteSize)) errors.websiteSize = "Choose a page count, or select ‘Not sure’.";
    if (project && project.scope !== "website" && !estimatePricing.applicationSizes.some((option) => option.id === answers.applicationSize)) errors.applicationSize = "Choose a project size, or select ‘Not sure’.";
    if (!estimatePricing.designOptions.some((option) => option.id === answers.design)) errors.design = "Choose a design preference, or select ‘Not sure’.";
  }
  if (step === 3) {
    if (!estimatePricing.timelines.some((option) => option.id === answers.timeline)) errors.timeline = "Choose a preferred delivery timeline.";
    if (!estimatePricing.budgets.some((option) => option.id === answers.budget)) errors.budget = "Choose a budget, or select ‘Not sure’.";
    if (!estimatePricing.maintenance.some((option) => option.id === answers.maintenance)) errors.maintenance = "Choose a maintenance preference, or select ‘Not sure’.";
  }
  if (step === 4) {
    if (!answers.description.trim()) errors.description = "Describe what you would like to build so I can understand your project.";
    if (!answers.name.trim()) errors.name = "Enter your full name.";
    if (!answers.email.trim()) {
      errors.email = "Enter an email address where I can reach you.";
    } else {
      const email = document.createElement("input");
      email.type = "email";
      email.value = answers.email.trim();
      if (!email.validity.valid) errors.email = "Enter a valid email address, such as name@example.com.";
    }
    if (answers.website.trim()) {
      try {
        const url = new URL(answers.website.trim());
        if (!["http:", "https:"].includes(url.protocol) || !url.hostname) throw new Error("Invalid website");
      } catch {
        errors.website = "Enter a complete website address starting with https:// or http://, or leave it empty.";
      }
    }
  }
  if (step === 5 && !answers.acknowledged) errors.acknowledged = "Confirm that you understand the preliminary estimate before sending your request.";
  return errors;
}

function PriceText({ text }: { text: string }) {
  const match = text.match(/^(.+?) to (.+?)( credit)?$/);
  if (!match) return <>{text}</>;
  const [, minimum, maximum, credit = ""] = match;
  return <><span className="estimate-money">{minimum}</span><wbr />{" "}<span className="estimate-money">to {maximum}</span>{credit}</>;
}

function RadioChoices({ name, legend, options, value, onChange, error, priceMode = "none", required = true, helpText }: {
  name: string; legend: string; options: readonly Choice[]; value: string;
  onChange: (value: string) => void; error?: string; priceMode?: "base" | "adjustment" | "none"; required?: boolean; helpText?: string;
}) {
  const errorId = `estimate-${name}-error`;
  const helpId = `estimate-${name}-help`;
  const describedBy = [helpText ? helpId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined;
  return (
    <fieldset className="estimate-question" aria-describedby={describedBy}>
      <legend>{legend}{!required ? <span className="estimate-optional"> (optional)</span> : null}</legend>
      {helpText ? <p className="estimate-question-help" id={helpId}>{helpText}</p> : null}
      <div className={`estimate-choices${priceMode === "base" ? " estimate-choices--projects" : ""}`}>
        {options.map((option) => (
          <label className={`estimate-choice${value === option.id ? " is-selected" : ""}`} htmlFor={`estimate-${name}-${option.id}`} key={option.id}>
            <input id={`estimate-${name}-${option.id}`} name={name} type="radio" value={option.id} checked={value === option.id} onChange={() => onChange(option.id)} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
            <span className="estimate-choice-copy">
              <span className="estimate-choice-label">{option.label}</span>
              {option.description ? <span className="estimate-choice-description">{option.description}</span> : null}
              {option.scopeNote ? <span className="estimate-choice-scope"><strong>Base scope:</strong> {option.scopeNote}</span> : null}
              {priceMode !== "none" && option.amount !== undefined ? (
                <span className="estimate-choice-price">
                  {option.amount === null ? "Custom quote required" : option.amount.max === 0 ? "Included" : <>{priceMode === "base" ? "Starting range: " : "+"}<PriceText text={formatEstimateAmount(option.amount)} /></>}
                </span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
      {error ? <p className="estimate-field-error" id={errorId}>{error}</p> : null}
    </fieldset>
  );
}

function AutoGrowTextarea({ id, name, value, onChange, error, required, rows, maxLength, placeholder }: {
  id: string; name: string; value: string; onChange: (value: string) => void;
  error?: string; required?: boolean; rows: number; maxLength: number; placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    function resize() {
      if (!element) return;
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    }
    resize();
    let width = element.getBoundingClientRect().width;
    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width;
      if (nextWidth !== undefined && nextWidth !== width) { width = nextWidth; resize(); }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);
  return <textarea ref={ref} className="resize-none" id={id} name={name} value={value} onChange={(event) => onChange(event.target.value)} required={required} rows={rows} maxLength={maxLength} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />;
}

function TextField({ field, label, value, onChange, error, required = false, multiline = false, type = "text", autoComplete, placeholder, maxLength = 160 }: {
  field: ContactField; label: string; value: string; onChange: (value: string) => void;
  error?: string; required?: boolean; multiline?: boolean; type?: string;
  autoComplete?: string; placeholder?: string; maxLength?: number;
}) {
  const id = `estimate-${field}`;
  return (
    <div className={`form-field estimate-text-field${multiline ? " estimate-text-field--wide" : ""}`}>
      <label htmlFor={id}>{label}{required ? <span aria-hidden="true"> *</span> : <span className="estimate-optional"> (optional)</span>}</label>
      {multiline ? (
        <AutoGrowTextarea id={id} name={field} value={value} onChange={onChange} error={error} required={required} rows={field === "description" ? 6 : 3} maxLength={maxLength} placeholder={placeholder} />
      ) : (
        <input id={id} name={field} type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} placeholder={placeholder} required={required} maxLength={maxLength} inputMode={field === "phone" ? "numeric" : undefined} pattern={field === "phone" ? "[0-9]*" : undefined} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
      )}
      {error ? <p className="estimate-field-error" id={`${id}-error`}>{error}</p> : null}
    </div>
  );
}

function EstimateItems({ items, compact = false }: { items: EstimateLineItem[]; compact?: boolean }) {
  return (
    <ul className={`estimate-items${compact ? " estimate-items--compact" : ""}`}>
      {items.map((item) => (
        <li key={item.id} className={item.kind === "credit" ? "estimate-item--credit" : undefined}>
          <span>{item.label}{item.note && !compact ? <small>{item.note}</small> : null}</span>
          <strong><PriceText text={formatEstimateAmount(item.amount, item.kind === "credit")} /></strong>
        </li>
      ))}
    </ul>
  );
}

function LiveEstimate({ result, compact = false }: { result: EstimateResult; compact?: boolean }) {
  return (
    <div className={compact ? "estimate-mobile-total" : "estimate-total"} aria-live="polite" aria-atomic="true">
      <span>{result.hasProject ? getEstimateLabel(result) : "Your project estimate"}</span>
      <strong><PriceText text={result.hasProject ? formatEstimateTotal(result) : "Choose a project"} /></strong>
      {result.hasProject && result.subtotal.max > 0 && result.hasCustomBase ? <small>Custom quote required</small> : result.subtotal.max > 0 && result.needsReview ? <small>Additional review required</small> : null}
    </div>
  );
}

function buildPayload(answers: EstimateAnswers, result: EstimateResult, botcheck: boolean): Web3FormsPayload {
  const project = getProjectType(answers.projectType);
  const itemized = result.lineItems.map((item) => item.label + ": " + formatEstimateAmount(item.amount, item.kind === "credit") + (item.note ? " (" + item.note + ")" : "")).join("\n");
  const requirements = result.lineItems.filter((item) => item.kind === "feature").map((item) => item.label + (item.amount?.max === 0 ? " (included)" : "") + (item.note ? " — " + item.note : "")).join("\n") || "No additional features selected";
  const name = answers.name.trim();
  const email = answers.email.trim();
  return {
    name, email, replyto: email,
    subject: "IASAPPS project estimate request from " + name,
    from_name: "IASAPPS project estimate form",
    botcheck,
    project_type: project?.label ?? "Not sure yet",
    project_scope: project?.scopeNote ?? "Project scope needs review.",
    base_assumptions: estimatePricing.baseNote,
    website_size: answers.websiteSize ? getAnswerLabel(estimatePricing.websiteSizes, answers.websiteSize) : "Not applicable",
    application_size: answers.applicationSize ? getAnswerLabel(estimatePricing.applicationSizes, answers.applicationSize) : "Not applicable",
    design: getAnswerLabel(estimatePricing.designOptions, answers.design),
    selected_requirements: requirements,
    itemized_estimate: itemized,
    preliminary_subtotal: formatEstimateTotal(result),
    development_estimate_min: String(result.subtotal.min),
    development_estimate_max: String(result.subtotal.max),
    currency: estimatePricing.currency,
    estimate_status: getEstimateLabel(result),
    has_unpriced_work: result.hasUnpricedWork,
    review_required: result.reviewReasons.join("\n") || "No additional review flags",
    timeline: getAnswerLabel(estimatePricing.timelines, answers.timeline),
    budget: getAnswerLabel(estimatePricing.budgets, answers.budget),
    maintenance: getAnswerLabel(estimatePricing.maintenance, answers.maintenance),
    hosting_maintenance_note: estimatePricing.ongoingServiceNote,
    development_payment_preference: answers.paymentPreference ? getAnswerLabel(estimatePricing.paymentPreferences, answers.paymentPreference) : "Not specified",
    payment_note: estimatePricing.paymentNote,
    organization: answers.organization.trim() || "Not provided",
    phone: answers.phone.trim() || "Not provided",
    existing_website: answers.website.trim() || "Not provided",
    references: answers.references.trim() || "Not provided",
    message: answers.description.trim(),
    disclaimer_acknowledged: "Yes — this is a preliminary estimate, not a final quote or binding agreement.",
    pricing_note: "Preliminary one-time development range for the selected standard scope. Security essentials are included. Hosting, maintenance, support, and third-party fees are quoted separately. Final pricing requires scope review.",
  };
}

export function ProjectEstimateForm() {
  const [answers, setAnswers] = useState<EstimateAnswers>(createEstimateAnswers);
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [sendState, setSendState] = useState<SendState>("idle");
  const [feedback, setFeedback] = useState("");
  const [focusRequest, setFocusRequest] = useState(0);
  const pendingFocus = useRef<string | null>(null);
  const sending = useRef(false);
  const composing = useRef(false);
  const botcheck = useRef<HTMLInputElement>(null);
  const workflowRef = useRef<HTMLDivElement>(null);
  const mobileSummaryRef = useRef<HTMLDivElement>(null);
  const result = calculateEstimate(answers);
  const project = getProjectType(answers.projectType);
  const features = getVisibleFeatures(answers.projectType);
  const includedFeatures = new Set<string>(project?.includedFeatures ?? []);
  const isSending = sendState === "sending";

  useEffect(() => {
    const workflow = workflowRef.current;
    const summary = mobileSummaryRef.current;
    if (!workflow || !summary) return;
    const updateHeight = () => {
      workflow.style.setProperty("--estimate-summary-height", Math.ceil(summary.getBoundingClientRect().height) + "px");
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(summary);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const id = pendingFocus.current;
    if (!id) return;
    pendingFocus.current = null;
    const element = document.getElementById(id);
    element?.focus({ preventScroll: true });
    element?.scrollIntoView({ block: "start", behavior: "auto" });
  }, [focusRequest, step]);

  function focus(id: string) {
    pendingFocus.current = id;
    setFocusRequest((previous) => previous + 1);
  }

  function update<K extends keyof EstimateAnswers>(field: K, value: EstimateAnswers[K]) {
    if (sending.current) return;
    setAnswers((previous) => field === "projectType" ? normalizeEstimateAnswers({ ...previous, projectType: value as ProjectTypeId }) : { ...previous, [field]: value });
    setErrors((previous) => { const next = { ...previous }; delete next[field]; return next; });
    if (sendState === "error") { setSendState("idle"); setFeedback(""); }
  }

  function showErrors(nextErrors: Errors, nextStep: number) {
    setErrors((previous) => ({ ...previous, ...nextErrors }));
    setStep(nextStep);
    focus(fieldTarget(Object.keys(nextErrors)[0] as keyof EstimateAnswers));
  }

  function goToStep(nextStep: number) {
    if (sending.current) return;
    if (nextStep > step) {
      for (let index = 0; index < nextStep; index++) {
        const nextErrors = validateStep(index, answers);
        if (Object.keys(nextErrors).length) { showErrors(nextErrors, index); return; }
      }
    }
    setStep(nextStep);
    setFurthestStep((previous) => Math.max(previous, nextStep));
    focus("estimate-step-heading");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || sendState === "success" || composing.current) return;
    if (step < 5) { goToStep(step + 1); return; }
    for (let index = 0; index < steps.length; index++) {
      const nextErrors = validateStep(index, answers);
      if (Object.keys(nextErrors).length) { showErrors(nextErrors, index); return; }
    }
    sending.current = true;
    setSendState("sending");
    setFeedback("");
    try {
      const normalized = normalizeEstimateAnswers(answers);
      await submitWeb3Forms(buildPayload(normalized, calculateEstimate(normalized), Boolean(botcheck.current?.checked)), portfolio.web3FormsAccessKey);
      setSendState("success");
      focus("estimate-success-heading");
    } catch (error) {
      setSendState("error");
      setFeedback(error instanceof Error ? error.message : "Delivery could not be confirmed. Please try again later or email me directly.");
    } finally {
      sending.current = false;
    }
  }

  function restart() {
    setAnswers(createEstimateAnswers()); setErrors({}); setFeedback(""); setSendState("idle"); setStep(0); setFurthestStep(0);
    focus("estimate-step-heading");
  }

  return (
    <div className="estimate-workflow" ref={workflowRef}>
      {sendState !== "success" ? (
        <nav className="estimate-progress" aria-label="Project request steps">
          <ol>{steps.map((item, index) => (
            <li key={item.label}>
              <button type="button" className={`estimate-step-button${index === step ? " is-current" : ""}`} aria-current={index === step ? "step" : undefined} disabled={index > furthestStep || isSending} onClick={() => goToStep(index)}>
                <span className="estimate-step-number" aria-hidden="true">{index < step ? "✓" : index + 1}</span>
                <span>{item.label}<span className="sr-only">{index === step ? ", current step" : index < step ? ", completed" : ""}</span></span>
              </button>
            </li>
          ))}</ol>
        </nav>
      ) : null}
      <div className="estimate-mobile-summary" ref={mobileSummaryRef}><LiveEstimate result={result} compact /></div>
      <div className="estimate-layout">
        {sendState === "success" ? (
          <section className="estimate-panel estimate-success glass-surface" aria-labelledby="estimate-success-heading">
            <span className="estimate-success-mark" aria-hidden="true">✓</span>
            <h2 id="estimate-success-heading" tabIndex={-1}>Your project request has been sent.</h2>
            <p>Thanks, {answers.name.trim()}. I’ll review your idea and contact you at <strong>{answers.email.trim()}</strong> to confirm the scope, development quote, and any ongoing service costs.</p>
            <p>This request doesn’t commit you to purchasing any services.</p>
            <div className="estimate-success-actions">
              <a className="button button-primary" href="/">Back to portfolio <span aria-hidden="true">↗</span></a>
              <button className="button button-quiet" type="button" onClick={restart}>Start another request</button>
            </div>
          </section>
        ) : (
          <form className="estimate-panel estimate-form glass-surface" noValidate onSubmit={handleSubmit} aria-label="Project estimate request" aria-busy={isSending} onCompositionStartCapture={() => { composing.current = true; }} onCompositionEndCapture={() => { composing.current = false; }}>
            <fieldset className="estimate-controls" disabled={isSending}>
              <legend className="sr-only">Project estimate questionnaire</legend>
              <div className="estimate-step-content" key={step}>
                <p className="estimate-step-count">Step {step + 1} of {steps.length}{step === 2 ? " · Optional features" : ""}</p>
                <h2 id="estimate-step-heading" tabIndex={-1}>{steps[step].title}</h2>
                <p className="estimate-step-intro">{steps[step].description}</p>

                {step === 0 ? (
                  <>
                    <RadioChoices name="projectType" legend="Project type" options={estimatePricing.projectTypes} value={answers.projectType} onChange={(value) => update("projectType", value as ProjectTypeId)} error={errors.projectType} priceMode="base" />
                    <p className="estimate-note">{estimatePricing.baseNote}</p>
                    <p className="estimate-note">Your development range updates as you describe the scope. I’ll confirm the scope and final quote with you after review.</p>
                  </>
                ) : null}

                {step === 1 ? (
                  <>
                    {project?.scope === "website" || project?.scope === "both" ? <RadioChoices name="websiteSize" legend="How many main website page layouts do you need?" helpText="Count distinct layouts like Home, Services, or Contact. The Contact page layout fits in page count; its working form is a separate feature below." options={estimatePricing.websiteSizes} value={answers.websiteSize} onChange={(value) => update("websiteSize", value)} error={errors.websiteSize} priceMode="adjustment" /> : null}
                    {project && project.scope !== "website" ? <RadioChoices name="applicationSize" legend={project.scope === "general" ? "How large is the project you have in mind?" : project.id === "backend" ? "How large is the backend workflow?" : "How many main screens will the application need?"} helpText={project.scope === "general" ? "Use these as rough scope guides. Describe the tasks or workflows you need, and we can define the right size together." : project.id === "backend" ? "Count connected business modules and workflows. Small covers one core workflow; medium covers several. Optional feature choices below add specific capabilities." : "Count the application's main screens for its core workflow. Any website pages are counted separately; optional features below add behavior such as accounts or payments."} options={estimatePricing.applicationSizes} value={answers.applicationSize} onChange={(value) => update("applicationSize", value)} error={errors.applicationSize} priceMode={project.scope === "general" ? "none" : "adjustment"} /> : null}
                    <RadioChoices name="design" legend="What do you need for the design?" options={estimatePricing.designOptions} value={answers.design} onChange={(value) => update("design", value)} error={errors.design} priceMode="adjustment" />
                    <p className="estimate-note">{estimatePricing.scopeNote}</p>
                    <p className="estimate-note">The starting range covers the small scope and implementation of your completed design. The choices above add any required scope or design work.</p>
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <p className="estimate-note estimate-note--features">Your starting range covers the structure and included basics described earlier. Choose add-on behavior here; features marked “Included” are already covered. A Contact page layout counts toward website size; its working form is a separate add-on. Security essentials are included, and shared setup costs are credited automatically.</p>
                    <div className="estimate-feature-groups">
                      {estimatePricing.featureGroups.map((group) => {
                        const groupFeatures = features.filter((feature) => feature.group === group.id);
                        if (!groupFeatures.length) return null;
                        const selectedCount = groupFeatures.filter((feature) => answers.features.includes(feature.id) || includedFeatures.has(feature.id)).length;
                        return (
                          <details className="estimate-feature-group" key={`${answers.projectType}-${group.id}`} open>
                            <summary><span>{group.label}</span><small>{selectedCount ? `${selectedCount} selected` : "Choose features"}</small></summary>
                            <fieldset className="estimate-question">
                              <legend className="sr-only">{group.label}</legend>
                              <p className="estimate-group-description">{group.description}</p>
                              <div className="estimate-choices">
                                {groupFeatures.map((feature) => {
                                  const included = includedFeatures.has(feature.id);
                                  const checked = included || answers.features.includes(feature.id);
                                  return (
                                    <label className={`estimate-choice estimate-choice--feature${checked ? " is-selected" : ""}${included ? " is-included" : ""}`} htmlFor={`estimate-feature-${feature.id}`} key={feature.id}>
                                      <input id={`estimate-feature-${feature.id}`} type="checkbox" name="features" value={feature.id} checked={checked} disabled={included} aria-describedby={included ? `estimate-feature-${feature.id}-included` : undefined} onChange={() => update("features", checked ? answers.features.filter((id) => id !== feature.id) : [...answers.features, feature.id])} />
                                      <span className="estimate-choice-copy">
                                        <span className="estimate-choice-label">{feature.label}</span>
                                        <span className="estimate-choice-description">{included ? getIncludedFeatureNote(answers.projectType, feature.id) : feature.description}</span>
                                        <span className="estimate-choice-price" id={included ? `estimate-feature-${feature.id}-included` : undefined}>{included ? "Included in starting range" : feature.amount === null ? "Custom quote required" : <>+<PriceText text={formatEstimateAmount(feature.amount)} /></>}</span>
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </fieldset>
                          </details>
                        );
                      })}
                    </div>
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <RadioChoices name="timeline" legend="When would you like it delivered?" options={estimatePricing.timelines} value={answers.timeline} onChange={(value) => update("timeline", value)} error={errors.timeline} />
                    {estimatePricing.timelines.find((option) => option.id === answers.timeline)?.review ? <p className="estimate-callout">An expedited deadline needs a scope and availability review. Selecting it does not guarantee delivery or add an automatic rush fee.</p> : null}
                    <RadioChoices name="budget" legend="What is your approximate budget?" options={estimatePricing.budgets} value={answers.budget} onChange={(value) => update("budget", value)} error={errors.budget} />
                    <p className="estimate-note">Your budget helps guide our conversation. It does not change the calculated estimate.</p>
                    <RadioChoices name="maintenance" legend="Would you like help with hosting and maintenance after launch?" options={estimatePricing.maintenance} value={answers.maintenance} onChange={(value) => update("maintenance", value)} error={errors.maintenance} />
                    <p className="estimate-note">{estimatePricing.ongoingServiceNote}</p>
                    <RadioChoices name="paymentPreference" legend="How would you prefer to pay for development?" options={estimatePricing.paymentPreferences} value={answers.paymentPreference} onChange={(value) => update("paymentPreference", value)} required={false} />
                    <p className="estimate-note">{estimatePricing.paymentNote}</p>
                  </>
                ) : null}

                {step === 4 ? (
                  <div className="estimate-contact-fields">
                    <TextField field="description" label="Tell me more about your project." multiline required value={answers.description} onChange={(value) => update("description", value)} error={errors.description} maxLength={10000} placeholder="Describe your business, what you'd like me to build, any specific features you need, or anything else I should know before we discuss your project." />
                    <TextField field="name" label="Full name" required value={answers.name} onChange={(value) => update("name", value)} error={errors.name} autoComplete="name" placeholder="Your full name" maxLength={100} />
                    <TextField field="email" label="Email address" type="email" required value={answers.email} onChange={(value) => update("email", value)} error={errors.email} autoComplete="email" placeholder="you@example.com" maxLength={254} />
                    <TextField field="organization" label="Business / organization name" value={answers.organization} onChange={(value) => update("organization", value)} autoComplete="organization" />
                    <TextField field="phone" label="Phone number" type="tel" value={answers.phone} onChange={(value) => update("phone", value.replace(/[^0-9]/g, ""))} autoComplete="tel" placeholder="1234567890" maxLength={30} />
                    <div className="estimate-text-field--wide"><TextField field="website" label="Existing website URL" type="url" value={answers.website} onChange={(value) => update("website", value)} error={errors.website} autoComplete="url" placeholder="https://example.com" maxLength={2048} /></div>
                    <TextField field="references" label="Reference websites or applications" multiline value={answers.references} onChange={(value) => update("references", value)} maxLength={2000} placeholder="Share any links or app names that help explain your idea." />
                  </div>
                ) : null}

                {step === 5 ? (
                  <div className="estimate-review">
                    <section className="estimate-review-section" aria-labelledby="review-project-heading">
                      <div className="estimate-review-heading"><h3 id="review-project-heading">Project</h3><button type="button" className="estimate-edit" onClick={() => goToStep(0)}>Edit project</button></div>
                      <EstimateItems items={result.lineItems.filter((item) => item.kind === "base")} />
                    </section>
                    <section className="estimate-review-section" aria-labelledby="review-scope-heading">
                      <div className="estimate-review-heading"><h3 id="review-scope-heading">Scope and design</h3><button type="button" className="estimate-edit" onClick={() => goToStep(1)}>Edit scope</button></div>
                      <EstimateItems items={result.lineItems.filter((item) => item.kind === "scope" || item.kind === "design")} />
                    </section>
                    <section className="estimate-review-section" aria-labelledby="review-features-heading">
                      <div className="estimate-review-heading"><h3 id="review-features-heading">Features and credits</h3><button type="button" className="estimate-edit" onClick={() => goToStep(2)}>Edit features</button></div>
                      {result.lineItems.some((item) => item.kind === "feature") ? <EstimateItems items={result.lineItems.filter((item) => item.kind === "feature" || item.kind === "credit")} /> : <p className="estimate-note">No additional features selected.</p>}
                    </section>
                    <div className="estimate-review-total"><span>{getEstimateLabel(result)}</span><strong><PriceText text={formatEstimateTotal(result)} /></strong></div>
                    {result.needsReview ? <div className="estimate-callout"><strong>{result.hasCustomBase ? "Custom quote required" : "Additional review required"}</strong><p>{result.hasUnpricedWork ? "This range includes priced items only. Unresolved work will be quoted after review." : "I’ll review the flagged requirements before confirming your final quote."}</p><ul>{result.reviewReasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div> : null}
                    <section className="estimate-review-section" aria-labelledby="review-timing-heading">
                      <div className="estimate-review-heading"><h3 id="review-timing-heading">Timing and budget</h3><button type="button" className="estimate-edit" onClick={() => goToStep(3)}>Edit preferences</button></div>
                      <dl className="estimate-details-list"><div><dt>Preferred timeline</dt><dd>{getAnswerLabel(estimatePricing.timelines, answers.timeline)}</dd></div><div><dt>Client budget</dt><dd>{getAnswerLabel(estimatePricing.budgets, answers.budget)}</dd></div><div><dt>Hosting and maintenance</dt><dd>{getAnswerLabel(estimatePricing.maintenance, answers.maintenance)} — quoted separately</dd></div><div><dt>Development payment</dt><dd>{answers.paymentPreference ? getAnswerLabel(estimatePricing.paymentPreferences, answers.paymentPreference) : "Not specified"}</dd></div></dl>
                      <p className="estimate-note">{estimatePricing.ongoingServiceNote}</p>
                      <p className="estimate-note">{estimatePricing.paymentNote}</p>
                    </section>
                    <section className="estimate-review-section" aria-labelledby="review-details-heading">
                      <div className="estimate-review-heading"><h3 id="review-details-heading">Project details and contact</h3><button type="button" className="estimate-edit" onClick={() => goToStep(4)}>Edit details</button></div>
                      <p className="estimate-description-preview">{answers.description.trim()}</p>
                      <dl className="estimate-details-list">
                        <div><dt>Full name</dt><dd>{answers.name.trim()}</dd></div><div><dt>Email address</dt><dd>{answers.email.trim()}</dd></div>
                        <div><dt>Business / organization</dt><dd>{answers.organization.trim() || "Not provided"}</dd></div><div><dt>Phone number</dt><dd>{answers.phone || "Not provided"}</dd></div>
                        <div><dt>Existing website</dt><dd>{answers.website.trim() || "Not provided"}</dd></div><div><dt>References</dt><dd className="estimate-description-preview">{answers.references.trim() || "Not provided"}</dd></div>
                      </dl>
                    </section>
                    <section className="estimate-disclaimer" aria-labelledby="estimate-disclaimer-heading">
                      <h3 id="estimate-disclaimer-heading">Please Note:</h3>
                      <p>This development range is a preliminary estimate based on the standard scope and features you selected. It is not a final quote or binding agreement.</p>
                      <p>Final pricing depends on the confirmed scope, complexity, technical requirements, and timeline. Hosting, maintenance, and third-party fees are quoted separately.</p>
                      <p>Once your request is submitted, I will review the details and contact you to discuss your project and provide a more accurate quote.</p>
                      <p>Submitting this form does not commit you to purchasing any services.</p>
                      <label className="estimate-acknowledgment" htmlFor="estimate-acknowledged"><input id="estimate-acknowledged" name="acknowledged" type="checkbox" checked={answers.acknowledged} onChange={(event) => update("acknowledged", event.target.checked)} required aria-invalid={Boolean(errors.acknowledged)} aria-describedby={errors.acknowledged ? "estimate-acknowledged-error" : undefined} /><span>I understand that this estimate is preliminary and is not a final quote or binding agreement.</span></label>
                      {errors.acknowledged ? <p className="estimate-field-error" id="estimate-acknowledged-error">{errors.acknowledged}</p> : null}
                    </section>
                    <p className="privacy-note">Your submitted contact information and project details will be used to respond to this inquiry and discuss your project.</p>
                  </div>
                ) : null}
              </div>
              <div className="estimate-actions">
                <button className="button button-quiet" type="button" disabled={step === 0 || isSending} onClick={() => goToStep(step - 1)}><span aria-hidden="true">←</span> Back</button>
                <button className={`button button-primary${step === 5 ? " estimate-submit" : ""}`} type="submit" disabled={isSending}>
                  {step === 5 ? <><span>{isSending ? "Sending your request…" : "Submit My Project Request"}</span>{isSending ? <span className="button-spinner" aria-hidden="true" /> : <span aria-hidden="true">↗</span>}</> : <>Next <span aria-hidden="true">→</span></>}
                </button>
              </div>
            </fieldset>
            <input ref={botcheck} className="bot-field" type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" style={{ display: "none" }} />
            {feedback ? <p className="form-feedback form-feedback--error" role="alert">{feedback} <a href={`mailto:${portfolio.email}`}>Email me directly</a>.</p> : null}
          </form>
        )}
        <aside className="estimate-panel estimate-sidebar glass-surface" aria-label="Live project estimate">
          <p className="estimate-sidebar-heading">Your project, at a glance</p>
          <LiveEstimate result={result} />
          {result.hasProject ? <EstimateItems items={result.lineItems} compact /> : <p className="estimate-note">Choose a project type to start. Your estimate will update as you go.</p>}
          {result.needsReview ? <p className="estimate-callout">{result.hasUnpricedWork ? "This range covers priced items only. Unresolved work needs a custom quote." : "Some requirements need review before I can confirm the quote or schedule."}</p> : null}
          <p className="estimate-note">A starting point for our conversation, with no obligation to purchase.</p>
          <p className="estimate-note">Security essentials are included. Hosting, maintenance, support, and third-party fees are quoted separately.</p>
          <div className="estimate-sidebar-footer"><span>Prefer to talk through your idea?</span><a href={`mailto:${portfolio.email}`}>Email me directly <span aria-hidden="true">↗</span></a></div>
        </aside>
      </div>

    </div>
  );
}
