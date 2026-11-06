"use client";

import { useState } from "react";
import Icon from "./Icon";

export function rupiah(n) {
  return "Rp" + Number(n).toLocaleString("id-ID");
}

export function CopyButton({ text, label = "Salin", className = "" }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button type="button" className={`copy${copied ? " is-copied" : ""} ${className}`} onClick={copy}>
      <Icon name={copied ? "check" : "copy"} />
      {copied ? "Tersalin" : label}
    </button>
  );
}

export function Section({ title, text, className = "", children }) {
  return (
    <section className={`struk ${className}`}>
      <div className="struk-head">
        <h3>{title}</h3>
        <CopyButton text={text} />
      </div>
      {children ?? <p className="body">{text}</p>}
    </section>
  );
}
