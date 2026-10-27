"""Compose captioned App Store screenshots (iPhone 6.5" + iPad 13") from simulator captures.

Run: python screenshots/compose_store.py  (raw captures come from screenshots/capture.sh)
"""

from pathlib import Path

from PIL import Image, ImageFont

from compose import BOLD, ROMAN, centered_text, f_center, radial_shade, screen_mask, starfield, with_touch

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw"
OUT = ROOT / "store"
FRAMES = Path.home() / ".koubou/frames/0.18.1"

DEVICES = {
    "iphone": {
        "raw": "iphone",
        "canvas": (1284, 2778),
        "frame": FRAMES / "iPhone 17 - Black - Portrait.png",
        "device_height": 2180,
        "device_top": 540,
        "title_size": 118,
        "sub_size": 54,
        "title_y": 190,
        "sub_y": 350,
    },
    "iphone55": {
        "raw": "iphone",
        "canvas": (1242, 2208),
        "frame": FRAMES / "iPhone 17 - Black - Portrait.png",
        "device_height": 1700,
        "device_top": 445,
        "title_size": 104,
        "sub_size": 48,
        "title_y": 140,
        "sub_y": 285,
    },
    "ipad": {
        "raw": "ipad",
        "canvas": (2048, 2732),
        "frame": FRAMES / 'iPad Air 13" - M2 - Space Gray - Portrait.png',
        "device_height": 2080,
        "device_top": 560,
        "title_size": 150,
        "sub_size": 68,
        "title_y": 180,
        "sub_y": 380,
    },
}

SLIDES = [
    {
        "name": "01-follow",
        "title": "Follow the F",
        "sub": "Put your finger on it. Don't let go.",
        "shots": {"iphone": "idle_04", "ipad": "idle_05"},
    },
    {
        "name": "02-slow",
        "title": "Watch it slow down",
        "sub": "The longer you hold on, the slower it gets.",
        "shots": {"iphone": "hold_11", "ipad": "hold_08"},
        "touch": True,
    },
    {
        "name": "03-focus",
        "title": "Find your focus",
        "sub": "See your focus time, run length and best.",
        "shots": {"iphone": "after_03", "ipad": "after_03"},
    },
    {
        "name": "04-modes",
        "title": "Two ways to play",
        "sub": "Classic hold timer, or Focus with a meter.",
        "shots": {"iphone": "profile", "ipad": "profile"},
    },
    {
        "name": "05-calm",
        "title": "Slow the F down",
        "sub": "A few seconds of calm, any time.",
        "shots": {"iphone": "idle_09", "ipad": "idle_10"},
    },
]


def framed(screen: Image.Image, frame: Image.Image, mask: Image.Image) -> Image.Image:
    box = mask.getbbox()
    shot = screen.convert("RGBA")
    if shot.size != (box[2] - box[0], box[3] - box[1]):
        shot = shot.resize((box[2] - box[0], box[3] - box[1]), Image.LANCZOS)
    placed = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    placed.paste(shot, box[:2])
    out = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    out.paste(placed, (0, 0), mask)
    out.alpha_composite(frame)
    return out


def compose(device: str, slide: dict, frame: Image.Image, mask: Image.Image, seed: int) -> Image.Image:
    spec = DEVICES[device]
    w, h = spec["canvas"]
    canvas = starfield((w, h), (w / 2, h * 0.62), 2200 if spec["raw"] == "ipad" else 1400, seed, 0.45).convert("RGBA")
    canvas.alpha_composite(radial_shade((w, h), (w // 2, spec["sub_y"] - 60), (round(w * 0.75), 520), 235))

    screen = Image.open(RAW / spec["raw"] / f"{slide['shots'][spec['raw']]}.png").convert("RGB")
    if slide.get("touch"):
        screen = with_touch(screen, f_center(screen), radius=round(screen.width * 0.15))
    phone = framed(screen, frame, mask)
    scale = spec["device_height"] / phone.height
    phone = phone.resize((round(phone.width * scale), spec["device_height"]), Image.LANCZOS)
    canvas.alpha_composite(phone, ((w - phone.width) // 2, spec["device_top"]))

    centered_text(canvas, slide["title"], ImageFont.truetype(BOLD, spec["title_size"]), spec["title_y"], (255, 255, 255))
    centered_text(canvas, slide["sub"], ImageFont.truetype(ROMAN, spec["sub_size"]), spec["sub_y"], (255, 255, 255, 200))
    return canvas.convert("RGB")


if __name__ == "__main__":
    for device, spec in DEVICES.items():
        frame = Image.open(spec["frame"]).convert("RGBA")
        mask = screen_mask(frame)
        out_dir = OUT / device
        out_dir.mkdir(parents=True, exist_ok=True)
        for i, slide in enumerate(SLIDES):
            img = compose(device, slide, frame, mask, seed=21 + i)
            path = out_dir / f"{slide['name']}.png"
            img.save(path, optimize=True)
            print(path.relative_to(ROOT), img.size, img.mode, "screen box", mask.getbbox())
