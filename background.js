chrome.runtime.onInstalled.addListener(() => {
	console.log("Extension Installed")
});

chrome.action.onClicked.addListener(function(tab) {
    chrome.scripting.insertCSS(
        {
          target: {tabId: tab.id},
          files: ["styles/style.css"]
        },
        () => { console.log('CSS Injected') });
    chrome.scripting.executeScript(
        {
          target: {tabId: tab.id},
          files: ['scripts/save-pin-data.js']
        },
        () => { console.log("Executed Script")});
        
});
