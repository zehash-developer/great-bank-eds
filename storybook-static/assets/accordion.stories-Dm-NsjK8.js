import{e as x}from"./index-CCtUlOBE.js";import{m as k,g as pe,b as be,r as Ae,d as xe,p as we,c as ke}from"./mockBuilder-4X3ngmTr.js";function F(t){if(t<1024)return`${t}B`;const e=t/1024;return e<1024?`${Math.round(e)}KB`:`${(e/1024).toFixed(1)}MB`}async function ve(t){try{const e=await fetch(t,{method:"HEAD"});if(!e.ok){const a=(await(await fetch(t)).blob()).size;return F(a)}const n=e.headers.get("Content-Length");if(n){const o=parseInt(n,10);return F(o)}return null}catch(e){return console.error("getFileSize()",5,"Error fetching file size:",e),null}}async function v(t){const e=t.querySelectorAll("a[href]"),n={pdf:{extensions:[".pdf"],iconClass:"gel-icon-pdf-file-outlined",label:"PDF"},doc:{extensions:[".doc",".docx"],iconClass:"gel-icon-word-file-outlined",label:"DOC"},xls:{extensions:[".xls",".xlsx"],iconClass:"gel-icon-excel-file-outlined",label:"XLS"}},o=Array.from(e).map(async r=>{const a=r.getAttribute("href"),A=a.toLowerCase(),s=Object.entries(n).find(([,ge])=>ge.extensions.some(ye=>A.endsWith(ye)));if(!s)return;const[i,c]=s,d={...c};if(r.querySelector(".file-icon"))return;const u=await ve(a),w=document.createElement("i");w.className=`gel-icon ${d.iconClass} file-icon`,w.setAttribute("aria-hidden","true");const fe=r.textContent.trim(),he=u?` (${d.label} ${u})`:"";r.textContent=fe+he,r.insertBefore(w,r.firstChild)});await Promise.all(o)}document.addEventListener("DOMContentLoaded",async()=>{document.body.style.visibility="hidden";try{await v(document.body)}catch(t){console.error("enhanceFileLinks failed:",t)}finally{document.body.style.visibility="visible"}});let C=0;function Se(t="accordion"){return C+=1,`${t}-${C}`}function Fe(t){const e=[...t.children];if(e.length<2)return null;const n=pe(e[0])||"",o=xe(e[1])||"",r=o.replace(/<[^>]*>/g,"").trim(),a=!n.trim()&&!r;return{title:n,content:o,isEmpty:a,row:t}}function Ce(t){const e=[...t.children];return{title:pe(be(e[0]))||"",items:e.slice(1).map(Fe).filter(Boolean)}}function De(t,e){const{title:n,items:o}=t,r=n?Ae({heading:n,headingLevel:"h2"}):"",a=o.map((A,s)=>{const i=`${e}-panel-${s}`,c=`${e}-trigger-${s}`;return`
      <div class="accordion-item${A.isEmpty?" accordion-item--empty":""}" data-index="${s}">
        <button
          class="accordion-trigger"
          id="${c}"
          type="button"
          aria-expanded="false"
          aria-controls="${i}"
        >
          <span class="accordion-title"></span>
          <i class="gel-icon gel-icon-chevron-down accordion-icon" aria-hidden="true"></i>
        </button>
        <div
          class="accordion-content"
          id="${i}"
          hidden
        >
          <div class="accordion-content-inner"></div>
        </div>
      </div>`}).join("");return r+a}function Le(t,e){const n=t.getAttribute("aria-expanded")==="true",o=t.closest(".accordion-item");if(n){const r=e.scrollHeight;e.style.maxHeight=`${r}px`,e.offsetHeight,e.style.maxHeight="0",e.classList.remove("open"),e.classList.add("closing"),t.setAttribute("aria-expanded","false"),o==null||o.classList.remove("expanded"),e.addEventListener("transitionend",function a(){e.removeEventListener("transitionend",a),e.classList.remove("closing"),t.getAttribute("aria-expanded")==="false"&&(e.setAttribute("hidden",""),e.style.maxHeight="")},{once:!0})}else{e.removeAttribute("hidden"),e.classList.add("open");const r=e.scrollHeight;e.style.maxHeight="0",e.offsetHeight,e.style.maxHeight=`${r}px`,t.setAttribute("aria-expanded","true"),o==null||o.classList.add("expanded"),e.addEventListener("transitionend",function a(){e.removeEventListener("transitionend",a),t.getAttribute("aria-expanded")==="true"&&(e.style.maxHeight="none")},{once:!0})}}function Ee(t,e){const n=e.indexOf(t.target);switch(t.key){case"ArrowDown":t.preventDefault(),e[(n+1)%e.length].focus();break;case"ArrowUp":t.preventDefault(),e[(n-1+e.length)%e.length].focus();break;case"Home":t.preventDefault(),e[0].focus();break;case"End":t.preventDefault(),e[e.length-1].focus();break;case"Enter":case" ":t.preventDefault(),t.target.click();break}}function D(t){const e=[...t.querySelectorAll(".accordion-trigger")];e.forEach(n=>{const o=n.nextElementSibling;n.addEventListener("click",()=>{Le(n,o)}),n.addEventListener("keydown",r=>{Ee(r,e)})})}function L(t){t.querySelectorAll(".accordion-item").forEach(e=>{const n=e.querySelector(".accordion-content-inner"),o=e.querySelector(".accordion-trigger"),r=e.querySelector(".accordion-content");!n||!o||!r||[...e.children].filter(a=>a!==o&&a!==r).forEach(a=>n.appendChild(a))})}function E(t){t.forEach(e=>{e.setAttribute("data-aue-type","container"),e.setAttribute("data-aue-filter","accordion-item")})}function H(t){document.documentElement.classList.contains("adobe-ue-edit")&&t.querySelectorAll(".accordion-item").forEach(e=>{const n=e.querySelector(".accordion-content"),o=e.querySelector(".accordion-trigger");!n||!o||(n.removeAttribute("hidden"),n.classList.add("open"),n.style.maxHeight="none",o.setAttribute("aria-expanded","true"),e.classList.add("expanded"))})}async function He(t){if(t.querySelector(".accordion-item")){const a=t.querySelectorAll(".accordion-item");E(a),D(t),H(t),L(t),t.setAttribute("role","presentation"),await v(t);return}const e=Se(),n=Ce(t),o=n.items.map(a=>a.row);t.innerHTML=De(n,e);const r=[...t.querySelectorAll(".accordion-item")];r.forEach((a,A)=>{const s=o[A];if(!s)return;k(s,a);const[i,c]=s.children||[],d=a.querySelector(".accordion-title"),u=a.querySelector(".accordion-content-inner");i&&d&&(d.replaceChildren(...i.childNodes),k(i,d)),c&&u&&(u.replaceChildren(...c.childNodes),k(c,u))}),E(r),D(t),H(t),L(t),t.setAttribute("role","presentation"),await v(t)}const S=[{title:"How do I open an account?",description:`You can open an account online in minutes. Visit our website, click "Open an Account", and follow the step-by-step instructions. You'll need to provide some personal details and a form of photo ID.`},{title:"What are the fees for a transaction account?",description:"Our everyday transaction account has no monthly account-keeping fees. Some fees may apply for specific services such as international transfers or paper statements — see our fees and charges schedule for full details."},{title:"How do I apply for a home loan?",description:"Start by using our online home loan calculator to get an estimate of your borrowing power. When you're ready, apply online or speak to a home loan specialist at your nearest branch."}],me=[{title:"What documents do I need to open an account?",description:"You'll need a valid government-issued photo ID (e.g. passport or driver's licence) and proof of address (e.g. a utility bill dated within the last 3 months)."},{title:"Can I access my account online?",description:"Yes. Our internet banking platform is available 24/7 on desktop and via our mobile app on iOS and Android. Register in minutes using your account number and nominated email address."},{title:"Are there any monthly account fees?",description:"Most of our everyday accounts carry no monthly account-keeping fee. Premium and business accounts may include fees — refer to the relevant product disclosure statement for details."},{title:"How long does it take to process a home loan application?",description:"Conditional approval is typically provided within 1–3 business days. Full approval and settlement can take 2–6 weeks depending on the complexity of the application and property valuation."},{title:"Is my money protected?",description:"Deposits held with Great Bank are protected by the Australian Government Financial Claims Scheme (FCS) up to $250,000 per account holder."}],Ie=[{title:"What are your customer service hours?",description:"Our contact centre is open Monday–Friday 8 am–8 pm and Saturday 9 am–5 pm AEST. In-branch hours vary by location — use our branch finder to check your nearest branch."},{title:"Do you offer business banking?",description:"Yes. We offer a full suite of business banking products including transaction accounts, business loans, merchant facilities, and payroll solutions. Visit our Business Banking hub to learn more."}],qe=[{title:"What documents do I need to open an account?",description:"Please bring one of the following:",features:["Passport","Driver's licence","Medicare card (with a secondary document)"]},{title:"How do I transfer money overseas?",description:"International transfers can be made via:",steps:["Log in to internet banking",'Select "Transfer & Pay" then "International Transfer"',"Enter the recipient's SWIFT/BIC code and IBAN","Review the exchange rate and confirm"],note:"Transfers may take 1–5 business days depending on the destination country."}];function l(t,{title:e="",darkMode:n=!1}={}){const o=[[e],...we(t)],r=ke("accordion",o);return n&&r.classList.add("dark"),He(r),r}const Te={title:"Blocks/Accordion",tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:`
## Accordion

Collapsible FAQ-style block. Each item has a trigger row (question + chevron) that
expands / collapses the answer panel.

**Key behaviours:**
- Multi-expand: multiple panels may be open simultaneously
- Chevron rotates 180° when expanded
- Keyboard: \`Tab\` between triggers, \`Enter\`/\`Space\` to toggle, \`Arrow\` keys to navigate
- ARIA disclosure button pattern (\`aria-expanded\`, \`aria-controls\`)

**Figma:** [Light node 5:5043](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5043)
· [Dark node 5:5119](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5119)
        `}}}},p={render:()=>l(S,{title:"Accordion Component"}),play:async({canvasElement:t})=>{const e=t.querySelectorAll(".accordion-trigger");await x(e.length).toBe(3),e.forEach(r=>{x(r.getAttribute("aria-expanded")).toBe("false")}),e[0].click(),await x(e[0].getAttribute("aria-expanded")).toBe("true");const n=e[0].getAttribute("aria-controls"),o=t.querySelector(`#${n}`);await x(o.hasAttribute("hidden")).toBe(!1)}};p.parameters={docs:{description:{story:"Light mode with 3 items (Variation 1). Matches Figma node 5:5043. All panels collapsed by default."}}};const m={render:()=>l(me,{title:"Frequently Asked Questions"})};m.parameters={docs:{description:{story:"Light mode with 5 items (Variation 2). Tests vertical stacking at full FAQ length."}}};const f={render:()=>l(Ie)};f.parameters={docs:{description:{story:"Light mode with 2 items (Variation 3). Minimal configuration — no heading."}}};const h={render:()=>l(S,{title:"Accordion Component",darkMode:!0})};h.parameters={docs:{description:{story:"Dark mode (`accordion dark` block option). Matches Figma node 5:5119. Dark navy background with light text."}},backgrounds:{default:"dark"}};const g={render:()=>l(me,{title:"Frequently Asked Questions",darkMode:!0})};g.parameters={docs:{description:{story:"Dark mode with 5 items."}},backgrounds:{default:"dark"}};const y={render:()=>l(qe,{title:"Help Centre"})};y.parameters={docs:{description:{story:"Tests rich answer content: unordered lists, ordered steps, and italicised notes inside panels."}}};const b={render:()=>l(S)};b.parameters={docs:{description:{story:"Accordion without the optional block heading."}}};var I,q,B,M,T;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => createAccordion(mocks.defaultPanels, {
    title: 'Accordion Component'
  }),
  play: async ({
    canvasElement
  }) => {
    const triggers = canvasElement.querySelectorAll('.accordion-trigger');
    await expect(triggers.length).toBe(3);

    // All panels collapsed by default
    triggers.forEach(trigger => {
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    // Clicking first trigger expands its panel
    triggers[0].click();
    await expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    const panelId = triggers[0].getAttribute('aria-controls');
    const panel = canvasElement.querySelector(\`#\${panelId}\`);
    await expect(panel.hasAttribute('hidden')).toBe(false);
  }
}`,...(B=(q=p.parameters)==null?void 0:q.docs)==null?void 0:B.source},description:{story:"Default light mode — 3 items (Variation 1, Figma node 5:5043).",...(T=(M=p.parameters)==null?void 0:M.docs)==null?void 0:T.description}}};var $,P,Q,O,R;m.parameters={...m.parameters,docs:{...($=m.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => createAccordion(mocks.faqPanels, {
    title: 'Frequently Asked Questions'
  })
}`,...(Q=(P=m.parameters)==null?void 0:P.docs)==null?void 0:Q.source},description:{story:"Full FAQ — 5 items (Variation 2, Figma node 5:5043).",...(R=(O=m.parameters)==null?void 0:O.docs)==null?void 0:R.description}}};var W,N,V,z,G;f.parameters={...f.parameters,docs:{...(W=f.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => createAccordion(mocks.simplePanels)
}`,...(V=(N=f.parameters)==null?void 0:N.docs)==null?void 0:V.source},description:{story:"Simple FAQ — 2 items (Variation 3, Figma node 5:5043).",...(G=(z=f.parameters)==null?void 0:z.docs)==null?void 0:G.description}}};var Y,K,X,_,j;h.parameters={...h.parameters,docs:{...(Y=h.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => createAccordion(mocks.defaultPanels, {
    title: 'Accordion Component',
    darkMode: true
  })
}`,...(X=(K=h.parameters)==null?void 0:K.docs)==null?void 0:X.source},description:{story:"Dark mode — 3 items (Figma node 5:5119).",...(j=(_=h.parameters)==null?void 0:_.docs)==null?void 0:j.description}}};var Z,U,J,ee,te;g.parameters={...g.parameters,docs:{...(Z=g.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => createAccordion(mocks.faqPanels, {
    title: 'Frequently Asked Questions',
    darkMode: true
  })
}`,...(J=(U=g.parameters)==null?void 0:U.docs)==null?void 0:J.source},description:{story:"Dark mode full FAQ — 5 items.",...(te=(ee=g.parameters)==null?void 0:ee.docs)==null?void 0:te.description}}};var ne,oe,re,ae,se;y.parameters={...y.parameters,docs:{...(ne=y.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => createAccordion(mocks.richContentPanels, {
    title: 'Help Centre'
  })
}`,...(re=(oe=y.parameters)==null?void 0:oe.docs)==null?void 0:re.source},description:{story:"Rich content panels — tests nested lists, ordered steps, and note text.",...(se=(ae=y.parameters)==null?void 0:ae.docs)==null?void 0:se.description}}};var ie,ce,de,le,ue;b.parameters={...b.parameters,docs:{...(ie=b.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => createAccordion(mocks.defaultPanels)
}`,...(de=(ce=b.parameters)==null?void 0:ce.docs)==null?void 0:de.source},description:{story:"No heading — block without optional title.",...(ue=(le=b.parameters)==null?void 0:le.docs)==null?void 0:ue.description}}};const $e=["Default","FullFAQ","SimpleFAQ","DarkMode","DarkModeFullFAQ","RichContent","NoHeading"];export{h as DarkMode,g as DarkModeFullFAQ,p as Default,m as FullFAQ,b as NoHeading,y as RichContent,f as SimpleFAQ,$e as __namedExportsOrder,Te as default};
