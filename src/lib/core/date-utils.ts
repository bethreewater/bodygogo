/**
 * Date Utilities for BodyGoGo
 * Enforces 'Asia/Taipei' (UTC+8) as the system timezone.
 */

export function getTodayDateString(): string {
    // Returns 'YYYY-MM-DD' in Asia/Taipei
    return new Intl.DateTimeFormat('en-CA', { // en-CA gives YYYY-MM-DD
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}

export function getNowISOString(): string {
    // Note: ISO string is always UTC. 
    // If we want a timestamp that represents "Now", simple new Date().toISOString() is fine for storage.
    // But for "Day Boundary" checks, use getTodayDateString().
    return new Date().toISOString();
}
