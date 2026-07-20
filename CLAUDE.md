# KINGDOM WARS — 프로젝트 가이드 (Claude Code용)

> 달의 49개 섹터를 정복하는 브라우저 전략 게임. 단일 HTML 파일 구조, 4개국어 지원, GitHub Pages 배포.

## 🔗 핵심 정보

| 항목 | 값 |
|---|---|
| 라이브 | https://kentkim0326.github.io/kingdom-wars/ |
| Vercel 미러 | https://kingdom-wars-puce.vercel.app (동일 repo 자동배포) |
| Repo | kentkim0326/kingdom-wars (main 브랜치, GH Pages legacy 모드) |
| 에셋 | https://raw.githubusercontent.com/kentkim0326/kingdom-wars/main/assets/ |
| 캐시 | Cache-Control max-age=600 (10분) — 배포 후 Ctrl+Shift+R 필요 |

## 📁 파일 구조

```
index.html          ← 게임 전체 (HTML+CSS+JS 단일 파일, ~176KB)
about.html          ← 소개 페이지 (4개국어)
how_to_play.html    ← 플레이 방법 (4개국어)
terms.html          ← 이용약관 (4개국어)
privacy.html        ← 개인정보 (4개국어)
pages/_shared.js    ← 부가페이지 공통 헤더/푸터/i18n (kwRenderShell, KW_I18N)
pages/_shared.css   ← 부가페이지 공통 스타일 (게임과 동일 디자인 토큰)
game.html/kw.html/v2.html ← 캐시우회용 사본 (배포시 동기화 선택)
assets/             ← slide1~11.jpg, ship1~6.png, mech1~5.png, logo.png 등
```

`index.html` 내부: `<script>` 블록 2개 — **두 번째가 게임 JS 본체**.

## 🌍 i18n 시스템 (매우 중요)

**2계층 구조:**
1. **`KW_LANG`** (ko/en/ja/zh) + `t(key)` — UI 고정 텍스트. `setLang(l)`이 `M` 매핑객체(id→키)로 DOM 갱신.
2. **`G_TR`** 사전 + `gTr(한글원문)` — 게임 데이터(유닛/스킬/국가/지명/미션/업적/이벤트/전리품). **렌더 시점에 번역**. 270+ 항목.

**규칙:**
- 새 사용자 노출 텍스트는 절대 한글 하드코딩 금지. `t()` 또는 `gTr()` 필수.
- `gTr`은 지명 접미사 처리함: "고요A" → "Tranquility A".
- 데이터 저장은 한글 원문 유지(`name:"전투기"`), **표시할 때만** `gTr(u.name)`.
- 사령관 이름(이준혁 등)은 국가별 현지명이므로 번역하지 않음. **칭호(title)만** 번역: `gTr(cmd.title.replace(/"/g,""))`.
- `setLang`은 활성 화면에 따라 renderN/renderUnits/renderMissions 재호출함.
- 검증법: EN/JA/ZH로 플레이 후 `document.body.innerText`에서 `/[가-힣]/` 검출 (사령관명 제외).

## 🚀 배포 방법 (GitHub API)

```python
import base64, json, urllib.request
TOKEN="<GITHUB_TOKEN>"; REPO="kentkim0326/kingdom-wars"
# 1) GET contents/index.html → sha
# 2) PUT contents/index.html {message, content: base64, sha}
# 3) POST pages/builds (빌드 트리거)
```
- 배포 전 필수: `node --check`로 JS 문법검증 (script 두번째 블록 추출).
- 배포 후 반영까지 2~3분 + 브라우저 캐시 10분.

## ⚠️ 과거에 잡은 치명적 버그 & 재발 방지 규칙

