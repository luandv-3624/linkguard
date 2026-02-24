export interface Position {
  x: number;
  y: number;
}

export interface Bounds {
  width: number;
  height: number;
}

const TOOLTIP_OFFSET = 10;
const TOOLTIP_MAX_WIDTH = 320;
const TOOLTIP_MAX_HEIGHT = 200; // Approximate

/**
 * Calculate tooltip position to avoid going off-screen
 */
export function calculateTooltipPosition(
  mousePosition: Position,
  tooltipBounds?: Bounds
): Position {
  const bounds = tooltipBounds || {
    width: TOOLTIP_MAX_WIDTH,
    height: TOOLTIP_MAX_HEIGHT,
  };

  let x = mousePosition.x;
  let y = mousePosition.y + TOOLTIP_OFFSET;

  // Check right edge
  if (x + bounds.width > window.innerWidth) {
    x = window.innerWidth - bounds.width - 10;
  }

  // Check bottom edge
  if (y + bounds.height > window.innerHeight) {
    y = mousePosition.y - bounds.height - TOOLTIP_OFFSET;
  }

  // Check left edge
  if (x < 10) {
    x = 10;
  }

  // Check top edge
  if (y < 10) {
    y = 10;
  }

  return { x, y };
}
