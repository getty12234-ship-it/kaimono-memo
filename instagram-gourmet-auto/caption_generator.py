# キャプション・ハッシュタグ生成モジュール
from templates import HASHTAGS, CTA_BY_AGE, CAPTION_TEMPLATE
import random

class CaptionGenerator:
    """Instagramキャプション・ハッシュタグ自動生成"""

    def __init__(self, food_type: str, age_group: str = "middle"):
        """
        初期化
        Args:
            food_type: テンプレート名（ramen_warm等）
            age_group: 年齢層（young/middle/senior）
        """
        self.food_type = food_type
        self.age_group = age_group

    def generate_hashtags(self, custom_location: str = "", custom_menu: str = "") -> list:
        """
        ハッシュタグ自動生成

        Returns:
            15個のハッシュタグリスト
        """
        if self.food_type not in HASHTAGS:
            return ["#グルメ", "#食べ物"]  # フォールバック

        hashtags_config = HASHTAGS[self.food_type]

        # ビッグワード（2個）
        tags = hashtags_config["big"][:2]

        # ミドルワード（3個）
        tags.extend(hashtags_config["mid"][:3])

        # スモールワード（10個）
        tags.extend(hashtags_config["small"][:10])

        # カスタムハッシュタグ追加（場所・メニュー）
        if custom_location:
            tags.insert(3, f"#{custom_location}")
        if custom_menu:
            tags.insert(4, f"#{custom_menu}")

        return tags[:15]  # 15個に正規化

    def generate_caption(self, shop_name: str, menu_name: str,
                         price: str = "¥1,200", custom_comment: str = "") -> str:
        """
        キャプション生成（80-120字）

        Args:
            shop_name: 店舗名
            menu_name: メニュー名
            price: 価格
            custom_comment: カスタムコメント

        Returns:
            生成されたキャプション
        """
        if custom_comment:
            # カスタムコメント優先
            base_caption = custom_comment
        else:
            # デフォルトテンプレート使用
            base_caption = f"{shop_name}の{menu_name}を食べました。"

        # CTA（Call-to-Action）を追加
        cta = self._select_cta()

        # 絵文字を追加
        emojis = self._select_emojis()

        # キャプション組み立て
        caption = f"{base_caption}\n\n{cta}{emojis}"

        return caption

    def _select_cta(self) -> str:
        """年齢層別CTA選択"""
        cta_list = CTA_BY_AGE.get(self.age_group, CTA_BY_AGE["middle"])
        return random.choice(cta_list)

    def _select_emojis(self) -> str:
        """食べ物別絵文字選択"""
        emoji_map = {
            "ramen_warm": " 🍜 💯 ✨",
            "sweets_white": " 🍰 ❤️ ✨",
            "sushi_petrole": " 🍣 🥢 ✨",
            "luxury_gold": " ✨ 👑 💯",
            "casual_beige": " 🥪 ☕ 💛",
            "vivid_colorful": " 🎨 ✨ 💫",
            "natural_beige": " 🥗 💚 ✨",
            "elegant_dark": " 🍷 ✨ 👑",
            "trend_pastel": " 🩷 💙 ✨",
            "simple_grey": " ✨ 👍 💯",
            "hot_red_black": " 🔥 💯 ✨",
        }
        return emoji_map.get(self.food_type, " ✨ 💯 👍")

    def generate_metadata(self, shop_name: str, menu_name: str,
                         hashtags: list, caption: str) -> dict:
        """
        Instagram投稿用メタデータ生成

        Returns:
            dict: {caption, hashtags, recommended_time, age_group}
        """
        # ハッシュタグ文字列化
        hashtags_str = " ".join(hashtags)

        # キャプション+ハッシュタグ
        full_caption = f"{caption}\n\n{hashtags_str}"

        metadata = {
            "shop_name": shop_name,
            "menu_name": menu_name,
            "caption": caption,
            "hashtags": hashtags,
            "hashtags_str": hashtags_str,
            "full_caption": full_caption,
            "recommended_time": "11:30",  # ランチピーク時
            "age_group": self.age_group,
            "cta_options": CTA_BY_AGE.get(self.age_group, ["推奨CTA"]),
        }

        return metadata
