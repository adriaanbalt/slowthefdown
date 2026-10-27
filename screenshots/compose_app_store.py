"""App Store listing screenshots (Calm-style: headline + device on gradient).

Usage: python3 screenshots/compose_app_store.py
Inputs: screenshots/raw/iphone/*.png, Koubou iPhone 17 frame.
Outputs: screenshots/app-store/iphone/01-*.png … 09-*.png at 1284×2778 (IPHONE_65).
"""

from __future__ import annotations

import math
import random
import textwrap
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw" / "iphone"
OUT = ROOT / "app-store" / "iphone"
FONTS = ROOT.parent / "src" / "assets" / "fonts"
FRAME_PATH = Path.home() / ".koubou/frames/0.18.1/iPhone 17 - Black - Portrait.png"

W, H = 1284, 2778
HOLD_TOUCH = (638, 1405)

BOLD = str(FONTS / "HelveticaNeueLTStd-Bd.otf")
ROMAN = str(FONTS / "HelveticaNeueLTStd-Roman.otf")


def screen_mask(frame: Image.Image) -> Image.Image:
    alpha = frame.getchannel("A").point(lambda a: 255 if a < 128 else 0)
    w, h = frame.size
    ImageDraw.floodfill(alpha, (w // 2, h // 2), 128)
    return alpha.point(lambda v: 255 if v == 128 else 0)


FRAME = Image.open(FRAME_PATH).convert("RGBA")
MASK = screen_mask(FRAME)
SCREEN_BOX = MASK.getbbox()


def framed(name: str, touch: tuple[int, int] | None = None) -> Image.Image:
    shot = Image.open(RAW / f"{name}.png").convert("RGBA")
    if touch:
        overlay = Image.new("RGBA", shot.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(overlay)
        r = 200
        x, y = touch
        d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 255, 255, 22), outline=(255, 255, 255, 160), width=9)
        shot = Image.alpha_composite(shot, overlay)
    l, t, r, b = SCREEN_BOX
    shot = shot.resize((r - l, b - t), Image.LANCZOS)
    phone = Image.new("RGBA", FRAME.size, (0, 0, 0, 0))
    phone.paste(shot, (l, t), MASK.crop(SCREEN_BOX))
    return Image.alpha_composite(phone, FRAME)


def starfield_layer(size: tuple[int, int], center: tuple[float, float], count: int, seed: int, level: float) -> Image.Image:
    s = 2
    w, h = size
    cx, cy = center[0] * s, center[1] * s
    reach = math.hypot(max(center[0], w - center[0]), max(center[1], h - center[1])) * s
    img = Image.new("L", (w * s, h * s), 0)
    d = ImageDraw.Draw(img)
    rng = random.Random(seed)
    for _ in range(count):
        angle = rng.uniform(0, math.tau)
        start = reach * rng.uniform(0.05, 1.0) ** 0.7
        end = start * rng.uniform(1.12, 1.75)
        depth = start / reach
        value = int(255 * level * (0.2 + 0.8 * depth) * rng.uniform(0.35, 1.0))
        width = max(1, round(s * (0.4 + 2.2 * depth * rng.random())))
        dx, dy = math.cos(angle), math.sin(angle)
        d.line((cx + dx * start, cy + dy * start, cx + dx * end, cy + dy * end), fill=value, width=width)
    return img.resize(size, Image.LANCZOS)


def calm_background(seed: int = 3) -> Image.Image:
    """Deep navy gradient + subtle streaks + layered hills (Calm-style marketing)."""
    yy = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    top = np.array([12, 28, 58], dtype=np.float32)
    bottom = np.array([32, 72, 118], dtype=np.float32)
    col = (top * (1 - yy) + bottom * yy).astype(np.uint8)
    rgb = np.tile(col[:, None, :], (1, W, 1))
    base = Image.fromarray(rgb, "RGB").convert("RGBA")

    streaks = starfield_layer((W, H), (W / 2, H * 0.62), 900, seed, 0.22)
    streak_rgb = Image.merge("RGBA", (streaks, streaks, streaks, streaks.point(lambda v: int(v * 0.55))))
    base = Image.alpha_composite(base, streak_rgb)

    hills = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(hills)
    palettes = [(18, 42, 72, 200), (24, 58, 96, 170), (38, 82, 128, 140), (72, 118, 158, 110)]
    for i, color in enumerate(palettes):
        y_base = H - 120 - i * 95
        pts: list[tuple[int, int]] = [(0, H)]
        steps = 14
        for s in range(steps + 1):
            x = int(s * W / steps)
            wave = math.sin(s * 0.9 + i * 0.6) * (55 - i * 8) + math.cos(s * 0.35) * 25
            y = int(y_base + wave)
            pts.append((x, y))
        pts.append((W, H))
        d.polygon(pts, fill=color)

    mist = Image.new("RGBA", (W, H), (180, 210, 235, 0))
    md = ImageDraw.Draw(mist)
    md.rectangle((0, H - 380, W, H), fill=(200, 225, 245, 55))
    hills = Image.alpha_composite(hills, mist.filter(ImageFilter.GaussianBlur(18)))
    return Image.alpha_composite(base, hills)


def draw_headline(canvas: Image.Image, lines: list[str], top: int = 118, size: int = 74, line_gap: int = 18):
    font = ImageFont.truetype(BOLD, size)
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    y = top
    for line in lines:
        l, t, r, b = d.textbbox((0, 0), line, font=font)
        tw = r - l
        d.text(((W - tw) // 2 - l, y - t), line, font=font, fill=(255, 255, 255, 255))
        y += (b - t) + line_gap
    canvas.alpha_composite(layer)


def wrap_headline(text: str, width: int = 22) -> list[str]:
    return textwrap.wrap(text, width=width) or [text]


def place_phone(
    canvas: Image.Image,
    phone: Image.Image,
    cx: int,
    cy: int,
    height: int,
    rotate_deg: float = 0.0,
    dim: float = 1.0,
):
    scale = height / phone.height
    p = phone.resize((round(phone.width * scale), height), Image.LANCZOS)
    if dim < 1.0:
        rgb = p.convert("RGB").point(lambda v: int(v * dim))
        rgb.putalpha(p.getchannel("A"))
        p = rgb
    if rotate_deg:
        p = p.rotate(rotate_deg, resample=Image.BICUBIC, expand=True)
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sa = p.getchannel("A").filter(ImageFilter.GaussianBlur(28))
    shadow.paste((0, 0, 0, 200), (cx - p.width // 2, cy - p.height // 2 + 24), sa)
    canvas.alpha_composite(shadow)
    canvas.alpha_composite(p, (cx - p.width // 2, cy - p.height // 2))


def laurel_stat(canvas: Image.Image, y: int, label: str, value: str):
    font_val = ImageFont.truetype(BOLD, 92)
    font_lab = ImageFont.truetype(ROMAN, 44)
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx = W // 2
    vl, vt, vr, vb = d.textbbox((0, 0), value, font=font_val)
    d.text((cx - (vr - vl) // 2 - vl, y - vt), value, font=font_val, fill=(255, 255, 255, 255))
    ll, lt, lr, lb = d.textbbox((0, 0), label, font=font_lab)
    d.text((cx - (lr - ll) // 2 - ll, y + (vb - vt) + 16 - lt), label, font=font_lab, fill=(255, 255, 255, 190))
    wing = 70
    d.arc((cx - 220 - wing, y - 20, cx - 220 + wing, y + 140), 300, 60, fill=(255, 255, 255, 120), width=4)
    d.arc((cx + 220 - wing, y - 20, cx + 220 + wing, y + 140), 120, 240, fill=(255, 255, 255, 120), width=4)
    canvas.alpha_composite(layer)


@dataclass
class Panel:
    filename: str
    headline: str
    screen: str | None
    touch: tuple[int, int] | None = None
    phone_height: int = 1680
    phone_y: int = 1980
    rotate: float = 0.0
    headline_size: int = 74
    social: bool = False


PANELS: list[Panel] = [
    Panel("01-hero.png", "Join players slowing down worldwide.", "idle_01", phone_height=1620, phone_y=1920, rotate=-9),
    Panel("02-follow.png", "Follow the F with your finger.", "hold_08", touch=HOLD_TOUCH),
    Panel("03-hold.png", "The longer you hold, the slower it gets.", "hold_40", touch=HOLD_TOUCH),
    Panel("04-modes.png", "", None, social=True),
    Panel("05-times.png", "Compete on Slow Down Times.", "times", phone_height=1720, phone_y=2000),
    Panel("06-focus.png", "Classic or Focus — pick your pace.", "profile", phone_height=1720, phone_y=2000),
    Panel("07-slowmo.png", "Watch the streaks crawl to a stop.", "after_01", phone_height=1680, phone_y=1980),
    Panel("08-personal.png", "Track your personal bests.", "idle_12", phone_height=1680, phone_y=1980),
    Panel("09-boards.png", "Sign in. Claim your spot on the board.", "profile", phone_height=1720, phone_y=2000),
]


def render_panel(panel: Panel, seed: int) -> Image.Image:
    canvas = calm_background(seed)
    if panel.social:
        title_font = ImageFont.truetype(BOLD, 88)
        sub_font = ImageFont.truetype(ROMAN, 48)
        layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        title = "Slow the F Down"
        l, t, r, b = d.textbbox((0, 0), title, font=title_font)
        d.text((W // 2 - (r - l) // 2 - l, 520 - t), title, font=title_font, fill=(255, 255, 255, 255))
        tag = "Hold on. Slow it down."
        l2, t2, r2, b2 = d.textbbox((0, 0), tag, font=sub_font)
        d.text((W // 2 - (r2 - l2) // 2 - l2, 640 - t2), tag, font=sub_font, fill=(255, 255, 255, 200))
        canvas.alpha_composite(layer)
        laurel_stat(canvas, 920, "Two play modes", "Classic + Focus")
        laurel_stat(canvas, 1280, "Global boards", "Slow Down Times")
        laurel_stat(canvas, 1640, "Your bests", "Saved on device")
        return canvas.convert("RGB")

    lines = wrap_headline(panel.headline, width=20 if len(panel.headline) > 28 else 24)
    draw_headline(canvas, lines, top=108, size=panel.headline_size)
    phone = framed(panel.screen, panel.touch)
    place_phone(canvas, phone, W // 2, panel.phone_y, panel.phone_height, rotate_deg=panel.rotate)
    return canvas.convert("RGB")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for i, panel in enumerate(PANELS):
        out = OUT / panel.filename
        render_panel(panel, seed=10 + i).save(out, optimize=True)
        im = Image.open(out)
        print(out.name, im.size, im.mode)


if __name__ == "__main__":
    main()
