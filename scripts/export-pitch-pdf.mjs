#!/usr/bin/env node
/**
 * Export the /pitch page to PDF using Puppeteer.
 * Usage: node scripts/export-pitch-pdf.mjs [output-path]
 */

import puppeteer from "puppeteer";
import { resolve } from "path";

const OUTPUT = process.argv[2] || resolve("kodwai-pitch-deck.pdf");
const URL = "http://localhost:3000/pitch";

async function exportPDF() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set a wide viewport for nice rendering
  await page.setViewport({ width: 1440, height: 900 });

  console.log(`Loading ${URL}...`);
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });

  // Wait for fonts to load
  await page.evaluateHandle("document.fonts.ready");

  // Force all reveal animations to show
  await page.evaluate(() => {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("reveal-visible");
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    document.querySelectorAll(".pitch-slide").forEach((el) => {
      el.classList.add("visible");
    });
    // Remove ALL fixed/overlay elements (cookie banner, nav dots, progress bar, etc.)
    document.querySelectorAll("*").forEach((el) => {
      const style = getComputedStyle(el);
      if (style.position === "fixed" || style.position === "sticky") {
        el.remove();
      }
    });
    // Disable scroll snap
    document.documentElement.style.scrollSnapType = "none";
  });

  // Small delay for styles to settle
  await new Promise((r) => setTimeout(r, 500));

  console.log(`Exporting to ${OUTPUT}...`);
  await page.pdf({
    path: OUTPUT,
    format: "A4",
    landscape: true,
    printBackground: true,
    margin: { top: "0", bottom: "0", left: "0", right: "0" },
    preferCSSPageSize: false,
  });

  await browser.close();
  console.log(`✅ PDF exported: ${OUTPUT}`);
}

exportPDF().catch((err) => {
  console.error("Export failed:", err.message);
  process.exit(1);
});
