import { ILocationSchedule } from '@models/locationAvailability/common.model'

export const MonthYear = (date: any) => {
    const month = new Date(date).toLocaleString('default', { month: 'numeric' })
    const year = new Date(date).getFullYear();
    return `${month}/${year}`;
}

export const DateMonthYear = (date: any) => {
    const day = new Date(date).toLocaleString('default', { day: 'numeric' });
    const month = new Date(date).toLocaleString('default', { month: 'numeric' });
    const year = new Date(date).getFullYear();
    return `${day}/${month}/${year}`;
}

export const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} `;
};

export const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
        return "Vừa xong"
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `${minutes} phút trước`
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `${hours} giờ trước`
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400)
        return `${days} ngày trước`
    } else {
        return DateMonthYear(dateString)
    }
}

export const formatDateAgo = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const weeks = Math.round(days / 7);
    const months = Math.round(days / 30.44);
    const years = Math.round(days / 365.25);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (seconds > 5) return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    return "just now";
};


export const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
}

export const getMonthFromDate = (date: string) => {
    const [, month] = date.split('/')
    return parseInt(month)
}

export const getWeekFromDate = (date: string) => {
    const [day, month, year] = date.split('/')
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const firstDayOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1)
    const dayOfMonth = dateObj.getDate()
    const firstDayWeekday = firstDayOfMonth.getDay()
    return Math.ceil((dayOfMonth + firstDayWeekday) / 7)
}

export const getMonthName = (month: number) => {
    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ]
    return monthNames[month - 1]
}

export const getWeekdayLabel = (date: string) => {
    const [day, month, year] = date.split('/')
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    return weekdays[d.getDay()]
}

export const getAllYears = (workingHoursList: ILocationSchedule[]) => {
    const years = new Set<number>()
    workingHoursList?.forEach(wh => {
        wh.workingDates?.forEach((wd: { date: string }) => {
            const year = parseInt(wd.date.split('/')[2])
            years.add(year)
        })
    })
    return Array.from(years).sort((a, b) => a - b)
}

export const groupWorkingHoursByMonthAndWeek = (workingHoursList: ILocationSchedule[], selectedYear: number) => {
    const grouped: { [month: number]: { [week: number]: ILocationSchedule[] } } = {}

    workingHoursList?.forEach((workingHours) => {
        if (workingHours.workingDates?.length > 0) {
            workingHours.workingDates.forEach((workingDate: { date: string }) => {
                const [, month, year] = workingDate.date.split('/')
                // Only include dates from the selected year
                if (parseInt(year) === selectedYear) {
                    const monthNum = parseInt(month)
                    const week = getWeekFromDate(workingDate.date)

                    if (!grouped[monthNum]) {
                        grouped[monthNum] = {}
                    }
                    if (!grouped[monthNum][week]) {
                        grouped[monthNum][week] = []
                    }

                    // Check if this working hours is already in this week
                    const existingIndex = grouped[monthNum][week].findIndex(item => item.id === workingHours.id)
                    if (existingIndex === -1) {
                        grouped[monthNum][week].push(workingHours)
                    }
                }
            })
        }
    })

    return grouped
} 