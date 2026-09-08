import { Renderer, MAX_VALUE } from '#/models/renderer'
import { SortedYieldResult } from '#/models/sorter';

/**
 * The maximum value used to scale bar heights to the canvas.
 * A bar with value `v` is drawn at height `(v / maxValue) * canvas.height`.
 */
const maxValue = MAX_VALUE;

/**
 * Helper to render a single numeric tile on the canvas.
 *
 * @param ctx - The 2D rendering context to draw on.
 * @param value - The numeric value of the element to display inside the tile.
 * @param x - The horizontal position (X-coordinate) where the tile starts.
 * @param y - The vertical position (Y-coordinate) where the tile starts.
 * @param width - The allocated pixel width for the tile.
 * @param height - The allocated pixel height for the tile.
 * @param bgColor - The CSS colour to fill the tile background with.
 * @param textColor - The CSS colour to draw the tile's text with (defaults to `#2b2e32`).
 */
function drawTile(
  ctx: CanvasRenderingContext2D,
  value: number,
  x: number,
  y: number,
  width: number,
  height: number,
  bgColor: string,
  textColor: string = '#2b2e32'
) {
  const padding = 1;
  const tileX = x + padding;
  const tileY = y;
  const tileW = Math.max(1, width - padding * 2);
  const tileH = height;

  // 1. Draw tile background
  ctx.fillStyle = bgColor;
  ctx.fillRect(tileX, tileY, tileW, tileH);

  // 2. Draw subtle border around tile
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(tileX, tileY, tileW, tileH);

  // 3. Draw numeric text inside tile if wide enough
  if (tileW >= 10) {
    // font > 9 and < 14 if tileW >10px
    const fontSize = Math.min(14, Math.max(9, Math.floor(tileW * 0.55)));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(value), tileX + tileW / 2, tileY + tileH / 2);
  }
}

/**
 * Main draw helper for numbers mode: clear the canvas, then render every
 * array element as a numeric tile, lifting active indices vertically and
 * applying the event colour.
 *
 * @param array - The array of numbers to render.
 * @param canvas - The canvas element (used for dimensions).
 * @param ctx - The 2D rendering context to draw on.
 * @param activeIndices - Zero-based position indices of elements currently involved in an event to highlight and lift.
 * @param eventColor - The CSS colour to apply to highlighted tiles.
 */
function render(
  array: number[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  activeIndices: number[] = [],
  eventColor?: string
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (array.length === 0) return;

  const tileWidth = canvas.width / array.length;
  const tileHeight = Math.min(40, canvas.height * 0.25);
  
  // Resting Y position (near bottom of canvas)
  const restingY = canvas.height - tileHeight - 15;
  // Lifted Y position (30px above resting baseline)
  const liftOffset = 30;

  array.forEach((value, index) => {
    const isHighlighted = activeIndices.includes(index);
    const y = isHighlighted ? restingY - liftOffset : restingY;
    const color = isHighlighted && eventColor ? eventColor : 'skyblue';

    drawTile(ctx, value, index * tileWidth, y, tileWidth, tileHeight, color);
  });
}

/**
 * Draw the array in its resting state: clear the canvas, then render every
 * numeric tile at its baseline position in the resting colour (`skyblue`).
 */
const drawResting = (array: number[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {
  render(array, canvas, ctx);
};

/**
 * Draw a single algorithm event: clear the canvas, render all numeric tiles in the
 * resting colour (`skyblue`), then redraw the event's `indices` visually lifted
 * and in the colour that matches the event type — `yellow` for compare, `red` for
 * swap, `green` for write.
 */
const drawEvent = (
  array: number[],
  event: SortedYieldResult,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): void => {
  const color = event.type === 'compare' ? 'yellow' : event.type === 'swap' ? 'red' : 'green';
  render(array, canvas, ctx, event.indices, color);
};

/**
 * Clear the canvas back to a blank frame.
 */
const clear = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

/**
 * The numbers renderer — implements the {@link Renderer} interface by drawing
 * numeric tiles in a row with active indices visually lifted.
 */
export const numbersRenderer: Renderer = {
  drawResting,
  drawEvent,
  clear,
};


