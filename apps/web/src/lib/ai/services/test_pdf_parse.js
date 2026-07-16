const pdf = require("pdf-parse");
const fs = require("fs");
const path = require("path");

async function test() {
  try {
    // Check if there is any pdf in user artifacts or desktop
    const testPdfPath = path.join(__dirname, "../../../../public/favicon.ico"); // just to see
    console.log("pdf-parse loaded successfully.");
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
