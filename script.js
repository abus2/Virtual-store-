const $=id=>document.getElementById(id);
if(!window.THREE)throw new Error('Three.js not loaded');const MAXPR=Math.min(window.devicePixelRatio||1,1.5);let PR=MAXPR,lite=false;const R=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});R.setPixelRatio(PR);R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFShadowMap;R.shadowMap.autoUpdate=false;let shDirty=0;const dirtySh=(n=45)=>{shDirty=Math.max(shDirty,n)};document.body.prepend(R.domElement);
const S=new THREE.Scene();S.background=new THREE.Color(0xeeede9);S.fog=new THREE.Fog(0xeeede9,14,30);
const C=new THREE.PerspectiveCamera(55,1,.1,60);
const hemi=new THREE.HemisphereLight(0xffffff,0xcfcfca,1.05);S.add(hemi);
const sun=new THREE.DirectionalLight(0xffffff,.55);sun.position.set(3,8,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0006;sun.shadow.radius=2;Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:.5,far:32});S.add(sun);
const M=(c,r=.8)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
const box=(w,h,d,c,x,y,z,p)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);m.receiveShadow=true;(p||S).add(m);return m};
/* room */
box(18,.1,18,0xd6d5d1,0,-.05,0);box(18,9,.2,0xf4f3f0,0,4.5,-8);box(.2,9,18,0xf1f0ed,-8,4.5,0);box(.2,9,18,0xf1f0ed,8,4.5,0);
box(18,.15,.15,0xbdbcb8,0,.07,-7.9);
/* logo */
function tex(t,w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle='#000';x.font=f;x.textAlign='center';x.textBaseline='middle';x.fillText(t,w/2,h/2);return new THREE.CanvasTexture(c)}
const logo=new THREE.Mesh(new THREE.PlaneGeometry(4,1.1),new THREE.MeshBasicMaterial({map:tex('NIKE ✓',512,140,'italic 900 90px Arial'),transparent:true}));logo.position.set(0,6.3,-7.88);S.add(logo);
const shoesSign=new THREE.Mesh(new THREE.PlaneGeometry(2,.6),new THREE.MeshBasicMaterial({map:tex('SHOES',256,80,'900 52px Arial'),transparent:true}));shoesSign.position.set(-7.85,5.6,0);shoesSign.rotation.y=Math.PI/2;S.add(shoesSign);
box(.05,1.8,1.3,0x111111,-7.88,3,-6.4);/* poster frame */
const poster=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.7),new THREE.MeshBasicMaterial({map:tex('JUST DO IT',256,360,'900 54px Arial')}));poster.position.set(-7.84,3,-6.4);poster.rotation.y=Math.PI/2;S.add(poster);
const items=[];const SH=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const g=x.createRadialGradient(64,64,4,64,64,62);g.addColorStop(0,'rgba(0,0,0,.30)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)})();
const disp=o=>o.traverse(m=>{if(!m.isMesh&&!m.isSprite)return;if(m.geometry)m.geometry.dispose();const a=Array.isArray(m.material)?m.material:[m.material];a.forEach(t=>{if(!t||t===dkM)return;if(t.map&&t.map!==SH)t.map.dispose();t.dispose()})});
const cs=g=>g.traverse(m=>{if(m.isMesh&&!m.material.isMeshBasicMaterial)m.castShadow=true});
function reg(g,p){cs(g);g.userData.p=p;g.userData.by=g.rotation.y;items.push(g);S.add(g);return g}
/* ---------- procedural product builders ---------- */
const css=h=>'#'+new THREE.Color(h).getHexString();
const lum=h=>{const c=new THREE.Color(h);return .299*c.r+.587*c.g+.114*c.b};
const NOISE=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const d=x.createImageData(128,128);for(let i=0;i<d.data.length;i+=4){const v=110+Math.random()*90|0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0);x.fillStyle='rgba(0,0,0,.2)';for(let i=0;i<128;i+=2)x.fillRect(0,i,128,1);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(8,8);return t})();
const fab=(o)=>new THREE.MeshStandardMaterial(Object.assign({roughness:.92,bumpMap:NOISE,bumpScale:.8},o));
function swoosh(x,px,py,s,col){x.save();x.translate(px,py);x.scale(s,s);x.fillStyle=col;x.beginPath();x.moveTo(-1,.02);x.bezierCurveTo(-.8,.5,-.3,.55,.2,.2);x.bezierCurveTo(.5,-.05,.85,-.35,1,-.55);x.bezierCurveTo(.55,-.3,.1,-.12,-.35,-.05);x.bezierCurveTo(-.75,.05,-.95,-.05,-1,.02);x.fill();x.restore()}
function decal(w,h,col){const c=document.createElement('canvas');c.width=256;c.height=128;swoosh(c.getContext('2d'),128,70,80,col);return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true}))}
function ext(shape,d,b,mat){const g=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:2,curveSegments:10});g.translate(0,0,-d/2);return new THREE.Mesh(g,mat)}
function rr(w,h,r){const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s}
const dkM=new THREE.MeshStandardMaterial({color:0x1a1a1a,roughness:.6});
/* clothing */
function jShape(k){const s=new THREE.Shape();
if(k==='pants'||k==='shorts'){const L=k==='pants'?-1.38:-.8;s.moveTo(-.42,0);s.lineTo(.42,0);s.lineTo(.46,L);s.lineTo(.07,L);s.lineTo(0,-.5);s.lineTo(-.07,L);s.lineTo(-.46,L);s.lineTo(-.42,0);return s}
if(k==='tee'){s.moveTo(-.2,0);s.quadraticCurveTo(-.32,-.03,-.55,-.13);s.lineTo(-.85,-.58);s.lineTo(-.64,-.7);s.lineTo(-.5,-.5);s.lineTo(-.5,-1.38);s.lineTo(.5,-1.38);s.lineTo(.5,-.5);s.lineTo(.64,-.7);s.lineTo(.85,-.58);s.lineTo(.55,-.13);s.quadraticCurveTo(.32,-.03,.2,0);s.quadraticCurveTo(0,-.14,-.2,0);return s}s.moveTo(-.2,0);s.quadraticCurveTo(-.32,-.03,-.55,-.13);s.lineTo(-.97,-1.22);s.lineTo(-.74,-1.3);s.lineTo(-.5,-.62);s.lineTo(-.5,-1.38);s.lineTo(.5,-1.38);s.lineTo(.5,-.62);s.lineTo(.74,-1.3);s.lineTo(.97,-1.22);s.lineTo(.55,-.13);s.quadraticCurveTo(.32,-.03,.2,0);s.quadraticCurveTo(0,-.14,-.2,0);return s}
function jTex(o){const K=2,W=512*K,H=360*K,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');const X=u=>(u+1)/2*W,Y=v=>-v/1.4*H;
 const poly=(p,f)=>{x.fillStyle=f;x.beginPath();p.forEach((q,i)=>i?x.lineTo(X(q[0]),Y(q[1])):x.moveTo(X(q[0]),Y(q[1])));x.fill()};
 const ln=(a,b,col,w)=>{x.strokeStyle=col;x.lineWidth=w*K;x.beginPath();x.moveTo(X(a[0]),Y(a[1]));x.lineTo(X(b[0]),Y(b[1]));x.stroke()};
 x.fillStyle=css(o.c1);x.fillRect(0,0,W,H);
 const dark=lum(o.c1)>.5?'rgba(0,0,0,.2)':'rgba(0,0,0,.38)';
 if(o.c2){const f=css(o.c2);poly([[-.5,-.7],[.5,-.7],[.5,-1.4],[-.5,-1.4]],f);poly([[-.789,-.75],[-.97,-1.22],[-.74,-1.3],[-.546,-.75]],f);poly([[.789,-.75],[.97,-1.22],[.74,-1.3],[.546,-.75]],f)}
 if(o.top)poly([[-.55,0],[.55,0],[.5,-.62],[0,-.95],[-.5,-.62]],css(o.top));
 if(o.puff)for(let v=-.2;v>-1.4;v-=.14){ln([-1,v],[1,v],'rgba(0,0,0,.4)',4);ln([-1,v-.012],[1,v-.012],'rgba(255,255,255,.14)',3)}
 poly([[-.5,-1.3],[.5,-1.3],[.5,-1.4],[-.5,-1.4]],dark);
 [-1,1].forEach(s=>poly([[s*.97,-1.22],[s*.74,-1.3],[s*.755,-1.2],[s*.945,-1.13]],dark));
 if(o.kang){const k='rgba(0,0,0,.35)';ln([-.3,-.85],[.3,-.85],k,3);ln([-.3,-.85],[-.4,-1.3],k,3);ln([.3,-.85],[.4,-1.3],k,3)}
 if(o.zip){ln([0,-.1],[0,-1.38],o.zc||'#b8b8b8',4);ln([-.3,-.9],[-.33,-1.3],'rgba(0,0,0,.4)',3);ln([.3,-.9],[.33,-1.3],'rgba(0,0,0,.4)',3)}
 if(o.mock)poly([[-.2,0],[.2,0],[.3,-.1],[-.3,-.1]],dark);
 if(o.deco)o.deco(x,X,Y,W/2,lum(o.c1));if(!o.nologo)swoosh(x,X(.3),Y(-.36),(o.big?30:20)*K,o.logo||'#fff');
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(.5,1/1.4);t.offset.set(.5,1);return t}
function garment(o){const g=new THREE.Group();const m=fab({map:jTex(o)});
 g.add(ext(jShape(o.shape),o.puff?.2:.1,o.puff?.07:.03,m));
 if(o.hood){const hs=new THREE.Shape();hs.absellipse(0,0,.3,.3,0,Math.PI*2);const h=ext(hs,.1,.04,fab({color:o.hc||o.c1}));h.position.set(0,.02,-.07);g.add(h);
  const i=new THREE.Mesh(new THREE.CircleGeometry(.2,24),dkM);i.scale.y=.7;i.position.set(0,-.08,.1);g.add(i);
  [-1,1].forEach(s=>{const c=new THREE.Mesh(new THREE.BoxGeometry(.018,.4,.01),new THREE.MeshStandardMaterial({color:0xf2f2f2}));c.position.set(s*.1,-.38,.1);g.add(c)})}
 const hm=new THREE.MeshStandardMaterial({color:0x2a2a2a,roughness:.5});
 [-1,1].forEach(s=>{const a=new THREE.Mesh(new THREE.BoxGeometry(.53,.025,.03),hm);a.position.set(s*.25,.03,0);a.rotation.z=-s*.35;g.add(a)});
 const hk=new THREE.Mesh(new THREE.TorusGeometry(.05,.009,8,16,4.4),hm);hk.position.set(0,.19,0);g.add(hk);
 const sh=new THREE.Mesh(new THREE.PlaneGeometry(1.9,2.1),new THREE.MeshBasicMaterial({map:SH,transparent:true,depthWrite:false}));sh.position.set(.3,-.7,-.45);sh.raycast=()=>{};g.add(sh);
 g.scale.setScalar(.8);return g}
