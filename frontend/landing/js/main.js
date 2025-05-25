document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".animated-text");

  elements.forEach((el) => {
    const fullText = el.getAttribute("data-text");

    // Special handling for the signature line
    if (el.id === "signature-line") {
      const prefix = "Your friendly neighborhood ";
      const boldPart = "AI Marketing Agency";

      el.innerHTML = "";

      // Animate prefix
      prefix.split("").forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.animationDelay = `${i * 0.03}s`;
        el.appendChild(span);
      });

      // Animate bold part
      boldPart.split("").forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.animationDelay = `${(prefix.length + i) * 0.03}s`;
        span.style.fontWeight = "bold";
        el.appendChild(span);
      });
    } else {
      // Normal animation for other text
      el.innerHTML = "";
      const text = el.getAttribute("data-text");
      text.split("").forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.animationDelay = `${i * 0.01}s`;
        el.appendChild(span);
      });
    }
  });
});
