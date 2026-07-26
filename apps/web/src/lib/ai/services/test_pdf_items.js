const fs = require("fs");
const { PdfReader } = require("pdfreader");

function run() {
  const pdfPath = "C:/Users/sreya/.gemini/antigravity/brain/a1a2b69c-9c33-4bbb-976b-690597b46f8b/media__1783491029597.pdf";
  const buffer = fs.readFileSync(pdfPath);
  
  let count = 0;
  new PdfReader().parseBuffer(buffer, (err, item) => {
    if (err) {
      console.error(err);
    } else if (!item) {
      console.log("Done");
    } else {
      if (count < 30) {
        console.log("ITEM:", item);
        count++;
      }
    }
  });
}

run();
