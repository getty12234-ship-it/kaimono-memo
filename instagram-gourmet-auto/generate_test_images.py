#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
テスト用食べ物画像生成
"""

from PIL import Image, ImageDraw, ImageFilter
import random

def create_test_ramen() -> Image.Image:
    """テスト用ラーメン画像生成"""
    img = Image.new('RGB', (800, 600), color=(200, 100, 50))
    draw = ImageDraw.Draw(img)

    # スープ（円）
    draw.ellipse([100, 150, 700, 500], fill=(139, 69, 19), outline=(101, 67, 33), width=3)

    # 麺（線の束）
    for x in range(200, 600, 20):
        draw.line([(x, 250), (x + 80, 350)], fill=(255, 200, 0), width=3)
        draw.line([(x + 50, 250), (x + 130, 350)], fill=(255, 180, 0), width=3)

    # トッピング（豆板醤的な赤いスポット）
    for _ in range(5):
        x = random.randint(200, 600)
        y = random.randint(250, 400)
        draw.ellipse([x - 20, y - 20, x + 20, y + 20], fill=(220, 20, 60))

    # ぼかしで自然に
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    return img


def create_test_sweets() -> Image.Image:
    """テスト用スイーツ画像生成"""
    img = Image.new('RGB', (800, 600), color=(255, 250, 240))
    draw = ImageDraw.Draw(img)

    # ケーキレイヤー1（下）
    draw.rectangle([150, 300, 650, 380], fill=(210, 105, 30))

    # ケーキレイヤー2（中）
    draw.rectangle([150, 250, 650, 310], fill=(240, 180, 80))

    # ケーキレイヤー3（上）
    draw.rectangle([150, 200, 650, 260], fill=(255, 200, 124))

    # クリーム装飾
    for x in range(170, 630, 50):
        draw.ellipse([x - 15, 180, x + 15, 210], fill=(255, 255, 255))

    # いちご
    draw.ellipse([300, 120, 340, 160], fill=(220, 20, 60))
    draw.ellipse([400, 100, 440, 140], fill=(220, 20, 60))

    img = img.filter(ImageFilter.GaussianBlur(radius=1))
    return img


def create_test_sushi() -> Image.Image:
    """テスト用寿司画像生成"""
    img = Image.new('RGB', (800, 600), color=(200, 200, 200))
    draw = ImageDraw.Draw(img)

    # 寿司ネタ配置
    for i in range(4):
        x = 150 + i * 140
        # シャリ（白い楕円）
        draw.ellipse([x, 200, x + 120, 320], fill=(255, 250, 240))
        # ネタ（上部の色）
        colors = [(255, 100, 100), (220, 180, 80), (100, 150, 200), (200, 100, 150)]
        draw.rectangle([x, 180, x + 120, 220], fill=colors[i])

    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    return img


if __name__ == "__main__":
    print("🍽️  テスト用食べ物画像を生成中...")

    # ラーメン画像生成
    ramen_img = create_test_ramen()
    ramen_img.save("./test_ramen.png")
    print("  ✓ test_ramen.png 生成完了")

    # スイーツ画像生成
    sweets_img = create_test_sweets()
    sweets_img.save("./test_sweets.png")
    print("  ✓ test_sweets.png 生成完了")

    # 寿司画像生成
    sushi_img = create_test_sushi()
    sushi_img.save("./test_sushi.png")
    print("  ✓ test_sushi.png 生成完了")

    print("\n✅ テスト画像生成完了！")
