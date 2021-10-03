import json
import re
import glob
import unicodedata
import string

# 記号の変換
# 半角記号
HALF_SYMBOL = ''.join(chr(0x21 + i) for i in range(15)) # !"#$%&'()*+,-./
HALF_SYMBOL += ''.join(chr(0x3a + i) for i in range(7)) # :;<=>?@
HALF_SYMBOL += ''.join(chr(0x5b + i) for i in range(6)) # [\]^_`
HALF_SYMBOL += ''.join(chr(0x7b + i) for i in range(4)) # {|}~
HALF_SYMBOL += chr(0xa5)                                # ¥

# 全角記号
DOUBLE_SYMBOL = ''.join(chr(0xff01 + i) for i in range(15)) # ！＂＃＄％＆＇（）＊＋，－．／
DOUBLE_SYMBOL += ''.join(chr(0xff1a + i) for i in range(7)) # ：；＜＝＞？＠
DOUBLE_SYMBOL += ''.join(chr(0xff3b + i) for i in range(6)) # ［＼］＾＿｀
DOUBLE_SYMBOL += ''.join(chr(0xff5b + i) for i in range(4)) # ｛｜｝～
DOUBLE_SYMBOL += chr(0xffe5)                                # ￥

def transfer_symbol_double_to_half(text):
    double_to_half_symbol = str.maketrans(DOUBLE_SYMBOL, HALF_SYMBOL)
    return text.translate(double_to_half_symbol)

# 数字の変換
# 半角数値
HALF_NUMBER = ''.join(chr(0x30 + i) for i in range(10)) # 0123456789

# 全角数値
DOUBLE_NUMBER = ''.join(chr(0xff10 + i) for i in range(10)) # ０１２３４５６７８９

def transfer_number_double_to_half(text):
    double_to_half_number = str.maketrans(DOUBLE_NUMBER, HALF_NUMBER)
    return text.translate(double_to_half_number)

# 英字の変換
# 半角英字
HALF_ALPHABET = ''.join(chr(0x41 + i) for i in range(26))  # ABCDEFGHIJKLMNOPQRSTUVWXYZ
HALF_ALPHABET += ''.join(chr(0x61 + i) for i in range(26)) # abcdefghijklmnopqrstuvwxyz

# 全角英字
DOUBLE_ALPHABET = ''.join(chr(0xff21 + i) for i in range(26))  # ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ
DOUBLE_ALPHABET += ''.join(chr(0xff41 + i) for i in range(26)) # ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ

def transfer_alphabet_double_to_half(text):
    double_to_half_alphabet = str.maketrans(DOUBLE_ALPHABET, HALF_ALPHABET)
    return text.translate(double_to_half_alphabet)

# バンダイホビーサイトのデータの取得
bandai_data = json.load(open('bandai_tag.json', 'r'))

# ブランドの取得
brands = bandai_data['brand']
# バンダイに登録しているブランドを取得
bandai_brand_list = list(brands.keys())
# ブランドのエイリアスを取得
bandai_brand_alias_list = []
for b in list(brands.values()):
    bandai_brand_alias_list = bandai_brand_alias_list + b['alias']
# エイリアスを含めたブランドのリスト
brand_list  = sorted(list(set(list(brands.keys()) + bandai_brand_alias_list)), key=len, reverse=True)

# スケールの取得
scales      = bandai_data['scale']

# クロールした内容をパースしてファイルに出力
kits = []
files = glob.glob("master/gunpla_*.json")
for file in files:
    gunpla = json.load(open(file, 'r'))

    for g in gunpla['gunpla']:
        # 商品名の全角英数字記号スペースを全て半角に変換
        product = transfer_alphabet_double_to_half(transfer_number_double_to_half(transfer_symbol_double_to_half(g['product'])))
        name = product

        # product からブランド（e.g "HG","MG"）の取得
        brand = []
        for b in brand_list:
            if b in product:
                brand.append(b)
                name = name.replace(b, '')
                break
        # g['brand'] とそのエイリアスを取得
        for gb in g['brand']:
            brand.append(gb)
            brand = brand + brands[gb]['alias']
        # series からブランドを取得
        for s in g['series']:
            for b in brands.values():
                if s in b["series"]:
                    brand = brand + b["alias"]
        # 重複を削除
        brand = list(set(brand))

        # スケール（e.g "1/144","1/100"）の取得
        scale = ''
        for s in scales:
            if s in product:
                scale = s
                name = name.replace(s, '')
                break
        # 商品名からブランドとスケールを省いた文字列（≒名前）を取得
        name = name.lstrip()

        # 商品ページの　URL 末尾の数字４桁を取得
        no = re.search(r'[0-9]{4}', g['url']).group()

        # 価格を取得
        price = g['price']

        # シリーズを（e.g "機動戦士ガンダム"）取得
        series  = g['series']

        kits.append({"product": product, "price": price, "brand": brand, "scale": scale, "name": name, "series":series, "no": no})

kits_unique = sorted(list(map(json.loads, set(map(json.dumps, kits)))), key=lambda x:x['no'])

bandai_products = {}
bandai_products = {"brand":brands, "scale":scales, "series":bandai_data["series"], "products":kits_unique}
with open('bandai_products.json', 'w') as f:
    json.dump(bandai_products, f, ensure_ascii=False, indent=2)
