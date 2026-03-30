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

  // Set a 16:9 landscape viewport
  await page.setViewport({ width: 1440, height: 810 });

  // Set cookie to dismiss cookie consent BEFORE navigating
  await page.setCookie({
    name: "cookie_consent",
    value: "accepted",
    domain: "localhost",
    path: "/",
  });

  console.log(`Loading ${URL}...`);
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });

  // Wait for fonts
  await page.evaluateHandle("document.fonts.ready");

  // Wait a bit for any delayed renders
  await new Promise((r) => setTimeout(r, 2000));

  // Prepare page for PDF: show all content, remove UI chrome, keep bg
  await page.evaluate(() => {
    // Force all animations to complete
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("reveal-visible");
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.transition = "none";
    });

    // Disable scroll snap
    document.documentElement.style.scrollSnapType = "none";
    document.documentElement.style.scrollBehavior = "auto";

    // Remove ALL fixed/sticky UI chrome
    document.querySelectorAll("*").forEach((el) => {
      const style = getComputedStyle(el);
      if (style.position === "fixed" || style.position === "sticky") {
        el.remove();
      }
    });

    // Make each slide exactly fit one landscape page and inject bg per slide
    const slideHeight = 794;
    document.querySelectorAll(".pitch-slide").forEach((slide) => {
      slide.style.height = `${slideHeight}px`;
      slide.style.minHeight = `${slideHeight}px`;
      slide.style.maxHeight = `${slideHeight}px`;
      slide.style.overflow = "hidden";
      slide.style.pageBreakAfter = "always";
      slide.style.pageBreakInside = "avoid";
      slide.style.boxSizing = "border-box";
      slide.style.display = "flex";
      slide.style.flexDirection = "column";
      slide.style.justifyContent = "center";
      slide.style.position = "relative";

      // Inject mesh background into each slide so it appears on every PDF page
      const isDark = getComputedStyle(slide).backgroundColor !== "rgba(0, 0, 0, 0)";
      const bg = document.createElement("div");
      bg.style.cssText = `
        position: absolute; inset: 0;
        background-image: url(/images/mesh-accent.jpg);
        background-size: cover; background-position: center;
        opacity: ${isDark ? "0.08" : "0.06"}; mix-blend-mode: ${isDark ? "screen" : "multiply"};
        pointer-events: none; z-index: 0;
      `;
      slide.insertBefore(bg, slide.firstChild);
    });

    // Remove any noise overlay pseudo-element by removing the class
    document.body.classList.remove("noise-overlay");
  });

  // Small delay for styles to settle
  await new Promise((r) => setTimeout(r, 500));

  console.log(`Exporting to ${OUTPUT}...`);
  await page.pdf({
    path: OUTPUT,
    width: "1123px",
    height: "794px",
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
