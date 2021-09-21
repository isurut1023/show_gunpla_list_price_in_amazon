// url = "https://bandai-hobby.net/item_all/?chara=&sort=new&brand=&online=0&jancode=&sword="
// res = fetch(url, {mode: 'no-cors'})
// console.log(res)

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['content.js']
  });
});
