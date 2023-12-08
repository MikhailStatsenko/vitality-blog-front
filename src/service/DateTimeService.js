export default class DateTimeService {
    static convertBackDateToInput(unixTimestamp: number): string {
        const milliseconds = unixTimestamp * 1000;
        const date = new Date(milliseconds);
        return date.toISOString().slice(0, 16);
    }

    static convertBackDateToDate(unixTimestamp: number): Date {
        const milliseconds = unixTimestamp * 1000;
        return new Date(milliseconds);
    }

    static convertBackDateToString(unixTimestamp: number): string {
        const milliseconds = unixTimestamp * 1000;
        const localDate = new Date(milliseconds);

        const options = {

            hour: 'numeric',
            minute: 'numeric',
            day: '2-digit',
            month: '2-digit',
            weekday: 'short',
            year: 'numeric',
        };

        // @ts-ignore
        const formattedDate = localDate.toLocaleString('ru-RU', options);
        return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
}