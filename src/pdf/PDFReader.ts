import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import PDFJSWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

const readPDF = (pdf_url) => pdfjsLib.getDocument(pdf_url).promise;

export default readPDF;
