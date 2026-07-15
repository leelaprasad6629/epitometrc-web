const { PdfReader } = require("pdfreader");

try {
  const reader = new PdfReader();
  console.log("pdfreader loaded successfully.");
} catch (err) {
  console.error("Error loading pdfreader:", err);
}
