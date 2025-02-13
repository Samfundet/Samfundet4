export const formatDate = (date: Date): string => date.toISOString().substring(0, 10);
export const formatTime = (date: Date): string => date.toLocaleTimeString('no-NO').substring(0, 5);
