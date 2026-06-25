# テンプレート定義（11パターン）
TEMPLATES = {
    # 1. ラゴス（暖オレンジ）
    "ramen_warm": {
        "name": "ラゴス（暖オレンジ）",
        "bg_color": (245, 222, 179),  # #F5DEB3
        "text_color": (101, 67, 33),  # 濃茶
        "accent_color": (210, 105, 30),  # 暖オレンジ
        "food_types": ["ラーメン", "カレー", "丼", "パスタ"],
        "target_age": "20-40代",
        "font_style": "gothic",  # ゴシック
        "filter_type": "warm_orange",
    },

    # 2. スイートホワイト
    "sweets_white": {
        "name": "スイートホワイト",
        "bg_color": (255, 255, 255),  # #FFFFFF
        "text_color": (0, 0, 0),  # 黒
        "accent_color": (212, 175, 55),  # ゴールド
        "food_types": ["スイーツ", "デザート", "カフェ", "ケーキ"],
        "target_age": "20-50代",
        "font_style": "serif",  # 明朝
        "filter_type": "soft_neutral",
    },

    # 3. シックペトロール
    "sushi_petrole": {
        "name": "シックペトロール",
        "bg_color": (255, 255, 255),  # #FFFFFF
        "text_color": (27, 77, 77),  # #1B4D4D ペトロール
        "accent_color": (212, 175, 55),  # ゴールド
        "food_types": ["寿司", "和食", "シーフード", "刺身"],
        "target_age": "40-50代",
        "font_style": "serif",  # 明朝
        "filter_type": "cool_neutral",
    },

    # 4. ラグジュアリーゴールド
    "luxury_gold": {
        "name": "ラグジュアリーゴールド",
        "bg_color": (44, 44, 44),  # #2C2C2C 深黒
        "text_color": (212, 175, 55),  # ゴールド
        "accent_color": (255, 255, 255),  # 白
        "food_types": ["懐石", "フレンチ", "フルコース", "高級和食"],
        "target_age": "40-50代",
        "font_style": "serif",  # 明朝
        "filter_type": "dark_elegant",
    },

    # 5. カジュアルベージュ
    "casual_beige": {
        "name": "カジュアルベージュ",
        "bg_color": (255, 248, 240),  # #FFF8F0
        "text_color": (25, 77, 77),  # 濃紺
        "accent_color": (210, 180, 140),  # 淡ベージュ
        "food_types": ["朝食", "サンドイッチ", "軽食", "パン"],
        "target_age": "30-50代",
        "font_style": "serif",  # 明朝
        "filter_type": "soft_warm",
    },

    # 6. ビビッドカラフル
    "vivid_colorful": {
        "name": "ビビッドカラフル",
        "bg_color": (255, 200, 124),  # RGB系ビビッド
        "text_color": (255, 255, 255),  # 白
        "accent_color": (0, 0, 0),  # 黒
        "food_types": ["かき氷", "スムージー", "ドリンク", "Chaos Cake"],
        "target_age": "20-30代",
        "font_style": "gothic",  # ゴシック
        "filter_type": "vivid_bright",
    },

    # 7. ナチュラルベージュ
    "natural_beige": {
        "name": "ナチュラルベージュ",
        "bg_color": (245, 230, 211),  # #F5E6D3
        "text_color": (101, 67, 33),  # 濃茶
        "accent_color": (210, 180, 140),  # ベージュ
        "food_types": ["オーガニック", "サラダ", "ヘルシー飯", "野菜"],
        "target_age": "30-50代",
        "font_style": "serif",  # 明朝
        "filter_type": "warm_natural",
    },

    # 8. エレガント深紫
    "elegant_dark": {
        "name": "エレガント深紫",
        "bg_color": (62, 39, 35),  # #3E2723 深茶
        "text_color": (212, 175, 55),  # ゴールド
        "accent_color": (255, 255, 255),  # 白
        "food_types": ["イタリアン", "ワイン", "チーズ", "高級洋食"],
        "target_age": "40-50代",
        "font_style": "serif",  # 明朝
        "filter_type": "dark_elegant",
    },

    # 9. トレンドパステル
    "trend_pastel": {
        "name": "トレンドパステル",
        "bg_color": (255, 182, 193),  # 淡ピンク
        "text_color": (25, 77, 77),  # 濃紺
        "accent_color": (173, 216, 230),  # 淡青
        "food_types": ["インスタ映え", "カフェラテ", "マカロン", "ドーナツ"],
        "target_age": "20-30代",
        "font_style": "gothic",  # ゴシック
        "filter_type": "pastel_soft",
    },

    # 10. シンプルグレー
    "simple_grey": {
        "name": "シンプルグレー",
        "bg_color": (232, 232, 232),  # #E8E8E8
        "text_color": (0, 0, 0),  # 黒
        "accent_color": (25, 77, 77),  # 濃紺
        "food_types": ["モダン", "ミニマル", "フュージョン", "モダン和食"],
        "target_age": "30-50代",
        "font_style": "gothic",  # ゴシック
        "filter_type": "neutral_grey",
    },

    # 11. ホットドレッドブラック
    "hot_red_black": {
        "name": "ホットドレッドブラック",
        "bg_color": (26, 26, 26),  # #1A1A1A 黒
        "text_color": (255, 255, 255),  # 白
        "accent_color": (220, 20, 60),  # 深赤
        "food_types": ["激辛", "エスニック", "スパイシー", "タイ料理"],
        "target_age": "20-40代",
        "font_style": "gothic",  # ゴシック
        "filter_type": "hot_red",
    },
}