/* shoes */
function shoe(main,acc,sole){const g=new THREE.Group(),inner=new THREE.Group();
 const p=new THREE.Shape();p.moveTo(-.52,0);p.lineTo(.48,0);p.quadraticCurveTo(.62,0,.6,.1);p.quadraticCurveTo(.56,.2,.4,.24);p.quadraticCurveTo(.22,.28,.08,.4);p.quadraticCurveTo(.02,.5,-.02,.5);p.lineTo(-.1,.47);p.quadraticCurveTo(-.2,.34,-.32,.38);p.quadraticCurveTo(-.42,.46,-.5,.4);p.quadraticCurveTo(-.58,.3,-.57,.1);p.quadraticCurveTo(-.57,0,-.52,0);
 const W=512,H=256,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');const X=u=>(u+.6)/1.25*W,Y=v=>H-v/.52*H;
 x.fillStyle=css(main);x.fillRect(0,0,W,H);x.fillStyle=css(acc);x.fillRect(X(.32),0,W,H);x.fillRect(0,0,X(-.38),H);
 x.fillStyle='rgba(255,255,255,.28)';for(let i=X(-.08);i<X(.3);i+=9)for(let j=Y(.34);j<Y(.08);j+=9){x.beginPath();x.arc(i,j,1.8,0,6.3);x.fill()}
 swoosh(x,X(.0),Y(.17),62,lum(main)>.6?'#111':'#fff');
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(.8,1/.52);t.offset.set(.48,0);
 inner.add(ext(p,.34,.05,fab({map:t,roughness:.7,bumpScale:.3})));
 const s=new THREE.Shape();s.moveTo(-.55,-.07);s.lineTo(.55,-.07);s.quadraticCurveTo(.7,-.07,.68,.07);s.lineTo(-.6,.07);s.quadraticCurveTo(-.65,0,-.55,-.07);
 inner.add(ext(s,.38,.03,new THREE.MeshStandardMaterial({color:sole,roughness:.55})));
 [.32,.24,.16,.08,0].forEach((px,i)=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.05,.02,.3),new THREE.MeshStandardMaterial({color:0xf4f4f4}));l.position.set(px,.3+i*.04,0);l.rotation.z=-.46;inner.add(l)});
 inner.rotation.y=-Math.PI/2;g.add(inner);return g}
/* bags */
function backpack(c,c2){const g=new THREE.Group();
 const b=ext(rr(.6,.82,.2),.2,.09,fab({color:c}));b.position.y=.5;g.add(b);
 const p=ext(rr(.46,.34,.1),.08,.04,fab({color:c2}));p.position.set(0,.34,.17);g.add(p);
 const z=new THREE.Mesh(new THREE.BoxGeometry(.4,.012,.012),dkM);z.position.set(0,.52,.23);g.add(z);
 const h=new THREE.Mesh(new THREE.TorusGeometry(.09,.016,8,16,Math.PI),dkM);h.position.set(0,.98,0);g.add(h);
 const d=decal(.24,.12,lum(c2)>.6?'#111':'#fff');d.position.set(0,.34,.235);g.add(d);return g}
function duffel(c){const g=new THREE.Group(),m=fab({color:c});
 const cy=new THREE.Mesh(new THREE.CylinderGeometry(.27,.27,.9,28),m);cy.rotation.z=Math.PI/2;cy.position.y=.28;g.add(cy);
 [-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.27,24,12),m);e.scale.x=.45;e.position.set(s*.45,.28,0);g.add(e);
  const bd=new THREE.Mesh(new THREE.CylinderGeometry(.277,.277,.05,28),dkM);bd.rotation.z=Math.PI/2;bd.position.set(s*.22,.28,0);g.add(bd);
  const hd=new THREE.Mesh(new THREE.TorusGeometry(.11,.017,8,16,Math.PI),dkM);hd.position.set(s*.22,.54,0);g.add(hd)});
 const d=decal(.3,.15,'#fff');d.position.set(0,.3,.275);g.add(d);return g}
/* caps */
function cap(col){const outer=new THREE.Group(),g=new THREE.Group();
 const c=document.createElement('canvas');c.width=256;c.height=128;const x=c.getContext('2d');x.fillStyle=css(col);x.fillRect(0,0,256,128);x.strokeStyle='rgba(0,0,0,.3)';x.lineWidth=2;for(let i=0;i<6;i++){x.beginPath();x.moveTo(i*256/6,0);x.lineTo(i*256/6,128);x.stroke()}
 const m=fab({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide,bumpScale:.5});
 const dome=new THREE.Mesh(new THREE.SphereGeometry(.27,32,16,0,Math.PI*2,0,Math.PI/2),m);dome.scale.y=.85;g.add(dome);
 const bt=new THREE.Mesh(new THREE.SphereGeometry(.025,12,8),fab({color:col}));bt.position.y=.23;g.add(bt);
 const bs=new THREE.Shape();bs.absellipse(0,.16,.27,.4,0,Math.PI,false);
 const br=ext(bs,.025,.012,fab({color:col}));br.rotation.x=Math.PI/2+.18;g.add(br);
 const d=decal(.17,.09,lum(col)>.6?'#111':'#fff');d.position.set(0,.12,.23);d.rotation.x=-.3;g.add(d);
 g.rotation.x=-.2;outer.add(g);outer.rotation.y=-Math.PI/2;return outer}
