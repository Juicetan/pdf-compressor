import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.min.mjs';

const readPDF = (pdf_url) => pdfjsLib.getDocument(pdf_url).promise;

export default readPDF;
