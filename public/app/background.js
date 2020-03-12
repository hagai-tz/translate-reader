// chrome.runtime.onMessage.addListener(function(res, sender, sendResponse){
//     console.log(sender)
//   })

  chrome.browserAction.onClicked.addListener(function(tab){
        console.log(tab)
        let newUrl = "https://www.haaretz.co.il/"
    chrome.tabs.create({url: newUrl });

  })
