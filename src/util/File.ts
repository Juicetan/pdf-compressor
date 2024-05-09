export const getImageObject = data => new Promise((resolve, reject) => {
    const image = new Image();
    image.src = data;
    image.onload = () => resolve(image);
    image.onerror = () => reject("Error cannot create the image");
});

export const createCanvas = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.id = "canvas";
    canvas.width = width;
    canvas.height = height;

    return canvas;
}

export const createCanvasFromViewport = (viewPort) => {
    return createCanvas(viewPort.width || viewPort.viewBox[2], viewPort.height || viewPort.viewBox[3]);
}

export const createCanvasContext = (canvas) => {
    return canvas.getContext('2d');
}

export const fileToBase64 = (file: File, contentOnly?: boolean): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
        const base64 = <string>reader.result;

        // Конвертируем строку в массив, чтобы добавить новые данные
        const base64Array = base64.split(';');
        const filename = file.name.replace(/[^\s\w().А-я-]/g, '');

        if (contentOnly) {
            resolve(('' + base64Array.slice(1)).replace('base64,', ''));
            return;
        }

        // Добавляем дополнительные метаданные о названии файла в base64 строку и конвертируем обратно в строку
        const base64WithMeta = [base64Array[0], `filename:${filename}`, ...base64Array.slice(1)].join(';');

        resolve(base64WithMeta);
    });
    reader.addEventListener('error', error => reject(error));
});

export const blobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});
