import confetti from 'canvas-confetti';

const BRAND_COLORS = ['#824892', '#FF9142', '#22C55E', '#3B82F6', '#D946EF'];

/**
 * Small celebration — for completing a single task.
 * Quick burst, low particle count, fires from a fixed point (e.g. near the checkbox).
 */
export function fireTaskCompleteConfetti(origin?: { x: number; y: number }) {
  confetti({
    particleCount: 40,
    spread: 50,
    startVelocity: 28,
    scalar: 0.8,
    ticks: 150,
    origin: origin ?? { x: 0.5, y: 0.6 },
    colors: BRAND_COLORS,
    zIndex: 9999,
  });
}

/**
 * Medium celebration — for creating something (new task, new category, joining a community).
 */
export function fireCreateSuccessConfetti() {
  confetti({
    particleCount: 60,
    spread: 65,
    startVelocity: 35,
    origin: { y: 0.7 },
    colors: BRAND_COLORS,
  });
}

/**
 * Big celebration — for finishing ALL tasks in a category or for the day (100% progress).
 * Fires from both sides for a fuller effect.
 */
export function fireAllTasksCompleteConfetti() {
  const duration = 1200;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      startVelocity: 45,
      origin: { x: 0, y: 0.7 },
      colors: BRAND_COLORS,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      startVelocity: 45,
      origin: { x: 1, y: 0.7 },
      colors: BRAND_COLORS,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

/**
 * Full-screen celebration — multi-burst from center, fills the entire viewport.
 * Use for high-impact moments: creating or joining a community.
 */
export function fireFullScreenConfetti() {
  const count = 220;
  const defaults = { colors: BRAND_COLORS, origin: { y: 0.55 } };

  const fire = (ratio: number, opts: Parameters<typeof confetti>[0]) =>
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * ratio) });

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

/**
 * Fires confetti from the position of a DOM element (e.g. a button or checkbox).
 * Useful for task checkboxes — pass the event target.
 */
export function fireConfettiFromElement(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  fireTaskCompleteConfetti({ x, y });
}
