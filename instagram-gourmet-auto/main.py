#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FoodShot AI - Instagram グルメ投稿自動デザイン化ツール
素の食べ物写真 → バズるInstagram投稿に自動変換
"""

import argparse
import json
import os
from pathlib import Path
from image_processor import ImageProcessor
from caption_generator import CaptionGenerator
from templates import FOOD_TO_TEMPLATE, TEMPLATES


class FoodShotAI:
    """メインパイプライン"""

    def __init__(self):
        self.output_dir = Path("./output")
        self.output_dir.mkdir(exist_ok=True)

    def process(self, image_path: str, shop_name: str, menu_name: str,
                price: str = "¥1,200", food_keyword: str = None,
                age_group: str = "middle", location: str = "") -> dict:
        """
        メインパイプライン：素の写真 → バズデザイン投稿

        Args:
            image_path: 入力画像パス
            shop_name: 店舗名
            menu_name: メニュー名
            price: 価格
            food_keyword: 食べ物キーワード（自動判定する場合は None）
            age_group: 年齢層（young/middle/senior）
            location: 地域名

        Returns:
            dict: {status, image_path, metadata, hashtags, caption}
        """

        print(f"🍽️  FoodShot AI - Instagram グルメ投稿自動デザイン化")
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"📸 入力画像: {image_path}")

        try:
            # ステップ 1: 画像読み込み＆食べ物判定
            print(f"⏳ ステップ1: 画像処理中...")
            processor = ImageProcessor(image_path)
            food_type_detected = processor.detect_food_type()
            print(f"  ✓ 食べ物タイプ: {food_type_detected}")

            # ステップ 2: テンプレート選択＆デザイン生成
            print(f"⏳ ステップ2: テンプレート選択＆デザイン生成中...")
            template = processor.select_template(food_keyword)
            print(f"  ✓ テンプレート: {template['name']}")

            post_image = processor.generate_instagram_post(
                shop_name=shop_name,
                menu_name=menu_name,
                price=price,
                food_keyword=food_keyword
            )
            print(f"  ✓ デザイン生成完了")

            # ステップ 3: ハッシュタグ＆キャプション生成
            print(f"⏳ ステップ3: キャプション＆ハッシュタグ生成中...")
            generator = CaptionGenerator(processor.food_type, age_group)
            hashtags = generator.generate_hashtags(location, menu_name)
            caption = generator.generate_caption(shop_name, menu_name, price)
            metadata = generator.generate_metadata(shop_name, menu_name, hashtags, caption)
            print(f"  ✓ キャプション生成完了")

            # ステップ 4: 画像出力
            print(f"⏳ ステップ4: 画像出力中...")
            output_filename = f"instagram_{shop_name}_{menu_name}.png"
            output_path = self.output_dir / output_filename
            processor.save_instagram_post(str(output_path), post_image)
            print(f"  ✓ 出力済: {output_path}")

            # ステップ 5: メタデータ出力
            metadata_filename = f"metadata_{shop_name}_{menu_name}.json"
            metadata_path = self.output_dir / metadata_filename
            with open(metadata_path, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, ensure_ascii=False, indent=2)
            print(f"  ✓ メタデータ出力済: {metadata_path}")

            print(f"\n✅ 処理完了！")
            print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print(f"📊 結果サマリー")
            print(f"  店舗: {shop_name}")
            print(f"  メニュー: {menu_name}")
            print(f"  テンプレート: {template['name']}")
            print(f"  推奨年齢層: {metadata['age_group']}")
            print(f"  推奨投稿時間: {metadata['recommended_time']}")
            print(f"\n💬 推奨キャプション（100字程度）:")
            print(f"  {caption}")
            print(f"\n#️⃣  推奨ハッシュタグ（15個）:")
            for i, tag in enumerate(hashtags, 1):
                print(f"  {i}. {tag}")

            return {
                "status": "success",
                "image_path": str(output_path),
                "metadata_path": str(metadata_path),
                "metadata": metadata,
                "hashtags": hashtags,
                "caption": caption,
            }

        except FileNotFoundError:
            print(f"❌ エラー: 画像ファイルが見つかりません: {image_path}")
            return {"status": "error", "message": "ファイルが見つかりません"}
        except Exception as e:
            print(f"❌ エラー: {str(e)}")
            return {"status": "error", "message": str(e)}


def main():
    """CLI インターフェース"""
    parser = argparse.ArgumentParser(
        description="FoodShot AI - Instagram グルメ投稿自動デザイン化",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  python main.py image.jpg --shop "〇〇ラーメン" --menu "豚骨ラーメン" --price "¥1,200"
  python main.py image.jpg --shop "〇〇カフェ" --menu "パンケーキ" --keyword "sweets" --age young
        """
    )

    parser.add_argument("image", help="入力画像パス")
    parser.add_argument("--shop", required=True, help="店舗名")
    parser.add_argument("--menu", required=True, help="メニュー名")
    parser.add_argument("--price", default="¥1,200", help="価格（デフォルト: ¥1,200）")
    parser.add_argument("--keyword", default=None, help="食べ物キーワード（自動判定する場合は省略）")
    parser.add_argument("--age", default="middle", choices=["young", "middle", "senior"],
                        help="ターゲット年齢層（young=20-30代, middle=30-40代, senior=40-50代）")
    parser.add_argument("--location", default="", help="地域名")

    args = parser.parse_args()

    # メインパイプライン実行
    ai = FoodShotAI()
    result = ai.process(
        image_path=args.image,
        shop_name=args.shop,
        menu_name=args.menu,
        price=args.price,
        food_keyword=args.keyword,
        age_group=args.age,
        location=args.location
    )

    return result


if __name__ == "__main__":
    main()
