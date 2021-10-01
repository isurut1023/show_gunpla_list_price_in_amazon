import time
import datetime
import re
import json
import requests
from bs4 import BeautifulSoup

url_base = "https://bandai-hobby.net/item/"
interval = 20   # クロールのインターバル（秒）、サーバーに負荷を与えぬよう大きめの値にする。
num      = 1 # 取得する商品ページの始まりを指定
limit    = 1000 # 取得する商品ページの終わりを指定
gunplas = []

while num <= limit:
    time.sleep(interval)

    # 商品ページの URL
    url = "https://bandai-hobby.net/item/" + str(num).zfill(4) + "/"

    print("start　" + url)
    html = requests.get(url)

    # ステータスコードが 200 を返さなかったらパス
    if html.status_code != 200:
        print("status code is not 200")

        # １０個ごとにファイルに出力
        if num % 10 == 0:
            now = datetime.datetime.now()
            file_name = "gunpla_" + str(num).zfill(4) + "_" + now.strftime('%Y%m%d_%H%M%S') + ".json"
            with open(file_name, 'w') as f:
                json.dump(gunpla, f, ensure_ascii=False, indent=2)
            print("dump " + file_name)
            gunplas = []
        num += 1
        continue

    # html をパース
    soup = BeautifulSoup(html.content, "html.parser", from_encoding="shift_jis")

    product = ""    # 商品名
    price   = ""    # 価格
    brand   = []    # ブランド（e.g "HG","RG"）
    series  = []    # シリーズ（e.g "機動戦士ガンダム","新機動戦記ガンダムW"）

    product = soup.find("h2",class_="bhs_main_title").text
    price   = soup.find("table",class_="bhs_sale_table").find("td").text.replace('\n', '')
    try:
        for title in soup.find("ul",class_="bhs_sale_works_title").find_all("li"):
            brand.append(title.text)
    except (IndexError, NameError, AttributeError):
        brand = []
    try:
        for li in soup.find("ul",class_="bhs_sale_works_series").find_all("li"):
            series.append(li.text.replace('\n', '').replace('\u3000', ' '))
    except (IndexError, NameError, AttributeError):
        series = []

    gunpla = {"product":product, "url":url, "price":price, "brand":brand, "series":series}
    gunplas.append(gunpla)
    print("complete　" + url)


    gunpla = {"gunpla":gunplas}
    print(gunpla)

    # １０個ごとにファイルに出力
    if num % 10 == 0:
        now = datetime.datetime.now()
        file_name = "gunpla_" + str(num).zfill(4) + "_" + now.strftime('%Y%m%d_%H%M%S') + ".json"
        with open(file_name, 'w') as f:
            json.dump(gunpla, f, ensure_ascii=False, indent=2)
        print("dump " + file_name)
        gunplas = []

    num += 1
