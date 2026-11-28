/** Backend JSON belongs in structured events, never in the visible chat, including older saved replies. */
export function safeAssistantText(text: string, locale = 'vi'): string {
    return /```|(?:\{|\[)\s*"[^"\r\n]+"\s*:|<\s*\/?\s*(script|html|iframe|style)\b/i.test(text)
        ? locale === 'en'
            ? "I don't know."
            : 'Tôi không biết.'
        : text;
}
