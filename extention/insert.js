console.log('start insert.js')
// HTML 生成
div = document.createElement("div");
div.id = "getBandaiPrice";
// 見出しの作成
// hGunplaListPrice = document.createElement("h2");
// hGunplaListPrice.id = "gunplaListPrise"
// hGunplaListPriceText = document.createTextNode("ガンプラ定価情報");
// hGunplaListPrice.appendChild(hGunplaListPriceText)
// hGunplaListPrice.style.borderTop = "1px solid rgb(204, 204, 204)"
// 挿入
// element = document.getElementById('ppd');
// element.insertAdjacentElement('afterend', hGunplaListPrice);
// テーブル
tbl = document.createElement("table");
tblBody = document.createElement("tbody");
// テーブルヘッダー
// テーブルヘッダー「商品名」
row = document.createElement("tr");
th1 = document.createElement("th");
th1Text = document.createTextNode("関連商品（バンダイ ホビーサイト外部リンク）");
th1.appendChild(th1Text)
row.appendChild(th1)
// テーブルヘッダー「価格」
th2 = document.createElement("th");
th2Text = document.createTextNode("バンダイ ホビーサイト掲載価格");
th2.appendChild(th2Text)
row.appendChild(th2)
// テーブルヘッダーの作成
tblBody.appendChild(row);
// テーブルの装飾
tbl.style.borderCollapse = "collapse"
tbl.style.minWidth       = "935px"
tbl.style.maxWidth       = "960px"
row.style.borderBottom   = "solid 1px #eee"
row.style.cursor         = "pointer"
th1.style.textAlign      = "left"
th1.style.width          = "75%"
th1.style.padding        = "15px 0"
th2.style.textAlign      = "left"
th2.style.width          = "25%"
th2.style.padding        = "15px 0"

// 検索結果から商品名、価格、リンクを取得
bandai_hobby_url = "https://bandai-hobby.net/item/"
for (const r of result) {
  row = document.createElement("tr");
  // カラム「商品名」
  td1 = document.createElement("td");
  // アンカー
  anchor = document.createElement("a");
  anchor.href = bandai_hobby_url + r['no'] + '/';
  anchor.target = "_blank"
  anchor.rel = "noopener noreferrer"
  td1.appendChild(anchor)
  // テキスト
  td1Text = document.createTextNode(r['product']);
  anchor.appendChild(td1Text)

  td1.appendChild(anchor)
  row.appendChild(td1)

  // カラム「価格」
  td2 = document.createElement("td");
  td2Text = document.createTextNode(r['price']);
  td2.appendChild(td2Text)
  row.appendChild(td2)

  // 列の作成
  tblBody.appendChild(row);
}
// テーブルの作成
tbl.appendChild(tblBody);

// 注意事項の作成
p = document.createElement("p");
p.style.color = "#565959";
pText = document.createTextNode("※表示されている内容が適切でない場合、お手数ですが");
p.appendChild(pText);

anchor = document.createElement("a");
anchor.href = "https://bandai-hobby.net/item_all/";
anchor.target = "_blank"
anchor.rel = "noopener noreferrer"
anchorText = document.createTextNode("バンダイ ホビーサイトの検索ページ");
anchor.appendChild(anchorText)
p.appendChild(anchor);

pText = document.createTextNode("で検索をお願いします。");
p.appendChild(pText);

// 挿入する HTML の完成
div.appendChild(tbl);
div.appendChild(p);

// 挿入する箇所の上の要素を指定
insert_element_id = 'ppd'
element = document.getElementById(insert_element_id);
element.insertAdjacentElement('afterend', div);
