// 現在開いているタブの title を取得
let title = ''
chrome.tabs.getSelected(tab=>{
  title = tab.title;
  console.log(`Title: ${title}`);

  // 現在開いている Amazon ページからグレード、スケール、キット名を取得
  // キット名は case3 だけ SCALE の後ろ
  // Amazon の商品名が以下３通りの場合に対応、他の場合は未対応
  // case1. ${GRADE} ${TITLE} ${NAME} ${SCALE} 色分け済みプラモデル ${NUM}
  // case2. ${GRADE} ${TITLE} ${MODEL-NUM} ${NAME} ${SCALE} 色分け済みプラモデル
  // case3. ${GRADE} ${SCALE} ${MODEL-NUM} ${NAME} (${TITLE})
  // E.G
  // - HGUC 機動戦士ガンダム 閃光のハサウェイ Ξガンダム(クスィーガンダム) 1/144スケール 色分け済みプラモデル 2530614
  // - BANDAI SPIRITS RG 機動戦士ガンダム 逆襲のシャア Hi-νガンダム 1/144スケール 色分け済みプラモデル 197709
  // - HGUC 機動戦士Zガンダム PMX-003 ジ・オ 1/144スケール 色分け済みプラモデル
  // - MG 機動戦士ガンダムSEED ECLIPSE エクリプスガンダム 1/100スケール 色分け済みプラモデル 197703
  // - HG 1/144 ファルシア プラモデル 『機動戦士ガンダムAGE』より
  console.log(`Title: ${title}`);
  amazon_title = title.split(' ');
  console.log(`AmazonTitle: ${amazon_title}`);

  // GRADE を取得
  amazon_gunpla_grade = amazon_title[2]

  // スケールとスケールのインデックスを取得
  amazon_gunpla_scale = amazon_title.find(value => value.match(/1\/144|1\/100|1\/60/gi))
  amazon_gunpla_scale_index = amazon_title.indexOf(`${amazon_gunpla_scale}`)

  if (amazon_gunpla_scale_index = 3) { //case3 の場合だけ
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

  // バンダイホビーサイトで検索、価格を抽出
  var results = []
  for (const search_string of search_strings) {
    url = "https://bandai-hobby.net/item_all/?chara=&sort=new&brand=&online=0&jancode=&sword=" + encodeURI(search_string)
    fetch(url)
    	.then(response => response.text()) // (2) レスポンスデータを取得
    	.then(data => { // (3)レスポンスデータを処理
    		parser = new DOMParser();
    		html = parser.parseFromString(data, "text/html");
        console.log(`Search Result HTML: ${html}`);

        result = html.getElementsByClassName('bhs_pdlist_sbs')[0]
        console.log(`Search Result: ${result}`);
        if (result != null) {
          kit = result.getElementsByTagName('li')
          results.push(result)
          console.log(`Search Results: ${results}`);
    	  }
      })
  }

  chrome.runtime.sendMessage({
      amazon_gunpla_name: amazon_gunpla_name,
  });
  console.log(`Send Message ${amazon_gunpla_name}`);

});