/* more builders */
const dk=c=>new THREE.Color(c).multiplyScalar(.72).getHex();
function hip(c){const g=new THREE.Group();const b=ext(rr(.7,.34,.15),.2,.07,fab({color:c}));b.position.y=.3;g.add(b);const p=ext(rr(.5,.16,.07),.06,.03,fab({color:dk(c)}));p.position.set(0,.27,.17);g.add(p);const s=new THREE.Mesh(new THREE.TorusGeometry(.42,.02,8,40),dkM);s.position.set(0,.5,-.12);g.add(s);const d=decal(.2,.1,lum(c)>.6?'#111':'#fff');d.position.set(0,.36,.205);g.add(d);return g}
function tote(c){const g=new THREE.Group();const b=ext(rr(.72,.62,.05),.2,.05,fab({color:c}));b.position.y=.36;g.add(b);[-1,1].forEach(s=>{const h=new THREE.Mesh(new THREE.TorusGeometry(.17,.016,8,20,Math.PI),dkM);h.position.set(s*.17,.67,s*.07);g.add(h)});const d=decal(.3,.15,lum(c)>.6?'#111':'#fff');d.position.set(0,.4,.265);g.add(d);return g}
function sack(c){const g=new THREE.Group(),m=fab({color:c});const b=new THREE.Mesh(new THREE.CylinderGeometry(.3,.24,.7,24),m);b.scale.z=.45;b.position.y=.38;g.add(b);const r=new THREE.Mesh(new THREE.TorusGeometry(.29,.02,8,24),dkM);r.rotation.x=Math.PI/2;r.scale.y=.45;r.position.y=.7;g.add(r);[-1,1].forEach(s=>{const k=new THREE.Mesh(new THREE.TorusGeometry(.3,.01,6,30),new THREE.MeshStandardMaterial({color:0xf2f2f2}));k.position.set(s*.3,.2,0);k.rotation.y=Math.PI/2;k.scale.set(.5,1,1);g.add(k)});const d=decal(.26,.13,lum(c)>.6?'#111':'#fff');d.position.set(0,.4,.145);g.add(d);return g}
function bucket(c){const o=new THREE.Group(),g=new THREE.Group(),m=fab({color:c,side:THREE.DoubleSide});const cr=new THREE.Mesh(new THREE.CylinderGeometry(.2,.26,.26,28,1,true),m);cr.position.y=.14;g.add(cr);const tp=new THREE.Mesh(new THREE.CircleGeometry(.2,28),m);tp.rotation.x=-Math.PI/2;tp.position.y=.27;g.add(tp);const br=new THREE.Mesh(new THREE.CylinderGeometry(.27,.44,.08,32,1,true),m);br.position.y=.04;g.add(br);const d=decal(.17,.09,lum(c)>.6?'#111':'#fff');d.position.set(0,.14,.255);g.add(d);o.add(g);o.rotation.y=-Math.PI/2;return o}
function beanie(c){const o=new THREE.Group(),g=new THREE.Group(),m=fab({color:c,bumpScale:1.4});const d0=new THREE.Mesh(new THREE.SphereGeometry(.26,28,16,0,Math.PI*2,0,Math.PI/2),m);d0.scale.y=1.05;d0.position.y=.1;g.add(d0);const cf=new THREE.Mesh(new THREE.CylinderGeometry(.268,.268,.14,28,1,true),fab({color:dk(c),side:THREE.DoubleSide,bumpScale:1.8}));cf.position.y=.07;g.add(cf);const d=decal(.15,.08,lum(c)>.6?'#111':'#fff');d.position.set(0,.07,.272);g.add(d);o.add(g);o.rotation.y=-Math.PI/2;return o}
/* ---------- build the store ---------- */
const rail=y=>{const r=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,16,12),M(0x222222,.4));r.rotation.z=Math.PI/2;r.position.set(0,y,-7.4);S.add(r)};rail(4.65);rail(3.1);
const PAL=[0x111111,0xf2f2f2,0x1f3fa0,0xd01418,0x2f6b4f],vr=c=>[c,...PAL.filter(x=>x!==c)].slice(0,5);
function put(mk,p,x,y,z,rot){p.vr=vr(p.c0);p.build=mk;const g=mk(p.c0);g.position.set(x,y,z);if(rot)g.rotation.y=rot;return reg(g,p)}
/* clothing range (photo-matched): D.* draw each garment's print onto its texture. U = pixels per unit */
const txt=(x,t,px,py,u,col,st)=>{x.fillStyle=col;x.font=(st||'900')+' '+Math.round(u)+'px Impact,"Arial Black",Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,px,py)};
const sws=(x,px,py,u,col)=>swoosh(x,px,py,u/2,col);
const inkC=l=>l>.55?'#111':'#fff';
const rect=(x,X,Y,U,u,v,w,h,c)=>{x.fillStyle=c;x.fillRect(X(u)-w*U/2,Y(v)-h*U/2,w*U,h*U)};
const D={
 vint:(x,X,Y,U)=>{rect(x,X,Y,U,0,-.64,1,.48,'#f4f4f4');txt(x,'NIKE',X(0),Y(-.55),.22*U,'#111','italic 900');sws(x,X(0),Y(-.71),.72*U,'#111')},
 air:(x,X,Y,U)=>{rect(x,X,Y,U,0,-.26,.024,.42,'#5c5c5c');rect(x,X,Y,U,.27,-.3,.12,.12,'#2b2b2b');txt(x,'NIKE AIR',X(0),Y(-1.0),.115*U,'#d9d9d9','italic 900')},
 carh:(x,X,Y,U)=>{rect(x,X,Y,U,0,-.5,.62,.4,'#6f5622');txt(x,'NIKE',X(0),Y(-.43),.17*U,'#3b302c');txt(x,'WIP',X(.04),Y(-.59),.15*U,'#3b302c')},
 red:(x,X,Y,U,L)=>{sws(x,X(0),Y(-.3),.9*U,L<.25?'#fff':'#111');txt(x,'JUST DO IT.',X(0),Y(-.62),.2*U,L>.6?'#111':'#fff')},
 jdiW:(x,X,Y,U,L)=>{const k=inkC(L);sws(x,X(-.22),Y(-.6),.52*U,k);txt(x,'JUST',X(.2),Y(-.33),.17*U,k);txt(x,'DO IT',X(.22),Y(-.58),.17*U,k)},
 pat:(x,X,Y,U)=>{const c=document.createElement('canvas');c.width=x.canvas.width;c.height=x.canvas.height;const k=c.getContext('2d');
  [['JUST',-.3],['DO',-.55],['IT.',-.8]].forEach(l=>txt(k,l[0],X(0),Y(l[1]),.3*U,'#d6f27a'));
  k.globalCompositeOperation='source-atop';k.strokeStyle='#161616';k.lineWidth=U/120;for(let i=-c.height;i<c.width;i+=U/36){k.beginPath();k.moveTo(i,0);k.lineTo(i+c.height*.6,c.height);k.stroke()}
  sws(x,X(-.02),Y(-.55),.85*U,'#5aa0ee');x.drawImage(c,0,0)},
 glow:(x,X,Y,U)=>{sws(x,X(0)+U*.014,Y(-.5)+U*.014,.88*U,'#1fb83a');sws(x,X(0),Y(-.5),.8*U,'#cdf29a')},
 varsity:(x,X,Y,U)=>{rect(x,X,Y,U,-.28,-.27,.26,.09,'#1b86b3');rect(x,X,Y,U,-.28,-.37,.26,.09,'#d8dde0');rect(x,X,Y,U,-.28,-.47,.26,.09,'#1b86b3');
  txt(x,'JUST',X(-.28),Y(-.27),.07*U,'#fff');txt(x,'DO',X(-.28),Y(-.37),.07*U,'#111');txt(x,'IT.',X(-.28),Y(-.47),.07*U,'#fff');
  txt(x,'NIKE',X(.12),Y(-.34),.2*U,'#1d7fb8','italic 900');sws(x,X(.1),Y(-.44),.55*U,'#176b9f');
  x.fillStyle='#e6e6e6';x.beginPath();x.arc(X(.28),Y(-.58),.1*U,0,6.3);x.fill();txt(x,'NIKE',X(.28),Y(-.58),.05*U,'#111');
  txt(x,'01',X(-.26),Y(-.95),.34*U,'#1b86b3');rect(x,X,Y,U,.26,-.95,.3,.26,'#14507a');txt(x,'N',X(.26),Y(-.95),.22*U,'#1b86b3');rect(x,X,Y,U,.3,-1.25,.16,.07,'#e6e6e6')},
 ice:(x,X,Y,U)=>{sws(x,X(.04),Y(-.6),.85*U,'#8a6cf0');txt(x,'NIKE',X(0)+U*.015,Y(-.45)+U*.025,.24*U,'#efe6d2','italic 900');txt(x,'NIKE',X(0),Y(-.45),.24*U,'#8a5733','italic 900')},
 fut:(x,X,Y,U,L)=>{const k=inkC(L);txt(x,'NIKE',X(0),Y(-.42),.3*U,k,'italic 900');sws(x,X(-.02),Y(-.6),.85*U,k)},
 club:(x,X,Y,U,L)=>{const k=inkC(L);txt(x,'NIKE',X(.3),Y(-.32),.07*U,k,'italic 900');sws(x,X(.3),Y(-.38),.2*U,k)}
};
const clothes=[
['Nike Sportswear Windrunner Jacket',110,{c1:0x17246b,top:0xf4f4f4,hc:0xf4f4f4,hood:1,zip:1,zc:'#17246b',logo:'#17246b'},'Navy/White'],
['Nike Vintage Colour-Block Jacket',120,{c1:0x1b1b1b,mock:1,nologo:1,deco:D.vint},'Black/White'],
['Nike Air Half-Zip Jacket',95,{c1:0x1c1c1c,mock:1,kang:1,nologo:1,deco:D.air},'Black'],
['Nike x Carhartt WIP Tee',65,{shape:'tee',c1:0x4a4745,nologo:1,deco:D.carh},'Washed Black'],
['Nike Just Do It Classic Tee',35,{shape:'tee',c1:0xd01418,nologo:1,deco:D.red},'University Red'],
['Nike Just Do It Swoosh Tee',35,{shape:'tee',c1:0xf2f2f2,nologo:1,deco:D.jdiW},'White']];
const tops=[
['Nike Just Do It Pattern Tee',32,{shape:'tee',c1:0x111111,nologo:1,deco:D.pat},'Black/Volt'],
['Nike Swoosh Glow Tee',30,{shape:'tee',c1:0x2e4a74,nologo:1,deco:D.glow},'Court Blue'],
['Nike Varsity Patch Tee',35,{shape:'tee',c1:0x151515,nologo:1,deco:D.varsity},'Black/Blue'],
['Nike Ice Cream Swoosh Tee',32,{shape:'tee',c1:0x111111,nologo:1,deco:D.ice},'Black'],
['Nike Futura Tee',30,{shape:'tee',c1:0x1a1a1a,nologo:1,deco:D.fut},'Black'],
['Nike Sportswear Club Tee',35,{shape:'tee',c1:0x111111,nologo:1,deco:D.club},'Black']];
const sizesC=['XS','S','M','L','XL','XXL'];
[[clothes,4.47],[tops,2.92]].forEach(([L,y])=>L.forEach((c,i)=>put(v=>garment(Object.assign({},c[2],{c1:v})),{n:c[0],p:c[1],cat:'Clothing',sub:c[3],sz:sizesC,face:[0,0,1],c0:c[2].c1},-4.25+i*1.7,y,-7.4)));
/* shoes wall */
box(.12,4.6,6.4,0xd9a95f,-7.85,2.3,0);
const shoeD=[['Custom Galaxy Air Force 1',175,0xb23fd0,0xff7a1a,0xf4f4f4],['Mind 002',145,0x6f8fd0,0xb7c6ec,0x6f8fd0],['Court Vision Low',75,0x1a1a1f,0xc9b400,0x111111],['Air Max Dn8',190,0xbfc2c6,0xc9c9cc,0xdfe6ee],['Structure 26',145,0xc9cdd1,0x5f8fb4,0xf4f4f4],['Structure Plus',170,0x5a8cf0,0xff7a1a,0xf4f4f4],['Pegasus 42',145,0x141418,0xf2f2f2,0xf4f4f4],['Free Metcon 6',135,0x151515,0xf2f2f2,0xf4f4f4],['Tennis Classic',105,0x1f5a34,0x1f5a34,0xf2efe6],['Revolution 8',75,0x9a9fa6,0x1f3fd0,0x6f9bb8]];
shoeD.forEach((d,n)=>{const r=Math.floor(n/3),k=n===9?1:n%3,y=1.1+r*1.05,z=-2+k*2;box(.7,.05,1.4,0xf2f2f2,-7.5,y,z);
 put(v=>shoe(v,d[3],d[4]),{n:d[0],p:d[1],cat:'Shoes',sub:'Men’s shoes',sz:['6','7','8','9','10','11','12','13'],face:[1,0,0],c0:d[2]},-7.5,y+.095,z,.2)});
/* bag shelves */
const bz=0;
function shelf(cz,L){const U=new THREE.Group();U.position.set(7.4,0,cz);U.rotation.y=-Math.PI/2;S.add(U);const x=0;box(3.4,2.6,.1,0xd9a95f,x,1.3,bz-.4,U);box(.1,2.6,1.1,0xd9a95f,x-1.7,1.3,bz,U);box(.1,2.6,1.1,0xd9a95f,x+1.7,1.3,bz,U);[0,1.25,2.55].forEach(y=>box(3.4,.08,1.1,0xe0b46a,x,y,bz,U));box(.08,1.25,1.1,0xd9a95f,x,.6,bz,U);
 L.forEach(b=>put(b[2],{n:b[0],p:b[1],cat:'Bags',sub:b[5]||'One size',sz:['One size'],face:[-1,.1,0],c0:b[6]},7.4,b[4],cz+b[3],-Math.PI/2))}
shelf(-5.8,[['Brasilia Backpack',45,c=>backpack(c,dk(c)),-.85,.04,'26L',0x1f4fe0],['Heritage Backpack',40,c=>backpack(c,dk(c)),.85,.04,'25L',0xee4b14],['Elemental Backpack',55,c=>backpack(c,0x2f2f2f),-.85,1.29,'21L',0x4cff2a],['Utility Duffel',60,duffel,.85,1.29,'Medium',0xd01418]]);
shelf(-2.2,[['Heritage Hip Pack',28,hip,-.85,.04,'Crossbody',0x111111],['Sportswear Tote',32,tote,.85,.04,'Canvas',0xe4e1da],['Gym Sack',22,sack,-.85,1.29,'Drawstring',0x1f3fa0],['Brasilia Duffel',65,duffel,.85,1.29,'Large',0x2f6b4f]]);
const bagSign=new THREE.Mesh(new THREE.PlaneGeometry(2,.6),new THREE.MeshBasicMaterial({map:tex('BAGS',256,80,'900 52px Arial'),transparent:true}));bagSign.position.set(7.84,3.6,-4);bagSign.rotation.y=-Math.PI/2;S.add(bagSign);
/* caps pegboard */
box(.1,3.6,3.8,0xe6c690,7.85,2.4,3);
const capD=[['Club Cap',28,cap,'Adjustable',0x1f4fe0],['Heritage86 Cap',30,cap,'Adjustable',0xd01418],['Dri-FIT Fly Cap',32,cap,'Adjustable',0xdddddd],['Apex Cap',30,cap,'Adjustable',0x2b2b2b],['Futura Cap',26,cap,'Adjustable',0xffffff],['Rise Cap',28,cap,'Adjustable',0x2f6b4f],['Tech Cap',32,cap,'Adjustable',0xff7a1a],['Club Cap Light',28,cap,'Adjustable',0xa9cdf0],['Apex Bucket Hat',35,bucket,'Bucket',0xe4e1da],['Sportswear Bucket Hat',35,bucket,'Bucket',0x1f3fa0],['Cuffed Beanie',25,beanie,'Beanie',0x2d2d2d],['Swoosh Beanie',28,beanie,'Beanie',0xd01418]];
capD.forEach((d,i)=>put(d[2],{n:d[0],p:d[1],cat:'Caps',sub:d[3],sz:['One size'],face:[-1,0,0],c0:d[4]},7.45,3.2-Math.floor(i/4)*1.1,2.0+(i%4)*.85));
/* ---------- real-store decor ---------- */
(()=>{
const fc=document.createElement('canvas');fc.width=fc.height=512;const fx=fc.getContext('2d');fx.fillStyle='#8a6a45';fx.fillRect(0,0,512,512);
for(let i=0;i<8;i++)for(let j=0;j<5;j++){fx.fillStyle='hsl(32,38%,'+(60+Math.random()*10|0)+'%)';fx.fillRect(j*128-(i%2)*64+1,i*64+1,126,62)}
const ft=new THREE.CanvasTexture(fc);ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(4,4);
const fl=new THREE.Mesh(new THREE.PlaneGeometry(18,18),new THREE.MeshStandardMaterial({map:ft,roughness:.4}));fl.rotation.x=-Math.PI/2;fl.position.y=.012;fl.receiveShadow=true;S.add(fl);
box(18,.2,18,0xf6f5f2,0,9.1,0);
[-5,-1,3].forEach(z=>{const m=new THREE.Mesh(new THREE.BoxGeometry(10,.06,.3),new THREE.MeshBasicMaterial({color:0xffffff}));m.position.set(0,8.95,z);S.add(m)});
const art=(a,b,t)=>{const c=document.createElement('canvas');c.width=256;c.height=360;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,256,360);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,256,360);x.fillStyle='rgba(255,255,255,.14)';x.beginPath();x.arc(200,90,110,0,6.3);x.fill();swoosh(x,128,230,70,'#fff');x.fillStyle='#fff';x.textAlign='center';x.font='900 52px Arial';x.fillText(t,128,70);x.font='600 16px Arial';x.fillText('JUST DO IT',128,330);return new THREE.CanvasTexture(c)};
const frame=(w,h,map,x,y,z,ry)=>{const G=new THREE.Group();G.position.set(x,y,z);G.rotation.y=ry;S.add(G);box(w+.14,h+.14,.06,0x111111,0,0,0,G);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map}));m.position.z=.035;G.add(m)};
const P=Math.PI/2;
[[-5.6,'#d01418','#111','RUN'],[-3.4,'#1f3fa0','#6aa0e8','AIR'],[3.4,'#2f6b4f','#111','TRAIN'],[5.6,'#ee4b14','#d4ff00','MOVE']].forEach(f=>frame(1.3,1.8,art(f[1],f[2],f[3]),f[0],6.4,-7.86,0));
frame(1.3,1.8,art('#111','#444','GO'),-7.86,6.6,-3.6,P);frame(1.3,1.8,art('#d4ff00','#2d2d2d','FLY'),-7.86,6.6,3.6,P);
frame(1.3,1.8,art('#a9cdf0','#1f3fa0','AIR'),7.86,6.4,-4,-P);frame(1.3,1.8,art('#e4e1da','#9a4a22','CLUB'),7.86,6.4,3,-P);
const mir=(w,h,x,y,z,ry,round)=>{const c=document.createElement('canvas');c.width=128;c.height=256;const k=c.getContext('2d');const g=k.createLinearGradient(0,0,128,256);g.addColorStop(0,'#dfe9ee');g.addColorStop(.5,'#9fb4be');g.addColorStop(1,'#c9d8df');k.fillStyle=g;k.fillRect(0,0,128,256);k.fillStyle='rgba(255,255,255,.4)';k.beginPath();k.moveTo(10,256);k.lineTo(50,0);k.lineTo(75,0);k.lineTo(35,256);k.fill();k.beginPath();k.moveTo(70,256);k.lineTo(95,0);k.lineTo(105,0);k.lineTo(80,256);k.fill();
 const G=new THREE.Group();G.position.set(x,y,z);G.rotation.y=ry;S.add(G);const fr=new THREE.Mesh(round?new THREE.CylinderGeometry(w/2+.07,w/2+.07,.07,40):new THREE.BoxGeometry(w+.14,h+.14,.07),M(0x1a1a1a,.4));if(round)fr.rotation.x=P;G.add(fr);
 const m=new THREE.Mesh(round?new THREE.CircleGeometry(w/2,40):new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),color:0xdddddd}));m.position.z=.04;G.add(m);return G};
