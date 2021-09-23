// if (document.getElementById("getBandaiPrice") !== null) {
//   chrome.runtime.sendMessage({isComplete: "true"}, function(response) {
//   });
// }else {
//   chrome.runtime.sendMessage({isComplete: "false"}, function(response) {
//   });
// }

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("received " + request.message + " From backgroud.js")

    if (request.message === "isComplete") {
      if (document.getElementById("getBandaiPrice") !== null) {
        sendResponse({isComplete: "true"});
      }else {
        sendResponse({isComplete: "false"});
      }
    }else {
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

      // backgroud から受け取った html をパース
      parser = new DOMParser();
      html = parser.parseFromString(request.text, "text/html");
      console.log(`Search Result HTML: ${html}`);

      // バンダイホビーサイトの検索結果を取得
      result = html.getElementsByClassName('bhs_pdlist_sbs')[0]
      console.log(`Search Result: ${result}`);

      // 検索結果から商品名、価格、リンクを取得
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

      // Amazon ページに表示するテーブルの各列を作成
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
      element = document.getElementById('ppd');
    	element.insertAdjacentElement('afterend', tbl);

      // backgroud へレスポンス
      sendResponse({farewell: "complete"});
      console.log("Response to backgroud")
    }
    return
  }
);
