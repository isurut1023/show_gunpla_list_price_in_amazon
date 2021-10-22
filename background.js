console.log('started background.js')

importScripts("bandai_tag.js");

url = "https://4xdzlpnj1i.execute-api.ap-northeast-1.amazonaws.com/search_gunplas"


function replaceFullToHalf(str){
  return str.replace(/[！-～]/g, function(s){
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}


async function getCurrentTitle() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  console.log("Title: " + tab.title);

  text = replaceFullToHalf(tab.title);
  console.log(text)
  for (const keyword of gunpla_keywords) {
    if (text.includes(keyword)) {
      console.log(keyword)
      getGunpla(tab.title)
        .then(responseFromAPI => {
            JSON.stringify(responseFromAPI);
            console.log('responseFromAPI:',responseFromAPI)
            chrome.runtime.sendMessage({
                result: responseFromAPI
              },
              function(response) {
                console.log('response from popup.js:',response.msg);
              });
        })
        .catch(err => {
            console.log(err);
        })
      break
    }
  }
}


async function getGunpla(text) {
    const res = await fetch(url, {
                            method: 'POST',
                            body: text
                          });
    const responseFromAPI = await res.json();
    return responseFromAPI;
}


// popup.js からメッセージを受け取り処理開始
chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    getCurrentTitle()
    sendResponse({
      msg: "started background.js"
    });
    return
  });