mir(1.1,3.2,-7.86,1.9,5.6,P);mir(1.1,3.2,7.86,1.9,6.3,-P);mir(.9,2.4,4.8,1.5,5.2,.15);box(.9,.06,.6,0x1a1a1a,4.8,.03,5.0);mir(1.4,1.4,-7.86,6.4,-.5,P,true);
const C=new THREE.Group();C.position.set(-4.6,0,4.4);S.add(C);box(2.4,1.05,.8,0xf2f2f2,0,.525,0,C);box(2.5,.06,.9,0x111111,0,1.08,0,C);box(.5,.3,.4,0x222222,.5,1.26,0,C);box(.42,.26,.04,0x4cff2a,.5,1.45,.1,C).rotation.x=-.3;box(.3,.45,.1,0xd01418,-.6,1.33,0,C);
const cl=new THREE.Mesh(new THREE.PlaneGeometry(1.6,.5),new THREE.MeshBasicMaterial({map:tex('CHECKOUT',256,80,'900 40px Arial'),transparent:true}));cl.position.set(0,.55,.41);C.add(cl);
box(.55,.08,2.6,0xd9a95f,-5.9,.45,0);[-1.1,1.1].forEach(z=>box(.5,.45,.08,0x222222,-5.9,.22,z));
const mq=(x,z,top,leg)=>{const G=new THREE.Group();G.position.set(x,0,z);S.add(G);const mk=(geo,c,y,px)=>{const m=new THREE.Mesh(geo,M(c,.6));m.position.set(px||0,y,0);m.castShadow=true;G.add(m)};mk(new THREE.CylinderGeometry(.35,.35,.03,24),0x222222,.02);mk(new THREE.CylinderGeometry(.03,.03,1.9,8),0x888888,.95);[-.1,.1].forEach(px=>mk(new THREE.CylinderGeometry(.075,.06,.85,12),leg,.5,px));mk(new THREE.CylinderGeometry(.2,.17,.7,16),top,1.3);mk(new THREE.SphereGeometry(.2,16,8),top,1.62);G.children[G.children.length-1].scale.y=.4;mk(new THREE.SphereGeometry(.11,16,12),0xe8e4de,1.88)};
mq(-1.4,2.6,0x111111,0x6b6b6b);mq(1.4,2.6,0xd01418,0x111111);
const pl=(x,z)=>{const G=new THREE.Group();G.position.set(x,0,z);S.add(G);const p=new THREE.Mesh(new THREE.CylinderGeometry(.24,.18,.42,20),M(0xf2f2f2,.5));p.position.y=.21;G.add(p);for(let i=0;i<8;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(.17,10,8),M(i%2?0x2f6b4f:0x3f8a5f,.8));l.scale.y=1.4;l.position.set(Math.sin(i*2.1)*.2,.75+i%3*.2,Math.cos(i*2.1)*.2);l.castShadow=true;G.add(l)}};
pl(-7,4.2);pl(6.9,5.3);pl(-7,7);pl(7,7.3);
})();
/* stations */
let cx=0;
const ST={store:()=>[[0,3.2,7],[0,3,-4]],clothing:()=>[[cx,3.7,-4.4],[cx,3.5,-8]],caps:()=>[[3,2.3,3.2],[8,2.3,3.2]],bags:()=>[[3.2,2.3,-4],[8,1.5,-4]],shoes:()=>[[-2.6,2.6,0],[-8,2.5,0]]};
let st='store',focus=null,yaw=0,pyaw=0;
const pos=new THREE.Vector3(0,2.8,7),look=new THREE.Vector3(0,2.6,-4);
const names={store:'Store',clothing:'Clothing',caps:'Caps',bags:'Bags',shoes:'Shoes'};
Object.keys(names).forEach(k=>{const b=document.createElement('button');b.textContent=names[k];b.onclick=()=>go(k);b.dataset.k=k;$('nav').appendChild(b)});
function go(k){dirtySh();st=k;if(location.hash)try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}focus=null;$('panel').classList.remove('open');$('arrows').style.visibility='visible';if(k==='clothing')cx=Math.max(-4.3,Math.min(4.3,cx));
 document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.k===k));
 const a=k==='clothing'?'block':'none';$('prev').style.display=$('next').style.display=a}
