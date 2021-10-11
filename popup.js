// 既に実行されていたら処理を終了
if (document.getElementById("getBandaiPrice") !== null){
  try {
    console.log(a)
  }
  catch (e) {
    console.log('already show bandai price.')
  }
}

function search_insert(text){
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
  text = toHalfWidth(text);
  console.log('text : ', text);

  // bandai_data からシリーズのリストを取得
  var series = ''
  var seriess = bandai_data_json["series"].sort(function(a, b) {return b.length - a.length;});
  // title からシリーズを取得
  for (const s of seriess) {
    if (text.indexOf(s) >= 0) {
      text = text.replace(s, "");
      series = s;
      break;
    }
  }
  console.log('series:', series);

  // bandai_data からブランドのリストを取得
  var brand  = ''
  var brands = bandai_data_json["brand"]
  console.log('brands:', brands);
  // for (const key in bandai_data_json["brand"])
  //   brands = brands.concat(bandai_data_json["brand"][key]['alias'])
  // brands = Array.from(new Set(brands)).sort(function(a, b) {return b.length - a.length;});
  // title からブランドを取得
  getbrand: for (const b in brands) {
    for (const b_alias of brands[b]["alias"]) {
      if (text.indexOf(b_alias) >= 0) {
        text = text.replace(b_alias, "");
        brand = b;
        break getbrand;
      }
    }
  }
  console.log('brand:', brand);

  // bandai_data からスケールのリストを取得
  var scale = ''
  var scales = bandai_data_json["scale"];
  // title からスケールを取得
  for (const s of scales) {
    if (text.indexOf(s) >= 0) {
      text = text.replace(s, "");
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
    text = text.replace(v,'')
  }
  // text_split = text_split.filter(function(v){
  //   return ! removals.includes(v);
  // });

  // 連続する半角スペースを削除
  text = text.replace(/^\s+|\s+$/g,'').replace(/ +/g,' ')
  console.log('text:', text);

  // 名前を分解、リスト化
  names = text.split(' ')
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
  //   "price": "2,750円（税込）",
  //   "brand": "HG［ハイグレード］",
  //   "scale": "1/144",
  //   "name": "ガンダムサバーニャ(最終決戦仕様)",
  //   "model": "",
  //   "series": [
  //     "機動戦士ガンダム00[ダブルオー]"
  //   ],
  //   "no": "4660",
  //   "p-bandai": {
  //     "no": "1000162355",
  //     "tag": [
  //       "ITEM_OUT_OF_STOCK",
  //       "ITEM_RESERVE",
  //       "RESERVE_202205"
  //     ]
  //   }
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

  // 各名前要素の検索結果から検索数が20以上のものは除外した上で少ない順にソートし上位１０件を選出する。
  // 20というしきい値は仮
  for (const r of results) {
    if ( r.length >= 20 ) {
      var index = results.indexOf(r);
      results.splice(index, 1)
    }
  }
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

  // url を生成
  var url = ""
  bandai_hobby_url = "https://bandai-hobby.net/item/"
  p_bandai_url = "https://p-bandai.jp/item/item-"
  for (const r of result) {
    console.log(r)
    if (r["no"] != "") {
      url = bandai_hobby_url + r['no'] + '/'
    }else if (r["no"] == "") {
      if (r["p-bandai"]["no"] != "") {
        url = p_bandai_url + r["p-bandai"]["no"] + '/'
      }
    }
    if (url != "") {
      r["url"] = url
      result[result.indexOf(r)] = r
    }
  }

  // 再出荷日の情報の有無を確認
  reshipment_flag = ''
  for (const r of result) {
    if (r['reshipment_data'] != null) {
      reshipment_flag = 1
      break
    }
  }

  // HTML 生成
  console.log("create html")
  div = document.createElement("div");
  div.id = "getBandaiPrice";

  // テーブル
  tbl = document.createElement("table");
  tHead = document.createElement("thead");
  tblBody = document.createElement("tbody");

  // テーブルヘッダー「商品名」
  row = document.createElement("tr");
  th1 = document.createElement("th");
  th1.className = "products";
  th1Text = document.createTextNode("関連商品（バンダイホビーサイト外部リンク）");
  th1.appendChild(th1Text)
  row.appendChild(th1)

  // テーブルヘッダー「価格」
  th2 = document.createElement("th");
  th2.className = "prices";
  th2Text = document.createTextNode("バンダイホビーサイト価格");
  th2.appendChild(th2Text)
  row.appendChild(th2)

  // 再出荷日の情報があればテーブルヘッダー「再出荷日」を追加
  if (reshipment_flag == 1) {
    th3 = document.createElement("th");
    th3.className = "reshipment_date";
    th3Text = document.createTextNode("再出荷日");
    th3.appendChild(th3Text)
    row.appendChild(th3)
  }

  // テーブルヘッダーの作成
  tHead.appendChild(row);

  // 検索結果から商品名、価格、リンクを取得
  i = 0
  for (const r of result) {
    row = document.createElement("tr");

    // 列に iD を付与し、8 以降はデフォルトでは非表示
    row.id = i
    if (i > 5) {
      row.className = 'toggle';
    }
    i += 1
    // カラム「商品名」
    td1 = document.createElement("td");
    td1.className = "product";
    // アンカー
    anchor = document.createElement("a");
    // anchor.href = bandai_hobby_url + r['no'] + '/';
    anchor.href = r['url'];
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
    td2.className = "price";
    td2Text = document.createTextNode(r['price']);
    td2.appendChild(td2Text)
    row.appendChild(td2)

    // カラム「再出荷日」
    if (reshipment_flag == 1) {
      if (r['reshipment_data'] == null) {
        r['reshipment_data'] = '-'
      }
      td3 = document.createElement("td");
      td3.className = "reshipment_data";
      td3Text = document.createTextNode(r['reshipment_data']);
      td3.appendChild(td3Text)
      row.appendChild(td3)
    }

    // 列の作成
    tblBody.appendChild(row);
  }
  // テーブルの作成
  tbl.appendChild(tHead);
  tbl.appendChild(tblBody);

  // テーブル の挿入
  div.appendChild(tbl);
  document.body.appendChild(div);

  // 列が８以上の場合は "read more" を追加・挿入
  if (tblBody.childElementCount > 8) {
    div_button = document.createElement("div");
    div_button.id = "button_wrapper";
    div_button.className = "button_wrapper";

    button = document.createElement('button');
    button.id = 'button';
    button.className = 'more'
    buttonText = document.createTextNode("< read more >");
    button.appendChild(buttonText)
    div_button.appendChild(button);

    //div.appendChild(div_button);
    document.body.appendChild(div_button);
  }

  // 注意事項の作成
  div_attention = document.createElement("div");
  div_attention.id = "attention";
  p = document.createElement("p");
  p.style.color = "#565959";
  pText = document.createTextNode("※表示内容が適切でない場合、");
  p.appendChild(pText);

  anchor = document.createElement("a");
  anchor.href = "https://bandai-hobby.net/item_all/";
  anchor.target = "_blank"
  anchor.rel = "noopener noreferrer"
  anchorText = document.createTextNode("バンダイホビーサイト");
  anchor.appendChild(anchorText)
  p.appendChild(anchor);

  pText = document.createTextNode("もしくは");
  p.appendChild(pText);

  anchor = document.createElement("a");
  anchor.href = "https://p-bandai.jp/";
  anchor.target = "_blank"
  anchor.rel = "noopener noreferrer"
  anchorText = document.createTextNode("プレミアムバンダイ");
  anchor.appendChild(anchorText)
  p.appendChild(anchor);

  pText = document.createTextNode("で検索をお願いします。");
  p.appendChild(pText);

  div_attention.appendChild(p)
  document.body.appendChild(div_attention);

  // フッターを挿入
  //div.appendChild(p);

  // HTML を挿入
  //document.body.insertBefore(div, document.getElementById("content"));

  // ローディングを削除
  if (document.getElementById('loader') != null) {
    document.getElementById('loader').remove();
  }

　// "read more" のアクション
  // 8列以上を表示・非表示を切り替える
  // "read more", "read less"を切り替える
  document.getElementById('button').addEventListener('click', function() {
    el = $('.toggle')
    el.toggleClass('show')
    if ($(this).text() === '< read more >') {
      $(this).text('> read less <');
    } else {
      $(this).text('< read more >');
    }
  });
}

chrome.tabs.query({ active: true, currentWindow: true },function(tabs){
  // Amazon 商品ページからタイトルを取得
  var tag_title = tabs[0]['title'];
  console.log('text : ', tag_title);

  search_insert(tag_title)

  // document.getElementById('button_search').addEventListener('click', function() {
  //   let search_text = document.getElementById('searchText').value
  //   alert(search_text)
  //   document.getElementById('getBandaiPrice').remove();
  //   document.getElementById('button_wrapper').remove();
  //   document.getElementById('attention').remove();
  //   search_insert(search_text);
  // });
});
