export default function wasCreatedRecently(date, thresholdMinutes = 60) {
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = diffMs / (1000 * 60);
    return diffMinutes < thresholdMinutes;
}
