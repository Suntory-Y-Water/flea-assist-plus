import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as s,T as d}from"./inversify.config-CFYDU77S.js";const r=s.get(d.StorageService),c=s.get(d.LoggingService);document.addEventListener("DOMContentLoaded",async()=>{const e=await r.getFromChromeStorage("notRelistItems");c.log("データを取得しました。"),e&&e.itemList.length>0?(l(e),e.itemList.map(t=>console.log(`https://jp.mercari.com/item/${t.id}`))):c.log("データが存在しません。")});function l(e){const t=document.getElementById("item-list");t&&e.itemList.forEach(o=>{const n=document.createElement("div");n.classList.add("item");const m=document.createElement("img");m.src=o.thumbnail,n.appendChild(m);const a=document.createElement("div");a.classList.add("item-details");const i=document.createElement("a");i.href=`https://jp.mercari.com/item/${o.id}`,i.target="_blank",i.textContent=o.name,a.appendChild(i),n.appendChild(a),t.appendChild(n)})}
