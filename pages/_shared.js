// ═══════════════════════════════════════════════
// KINGDOM WARS — 공통 헤더/푸터/i18n (4개국어)
// ═══════════════════════════════════════════════
const KW_I18N = {
  ko: {
    nav_home:"홈", nav_play:"게임 시작", nav_about:"소개", nav_how:"플레이 방법", nav_terms:"이용약관", nav_privacy:"개인정보",
    foot_tagline:"달을 정복하라 — Web3 전략 정복전",
    foot_game:"게임", foot_info:"정보", foot_legal:"법적 고지", foot_lang:"언어",
    foot_rights:"© 2027 KINGDOM WARS. All rights reserved.",
    foot_disclaimer:"본 게임은 오락 목적의 시뮬레이션이며 실제 우주 정책과 무관합니다.",
    back_home:"← 홈으로",
  },
  en: {
    nav_home:"Home", nav_play:"Play", nav_about:"About", nav_how:"How to Play", nav_terms:"Terms", nav_privacy:"Privacy",
    foot_tagline:"Conquer the Moon — Web3 Strategy Warfare",
    foot_game:"Game", foot_info:"Info", foot_legal:"Legal", foot_lang:"Language",
    foot_rights:"© 2027 KINGDOM WARS. All rights reserved.",
    foot_disclaimer:"This game is an entertainment simulation and unrelated to real space policy.",
    back_home:"← Home",
  },
  ja: {
    nav_home:"ホーム", nav_play:"プレイ", nav_about:"概要", nav_how:"遊び方", nav_terms:"利用規約", nav_privacy:"プライバシー",
    foot_tagline:"月を征服せよ — Web3戦略征服戦",
    foot_game:"ゲーム", foot_info:"情報", foot_legal:"法的事項", foot_lang:"言語",
    foot_rights:"© 2027 KINGDOM WARS. All rights reserved.",
    foot_disclaimer:"本ゲームは娯楽目的のシミュレーションであり、実際の宇宙政策とは無関係です。",
    back_home:"← ホーム",
  },
  zh: {
    nav_home:"主页", nav_play:"开始游戏", nav_about:"关于", nav_how:"游戏玩法", nav_terms:"服务条款", nav_privacy:"隐私政策",
    foot_tagline:"征服月球 — Web3策略征服战",
    foot_game:"游戏", foot_info:"信息", foot_legal:"法律", foot_lang:"语言",
    foot_rights:"© 2027 KINGDOM WARS. 保留所有权利。",
    foot_disclaimer:"本游戏为娱乐目的的模拟，与实际太空政策无关。",
    back_home:"← 主页",
  },
};

function kwGetLang(){
  return localStorage.getItem("kw_lang") || (navigator.language||"en").slice(0,2).replace(/^(?!ko|en|ja|zh).*/,"en") || "en";
}
function kwSetLang(l){
  localStorage.setItem("kw_lang", l);
  kwRenderShell();
  if(typeof kwRenderPage==="function") kwRenderPage(l);
}
function kwT(k){
  const l=kwGetLang();
  return (KW_I18N[l]||KW_I18N.en)[k] || KW_I18N.en[k] || k;
}

function kwRenderShell(){
  const l=kwGetLang();
  // 헤더
  const hdr=document.getElementById("kw-header");
  if(hdr){
    hdr.innerHTML=`
      <a href="index.html" class="kw-logo"><img src="assets/logo.png" alt="KINGDOM WARS" onerror="this.outerHTML='<span>KINGDOM WARS</span>'"/></a>
      <nav class="kw-nav">
        <a href="index.html">${kwT("nav_home")}</a>
        <a href="about.html">${kwT("nav_about")}</a>
        <a href="how_to_play.html">${kwT("nav_how")}</a>
        <a href="terms.html">${kwT("nav_terms")}</a>
        <a href="privacy.html">${kwT("nav_privacy")}</a>
      </nav>
      <div class="kw-nav-right">
        <div class="kw-langs">
          ${["ko","en","ja","zh"].map(x=>`<button class="kw-lb ${x===l?'active':''}" onclick="kwSetLang('${x}')">${({ko:'KR',en:'US',ja:'JP',zh:'CN'})[x]}</button>`).join("")}
        </div>
        <a href="index.html" class="kw-play-btn">🚀 ${kwT("nav_play")}</a>
      </div>
      <button class="kw-burger" onclick="document.getElementById('kw-header').classList.toggle('open')">☰</button>
    `;
  }
  // 푸터
  const ftr=document.getElementById("kw-footer");
  if(ftr){
    ftr.innerHTML=`
      <div class="kw-foot-grid">
        <div class="kw-foot-brand">
          <img src="assets/logo.png" alt="KW" onerror="this.style.display='none'"/>
          <div class="kw-foot-tag">${kwT("foot_tagline")}</div>
        </div>
        <div class="kw-foot-col">
          <div class="kw-foot-h">${kwT("foot_info")}</div>
          <a href="about.html">${kwT("nav_about")}</a>
          <a href="how_to_play.html">${kwT("nav_how")}</a>
        </div>
        <div class="kw-foot-col">
          <div class="kw-foot-h">${kwT("foot_legal")}</div>
          <a href="terms.html">${kwT("nav_terms")}</a>
          <a href="privacy.html">${kwT("nav_privacy")}</a>
        </div>
        <div class="kw-foot-col">
          <div class="kw-foot-h">${kwT("foot_lang")}</div>
          ${["ko","en","ja","zh"].map(x=>`<a href="#" onclick="kwSetLang('${x}');return false" class="${x===l?'active':''}">${({ko:'한국어',en:'English',ja:'日本語',zh:'中文'})[x]}</a>`).join("")}
        </div>
      </div>
      <div class="kw-foot-bottom">
        <div>${kwT("foot_rights")}</div>
        <div class="kw-foot-disc">${kwT("foot_disclaimer")}</div>
      </div>
    `;
  }
  document.documentElement.lang=l;
}
document.addEventListener("DOMContentLoaded",()=>{kwRenderShell();if(typeof kwRenderPage==="function")kwRenderPage(kwGetLang());});
