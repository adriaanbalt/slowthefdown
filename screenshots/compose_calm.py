"""Panoramic, gradient-style App Store screenshots (iPhone 6.5" + iPad 13").

Each device set is drawn as one wide panorama and sliced into slides, so the
background and some elements flow across slide edges.

Run: python screenshots/compose_calm.py  (raw captures come from screenshots/capture.sh)
"""

import math
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

from compose import BOLD, ROMAN, f_center, screen_mask, starfield, with_touch

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw"
OUT = ROOT / "store-calm"
FRAMES = Path.home() / ".koubou/frames/0.18.1"
ICON = ROOT.parent / "src" / "assets" / "app-icon.png"

B, R = BOLD, ROMAN

DEVICES = {
    "iphone": {
        "raw": "iphone",
        "size": (1284, 2778),
        "frame": FRAMES / "iPhone 17 - Black - Portrait.png",
        "device_h": 0.74,
        "font": 0.074,
        "caption_top": 0.055,
        "badge": 0.36,
        "shots": {"idle_a": "idle_04", "idle_b": "idle_05", "hold": "hold_11", "run": "after_03", "profile": "profile"},
    },
    "ipad": {
        "raw": "ipad",
        "size": (2048, 2732),
        "frame": FRAMES / 'iPad Air 13" - M2 - Space Gray - Portrait.png',
        "device_h": 0.68,
        "font": 0.06,
        "caption_top": 0.05,
        "badge": 0.27,
        "shots": {"idle_a": "idle_05", "idle_b": "idle_10", "hold": "hold_08", "run": "after_03", "profile": "profile"},
    },
}

# Positions are in slide widths (x) and canvas heights (y); x=1.5 is the middle of slide 2.
SLIDES = [
    {
        "name": "01-slow-down",
        "caption": [[("Slow the F down", B)], [("and ", R), ("catch your breath", B)]],
        "device": {"shot": "idle_a", "x": 0.5, "y": 0.71, "rot": -7},
    },
    {
        "name": "02-follow",
        "caption": [[("Follow the F", B)], [("with ", R), ("one finger", B)]],
        "device": {"shot": "idle_b", "x": 1.46, "y": 0.72, "rot": 6},
    },
    {
        "name": "03-hold",
        "caption": [[("Hold on", B), (" and", R)], [("watch it ", R), ("slow down", B)]],
        "device": {"shot": "hold", "x": 2.54, "y": 0.71, "rot": -3, "touch": True},
    },
    {
        "name": "04-brand",
        "caption": [[("Take a breath with", R)]],
        "brand": True,
    },
    {
        "name": "05-focus",
        "caption": [[("Find your ", R), ("focus", B)], [("one hold ", R), ("at a time", B)]],
        "device": {"shot": "run", "x": 4.5, "y": 0.71, "rot": 5},
    },
    {
        "name": "06-modes",
        "caption": [[("Classic", B), (" or ", R), ("Focus", B)], [("play ", R), ("your way", B)]],
        "device": {"shot": "profile", "x": 5.5, "y": 0.71, "rot": -5},
    },
]

BADGE = {"x": 1.97, "y": 0.43}
LAURELS = [("1", "finger to play"), ("2", "game modes"), ("0", "sign-ups needed")]


def lerp(a, b, t):
    return a + (b - a) * t


