"""Compose App Store creative assets (product page header + search results) from simulator screenshots.

Run: python screenshots/compose.py  (needs Pillow + numpy; frames from `kou setup-frames`)
"""

import math
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw" / "iphone"
OUT = ROOT / "creative"
FONTS = ROOT.parent / "src" / "assets" / "fonts"
FRAME_PATH = Path.home() / ".koubou/frames/0.18.1/iPhone 17 - Black - Portrait.png"

SCREEN_OFFSET = (72, 69)

BOLD = str(FONTS / "HelveticaNeueLTStd-Bd.otf")
ROMAN = str(FONTS / "HelveticaNeueLTStd-Roman.otf")


def load_screen(name: str) -> Image.Image:
    return Image.open(RAW / f"{name}.png").convert("RGB")


def f_center(screen: Image.Image) -> tuple[int, int]:
    """Centre of the solid white F, ignoring the HUD and tab bar."""
    w, h = screen.size
    top, bottom = round(h * 0.15), round(h * 0.85)
    band = screen.convert("L").crop((0, top, w, bottom))
    core = band.point(lambda v: 255 if v > 200 else 0).filter(ImageFilter.MinFilter(21))
    l, t, r, b = core.getbbox()
    return (l + r) // 2, top + (t + b) // 2


def holding(name: str) -> Image.Image:
    screen = load_screen(name)
    return with_touch(screen, f_center(screen))


def screen_mask(frame: Image.Image) -> Image.Image:
    """Transparent region connected to the frame centre = visible screen."""
    alpha = np.array(frame)[:, :, 3]
    seed = Image.fromarray(np.where(alpha < 10, 255, 0).astype(np.uint8), "L").copy()
    w, h = seed.size
    ImageDraw.floodfill(seed, (w // 2, h // 2), 128)
    return Image.fromarray(np.where(np.array(seed) == 128, 255, 0).astype(np.uint8), "L")


FRAME = Image.open(FRAME_PATH).convert("RGBA")
MASK = screen_mask(FRAME)


def framed(screen: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", FRAME.size, (0, 0, 0, 0))
    placed = Image.new("RGBA", FRAME.size, (0, 0, 0, 0))
    placed.paste(screen.convert("RGBA"), SCREEN_OFFSET)
    canvas.paste(placed, (0, 0), MASK)
    canvas.alpha_composite(FRAME)
    return canvas


def with_touch(screen: Image.Image, center: tuple[int, int], radius: int = 180) -> Image.Image:
    base = screen.convert("RGBA")
    glow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    x, y = center
    ImageDraw.Draw(glow).ellipse((x - radius, y - radius, x + radius, y + radius), outline=(255, 255, 255, 140), width=28)
    base.alpha_composite(glow.filter(ImageFilter.GaussianBlur(14)))
    ring = Image.new("RGBA", base.size, (0, 0, 0, 0))
    ImageDraw.Draw(ring).ellipse((x - radius, y - radius, x + radius, y + radius), outline=(255, 255, 255, 235), width=9)
    base.alpha_composite(ring)
    return base.convert("RGB")


def starfield(size: tuple[int, int], center: tuple[float, float], count: int, seed: int, level: float) -> Image.Image:
    """Radial warp streaks in the style of the in-game particle field, supersampled 2x."""
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
        end = start * rng.uniform(1.15, 1.8)
        depth = start / reach
        value = int(255 * level * (0.25 + 0.75 * depth) * rng.uniform(0.4, 1.0))
        width = max(1, round(s * (0.5 + 2.5 * depth * rng.random())))
        dx, dy = math.cos(angle), math.sin(angle)
        d.line((cx + dx * start, cy + dy * start, cx + dx * end, cy + dy * end), fill=value, width=width)
    return img.resize(size, Image.LANCZOS).convert("RGB")


def radial_shade(size: tuple[int, int], center: tuple[int, int], radius: tuple[int, int], strength: int) -> Image.Image:
    """Black overlay, opaque at `center`, fading out at `radius`."""
    w, h = size
    yy, xx = np.mgrid[0:h, 0:w]
    dist = np.sqrt(((xx - center[0]) / radius[0]) ** 2 + ((yy - center[1]) / radius[1]) ** 2)
    alpha = np.clip(1 - dist, 0, 1) ** 1.5 * strength
    layer = np.zeros((h, w, 4), dtype=np.uint8)
    layer[:, :, 3] = alpha.astype(np.uint8)
    return Image.fromarray(layer, "RGBA")


def paste_phone(canvas: Image.Image, phone: Image.Image, height: int, center: tuple[int, int], dim: float = 1.0):
    scale = height / phone.height
    p = phone.resize((round(phone.width * scale), height), Image.LANCZOS)
    if dim < 1:
        r, g, b, a = p.split()
        rgb = ImageEnhance.Brightness(Image.merge("RGB", (r, g, b))).enhance(dim)
        p = Image.merge("RGBA", (*rgb.split(), a))
    canvas.alpha_composite(p, (center[0] - p.width // 2, center[1] - p.height // 2))


def centered_text(canvas: Image.Image, text: str, font: ImageFont.FreeTypeFont, y: int, fill):
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    left, top, right, bottom = d.textbbox((0, 0), text, font=font)
    d.text(((canvas.width - (right - left)) // 2 - left, y - top), text, font=font, fill=fill)
    canvas.alpha_composite(layer)


def header():
    size = (3840, 1646)
    canvas = starfield(size, (1920, 823), 2600, 7, 0.6).convert("RGBA")
    canvas.alpha_composite(radial_shade(size, (1920, 823), (1300, 760), 235))

    paste_phone(canvas, framed(load_screen("idle_02")), 1180, (300, 823), dim=0.55)
    paste_phone(canvas, framed(load_screen("idle_04")), 1420, (760, 823))
    paste_phone(canvas, framed(load_screen("idle_10")), 1180, (3540, 823), dim=0.55)
    paste_phone(canvas, framed(holding("hold_11")), 1420, (3080, 823))

    centered_text(canvas, "Slow the F Down", ImageFont.truetype(BOLD, 172), 700, (255, 255, 255))
    centered_text(canvas, "Follow the F. Hold on. Slow it down.", ImageFont.truetype(ROMAN, 62), 918, (255, 255, 255, 190))
    return canvas.convert("RGB")


def search_results():
    size = (3840, 2560)
    canvas = starfield(size, (1920, 1500), 3400, 11, 0.55).convert("RGBA")
    canvas.alpha_composite(radial_shade(size, (1920, 330), (2400, 700), 220))

    side_h, center_h = 1780, 1940
    bottom = 2480
    paste_phone(canvas, framed(load_screen("idle_05")), side_h, (1920 - 1090, bottom - side_h // 2))
    paste_phone(canvas, framed(load_screen("idle_09")), side_h, (1920 + 1090, bottom - side_h // 2))
    paste_phone(canvas, framed(holding("hold_11")), center_h, (1920, bottom - center_h // 2))

    centered_text(canvas, "Follow the F with your finger.", ImageFont.truetype(BOLD, 150), 150, (255, 255, 255))
    centered_text(canvas, "The longer you hold on, the slower it gets.", ImageFont.truetype(ROMAN, 86), 360, (255, 255, 255, 200))
    return canvas.convert("RGB")


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    header().save(OUT / "header-3840x1646.png", optimize=True)
    search_results().save(OUT / "search-results-3840x2560.png", optimize=True)
    for f in sorted(OUT.glob("*.png")):
        im = Image.open(f)
        print(f.name, im.size, im.mode)
