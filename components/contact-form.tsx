"use client";

import { useEffect, useState } from "react";

const MAX = 2000;
const MIN = 20;

type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

const TOPICS = [
  { value: "role", label: "Job opportunity" },
  { value: "resume", label: "Request resume" },
  { value: "consulting", label: "Platform or security review" },
  { value: "other", label: "Something else" },
];

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("role");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // Links like /contact?topic=resume preselect the topic.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("topic");
    if (t && TOPICS.some((x) => x.value === t)) setTopic(t);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    if (String(data.message).trim().length < MIN) {
      setStatus({ kind: "error", message: `Message must be at least ${MIN} characters.` });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Something went wrong.");
      form.reset();
      setMessage("");
      setStatus({ kind: "sent", message: "Thanks! I'll get back to you within 24 hours." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field label="Topic" required>
        <select name="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="input" style={{ background: "var(--bg)" }}>
          {TOPICS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </Field>
      <Field label="Your Name" required>
        <input name="name" required className="input" autoComplete="name" />
      </Field>
      <Field label="Email Address" required>
        <input name="email" type="email" required className="input" autoComplete="email" />
      </Field>
      <Field label="Phone Number" hint="Optional - Include if you prefer a call back">
        <input name="phone" type="tel" defaultValue="+977" className="input" autoComplete="tel" />
      </Field>
      <Field label="Company / Organization" hint="Optional - Helps me understand context">
        <input name="company" className="input" autoComplete="organization" />
      </Field>
      <Field label="Message" required hint={`Minimum ${MIN} characters required`} counter={`${message.length} / ${MAX}`}>
        <textarea
          name="message"
          placeholder={topic === "resume" ? "Tell me about the role and team so I can send the right version." : undefined}
          required
          minLength={MIN}
          maxLength={MAX}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input"
        />
      </Field>
      {/* Honeypot */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <button type="submit" disabled={status.kind === "sending"} className="btn-primary disabled:opacity-60">
        {status.kind === "sending" ? "Sending…" : "Send Message"}
      </button>
      {status.message && (
        <p role="status" className={`text-sm ${status.kind === "error" ? "text-red-500" : "text-green-600"}`}>
          {status.message}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  counter,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  counter?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}
        {required && " *"}
      </span>
      {children}
      {(hint || counter) && (
        <span className="muted mt-1 flex justify-between text-xs">
          <span>{hint}</span>
          <span>{counter}</span>
        </span>
      )}
    </label>
  );
}