1. **중복 `@keyframes fadeUp`** — 두 번째 정의에 `translate(-50%,10px)`가 있어 모든 .fu 요소가 왼쪽으로 밀림. **애니메이션 keyframes 추가 시 기존 이름과 충돌 검사 필수.** (CSS `!important`보다 animation fill-mode가 우선함)
2. **`intro-click-layer`** — Kaikas(카카오지갑) 확장이 클릭을 가로채는 것 방지용 투명 레이어. **반드시 `#s-intro`의 screen-content 안에** 있어야 함. 밖에 두면 화면 전환 후에도 살아남아 모든 버튼 클릭을 흡수함.
3. **`switchView` index/id 버그** — 뷰가 view-0/view-2 2개뿐이라 forEach index(0,1)와 v(0,2)가 안 맞음. **ID 기반 매칭(`el.id==="view-"+v`) 유지.** goGame은 `show("s-game")` 직후 `switchView(2)` 명시 호출.
4. **화면 전환** — `#s-intro` 등에 CSS `display` 룰 추가 금지 (ID specificity가 .screen을 이겨 show() 파괴). 전환은 show()의 inline style로만.
5. **와이드 화면(2560px)** — `.battle-view`에 `display:flex;justify-content:center` 없으면 그리드가 좌상단에 쏠림. 레이아웃 수정 시 1440/2560/390px 모두 테스트.
6. **유닛 고갈** — 시작 전투기 5+구축함 2, 매 턴종료 전투기 1대 자동지급. 초기자원 He-3 3500/코인 1500. `initMap`이 count를 리셋하므로 SHIPS 정의만 바꾸면 무효.

## 🎮 게임 핵심 구조

- **맵**: 49섹터(7×7), 플레이어 시작 42, `SNAMES[]` 지명, `SEC_TYPES/SEC_RES` 자원
- **유닛**: `SHIPS`(5) `MECHS`(5) `ACES`(1), `ALL` 통합배열. rarity N/R/SR/UR
- **전투**: `clickSec→showSAO→openFM→launchFM→showBR`. 공격모드 direct/smart(+20%)/surround(인접+15%)
- **중독 엔진**: 킬스트릭(`getStreakMult` 연승당+8% max+60%), 등급(`calcGrade` S/A/B/C, S=2배), 루팅(`rollLoot/grantLoot` 유닛드랍 8%+), 크리티컬 15%×1.6, XP/레벨/업적10/미션, 통계(`showBattleStats`)
- **뉴스티커**: `loadNews(lang)` — Google News RSS 언어별 + allorigins.win 프록시, 폴백 우주뉴스, 10분 캐시
- **모바일**: `<700px`에서 lpanel 숨김 → `#munit-bar`(가로 유닛칩)가 유일한 유닛선택 수단. 절대 제거 금지.

## 🧪 테스트 (Playwright)

```bash
# 브라우저 위치: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
# import 이슈: 스크립트를 node_modules 폴더에 두고 실행
cd /path/with/playwright && node audit.mjs
```
E2E 시퀀스: `setLang(l)→goNation()→selN('Korea')→goCommander()→.cmd-card.click()→goGame()` 후 grid 49셀+크기>0 확인, 적 강제생성 후 `launchFM` 전투검증.
이미지 `onerror`의 "Cannot set properties of undefined (setting 'display')" 에러는 **무해** (file:// 환경 한정).

## 📐 디자인 토큰

```css
--bg:#03050e --panel:#07091a --border:#1a2a4a --accent:#00c8ff
--gold:#ffd700 --red:#ff3a3a --green:#00ff88 --purple:#aa44ff
--orange:#ff8800 --teal:#00ffcc --text:#d0e8ff --muted:#4a6a8a
```
부가페이지는 `pages/_shared.css`가 동일 토큰 사용. 언어 설정은 `localStorage("kw_lang")`로 게임↔페이지 공유.

## 🗺️ 로드맵 (미구현)

- MARS (81섹터), DEEP SPACE (120섹터) — 인트로에 예고만 있음
- 게임 인트로 화면 상단 헤더 추가 여부 검토 중 (현재는 하단 링크만)
