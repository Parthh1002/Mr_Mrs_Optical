/**
 * Haptic Feedback Utility for Mobile Web Application
 * Leverages navigator.vibrate Web API for native tactile touch responses.
 */

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning';

export function triggerHaptic(pattern: HapticPattern = 'light') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (pattern) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'heavy':
        navigator.vibrate(35);
        break;
      case 'success':
        navigator.vibrate([12, 40, 20]);
        break;
      case 'warning':
        navigator.vibrate([25, 50, 25]);
        break;
    }
  } catch {
    /* Ignore vibration permissions or unsupported browsers */
  }
}

/**
 * Attaches global mobile touch listener to automatically trigger tactile
 * haptic vibration on all interactive buttons, links, and cards.
 */
export function initGlobalHaptics() {
  if (typeof window === 'undefined') return;

  const handlePointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Check if target or any parent is interactive (button, a, role=button, input)
    const interactive = target.closest('button, a, [role="button"], input[type="button"], input[type="submit"], .cursor-pointer');
    if (interactive) {
      triggerHaptic('light');
    }
  };

  window.addEventListener('pointerdown', handlePointerDown, { passive: true });
}
