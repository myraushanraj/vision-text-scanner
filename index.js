import fs from 'fs';
import path from 'path';
import convertPdfToJpeg from './convertPdfTojpg.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import Ollama from "ollama";
import pLimit from 'p-limit';

const filePath = path.join(process.cwd(), 'csv/loan-data.csv');



const DocumentAnalysis = z.object({
    customerId: z.string().optional(),
    dealId: z.string().optional(), 
    loanId: z.string().optional(),
    mobileNo: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    fileName: z.string().optional(),
});

function trimBasePath(fullPath) {
    const basePath = "/Users/raushanraj/Documents/code/loan-detect-script/input/";
    return fullPath.replace(basePath, "");
}

async function analyzeDocument(imagePath, fullPath) {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Document image file not found: ${imagePath}`);
    }
  
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    console.log("fetching text from path ", fullPath);
    try {
      const response = await Ollama.chat({
        model: "llama3.2-vision",
        messages: [
          {
            role: "user",
            content:
            `Extract the following fields from the provided image **only if they are clearly present**:
            - customer Id  
            - deal ID  
            - loan No or loan ID  
            - Mobile No  - length greater than 9
            - name  
            - email `,
            images: [base64Image],
          },
        ],
        format: zodToJsonSchema(DocumentAnalysis),
        options: { temperature: 0 },
      });
  
      const documentAnalysis = DocumentAnalysis.parse(
        JSON.parse(response.message.content)
      );
      documentAnalysis.fileName = trimBasePath(fullPath);
      return documentAnalysis;
    } catch (error) {
      console.error("Error analyzing document:", error);
      throw error;
    }
}

const limit = pLimit(2);
async function listFilesByFolder(dir) {
    console.log("Processing directory:", dir);
    try {
        const files = await fs.promises.readdir(dir);
        
        for (const file of files) {
            await limit(async () => {
                if (file === ".DS_Store") return;
                
                const fullPath = path.resolve(path.join(dir, file));
                const stats = await fs.promises.stat(fullPath);
                
                // Skip if it's a directory
                if (stats.isDirectory()) return;
                
                const outputDir = path.join(process.cwd(), "output-images");
                
                try {
                    const imageUrl = await convertPdfToJpeg(fullPath, outputDir);
                    const imageText = await analyzeDocument(imageUrl[0], fullPath);
                    console.log("✅ imageText:", imageText);
                } catch (err) {
                    console.error("❌ Error processing file:", fullPath, err.message);
                }
            });
        }
    } catch (err) {
        console.error(`Error processing directory ${dir}:`, err);
    }
}

const directoryPath = path.resolve('./input');
listFilesByFolder(directoryPath);
