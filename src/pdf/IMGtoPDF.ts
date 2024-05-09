import PDFDocument from "pdfkit/js/pdfkit.standalone";
import blobStream from "blob-stream";
import {getImageObject} from "../util/File";

const convertIMGtoPDF = async (images: unknown[], file: File): Promise<File> => {
    return new Promise(async (resolve, reject) => {
        const pdfDocument = createPDF(file.name.split(".")[0]);

        const stream = pdfDocument.pipe(blobStream());

        for (let image of images) {
            let imageObject = await getImageObject(image);
            pdfDocument.addPage({size: [imageObject.width, imageObject.height]});
            pdfDocument.image(imageObject.src, 0, 0);
        }

        pdfDocument.end();

        stream.on("finish", async () => {
            const outputBlob = stream.toBlob("application/pdf");
            const compressedFile = new File([outputBlob], file.name);
            resolve(compressedFile);
        });
    })
}

const createPDF = (filename: string) => {
    const pdfDocument = new PDFDocument({ autoFirstPage: false, compress: false });
    pdfDocument.info = {
        Title: `${filename}.pdf`,
        Author: "mys",
        Keywords: `${filename}, pdf`,
        CreationDate: new Date(),
    };
    return pdfDocument;
}

export default convertIMGtoPDF;
