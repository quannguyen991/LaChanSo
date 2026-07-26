from pathlib import Path

from PIL import Image


SOURCE = Path(r"D:\72594d03-f761-4d25-b1d8-bde38dfeccd1.png")
OUTPUT = Path(__file__).resolve().parents[1] / "public" / "assets"


def crop_webp(image: Image.Image, box: tuple[int, int, int, int], name: str) -> None:
    image.crop(box).save(OUTPUT / name, "WEBP", quality=95, method=6)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    image = Image.open(SOURCE).convert("RGB")

    # Không tái tạo hero: bản cũ nướng chữ vào ảnh (sai tên thương hiệu,
    # nút phóng to chữ vô tác dụng). Hero giờ là HTML thật trong index.html.
    crop_webp(image, (52, 175, 386, 514), "home-couple-reference.webp")
    crop_webp(image, (18, 1304, 340, 1545), "reassurance-reference.webp")
    crop_webp(image, (42, 40, 108, 114), "brand-shield-reference.webp")
    crop_webp(image, (731, 43, 806, 119), "avatar-reference.webp")


if __name__ == "__main__":
    main()
