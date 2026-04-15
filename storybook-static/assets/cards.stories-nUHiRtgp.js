import{e as ve,m as Te,a as xe,g as A,c as Se}from"./mockBuilder-4X3ngmTr.js";const Le=1584,Ae={xl:5,lg:4,md:3,sm:3,xsl:2,xs:2},Ee={xl:3,lg:4,md:4,sm:5,xsl:10,xs:10},w={xl:{padding:72,gap:24},lg:{padding:60,gap:24},md:{padding:42,gap:24},sm:{padding:36,gap:24},xsl:{padding:12,gap:12},xs:{padding:12,gap:12}};function fe(){const e=window.innerWidth;return e>=1584?"xl":e>=1200?"lg":e>=992?"md":e>=768?"sm":e>=576?"xsl":"xs"}function Me(e={}){const t={...Ae,...e};return function(o,s){const n=t[s]||t.lg;return o>=n}}function $e(e={}){const t={...Ee,...e};return function(o){const s=t[o]||t.lg,n=w[o]||w.lg,{padding:i,gap:c}=n,l=((Math.min(window.innerWidth,Le)-i*2-c*11)/12).toFixed(2),d=c*(s-1);return l*s+d}}function O(e,t){console.log("equalizeCardHeights",t);const r=e.querySelectorAll(t);if(r.length===0)return;r.forEach(s=>{s.style.height=""});let o=0;r.forEach(s=>{const n=s.offsetHeight;n>o&&(o=n)}),console.log("maxHeight",o),o>0&&r.forEach(s=>{s.style.height=`${o}px`})}function H(e,t,r,o){if(console.log("updateScrollButtons"),!e||!t||!r){console.log("missing elements in updateScrollButtons");return}const{scrollLeft:s,scrollWidth:n,clientWidth:i}=e;console.log("scroll info",{scrollLeft:s,scrollWidth:n,clientWidth:i});const c=n>i;if(!c){t.disabled=!0,r.disabled=!0,o&&(o.style.width="100%",o.style.left="0%"),console.log("no scroll needed");return}const u=s<=1,l=s+i>=n-1;if(t.disabled=u,r.disabled=l,o){const d=n-i,a=d>0?s/d:0,h=i/n*100,C=100-h,m=a*C;o.style.width=`${h}%`,o.style.left=`${m}%`,console.log("scrollbar thumb",{thumbWidthPercent:h,thumbLeft:m})}console.log("button states",{isAtStart:u,isAtEnd:l,hasScroll:c})}function _(e,t){var d,a;console.log("scrollCarousel","direction",t);const r=fe(),o=e.scrollLeft<=0,s=Math.abs(e.scrollLeft-(e.scrollWidth-e.clientWidth))<1,n=o||s?((d=w[r])==null?void 0:d.padding)||w.lg.padding:0,i=e.querySelector(":scope .carousel-item");if(!i)return;const c=i.offsetWidth,u=((a=w[r])==null?void 0:a.gap)||w.lg.gap,l=(c+u+n)*t;console.log("scroll amount",l),e.scrollBy({left:l,behavior:"smooth"})}function De(e="card"){return`
    <div class="carousel-row-2 ${e}-row-2">
      <div class="carousel-scrollbar-container ${e}-scrollbar-container">
        <div class="carousel-scrollbar ${e}-scrollbar">
          <div class="carousel-scrollbar-thumb ${e}-scrollbar-thumb"></div>
        </div>
      </div>
      <div class="carousel-controls ${e}-controls">
        <button class="carousel-scroll-btn carousel-scroll-prev ${e}-scroll-btn ${e}-scroll-prev" aria-label="Scroll left" disabled>
          <i class="gel-icon gel-icon-arrow-left gel-icon-md" aria-hidden="true"></i>
        </button>
        <button class="carousel-scroll-btn carousel-scroll-next ${e}-scroll-btn ${e}-scroll-next" aria-label="Scroll right">
          <i class="gel-icon gel-icon-arrow-right gel-icon-md" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `}function He(e,t,r={}){const{isStacked:o=!1}=r;return`
    <div class="carousel-block-container ${e}-block-container${o?` ${e}-stacked`:""}">
      <div class="carousel-list ${e}-row-1">
        <div class="carousel-list-padding ${e}-list-padding">
          <ul class="${e}-list" role="list" tabindex="0">
            ${t}
          </ul>
        </div>
      </div>
      ${De(e)}
    </div>
  `}function Fe(e,t,r={}){console.log("initializeCarousel","itemCount:",t);const{isStacked:o=!1,equalizeHeights:s=!1,carouselThresholds:n,carouselItemSpans:i,canCarouselItemGrow:c=!1}=r,u=Me(n),l=$e(i),d=e.querySelector(".carousel-block-container"),a=e.querySelector(".carousel-list"),h=e.querySelector(".carousel-scroll-prev"),C=e.querySelector(".carousel-scroll-next"),m=e.querySelector(".carousel-scrollbar-thumb"),y=e.querySelector(".carousel-scrollbar");if(!d||!a||!h||!C){console.log("Required carousel elements not found");return}function we(g){const f=l(g);a.querySelectorAll(".carousel-item").forEach(p=>{p.style.flex=`${c?"1":"0"} 0 ${f}px`})}function I(){console.log("updateCarouselVisibility");const g=fe();we(g);const f=!o&&u(t,g);console.log("carousel state",{breakpoint:g,itemCount:t,showCarousel:f,isStacked:o}),d&&d.classList.toggle("carousel-mode",f),f?requestAnimationFrame(()=>{s&&O(e,".carousel-item"),H(a,h,C,m)}):s&&requestAnimationFrame(()=>{O(e,".carousel-item")})}if(I(),h.addEventListener("click",()=>{console.log("prev button clicked"),_(a,-1)}),C.addEventListener("click",()=>{console.log("next button clicked"),_(a,1)}),a.addEventListener("scroll",()=>{console.log("list scrolled"),H(a,h,C,m)}),y&&m){let g=!1,f=0,E=0;m.addEventListener("mousedown",p=>{g=!0,f=p.clientX,E=a.scrollLeft,m.style.cursor="grabbing",p.preventDefault()}),document.addEventListener("mousemove",p=>{if(!g)return;const M=p.clientX-f,$=y.offsetWidth,D=a.scrollWidth/$;a.scrollLeft=E+M*D}),document.addEventListener("mouseup",()=>{g&&(g=!1,m.style.cursor="grab")}),y.addEventListener("click",p=>{if(p.target===y){const M=y.getBoundingClientRect(),$=p.clientX-M.left,D=y.offsetWidth,ke=a.scrollWidth/D;a.scrollLeft=$*ke}})}let R;window.addEventListener("resize",()=>{clearTimeout(R),R=setTimeout(()=>{console.log("window resized"),I()},150)});const be=ve(()=>{console.log("list dimensions changed (debounced)"),H(a,h,C,m)},100);new ResizeObserver(()=>{be()}).observe(a)}const We={xs:1,xsl:1,sm:99,md:99,lg:99,xl:99},qe={xs:10,xsl:8,sm:4,md:4,lg:4,xl:3};function Ie(e){if(!e)return[];const t=[...e.querySelectorAll("a")];if(t.length)return t.map(o=>({text:(o.textContent||"").trim(),href:o.getAttribute("href")||"#"}));const r=(e.textContent||"").trim();return r?[{text:r,href:"#"}]:[]}function Re(e){console.log("extractCardFromRow","row",e);const t=[...e.children];if(t.length<4)return console.log("insufficient cells, skipping row"),null;const r=xe(t[0]);console.log("icon",r);const o=A(t[1])||"",s=o?o.split(",").map(l=>l.trim()).filter(Boolean):[];console.log("tags",s);const n=A(t[2])||"";console.log("title",n);const i=t[3]&&A(t[3])||"";console.log("subtitle",i);const c=t[4]&&A(t[4])||"";console.log("description",c);const u=Ie(t[5]||null);return console.log("ctas",u),n?{icon:r,tags:s,title:n,subtitle:i,description:c,ctas:u,row:e}:(console.log("missing title, skipping row"),null)}function Oe(e){console.log("extractData");const t=[...e.children];console.log("totalRows",t.length);const r=t.map(Re).filter(Boolean);return console.log("extractedCards",r.length),{cards:r}}function _e(e){return e.length?`<div class="card-tags">${e.map(r=>`<span class="card-tag">${r}</span>`).join("")}</div>`:""}function Be(e){if(!e.length)return"";const[t,r]=e;let o=`<a href="${t.href}" class="button primary btn-md">${t.text}</a>`;return r&&(o+=`<a href="${r.href}" class="button outline btn-md">${r.text}</a>`),`<div class="card-ctas">${o}</div>`}function ze(e){var s;console.log("renderCardHTML",e.title);const t=(s=e.icon)!=null&&s.src?`<div class="card-icon-container" aria-hidden="true">
        <img src="${e.icon.src}" alt="${e.icon.alt}" class="card-icon" width="24" height="24" loading="lazy" />
      </div>`:"",r=e.subtitle?`<p class="card-subtitle">${e.subtitle}</p>`:"",o=e.description?`<p class="card-description">${e.description}</p>`:"";return`
    <li class="carousel-item card-item">
      <article class="card">
        ${t}
        ${_e(e.tags)}
        <h3 class="card-title">${e.title}</h3>
        ${r}
        ${o}
        ${Be(e.ctas)}
      </article>
    </li>
  `}function Ne(e){console.log("renderHTML","cardCount",e.cards.length);const t=e.cards.map(ze).join("");return He("card",t)}function Ge(e){console.log("decorate cards");const t=Oe(e);e.innerHTML=Ne(t);const r=e.querySelectorAll(".card-item");t.cards.forEach((o,s)=>{r[s]&&o.row&&Te(o.row,r[s])}),Fe(e,t.cards.length,{carouselThresholds:We,carouselItemSpans:qe,equalizeHeights:!0})}const F=`<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Crect width='18' height='14' x='3' y='5' rx='2' fill='none' stroke='%23002855' stroke-width='2'/%3E%3Cpath d='M3 9h18' stroke='%23002855' stroke-width='2'/%3E%3C/svg%3E" alt="Transaction account icon" width="24" height="24" />`,W=`<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' fill='none' stroke='%23002855' stroke-width='2' stroke-linejoin='round'/%3E%3Cpolyline points='9,22 9,12 15,12 15,22' stroke='%23002855' stroke-width='2' fill='none'/%3E%3C/svg%3E" alt="Home loans icon" width="24" height="24" />`,Ce=`<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Crect width='20' height='14' x='2' y='5' rx='2' fill='none' stroke='%23002855' stroke-width='2'/%3E%3Cpath d='M2 10h20' stroke='%23002855' stroke-width='2'/%3E%3C/svg%3E" alt="Credit card icon" width="24" height="24" />`,q=[[F,"Popular, No Fees","Transaction Account","$0 monthly fees","Everyday banking made simple with no monthly fees and unlimited transactions.",'<a href="/accounts/transaction">Open Account</a><a href="/accounts/transaction/learn-more">Learn More</a>'],[W,"Featured, Low Rate","Home Loans","From 5.99% p.a.","Competitive rates and flexible repayment options to help you buy your dream home.",'<a href="/loans/home">Apply Now</a>'],[Ce,"Rewards","Credit Cards","Up to 55 days interest free","Enjoy rewards, insurance and interest-free days on purchases.",'<a href="/cards/compare">Compare Cards</a>']],Ue=q,Pe=[[F,"Popular","Savings Account","4.75% p.a. interest","Earn a competitive interest rate with no monthly fees on our everyday savings account.",'<a href="/accounts/savings">Open Account</a>'],[W,"Fixed Rate","Fixed Rate Loan","From 6.29% p.a.","Lock in a competitive rate for 1, 2, or 3 years for budget certainty on your home loan.",'<a href="/loans/fixed">Apply Now</a>'],[Ce,"","Personal Loan","","Flexible personal loans from $5,000 to $50,000 with no early repayment fees.",'<a href="/loans/personal">Apply Now</a>']],ye=[[F,"","Everyday Account","","A simple account for day-to-day banking with no monthly fees.",'<a href="/accounts/everyday">Learn More</a>'],[W,"","Investment Loan","","Grow your property portfolio with a flexible investment loan.",'<a href="/loans/investment">Learn More</a>']],Xe=q.slice(0,2);function b(e,{dark:t=!1}={}){const r=Se("cards",e);return t&&r.classList.add("dark"),Ge(r),r}const Ze={title:"Blocks/Cards",tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:`
## Cards

Product/service card grid. Each card surfaces an icon, badge tags, title,
highlighted subtitle, description, and 1–2 CTA buttons.

**Layout:**
- Desktop (≥ 768px): CSS Grid — \`repeat(auto-fit, minmax(280px, 1fr))\`
- Mobile (< 768px): horizontal scrolling carousel via \`scripts/utility/carousel.js\`

**Dark mode:** Add the \`dark\` CSS class to the block element.  
In dark mode the primary CTA button inverts to gold-light background with near-black text.

**Figma:**
- [Light node 17:6](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=17-6)
- [Dark node 22:372](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=22-372)
        `}}}},k={name:"Light Mode (Figma 17:6)",render:()=>b(q),parameters:{docs:{description:{story:"Three-card light mode layout matching Figma node 17:6. Transaction Account has both a primary and an outline button. Home Loans and Credit Cards have a single primary CTA."}}}},v={name:"Dark Mode (Figma 22:372)",render:()=>b(Ue,{dark:!0}),parameters:{backgrounds:{default:"dark"},docs:{description:{story:"Dark mode variant matching Figma node 22:372. Cards use a dark navy background. Buttons use gold-light; primary button text is near-black for WCAG contrast."}}}},T={name:"Single CTA per card",render:()=>b(Pe),parameters:{docs:{description:{story:"Cards with only one CTA button each. Tests that the flex layout in `.card-ctas` behaves correctly."}}}},x={name:"Minimal (no tags or subtitle)",render:()=>b(ye),parameters:{docs:{description:{story:"Cards using only required fields: icon, title, description, and CTA. Tags and subtitle cells are empty."}}}},S={name:"Two cards",render:()=>b(Xe),parameters:{docs:{description:{story:"Two-card layout. Verifies `auto-fit` grid with fewer items and equal card heights."}}}},L={name:"Dark — Minimal",render:()=>b(ye,{dark:!0}),parameters:{backgrounds:{default:"dark"},docs:{description:{story:"Dark mode with minimal card content."}}}};var B,z,N,G,U;k.parameters={...k.parameters,docs:{...(B=k.parameters)==null?void 0:B.docs,source:{originalSource:`{
  name: 'Light Mode (Figma 17:6)',
  render: () => createCards(mocks.lightCards),
  parameters: {
    docs: {
      description: {
        story: 'Three-card light mode layout matching Figma node 17:6. ' + 'Transaction Account has both a primary and an outline button. ' + 'Home Loans and Credit Cards have a single primary CTA.'
      }
    }
  }
}`,...(N=(z=k.parameters)==null?void 0:z.docs)==null?void 0:N.source},description:{story:`Default light mode — 3 cards (Figma node 17:6).\r
Transaction Account (2 CTAs), Home Loans (1 CTA), Credit Cards (1 CTA).`,...(U=(G=k.parameters)==null?void 0:G.docs)==null?void 0:U.description}}};var P,X,j,V,Z;v.parameters={...v.parameters,docs:{...(P=v.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'Dark Mode (Figma 22:372)',
  render: () => createCards(mocks.darkCards, {
    dark: true
  }),
  parameters: {
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        story: 'Dark mode variant matching Figma node 22:372. ' + 'Cards use a dark navy background. Buttons use gold-light; ' + 'primary button text is near-black for WCAG contrast.'
      }
    }
  }
}`,...(j=(X=v.parameters)==null?void 0:X.docs)==null?void 0:j.source},description:{story:`Dark mode — same 3 cards with dark theme applied (Figma node 22:372).\r
Primary buttons invert to gold-light background + near-black text.`,...(Z=(V=v.parameters)==null?void 0:V.docs)==null?void 0:Z.description}}};var J,K,Q,Y,ee;T.parameters={...T.parameters,docs:{...(J=T.parameters)==null?void 0:J.docs,source:{originalSource:`{
  name: 'Single CTA per card',
  render: () => createCards(mocks.singleCtaCards),
  parameters: {
    docs: {
      description: {
        story: 'Cards with only one CTA button each. Tests that the flex layout in \`.card-ctas\` behaves correctly.'
      }
    }
  }
}`,...(Q=(K=T.parameters)==null?void 0:K.docs)==null?void 0:Q.source},description:{story:"All single-CTA cards — no outline button.",...(ee=(Y=T.parameters)==null?void 0:Y.docs)==null?void 0:ee.description}}};var te,re,oe,se,ne;x.parameters={...x.parameters,docs:{...(te=x.parameters)==null?void 0:te.docs,source:{originalSource:`{
  name: 'Minimal (no tags or subtitle)',
  render: () => createCards(mocks.minimalCards),
  parameters: {
    docs: {
      description: {
        story: 'Cards using only required fields: icon, title, description, and CTA. Tags and subtitle cells are empty.'
      }
    }
  }
}`,...(oe=(re=x.parameters)==null?void 0:re.docs)==null?void 0:oe.source},description:{story:"Minimal cards — no tags, no subtitle, just required fields.",...(ne=(se=x.parameters)==null?void 0:se.docs)==null?void 0:ne.description}}};var ae,ie,ce,le,de;S.parameters={...S.parameters,docs:{...(ae=S.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  name: 'Two cards',
  render: () => createCards(mocks.twoCards),
  parameters: {
    docs: {
      description: {
        story: 'Two-card layout. Verifies \`auto-fit\` grid with fewer items and equal card heights.'
      }
    }
  }
}`,...(ce=(ie=S.parameters)==null?void 0:ie.docs)==null?void 0:ce.source},description:{story:"Two cards — verifies grid with fewer than three items.",...(de=(le=S.parameters)==null?void 0:le.docs)==null?void 0:de.description}}};var ue,me,ge,he,pe;L.parameters={...L.parameters,docs:{...(ue=L.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  name: 'Dark — Minimal',
  render: () => createCards(mocks.minimalCards, {
    dark: true
  }),
  parameters: {
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        story: 'Dark mode with minimal card content.'
      }
    }
  }
}`,...(ge=(me=L.parameters)==null?void 0:me.docs)==null?void 0:ge.source},description:{story:"Dark mode — minimal cards (no tags, no subtitle).",...(pe=(he=L.parameters)==null?void 0:he.docs)==null?void 0:pe.description}}};const Je=["Default","Dark","SingleCTA","Minimal","TwoCards","DarkMinimal"];export{v as Dark,L as DarkMinimal,k as Default,x as Minimal,T as SingleCTA,S as TwoCards,Je as __namedExportsOrder,Ze as default};
