const Ae=["primary","secondary","outline","ghost","tertiary"],d=["xs","sm","md","lg","xl"],c={xs:"Extra Small",sm:"Small",md:"Medium",lg:"Large",xl:"Extra Large"},C='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',S='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',z='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';function r({label:e,variant:n="primary",size:t="lg",iconLeading:a=null,iconTrailing:i=null,disabled:Te=!1,block:Be=!1,href:Ie="#"}={}){const s=document.createElement("a");if(s.href=Ie,s.className=["button",n,t,Be?"btn-block":""].filter(Boolean).join(" "),Te&&(s.setAttribute("aria-disabled","true"),s.removeAttribute("href")),a){const o=document.createElement("span");o.className="button-icon button-icon--leading",o.innerHTML=a,s.appendChild(o)}if(s.appendChild(document.createTextNode(e)),i){const o=document.createElement("span");o.className="button-icon button-icon--trailing",o.innerHTML=i,s.appendChild(o)}return s}function E(...e){const n=document.createElement("div");return n.className="button-container",e.forEach(t=>n.appendChild(t)),n}function l(e,n,t=!1){const a=document.createElement("div");a.style.cssText="margin-bottom: 2rem;";const i=document.createElement(t?"h3":"h2");return i.style.cssText="font-size: 1rem; font-weight: 600; margin: 0 0 0.75rem; color: inherit;",i.textContent=e,a.appendChild(i),a.appendChild(n),a}function Le(e=!1){const n=document.createElement("div");return n.style.cssText=`
    padding: 2rem;
    background: ${e?"#111827":"#ffffff"};
    color: ${e?"#f1f5f9":"#0f172a"};
    min-height: 100vh;
    box-sizing: border-box;
  `,e&&n.setAttribute("data-theme","dark"),Ae.forEach(t=>{const a=document.createElement("div");a.style.cssText="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-bottom: 0.5rem;",d.forEach(i=>{a.appendChild(r({label:c[i],variant:t,size:i}))}),n.appendChild(l(`${t.charAt(0).toUpperCase()+t.slice(1)} Variant`,a,!1))}),n}const Ne={title:"Components/Buttons",tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:'\n## Buttons\n\nShared UI component used across all blocks. Applied via CSS classes on `<a>` or `<button>` elements — no EDS `decorate()` involved.\n\n**Class pattern:** `.button {variant} {size}`\n\n**Variants:** `primary` · `secondary` · `outline` · `ghost` · `tertiary`\n\n**Sizes:** `xs` · `sm` · `md` · `lg` · `xl`\n\n**Modifiers:** `btn-block` (full-width), `aria-disabled="true"` (disabled)\n\n**Figma:** [Light node 5:3024](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-3024)\n· [Dark node 5:4803](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-4803)\n        '}}}},p={name:"All Variants — Light",render:()=>Le(!1)},m={name:"All Variants — Dark",render:()=>Le(!0)},u={render:()=>{const e=document.createElement("div");return e.style.cssText="padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;",d.forEach(n=>{e.appendChild(r({label:c[n],variant:"primary",size:n}))}),e}},g={render:()=>{const e=document.createElement("div");return e.style.cssText="padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;",d.forEach(n=>{e.appendChild(r({label:c[n],variant:"secondary",size:n}))}),e}},h={render:()=>{const e=document.createElement("div");return e.style.cssText="padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;",d.forEach(n=>{e.appendChild(r({label:c[n],variant:"outline",size:n}))}),e}},w={render:()=>{const e=document.createElement("div");return e.style.cssText="padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;",d.forEach(n=>{e.appendChild(r({label:c[n],variant:"ghost",size:n}))}),e}},y={render:()=>{const e=document.createElement("div");return e.style.cssText="padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;",d.forEach(n=>{e.appendChild(r({label:c[n],variant:"tertiary",size:n}))}),e}},b={render:()=>{const e=document.createElement("div");e.style.cssText="padding: 2rem;",e.appendChild(l("Light — Leading icon",E(r({label:"Home Loans",variant:"primary",size:"md",iconLeading:C}),r({label:"Apply Now",variant:"primary",size:"md",iconTrailing:S}),r({label:"Insurance",variant:"outline",size:"md",iconLeading:z}))));const n=l("Dark — Icons",E(r({label:"Home Loans",variant:"primary",size:"md",iconLeading:C}),r({label:"Apply Now",variant:"primary",size:"md",iconTrailing:S}),r({label:"Insurance",variant:"outline",size:"md",iconLeading:z})));return n.style.cssText="margin-top: 0; padding: 1.5rem; background: #111827; color: #f1f5f9;",n.setAttribute("data-theme","dark"),e.appendChild(n),e}},v={render:()=>{const e=document.createElement("div");return e.style.cssText="padding: 2rem; max-width: 400px;",e.appendChild(l("Primary — btn-block",(()=>{const n=document.createElement("div");return n.style.cssText="display: flex; flex-direction: column; gap: 0.75rem;",n.appendChild(r({label:"Full-Width Primary",variant:"primary",size:"lg",block:!0})),n.appendChild(r({label:"Full-Width Outline",variant:"outline",size:"lg",block:!0})),n})())),e}},f={render:()=>{const e=document.createElement("div");e.style.cssText="padding: 2rem;";const n=document.createElement("div");return n.style.cssText="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;",["primary","secondary","outline","ghost"].forEach(t=>{n.appendChild(r({label:`${t.charAt(0).toUpperCase()+t.slice(1)} (disabled)`,variant:t,size:"md",disabled:!0}))}),e.appendChild(l("Disabled (aria-disabled)",n)),e}},x={name:"Grouped — button-container",render:()=>{const e=document.createElement("div");return e.style.cssText="padding: 2rem;",e.appendChild(l("Primary + Outline group (md)",E(r({label:"Apply Now",variant:"primary",size:"md"}),r({label:"Learn More",variant:"outline",size:"md"})))),e.appendChild(l("Three-button group (lg)",E(r({label:"Home Loans",variant:"primary",size:"lg"}),r({label:"Compare",variant:"outline",size:"lg"}),r({label:"See all products",variant:"tertiary",size:"lg"})))),e}};var k,L,T,B,I;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'All Variants — Light',
  render: () => buildMatrix(false)
}`,...(T=(L=p.parameters)==null?void 0:L.docs)==null?void 0:T.source},description:{story:"All variants × all sizes — light theme. Matches Figma node 5:3024.",...(I=(B=p.parameters)==null?void 0:B.docs)==null?void 0:I.description}}};var A,N,O,D,_;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`{
  name: 'All Variants — Dark',
  render: () => buildMatrix(true)
}`,...(O=(N=m.parameters)==null?void 0:N.docs)==null?void 0:O.source},description:{story:"All variants × all sizes — dark theme. Matches Figma node 5:4803.",...(_=(D=m.parameters)==null?void 0:D.docs)==null?void 0:_.description}}};var H,M,W,F,Z;u.parameters={...u.parameters,docs:{...(H=u.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;';
    SIZES.forEach(size => {
      wrap.appendChild(createButton({
        label: SIZE_LABELS[size],
        variant: 'primary',
        size
      }));
    });
    return wrap;
  }
}`,...(W=(M=u.parameters)==null?void 0:M.docs)==null?void 0:W.source},description:{story:"Primary buttons at every size.",...(Z=(F=u.parameters)==null?void 0:F.docs)==null?void 0:Z.description}}};var V,G,P,R,$;g.parameters={...g.parameters,docs:{...(V=g.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;';
    SIZES.forEach(size => {
      wrap.appendChild(createButton({
        label: SIZE_LABELS[size],
        variant: 'secondary',
        size
      }));
    });
    return wrap;
  }
}`,...(P=(G=g.parameters)==null?void 0:G.docs)==null?void 0:P.source},description:{story:"Secondary buttons at every size.",...($=(R=g.parameters)==null?void 0:R.docs)==null?void 0:$.description}}};var j,U,X,q,J;h.parameters={...h.parameters,docs:{...(j=h.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;';
    SIZES.forEach(size => {
      wrap.appendChild(createButton({
        label: SIZE_LABELS[size],
        variant: 'outline',
        size
      }));
    });
    return wrap;
  }
}`,...(X=(U=h.parameters)==null?void 0:U.docs)==null?void 0:X.source},description:{story:"Outline buttons at every size.",...(J=(q=h.parameters)==null?void 0:q.docs)==null?void 0:J.description}}};var K,Q,Y,ee,ne;w.parameters={...w.parameters,docs:{...(K=w.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;';
    SIZES.forEach(size => {
      wrap.appendChild(createButton({
        label: SIZE_LABELS[size],
        variant: 'ghost',
        size
      }));
    });
    return wrap;
  }
}`,...(Y=(Q=w.parameters)==null?void 0:Q.docs)==null?void 0:Y.source},description:{story:"Ghost buttons at every size.",...(ne=(ee=w.parameters)==null?void 0:ee.docs)==null?void 0:ne.description}}};var re,te,ae,ie,se;y.parameters={...y.parameters,docs:{...(re=y.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;';
    SIZES.forEach(size => {
      wrap.appendChild(createButton({
        label: SIZE_LABELS[size],
        variant: 'tertiary',
        size
      }));
    });
    return wrap;
  }
}`,...(ae=(te=y.parameters)==null?void 0:te.docs)==null?void 0:ae.source},description:{story:"Tertiary (link-style) buttons at every size.",...(se=(ie=y.parameters)==null?void 0:ie.docs)==null?void 0:se.description}}};var oe,le,de,ce,pe;b.parameters={...b.parameters,docs:{...(oe=b.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding: 2rem;';
    wrap.appendChild(section('Light — Leading icon', buttonContainer(createButton({
      label: 'Home Loans',
      variant: 'primary',
      size: 'md',
      iconLeading: ICON_HOME
    }), createButton({
      label: 'Apply Now',
      variant: 'primary',
      size: 'md',
      iconTrailing: ICON_ARROW
    }), createButton({
      label: 'Insurance',
      variant: 'outline',
      size: 'md',
      iconLeading: ICON_SHIELD
    }))));
    const darkSection = section('Dark — Icons', buttonContainer(createButton({
      label: 'Home Loans',
      variant: 'primary',
      size: 'md',
      iconLeading: ICON_HOME
    }), createButton({
      label: 'Apply Now',
      variant: 'primary',
      size: 'md',
      iconTrailing: ICON_ARROW
    }), createButton({
      label: 'Insurance',
      variant: 'outline',
      size: 'md',
      iconLeading: ICON_SHIELD
    })));
    darkSection.style.cssText = 'margin-top: 0; padding: 1.5rem; background: #111827; color: #f1f5f9;';
    darkSection.setAttribute('data-theme', 'dark');
    wrap.appendChild(darkSection);
    return wrap;
  }
}`,...(de=(le=b.parameters)==null?void 0:le.docs)==null?void 0:de.source},description:{story:`Buttons with leading and trailing icons.\r
Matches the "With Icons" section in Figma (both light and dark).`,...(pe=(ce=b.parameters)==null?void 0:ce.docs)==null?void 0:pe.description}}};var me,ue,ge,he,we;v.parameters={...v.parameters,docs:{...(me=v.parameters)==null?void 0:me.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding: 2rem; max-width: 400px;';
    wrap.appendChild(section('Primary — btn-block', (() => {
      const div = document.createElement('div');
      div.style.cssText = 'display: flex; flex-direction: column; gap: 0.75rem;';
      div.appendChild(createButton({
        label: 'Full-Width Primary',
        variant: 'primary',
        size: 'lg',
        block: true
      }));
      div.appendChild(createButton({
        label: 'Full-Width Outline',
        variant: 'outline',
        size: 'lg',
        block: true
      }));
      return div;
    })()));
    return wrap;
  }
}`,...(ge=(ue=v.parameters)==null?void 0:ue.docs)==null?void 0:ge.source},description:{story:"Full-width btn-block modifier. Shrinks to auto-width at the sm breakpoint.",...(we=(he=v.parameters)==null?void 0:he.docs)==null?void 0:we.description}}};var ye,be,ve,fe,xe;f.parameters={...f.parameters,docs:{...(ye=f.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding: 2rem;';
    const row = document.createElement('div');
    row.style.cssText = 'display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;';
    ['primary', 'secondary', 'outline', 'ghost'].forEach(variant => {
      row.appendChild(createButton({
        label: \`\${variant.charAt(0).toUpperCase() + variant.slice(1)} (disabled)\`,
        variant,
        size: 'md',
        disabled: true
      }));
    });
    wrap.appendChild(section('Disabled (aria-disabled)', row));
    return wrap;
  }
}`,...(ve=(be=f.parameters)==null?void 0:be.docs)==null?void 0:ve.source},description:{story:"Disabled state — aria-disabled applied, pointer-events removed.",...(xe=(fe=f.parameters)==null?void 0:fe.docs)==null?void 0:xe.description}}};var Ee,Ce,Se,ze,ke;x.parameters={...x.parameters,docs:{...(Ee=x.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  name: 'Grouped — button-container',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding: 2rem;';
    wrap.appendChild(section('Primary + Outline group (md)', buttonContainer(createButton({
      label: 'Apply Now',
      variant: 'primary',
      size: 'md'
    }), createButton({
      label: 'Learn More',
      variant: 'outline',
      size: 'md'
    }))));
    wrap.appendChild(section('Three-button group (lg)', buttonContainer(createButton({
      label: 'Home Loans',
      variant: 'primary',
      size: 'lg'
    }), createButton({
      label: 'Compare',
      variant: 'outline',
      size: 'lg'
    }), createButton({
      label: 'See all products',
      variant: 'tertiary',
      size: 'lg'
    }))));
    return wrap;
  }
}`,...(Se=(Ce=x.parameters)==null?void 0:Ce.docs)==null?void 0:Se.source},description:{story:"button-container — horizontal grouping with wrapping.",...(ke=(ze=x.parameters)==null?void 0:ze.docs)==null?void 0:ke.description}}};const Oe=["AllVariantsLight","AllVariantsDark","Primary","Secondary","Outline","Ghost","Tertiary","WithIcons","FullWidth","Disabled","GroupedContainer"];export{m as AllVariantsDark,p as AllVariantsLight,f as Disabled,v as FullWidth,w as Ghost,x as GroupedContainer,h as Outline,u as Primary,g as Secondary,y as Tertiary,b as WithIcons,Oe as __namedExportsOrder,Ne as default};
