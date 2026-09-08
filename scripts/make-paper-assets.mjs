import { mkdirSync, writeFileSync } from 'node:fs';

// Baked design assets: no random geometry or filter work during scrolling.
const dir = new URL('../public/design/paper/', import.meta.url);
mkdirSync(dir, { recursive: true });
const random = seed => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
function rough(points, seed, step = 5, depth = 3) {
  const rnd = random(seed), out = [];
  points.forEach((a, i) => {
    const b = points[(i + 1) % points.length];
    const dx = b[0]-a[0], dy = b[1]-a[1], len = Math.hypot(dx,dy);
    const count = Math.max(1, Math.floor(len / step));
    for(let j=0;j<count;j++) {
      const t=j/count, n=j===0?0:(rnd()-.5)*depth*2;
      out.push([a[0]+dx*t-dy/len*n,a[1]+dy*t+dx/len*n]);
    }
  });
  return out;
}
const path = points => 'M'+points.map(p=>p.map(n=>n.toFixed(2)).join(',')).join('L')+'Z';
const svg = (w,h,body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${body}</svg>`;
const save = (name, w,h,body) => writeFileSync(new URL(name,dir),svg(w,h,body));
const contours = [
 [[2,54],[63,40],[75,21],[229,51],[362,70],[508,63],[681,101],[800,74],[875,88],[987,51],[947,132],[971,162],[940,251],[956,317],[823,335],[701,314],[589,340],[430,310],[309,338],[217,314],[78,340],[39,295],[10,303],[40,196]],
 [[9,103],[79,81],[158,69],[289,76],[364,52],[507,46],[593,28],[762,36],[841,14],[992,8],[948,73],[969,104],[953,190],[977,245],[944,320],[819,325],[705,296],[606,321],[496,288],[381,295],[270,260],[144,274],[75,220],[47,228]],
 [[9,63],[67,35],[223,24],[300,40],[436,29],[522,53],[681,31],[827,49],[925,28],[986,45],[952,95],[967,178],[946,201],[983,269],[925,299],[812,300],[715,330],[577,310],[431,329],[342,314],[202,347],[126,317],[30,341],[47,257],[9,244],[35,159]],
 [[13,107],[82,49],[168,62],[287,26],[414,47],[526,32],[601,52],[711,25],[832,37],[998,15],[968,97],[974,194],[951,216],[982,306],[888,299],[774,325],[652,310],[559,336],[470,301],[355,319],[274,286],[149,294],[71,251],[40,263],[55,200]],
 [[8,64],[131,28],[288,44],[348,24],[490,47],[567,63],[731,59],[851,97],[986,56],[963,137],[979,241],[927,235],[955,320],[866,306],[773,333],[671,312],[549,346],[462,305],[339,329],[251,291],[104,322],[53,289],[9,309],[32,196]]
];
contours.forEach((points,i)=>{
  const outer=rough(points,310+i,4,3.3);
  const inner=rough(points.map(([x,y])=>[500+(x-500)*.970,180+(y-180)*.932]),950+i,3.8,3.5);
  const d=path(outer), inside=path(inner);
  save(`work-${i+1}-mask.svg`,1000,360,`<path d="${inside}" fill="white"/>`);
  save(`work-${i+1}-frame.svg`,1000,360,`<defs><linearGradient id="p" x2=".3" y2="1"><stop stop-color="#eee8db"/><stop offset=".55" stop-color="#d7cbb8"/><stop offset="1" stop-color="#e8e1d5"/></linearGradient><mask id="m"><path d="${d}" fill="white"/><path d="${inside}" fill="black"/></mask><filter id="grain"><feTurbulence baseFrequency=".48" numOctaves="3" seed="${i+8}"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="soft-light"/></filter></defs><g mask="url(#m)"><rect width="1000" height="360" fill="url(#p)"/><rect width="1000" height="360" fill="#cdc1ad" filter="url(#grain)" opacity=".20"/><path d="${d}" fill="none" stroke="#f7efe2" stroke-width="3"/></g>`);
});
for(let i=0;i<5;i++){
 const rnd=random(240+i), top=[];
 for(let x=-10;x<=1610;x+=40) top.push([x,38+Math.sin(x/143+i*3)*14+rnd()*16]);
 const d=path(rough([...top,[1610,170],[-10,170]],86+i,3,2.8));
 const fib=path(rough([...top.map(([x,y])=>[x,y-8-rnd()*7]),[1610,170],[-10,170]],281+i,2.8,2));
 // Separate edge mask lets the new section continue underneath without a solid SVG band.
 save(`seam-${i+1}-mask.svg`,1600,170,`<path d="${d}" fill="white"/>`);
 save(`seam-${i+1}-fiber.svg`,1600,170,`<defs><mask id="m"><path d="${fib}" fill="white"/><path d="${d}" fill="black"/></mask><filter id="g"><feTurbulence baseFrequency=".38" numOctaves="2" seed="${i+2}"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="soft-light"/></filter></defs><g mask="url(#m)"><rect width="1600" height="170" fill="#e2d9c8"/><rect width="1600" height="170" fill="#d3c7b6" filter="url(#g)" opacity=".22"/></g>`);
}
const scrap=rough([[3,8],[90,3],[182,7],[298,3],[296,93],[177,97],[93,92],[2,97]],78,3,1.6);
save('scrap-mask.svg',300,100,`<path d="${path(scrap)}" fill="white"/>`);
console.log('Paper masks and fiber borders written.');
