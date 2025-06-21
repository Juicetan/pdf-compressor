import {
  createCanvasContext,
  createCanvasFromViewport
} from "../util/File";
import { IOptions } from './PDFCompress';
import Deferred from '../models/deferred';

const convertPDFtoIMG = (pdfDocumentProxy, options: IOptions) => {
  return renderAllPages(pdfDocumentProxy, options);
}

const renderAllPages = (pdfDocumentProxy, options: IOptions) => {
  var def = new Deferred();
  let images = [];
  let completed = 0;
  const maxConcurrency = 4;
  let curConcurrency = 0;
  let queue = Array.from({
    length: pdfDocumentProxy.numPages
  }, (_, i) => i + 1);

  const process = async function(){
    if(completed === pdfDocumentProxy.numPages){
      images = images.filter((img) => img !== undefined)
      console.log('> done images', images.length);      
      def.resolve(images);
      return;
    } else if(curConcurrency >= maxConcurrency || !queue.length){
      return;
    }
    
    curConcurrency++;
    const pageNum = queue.pop();
    let pdfPageProxy = await pdfDocumentProxy.getPage(pageNum);
    
    if(queue.length && curConcurrency < maxConcurrency){
      process();
    }
    
    let renderedPage = await renderPage(pdfPageProxy, options);
    images[pageNum - 1] = JSON.parse(JSON.stringify(renderedPage));
    completed++;
    if(options.progressHandler){
      options.progressHandler({
        completed: completed,
        total: pdfDocumentProxy.numPages
      })
    }
    curConcurrency--;
    process();
  }
  process();

  return def.promise;
}

const renderPage = async (pdfPageProxy, options: IOptions) => {
  const pageViewport = pdfPageProxy.getViewport({ scale: options.scale });
  const canvas = createCanvasFromViewport(pageViewport);
  const canvasContext = createCanvasContext(canvas);
  const renderTaskParams = { canvasContext: canvasContext, viewport: pageViewport }

  await pdfPageProxy.render(renderTaskParams).promise;

  const base64 = canvas.toDataURL("image/jpeg", options.quality);

  canvas.remove();

  return base64;
};

export default convertPDFtoIMG;
