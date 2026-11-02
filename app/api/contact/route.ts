import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const company = String(body.company ?? "").trim();
  const message = String(body.message ?? "").trim();
  const topics: Record<string, string> = { role: "Job opportunity", resume: "Resume request", consulting: "Platform or security review", other: "Other" };
  const topic = topics[String(body.topic ?? "")] ?? "Other";

  // Honeypot: bots fill hidden fields. Pretend success.
  if (body.website) return NextResponse.json({ ok: true });

  if (!name || name.length > 100) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  if (message.length < 20 || message.length > 2000) {
    return NextResponse.json({ error: "Message must be 20–2000 characters." }, { status: 400 });
  }

  // The destination address lives only in the environment, never in this (public) code.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.warn("RESEND_API_KEY or CONTACT_TO_EMAIL not set; contact message not delivered");
    return NextResponse.json({ error: "Messaging is temporarily unavailable. Please book a call instead." }, { status: 503 });
  }

  const html = `
    <p><strong>Topic:</strong> ${escape(topic)}</p>
    <p><strong>Name:</strong> ${escape(name)}</p>
    <p><strong>Email:</strong> ${escape(email)}</p>
    <p><strong>Phone:</strong> ${escape(phone || "-")}</p>
    <p><strong>Company:</strong> ${escape(company || "-")}</p>
    <p><strong>Message:</strong></p>
    <p>${escape(message).replace(/\n/g, "<br/>")}</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to,
      reply_to: email,
      subject: `[${topic}] Portfolio contact from ${name}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return NextResponse.json({ error: "Couldn't send your message. Please book a call instead." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
