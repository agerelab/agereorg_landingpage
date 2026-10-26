// The early bird dialog's illustration (FE-18, PO 9 Oct 2026): a pixel bird carries a folder, in the style
// of a retro endless runner. The bird stays put while the clouds scroll left, so it reads as flying right. Our own sprites, in the theme's ink and paper so they read in light and dark. Decorative,
// hidden from screen readers.
import s from "./eb-flight.module.css";

/** One pixel of the clouds, in SVG units. */
const P = 4;
/** One pixel of the bird and the folder: a little smaller than the clouds (PO, 9 Oct 2026). */
const B = 3;
/** The width of one sky tile; it is drawn twice so the scroll loops without a seam. */
const TILE = 480;

// "#" is ink, "o" is paper, "." is empty. Every row of a sprite has the same length (tests/unit/eb-dialog.test.ts).
export const BIRD_UP = [
  ".....###..................",
  "....######.......#####....",
  "....########...#########..",
  ".....########.######o####.",
  "###....#######o###########",
  "#####...#oooo############.",
  ".#######################..",
  "..######################..",
  "..#####################...",
  "..#####################...",
  "..#####################...",
  "...###################....",
  "....#################.....",
  "......#############.......",
  ".........#######..........",
  ".........#....#...........",
  ".........#....#...........",
];

export const BIRD_DOWN = [
  "..........................",
  ".................#####....",
  "...............#########..",
  "..............######o####.",
  "###...........############",
  "#####...#################.",
  ".#######################..",
  "..######################..",
  "..#####################...",
  ".##o###################...",
  "####o##################...",
  "#####o################....",
  ".####################.....",
  "..#################.......",
  "....###..#######..........",
  ".........#....#...........",
  ".........#....#...........",
];

export const FOLDER = [
  ".######.................",
  "########................",
  "####################....",
  "###ooooooooooooooo##....",
  "###ooooooooooooooo##....",
  "###oo#########oooo##....",
  "###o####################",
  "####oooooooooooooooooo#.",
  "####oooooooooooooooooo#.",
  "###oooooooooooooooooo#..",
  "###oooooooooooooooooo#..",
  "##oooooooooooooooooo#...",
  "##oooooooooooooooooo#...",
  "#oooooooooooooooooo#....",
  "####################....",
];

export const CLOUD = [
  "......#####.........",
  "....##.....###......",
  "..##..........#.....",
  ".#.............####.",
  "#..................#",
  "####################",
];

const PAPER = "hsl(var(--ag-bg-default))";

/** A sprite as horizontal runs of ink and of paper, one rect per run. */
function Sprite({ rows, x, y, p = P }: { rows: string[]; x: number; y: number; p?: number }) {
  const rects: React.ReactNode[] = [];
  rows.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      if (ch === ".") continue;
      const start = c;
      while (row[c + 1] === ch) c++;
      rects.push(
        <rect key={`${r}-${start}`} x={x + start * p} y={y + r * p} width={(c - start + 1) * p} height={p} fill={ch === "o" ? PAPER : undefined} />
      );
    }
  });
  return <>{rects}</>;
}

function SkyTile({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <Sprite rows={CLOUD} x={30} y={24} />
      <Sprite rows={CLOUD} x={360} y={48} />
      <Sprite rows={CLOUD} x={250} y={110} />
    </g>
  );
}

const BIRD_X = 160;
const BIRD_Y = 28;

export function EbFlight() {
  return (
    <svg viewBox="0 0 480 150" aria-hidden focusable="false" shapeRendering="crispEdges" className="block h-auto w-full">
      <g className={`${s.sky} text-subtle`} fill="currentColor" opacity={0.6}>
        <SkyTile x={0} />
        <SkyTile x={TILE} />
      </g>
      <g className={`${s.hop} text-emphasis`} fill="currentColor">
        <g className={s.frameA}><Sprite rows={BIRD_UP} x={BIRD_X} y={BIRD_Y} p={B} /></g>
        <g className={s.frameB}><Sprite rows={BIRD_DOWN} x={BIRD_X} y={BIRD_Y} p={B} /></g>
        {/* The feet hold the top edge of the folder; its tab sits beside the left foot. */}
        <Sprite rows={FOLDER} x={BIRD_X + 2 * B} y={BIRD_Y + 15 * B} p={B} />
      </g>
    </svg>
  );
}
