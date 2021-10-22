console.log("started popup.js");

helloBackgound()

function helloBackgound() {
  console.log("send message to background.jp");
  chrome.runtime.sendMessage({
      greeting: "hello"
    },
    function(response) {
      console.log('response from background.js:',response.msg);
    });
  getResultFromBackgound()
}

// background.js から検索結果を受け取り popup.html に表示
function getResultFromBackgound() {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      createHTML(request.result['gunplas'])
      sendResponse({
        msg: "received responseFromAPI from background.js"
      });
      return request.result
    });
}

// HTML 生成
function createHTML(gunplas) {
  console.log("create html")

  // 再出荷日の情報の有無を確認
  reshipment_flag = ''
  for (const r of gunplas) {
    if (r['product']['reshipment_data'] != null) {
      reshipment_flag = 1
      break
    }
  }

  // プレミアムバンダイで予約・販売中もしくはその予定があるかどうか確認
  pbandai_flag = ''
  for (const r of gunplas) {
    if (r['product']['p-bandais'] != null) {
      p_bandai = r['product']['p-bandais'][0]
      if (!p_bandai['tag'].includes('ITEM_OUT_OF_STOCK') && !p_bandai['tag'].includes('ITEM_RESERVE_END')) {
        pbandai_flag = 1
        break
      }
    }
  }

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
  tHead = document.createElement("thead");
  tblBody = document.createElement("tbody");
  // テーブルヘッダー
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
  // 再出荷日の情報があればテーブルヘッダー「再出荷日」を追加
  if (pbandai_flag == 1) {
    th4 = document.createElement("th");
    th4.className = "reshipment_date";
    th4Text = document.createTextNode("プレミアムバンダイ");
    th4.appendChild(th4Text)
    row.appendChild(th4)
  }
  // テーブルヘッダーの作成
  tHead.appendChild(row);
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
  i = 0
  for (const p of gunplas) {
    r = p['product']
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
    if (r['no'] != '') {
      anchor.href = 'https://bandai-hobby.net/item/' + r['no'] + '/';
    }else if (r['p-bandais'][0]['no'] != '') {
      anchor.href = 'https://p-bandai.jp/item/item-' + r['p-bandais'][0]['no'] + '/';
    }
    anchor.target = "_blank"
    anchor.rel = "noopener noreferrer"
    td1.appendChild(anchor)
    // テキスト
    td1Text = document.createTextNode(r['product']);
    anchor.appendChild(td1Text)

    td1.appendChild(anchor)
    row.appendChild(td1)

    // カラム「価格」
    // x,xxx円（税込）に変換
    let price = String(r['price']).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + "円（税込）"
    td2 = document.createElement("td");
    td2.className = "price";
    td2Text = document.createTextNode(price);
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

    // カラム「プレミアムバンダイ」
    if (r['p-bandais'] != null) {
      p_bandai = r['p-bandais'][0]
      if (p_bandai['tag'].includes('ITEM_RESERVE_BEFORE')) {
        text = '予約開始前'
      }else if (p_bandai['tag'].includes('ITEM_SALE_BEFORE')) {
        text = '販売開始前'
      }else if (p_bandai['tag'].includes('ITEM_RESERVE')) {
        text = '予約受付中'
      }else if (p_bandai['tag'].includes('ITEM_OUT_OF_STOCK')) {
        text = '在庫なし'
      }else if (p_bandai['tag'].includes('ITEM_RESERVE_END')) {
        text = '予約終了'
      }else {
        text = '販売中'
      }
      anchor = document.createElement("a");
      anchor.href = 'https://p-bandai.jp/item/item-' + r['p-bandais'][0]['no'] + '/';
      anchor.target = "_blank"
      anchor.rel = "noopener noreferrer"
      td4 = document.createElement("td");
      td4.className = "p_bandai_status";
      td4Text = document.createTextNode(text);
      anchor.appendChild(td4Text)
      td4.appendChild(anchor)
      row.appendChild(td4)
    }else{
      td4 = document.createElement("td");
      td4.className = "p_bandai_status";
      td4Text = document.createTextNode('-');
      td4.appendChild(td4Text)
      row.appendChild(td4)
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
  loader = document.getElementById('loader');
  loader.remove();

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
