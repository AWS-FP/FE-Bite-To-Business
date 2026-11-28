/** Anchor a portaled menu to the trigger without covering it. */
export function dropdownPosition(rect: DOMRect, minWidth: number, preferredHeight: number) {
    const margin = 8;
    const gap = 7;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight;
    const width = Math.max(0, Math.min(Math.max(rect.width, minWidth), viewportWidth - margin * 2));
    const below = Math.max(0, viewportHeight - rect.bottom - gap - margin);
    const above = Math.max(0, rect.top - gap - margin);
    const upward = below < preferredHeight && above > below;
    return {
        left: Math.max(margin, Math.min(rect.left, viewportWidth - width - margin)),
        width,
        maxHeight: Math.min(preferredHeight, upward ? above : below),
        ...(upward ? { bottom: viewportHeight - rect.top + gap } : { top: rect.bottom + gap }),
    };
}
