---
title: "Idiographic Benchmark – Updates"
layout: textlay
excerpt: "Notification page for the Idiographic Benchmark release."
sitemap: false
permalink: /idiofid/
---

<style>
.idiofid-page {
  --text-main: #111827;
  --text-muted: #6b7280;
  --border-subtle: #e5e7eb;
  --accent: #2563eb;
  --accent-soft: #eff6ff;

  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  margin: 0;
  box-sizing: border-box;
  background: #ffffff;
  color: var(--text-main);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}
.idiofid-shell {
  width: 100%;
  max-width: 640px;
}
.idiofid-header {
  margin-bottom: 24px;
}
.idiofid-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  background: #f9fafb;
  border-radius: 999px;
  padding: 4px 10px;
  border: 1px solid #f3f4f6;
}
.idiofid-eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--accent);
}
.idiofid-title {
  margin: 12px 0 4px;
  font-size: clamp(1.9rem, 3vw, 2.3rem);
  font-weight: 600;
  letter-spacing: -0.03em;
}
.idiofid-subtitle {
  margin: 4px 0 0;
  font-size: 0.95rem;
  color: var(--text-muted);
  max-width: 36rem;
}
.idiofid-card {
  margin-top: 24px;
  border-radius: 16px;
  border: 1px solid var(--border-subtle);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
  padding: 20px 20px 18px;
  background: #ffffff;
}
.idiofid-card-title {
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0 0 10px;
}
.idiofid-form {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.idiofid-label {
  font-size: 0.85rem;
  font-weight: 500;
}
.idiofid-input-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.idiofid-input {
  width: 100%;
  padding: 10px 11px;
  font: inherit;
  border-radius: 10px;
  border: 1px solid var(--border-subtle);
  background: #ffffff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}
.idiofid-input::placeholder {
  color: #9ca3af;
}
.idiofid-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent-soft);
  background: #ffffff;
}
.idiofid-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
}
.idiofid-button {
  border: none;
  border-radius: 999px;
  padding: 9px 18px;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  background: var(--accent);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.08s ease-out, box-shadow 0.1s ease-out, background-color 0.1s ease-out;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
}
.idiofid-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 35px rgba(37, 99, 235, 0.25);
  background-color: #1d4ed8;
}
.idiofid-button:active {
  transform: translateY(0);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.2);
}
.idiofid-button-chevron {
  font-size: 1rem;
  translate: 0 0;
  transition: translate 0.12s ease;
}
.idiofid-button:hover .idiofid-button-chevron {
  translate: 2px 0;
}
.idiofid-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
}
.idiofid-footer {
  margin-top: 18px;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.idiofid-footer span {
  background: #f9fafb;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid #f3f4f6;
}
@media (min-width: 640px) {
  .idiofid-card {
    padding: 22px 22px 20px;
  }
  .idiofid-form {
    flex-direction: column;
  }
  .idiofid-input-row {
    flex-direction: row;
    align-items: center;
  }
  .idiofid-input-row .idiofid-label {
    flex: 0 0 140px;
    margin-bottom: 0;
  }
  .idiofid-input-row .idiofid-input {
    flex: 1;
  }
  .idiofid-actions {
    margin-top: 4px;
  }
}
</style>

<div class="idiofid-page" markdown="0">
  <div class="idiofid-shell">
    <header class="idiofid-header">
      <div class="idiofid-eyebrow">
        <span class="idiofid-eyebrow-dot"></span>
        <span>Benchmark release notification</span>
      </div>
      <h1 class="idiofid-title">Idiographic Benchmark</h1>
      <p class="idiofid-subtitle">
        We’re preparing a public release of the dataset and code. Leave your email to
        get a one-time notification when everything is live.
      </p>
    </header>

    <section class="idiofid-card">
      <p class="idiofid-card-title">Get a release notification</p>
      <form class="idiofid-form" action="https://script.google.com/macros/s/AKfycbwhYIjPdmTCjQyCg8kMdXu_95sUmUjgxkL1fol5ALOehcuOO-fOrVo4oc2IN7eack8r/exec" method="POST">
        <div class="idiofid-input-row">
          <label class="idiofid-label" for="email">Email address</label>
          <input
            class="idiofid-input"
            type="email"
            id="email"
            name="email"
            required
            autocomplete="email"
            placeholder="you@example.org"
          />
        </div>
        <div class="idiofid-actions">
          <button class="idiofid-button" type="submit">
            Notify me
            <span class="idiofid-button-chevron">↗</span>
          </button>
          <span class="idiofid-hint">
            We’ll only email you about this benchmark release.
          </span>
        </div>
      </form>
    </section>

    <footer class="idiofid-footer">
      <span>Coming soon · research benchmark</span>
    </footer>
  </div>
</div>