function pan(d){cx=Math.max(-4.3,Math.min(4.3,cx+d*2.4))}
$('prev').onclick=()=>pan(-1);$('next').onclick=()=>pan(1);
addEventListener('keydown',e=>{if(st==='clothing'&&!focus){if(e.key==='ArrowRight')pan(1);if(e.key==='ArrowLeft')pan(-1)}if(e.key==='Escape'){go(st);$('mod').classList.remove('show')}if(e.target.tagName!=='INPUT'){const k=e.key.toLowerCase();if(k==='c')$('cart').click();if(k==='t')$('tour').click();if(k==='m')$('mu').click();if(k==='d')$('th').click()}if(focus&&e.target.tagName!=='INPUT'){if(e.key==='ArrowRight')cyc(1);if(e.key==='ArrowLeft')cyc(-1)}});
/* product panel */
let pts=0,usePts=false,sel=null,promo=false,ship=0,gift=false,mute=false,zoom=1;const rv=[],cmp=[],ord=[];const lines=[],wish=new Set();
function toast(m){const e=$('toast');e.textContent=m;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),2200)}
const hs=n=>{let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))%1000;return h},onSale=p=>hs(p.n)%4===0;
const DESC={Clothing:'Soft, breathable fabric with a relaxed everyday fit.',Shoes:'Cushioned midsole and a durable rubber outsole.',Bags:'Roomy main compartment with padded carry.',Caps:'Structured crown with an adjustable fit.'};
const SG={Clothing:'Chest (cm): XS 81–86 · S 86–91 · M 91–97 · L 97–104 · XL 104–112 · XXL 112–120. Between sizes? Size up for a relaxed fit.',Shoes:'US → EU: 6=38.5 · 7=40 · 8=41 · 9=42.5 · 10=44 · 11=45 · 12=46.5 · 13=48. Half size? Go up.',Bags:'One size fits all.',Caps:'One size · adjustable strap.'};
function info(p){const h=hs(p.n),r=3.8+h%12/10,k=Math.round(r),s=2+h%14;$('pd').textContent='★'.repeat(k)+'☆'.repeat(5-k)+' '+r.toFixed(1)+' ('+(40+h%900)+') · '+DESC[p.cat]+(s<=5?' · Only '+s+' left':'');$('sg').textContent=SG[p.cat];$('sg').style.display='none';rv.unshift(p.n);const u=[...new Set(rv)].slice(0,5);rv.length=0;rv.push(...u)}
const sv=()=>{try{localStorage.setItem('vs-cart',JSON.stringify({l:lines,w:[...wish],o:ord,pt:pts}))}catch(e){}};
function upd(){sv();$('cn').textContent=lines.reduce((a,l)=>a+l.q,0);renderCart()}
function renderCart(){const d=$('drawer');d.innerHTML='<b>Your cart</b>';if(!lines.length)d.insertAdjacentHTML('beforeend','<p>Your cart is empty.</p>');
 lines.forEach((l,i)=>{const r=document.createElement('div');r.className='ln';r.innerHTML='<span>'+l.n+' · '+l.s+'<br><small>$'+l.p.toFixed(2)+' × '+l.q+'</small></span>';const x=document.createElement('button');x.textContent='−';x.onclick=()=>{if(--l.q<1)lines.splice(i,1);upd()};const y=document.createElement('button');y.textContent='+';y.onclick=()=>{l.q++;upd()};const bx=document.createElement('span');bx.append(x,' ',y);r.appendChild(bx);d.appendChild(r)});
 const sub=lines.reduce((a,l)=>a+l.p*l.q,0),sh=(sub>=100?0:8)+ship+(gift?4:0),dis=promo?sub*.1:0,rd=usePts?Math.min(Math.floor(pts/100)*5,sub-dis):0;
 if(lines.length){d.insertAdjacentHTML('beforeend','<div class="bar"><i style="width:'+Math.min(100,sub)+'%"></i></div><small>'+(sub>=100?'Free shipping unlocked':'$'+(100-sub).toFixed(2)+' to free shipping')+'</small><div class="tot">Subtotal $'+sub.toFixed(2)+' · Shipping $'+sh.toFixed(2)+(dis?'<br>Promo −$'+dis.toFixed(2):'')+(rd?'<br>Points −$'+rd.toFixed(2):'')+'<br>Total $'+(sub-dis-rd+sh).toFixed(2)+'<br><small>Earn '+Math.floor(sub-dis-rd)+' points</small></div>');const op=document.createElement('div');op.style.cssText='margin-top:8px;font-size:11px';op.innerHTML='<label><input type="radio" name="sp" '+(ship?'':'checked')+'> Standard</label> <label><input type="radio" name="sp" id="ex" '+(ship?'checked':'')+'> Express +$12</label><br><label><input type="checkbox" id="gf" '+(gift?'checked':'')+'> Gift wrap +$4</label>'+(pts>=100?'<br><label><input type="checkbox" id="up" '+(usePts?'checked':'')+'> Redeem points (−$'+Math.floor(pts/100)*5+' · '+pts+' pts)</label>':'<br><small>Points balance: '+pts+' (100 pts = $5)</small>');d.appendChild(op);const up=op.querySelector('#up');if(up)up.onchange=e=>{usePts=e.target.checked;renderCart()};op.querySelector('input[name=sp]').onchange=()=>{ship=0;renderCart()};op.querySelector('#ex').onchange=()=>{ship=12;renderCart()};op.querySelector('#gf').onchange=e=>{gift=e.target.checked;renderCart()};const pr=document.createElement('div');pr.style.marginTop='8px';pr.innerHTML=promo?'<small>NIKE10 applied ✓</small>':'<input id="pc2" placeholder="Promo code" style="width:62%;padding:6px;border-radius:8px;border:1px solid var(--line);background:none;color:inherit"> <button id="pa" style="padding:6px 10px;border-radius:8px;border:1px solid var(--line);background:none;color:inherit;cursor:pointer">Apply</button>';d.appendChild(pr);if(!promo)pr.querySelector('#pa').onclick=()=>{if(pr.querySelector('#pc2').value.trim().toUpperCase()==='NIKE10'){promo=true;renderCart();toast('10% off applied')}else toast('Invalid code')};const c=document.createElement('button');c.className='co';c.textContent='Checkout';c.onclick=()=>checkout(sub-dis-rd+sh,sub-dis-rd,rd);d.appendChild(c)}
 if(cmp.length){d.insertAdjacentHTML('beforeend','<div class="tot">Compare</div>'+cmp.map(c=>'<small>'+c+'</small><br>').join('')+'<button class="lnk" id="cc">Clear</button>');d.querySelector('#cc').onclick=()=>{cmp.length=0;renderCart()}}
 if(ord.length)d.insertAdjacentHTML('beforeend','<div class="tot">Orders</div>'+ord.slice(0,3).map(c=>'<small>'+c+'</small><br>').join(''));
 if(rv.length){d.insertAdjacentHTML('beforeend','<div class="tot">Recently viewed</div>');rv.forEach(n=>d.insertAdjacentHTML('beforeend','<small>'+lk(n)+'</small><br>'))}
 if(wish.size){d.insertAdjacentHTML('beforeend','<div class="tot">♥ Saved</div>');wish.forEach(n=>d.insertAdjacentHTML('beforeend','<small>'+lk(n)+'</small><br>'))}}
