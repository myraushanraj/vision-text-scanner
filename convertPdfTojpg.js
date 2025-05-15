import { fromPath } from "pdf2pic";
import fs from "fs";

async function convertPdfToJpeg(pdfPath, outputDir, pageCount = 1) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const options = {
    density: 200,           // 🔼 Higher DPI for better quality (try 150–300)
    saveFilename: "page",
    savePath: outputDir,
    format: "jpeg",
    width: 1200,            // 🔼 Higher resolution width
    height: 1600            // 🔼 Higher resolution height
  };

  try {
    const convert = fromPath(pdfPath, options);
    const result = await convert.bulk(pageCount);
    const outputPaths = result.map(r => r.path);
    return outputPaths;
  } catch (err) {
    console.error("Error during conversion:", err);
    throw err;
  }
}

export default  convertPdfToJpeg ;
