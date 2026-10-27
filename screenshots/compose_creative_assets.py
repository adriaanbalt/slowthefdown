"""Build App Store creative assets (Product page header + Search results) from simulator screenshots.

Usage: python3 screenshots/compose_creative_assets.py
Inputs: screenshots/raw/*.png (iPhone 17 simulator, 1206x2622), Koubou 0.18.1 iPhone 17 frame.
Outputs: screenshots/creative/header_3840x1646.png, screenshots/creative/search_3840x2560.png
Apple spec: header 21:9 3840x1646, search 3:2 up to 3840x2560, no alpha channel.
"""

import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw"
OUT = ROOT / "creative"
FRAME_PATH = Path.home() / ".koubou/frames/0.18.1/iPhone 17 - Black - Portrait.png"
FONTS = ROOT.parent / "src/assets/fonts"
BOLD = str(FONTS / "HelveticaNeueLTStd-Bd.otf")
ROMAN = str(FONTS / "HelveticaNeueLTStd-Roman.otf")

# Centre of the F glyph in hold_08.png (screenshot pixels); the finger was held here during capture.
HOLD_TOUCH = (638, 1405)


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


def place(canvas: Image.Image, phone: Image.Image, cx: int, cy: int, height: int, dim: float = 1.0):
    w = round(phone.width * height / phone.height)
    p = phone.resize((w, height), Image.LANCZOS)
    if dim < 1.0:
        rgb = p.convert("RGB").point(lambda v: int(v * dim))
        rgb.putalpha(p.getchannel("A"))
        p = rgb
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sa = p.getchannel("A").filter(ImageFilter.GaussianBlur(40))
    shadow.paste((0, 0, 0, 230), (cx - w // 2, cy - height // 2 + 30), sa)
    canvas.alpha_composite(shadow)
    canvas.alpha_composite(p, (cx - w // 2, cy - height // 2))


def starfield(w: int, h: int, cx: float, cy: float, count: int, seed: int) -> Image.Image:
    """Radial warp streaks matching the in-game particle field, drawn at 2x and downsampled."""
    s = 2
    img = Image.new("L", (w * s, h * s), 0)
    d = ImageDraw.Draw(img)
    rng = random.Random(seed)
    reach = math.hypot(max(cx, w - cx), max(cy, h - cy)) * s
    for _ in range(count):
        a = rng.uniform(0, math.tau)
        r0 = reach * rng.uniform(0.04, 1.0) ** 0.8
        length = r0 * rng.uniform(0.15, 0.6)
        r1 = r0 + length
        depth = r0 / reach
        bright = int(40 + 215 * depth * rng.uniform(0.3, 1.0))
        width = max(1, int(s * (0.6 + 3.0 * depth * rng.random())))
        x0, y0 = cx * s + math.cos(a) * r0, cy * s + math.sin(a) * r0
        x1, y1 = cx * s + math.cos(a) * r1, cy * s + math.sin(a) * r1
        d.line((x0, y0, x1, y1), fill=bright, width=width)
    img = img.resize((w, h), Image.LANCZOS)
    return img


def vignette(w: int, h: int, cx: float, cy: float, rx: float, ry: float, strength: float) -> Image.Image:
    """L-mode mask: 255 = darken fully at the ellipse centre, fading to 0 outside."""
    small = Image.new("L", (w // 8, h // 8), 0)
    d = ImageDraw.Draw(small)
    d.ellipse(((cx - rx) / 8, (cy - ry) / 8, (cx + rx) / 8, (cy + ry) / 8), fill=int(255 * strength))
    return small.filter(ImageFilter.GaussianBlur(min(rx, ry) / 8 * 0.6)).resize((w, h), Image.LANCZOS)


def background(w: int, h: int, cx: float, cy: float, count: int, seed: int, level: float) -> Image.Image:
    field = starfield(w, h, cx, cy, count, seed).point(lambda v: int(v * level))
    return Image.merge("RGBA", (field, field, field, Image.new("L", (w, h), 255)))


def darken(canvas: Image.Image, mask: Image.Image):
    black = Image.new("RGBA", canvas.size, (0, 0, 0, 255))
    canvas.paste(black, (0, 0), mask)


def text_center(d: ImageDraw.ImageDraw, cx: int, y: int, text: str, font: ImageFont.FreeTypeFont, fill):
    l, t, r, b = d.textbbox((0, 0), text, font=font)
    d.text((cx - (r - l) / 2 - l, y - t), text, font=font, fill=fill)
    return b - t


def save(canvas: Image.Image, name: str):
    OUT.mkdir(exist_ok=True)
    rgb = canvas.convert("RGB")
    rgb.save(OUT / name, optimize=True)
    print(OUT / name, rgb.size, rgb.mode)


def header():
    W, H = 3840, 1646
    canvas = background(W, H, W / 2, H / 2, 2600, 7, 0.55)
    darken(canvas, vignette(W, H, W / 2, H / 2, 1000, 520, 0.92))

    place(canvas, framed("idle_04"), 260, H // 2 + 40, 1180, dim=0.55)
    place(canvas, framed("idle_10"), W - 260, H // 2 + 40, 1180, dim=0.55)
    place(canvas, framed("hold_08", HOLD_TOUCH), 720, H // 2, 1440)
    place(canvas, framed("idle_01"), W - 720, H // 2, 1440)

    d = ImageDraw.Draw(canvas)
    title = ImageFont.truetype(BOLD, 200)
    tag = ImageFont.truetype(ROMAN, 74)
    title_text, tag_text, gap = "Slow the F Down", "Follow the F. Hold on. Slow it down.", 70
    title_h = d.textbbox((0, 0), title_text, font=title)[3] - d.textbbox((0, 0), title_text, font=title)[1]
    tag_h = d.textbbox((0, 0), tag_text, font=tag)[3] - d.textbbox((0, 0), tag_text, font=tag)[1]
    top = (H - (title_h + gap + tag_h)) // 2
    text_center(d, W // 2, top, title_text, title, (255, 255, 255, 255))
    text_center(d, W // 2, top + title_h + gap, tag_text, tag, (255, 255, 255, 190))
    save(canvas, "header_3840x1646.png")


def search():
    W, H = 3840, 2560
    canvas = background(W, H, W / 2, 1560, 3400, 11, 0.5)
    darken(canvas, vignette(W, H, W / 2, 330, 1700, 360, 0.9))

    phone_h = 1880
    cy = H - 70 - phone_h // 2
    place(canvas, framed("idle_08"), W // 2 - 1080, cy + 60, phone_h - 120)
    place(canvas, framed("idle_12"), W // 2 + 1080, cy + 60, phone_h - 120)
    place(canvas, framed("hold_08", HOLD_TOUCH), W // 2, cy, phone_h)

    d = ImageDraw.Draw(canvas)
    title = ImageFont.truetype(BOLD, 172)
    sub = ImageFont.truetype(ROMAN, 92)
    th = text_center(d, W // 2, 150, "Follow the F with your finger.", title, (255, 255, 255, 255))
    text_center(d, W // 2, 150 + th + 60, "The longer you slow it down, the better.", sub, (255, 255, 255, 200))
    save(canvas, "search_3840x2560.png")


if __name__ == "__main__":
    header()
    search()