const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'-'),esc=t=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),lk=n=>'<a href="#" data-n="'+n+'" style="color:inherit">'+n+'</a>';
function openN(n){const g=items.find(x=>x.userData.p.n===n);if(g){$('drawer').classList.remove('show');open(g)}}
$('drawer').addEventListener('click',e=>{const a=e.target.closest('a[data-n]');if(a){e.preventDefault();openN(a.dataset.n)}});
function checkout(tot,net,rd){const m=$('mod');m.innerHTML='<div class="box"><h3>Checkout</h3><input id="fn" placeholder="Full name"><input id="fe" placeholder="Email"><input id="fa" placeholder="Delivery address"><div class="er" id="fer"></div><b>Total $'+tot.toFixed(2)+'</b><div class="row"><button id="fx">Cancel</button><button id="fp" class="pri">Place order</button></div></div>';m.classList.add('show');
 $('fx').onclick=()=>m.classList.remove('show');
 $('fp').onclick=()=>{const n=$('fn').value.trim(),e=$('fe').value.trim(),a=$('fa').value.trim();if(!n||!a||!/^\S+@\S+\.\S+$/.test(e)){$('fer').textContent='Please enter a name, a valid email and an address.';return}
  const id=1000+Math.random()*9000|0,sum=lines.map(l=>l.q+'× '+l.n+' ('+l.s+')').join('<br>'),earn=Math.floor(net);ord.unshift('#'+id+' · '+lines.length+' lines · $'+tot.toFixed(2));pts=pts-rd*20+earn;lines.length=0;promo=false;ship=0;gift=false;usePts=false;upd();$('drawer').classList.remove('show');beep(880);
  m.innerHTML='<div class="box"><h3>Order #'+id+' confirmed ✓</h3><small>Demo only, nothing was charged.</small><p>'+sum+'</p><p>Total $'+tot.toFixed(2)+'<br>Ships to '+esc(n)+', '+esc(a)+'<br>+'+earn+' points (balance '+pts+')</p><div class="row"><button id="fk" class="pri">Keep shopping</button></div></div>';$('fk').onclick=()=>m.classList.remove('show')}}
$('cart').onclick=()=>{renderCart();$('drawer').classList.toggle('show')};
function swatches(){const p=focus.userData.p;$('sw').innerHTML='';p.vr.forEach((c,i)=>{const b=document.createElement('button');b.style.background=css(c);b.className=i?'':'on';b.onclick=()=>{const n=p.build(c),o=focus;n.position.copy(o.position);n.rotation.y=o.rotation.y;n.userData=o.userData;n.visible=o.visible;cs(n);items[items.indexOf(o)]=n;S.remove(o);disp(o);S.add(n);n.updateMatrixWorld(true);dirtySh();focus=n;[...$('sw').children].forEach(x=>x.classList.toggle('on',x===b))};$('sw').appendChild(b)})}
function open(g){dirtySh();const p=g.userData.p;try{history.replaceState(null,'','#'+slug(p.n))}catch(e){}focus=g;sel=null;zoom=1;$('pc').textContent=p.cat;$('ph').style.display='block';$('ph').innerHTML='<img class="'+(p.cat==='Clothing'||p.cat==='Shoes'?'ph-c':'')+'" src="images/'+p.n.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.jpg" alt="" onerror="this.parentNode.style.display=\'none\'">';$('pn').textContent=p.n;const sl=onSale(p),pe=sl?+(p.p*.8).toFixed(2):p.p;$('pp').textContent='$'+pe.toFixed(2);$('po').textContent=sl?'Was $'+p.p.toFixed(2)+' · 20% off':'';info(p);$('ps').textContent=p.sub;$('wish').textContent=wish.has(p.n)?'♥ Saved':'♡ Save';
 $('sizes').innerHTML='';p.sz.forEach(s=>{const b=document.createElement('button');b.textContent=s;if(p.sz.length>1&&hs(p.n+s)%7===0){b.disabled=true;b.title='Sold out';b.style.cssText='opacity:.35;text-decoration:line-through;cursor:not-allowed'}b.onclick=()=>{sel=s;[...$('sizes').children].forEach(x=>x.classList.toggle('on',x===b));$('add').classList.remove('done');$('add').textContent='Add to Cart'};$('sizes').appendChild(b)});
 swatches();$('add').classList.remove('done');$('add').textContent='Add to Cart';$('panel').classList.add('open');$('arrows').style.visibility='hidden'}
