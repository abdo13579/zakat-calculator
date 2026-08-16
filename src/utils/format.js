// Number formatting utilities ported from legacy js/app.js.

export function formatNumber(num) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Input sanitization: strip non-numeric / non-dot characters; collapse multiple dots.
// Returns the cleaned string.
export function sanitizeNumericInput(value) {
    let cleaned = value.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    return cleaned;
}
