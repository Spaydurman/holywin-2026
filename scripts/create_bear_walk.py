"""Build a small walking sprite while retaining the supplied bear artwork."""

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "bear-stack.png"
OUTPUT = ROOT / "public" / "bear-walk-sprite.png"

original = Image.open(SOURCE).convert("RGBA")
size = original.size

# Each layer uses pixels from the original drawing. The pivot stays under
# Ice Bear's body, while the paws swing in opposite pairs.
legs = [
    ([(98, 512), (135, 512), (135, 591), (97, 591)], (110, 521), 9),
    ([(256, 515), (305, 507), (308, 591), (254, 591)], (277, 522), -9),
    ([(48, 493), (110, 493), (110, 591), (47, 591)], (104, 507), -8),
    ([(207, 505), (267, 505), (267, 591), (205, 591)], (212, 519), 8),
]

base = original.copy()
layers = []
for polygon, pivot, angle in legs:
    mask = Image.new("L", size)
    ImageDraw.Draw(mask).polygon(polygon, fill=255)
    layer = original.copy()
    layer.putalpha(ImageChops.multiply(original.getchannel("A"), mask))
    layers.append((layer, pivot, angle))
    base.putalpha(ImageChops.subtract(base.getchannel("A"), mask))


def pose(direction: int) -> Image.Image:
    frame = base.copy()
    for layer, pivot, angle in layers:
        frame.alpha_composite(
            layer.rotate(direction * angle, Image.Resampling.NEAREST, center=pivot)
        )
    return frame


frames = [original, pose(1), original, pose(-1)]
sprite = Image.new("RGBA", (size[0] * len(frames), size[1]))
for index, frame in enumerate(frames):
    sprite.alpha_composite(frame, (index * size[0], 0))
sprite.save(OUTPUT)
