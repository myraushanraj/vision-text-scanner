javascript// Example file type detection logic
const fileExtension = path.extname(fullPath).toLowerCase();
let imagePath;

if (fileExtension === '.pdf') {
    const imageUrls = await convertPdfToJpeg(fullPath, outputDir);
    imagePath = imageUrls[0];
} else if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(fileExtension)) {
    imagePath = fullPath; // Direct path for image files
} else {
    console.log(`Unsupported file type: ${fileExtension}`);
    return;
}

const imageText = await analyzeDocument(imagePath, fullPath);
```## Handling Different File Types

The tool can work with both PDFs and image files:

### For PDF files
The default flow converts PDFs to JPEGs before processing:

```javascript
const imageUrl = await convertPdfToJpeg(fullPath, outputDir);
const imageText = await analyzeDocument(imageUrl[0], fullPath);
For image files
When working directly with image files (JPG, PNG, etc.), you can modify the code to skip the conversion step:
javascript// Comment this line when working with image files
// const imageUrl = await convertPdfToJpeg(fullPath, outputDir);

// Instead, directly pass the image path to analyzeDocument
const imageText = await analyzeDocument(fullPath, fullPath);
You might want to add file type detection logic to handle both cases automatically:# Document Text Extraction Tool
A Node.js tool for automated extraction of customer information from PDFs or any image files using AI vision capabilities.
Overview
This tool scans PDF documents or image files, converts PDFs to JPEG format if needed, and then uses the Llama 3.2 Vision model to extract key information such as customer ID, deal ID, loan ID, mobile number, name, and email address from the images.
Features

PDF to JPEG conversion for document processing
Direct processing of image files
AI-powered text extraction from any document images
Parallel processing with concurrency limits
Schema validation using Zod
Error handling and logging

Prerequisites

Node.js (v16 or higher)
Ollama server running with the llama3.2-vision model

Installation

Clone the repository:

bashgit clone <repository-url>
cd loan-detect-script

Install dependencies:

bashnpm install

Make sure you have Ollama installed and the llama3.2-vision model available:

bashollama pull llama3.2-vision
Project Structure
loan-detect-script/
├── input/             # Directory for PDF documents to be processed
├── output-images/     # Directory where JPEG conversions are stored
├── csv/               # Directory for output data (loan-data.csv)
├── convertPdfTojpg.js # Utility to convert PDFs to JPEGs
├── index.js           # Main application file
└── README.md          # This documentation
Configuration

The script processes PDF files from the ./input directory
Converted JPEGs are stored in the ./output-images directory
The concurrency limit is set to 2 parallel processes by default

Usage

Place PDF documents or image files in the input/ directory
Run the script:

bashnode index.js

The script will:

Process each file in the input directory
Convert PDFs to JPEG format if needed
Extract customer information using AI vision
Log the extracted data to the console



How It Works

File Discovery: The script scans the input/ directory for PDF files and images
PDF to JPEG Conversion: If the file is a PDF, it's converted to JPEG format using the convertPdfTojpg.js utility
AI Analysis: The image is analyzed using the Llama 3.2 Vision model
Data Extraction: The script extracts the following fields:

Customer ID
Deal ID
Loan ID/Number
Mobile Number (validated to be longer than 9 characters)
Customer Name
Email Address


Schema Validation: Extracted data is validated using Zod schema
Results: Successfully extracted information is logged to the console


Note: If you're working directly with image files, you can comment out this line in the code:
javascript// Comment this line if you already have image files
const imageUrl = await convertPdfToJpeg(fullPath, outputDir);
And directly pass the image path to the analyzeDocument function instead.

Dependencies

fs: File system operations
path: Path manipulation utilities
zod: Schema validation
zod-to-json-schema: Convert Zod schemas to JSON schema
ollama: Client for interacting with Ollama AI models
p-limit: Limit concurrent operations

Troubleshooting

PDF Conversion Issues: Ensure the PDF files are not corrupted or password-protected
AI Model Errors: Check that Ollama is running and the llama3.2-vision model is available
Extraction Failures: Some documents may not have clearly visible text for extraction

Extending the Project

Add a database connection to store extracted information
Implement a web interface for uploading and processing documents
Add support for more document types beyond PDFs
Create reporting and analytics features for processed documents


Contact
raushanraj10695@gmail.com