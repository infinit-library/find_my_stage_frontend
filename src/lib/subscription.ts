export const SUBSCRIPTION_KEY = "subscriptionActiveUntil";

export function getSubscriptionActiveUntil(): Date | null {
    try {
        const iso = localStorage.getItem(SUBSCRIPTION_KEY);
        if (!iso) return null;
        const date = new Date(iso);
        return isNaN(date.getTime()) ? null : date;
    } catch {
        return null;
    }
}

export function isSubscribed(now: Date = new Date()): boolean {
    const activeUntil = getSubscriptionActiveUntil();
    return !!activeUntil && activeUntil.getTime() > now.getTime();
}

export function activateSubscription(days: number = 30): void {
    const now = new Date();
    const activeUntil = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    localStorage.setItem(SUBSCRIPTION_KEY, activeUntil.toISOString());
}

export function cancelSubscription(): void {
    localStorage.removeItem(SUBSCRIPTION_KEY);
}

export function setSubscriptionActiveUntil(isoString: string): void {
    if (!isoString) return
    localStorage.setItem(SUBSCRIPTION_KEY, isoString)
}

