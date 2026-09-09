import { mkdirSync, writeFileSync } from 'node:fs';

// Baked design assets: no random geometry or filter work during scrolling.
const dir = new URL('../public/design/paper-v2/', import.meta.url);
mkdirSync(dir, { recursive: true });
const random = seed => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
function rough(points, seed, step = 5, depth = 3, closed = true) {
  const rnd = random(seed), out = [];
  points.forEach((a, i) => {
    if (!closed && i === points.length - 1) return;
    const b = points[(i + 1) % points.length];
    const dx = b[0]-a[0], dy = b[1]-a[1], len = Math.hypot(dx,dy);
    const count = Math.max(1, Math.floor(len / step));
    for(let j=0;j<count;j++) {
      const t=j/count, n=j===0?0:(rnd()-.5)*depth*2;
      out.push([a[0]+dx*t-dy/len*n,a[1]+dy*t+dx/len*n]);
    }
  });
  if (!closed) out.push(points[points.length - 1]);
  return out;
}
const path = points => 'M'+points.map(p=>p.map(n=>n.toFixed(2)).join(',')).join('L')+'Z';
const svg = (w,h,body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${body}</svg>`;
const save = (name, w,h,body) => writeFileSync(new URL(name,dir),svg(w,h,body));
// Art-directed long shards, traced in proportions from the approved composition.
// Small fibers are secondary to the long directional tears.
const contours = [
 [[0,18],[58,55],[32,8],[97,39],[79,3],[151,33],[169,18],[211,45],[300,61],[328,46],[376,76],[409,63],[472,91],[494,79],[572,101],[598,89],[681,123],[715,107],[739,133],[785,110],[777,143],[867,113],[847,153],[950,97],[923,156],[999,114],[969,180],[985,166],[957,218],[982,232],[948,267],[964,304],[884,300],[901,331],[814,317],[836,344],[741,306],[701,323],[651,294],[590,322],[508,304],[434,322],[348,294],[322,322],[276,291],[206,301],[191,276],[108,290],[121,263],[33,294],[55,253],[0,275]],
 [[0,74],[59,98],[31,51],[101,63],[122,39],[213,46],[234,25],[331,39],[362,19],[442,37],[464,12],[555,31],[614,15],[655,28],[703,9],[756,23],[810,0],[803,31],[897,15],[874,49],[993,1],[960,73],[981,102],[939,99],[960,157],[945,201],[982,234],[956,245],[999,328],[921,313],[936,350],[856,317],[812,331],[769,307],[679,316],[656,296],[581,306],[563,285],[475,297],[430,274],[377,285],[346,265],[257,270],[228,245],[164,255],[144,221],[83,231],[99,189],[30,175],[53,146]],
 [[0,50],[57,24],[61,44],[147,17],[157,38],[225,14],[258,32],[336,5],[345,29],[423,24],[452,47],[519,22],[542,39],[606,21],[627,48],[699,39],[735,57],[809,33],[798,65],[881,33],[864,71],[976,31],[946,101],[969,88],[946,159],[962,211],[949,225],[988,273],[938,280],[961,306],[851,310],[845,331],[757,316],[723,336],[671,324],[603,347],[564,328],[486,344],[462,329],[379,345],[355,324],[286,340],[263,317],[199,333],[180,309],[84,341],[99,310],[5,347],[30,273],[7,242],[31,189],[13,119]],
 [[0,88],[57,61],[43,39],[142,52],[162,29],[225,42],[255,22],[334,40],[351,17],[447,25],[463,7],[546,22],[564,4],[635,27],[651,13],[729,31],[751,10],[808,31],[826,12],[891,28],[932,0],[924,55],[991,19],[958,104],[979,171],[956,224],[989,291],[951,286],[977,337],[886,312],[895,340],[800,326],[767,350],[708,331],[650,350],[616,333],[529,348],[505,329],[416,345],[389,323],[305,335],[279,316],[195,324],[171,293],[106,299],[119,265],[61,278],[77,242],[14,205],[48,181],[10,127],[48,137]],
 [[0,80],[62,103],[47,29],[121,47],[112,14],[185,29],[230,5],[266,22],[346,15],[368,36],[444,29],[462,49],[540,40],[569,69],[637,55],[651,79],[735,61],[726,93],[816,87],[803,114],[901,88],[881,128],[994,81],[953,160],[981,148],[948,201],[993,248],[941,255],[981,311],[900,296],[917,346],[828,311],[789,347],[733,324],[664,348],[601,326],[549,350],[490,321],[429,340],[390,314],[310,331],[286,303],[219,318],[189,287],[117,307],[132,269],[16,318],[47,249],[0,223],[42,184]]
];
contours.forEach((points,i)=>{
  const outer=rough(points,310+i,3.5,1.3);
  const inner=rough(points.map(([x,y])=>[500+(x-500)*.988,180+(y-180)*.970]),950+i,3.5,1.2);
  const d=path(outer), inside=path(inner);
  save(`work-${i+1}-mask.svg`,1000,360,`<path d="${inside}" fill="white"/>`);
  save(`work-${i+1}-frame.svg`,1000,360,`<defs><linearGradient id="p" x2=".3" y2="1"><stop stop-color="#eee8db"/><stop offset=".55" stop-color="#d7cbb8"/><stop offset="1" stop-color="#e8e1d5"/></linearGradient><mask id="m"><path d="${d}" fill="white"/><path d="${inside}" fill="black"/></mask><pattern id="grain" width="7" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".6" fill="#655b48"/><path d="M4 7l2-1" stroke="#887c66" stroke-width=".5"/></pattern></defs><g mask="url(#m)"><rect width="1000" height="360" fill="url(#p)"/><rect width="1000" height="360" fill="url(#grain)" opacity=".20"/><path d="${d}" fill="none" stroke="#f7efe2" stroke-width="1.2"/></g>`);
});
for(let i=0;i<5;i++){
 const rnd=random(240+i), top=[];
 for(let x=-10;x<=1610;x+=40) top.push([x,38+Math.sin(x/143+i*3)*22+rnd()*20]);
 const d=path([...rough(top,86+i,3,2.8,false),[1610,180],[-10,180]]);
 const fib=path([...rough(top.map(([x,y])=>[x,y-3-rnd()*10]),281+i,2.8,2,false),[1610,180],[-10,180]]);
 // Separate edge mask lets the new section continue underneath without a solid SVG band.
 save(`seam-${i+1}-mask.svg`,1600,170,`<path d="${d}" fill="white"/>`);
 save(`seam-${i+1}-fiber.svg`,1600,170,`<defs><mask id="m"><path d="${fib}" fill="white"/><path d="${d}" fill="black"/></mask><pattern id="g" width="8" height="7" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".7" fill="#635849"/></pattern></defs><g mask="url(#m)"><rect width="1600" height="170" fill="#e2d9c8"/><rect width="1600" height="170" fill="url(#g)" opacity=".22"/></g>`);
}
const scrap=rough([[3,8],[90,3],[182,7],[298,3],[296,93],[177,97],[93,92],[2,97]],78,3,1.6);
save('scrap-mask.svg',300,100,`<path d="${path(scrap)}" fill="white"/>`);
const photo=rough([[1,2],[86,1],[172,3],[299,1],[298,132],[300,260],[298,399],[180,398],[95,400],[1,398],[2,261],[0,138]],119,3,1.1);
save('photo-mask.svg',300,400,`<path d="${path(photo)}" fill="white"/>`);
console.log('Paper masks and fiber borders written.');
