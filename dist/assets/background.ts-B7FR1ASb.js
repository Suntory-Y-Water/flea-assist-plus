let t,n=0;chrome.runtime.onMessage.addListener(async(e,o,r)=>{if(e.action==="startListings")return console.log("再出品処理開始のメッセージを受信しました。"),t=e.selectors,n=0,t.length>0&&(console.log("商品の再出品を開始します。"),s(t[n])),r(),!0});const s=e=>{chrome.tabs.query({active:!0,currentWindow:!0},o=>{o.length>0&&o[0].id!==void 0&&chrome.tabs.sendMessage(o[0].id,{action:"cloneAndDeleteItem",selector:e})})};chrome.tabs.onRemoved.addListener((e,o)=>{++n<t.length?(console.log(`${n}番目の商品を再出品します。`),setTimeout(()=>{s(t[n])},1e3)):console.log("全ての商品を再出品しました。")});