# 食べ物種別 -> テンプレート自動マッピング
FOOD_TO_TEMPLATE = {
    "ラーメン": "ramen_warm",
    "うどん": "ramen_warm",
    "そば": "ramen_warm",
    "ラーメン好きさんと繋がりたい": "ramen_warm",
    "カレー": "ramen_warm",
    "カレーライス": "ramen_warm",
    "丼": "ramen_warm",
    "牛丼": "ramen_warm",
    "スイーツ": "sweets_white",
    "デザート": "sweets_white",
    "ケーキ": "sweets_white",
    "パンケーキ": "sweets_white",
    "カフェ": "sweets_white",
    "カフェラテ": "sweets_white",
    "コーヒー": "sweets_white",
    "マカロン": "trend_pastel",
    "スムージー": "vivid_colorful",
    "寿司": "sushi_petrole",
    "すし": "sushi_petrole",
    "刺身": "sushi_petrole",
    "海鮮": "sushi_petrole",
    "シーフード": "sushi_petrole",
    "和食": "sushi_petrole",
    "懐石": "luxury_gold",
    "フレンチ": "elegant_dark",
    "イタリアン": "elegant_dark",
    "パスタ": "ramen_warm",
    "ピザ": "ramen_warm",
    "朝食": "casual_beige",
    "サンドイッチ": "casual_beige",
    "パン": "casual_beige",
    "オーガニック": "natural_beige",
    "サラダ": "natural_beige",
    "ヘルシー": "natural_beige",
    "激辛": "hot_red_black",
    "エスニック": "hot_red_black",
    "タイ料理": "hot_red_black",
    "インスタ映え": "trend_pastel",
    "かき氷": "vivid_colorful",
    "ドリンク": "vivid_colorful",
    "モダン": "simple_grey",
    "フュージョン": "simple_grey",
}

