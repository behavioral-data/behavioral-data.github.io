---
title: "Idiographic Fidelity Benchmark – Updates"
layout: textlay
excerpt: "Notification page for the Idiographic Fidelity Benchmark release."
sitemap: false
permalink: /idiofid/
---

<style>
/* Modern Reset */
*, *::before, *::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #ffffff;
  color: #000000;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/* Layout Container */
.wrapper {
  width: 100%;
  max-width: 560px;
  padding: 6rem 2rem 5rem;
  margin: 0 auto;
}
/* Typography Hierarchy */
.badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 6px 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #000;
}
h1 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin: 0 0 1.5rem 0;
  color: #000;
}
.subtitle {
  font-size: 1.125rem;
  color: #555;
  margin: 0 0 1.5rem 0;
  font-weight: 400;
  line-height: 1.6;
  max-width: 90%;
}
/* Form Section */
.signup-section {
  border-top: 1px solid #eaeaea;
  padding-top: 1.5rem;
}
.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: #000;
}
.form-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
input[type="email"] {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  color: #000;
  font-family: inherit;
  transition: border-color 0.2s ease;
}
input[type="email"]:focus {
  outline: none;
  border-color: #000;
}
input[type="email"]::placeholder {
  color: #999;
}
button {
  -webkit-appearance: none;
  appearance: none;
  background: #000;
  color: #fff;
  border: 1px solid #000;
  border-radius: 4px;
  padding: 0 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  white-space: nowrap;
}
button:hover {
  background: #333;
  border-color: #333;
}
.helper-text {
  font-size: 0.8rem;
  color: #888;
}
/* Footer */
.footer {
  margin-top: 4rem;
  padding-top: 1rem;
  font-size: 0.75rem;
  color: #bbb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* Responsive */
@media (max-width: 480px) {
  .wrapper {
    padding: 4.5rem 1.5rem 3.5rem;
    margin: 0 auto;
  }
  .form-row {
    flex-direction: column;
  }
  button {
    padding: 0.875rem;
    width: 100%;
  }
}
</style>

<div class="wrapper" markdown="0">
  <header>
    <span class="badge">Benchmark Release</span>
    <h1>Idiographic Fidelity Benchmark – Attitude (IdioFid-A)</h1>
    <p class="subtitle">
      IdioFid-A is a benchmark for evaluating how well AI agents can infer a specific person’s attitudes from their real social media history. Leave your email to get a one-time notification when the benchmark, dataset, and code are public.
    </p>
  </header>

  <section class="signup-section">
    <form action="https://script.google.com/macros/s/AKfycbwhYIjPdmTCjQyCg8kMdXu_95sUmUjgxkL1fol5ALOehcuOO-fOrVo4oc2IN7eack8r/exec" method="POST">
      <label for="email" class="input-label">Enter email for release update</label>
      <div class="form-row">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your email here"
          required
          autocomplete="email"
        />
        <button type="submit">Notify me</button>
      </div>
      <div class="helper-text">
        No spam. One-time alert only.
      </div>
    </form>
  </section>

  <footer class="footer">
    <span>&copy; 2025 Idiographic Fidelity Benchmark</span>
    <span>Research Release</span>
  </footer>
</div>
