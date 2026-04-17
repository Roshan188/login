import * as React from "react";

interface WelcomeEmailProps {
  name: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ name, dashboardUrl }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: "600px", margin: "0 auto", backgroundColor: "#0a0a0f", color: "#f8fafc" }}>
      {/* Header */}
      <div style={{ padding: "40px 40px 0", textAlign: "center" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #2563eb, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: "14px" }}>⚡</span>
          </div>
          <span style={{ fontSize: "20px", fontWeight: 700, background: "linear-gradient(to right, #60a5fa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            DevFolio
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "40px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "16px", lineHeight: 1.3 }}>
          Welcome to DevFolio, {name} 👋
        </h1>
        <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: 1.7, marginBottom: "24px" }}>
          You&apos;re now part of a community of developers who take their careers seriously.
          Your portfolio is your best asset — let&apos;s make it shine.
        </p>

        <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "12px", padding: "20px", marginBottom: "28px" }}>
          <p style={{ fontWeight: 600, marginBottom: "12px", color: "#e2e8f0" }}>Here&apos;s what to do first:</p>
          <ul style={{ paddingLeft: "20px", color: "#94a3b8", lineHeight: 2 }}>
            <li>Create your first portfolio</li>
            <li>Add 3–5 of your best projects</li>
            <li>Set your slug (devfolio.dev/your-name)</li>
            <li>Share your link on LinkedIn &amp; Twitter</li>
          </ul>
        </div>

        <a
          href={dashboardUrl}
          style={{
            display: "inline-block",
            padding: "14px 32px",
            background: "linear-gradient(to right, #2563eb, #0891b2)",
            color: "white",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "15px",
            textDecoration: "none",
          }}
        >
          Go to your dashboard →
        </a>

        <p style={{ fontSize: "14px", color: "#64748b", marginTop: "32px" }}>
          Questions? Reply to this email or reach us at{" "}
          <a href="mailto:hello@devfolio.dev" style={{ color: "#60a5fa" }}>hello@devfolio.dev</a>
        </p>
      </div>

      {/* Footer */}
      <div style={{ padding: "20px 40px 40px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: "12px", color: "#475569", textAlign: "center" }}>
          DevFolio · Built for developers, by developers
          <br />
          <a href="{unsubscribe}" style={{ color: "#475569" }}>Unsubscribe</a>
        </p>
      </div>
    </div>
  );
}