# ハッシュタグ辞書
HASHTAGS = {
    "ramen_warm": {
        "big": ["#ラーメン", "#グルメスポット"],
        "mid": ["#豚骨ラーメン", "#新作ラーメン", "#ラーメン好きさんと繋がりたい"],
        "small": ["#おいしい", "#食べたい", "#グルメ", "#スープ", "#麺", "#店舗", "#グルメレポ", "#食べ歩き", "#ラーメンロード", "#豚骨"],
    },
    "sweets_white": {
        "big": ["#スイーツ", "#カフェ"],
        "mid": ["#デザート好きさんと繋がりたい", "#スイーツ好きさんと繋がりたい", "#カフェ巡り"],
        "small": ["#甘い", "#行きたい", "#新作", "#限定", "#美味しい", "#ケーキ", "#パンケーキ", "#コーヒー", "#カフェタイム", "#デザートタイム"],
    },
    "sushi_petrole": {
        "big": ["#寿司", "#和食"],
        "mid": ["#高級寿司", "#江戸前寿司", "#海鮮好きさんと繋がりたい"],
        "small": ["#新鮮", "#ネタ", "#お寿司", "#おいしい", "#贅沢", "#グルメ", "#日本料理", "#海鮮", "#食べたい", "#至福"],
    },
    "luxury_gold": {
        "big": ["#懐石", "#高級料理"],
        "mid": ["#フレンチ", "#会席料理", "#特別な日"],
        "small": ["#ラグジュアリー", "#上品", "#おもてなし", "#ディナー", "#贅沢", "#非日常", "#グルメ", "#食べたい", "#特別感", "#オシャレ"],
    },
    "casual_beige": {
        "big": ["#朝食", "#パン"],
        "mid": ["#サンドイッチ", "#カフェ朝食", "#朝ごはん"],
        "small": ["#朝活", "#モーニング", "#カフェ", "#新鮮", "#おいしい", "#パンが好き", "#カフェラテ", "#グルメ", "#食べたい", "#朝時間"],
    },
    "vivid_colorful": {
        "big": ["#ドリンク", "#カラフル"],
        "mid": ["#かき氷", "#スムージー", "#インスタ映え"],
        "small": ["#映え", "#写真", "#カラフル", "#トレンド", "#新作", "#限定", "#行きたい", "#食べたい", "#推し活", "#話題"],
    },
    "natural_beige": {
        "big": ["#ヘルシー", "#オーガニック"],
        "mid": ["#サラダ", "#野菜", "#健康食"],
        "small": ["#栄養", "#美容", "#健康", "#無添加", "#自然", "#グルメ", "#おいしい", "#食べたい", "#生活", "#食育"],
    },
    "elegant_dark": {
        "big": ["#イタリアン", "#フレンチ"],
        "mid": ["#ワイン", "#チーズ", "#高級洋食"],
        "small": ["#上品", "#ディナー", "#ロマンティック", "#デート", "#贅沢", "#グルメ", "#食べたい", "#オシャレ", "#非日常", "#特別"],
    },
    "trend_pastel": {
        "big": ["#インスタ映え", "#カフェ"],
        "mid": ["#パステル", "#女子会", "#推し活"],
        "small": ["#映え", "#可愛い", "#写真", "#トレンド", "#新作", "#限定", "#友達と", "#行きたい", "#話題", "#チェック"],
    },
    "simple_grey": {
        "big": ["#グルメ", "#モダン"],
        "mid": ["#フュージョン", "#和洋折衷", "#新進気鋭"],
        "small": ["#上品", "#洗練", "#グルメ", "#食べたい", "#推し", "#新作", "#限定", "#こだわり", "#職人", "#感動"],
    },
    "hot_red_black": {
        "big": ["#激辛", "#エスニック"],
        "mid": ["#タイ料理", "#スパイシー", "#麻辣"],
        "small": ["#辛い", "#グルメ", "#食べたい", "#冒険", "#刺激", "#トレンド", "#新作", "#限定", "#食べ歩き", "#グルメレポ"],
    },
}

# テキスト配置（年齢別）
CTA_BY_AGE = {
    "young": [  # 20-30代
        "あなたなら〇〇どっち？コメントで教えてね",
        "食べたい？コメントで反応してね",
        "友達に教えたくなった人、保存してね",
    ],
    "middle": [  # 30-40代
        "あなたならどっち派？",
        "行きたい？",
        "後で見返したい人、保存を",
    ],
    "senior": [  # 40-50代
        "レシピ知りたい方はコメントで",
        "栄養について質問ありますか",
        "詳しく知りたい方はプロフのリンクから",
    ],
}

# キャプションテンプレート（食べ物別）
CAPTION_TEMPLATE = {
    "ramen": "〇〇の新作ラーメンが〇〇すぎた。スープの〇〇が...",
    "sweets": "〇〇カフェの新作デザート。〇色のレイヤーが〇〇。",
    "sushi": "旬の〇〇を使った〇〇。新鮮さが〇〇...詳しくはコメント。",
    "luxury": "〇〇の会席料理。〇〇が特に〇〇でした。",
    "casual": "朝活で立ち寄った〇〇。〇〇が新鮮で最高。",
    "generic": "〇〇で発見した〇〇。〇〇な〇〇が〇〇。",
}

# 投稿推奨時間帯
RECOMMENDED_POST_TIME = "11:30"  # ランチピーク時間
