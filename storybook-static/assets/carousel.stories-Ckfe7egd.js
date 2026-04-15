import{m as We,g as F,a as je,c as Ue}from"./mockBuilder-4X3ngmTr.js";const ze=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
  <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`,Xe=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
  <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`,I=[["#002855","#003D7A"],["#D4AF37","#E8C968"],["#008B8B","#20B2AA"],["#0066CC","#3399FF"],["#10B981","#34D399"],["#8B5CF6","#A78BFA"],["#F59E0B","#FBBF24"],["#EC4899","#F472B6"]];function T(t){const e=t.replace(/^#/,"");return e.length===3?e.split("").map(s=>parseInt(s+s,16)):e.length===6?[parseInt(e.slice(0,2),16),parseInt(e.slice(2,4),16),parseInt(e.slice(4,6),16)]:null}function Ne(t,e,s=.5){const r=T(t)||[0,0,0],a=T(e)||[0,0,0];return[Math.round(r[0]+(a[0]-r[0])*s),Math.round(r[1]+(a[1]-r[1])*s),Math.round(r[2]+(a[2]-r[2])*s)]}function Ze([t,e,s]){return[t,e,s].reduce((r,a,n)=>{const i=a/255,d=i<=.04045?i/12.92:((i+.055)/1.055)**2.4;return r+d*[.2126,.7152,.0722][n]},0)}function A(t){const e=Ze(t);return(1+.05)/(e+.05)>=4.5?"#ffffff":"#002855"}function Qe(t){const e=(t||"").match(/#[0-9a-fA-F]{3,6}/g);if(!e||e.length===0)return"#ffffff";if(e.length===1){const r=T(e[0]);return r?A(r):"#ffffff"}const s=Ne(e[0],e[e.length-1]);return A(s)}function Je(t,e){const s=[...t.children],r=F(s[0])||"",a=F(s[1])||"",n=s[2]?s[2].querySelector("a"):null,i=n?n.href:"",d=n?(n.textContent||"").trim():"",l=s[3]?je(s[3]):null;let o=null;if(!l&&s[3]){const c=F(s[3]);c&&(o=c)}return console.log(`slide[${e}]`,{title:r,description:a,linkHref:i,linkText:d,bgImg:l,bgColor:o}),{title:r,description:a,linkHref:i,linkText:d,bgImg:l,bgColor:o,row:t}}function Ke(t){return[...t.children].map((s,r)=>Je(s,r))}function Ye(t,e){const{bgImg:s,bgColor:r}=t;if(s)return{bg:`url('${s.src}')`,textColor:"#ffffff",isImage:!0};if(r){const l=Qe(r),o=r.includes("gradient");return{bg:o?r:"none",textColor:l,isImage:!1,solidColor:o?null:r}}const[a,n]=I[e%I.length],i=Ne(a,n),d=A(i);return{bg:`linear-gradient(90deg, ${a} 0%, ${n} 100%)`,textColor:d,isImage:!1}}function er(t,e,s){const{title:r,description:a,linkHref:n,linkText:i}=t,d=a?`<p class="carousel-slide-description">${a}</p>`:"",l=n&&i?`<a class="carousel-slide-cta" href="${n}">${i}</a>`:"",o=e!==0?'aria-hidden="true"':"";return`
    <li class="carousel-slide" role="group" aria-roledescription="slide"
        aria-label="Slide ${e+1} of ${s}" ${o}
        data-slide-index="${e}">
      <div class="carousel-slide-scrim" aria-hidden="true"></div>
      <div class="carousel-slide-content">
        <h2 class="carousel-slide-title">${r}</h2>
        ${d}
        ${l}
      </div>
    </li>`}function rr(t){const e=t.length,s=t.map((a,n)=>er(a,n,e)).join(""),r=t.map((a,n)=>{const i=n===0?'aria-current="true"':"";return`<button class="carousel-dot${n===0?" carousel-dot--active":""}"
        aria-label="Go to slide ${n+1}" ${i} data-dot-index="${n}"></button>`}).join("");return`
    <div class="carousel-viewport" aria-roledescription="carousel" aria-label="Promotional carousel" role="region">
      <ul class="carousel-track" aria-live="polite">
        ${s}
      </ul>
      <button class="carousel-nav carousel-nav--prev" aria-label="Previous slide" aria-disabled="true">
        ${ze}
      </button>
      <button class="carousel-nav carousel-nav--next" aria-label="Next slide"${e<=1?' aria-disabled="true"':""}>
        ${Xe}
      </button>
    </div>
    <div class="carousel-dots" role="tablist" aria-label="Slide navigation">
      ${r}
    </div>`}function tr(t,e){e.forEach((s,r)=>{const a=t.querySelector(`[data-slide-index="${r}"]`);if(!a)return;const{bg:n,textColor:i,isImage:d,solidColor:l}=Ye(s,r);if(n!=="none"&&(a.style.backgroundImage=n),l&&(a.style.backgroundColor=l),d){a.style.backgroundSize="cover",a.style.backgroundPosition="center",a.style.backgroundRepeat="no-repeat";const o=a.querySelector(".carousel-slide-scrim");o&&o.removeAttribute("aria-hidden")}a.style.setProperty("--slide-text-color",i)})}function B(t,e,s){t.querySelectorAll(".carousel-slide").forEach((n,i)=>{const d=i===e;n.setAttribute("aria-hidden",d?"false":"true")}),t.querySelectorAll(".carousel-dot").forEach((n,i)=>{const d=i===e;n.classList.toggle("carousel-dot--active",d),n.setAttribute("aria-current",d?"true":"false")});const r=t.querySelector(".carousel-nav--prev"),a=t.querySelector(".carousel-nav--next");r&&r.setAttribute("aria-disabled",e===0?"true":"false"),a&&a.setAttribute("aria-disabled",e===s-1?"true":"false")}function Pe(t,e,s=!0){const r=t.children[e];r&&t.scrollTo({left:r.offsetLeft,behavior:s?"smooth":"instant"})}function sr(t,e){const s=t.querySelector(".carousel-track");if(!s)return;let r=0,a=!1;function n(o){const c=Math.max(0,Math.min(e-1,o));c!==r&&(r=c,Pe(s,r),B(t,r,e))}const i=t.querySelector(".carousel-nav--prev");i&&i.addEventListener("click",()=>{i.getAttribute("aria-disabled")!=="true"&&n(r-1)});const d=t.querySelector(".carousel-nav--next");d&&d.addEventListener("click",()=>{d.getAttribute("aria-disabled")!=="true"&&n(r+1)}),t.querySelectorAll(".carousel-dot").forEach(o=>{o.addEventListener("click",()=>{const c=parseInt(o.dataset.dotIndex,10);n(c)})});const l=t.querySelector(".carousel-viewport");l&&l.addEventListener("keydown",o=>{o.key==="ArrowLeft"&&n(r-1),o.key==="ArrowRight"&&n(r+1),o.key==="Home"&&n(0),o.key==="End"&&n(e-1)}),s.addEventListener("scroll",()=>{a||(a=!0,requestAnimationFrame(()=>{var E;const o=((E=s.children[0])==null?void 0:E.offsetWidth)||1,c=Math.round(s.scrollLeft/o);c!==r&&(r=Math.max(0,Math.min(e-1,c)),B(t,r,e)),a=!1}))})}function nr(t){const e=Ke(t);if(e.length===0){t.innerHTML="";return}const s=[...t.children],r=rr(e);t.innerHTML=r;const a=t.querySelectorAll(".carousel-slide");s.forEach((n,i)=>{a[i]&&We(n,a[i])}),tr(t,e),B(t,0,e.length),requestAnimationFrame(()=>{sr(t,e.length);const n=t.querySelector(".carousel-track");n&&Pe(n,0,!1)})}const x=[{title:"Slide 1: Home Loans",description:"Competitive rates from 5.99%",linkText:"Learn more",linkHref:"/home-loans",bgColor:"linear-gradient(90deg, #002855 0%, #003D7A 100%)"},{title:"Slide 2: Credit Cards",description:"Earn rewards on every purchase",linkText:"Apply now",linkHref:"/credit-cards",bgColor:"linear-gradient(90deg, #D4AF37 0%, #E8C968 100%)"},{title:"Slide 3: Insurance",description:"Comprehensive protection",bgColor:"linear-gradient(90deg, #008B8B 0%, #20B2AA 100%)"}],D=[{title:"Slide 1: Savings",description:"High interest savings accounts",linkText:"Open today",linkHref:"/savings",bgColor:"linear-gradient(90deg, #0066CC 0%, #3399FF 100%)"},{title:"Slide 2: Investments",description:"Grow your wealth with expert advice",linkText:"Get started",linkHref:"/investments",bgColor:"linear-gradient(90deg, #10B981 0%, #34D399 100%)"},{title:"Slide 3: Premium",description:"Exclusive benefits and rewards",bgColor:"linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)"},{title:"Slide 4: Business",description:"Solutions for growing businesses",linkText:"Find out more",linkHref:"/business",bgColor:"linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)"},{title:"Slide 5: Mobile App",description:"Bank anywhere, anytime",linkText:"Download",linkHref:"/mobile",bgColor:"linear-gradient(90deg, #EC4899 0%, #F472B6 100%)"}],L=[{title:"New Customer Offer",description:"Switch to Great Bank and get $200 bonus",linkText:"Switch now",linkHref:"/switch",bgColor:"linear-gradient(90deg, #002855 0%, #20B2AA 100%)"},{title:"Refer a Friend",description:"Earn $100 for every successful referral",linkText:"Refer now",linkHref:"/refer",bgColor:"linear-gradient(90deg, #D4AF37 0%, #E8C968 100%)"}],_e=[{title:"Home Loans",description:"Competitive rates from 5.99%",linkText:"Learn more",linkHref:"/home-loans",bgImg:"https://picsum.photos/seed/carousel1/1200/400"},{title:"Savings",description:"High interest savings accounts",bgImg:"https://picsum.photos/seed/carousel2/1200/400"}],ar=[{title:"Quarterly Update"},{title:"New Branch Opening",description:"Visit us at Central Station"}];function ir(t){return t.map(e=>{const s=e.linkText&&e.linkHref?`<a href="${e.linkHref}">${e.linkText}</a>`:"";let r="";return e.bgImg?r=`<img src="${e.bgImg}" alt="">`:e.bgColor&&(r=e.bgColor),[e.title||"",e.description||"",s,r]})}function u(t,{dark:e=!1}={}){const s=ir(t),r=Ue("carousel",s);return e&&r.classList.add("dark"),nr(r),r}const M=[{label:"Variation 1: Carousel (3 Slides)",slides:()=>x},{label:"Variation 2: Carousel (5 Slides)",slides:()=>D},{label:"Variation 3: Carousel (2 Slides - Simple)",slides:()=>L}];function Oe({dark:t=!1}={}){const e=t?"#111827":"#ffffff",s=t?"#f1f5f9":"#0f172a",r=document.createElement("div");r.style.cssText=`background:${e};padding:24px;font-family:Inter,sans-serif;`;const a=document.createElement("p");return a.textContent="Carousel Component",a.style.cssText=`color:${s};font-size:20px;font-weight:700;margin:0 0 24px;line-height:28px;`,r.appendChild(a),M.forEach(({label:n,slides:i},d)=>{const l=document.createElement("div");d<M.length-1&&(l.style.marginBottom="32px");const o=document.createElement("p");o.textContent=n,o.style.cssText=`color:${s};font-size:14px;font-weight:700;margin:0 0 12px;line-height:20px;`,l.appendChild(o),l.appendChild(u(i(),{dark:t})),r.appendChild(l)}),r}const dr={title:"Blocks/Carousel",parameters:{layout:"fullscreen",docs:{description:{component:`
Full-width hero banner carousel. Each slide shows a title (h2), optional sub-heading,
optional CTA link, and a configurable background (image, CSS colour/gradient, or default brand palette).

Navigation is manual only — prev/next overlay buttons and pagination dots.
Text colour is WCAG-contrast-computed per slide background.

**Variants**: light (default) · dark

**Figma**: [Light](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5196) ·
[Dark](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5296)
        `.trim()}}},tags:["autodocs"]},m={name:"Light — 3 slides",render:()=>u(x),parameters:{docs:{description:{story:"Matches Figma Variation 1 (node 5:5196). Prev button disabled on first slide; next enabled. Gold slide uses navy text (computed contrast)."}}}},g={name:"Light — 5 slides",render:()=>u(D),parameters:{docs:{description:{story:"Matches Figma Variation 2. Tests amber slide contrast computation."}}}},p={name:"Light — 2 slides",render:()=>u(L),parameters:{docs:{description:{story:"Matches Figma Variation 3. Minimum slide count (2)."}}}},f={name:"Dark — 3 slides",render:()=>u(x,{dark:!0}),parameters:{docs:{description:{story:"Matches Figma dark variation (node 5:5296). Gold active dot, dark nav buttons with border."}}}},h={name:"Dark — 5 slides",render:()=>u(D,{dark:!0})},k={name:"Dark — 2 slides",render:()=>u(L,{dark:!0})},b={name:"Figma — Light (node 5:5196)",render:()=>Oe({dark:!1}),parameters:{layout:"padded",backgrounds:{default:"white"},docs:{description:{story:"Composite story mirroring Figma node 5:5196. All 3 variations (3-slide, 5-slide, 2-slide) on white background. Use for side-by-side comparison with the Figma screenshot."}}}},v={name:"Figma — Dark (node 5:5296)",render:()=>Oe({dark:!0}),parameters:{layout:"padded",backgrounds:{default:"dark"},docs:{description:{story:"Composite story mirroring Figma node 5:5296. All 3 variations on #111827 dark background. Dark nav buttons (border, no shadow), gold active dots."}}}},S={name:"Image backgrounds",render:()=>u(_e),parameters:{docs:{description:{story:"Slides with `<img>` background. Semi-transparent scrim is shown. Text is always white for image slides."}}}},y={name:"Image backgrounds (dark)",render:()=>u(_e,{dark:!0})},w={name:"Minimal — required fields only",render:()=>u(ar),parameters:{docs:{description:{story:"Only title provided per slide. Default brand palette applied by index. No description, no CTA link."}}}},C={name:"Single slide",render:()=>u([x[0]]),parameters:{docs:{description:{story:"Edge case: one slide. Both nav buttons are disabled."}}}};var H,$,G,V,q;m.parameters={...m.parameters,docs:{...(H=m.parameters)==null?void 0:H.docs,source:{originalSource:`{
  name: 'Light — 3 slides',
  render: () => mocks.createCarousel(mocks.threeSlides),
  parameters: {
    docs: {
      description: {
        story: 'Matches Figma Variation 1 (node 5:5196). ' + 'Prev button disabled on first slide; next enabled. ' + 'Gold slide uses navy text (computed contrast).'
      }
    }
  }
}`,...(G=($=m.parameters)==null?void 0:$.docs)==null?void 0:G.source},description:{story:"Variation 1 (light) — 3 slides: navy, gold, teal",...(q=(V=m.parameters)==null?void 0:V.docs)==null?void 0:q.description}}};var R,N,P,_,O;g.parameters={...g.parameters,docs:{...(R=g.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'Light — 5 slides',
  render: () => mocks.createCarousel(mocks.fiveSlides),
  parameters: {
    docs: {
      description: {
        story: 'Matches Figma Variation 2. Tests amber slide contrast computation.'
      }
    }
  }
}`,...(P=(N=g.parameters)==null?void 0:N.docs)==null?void 0:P.source},description:{story:"Variation 2 (light) — 5 slides: blue/green/purple/amber/pink",...(O=(_=g.parameters)==null?void 0:_.docs)==null?void 0:O.description}}};var W,j,U,z,X;p.parameters={...p.parameters,docs:{...(W=p.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'Light — 2 slides',
  render: () => mocks.createCarousel(mocks.twoSlides),
  parameters: {
    docs: {
      description: {
        story: 'Matches Figma Variation 3. Minimum slide count (2).'
      }
    }
  }
}`,...(U=(j=p.parameters)==null?void 0:j.docs)==null?void 0:U.source},description:{story:"Variation 3 (light) — 2 slides: default palette (navy-teal, gold)",...(X=(z=p.parameters)==null?void 0:z.docs)==null?void 0:X.description}}};var Z,Q,J,K,Y;f.parameters={...f.parameters,docs:{...(Z=f.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  name: 'Dark — 3 slides',
  render: () => mocks.createCarousel(mocks.threeSlides, {
    dark: true
  }),
  parameters: {
    docs: {
      description: {
        story: 'Matches Figma dark variation (node 5:5296). ' + 'Gold active dot, dark nav buttons with border.'
      }
    }
  }
}`,...(J=(Q=f.parameters)==null?void 0:Q.docs)==null?void 0:J.source},description:{story:"Dark — 3 slides",...(Y=(K=f.parameters)==null?void 0:K.docs)==null?void 0:Y.description}}};var ee,re,te,se,ne;h.parameters={...h.parameters,docs:{...(ee=h.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  name: 'Dark — 5 slides',
  render: () => mocks.createCarousel(mocks.fiveSlides, {
    dark: true
  })
}`,...(te=(re=h.parameters)==null?void 0:re.docs)==null?void 0:te.source},description:{story:"Dark — 5 slides",...(ne=(se=h.parameters)==null?void 0:se.docs)==null?void 0:ne.description}}};var ae,ie,oe,de,le;k.parameters={...k.parameters,docs:{...(ae=k.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  name: 'Dark — 2 slides',
  render: () => mocks.createCarousel(mocks.twoSlides, {
    dark: true
  })
}`,...(oe=(ie=k.parameters)==null?void 0:ie.docs)==null?void 0:oe.source},description:{story:"Dark — 2 slides",...(le=(de=k.parameters)==null?void 0:de.docs)==null?void 0:le.description}}};var ce,ue,me,ge,pe;b.parameters={...b.parameters,docs:{...(ce=b.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  name: 'Figma — Light (node 5:5196)',
  render: () => renderFigmaPage({
    dark: false
  }),
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'white'
    },
    docs: {
      description: {
        story: 'Composite story mirroring Figma node 5:5196. ' + 'All 3 variations (3-slide, 5-slide, 2-slide) on white background. ' + 'Use for side-by-side comparison with the Figma screenshot.'
      }
    }
  }
}`,...(me=(ue=b.parameters)==null?void 0:ue.docs)==null?void 0:me.source},description:{story:`Figma Light (node 5:5196) — all 3 variations stacked on white,\r
with variation labels matching the Figma frame layout.`,...(pe=(ge=b.parameters)==null?void 0:ge.docs)==null?void 0:pe.description}}};var fe,he,ke,be,ve;v.parameters={...v.parameters,docs:{...(fe=v.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  name: 'Figma — Dark (node 5:5296)',
  render: () => renderFigmaPage({
    dark: true
  }),
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        story: 'Composite story mirroring Figma node 5:5296. ' + 'All 3 variations on #111827 dark background. ' + 'Dark nav buttons (border, no shadow), gold active dots.'
      }
    }
  }
}`,...(ke=(he=v.parameters)==null?void 0:he.docs)==null?void 0:ke.source},description:{story:`Figma Dark (node 5:5296) — all 3 variations stacked on #111827 background,\r
with variation labels matching the Figma frame layout.`,...(ve=(be=v.parameters)==null?void 0:be.docs)==null?void 0:ve.description}}};var Se,ye,we,Ce,xe;S.parameters={...S.parameters,docs:{...(Se=S.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  name: 'Image backgrounds',
  render: () => mocks.createCarousel(mocks.imageSlides),
  parameters: {
    docs: {
      description: {
        story: 'Slides with \`<img>\` background. Semi-transparent scrim is shown. ' + 'Text is always white for image slides.'
      }
    }
  }
}`,...(we=(ye=S.parameters)==null?void 0:ye.docs)==null?void 0:we.source},description:{story:"Image slides — exercises background image + scrim + white text",...(xe=(Ce=S.parameters)==null?void 0:Ce.docs)==null?void 0:xe.description}}};var Fe,Te,Ae,Be,De;y.parameters={...y.parameters,docs:{...(Fe=y.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  name: 'Image backgrounds (dark)',
  render: () => mocks.createCarousel(mocks.imageSlides, {
    dark: true
  })
}`,...(Ae=(Te=y.parameters)==null?void 0:Te.docs)==null?void 0:Ae.source},description:{story:"Image slides — dark mode",...(De=(Be=y.parameters)==null?void 0:Be.docs)==null?void 0:De.description}}};var Le,Ee,Ie,Me,He;w.parameters={...w.parameters,docs:{...(Le=w.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  name: 'Minimal — required fields only',
  render: () => mocks.createCarousel(mocks.minimalSlides),
  parameters: {
    docs: {
      description: {
        story: 'Only title provided per slide. Default brand palette applied by index. ' + 'No description, no CTA link.'
      }
    }
  }
}`,...(Ie=(Ee=w.parameters)==null?void 0:Ee.docs)==null?void 0:Ie.source},description:{story:"Minimal — titles only, no description / link / explicit background",...(He=(Me=w.parameters)==null?void 0:Me.docs)==null?void 0:He.description}}};var $e,Ge,Ve,qe,Re;C.parameters={...C.parameters,docs:{...($e=C.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  name: 'Single slide',
  render: () => mocks.createCarousel([mocks.threeSlides[0]]),
  parameters: {
    docs: {
      description: {
        story: 'Edge case: one slide. Both nav buttons are disabled.'
      }
    }
  }
}`,...(Ve=(Ge=C.parameters)==null?void 0:Ge.docs)==null?void 0:Ve.source},description:{story:"Single slide — prev and next both disabled",...(Re=(qe=C.parameters)==null?void 0:qe.docs)==null?void 0:Re.description}}};const lr=["ThreeSlides","FiveSlides","TwoSlides","DarkThreeSlides","DarkFiveSlides","DarkTwoSlides","FigmaLight","FigmaDark","ImageSlides","DarkImageSlides","MinimalSlides","SingleSlide"];export{h as DarkFiveSlides,y as DarkImageSlides,f as DarkThreeSlides,k as DarkTwoSlides,v as FigmaDark,b as FigmaLight,g as FiveSlides,S as ImageSlides,w as MinimalSlides,C as SingleSlide,m as ThreeSlides,p as TwoSlides,lr as __namedExportsOrder,dr as default};
