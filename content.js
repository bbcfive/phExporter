const translations = {
  en: {
    header: "Rank,Product Name,Tagline,Website Link,Votes,Tags,Promoted\n",
    notFound: "Not found"
  },
  zh: {
    header: "排名,产品名称,标语,网站链接,投票数,标签,是否推广\n",
    notFound: "未找到"
  },
  ja: {
    header: "ランク,製品名,タグライン,ウェブサイトリンク,投票数,タグ,プロモーション\n",
    notFound: "見つかりません"
  }
};

function extractProducts(lang) {
  const products = [];
  const productElements = document.querySelectorAll('.styles_item__Dk_nz, [data-test="product-item"]');
  
  console.log('找到 ' + productElements.length + ' 个潜在的产品元素');

  productElements.forEach((element, index) => {
    try {
      const nameElement = element.querySelector('a[data-test^="post-name-"] strong, [data-test="product-name"]');
      const taglineElement = element.querySelector('a[data-test^="post-name-"] span.opacity-50, [data-test="product-tagline"]');
      const linkElement = element.querySelector('a[data-test^="post-name-"], a[data-test="product-name"]');
      const votesElement = element.querySelector('.styles_voteCountItem__zwuqk, [data-test="vote-button"]');
      const tagsElements = element.querySelectorAll('.styles_extraInfo__Xs_5Y a.styles_underlinedLink__MUPq8, [data-test="product-topics"] a');
      const promotedElement = element.querySelector('.styles_promoted__Aq_Ol, [data-test="promoted-badge"]');
      
      const name = nameElement ? nameElement.textContent.trim() : translations[lang].notFound;
      const tagline = taglineElement ? (taglineElement.nextSibling ? taglineElement.nextSibling.textContent.trim() : taglineElement.textContent.trim()) : translations[lang].notFound;
      const link = linkElement ? linkElement.href : translations[lang].notFound;
      const votes = votesElement ? votesElement.textContent.trim().replace(/[^\d]/g, '') : '0';
      const tags = Array.from(tagsElements).map(tag => tag.textContent.trim()).join(', ');
      const isPromoted = promotedElement ? 'Yes' : 'No';
    
      products.push({
        rank: index + 1,
        name: name,
        tagline: tagline,
        link: link,
        votes: votes,
        tags: tags,
        promoted: isPromoted
      });

      console.log(`成功提取产品 #${index + 1}: ${name} (Promoted: ${isPromoted})`);
    } catch (error) {
      console.error(`提取产品 #${index + 1} 时出错:`, error);
    }
  });
  
  return products;
}

function convertToCSV(products, lang) {
  const rows = products.map(p => 
    `${p.rank},"${p.name.replace(/"/g, '""')}","${p.tagline.replace(/"/g, '""')}","${p.link}",${p.votes},"${p.tags.replace(/"/g, '""')}",${p.promoted}`
  ).join("\n");
  
  return translations[lang].header + rows;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getData") {
    console.log('收到数据请求');
    const products = extractProducts(request.language);
    console.log('提取到 ' + products.length + ' 个产品');
    const csv = convertToCSV(products, request.language);
    console.log('CSV 生成完成，长度: ' + csv.length);
    sendResponse({data: csv});
  }
  return true; // 保持消息通道开放
});

console.log('Product Hunt Exporter content script loaded');

// 添加这行代码来确认content script已经正确加载
console.log('Product Hunt Exporter content script fully loaded');