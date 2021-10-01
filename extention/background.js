console.log('start')

chrome.action.onClicked.addListener((tab) => {
  console.log('onClicked start')

  getCurrentTitle()
});

// Amazon ページのタイトルを取得
async function getCurrentTitle() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  console.log("Title: " + tab.title);

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: "isComplete"}, function(response) {
      console.log(response.isComplete)
      if ( response.isComplete == "true" ) {
        console.log('already show bandai price.')
        return
      }else {
        console.log('start getGunplaInfo.')
        getGunplaInfo(tab.id, tab.title)
      }
    });
  });
}

async function getGunplaInfo(tabId, amazon_title) {
  // 現在開いている Amazon ページからグレード、スケール、キット名を取得
  // キット名は case3 だけ SCALE の後ろ
  // Amazon の商品名が以下３通りの場合に対応、他の場合は未対応
  // case1. ${GRADE} ${TITLE} ${NAME} ${SCALE} 色分け済みプラモデル ${NUM}
  // case2. ${GRADE} ${TITLE} ${MODEL-NUM} ${NAME} ${SCALE} 色分け済みプラモデル
  // case3. ${GRADE} ${SCALE} ${MODEL-NUM} ${NAME} (${TITLE})
  // case4. BANDAI SPIRITS ${GRADE} ${TITLE} ${NAME} ${SCALE} 色分け済みプラモデル ${NUM}
  // case5. ENTRY GRADE ${TITLE} ${NAME} ${SCALE} 色分け済みプラモデル
  // case6. ${GRADE} ${TITLE} ${NAME1} ${NAME2} ${SCALE} 色分け済みプラモデル
  // case7. ${HOGE}${GRADE} ${TITLE} ${NAME1} ${NAME2} ${SCALE} 色分け済みプラモデル
  // case8.
  // E.G
  // - HGUC 機動戦士ガンダム 閃光のハサウェイ Ξガンダム(クスィーガンダム) 1/144スケール 色分け済みプラモデル 2530614
  // - BANDAI SPIRITS RG 機動戦士ガンダム 逆襲のシャア Hi-νガンダム 1/144スケール 色分け済みプラモデル 197709
  // - HGUC 機動戦士Zガンダム PMX-003 ジ・オ 1/144スケール 色分け済みプラモデル
  // - MG 機動戦士ガンダムSEED ECLIPSE エクリプスガンダム 1/100スケール 色分け済みプラモデル 197703
  // - HG 1/144 ファルシア プラモデル 『機動戦士ガンダムAGE』より
  // - MG 新機動戦記ガンダムW Endless Waltz ウイングガンダムゼロEW Ver.Ka 1/100スケール 色分け済みプラモデル
  // - 【2次受注用】MGEX 機動戦士ガンダムUC ユニコーンガンダム Ver.Ka 1/100スケール 色分け済みプラモデル
  // - MG 機動戦士ガンダムSEED フリーダムガンダムVer.2.0 1/100スケール 色分け済みプラモデル（"MG フリーダムガンダム Ver.2.0" でないと検索出来ない）
  console.log(amazon_title.split(' '))
  amazon_title = amazon_title.split(' ')
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

  if (amazon_gunpla_scale_index == 3) { //　case3
    amazon_gunpla_name = amazon_title[ amazon_gunpla_scale_index + 2]
  }else{
    amazon_gunpla_name = amazon_title[ amazon_gunpla_scale_index - 1]
    if (amazon_gunpla_name == "Ver.Ka") { //　case6
      amazon_gunpla_name = amazon_title[ amazon_gunpla_scale_index - 2] + " " + amazon_title[ amazon_gunpla_scale_index - 1]
    }
  }

  console.log(`Gunpla Grade: ${amazon_gunpla_grade}`);
  console.log(`Gunpla Scale: ${amazon_gunpla_scale}`);
  console.log(`Gunpla Name: ${amazon_gunpla_name}`);

  // 検索文字列の作成
  // キット名： ${GRADE} ${SCALE} ${NAME}
  // E.G
  // - HGUC 1/144 Ξガンダム
  // - RG 1/144 νガンダム
  // - MG 1/100 リック･ドム

  // 検索するために整形
  // scale から「スケール」を除去
  amazon_gunpla_scale = amazon_gunpla_scale.replace('スケール', '');

  // 名前に括弧が付いているものは、括弧を除外して検索する。
  // E.G
  // 'HGUC 1/144 Ξガンダム(クスィーガンダム)' の場合 'HGUC 1/144 Ξガンダム'
  var search_string = ""
  if (amazon_gunpla_name.match(/\(.+\)/gi) !== null) {
    amazon_gunpla_name = amazon_gunpla_name.replace(/\(.+\)/, '');
  }
  search_string = amazon_gunpla_grade + ' ' + amazon_gunpla_scale + ' ' + amazon_gunpla_name
  console.log(`Search Strings: ${search_string}`);

  // バンダイホビーサイトから情報を取得
  url = "https://bandai-hobby.net/item_all/?chara=&sort=new&brand=&online=0&jancode=&sword=" + encodeURI(search_string)
  res = await fetch(url)
  text = await res.text()
  console.log(`Get info from bandai-hobby.net`);

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {text: text}, function(response) {
      console.log("received " + response.farewell + " from content.js'");
    });
  });
}