def background(w: int, h: int, seed: int) -> Image.Image:
    """Periwinkle sky fading into deep indigo, drifting in hue across the panorama."""
    x = np.linspace(0, 1, w)[None, :, None]
    y = np.linspace(0, 1, h)[:, None, None]
    top_a, top_b = np.array([122, 138, 255]), np.array([140, 116, 250])
    mid_a, mid_b = np.array([62, 78, 222]), np.array([84, 64, 214])
    low_a, low_b = np.array([14, 18, 74]), np.array([24, 14, 78])
    wave = 0.5 + 0.5 * np.sin(x * math.tau * 1.5)
    top, mid, low = lerp(top_a, top_b, wave), lerp(mid_a, mid_b, wave), lerp(low_a, low_b, wave)
    t1 = np.clip(y / 0.45, 0, 1)
    t2 = np.clip((y - 0.45) / 0.55, 0, 1) ** 0.9
    rgb = np.where(y < 0.45, lerp(top, mid, t1), lerp(mid, low, t2))
    img = Image.fromarray(np.broadcast_to(rgb, (h, w, 3)).astype(np.uint8), "RGB").convert("RGBA")

    # Soft glowing clouds, drawn small and blurred up.
    q = 8
    clouds = Image.new("L", (w // q, h // q), 0)
    d = ImageDraw.Draw(clouds)
    rng = random.Random(seed)
    for _ in range(int(w / h * 9)):
        cx, cy = rng.uniform(0, w / q), rng.uniform(0.35, 1.0) * h / q
        rx, ry = rng.uniform(0.12, 0.3) * h / q, rng.uniform(0.03, 0.07) * h / q
        d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=rng.randint(40, 90))
    clouds = clouds.filter(ImageFilter.GaussianBlur(h / q * 0.03)).resize((w, h), Image.BICUBIC)
    glow = Image.new("RGBA", (w, h), (225, 228, 255, 0))
    glow.putalpha(clouds)
    img.alpha_composite(glow)
    return img


def add_streaks(canvas: Image.Image, slide_w: int, seed: int):
    """Faint warp streaks behind each slide, echoing the in-game starfield."""
    h = canvas.height
    layer = Image.new("RGB", canvas.size, (0, 0, 0))
    for i in range(canvas.width // slide_w):
        field = starfield((slide_w, h), (slide_w / 2, h * 0.62), 700, seed + i, 0.38)
        layer.paste(field, (i * slide_w, 0))
    rgb = ImageChops.screen(canvas.convert("RGB"), layer)
    canvas.paste(rgb.convert("RGBA"))


def framed(screen: Image.Image, frame: Image.Image, mask: Image.Image) -> Image.Image:
    box = mask.getbbox()
    shot = screen.convert("RGBA").resize((box[2] - box[0], box[3] - box[1]), Image.LANCZOS)
    placed = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    placed.paste(shot, box[:2])
    out = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    out.paste(placed, (0, 0), mask)
    out.alpha_composite(frame)
    return out


def drop_shadow(canvas: Image.Image, item: Image.Image, pos: tuple[int, int], blur: int, offset: int, opacity: float):
    alpha = item.getchannel("A").point(lambda v: int(v * opacity))
    shadow = Image.new("RGBA", item.size, (6, 8, 40, 0))
    shadow.putalpha(alpha)
    pad = blur * 3
    padded = Image.new("RGBA", (item.width + pad * 2, item.height + pad * 2), (0, 0, 0, 0))
    padded.paste(shadow, (pad, pad))
    padded = padded.filter(ImageFilter.GaussianBlur(blur))
    composite(canvas, padded, (pos[0] - pad, pos[1] - pad + offset))


def composite(canvas: Image.Image, item: Image.Image, pos: tuple[int, int]):
    """alpha_composite that tolerates items hanging off the canvas edges."""
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    layer.paste(item, pos)
    canvas.alpha_composite(layer)


def paste_centered(canvas: Image.Image, item: Image.Image, center: tuple[float, float], shadow: bool = True):
    pos = (round(center[0] - item.width / 2), round(center[1] - item.height / 2))
    if shadow:
        drop_shadow(canvas, item, pos, blur=max(20, item.width // 25), offset=item.width // 30, opacity=0.55)
    composite(canvas, item, pos)


def rich_line(canvas: Image.Image, segments, size: int, center_x: float, baseline: int, fill=(255, 255, 255, 255)):
    fonts = [ImageFont.truetype(face, size) for _, face in segments]
    widths = [f.getlength(text) for (text, _), f in zip(segments, fonts)]
    x = center_x - sum(widths) / 2
    d = ImageDraw.Draw(canvas)
    for (text, _), f, wdt in zip(segments, fonts, widths):
        d.text((x, baseline), text, font=f, fill=fill, anchor="ls")
        x += wdt


def badge(screen: Image.Image, diameter: int) -> Image.Image:
    """Circular close-up of the F under a finger, with a white rim."""
    cx, cy = f_center(screen)
    r = round(screen.width * 0.2)
    touched = with_touch(screen, (cx, cy), radius=round(screen.width * 0.13))
    crop = touched.crop((cx - r, cy - r, cx + r, cy + r)).resize((diameter, diameter), Image.LANCZOS).convert("RGBA")
    s = 3
    mask = Image.new("L", (diameter * s, diameter * s), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, diameter * s - 1, diameter * s - 1), fill=255)
    mask = mask.resize((diameter, diameter), Image.LANCZOS)
    out = Image.new("RGBA", (diameter, diameter), (0, 0, 0, 0))
    out.paste(crop, (0, 0), mask)
    rim = Image.new("RGBA", (diameter * s, diameter * s), (0, 0, 0, 0))
    ImageDraw.Draw(rim).ellipse((0, 0, diameter * s - 1, diameter * s - 1), outline=(255, 255, 255, 255), width=round(diameter * s * 0.022))
    out.alpha_composite(rim.resize((diameter, diameter), Image.LANCZOS))
    return out


def rounded_icon(size: int) -> Image.Image:
    icon = Image.open(ICON).convert("RGBA").resize((size, size), Image.LANCZOS)
    s = 3
    mask = Image.new("L", (size * s, size * s), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size * s - 1, size * s - 1), radius=round(size * s * 0.2237), fill=255)
    icon.putalpha(mask.resize((size, size), Image.LANCZOS))
    return icon


def leaf(length: float, width: float) -> list[tuple[float, float]]:
    pts = []
    for i in range(21):
        t = i / 20
        pts.append((t * length, math.sin(t * math.pi) * width / 2))
    for i in range(20, -1, -1):
        t = i / 20
        pts.append((t * length, -math.sin(t * math.pi) * width / 2))
    return pts


def laurel(width: int, number: str, label: str) -> Image.Image:
    """Two leafy branches curving up around a big number and a short label."""
    s = 3
    w, h = width * s, round(width * 0.6) * s
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx, cy, rx, ry = w / 2, h * 0.47, w * 0.42, h * 0.43
    leaf_len, leaf_w = h * 0.16, h * 0.062

    def point(theta: float) -> tuple[float, float]:
        return cx + rx * math.cos(theta), cy + ry * math.sin(theta)

    for start, end in ((100, 238), (80, -58)):
        stem = [point(math.radians(lerp(start, end, i / 40))) for i in range(41)]
        d.line(stem, fill=(255, 255, 255, 235), width=round(h * 0.012))
        for i in range(11):
            t = i / 10
            theta = math.radians(lerp(start, end, t))
            px, py = point(theta)
            nx, ny = point(math.radians(lerp(start, end, t + 0.01)))
            tx, ty = nx - px, ny - py
            tl = math.hypot(tx, ty)
            tx, ty = tx / tl, ty / tl
            ox, oy = px - cx, py - cy
            ol = math.hypot(ox, oy)
            ox, oy = ox / ol, oy / ol
            size = 1 - 0.4 * t
            for side in (1, -1):
                spread = math.radians(42 if side > 0 else 30)
                dx, dy = tx * math.cos(spread) + side * ox * math.sin(spread), ty * math.cos(spread) + side * oy * math.sin(spread)
                ang = math.atan2(dy, dx)
                poly = [
                    (px + lx * math.cos(ang) - ly * math.sin(ang), py + lx * math.sin(ang) + ly * math.cos(ang))
                    for lx, ly in leaf(leaf_len * size * (1 if side > 0 else 0.8), leaf_w * size)
                ]
                d.polygon(poly, fill=(255, 255, 255, 240))
    big = ImageFont.truetype(BOLD, round(h * 0.40))
    small = ImageFont.truetype(ROMAN, round(h * 0.105))
    d.text((cx, cy + h * 0.10), number, font=big, fill=(255, 255, 255, 255), anchor="ms")
    d.text((cx, cy + h * 0.26), label, font=small, fill=(255, 255, 255, 235), anchor="ms")
    return img.resize((width, round(width * 0.6)), Image.LANCZOS)


def render(device: str):
    spec = DEVICES[device]
    sw, sh = spec["size"]
    pano = background(sw * len(SLIDES), sh, seed=5)
    add_streaks(pano, sw, seed=40)

    frame = Image.open(spec["frame"]).convert("RGBA")
    mask = screen_mask(frame)
    raw = RAW / spec["raw"]

    def shot(key: str) -> Image.Image:
        return Image.open(raw / f"{spec['shots'][key]}.png").convert("RGB")

    for slide in SLIDES:
        dev = slide.get("device")
        if not dev:
            continue
        screen = shot(dev["shot"])
        if dev.get("touch"):
            screen = with_touch(screen, f_center(screen), radius=round(screen.width * 0.15))
        phone = framed(screen, frame, mask)
        height = round(sh * spec["device_h"])
        phone = phone.resize((round(phone.width * height / phone.height), height), Image.LANCZOS)
        phone = phone.rotate(dev["rot"], resample=Image.BICUBIC, expand=True)
        paste_centered(pano, phone, (dev["x"] * sw, dev["y"] * sh))

    paste_centered(pano, badge(shot("hold"), round(sw * spec["badge"])), (BADGE["x"] * sw, BADGE["y"] * sh))

    brand_i = next(i for i, s in enumerate(SLIDES) if s.get("brand"))
    bx = (brand_i + 0.5) * sw
    icon = rounded_icon(round(sh * 0.14))
    paste_centered(pano, icon, (bx, sh * 0.255))
    rich_line(pano, [("Slow the F Down", B)], round(sh * 0.036), bx, round(sh * 0.39))
    for i, (num, label) in enumerate(LAURELS):
        wreath = laurel(round(sh * 0.25), num, label)
        paste_centered(pano, wreath, (bx, sh * (0.53 + i * 0.155)), shadow=False)

    size = round(sw * spec["font"])
    for i, slide in enumerate(SLIDES):
        top = round(sh * spec["caption_top"])
        for j, line in enumerate(slide["caption"]):
            rich_line(pano, line, size, (i + 0.5) * sw, top + size + round(j * size * 1.22))

    out_dir = OUT / device
    out_dir.mkdir(parents=True, exist_ok=True)
    for i, slide in enumerate(SLIDES):
        img = pano.crop((i * sw, 0, (i + 1) * sw, sh)).convert("RGB")
        img.save(out_dir / f"{slide['name']}.png", optimize=True)
        print(f"{device}/{slide['name']}.png", img.size)


if __name__ == "__main__":
    for device in DEVICES:
        render(device)
