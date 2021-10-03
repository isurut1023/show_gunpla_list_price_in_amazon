// 既に実行されていたら処理を終了
if (document.getElementById("getBandaiPrice") !== null){
  try {
    console.log(a)
  }
  catch (e) {
    console.log('already show bandai price.')
  }
}

chrome.tabs.query({ active: true, currentWindow: true },function(tabs){
  // Amazon 商品ページからタイトルを取得
  var tag_title = tabs[0]['title'];
  console.log('tag_title : ', tag_title);

  // 全角英数記号スペースを半角化
  function toHalfWidth(strVal){
    // 半角変換
    var halfVal = strVal.replace(/[！-～]/g,
      function( tmpStr ) {
        // 文字コードをシフト
        return String.fromCharCode( tmpStr.charCodeAt(0) - 0xFEE0 );
      }
    ).replace(/　/g," ");
    return halfVal;
  }
  tag_title = toHalfWidth(tag_title);
  console.log('tag_title : ', tag_title);

  // Series の取得
  var series = ''
  var seriess = bandai_data_json["series"].sort(function(a, b) {return b.length - a.length;});
  for (const s of seriess) {
    if (tag_title.indexOf(s) >= 0) {
      tag_title = tag_title.replace(s, "");
      series = s;
      break;
    }
  }
  console.log('series:', series);

  // bandai_data からブランドのリストを取得
  var brands = []
  for (const key in bandai_data_json["brand"])
    brands = brands.concat(bandai_data_json["brand"][key]['alias'])
  brands = Array.from(new Set(brands)).sort(function(a, b) {return b.length - a.length;});
  // title から Brand を取得
  var brand  = ''
  for (const b of brands) {
    if (tag_title.indexOf(b) >= 0) {
      tag_title = tag_title.replace(b, "");
      brand = b;
      break;
    }
  }
  console.log('brand:', brand);

  // Scale の取得
  var scale = ''
  var scales = bandai_data_json["scale"];
  for (const s of scales) {
    if (tag_title.indexOf(s) >= 0) {
      tag_title = tag_title.replace(s, "");
      scale = s;
      break;
    }
  }
  console.log('scale:', scale);

  // 不要な文字列を削除
  var removals = [
    'BANDAI SPIRITS',
    'BANDAI',
    '色分け済みプラモデル',
    '| プラモデル 通販',
    'プラモデル',
    'スケール',
    'Amazon |',
    '- メルカリ',
    '新品',
    '中古'
  ];
  for (const v of removals) {
    tag_title = tag_title.replace(v,'')
  }
  // tag_title_split = tag_title_split.filter(function(v){
  //   return ! removals.includes(v);
  // });

  // 連続する半角スペースを削除
  tag_title = tag_title.replace(/^\s+|\s+$/g,'').replace(/ +/g,' ')
  console.log('tag_title:', tag_title);

  // 名前を分解、リスト化
  names = tag_title.split(' ')
  // 名前に "()" 含む場合は、"()" とその中の文字列を除外したものを追加
  for (const n of names) {
    if (n.match(/\(.+\)/g)) {
      names.push(n.replace(/\(.+\)/g, ''))
    }
  }
  console.log('names:', names);

  // 検索
  var search = bandai_data_json['products']
  // {
  //   "product": "HG 1/144 ガンダムサバーニャ(最終決戦仕様)",
  //   "price": "2,750円（税10%込）",
  //   "brand": [
  //     " HG［ハイグレード］",
  //     "HG",
  //     "HGUC"
  //   ],
  //   "scale": "1/144",
  //   "name": "ガンダムサバーニャ(最終決戦仕様)",
  //   "series": [
  //     "機動戦士ガンダム00[ダブルオー]"
  //   ],
  //   "no": "4660"
  // }

  // brand で絞り込み
  var result = search.filter(function(item, index){
    if ((item.brand).indexOf(brand) >= 0) return true;
  });
  console.log('search by brand:', result)

  // brand での検索結果が null の場合 scale で絞り込み
  if (result.length) {
    search = result
  }else{
    var result = search.filter(function(item, index){
      if (item.scale == scale) return true;
    });
    console.log('search by scale:', result)

    // 検索結果を次の検索範囲とする、null の場合は検索範囲を変更しない。
    if (!result.length) {
      search = result
    }
  }

  // name で絞り込み
  var results = []
  for (const name of names) {
    result = []
    var result = search.filter(function(item, index){
      if ((item.name).indexOf(name) >= 0) return true;
    });
    if (result.length) {
      results.push(result);
    }
  }
  console.log("search by name:", results)

  // 各名前要素の検索結果から検索数が少ない順にソートし上位１０件を選出する。
  results = results.sort()
  result  = []
  console.log("Sort by length:", results)
  for (const r of results) {
    result = result.concat(r);
  }
  // 重複を削除
  result = Array.from(new Set(result));
  console.log("Combined result:", result)

  // 上位１０件を抽出
  result = result.slice(0, 9);
  console.log("Result to insert:", result)

  // HTML 生成
  console.log("create html")
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
  th1.id = "products";
  th1Text = document.createTextNode("関連商品（バンダイ ホビーサイト外部リンク）");
  th1.appendChild(th1Text)
  row.appendChild(th1)
  // テーブルヘッダー「価格」
  th2 = document.createElement("th");
  th2.id = "prices";
  th2Text = document.createTextNode("バンダイ ホビーサイト掲載価格");
  th2.appendChild(th2Text)
  row.appendChild(th2)
  // テーブルヘッダーの作成
  tblBody.appendChild(row);
  // テーブルの装飾
  // tbl.style.borderCollapse = "collapse"
  // tbl.style.minWidth       = "935px"
  // tbl.style.maxWidth       = "960px"
  // row.style.borderBottom   = "solid 1px #eee"
  // row.style.cursor         = "pointer"
  // th1.style.textAlign      = "left"
  // th1.style.width          = "75%"
  // th1.style.padding        = "15px 0"
  // th2.style.textAlign      = "left"
  // th2.style.width          = "25%"
  // th2.style.padding        = "15px 0"

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
  // insert_element_id = 'ppd'
  // element = document.getElementById(insert_element_id);
  // element.insertAdjacentElement('afterend', div);
  loader = document.getElementById('loader');
  loader.remove();
  document.body.insertBefore(div, document.getElementById("content"));
});
