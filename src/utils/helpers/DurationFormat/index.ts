export const formatDuration = (minutes: number | null) => {
    if (minutes === null) return "Không có thời gian"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
        return mins > 0 ? `Từ ${hours} tiếng ${mins} phút` : `Từ ${hours} tiếng`
    }
    return `Từ ${mins} phút`
}