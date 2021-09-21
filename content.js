getBandaiPrice();

async function getBandaiPrice() {
  // 既に実行されていたら処理終了
  if (document.getElementById("getBandaiPrice") !== null) {
    return
  }

  // 現在開いている Amazon ページからグレード、スケール、キット名を取得
  // キット名は case3 だけ SCALE の後ろ
  // Amazon の商品名が以下３通りの場合に対応、他の場合は未対応
  // case1. ${GRADE} ${TITLE} ${NAME} ${SCALE} 色分け済みプラモデル ${NUM}
  // case2. ${GRADE} ${TITLE} ${MODEL-NUM} ${NAME} ${SCALE} 色分け済みプラモデル
  // case3. ${GRADE} ${SCALE} ${MODEL-NUM} ${NAME} (${TITLE})
  // case4. BANDAI SPIRITS ${GRADE} ${TITLE} ${NAME} ${SCALE} 色分け済みプラモデル ${NUM}
  // case5. ENTRY GRADE ${TITLE} ${NAME} ${SCALE} 色分け済みプラモデル
  // E.G
  // - HGUC 機動戦士ガンダム 閃光のハサウェイ Ξガンダム(クスィーガンダム) 1/144スケール 色分け済みプラモデル 2530614
  // - BANDAI SPIRITS RG 機動戦士ガンダム 逆襲のシャア Hi-νガンダム 1/144スケール 色分け済みプラモデル 197709
  // - HGUC 機動戦士Zガンダム PMX-003 ジ・オ 1/144スケール 色分け済みプラモデル
  // - MG 機動戦士ガンダムSEED ECLIPSE エクリプスガンダム 1/100スケール 色分け済みプラモデル 197703
  // - HG 1/144 ファルシア プラモデル 『機動戦士ガンダムAGE』より
  amazon_title = document.title.split(' ')
  console.log(amazon_title)

  // GRADE を取得
  if ( amazon_title[2] == 'BANDAI' && amazon_title[3] == 'SPIRITS' ) { // case4
    amazon_gunpla_grade = amazon_title[4]
  }else if ( amazon_title[2] == 'ENTRY' && amazon_title[3] == 'GRADE' ) { // case5
    amazon_gunpla_grade = 'ENTRY GRADE'
  }else{
    amazon_gunpla_grade = amazon_title[2]
  }
  console.log(amazon_gunpla_grade)

	// スケールとスケールのインデックスを取得
	amazon_gunpla_scale = amazon_title.find(value => value.match(/1\/144|1\/100|1\/60/gi))
	amazon_gunpla_scale_index = amazon_title.indexOf(`${amazon_gunpla_scale}`)

	if (amazon_gunpla_scale_index == 3) { //case3 の場合だけ
	  amazon_gunpla_name = amazon_title[ amazon_gunpla_scale_index + 2]
	}else{
	  amazon_gunpla_name = amazon_title[ amazon_gunpla_scale_index - 1]
	}

	console.log(`Gunpla Grade: ${amazon_gunpla_grade}`);
	console.log(`Gunpla Scale: ${amazon_gunpla_scale}`);
	console.log(`Gunpla Name: ${amazon_gunpla_name}`);

  // バンダイホビーサイトで検索し、検索結果の上位３つの価格を返す
  // 検索文字列の作成
  // キット名： ${GRADE} ${SCALE} ${NAME}
  // E.G
  // - HGUC 1/144 Ξガンダム
  // - RG 1/144 νガンダム
  // - MG 1/100 リック･ドム

  // 検索するために整形
  // scale から「スケール」を除去
  amazon_gunpla_scale = amazon_gunpla_scale.replace('スケール', '');

  // 名前に括弧が付いているものは、括弧有無の２パターンで検索する。括弧がキット名に含まれる、Ξガンダムのようにフリガナのケースがある。
  // search_strings = ['括弧付き', '括弧無し']
  // E.G
  // ['HGUC 1/144 Ξガンダム(クスィーガンダム)', 'HGUC 1/144 Ξガンダム']
  var search_strings = []
  search_string = amazon_gunpla_grade + ' ' + amazon_gunpla_scale + ' ' + amazon_gunpla_name
  search_strings.push(search_string)
  if (amazon_gunpla_name.match(/\(.+\)/gi) !== null) {
    amazon_gunpla_name = amazon_gunpla_name.replace(/\(.+\)/, '');
    search_strings.push(amazon_gunpla_grade + ' ' + amazon_gunpla_scale + ' ' + amazon_gunpla_name);
  }
  console.log(`Search Strings: ${search_strings}`);

  //var results = []
  const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // HTML 生成
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
  tbl.id = "getBandaiPrice";
  tblBody = document.createElement("tbody");
  // テーブルヘッダー
  // テーブルヘッダー「商品名」
  row = document.createElement("tr");
  th1 = document.createElement("th");
  th1Text = document.createTextNode("関連商品");
  th1.appendChild(th1Text)
  row.appendChild(th1)
  // テーブルヘッダー「価格」
  th2 = document.createElement("th");
  th2Text = document.createTextNode("ガンプラホビーサイト掲載価格");
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
  th1.style.width          = "50%"
  th1.style.padding        = "15px 0"
  th2.style.textAlign      = "left"
  th2.style.width          = "50%"
  th2.style.padding        = "15px 0"

  // バンダイホビーサイトから情報を取得
  for (const search_string of search_strings) {
    url = "https://bandai-hobby.net/item_all/?chara=&sort=new&brand=&online=0&jancode=&sword=" + encodeURI(search_string)

    //html = await getHtml(url) // await の使い方がまじで分からない
    res = await fetch(url)
    parser = new DOMParser();
    html = await parser.parseFromString(await res.text(), "text/html");
    console.log(`Search Result HTML: ${html}`);

    _sleep(2000);

    result = html.getElementsByClassName('bhs_pdlist_sbs')[0]
    console.log(`Search Result: ${result}`);

    // 商品名、価格、リンクを取得
    let products = [];
    if (result != null) {
      for (let li of result.children){
        kit_name  = li.children[1].getElementsByClassName('bhs_pd_ttl')[0].textContent;
        kit_price = li.children[1].getElementsByClassName('bhs_pd_price')[0].textContent.match(/[0-9,]+円（税込）/)[0];
        kit_link  = li.children[0].href.replace('www.amazon.co.jp', 'bandai-hobby.net'); // リンク先がプレミアムバンダイとホビーサイトの２パターンあり
        products.push([kit_name,kit_price,kit_link]);
      }
      console.log(products)
	  }

    // テーブル各列の作成
    for (product of products) {
      row = document.createElement("tr");
      // カラム「商品名」
      td1 = document.createElement("td");
      // アンカー
      anchor = document.createElement("a");
      anchor.href = product[2];
      anchor.target = "_blank"
      anchor.rel = "noopener noreferrer"
      td1.appendChild(anchor)
      // テキスト
      td1Text = document.createTextNode(product[0]);
      anchor.appendChild(td1Text)

      td1.appendChild(anchor)
      row.appendChild(td1)

      // カラム「価格」
      td2 = document.createElement("td");
      td2Text = document.createTextNode(product[1]);
      td2.appendChild(td2Text)
      row.appendChild(td2)

      // 列の作成
      tblBody.appendChild(row);
    }

    // テーブルの作成
    tbl.appendChild(tblBody);

    // 取得結果を DOM に挿入
    // element = document.getElementById('ppd');
    // element.insertAdjacentElement('afterend', tbl);
  }
	element = document.getElementById('ppd');
	element.insertAdjacentElement('afterend', tbl);
}
