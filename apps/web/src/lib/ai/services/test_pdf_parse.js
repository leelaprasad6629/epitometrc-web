const fs = require("fs");
const path = require("path");
const { PdfReader } = require("pdfreader");

function parsePdfBuffer(buffer) {
  return new Promise((resolve, reject) => {
    let rows = {};
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
        let text = "";
        const yCoords = Object.keys(rows).map(Number).sort((a, b) => a - b);
        for (const y of yCoords) {
          const rowItems = rows[y].sort((a, b) => a.x - b.x);
          text += rowItems.map(it => it.text).join(" ") + "\n";
        }
        resolve(text);
      } else if (item.text) {
        const y = Math.round(item.y * 100);
        if (!rows[y]) rows[y] = [];
        rows[y].push(item);
      }
    });
  });
}

async function run() {
  const pdfPath = "C:\\Users\\sreya\\.gemini\\antigravity\\brain\\a1a2b69c-9c33-4bbb-976b-690597b46f8b\\media__1783491029597.pdf";
  if (!fs.existsSync(pdfPath)) {
    console.error("PDF file does not exist at:", pdfPath);
    return;
  }
  const buffer = fs.readFileSync(pdfPath);
  try {
    const text = await parsePdfBuffer(buffer);
    console.log("--- EXTRACTED RESUME TEXT ---");
    console.log(text);
    console.log("-----------------------------");
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
