const fs = require("fs");
const { PdfReader } = require("pdfreader");

function parsePdfOld(buffer) {
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

function parsePdfNew(buffer) {
  return new Promise((resolve, reject) => {
    let pages = {};
    let currentPage = 1;
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
        let fullText = "";
        const pageNumbers = Object.keys(pages).map(Number).sort((a, b) => a - b);
        for (const p of pageNumbers) {
          const pageItems = pages[p];
          pageItems.sort((a, b) => a.y - b.y);

          let rows = [];
          const yTolerance = 0.15;
          for (const it of pageItems) {
            let foundRow = rows.find(r => Math.abs(r.y - it.y) < yTolerance);
            if (foundRow) {
              foundRow.items.push(it);
            } else {
              rows.push({ y: it.y, items: [it] });
            }
          }

          rows.sort((a, b) => a.y - b.y);
          let pageText = "";
          for (const row of rows) {
            row.items.sort((a, b) => a.x - b.x);
            pageText += row.items.map(it => it.text).join(" ") + "\n";
          }
          fullText += pageText + "\n\n";
        }
        resolve(fullText.trim());
      } else if (item.page) {
        currentPage = item.page;
      } else if (item.text) {
        if (!pages[currentPage]) pages[currentPage] = [];
        pages[currentPage].push(item);
      }
    });
  });
}

async function run() {
  const pdfPath = "C:/Users/sreya/.gemini/antigravity/brain/a1a2b69c-9c33-4bbb-976b-690597b46f8b/media__1783491029597.pdf";
  if (!fs.existsSync(pdfPath)) {
    console.error("PDF file does not exist.");
    return;
  }
  const buffer = fs.readFileSync(pdfPath);
  
  console.log("=== OLD METHOD (Characters 200 to 1000) ===");
  const textOld = await parsePdfOld(buffer);
  console.log(textOld.substring(200, 1000));
  
  console.log("\n=== NEW METHOD (Characters 200 to 1000) ===");
  const textNew = await parsePdfNew(buffer);
  console.log(textNew.substring(200, 1000));
}

run();
