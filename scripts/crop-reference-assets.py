from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter


SOURCE = Path(r"D:\72594d03-f761-4d25-b1d8-bde38dfeccd1.png")
OUTPUT = Path(__file__).resolve().parents[1] / "public" / "assets"
NEW_REFERENCES = {
    "home_latest": Path(r"C:\Users\admin\AppData\Local\Temp\codex-clipboard-2f7165d2-7ea2-482d-8ace-13671a941744.png"),
    "home": Path(r"D:\ChatGPT Image 14_45_50 27 thg 7, 2026 (1).png"),
    "learn": Path(r"D:\ChatGPT Image 14_45_54 27 thg 7, 2026 (9).png"),
    "history": Path(r"D:\ChatGPT Image 14_45_53 27 thg 7, 2026 (8).png"),
    "emergency": Path(r"D:\ChatGPT Image 14_45_52 27 thg 7, 2026 (6).png"),
    "assistant": Path(r"D:\ChatGPT Image 14_45_53 27 thg 7, 2026 (7).png"),
    "family": Path(r"D:\ChatGPT Image 14_45_54 27 thg 7, 2026 (10).png"),
    "check_latest": Path(r"C:\Users\admin\AppData\Local\Temp\codex-clipboard-c77e85b3-4132-4cad-a38f-6201a6273726.png"),
}
INTRO_REFERENCES = [
    Path(r"D:\ChatGPT Image 17_41_13 27 thg 7, 2026 (1).png"),
    Path(r"D:\ChatGPT Image 17_41_14 27 thg 7, 2026 (3).png"),
    Path(r"D:\ChatGPT Image 17_41_14 27 thg 7, 2026 (2).png"),
    Path(r"D:\ChatGPT Image 17_41_14 27 thg 7, 2026 (4).png"),
    Path(r"D:\ChatGPT Image 17_41_14 27 thg 7, 2026 (5).png"),
]


def crop_webp(image: Image.Image, box: tuple[int, int, int, int], name: str) -> None:
    image.crop(box).save(OUTPUT / name, "WEBP", quality=95, method=6)


def crop_soft_webp(source: Path, box: tuple[int, int, int, int], name: str) -> None:
    crop = Image.open(source).convert("RGBA").crop(box)
    mask = Image.new("L", crop.size, 0)
    draw = ImageDraw.Draw(mask)
    inset = 18
    draw.rounded_rectangle(
        (inset, inset, crop.width - inset, crop.height - inset),
        radius=max(36, min(crop.size) // 7),
        fill=255,
    )
    mask = mask.filter(ImageFilter.GaussianBlur(22))
    crop.putalpha(ImageChops.multiply(crop.getchannel("A"), mask))
    crop.save(OUTPUT / name, "WEBP", quality=94, method=6)


def crop_circle_webp(source: Path, box: tuple[int, int, int, int], name: str) -> None:
    crop = Image.open(source).convert("RGBA").crop(box)
    mask = Image.new("L", crop.size, 0)
    ImageDraw.Draw(mask).ellipse((2, 2, crop.width - 2, crop.height - 2), fill=255)
    crop.putalpha(mask.filter(ImageFilter.GaussianBlur(1.5)))
    crop.save(OUTPUT / name, "WEBP", quality=95, method=6)


def convert_reference_webp(source: Path, name: str) -> None:
    Image.open(source).convert("RGB").save(OUTPUT / name, "WEBP", quality=93, method=6)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    if SOURCE.exists():
        image = Image.open(SOURCE).convert("RGB")
        crop_webp(image, (52, 175, 386, 514), "home-couple-reference.webp")
        crop_webp(image, (18, 1304, 340, 1545), "reassurance-reference.webp")
        crop_webp(image, (42, 40, 108, 114), "brand-shield-reference.webp")
        crop_webp(image, (731, 43, 806, 119), "avatar-reference.webp")

    crop_soft_webp(NEW_REFERENCES["home"], (470, 120, 935, 590), "mascot-home.webp")
    crop_soft_webp(NEW_REFERENCES["learn"], (455, 105, 910, 465), "mascot-learn.webp")
    crop_soft_webp(NEW_REFERENCES["history"], (505, 120, 925, 475), "mascot-history.webp")
    crop_soft_webp(NEW_REFERENCES["emergency"], (455, 250, 935, 700), "mascot-emergency.webp")
    crop_circle_webp(NEW_REFERENCES["assistant"], (35, 175, 215, 355), "mascot-assistant.webp")

    family_source = NEW_REFERENCES["family"]
    crop_circle_webp(family_source, (140, 430, 305, 595), "family-nam.webp")
    crop_circle_webp(family_source, (635, 430, 800, 595), "family-ha.webp")
    crop_circle_webp(family_source, (355, 505, 590, 740), "family-bac.webp")
    crop_circle_webp(family_source, (395, 795, 545, 945), "family-mai.webp")

    latest_home = NEW_REFERENCES["home_latest"]
    crop_webp(Image.open(latest_home).convert("RGB"), (35, 38, 116, 136), "brand-shield-purple.webp")
    crop_circle_webp(latest_home, (72, 884, 268, 1078), "home-family-action.webp")
    crop_soft_webp(latest_home, (72, 1102, 275, 1295), "home-alert-action.webp")
    crop_soft_webp(latest_home, (67, 1320, 210, 1484), "home-siren-action.webp")
    crop_soft_webp(NEW_REFERENCES["check_latest"], (555, 1160, 940, 1550), "mascot-check.webp")

    for index, source in enumerate(INTRO_REFERENCES, start=1):
        convert_reference_webp(source, f"onboarding-reference-{index}.webp")


if __name__ == "__main__":
    main()
