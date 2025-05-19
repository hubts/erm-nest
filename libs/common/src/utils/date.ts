export class DateUtil {
    static isBetween(date: Date, start: Date, end: Date): boolean {
        return (
            new Date(date).getTime() >= new Date(start).getTime() &&
            new Date(date).getTime() <= new Date(end).getTime()
        );
    }

    static isAfter(date: Date, other: Date): boolean {
        return new Date(date).getTime() > new Date(other).getTime();
    }

    static isAfterOrEqual(date: Date, other: Date): boolean {
        return new Date(date).getTime() >= new Date(other).getTime();
    }

    static isBefore(date: Date, other: Date): boolean {
        return new Date(date).getTime() < new Date(other).getTime();
    }

    static isBeforeOrEqual(date: Date, other: Date): boolean {
        return new Date(date).getTime() <= new Date(other).getTime();
    }

    static isSameDay(date: Date, other: Date): boolean {
        return (
            new Date(date).getFullYear() === new Date(other).getFullYear() &&
            new Date(date).getMonth() === new Date(other).getMonth() &&
            new Date(date).getDate() === new Date(other).getDate()
        );
    }
}
