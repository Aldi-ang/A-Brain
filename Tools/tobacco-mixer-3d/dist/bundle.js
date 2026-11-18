var go=Math.PI/180,yd=Math.sqrt(1.6);function Br({scale:i,azimuth:t=45,elevation:e=30}){let n=t*go,s=e*go;return{sinA:Math.sin(n),cosA:Math.cos(n),sinE:Math.sin(s),cosE:Math.cos(s),k:i*yd}}function pn([i,t,e],n){let{origin:s}=n,{sinA:r,cosA:a,sinE:o,cosE:c,k:l}=Br(n);return[s[0]+(i*r-t*a)*l,s[1]+((i*a+t*r)*o-e*c)*l]}function kr(i){let{sinA:t,cosA:e}=Br(i);return[e,t]}function vd([i,t,e],n){let{sinA:s,cosA:r,sinE:a,cosE:o}=Br(n);return(i*r+t*s)*o+e*a}var is=i=>{let t=(Math.round(i*10)/10).toFixed(1).replace(/\.0$/,"");return t==="-0"?"0":t};function qe(i,t=!1){return i.length?i.map(([e,n],s)=>`${s?"L":"M"}${is(e)} ${is(n)}`).join("")+(t?"Z":""):""}function Md({x:i,y:t,w:e,d:n,r:s},r=8){let a=Math.max(0,Math.min(s,e/2,n/2)),o=[[i+e-a,t+a,-90],[i+e-a,t+n-a,0],[i+a,t+n-a,90],[i+a,t+a,180]],c=[];for(let[l,h,u]of o){let d=a>0?r:0;for(let p=0;p<=d;p++){let g=(u+(d?90*p/d:45))*go;c.push([l+a*Math.cos(g),h+a*Math.sin(g)])}}return c}function _o(i){let t=0;for(let e=0;e<i.length;e++){let[n,s]=i[e],[r,a]=i[(e+1)%i.length];t+=n*a-r*s}return t/2}var Ks=i=>_o(i)<0?[...i].reverse():i;function Ed(i){let t=[...i].sort((r,a)=>r[0]-a[0]||r[1]-a[1]);if(t.length<3)return t;let e=(r,a,o)=>(a[0]-r[0])*(o[1]-r[1])-(a[1]-r[1])*(o[0]-r[0]),n=[];for(let r of t){for(;n.length>=2&&e(n[n.length-2],n[n.length-1],r)<=0;)n.pop();n.push(r)}let s=[];for(let r=t.length-1;r>=0;r--){let a=t[r];for(;s.length>=2&&e(s[s.length-2],s[s.length-1],a)<=0;)s.pop();s.push(a)}return[...n.slice(0,-1),...s.slice(0,-1)]}function Fr(i,t){let e=i.length,n=[],s=i.findIndex((a,o)=>a!==i[(o+e-1)%e]);if(s<0)return i[0]===t?[Array.from({length:e+1},(a,o)=>o%e)]:[];let r=null;for(let a=0;a<e;a++){let o=(s+a)%e;i[o]===t?(r||(r=[o]),r.push((o+1)%e)):r&&(n.push(r),r=null)}return r&&n.push(r),n}function zr(i,t,e,n,s={}){let r=s.convex??!0,a=i.length,o=_o(i)>0,[c,l]=kr(n),{sinA:h,cosA:u}=Br(n),d=i.map(([R,v],A)=>{let[G,M]=i[(A+1)%a],w=G-R,O=M-v,X=Math.hypot(w,O)||1;return o?[O/X,-w/X]:[-O/X,w/X]}),p=d.map(([R,v])=>R*c+v*l>1e-9),g=i.map(([R,v])=>pn([R,v,t+e],n)),_=i.map(([R,v])=>pn([R,v,t],n)),m=[],f=[];for(let R of Fr(p,!1))m.push(qe(R.map(v=>g[v])));for(let R of Fr(p,!0))f.push(qe(R.map(v=>g[v]))),e>0&&m.push(qe(R.map(v=>_[v])));if(e>0)for(let R=0;R<a;R++)p[(R+a-1)%a]!==p[R]&&m.push(qe([g[R],_[R]]));let S;if(r)S=qe(Ed([...g,..._]),!0);else{let R=[qe(Ks(g),!0),qe(Ks(_),!0)];for(let v=0;v<a;v++){if(!p[v])continue;let A=(v+1)%a;R.push(qe(Ks([g[v],g[A],_[A],_[v]]),!0))}S=R.join("")}let x=Array.from({length:4},()=>[]);if(e>0){let[R,v]=[-h,u];for(let A=0;A<a;A++){if(!p[A])continue;let[G,M]=d[A],w=(G*R+M*v+1)/2,O=Math.min(3,Math.max(0,Math.floor(w*4))),X=(A+1)%a;x[O].push(qe(Ks([g[A],g[X],_[X],_[A]]),!0))}}let T;if(s.bevel&&s.bevel>0){let R=s.bevel,A=i.map(([G,M],w)=>{let[O,X]=d[(w+a-1)%a],[P,C]=d[w],N=O+P,F=X+C,Y=Math.hypot(N,F)||1;return[G-N/Y*R,M-F/Y*R]}).map(([G,M])=>pn([G,M,t+e],n));T=Fr(p,!0).map(G=>qe([g[G[0]],...G.slice(1,-1).map(M=>A[M]),g[G[G.length-1]]])).join("")}return{fill:S,outline:m.join(""),crease:f.join(""),top:qe(Ks(g),!0),shades:x.map(R=>R.join("")),bevel:T}}var wl=(i,t=8)=>Md(i,t);function Ie(i,t,e,n,s=8,r=0){return zr(wl(i,s),t,e,n,{convex:!0,bevel:r})}function Tl(i,t,e,n=40){return Array.from({length:n},(s,r)=>{let a=r/n*Math.PI*2;return[i+e*Math.cos(a),t+e*Math.sin(a)]})}function fe(i,t,e,n,s,r,a=32,o=0){return zr(Tl(i,t,e,a),n,s,r,{convex:!0,bevel:o})}function Al(i,t,e,n=!1){return qe(i.map(([s,r])=>pn([s,r,t],e)),n)}var Rl=(i,t,e,n)=>Al([i,t],e,n),bd=(i,t,e)=>qe([pn(i,e),pn(t,e)]);var xo=(i,t,e,n,s,r=40)=>Al(Tl(i,t,e,r),n,s,!0);function Hr({x:i,y:t,w:e,d:n},s=0){return[[i+s,t+s],[i+e-s,t+s],[i+s,t+n-s],[i+e-s,t+n-s]]}function Cl({x:i,y:t,w:e,d:n},s,r){let a=[];for(let o of[i,i+e])for(let c of[t,t+n])for(let l of[s,r])a.push([o,c,l]);return a}function di(i,t,e,n,s,r,a,o=.4){let[c,l]=kr(a),h=[];for(let u=0;u<r;u++){let d=u/r*Math.PI*2,p=Math.cos(d),g=Math.sin(d);p*c+g*l<.15||h.push(bd([i+e*p,t+e*g,n+o],[i+e*p,t+e*g,s-o],a))}return h.join("")}function Gr(i,t,e,n,s,r=24){let[a,o]=kr(s),c=Math.atan2(o,a),l=[];for(let h=0;h<=r;h++){let u=c-Math.PI/2+h/r*Math.PI;l.push(pn([i+e*Math.cos(u),t+e*Math.sin(u),n],s))}return qe(l)}function Pl(i,t,e,n=8){let s=wl(i,n),r=s.length,a=_o(s)>0,[o,c]=kr(e),l=s.map(([h,u],d)=>{let[p,g]=s[(d+1)%r],_=p-h,m=g-u,[f,S]=a?[m,-_]:[-m,_];return f*o+S*c>1e-9});return Fr(l,!0).map(h=>qe(h.map(u=>pn([s[u][0],s[u][1],t],e)))).join("")}function Il(i,t,e,n,s,r,a,o=16){let c=Math.max(1,Math.round(s*o)),l=[],h=[],u=[],d=null;for(let p=0;p<=c;p++){let g=p/c,_=g*s*Math.PI*2,m=n*Math.cos(_),f=n*Math.sin(_),S=i+(t-i)*g,x=r==="x"?[S,e[0]+m,e[1]+f]:[e[0]+m,S,e[1]+f],T=r==="x"?[0,Math.cos(_),Math.sin(_)]:[Math.cos(_),0,Math.sin(_)],R=vd(T,a)>0,v=pn(x,a);if(d===null&&(d=R),R!==d){u.push(v),(d?h:l).push(qe(u)),u=[v],d=R;continue}u.push(v)}return u.length>1&&(d?h:l).push(qe(u)),{back:l.join(""),front:h.join("")}}function Ll(i,t,e,n,s,r,a,o,c="x"){let l=[],h=[],u=Math.ceil(i/e)*e;for(let d=u,p=Math.round(u/e);d<=t+1e-9;d+=e,p++){let g=p%n===0,_=g?a[1]:a[0],m=c==="x"?[d,s]:[s,d],f=c==="x"?[d,s+_]:[s+_,d];(g?h:l).push(Rl(m,f,r,o))}return{minor:l.join(""),major:h.join("")}}function Dl(i,t,e,n,s,r,a,o,c=0,l=Math.PI*2){let h=[],u=[],p=Math.abs(l-Math.PI*2)<1e-9?n:n+1;for(let g=0;g<p;g++){let _=c+g/n*l,m=g%s===0,f=e-(m?a[1]:a[0]),S=Math.sin(_),x=-Math.cos(_);(m?u:h).push(Rl([i+S*f,t+x*f],[i+S*e,t+x*e],r,o))}return{minor:h.join(""),major:u.join("")}}var Ul=(i,t,e,n)=>Ie(i,t,e,n).fill;function Nl(i,t,e,{pad:n=24,headroom:s=0,azimuth:r=45,elevation:a=30}={}){let o={origin:[0,0],scale:1,azimuth:r,elevation:a},c=i.map(m=>pn(m,o)),l=c.map(([m])=>m),h=c.map(([,m])=>m),u=Math.min(...l),d=Math.max(...l),p=Math.min(...h),g=Math.max(...h),_=Math.min((t-n*2)/(d-u),(e-n*2-s)/(g-p));return{origin:[t/2-(u+d)/2*_,s+(e-s)/2-(p+g)/2*_],scale:_,azimuth:r,elevation:a}}var Sd=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),yo=i=>Object.entries(i).filter(([,t])=>t!==void 0&&t!==!1).map(([t,e])=>` ${t}="${Sd(String(e))}"`).join("");function Ol(i,{tone:t="hi",crease:e="faint",halo:n=!1,lit:s=!1,flat:r=!1,className:a,inner:o=""}={}){let c=[];return n&&c.push(`<path class="iso-halo" d="${i.fill}"/>`),c.push(`<path class="iso-fill" d="${i.fill}"/>`),r||(i.shades.forEach((l,h)=>{l&&c.push(`<path class="iso-shade" data-shade="${h}" d="${l}"/>`)}),c.push(`<path class="iso-top" d="${i.top}"/>`)),e!=="none"&&i.crease&&c.push(`<path class="iso-line iso-crease" data-tone="${e}" d="${i.crease}"/>`),e!=="none"&&i.bevel&&c.push(`<path class="iso-line iso-bevel" data-tone="${e}" d="${i.bevel}"/>`),o&&c.push(o),c.push(`<path class="iso-line iso-edge" data-tone="${t}" d="${i.outline}"/>`),`<g${yo({class:a?`iso-solid ${a}`:"iso-solid","data-lit":s?"":void 0})}>${c.join("")}</g>`}function vo(i,{tone:t="lo",dotted:e=!1,dashed:n=!1,flow:s=!1,className:r,free:a}={}){return i?`<path${yo({class:r?`iso-line ${r}`:"iso-line","data-tone":t,"data-free":a===!0?"":a||void 0,"data-dotted":e?"":void 0,"data-dashed":n?"":void 0,"data-flow":s?"":void 0,d:i})}/>`:""}function Fl(i,{size:t=.5,tone:e="mid",pulse:n=!1}={}){let s=i.map(([r,a,o],c)=>`<circle cx="${is(r)}" cy="${is(a)}" r="${t}"${o!==void 0&&o<1?` fill-opacity="${Math.max(0,o).toFixed(2)}"`:""}${n?` data-pulse="" style="--pulse-at:${c*137%1600}ms"`:""}/>`).join("");return`<g class="iso-dots" data-tone="${e}">${s}</g>`}function Bl(i,t,{via:e=[],tone:n="lo",dotted:s=!1,dashed:r=!1,flow:a=!1,ends:o="both",size:c=1.2}={}){let l=qe([i,...e,t]),h=([u,d])=>`<circle class="iso-wire-end" cx="${is(u)}" cy="${is(d)}" r="${c}"/>`;return`<g class="iso-wire" data-tone="${n}">${vo(l,{tone:n,dotted:s,dashed:r,flow:a})}${o==="both"||o==="from"?h(i):""}${o==="both"||o==="to"?h(t):""}</g>`}function kl({width:i,height:t,label:e,body:n,className:s}){return`<svg${yo({xmlns:"http://www.w3.org/2000/svg",class:`iso-svg${s?` ${s}`:""}`,viewBox:`0 0 ${i} ${t}`,role:"img","aria-label":e})}>${Array.isArray(n)?n.join(""):n}</svg>`}var zl=`
.iso{
  --anatomy-page:#0b0b0b;--anatomy-card:#131313;--anatomy-text:#a3a3a3;--anatomy-strong:#e6e6e6;--anatomy-muted:#6e6e6e;
  --anatomy-paper:#131313;--anatomy-face:#1b1b1b;--anatomy-top:#1c1c1c;
  --anatomy-shade-0:#0f0f0f;--anatomy-shade-1:#121212;--anatomy-shade-2:#151515;--anatomy-shade-3:#181818;
  --anatomy-lit-top:#262626;--anatomy-lit-shade:#1d1d1d;
  --anatomy-hi:#d4d4d4;--anatomy-mid:#6a6a6a;--anatomy-lo:#3e3e3e;--anatomy-faint:#2a2a2a;--anatomy-lit:#ffffff;
  --anatomy-halo:#050505;--anatomy-halo-opacity:.9;--anatomy-dot:#e6e6e6;
  --anatomy-red:#ff6b6b;--anatomy-green:#6be0a0;--anatomy-blue:#6b9bff;
  --anatomy-weight:.6px;--anatomy-ease:cubic-bezier(.32,.72,0,1);
  --anatomy-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
}
.iso[data-theme="light"]{
  --anatomy-page:#f2f2ef;--anatomy-card:#fbfbfa;--anatomy-text:#57575a;--anatomy-strong:#18181a;--anatomy-muted:#8c8c90;
  --anatomy-paper:#fbfbfa;--anatomy-face:#ffffff;--anatomy-top:#ffffff;
  --anatomy-shade-0:#dcdcd9;--anatomy-shade-1:#e5e5e2;--anatomy-shade-2:#ededea;--anatomy-shade-3:#f4f4f1;
  --anatomy-lit-top:#ffffff;--anatomy-lit-shade:#eeeeeb;
  --anatomy-hi:#26262a;--anatomy-mid:#8a8a8f;--anatomy-lo:#b4b4b8;--anatomy-faint:#d4d4d6;--anatomy-lit:#000000;
  --anatomy-halo:#8a8a80;--anatomy-halo-opacity:.32;--anatomy-dot:#3a3a3e;
}
.iso-svg{display:block;width:100%;height:auto;overflow:visible}
.iso-svg path,.iso-svg circle{vector-effect:non-scaling-stroke}
.iso-fill{fill:var(--anatomy-paper);stroke:none}
.iso-solid[data-lit]>.iso-fill{fill:var(--anatomy-face)}
.iso-shade,.iso-top{stroke:none}
.iso-shade[data-shade="0"]{fill:var(--anatomy-shade-0)}
.iso-shade[data-shade="1"]{fill:var(--anatomy-shade-1)}
.iso-shade[data-shade="2"]{fill:var(--anatomy-shade-2)}
.iso-shade[data-shade="3"]{fill:var(--anatomy-shade-3)}
.iso-top{fill:var(--anatomy-top)}
.iso-solid[data-lit]>.iso-top{fill:var(--anatomy-lit-top)}
.iso-solid[data-lit]>.iso-shade{fill:var(--anatomy-lit-shade)}
.iso-solid[data-lit]>.iso-edge{stroke:var(--anatomy-lit)}
.iso-halo{fill:var(--anatomy-halo);stroke:none;filter:blur(9px);opacity:var(--anatomy-halo-opacity);transform:translateY(3px)}
.iso-line{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linecap:round;stroke-linejoin:round}
.iso-line[data-tone="hi"]{stroke:var(--anatomy-hi)}
.iso-line[data-tone="mid"]{stroke:var(--anatomy-mid)}
.iso-line[data-tone="lo"]{stroke:var(--anatomy-lo)}
.iso-line[data-tone="faint"]{stroke:var(--anatomy-faint)}
.iso-line[data-tone="lit"]{stroke:var(--anatomy-lit)}
.iso-wire-end{fill:var(--anatomy-paper);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.iso-wire[data-tone="mid"] .iso-wire-end{stroke:var(--anatomy-mid)}
.iso-dots circle{fill:var(--anatomy-dot);stroke:none;opacity:.32}
.iso-dots[data-tone="hi"] circle{opacity:.85}
.iso-dots[data-tone="mid"] circle{opacity:.45}
.iso-figure{margin:0}
.iso-plate{position:relative;padding:48px 20px;border-radius:6px;background:var(--anatomy-card);box-shadow:0 0 0 1px var(--anatomy-mid);--anatomy-paper:var(--anatomy-card)}
.iso-plate-corners{position:absolute;inset:14px 16px;pointer-events:none}
.iso-plate-corner{position:absolute;color:var(--anatomy-muted);font-family:var(--anatomy-mono);font-size:10.5px;line-height:1;letter-spacing:.04em;white-space:nowrap}
.iso-plate-corner[data-corner="fig"]{top:0;left:0;color:var(--anatomy-text)}
.iso-plate-corner[data-corner="title"]{top:0;right:0;text-transform:uppercase;letter-spacing:.08em}
.iso-plate-corner[data-corner="hint"]{bottom:0;left:0;text-transform:uppercase;letter-spacing:.08em}
.iso-plate-corner[data-corner="readout"]{right:0;bottom:0;color:var(--anatomy-text);font-variant-numeric:tabular-nums}
.iso-plate .iso-svg{margin:0 auto}
@media (max-width:560px){.iso-plate{padding:44px 10px 64px}.iso-plate-corner[data-corner="hint"]{bottom:16px}}
`;var ke=[{id:"01",name:"Steel Base Skid & Rubber Feet",indonesian:"Rangka Bawah UNP 100 + Kaki Karet",role:"Anchors the 650 kg loaded machine flat on workshop floor; absorbs vibration from engine and cascading tobacco.",spec:"UNP 100 / Hollow 100x50x3.2 mm steel, 220 x 215 cm footprint, 4 bolted rubber pads.",explode:[0,0,-22]},{id:"02",name:"Twin A-Frame Trunnion Stanchions",indonesian:"Tiang Penyangga A-Frame + Pillow Block",role:"Carries pivoting U-cradle at 154 cm pivot height (CoG height) so tilting requires minimal force.",spec:"Hollow 80x80x3 mm A-legs, 2x UCP-210 50 mm trunnion pillow-block bearings.",explode:[0,14,-8]},{id:"03",name:"Tilting U-Cradle & Worm Tilt Wheel",indonesian:"Rangka Ayun (Cradle) + Roda Kemiringan",role:"Holds drum, rollers, and gearbox together at all angles (-12 deg unload to +32 deg deep mix). Self-locking worm prevents sudden drops.",spec:"Curved channel cradle ring + self-locking worm quadrant handwheel (click in 3D to tilt).",explode:[0,18,8]},{id:"04",name:"4 Trunnion Rollers & Rear Thrust Hub",indonesian:"4 Roda Penumpu + Bearing Dorong Belakang",role:"Supports drum weight cleanly on external rolling tire tracks with mu=0.012 friction instead of stressing thin steamer bottom.",spec:"4x 150 mm polyurethane-on-steel guide rollers (206 bearings) + rear 51112 axial thrust hub.",explode:[-16,0,4]},{id:"05",name:"179x179 cm Baglog Steamer Cylinder",indonesian:"Tabung Steamer Baglog Jamur (179 x 179 cm)",role:"Existing mushroom steamer body (4,505 L). Modified only with bolt-on rolling tire bands and top flange lip.",spec:"179 cm diameter x 179 cm length (~2.5 mm stainless/mild steel), rolled stiffening chimes.",explode:[0,0,18]},{id:"06",name:"4 Helical Lifting Flights & Cross-Deflectors",indonesian:"4 Sirip Pengangkat Heliks + Pembelah Halus",role:"Lifts shredded rajangan gently to 11 o'clock and waterfalls it radially + axially for even blending with <1% bubuk dust.",spec:"4x 14 cm curved smooth SS304 scoops (18 deg helix) + 4x staggered cross-vanes; NO sharp blades.",explode:[0,0,38]},{id:"07",name:"181 cm Tupperware Vault Lid & Davit Hinge",indonesian:"Tutup Vault Model Tupperware + 8 Pengunci + Engsel Ayun",role:"Full-area sealing lid with EPDM U-gasket locks out dust and aroma; 8 toggle latches pop open before the gas-strut davit swings the 48 kg door aside.",spec:"181 cm flanged lid + EPDM U-channel gasket + 8 over-center toggle clamps + swing-davit arm.",explode:[-26,-16,32]},{id:"08",name:"Center Twist-Lock Sample Inspection Cap",indonesian:"Tutup Kecil Cek Sampel & Aroma (Tengah Pintu)",role:"28 cm Tupperware-style twist cap right in the center of the main vault door. Lets grader check blend evenness & aroma without opening the 48 kg door.",spec:"28 cm quick-twist quarter-turn collar + silicone O-ring + knurled T-handle + safety chain.",explode:[-36,-24,52]},{id:"09",name:"144T Bolt-On Ring Gear & 12T Pinion",indonesian:"Roda Gigi Cincin 144T + Pinion 12T (12:1)",role:"12:1 final reduction around the 179 cm barrel cuts gearbox torque by 12x and keeps mesh aligned at any tilt angle.",spec:"#60 roller-chain sprocket ring or segmented steel spur gear (PCD 184 cm, 144T : 12T).",explode:[26,0,12]},{id:"10",name:"Dual-Drive Compound Gearbox & Ratchet",indonesian:"Gearbox 2-Kecepatan + Kopling Pemilih + Ratchet",role:"Dog-clutch locks out crank when engine runs; offers 24:1 Fast Manual (50 kg) and 72:1 Heavy Low (300 kg) with anti-kickback ratchet.",spec:"Selector dog-clutch + 2:1 / 6:1 #50 roller chain stage + one-way ratchet pawl.",explode:[40,14,10]},{id:"11",name:"3 HP Engine / GX160 & 35 cm Crank / Pedal",indonesian:"Dudukan Mesin 3HP / GX160 + Engkol & Pedal",role:"Swappable 2.2 kW electric motor (1:10 reducer) or GX160 petrol engine, plus 35 cm hand crank or 180 W seated pedal module.",spec:"2.2 kW 4-pole motor (10.6 RPM drum), 35 cm crank (4.6 kgf @ 72:1), or seated foot pedal.",explode:[54,24,6]}];function Hl({explode:i=0,selectedPartId:t=null,animated:e=!0}={}){let r={x:-72,y:-56,w:168,d:132,r:4},a=Nl([...Cl(r,-10,140),[-92,-62,0],[112,92,142]],700,450,{pad:22,azimuth:42,elevation:30}),o=(P,C)=>Ol(P,C),c=(P,C)=>vo(P,C),l=(P,C)=>Fl(P,C),h=P=>pn(P,a),u=P=>{if(i<=.001)return"";let[C,N,F]=P.explode.map(Z=>Z*i),Y=pn([0,0,0],a),j=pn([C,N,F],a);return`transform="translate(${(j[0]-Y[0]).toFixed(2)} ${(j[1]-Y[1]).toFixed(2)})"`},d=(P,C,N="")=>{let F=t===P.id;return`<g class="anat-part ${N}${F?" is-selected":""}${t&&!F?" is-dim":""}" data-part="${P.id}" ${u(P)}>${C}</g>`},p=(()=>{let P=[`<path fill="var(--anatomy-halo)" opacity="0.22" d="${Ul(r,-5.5,1,a)}"/>`];for(let[F,Y]of Hr(r,14))P.push(o(fe(F,Y,4.8,-5,1.8,a,24),{tone:"lo"})),P.push(o(fe(F,Y,3.4,-3.2,3.2,a,24),{tone:"mid"}));P.push(o(Ie({x:-66,y:-52,w:158,d:10,r:1.5},0,6,a,4,.8),{tone:"mid"})),P.push(o(Ie({x:-66,y:44,w:158,d:10,r:1.5},0,6,a,4,.8),{tone:"mid"})),P.push(o(Ie({x:-66,y:-42,w:10,d:86,r:1.2},0,6,a,4,.6),{tone:"mid"})),P.push(o(Ie({x:82,y:-42,w:10,d:86,r:1.2},0,6,a,4,.6),{tone:"mid"}));let C={x:-58,y:55.5,w:138,d:5.5,r:1};P.push(o(Ie(C,0,.8,a,3),{tone:"lo",crease:"none"}));let N=Ll(C.x+4,C.x+C.w-4,4,5,C.y+.6,.8,[1.6,3],a);return P.push(c(N.minor,{tone:"lo"}),c(N.major,{tone:"mid"})),P.push(l(Hr({x:-66,y:-52,w:158,d:106},5).map(([F,Y])=>h([F,Y,6])),{size:.55,tone:"hi"})),d(ke[0],P.join(""))})(),g=(()=>{let P=[];return P.push(o(Ie({x:-24,y:-51,w:8,d:8,r:1},6,62,a,4,.5),{tone:"mid"})),P.push(o(Ie({x:16,y:-51,w:8,d:8,r:1},6,62,a,4,.5),{tone:"mid"})),P.push(o(Ie({x:-26,y:-52,w:52,d:10,r:2},66,8,a,4,.7),{tone:"mid"})),P.push(o(fe(0,-47,6,74,4,a,24),{tone:"hi"})),d(ke[1],P.join(""))})(),_=(()=>{let P=[];P.push(o(fe(-48,0,8.5,58,8,a,28),{tone:"hi"})),P.push(c(Gr(-48,0,8.5,62,a,20),{tone:"faint"}));for(let[C,N]of[[-26,-34],[-26,34],[22,-34],[22,34]])P.push(o(fe(C,N,5.5,32,6,a,24),{tone:"hi"})),P.push(l([h([C,N,38])],{size:.5,tone:"hi"}));return d(ke[3],P.join(""))})(),m=44.75,f=(()=>{let P=[];P.push(o(fe(0,0,m,36,22,a,56,.8),{tone:"hi",inner:c(Gr(0,0,m,47,a,30),{tone:"faint"})})),P.push(o(fe(0,0,m+1.8,58,6,a,56),{tone:"mid"})),P.push(o(fe(0,0,m,64,34,a,56,.8),{tone:"hi",inner:c(Gr(0,0,m,81,a,30),{tone:"faint"})})),P.push(o(fe(0,0,m+1.8,98,6,a,56),{tone:"mid"})),P.push(o(fe(0,0,m+1.2,104,10,a,56,.6),{tone:"hi"})),P.push(`<path class="iso-shade" data-shade="0" d="${xo(0,0,m-2.2,114,a,56)}"/>`),P.push(c(xo(0,0,m-2.2,114,a,56),{tone:"mid"}));let C=Array.from({length:16},(N,F)=>{let Y=F/16*Math.PI*2;return h([(m-.5)*Math.cos(Y),(m-.5)*Math.sin(Y),114])});return P.push(l(C,{size:.55,tone:"hi"})),d(ke[4],P.join(""))})(),[S,x]=h([0,0,104]),T=(()=>{let P=[];P.push(o(fe(0,0,5.5,92,22,a,24),{tone:"lit",lit:!0}));for(let C=0;C<4;C++){let N=C*Math.PI/2+.35,F=Math.cos(N),Y=Math.sin(N),j=-Y,Z=F,Q=[[F*7+j*2,Y*7+Z*2],[F*39+j*4.5,Y*39+Z*4.5],[F*41-j*2,Y*41-Z*2],[F*8-j*2,Y*8-Z*2]];P.push(o(zr(Q,96,17,a,{convex:!0,bevel:.6}),{tone:"lit",lit:!0}))}return d(ke[5],`<g class="${e?"anat-bob":""}" style="--cx:${S.toFixed(1)}px;--cy:${x.toFixed(1)}px">${P.join("")}</g>`)})(),R=(()=>{let P=[];P.push(o(fe(0,0,46.2+.6,115.5,2.2,a,56),{tone:"lo"})),P.push(o(fe(0,0,46.2,117.7,3.8,a,56,.9),{tone:"hi"})),P.push(o(fe(0,0,46.2*.72,121.5,3.2,a,48,.8),{tone:"hi"}));for(let F=0;F<8;F++){let Y=F/8*Math.PI*2+.2,j=(46.2+1.5)*Math.cos(Y),Z=(46.2+1.5)*Math.sin(Y);P.push(o(Ie({x:j-2.2,y:Z-2.2,w:4.4,d:4.4,r:.8},114,5.2,a,3),{tone:"hi"}))}P.push(o(Ie({x:-56,y:-3,w:48,d:6,r:1.5},124.5,3.5,a,4,.5),{tone:"mid"})),P.push(o(fe(-52,0,4.2,86,42,a,24),{tone:"mid",crease:"none"}));let N=Il(-44,-14,[5,119],2.5,5,"x",a);return P.push(c(N.back,{tone:"lo"})),P.push(c(N.front,{tone:"mid"})),d(ke[6],P.join(""))})(),v=(()=>{let P=[];return P.push(o(fe(0,0,11.5,124.7,2,a,32),{tone:"lo"})),P.push(o(fe(0,0,10.2,126.7,3.2,a,32,.7),{tone:"lit",lit:!0})),P.push(c(di(0,0,10.2,126.7,129.9,24,a,.2),{tone:"hi"})),P.push(o(Ie({x:-8,y:-2,w:16,d:4,r:1.2},129.9,2.8,a,3,.4),{tone:"lit",lit:!0})),d(ke[7],`<g class="${e?"anat-cap-pulse":""}">${P.join("")}</g>`)})(),A=(()=>{let P=[];return P.push(o(fe(0,0,47.4,49,4.2,a,64),{tone:"hi"})),P.push(c(di(0,0,47.4,49,53.2,72,a,.2),{tone:"mid"})),P.push(o(fe(52.5,0,6.2,48.5,5.2,a,24),{tone:"lit",lit:!0})),P.push(c(di(52.5,0,6.2,48.5,53.7,16,a,.2),{tone:"hi"})),d(ke[8],P.join(""))})(),G=(()=>{let P=[];return P.push(o(Ie({x:-50,y:40,w:102,d:6,r:1.5},28,8,a,4,.6),{tone:"mid"})),P.push(o(Ie({x:46,y:-42,w:7,d:88,r:1.5},28,8,a,4,.6),{tone:"mid"})),P.push(o(fe(0,60,10,62,5,a,32),{tone:"hi"})),P.push(c(di(0,60,10,62,67,28,a),{tone:"lo"})),P.push(c(Dl(0,60,9,24,6,67,[1.5,3],a).major,{tone:"mid"})),d(ke[2],P.join(""))})(),M=(()=>{let P=[];return P.push(o(Ie({x:-24,y:45,w:8,d:8,r:1},6,62,a,4,.5),{tone:"mid"})),P.push(o(Ie({x:16,y:45,w:8,d:8,r:1},6,62,a,4,.5),{tone:"mid"})),P.push(o(Ie({x:-26,y:44,w:52,d:10,r:2},66,8,a,4,.7),{tone:"mid"})),P.push(o(fe(0,49,6,74,4,a,24),{tone:"hi"})),P.push(l([h([-16,49,74]),h([16,49,74])],{size:.55,tone:"hi"})),P.push(o(fe(-32,74,7,0,2.5,a,24),{tone:"lo"})),P.push(o(fe(-32,74,1.8,2.5,83,a,20),{tone:"mid",crease:"none"})),P.push(o(fe(-32,74,4.8,84.5,1.6,a,24),{tone:"lit",lit:!0})),P.push(l([h([-32,74,86.1])],{size:.75,tone:"hi"})),d(ke[1],P.join(""))})(),w=(()=>{let P=[],C={x:54,y:-16,w:28,d:32,r:2.5};return P.push(o(Ie(C,34,24,a,4,.8),{tone:"mid",inner:c(Pl(C,46,a,4),{tone:"faint"})})),P.push(o(Ie({x:48,y:-4.5,w:15,d:9,r:2},46,8,a,4,.4),{tone:"mid"})),P.push(o(fe(68,0,2,58,12,a,18),{tone:"hi",crease:"none"})),P.push(o(fe(68,0,4.2,70,4.5,a,24),{tone:"lit",lit:!0})),P.push(c(di(68,0,4.2,70,74.5,22,a),{tone:"lo"})),P.push(l(Hr(C,3).map(([N,F])=>h([N,F,58])),{size:.45,tone:"hi"})),d(ke[9],P.join(""))})(),O=(()=>{let P=[];return P.push(o(fe(82,-24,9,34,18,a,28,.5),{tone:"hi"})),P.push(c(di(82,-24,9,36,50,28,a),{tone:"mid"})),P.push(o(fe(82,-24,5.5,52,4,a,24),{tone:"mid"})),P.push(Bl(h([82,-15,42]),h([76,-10,42]),{tone:"mid",size:1.3,flow:e})),P.push(o(fe(78,18,2.2,42,4,a,18),{tone:"hi"})),P.push(o(Ie({x:76,y:18,w:4,d:20,r:1.5},42,3.2,a,3),{tone:"lit",lit:!0})),P.push(o(fe(78,36,2.4,45.2,10,a,20),{tone:"lit",lit:!0})),P.push(c(di(78,36,2.4,46,54,16,a),{tone:"lo"})),d(ke[10],P.join(""))})();return kl({width:700,height:450,label:"Animated Isometric Anatomy cutaway of the 179x179cm Baglog Steamer Tobacco Mixer",body:[p,g,_,f,T,A,G,M,w,O,R,v]})}var Gl=zl+`
.iso{
  --anatomy-card:#15181e;--anatomy-page:#0f1115;--anatomy-lit:#d99b38;
  --anatomy-lit-top:#3a2c18;--anatomy-lit-shade:#292014;
}
.iso[data-theme="light"]{
  --anatomy-card:#faf8f4;--anatomy-page:#efede7;--anatomy-lit:#b45309;
  --anatomy-lit-top:#fef3c7;--anatomy-lit-shade:#fde68a;
  --anatomy-hi:#1f242c;--anatomy-mid:#5b6472;--anatomy-lo:#949ca8;--anatomy-faint:#d4d8df;
  --anatomy-halo:#cbd0d8;
}
.anat-part{cursor:pointer;transition:opacity 180ms ease,transform 420ms cubic-bezier(.32,.72,0,1)}
.anat-part.is-dim{opacity:.35}
.anat-part:hover,.anat-part.is-hover{opacity:1!important}
.anat-part:hover .iso-edge,.anat-part.is-hover .iso-edge{stroke:var(--anatomy-lit,#e5a93c)!important;stroke-width:1.4px!important}
.anat-part.is-selected .iso-edge{stroke:#e5a93c!important;stroke-width:1.5px!important}
@keyframes anatBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes anatCap{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.anat-bob{animation:anatBob 2.8s ease-in-out infinite}
.anat-cap-pulse{animation:anatCap 3.2s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.anat-bob,.anat-cap-pulse{animation:none}}
`;var ce={drumDiameterM:1.79,drumRadiusM:.895,drumLengthM:1.79,drumMassKg:295,lidMassKg:48,humanHeightM:1.71,pivotHeightM:1.35,ringTeeth:144,pinionTeeth:12,ringRatio:12,crankRadiusM:.35,pedalCrankRadiusM:.175,tobaccoBulkDensityKgM3:185,dynamicReposeDeg:36,rollingFrictionCoeff:.012,thrustFrictionCoeff:.015,thrustRadiusM:.09,sealDragNm:18,maxGentleTipSpeedMs:1.25,g:9.81},Td=Math.PI*ce.drumRadiusM*ce.drumRadiusM*ce.drumLengthM,Vr={"engine-electric":{id:"engine-electric",label:"Electric Motor 3 HP (2.2 kW)",kind:"engine",ratedPowerW:2200,peakTorqueMotorNm:32,ratedTorqueMotorNm:14.5,baseInputRpm:1450,reducerRatio:10,efficiency:.78,defaultGear:"12:1",minThrottle:.25,maxThrottle:1.4,defaultThrottle:.92},"engine-petrol":{id:"engine-petrol",label:"Petrol Engine GX160 (5.5 HP)",kind:"engine",ratedPowerW:4050,peakTorqueMotorNm:10.3,ratedTorqueMotorNm:8.8,baseInputRpm:2500,reducerRatio:15,efficiency:.74,defaultGear:"12:1",minThrottle:.4,maxThrottle:1.45,defaultThrottle:.85},"human-1":{id:"human-1",label:"1 Person Hand Crank",kind:"human",workers:1,sustainedPowerW:95,burstPowerW:175,comfortableForceN:115,stallForceN:225,armRadiusM:ce.crankRadiusM,nominalCadenceRpm:45,defaultGear:"72:1"},"human-2":{id:"human-2",label:"2 People Twin Cranks",kind:"human",workers:2,sustainedPowerW:185,burstPowerW:340,comfortableForceN:220,stallForceN:430,armRadiusM:ce.crankRadiusM,nominalCadenceRpm:45,defaultGear:"72:1"},"human-pedal":{id:"human-pedal",label:"1 Person Pedal Drive",kind:"human",workers:1,sustainedPowerW:180,burstPowerW:340,comfortableForceN:260,stallForceN:520,armRadiusM:ce.pedalCrankRadiusM,nominalCadenceRpm:60,defaultGear:"72:1"}},Mo={"12:1":{id:"12:1",label:"12:1 Direct Ring (Engine / Test)",totalRatio:12,chainStageRatio:1,efficiency:.86},"24:1":{id:"24:1",label:"24:1 Fast Manual (2:1 x 12:1)",totalRatio:24,chainStageRatio:2,efficiency:.8},"72:1":{id:"72:1",label:"72:1 Heavy Low (6:1 x 12:1)",totalRatio:72,chainStageRatio:6,efficiency:.74}};function Ad(i){let t=Math.max(0,Math.min(.95,i));if(t<=1e-6)return 0;let e=2*Math.PI*t,n=Math.PI*Math.pow(t,.35);for(let s=0;s<16;s++){let r=n-Math.sin(n)-e,a=1-Math.cos(n);Math.abs(a)>1e-6&&(n-=r/a),n=Math.max(.01,Math.min(2*Math.PI-.01,n))}return n}function Rd(i){let t=ce.drumRadiusM;if(i<=.002)return t*.92;let e=Ad(i),n=3*(e-Math.sin(e));if(n<1e-6)return t*.9;let s=Math.sin(e/2);return Math.min(t*.94,4*t*s*s*s/n)}function Wr({driveId:i="engine-electric",gearId:t="12:1",batchKg:e=150,tiltDeg:n=25,throttle:s=.92}){let r=Vr[i]||Vr["engine-electric"],a=Mo[t]||Mo[r.defaultGear]||Mo["72:1"],o=Math.max(5,Math.min(450,e)),c=ce.drumMassKg+o,l=n*Math.PI/180,h=Math.max(.25,Math.cos(l)),u=Math.abs(Math.sin(l)),d=o/ce.tobaccoBulkDensityKgM3,p=Math.min(.85,d/Td),g=Rd(p),_=ce.dynamicReposeDeg*Math.PI/180,m=o*ce.g*h*g*Math.sin(_),f=ce.rollingFrictionCoeff*c*ce.g*h*ce.drumRadiusM,S=ce.thrustFrictionCoeff*c*ce.g*u*ce.thrustRadiusM,x=m+f+S+ce.sealDragNm,T=42.3/Math.sqrt(ce.drumDiameterM)*Math.sqrt(h),R=0,v=0,A=0,G=0,M=0,w=!1,O=!1,X="Optimal",P=a.efficiency;if(r.kind==="engine"){P=r.efficiency;let st=r.reducerRatio*a.totalRatio,K=r.peakTorqueMotorNm*st*P,ot=r.ratedTorqueMotorNm*st*P;if(x>K)w=!0,R=0,v=0,X="ENGINE STALLED \u2014 Reduce batch or add reduction";else{let Mt=x/ot,Ct=Math.min(.22,Mt*.08),St=r.baseInputRpm*s*(1-Ct);R=Math.max(0,St/st),v=R*a.totalRatio;let Nt=R*2*Math.PI/60;A=x*Nt,G=A/P,O=Mt>1.05,O&&(X="High Load (>105% rated torque)")}}else{P=a.efficiency;let st=r.armRadiusM;if(M=x/(a.totalRatio*P)/st,M>r.stallForceN)w=!0,R=0,v=0,X="STALLED \u2014 Force exceeds human limit; shift to 72:1";else{let Ct=r.sustainedPowerW*s*P/x*60/(2*Math.PI),Nt=r.nominalCadenceRpm*Math.min(1.4,.75+.45*s)/a.totalRatio;R=Math.min(Ct,Nt),v=R*a.totalRatio;let Ot=R*2*Math.PI/60;A=x*Ot,G=A/P,M>r.comfortableForceN?(O=!0,X="Heavy Effort \u2014 Shift to 72:1 Low Gear"):X="Human Turnable (Sustainable)"}}let C=R*2*Math.PI/60,N=C*ce.drumRadiusM,F=C*C*ce.drumRadiusM/(ce.g*h),Y=R/T*100,j="Stopped";!w&&R>.01&&(F>=.7?j="Centrifuging (No Mixing!)":F>=.28?j="Cataracting (Bubuk Risk!)":F>=.08?j="Optimal Cascading":F>=.002?j="Gentle Rolling":j="Slow Slumping");let Z="Minimal (<1%)";N>1.85?Z="SEVERE \u2014 Crushing Rajangan":N>ce.maxGentleTipSpeedMs?Z="Moderate \u2014 Slow Down":R>.01&&(Z="Safe (Gentle Cascade)");let Q=F>=.7?1/0:F>=.08?22:16,J=R>.05&&Number.isFinite(Q)?Q/R:null;return{massTob:o,totalMass:c,fillPct:p*100,rCm:g,tiltDeg:n,torqueLiftNm:m,torqueFrictionNm:f+S+ce.sealDragNm,torqueTotalNm:x,criticalRpm:T,drumRpm:R,inputRpm:v,tipSpeedMs:N,froude:F,pctCritical:Y,shaftPowerW:A,inputPowerW:G,handleForceN:M,handleForceKgf:M/ce.g,comfortableForceKgf:(r.comfortableForceN||0)/ce.g,stallForceKgf:(r.stallForceN||0)/ce.g,stalled:w,overloadWarning:O,statusText:X,regime:j,bubukRisk:Z,estMixMinutes:J,gearRatio:a.totalRatio,driveKind:r.kind}}var Zi={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Ki={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Cd=0,Vl=1,Pd=2;var Eu=1,Zc=2,si=3,bi=0,en=1,cn=2;var vi=0,Rs=1,Wl=2,Xl=3,ql=4,Id=5,Ni=100,Ld=101,Dd=102,Yl=103,$l=104,Ud=200,Nd=201,Od=202,Fd=203,ic=204,sc=205,Bd=206,kd=207,zd=208,Hd=209,Gd=210,Vd=211,Wd=212,Xd=213,qd=214,Yd=0,$d=1,Zd=2,Ma=3,Kd=4,Jd=5,jd=6,Qd=7,bu=0,tf=1,ef=2,Mi=0,nf=1,sf=2,rf=3,Kc=4,af=5,of=6;var Su=300,Is=301,Ls=302,rc=303,ac=304,eo=306,Wn=1e3,Pn=1001,oc=1002,on=1003,Zl=1004;var Eo=1005;var vn=1006,cf=1007;var Hi=1008;var Ei=1009,lf=1010,hf=1011,Jc=1012,wu=1013,xi=1014,yi=1015,pr=1016,Tu=1017,Au=1018,Bi=1020,uf=1021,In=1023,df=1024,ff=1025,ki=1026,Ds=1027,pf=1028,Ru=1029,mf=1030,Cu=1031,Pu=1033,bo=33776,So=33777,wo=33778,To=33779,Kl=35840,Jl=35841,jl=35842,Ql=35843,Iu=36196,th=37492,eh=37496,nh=37808,ih=37809,sh=37810,rh=37811,ah=37812,oh=37813,ch=37814,lh=37815,hh=37816,uh=37817,dh=37818,fh=37819,ph=37820,mh=37821,Ao=36492,gh=36494,_h=36495,gf=36283,xh=36284,yh=36285,vh=36286;var Ea=2300,ba=2301,Ro=2302,Mh=2400,Eh=2401,bh=2402;var Lu=3e3,zi=3001,_f=3200,xf=3201,Du=0,yf=1,Mn="",Le="srgb",ai="srgb-linear",jc="display-p3",no="display-p3-linear",Sa="linear",Me="srgb",wa="rec709",Ta="p3";var ss=7680;var Sh=519,vf=512,Mf=513,Ef=514,Uu=515,bf=516,Sf=517,wf=518,Tf=519,cc=35044;var wh="300 es",lc=1035,ri=2e3,Aa=2001,Xn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},je=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Th=1234567,or=Math.PI/180,mr=180/Math.PI;function Vn(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(je[i&255]+je[i>>8&255]+je[i>>16&255]+je[i>>24&255]+"-"+je[t&255]+je[t>>8&255]+"-"+je[t>>16&15|64]+je[t>>24&255]+"-"+je[e&63|128]+je[e>>8&255]+"-"+je[e>>16&255]+je[e>>24&255]+je[n&255]+je[n>>8&255]+je[n>>16&255]+je[n>>24&255]).toLowerCase()}function ze(i,t,e){return Math.max(t,Math.min(e,i))}function Qc(i,t){return(i%t+t)%t}function Af(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Rf(i,t,e){return i!==t?(e-i)/(t-i):0}function cr(i,t,e){return(1-e)*i+e*t}function Cf(i,t,e,n){return cr(i,t,1-Math.exp(-e*n))}function Pf(i,t=1){return t-Math.abs(Qc(i,t*2)-t)}function If(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Lf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Df(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Uf(i,t){return i+Math.random()*(t-i)}function Nf(i){return i*(.5-Math.random())}function Of(i){i!==void 0&&(Th=i);let t=Th+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Ff(i){return i*or}function Bf(i){return i*mr}function hc(i){return(i&i-1)===0&&i!==0}function kf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Ra(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function zf(i,t,e,n,s){let r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),h=a((t+n)/2),u=r((t-n)/2),d=a((t-n)/2),p=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*h,c*u,c*d,o*l);break;case"YZY":i.set(c*d,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*d,o*h,o*l);break;case"XZX":i.set(o*h,c*g,c*p,o*l);break;case"YXY":i.set(c*p,o*h,c*g,o*l);break;case"ZYZ":i.set(c*g,c*p,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Gn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ge(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Nu={DEG2RAD:or,RAD2DEG:mr,generateUUID:Vn,clamp:ze,euclideanModulo:Qc,mapLinear:Af,inverseLerp:Rf,lerp:cr,damp:Cf,pingpong:Pf,smoothstep:If,smootherstep:Lf,randInt:Df,randFloat:Uf,randFloatSpread:Nf,seededRandom:Of,degToRad:Ff,radToDeg:Bf,isPowerOfTwo:hc,ceilPowerOfTwo:kf,floorPowerOfTwo:Ra,setQuaternionFromProperEuler:zf,normalize:ge,denormalize:Gn},ht=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ze(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},se=class i{constructor(t,e,n,s,r,a,o,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l)}set(t,e,n,s,r,a,o,c,l){let h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],_=s[0],m=s[3],f=s[6],S=s[1],x=s[4],T=s[7],R=s[2],v=s[5],A=s[8];return r[0]=a*_+o*S+c*R,r[3]=a*m+o*x+c*v,r[6]=a*f+o*T+c*A,r[1]=l*_+h*S+u*R,r[4]=l*m+h*x+u*v,r[7]=l*f+h*T+u*A,r[2]=d*_+p*S+g*R,r[5]=d*m+p*x+g*v,r[8]=d*f+p*T+g*A,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*r,p=l*r-a*c,g=e*u+n*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=u*_,t[1]=(s*l-h*n)*_,t[2]=(o*n-s*a)*_,t[3]=d*_,t[4]=(h*e-s*c)*_,t[5]=(s*r-o*e)*_,t[6]=p*_,t[7]=(n*c-l*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Co.makeScale(t,e)),this}rotate(t){return this.premultiply(Co.makeRotation(-t)),this}translate(t,e){return this.premultiply(Co.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Co=new se;function Ou(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ca(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Hf(){let i=Ca("canvas");return i.style.display="block",i}var Ah={};function lr(i){i in Ah||(Ah[i]=!0,console.warn(i))}var Rh=new se().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ch=new se().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Xr={[ai]:{transfer:Sa,primaries:wa,toReference:i=>i,fromReference:i=>i},[Le]:{transfer:Me,primaries:wa,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[no]:{transfer:Sa,primaries:Ta,toReference:i=>i.applyMatrix3(Ch),fromReference:i=>i.applyMatrix3(Rh)},[jc]:{transfer:Me,primaries:Ta,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Ch),fromReference:i=>i.applyMatrix3(Rh).convertLinearToSRGB()}},Gf=new Set([ai,no]),_e={enabled:!0,_workingColorSpace:ai,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Gf.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=Xr[t].toReference,s=Xr[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Xr[i].primaries},getTransfer:function(i){return i===Mn?Sa:Xr[i].transfer}};function Cs(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Po(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var rs,Pa=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{rs===void 0&&(rs=Ca("canvas")),rs.width=t.width,rs.height=t.height;let n=rs.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=rs}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Ca("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Cs(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Cs(e[n]/255)*255):e[n]=Cs(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Vf=0,Ia=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vf++}),this.uuid=Vn(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Io(s[a].image)):r.push(Io(s[a]))}else r=Io(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Io(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Pa.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Wf=0,En=class i extends Xn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Pn,s=Pn,r=vn,a=Hi,o=In,c=Ei,l=i.DEFAULT_ANISOTROPY,h=Mn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wf++}),this.uuid=Vn(),this.name="",this.source=new Ia(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new se,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(lr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===zi?Le:Mn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Su)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Wn:t.x=t.x-Math.floor(t.x);break;case Pn:t.x=t.x<0?0:1;break;case oc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Wn:t.y=t.y-Math.floor(t.y);break;case Pn:t.y=t.y<0?0:1;break;case oc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return lr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Le?zi:Lu}set encoding(t){lr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===zi?Le:Mn}};En.DEFAULT_IMAGE=null;En.DEFAULT_MAPPING=Su;En.DEFAULT_ANISOTROPY=1;var Te=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],p=c[5],g=c[9],_=c[2],m=c[6],f=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let x=(l+1)/2,T=(p+1)/2,R=(f+1)/2,v=(h+d)/4,A=(u+_)/4,G=(g+m)/4;return x>T&&x>R?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=v/n,r=A/n):T>R?T<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(T),n=v/s,r=G/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=A/r,s=G/r),this.set(n,s,r,e),this}let S=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-_)/S,this.z=(d-h)/S,this.w=Math.acos((l+p+f-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},uc=class extends Xn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Te(0,0,t,e),this.scissorTest=!1,this.viewport=new Te(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(lr("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===zi?Le:Mn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:vn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new En(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Ia(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},oi=class extends uc{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},La=class extends En{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=on,this.minFilter=on,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var dc=class extends En{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=on,this.minFilter=on,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ln=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3],d=r[a+0],p=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==d||l!==p||h!==g){let m=1-o,f=c*d+l*p+h*g+u*_,S=f>=0?1:-1,x=1-f*f;if(x>Number.EPSILON){let R=Math.sqrt(x),v=Math.atan2(R,f*S);m=Math.sin(m*v)/R,o=Math.sin(o*v)/R}let T=o*S;if(c=c*m+d*T,l=l*m+p*T,h=h*m+g*T,u=u*m+_*T,m===1-o){let R=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=R,l*=R,h*=R,u*=R}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[a],d=r[a+1],p=r[a+2],g=r[a+3];return t[e]=o*g+h*u+c*p-l*d,t[e+1]=c*g+h*d+l*u-o*p,t[e+2]=l*g+h*p+o*d-c*u,t[e+3]=h*g-o*u-c*d-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),u=o(r/2),d=c(n/2),p=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"YZX":this._x=d*h*u+l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u-d*p*g;break;case"XZY":this._x=d*h*u-l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(n>o&&n>u){let p=2*Math.sqrt(1+n-o-u);this._w=(h-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>u){let p=2*Math.sqrt(1+o-n-u);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+h)/p}else{let p=2*Math.sqrt(1+u-n-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ze(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let p=1-e;return this._w=p*a+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},D=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ph.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ph.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*n),h=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Lo.copy(this).projectOnVector(t),this.sub(Lo)}reflect(t){return this.sub(Lo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ze(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Lo=new D,Ph=new Ln,Dn=class{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Tn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Tn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Tn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Tn):Tn.fromBufferAttribute(r,a),Tn.applyMatrix4(t.matrixWorld),this.expandByPoint(Tn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),qr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),qr.copy(n.boundingBox)),qr.applyMatrix4(t.matrixWorld),this.union(qr)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Tn),Tn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Js),Yr.subVectors(this.max,Js),as.subVectors(t.a,Js),os.subVectors(t.b,Js),cs.subVectors(t.c,Js),fi.subVectors(os,as),pi.subVectors(cs,os),Pi.subVectors(as,cs);let e=[0,-fi.z,fi.y,0,-pi.z,pi.y,0,-Pi.z,Pi.y,fi.z,0,-fi.x,pi.z,0,-pi.x,Pi.z,0,-Pi.x,-fi.y,fi.x,0,-pi.y,pi.x,0,-Pi.y,Pi.x,0];return!Do(e,as,os,cs,Yr)||(e=[1,0,0,0,1,0,0,0,1],!Do(e,as,os,cs,Yr))?!1:($r.crossVectors(fi,pi),e=[$r.x,$r.y,$r.z],Do(e,as,os,cs,Yr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Tn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Tn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Qn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Qn=[new D,new D,new D,new D,new D,new D,new D,new D],Tn=new D,qr=new Dn,as=new D,os=new D,cs=new D,fi=new D,pi=new D,Pi=new D,Js=new D,Yr=new D,$r=new D,Ii=new D;function Do(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ii.fromArray(i,r);let o=s.x*Math.abs(Ii.x)+s.y*Math.abs(Ii.y)+s.z*Math.abs(Ii.z),c=t.dot(Ii),l=e.dot(Ii),h=n.dot(Ii);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}var Xf=new Dn,js=new D,Uo=new D,Gi=class{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Xf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;js.subVectors(t,this.center);let e=js.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(js,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Uo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(js.copy(t.center).add(Uo)),this.expandByPoint(js.copy(t.center).sub(Uo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},ti=new D,No=new D,Zr=new D,mi=new D,Oo=new D,Kr=new D,Fo=new D,Us=class{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ti)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=ti.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ti.copy(this.origin).addScaledVector(this.direction,e),ti.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){No.copy(t).add(e).multiplyScalar(.5),Zr.copy(e).sub(t).normalize(),mi.copy(this.origin).sub(No);let r=t.distanceTo(e)*.5,a=-this.direction.dot(Zr),o=mi.dot(this.direction),c=-mi.dot(Zr),l=mi.lengthSq(),h=Math.abs(1-a*a),u,d,p,g;if(h>0)if(u=a*c-o,d=a*o-c,g=r*h,u>=0)if(d>=-g)if(d<=g){let _=1/h;u*=_,d*=_,p=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),p=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(No).addScaledVector(Zr,d),p}intersectSphere(t,e){ti.subVectors(t.center,this.origin);let n=ti.dot(this.direction),s=ti.dot(ti)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,ti)!==null}intersectTriangle(t,e,n,s,r){Oo.subVectors(e,t),Kr.subVectors(n,t),Fo.crossVectors(Oo,Kr);let a=this.direction.dot(Fo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;mi.subVectors(this.origin,t);let c=o*this.direction.dot(Kr.crossVectors(mi,Kr));if(c<0)return null;let l=o*this.direction.dot(Oo.cross(mi));if(l<0||c+l>a)return null;let h=-o*mi.dot(Fo);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ae=class i{constructor(t,e,n,s,r,a,o,c,l,h,u,d,p,g,_,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l,h,u,d,p,g,_,m)}set(t,e,n,s,r,a,o,c,l,h,u,d,p,g,_,m){let f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=c,f[2]=l,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/ls.setFromMatrixColumn(t,0).length(),r=1/ls.setFromMatrixColumn(t,1).length(),a=1/ls.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=a*h,p=a*u,g=o*h,_=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=p+g*l,e[5]=d-_*l,e[9]=-o*c,e[2]=_-d*l,e[6]=g+p*l,e[10]=a*c}else if(t.order==="YXZ"){let d=c*h,p=c*u,g=l*h,_=l*u;e[0]=d+_*o,e[4]=g*o-p,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=p*o-g,e[6]=_+d*o,e[10]=a*c}else if(t.order==="ZXY"){let d=c*h,p=c*u,g=l*h,_=l*u;e[0]=d-_*o,e[4]=-a*u,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*h,e[9]=_-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){let d=a*h,p=a*u,g=o*h,_=o*u;e[0]=c*h,e[4]=g*l-p,e[8]=d*l+_,e[1]=c*u,e[5]=_*l+d,e[9]=p*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){let d=a*c,p=a*l,g=o*c,_=o*l;e[0]=c*h,e[4]=_-d*u,e[8]=g*u+p,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=p*u+g,e[10]=d-_*u}else if(t.order==="XZY"){let d=a*c,p=a*l,g=o*c,_=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+_,e[5]=a*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=o*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(qf,t,Yf)}lookAt(t,e,n){let s=this.elements;return mn.subVectors(t,e),mn.lengthSq()===0&&(mn.z=1),mn.normalize(),gi.crossVectors(n,mn),gi.lengthSq()===0&&(Math.abs(n.z)===1?mn.x+=1e-4:mn.z+=1e-4,mn.normalize(),gi.crossVectors(n,mn)),gi.normalize(),Jr.crossVectors(mn,gi),s[0]=gi.x,s[4]=Jr.x,s[8]=mn.x,s[1]=gi.y,s[5]=Jr.y,s[9]=mn.y,s[2]=gi.z,s[6]=Jr.z,s[10]=mn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],_=n[6],m=n[10],f=n[14],S=n[3],x=n[7],T=n[11],R=n[15],v=s[0],A=s[4],G=s[8],M=s[12],w=s[1],O=s[5],X=s[9],P=s[13],C=s[2],N=s[6],F=s[10],Y=s[14],j=s[3],Z=s[7],Q=s[11],J=s[15];return r[0]=a*v+o*w+c*C+l*j,r[4]=a*A+o*O+c*N+l*Z,r[8]=a*G+o*X+c*F+l*Q,r[12]=a*M+o*P+c*Y+l*J,r[1]=h*v+u*w+d*C+p*j,r[5]=h*A+u*O+d*N+p*Z,r[9]=h*G+u*X+d*F+p*Q,r[13]=h*M+u*P+d*Y+p*J,r[2]=g*v+_*w+m*C+f*j,r[6]=g*A+_*O+m*N+f*Z,r[10]=g*G+_*X+m*F+f*Q,r[14]=g*M+_*P+m*Y+f*J,r[3]=S*v+x*w+T*C+R*j,r[7]=S*A+x*O+T*N+R*Z,r[11]=S*G+x*X+T*F+R*Q,r[15]=S*M+x*P+T*Y+R*J,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],p=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+r*c*u-s*l*u-r*o*d+n*l*d+s*o*p-n*c*p)+_*(+e*c*p-e*l*d+r*a*d-s*a*p+s*l*h-r*c*h)+m*(+e*l*u-e*o*p-r*a*u+n*a*p+r*o*h-n*l*h)+f*(-s*o*h-e*c*u+e*o*d+s*a*u-n*a*d+n*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],p=t[11],g=t[12],_=t[13],m=t[14],f=t[15],S=u*m*l-_*d*l+_*c*p-o*m*p-u*c*f+o*d*f,x=g*d*l-h*m*l-g*c*p+a*m*p+h*c*f-a*d*f,T=h*_*l-g*u*l+g*o*p-a*_*p-h*o*f+a*u*f,R=g*u*c-h*_*c-g*o*d+a*_*d+h*o*m-a*u*m,v=e*S+n*x+s*T+r*R;if(v===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/v;return t[0]=S*A,t[1]=(_*d*r-u*m*r-_*s*p+n*m*p+u*s*f-n*d*f)*A,t[2]=(o*m*r-_*c*r+_*s*l-n*m*l-o*s*f+n*c*f)*A,t[3]=(u*c*r-o*d*r-u*s*l+n*d*l+o*s*p-n*c*p)*A,t[4]=x*A,t[5]=(h*m*r-g*d*r+g*s*p-e*m*p-h*s*f+e*d*f)*A,t[6]=(g*c*r-a*m*r-g*s*l+e*m*l+a*s*f-e*c*f)*A,t[7]=(a*d*r-h*c*r+h*s*l-e*d*l-a*s*p+e*c*p)*A,t[8]=T*A,t[9]=(g*u*r-h*_*r-g*n*p+e*_*p+h*n*f-e*u*f)*A,t[10]=(a*_*r-g*o*r+g*n*l-e*_*l-a*n*f+e*o*f)*A,t[11]=(h*o*r-a*u*r-h*n*l+e*u*l+a*n*p-e*o*p)*A,t[12]=R*A,t[13]=(h*_*s-g*u*s+g*n*d-e*_*d-h*n*m+e*u*m)*A,t[14]=(g*o*s-a*_*s-g*n*c+e*_*c+a*n*m-e*o*m)*A,t[15]=(a*u*s-h*o*s+h*n*c-e*u*c-a*n*d+e*o*d)*A,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,u=o+o,d=r*l,p=r*h,g=r*u,_=a*h,m=a*u,f=o*u,S=c*l,x=c*h,T=c*u,R=n.x,v=n.y,A=n.z;return s[0]=(1-(_+f))*R,s[1]=(p+T)*R,s[2]=(g-x)*R,s[3]=0,s[4]=(p-T)*v,s[5]=(1-(d+f))*v,s[6]=(m+S)*v,s[7]=0,s[8]=(g+x)*A,s[9]=(m-S)*A,s[10]=(1-(d+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=ls.set(s[0],s[1],s[2]).length(),a=ls.set(s[4],s[5],s[6]).length(),o=ls.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],An.copy(this);let l=1/r,h=1/a,u=1/o;return An.elements[0]*=l,An.elements[1]*=l,An.elements[2]*=l,An.elements[4]*=h,An.elements[5]*=h,An.elements[6]*=h,An.elements[8]*=u,An.elements[9]*=u,An.elements[10]*=u,e.setFromRotationMatrix(An),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=ri){let c=this.elements,l=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s),p,g;if(o===ri)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Aa)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=ri){let c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(a-r),d=(e+t)*l,p=(n+s)*h,g,_;if(o===ri)g=(a+r)*u,_=-2*u;else if(o===Aa)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},ls=new D,An=new Ae,qf=new D(0,0,0),Yf=new D(1,1,1),gi=new D,Jr=new D,mn=new D,Ih=new Ae,Lh=new Ln,Da=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ze(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ze(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ze(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ih.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ih,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Lh.setFromEuler(this),this.setFromQuaternion(Lh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Da.DEFAULT_ORDER="XYZ";var gr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},$f=0,Dh=new D,hs=new Ln,ei=new Ae,jr=new D,Qs=new D,Zf=new D,Kf=new Ln,Uh=new D(1,0,0),Nh=new D(0,1,0),Oh=new D(0,0,1),Jf={type:"added"},jf={type:"removed"},$e=class i extends Xn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$f++}),this.uuid=Vn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new D,e=new Da,n=new Ln,s=new D(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ae},normalMatrix:{value:new se}}),this.matrix=new Ae,this.matrixWorld=new Ae,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return hs.setFromAxisAngle(t,e),this.quaternion.multiply(hs),this}rotateOnWorldAxis(t,e){return hs.setFromAxisAngle(t,e),this.quaternion.premultiply(hs),this}rotateX(t){return this.rotateOnAxis(Uh,t)}rotateY(t){return this.rotateOnAxis(Nh,t)}rotateZ(t){return this.rotateOnAxis(Oh,t)}translateOnAxis(t,e){return Dh.copy(t).applyQuaternion(this.quaternion),this.position.add(Dh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Uh,t)}translateY(t){return this.translateOnAxis(Nh,t)}translateZ(t){return this.translateOnAxis(Oh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ei.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?jr.copy(t):jr.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Qs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ei.lookAt(Qs,jr,this.up):ei.lookAt(jr,Qs,this.up),this.quaternion.setFromRotationMatrix(ei),s&&(ei.extractRotation(s.matrixWorld),hs.setFromRotationMatrix(ei),this.quaternion.premultiply(hs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Jf)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(jf)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ei.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ei.multiply(t.parent.matrixWorld)),t.applyMatrix4(ei),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,t,Zf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,Kf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++){let o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){let o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let c=[];for(let l in o){let h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};$e.DEFAULT_UP=new D(0,1,0);$e.DEFAULT_MATRIX_AUTO_UPDATE=!0;$e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Rn=new D,ni=new D,Bo=new D,ii=new D,us=new D,ds=new D,Fh=new D,ko=new D,zo=new D,Ho=new D,Qr=!1,Fi=class i{constructor(t=new D,e=new D,n=new D){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Rn.subVectors(t,e),s.cross(Rn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Rn.subVectors(s,e),ni.subVectors(n,e),Bo.subVectors(t,e);let a=Rn.dot(Rn),o=Rn.dot(ni),c=Rn.dot(Bo),l=ni.dot(ni),h=ni.dot(Bo),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,p=(l*c-o*h)*d,g=(a*h-o*c)*d;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,ii)===null?!1:ii.x>=0&&ii.y>=0&&ii.x+ii.y<=1}static getUV(t,e,n,s,r,a,o,c){return Qr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Qr=!0),this.getInterpolation(t,e,n,s,r,a,o,c)}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,ii)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ii.x),c.addScaledVector(a,ii.y),c.addScaledVector(o,ii.z),c)}static isFrontFacing(t,e,n,s){return Rn.subVectors(n,e),ni.subVectors(t,e),Rn.cross(ni).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Rn.subVectors(this.c,this.b),ni.subVectors(this.a,this.b),Rn.cross(ni).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Qr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Qr=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;us.subVectors(s,n),ds.subVectors(r,n),ko.subVectors(t,n);let c=us.dot(ko),l=ds.dot(ko);if(c<=0&&l<=0)return e.copy(n);zo.subVectors(t,s);let h=us.dot(zo),u=ds.dot(zo);if(h>=0&&u<=h)return e.copy(s);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(us,a);Ho.subVectors(t,r);let p=us.dot(Ho),g=ds.dot(Ho);if(g>=0&&p<=g)return e.copy(r);let _=p*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(ds,o);let m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Fh.subVectors(r,s),o=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(Fh,o);let f=1/(m+_+d);return a=_*f,o=d*f,e.copy(n).addScaledVector(us,a).addScaledVector(ds,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Fu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_i={h:0,s:0,l:0},ta={h:0,s:0,l:0};function Go(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Jt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Le){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,_e.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=_e.workingColorSpace){return this.r=t,this.g=e,this.b=n,_e.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=_e.workingColorSpace){if(t=Qc(t,1),e=ze(e,0,1),n=ze(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Go(a,r,t+1/3),this.g=Go(a,r,t),this.b=Go(a,r,t-1/3)}return _e.toWorkingColorSpace(this,s),this}setStyle(t,e=Le){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Le){let n=Fu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Cs(t.r),this.g=Cs(t.g),this.b=Cs(t.b),this}copyLinearToSRGB(t){return this.r=Po(t.r),this.g=Po(t.g),this.b=Po(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Le){return _e.fromWorkingColorSpace(Qe.copy(this),t),Math.round(ze(Qe.r*255,0,255))*65536+Math.round(ze(Qe.g*255,0,255))*256+Math.round(ze(Qe.b*255,0,255))}getHexString(t=Le){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=_e.workingColorSpace){_e.fromWorkingColorSpace(Qe.copy(this),e);let n=Qe.r,s=Qe.g,r=Qe.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,h=(o+a)/2;if(o===a)c=0,l=0;else{let u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=_e.workingColorSpace){return _e.fromWorkingColorSpace(Qe.copy(this),e),t.r=Qe.r,t.g=Qe.g,t.b=Qe.b,t}getStyle(t=Le){_e.fromWorkingColorSpace(Qe.copy(this),t);let e=Qe.r,n=Qe.g,s=Qe.b;return t!==Le?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(_i),this.setHSL(_i.h+t,_i.s+e,_i.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(_i),t.getHSL(ta);let n=cr(_i.h,ta.h,e),s=cr(_i.s,ta.s,e),r=cr(_i.l,ta.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Qe=new Jt;Jt.NAMES=Fu;var Qf=0,Si=class extends Xn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qf++}),this.uuid=Vn(),this.name="",this.type="Material",this.blending=Rs,this.side=bi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ic,this.blendDst=sc,this.blendEquation=Ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Jt(0,0,0),this.blendAlpha=0,this.depthFunc=Ma,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Sh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ss,this.stencilZFail=ss,this.stencilZPass=ss,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Rs&&(n.blending=this.blending),this.side!==bi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ic&&(n.blendSrc=this.blendSrc),this.blendDst!==sc&&(n.blendDst=this.blendDst),this.blendEquation!==Ni&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ma&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Sh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ss&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ss&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ss&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},ci=class extends Si{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Jt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=bu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Oe=new D,ea=new ht,nn=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=cc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=yi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ea.fromBufferAttribute(this,e),ea.applyMatrix3(t),this.setXY(e,ea.x,ea.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyMatrix3(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyMatrix4(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyNormalMatrix(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.transformDirection(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Gn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ge(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Gn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Gn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Gn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Gn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array),r=ge(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==cc&&(t.usage=this.usage),t}};var Ua=class extends nn{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Na=class extends nn{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Ee=class extends nn{constructor(t,e,n){super(new Float32Array(t),e,n)}};var tp=0,yn=new Ae,Vo=new $e,fs=new D,gn=new Dn,tr=new Dn,Ye=new D,ln=class i extends Xn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tp++}),this.uuid=Vn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ou(t)?Na:Ua)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new se().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return yn.makeRotationFromQuaternion(t),this.applyMatrix4(yn),this}rotateX(t){return yn.makeRotationX(t),this.applyMatrix4(yn),this}rotateY(t){return yn.makeRotationY(t),this.applyMatrix4(yn),this}rotateZ(t){return yn.makeRotationZ(t),this.applyMatrix4(yn),this}translate(t,e,n){return yn.makeTranslation(t,e,n),this.applyMatrix4(yn),this}scale(t,e,n){return yn.makeScale(t,e,n),this.applyMatrix4(yn),this}lookAt(t){return Vo.lookAt(t),Vo.updateMatrix(),this.applyMatrix4(Vo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fs).negate(),this.translate(fs.x,fs.y,fs.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Ee(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Dn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];gn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ye.addVectors(this.boundingBox.min,gn.min),this.boundingBox.expandByPoint(Ye),Ye.addVectors(this.boundingBox.max,gn.max),this.boundingBox.expandByPoint(Ye)):(this.boundingBox.expandByPoint(gn.min),this.boundingBox.expandByPoint(gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Gi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new D,1/0);return}if(t){let n=this.boundingSphere.center;if(gn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];tr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ye.addVectors(gn.min,tr.min),gn.expandByPoint(Ye),Ye.addVectors(gn.max,tr.max),gn.expandByPoint(Ye)):(gn.expandByPoint(tr.min),gn.expandByPoint(tr.max))}gn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Ye.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ye));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Ye.fromBufferAttribute(o,l),c&&(fs.fromBufferAttribute(t,l),Ye.add(fs)),s=Math.max(s,n.distanceToSquared(Ye))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new nn(new Float32Array(4*o),4));let c=this.getAttribute("tangent").array,l=[],h=[];for(let w=0;w<o;w++)l[w]=new D,h[w]=new D;let u=new D,d=new D,p=new D,g=new ht,_=new ht,m=new ht,f=new D,S=new D;function x(w,O,X){u.fromArray(s,w*3),d.fromArray(s,O*3),p.fromArray(s,X*3),g.fromArray(a,w*2),_.fromArray(a,O*2),m.fromArray(a,X*2),d.sub(u),p.sub(u),_.sub(g),m.sub(g);let P=1/(_.x*m.y-m.x*_.y);isFinite(P)&&(f.copy(d).multiplyScalar(m.y).addScaledVector(p,-_.y).multiplyScalar(P),S.copy(p).multiplyScalar(_.x).addScaledVector(d,-m.x).multiplyScalar(P),l[w].add(f),l[O].add(f),l[X].add(f),h[w].add(S),h[O].add(S),h[X].add(S))}let T=this.groups;T.length===0&&(T=[{start:0,count:n.length}]);for(let w=0,O=T.length;w<O;++w){let X=T[w],P=X.start,C=X.count;for(let N=P,F=P+C;N<F;N+=3)x(n[N+0],n[N+1],n[N+2])}let R=new D,v=new D,A=new D,G=new D;function M(w){A.fromArray(r,w*3),G.copy(A);let O=l[w];R.copy(O),R.sub(A.multiplyScalar(A.dot(O))).normalize(),v.crossVectors(G,O);let P=v.dot(h[w])<0?-1:1;c[w*4]=R.x,c[w*4+1]=R.y,c[w*4+2]=R.z,c[w*4+3]=P}for(let w=0,O=T.length;w<O;++w){let X=T[w],P=X.start,C=X.count;for(let N=P,F=P+C;N<F;N+=3)M(n[N+0]),M(n[N+1]),M(n[N+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new nn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let s=new D,r=new D,a=new D,o=new D,c=new D,l=new D,h=new D,u=new D;if(t)for(let d=0,p=t.count;d<p;d+=3){let g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ye.fromBufferAttribute(t,e),Ye.normalize(),t.setXYZ(e,Ye.x,Ye.y,Ye.z)}toNonIndexed(){function t(o,c){let l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h),p=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?p=c[_]*o.data.stride+o.offset:p=c[_]*h;for(let f=0;f<h;f++)d[g++]=l[p++]}return new nn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=t(c,n);e.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){let d=l[h],p=t(d,n);c.push(p)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let p=l[u];h.push(p.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let l=0,h=a.length;l<h;l++){let u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Bh=new Ae,Li=new Us,na=new Gi,kh=new D,ps=new D,ms=new D,gs=new D,Wo=new D,ia=new D,sa=new ht,ra=new ht,aa=new ht,zh=new D,Hh=new D,Gh=new D,oa=new D,ca=new D,at=class extends $e{constructor(t=new ln,e=new ci){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){ia.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=o[c],u=r[c];h!==0&&(Wo.fromBufferAttribute(u,t),a?ia.addScaledVector(Wo,h):ia.addScaledVector(Wo.sub(e),h))}e.add(ia)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),na.copy(n.boundingSphere),na.applyMatrix4(r),Li.copy(t.ray).recast(t.near),!(na.containsPoint(Li.origin)===!1&&(Li.intersectSphere(na,kh)===null||Li.origin.distanceToSquared(kh)>(t.far-t.near)**2))&&(Bh.copy(r).invert(),Li.copy(t.ray).applyMatrix4(Bh),!(n.boundingBox!==null&&Li.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Li)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=a[m.materialIndex],S=Math.max(m.start,p.start),x=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let T=S,R=x;T<R;T+=3){let v=o.getX(T),A=o.getX(T+1),G=o.getX(T+2);s=la(this,f,t,n,l,h,u,v,A,G),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let S=o.getX(m),x=o.getX(m+1),T=o.getX(m+2);s=la(this,a,t,n,l,h,u,S,x,T),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=a[m.materialIndex],S=Math.max(m.start,p.start),x=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let T=S,R=x;T<R;T+=3){let v=T,A=T+1,G=T+2;s=la(this,f,t,n,l,h,u,v,A,G),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let S=m,x=m+1,T=m+2;s=la(this,a,t,n,l,h,u,S,x,T),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function ep(i,t,e,n,s,r,a,o){let c;if(t.side===en?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===bi,o),c===null)return null;ca.copy(o),ca.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(ca);return l<e.near||l>e.far?null:{distance:l,point:ca.clone(),object:i}}function la(i,t,e,n,s,r,a,o,c,l){i.getVertexPosition(o,ps),i.getVertexPosition(c,ms),i.getVertexPosition(l,gs);let h=ep(i,t,e,n,ps,ms,gs,oa);if(h){s&&(sa.fromBufferAttribute(s,o),ra.fromBufferAttribute(s,c),aa.fromBufferAttribute(s,l),h.uv=Fi.getInterpolation(oa,ps,ms,gs,sa,ra,aa,new ht)),r&&(sa.fromBufferAttribute(r,o),ra.fromBufferAttribute(r,c),aa.fromBufferAttribute(r,l),h.uv1=Fi.getInterpolation(oa,ps,ms,gs,sa,ra,aa,new ht),h.uv2=h.uv1),a&&(zh.fromBufferAttribute(a,o),Hh.fromBufferAttribute(a,c),Gh.fromBufferAttribute(a,l),h.normal=Fi.getInterpolation(oa,ps,ms,gs,zh,Hh,Gh,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:c,c:l,normal:new D,materialIndex:0};Fi.getNormal(ps,ms,gs,u.normal),h.face=u}return h}var ee=class i extends ln{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],h=[],u=[],d=0,p=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Ee(l,3)),this.setAttribute("normal",new Ee(h,3)),this.setAttribute("uv",new Ee(u,2));function g(_,m,f,S,x,T,R,v,A,G,M){let w=T/A,O=R/G,X=T/2,P=R/2,C=v/2,N=A+1,F=G+1,Y=0,j=0,Z=new D;for(let Q=0;Q<F;Q++){let J=Q*O-P;for(let st=0;st<N;st++){let K=st*w-X;Z[_]=K*S,Z[m]=J*x,Z[f]=C,l.push(Z.x,Z.y,Z.z),Z[_]=0,Z[m]=0,Z[f]=v>0?1:-1,h.push(Z.x,Z.y,Z.z),u.push(st/A),u.push(1-Q/G),Y+=1}}for(let Q=0;Q<G;Q++)for(let J=0;J<A;J++){let st=d+J+N*Q,K=d+J+N*(Q+1),ot=d+(J+1)+N*(Q+1),Mt=d+(J+1)+N*Q;c.push(st,K,Mt),c.push(K,ot,Mt),j+=6}o.addGroup(p,j,M),p+=j,d+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Ns(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function an(i){let t={};for(let e=0;e<i.length;e++){let n=Ns(i[e]);for(let s in n)t[s]=n[s]}return t}function np(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Bu(i){return i.getRenderTarget()===null?i.outputColorSpace:_e.workingColorSpace}var ip={clone:Ns,merge:an},sp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,rp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,li=class extends Si{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sp,this.fragmentShader=rp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ns(t.uniforms),this.uniformsGroups=np(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Oa=class extends $e{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ae,this.projectionMatrix=new Ae,this.projectionMatrixInverse=new Ae,this.coordinateSystem=ri}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},tn=class extends Oa{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=mr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(or*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return mr*2*Math.atan(Math.tan(or*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(or*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},_s=-90,xs=1,fc=class extends $e{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new tn(_s,xs,t,e);s.layers=this.layers,this.add(s);let r=new tn(_s,xs,t,e);r.layers=this.layers,this.add(r);let a=new tn(_s,xs,t,e);a.layers=this.layers,this.add(a);let o=new tn(_s,xs,t,e);o.layers=this.layers,this.add(o);let c=new tn(_s,xs,t,e);c.layers=this.layers,this.add(c);let l=new tn(_s,xs,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(let l of e)this.remove(l);if(t===ri)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Aa)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Fa=class extends En{constructor(t,e,n,s,r,a,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Is,super(t,e,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},pc=class extends oi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(lr("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===zi?Le:Mn),this.texture=new Fa(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:vn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ee(5,5,5),r=new li({name:"CubemapFromEquirect",uniforms:Ns(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:en,blending:vi});r.uniforms.tEquirect.value=e;let a=new at(s,r),o=e.minFilter;return e.minFilter===Hi&&(e.minFilter=vn),new fc(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}},Xo=new D,ap=new D,op=new se,Cn=class{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Xo.subVectors(n,e).cross(ap.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Xo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||op.getNormalMatrix(t),s=this.coplanarPoint(Xo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Di=new Gi,ha=new D,_r=class{constructor(t=new Cn,e=new Cn,n=new Cn,s=new Cn,r=new Cn,a=new Cn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ri){let n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],p=s[8],g=s[9],_=s[10],m=s[11],f=s[12],S=s[13],x=s[14],T=s[15];if(n[0].setComponents(c-r,d-l,m-p,T-f).normalize(),n[1].setComponents(c+r,d+l,m+p,T+f).normalize(),n[2].setComponents(c+a,d+h,m+g,T+S).normalize(),n[3].setComponents(c-a,d-h,m-g,T-S).normalize(),n[4].setComponents(c-o,d-u,m-_,T-x).normalize(),e===ri)n[5].setComponents(c+o,d+u,m+_,T+x).normalize();else if(e===Aa)n[5].setComponents(o,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Di.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Di.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Di)}intersectsSprite(t){return Di.center.set(0,0,0),Di.radius=.7071067811865476,Di.applyMatrix4(t.matrixWorld),this.intersectsSphere(Di)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(ha.x=s.normal.x>0?t.max.x:t.min.x,ha.y=s.normal.y>0?t.max.y:t.min.y,ha.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ha)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function ku(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function cp(i,t){let e=t.isWebGL2,n=new WeakMap;function s(l,h){let u=l.array,d=l.usage,p=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,d),l.onUploadCallback();let _;if(u instanceof Float32Array)_=i.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=i.SHORT;else if(u instanceof Uint32Array)_=i.UNSIGNED_INT;else if(u instanceof Int32Array)_=i.INT;else if(u instanceof Int8Array)_=i.BYTE;else if(u instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:p}}function r(l,h,u){let d=h.array,p=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,l),p.count===-1&&g.length===0&&i.bufferSubData(u,0,d),g.length!==0){for(let _=0,m=g.length;_<m;_++){let f=g[_];e?i.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d,f.start,f.count):i.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d.subarray(f.start,f.start+f.count))}h.clearUpdateRanges()}p.count!==-1&&(e?i.bufferSubData(u,p.offset*d.BYTES_PER_ELEMENT,d,p.offset,p.count):i.bufferSubData(u,p.offset*d.BYTES_PER_ELEMENT,d.subarray(p.offset,p.offset+p.count)),p.count=-1),h.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function o(l){l.isInterleavedBufferAttribute&&(l=l.data);let h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){let d=n.get(l);(!d||d.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);let u=n.get(l);if(u===void 0)n.set(l,s(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,l,h),u.version=l.version}}return{get:a,remove:o,update:c}}var xr=class i extends ln{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,u=t/o,d=e/c,p=[],g=[],_=[],m=[];for(let f=0;f<h;f++){let S=f*d-a;for(let x=0;x<l;x++){let T=x*u-r;g.push(T,-S,0),_.push(0,0,1),m.push(x/o),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let S=0;S<o;S++){let x=S+l*f,T=S+l*(f+1),R=S+1+l*(f+1),v=S+1+l*f;p.push(x,T,v),p.push(T,R,v)}this.setIndex(p),this.setAttribute("position",new Ee(g,3)),this.setAttribute("normal",new Ee(_,3)),this.setAttribute("uv",new Ee(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},lp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,up=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,dp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fp=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,pp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,mp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,gp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,_p=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,xp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,yp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,vp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Mp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ep=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Sp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,wp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ap=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Rp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Pp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Ip=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Lp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Dp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Up=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Np=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Op=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Fp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,kp="gl_FragColor = linearToOutputTexel( gl_FragColor );",zp=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Hp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Gp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Vp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Wp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,qp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Yp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$p=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Kp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Jp=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,jp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Qp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,em=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,nm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,im=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,sm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,rm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,am=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,om=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,cm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,hm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,um=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,dm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,fm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,mm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,gm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_m=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ym=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,vm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Mm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Em=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,bm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Sm=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,wm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Tm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Am=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Rm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Im=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Lm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Dm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Um=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Om=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Fm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Bm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,km=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,zm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Hm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Gm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Vm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Wm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Xm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,qm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ym=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,$m=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Km=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Jm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,jm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Qm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,eg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,ng=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ig=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ag=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,og=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,cg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,lg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ug=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,mg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,gg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,_g=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,xg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Mg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Eg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,bg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ag=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Cg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Pg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ig=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Dg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ug=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ng=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Og=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Fg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Bg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,zg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Hg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ne={alphahash_fragment:lp,alphahash_pars_fragment:hp,alphamap_fragment:up,alphamap_pars_fragment:dp,alphatest_fragment:fp,alphatest_pars_fragment:pp,aomap_fragment:mp,aomap_pars_fragment:gp,batching_pars_vertex:_p,batching_vertex:xp,begin_vertex:yp,beginnormal_vertex:vp,bsdfs:Mp,iridescence_fragment:Ep,bumpmap_pars_fragment:bp,clipping_planes_fragment:Sp,clipping_planes_pars_fragment:wp,clipping_planes_pars_vertex:Tp,clipping_planes_vertex:Ap,color_fragment:Rp,color_pars_fragment:Cp,color_pars_vertex:Pp,color_vertex:Ip,common:Lp,cube_uv_reflection_fragment:Dp,defaultnormal_vertex:Up,displacementmap_pars_vertex:Np,displacementmap_vertex:Op,emissivemap_fragment:Fp,emissivemap_pars_fragment:Bp,colorspace_fragment:kp,colorspace_pars_fragment:zp,envmap_fragment:Hp,envmap_common_pars_fragment:Gp,envmap_pars_fragment:Vp,envmap_pars_vertex:Wp,envmap_physical_pars_fragment:nm,envmap_vertex:Xp,fog_vertex:qp,fog_pars_vertex:Yp,fog_fragment:$p,fog_pars_fragment:Zp,gradientmap_pars_fragment:Kp,lightmap_fragment:Jp,lightmap_pars_fragment:jp,lights_lambert_fragment:Qp,lights_lambert_pars_fragment:tm,lights_pars_begin:em,lights_toon_fragment:im,lights_toon_pars_fragment:sm,lights_phong_fragment:rm,lights_phong_pars_fragment:am,lights_physical_fragment:om,lights_physical_pars_fragment:cm,lights_fragment_begin:lm,lights_fragment_maps:hm,lights_fragment_end:um,logdepthbuf_fragment:dm,logdepthbuf_pars_fragment:fm,logdepthbuf_pars_vertex:pm,logdepthbuf_vertex:mm,map_fragment:gm,map_pars_fragment:_m,map_particle_fragment:xm,map_particle_pars_fragment:ym,metalnessmap_fragment:vm,metalnessmap_pars_fragment:Mm,morphcolor_vertex:Em,morphnormal_vertex:bm,morphtarget_pars_vertex:Sm,morphtarget_vertex:wm,normal_fragment_begin:Tm,normal_fragment_maps:Am,normal_pars_fragment:Rm,normal_pars_vertex:Cm,normal_vertex:Pm,normalmap_pars_fragment:Im,clearcoat_normal_fragment_begin:Lm,clearcoat_normal_fragment_maps:Dm,clearcoat_pars_fragment:Um,iridescence_pars_fragment:Nm,opaque_fragment:Om,packing:Fm,premultiplied_alpha_fragment:Bm,project_vertex:km,dithering_fragment:zm,dithering_pars_fragment:Hm,roughnessmap_fragment:Gm,roughnessmap_pars_fragment:Vm,shadowmap_pars_fragment:Wm,shadowmap_pars_vertex:Xm,shadowmap_vertex:qm,shadowmask_pars_fragment:Ym,skinbase_vertex:$m,skinning_pars_vertex:Zm,skinning_vertex:Km,skinnormal_vertex:Jm,specularmap_fragment:jm,specularmap_pars_fragment:Qm,tonemapping_fragment:tg,tonemapping_pars_fragment:eg,transmission_fragment:ng,transmission_pars_fragment:ig,uv_pars_fragment:sg,uv_pars_vertex:rg,uv_vertex:ag,worldpos_vertex:og,background_vert:cg,background_frag:lg,backgroundCube_vert:hg,backgroundCube_frag:ug,cube_vert:dg,cube_frag:fg,depth_vert:pg,depth_frag:mg,distanceRGBA_vert:gg,distanceRGBA_frag:_g,equirect_vert:xg,equirect_frag:yg,linedashed_vert:vg,linedashed_frag:Mg,meshbasic_vert:Eg,meshbasic_frag:bg,meshlambert_vert:Sg,meshlambert_frag:wg,meshmatcap_vert:Tg,meshmatcap_frag:Ag,meshnormal_vert:Rg,meshnormal_frag:Cg,meshphong_vert:Pg,meshphong_frag:Ig,meshphysical_vert:Lg,meshphysical_frag:Dg,meshtoon_vert:Ug,meshtoon_frag:Ng,points_vert:Og,points_frag:Fg,shadow_vert:Bg,shadow_frag:kg,sprite_vert:zg,sprite_frag:Hg},bt={common:{diffuse:{value:new Jt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new se},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new se}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new se}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new se}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new se},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new se},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new se},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new se}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new se}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new se}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Jt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Jt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0},uvTransform:{value:new se}},sprite:{diffuse:{value:new Jt(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new se},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0}}},Hn={basic:{uniforms:an([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.fog]),vertexShader:ne.meshbasic_vert,fragmentShader:ne.meshbasic_frag},lambert:{uniforms:an([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,bt.lights,{emissive:{value:new Jt(0)}}]),vertexShader:ne.meshlambert_vert,fragmentShader:ne.meshlambert_frag},phong:{uniforms:an([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,bt.lights,{emissive:{value:new Jt(0)},specular:{value:new Jt(1118481)},shininess:{value:30}}]),vertexShader:ne.meshphong_vert,fragmentShader:ne.meshphong_frag},standard:{uniforms:an([bt.common,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.roughnessmap,bt.metalnessmap,bt.fog,bt.lights,{emissive:{value:new Jt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag},toon:{uniforms:an([bt.common,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.gradientmap,bt.fog,bt.lights,{emissive:{value:new Jt(0)}}]),vertexShader:ne.meshtoon_vert,fragmentShader:ne.meshtoon_frag},matcap:{uniforms:an([bt.common,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,{matcap:{value:null}}]),vertexShader:ne.meshmatcap_vert,fragmentShader:ne.meshmatcap_frag},points:{uniforms:an([bt.points,bt.fog]),vertexShader:ne.points_vert,fragmentShader:ne.points_frag},dashed:{uniforms:an([bt.common,bt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ne.linedashed_vert,fragmentShader:ne.linedashed_frag},depth:{uniforms:an([bt.common,bt.displacementmap]),vertexShader:ne.depth_vert,fragmentShader:ne.depth_frag},normal:{uniforms:an([bt.common,bt.bumpmap,bt.normalmap,bt.displacementmap,{opacity:{value:1}}]),vertexShader:ne.meshnormal_vert,fragmentShader:ne.meshnormal_frag},sprite:{uniforms:an([bt.sprite,bt.fog]),vertexShader:ne.sprite_vert,fragmentShader:ne.sprite_frag},background:{uniforms:{uvTransform:{value:new se},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ne.background_vert,fragmentShader:ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:ne.backgroundCube_vert,fragmentShader:ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ne.cube_vert,fragmentShader:ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ne.equirect_vert,fragmentShader:ne.equirect_frag},distanceRGBA:{uniforms:an([bt.common,bt.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ne.distanceRGBA_vert,fragmentShader:ne.distanceRGBA_frag},shadow:{uniforms:an([bt.lights,bt.fog,{color:{value:new Jt(0)},opacity:{value:1}}]),vertexShader:ne.shadow_vert,fragmentShader:ne.shadow_frag}};Hn.physical={uniforms:an([Hn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new se},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new se},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new se},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new se},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new se},sheen:{value:0},sheenColor:{value:new Jt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new se},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new se},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new se},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new se},attenuationDistance:{value:0},attenuationColor:{value:new Jt(0)},specularColor:{value:new Jt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new se},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new se},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new se}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag};var ua={r:0,b:0,g:0};function Gg(i,t,e,n,s,r,a){let o=new Jt(0),c=r===!0?0:1,l,h,u=null,d=0,p=null;function g(m,f){let S=!1,x=f.isScene===!0?f.background:null;x&&x.isTexture&&(x=(f.backgroundBlurriness>0?e:t).get(x)),x===null?_(o,c):x&&x.isColor&&(_(x,1),S=!0);let T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||S)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===eo)?(h===void 0&&(h=new at(new ee(1,1,1),new li({name:"BackgroundCubeMaterial",uniforms:Ns(Hn.backgroundCube.uniforms),vertexShader:Hn.backgroundCube.vertexShader,fragmentShader:Hn.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,v,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,h.material.toneMapped=_e.getTransfer(x.colorSpace)!==Me,(u!==x||d!==x.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,p=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new at(new xr(2,2),new li({name:"BackgroundMaterial",uniforms:Ns(Hn.background.uniforms),vertexShader:Hn.background.vertexShader,fragmentShader:Hn.background.fragmentShader,side:bi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,l.material.toneMapped=_e.getTransfer(x.colorSpace)!==Me,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=x,d=x.version,p=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function _(m,f){m.getRGB(ua,Bu(i)),n.buffers.color.setClear(ua.r,ua.g,ua.b,f,a)}return{getClearColor:function(){return o},setClearColor:function(m,f=1){o.set(m),c=f,_(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,_(o,c)},render:g}}function Vg(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},c=m(null),l=c,h=!1;function u(C,N,F,Y,j){let Z=!1;if(a){let Q=_(Y,F,N);l!==Q&&(l=Q,p(l.object)),Z=f(C,Y,F,j),Z&&S(C,Y,F,j)}else{let Q=N.wireframe===!0;(l.geometry!==Y.id||l.program!==F.id||l.wireframe!==Q)&&(l.geometry=Y.id,l.program=F.id,l.wireframe=Q,Z=!0)}j!==null&&e.update(j,i.ELEMENT_ARRAY_BUFFER),(Z||h)&&(h=!1,G(C,N,F,Y),j!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(j).buffer))}function d(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function p(C){return n.isWebGL2?i.bindVertexArray(C):r.bindVertexArrayOES(C)}function g(C){return n.isWebGL2?i.deleteVertexArray(C):r.deleteVertexArrayOES(C)}function _(C,N,F){let Y=F.wireframe===!0,j=o[C.id];j===void 0&&(j={},o[C.id]=j);let Z=j[N.id];Z===void 0&&(Z={},j[N.id]=Z);let Q=Z[Y];return Q===void 0&&(Q=m(d()),Z[Y]=Q),Q}function m(C){let N=[],F=[],Y=[];for(let j=0;j<s;j++)N[j]=0,F[j]=0,Y[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:F,attributeDivisors:Y,object:C,attributes:{},index:null}}function f(C,N,F,Y){let j=l.attributes,Z=N.attributes,Q=0,J=F.getAttributes();for(let st in J)if(J[st].location>=0){let ot=j[st],Mt=Z[st];if(Mt===void 0&&(st==="instanceMatrix"&&C.instanceMatrix&&(Mt=C.instanceMatrix),st==="instanceColor"&&C.instanceColor&&(Mt=C.instanceColor)),ot===void 0||ot.attribute!==Mt||Mt&&ot.data!==Mt.data)return!0;Q++}return l.attributesNum!==Q||l.index!==Y}function S(C,N,F,Y){let j={},Z=N.attributes,Q=0,J=F.getAttributes();for(let st in J)if(J[st].location>=0){let ot=Z[st];ot===void 0&&(st==="instanceMatrix"&&C.instanceMatrix&&(ot=C.instanceMatrix),st==="instanceColor"&&C.instanceColor&&(ot=C.instanceColor));let Mt={};Mt.attribute=ot,ot&&ot.data&&(Mt.data=ot.data),j[st]=Mt,Q++}l.attributes=j,l.attributesNum=Q,l.index=Y}function x(){let C=l.newAttributes;for(let N=0,F=C.length;N<F;N++)C[N]=0}function T(C){R(C,0)}function R(C,N){let F=l.newAttributes,Y=l.enabledAttributes,j=l.attributeDivisors;F[C]=1,Y[C]===0&&(i.enableVertexAttribArray(C),Y[C]=1),j[C]!==N&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](C,N),j[C]=N)}function v(){let C=l.newAttributes,N=l.enabledAttributes;for(let F=0,Y=N.length;F<Y;F++)N[F]!==C[F]&&(i.disableVertexAttribArray(F),N[F]=0)}function A(C,N,F,Y,j,Z,Q){Q===!0?i.vertexAttribIPointer(C,N,F,j,Z):i.vertexAttribPointer(C,N,F,Y,j,Z)}function G(C,N,F,Y){if(n.isWebGL2===!1&&(C.isInstancedMesh||Y.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();let j=Y.attributes,Z=F.getAttributes(),Q=N.defaultAttributeValues;for(let J in Z){let st=Z[J];if(st.location>=0){let K=j[J];if(K===void 0&&(J==="instanceMatrix"&&C.instanceMatrix&&(K=C.instanceMatrix),J==="instanceColor"&&C.instanceColor&&(K=C.instanceColor)),K!==void 0){let ot=K.normalized,Mt=K.itemSize,Ct=e.get(K);if(Ct===void 0)continue;let St=Ct.buffer,Nt=Ct.type,Ot=Ct.bytesPerElement,Pt=n.isWebGL2===!0&&(Nt===i.INT||Nt===i.UNSIGNED_INT||K.gpuType===wu);if(K.isInterleavedBufferAttribute){let Gt=K.data,L=Gt.stride,gt=K.offset;if(Gt.isInstancedInterleavedBuffer){for(let et=0;et<st.locationSize;et++)R(st.location+et,Gt.meshPerAttribute);C.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=Gt.meshPerAttribute*Gt.count)}else for(let et=0;et<st.locationSize;et++)T(st.location+et);i.bindBuffer(i.ARRAY_BUFFER,St);for(let et=0;et<st.locationSize;et++)A(st.location+et,Mt/st.locationSize,Nt,ot,L*Ot,(gt+Mt/st.locationSize*et)*Ot,Pt)}else{if(K.isInstancedBufferAttribute){for(let Gt=0;Gt<st.locationSize;Gt++)R(st.location+Gt,K.meshPerAttribute);C.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Gt=0;Gt<st.locationSize;Gt++)T(st.location+Gt);i.bindBuffer(i.ARRAY_BUFFER,St);for(let Gt=0;Gt<st.locationSize;Gt++)A(st.location+Gt,Mt/st.locationSize,Nt,ot,Mt*Ot,Mt/st.locationSize*Gt*Ot,Pt)}}else if(Q!==void 0){let ot=Q[J];if(ot!==void 0)switch(ot.length){case 2:i.vertexAttrib2fv(st.location,ot);break;case 3:i.vertexAttrib3fv(st.location,ot);break;case 4:i.vertexAttrib4fv(st.location,ot);break;default:i.vertexAttrib1fv(st.location,ot)}}}}v()}function M(){X();for(let C in o){let N=o[C];for(let F in N){let Y=N[F];for(let j in Y)g(Y[j].object),delete Y[j];delete N[F]}delete o[C]}}function w(C){if(o[C.id]===void 0)return;let N=o[C.id];for(let F in N){let Y=N[F];for(let j in Y)g(Y[j].object),delete Y[j];delete N[F]}delete o[C.id]}function O(C){for(let N in o){let F=o[N];if(F[C.id]===void 0)continue;let Y=F[C.id];for(let j in Y)g(Y[j].object),delete Y[j];delete F[C.id]}}function X(){P(),h=!0,l!==c&&(l=c,p(l.object))}function P(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:X,resetDefaultState:P,dispose:M,releaseStatesOfGeometry:w,releaseStatesOfProgram:O,initAttributes:x,enableAttribute:T,disableUnusedAttributes:v}}function Wg(i,t,e,n){let s=n.isWebGL2,r;function a(h){r=h}function o(h,u){i.drawArrays(r,h,u),e.update(u,r,1)}function c(h,u,d){if(d===0)return;let p,g;if(s)p=i,g="drawArraysInstanced";else if(p=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[g](r,h,u,d),e.update(u,r,d)}function l(h,u,d){if(d===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{p.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_];e.update(g,r,1)}}this.setMode=a,this.render=o,this.renderInstances=c,this.renderMultiDraw=l}function Xg(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let A=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",o=e.precision!==void 0?e.precision:"highp",c=r(o);c!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",c,"instead."),o=c);let l=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),f=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=d>0,T=a||t.has("OES_texture_float"),R=x&&T,v=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:p,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:f,maxFragmentUniforms:S,vertexTextures:x,floatFragmentTextures:T,floatVertexTextures:R,maxSamples:v}}function qg(i){let t=this,e=null,n=0,s=!1,r=!1,a=new Cn,o=new se,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||n!==0||s;return s=d,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,p){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{let S=r?0:n,x=S*4,T=f.clippingState||null;c.value=T,T=h(g,d,x,p);for(let R=0;R!==x;++R)T[R]=e[R];f.clippingState=T,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,p,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=c.value,g!==!0||m===null){let f=p+_*4,S=d.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<f)&&(m=new Float32Array(f));for(let x=0,T=p;x!==_;++x,T+=4)a.copy(u[x]).applyMatrix4(S,o),a.normal.toArray(m,T),m[T+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Yg(i){let t=new WeakMap;function e(a,o){return o===rc?a.mapping=Is:o===ac&&(a.mapping=Ls),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===rc||o===ac)if(t.has(a)){let c=t.get(a).texture;return e(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let l=new pc(c.height/2);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Ba=class extends Oa{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},ws=4,Vh=[.125,.215,.35,.446,.526,.582],Oi=20,qo=new Ba,Wh=new Jt,Yo=null,$o=0,Zo=0,Ui=(1+Math.sqrt(5))/2,ys=1/Ui,Xh=[new D(1,1,1),new D(-1,1,1),new D(1,1,-1),new D(-1,1,-1),new D(0,Ui,ys),new D(0,Ui,-ys),new D(ys,0,Ui),new D(-ys,0,Ui),new D(Ui,ys,0),new D(-Ui,ys,0)],Os=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Yo=this._renderer.getRenderTarget(),$o=this._renderer.getActiveCubeFace(),Zo=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$h(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Yh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Yo,$o,Zo),t.scissorTest=!1,da(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Is||t.mapping===Ls?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Yo=this._renderer.getRenderTarget(),$o=this._renderer.getActiveCubeFace(),Zo=this._renderer.getActiveMipmapLevel();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:vn,minFilter:vn,generateMipmaps:!1,type:pr,format:In,colorSpace:ai,depthBuffer:!1},s=qh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=qh(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=$g(r)),this._blurMaterial=Zg(r,t,e)}return s}_compileMaterial(t){let e=new at(this._lodPlanes[0],t);this._renderer.compile(e,qo)}_sceneToCubeUV(t,e,n,s){let o=new tn(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Wh),h.toneMapping=Mi,h.autoClear=!1;let p=new ci({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1}),g=new at(new ee,p),_=!1,m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,_=!0):(p.color.copy(Wh),_=!0);for(let f=0;f<6;f++){let S=f%3;S===0?(o.up.set(0,c[f],0),o.lookAt(l[f],0,0)):S===1?(o.up.set(0,0,c[f]),o.lookAt(0,l[f],0)):(o.up.set(0,c[f],0),o.lookAt(0,0,l[f]));let x=this._cubeSize;da(s,S*x,f>2?x:0,x,x),h.setRenderTarget(s),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Is||t.mapping===Ls;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=$h()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Yh());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new at(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;let c=this._cubeSize;da(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,qo)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Xh[(s-1)%Xh.length];this._blur(t,s-1,s,r,a)}e.autoClear=n}_blur(t,e,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new at(this._lodPlanes[s],l),d=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Oi-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Oi;m>Oi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Oi}`);let f=[],S=0;for(let A=0;A<Oi;++A){let G=A/_,M=Math.exp(-G*G/2);f.push(M),A===0?S+=M:A<m&&(S+=2*M)}for(let A=0;A<f.length;A++)f[A]=f[A]/S;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;let T=this._sizeLods[s],R=3*T*(s>x-ws?s-x+ws:0),v=4*(this._cubeSize-T);da(e,R,v,3*T,2*T),c.setRenderTarget(e),c.render(u,qo)}};function $g(i){let t=[],e=[],n=[],s=i,r=i-ws+1+Vh.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let c=1/o;a>i-ws?c=Vh[a-i+ws-1]:a===0&&(c=0),n.push(c);let l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,m=2,f=1,S=new Float32Array(_*g*p),x=new Float32Array(m*g*p),T=new Float32Array(f*g*p);for(let v=0;v<p;v++){let A=v%3*2/3-1,G=v>2?0:-1,M=[A,G,0,A+2/3,G,0,A+2/3,G+1,0,A,G,0,A+2/3,G+1,0,A,G+1,0];S.set(M,_*g*v),x.set(d,m*g*v);let w=[v,v,v,v,v,v];T.set(w,f*g*v)}let R=new ln;R.setAttribute("position",new nn(S,_)),R.setAttribute("uv",new nn(x,m)),R.setAttribute("faceIndex",new nn(T,f)),t.push(R),s>ws&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function qh(i,t,e){let n=new oi(i,t,e);return n.texture.mapping=eo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function da(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Zg(i,t,e){let n=new Float32Array(Oi),s=new D(0,1,0);return new li({name:"SphericalGaussianBlur",defines:{n:Oi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Yh(){return new li({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function $h(){return new li({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function tl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Kg(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){let c=o.mapping,l=c===rc||c===ac,h=c===Is||c===Ls;if(l||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=t.get(o);return e===null&&(e=new Os(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),t.set(o,u),u.texture}else{if(t.has(o))return t.get(o).texture;{let u=o.image;if(l&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new Os(i));let d=l?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,d),o.addEventListener("dispose",r),d.texture}else return null}}}return o}function s(o){let c=0,l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){let c=o.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Jg(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function jg(i,t,e,n){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);for(let g in d.morphAttributes){let _=d.morphAttributes[g];for(let m=0,f=_.length;m<f;m++)t.remove(_[m])}d.removeEventListener("dispose",a),delete s[d.id];let p=r.get(d);p&&(t.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function c(u){let d=u.attributes;for(let g in d)t.update(d[g],i.ARRAY_BUFFER);let p=u.morphAttributes;for(let g in p){let _=p[g];for(let m=0,f=_.length;m<f;m++)t.update(_[m],i.ARRAY_BUFFER)}}function l(u){let d=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let S=p.array;_=p.version;for(let x=0,T=S.length;x<T;x+=3){let R=S[x+0],v=S[x+1],A=S[x+2];d.push(R,v,v,A,A,R)}}else if(g!==void 0){let S=g.array;_=g.version;for(let x=0,T=S.length/3-1;x<T;x+=3){let R=x+0,v=x+1,A=x+2;d.push(R,v,v,A,A,R)}}else return;let m=new(Ou(d)?Na:Ua)(d,1);m.version=_;let f=r.get(u);f&&t.remove(f),r.set(u,m)}function h(u){let d=r.get(u);if(d){let p=u.index;p!==null&&d.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function Qg(i,t,e,n){let s=n.isWebGL2,r;function a(p){r=p}let o,c;function l(p){o=p.type,c=p.bytesPerElement}function h(p,g){i.drawElements(r,g,o,p*c),e.update(g,r,1)}function u(p,g,_){if(_===0)return;let m,f;if(s)m=i,f="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[f](r,g,o,p*c,_),e.update(g,r,_)}function d(p,g,_){if(_===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<_;f++)this.render(p[f]/c,g[f]);else{m.multiDrawElementsWEBGL(r,g,0,o,p,0,_);let f=0;for(let S=0;S<_;S++)f+=g[S];e.update(f,r,1)}}this.setMode=a,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function t0(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function e0(i,t){return i[0]-t[0]}function n0(i,t){return Math.abs(t[1])-Math.abs(i[1])}function i0(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,a=new Te,o=[];for(let l=0;l<8;l++)o[l]=[l,0];function c(l,h,u){let d=l.morphTargetInfluences;if(t.isWebGL2===!0){let p=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=p!==void 0?p.length:0,_=r.get(h);if(_===void 0||_.count!==g){let C=function(){X.dispose(),r.delete(h),h.removeEventListener("dispose",C)};_!==void 0&&_.texture.dispose();let S=h.morphAttributes.position!==void 0,x=h.morphAttributes.normal!==void 0,T=h.morphAttributes.color!==void 0,R=h.morphAttributes.position||[],v=h.morphAttributes.normal||[],A=h.morphAttributes.color||[],G=0;S===!0&&(G=1),x===!0&&(G=2),T===!0&&(G=3);let M=h.attributes.position.count*G,w=1;M>t.maxTextureSize&&(w=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let O=new Float32Array(M*w*4*g),X=new La(O,M,w,g);X.type=yi,X.needsUpdate=!0;let P=G*4;for(let N=0;N<g;N++){let F=R[N],Y=v[N],j=A[N],Z=M*w*4*N;for(let Q=0;Q<F.count;Q++){let J=Q*P;S===!0&&(a.fromBufferAttribute(F,Q),O[Z+J+0]=a.x,O[Z+J+1]=a.y,O[Z+J+2]=a.z,O[Z+J+3]=0),x===!0&&(a.fromBufferAttribute(Y,Q),O[Z+J+4]=a.x,O[Z+J+5]=a.y,O[Z+J+6]=a.z,O[Z+J+7]=0),T===!0&&(a.fromBufferAttribute(j,Q),O[Z+J+8]=a.x,O[Z+J+9]=a.y,O[Z+J+10]=a.z,O[Z+J+11]=j.itemSize===4?a.w:1)}}_={count:g,texture:X,size:new ht(M,w)},r.set(h,_),h.addEventListener("dispose",C)}let m=0;for(let S=0;S<d.length;S++)m+=d[S];let f=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(i,"morphTargetBaseInfluence",f),u.getUniforms().setValue(i,"morphTargetInfluences",d),u.getUniforms().setValue(i,"morphTargetsTexture",_.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",_.size)}else{let p=d===void 0?0:d.length,g=n[h.id];if(g===void 0||g.length!==p){g=[];for(let x=0;x<p;x++)g[x]=[x,0];n[h.id]=g}for(let x=0;x<p;x++){let T=g[x];T[0]=x,T[1]=d[x]}g.sort(n0);for(let x=0;x<8;x++)x<p&&g[x][1]?(o[x][0]=g[x][0],o[x][1]=g[x][1]):(o[x][0]=Number.MAX_SAFE_INTEGER,o[x][1]=0);o.sort(e0);let _=h.morphAttributes.position,m=h.morphAttributes.normal,f=0;for(let x=0;x<8;x++){let T=o[x],R=T[0],v=T[1];R!==Number.MAX_SAFE_INTEGER&&v?(_&&h.getAttribute("morphTarget"+x)!==_[R]&&h.setAttribute("morphTarget"+x,_[R]),m&&h.getAttribute("morphNormal"+x)!==m[R]&&h.setAttribute("morphNormal"+x,m[R]),s[x]=v,f+=v):(_&&h.hasAttribute("morphTarget"+x)===!0&&h.deleteAttribute("morphTarget"+x),m&&h.hasAttribute("morphNormal"+x)===!0&&h.deleteAttribute("morphNormal"+x),s[x]=0)}let S=h.morphTargetsRelative?1:1-f;u.getUniforms().setValue(i,"morphTargetBaseInfluence",S),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function s0(i,t,e,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function a(){s=new WeakMap}function o(c){let l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}var ka=class extends En{constructor(t,e,n,s,r,a,o,c,l,h){if(h=h!==void 0?h:ki,h!==ki&&h!==Ds)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ki&&(n=xi),n===void 0&&h===Ds&&(n=Bi),super(null,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:on,this.minFilter=c!==void 0?c:on,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},zu=new En,Hu=new ka(1,1);Hu.compareFunction=Uu;var Gu=new La,Vu=new dc,Wu=new Fa,Zh=[],Kh=[],Jh=new Float32Array(16),jh=new Float32Array(9),Qh=new Float32Array(4);function Hs(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Zh[s];if(r===void 0&&(r=new Float32Array(s),Zh[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function He(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ge(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function io(i,t){let e=Kh[t];e===void 0&&(e=new Int32Array(t),Kh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function r0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function a0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2fv(this.addr,t),Ge(e,t)}}function o0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(He(e,t))return;i.uniform3fv(this.addr,t),Ge(e,t)}}function c0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4fv(this.addr,t),Ge(e,t)}}function l0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ge(e,t)}else{if(He(e,n))return;Qh.set(n),i.uniformMatrix2fv(this.addr,!1,Qh),Ge(e,n)}}function h0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ge(e,t)}else{if(He(e,n))return;jh.set(n),i.uniformMatrix3fv(this.addr,!1,jh),Ge(e,n)}}function u0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ge(e,t)}else{if(He(e,n))return;Jh.set(n),i.uniformMatrix4fv(this.addr,!1,Jh),Ge(e,n)}}function d0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function f0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2iv(this.addr,t),Ge(e,t)}}function p0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;i.uniform3iv(this.addr,t),Ge(e,t)}}function m0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4iv(this.addr,t),Ge(e,t)}}function g0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function _0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2uiv(this.addr,t),Ge(e,t)}}function x0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;i.uniform3uiv(this.addr,t),Ge(e,t)}}function y0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4uiv(this.addr,t),Ge(e,t)}}function v0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r=this.type===i.SAMPLER_2D_SHADOW?Hu:zu;e.setTexture2D(t||r,s)}function M0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Vu,s)}function E0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Wu,s)}function b0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Gu,s)}function S0(i){switch(i){case 5126:return r0;case 35664:return a0;case 35665:return o0;case 35666:return c0;case 35674:return l0;case 35675:return h0;case 35676:return u0;case 5124:case 35670:return d0;case 35667:case 35671:return f0;case 35668:case 35672:return p0;case 35669:case 35673:return m0;case 5125:return g0;case 36294:return _0;case 36295:return x0;case 36296:return y0;case 35678:case 36198:case 36298:case 36306:case 35682:return v0;case 35679:case 36299:case 36307:return M0;case 35680:case 36300:case 36308:case 36293:return E0;case 36289:case 36303:case 36311:case 36292:return b0}}function w0(i,t){i.uniform1fv(this.addr,t)}function T0(i,t){let e=Hs(t,this.size,2);i.uniform2fv(this.addr,e)}function A0(i,t){let e=Hs(t,this.size,3);i.uniform3fv(this.addr,e)}function R0(i,t){let e=Hs(t,this.size,4);i.uniform4fv(this.addr,e)}function C0(i,t){let e=Hs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function P0(i,t){let e=Hs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function I0(i,t){let e=Hs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function L0(i,t){i.uniform1iv(this.addr,t)}function D0(i,t){i.uniform2iv(this.addr,t)}function U0(i,t){i.uniform3iv(this.addr,t)}function N0(i,t){i.uniform4iv(this.addr,t)}function O0(i,t){i.uniform1uiv(this.addr,t)}function F0(i,t){i.uniform2uiv(this.addr,t)}function B0(i,t){i.uniform3uiv(this.addr,t)}function k0(i,t){i.uniform4uiv(this.addr,t)}function z0(i,t,e){let n=this.cache,s=t.length,r=io(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ge(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||zu,r[a])}function H0(i,t,e){let n=this.cache,s=t.length,r=io(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ge(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Vu,r[a])}function G0(i,t,e){let n=this.cache,s=t.length,r=io(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ge(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Wu,r[a])}function V0(i,t,e){let n=this.cache,s=t.length,r=io(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ge(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Gu,r[a])}function W0(i){switch(i){case 5126:return w0;case 35664:return T0;case 35665:return A0;case 35666:return R0;case 35674:return C0;case 35675:return P0;case 35676:return I0;case 5124:case 35670:return L0;case 35667:case 35671:return D0;case 35668:case 35672:return U0;case 35669:case 35673:return N0;case 5125:return O0;case 36294:return F0;case 36295:return B0;case 36296:return k0;case 35678:case 36198:case 36298:case 36306:case 35682:return z0;case 35679:case 36299:case 36307:return H0;case 35680:case 36300:case 36308:case 36293:return G0;case 36289:case 36303:case 36311:case 36292:return V0}}var mc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=S0(e.type)}},gc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=W0(e.type)}},_c=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},Ko=/(\w+)(\])?(\[|\.)?/g;function tu(i,t){i.seq.push(t),i.map[t.id]=t}function X0(i,t,e){let n=i.name,s=n.length;for(Ko.lastIndex=0;;){let r=Ko.exec(n),a=Ko.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){tu(e,l===void 0?new mc(o,i,t):new gc(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new _c(o),tu(e,u)),e=u}}}var Ps=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);X0(r,a,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function eu(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var q0=37297,Y0=0;function $0(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function Z0(i){let t=_e.getPrimaries(_e.workingColorSpace),e=_e.getPrimaries(i),n;switch(t===e?n="":t===Ta&&e===wa?n="LinearDisplayP3ToLinearSRGB":t===wa&&e===Ta&&(n="LinearSRGBToLinearDisplayP3"),i){case ai:case no:return[n,"LinearTransferOETF"];case Le:case jc:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function nu(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+$0(i.getShaderSource(t),a)}else return s}function K0(i,t){let e=Z0(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function J0(i,t){let e;switch(t){case nf:e="Linear";break;case sf:e="Reinhard";break;case rf:e="OptimizedCineon";break;case Kc:e="ACESFilmic";break;case of:e="AgX";break;case af:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function j0(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ts).join(`
`)}function Q0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ts).join(`
`)}function t_(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function e_(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Ts(i){return i!==""}function iu(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function su(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var n_=/^[ \t]*#include +<([\w\d./]+)>/gm;function xc(i){return i.replace(n_,s_)}var i_=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function s_(i,t){let e=ne[t];if(e===void 0){let n=i_.get(t);if(n!==void 0)e=ne[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return xc(e)}var r_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ru(i){return i.replace(r_,a_)}function a_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function au(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function o_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Eu?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Zc?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===si&&(t="SHADOWMAP_TYPE_VSM"),t}function c_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Is:case Ls:t="ENVMAP_TYPE_CUBE";break;case eo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function l_(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Ls&&(t="ENVMAP_MODE_REFRACTION"),t}function h_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case bu:t="ENVMAP_BLENDING_MULTIPLY";break;case tf:t="ENVMAP_BLENDING_MIX";break;case ef:t="ENVMAP_BLENDING_ADD";break}return t}function u_(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function d_(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,c=o_(e),l=c_(e),h=l_(e),u=h_(e),d=u_(e),p=e.isWebGL2?"":j0(e),g=Q0(e),_=t_(r),m=s.createProgram(),f,S,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Ts).join(`
`),f.length>0&&(f+=`
`),S=[p,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Ts).join(`
`),S.length>0&&(S+=`
`)):(f=[au(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ts).join(`
`),S=[p,au(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Mi?"#define TONE_MAPPING":"",e.toneMapping!==Mi?ne.tonemapping_pars_fragment:"",e.toneMapping!==Mi?J0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ne.colorspace_pars_fragment,K0("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ts).join(`
`)),a=xc(a),a=iu(a,e),a=su(a,e),o=xc(o),o=iu(o,e),o=su(o,e),a=ru(a),o=ru(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,f=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,S=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===wh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===wh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+S);let T=x+f+a,R=x+S+o,v=eu(s,s.VERTEX_SHADER,T),A=eu(s,s.FRAGMENT_SHADER,R);s.attachShader(m,v),s.attachShader(m,A),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function G(X){if(i.debug.checkShaderErrors){let P=s.getProgramInfoLog(m).trim(),C=s.getShaderInfoLog(v).trim(),N=s.getShaderInfoLog(A).trim(),F=!0,Y=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(F=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,v,A);else{let j=nu(s,v,"vertex"),Z=nu(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+P+`
`+j+`
`+Z)}else P!==""?console.warn("THREE.WebGLProgram: Program Info Log:",P):(C===""||N==="")&&(Y=!1);Y&&(X.diagnostics={runnable:F,programLog:P,vertexShader:{log:C,prefix:f},fragmentShader:{log:N,prefix:S}})}s.deleteShader(v),s.deleteShader(A),M=new Ps(s,m),w=e_(s,m)}let M;this.getUniforms=function(){return M===void 0&&G(this),M};let w;this.getAttributes=function(){return w===void 0&&G(this),w};let O=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return O===!1&&(O=s.getProgramParameter(m,q0)),O},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Y0++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=v,this.fragmentShader=A,this}var f_=0,yc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new vc(t),e.set(t,n)),n}},vc=class{constructor(t){this.id=f_++,this.code=t,this.usedTimes=0}};function p_(i,t,e,n,s,r,a){let o=new gr,c=new yc,l=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return M===0?"uv":`uv${M}`}function m(M,w,O,X,P){let C=X.fog,N=P.geometry,F=M.isMeshStandardMaterial?X.environment:null,Y=(M.isMeshStandardMaterial?e:t).get(M.envMap||F),j=Y&&Y.mapping===eo?Y.image.height:null,Z=g[M.type];M.precision!==null&&(p=s.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));let Q=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,J=Q!==void 0?Q.length:0,st=0;N.morphAttributes.position!==void 0&&(st=1),N.morphAttributes.normal!==void 0&&(st=2),N.morphAttributes.color!==void 0&&(st=3);let K,ot,Mt,Ct;if(Z){let Ve=Hn[Z];K=Ve.vertexShader,ot=Ve.fragmentShader}else K=M.vertexShader,ot=M.fragmentShader,c.update(M),Mt=c.getVertexShaderID(M),Ct=c.getFragmentShaderID(M);let St=i.getRenderTarget(),Nt=P.isInstancedMesh===!0,Ot=P.isBatchedMesh===!0,Pt=!!M.map,Gt=!!M.matcap,L=!!Y,gt=!!M.aoMap,et=!!M.lightMap,ut=!!M.bumpMap,tt=!!M.normalMap,Lt=!!M.displacementMap,wt=!!M.emissiveMap,E=!!M.metalnessMap,y=!!M.roughnessMap,B=M.anisotropy>0,lt=M.clearcoat>0,rt=M.iridescence>0,nt=M.sheen>0,It=M.transmission>0,Et=B&&!!M.anisotropyMap,Rt=lt&&!!M.clearcoatMap,kt=lt&&!!M.clearcoatNormalMap,Wt=lt&&!!M.clearcoatRoughnessMap,it=rt&&!!M.iridescenceMap,te=rt&&!!M.iridescenceThicknessMap,I=nt&&!!M.sheenColorMap,ct=nt&&!!M.sheenRoughnessMap,yt=!!M.specularMap,ft=!!M.specularColorMap,Dt=!!M.specularIntensityMap,jt=It&&!!M.transmissionMap,ie=It&&!!M.thicknessMap,Xt=!!M.gradientMap,vt=!!M.alphaMap,U=M.alphaTest>0,_t=!!M.alphaHash,mt=!!M.extensions,zt=!!N.attributes.uv1,Ut=!!N.attributes.uv2,re=!!N.attributes.uv3,ae=Mi;return M.toneMapped&&(St===null||St.isXRRenderTarget===!0)&&(ae=i.toneMapping),{isWebGL2:h,shaderID:Z,shaderType:M.type,shaderName:M.name,vertexShader:K,fragmentShader:ot,defines:M.defines,customVertexShaderID:Mt,customFragmentShaderID:Ct,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:Ot,instancing:Nt,instancingColor:Nt&&P.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:St===null?i.outputColorSpace:St.isXRRenderTarget===!0?St.texture.colorSpace:ai,map:Pt,matcap:Gt,envMap:L,envMapMode:L&&Y.mapping,envMapCubeUVHeight:j,aoMap:gt,lightMap:et,bumpMap:ut,normalMap:tt,displacementMap:d&&Lt,emissiveMap:wt,normalMapObjectSpace:tt&&M.normalMapType===yf,normalMapTangentSpace:tt&&M.normalMapType===Du,metalnessMap:E,roughnessMap:y,anisotropy:B,anisotropyMap:Et,clearcoat:lt,clearcoatMap:Rt,clearcoatNormalMap:kt,clearcoatRoughnessMap:Wt,iridescence:rt,iridescenceMap:it,iridescenceThicknessMap:te,sheen:nt,sheenColorMap:I,sheenRoughnessMap:ct,specularMap:yt,specularColorMap:ft,specularIntensityMap:Dt,transmission:It,transmissionMap:jt,thicknessMap:ie,gradientMap:Xt,opaque:M.transparent===!1&&M.blending===Rs,alphaMap:vt,alphaTest:U,alphaHash:_t,combine:M.combine,mapUv:Pt&&_(M.map.channel),aoMapUv:gt&&_(M.aoMap.channel),lightMapUv:et&&_(M.lightMap.channel),bumpMapUv:ut&&_(M.bumpMap.channel),normalMapUv:tt&&_(M.normalMap.channel),displacementMapUv:Lt&&_(M.displacementMap.channel),emissiveMapUv:wt&&_(M.emissiveMap.channel),metalnessMapUv:E&&_(M.metalnessMap.channel),roughnessMapUv:y&&_(M.roughnessMap.channel),anisotropyMapUv:Et&&_(M.anisotropyMap.channel),clearcoatMapUv:Rt&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:kt&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Wt&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:it&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:te&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:I&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:ct&&_(M.sheenRoughnessMap.channel),specularMapUv:yt&&_(M.specularMap.channel),specularColorMapUv:ft&&_(M.specularColorMap.channel),specularIntensityMapUv:Dt&&_(M.specularIntensityMap.channel),transmissionMapUv:jt&&_(M.transmissionMap.channel),thicknessMapUv:ie&&_(M.thicknessMap.channel),alphaMapUv:vt&&_(M.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(tt||B),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,vertexUv1s:zt,vertexUv2s:Ut,vertexUv3s:re,pointsUvs:P.isPoints===!0&&!!N.attributes.uv&&(Pt||vt),fog:!!C,useFog:M.fog===!0,fogExp2:C&&C.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:P.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:J,morphTextureStride:st,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&O.length>0,shadowMapType:i.shadowMap.type,toneMapping:ae,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Pt&&M.map.isVideoTexture===!0&&_e.getTransfer(M.map.colorSpace)===Me,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===cn,flipSided:M.side===en,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:mt&&M.extensions.derivatives===!0,extensionFragDepth:mt&&M.extensions.fragDepth===!0,extensionDrawBuffers:mt&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:mt&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:mt&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function f(M){let w=[];if(M.shaderID?w.push(M.shaderID):(w.push(M.customVertexShaderID),w.push(M.customFragmentShaderID)),M.defines!==void 0)for(let O in M.defines)w.push(O),w.push(M.defines[O]);return M.isRawShaderMaterial===!1&&(S(w,M),x(w,M),w.push(i.outputColorSpace)),w.push(M.customProgramCacheKey),w.join()}function S(M,w){M.push(w.precision),M.push(w.outputColorSpace),M.push(w.envMapMode),M.push(w.envMapCubeUVHeight),M.push(w.mapUv),M.push(w.alphaMapUv),M.push(w.lightMapUv),M.push(w.aoMapUv),M.push(w.bumpMapUv),M.push(w.normalMapUv),M.push(w.displacementMapUv),M.push(w.emissiveMapUv),M.push(w.metalnessMapUv),M.push(w.roughnessMapUv),M.push(w.anisotropyMapUv),M.push(w.clearcoatMapUv),M.push(w.clearcoatNormalMapUv),M.push(w.clearcoatRoughnessMapUv),M.push(w.iridescenceMapUv),M.push(w.iridescenceThicknessMapUv),M.push(w.sheenColorMapUv),M.push(w.sheenRoughnessMapUv),M.push(w.specularMapUv),M.push(w.specularColorMapUv),M.push(w.specularIntensityMapUv),M.push(w.transmissionMapUv),M.push(w.thicknessMapUv),M.push(w.combine),M.push(w.fogExp2),M.push(w.sizeAttenuation),M.push(w.morphTargetsCount),M.push(w.morphAttributeCount),M.push(w.numDirLights),M.push(w.numPointLights),M.push(w.numSpotLights),M.push(w.numSpotLightMaps),M.push(w.numHemiLights),M.push(w.numRectAreaLights),M.push(w.numDirLightShadows),M.push(w.numPointLightShadows),M.push(w.numSpotLightShadows),M.push(w.numSpotLightShadowsWithMaps),M.push(w.numLightProbes),M.push(w.shadowMapType),M.push(w.toneMapping),M.push(w.numClippingPlanes),M.push(w.numClipIntersection),M.push(w.depthPacking)}function x(M,w){o.disableAll(),w.isWebGL2&&o.enable(0),w.supportsVertexTextures&&o.enable(1),w.instancing&&o.enable(2),w.instancingColor&&o.enable(3),w.matcap&&o.enable(4),w.envMap&&o.enable(5),w.normalMapObjectSpace&&o.enable(6),w.normalMapTangentSpace&&o.enable(7),w.clearcoat&&o.enable(8),w.iridescence&&o.enable(9),w.alphaTest&&o.enable(10),w.vertexColors&&o.enable(11),w.vertexAlphas&&o.enable(12),w.vertexUv1s&&o.enable(13),w.vertexUv2s&&o.enable(14),w.vertexUv3s&&o.enable(15),w.vertexTangents&&o.enable(16),w.anisotropy&&o.enable(17),w.alphaHash&&o.enable(18),w.batching&&o.enable(19),M.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.skinning&&o.enable(4),w.morphTargets&&o.enable(5),w.morphNormals&&o.enable(6),w.morphColors&&o.enable(7),w.premultipliedAlpha&&o.enable(8),w.shadowMapEnabled&&o.enable(9),w.useLegacyLights&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),M.push(o.mask)}function T(M){let w=g[M.type],O;if(w){let X=Hn[w];O=ip.clone(X.uniforms)}else O=M.uniforms;return O}function R(M,w){let O;for(let X=0,P=l.length;X<P;X++){let C=l[X];if(C.cacheKey===w){O=C,++O.usedTimes;break}}return O===void 0&&(O=new d_(i,w,M,r),l.push(O)),O}function v(M){if(--M.usedTimes===0){let w=l.indexOf(M);l[w]=l[l.length-1],l.pop(),M.destroy()}}function A(M){c.remove(M)}function G(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:T,acquireProgram:R,releaseProgram:v,releaseShaderCache:A,programs:l,dispose:G}}function m_(){let i=new WeakMap;function t(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function e(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function g_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function ou(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function cu(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,d,p,g,_,m){let f=i[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=m),t++,f}function o(u,d,p,g,_,m){let f=a(u,d,p,g,_,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):e.push(f)}function c(u,d,p,g,_,m){let f=a(u,d,p,g,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function l(u,d){e.length>1&&e.sort(u||g_),n.length>1&&n.sort(d||ou),s.length>1&&s.sort(d||ou)}function h(){for(let u=t,d=i.length;u<d;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function __(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new cu,i.set(n,[a])):s>=r.length?(a=new cu,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function x_(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new Jt};break;case"SpotLight":e={position:new D,direction:new D,color:new Jt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new Jt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new Jt,groundColor:new Jt};break;case"RectAreaLight":e={color:new Jt,position:new D,halfWidth:new D,halfHeight:new D};break}return i[t.id]=e,e}}}function y_(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var v_=0;function M_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function E_(i,t){let e=new x_,n=y_(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new D);let r=new D,a=new Ae,o=new Ae;function c(h,u){let d=0,p=0,g=0;for(let X=0;X<9;X++)s.probe[X].set(0,0,0);let _=0,m=0,f=0,S=0,x=0,T=0,R=0,v=0,A=0,G=0,M=0;h.sort(M_);let w=u===!0?Math.PI:1;for(let X=0,P=h.length;X<P;X++){let C=h[X],N=C.color,F=C.intensity,Y=C.distance,j=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)d+=N.r*F*w,p+=N.g*F*w,g+=N.b*F*w;else if(C.isLightProbe){for(let Z=0;Z<9;Z++)s.probe[Z].addScaledVector(C.sh.coefficients[Z],F);M++}else if(C.isDirectionalLight){let Z=e.get(C);if(Z.color.copy(C.color).multiplyScalar(C.intensity*w),C.castShadow){let Q=C.shadow,J=n.get(C);J.shadowBias=Q.bias,J.shadowNormalBias=Q.normalBias,J.shadowRadius=Q.radius,J.shadowMapSize=Q.mapSize,s.directionalShadow[_]=J,s.directionalShadowMap[_]=j,s.directionalShadowMatrix[_]=C.shadow.matrix,T++}s.directional[_]=Z,_++}else if(C.isSpotLight){let Z=e.get(C);Z.position.setFromMatrixPosition(C.matrixWorld),Z.color.copy(N).multiplyScalar(F*w),Z.distance=Y,Z.coneCos=Math.cos(C.angle),Z.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),Z.decay=C.decay,s.spot[f]=Z;let Q=C.shadow;if(C.map&&(s.spotLightMap[A]=C.map,A++,Q.updateMatrices(C),C.castShadow&&G++),s.spotLightMatrix[f]=Q.matrix,C.castShadow){let J=n.get(C);J.shadowBias=Q.bias,J.shadowNormalBias=Q.normalBias,J.shadowRadius=Q.radius,J.shadowMapSize=Q.mapSize,s.spotShadow[f]=J,s.spotShadowMap[f]=j,v++}f++}else if(C.isRectAreaLight){let Z=e.get(C);Z.color.copy(N).multiplyScalar(F),Z.halfWidth.set(C.width*.5,0,0),Z.halfHeight.set(0,C.height*.5,0),s.rectArea[S]=Z,S++}else if(C.isPointLight){let Z=e.get(C);if(Z.color.copy(C.color).multiplyScalar(C.intensity*w),Z.distance=C.distance,Z.decay=C.decay,C.castShadow){let Q=C.shadow,J=n.get(C);J.shadowBias=Q.bias,J.shadowNormalBias=Q.normalBias,J.shadowRadius=Q.radius,J.shadowMapSize=Q.mapSize,J.shadowCameraNear=Q.camera.near,J.shadowCameraFar=Q.camera.far,s.pointShadow[m]=J,s.pointShadowMap[m]=j,s.pointShadowMatrix[m]=C.shadow.matrix,R++}s.point[m]=Z,m++}else if(C.isHemisphereLight){let Z=e.get(C);Z.skyColor.copy(C.color).multiplyScalar(F*w),Z.groundColor.copy(C.groundColor).multiplyScalar(F*w),s.hemi[x]=Z,x++}}S>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=bt.LTC_FLOAT_1,s.rectAreaLTC2=bt.LTC_FLOAT_2):(s.rectAreaLTC1=bt.LTC_HALF_1,s.rectAreaLTC2=bt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=bt.LTC_FLOAT_1,s.rectAreaLTC2=bt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=bt.LTC_HALF_1,s.rectAreaLTC2=bt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=p,s.ambient[2]=g;let O=s.hash;(O.directionalLength!==_||O.pointLength!==m||O.spotLength!==f||O.rectAreaLength!==S||O.hemiLength!==x||O.numDirectionalShadows!==T||O.numPointShadows!==R||O.numSpotShadows!==v||O.numSpotMaps!==A||O.numLightProbes!==M)&&(s.directional.length=_,s.spot.length=f,s.rectArea.length=S,s.point.length=m,s.hemi.length=x,s.directionalShadow.length=T,s.directionalShadowMap.length=T,s.pointShadow.length=R,s.pointShadowMap.length=R,s.spotShadow.length=v,s.spotShadowMap.length=v,s.directionalShadowMatrix.length=T,s.pointShadowMatrix.length=R,s.spotLightMatrix.length=v+A-G,s.spotLightMap.length=A,s.numSpotLightShadowsWithMaps=G,s.numLightProbes=M,O.directionalLength=_,O.pointLength=m,O.spotLength=f,O.rectAreaLength=S,O.hemiLength=x,O.numDirectionalShadows=T,O.numPointShadows=R,O.numSpotShadows=v,O.numSpotMaps=A,O.numLightProbes=M,s.version=v_++)}function l(h,u){let d=0,p=0,g=0,_=0,m=0,f=u.matrixWorldInverse;for(let S=0,x=h.length;S<x;S++){let T=h[S];if(T.isDirectionalLight){let R=s.directional[d];R.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(f),d++}else if(T.isSpotLight){let R=s.spot[g];R.position.setFromMatrixPosition(T.matrixWorld),R.position.applyMatrix4(f),R.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(f),g++}else if(T.isRectAreaLight){let R=s.rectArea[_];R.position.setFromMatrixPosition(T.matrixWorld),R.position.applyMatrix4(f),o.identity(),a.copy(T.matrixWorld),a.premultiply(f),o.extractRotation(a),R.halfWidth.set(T.width*.5,0,0),R.halfHeight.set(0,T.height*.5,0),R.halfWidth.applyMatrix4(o),R.halfHeight.applyMatrix4(o),_++}else if(T.isPointLight){let R=s.point[p];R.position.setFromMatrixPosition(T.matrixWorld),R.position.applyMatrix4(f),p++}else if(T.isHemisphereLight){let R=s.hemi[m];R.direction.setFromMatrixPosition(T.matrixWorld),R.direction.transformDirection(f),m++}}}return{setup:c,setupView:l,state:s}}function lu(i,t){let e=new E_(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function a(u){n.push(u)}function o(u){s.push(u)}function c(u){e.setup(n,u)}function l(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:o}}function b_(i,t){let e=new WeakMap;function n(r,a=0){let o=e.get(r),c;return o===void 0?(c=new lu(i,t),e.set(r,[c])):a>=o.length?(c=new lu(i,t),o.push(c)):c=o[a],c}function s(){e=new WeakMap}return{get:n,dispose:s}}var Mc=class extends Si{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_f,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ec=class extends Si{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},S_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,w_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function T_(i,t,e){let n=new _r,s=new ht,r=new ht,a=new Te,o=new Mc({depthPacking:xf}),c=new Ec,l={},h=e.maxTextureSize,u={[bi]:en,[en]:bi,[cn]:cn},d=new li({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:S_,fragmentShader:w_}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new ln;g.setAttribute("position",new nn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new at(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Eu;let f=this.type;this.render=function(v,A,G){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||v.length===0)return;let M=i.getRenderTarget(),w=i.getActiveCubeFace(),O=i.getActiveMipmapLevel(),X=i.state;X.setBlending(vi),X.buffers.color.setClear(1,1,1,1),X.buffers.depth.setTest(!0),X.setScissorTest(!1);let P=f!==si&&this.type===si,C=f===si&&this.type!==si;for(let N=0,F=v.length;N<F;N++){let Y=v[N],j=Y.shadow;if(j===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(j.autoUpdate===!1&&j.needsUpdate===!1)continue;s.copy(j.mapSize);let Z=j.getFrameExtents();if(s.multiply(Z),r.copy(j.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Z.x),s.x=r.x*Z.x,j.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Z.y),s.y=r.y*Z.y,j.mapSize.y=r.y)),j.map===null||P===!0||C===!0){let J=this.type!==si?{minFilter:on,magFilter:on}:{};j.map!==null&&j.map.dispose(),j.map=new oi(s.x,s.y,J),j.map.texture.name=Y.name+".shadowMap",j.camera.updateProjectionMatrix()}i.setRenderTarget(j.map),i.clear();let Q=j.getViewportCount();for(let J=0;J<Q;J++){let st=j.getViewport(J);a.set(r.x*st.x,r.y*st.y,r.x*st.z,r.y*st.w),X.viewport(a),j.updateMatrices(Y,J),n=j.getFrustum(),T(A,G,j.camera,Y,this.type)}j.isPointLightShadow!==!0&&this.type===si&&S(j,G),j.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(M,w,O)};function S(v,A){let G=t.update(_);d.defines.VSM_SAMPLES!==v.blurSamples&&(d.defines.VSM_SAMPLES=v.blurSamples,p.defines.VSM_SAMPLES=v.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),v.mapPass===null&&(v.mapPass=new oi(s.x,s.y)),d.uniforms.shadow_pass.value=v.map.texture,d.uniforms.resolution.value=v.mapSize,d.uniforms.radius.value=v.radius,i.setRenderTarget(v.mapPass),i.clear(),i.renderBufferDirect(A,null,G,d,_,null),p.uniforms.shadow_pass.value=v.mapPass.texture,p.uniforms.resolution.value=v.mapSize,p.uniforms.radius.value=v.radius,i.setRenderTarget(v.map),i.clear(),i.renderBufferDirect(A,null,G,p,_,null)}function x(v,A,G,M){let w=null,O=G.isPointLight===!0?v.customDistanceMaterial:v.customDepthMaterial;if(O!==void 0)w=O;else if(w=G.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){let X=w.uuid,P=A.uuid,C=l[X];C===void 0&&(C={},l[X]=C);let N=C[P];N===void 0&&(N=w.clone(),C[P]=N,A.addEventListener("dispose",R)),w=N}if(w.visible=A.visible,w.wireframe=A.wireframe,M===si?w.side=A.shadowSide!==null?A.shadowSide:A.side:w.side=A.shadowSide!==null?A.shadowSide:u[A.side],w.alphaMap=A.alphaMap,w.alphaTest=A.alphaTest,w.map=A.map,w.clipShadows=A.clipShadows,w.clippingPlanes=A.clippingPlanes,w.clipIntersection=A.clipIntersection,w.displacementMap=A.displacementMap,w.displacementScale=A.displacementScale,w.displacementBias=A.displacementBias,w.wireframeLinewidth=A.wireframeLinewidth,w.linewidth=A.linewidth,G.isPointLight===!0&&w.isMeshDistanceMaterial===!0){let X=i.properties.get(w);X.light=G}return w}function T(v,A,G,M,w){if(v.visible===!1)return;if(v.layers.test(A.layers)&&(v.isMesh||v.isLine||v.isPoints)&&(v.castShadow||v.receiveShadow&&w===si)&&(!v.frustumCulled||n.intersectsObject(v))){v.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,v.matrixWorld);let P=t.update(v),C=v.material;if(Array.isArray(C)){let N=P.groups;for(let F=0,Y=N.length;F<Y;F++){let j=N[F],Z=C[j.materialIndex];if(Z&&Z.visible){let Q=x(v,Z,M,w);v.onBeforeShadow(i,v,A,G,P,Q,j),i.renderBufferDirect(G,null,P,Q,v,j),v.onAfterShadow(i,v,A,G,P,Q,j)}}}else if(C.visible){let N=x(v,C,M,w);v.onBeforeShadow(i,v,A,G,P,N,null),i.renderBufferDirect(G,null,P,N,v,null),v.onAfterShadow(i,v,A,G,P,N,null)}}let X=v.children;for(let P=0,C=X.length;P<C;P++)T(X[P],A,G,M,w)}function R(v){v.target.removeEventListener("dispose",R);for(let G in l){let M=l[G],w=v.target.uuid;w in M&&(M[w].dispose(),delete M[w])}}}function A_(i,t,e){let n=e.isWebGL2;function s(){let U=!1,_t=new Te,mt=null,zt=new Te(0,0,0,0);return{setMask:function(Ut){mt!==Ut&&!U&&(i.colorMask(Ut,Ut,Ut,Ut),mt=Ut)},setLocked:function(Ut){U=Ut},setClear:function(Ut,re,ae,Re,Ve){Ve===!0&&(Ut*=Re,re*=Re,ae*=Re),_t.set(Ut,re,ae,Re),zt.equals(_t)===!1&&(i.clearColor(Ut,re,ae,Re),zt.copy(_t))},reset:function(){U=!1,mt=null,zt.set(-1,0,0,0)}}}function r(){let U=!1,_t=null,mt=null,zt=null;return{setTest:function(Ut){Ut?Ot(i.DEPTH_TEST):Pt(i.DEPTH_TEST)},setMask:function(Ut){_t!==Ut&&!U&&(i.depthMask(Ut),_t=Ut)},setFunc:function(Ut){if(mt!==Ut){switch(Ut){case Yd:i.depthFunc(i.NEVER);break;case $d:i.depthFunc(i.ALWAYS);break;case Zd:i.depthFunc(i.LESS);break;case Ma:i.depthFunc(i.LEQUAL);break;case Kd:i.depthFunc(i.EQUAL);break;case Jd:i.depthFunc(i.GEQUAL);break;case jd:i.depthFunc(i.GREATER);break;case Qd:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}mt=Ut}},setLocked:function(Ut){U=Ut},setClear:function(Ut){zt!==Ut&&(i.clearDepth(Ut),zt=Ut)},reset:function(){U=!1,_t=null,mt=null,zt=null}}}function a(){let U=!1,_t=null,mt=null,zt=null,Ut=null,re=null,ae=null,Re=null,Ve=null;return{setTest:function(he){U||(he?Ot(i.STENCIL_TEST):Pt(i.STENCIL_TEST))},setMask:function(he){_t!==he&&!U&&(i.stencilMask(he),_t=he)},setFunc:function(he,We,hn){(mt!==he||zt!==We||Ut!==hn)&&(i.stencilFunc(he,We,hn),mt=he,zt=We,Ut=hn)},setOp:function(he,We,hn){(re!==he||ae!==We||Re!==hn)&&(i.stencilOp(he,We,hn),re=he,ae=We,Re=hn)},setLocked:function(he){U=he},setClear:function(he){Ve!==he&&(i.clearStencil(he),Ve=he)},reset:function(){U=!1,_t=null,mt=null,zt=null,Ut=null,re=null,ae=null,Re=null,Ve=null}}}let o=new s,c=new r,l=new a,h=new WeakMap,u=new WeakMap,d={},p={},g=new WeakMap,_=[],m=null,f=!1,S=null,x=null,T=null,R=null,v=null,A=null,G=null,M=new Jt(0,0,0),w=0,O=!1,X=null,P=null,C=null,N=null,F=null,Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),j=!1,Z=0,Q=i.getParameter(i.VERSION);Q.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(Q)[1]),j=Z>=1):Q.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),j=Z>=2);let J=null,st={},K=i.getParameter(i.SCISSOR_BOX),ot=i.getParameter(i.VIEWPORT),Mt=new Te().fromArray(K),Ct=new Te().fromArray(ot);function St(U,_t,mt,zt){let Ut=new Uint8Array(4),re=i.createTexture();i.bindTexture(U,re),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ae=0;ae<mt;ae++)n&&(U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY)?i.texImage3D(_t,0,i.RGBA,1,1,zt,0,i.RGBA,i.UNSIGNED_BYTE,Ut):i.texImage2D(_t+ae,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ut);return re}let Nt={};Nt[i.TEXTURE_2D]=St(i.TEXTURE_2D,i.TEXTURE_2D,1),Nt[i.TEXTURE_CUBE_MAP]=St(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Nt[i.TEXTURE_2D_ARRAY]=St(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Nt[i.TEXTURE_3D]=St(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Ot(i.DEPTH_TEST),c.setFunc(Ma),wt(!1),E(Vl),Ot(i.CULL_FACE),tt(vi);function Ot(U){d[U]!==!0&&(i.enable(U),d[U]=!0)}function Pt(U){d[U]!==!1&&(i.disable(U),d[U]=!1)}function Gt(U,_t){return p[U]!==_t?(i.bindFramebuffer(U,_t),p[U]=_t,n&&(U===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=_t),U===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=_t)),!0):!1}function L(U,_t){let mt=_,zt=!1;if(U)if(mt=g.get(_t),mt===void 0&&(mt=[],g.set(_t,mt)),U.isWebGLMultipleRenderTargets){let Ut=U.texture;if(mt.length!==Ut.length||mt[0]!==i.COLOR_ATTACHMENT0){for(let re=0,ae=Ut.length;re<ae;re++)mt[re]=i.COLOR_ATTACHMENT0+re;mt.length=Ut.length,zt=!0}}else mt[0]!==i.COLOR_ATTACHMENT0&&(mt[0]=i.COLOR_ATTACHMENT0,zt=!0);else mt[0]!==i.BACK&&(mt[0]=i.BACK,zt=!0);zt&&(e.isWebGL2?i.drawBuffers(mt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(mt))}function gt(U){return m!==U?(i.useProgram(U),m=U,!0):!1}let et={[Ni]:i.FUNC_ADD,[Ld]:i.FUNC_SUBTRACT,[Dd]:i.FUNC_REVERSE_SUBTRACT};if(n)et[Yl]=i.MIN,et[$l]=i.MAX;else{let U=t.get("EXT_blend_minmax");U!==null&&(et[Yl]=U.MIN_EXT,et[$l]=U.MAX_EXT)}let ut={[Ud]:i.ZERO,[Nd]:i.ONE,[Od]:i.SRC_COLOR,[ic]:i.SRC_ALPHA,[Gd]:i.SRC_ALPHA_SATURATE,[zd]:i.DST_COLOR,[Bd]:i.DST_ALPHA,[Fd]:i.ONE_MINUS_SRC_COLOR,[sc]:i.ONE_MINUS_SRC_ALPHA,[Hd]:i.ONE_MINUS_DST_COLOR,[kd]:i.ONE_MINUS_DST_ALPHA,[Vd]:i.CONSTANT_COLOR,[Wd]:i.ONE_MINUS_CONSTANT_COLOR,[Xd]:i.CONSTANT_ALPHA,[qd]:i.ONE_MINUS_CONSTANT_ALPHA};function tt(U,_t,mt,zt,Ut,re,ae,Re,Ve,he){if(U===vi){f===!0&&(Pt(i.BLEND),f=!1);return}if(f===!1&&(Ot(i.BLEND),f=!0),U!==Id){if(U!==S||he!==O){if((x!==Ni||v!==Ni)&&(i.blendEquation(i.FUNC_ADD),x=Ni,v=Ni),he)switch(U){case Rs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Wl:i.blendFunc(i.ONE,i.ONE);break;case Xl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ql:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Rs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Wl:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Xl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ql:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}T=null,R=null,A=null,G=null,M.set(0,0,0),w=0,S=U,O=he}return}Ut=Ut||_t,re=re||mt,ae=ae||zt,(_t!==x||Ut!==v)&&(i.blendEquationSeparate(et[_t],et[Ut]),x=_t,v=Ut),(mt!==T||zt!==R||re!==A||ae!==G)&&(i.blendFuncSeparate(ut[mt],ut[zt],ut[re],ut[ae]),T=mt,R=zt,A=re,G=ae),(Re.equals(M)===!1||Ve!==w)&&(i.blendColor(Re.r,Re.g,Re.b,Ve),M.copy(Re),w=Ve),S=U,O=!1}function Lt(U,_t){U.side===cn?Pt(i.CULL_FACE):Ot(i.CULL_FACE);let mt=U.side===en;_t&&(mt=!mt),wt(mt),U.blending===Rs&&U.transparent===!1?tt(vi):tt(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),c.setFunc(U.depthFunc),c.setTest(U.depthTest),c.setMask(U.depthWrite),o.setMask(U.colorWrite);let zt=U.stencilWrite;l.setTest(zt),zt&&(l.setMask(U.stencilWriteMask),l.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),l.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),B(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?Ot(i.SAMPLE_ALPHA_TO_COVERAGE):Pt(i.SAMPLE_ALPHA_TO_COVERAGE)}function wt(U){X!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),X=U)}function E(U){U!==Cd?(Ot(i.CULL_FACE),U!==P&&(U===Vl?i.cullFace(i.BACK):U===Pd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Pt(i.CULL_FACE),P=U}function y(U){U!==C&&(j&&i.lineWidth(U),C=U)}function B(U,_t,mt){U?(Ot(i.POLYGON_OFFSET_FILL),(N!==_t||F!==mt)&&(i.polygonOffset(_t,mt),N=_t,F=mt)):Pt(i.POLYGON_OFFSET_FILL)}function lt(U){U?Ot(i.SCISSOR_TEST):Pt(i.SCISSOR_TEST)}function rt(U){U===void 0&&(U=i.TEXTURE0+Y-1),J!==U&&(i.activeTexture(U),J=U)}function nt(U,_t,mt){mt===void 0&&(J===null?mt=i.TEXTURE0+Y-1:mt=J);let zt=st[mt];zt===void 0&&(zt={type:void 0,texture:void 0},st[mt]=zt),(zt.type!==U||zt.texture!==_t)&&(J!==mt&&(i.activeTexture(mt),J=mt),i.bindTexture(U,_t||Nt[U]),zt.type=U,zt.texture=_t)}function It(){let U=st[J];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function Et(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Rt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function kt(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Wt(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function it(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function te(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function I(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ct(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function yt(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ft(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Dt(U){Mt.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Mt.copy(U))}function jt(U){Ct.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Ct.copy(U))}function ie(U,_t){let mt=u.get(_t);mt===void 0&&(mt=new WeakMap,u.set(_t,mt));let zt=mt.get(U);zt===void 0&&(zt=i.getUniformBlockIndex(_t,U.name),mt.set(U,zt))}function Xt(U,_t){let zt=u.get(_t).get(U);h.get(_t)!==zt&&(i.uniformBlockBinding(_t,zt,U.__bindingPointIndex),h.set(_t,zt))}function vt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},J=null,st={},p={},g=new WeakMap,_=[],m=null,f=!1,S=null,x=null,T=null,R=null,v=null,A=null,G=null,M=new Jt(0,0,0),w=0,O=!1,X=null,P=null,C=null,N=null,F=null,Mt.set(0,0,i.canvas.width,i.canvas.height),Ct.set(0,0,i.canvas.width,i.canvas.height),o.reset(),c.reset(),l.reset()}return{buffers:{color:o,depth:c,stencil:l},enable:Ot,disable:Pt,bindFramebuffer:Gt,drawBuffers:L,useProgram:gt,setBlending:tt,setMaterial:Lt,setFlipSided:wt,setCullFace:E,setLineWidth:y,setPolygonOffset:B,setScissorTest:lt,activeTexture:rt,bindTexture:nt,unbindTexture:It,compressedTexImage2D:Et,compressedTexImage3D:Rt,texImage2D:yt,texImage3D:ft,updateUBOMapping:ie,uniformBlockBinding:Xt,texStorage2D:I,texStorage3D:ct,texSubImage2D:kt,texSubImage3D:Wt,compressedTexSubImage2D:it,compressedTexSubImage3D:te,scissor:Dt,viewport:jt,reset:vt}}function R_(i,t,e,n,s,r,a){let o=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,y){return p?new OffscreenCanvas(E,y):Ca("canvas")}function _(E,y,B,lt){let rt=1;if((E.width>lt||E.height>lt)&&(rt=lt/Math.max(E.width,E.height)),rt<1||y===!0)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap){let nt=y?Ra:Math.floor,It=nt(rt*E.width),Et=nt(rt*E.height);u===void 0&&(u=g(It,Et));let Rt=B?g(It,Et):u;return Rt.width=It,Rt.height=Et,Rt.getContext("2d").drawImage(E,0,0,It,Et),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+E.width+"x"+E.height+") to ("+It+"x"+Et+")."),Rt}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+E.width+"x"+E.height+")."),E;return E}function m(E){return hc(E.width)&&hc(E.height)}function f(E){return o?!1:E.wrapS!==Pn||E.wrapT!==Pn||E.minFilter!==on&&E.minFilter!==vn}function S(E,y){return E.generateMipmaps&&y&&E.minFilter!==on&&E.minFilter!==vn}function x(E){i.generateMipmap(E)}function T(E,y,B,lt,rt=!1){if(o===!1)return y;if(E!==null){if(i[E]!==void 0)return i[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let nt=y;if(y===i.RED&&(B===i.FLOAT&&(nt=i.R32F),B===i.HALF_FLOAT&&(nt=i.R16F),B===i.UNSIGNED_BYTE&&(nt=i.R8)),y===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(nt=i.R8UI),B===i.UNSIGNED_SHORT&&(nt=i.R16UI),B===i.UNSIGNED_INT&&(nt=i.R32UI),B===i.BYTE&&(nt=i.R8I),B===i.SHORT&&(nt=i.R16I),B===i.INT&&(nt=i.R32I)),y===i.RG&&(B===i.FLOAT&&(nt=i.RG32F),B===i.HALF_FLOAT&&(nt=i.RG16F),B===i.UNSIGNED_BYTE&&(nt=i.RG8)),y===i.RGBA){let It=rt?Sa:_e.getTransfer(lt);B===i.FLOAT&&(nt=i.RGBA32F),B===i.HALF_FLOAT&&(nt=i.RGBA16F),B===i.UNSIGNED_BYTE&&(nt=It===Me?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(nt=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(nt=i.RGB5_A1)}return(nt===i.R16F||nt===i.R32F||nt===i.RG16F||nt===i.RG32F||nt===i.RGBA16F||nt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function R(E,y,B){return S(E,B)===!0||E.isFramebufferTexture&&E.minFilter!==on&&E.minFilter!==vn?Math.log2(Math.max(y.width,y.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?y.mipmaps.length:1}function v(E){return E===on||E===Zl||E===Eo?i.NEAREST:i.LINEAR}function A(E){let y=E.target;y.removeEventListener("dispose",A),M(y),y.isVideoTexture&&h.delete(y)}function G(E){let y=E.target;y.removeEventListener("dispose",G),O(y)}function M(E){let y=n.get(E);if(y.__webglInit===void 0)return;let B=E.source,lt=d.get(B);if(lt){let rt=lt[y.__cacheKey];rt.usedTimes--,rt.usedTimes===0&&w(E),Object.keys(lt).length===0&&d.delete(B)}n.remove(E)}function w(E){let y=n.get(E);i.deleteTexture(y.__webglTexture);let B=E.source,lt=d.get(B);delete lt[y.__cacheKey],a.memory.textures--}function O(E){let y=E.texture,B=n.get(E),lt=n.get(y);if(lt.__webglTexture!==void 0&&(i.deleteTexture(lt.__webglTexture),a.memory.textures--),E.depthTexture&&E.depthTexture.dispose(),E.isWebGLCubeRenderTarget)for(let rt=0;rt<6;rt++){if(Array.isArray(B.__webglFramebuffer[rt]))for(let nt=0;nt<B.__webglFramebuffer[rt].length;nt++)i.deleteFramebuffer(B.__webglFramebuffer[rt][nt]);else i.deleteFramebuffer(B.__webglFramebuffer[rt]);B.__webglDepthbuffer&&i.deleteRenderbuffer(B.__webglDepthbuffer[rt])}else{if(Array.isArray(B.__webglFramebuffer))for(let rt=0;rt<B.__webglFramebuffer.length;rt++)i.deleteFramebuffer(B.__webglFramebuffer[rt]);else i.deleteFramebuffer(B.__webglFramebuffer);if(B.__webglDepthbuffer&&i.deleteRenderbuffer(B.__webglDepthbuffer),B.__webglMultisampledFramebuffer&&i.deleteFramebuffer(B.__webglMultisampledFramebuffer),B.__webglColorRenderbuffer)for(let rt=0;rt<B.__webglColorRenderbuffer.length;rt++)B.__webglColorRenderbuffer[rt]&&i.deleteRenderbuffer(B.__webglColorRenderbuffer[rt]);B.__webglDepthRenderbuffer&&i.deleteRenderbuffer(B.__webglDepthRenderbuffer)}if(E.isWebGLMultipleRenderTargets)for(let rt=0,nt=y.length;rt<nt;rt++){let It=n.get(y[rt]);It.__webglTexture&&(i.deleteTexture(It.__webglTexture),a.memory.textures--),n.remove(y[rt])}n.remove(y),n.remove(E)}let X=0;function P(){X=0}function C(){let E=X;return E>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),X+=1,E}function N(E){let y=[];return y.push(E.wrapS),y.push(E.wrapT),y.push(E.wrapR||0),y.push(E.magFilter),y.push(E.minFilter),y.push(E.anisotropy),y.push(E.internalFormat),y.push(E.format),y.push(E.type),y.push(E.generateMipmaps),y.push(E.premultiplyAlpha),y.push(E.flipY),y.push(E.unpackAlignment),y.push(E.colorSpace),y.join()}function F(E,y){let B=n.get(E);if(E.isVideoTexture&&Lt(E),E.isRenderTargetTexture===!1&&E.version>0&&B.__version!==E.version){let lt=E.image;if(lt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(lt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Mt(B,E,y);return}}e.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+y)}function Y(E,y){let B=n.get(E);if(E.version>0&&B.__version!==E.version){Mt(B,E,y);return}e.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+y)}function j(E,y){let B=n.get(E);if(E.version>0&&B.__version!==E.version){Mt(B,E,y);return}e.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+y)}function Z(E,y){let B=n.get(E);if(E.version>0&&B.__version!==E.version){Ct(B,E,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+y)}let Q={[Wn]:i.REPEAT,[Pn]:i.CLAMP_TO_EDGE,[oc]:i.MIRRORED_REPEAT},J={[on]:i.NEAREST,[Zl]:i.NEAREST_MIPMAP_NEAREST,[Eo]:i.NEAREST_MIPMAP_LINEAR,[vn]:i.LINEAR,[cf]:i.LINEAR_MIPMAP_NEAREST,[Hi]:i.LINEAR_MIPMAP_LINEAR},st={[vf]:i.NEVER,[Tf]:i.ALWAYS,[Mf]:i.LESS,[Uu]:i.LEQUAL,[Ef]:i.EQUAL,[wf]:i.GEQUAL,[bf]:i.GREATER,[Sf]:i.NOTEQUAL};function K(E,y,B){if(B?(i.texParameteri(E,i.TEXTURE_WRAP_S,Q[y.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,Q[y.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,Q[y.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,J[y.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,J[y.minFilter])):(i.texParameteri(E,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(E,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(y.wrapS!==Pn||y.wrapT!==Pn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(E,i.TEXTURE_MAG_FILTER,v(y.magFilter)),i.texParameteri(E,i.TEXTURE_MIN_FILTER,v(y.minFilter)),y.minFilter!==on&&y.minFilter!==vn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),y.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,st[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let lt=t.get("EXT_texture_filter_anisotropic");if(y.magFilter===on||y.minFilter!==Eo&&y.minFilter!==Hi||y.type===yi&&t.has("OES_texture_float_linear")===!1||o===!1&&y.type===pr&&t.has("OES_texture_half_float_linear")===!1)return;(y.anisotropy>1||n.get(y).__currentAnisotropy)&&(i.texParameterf(E,lt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy)}}function ot(E,y){let B=!1;E.__webglInit===void 0&&(E.__webglInit=!0,y.addEventListener("dispose",A));let lt=y.source,rt=d.get(lt);rt===void 0&&(rt={},d.set(lt,rt));let nt=N(y);if(nt!==E.__cacheKey){rt[nt]===void 0&&(rt[nt]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,B=!0),rt[nt].usedTimes++;let It=rt[E.__cacheKey];It!==void 0&&(rt[E.__cacheKey].usedTimes--,It.usedTimes===0&&w(y)),E.__cacheKey=nt,E.__webglTexture=rt[nt].texture}return B}function Mt(E,y,B){let lt=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(lt=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(lt=i.TEXTURE_3D);let rt=ot(E,y),nt=y.source;e.bindTexture(lt,E.__webglTexture,i.TEXTURE0+B);let It=n.get(nt);if(nt.version!==It.__version||rt===!0){e.activeTexture(i.TEXTURE0+B);let Et=_e.getPrimaries(_e.workingColorSpace),Rt=y.colorSpace===Mn?null:_e.getPrimaries(y.colorSpace),kt=y.colorSpace===Mn||Et===Rt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,kt);let Wt=f(y)&&m(y.image)===!1,it=_(y.image,Wt,!1,s.maxTextureSize);it=wt(y,it);let te=m(it)||o,I=r.convert(y.format,y.colorSpace),ct=r.convert(y.type),yt=T(y.internalFormat,I,ct,y.colorSpace,y.isVideoTexture);K(lt,y,te);let ft,Dt=y.mipmaps,jt=o&&y.isVideoTexture!==!0&&yt!==Iu,ie=It.__version===void 0||rt===!0,Xt=R(y,it,te);if(y.isDepthTexture)yt=i.DEPTH_COMPONENT,o?y.type===yi?yt=i.DEPTH_COMPONENT32F:y.type===xi?yt=i.DEPTH_COMPONENT24:y.type===Bi?yt=i.DEPTH24_STENCIL8:yt=i.DEPTH_COMPONENT16:y.type===yi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),y.format===ki&&yt===i.DEPTH_COMPONENT&&y.type!==Jc&&y.type!==xi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),y.type=xi,ct=r.convert(y.type)),y.format===Ds&&yt===i.DEPTH_COMPONENT&&(yt=i.DEPTH_STENCIL,y.type!==Bi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),y.type=Bi,ct=r.convert(y.type))),ie&&(jt?e.texStorage2D(i.TEXTURE_2D,1,yt,it.width,it.height):e.texImage2D(i.TEXTURE_2D,0,yt,it.width,it.height,0,I,ct,null));else if(y.isDataTexture)if(Dt.length>0&&te){jt&&ie&&e.texStorage2D(i.TEXTURE_2D,Xt,yt,Dt[0].width,Dt[0].height);for(let vt=0,U=Dt.length;vt<U;vt++)ft=Dt[vt],jt?e.texSubImage2D(i.TEXTURE_2D,vt,0,0,ft.width,ft.height,I,ct,ft.data):e.texImage2D(i.TEXTURE_2D,vt,yt,ft.width,ft.height,0,I,ct,ft.data);y.generateMipmaps=!1}else jt?(ie&&e.texStorage2D(i.TEXTURE_2D,Xt,yt,it.width,it.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,it.width,it.height,I,ct,it.data)):e.texImage2D(i.TEXTURE_2D,0,yt,it.width,it.height,0,I,ct,it.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){jt&&ie&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Xt,yt,Dt[0].width,Dt[0].height,it.depth);for(let vt=0,U=Dt.length;vt<U;vt++)ft=Dt[vt],y.format!==In?I!==null?jt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,vt,0,0,0,ft.width,ft.height,it.depth,I,ft.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,vt,yt,ft.width,ft.height,it.depth,0,ft.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):jt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,vt,0,0,0,ft.width,ft.height,it.depth,I,ct,ft.data):e.texImage3D(i.TEXTURE_2D_ARRAY,vt,yt,ft.width,ft.height,it.depth,0,I,ct,ft.data)}else{jt&&ie&&e.texStorage2D(i.TEXTURE_2D,Xt,yt,Dt[0].width,Dt[0].height);for(let vt=0,U=Dt.length;vt<U;vt++)ft=Dt[vt],y.format!==In?I!==null?jt?e.compressedTexSubImage2D(i.TEXTURE_2D,vt,0,0,ft.width,ft.height,I,ft.data):e.compressedTexImage2D(i.TEXTURE_2D,vt,yt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):jt?e.texSubImage2D(i.TEXTURE_2D,vt,0,0,ft.width,ft.height,I,ct,ft.data):e.texImage2D(i.TEXTURE_2D,vt,yt,ft.width,ft.height,0,I,ct,ft.data)}else if(y.isDataArrayTexture)jt?(ie&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Xt,yt,it.width,it.height,it.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,I,ct,it.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,yt,it.width,it.height,it.depth,0,I,ct,it.data);else if(y.isData3DTexture)jt?(ie&&e.texStorage3D(i.TEXTURE_3D,Xt,yt,it.width,it.height,it.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,I,ct,it.data)):e.texImage3D(i.TEXTURE_3D,0,yt,it.width,it.height,it.depth,0,I,ct,it.data);else if(y.isFramebufferTexture){if(ie)if(jt)e.texStorage2D(i.TEXTURE_2D,Xt,yt,it.width,it.height);else{let vt=it.width,U=it.height;for(let _t=0;_t<Xt;_t++)e.texImage2D(i.TEXTURE_2D,_t,yt,vt,U,0,I,ct,null),vt>>=1,U>>=1}}else if(Dt.length>0&&te){jt&&ie&&e.texStorage2D(i.TEXTURE_2D,Xt,yt,Dt[0].width,Dt[0].height);for(let vt=0,U=Dt.length;vt<U;vt++)ft=Dt[vt],jt?e.texSubImage2D(i.TEXTURE_2D,vt,0,0,I,ct,ft):e.texImage2D(i.TEXTURE_2D,vt,yt,I,ct,ft);y.generateMipmaps=!1}else jt?(ie&&e.texStorage2D(i.TEXTURE_2D,Xt,yt,it.width,it.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,I,ct,it)):e.texImage2D(i.TEXTURE_2D,0,yt,I,ct,it);S(y,te)&&x(lt),It.__version=nt.version,y.onUpdate&&y.onUpdate(y)}E.__version=y.version}function Ct(E,y,B){if(y.image.length!==6)return;let lt=ot(E,y),rt=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+B);let nt=n.get(rt);if(rt.version!==nt.__version||lt===!0){e.activeTexture(i.TEXTURE0+B);let It=_e.getPrimaries(_e.workingColorSpace),Et=y.colorSpace===Mn?null:_e.getPrimaries(y.colorSpace),Rt=y.colorSpace===Mn||It===Et?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Rt);let kt=y.isCompressedTexture||y.image[0].isCompressedTexture,Wt=y.image[0]&&y.image[0].isDataTexture,it=[];for(let vt=0;vt<6;vt++)!kt&&!Wt?it[vt]=_(y.image[vt],!1,!0,s.maxCubemapSize):it[vt]=Wt?y.image[vt].image:y.image[vt],it[vt]=wt(y,it[vt]);let te=it[0],I=m(te)||o,ct=r.convert(y.format,y.colorSpace),yt=r.convert(y.type),ft=T(y.internalFormat,ct,yt,y.colorSpace),Dt=o&&y.isVideoTexture!==!0,jt=nt.__version===void 0||lt===!0,ie=R(y,te,I);K(i.TEXTURE_CUBE_MAP,y,I);let Xt;if(kt){Dt&&jt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ie,ft,te.width,te.height);for(let vt=0;vt<6;vt++){Xt=it[vt].mipmaps;for(let U=0;U<Xt.length;U++){let _t=Xt[U];y.format!==In?ct!==null?Dt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,U,0,0,_t.width,_t.height,ct,_t.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,U,ft,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,U,0,0,_t.width,_t.height,ct,yt,_t.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,U,ft,_t.width,_t.height,0,ct,yt,_t.data)}}}else{Xt=y.mipmaps,Dt&&jt&&(Xt.length>0&&ie++,e.texStorage2D(i.TEXTURE_CUBE_MAP,ie,ft,it[0].width,it[0].height));for(let vt=0;vt<6;vt++)if(Wt){Dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,0,0,it[vt].width,it[vt].height,ct,yt,it[vt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,ft,it[vt].width,it[vt].height,0,ct,yt,it[vt].data);for(let U=0;U<Xt.length;U++){let mt=Xt[U].image[vt].image;Dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,U+1,0,0,mt.width,mt.height,ct,yt,mt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,U+1,ft,mt.width,mt.height,0,ct,yt,mt.data)}}else{Dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,0,0,ct,yt,it[vt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,ft,ct,yt,it[vt]);for(let U=0;U<Xt.length;U++){let _t=Xt[U];Dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,U+1,0,0,ct,yt,_t.image[vt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,U+1,ft,ct,yt,_t.image[vt])}}}S(y,I)&&x(i.TEXTURE_CUBE_MAP),nt.__version=rt.version,y.onUpdate&&y.onUpdate(y)}E.__version=y.version}function St(E,y,B,lt,rt,nt){let It=r.convert(B.format,B.colorSpace),Et=r.convert(B.type),Rt=T(B.internalFormat,It,Et,B.colorSpace);if(!n.get(y).__hasExternalTextures){let Wt=Math.max(1,y.width>>nt),it=Math.max(1,y.height>>nt);rt===i.TEXTURE_3D||rt===i.TEXTURE_2D_ARRAY?e.texImage3D(rt,nt,Rt,Wt,it,y.depth,0,It,Et,null):e.texImage2D(rt,nt,Rt,Wt,it,0,It,Et,null)}e.bindFramebuffer(i.FRAMEBUFFER,E),tt(y)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,lt,rt,n.get(B).__webglTexture,0,ut(y)):(rt===i.TEXTURE_2D||rt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&rt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,lt,rt,n.get(B).__webglTexture,nt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Nt(E,y,B){if(i.bindRenderbuffer(i.RENDERBUFFER,E),y.depthBuffer&&!y.stencilBuffer){let lt=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(B||tt(y)){let rt=y.depthTexture;rt&&rt.isDepthTexture&&(rt.type===yi?lt=i.DEPTH_COMPONENT32F:rt.type===xi&&(lt=i.DEPTH_COMPONENT24));let nt=ut(y);tt(y)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,nt,lt,y.width,y.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,lt,y.width,y.height)}else i.renderbufferStorage(i.RENDERBUFFER,lt,y.width,y.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,E)}else if(y.depthBuffer&&y.stencilBuffer){let lt=ut(y);B&&tt(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,lt,i.DEPTH24_STENCIL8,y.width,y.height):tt(y)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,lt,i.DEPTH24_STENCIL8,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,E)}else{let lt=y.isWebGLMultipleRenderTargets===!0?y.texture:[y.texture];for(let rt=0;rt<lt.length;rt++){let nt=lt[rt],It=r.convert(nt.format,nt.colorSpace),Et=r.convert(nt.type),Rt=T(nt.internalFormat,It,Et,nt.colorSpace),kt=ut(y);B&&tt(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,kt,Rt,y.width,y.height):tt(y)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,kt,Rt,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,Rt,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ot(E,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,E),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(y.depthTexture).__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),F(y.depthTexture,0);let lt=n.get(y.depthTexture).__webglTexture,rt=ut(y);if(y.depthTexture.format===ki)tt(y)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0,rt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0);else if(y.depthTexture.format===Ds)tt(y)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0,rt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0);else throw new Error("Unknown depthTexture format")}function Pt(E){let y=n.get(E),B=E.isWebGLCubeRenderTarget===!0;if(E.depthTexture&&!y.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");Ot(y.__webglFramebuffer,E)}else if(B){y.__webglDepthbuffer=[];for(let lt=0;lt<6;lt++)e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[lt]),y.__webglDepthbuffer[lt]=i.createRenderbuffer(),Nt(y.__webglDepthbuffer[lt],E,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer=i.createRenderbuffer(),Nt(y.__webglDepthbuffer,E,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Gt(E,y,B){let lt=n.get(E);y!==void 0&&St(lt.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Pt(E)}function L(E){let y=E.texture,B=n.get(E),lt=n.get(y);E.addEventListener("dispose",G),E.isWebGLMultipleRenderTargets!==!0&&(lt.__webglTexture===void 0&&(lt.__webglTexture=i.createTexture()),lt.__version=y.version,a.memory.textures++);let rt=E.isWebGLCubeRenderTarget===!0,nt=E.isWebGLMultipleRenderTargets===!0,It=m(E)||o;if(rt){B.__webglFramebuffer=[];for(let Et=0;Et<6;Et++)if(o&&y.mipmaps&&y.mipmaps.length>0){B.__webglFramebuffer[Et]=[];for(let Rt=0;Rt<y.mipmaps.length;Rt++)B.__webglFramebuffer[Et][Rt]=i.createFramebuffer()}else B.__webglFramebuffer[Et]=i.createFramebuffer()}else{if(o&&y.mipmaps&&y.mipmaps.length>0){B.__webglFramebuffer=[];for(let Et=0;Et<y.mipmaps.length;Et++)B.__webglFramebuffer[Et]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(nt)if(s.drawBuffers){let Et=E.texture;for(let Rt=0,kt=Et.length;Rt<kt;Rt++){let Wt=n.get(Et[Rt]);Wt.__webglTexture===void 0&&(Wt.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&E.samples>0&&tt(E)===!1){let Et=nt?y:[y];B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let Rt=0;Rt<Et.length;Rt++){let kt=Et[Rt];B.__webglColorRenderbuffer[Rt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[Rt]);let Wt=r.convert(kt.format,kt.colorSpace),it=r.convert(kt.type),te=T(kt.internalFormat,Wt,it,kt.colorSpace,E.isXRRenderTarget===!0),I=ut(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,I,te,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Rt,i.RENDERBUFFER,B.__webglColorRenderbuffer[Rt])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),Nt(B.__webglDepthRenderbuffer,E,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(rt){e.bindTexture(i.TEXTURE_CUBE_MAP,lt.__webglTexture),K(i.TEXTURE_CUBE_MAP,y,It);for(let Et=0;Et<6;Et++)if(o&&y.mipmaps&&y.mipmaps.length>0)for(let Rt=0;Rt<y.mipmaps.length;Rt++)St(B.__webglFramebuffer[Et][Rt],E,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Rt);else St(B.__webglFramebuffer[Et],E,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0);S(y,It)&&x(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(nt){let Et=E.texture;for(let Rt=0,kt=Et.length;Rt<kt;Rt++){let Wt=Et[Rt],it=n.get(Wt);e.bindTexture(i.TEXTURE_2D,it.__webglTexture),K(i.TEXTURE_2D,Wt,It),St(B.__webglFramebuffer,E,Wt,i.COLOR_ATTACHMENT0+Rt,i.TEXTURE_2D,0),S(Wt,It)&&x(i.TEXTURE_2D)}e.unbindTexture()}else{let Et=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(o?Et=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(Et,lt.__webglTexture),K(Et,y,It),o&&y.mipmaps&&y.mipmaps.length>0)for(let Rt=0;Rt<y.mipmaps.length;Rt++)St(B.__webglFramebuffer[Rt],E,y,i.COLOR_ATTACHMENT0,Et,Rt);else St(B.__webglFramebuffer,E,y,i.COLOR_ATTACHMENT0,Et,0);S(y,It)&&x(Et),e.unbindTexture()}E.depthBuffer&&Pt(E)}function gt(E){let y=m(E)||o,B=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let lt=0,rt=B.length;lt<rt;lt++){let nt=B[lt];if(S(nt,y)){let It=E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,Et=n.get(nt).__webglTexture;e.bindTexture(It,Et),x(It),e.unbindTexture()}}}function et(E){if(o&&E.samples>0&&tt(E)===!1){let y=E.isWebGLMultipleRenderTargets?E.texture:[E.texture],B=E.width,lt=E.height,rt=i.COLOR_BUFFER_BIT,nt=[],It=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Et=n.get(E),Rt=E.isWebGLMultipleRenderTargets===!0;if(Rt)for(let kt=0;kt<y.length;kt++)e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Et.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Et.__webglFramebuffer);for(let kt=0;kt<y.length;kt++){nt.push(i.COLOR_ATTACHMENT0+kt),E.depthBuffer&&nt.push(It);let Wt=Et.__ignoreDepthValues!==void 0?Et.__ignoreDepthValues:!1;if(Wt===!1&&(E.depthBuffer&&(rt|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&(rt|=i.STENCIL_BUFFER_BIT)),Rt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Et.__webglColorRenderbuffer[kt]),Wt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[It]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[It])),Rt){let it=n.get(y[kt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,it,0)}i.blitFramebuffer(0,0,B,lt,0,0,B,lt,rt,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,nt)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Rt)for(let kt=0;kt<y.length;kt++){e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.RENDERBUFFER,Et.__webglColorRenderbuffer[kt]);let Wt=n.get(y[kt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.TEXTURE_2D,Wt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Et.__webglMultisampledFramebuffer)}}function ut(E){return Math.min(s.maxSamples,E.samples)}function tt(E){let y=n.get(E);return o&&E.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function Lt(E){let y=a.render.frame;h.get(E)!==y&&(h.set(E,y),E.update())}function wt(E,y){let B=E.colorSpace,lt=E.format,rt=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||E.format===lc||B!==ai&&B!==Mn&&(_e.getTransfer(B)===Me?o===!1?t.has("EXT_sRGB")===!0&&lt===In?(E.format=lc,E.minFilter=vn,E.generateMipmaps=!1):y=Pa.sRGBToLinear(y):(lt!==In||rt!==Ei)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),y}this.allocateTextureUnit=C,this.resetTextureUnits=P,this.setTexture2D=F,this.setTexture2DArray=Y,this.setTexture3D=j,this.setTextureCube=Z,this.rebindTextures=Gt,this.setupRenderTarget=L,this.updateRenderTargetMipmap=gt,this.updateMultisampleRenderTarget=et,this.setupDepthRenderbuffer=Pt,this.setupFrameBufferTexture=St,this.useMultisampledRTT=tt}function C_(i,t,e){let n=e.isWebGL2;function s(r,a=Mn){let o,c=_e.getTransfer(a);if(r===Ei)return i.UNSIGNED_BYTE;if(r===Tu)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Au)return i.UNSIGNED_SHORT_5_5_5_1;if(r===lf)return i.BYTE;if(r===hf)return i.SHORT;if(r===Jc)return i.UNSIGNED_SHORT;if(r===wu)return i.INT;if(r===xi)return i.UNSIGNED_INT;if(r===yi)return i.FLOAT;if(r===pr)return n?i.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===uf)return i.ALPHA;if(r===In)return i.RGBA;if(r===df)return i.LUMINANCE;if(r===ff)return i.LUMINANCE_ALPHA;if(r===ki)return i.DEPTH_COMPONENT;if(r===Ds)return i.DEPTH_STENCIL;if(r===lc)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===pf)return i.RED;if(r===Ru)return i.RED_INTEGER;if(r===mf)return i.RG;if(r===Cu)return i.RG_INTEGER;if(r===Pu)return i.RGBA_INTEGER;if(r===bo||r===So||r===wo||r===To)if(c===Me)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===bo)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===So)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===wo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===To)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===bo)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===So)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===wo)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===To)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Kl||r===Jl||r===jl||r===Ql)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===Kl)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Jl)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===jl)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Ql)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Iu)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===th||r===eh)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===th)return c===Me?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===eh)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===nh||r===ih||r===sh||r===rh||r===ah||r===oh||r===ch||r===lh||r===hh||r===uh||r===dh||r===fh||r===ph||r===mh)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===nh)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===ih)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===sh)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===rh)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===ah)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===oh)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===ch)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===lh)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===hh)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===uh)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===dh)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===fh)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===ph)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===mh)return c===Me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Ao||r===gh||r===_h)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===Ao)return c===Me?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===gh)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===_h)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===gf||r===xh||r===yh||r===vh)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===Ao)return o.COMPRESSED_RED_RGTC1_EXT;if(r===xh)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===yh)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===vh)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Bi?n?i.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var bc=class extends tn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},qt=class extends $e{constructor(){super(),this.isGroup=!0,this.type="Group"}},P_={type:"move"},hr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,n),f=this._getHandJoint(l,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&d>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(P_)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new qt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Sc=class extends Xn{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,p=null,g=null,_=e.getContextAttributes(),m=null,f=null,S=[],x=[],T=new ht,R=null,v=new tn;v.layers.enable(1),v.viewport=new Te;let A=new tn;A.layers.enable(2),A.viewport=new Te;let G=[v,A],M=new bc;M.layers.enable(1),M.layers.enable(2);let w=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let ot=S[K];return ot===void 0&&(ot=new hr,S[K]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function(K){let ot=S[K];return ot===void 0&&(ot=new hr,S[K]=ot),ot.getGripSpace()},this.getHand=function(K){let ot=S[K];return ot===void 0&&(ot=new hr,S[K]=ot),ot.getHandSpace()};function X(K){let ot=x.indexOf(K.inputSource);if(ot===-1)return;let Mt=S[ot];Mt!==void 0&&(Mt.update(K.inputSource,K.frame,l||a),Mt.dispatchEvent({type:K.type,data:K.inputSource}))}function P(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",P),s.removeEventListener("inputsourceschange",C);for(let K=0;K<S.length;K++){let ot=x[K];ot!==null&&(x[K]=null,S[K].disconnect(ot))}w=null,O=null,t.setRenderTarget(m),p=null,d=null,u=null,s=null,f=null,st.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(K){l=K},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",P),s.addEventListener("inputsourceschange",C),_.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(T),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let ot={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,ot),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),f=new oi(p.framebufferWidth,p.framebufferHeight,{format:In,type:Ei,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let ot=null,Mt=null,Ct=null;_.depth&&(Ct=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ot=_.stencil?Ds:ki,Mt=_.stencil?Bi:xi);let St={colorFormat:e.RGBA8,depthFormat:Ct,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(St),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),f=new oi(d.textureWidth,d.textureHeight,{format:In,type:Ei,depthTexture:new ka(d.textureWidth,d.textureHeight,Mt,void 0,void 0,void 0,void 0,void 0,void 0,ot),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});let Nt=t.properties.get(f);Nt.__ignoreDepthValues=d.ignoreDepthValues}f.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),st.setContext(s),st.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function C(K){for(let ot=0;ot<K.removed.length;ot++){let Mt=K.removed[ot],Ct=x.indexOf(Mt);Ct>=0&&(x[Ct]=null,S[Ct].disconnect(Mt))}for(let ot=0;ot<K.added.length;ot++){let Mt=K.added[ot],Ct=x.indexOf(Mt);if(Ct===-1){for(let Nt=0;Nt<S.length;Nt++)if(Nt>=x.length){x.push(Mt),Ct=Nt;break}else if(x[Nt]===null){x[Nt]=Mt,Ct=Nt;break}if(Ct===-1)break}let St=S[Ct];St&&St.connect(Mt)}}let N=new D,F=new D;function Y(K,ot,Mt){N.setFromMatrixPosition(ot.matrixWorld),F.setFromMatrixPosition(Mt.matrixWorld);let Ct=N.distanceTo(F),St=ot.projectionMatrix.elements,Nt=Mt.projectionMatrix.elements,Ot=St[14]/(St[10]-1),Pt=St[14]/(St[10]+1),Gt=(St[9]+1)/St[5],L=(St[9]-1)/St[5],gt=(St[8]-1)/St[0],et=(Nt[8]+1)/Nt[0],ut=Ot*gt,tt=Ot*et,Lt=Ct/(-gt+et),wt=Lt*-gt;ot.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(wt),K.translateZ(Lt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert();let E=Ot+Lt,y=Pt+Lt,B=ut-wt,lt=tt+(Ct-wt),rt=Gt*Pt/y*E,nt=L*Pt/y*E;K.projectionMatrix.makePerspective(B,lt,rt,nt,E,y),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}function j(K,ot){ot===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(ot.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;M.near=A.near=v.near=K.near,M.far=A.far=v.far=K.far,(w!==M.near||O!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),w=M.near,O=M.far);let ot=K.parent,Mt=M.cameras;j(M,ot);for(let Ct=0;Ct<Mt.length;Ct++)j(Mt[Ct],ot);Mt.length===2?Y(M,v,A):M.projectionMatrix.copy(v.projectionMatrix),Z(K,M,ot)};function Z(K,ot,Mt){Mt===null?K.matrix.copy(ot.matrixWorld):(K.matrix.copy(Mt.matrixWorld),K.matrix.invert(),K.matrix.multiply(ot.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(ot.projectionMatrix),K.projectionMatrixInverse.copy(ot.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=mr*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(K){c=K,d!==null&&(d.fixedFoveation=K),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=K)};let Q=null;function J(K,ot){if(h=ot.getViewerPose(l||a),g=ot,h!==null){let Mt=h.views;p!==null&&(t.setRenderTargetFramebuffer(f,p.framebuffer),t.setRenderTarget(f));let Ct=!1;Mt.length!==M.cameras.length&&(M.cameras.length=0,Ct=!0);for(let St=0;St<Mt.length;St++){let Nt=Mt[St],Ot=null;if(p!==null)Ot=p.getViewport(Nt);else{let Gt=u.getViewSubImage(d,Nt);Ot=Gt.viewport,St===0&&(t.setRenderTargetTextures(f,Gt.colorTexture,d.ignoreDepthValues?void 0:Gt.depthStencilTexture),t.setRenderTarget(f))}let Pt=G[St];Pt===void 0&&(Pt=new tn,Pt.layers.enable(St),Pt.viewport=new Te,G[St]=Pt),Pt.matrix.fromArray(Nt.transform.matrix),Pt.matrix.decompose(Pt.position,Pt.quaternion,Pt.scale),Pt.projectionMatrix.fromArray(Nt.projectionMatrix),Pt.projectionMatrixInverse.copy(Pt.projectionMatrix).invert(),Pt.viewport.set(Ot.x,Ot.y,Ot.width,Ot.height),St===0&&(M.matrix.copy(Pt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),Ct===!0&&M.cameras.push(Pt)}}for(let Mt=0;Mt<S.length;Mt++){let Ct=x[Mt],St=S[Mt];Ct!==null&&St!==void 0&&St.update(Ct,ot,l||a)}Q&&Q(K,ot),ot.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ot}),g=null}let st=new ku;st.setAnimationLoop(J),this.setAnimationLoop=function(K){Q=K},this.dispose=function(){}}};function I_(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Bu(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,S,x,T){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,T)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?c(m,f,S,x):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===en&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===en&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let S=t.get(f).envMap;if(S&&(m.envMap.value=S,m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap){m.lightMap.value=f.lightMap;let x=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=f.lightMapIntensity*x,e(f.lightMap,m.lightMapTransform)}f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,S,x){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*S,m.scale.value=x*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),t.get(f).envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,S){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===en&&m.clearcoatNormalScale.value.negate())),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){let S=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function L_(i,t,e,n){let s={},r={},a=[],o=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(S,x){let T=x.program;n.uniformBlockBinding(S,T)}function l(S,x){let T=s[S.id];T===void 0&&(g(S),T=h(S),s[S.id]=T,S.addEventListener("dispose",m));let R=x.program;n.updateUBOMapping(S,R);let v=t.render.frame;r[S.id]!==v&&(d(S),r[S.id]=v)}function h(S){let x=u();S.__bindingPointIndex=x;let T=i.createBuffer(),R=S.__size,v=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,R,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,T),T}function u(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){let x=s[S.id],T=S.uniforms,R=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let v=0,A=T.length;v<A;v++){let G=Array.isArray(T[v])?T[v]:[T[v]];for(let M=0,w=G.length;M<w;M++){let O=G[M];if(p(O,v,M,R)===!0){let X=O.__offset,P=Array.isArray(O.value)?O.value:[O.value],C=0;for(let N=0;N<P.length;N++){let F=P[N],Y=_(F);typeof F=="number"||typeof F=="boolean"?(O.__data[0]=F,i.bufferSubData(i.UNIFORM_BUFFER,X+C,O.__data)):F.isMatrix3?(O.__data[0]=F.elements[0],O.__data[1]=F.elements[1],O.__data[2]=F.elements[2],O.__data[3]=0,O.__data[4]=F.elements[3],O.__data[5]=F.elements[4],O.__data[6]=F.elements[5],O.__data[7]=0,O.__data[8]=F.elements[6],O.__data[9]=F.elements[7],O.__data[10]=F.elements[8],O.__data[11]=0):(F.toArray(O.__data,C),C+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,X,O.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(S,x,T,R){let v=S.value,A=x+"_"+T;if(R[A]===void 0)return typeof v=="number"||typeof v=="boolean"?R[A]=v:R[A]=v.clone(),!0;{let G=R[A];if(typeof v=="number"||typeof v=="boolean"){if(G!==v)return R[A]=v,!0}else if(G.equals(v)===!1)return G.copy(v),!0}return!1}function g(S){let x=S.uniforms,T=0,R=16;for(let A=0,G=x.length;A<G;A++){let M=Array.isArray(x[A])?x[A]:[x[A]];for(let w=0,O=M.length;w<O;w++){let X=M[w],P=Array.isArray(X.value)?X.value:[X.value];for(let C=0,N=P.length;C<N;C++){let F=P[C],Y=_(F),j=T%R;j!==0&&R-j<Y.boundary&&(T+=R-j),X.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=T,T+=Y.storage}}}let v=T%R;return v>0&&(T+=R-v),S.__size=T,S.__cache={},this}function _(S){let x={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(x.boundary=4,x.storage=4):S.isVector2?(x.boundary=8,x.storage=8):S.isVector3||S.isColor?(x.boundary=16,x.storage=12):S.isVector4?(x.boundary=16,x.storage=16):S.isMatrix3?(x.boundary=48,x.storage=48):S.isMatrix4?(x.boundary=64,x.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),x}function m(S){let x=S.target;x.removeEventListener("dispose",m);let T=a.indexOf(x.__bindingPointIndex);a.splice(T,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function f(){for(let S in s)i.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:c,update:l,dispose:f}}var yr=class{constructor(t={}){let{canvas:e=Hf(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=a;let p=new Uint32Array(4),g=new Int32Array(4),_=null,m=null,f=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Le,this._useLegacyLights=!1,this.toneMapping=Mi,this.toneMappingExposure=1;let x=this,T=!1,R=0,v=0,A=null,G=-1,M=null,w=new Te,O=new Te,X=null,P=new Jt(0),C=0,N=e.width,F=e.height,Y=1,j=null,Z=null,Q=new Te(0,0,N,F),J=new Te(0,0,N,F),st=!1,K=new _r,ot=!1,Mt=!1,Ct=null,St=new Ae,Nt=new ht,Ot=new D,Pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Gt(){return A===null?Y:1}let L=n;function gt(b,k){for(let W=0;W<b.length;W++){let H=b[W],V=e.getContext(H,k);if(V!==null)return V}return null}try{let b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r160"),e.addEventListener("webglcontextlost",vt,!1),e.addEventListener("webglcontextrestored",U,!1),e.addEventListener("webglcontextcreationerror",_t,!1),L===null){let k=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&k.shift(),L=gt(k,b),L===null)throw gt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&L instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),L.getShaderPrecisionFormat===void 0&&(L.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let et,ut,tt,Lt,wt,E,y,B,lt,rt,nt,It,Et,Rt,kt,Wt,it,te,I,ct,yt,ft,Dt,jt;function ie(){et=new Jg(L),ut=new Xg(L,et,t),et.init(ut),ft=new C_(L,et,ut),tt=new A_(L,et,ut),Lt=new t0(L),wt=new m_,E=new R_(L,et,tt,wt,ut,ft,Lt),y=new Yg(x),B=new Kg(x),lt=new cp(L,ut),Dt=new Vg(L,et,lt,ut),rt=new jg(L,lt,Lt,Dt),nt=new s0(L,rt,lt,Lt),I=new i0(L,ut,E),Wt=new qg(wt),It=new p_(x,y,B,et,ut,Dt,Wt),Et=new I_(x,wt),Rt=new __,kt=new b_(et,ut),te=new Gg(x,y,B,tt,nt,d,c),it=new T_(x,nt,ut),jt=new L_(L,Lt,ut,tt),ct=new Wg(L,et,Lt,ut),yt=new Qg(L,et,Lt,ut),Lt.programs=It.programs,x.capabilities=ut,x.extensions=et,x.properties=wt,x.renderLists=Rt,x.shadowMap=it,x.state=tt,x.info=Lt}ie();let Xt=new Sc(x,L);this.xr=Xt,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let b=et.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=et.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(b){b!==void 0&&(Y=b,this.setSize(N,F,!1))},this.getSize=function(b){return b.set(N,F)},this.setSize=function(b,k,W=!0){if(Xt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}N=b,F=k,e.width=Math.floor(b*Y),e.height=Math.floor(k*Y),W===!0&&(e.style.width=b+"px",e.style.height=k+"px"),this.setViewport(0,0,b,k)},this.getDrawingBufferSize=function(b){return b.set(N*Y,F*Y).floor()},this.setDrawingBufferSize=function(b,k,W){N=b,F=k,Y=W,e.width=Math.floor(b*W),e.height=Math.floor(k*W),this.setViewport(0,0,b,k)},this.getCurrentViewport=function(b){return b.copy(w)},this.getViewport=function(b){return b.copy(Q)},this.setViewport=function(b,k,W,H){b.isVector4?Q.set(b.x,b.y,b.z,b.w):Q.set(b,k,W,H),tt.viewport(w.copy(Q).multiplyScalar(Y).floor())},this.getScissor=function(b){return b.copy(J)},this.setScissor=function(b,k,W,H){b.isVector4?J.set(b.x,b.y,b.z,b.w):J.set(b,k,W,H),tt.scissor(O.copy(J).multiplyScalar(Y).floor())},this.getScissorTest=function(){return st},this.setScissorTest=function(b){tt.setScissorTest(st=b)},this.setOpaqueSort=function(b){j=b},this.setTransparentSort=function(b){Z=b},this.getClearColor=function(b){return b.copy(te.getClearColor())},this.setClearColor=function(){te.setClearColor.apply(te,arguments)},this.getClearAlpha=function(){return te.getClearAlpha()},this.setClearAlpha=function(){te.setClearAlpha.apply(te,arguments)},this.clear=function(b=!0,k=!0,W=!0){let H=0;if(b){let V=!1;if(A!==null){let Tt=A.texture.format;V=Tt===Pu||Tt===Cu||Tt===Ru}if(V){let Tt=A.texture.type,At=Tt===Ei||Tt===xi||Tt===Jc||Tt===Bi||Tt===Tu||Tt===Au,Ht=te.getClearColor(),Vt=te.getClearAlpha(),Qt=Ht.r,Yt=Ht.g,$t=Ht.b;At?(p[0]=Qt,p[1]=Yt,p[2]=$t,p[3]=Vt,L.clearBufferuiv(L.COLOR,0,p)):(g[0]=Qt,g[1]=Yt,g[2]=$t,g[3]=Vt,L.clearBufferiv(L.COLOR,0,g))}else H|=L.COLOR_BUFFER_BIT}k&&(H|=L.DEPTH_BUFFER_BIT),W&&(H|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",vt,!1),e.removeEventListener("webglcontextrestored",U,!1),e.removeEventListener("webglcontextcreationerror",_t,!1),Rt.dispose(),kt.dispose(),wt.dispose(),y.dispose(),B.dispose(),nt.dispose(),Dt.dispose(),jt.dispose(),It.dispose(),Xt.dispose(),Xt.removeEventListener("sessionstart",Ve),Xt.removeEventListener("sessionend",he),Ct&&(Ct.dispose(),Ct=null),We.stop()};function vt(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function U(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let b=Lt.autoReset,k=it.enabled,W=it.autoUpdate,H=it.needsUpdate,V=it.type;ie(),Lt.autoReset=b,it.enabled=k,it.autoUpdate=W,it.needsUpdate=H,it.type=V}function _t(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function mt(b){let k=b.target;k.removeEventListener("dispose",mt),zt(k)}function zt(b){Ut(b),wt.remove(b)}function Ut(b){let k=wt.get(b).programs;k!==void 0&&(k.forEach(function(W){It.releaseProgram(W)}),b.isShaderMaterial&&It.releaseShaderCache(b))}this.renderBufferDirect=function(b,k,W,H,V,Tt){k===null&&(k=Pt);let At=V.isMesh&&V.matrixWorld.determinant()<0,Ht=Fn(b,k,W,H,V);tt.setMaterial(H,At);let Vt=W.index,Qt=1;if(H.wireframe===!0){if(Vt=rt.getWireframeAttribute(W),Vt===void 0)return;Qt=2}let Yt=W.drawRange,$t=W.attributes.position,Se=Yt.start*Qt,ye=(Yt.start+Yt.count)*Qt;Tt!==null&&(Se=Math.max(Se,Tt.start*Qt),ye=Math.min(ye,(Tt.start+Tt.count)*Qt)),Vt!==null?(Se=Math.max(Se,0),ye=Math.min(ye,Vt.count)):$t!=null&&(Se=Math.max(Se,0),ye=Math.min(ye,$t.count));let xe=ye-Se;if(xe<0||xe===1/0)return;Dt.setup(V,H,Ht,W,Vt);let Xe,de=ct;if(Vt!==null&&(Xe=lt.get(Vt),de=yt,de.setIndex(Xe)),V.isMesh)H.wireframe===!0?(tt.setLineWidth(H.wireframeLinewidth*Gt()),de.setMode(L.LINES)):de.setMode(L.TRIANGLES);else if(V.isLine){let Zt=H.linewidth;Zt===void 0&&(Zt=1),tt.setLineWidth(Zt*Gt()),V.isLineSegments?de.setMode(L.LINES):V.isLineLoop?de.setMode(L.LINE_LOOP):de.setMode(L.LINE_STRIP)}else V.isPoints?de.setMode(L.POINTS):V.isSprite&&de.setMode(L.TRIANGLES);if(V.isBatchedMesh)de.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else if(V.isInstancedMesh)de.renderInstances(Se,xe,V.count);else if(W.isInstancedBufferGeometry){let Zt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Qi=Math.min(W.instanceCount,Zt);de.renderInstances(Se,xe,Qi)}else de.render(Se,xe)};function re(b,k,W){b.transparent===!0&&b.side===cn&&b.forceSinglePass===!1?(b.side=en,b.needsUpdate=!0,On(b,k,W),b.side=bi,b.needsUpdate=!0,On(b,k,W),b.side=cn):On(b,k,W)}this.compile=function(b,k,W=null){W===null&&(W=b),m=kt.get(W),m.init(),S.push(m),W.traverseVisible(function(V){V.isLight&&V.layers.test(k.layers)&&(m.pushLight(V),V.castShadow&&m.pushShadow(V))}),b!==W&&b.traverseVisible(function(V){V.isLight&&V.layers.test(k.layers)&&(m.pushLight(V),V.castShadow&&m.pushShadow(V))}),m.setupLights(x._useLegacyLights);let H=new Set;return b.traverse(function(V){let Tt=V.material;if(Tt)if(Array.isArray(Tt))for(let At=0;At<Tt.length;At++){let Ht=Tt[At];re(Ht,W,V),H.add(Ht)}else re(Tt,W,V),H.add(Tt)}),S.pop(),m=null,H},this.compileAsync=function(b,k,W=null){let H=this.compile(b,k,W);return new Promise(V=>{function Tt(){if(H.forEach(function(At){wt.get(At).currentProgram.isReady()&&H.delete(At)}),H.size===0){V(b);return}setTimeout(Tt,10)}et.get("KHR_parallel_shader_compile")!==null?Tt():setTimeout(Tt,10)})};let ae=null;function Re(b){ae&&ae(b)}function Ve(){We.stop()}function he(){We.start()}let We=new ku;We.setAnimationLoop(Re),typeof self<"u"&&We.setContext(self),this.setAnimationLoop=function(b){ae=b,Xt.setAnimationLoop(b),b===null?We.stop():We.start()},Xt.addEventListener("sessionstart",Ve),Xt.addEventListener("sessionend",he),this.render=function(b,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Xt.enabled===!0&&Xt.isPresenting===!0&&(Xt.cameraAutoUpdate===!0&&Xt.updateCamera(k),k=Xt.getCamera()),b.isScene===!0&&b.onBeforeRender(x,b,k,A),m=kt.get(b,S.length),m.init(),S.push(m),St.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),K.setFromProjectionMatrix(St),Mt=this.localClippingEnabled,ot=Wt.init(this.clippingPlanes,Mt),_=Rt.get(b,f.length),_.init(),f.push(_),hn(b,k,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(j,Z),this.info.render.frame++,ot===!0&&Wt.beginShadows();let W=m.state.shadowsArray;if(it.render(W,b,k),ot===!0&&Wt.endShadows(),this.info.autoReset===!0&&this.info.reset(),te.render(_,b),m.setupLights(x._useLegacyLights),k.isArrayCamera){let H=k.cameras;for(let V=0,Tt=H.length;V<Tt;V++){let At=H[V];Sn(_,b,At,At.viewport)}}else Sn(_,b,k);A!==null&&(E.updateMultisampleRenderTarget(A),E.updateRenderTargetMipmap(A)),b.isScene===!0&&b.onAfterRender(x,b,k),Dt.resetDefaultState(),G=-1,M=null,S.pop(),S.length>0?m=S[S.length-1]:m=null,f.pop(),f.length>0?_=f[f.length-1]:_=null};function hn(b,k,W,H){if(b.visible===!1)return;if(b.layers.test(k.layers)){if(b.isGroup)W=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(k);else if(b.isLight)m.pushLight(b),b.castShadow&&m.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||K.intersectsSprite(b)){H&&Ot.setFromMatrixPosition(b.matrixWorld).applyMatrix4(St);let At=nt.update(b),Ht=b.material;Ht.visible&&_.push(b,At,Ht,W,Ot.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||K.intersectsObject(b))){let At=nt.update(b),Ht=b.material;if(H&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Ot.copy(b.boundingSphere.center)):(At.boundingSphere===null&&At.computeBoundingSphere(),Ot.copy(At.boundingSphere.center)),Ot.applyMatrix4(b.matrixWorld).applyMatrix4(St)),Array.isArray(Ht)){let Vt=At.groups;for(let Qt=0,Yt=Vt.length;Qt<Yt;Qt++){let $t=Vt[Qt],Se=Ht[$t.materialIndex];Se&&Se.visible&&_.push(b,At,Se,W,Ot.z,$t)}}else Ht.visible&&_.push(b,At,Ht,W,Ot.z,null)}}let Tt=b.children;for(let At=0,Ht=Tt.length;At<Ht;At++)hn(Tt[At],k,W,H)}function Sn(b,k,W,H){let V=b.opaque,Tt=b.transmissive,At=b.transparent;m.setupLightsView(W),ot===!0&&Wt.setGlobalState(x.clippingPlanes,W),Tt.length>0&&Lr(V,Tt,k,W),H&&tt.viewport(w.copy(H)),V.length>0&&hi(V,k,W),Tt.length>0&&hi(Tt,k,W),At.length>0&&hi(At,k,W),tt.buffers.depth.setTest(!0),tt.buffers.depth.setMask(!0),tt.buffers.color.setMask(!0),tt.setPolygonOffset(!1)}function Lr(b,k,W,H){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;let Tt=ut.isWebGL2;Ct===null&&(Ct=new oi(1,1,{generateMipmaps:!0,type:et.has("EXT_color_buffer_half_float")?pr:Ei,minFilter:Hi,samples:Tt?4:0})),x.getDrawingBufferSize(Nt),Tt?Ct.setSize(Nt.x,Nt.y):Ct.setSize(Ra(Nt.x),Ra(Nt.y));let At=x.getRenderTarget();x.setRenderTarget(Ct),x.getClearColor(P),C=x.getClearAlpha(),C<1&&x.setClearColor(16777215,.5),x.clear();let Ht=x.toneMapping;x.toneMapping=Mi,hi(b,W,H),E.updateMultisampleRenderTarget(Ct),E.updateRenderTargetMipmap(Ct);let Vt=!1;for(let Qt=0,Yt=k.length;Qt<Yt;Qt++){let $t=k[Qt],Se=$t.object,ye=$t.geometry,xe=$t.material,Xe=$t.group;if(xe.side===cn&&Se.layers.test(H.layers)){let de=xe.side;xe.side=en,xe.needsUpdate=!0,wi(Se,W,H,ye,xe,Xe),xe.side=de,xe.needsUpdate=!0,Vt=!0}}Vt===!0&&(E.updateMultisampleRenderTarget(Ct),E.updateRenderTargetMipmap(Ct)),x.setRenderTarget(At),x.setClearColor(P,C),x.toneMapping=Ht}function hi(b,k,W){let H=k.isScene===!0?k.overrideMaterial:null;for(let V=0,Tt=b.length;V<Tt;V++){let At=b[V],Ht=At.object,Vt=At.geometry,Qt=H===null?At.material:H,Yt=At.group;Ht.layers.test(W.layers)&&wi(Ht,k,W,Vt,Qt,Yt)}}function wi(b,k,W,H,V,Tt){b.onBeforeRender(x,k,W,H,V,Tt),b.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),V.onBeforeRender(x,k,W,H,b,Tt),V.transparent===!0&&V.side===cn&&V.forceSinglePass===!1?(V.side=en,V.needsUpdate=!0,x.renderBufferDirect(W,k,H,V,b,Tt),V.side=bi,V.needsUpdate=!0,x.renderBufferDirect(W,k,H,V,b,Tt),V.side=cn):x.renderBufferDirect(W,k,H,V,b,Tt),b.onAfterRender(x,k,W,H,V,Tt)}function On(b,k,W){k.isScene!==!0&&(k=Pt);let H=wt.get(b),V=m.state.lights,Tt=m.state.shadowsArray,At=V.state.version,Ht=It.getParameters(b,V.state,Tt,k,W),Vt=It.getProgramCacheKey(Ht),Qt=H.programs;H.environment=b.isMeshStandardMaterial?k.environment:null,H.fog=k.fog,H.envMap=(b.isMeshStandardMaterial?B:y).get(b.envMap||H.environment),Qt===void 0&&(b.addEventListener("dispose",mt),Qt=new Map,H.programs=Qt);let Yt=Qt.get(Vt);if(Yt!==void 0){if(H.currentProgram===Yt&&H.lightsStateVersion===At)return Ws(b,Ht),Yt}else Ht.uniforms=It.getUniforms(b),b.onBuild(W,Ht,x),b.onBeforeCompile(Ht,x),Yt=It.acquireProgram(Ht,Vt),Qt.set(Vt,Yt),H.uniforms=Ht.uniforms;let $t=H.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&($t.clippingPlanes=Wt.uniform),Ws(b,Ht),H.needsLights=Dr(b),H.lightsStateVersion=At,H.needsLights&&($t.ambientLightColor.value=V.state.ambient,$t.lightProbe.value=V.state.probe,$t.directionalLights.value=V.state.directional,$t.directionalLightShadows.value=V.state.directionalShadow,$t.spotLights.value=V.state.spot,$t.spotLightShadows.value=V.state.spotShadow,$t.rectAreaLights.value=V.state.rectArea,$t.ltc_1.value=V.state.rectAreaLTC1,$t.ltc_2.value=V.state.rectAreaLTC2,$t.pointLights.value=V.state.point,$t.pointLightShadows.value=V.state.pointShadow,$t.hemisphereLights.value=V.state.hemi,$t.directionalShadowMap.value=V.state.directionalShadowMap,$t.directionalShadowMatrix.value=V.state.directionalShadowMatrix,$t.spotShadowMap.value=V.state.spotShadowMap,$t.spotLightMatrix.value=V.state.spotLightMatrix,$t.spotLightMap.value=V.state.spotLightMap,$t.pointShadowMap.value=V.state.pointShadowMap,$t.pointShadowMatrix.value=V.state.pointShadowMatrix),H.currentProgram=Yt,H.uniformsList=null,Yt}function Vs(b){if(b.uniformsList===null){let k=b.currentProgram.getUniforms();b.uniformsList=Ps.seqWithValue(k.seq,b.uniforms)}return b.uniformsList}function Ws(b,k){let W=wt.get(b);W.outputColorSpace=k.outputColorSpace,W.batching=k.batching,W.instancing=k.instancing,W.instancingColor=k.instancingColor,W.skinning=k.skinning,W.morphTargets=k.morphTargets,W.morphNormals=k.morphNormals,W.morphColors=k.morphColors,W.morphTargetsCount=k.morphTargetsCount,W.numClippingPlanes=k.numClippingPlanes,W.numIntersection=k.numClipIntersection,W.vertexAlphas=k.vertexAlphas,W.vertexTangents=k.vertexTangents,W.toneMapping=k.toneMapping}function Fn(b,k,W,H,V){k.isScene!==!0&&(k=Pt),E.resetTextureUnits();let Tt=k.fog,At=H.isMeshStandardMaterial?k.environment:null,Ht=A===null?x.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:ai,Vt=(H.isMeshStandardMaterial?B:y).get(H.envMap||At),Qt=H.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Yt=!!W.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),$t=!!W.morphAttributes.position,Se=!!W.morphAttributes.normal,ye=!!W.morphAttributes.color,xe=Mi;H.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(xe=x.toneMapping);let Xe=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,de=Xe!==void 0?Xe.length:0,Zt=wt.get(H),Qi=m.state.lights;if(ot===!0&&(Mt===!0||b!==M)){let un=b===M&&H.id===G;Wt.setState(H,b,un)}let ve=!1;H.version===Zt.__version?(Zt.needsLights&&Zt.lightsStateVersion!==Qi.state.version||Zt.outputColorSpace!==Ht||V.isBatchedMesh&&Zt.batching===!1||!V.isBatchedMesh&&Zt.batching===!0||V.isInstancedMesh&&Zt.instancing===!1||!V.isInstancedMesh&&Zt.instancing===!0||V.isSkinnedMesh&&Zt.skinning===!1||!V.isSkinnedMesh&&Zt.skinning===!0||V.isInstancedMesh&&Zt.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Zt.instancingColor===!1&&V.instanceColor!==null||Zt.envMap!==Vt||H.fog===!0&&Zt.fog!==Tt||Zt.numClippingPlanes!==void 0&&(Zt.numClippingPlanes!==Wt.numPlanes||Zt.numIntersection!==Wt.numIntersection)||Zt.vertexAlphas!==Qt||Zt.vertexTangents!==Yt||Zt.morphTargets!==$t||Zt.morphNormals!==Se||Zt.morphColors!==ye||Zt.toneMapping!==xe||ut.isWebGL2===!0&&Zt.morphTargetsCount!==de)&&(ve=!0):(ve=!0,Zt.__version=H.version);let Bn=Zt.currentProgram;ve===!0&&(Bn=On(H,k,V));let qs=!1,_n=!1,ts=!1,De=Bn.getUniforms(),wn=Zt.uniforms;if(tt.useProgram(Bn.program)&&(qs=!0,_n=!0,ts=!0),H.id!==G&&(G=H.id,_n=!0),qs||M!==b){De.setValue(L,"projectionMatrix",b.projectionMatrix),De.setValue(L,"viewMatrix",b.matrixWorldInverse);let un=De.map.cameraPosition;un!==void 0&&un.setValue(L,Ot.setFromMatrixPosition(b.matrixWorld)),ut.logarithmicDepthBuffer&&De.setValue(L,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&De.setValue(L,"isOrthographic",b.isOrthographicCamera===!0),M!==b&&(M=b,_n=!0,ts=!0)}if(V.isSkinnedMesh){De.setOptional(L,V,"bindMatrix"),De.setOptional(L,V,"bindMatrixInverse");let un=V.skeleton;un&&(ut.floatVertexTextures?(un.boneTexture===null&&un.computeBoneTexture(),De.setValue(L,"boneTexture",un.boneTexture,E)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}V.isBatchedMesh&&(De.setOptional(L,V,"batchingTexture"),De.setValue(L,"batchingTexture",V._matricesTexture,E));let kn=W.morphAttributes;if((kn.position!==void 0||kn.normal!==void 0||kn.color!==void 0&&ut.isWebGL2===!0)&&I.update(V,W,Bn),(_n||Zt.receiveShadow!==V.receiveShadow)&&(Zt.receiveShadow=V.receiveShadow,De.setValue(L,"receiveShadow",V.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(wn.envMap.value=Vt,wn.flipEnvMap.value=Vt.isCubeTexture&&Vt.isRenderTargetTexture===!1?-1:1),_n&&(De.setValue(L,"toneMappingExposure",x.toneMappingExposure),Zt.needsLights&&Xs(wn,ts),Tt&&H.fog===!0&&Et.refreshFogUniforms(wn,Tt),Et.refreshMaterialUniforms(wn,H,Y,F,Ct),Ps.upload(L,Vs(Zt),wn,E)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Ps.upload(L,Vs(Zt),wn,E),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&De.setValue(L,"center",V.center),De.setValue(L,"modelViewMatrix",V.modelViewMatrix),De.setValue(L,"normalMatrix",V.normalMatrix),De.setValue(L,"modelMatrix",V.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){let un=H.uniformsGroups;for(let xn=0,es=un.length;xn<es;xn++)if(ut.isWebGL2){let Ys=un[xn];jt.update(Ys,Bn),jt.bind(Ys,Bn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Bn}function Xs(b,k){b.ambientLightColor.needsUpdate=k,b.lightProbe.needsUpdate=k,b.directionalLights.needsUpdate=k,b.directionalLightShadows.needsUpdate=k,b.pointLights.needsUpdate=k,b.pointLightShadows.needsUpdate=k,b.spotLights.needsUpdate=k,b.spotLightShadows.needsUpdate=k,b.rectAreaLights.needsUpdate=k,b.hemisphereLights.needsUpdate=k}function Dr(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return v},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(b,k,W){wt.get(b.texture).__webglTexture=k,wt.get(b.depthTexture).__webglTexture=W;let H=wt.get(b);H.__hasExternalTextures=!0,H.__hasExternalTextures&&(H.__autoAllocateDepthBuffer=W===void 0,H.__autoAllocateDepthBuffer||et.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(b,k){let W=wt.get(b);W.__webglFramebuffer=k,W.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(b,k=0,W=0){A=b,R=k,v=W;let H=!0,V=null,Tt=!1,At=!1;if(b){let Vt=wt.get(b);Vt.__useDefaultFramebuffer!==void 0?(tt.bindFramebuffer(L.FRAMEBUFFER,null),H=!1):Vt.__webglFramebuffer===void 0?E.setupRenderTarget(b):Vt.__hasExternalTextures&&E.rebindTextures(b,wt.get(b.texture).__webglTexture,wt.get(b.depthTexture).__webglTexture);let Qt=b.texture;(Qt.isData3DTexture||Qt.isDataArrayTexture||Qt.isCompressedArrayTexture)&&(At=!0);let Yt=wt.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Yt[k])?V=Yt[k][W]:V=Yt[k],Tt=!0):ut.isWebGL2&&b.samples>0&&E.useMultisampledRTT(b)===!1?V=wt.get(b).__webglMultisampledFramebuffer:Array.isArray(Yt)?V=Yt[W]:V=Yt,w.copy(b.viewport),O.copy(b.scissor),X=b.scissorTest}else w.copy(Q).multiplyScalar(Y).floor(),O.copy(J).multiplyScalar(Y).floor(),X=st;if(tt.bindFramebuffer(L.FRAMEBUFFER,V)&&ut.drawBuffers&&H&&tt.drawBuffers(b,V),tt.viewport(w),tt.scissor(O),tt.setScissorTest(X),Tt){let Vt=wt.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+k,Vt.__webglTexture,W)}else if(At){let Vt=wt.get(b.texture),Qt=k||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Vt.__webglTexture,W||0,Qt)}G=-1},this.readRenderTargetPixels=function(b,k,W,H,V,Tt,At){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ht=wt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&At!==void 0&&(Ht=Ht[At]),Ht){tt.bindFramebuffer(L.FRAMEBUFFER,Ht);try{let Vt=b.texture,Qt=Vt.format,Yt=Vt.type;if(Qt!==In&&ft.convert(Qt)!==L.getParameter(L.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let $t=Yt===pr&&(et.has("EXT_color_buffer_half_float")||ut.isWebGL2&&et.has("EXT_color_buffer_float"));if(Yt!==Ei&&ft.convert(Yt)!==L.getParameter(L.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Yt===yi&&(ut.isWebGL2||et.has("OES_texture_float")||et.has("WEBGL_color_buffer_float")))&&!$t){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=b.width-H&&W>=0&&W<=b.height-V&&L.readPixels(k,W,H,V,ft.convert(Qt),ft.convert(Yt),Tt)}finally{let Vt=A!==null?wt.get(A).__webglFramebuffer:null;tt.bindFramebuffer(L.FRAMEBUFFER,Vt)}}},this.copyFramebufferToTexture=function(b,k,W=0){let H=Math.pow(2,-W),V=Math.floor(k.image.width*H),Tt=Math.floor(k.image.height*H);E.setTexture2D(k,0),L.copyTexSubImage2D(L.TEXTURE_2D,W,0,0,b.x,b.y,V,Tt),tt.unbindTexture()},this.copyTextureToTexture=function(b,k,W,H=0){let V=k.image.width,Tt=k.image.height,At=ft.convert(W.format),Ht=ft.convert(W.type);E.setTexture2D(W,0),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,W.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,W.unpackAlignment),k.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,H,b.x,b.y,V,Tt,At,Ht,k.image.data):k.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,H,b.x,b.y,k.mipmaps[0].width,k.mipmaps[0].height,At,k.mipmaps[0].data):L.texSubImage2D(L.TEXTURE_2D,H,b.x,b.y,At,Ht,k.image),H===0&&W.generateMipmaps&&L.generateMipmap(L.TEXTURE_2D),tt.unbindTexture()},this.copyTextureToTexture3D=function(b,k,W,H,V=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let Tt=b.max.x-b.min.x+1,At=b.max.y-b.min.y+1,Ht=b.max.z-b.min.z+1,Vt=ft.convert(H.format),Qt=ft.convert(H.type),Yt;if(H.isData3DTexture)E.setTexture3D(H,0),Yt=L.TEXTURE_3D;else if(H.isDataArrayTexture||H.isCompressedArrayTexture)E.setTexture2DArray(H,0),Yt=L.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,H.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,H.unpackAlignment);let $t=L.getParameter(L.UNPACK_ROW_LENGTH),Se=L.getParameter(L.UNPACK_IMAGE_HEIGHT),ye=L.getParameter(L.UNPACK_SKIP_PIXELS),xe=L.getParameter(L.UNPACK_SKIP_ROWS),Xe=L.getParameter(L.UNPACK_SKIP_IMAGES),de=W.isCompressedTexture?W.mipmaps[V]:W.image;L.pixelStorei(L.UNPACK_ROW_LENGTH,de.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,de.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,b.min.x),L.pixelStorei(L.UNPACK_SKIP_ROWS,b.min.y),L.pixelStorei(L.UNPACK_SKIP_IMAGES,b.min.z),W.isDataTexture||W.isData3DTexture?L.texSubImage3D(Yt,V,k.x,k.y,k.z,Tt,At,Ht,Vt,Qt,de.data):W.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),L.compressedTexSubImage3D(Yt,V,k.x,k.y,k.z,Tt,At,Ht,Vt,de.data)):L.texSubImage3D(Yt,V,k.x,k.y,k.z,Tt,At,Ht,Vt,Qt,de),L.pixelStorei(L.UNPACK_ROW_LENGTH,$t),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Se),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ye),L.pixelStorei(L.UNPACK_SKIP_ROWS,xe),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Xe),V===0&&H.generateMipmaps&&L.generateMipmap(Yt),tt.unbindTexture()},this.initTexture=function(b){b.isCubeTexture?E.setTextureCube(b,0):b.isData3DTexture?E.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?E.setTexture2DArray(b,0):E.setTexture2D(b,0),tt.unbindTexture()},this.resetState=function(){R=0,v=0,A=null,tt.reset(),Dt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ri}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===jc?"display-p3":"srgb",e.unpackColorSpace=_e.workingColorSpace===no?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Le?zi:Lu}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===zi?Le:ai}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},wc=class extends yr{};wc.prototype.isWebGL1Renderer=!0;var za=class i{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Jt(t),this.density=e}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Fs=class extends $e{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}},Tc=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=cc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Vn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},rn=new D,Ha=class i{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)rn.fromBufferAttribute(this,e),rn.applyMatrix4(t),this.setXYZ(e,rn.x,rn.y,rn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)rn.fromBufferAttribute(this,e),rn.applyNormalMatrix(t),this.setXYZ(e,rn.x,rn.y,rn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)rn.fromBufferAttribute(this,e),rn.transformDirection(t),this.setXYZ(e,rn.x,rn.y,rn.z);return this}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Gn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Gn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Gn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Gn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array),r=ge(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new nn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new i(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},vr=class extends Si{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Jt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},vs,er=new D,Ms=new D,Es=new D,bs=new ht,nr=new ht,Xu=new Ae,fa=new D,ir=new D,pa=new D,hu=new ht,Jo=new ht,uu=new ht,Ga=class extends $e{constructor(t=new vr){if(super(),this.isSprite=!0,this.type="Sprite",vs===void 0){vs=new ln;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Tc(e,5);vs.setIndex([0,1,2,0,2,3]),vs.setAttribute("position",new Ha(n,3,0,!1)),vs.setAttribute("uv",new Ha(n,2,3,!1))}this.geometry=vs,this.material=t,this.center=new ht(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ms.setFromMatrixScale(this.matrixWorld),Xu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Es.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ms.multiplyScalar(-Es.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;ma(fa.set(-.5,-.5,0),Es,a,Ms,s,r),ma(ir.set(.5,-.5,0),Es,a,Ms,s,r),ma(pa.set(.5,.5,0),Es,a,Ms,s,r),hu.set(0,0),Jo.set(1,0),uu.set(1,1);let o=t.ray.intersectTriangle(fa,ir,pa,!1,er);if(o===null&&(ma(ir.set(-.5,.5,0),Es,a,Ms,s,r),Jo.set(0,1),o=t.ray.intersectTriangle(fa,pa,ir,!1,er),o===null))return;let c=t.ray.origin.distanceTo(er);c<t.near||c>t.far||e.push({distance:c,point:er.clone(),uv:Fi.getInterpolation(er,fa,ir,pa,hu,Jo,uu,new ht),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function ma(i,t,e,n,s,r){bs.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(nr.x=r*bs.x-s*bs.y,nr.y=s*bs.x+r*bs.y):nr.copy(bs),i.copy(t),i.x+=nr.x,i.y+=nr.y,i.applyMatrix4(Xu)}var Va=class extends nn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Ss=new Ae,du=new Ae,ga=[],fu=new Dn,D_=new Ae,sr=new at,rr=new Gi,Wa=class extends at{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Va(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,D_)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Dn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ss),fu.copy(t.boundingBox).applyMatrix4(Ss),this.boundingBox.union(fu)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Gi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ss),rr.copy(t.boundingSphere).applyMatrix4(Ss),this.boundingSphere.union(rr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){let n=this.matrixWorld,s=this.count;if(sr.geometry=this.geometry,sr.material=this.material,sr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),rr.copy(this.boundingSphere),rr.applyMatrix4(n),t.ray.intersectsSphere(rr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ss),du.multiplyMatrices(n,Ss),sr.matrixWorld=du,sr.raycast(t,ga);for(let a=0,o=ga.length;a<o;a++){let c=ga[a];c.instanceId=r,c.object=this,e.push(c)}ga.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Va(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}};var qn=class extends En{constructor(t,e,n,s,r,a,o,c,l){super(t,e,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},bn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),s=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);let h=n[s],d=n[s+1]-h,p=(a-h)/d;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new ht:new D);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new D,s=[],r=[],a=[],o=new D,c=new Ae;for(let p=0;p<=t;p++){let g=p/t;s[p]=this.getTangentAt(g,new D)}r[0]=new D,a[0]=new D;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(ze(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(ze(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Mr=class extends bn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e){let n=e||new ht,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,p=l-this.aY;c=d*h-p*u+this.aX,l=d*u+p*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Ac=class extends Mr{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function el(){let i=0,t=0,e=0,n=0;function s(r,a,o,c){i=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let d=(a-r)/l-(o-r)/(l+h)+(o-a)/h,p=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,p*=h,s(a,o,d,p)},calc:function(r){let a=r*r,o=a*r;return i+t*r+e*a+n*o}}}var _a=new D,jo=new el,Qo=new el,tc=new el,Rc=class extends bn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new D){let n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:(_a.subVectors(s[0],s[1]).add(s[0]),l=_a);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(_a.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=_a),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(h),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),jo.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,_,m),Qo.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,_,m),tc.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(jo.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Qo.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),tc.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(jo.calc(c),Qo.calc(c),tc.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new D().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function pu(i,t,e,n,s){let r=(n-t)*.5,a=(s-e)*.5,o=i*i,c=i*o;return(2*e-2*n+r+a)*c+(-3*e+3*n-2*r-a)*o+r*i+e}function U_(i,t){let e=1-i;return e*e*t}function N_(i,t){return 2*(1-i)*i*t}function O_(i,t){return i*i*t}function ur(i,t,e,n){return U_(i,t)+N_(i,e)+O_(i,n)}function F_(i,t){let e=1-i;return e*e*e*t}function B_(i,t){let e=1-i;return 3*e*e*i*t}function k_(i,t){return 3*(1-i)*i*i*t}function z_(i,t){return i*i*i*t}function dr(i,t,e,n,s){return F_(i,t)+B_(i,e)+k_(i,n)+z_(i,s)}var Xa=class extends bn{constructor(t=new ht,e=new ht,n=new ht,s=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ht){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(dr(t,s.x,r.x,a.x,o.x),dr(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Cc=class extends bn{constructor(t=new D,e=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new D){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(dr(t,s.x,r.x,a.x,o.x),dr(t,s.y,r.y,a.y,o.y),dr(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},qa=class extends bn{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Pc=class extends bn{constructor(t=new D,e=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new D){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new D){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ya=class extends bn{constructor(t=new ht,e=new ht,n=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ht){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(ur(t,s.x,r.x,a.x),ur(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ic=class extends bn{constructor(t=new D,e=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new D){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(ur(t,s.x,r.x,a.x),ur(t,s.y,r.y,a.y),ur(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},$a=class extends bn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){let n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(pu(o,c.x,l.x,h.x,u.x),pu(o,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new ht().fromArray(s))}return this}},Lc=Object.freeze({__proto__:null,ArcCurve:Ac,CatmullRomCurve3:Rc,CubicBezierCurve:Xa,CubicBezierCurve3:Cc,EllipseCurve:Mr,LineCurve:qa,LineCurve3:Pc,QuadraticBezierCurve:Ya,QuadraticBezierCurve3:Ic,SplineCurve:$a}),Dc=class extends bn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Lc[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new Lc[s.type]().fromJSON(s))}return this}},Vi=class extends Dc{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new qa(this.currentPoint.clone(),new ht(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new Ya(this.currentPoint.clone(),new ht(t,e),new ht(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){let o=new Xa(this.currentPoint.clone(),new ht(t,e),new ht(n,s),new ht(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new $a(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,a,o,c),this}absellipse(t,e,n,s,r,a,o,c){let l=new Mr(t,e,n,s,r,a,o,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}};var Za=class i extends ln{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],a=[],o=[],c=[],l=new D,h=new ht;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){let p=n+u/e*s;l.x=t*Math.cos(p),l.y=t*Math.sin(p),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Ee(a,3)),this.setAttribute("normal",new Ee(o,3)),this.setAttribute("uv",new Ee(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},le=class i extends ln{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],p=[],g=0,_=[],m=n/2,f=0;S(),a===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Ee(u,3)),this.setAttribute("normal",new Ee(d,3)),this.setAttribute("uv",new Ee(p,2));function S(){let T=new D,R=new D,v=0,A=(e-t)/n;for(let G=0;G<=r;G++){let M=[],w=G/r,O=w*(e-t)+t;for(let X=0;X<=s;X++){let P=X/s,C=P*c+o,N=Math.sin(C),F=Math.cos(C);R.x=O*N,R.y=-w*n+m,R.z=O*F,u.push(R.x,R.y,R.z),T.set(N,A,F).normalize(),d.push(T.x,T.y,T.z),p.push(P,1-w),M.push(g++)}_.push(M)}for(let G=0;G<s;G++)for(let M=0;M<r;M++){let w=_[M][G],O=_[M+1][G],X=_[M+1][G+1],P=_[M][G+1];h.push(w,O,P),h.push(O,X,P),v+=6}l.addGroup(f,v,0),f+=v}function x(T){let R=g,v=new ht,A=new D,G=0,M=T===!0?t:e,w=T===!0?1:-1;for(let X=1;X<=s;X++)u.push(0,m*w,0),d.push(0,w,0),p.push(.5,.5),g++;let O=g;for(let X=0;X<=s;X++){let C=X/s*c+o,N=Math.cos(C),F=Math.sin(C);A.x=M*F,A.y=m*w,A.z=M*N,u.push(A.x,A.y,A.z),d.push(0,w,0),v.x=N*.5+.5,v.y=F*.5*w+.5,p.push(v.x,v.y),g++}for(let X=0;X<s;X++){let P=R+X,C=O+X;T===!0?h.push(C,C+1,P):h.push(C+1,C,P),G+=3}l.addGroup(f,G,T===!0?1:2),f+=G}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ka=class i extends le{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var Wi=class extends Vi{constructor(t){super(t),this.uuid=Vn(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new Vi().fromJSON(s))}return this}},H_={triangulate:function(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=qu(i,0,s,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,c,l,h,u,d,p;if(n&&(r=q_(i,t,r,e)),i.length>80*e){o=l=i[0],c=h=i[1];for(let g=e;g<s;g+=e)u=i[g],d=i[g+1],u<o&&(o=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);p=Math.max(l-o,h-c),p=p!==0?32767/p:0}return Er(r,a,e,o,c,p,0),a}};function qu(i,t,e,n,s){let r,a;if(s===ix(i,t,e,n)>0)for(r=t;r<e;r+=n)a=mu(r,i[r],i[r+1],a);else for(r=e-n;r>=t;r-=n)a=mu(r,i[r],i[r+1],a);return a&&so(a,a.next)&&(Sr(a),a=a.next),a}function Xi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(so(e,e.next)||Ce(e.prev,e,e.next)===0)){if(Sr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Er(i,t,e,n,s,r,a){if(!i)return;!a&&r&&J_(i,n,s,r);let o=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,r?V_(i,n,s,r):G_(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),Sr(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=W_(Xi(i),t,e),Er(i,t,e,n,s,r,2)):a===2&&X_(i,t,e,n,s,r):Er(Xi(i),t,e,n,s,r,1);break}}}function G_(i){let t=i.prev,e=i,n=i.next;if(Ce(t,e,n)>=0)return!1;let s=t.x,r=e.x,a=n.x,o=t.y,c=e.y,l=n.y,h=s<r?s<a?s:a:r<a?r:a,u=o<c?o<l?o:l:c<l?c:l,d=s>r?s>a?s:a:r>a?r:a,p=o>c?o>l?o:l:c>l?c:l,g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=p&&As(s,o,r,c,a,l,g.x,g.y)&&Ce(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function V_(i,t,e,n){let s=i.prev,r=i,a=i.next;if(Ce(s,r,a)>=0)return!1;let o=s.x,c=r.x,l=a.x,h=s.y,u=r.y,d=a.y,p=o<c?o<l?o:l:c<l?c:l,g=h<u?h<d?h:d:u<d?u:d,_=o>c?o>l?o:l:c>l?c:l,m=h>u?h>d?h:d:u>d?u:d,f=Uc(p,g,t,e,n),S=Uc(_,m,t,e,n),x=i.prevZ,T=i.nextZ;for(;x&&x.z>=f&&T&&T.z<=S;){if(x.x>=p&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==a&&As(o,h,c,u,l,d,x.x,x.y)&&Ce(x.prev,x,x.next)>=0||(x=x.prevZ,T.x>=p&&T.x<=_&&T.y>=g&&T.y<=m&&T!==s&&T!==a&&As(o,h,c,u,l,d,T.x,T.y)&&Ce(T.prev,T,T.next)>=0))return!1;T=T.nextZ}for(;x&&x.z>=f;){if(x.x>=p&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==a&&As(o,h,c,u,l,d,x.x,x.y)&&Ce(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;T&&T.z<=S;){if(T.x>=p&&T.x<=_&&T.y>=g&&T.y<=m&&T!==s&&T!==a&&As(o,h,c,u,l,d,T.x,T.y)&&Ce(T.prev,T,T.next)>=0)return!1;T=T.nextZ}return!0}function W_(i,t,e){let n=i;do{let s=n.prev,r=n.next.next;!so(s,r)&&Yu(s,n,n.next,r)&&br(s,r)&&br(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Sr(n),Sr(n.next),n=i=r),n=n.next}while(n!==i);return Xi(n)}function X_(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&tx(a,o)){let c=$u(a,o);a=Xi(a,a.next),c=Xi(c,c.next),Er(a,t,e,n,s,r,0),Er(c,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function q_(i,t,e,n){let s=[],r,a,o,c,l;for(r=0,a=t.length;r<a;r++)o=t[r]*n,c=r<a-1?t[r+1]*n:i.length,l=qu(i,o,c,n,!1),l===l.next&&(l.steiner=!0),s.push(Q_(l));for(s.sort(Y_),r=0;r<s.length;r++)e=$_(s[r],e);return e}function Y_(i,t){return i.x-t.x}function $_(i,t){let e=Z_(i,t);if(!e)return t;let n=$u(e,i);return Xi(n,n.next),Xi(e,e.next)}function Z_(i,t){let e=t,n=-1/0,s,r=i.x,a=i.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){let d=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>n&&(n=d,s=e.x<e.next.x?e:e.next,d===r))return s}e=e.next}while(e!==t);if(!s)return null;let o=s,c=s.x,l=s.y,h=1/0,u;e=s;do r>=e.x&&e.x>=c&&r!==e.x&&As(a<l?r:n,a,c,l,a<l?n:r,a,e.x,e.y)&&(u=Math.abs(a-e.y)/(r-e.x),br(e,i)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&K_(s,e)))&&(s=e,h=u)),e=e.next;while(e!==o);return s}function K_(i,t){return Ce(i.prev,i,t.prev)<0&&Ce(t.next,i,i.next)<0}function J_(i,t,e,n){let s=i;do s.z===0&&(s.z=Uc(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,j_(s)}function j_(i){let t,e,n,s,r,a,o,c,l=1;do{for(e=i,i=null,r=null,a=0;e;){for(a++,n=e,o=0,t=0;t<l&&(o++,n=n.nextZ,!!n);t++);for(c=l;o>0||c>0&&n;)o!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,o--):(s=n,n=n.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,l*=2}while(a>1);return i}function Uc(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Q_(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function As(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function tx(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!ex(i,t)&&(br(i,t)&&br(t,i)&&nx(i,t)&&(Ce(i.prev,i,t.prev)||Ce(i,t.prev,t))||so(i,t)&&Ce(i.prev,i,i.next)>0&&Ce(t.prev,t,t.next)>0)}function Ce(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function so(i,t){return i.x===t.x&&i.y===t.y}function Yu(i,t,e,n){let s=ya(Ce(i,t,e)),r=ya(Ce(i,t,n)),a=ya(Ce(e,n,i)),o=ya(Ce(e,n,t));return!!(s!==r&&a!==o||s===0&&xa(i,e,t)||r===0&&xa(i,n,t)||a===0&&xa(e,i,n)||o===0&&xa(e,t,n))}function xa(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function ya(i){return i>0?1:i<0?-1:0}function ex(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Yu(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function br(i,t){return Ce(i.prev,i,i.next)<0?Ce(i,t,i.next)>=0&&Ce(i,i.prev,t)>=0:Ce(i,t,i.prev)<0||Ce(i,i.next,t)<0}function nx(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function $u(i,t){let e=new Nc(i.i,i.x,i.y),n=new Nc(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function mu(i,t,e,n){let s=new Nc(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Sr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Nc(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function ix(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var fr=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];gu(t),_u(n,t);let a=t.length;e.forEach(gu);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,_u(n,e[c]);let o=H_.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}};function gu(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function _u(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Bs=class i extends ln{constructor(t=new Wi([new ht(.5,.5),new ht(-.5,.5),new ht(-.5,-.5),new ht(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let o=0,c=t.length;o<c;o++){let l=t[o];a(l)}this.setAttribute("position",new Ee(s,3)),this.setAttribute("uv",new Ee(r,2)),this.computeVertexNormals();function a(o){let c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:p-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,f=e.extrudePath,S=e.UVGenerator!==void 0?e.UVGenerator:sx,x,T=!1,R,v,A,G;f&&(x=f.getSpacedPoints(h),T=!0,d=!1,R=f.computeFrenetFrames(h,!1),v=new D,A=new D,G=new D),d||(m=0,p=0,g=0,_=0);let M=o.extractPoints(l),w=M.shape,O=M.holes;if(!fr.isClockWise(w)){w=w.reverse();for(let L=0,gt=O.length;L<gt;L++){let et=O[L];fr.isClockWise(et)&&(O[L]=et.reverse())}}let P=fr.triangulateShape(w,O),C=w;for(let L=0,gt=O.length;L<gt;L++){let et=O[L];w=w.concat(et)}function N(L,gt,et){return gt||console.error("THREE.ExtrudeGeometry: vec does not exist"),L.clone().addScaledVector(gt,et)}let F=w.length,Y=P.length;function j(L,gt,et){let ut,tt,Lt,wt=L.x-gt.x,E=L.y-gt.y,y=et.x-L.x,B=et.y-L.y,lt=wt*wt+E*E,rt=wt*B-E*y;if(Math.abs(rt)>Number.EPSILON){let nt=Math.sqrt(lt),It=Math.sqrt(y*y+B*B),Et=gt.x-E/nt,Rt=gt.y+wt/nt,kt=et.x-B/It,Wt=et.y+y/It,it=((kt-Et)*B-(Wt-Rt)*y)/(wt*B-E*y);ut=Et+wt*it-L.x,tt=Rt+E*it-L.y;let te=ut*ut+tt*tt;if(te<=2)return new ht(ut,tt);Lt=Math.sqrt(te/2)}else{let nt=!1;wt>Number.EPSILON?y>Number.EPSILON&&(nt=!0):wt<-Number.EPSILON?y<-Number.EPSILON&&(nt=!0):Math.sign(E)===Math.sign(B)&&(nt=!0),nt?(ut=-E,tt=wt,Lt=Math.sqrt(lt)):(ut=wt,tt=E,Lt=Math.sqrt(lt/2))}return new ht(ut/Lt,tt/Lt)}let Z=[];for(let L=0,gt=C.length,et=gt-1,ut=L+1;L<gt;L++,et++,ut++)et===gt&&(et=0),ut===gt&&(ut=0),Z[L]=j(C[L],C[et],C[ut]);let Q=[],J,st=Z.concat();for(let L=0,gt=O.length;L<gt;L++){let et=O[L];J=[];for(let ut=0,tt=et.length,Lt=tt-1,wt=ut+1;ut<tt;ut++,Lt++,wt++)Lt===tt&&(Lt=0),wt===tt&&(wt=0),J[ut]=j(et[ut],et[Lt],et[wt]);Q.push(J),st=st.concat(J)}for(let L=0;L<m;L++){let gt=L/m,et=p*Math.cos(gt*Math.PI/2),ut=g*Math.sin(gt*Math.PI/2)+_;for(let tt=0,Lt=C.length;tt<Lt;tt++){let wt=N(C[tt],Z[tt],ut);St(wt.x,wt.y,-et)}for(let tt=0,Lt=O.length;tt<Lt;tt++){let wt=O[tt];J=Q[tt];for(let E=0,y=wt.length;E<y;E++){let B=N(wt[E],J[E],ut);St(B.x,B.y,-et)}}}let K=g+_;for(let L=0;L<F;L++){let gt=d?N(w[L],st[L],K):w[L];T?(A.copy(R.normals[0]).multiplyScalar(gt.x),v.copy(R.binormals[0]).multiplyScalar(gt.y),G.copy(x[0]).add(A).add(v),St(G.x,G.y,G.z)):St(gt.x,gt.y,0)}for(let L=1;L<=h;L++)for(let gt=0;gt<F;gt++){let et=d?N(w[gt],st[gt],K):w[gt];T?(A.copy(R.normals[L]).multiplyScalar(et.x),v.copy(R.binormals[L]).multiplyScalar(et.y),G.copy(x[L]).add(A).add(v),St(G.x,G.y,G.z)):St(et.x,et.y,u/h*L)}for(let L=m-1;L>=0;L--){let gt=L/m,et=p*Math.cos(gt*Math.PI/2),ut=g*Math.sin(gt*Math.PI/2)+_;for(let tt=0,Lt=C.length;tt<Lt;tt++){let wt=N(C[tt],Z[tt],ut);St(wt.x,wt.y,u+et)}for(let tt=0,Lt=O.length;tt<Lt;tt++){let wt=O[tt];J=Q[tt];for(let E=0,y=wt.length;E<y;E++){let B=N(wt[E],J[E],ut);T?St(B.x,B.y+x[h-1].y,x[h-1].x+et):St(B.x,B.y,u+et)}}}ot(),Mt();function ot(){let L=s.length/3;if(d){let gt=0,et=F*gt;for(let ut=0;ut<Y;ut++){let tt=P[ut];Nt(tt[2]+et,tt[1]+et,tt[0]+et)}gt=h+m*2,et=F*gt;for(let ut=0;ut<Y;ut++){let tt=P[ut];Nt(tt[0]+et,tt[1]+et,tt[2]+et)}}else{for(let gt=0;gt<Y;gt++){let et=P[gt];Nt(et[2],et[1],et[0])}for(let gt=0;gt<Y;gt++){let et=P[gt];Nt(et[0]+F*h,et[1]+F*h,et[2]+F*h)}}n.addGroup(L,s.length/3-L,0)}function Mt(){let L=s.length/3,gt=0;Ct(C,gt),gt+=C.length;for(let et=0,ut=O.length;et<ut;et++){let tt=O[et];Ct(tt,gt),gt+=tt.length}n.addGroup(L,s.length/3-L,1)}function Ct(L,gt){let et=L.length;for(;--et>=0;){let ut=et,tt=et-1;tt<0&&(tt=L.length-1);for(let Lt=0,wt=h+m*2;Lt<wt;Lt++){let E=F*Lt,y=F*(Lt+1),B=gt+ut+E,lt=gt+tt+E,rt=gt+tt+y,nt=gt+ut+y;Ot(B,lt,rt,nt)}}}function St(L,gt,et){c.push(L),c.push(gt),c.push(et)}function Nt(L,gt,et){Pt(L),Pt(gt),Pt(et);let ut=s.length/3,tt=S.generateTopUV(n,s,ut-3,ut-2,ut-1);Gt(tt[0]),Gt(tt[1]),Gt(tt[2])}function Ot(L,gt,et,ut){Pt(L),Pt(gt),Pt(ut),Pt(gt),Pt(et),Pt(ut);let tt=s.length/3,Lt=S.generateSideWallUV(n,s,tt-6,tt-3,tt-2,tt-1);Gt(Lt[0]),Gt(Lt[1]),Gt(Lt[3]),Gt(Lt[1]),Gt(Lt[2]),Gt(Lt[3])}function Pt(L){s.push(c[L*3+0]),s.push(c[L*3+1]),s.push(c[L*3+2])}function Gt(L){r.push(L.x),r.push(L.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return rx(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];n.push(o)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Lc[s.type]().fromJSON(s)),new i(n,t.options)}},sx={generateTopUV:function(i,t,e,n,s){let r=t[e*3],a=t[e*3+1],o=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new ht(r,a),new ht(o,c),new ht(l,h)]},generateSideWallUV:function(i,t,e,n,s,r){let a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[s*3],p=t[s*3+1],g=t[s*3+2],_=t[r*3],m=t[r*3+1],f=t[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new ht(a,1-c),new ht(l,1-u),new ht(d,1-g),new ht(_,1-f)]:[new ht(o,1-c),new ht(h,1-u),new ht(p,1-g),new ht(m,1-f)]}};function rx(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var qi=class i extends ln{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,h=[],u=new D,d=new D,p=[],g=[],_=[],m=[];for(let f=0;f<=n;f++){let S=[],x=f/n,T=0;f===0&&a===0?T=.5/e:f===n&&c===Math.PI&&(T=-.5/e);for(let R=0;R<=e;R++){let v=R/e;u.x=-t*Math.cos(s+v*r)*Math.sin(a+x*o),u.y=t*Math.cos(a+x*o),u.z=t*Math.sin(s+v*r)*Math.sin(a+x*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(v+T,1-x),S.push(l++)}h.push(S)}for(let f=0;f<n;f++)for(let S=0;S<e;S++){let x=h[f][S+1],T=h[f][S],R=h[f+1][S],v=h[f+1][S+1];(f!==0||a>0)&&p.push(x,T,v),(f!==n-1||c<Math.PI)&&p.push(T,R,v)}this.setIndex(p),this.setAttribute("position",new Ee(g,3)),this.setAttribute("normal",new Ee(_,3)),this.setAttribute("uv",new Ee(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Yn=class i extends ln{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let a=[],o=[],c=[],l=[],h=new D,u=new D,d=new D;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){let _=g/s*r,m=p/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){let _=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,f=(s+1)*(p-1)+g,S=(s+1)*p+g;a.push(_,m,S),a.push(m,f,S)}this.setIndex(a),this.setAttribute("position",new Ee(o,3)),this.setAttribute("normal",new Ee(c,3)),this.setAttribute("uv",new Ee(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var be=class extends Si{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Jt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Jt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Du,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Ja=class extends be{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ht(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ze(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Jt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Jt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Jt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};function va(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function ax(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var ks=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Oc=class extends ks{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Mh,endingEnd:Mh}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Eh:r=t,o=2*e-n;break;case bh:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Eh:a=t,c=2*n-e;break;case bh:a=1,c=n+s[1]-s[0];break;default:a=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(n-e)/(s-e),_=g*g,m=_*g,f=-d*m+2*d*_-d*g,S=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,x=(-1-p)*m+(1.5+p)*_+.5*g,T=p*m-p*_;for(let R=0;R!==o;++R)r[R]=f*a[h+R]+S*a[l+R]+x*a[c+R]+T*a[u+R];return r}},Fc=class extends ks{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,h=(n-e)/(s-e),u=1-h;for(let d=0;d!==o;++d)r[d]=a[l+d]*u+a[c+d]*h;return r}},Bc=class extends ks{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Un=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=va(e,this.TimeBufferType),this.values=va(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:va(t.times,Array),values:va(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Bc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Fc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Oc(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Ea:e=this.InterpolantFactoryMethodDiscrete;break;case ba:e=this.InterpolantFactoryMethodLinear;break;case Ro:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ea;case this.InterpolantFactoryMethodLinear:return ba;case this.InterpolantFactoryMethodSmooth:return Ro}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(s!==void 0&&ax(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ro,r=t.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=t[o],h=t[o+1];if(l!==h&&(o!==1||l!==t[0]))if(s)c=!0;else{let u=o*n,d=u-n,p=u+n;for(let g=0;g!==n;++g){let _=e[u+g];if(_!==e[d+g]||_!==e[p+g]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];let u=o*n,d=a*n;for(let p=0;p!==n;++p)e[d+p]=e[u+p]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)e[c+l]=e[o+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};Un.prototype.TimeBufferType=Float32Array;Un.prototype.ValueBufferType=Float32Array;Un.prototype.DefaultInterpolation=ba;var Yi=class extends Un{};Yi.prototype.ValueTypeName="bool";Yi.prototype.ValueBufferType=Array;Yi.prototype.DefaultInterpolation=Ea;Yi.prototype.InterpolantFactoryMethodLinear=void 0;Yi.prototype.InterpolantFactoryMethodSmooth=void 0;var kc=class extends Un{};kc.prototype.ValueTypeName="color";var zc=class extends Un{};zc.prototype.ValueTypeName="number";var Hc=class extends ks{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-e)/(s-e),l=t*o;for(let h=l+o;l!==h;l+=4)Ln.slerpFlat(r,0,a,l-o,a,l,c);return r}},wr=class extends Un{InterpolantFactoryMethodLinear(t){return new Hc(this.times,this.values,this.getValueSize(),t)}};wr.prototype.ValueTypeName="quaternion";wr.prototype.DefaultInterpolation=ba;wr.prototype.InterpolantFactoryMethodSmooth=void 0;var $i=class extends Un{};$i.prototype.ValueTypeName="string";$i.prototype.ValueBufferType=Array;$i.prototype.DefaultInterpolation=Ea;$i.prototype.InterpolantFactoryMethodLinear=void 0;$i.prototype.InterpolantFactoryMethodSmooth=void 0;var Gc=class extends Un{};Gc.prototype.ValueTypeName="vector";var Vc=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let p=l[u],g=l[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}},ox=new Vc,Wc=class{constructor(t){this.manager=t!==void 0?t:ox,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};Wc.DEFAULT_MATERIAL_NAME="__DEFAULT";var Tr=class extends $e{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Jt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},ja=class extends Tr{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy($e.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Jt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},ec=new Ae,xu=new D,yu=new D,Qa=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.map=null,this.mapPass=null,this.matrix=new Ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _r,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new Te(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;xu.setFromMatrixPosition(t.matrixWorld),e.position.copy(xu),yu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(yu),e.updateMatrixWorld(),ec.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ec),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ec)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var vu=new Ae,ar=new D,nc=new D,Xc=class extends Qa{constructor(){super(new tn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ht(4,2),this._viewportCount=6,this._viewports=[new Te(2,1,1,1),new Te(0,1,1,1),new Te(3,1,1,1),new Te(1,1,1,1),new Te(3,0,1,1),new Te(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ar.setFromMatrixPosition(t.matrixWorld),n.position.copy(ar),nc.copy(n.position),nc.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(nc),n.updateMatrixWorld(),s.makeTranslation(-ar.x,-ar.y,-ar.z),vu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vu)}},zs=class extends Tr{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Xc}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},qc=class extends Qa{constructor(){super(new Ba(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ar=class extends Tr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy($e.DEFAULT_UP),this.updateMatrix(),this.target=new $e,this.shadow=new qc}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var nl="\\[\\]\\.:\\/",cx=new RegExp("["+nl+"]","g"),il="[^"+nl+"]",lx="[^"+nl.replace("\\.","")+"]",hx=/((?:WC+[\/:])*)/.source.replace("WC",il),ux=/(WCOD+)?/.source.replace("WCOD",lx),dx=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",il),fx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",il),px=new RegExp("^"+hx+ux+dx+fx+"$"),mx=["material","materials","bones","map"],Yc=class{constructor(t,e,n){let s=n||we.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},we=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(cx,"")}static parseTrackName(t){let e=px.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);mx.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let c=n(o.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let a=t[s];if(a===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};we.Composite=Yc;we.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};we.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};we.prototype.GetterByBindingType=[we.prototype._getValue_direct,we.prototype._getValue_array,we.prototype._getValue_arrayElement,we.prototype._getValue_toArray];we.prototype.SetterByBindingTypeAndVersioning=[[we.prototype._setValue_direct,we.prototype._setValue_direct_setNeedsUpdate,we.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[we.prototype._setValue_array,we.prototype._setValue_array_setNeedsUpdate,we.prototype._setValue_array_setMatrixWorldNeedsUpdate],[we.prototype._setValue_arrayElement,we.prototype._setValue_arrayElement_setNeedsUpdate,we.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[we.prototype._setValue_fromArray,we.prototype._setValue_fromArray_setNeedsUpdate,we.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Rx=new Float32Array(1);var to=class{constructor(t,e,n=0,s=1/0){this.ray=new Us(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new gr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return $c(t,this,n,e),n.sort(Mu),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)$c(t[s],this,n,e);return n.sort(Mu),n}};function Mu(i,t){return i.distance-t.distance}function $c(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){let s=i.children;for(let r=0,a=s.length;r<a;r++)$c(s[r],t,e,!0)}}var Rr=class{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(ze(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");var Zu={type:"change"},sl={type:"start"},Ku={type:"end"},ro=new Us,Ju=new Cn,_x=Math.cos(70*Nu.DEG2RAD),ao=class extends Xn{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Zi.ROTATE,MIDDLE:Zi.DOLLY,RIGHT:Zi.PAN},this.touches={ONE:Ki.ROTATE,TWO:Ki.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(I){I.addEventListener("keydown",nt),this._domElementKeyEvents=I},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",nt),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Zu),n.update(),r=s.NONE},this.update=(function(){let I=new D,ct=new Ln().setFromUnitVectors(t.up,new D(0,1,0)),yt=ct.clone().invert(),ft=new D,Dt=new Ln,jt=new D,ie=2*Math.PI;return function(vt=null){let U=n.object.position;I.copy(U).sub(n.target),I.applyQuaternion(ct),o.setFromVector3(I),n.autoRotate&&r===s.NONE&&O(M(vt)),n.enableDamping?(o.theta+=c.theta*n.dampingFactor,o.phi+=c.phi*n.dampingFactor):(o.theta+=c.theta,o.phi+=c.phi);let _t=n.minAzimuthAngle,mt=n.maxAzimuthAngle;isFinite(_t)&&isFinite(mt)&&(_t<-Math.PI?_t+=ie:_t>Math.PI&&(_t-=ie),mt<-Math.PI?mt+=ie:mt>Math.PI&&(mt-=ie),_t<=mt?o.theta=Math.max(_t,Math.min(mt,o.theta)):o.theta=o.theta>(_t+mt)/2?Math.max(_t,o.theta):Math.min(mt,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&v||n.object.isOrthographicCamera?o.radius=Z(o.radius):o.radius=Z(o.radius*l),I.setFromSpherical(o),I.applyQuaternion(yt),U.copy(n.target).add(I),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),h.set(0,0,0));let zt=!1;if(n.zoomToCursor&&v){let Ut=null;if(n.object.isPerspectiveCamera){let re=I.length();Ut=Z(re*l);let ae=re-Ut;n.object.position.addScaledVector(T,ae),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let re=new D(R.x,R.y,0);re.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),zt=!0;let ae=new D(R.x,R.y,0);ae.unproject(n.object),n.object.position.sub(ae).add(re),n.object.updateMatrixWorld(),Ut=I.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Ut!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Ut).add(n.object.position):(ro.origin.copy(n.object.position),ro.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(ro.direction))<_x?t.lookAt(n.target):(Ju.setFromNormalAndCoplanarPoint(n.object.up,n.target),ro.intersectPlane(Ju,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),zt=!0);return l=1,v=!1,zt||ft.distanceToSquared(n.object.position)>a||8*(1-Dt.dot(n.object.quaternion))>a||jt.distanceToSquared(n.target)>0?(n.dispatchEvent(Zu),ft.copy(n.object.position),Dt.copy(n.object.quaternion),jt.copy(n.target),!0):!1}})(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",Rt),n.domElement.removeEventListener("pointerdown",wt),n.domElement.removeEventListener("pointercancel",y),n.domElement.removeEventListener("wheel",rt),n.domElement.removeEventListener("pointermove",E),n.domElement.removeEventListener("pointerup",y),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",nt),n._domElementKeyEvents=null)};let n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},r=s.NONE,a=1e-6,o=new Rr,c=new Rr,l=1,h=new D,u=new ht,d=new ht,p=new ht,g=new ht,_=new ht,m=new ht,f=new ht,S=new ht,x=new ht,T=new D,R=new ht,v=!1,A=[],G={};function M(I){return I!==null?2*Math.PI/60*n.autoRotateSpeed*I:2*Math.PI/60/60*n.autoRotateSpeed}function w(I){let ct=Math.abs(I)/(100*(window.devicePixelRatio|0));return Math.pow(.95,n.zoomSpeed*ct)}function O(I){c.theta-=I}function X(I){c.phi-=I}let P=(function(){let I=new D;return function(yt,ft){I.setFromMatrixColumn(ft,0),I.multiplyScalar(-yt),h.add(I)}})(),C=(function(){let I=new D;return function(yt,ft){n.screenSpacePanning===!0?I.setFromMatrixColumn(ft,1):(I.setFromMatrixColumn(ft,0),I.crossVectors(n.object.up,I)),I.multiplyScalar(yt),h.add(I)}})(),N=(function(){let I=new D;return function(yt,ft){let Dt=n.domElement;if(n.object.isPerspectiveCamera){let jt=n.object.position;I.copy(jt).sub(n.target);let ie=I.length();ie*=Math.tan(n.object.fov/2*Math.PI/180),P(2*yt*ie/Dt.clientHeight,n.object.matrix),C(2*ft*ie/Dt.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(P(yt*(n.object.right-n.object.left)/n.object.zoom/Dt.clientWidth,n.object.matrix),C(ft*(n.object.top-n.object.bottom)/n.object.zoom/Dt.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function F(I){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l/=I:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Y(I){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l*=I:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function j(I,ct){if(!n.zoomToCursor)return;v=!0;let yt=n.domElement.getBoundingClientRect(),ft=I-yt.left,Dt=ct-yt.top,jt=yt.width,ie=yt.height;R.x=ft/jt*2-1,R.y=-(Dt/ie)*2+1,T.set(R.x,R.y,1).unproject(n.object).sub(n.object.position).normalize()}function Z(I){return Math.max(n.minDistance,Math.min(n.maxDistance,I))}function Q(I){u.set(I.clientX,I.clientY)}function J(I){j(I.clientX,I.clientX),f.set(I.clientX,I.clientY)}function st(I){g.set(I.clientX,I.clientY)}function K(I){d.set(I.clientX,I.clientY),p.subVectors(d,u).multiplyScalar(n.rotateSpeed);let ct=n.domElement;O(2*Math.PI*p.x/ct.clientHeight),X(2*Math.PI*p.y/ct.clientHeight),u.copy(d),n.update()}function ot(I){S.set(I.clientX,I.clientY),x.subVectors(S,f),x.y>0?F(w(x.y)):x.y<0&&Y(w(x.y)),f.copy(S),n.update()}function Mt(I){_.set(I.clientX,I.clientY),m.subVectors(_,g).multiplyScalar(n.panSpeed),N(m.x,m.y),g.copy(_),n.update()}function Ct(I){j(I.clientX,I.clientY),I.deltaY<0?Y(w(I.deltaY)):I.deltaY>0&&F(w(I.deltaY)),n.update()}function St(I){let ct=!1;switch(I.code){case n.keys.UP:I.ctrlKey||I.metaKey||I.shiftKey?X(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):N(0,n.keyPanSpeed),ct=!0;break;case n.keys.BOTTOM:I.ctrlKey||I.metaKey||I.shiftKey?X(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):N(0,-n.keyPanSpeed),ct=!0;break;case n.keys.LEFT:I.ctrlKey||I.metaKey||I.shiftKey?O(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):N(n.keyPanSpeed,0),ct=!0;break;case n.keys.RIGHT:I.ctrlKey||I.metaKey||I.shiftKey?O(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):N(-n.keyPanSpeed,0),ct=!0;break}ct&&(I.preventDefault(),n.update())}function Nt(I){if(A.length===1)u.set(I.pageX,I.pageY);else{let ct=te(I),yt=.5*(I.pageX+ct.x),ft=.5*(I.pageY+ct.y);u.set(yt,ft)}}function Ot(I){if(A.length===1)g.set(I.pageX,I.pageY);else{let ct=te(I),yt=.5*(I.pageX+ct.x),ft=.5*(I.pageY+ct.y);g.set(yt,ft)}}function Pt(I){let ct=te(I),yt=I.pageX-ct.x,ft=I.pageY-ct.y,Dt=Math.sqrt(yt*yt+ft*ft);f.set(0,Dt)}function Gt(I){n.enableZoom&&Pt(I),n.enablePan&&Ot(I)}function L(I){n.enableZoom&&Pt(I),n.enableRotate&&Nt(I)}function gt(I){if(A.length==1)d.set(I.pageX,I.pageY);else{let yt=te(I),ft=.5*(I.pageX+yt.x),Dt=.5*(I.pageY+yt.y);d.set(ft,Dt)}p.subVectors(d,u).multiplyScalar(n.rotateSpeed);let ct=n.domElement;O(2*Math.PI*p.x/ct.clientHeight),X(2*Math.PI*p.y/ct.clientHeight),u.copy(d)}function et(I){if(A.length===1)_.set(I.pageX,I.pageY);else{let ct=te(I),yt=.5*(I.pageX+ct.x),ft=.5*(I.pageY+ct.y);_.set(yt,ft)}m.subVectors(_,g).multiplyScalar(n.panSpeed),N(m.x,m.y),g.copy(_)}function ut(I){let ct=te(I),yt=I.pageX-ct.x,ft=I.pageY-ct.y,Dt=Math.sqrt(yt*yt+ft*ft);S.set(0,Dt),x.set(0,Math.pow(S.y/f.y,n.zoomSpeed)),F(x.y),f.copy(S);let jt=(I.pageX+ct.x)*.5,ie=(I.pageY+ct.y)*.5;j(jt,ie)}function tt(I){n.enableZoom&&ut(I),n.enablePan&&et(I)}function Lt(I){n.enableZoom&&ut(I),n.enableRotate&&gt(I)}function wt(I){n.enabled!==!1&&(A.length===0&&(n.domElement.setPointerCapture(I.pointerId),n.domElement.addEventListener("pointermove",E),n.domElement.addEventListener("pointerup",y)),kt(I),I.pointerType==="touch"?It(I):B(I))}function E(I){n.enabled!==!1&&(I.pointerType==="touch"?Et(I):lt(I))}function y(I){Wt(I),A.length===0&&(n.domElement.releasePointerCapture(I.pointerId),n.domElement.removeEventListener("pointermove",E),n.domElement.removeEventListener("pointerup",y)),n.dispatchEvent(Ku),r=s.NONE}function B(I){let ct;switch(I.button){case 0:ct=n.mouseButtons.LEFT;break;case 1:ct=n.mouseButtons.MIDDLE;break;case 2:ct=n.mouseButtons.RIGHT;break;default:ct=-1}switch(ct){case Zi.DOLLY:if(n.enableZoom===!1)return;J(I),r=s.DOLLY;break;case Zi.ROTATE:if(I.ctrlKey||I.metaKey||I.shiftKey){if(n.enablePan===!1)return;st(I),r=s.PAN}else{if(n.enableRotate===!1)return;Q(I),r=s.ROTATE}break;case Zi.PAN:if(I.ctrlKey||I.metaKey||I.shiftKey){if(n.enableRotate===!1)return;Q(I),r=s.ROTATE}else{if(n.enablePan===!1)return;st(I),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(sl)}function lt(I){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;K(I);break;case s.DOLLY:if(n.enableZoom===!1)return;ot(I);break;case s.PAN:if(n.enablePan===!1)return;Mt(I);break}}function rt(I){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(I.preventDefault(),n.dispatchEvent(sl),Ct(I),n.dispatchEvent(Ku))}function nt(I){n.enabled===!1||n.enablePan===!1||St(I)}function It(I){switch(it(I),A.length){case 1:switch(n.touches.ONE){case Ki.ROTATE:if(n.enableRotate===!1)return;Nt(I),r=s.TOUCH_ROTATE;break;case Ki.PAN:if(n.enablePan===!1)return;Ot(I),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case Ki.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Gt(I),r=s.TOUCH_DOLLY_PAN;break;case Ki.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;L(I),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(sl)}function Et(I){switch(it(I),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;gt(I),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;et(I),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;tt(I),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Lt(I),n.update();break;default:r=s.NONE}}function Rt(I){n.enabled!==!1&&I.preventDefault()}function kt(I){A.push(I.pointerId)}function Wt(I){delete G[I.pointerId];for(let ct=0;ct<A.length;ct++)if(A[ct]==I.pointerId){A.splice(ct,1);return}}function it(I){let ct=G[I.pointerId];ct===void 0&&(ct=new ht,G[I.pointerId]=ct),ct.set(I.pageX,I.pageY)}function te(I){let ct=I.pointerId===A[0]?A[1]:A[0];return G[ct]}n.domElement.addEventListener("contextmenu",Rt),n.domElement.addEventListener("pointerdown",wt),n.domElement.addEventListener("pointercancel",y),n.domElement.addEventListener("wheel",rt,{passive:!1}),this.update()}};var oo=class extends Fs{constructor(t=null){super();let e=new ee;e.deleteAttribute("uv");let n=new be({side:en}),s=new be,r=5;t!==null&&t._useLegacyLights===!1&&(r=900);let a=new zs(16777215,r,28,2);a.position.set(.418,16.199,.3),this.add(a);let o=new at(e,n);o.position.set(-.757,13.219,.717),o.scale.set(31.713,28.305,28.591),this.add(o);let c=new at(e,s);c.position.set(-10.906,2.009,1.846),c.rotation.set(0,-.195,0),c.scale.set(2.328,7.905,4.651),this.add(c);let l=new at(e,s);l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),this.add(l);let h=new at(e,s);h.position.set(6.167,.857,7.803),h.rotation.set(0,.561,0),h.scale.set(3.927,6.285,3.687),this.add(h);let u=new at(e,s);u.position.set(-2.017,.018,6.124),u.rotation.set(0,.333,0),u.scale.set(2.002,4.566,2.064),this.add(u);let d=new at(e,s);d.position.set(2.291,-.756,-2.621),d.rotation.set(0,-.286,0),d.scale.set(1.546,1.552,1.496),this.add(d);let p=new at(e,s);p.position.set(-2.193,-.369,-5.547),p.rotation.set(0,.516,0),p.scale.set(3.875,3.487,2.986),this.add(p);let g=new at(e,Gs(50));g.position.set(-16.116,14.37,8.208),g.scale.set(.1,2.428,2.739),this.add(g);let _=new at(e,Gs(50));_.position.set(-16.109,18.021,-8.207),_.scale.set(.1,2.425,2.751),this.add(_);let m=new at(e,Gs(17));m.position.set(14.904,12.198,-1.832),m.scale.set(.15,4.265,6.331),this.add(m);let f=new at(e,Gs(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);let S=new at(e,Gs(20));S.position.set(3.235,11.486,-12.541),S.scale.set(2.5,2,.1),this.add(S);let x=new at(e,Gs(100));x.position.set(0,20,0),x.scale.set(1,.1,1),this.add(x)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function Gs(i){let t=new ci;return t.color.setScalar(i),t}var xx=[new Jt(4860181),new Jt(12747061),new Jt(8940598)],Cr={"01":{name:"Steel Base Skid & Rubber Feet",indo:"Rangka Bawah UNP 100 + Kaki Karet",fn:"Carries the full ~650 kg loaded machine flat on workshop floor; anti-slip rubber pads isolate vibration.",spec:"UNP 100 / Hollow 100\xD750\xD73.2 mm, 238\xD7224 cm footprint, 4 rubber isolation pads.",cam:{pos:[-3.6,1.45,3.8],target:[0,.35,0]}},"02":{name:"Twin A-Frame Trunnion Stanchions",indo:"Tiang Penyangga A-Frame + UCP-210",fn:"Holds cradle trunnion pins at 154 cm CoG height so drum clears floor at +32\xB0 mix and -12\xB0 dump.",spec:"Hollow 80\xD780\xD73 mm A-legs + 2\xD7 UCP-210 (50 mm) pillow-block bearings.",cam:{pos:[-3.5,2,3.1],target:[-.55,1.15,0]}},"03":{name:"Tilting U-Cradle & Worm Tilt Wheel",indo:"Rangka Ayun + Roda Kemiringan",fn:"Self-locking brass worm handwheel tilts drum from +32\xB0 mix down to -12\xB0 dump without dropping load. Click wheel in 3D to tilt!",spec:"U-cradle channel frame + self-locking worm quadrant + 40 cm brass handwheel.",cam:{pos:[3.1,1.95,2.6],target:[.95,1.32,.1]}},"04":{name:"4 Trunnion Rollers & Rear Thrust Hub",indo:"4 Roda Penumpu + Bearing Dorong",fn:"Supports rotating drum externally on twin rolling tire bands (mu=0.012) so thin steamer sheet never tears.",spec:"4\xD7 150 mm polyurethane-on-steel guide rollers + rear 51112 axial thrust bearing.",cam:{pos:[-2.85,1.05,2.65],target:[0,.78,.1]}},"05":{name:"179\xD7179 cm Baglog Steamer Cylinder",indo:"Tabung Steamer Baglog Jamur (179\xD7179 cm)",fn:"Existing 4,505 L mushroom baglog autoclave barrel. Kept intact with bolted tire rings & top mouth flange.",spec:"179 cm diameter \xD7 179 cm length (~2.5 mm stainless/mild steel), stiffening chimes.",cam:{pos:[-3.65,2.45,3.75],target:[0,1.42,.1]}},"06":{name:"4 Helical Flights & Cross-Deflectors",indo:"4 Sirip Heliks + Pembelah Halus",fn:"Alternating curved scoops gently lift shredded rajangan to 11 o'clock and waterfall across drum width (<1% bubuk).",spec:"4\xD7 14 cm curved smooth SS304 flights (18\xB0 helix) + 4 cross-vanes; ZERO sharp cutting blades.",cam:{pos:[-2.75,2.25,3.05],target:[.05,1.45,.25]}},"07":{name:"181 cm Tupperware Vault Lid & 8 Clamps",indo:"Tutup Vault Tupperware + 8 Pengunci + Engsel Ayun",fn:"Full-area EPDM U-gasket seals aroma & dust; 8 over-center latches unlock before gas-strut davit swings the 48 kg lid aside. Click door in 3D!",spec:"181 cm domed cap + EPDM U-gasket + 8\xD7 GH-40341 toggle latches + offset swing-davit arm.",cam:{pos:[1.85,2.25,3.65],target:[.15,1.75,1.15]}},"08":{name:"Center Twist-Lock Sample Cap",indo:"Tutup Kecil Cek Sampel & Aroma (Tengah Pintu)",fn:"28 cm Tupperware-style inspection port in door center lets you check blend uniformity & aroma mid-run without opening the 48 kg vault lid.",spec:"28 cm quick-twist quarter-turn collar + silicone O-ring + brass T-handle. Click cap in 3D!",cam:{pos:[1.35,2.15,3.55],target:[0,1.75,1.25]}},"09":{name:"144T Bolt-On Ring Gear & 12T Pinion",indo:"Roda Gigi Cincin 144T + Pinion 12T (12:1)",fn:"12:1 final barrel reduction slashes gearbox torque 12\xD7 and stays meshed at every tilt angle on the cradle.",spec:"#60 roller-chain sprocket ring (PCD 184 cm, 144T) + hardened 12T steel pinion.",cam:{pos:[-2.65,1.55,2.25],target:[-.85,1.12,-.05]}},10:{name:"Dual-Drive 2-Speed Gearbox & Ratchet",indo:"Gearbox 2-Kecepatan + Kopling Pemilih + Ratchet",fn:"Dog-clutch physically locks out crank during engine run; shifts between 24:1 Fast (50 kg) and 72:1 Heavy Low (300 kg) with backstop ratchet.",spec:"Sliding dog-clutch + #50 roller-chain 2:1 / 6:1 stages + anti-kickback ratchet pawl.",cam:{pos:[-2.75,1.45,2.15],target:[-1.15,1.05,-.05]}},11:{name:"3 HP Motor / GX160 & 35 cm Crank / Pedal",indo:"Mesin 3 HP / GX160 + Engkol Manual & Pedal",fn:"Swappable 2.2 kW motor (10.6 RPM cascade) or GX160 petrol engine, plus waist-high 35 cm hand crank (<5 kgf @ 72:1) or 180 W seated pedal drive.",spec:"2.2 kW 4-pole + WPWDX-100 1:10 OR GX160 + 1:6 clutch; 35 cm hand crank / pedal seat.",cam:{pos:[-3.05,1.48,2.35],target:[-1.35,1.02,-.05]}},human:{name:"171 cm Operator Scale Reference (Aldi)",indo:"Referensi Tinggi Manusia 171 cm",fn:"Exact 171 cm figure beside 179 cm cylinder shows why upright drum (179 cm tall) is over-head and why tilting cradle ergonomics matter.",spec:"171.0 cm height \xB7 Waist crank shaft at 101 cm \xB7 Chest loading lip at 114 cm.",cam:{pos:[-3.95,2.52,4.45],target:[-.22,1.42,.12]}}};function co(i,t,e,n,s=.03){let r=new Wi,a=2*Math.PI*t/(i*3.4),o=a*1.15,c=t+a,l=Math.max(s+.02,t-o);for(let d=0;d<i;d++){let p=d/i*Math.PI*2,g=Math.PI*2/i,_=p+g*.2,m=p+g*.32,f=p+g*.62,S=p+g*.74;d===0?r.moveTo(Math.cos(p)*l,Math.sin(p)*l):r.lineTo(Math.cos(p)*l,Math.sin(p)*l),r.lineTo(Math.cos(_)*l,Math.sin(_)*l),r.lineTo(Math.cos(m)*c,Math.sin(m)*c),r.lineTo(Math.cos(f)*c,Math.sin(f)*c),r.lineTo(Math.cos(S)*l,Math.sin(S)*l)}if(r.closePath(),s>.005){let d=new Vi;d.absarc(0,0,s,0,Math.PI*2,!0),r.holes.push(d)}let h=new Bs(r,{depth:e,bevelEnabled:!0,bevelThickness:.004,bevelSize:.003,bevelSegments:1,curveSegments:1});h.translate(0,0,-e/2);let u=new at(h,n);return u.castShadow=!0,u.receiveShadow=!0,u}function yx(){let i=document.createElement("canvas");i.width=1024,i.height=1024;let t=i.getContext("2d");t.fillStyle="#16191f",t.fillRect(0,0,1024,1024);for(let n=0;n<4e3;n++){let s=22+n*37%10;t.fillStyle=`rgb(${s},${s+2},${s+6})`,t.fillRect(n*197%1024,n*419%1024,2,2)}t.strokeStyle="rgba(255,255,255,0.035)",t.lineWidth=1;for(let n=0;n<=16;n++){let s=n/16*1024;t.beginPath(),t.moveTo(s,0),t.lineTo(s,1024),t.stroke(),t.beginPath(),t.moveTo(0,s),t.lineTo(1024,s),t.stroke()}t.strokeStyle="rgba(217,155,56,0.12)",t.lineWidth=2;for(let n=0;n<=4;n++){let s=n/4*1024;t.beginPath(),t.moveTo(s,0),t.lineTo(s,1024),t.stroke(),t.beginPath(),t.moveTo(0,s),t.lineTo(1024,s),t.stroke()}let e=new qn(i);return e.wrapS=e.wrapT=Wn,e.repeat.set(4,4),e.anisotropy=4,e}function Fe(i){let t=i|0;return t=Math.imul(t^t>>>16,2246822507),t=Math.imul(t^t>>>13,3266489909),((t^t>>>16)>>>0)/4294967296}function vx(i=8){let e=document.createElement("canvas");e.width=1536,e.height=1536;let n=e.getContext("2d"),s=document.createElement("canvas");s.width=1536,s.height=1536;let r=s.getContext("2d"),a=new qn(e);a.colorSpace=Le,a.wrapS=a.wrapT=Wn,a.anisotropy=i;let o=new qn(s);o.wrapS=o.wrapT=Wn,o.anisotropy=i;let c=Array.from({length:18e3},(g,_)=>({u:Fe(_*11+1)*1536,v:Fe(_*11+2)*1536,bandSpread:(Fe(_*11+3)-.12)*(1536*.44),len:10+Fe(_*11+4)*20,wid:1.6+Fe(_*11+5)*2.4,ang:Fe(_*11+6)*Math.PI*2,orig:_%3,jitter:Fe(_*11+7)})),l=["#472512","#c48131","#856a33"],h=["#2d170a","#945e1e","#5b4822"],u=-1;function d(g,_,m,f,S,x,T,R){g.save(),g.translate(_,m),g.rotate(x),g.fillStyle=T,g.globalAlpha=R,g.fillRect(-f/2,-S/2,f,S),g.restore()}function p(g){let _=Math.round(g*20);if(_===u)return;u=_;let m=n.createLinearGradient(0,0,1536,0);if(g<.75){let f=g/.75;m.addColorStop(0,f<.4?"#3a1e0e":"#5e3e1e"),m.addColorStop(.5,f<.4?"#8a5a20":"#6c4823"),m.addColorStop(1,f<.4?"#644d23":"#664220")}else m.addColorStop(0,"#63401e"),m.addColorStop(1,"#6a4622");n.fillStyle=m,n.fillRect(0,0,1536,1536),r.fillStyle="#565656",r.fillRect(0,0,1536,1536);for(let f=0;f<c.length;f++){let S=c[f],T=(((S.orig/3*1536+S.bandSpread)%1536+1536)%1536*(1-g)+S.u*g)%1536,R=f%3===0?h[S.orig]:l[S.orig],v=.7+S.jitter*.28;d(n,T,S.v,S.len,S.wid,S.ang,R,v),f%2===0&&d(r,T,S.v,S.len,S.wid,S.ang,f%4===0?"#dedede":"#969696",1)}n.globalAlpha=1,a.needsUpdate=!0,o.needsUpdate=!0}return p(.12),{tex:a,bumpTex:o,update:p}}function Mx(i=8){let e=document.createElement("canvas");e.width=512,e.height=512;let n=e.getContext("2d");n.fillStyle="#b4b4b4",n.fillRect(0,0,512,512);for(let r=0;r<512;r++){let a=Math.round(172+(Fe(r*97+13)-.5)*18);n.fillStyle=`rgb(${a},${a},${a})`,n.fillRect(0,r,512,1)}for(let r=0;r<650;r++){let a=Fe(r*5+1)*512,o=Fe(r*5+2)*512,c=18+Fe(r*5+3)*70,l=Math.round(162+Fe(r*5+4)*32);n.fillStyle=`rgba(${l},${l},${l},0.35)`,n.fillRect(a,o,c,1)}let s=new qn(e);return s.wrapS=s.wrapT=Wn,s.repeat.set(3,3),s.anisotropy=i,s}function Ex(i=8){let e=document.createElement("canvas");e.width=512,e.height=512;let n=e.getContext("2d"),s=document.createElement("canvas");s.width=512,s.height=512;let r=s.getContext("2d");n.fillStyle="#8a6635",n.fillRect(0,0,512,512),r.fillStyle="#666666",r.fillRect(0,0,512,512);let a=16;for(let l=0;l<512;l+=a)for(let h=0;h<512;h+=a){let u=(h/a+l/a)%2===0;n.fillStyle=u?"#a98249":"#78582b",n.fillRect(h+1,l+1,a-2,a-2),r.fillStyle=u?"#dcdcdc":"#8e8e8e",r.fillRect(h+1,l+1,a-2,a-2)}let o=new qn(e);o.colorSpace=Le,o.wrapS=o.wrapT=Wn,o.repeat.set(6,2),o.anisotropy=i;let c=new qn(s);return c.wrapS=c.wrapT=Wn,c.repeat.set(6,2),c.anisotropy=i,{map:o,bumpMap:c}}function ju(i,t="#d99b38"){let e=document.createElement("canvas");e.width=1024,e.height=256;let n=e.getContext("2d");n.fillStyle="rgba(15,17,21,0.94)",n.beginPath(),n.roundRect(16,32,992,192,34),n.fill(),n.strokeStyle=t,n.lineWidth=9,n.stroke(),n.fillStyle="#f4efe6",n.font="700 84px ui-monospace, SFMono-Regular, Menlo, monospace",n.textAlign="center",n.textBaseline="middle",n.fillText(i,512,130);let s=new qn(e);s.colorSpace=Le,s.generateMipmaps=!0,s.minFilter=Hi,s.anisotropy=8;let r=new vr({map:s,transparent:!0,depthTest:!1}),a=new Ga(r);return a.scale.set(.95,.24,1),a}function Qu(i,{onPartSelect:t,onPartAction:e,onPartHover:n,onMetrics:s}={}){let r=new Fs;r.background=new Jt(987413),r.fog=new za(987413,.036);let a=new yr({antialias:!0,powerPreference:"high-performance"});a.setPixelRatio(Math.min(window.devicePixelRatio||1,2.5)),a.shadowMap.enabled=!0,a.shadowMap.type=Zc,a.toneMapping=Kc,a.toneMappingExposure=1.18,i.appendChild(a.domElement);let o=Math.min(8,a.capabilities.getMaxAnisotropy()||4),c=new Os(a),l=c.fromScene(new oo,.04).texture;r.environment=l;let h=new tn(42,1,.1,45);h.position.set(-3.95,2.52,4.45);let u=new ao(h,a.domElement);u.enableDamping=!0,u.dampingFactor=.07,u.target.set(-.22,1.42,.12),u.minDistance=1.3,u.maxDistance=10.5,u.maxPolarAngle=Math.PI*.495;let d={active:!1,goalPos:new D,goalTarget:new D};u.addEventListener("start",()=>{d.active=!1});let p=new ja(16314853,2501430,.65);r.add(p);let g=new Ar(16774628,1.85);g.position.set(-4.2,6.2,4.8),g.castShadow=!0,g.shadow.mapSize.set(2048,2048),g.shadow.camera.near=1,g.shadow.camera.far=16;let _=2.75;g.shadow.camera.left=-_,g.shadow.camera.right=_,g.shadow.camera.top=_,g.shadow.camera.bottom=-_,g.shadow.bias=-4e-4,g.shadow.normalBias=.035,r.add(g);let m=new Ar(15117388,.75);m.position.set(4.5,3.2,-3.5),r.add(m);let f=yx();f.anisotropy=o;let S=new be({map:f,roughness:.88,metalness:.05}),x=new at(new xr(18,18),S);x.rotation.x=-Math.PI/2,x.receiveShadow=!0,r.add(x);let T=Mx(o),R=Ex(o),v={steelFrame:new be({color:3884116,roughness:.48,metalness:.72}),darkIron:new be({color:2370100,roughness:.56,metalness:.78}),steamer:new be({color:12239565,roughness:.34,metalness:.86,roughnessMap:T,bumpMap:T,bumpScale:.0014,side:cn}),steamerCutaway:new Ja({color:12766166,roughness:.22,metalness:.18,transparent:!0,opacity:.08,depthWrite:!1,side:cn}),flight:new be({color:14261048,roughness:.36,metalness:.72,side:cn}),tire:new be({color:8884640,roughness:.28,metalness:.9}),poly:new be({color:13073700,roughness:.48,metalness:.12}),brass:new be({color:14656062,roughness:.3,metalness:.86}),epdm:new be({color:1842722,roughness:.85,metalness:.05}),clampRed:new be({color:13582640,roughness:.38,metalness:.32}),motor:new be({color:4412264,roughness:.44,metalness:.68}),humanBody:new be({color:4279132,roughness:.72,metalness:.08}),humanSkin:new be({color:13607547,roughness:.68,metalness:.02}),humanApron:new be({color:9726519,roughness:.78,metalness:.04}),bamboo:new be({map:R.map,bumpMap:R.bumpMap,bumpScale:.012,roughness:.86,metalness:.02,side:cn})},A={},G={},M=(q,z)=>(A[z]||(A[z]=[]),G[z]||(G[z]=[]),A[z].push(q),q.traverse(xt=>{if(xt.userData.partId=z,xt.isMesh){if(xt.castShadow=!0,xt.receiveShadow=!0,!xt.userData.ownMat){let pt=xt.material.clone();pt.userData.baseEmissive=pt.emissive?pt.emissive.clone():new Jt(0),pt.userData.baseOpacity=pt.opacity??1,pt.userData.baseTransparent=!!pt.transparent,xt.material=pt,xt.userData.ownMat=!0}G[z].push(xt.material)}}),q),w=1.54,O=new qt;for(let q of[-1.05,1.05]){let z=new at(new ee(2.38,.09,.11),v.steelFrame);z.position.set(0,.085,q),O.add(z)}for(let q of[-1.18,1.18]){let z=new at(new ee(.11,.09,2.24),v.steelFrame);z.position.set(q,.085,0),O.add(z);for(let xt of[-1.05,1.05]){let pt=new at(new le(.085,.095,.04,20),v.epdm);pt.position.set(q,.02,xt),O.add(pt)}}r.add(M(O,"01"));let X=new qt;for(let q of[-1,1]){let z=q*1.18;for(let oe of[-1,1]){let ue=new D(z,.12,oe*.85),Bt=new D(z,w-.04,oe*.06).clone().sub(ue),Pe=new at(new ee(.085,Bt.length(),.085),v.steelFrame);Pe.position.copy(ue).addScaledVector(Bt,.5),Pe.quaternion.setFromUnitVectors(new D(0,1,0),Bt.clone().normalize()),X.add(Pe)}let xt=new at(new ee(.06,.06,1.05),v.steelFrame);xt.position.set(z,.72,0),X.add(xt);let pt=new at(new ee(.14,.14,.24),v.darkIron);pt.position.set(z,w,0),X.add(pt);let Ft=new at(new le(.042,.042,.22,20),v.tire);Ft.rotation.z=Math.PI/2,Ft.position.set(z-q*.06,w,0),X.add(Ft)}r.add(M(X,"02"));let P=new qt;P.position.set(0,w,0),r.add(P);let C=new qt;for(let q of[-1,1]){let z=new at(new ee(.09,.12,1.88),v.steelFrame);z.position.set(q*1.04,-.32,.05),C.add(z);let xt=new at(new ee(.09,.38,.14),v.steelFrame);xt.position.set(q*1.04,-.13,0),C.add(xt);let pt=new at(new ee(.12,.1,.14),v.steelFrame);pt.position.set(q*1.07,0,0),C.add(pt)}for(let q of[-.52,.42]){let z=new at(new ee(2.08,.1,.11),v.steelFrame);z.position.set(0,-.96,q),C.add(z);for(let xt of[-1,1]){let pt=new at(new ee(.08,.66,.09),v.steelFrame);pt.position.set(xt*1.04,-.64,q),C.add(pt)}}let N=new at(new ee(2.08,.1,.1),v.steelFrame);N.position.set(0,0,-.94),C.add(N);for(let q of[-1,1]){let z=new at(new ee(.08,.38,.96),v.steelFrame);z.position.set(q*1.04,-.16,-.46),C.add(z)}let F=new at(new Yn(.32,.025,10,28,Math.PI*.75),v.brass);F.rotation.y=Math.PI/2,F.rotation.z=-Math.PI*.35,F.position.set(1.13,0,0),C.add(F);let Y=new qt;Y.position.set(1.3,w-.32,.14);let j=new at(new Yn(.2,.02,12,32),v.brass);j.rotation.y=Math.PI/2,Y.add(j);let Z=new at(new le(.018,.018,.09,12),v.clampRed);Z.rotation.z=Math.PI/2,Z.position.set(.05,.2,0),Y.add(Z);for(let q=0;q<3;q++){let z=new at(new le(.012,.012,.4,8),v.steelFrame);z.rotation.x=q*Math.PI/3,Y.add(z)}r.add(M(Y,"03")),P.add(M(C,"03"));let Q=.08,J=ce.drumRadiusM,st=ce.drumLengthM,K=new qt,ot=[[-.58,-.78,-.52+Q],[.58,-.78,-.52+Q],[-.58,-.78,.42+Q],[.58,-.78,.42+Q]],Mt=[];for(let[q,z,xt]of ot){let pt=new at(new ee(.18,.18,.16),v.darkIron);pt.position.set(q,z-.12,xt),K.add(pt);let Ft=new at(new le(.085,.085,.11,24),v.poly);Ft.rotation.x=Math.PI/2,Ft.position.set(q,z,xt),K.add(Ft),Mt.push(Ft)}let Ct=new at(new le(.13,.15,.12,24),v.tire);Ct.rotation.x=Math.PI/2,Ct.position.set(0,0,-st/2+Q-.06),K.add(Ct),P.add(M(K,"04"));let St=new qt;St.position.set(0,0,Q),P.add(St);let Nt=new zs(15922943,1.85,3.8,1.3);Nt.position.set(-.25,.48,.25+Q),P.add(Nt);let Ot=new qt,Pt=new at(new le(J,J,st,96,1,!0),v.steamer);Pt.rotation.x=Math.PI/2,Ot.add(Pt);let Gt=new qt;Gt.position.set(0,0,Q);let L=new at(new le(J,J,st,80,1,!0,Math.PI*1.92,Math.PI*.8),v.steamer);L.rotation.x=Math.PI/2,L.visible=!1,Gt.add(L);let gt=new at(new le(J,J,st,48,1,!0,Math.PI*.72,Math.PI*1.2),v.steamerCutaway);gt.rotation.x=Math.PI/2,gt.visible=!1,Gt.add(gt),P.add(M(Gt,"05"));let et=new at(new le(J,J,.02,96),v.steamer);et.rotation.x=Math.PI/2,et.position.z=-st/2,Ot.add(et);let ut=new at(new Yn(J+.015,.032,18,96),v.tire);ut.position.z=st/2,Ot.add(ut);for(let q of[-.52,.42]){let z=new at(new le(J+.028,J+.028,.09,96,1,!0),v.tire);z.rotation.x=Math.PI/2,z.position.z=q,Ot.add(z);let xt=new at(new Yn(J+.014,.016,12,96),v.tire);xt.position.z=q-.045,Ot.add(xt);let pt=xt.clone();pt.position.z=q+.045,Ot.add(pt)}for(let q of[-.15,.16,.72]){let z=new at(new Yn(J+.01,.012,12,96),v.tire);z.position.z=q,Ot.add(z)}for(let q=0;q<16;q++){let z=q/16*Math.PI*2,xt=new at(new le(.012,.012,.035,6),v.brass);xt.rotation.x=Math.PI/2,xt.position.set(Math.cos(z)*(J+.015),Math.sin(z)*(J+.015),st/2+.02),Ot.add(xt)}St.add(M(Ot,"05"));let tt=new qt;for(let q=0;q<4;q++){let z=q*Math.PI/2,xt=22,pt=(q%2===0?1:-1)*.45,Ft=new ln,oe=[],ue=[];for(let Pe=0;Pe<=xt;Pe++){let Be=Pe/xt,Kt=-st*.45+Be*st*.88,Je=z+Be*pt,fn=Math.cos(Je)*(J-.01),Zn=Math.sin(Je)*(J-.01),Kn=Je+.16,Jn=Math.cos(Kn)*(J-.16),Ne=Math.sin(Kn)*(J-.16);oe.push(fn,Zn,Kt,Jn,Ne,Kt)}for(let Pe=0;Pe<xt;Pe++){let Be=Pe*2,Kt=Be+1,Je=Be+2,fn=Be+3;ue.push(Be,Kt,Je,Kt,fn,Je)}Ft.setAttribute("position",new Ee(oe,3)),Ft.setIndex(ue),Ft.computeVertexNormals(),tt.add(new at(Ft,v.flight));let pe=z+Math.PI/4,Bt=new at(new ee(.11,.015,.34),v.flight);Bt.position.set(Math.cos(pe)*(J-.06),Math.sin(pe)*(J-.06),q%2===0?-.25:.25),Bt.rotation.z=pe,Bt.rotation.y=q%2===0?.35:-.35,tt.add(Bt)}St.add(M(tt,"06"));let Lt=new qt,wt=.925,E=co(144,wt,.055,v.brass,J+.005);E.position.z=-.15,Lt.add(E),St.add(M(Lt,"09"));let y=new D(-.856,-.521,-.15+Q),B=new qt;B.position.copy(y),B.add(co(12,wt/12,.065,v.brass,.022));let lt=new at(new le(.024,.024,.38,16),v.tire);lt.rotation.x=Math.PI/2,lt.position.z=-.05,B.add(lt),P.add(M(B,"09"));let rt=new qt;rt.position.set(1.04,0,st/2+Q+.03),P.add(rt);let nt=new qt,It=new at(new ee(.92,.055,.055),v.steelFrame);It.position.set(-.46,.36,.09),nt.add(It);let Et=new at(new ee(.06,.4,.055),v.steelFrame);Et.position.set(0,.18,.09),nt.add(Et);let Rt=new at(new ee(.055,.14,.055),v.steelFrame);Rt.position.set(-.9,.3,.08),nt.add(Rt);let kt=new at(new le(.04,.04,.48,16),v.tire);kt.position.set(0,.05,-.1),nt.add(kt);let Wt=new at(new le(.016,.022,.52,12),v.brass);Wt.rotation.z=1.05,Wt.position.set(-.24,-.15,.04),nt.add(Wt);let it=new qt;it.position.set(-1.04,0,0);let te=new at(new le(J+.025,J+.025,.05,64,1,!0),v.epdm);te.rotation.x=Math.PI/2,te.position.z=-.02,it.add(te);let I=new Wi;I.absarc(0,0,J+.022,0,Math.PI*2,!1);let ct=new Vi;ct.absarc(0,0,.145,0,Math.PI*2,!0),I.holes.push(ct);let yt=new at(new Bs(I,{depth:.022,bevelEnabled:!0,bevelThickness:.004,bevelSize:.004,curveSegments:48}),v.steamer);yt.position.z=0,it.add(yt);let ft=new at(new le(.18,J*.9,.055,56,1,!0),v.steamer);ft.rotation.x=Math.PI/2,ft.position.z=.048,it.add(ft);for(let q=0;q<8;q++){let z=q/8*Math.PI*2,xt=new at(new ee(.028,J*.68,.025),v.tire);xt.position.set(Math.cos(z)*.54,Math.sin(z)*.54,.045),xt.rotation.z=z+Math.PI/2,it.add(xt)}let Dt=[];for(let q=0;q<8;q++){let z=q/8*Math.PI*2,xt=new qt;xt.position.set(Math.cos(z)*(J+.032),Math.sin(z)*(J+.032),-.01),xt.rotation.z=z;let pt=new at(new ee(.04,.05,.045),v.darkIron);xt.add(pt);let Ft=new qt;Ft.position.set(.015,0,.02);let oe=new at(new ee(.035,.026,.085),v.clampRed);oe.position.set(.015,0,-.025),Ft.add(oe),xt.add(Ft),Dt.push(Ft),it.add(xt)}nt.add(it),rt.add(M(nt,"07"));let jt=new qt;jt.position.set(.16,0,.065),it.add(jt);let ie=new qt,Xt=new qt;Xt.position.set(-.16,0,0);let vt=new at(new Yn(.155,.016,10,32),v.epdm);Xt.add(vt);let U=new at(new le(.165,.165,.032,32),v.brass);U.rotation.x=Math.PI/2,U.position.z=.016,Xt.add(U);let _t=new at(new ee(.24,.032,.035),v.clampRed);_t.position.z=.042,Xt.add(_t),ie.add(Xt),jt.add(M(ie,"08"));let mt=new qt;mt.position.set(-1.12,-.52,-.08+Q),mt.add(new at(new ee(.24,.34,.44),v.darkIron));let zt=new at(new le(.014,.014,.24,12),v.tire);zt.position.set(0,.24,.08),mt.add(zt);let Ut=new at(new qi(.035,16,12),v.clampRed);Ut.position.set(0,.35,.08),mt.add(Ut);let re=co(28,.14,.03,v.tire,.02);re.rotation.y=Math.PI/2,re.position.set(-.13,0,-.06),mt.add(re),P.add(M(mt,"10"));let ae=new qt;ae.position.set(-1.12,-.52,-.45+Q);let Re=new qt,Ve=new at(new le(.14,.14,.32,24),v.motor);Ve.rotation.x=Math.PI/2,Re.add(Ve);for(let q=0;q<10;q++){let z=new at(new ee(.31,.012,.24),v.motor);z.rotation.z=q/10*Math.PI,Re.add(z)}ae.add(Re);let he=new qt;he.add(new at(new ee(.26,.24,.26),v.darkIron));let We=new at(new ee(.24,.11,.22),v.clampRed);We.position.set(0,.16,0),he.add(We);let hn=new at(new le(.11,.11,.07,18),v.clampRed);hn.rotation.z=Math.PI/2,hn.position.set(-.15,-.02,0),he.add(hn),he.visible=!1,ae.add(he);let Sn=new qt;Sn.position.set(-1.28,-.52,.06+Q);let Lr=new at(new le(.036,.036,.08,16),v.tire);Lr.rotation.z=Math.PI/2,Sn.add(Lr);let hi=new at(new ee(.025,.38,.045),v.brass);hi.position.set(-.04,ce.crankRadiusM/2,0),Sn.add(hi);let wi=new at(new le(.022,.022,.16,16),v.humanApron);wi.rotation.z=Math.PI/2,wi.position.set(-.12,ce.crankRadiusM,0),Sn.add(wi);let On=new qt,Vs=hi.clone();Vs.position.y=-ce.crankRadiusM/2,On.add(Vs);let Ws=wi.clone();Ws.position.y=-ce.crankRadiusM,On.add(Ws),On.visible=!1,Sn.add(On);let Fn=new qt;Fn.position.set(-1.62,0,.14);let Xs=new at(new le(.025,.03,.84,12),v.steelFrame);Xs.position.set(-.26,.42,0),Xs.rotation.z=-.18,Fn.add(Xs);let Dr=new at(new ee(.28,.06,.24),v.epdm);Dr.position.set(-.34,.84,0),Fn.add(Dr);let b=new qt;b.position.set(.18,.56,0);let k=co(20,.1,.02,v.brass,.02);k.rotation.y=Math.PI/2,b.add(k);for(let q of[-1,1]){let z=new at(new ee(.02,.175,.028),v.tire);z.position.set(q*.09,q*.0875,0),b.add(z);let xt=new at(new ee(.09,.02,.08),v.epdm);xt.position.set(q*.14,q*.175,0),b.add(xt)}Fn.add(b);let W=new at(new ee(.04,.52,.04),v.steelFrame);W.position.set(.26,.78,0),W.rotation.z=-.25,Fn.add(W),Fn.visible=!1,P.add(M(ae,"11")),P.add(M(Sn,"11")),r.add(M(Fn,"11"));let H=new qt;H.position.set(-1.7,0,.14);let V=(q,z,xt,pt,Ft,oe=-pt/2)=>{let ue=new at(new le(z,xt,pt,14),Ft);return ue.position.y=oe,q.add(ue),ue},Tt=[];for(let q of[-.11,.11]){let z=new qt;z.position.set(0,.88,q),H.add(z);let xt=V(z,.068,.056,.42,v.humanBody),pt=new qt;pt.position.set(0,-.42,0),z.add(pt),V(pt,.054,.046,.42,v.humanBody);let Ft=new at(new ee(.24,.08,.1),v.epdm);Ft.position.set(.04,-.44,0),pt.add(Ft),Tt.push({hipPivot:z,kneePivot:pt,thigh:xt})}let At=new qt;At.position.set(0,.9,0),H.add(At);let Ht=new at(new le(.16,.135,.5,14),v.humanBody);Ht.scale.set(.75,1,1.22),Ht.position.set(0,.25,0),At.add(Ht);let Vt=new at(new qi(.165,14,12),v.humanBody);Vt.scale.set(.72,.42,1.45),Vt.position.set(0,.46,0),At.add(Vt);let Qt=new at(new le(.165,.145,.4,14,1,!1,-Math.PI*.45,Math.PI*.9),v.humanApron);Qt.scale.set(.78,1,1.18),Qt.rotation.y=Math.PI/2,Qt.position.set(.015,.19,0),At.add(Qt);let Yt=new at(new le(.045,.05,.07,12),v.humanSkin);Yt.position.set(0,.555,0),At.add(Yt);let $t=new at(new qi(.105,18,16),v.humanSkin);$t.scale.set(.95,1.12,.9),$t.position.set(0,.692,0),At.add($t);let Se=new at(new qi(.108,16,12,0,Math.PI*2,0,Math.PI*.52),v.epdm);Se.position.set(-.005,.7,0),At.add(Se);let ye=new qt;ye.position.set(0,.48,.23),At.add(ye),V(ye,.048,.042,.28,v.humanBody);let xe=new qt;xe.position.set(0,-.28,0),ye.add(xe),V(xe,.04,.032,.26,v.humanSkin);let Xe=new qt;Xe.position.set(0,.48,-.23),At.add(Xe),V(Xe,.048,.042,.28,v.humanBody);let de=new qt;de.position.set(0,-.28,0),Xe.add(de),V(de,.04,.032,.26,v.humanSkin),r.add(M(H,"human"));let Zt=new qt,Qi=new at(new le(.012,.012,1.71,10),new ci({color:4376714}));Qi.position.set(-2.02,.855,.14),Zt.add(Qi);let ve=new at(new ee(.38,.012,.012),new ci({color:4376714}));ve.position.set(-1.84,1.71,.14),Zt.add(ve);let Bn=ju("ALDI: 171 cm","#42c88a");Bn.position.set(-1.42,1.94,.14),Zt.add(Bn);let qs=ju("STEAMER: 179\xD7179 cm","#d99b38");qs.position.set(.35,2.38,.08),Zt.add(qs),r.add(Zt);let _n=new qt;_n.position.set(0,0,1.38);let ts=new at(new le(.42,.3,.42,24,1,!0),v.bamboo);ts.position.y=.21,_n.add(ts);let De=new at(new Za(.3,24),v.bamboo);De.rotation.x=-Math.PI/2,De.position.y=.01,_n.add(De);let wn=new at(new Yn(.42,.018,8,28),v.bamboo);wn.rotation.x=Math.PI/2,wn.position.y=.42,_n.add(wn);let kn=vx(o),un=new be({map:kn.tex,bumpMap:kn.bumpTex,bumpScale:.018,roughness:.94,metalness:.01}),xn=new at(new Ka(.37,.32,32),un);xn.position.y=.15,xn.scale.set(1,.02,1),xn.visible=!1,_n.add(xn),r.add(_n);let es=new qt;es.position.set(0,0,Q),P.add(es);function Ys(q){let z=J-.055,xt=Math.max(.45,Math.min(Math.PI*.48,.52+q*1.75)),pt=-Math.PI/2-xt,Ft=-Math.PI/2+xt,oe=new Wi,ue=36;for(let Kt=0;Kt<=ue;Kt++){let Je=pt+Kt/ue*(Ft-pt),fn=Math.cos(Je)*z,Zn=Math.sin(Je)*z;Kt===0?oe.moveTo(fn,Zn):oe.lineTo(fn,Zn)}oe.closePath();let pe=new Bs(oe,{depth:st*.88,bevelEnabled:!1,curveSegments:1});pe.translate(0,0,-st*.44),pe.computeVertexNormals();let Bt=pe.attributes.position,Pe=pe.attributes.normal,Be=new Float32Array(Bt.count*2);for(let Kt=0;Kt<Bt.count;Kt++)Math.abs(Pe.getZ(Kt))>.6?(Be[Kt*2]=(Bt.getX(Kt)+z)/(2*z),Be[Kt*2+1]=(Bt.getY(Kt)+z)/(2*z)):(Be[Kt*2]=(Bt.getZ(Kt)+st*.44)/(st*.88),Be[Kt*2+1]=(Bt.getX(Kt)+z)/(2*z));return pe.setAttribute("uv",new nn(Be,2)),pe}let hl=-1,ad=new be({map:kn.tex,bumpMap:kn.bumpTex,bumpScale:.022,roughness:.94,metalness:.01,side:cn}),Ti=new at(Ys(.22),ad);Ti.receiveShadow=!0,es.add(Ti);let dn=2200,od=new ee(.048,.004,.009),cd=new be({roughness:.92,metalness:.01}),ui=new Wa(od,cd,dn);ui.receiveShadow=!0,es.add(ui);let Ue=new Float32Array(dn*3),Ke=new Float32Array(dn*3),ul=new Uint8Array(dn),Ur=new Float32Array(dn*2),dl=new Float32Array(dn),Nr=new Uint8Array(dn),$n=new $e;function fl(q=150){let xt=.75+Math.min(.65,Math.max(.08,q/720))*1.35;for(let pt=0;pt<dn;pt++){let Ft=pt<dn/3?0:pt<dn*2/3?1:2;ul[pt]=Ft,ui.setColorAt(pt,xx[Ft]);let oe=-Math.PI/2+(Fe(pt*9+1)-.5)*xt,ue=.62+.34*Fe(pt*9+2),pe=J*ue,Bt=Ft===0?-st*.35+Fe(pt*9+3)*(st*.25):Ft===1?-st*.08+Fe(pt*9+3)*(st*.24):st*.16+Fe(pt*9+3)*(st*.26);Ue[pt*3]=Math.cos(oe)*pe,Ue[pt*3+1]=Math.sin(oe)*pe,Ue[pt*3+2]=Bt,Ke[pt*3]=Ke[pt*3+1]=Ke[pt*3+2]=0,Ur[pt*2]=Fe(pt*9+4)*Math.PI*2,Ur[pt*2+1]=Fe(pt*9+5)*Math.PI*2,dl[pt]=.7+Fe(pt*9+6)*.6,Nr[pt]=0}ui.instanceColor&&(ui.instanceColor.needsUpdate=!0),dt.pouredCount=0,dt.mixPct=14,kn.update(.12),xn.visible=!1}function pl(){let q=new Int16Array(72),z=dt.activeCount;for(let Ft=0;Ft<z;Ft++){if(Nr[Ft]!==0)continue;let oe=Ue[Ft*3],ue=Ue[Ft*3+1],pe=Ue[Ft*3+2],Bt=oe<-.25?0:oe>.25?2:1,Pe=ue<-.42?0:1,Be=Math.max(0,Math.min(3,Math.floor((pe+st/2)/st*4)));q[(Be*6+Pe*3+Bt)*3+ul[Ft]]++}let xt=0,pt=0;for(let Ft=0;Ft<24;Ft++){let oe=q[Ft*3],ue=q[Ft*3+1],pe=q[Ft*3+2],Bt=oe+ue+pe;if(Bt<8)continue;pt++;let Pe=Math.abs(oe/Bt-1/3)+Math.abs(ue/Bt-1/3)+Math.abs(pe/Bt-1/3);xt+=Math.max(0,1-Pe/1.15)}return pt===0?0:Math.min(99,Math.round(xt/pt*100))}let dt={driveId:"engine-electric",gearId:"12:1",drumRpm:10.6,gearRatio:12,tiltDeg:25,batchKg:150,activeCount:Math.round(dn*(150/380)),explode:0,cutaway:!0,lidOpen:!1,sampleCapOpen:!1,showRuler:!0,running:!0,drumAngle:0,crankAngle:0,lidAngle:0,clampOpenFrac:0,capOpenFrac:0,mixPct:14,pouredCount:0,frameCounter:0,stalled:!1,hoveredPart:null,selectedPart:null,pressPulse:0,anatomyIsolate:!1};fl(dt.batchKg);function ho(q){dt.cutaway=q,Pt.visible=!q,L.visible=q,gt.visible=q,Nt.intensity=q?1.85:.7}ho(!0);function ld(q){dt.explode=Math.max(0,Math.min(1,q));let z=dt.explode;O.position.y=-z*.16,X.position.y=-z*.05,K.position.y=-z*.25,tt.position.z=z*.92,rt.position.z=st/2+Q+.03+z*1.15,Lt.position.z=-z*.42,B.position.x=-.856-z*.35,mt.position.x=-1.12-z*.52,ae.position.x=-1.12-z*.72,Sn.position.x=-1.28-z*.78,jt.position.z=.065+z*.45}function $s(){let q=dt.selectedPart,z=dt.hoveredPart,xt=dt.anatomyIsolate&&!!q,pt=dt.pressPulse;for(let[Ft,oe]of Object.entries(G)){let ue=q===Ft,pe=z===Ft;for(let Bt of oe)ue?(Bt.emissive?.setHex(pt>.1?14261048:9394962),Bt.emissiveIntensity=1+pt*.85,Bt.opacity=Bt.userData.baseOpacity,Bt.transparent=Bt.userData.baseTransparent):pe?(Bt.emissive?.setHex(7227152),Bt.emissiveIntensity=1.15,Bt.opacity=Bt.userData.baseOpacity,Bt.transparent=Bt.userData.baseTransparent):xt?(Bt.emissive?.setHex(0),Bt.emissiveIntensity=1,Bt.transparent=!0,Bt.opacity=Math.min(Bt.userData.baseOpacity,.22)):(Bt.emissive?.setHex(0),Bt.emissiveIntensity=1,Bt.opacity=Bt.userData.baseOpacity,Bt.transparent=Bt.userData.baseTransparent),Bt.needsUpdate=!0}}function ml(q,{glideCamera:z=!0,isolate:xt=!0}={}){dt.selectedPart=q,dt.pressPulse=1,dt.anatomyIsolate=xt,$s();let pt=Cr[q];if(z&&pt?.cam){P.rotation.x=-(dt.tiltDeg*Math.PI)/180,!dt.lidOpen&&dt.lidAngle>.05&&(dt.lidAngle=0,dt.clampOpenFrac=0,rt.rotation.y=0);let Ft=A[q]||[];if(Ft.length){r.updateMatrixWorld(!0);let oe=new Dn;for(let Bt of Ft)oe.expandByObject(Bt);let ue=new D;oe.getCenter(ue);let pe=new D(...pt.cam.pos).sub(new D(...pt.cam.target));d.goalTarget.copy(ue),d.goalPos.copy(ue).add(pe)}else d.goalPos.set(...pt.cam.pos),d.goalTarget.set(...pt.cam.target);d.active=!0}t&&t(q,pt)}function hd(){dt.selectedPart=null,dt.anatomyIsolate=!1,$s()}function ud(q){Object.assign(dt,q),dt.activeCount=Math.max(260,Math.min(dn,Math.round(dn*(dt.batchKg/360)))),q.cutaway!==void 0&&ho(q.cutaway),q.explode!==void 0&&ld(q.explode),q.showRuler!==void 0&&(Zt.visible=!!q.showRuler);let z=dt.driveId==="engine-petrol",xt=dt.driveId.startsWith("human"),pt=dt.driveId==="human-pedal";Re.visible=!z,he.visible=z,On.visible=dt.driveId==="human-2",Fn.visible=pt;let Ft=xt?dt.gearId==="72:1"?-.38:-.18:.34;zt.rotation.z=Ft,Ut.position.x=-Math.sin(Ft)*.24}function dd(q){let z={overview:{pos:[-3.95,2.52,4.45],target:[-.22,1.42,.12]},cutaway:{pos:[-2.85,2.58,-.25],target:[0,1.32,.1]},gearbox:{pos:[-2.45,1.32,1.95],target:[-1.05,1.05,-.05]},lid:{pos:[1.75,2.15,3.35],target:[.1,1.65,1.05]},unload:{pos:[-2.25,1.35,3.05],target:[0,.65,1.18]}},xt=z[q]||z.overview;d.goalPos.set(...xt.pos),d.goalTarget.set(...xt.target),d.active=!0,q==="cutaway"&&!dt.cutaway&&ho(!0)}let gl=new to,uo=new ht,Zs=null;function fd(q){for(let z=q;z;z=z.parent)if(!z.visible)return!1;return!0}function _l(q){let z=a.domElement.getBoundingClientRect(),xt=q.clientX-z.left,pt=q.clientY-z.top;uo.x=xt/z.width*2-1,uo.y=-(pt/z.height)*2+1,gl.setFromCamera(uo,h);let oe=gl.intersectObjects(r.children,!0).find(ue=>ue.object?.userData?.partId&&fd(ue.object));return{id:oe?oe.object.userData.partId:null,x:xt,y:pt}}a.domElement.addEventListener("pointermove",q=>{let{id:z,x:xt,y:pt}=_l(q);a.domElement.style.cursor=z?"pointer":"grab",z!==dt.hoveredPart&&(dt.hoveredPart=z,$s()),n&&n(z?{id:z,info:Cr[z],x:xt,y:pt}:null)}),a.domElement.addEventListener("pointerleave",()=>{dt.hoveredPart!==null&&(dt.hoveredPart=null,$s()),n&&n(null)}),a.domElement.addEventListener("pointerdown",q=>{Zs=[q.clientX,q.clientY]}),a.domElement.addEventListener("pointerup",q=>{if(!Zs)return;let z=Math.hypot(q.clientX-Zs[0],q.clientY-Zs[1]);if(Zs=null,z>6)return;let{id:xt}=_l(q);xt&&(ml(xt,{glideCamera:!1,isolate:dt.anatomyIsolate}),e&&e(xt))});function pd(q,z,xt){let pt=Math.sin(xt),oe=-9.81*Math.cos(xt),ue=-9.81*pt,pe=J-.05,Bt=.08+Math.min(.55,dt.batchKg/720),Pe=-pe+Bt*1.8*pe,Be=dt.lidOpen&&dt.tiltDeg<-4,Kt=Math.min(1,dt.pouredCount/Math.max(1,dt.activeCount*.72)),Je=Math.max(.03,Math.min(.55,dt.batchKg/720*(1-Kt*.92))),fn=Math.round(Je*40);fn!==hl&&(hl=fn,Ti.geometry.dispose(),Ti.geometry=Ys(Je)),Ti.visible=Kt<.94;let Zn=Math.sign(z||1)*Math.min(.45,Math.abs(z)*.36);Ti.rotation.z+=(Zn-Ti.rotation.z)*Math.min(1,q*4),kn.update(Math.min(1,(dt.mixPct-10)/86));let Kn=0,Jn=dt.activeCount;for(let Ne=0;Ne<dn;Ne++){if(Ne>=Jn){$n.position.set(0,-100,0),$n.scale.set(0,0,0),$n.updateMatrix(),ui.setMatrixAt(Ne,$n.matrix);continue}let me=Ne*3;if(Nr[Ne]===1)Kn++,Ke[me+1]+=oe*q,Ke[me+2]+=ue*q+.95*q,Ue[me]+=Ke[me]*q,Ue[me+1]+=Ke[me+1]*q,Ue[me+2]+=Ke[me+2]*q,Ue[me+1]<-1.08&&(Ue[me+1]=-1.08+Ne%9*.02,Ke[me]*=.18,Ke[me+1]=0,Ke[me+2]*=.18);else{let Ai=Ue[me],jn=Ue[me+1],ns=Ue[me+2],Ri=Ke[me],Ci=Ke[me+1],zn=Ke[me+2],El=Math.hypot(Ai,jn),mo=Math.atan2(jn,Ai),md=El>pe-.22,gd=jn<.55&&Ai*z>-.25;if(md&&gd&&Math.abs(z)>.005){let Or=-Math.sin(mo),_d=Math.cos(mo),Sl=z*El;Ri+=(Or*Sl-Ri)*Math.min(1,q*11),Ci+=(_d*Sl-Ci)*Math.min(1,q*11);let xd=Math.floor((mo+Math.PI*2)%(Math.PI*2)/(Math.PI/2))%2;zn+=(xd===0?1:-1)*Math.abs(z)*.5*q}else Ri+=(Math.sin(Ne*1.7+dt.drumAngle)*.4-Ri*1.4)*q,Ci+=oe*q,zn+=(ue*.65-zn*1.8)*q;Ai+=Ri*q,jn+=Ci*q,ns+=zn*q;let bl=Math.hypot(Ai,jn);if(bl>pe){let Or=pe/bl;Ai*=Or,jn*=Or,Ri*=.4,Ci*=.4}Math.abs(z)<.005&&jn>Pe&&(Ci-=4.5*q),ns<-st/2+.05&&(ns=-st/2+.05,zn=Math.abs(zn)*.3),ns>st/2-.05&&(Be&&jn<.12?(Nr[Ne]=1,zn=.65):(ns=st/2-.05,zn=-Math.abs(zn)*.3)),Ue[me]=Ai,Ue[me+1]=jn,Ue[me+2]=ns,Ke[me]=Ri,Ke[me+1]=Ci,Ke[me+2]=zn}$n.position.set(Ue[me],Ue[me+1],Ue[me+2]),$n.rotation.set(Ur[Ne*2]+dt.drumAngle*.3,Ur[Ne*2+1],0);let po=dl[Ne];$n.scale.set(po,po,po),$n.updateMatrix(),ui.setMatrixAt(Ne,$n.matrix)}if(dt.pouredCount=Kn,ui.instanceMatrix.needsUpdate=!0,Kn>15){xn.visible=!0;let Ne=Math.min(1,Kn/(Jn*.55));xn.scale.set(.65+.35*Ne,.1+.9*Ne,.65+.35*Ne),xn.position.y=.08+.14*Ne}}function xl(){let q=i.clientWidth||640,z=i.clientHeight||440,xt=q/z;h.aspect=xt,h.fov=xt<1?Math.min(62,42/Math.max(.68,xt)):42,h.updateProjectionMatrix(),a.setSize(q,z,!1)}let yl=new ResizeObserver(xl);yl.observe(i),xl();let fo=0,vl=performance.now();function Ml(q){fo=requestAnimationFrame(Ml);let z=Math.min(.05,(q-vl)/1e3);if(vl=q,dt.pressPulse>0&&(dt.pressPulse=Math.max(0,dt.pressPulse-z*3.5),$s()),d.active){let Kt=Math.min(1,z*6.5);h.position.lerp(d.goalPos,Kt),u.target.lerp(d.goalTarget,Kt),h.position.distanceTo(d.goalPos)<.015&&(d.active=!1)}let xt=dt.tiltDeg*Math.PI/180;P.rotation.x+=(-xt-P.rotation.x)*Math.min(1,z*8),Y.rotation.x=P.rotation.x*10;let pt=dt.lidOpen?1:0;dt.clampOpenFrac+=(pt-dt.clampOpenFrac)*Math.min(1,z*8);for(let Kt of Dt)Kt.rotation.y=dt.clampOpenFrac*1.65;let Ft=dt.lidOpen&&dt.clampOpenFrac>.55?1.82:0;dt.lidAngle+=(Ft-dt.lidAngle)*Math.min(1,z*6),rt.rotation.y=dt.lidAngle;let oe=dt.sampleCapOpen?1:0;dt.capOpenFrac+=(oe-dt.capOpenFrac)*Math.min(1,z*8),Xt.rotation.z=dt.capOpenFrac*1.25,jt.rotation.y=Math.max(0,dt.capOpenFrac-.2)*2.1;let ue=dt.lidOpen?Math.min(1.8,dt.drumRpm):dt.drumRpm,Bt=(dt.running&&!dt.stalled?ue:0)*2*Math.PI/60;dt.drumAngle+=Bt*z,dt.crankAngle+=Bt*dt.gearRatio*z,St.rotation.z=dt.drumAngle,B.rotation.z=-dt.drumAngle*12,re.rotation.x=dt.drumAngle*Math.min(24,dt.gearRatio),Sn.rotation.x=dt.crankAngle,b.rotation.x=dt.crankAngle;for(let Kt of Mt)Kt.rotation.y=-dt.drumAngle*(J/.085);let Pe=dt.driveId==="human-pedal",Be=dt.driveId==="human-1"||dt.driveId==="human-2";if(Pe)H.position.x+=(-1.94-H.position.x)*Math.min(1,z*5),H.position.y+=(-.12-H.position.y)*Math.min(1,z*5),At.rotation.z+=(-.28-At.rotation.z)*Math.min(1,z*5),ye.rotation.z=.65,xe.rotation.z=.25,Xe.rotation.z=.65,de.rotation.z=.25,Tt.forEach((Kt,Je)=>{let fn=dt.crankAngle+Je*Math.PI;Kt.hipPivot.rotation.z=1.05+Math.sin(fn)*.28,Kt.kneePivot.rotation.z=-1.25-Math.cos(fn)*.35});else if(Be){H.position.x+=(-1.7-H.position.x)*Math.min(1,z*5),H.position.y+=(0-H.position.y)*Math.min(1,z*5),Tt.forEach(Jn=>{Jn.hipPivot.rotation.z+=(0-Jn.hipPivot.rotation.z)*Math.min(1,z*5),Jn.kneePivot.rotation.z+=(0-Jn.kneePivot.rotation.z)*Math.min(1,z*5)});let Kt=P.rotation.x,Je=w+-.52*Math.cos(Kt)-(.06+Q)*Math.sin(Kt)+Math.cos(dt.crankAngle)*ce.crankRadiusM,fn=-.52*Math.sin(Kt)+(.06+Q)*Math.cos(Kt)+Math.sin(dt.crankAngle)*ce.crankRadiusM;At.rotation.z=-.14-Math.sin(dt.crankAngle)*.06;let Zn=Je-1.32,Kn=fn-.14;ye.rotation.z=1.05+Zn*1.1,ye.rotation.y=-Kn*.7,xe.rotation.z=.45-Math.cos(dt.crankAngle)*.28,Xe.rotation.z=.85+Zn*.6,de.rotation.z=.55}else H.position.x+=(-1.92-H.position.x)*Math.min(1,z*5),H.position.y+=(0-H.position.y)*Math.min(1,z*5),Tt.forEach(Kt=>{Kt.hipPivot.rotation.z+=(0-Kt.hipPivot.rotation.z)*Math.min(1,z*5),Kt.kneePivot.rotation.z+=(0-Kt.kneePivot.rotation.z)*Math.min(1,z*5)}),At.rotation.z+=(0-At.rotation.z)*Math.min(1,z*5),ye.rotation.z+=(.08-ye.rotation.z)*Math.min(1,z*5),ye.rotation.y+=(0-ye.rotation.y)*Math.min(1,z*5),xe.rotation.z+=(.15-xe.rotation.z)*Math.min(1,z*5),Xe.rotation.z+=(.08-Xe.rotation.z)*Math.min(1,z*5),de.rotation.z+=(.15-de.rotation.z)*Math.min(1,z*5);pd(z,Bt,-P.rotation.x),dt.frameCounter++,dt.frameCounter%15===0&&(dt.mixPct=pl(),s&&s({mixPct:dt.mixPct})),u.update(),a.render(r,h)}return fo=requestAnimationFrame(Ml),{applyState:ud,resetTobaccoBatch:q=>{fl(q),dt.mixPct=pl(),s&&s({mixPct:dt.mixPct})},setCameraPreset:dd,focusPart:ml,clearPartFocus:hd,getParts:()=>Cr,destroy:()=>{cancelAnimationFrame(fo),yl.disconnect(),u.dispose(),c.dispose(),l.dispose(),a.dispose(),a.domElement.parentNode===i&&i.removeChild(a.domElement)}}}var Pr=["01","02","03","04","05","06","07","08","09","10","11","human"],$={tab:"sim3d",driveId:"engine-electric",gearId:"12:1",batchKg:150,tiltDeg:25,throttle:.92,explode:0,cutaway:!0,lidOpen:!1,sampleCapOpen:!1,showRuler:!0,running:!0,mixPct:14,activeCam:"overview",tourActive:!1,isolateMode:!0,anatomyTheme:"dark",anatomyExplode:0,anatomyAnimated:!0,selectedPartId:null},ed=document.createElement("style");ed.textContent=Gl;document.head.appendChild(ed);var Ir=document.getElementById("hover-tip"),bx={"08":"Click to twist open/close sample cap","07":"Click to unlatch & swing vault lid","03":"Click to cycle drum tilt (+25\xB0 / +32\xB0 / -12\xB0)"},rl=null,ol=document.createElement("span");ol.className="hover-tip-id";var cl=document.createElement("span");cl.className="hover-tip-name";var ll=document.createElement("span");ll.className="hover-tip-hint";Ir.append(ol,cl,ll);var td=document.querySelectorAll("[data-tab]"),Sx=document.querySelectorAll("[data-panel]");td.forEach(i=>{i.addEventListener("click",()=>{let t=i.dataset.tab;$.tab=t,Ir.hidden=!0,window.scrollTo(0,0),td.forEach(e=>e.classList.toggle("is-active",e.dataset.tab===t)),Sx.forEach(e=>e.classList.toggle("is-active",e.dataset.panel===t)),t==="anatomy"&&ji(),t==="bom"&&rd()})});var lo=document.getElementById("piece-card");function wx(i){let t=Cr[i];t&&($.selectedPartId=i,lo.hidden=!1,document.getElementById("pc-badge").textContent=i==="human"?"SCALE 171 CM":`PART ${i} / ${Pr.length-1}`,document.getElementById("pc-title").textContent=t.name,document.getElementById("pc-indo").textContent=t.indo,document.getElementById("pc-fn").textContent=t.fn,document.getElementById("pc-spec").textContent=t.spec,document.getElementById("pc-isolate").classList.toggle("is-active",$.isolateMode))}var al=document.getElementById("canvas-host"),Nn=Qu(al,{onPartSelect:i=>wx(i),onPartHover:i=>{if(!i||!i.info){rl=null,Ir.hidden=!0;return}rl!==i.id&&(rl=i.id,ol.textContent=i.id==="human"?"SCALE 171 CM":`PART ${i.id}`,cl.textContent=i.info.name,ll.textContent=bx[i.id]||"Click to inspect specs");let t=al.clientWidth||640,e=al.clientHeight||440,n=Math.max(12,Math.min(t-256,i.x+16)),s=Math.max(64,Math.min(e-78,i.y-52));Ir.style.transform=`translate(${Math.round(n)}px, ${Math.round(s)}px)`,Ir.hidden=!1},onPartAction:i=>{if(i==="08")$.sampleCapOpen=!$.sampleCapOpen,sn(),Ze();else if(i==="07")$.lidOpen=!$.lidOpen,sn(),Ze();else if(i==="03"&&!$.tourActive){let t=$.tiltDeg<10?25:$.tiltDeg<30?32:-12;Ji(t)}},onMetrics:({mixPct:i})=>{$.mixPct=i;let t=document.getElementById("m-mix");t&&(t.textContent=`${i}%`)}});function Ji(i){$.tiltDeg=Math.max(-15,Math.min(35,i)),document.getElementById("sl-tilt").value=String($.tiltDeg),document.getElementById("val-tilt").textContent=`${$.tiltDeg}\xB0`,document.getElementById("val-tilt-inline").textContent=`${$.tiltDeg>0?"+":""}${$.tiltDeg}\xB0`,document.getElementById("wheel-icon").style.transform=`rotate(${$.tiltDeg*10}deg)`,$.tiltDeg<-5&&!$.lidOpen&&($.lidOpen=!0),sn(),Ze()}function Ze(){let i=Wr({driveId:$.driveId,gearId:$.gearId,batchKg:$.batchKg,tiltDeg:$.tiltDeg,throttle:$.throttle});Nn.applyState({driveId:$.driveId,gearId:$.gearId,drumRpm:i.drumRpm,gearRatio:i.gearRatio,tiltDeg:$.tiltDeg,batchKg:$.batchKg,explode:$.explode,cutaway:$.cutaway,lidOpen:$.lidOpen,sampleCapOpen:$.sampleCapOpen,showRuler:$.showRuler,running:$.running,stalled:i.stalled});let t=$.lidOpen&&!i.stalled?Math.min(1.8,i.drumRpm):i.drumRpm;document.getElementById("m-rpm").textContent=i.stalled?"0.00":t.toFixed(2),document.getElementById("m-torque").textContent=`${Math.round(i.torqueTotalNm)} Nm`,document.getElementById("m-power").textContent=`${Math.round(i.inputPowerW)} W`,document.getElementById("m-fill").textContent=`${i.fillPct.toFixed(1)}%`;let e=document.getElementById("chip-force"),n=document.getElementById("m-force");i.driveKind==="human"?(e.hidden=!1,n.textContent=`${i.handleForceKgf.toFixed(1)} kgf`,e.classList.toggle("is-warn",i.overloadWarning&&!i.stalled),e.classList.toggle("is-stall",i.stalled)):e.hidden=!0;let s=document.getElementById("status-pill");i.stalled?s.textContent=i.statusText:$.lidOpen&&$.running&&$.tiltDeg>=-4?s.textContent="Door Interlock \xB7 Jog Capped @ 1.8 RPM":$.sampleCapOpen?s.textContent="Sample Cap Open \xB7 Aroma / Blend Check Ready":s.textContent=`${i.regime} \xB7 ${i.bubukRisk}`,s.classList.toggle("is-stall",i.stalled);let r=i.estMixMinutes?`~${i.estMixMinutes.toFixed(1)} min/batch`:"Stalled / Too Fast";document.getElementById("physics-note").textContent=`Critical Nc ${i.criticalRpm.toFixed(1)} RPM (${i.pctCritical.toFixed(0)}%) \xB7 Tip ${i.tipSpeedMs.toFixed(2)} m/s \xB7 Est. ${r}`}function sn(){document.querySelectorAll("[data-drive]").forEach(e=>e.classList.toggle("is-active",e.dataset.drive===$.driveId)),document.querySelectorAll("[data-gear]").forEach(e=>e.classList.toggle("is-active",e.dataset.gear===$.gearId)),document.querySelectorAll("[data-batch]").forEach(e=>e.classList.toggle("is-active",Number(e.dataset.batch)===$.batchKg)),document.querySelectorAll("[data-tilt]").forEach(e=>e.classList.toggle("is-active",Number(e.dataset.tilt)===$.tiltDeg)),document.querySelectorAll("[data-cam]").forEach(e=>e.classList.toggle("is-active",!$.tourActive&&e.dataset.cam===$.activeCam));let i=document.getElementById("btn-cap");i.classList.toggle("is-active",$.sampleCapOpen),i.textContent=$.sampleCapOpen?"Close Sample Cap":"Open Sample Cap";let t=document.getElementById("btn-lid");t.classList.toggle("is-active",$.lidOpen),t.textContent=$.lidOpen?"Close & Latch Lid":"Open Vault Lid",document.getElementById("btn-cutaway").classList.toggle("is-active",$.cutaway),document.getElementById("btn-ruler").classList.toggle("is-active",$.showRuler),document.getElementById("btn-run").textContent=$.running?"Pause Spin":"Run Spin",document.getElementById("btn-tour-3d").classList.toggle("is-active",$.tourActive),document.getElementById("btn-tour-rail").classList.toggle("is-active",$.tourActive)}document.querySelectorAll("[data-drive]").forEach(i=>{i.addEventListener("click",()=>{$.driveId=i.dataset.drive;let t=Vr[$.driveId];$.gearId=t.defaultGear,$.throttle=t.kind==="engine"?t.defaultThrottle:1,document.getElementById("sl-throttle").value=String(Math.round($.throttle*100)),document.getElementById("val-throttle").textContent=`${Math.round($.throttle*100)}%`,document.getElementById("lbl-throttle").textContent=t.kind==="engine"?"Engine Throttle":"Human Effort (100% = ~95W sustained)",sn(),Ze()})});document.querySelectorAll("[data-gear]").forEach(i=>{i.addEventListener("click",()=>{$.gearId=i.dataset.gear,sn(),Ze()})});document.querySelectorAll("[data-batch]").forEach(i=>{i.addEventListener("click",()=>{$.batchKg=Number(i.dataset.batch),document.getElementById("sl-batch").value=String($.batchKg),document.getElementById("val-batch").textContent=`${$.batchKg} kg`,Nn.resetTobaccoBatch($.batchKg),sn(),Ze()})});document.getElementById("sl-batch").addEventListener("input",i=>{$.batchKg=Number(i.target.value),document.getElementById("val-batch").textContent=`${$.batchKg} kg`,sn(),Ze()});document.querySelectorAll("[data-tilt]").forEach(i=>{i.addEventListener("click",()=>Ji(Number(i.dataset.tilt)))});document.getElementById("btn-tilt-down").addEventListener("click",()=>Ji($.tiltDeg-5));document.getElementById("btn-tilt-zero").addEventListener("click",()=>Ji(0));document.getElementById("btn-tilt-up").addEventListener("click",()=>Ji($.tiltDeg+5));document.getElementById("sl-tilt").addEventListener("input",i=>Ji(Number(i.target.value)));document.getElementById("sl-throttle").addEventListener("input",i=>{let t=Number(i.target.value);$.throttle=t/100,document.getElementById("val-throttle").textContent=`${t}%`,Ze()});document.getElementById("sl-explode").addEventListener("input",i=>{let t=Number(i.target.value);$.explode=t/100,document.getElementById("val-explode").textContent=`${t}%`,Ze()});document.getElementById("btn-cap").addEventListener("click",()=>{$.sampleCapOpen=!$.sampleCapOpen,sn(),Ze()});document.getElementById("btn-lid").addEventListener("click",()=>{$.lidOpen=!$.lidOpen,sn(),Ze()});document.getElementById("btn-cutaway").addEventListener("click",()=>{$.cutaway=!$.cutaway,sn(),Ze()});document.getElementById("btn-ruler").addEventListener("click",()=>{$.showRuler=!$.showRuler,sn(),Ze()});document.getElementById("btn-run").addEventListener("click",()=>{$.running=!$.running,sn(),Ze()});document.getElementById("btn-reset-batch").addEventListener("click",()=>{Nn.resetTobaccoBatch($.batchKg)});document.querySelectorAll("[data-cam]").forEach(i=>{i.addEventListener("click",()=>{$.tourActive=!1,$.activeCam=i.dataset.cam,Nn.clearPartFocus(),lo.hidden=!0,$.activeCam==="cutaway"&&!$.cutaway&&($.cutaway=!0),$.activeCam==="unload"&&$.tiltDeg>-5&&Ji(-12),$.showRuler=$.activeCam==="overview",Nn.setCameraPreset($.activeCam),sn(),Ze()})});function nd(){if($.tourActive=!$.tourActive,$.tourActive){let i=$.selectedPartId||"07";$.explode=Math.max(.45,$.explode),$.showRuler=!1,document.getElementById("sl-explode").value=String(Math.round($.explode*100)),document.getElementById("val-explode").textContent=`${Math.round($.explode*100)}%`,Ze(),Nn.focusPart(i,{glideCamera:!0,isolate:$.isolateMode})}else $.explode=0,$.showRuler=$.activeCam==="overview",document.getElementById("sl-explode").value="0",document.getElementById("val-explode").textContent="0%",Nn.clearPartFocus(),lo.hidden=!0,Nn.setCameraPreset($.activeCam),Ze();sn()}document.getElementById("btn-tour-3d").addEventListener("click",nd);document.getElementById("btn-tour-rail").addEventListener("click",nd);function id(i){let t=Math.max(0,Pr.indexOf($.selectedPartId||"01")),e=Pr[(t+i+Pr.length)%Pr.length];Nn.focusPart(e,{glideCamera:!0,isolate:$.isolateMode})}document.getElementById("pc-prev").addEventListener("click",()=>id(-1));document.getElementById("pc-next").addEventListener("click",()=>id(1));document.getElementById("pc-isolate").addEventListener("click",()=>{$.isolateMode=!$.isolateMode,$.selectedPartId&&Nn.focusPart($.selectedPartId,{glideCamera:!1,isolate:$.isolateMode}),document.getElementById("pc-isolate").classList.toggle("is-active",$.isolateMode)});document.getElementById("pc-close").addEventListener("click",()=>{$.tourActive=!1,Nn.clearPartFocus(),lo.hidden=!0,sn()});function ji(){let i=document.getElementById("anatomy-plate-wrap");i.setAttribute("data-theme",$.anatomyTheme);let t=Hl({explode:$.anatomyExplode,selectedPartId:$.selectedPartId,animated:$.anatomyAnimated}),e=Wr({driveId:$.driveId,gearId:$.gearId,batchKg:$.batchKg,tiltDeg:$.tiltDeg,throttle:$.throttle}),n=ke.find(c=>c.id===$.selectedPartId),s=n?`PART ${n.id}: ${n.name}`:`${$.batchKg} kg \xB7 ${e.gearRatio}:1 \xB7 ${e.drumRpm.toFixed(2)} RPM`;i.innerHTML=`
    <figure class="iso-figure" style="margin:0">
      <div class="iso-plate">
        <div class="iso-plate-corners" aria-hidden="true">
          <span class="iso-plate-corner" data-corner="fig">FIG 01 \xB7 STEAMER MIXER</span>
          <span class="iso-plate-corner" data-corner="title">179\xD7179 CM</span>
          <span class="iso-plate-corner" data-corner="hint">CLICK PART OR EXPLODE</span>
          <span class="iso-plate-corner" data-corner="readout" data-readout>${s}</span>
        </div>
        ${t}
      </div>
    </figure>
  `;let r=document.getElementById("anatomy-part-list");r.innerHTML=ke.map(c=>`
    <button type="button" class="part-row${$.selectedPartId===c.id?" is-active":""}" data-anat-row="${c.id}">
      <span class="part-num">${c.id}</span>
      <div class="part-meta">
        <h4>${c.name}</h4>
        <div class="indo">${c.indonesian}</div>
        <p>${c.role}</p>
        <div class="spec">${c.spec}</div>
      </div>
    </button>`).join("");let a=(c,l)=>{i.querySelectorAll(`[data-part="${c}"]`).forEach(h=>h.classList.toggle("is-hover",l)),r.querySelectorAll(`[data-anat-row="${c}"]`).forEach(h=>h.classList.toggle("is-hover",l))},o=(c,l)=>{c.addEventListener("mouseenter",()=>a(l,!0)),c.addEventListener("mouseleave",()=>a(l,!1)),c.addEventListener("click",()=>{$.selectedPartId=$.selectedPartId===l?null:l,ji()})};i.querySelectorAll(".anat-part").forEach(c=>o(c,c.dataset.part)),r.querySelectorAll("[data-anat-row]").forEach(c=>o(c,c.dataset.anatRow))}function sd(i){let t=ke.findIndex(n=>n.id===$.selectedPartId),e=t<0?0:(t+i+ke.length)%ke.length;$.selectedPartId=ke[e].id,ji()}document.getElementById("btn-anat-prev").addEventListener("click",()=>sd(-1));document.getElementById("btn-anat-next").addEventListener("click",()=>sd(1));document.getElementById("btn-anat-anim").addEventListener("click",()=>{$.anatomyAnimated=!$.anatomyAnimated,document.getElementById("btn-anat-anim").textContent=$.anatomyAnimated?"Pause Motion":"Play Motion",ji()});document.getElementById("sl-anat-explode").addEventListener("input",i=>{$.anatomyExplode=Number(i.target.value)/100,document.getElementById("val-anat-explode").textContent=`${i.target.value}%`,ji()});document.getElementById("btn-anat-theme").addEventListener("click",()=>{$.anatomyTheme=$.anatomyTheme==="dark"?"light":"dark",document.getElementById("btn-anat-theme").textContent=$.anatomyTheme==="dark"?"Light Paper":"Dark Blueprint",ji()});function rd(){let i=[{label:"50 kg (1 Seri) \xB7 1P Fast 24:1",driveId:"human-1",gearId:"24:1",batchKg:50},{label:"150 kg \xB7 1P Fast 24:1",driveId:"human-1",gearId:"24:1",batchKg:150},{label:"150 kg \xB7 1P Low 72:1",driveId:"human-1",gearId:"72:1",batchKg:150},{label:"300 kg \xB7 1P Direct 12:1 (No Gear)",driveId:"human-1",gearId:"12:1",batchKg:300},{label:"300 kg \xB7 1P Heavy Low 72:1",driveId:"human-1",gearId:"72:1",batchKg:300},{label:"300 kg \xB7 2P Twin Crank 72:1",driveId:"human-2",gearId:"72:1",batchKg:300},{label:"300 kg \xB7 Electric 3 HP (12:1)",driveId:"engine-electric",gearId:"12:1",batchKg:300},{label:"300 kg \xB7 Petrol GX160 (12:1)",driveId:"engine-petrol",gearId:"12:1",batchKg:300}],t=document.getElementById("matrix-body");t.innerHTML=i.map(e=>{let n=Wr({...e,tiltDeg:25,throttle:e.driveId.startsWith("engine")?.9:1}),s=n.driveKind==="human"?`${n.handleForceKgf.toFixed(1)} kgf`:`${Math.round(n.inputPowerW)} W`,r=n.stalled||n.overloadWarning?"badge-bad":"badge-ok",a=n.stalled?"STALLED":n.overloadWarning?"Too Heavy":`${n.regime.split(" ")[0]} OK`;return`<tr>
        <td>${e.label}</td>
        <td>${Math.round(n.torqueTotalNm)} Nm</td>
        <td>${s}</td>
        <td>${n.drumRpm.toFixed(2)}</td>
        <td>${n.estMixMinutes?n.estMixMinutes.toFixed(1)+" m":"\u2014"}</td>
        <td class="${r}">${a}</td>
      </tr>`}).join("")}sn();Ze();ji();rd();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
