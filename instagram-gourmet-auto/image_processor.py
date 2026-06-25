# 画像処理モジュール
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import cv2
import numpy as np
from typing import Tuple, Optional
from templates import TEMPLATES, FOOD_TO_TEMPLATE, CTA_BY_AGE, HASHTAGS

class ImageProcessor:
    """Instagram グルメ投稿用の画像処理クラス"""

    # Instagram フィード投稿サイズ
    INSTAGRAM_WIDTH = 1080
    INSTAGRAM_HEIGHT = 1350

    def __init__(self, image_path: str):
        """初期化"""
        self.original_image = Image.open(image_path).convert('RGB')
        self.template = None
        self.food_type = None

    def get_dominant_color(self, image: Image.Image, num_colors: int = 3) -> list:
        """画像から支配的な色を抽出（RGB色空間）"""
        img = image.resize((150, 150))
        img_array = np.array(img)

        # K-Meansで支配的な色を検出
        pixels = img_array.reshape((-1, 3))
        pixels = np.float32(pixels)

        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
        _, _, centers = cv2.kmeans(pixels, num_colors, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)

        colors = centers.astype(int)
        return [tuple(color) for color in colors]

    def detect_food_type(self) -> str:
        """食べ物の種類を推測（簡易版：色分析）"""
        colors = self.get_dominant_color(self.original_image, 3)

        # RGB色空間で判定（暖色系 = 暖食系、青系 = 寿司など、白系 = デザート）
        for color in colors:
            r, g, b = color

            # 暖色系（赤・オレンジ・黄）
            if r > 150 and g < 150:
                self.food_type = "ramen_warm"
                return "ラーメン・カレー系"

            # 白系（R,G,B 全て > 200）
            if r > 200 and g > 200 and b > 200:
                self.food_type = "sweets_white"
                return "スイーツ・デザート系"

            # 青系・緑系
            if b > r and b > g:
                self.food_type = "sushi_petrole"
                return "寿司・和食系"

        # デフォルト
        self.food_type = "sweets_white"
        return "汎用系"

    def select_template(self, food_keyword: Optional[str] = None) -> dict:
        """テンプレート選択"""
        # キーワードがあればそちら優先
        if food_keyword:
            # 直接テンプレート名が指定されているか確認
            if food_keyword in TEMPLATES:
                self.template = TEMPLATES[food_keyword]
                self.food_type = food_keyword
                return self.template

            # FOOD_TO_TEMPLATEから検索
            for key, template_name in FOOD_TO_TEMPLATE.items():
                if food_keyword.lower() in key.lower() or key.lower() in food_keyword.lower():
                    self.template = TEMPLATES[template_name]
                    self.food_type = template_name
                    return self.template

        # 食べ物検出結果から選択
        if self.food_type is None:
            self.detect_food_type()

        self.template = TEMPLATES[self.food_type]
        return self.template

    def create_background(self, template: dict) -> Image.Image:
        """推奨色の背景を作成"""
        bg_color = template['bg_color']
        bg_image = Image.new('RGB', (self.INSTAGRAM_WIDTH, self.INSTAGRAM_HEIGHT), bg_color)
        return bg_image

    def resize_and_position_food(self, background: Image.Image) -> Image.Image:
        """食べ物画像をリサイズしてセンター配置"""
        # 元画像のアスペクト比を保持しながらリサイズ
        food_max_width = self.INSTAGRAM_WIDTH - 40  # 左右20px余白
        food_max_height = self.INSTAGRAM_HEIGHT - 300  # 上下テキスト領域

        food_img = self.original_image.copy()
        food_img.thumbnail((food_max_width, food_max_height), Image.Resampling.LANCZOS)

        # センター配置
        x = (self.INSTAGRAM_WIDTH - food_img.width) // 2
        y = 150  # 上部から150pxの位置から開始

        background.paste(food_img, (x, y))
        return background

    def add_text_overlay(self, image: Image.Image, template: dict,
                         shop_name: str = "グルメスポット",
                         menu_name: str = "新作メニュー",
                         price: str = "¥1,200") -> Image.Image:
        """テキスト重ねをする"""
        draw = ImageDraw.Draw(image)

        text_color = template['text_color']
        accent_color = template['accent_color']

        # フォント設定（システムフォント使用）
        try:
            title_font = ImageFont.truetype("C:\\Windows\\Fonts\\meiryo.ttc", 48)
            menu_font = ImageFont.truetype("C:\\Windows\\Fonts\\meiryo.ttc", 36)
            price_font = ImageFont.truetype("C:\\Windows\\Fonts\\meiryo.ttc", 24)
            small_font = ImageFont.truetype("C:\\Windows\\Fonts\\meiryo.ttc", 20)
        except:
            # フォントが見つからない場合はデフォルト
            title_font = ImageFont.load_default()
            menu_font = ImageFont.load_default()
            price_font = ImageFont.load_default()
            small_font = ImageFont.load_default()

        # 上部：店名
        title_y = 20
        draw.text((40, title_y), shop_name, fill=text_color, font=title_font)

        # メニュー名（食べ物上部）
        menu_y = self.INSTAGRAM_HEIGHT // 2 - 50
        draw.text((40, menu_y), menu_name, fill=accent_color, font=menu_font)

        # 右下：価格
        price_x = self.INSTAGRAM_WIDTH - 150
        price_y = self.INSTAGRAM_HEIGHT - 120
        draw.text((price_x, price_y), price, fill=text_color, font=price_font)

        # 右上：「限定」バッジ
        badge_x = self.INSTAGRAM_WIDTH - 120
        badge_y = 20
        badge_width, badge_height = 100, 40
        draw.rectangle(
            [(badge_x, badge_y), (badge_x + badge_width, badge_y + badge_height)],
            fill=accent_color,
            outline=text_color,
            width=2
        )
        draw.text(
            (badge_x + 10, badge_y + 5),
            "◆限定◆",
            fill=text_color,
            font=small_font
        )

        return image

    def apply_filter(self, image: Image.Image, filter_type: str) -> Image.Image:
        """フィルタを適用"""
        if filter_type == "warm_orange":
            # 暖色フィルタ
            enhancer = lambda img: self._warm_filter(img)
        elif filter_type == "cool_neutral":
            enhancer = lambda img: self._cool_filter(img)
        elif filter_type == "soft_warm":
            enhancer = lambda img: self._soft_warm_filter(img)
        elif filter_type == "vivid_bright":
            enhancer = lambda img: self._vivid_filter(img)
        else:
            return image

        return enhancer(image)

    def _warm_filter(self, image: Image.Image) -> Image.Image:
        """暖色フィルタ（食欲増進）"""
        img_array = np.array(image).astype(float)
        img_array[:, :, 0] = np.clip(img_array[:, :, 0] * 1.15, 0, 255)  # 赤強化
        img_array[:, :, 1] = np.clip(img_array[:, :, 1] * 1.08, 0, 255)  # 緑ちょい強化
        return Image.fromarray(img_array.astype(np.uint8))

    def _cool_filter(self, image: Image.Image) -> Image.Image:
        """冷色フィルタ（高級感）"""
        img_array = np.array(image).astype(float)
        img_array[:, :, 2] = np.clip(img_array[:, :, 2] * 1.15, 0, 255)  # 青強化
        img_array[:, :, 0] = np.clip(img_array[:, :, 0] * 0.95, 0, 255)  # 赤削減
        return Image.fromarray(img_array.astype(np.uint8))

    def _soft_warm_filter(self, image: Image.Image) -> Image.Image:
        """柔らかい暖色フィルタ"""
        img_array = np.array(image).astype(float)
        img_array[:, :, 0] = np.clip(img_array[:, :, 0] * 1.1, 0, 255)
        img_array[:, :, 1] = np.clip(img_array[:, :, 1] * 1.05, 0, 255)
        return Image.fromarray(img_array.astype(np.uint8))

    def _vivid_filter(self, image: Image.Image) -> Image.Image:
        """ビビッドなフィルタ"""
        img_array = np.array(image).astype(float)
        img_array[:, :, 0] = np.clip(img_array[:, :, 0] * 1.2, 0, 255)
        img_array[:, :, 1] = np.clip(img_array[:, :, 1] * 1.2, 0, 255)
        img_array[:, :, 2] = np.clip(img_array[:, :, 2] * 1.2, 0, 255)
        return Image.fromarray(img_array.astype(np.uint8))

    def generate_instagram_post(self, shop_name: str = "グルメスポット",
                                 menu_name: str = "新作メニュー",
                                 price: str = "¥1,200",
                                 food_keyword: Optional[str] = None) -> Image.Image:
        """Instagram投稿用デザイン生成（フルパイプライン）"""

        # 1. テンプレート選択
        template = self.select_template(food_keyword)

        # 2. 背景作成
        background = self.create_background(template)

        # 3. 食べ物配置
        composed = self.resize_and_position_food(background)

        # 4. テキスト追加
        with_text = self.add_text_overlay(composed, template, shop_name, menu_name, price)

        # 5. フィルタ適用
        final = self.apply_filter(with_text, template['filter_type'])

        return final

    def save_instagram_post(self, output_path: str, post_image: Image.Image) -> str:
        """Instagram投稿画像をセーブ"""
        post_image.save(output_path, 'PNG', quality=95)
        return output_path
