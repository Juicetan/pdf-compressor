import compressPDF from '../src/index';

console.log(compressPDF);

const button = document.querySelector('button');

button.addEventListener('click', async () => {
    const file = await selectFile() as File;
    console.log(file)
    console.log(file.size);

    const compressedFile = await compressPDF(file, {
        scale: 2,
        quality: 0.94,
    });
    console.log(compressedFile);
    console.log(compressedFile.size);

    downloadFile(compressedFile);
});


/**
 * Выбрать файлы для загрузки куда-либо
 *
 * @param {boolean} multiple Выбор нескольких файлов
 * @param {string} accept Строка для фильтра типов файлов при выборе
 * @returns {Promise<File[]>}
 */
export function selectFile(multiple?: boolean, accept: string = ''): Promise<File|File[]> {
    return new Promise((resolve, reject) => {
        const file = document.createElement('input');
        file.type = 'file';
        file.style.display = 'none';
        if (multiple) {
            file.multiple = true;
        }

        if (accept) {
            file.accept = accept;
        }

        file.addEventListener('change', (e) => {
            const target = e.target;
            const files = target?.files;

            if (files && files.length > 0) {
                // @ts-ignore
                resolve(multiple ? [...files] : files[0]);
            } else {
                resolve(null);
            }

            file.remove();
        });

        document.body.append(file);

        file.click();
    })
}

export const downloadFile = async (file: File) => {
    const link = document.createElement('a')
    const url = URL.createObjectURL(file)

    link.href = url
    link.download = file.name
    document.body.append(link)
    link.click()
    link.remove();
    window.URL.revokeObjectURL(url)
}
