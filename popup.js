const translations = {
  en: {
    title: "Product Hunt Exporter",
    exportButton: "Export Data",
    header: "Rank,Product Name,Tagline,Website Link,Votes,Tags,Promoted\n"
  },
  zh: {
    title: "Product Hunt 导出工具",
    exportButton: "导出数据",
    header: "排名,产品名称,标语,网站链接,投票数,标签,是否推广\n"
  },
  ja: {
    title: "Product Hunt エクスポーター",
    exportButton: "データをエクスポート",
    header: "ランク,製品名,タグライン,ウェブサイトリンク,投票数,タグ,プロモーション\n"
  }
};

let currentLanguage = 'en';

function updateLanguage() {
  const lang = document.getElementById('languageSelect').value;
  currentLanguage = lang;
  document.getElementById('title').textContent = translations[lang].title;
  document.getElementById('exportButton').textContent = translations[lang].exportButton;
}

document.getElementById('languageSelect').addEventListener('change', updateLanguage);

document.getElementById('exportButton').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getData", language: currentLanguage}, (response) => {
      if (response && response.data) {
        const blob = new Blob([response.data], {type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `product_hunt_data_${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
      }
    });
  });
});

updateLanguage();