import readPDF from "./PDFReader";
import convertPDFtoIMG from "./PDFtoIMG";
import convertIMGtoPDF from "./IMGtoPDF";
import { fileToBase64 } from '../util/File';

export interface IOptions {
    quality?: number;
    scale?: number;
}

export const compressPDF = async (file: File, options: IOptions = {}): Promise<File> => {
    options = {
        quality: 0.96,
        scale: 1,
        ...options,
    }

    const pdfDocumentProxy = await readPDF(`data:${file.type};base64,${await fileToBase64(file, true)}`);
    const images = await convertPDFtoIMG(pdfDocumentProxy, options);
    return await convertIMGtoPDF(images, file);
}
