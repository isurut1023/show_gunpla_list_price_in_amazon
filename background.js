console.log('started background.js')

url = "https://4xdzlpnj1i.execute-api.ap-northeast-1.amazonaws.com/search_gunplas"


async function getCurrentTitle() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  console.log("Title: " + tab.title);
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
