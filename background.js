chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "startExport") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(tabs[0].id, {file: 'content.js'}, function() {
        if (chrome.runtime.lastError) {
          sendResponse({error: "无法注入内容脚本: " + chrome.runtime.lastError.message});
        } else {
          chrome.tabs.sendMessage(tabs[0].id, {action: "getData"}, function(response) {
            if (chrome.runtime.lastError) {
              sendResponse({error: "无法与内容脚本通信: " + chrome.runtime.lastError.message});
            } else if (response && response.data) {
              downloadCSV(response.data);
              sendResponse({success: true});
            } else {
              sendResponse({error: "没有收到数据"});
            }
          });
        }
      });
    });
    return true; // 保持消息通道开放
  }
});

function downloadCSV(data) {
  const blob = new Blob(["\ufeff" + data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url: url,
    filename: 'product_hunt_export.csv',
    saveAs: true
  });
}