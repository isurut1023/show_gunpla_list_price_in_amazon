// 既に実行されていたら処理を終了
if (document.getElementById("getBandaiPrice") !== null){
  try {
    console.log(a)
  }
  catch (e) {
    console.log('already show bandai price.')
  }
}

// Amazon 商品ページからタイトルを取得
var amazon_title = document.title.replace(/^Amazon \| /g, "").replace(/\| プラモデル 通販$/g, "");
// var amazon_title = "MG 1/100 RX-0 ユニコーンガンダム Ver.Ka (機動戦士ガンダムUC)"
console.log('Amazon Title;', amazon_title)

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
amazon_title = toHalfWidth(amazon_title);
console.log('amazon_title : ', amazon_title);

// Series の取得
var series = ''
var seriess = bandai_data_json["series"].sort(function(a, b) {return b.length - a.length;});
for (const s of seriess) {
  if (amazon_title.indexOf(s) >= 0) {
    amazon_title = amazon_title.replace(s, "");
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
  if (amazon_title.indexOf(b) >= 0) {
    amazon_title = amazon_title.replace(b, "");
    brand = b;
    break;
  }
}
console.log('brand:', brand);

// Scale の取得
var scale = ''
var scales = bandai_data_json["scale"];
for (const s of scales) {
  if (amazon_title.indexOf(s) >= 0) {
    amazon_title = amazon_title.replace(s, "");
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
  'プラモデル',
  'スケール'
];
for (const v of removals) {
  amazon_title = amazon_title.replace(v,'');
}
// amazon_title_split = amazon_title_split.filter(function(v){
//   return ! removals.includes(v);
// });

// 連続する半角スペースと末尾の数字を削除
amazon_title = amazon_title.replace(/^\s+|\s+$/g,'').replace(/ +/g,' ')
console.log('amazon_title:', amazon_title);

// リスト化
names = amazon_title.split(' ')
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
