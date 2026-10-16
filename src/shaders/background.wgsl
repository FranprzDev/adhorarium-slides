// Animated deck background: a slow domain-warped flow in ink navy with brass glints,
// over a faint timetable grid whose cells light up like booked time slots.
// `mode` blends from the dark hero look (0.0) to the light paper look (1.0).

struct Params {
  time: f32,
  width: f32,
  height: f32,
  mode: f32,
}

@group(0) @binding(0) var<uniform> params: Params;

const NAVY_DEEP = vec3f(0.031, 0.071, 0.137);
const NAVY = vec3f(0.075, 0.161, 0.294);
const BRASS = vec3f(0.788, 0.592, 0.247);
const PAPER = vec3f(0.969, 0.957, 0.925);
const PAPER_WARM = vec3f(0.945, 0.925, 0.878);

fn hash21(p: vec2f) -> f32 {
  let q = fract(p * vec2f(123.34, 456.21));
  let r = q + dot(q, q + 45.32);
  return fract(r.x * r.y);
}

fn valueNoise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash21(i);
  let b = hash21(i + vec2f(1.0, 0.0));
  let c = hash21(i + vec2f(0.0, 1.0));
  let d = hash21(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm(p: vec2f) -> f32 {
  var value = 0.0;
  var amplitude = 0.5;
  var point = p;
  for (var octave = 0; octave < 5; octave = octave + 1) {
    value = value + amplitude * valueNoise(point);
    point = point * 2.03 + vec2f(17.1, 9.2);
    amplitude = amplitude * 0.5;
  }
  return value;
}

// Distance-based line mask for a grid of square cells of `cell` size.
fn gridLines(p: vec2f, cell: f32, thickness: f32) -> f32 {
  let g = abs(fract(p / cell - 0.5) - 0.5) * cell;
  let d = min(g.x, g.y);
  return 1.0 - smoothstep(0.0, thickness, d);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = params.width / max(params.height, 1.0);
  let p = vec2f(uv.x * aspect, uv.y);
  let t = params.time;

  // Domain-warped flow field.
  let q = vec2f(fbm(p * 1.4 + vec2f(0.0, t * 0.035)), fbm(p * 1.4 + vec2f(5.2, -t * 0.03)));
  let r = fbm(p * 1.6 + q * 3.2 + vec2f(t * 0.02, 1.7));

  // Timetable grid with slots that glow on and off.
  let cell = 0.085;
  let lines = gridLines(p, cell, 0.0016);
  let cellId = floor(p / cell);
  let pulse = 0.5 + 0.5 * sin(t * 0.45 + hash21(cellId) * 6.2831);
  let lit = step(0.93, hash21(cellId + vec2f(3.0, 7.0))) * smoothstep(0.55, 1.0, pulse);
  let inCell = abs(fract(p / cell) - 0.5) * 2.0;
  let box = max(inCell.x, inCell.y);
  let slotFill = (1.0 - smoothstep(0.8, 0.84, box)) * lit;
  let slotRing = slotFill * smoothstep(0.68, 0.8, box);

  // Dark hero look.
  var dark = mix(NAVY_DEEP, NAVY, smoothstep(0.25, 0.85, r));
  let glint = pow(smoothstep(0.58, 0.95, r * (0.6 + q.x)), 2.0);
  dark = dark + BRASS * glint * 0.75;
  dark = dark + vec3f(0.85, 0.88, 0.95) * lines * 0.045;
  dark = dark + BRASS * (slotFill * 0.06 + slotRing * 0.2);
  let centered = uv - vec2f(0.5, 0.5);
  let vignette = 1.0 - dot(centered, centered) * 0.9;
  dark = dark * vignette;

  // Light paper look: barely-there brass flow and navy grid so text stays crisp.
  var light = mix(PAPER, PAPER_WARM, smoothstep(0.35, 0.9, r) * 0.55);
  light = mix(light, BRASS, glint * 0.07);
  light = mix(light, NAVY, lines * 0.035);
  light = mix(light, BRASS, slotFill * 0.035 + slotRing * 0.09);

  let color = mix(dark, light, clamp(params.mode, 0.0, 1.0));
  return vec4f(color, 1.0);
}
