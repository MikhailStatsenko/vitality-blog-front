export default class SizeService {
    static formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 байт';

        const sizes = ['байт', 'КБ', 'МБ', 'ГБ', 'ТБ'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        const formatted = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));

        return `${formatted} ${sizes[i]}`;
    }
}