$('close').onclick=()=>{go(st);$('arrows').style.visibility='visible'};
$('wish').onclick=()=>{const n=$('pn').textContent;wish.has(n)?wish.delete(n):wish.add(n);sv();$('wish').textContent=wish.has(n)?'♥ Saved':'♡ Save'};
$('add').onclick=()=>{if(!sel){$('add').textContent='Pick a size first';return}const n=$('pn').textContent,l=lines.find(x=>x.n===n&&x.s===sel);l?l.q++:lines.push({n,s:sel,p:parseFloat($('pp').textContent.slice(1)),q:1});upd();beep();$('add').classList.add('done');$('add').textContent='Added to cart ✓'};
items.forEach(g=>$('names').insertAdjacentHTML('beforeend','<option value="'+g.userData.p.n+'">'));
function cyc(d){if(!focus)return;const L=items.filter(x=>x.visible&&x.userData.p.cat===focus.userData.p.cat),i=L.indexOf(focus);if(L.length>1)open(L[(i+d+L.length)%L.length])}
$('pv').onclick=()=>cyc(-1);$('nx').onclick=()=>cyc(1);
let tour=null;$('tour').onclick=()=>{if(tour){clearInterval(tour);tour=null;$('tour').textContent='▶ Tour';return}$('tour').textContent='■ Stop';const k=Object.keys(names);let i=0;const nx=()=>go(k[i++%k.length]);nx();tour=setInterval(nx,4500)};
let dark=matchMedia('(prefers-color-scheme: dark)').matches;try{const s=localStorage.getItem('vs-theme');if(s)dark=s==='d'}catch(e){}
function theme(){document.documentElement.dataset.theme=dark?'dark':'light';const c=dark?0x1b1b1b:0xeeede9;if(window.mood)mood(dark?2:0);try{localStorage.setItem('vs-theme',dark?'d':'l')}catch(e){}}
$('th').onclick=()=>{dark=!dark;theme()};theme();
try{const d=JSON.parse(localStorage.getItem('vs-cart')||'null');if(d){lines.push(...d.l);d.w.forEach(x=>wish.add(x));(d.o||[]).forEach(x=>ord.push(x));pts=d.pt||0}}catch(e){}upd();
let AC;function beep(f=660){if(mute)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+.18);o.stop(AC.currentTime+.2)}catch(e){}}
$('mu').onclick=()=>{mute=!mute;$('mu').textContent=mute?'🔇':'🔊'};
$('cmpb').onclick=()=>{const n=$('pn').textContent,s=n+' — '+$('pp').textContent+' — '+$('pd').textContent.split(' · ')[0];if(cmp.length>=3)cmp.shift();if(!cmp.some(x=>x.startsWith(n+' —')))cmp.push(s);toast('Added to compare ('+cmp.length+'/3)')};
R.domElement.addEventListener('wheel',e=>{if(focus){zoom=Math.max(.55,Math.min(1.5,zoom+e.deltaY*.001));e.preventDefault()}},{passive:false});
/* v28: website layer */
const wl=new THREE.PointLight(0xfff0dc,.5,20);wl.position.set(0,7,1);S.add(wl);
let gc='All',gs='';
function grid(){const L=items.map(g=>g.userData.p).filter(p=>gc==='All'||p.cat===gc);if(gs==='lo')L.sort((a,b)=>a.p-b.p);if(gs==='hi')L.sort((a,b)=>b.p-a.p);if(gs==='az')L.sort((a,b)=>a.n.localeCompare(b.n));
 $('gl').innerHTML=L.map(p=>{const s=onSale(p);return '<div class="gc" data-n="'+p.n+'"><i style="background:'+(p.cat==='Clothing'||p.cat==='Shoes'?'#f1f1ef url(images/'+slug(p.n)+'.jpg) center/contain no-repeat':'linear-gradient(135deg,'+css(p.c0)+','+css(dk(p.c0))+')')+'"></i><b>'+p.n+'</b><small>'+p.cat+' · '+(s?'<s>$'+p.p.toFixed(2)+'</s> ':'')+'$'+(s?(p.p*.8).toFixed(2):p.p.toFixed(2))+'</small></div>'}).join('')}
const showGrid=()=>{grid();$('grid').classList.add('show')};
$('gb').onclick=showGrid;$('gx').onclick=()=>$('grid').classList.remove('show');
$('gl').onclick=e=>{const c=e.target.closest('.gc');if(c){$('grid').classList.remove('show');openN(c.dataset.n)}};
$('gf').onclick=e=>{const b=e.target.closest('button');if(b){gc=b.dataset.c;[...$('gf').children].forEach(x=>x.classList.toggle('on',x===b));grid()}};
$('gsel').onchange=e=>{gs=e.target.value;grid()};
$('nlb').onclick=()=>toast(/^\S+@\S+\.\S+$/.test($('nle').value.trim())?'Subscribed. Use NIKE10 at checkout':'Enter a valid email');
$('enter').onclick=()=>$('hero').classList.add('hide');
$('browse').onclick=()=>{$('hero').classList.add('hide');showGrid()};
document.querySelectorAll('.cats button').forEach(b=>b.onclick=()=>{$('hero').classList.add('hide');go(b.dataset.k)});
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;if(e.key.toLowerCase()==='g')showGrid();if(e.key==='Escape')$('grid').classList.remove('show')});
$('ht').oninput=()=>{const h=+$('ht').value,p=focus&&focus.userData.p;if(!p||p.cat!=='Clothing'||!h){$('hr').textContent=p&&p.cat!=='Clothing'?'Size finder is for clothing':'';return}const z=h<160?'XS':h<168?'S':h<176?'M':h<184?'L':h<192?'XL':'XXL';$('hr').textContent='We suggest '+z;const b=[...$('sizes').children].find(x=>x.textContent===z&&!x.disabled);if(b)b.click()};
/* v29: realistic lighting */
R.toneMapping=THREE.ACESFilmicToneMapping;window.SP=[];
const glw=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,240,210,.9)');g.addColorStop(1,'rgba(255,240,210,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
function fix(x,y,z,tx,ty,tz){const G=new THREE.Group();G.position.set(x,y,z);S.add(G);G.lookAt(tx,ty,tz);
 const h=new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,.3,14),M(0x111111,.4));h.rotation.x=Math.PI/2;G.add(h);
 const l=new THREE.Mesh(new THREE.CircleGeometry(.085,14),new THREE.MeshBasicMaterial({color:0xfff2d0,toneMapped:false}));l.position.z=.151;G.add(l);
 const s=new THREE.SpotLight(0xfff1de,.7,18,.55,.85,1.5);s.position.set(x,y,z);s.target.position.set(tx,ty,tz);S.add(s,s.target);SP.push(s);
 const g=new THREE.Sprite(new THREE.SpriteMaterial({map:glw,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:.7}));g.scale.set(1.3,1.3,1);g.position.set(x,y-.05,z+.1);S.add(g)}
