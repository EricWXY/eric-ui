import{d as V,t as y,i as N,B as S,k as D}from"./index-CekdIbIe.js";import{d as k,b as T,w as j,p as H,o as w,e as x,f as d,g as L,j as O,k as r,l as p,n as u,m as q,q as z,t as A,u as F,T as G,s as J,v as P,x as K,y as M}from"./vue.esm-bundler-wcQh_mpz.js";const I=Symbol("collapseContext"),Q={class:"er-collapse"},R="ErCollapse",U=V(k({name:R,__name:"Collapse",props:{modelValue:{},accordion:{type:Boolean}},emits:["update:modelValue","change"],setup(e,{emit:n}){const s=e,i=n,o=T(s.modelValue);function a(t){o.value=t,D(["update:modelValue","change"],l=>i(l,t))}return s.accordion&&o.value.length>1&&N(),j(()=>s.modelValue,t=>a(t)),H(I,{activeNames:o,handleItemClick:function(t){let l=[...o.value];if(s.accordion)return l=[l[0]===t?"":t],void a(l);const m=l.indexOf(t);m>-1?l.splice(m,1):l.push(t),a(l)}}),(t,l)=>(w(),x("div",Q,[d(t.$slots,"default",{},void 0,!0)]))}}),[["__scopeId","data-v-573a7286"]]),v=e=>e.style.height="0px",h=e=>e.style.height=`${e.scrollHeight}px`,f=e=>e.style.height="",b=e=>e.style.overflow="hidden",g=e=>e.style.overflow="",W={beforeEnter(e){v(e),b(e)},enter:e=>h(e),afterEnter(e){f(e),g(e)},beforeLeave(e){h(e),b(e)},leave:e=>v(e),afterLeave(e){f(e),g(e)}},X=["id"],Y={class:"er-collapse-item__title"},Z={class:"er-collapse-item__wapper"},ee=["id"],ae=V(k({name:"ErCollapseItem",__name:"CollapseItem",props:{name:{},title:{},disabled:{type:Boolean}},setup(e){const n=e,s=L(I),i=O(()=>{var a;return(a=s==null?void 0:s.activeNames.value)==null?void 0:a.includes(n.name)});function o(){n.disabled||(s==null||s.handleItemClick(n.name))}return(a,t)=>(w(),x("div",{class:u(["er-collapse-item",{"is-disabled":a.disabled}])},[r("div",{class:u(["er-collapse-item__header",{"is-disabled":a.disabled,"is-active":i.value}]),id:`item-header-${a.name}`,onClick:o},[r("span",Y,[d(a.$slots,"title",{},()=>[J(P(a.title),1)],!0)]),p(S,{icon:"angle-right",class:"header-angle"})],10,X),p(G,z({name:"slide"},A(F(W))),{default:q(()=>[K(r("div",Z,[r("div",{class:"er-collapse-item__content",id:`item-content-${a.name}`},[d(a.$slots,"default",{},void 0,!0)],8,ee)],512),[[M,i.value]])]),_:3},16)],2))}}),[["__scopeId","data-v-f9283536"]]),B=y(U),$=y(ae),se={title:"Components/Collapse",component:B,subcomponents:{ErCollapseItem:$},tags:["autodocs"]},c={render:e=>({components:{ErCollapse:B,ErCollapseItem:$},setup(){return{args:e}},template:`
    <er-collapse v-bind="args">
      <er-collapse-item name="a" title="Title a">
        <div>this is content a</div>
      </er-collapse-item>
      <er-collapse-item name="b" title="title b">
        <div>this is content b</div>
      </er-collapse-item>
      <er-collapse-item name="c" title="title c  disable" disabled>
        <div>this is content c</div>
      </er-collapse-item>
    </er-collapse>
    `}),args:{accordion:!0,modelValue:["a"]}};var _,C,E;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: args => ({
    components: {
      ErCollapse,
      ErCollapseItem
    },
    setup() {
      return {
        args
      };
    },
    template: \`
    <er-collapse v-bind="args">
      <er-collapse-item name="a" title="Title a">
        <div>this is content a</div>
      </er-collapse-item>
      <er-collapse-item name="b" title="title b">
        <div>this is content b</div>
      </er-collapse-item>
      <er-collapse-item name="c" title="title c  disable" disabled>
        <div>this is content c</div>
      </er-collapse-item>
    </er-collapse>
    \`
  }),
  args: {
    accordion: true,
    modelValue: ["a"]
  }
}`,...(E=(C=c.parameters)==null?void 0:C.docs)==null?void 0:E.source}}};const oe=["Default"];export{c as Default,oe as __namedExportsOrder,se as default};
