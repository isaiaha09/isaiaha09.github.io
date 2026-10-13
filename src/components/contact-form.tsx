"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { portfolio } from "@/data/portfolio";
import { submitWeb3Forms } from "@/lib/web3forms";

type FormState = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [feedback, setFeedback] = useState("");
  const sending = useRef(false);

  function keepPhoneDigits(event: FormEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    input.value = input.value.replace(/[^0-9]/g, "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    if (!portfolio.web3FormsAccessKey) {
      setState("error");
      setFeedback("The contact form is not connected yet. Please try again later.");
      return;
    }

    setState("sending");
    sending.current = true;
    setFeedback("");

    const formData = new FormData(form);
    const payload: Record<string, string | boolean> = Object.fromEntries([...formData.entries()].map(([key, value]) => [key, String(value)]));
    payload.botcheck = formData.get("botcheck") !== null;
    payload.subject = `Portfolio message from ${String(formData.get("name") ?? "a visitor")}`;
    payload.from_name = "Portfolio contact form";

    try {
      await submitWeb3Forms(payload, portfolio.web3FormsAccessKey);

      form.reset();
      setState("success");
      setFeedback("Thanks for reaching out. Your message has been sent.");
    } catch (error) {
      setState("error");
      setFeedback(error instanceof Error ? error.message : "Your message could not be sent. Please try again.");
    } finally {
      sending.current = false;
    }
  }

  return (
    <form className="contact-form glass-surface" onSubmit={handleSubmit} aria-label="Contact form">
      <h3 className="form-heading">Send a message</h3>
      <div className="form-field">
        <label htmlFor="contact-name">Name <span aria-hidden="true">*</span></label>
        <input id="contact-name" name="name" autoComplete="name" placeholder="Your Name" required />
      </div>
      <div className="form-field">
        <label htmlFor="contact-email">Email <span aria-hidden="true">*</span></label>
        <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="your@email.com" required />
      </div>
      <div className="form-field">
        <label htmlFor="contact-phone">Phone number (optional)</label>
        <input id="contact-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" pattern="[0-9]*" placeholder="(123) 456-7890" onInput={keepPhoneDigits} />
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">Message <span aria-hidden="true">*</span></label>
        <textarea id="contact-message" name="message" rows={5} placeholder="Any inquiries on building digital products, collaborations, or job opportunities for me?" required />
      </div>
      <input className="bot-field" type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" style={{ display: "none" }} />
      <button className="button button-primary form-submit" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending message..." : state === "success" ? "Message sent" : "Send message"}
        {state === "sending" ? <span className="button-spinner" aria-hidden="true" /> : <span aria-hidden="true">↗</span>}
      </button>
      <p className={`form-feedback form-feedback--${state}`} role={state === "error" ? "alert" : "status"} aria-live="polite">{feedback}</p>
    </form>
  );
}
