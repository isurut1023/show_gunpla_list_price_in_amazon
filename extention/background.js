console.log('start')

chrome.action.onClicked.addListener((tab) => {
  console.log('onClicked start')

  getCurrentTitle()
});

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