box(12,.05,.08,0x111111,0,8.85,-5.5);box(.08,.05,8,0x111111,-4.5,8.85,0);box(.08,.05,8,0x111111,4.5,8.85,0);
[-5,0,5].forEach(x=>fix(x,8.7,-5.5,x,3.4,-7.9));[-2,2].forEach(z=>fix(-4.5,8.7,z,-7.9,2.6,z));[-4,3].forEach(z=>fix(4.5,8.7,z,7.9,2.4,z));
const MO=[['Day',0xeeede9,.85,.4,.7,1.15,0xfff0dc],['Evening',0x2a2230,.35,.15,1.6,1.2,0xffb36b],['Night',0x0f1218,.18,.08,1.9,1.3,0x9fc4ff]];let mi=0;
function mood(i){if(!window.SP||!SP.length)return;mi=i;const m=MO[i];S.background.set(m[1]);S.fog.color.set(m[1]);hemi.intensity=m[2];sun.intensity=m[3];SP.forEach(s=>s.intensity=m[4]);R.toneMappingExposure=m[5];wl.color.set(m[6])}
$('lm').onclick=()=>{mood((mi+1)%3);toast('Lighting: '+MO[mi][0])};mood(dark?2:0);
$('sn').onclick=()=>{R.render(S,C);const a=document.createElement('a');a.href=R.domElement.toDataURL('image/png');a.download='virtual-store.png';a.click();toast('Photo saved')};
const _op=open;open=g=>{_op(g);const p=g.userData.p,L=items.filter(x=>x.userData.p.cat!==p.cat).map(x=>x.userData.p).sort((a,b)=>hs(p.n+a.n)-hs(p.n+b.n)).slice(0,3);$('cl').innerHTML='<div class="cat">Complete the look</div>'+L.map(q=>'<a href="#" data-n="'+q.n+'"><small>'+q.n+'</small></a>').join('')};
$('cl').onclick=e=>{const a=e.target.closest('a[data-n]');if(a){e.preventDefault();openN(a.dataset.n)}};
/* v30: colour lighting */
const PAL2=[['Volt',0xd4ff00,0x00e5ff,0xff2d95],['Sunset',0xff7a1a,0xff2d55,0x8a2be2],['Neon',0xff2d95,0x00e5ff,0x7cff00],['Ice',0x6aa0e8,0xa9cdf0,0xffffff],['Warm',0xfff0dc,0xffe0b0,0xffd0a0]];let ci=0;const ZM=[[],[],[]];
const strip=(z,w,h,d,x,y,zz)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}));m.position.set(x,y,zz);S.add(m);ZM[z].push(m.material)};
const AD=(map,w,h)=>new THREE.MeshBasicMaterial({map,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.4,toneMapped:false});
const pool=(z,w,h,x,y,zz,flat)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),AD(glw));m.position.set(x,y,zz);if(flat===true)m.rotation.x=-Math.PI/2;else m.rotation.y=flat;S.add(m);m.raycast=()=>{};ZM[z].push(m.material)};
/* back wall + ceiling cove + logo outline */
strip(0,14,.05,.05,0,5.45,-7.84);strip(0,16,.06,.06,0,8.8,-7.8);strip(0,4.5,.05,.05,0,6.95,-7.84);strip(0,4.5,.05,.05,0,5.65,-7.84);strip(0,.05,1.35,.05,-2.25,6.3,-7.84);strip(0,.05,1.35,.05,2.25,6.3,-7.84);
/* shoes wall */
strip(1,.05,.05,6.4,-7.82,4.75,0);strip(1,.05,.05,6.4,-7.82,.12,0);strip(1,.06,.06,16,-7.8,8.8,0);
/* caps + bags wall */
strip(2,.05,.05,3.8,7.82,4.3,3);strip(2,.05,.05,3.4,7.82,2.75,-5.8);strip(2,.06,.06,16,7.8,8.8,0);
/* wall washes and floor pools */
pool(0,14,6,0,4,-7.6,0);pool(1,7,6,-7.6,3,0,Math.PI/2);pool(2,5,5,7.6,3,3,-Math.PI/2);pool(2,5,4,7.6,1.6,-5.8,-Math.PI/2);
pool(0,10,4,0,.03,-5.5,true);pool(1,4,7,-5.5,.03,0,true);pool(2,3.5,11,5.8,.03,-.5,true);
/* neon sign */
const nc=document.createElement('canvas');nc.width=512;nc.height=128;const nx=nc.getContext('2d'),nt=new THREE.CanvasTexture(nc);
function neonDraw(col){nx.clearRect(0,0,512,128);const h=css(col);nx.font='italic 900 64px Arial';nx.textAlign='center';nx.textBaseline='middle';nx.shadowColor=h;nx.shadowBlur=26;nx.fillStyle=h;nx.fillText('JUST DO IT',256,66);nx.shadowBlur=8;nx.fillStyle='#fff';nx.fillText('JUST DO IT',256,66);nt.needsUpdate=true}
const ns=new THREE.Mesh(new THREE.PlaneGeometry(4,1),new THREE.MeshBasicMaterial({map:nt,transparent:true,toneMapped:false,depthWrite:false}));ns.position.set(0,7.9,-7.85);S.add(ns);
function tint(i){ci=i;const P=PAL2[i];[0,1,2].forEach(z=>ZM[z].forEach(m=>m.color.set(P[z+1])));SP.forEach((s,k)=>s.color.set(new THREE.Color(P[k<3?1:k<5?2:3]).lerp(new THREE.Color(0xffffff),.35)));neonDraw(P[1])}
$('cm').onclick=()=>{tint((ci+1)%PAL2.length);toast('Colour: '+PAL2[ci][0])};tint(0);
$('shr').onclick=()=>{navigator.clipboard?navigator.clipboard.writeText(location.href).then(()=>toast('Link copied'),()=>toast(location.href)):toast(location.href)};
$('sgb').onclick=()=>{$('sg').style.display=$('sg').style.display==='none'?'block':'none'};
const flt=()=>{dirtySh();const v=+$('mx').value;$('mv').textContent='$'+v;items.forEach(g=>{const p=g.userData.p;g.visible=p.p<=v&&(!$('so').checked||onSale(p))})};$('mx').oninput=flt;$('so').onchange=flt;
$('q').onchange=()=>{const v=$('q').value.toLowerCase();const g=v&&items.find(x=>x.userData.p.n.toLowerCase().includes(v));if(g){open(g);$('q').blur()}};
/* input */
const ray=new THREE.Raycaster(),mv=new THREE.Vector2();let drag=null,moved=0;
function pick(e){const r=R.domElement.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mv,C);
 const h=ray.intersectObjects(items.filter(x=>x.visible),true)[0];if(!h)return null;let o=h.object;while(!o.userData.p)o=o.parent;return o}
R.domElement.addEventListener('pointerdown',e=>{drag=e.clientX;moved=0});
addEventListener('pointerup',e=>{if(drag!==null&&moved<5&&e.target===R.domElement){const o=pick(e);if(o)open(o)}drag=null});
let hovE=null,lastLbl='';
R.domElement.addEventListener('pointermove',e=>{if(drag!==null){const d=e.clientX-drag;moved+=Math.abs(d);drag=e.clientX;yaw=Math.max(-.5,Math.min(.5,yaw-d*.003))}else hovE=e});
function hover(){const e=hovE;hovE=null;if(!e)return;const o=focus?null:pick(e);const t=o?o.userData.p.n+(onSale(o.userData.p)?' · SALE 20% off':''):'';if(t!==lastLbl){lastLbl=t;$('label').textContent=t;R.domElement.style.cursor=o?'pointer':'grab'}}
/* loop */
function size(){R.setSize(innerWidth,innerHeight);C.aspect=innerWidth/innerHeight;const as=innerWidth/innerHeight;C.fov=as<1?Math.min(88,2*Math.atan(Math.tan(.5)/as)*180/Math.PI):55;C.updateProjectionMatrix()}
addEventListener('resize',size);size();const h0=location.hash.slice(1);go('store');{const g=h0&&items.find(x=>slug(x.userData.p.n)===h0);if(g)open(g)}
const tp=new THREE.Vector3(),tl=new THREE.Vector3(),wv=new THREE.Vector3(),fo=new THREE.Vector3(),gridEl=$('grid');
let fr=0,acc=0,nf=0,lt=0;
/* adaptive resolution: if frames are slow, lower pixel ratio, then drop half the spotlights */
function adapt(dt){if(fr<90||dt>250)return;acc+=dt;if(++nf<45)return;const avg=acc/nf;acc=nf=0;
 if(avg>24&&PR>.75){PR=Math.max(.75,PR-.25);R.setPixelRatio(PR);R.setSize(innerWidth,innerHeight)}
 else if(avg>30&&PR<=.75&&!lite){lite=true;SP.forEach((l,k)=>{if(k%2)l.visible=false})}}
/* static scene: compute matrices once, upload every texture and compile every shader up front (no stutter while panning) */
S.updateMatrixWorld(true);S.autoUpdate=false;
{const fc=[];S.traverse(o=>{if(o.frustumCulled){fc.push(o);o.frustumCulled=false}});R.shadowMap.needsUpdate=true;R.render(S,C);fc.forEach(o=>o.frustumCulled=true);shDirty=0}
(function loop(t){requestAnimationFrame(loop);const dt=t-(lt||t);lt=t;fr++;adapt(dt);
 if(focus){focus.getWorldPosition(wv);const p=focus.userData.p,f=p.face,cl=p.cat==='Clothing';fo.set(f[0],f[1],f[2]).normalize();
  tl.set(wv.x,wv.y+(cl?-.6:0),wv.z);tp.copy(tl).addScaledVector(fo,(cl?3.1:2.3)*zoom);tp.y+=.1;tl.x+=f[0]===0?.35:0;
  if(cl)tl.x+=.55}
 else{const s=ST[st]();tp.set(...s[0]);tl.set(...s[1])}
 pos.lerp(tp,.07);look.lerp(tl,.07);pyaw+=(yaw-pyaw)*.1;if(drag===null)yaw*=.97;
 C.position.copy(pos);C.lookAt(look);C.rotation.y+=pyaw;
 const now=performance.now();
 for(let i=0;i<items.length;i++){const g=items[i],u=g.userData;let ch=false;
  if(g===focus){g.rotation.y=u.by+Math.sin(now/1100)*.55;ch=true}
  else{const d=u.by-g.rotation.y;if(d>1e-4||d<-1e-4){g.rotation.y+=d*.1;ch=true}}
  if(u.p.cat==='Clothing'){g.rotation.z=Math.sin(now/1200+i)*.015;ch=true}
  if(ch)g.updateMatrixWorld(true)}
 if(hovE&&fr%3===0)hover();
 if(gridEl.classList.contains('show'))return;/* catalogue covers the 3D view: skip drawing */
 if(shDirty>0||focus){if(shDirty>0)shDirty--;if(fr%3===0)R.shadowMap.needsUpdate=true}
 R.render(S,C)})();
