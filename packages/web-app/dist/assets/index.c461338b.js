var e=Object.defineProperty,t=Object.defineProperties,a=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable,s=(t,a,r)=>a in t?e(t,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[a]=r,c=(e,t)=>{for(var a in t||(t={}))n.call(t,a)&&s(e,a,t[a]);if(r)for(var a of r(t))o.call(t,a)&&s(e,a,t[a]);return e},i=(e,r)=>t(e,a(r));import{r as l,R as d,B as p,C as u,a as m}from"./vendor.9281f2be.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const a of e)if("childList"===a.type)for(const e of a.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const f="https://xunfei-audio.vercel.app",h="41ac2892",y=e=>{let t=u.MD5(h+e).toString(),a=u.HmacSHA1(t,"476dbac45bca3f32bba334f702e3bc4f");return u.enc.Base64.stringify(a)};class g{constructor(e=""){this.__ch=e,this.__ch="aaaaaaaaa`"}getNextSliceId(){let e=this.__ch,t=e.length-1;for(;t>=0;){let a=e[t];if("z"!==a){e=e.slice(0,t)+String.fromCharCode(a.charCodeAt(0)+1)+e.slice(t+1);break}e=e.slice(0,t)+"a"+e.slice(t+1),t--}return this.__ch=e,this.__ch}}const w=()=>{const[e,t]=l.exports.useState(null),[a,r]=l.exports.useState(null),[n,o]=l.exports.useState(!1),s=(e=>{const[t,a]=l.exports.useState({current:!1}),r=l.exports.useCallback((()=>{a({current:!0})}),[t]);return l.exports.useEffect((()=>{t.current&&a({current:!1})}),[t]),l.exports.useEffect((()=>{t.current&&e()})),r})((async()=>{const e=Array.from(a);for(let r=0;r<e.length;r++){const n=Math.floor(Date.now()/1e3),s=y(n),l=new g,d=()=>new Promise((async(e,t)=>{const o=await(l={method:"POST",mode:"cors",body:new URLSearchParams({app_id:h,signa:s,ts:String(n),file_len:String(a[r].size),file_name:a[r].name,slice_num:String(Math.ceil(a[r].size/1048576))})},fetch(`${f}/api/prepare`,l).then((e=>e.json())));var l;0===o.ok?e(o):t(i(c({},o),{stack:"prepare"}))})),p=t=>new Promise((async(a,o)=>{let s=0;const d=async()=>{const a=e[r].size<1048576?e[r].size:1048576,o=s+a,c=new FormData;console.log(`fileLen:: ${e[r].size} FILE_PIECE_SICE:: 1048576 start:: ${s} end:: ${o}`),c.append("app_id",h),c.append("ts",String(n)),c.append("signa",y(n)),c.append("task_id",t),c.append("slice_id",l.getNextSliceId()),c.append("content",e[r].slice(s,o<e[r].size?o:e[r].size));let i=await(p={method:"POST",mode:"cors",body:c},fetch(`${f}/api/upload`,p).then((e=>e.json())));var p;return s=o,o>1048576?i:await d()},p=await d();0===p.ok?a(p):o(i(c({},p),{stack:"upload"}))})),u=e=>new Promise((async(t,a)=>{const r=await(o={method:"POST",mode:"cors",body:new URLSearchParams({app_id:h,signa:s,ts:String(n),task_id:e})},fetch(`${f}/api/merge`,o).then((e=>e.json())));var o;0===r.ok?t(r):a(i(c({},r),{stack:"merge"}))})),m=e=>new Promise((async(t,a)=>{const r=setInterval((async()=>{var o;const l=await(d={method:"POST",mode:"cors",body:new URLSearchParams({app_id:h,signa:s,ts:String(n),task_id:e})},fetch(`${f}/api/getProgress`,d).then((e=>e.json())));var d;0===l.ok?9===(null==(o=JSON.parse(l.data))?void 0:o.status)&&(t(l),clearInterval(r)):(clearInterval(r),a(i(c({},l),{stack:"getProgress"})))}),5e3)})),w=e=>new Promise((async(t,a)=>{const r=await(o={method:"POST",mode:"cors",body:new URLSearchParams({app_id:h,signa:s,ts:String(n),task_id:e})},fetch(`${f}/api/getResult`,o).then((e=>e.json())));var o;0===r.ok?t(r):a(i(c({},r),{stack:"getResult"}))}));try{const e=await d();await p(e.data),await u(e.data),await m(e.data);const t=await w(e.data),a=document.createElement("a"),r=document.querySelector("body"),n=new Blob([t.data]);a.href=window.URL.createObjectURL(n),a.download="audio_to_file.txt",a.style.display="none",r.appendChild(a),a.click(),r.removeChild(a),window.URL.revokeObjectURL(a.href)}catch(t){console.error(t)}o(!1)}})),u=async()=>{const e=document.createElement("input");e.type="file",e.accept="audio/*",e.multiple=!0,e.click(),e.onchange=function(e){o(!0),t((e=>null===e?[this.files]:[...e,this.files])),r(this.files),s()}};return d.createElement(d.Fragment,null,d.createElement(p,{variant:"contained",onClick:()=>u(),disabled:n},"上传文件"),e&&e.map((e=>Array.from(e).map(((e,t)=>d.createElement("div",{key:t},e.name))))))};m.render(d.createElement(d.StrictMode,null,d.createElement(w,null)),document.getElementById("root"));
