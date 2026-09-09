import { mkdirSync, writeFileSync } from 'node:fs';
// Composed paper silhouettes. Each has a different direction and tear rhythm.
// Outer and inner contours are independently distressed; borders vary in width.
const dir = new URL('../public/design/paper-v3/', import.meta.url);
mkdirSync(dir, { recursive: true });
const contours = [
 [[4,43],[160,11],[316,27],[434,6],[610,35],[794,18],[995,52],[975,195],[996,233],[967,278],[987,475],[848,489],[713,468],[585,495],[371,466],[227,484],[18,449],[38,329],[7,265]],
 [[0,63],[112,47],[238,61],[341,28],[442,40],[578,15],[752,38],[876,12],[999,29],[978,167],[995,230],[972,364],[996,471],[844,478],[715,456],[620,491],[476,466],[284,481],[172,454],[0,474],[23,352],[9,283]],
 [[35,0],[241,19],[356,7],[585,25],[765,3],[982,31],[973,114],[995,192],[976,323],[990,492],[779,480],[654,499],[438,481],[318,498],[11,469],[30,358],[8,212]],
 [[9,24],[187,9],[351,26],[512,2],[696,29],[872,8],[989,31],[978,172],[999,238],[978,328],[989,473],[835,491],[613,474],[444,499],[211,477],[10,489],[29,354],[3,180]],
 [[7,32],[201,14],[346,32],[534,8],[718,21],[983,4],[972,175],[992,260],[971,479],[812,493],[584,475],[366,497],[215,483],[14,498],[26,287]]
];
function rough(points,seed,depth=2){let s=seed;const rand=()=>((s=(s*1664525+1013904223)>>>0)/4294967296);const out=[];points.forEach((a,i)=>{const b=points[(i+1)%points.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),n=Math.ceil(len/3);for(let j=0;j<n;j++){const t=j/n,v=j?(rand()-.5)*depth*2:0;out.push([a[0]+dx*t-dy/len*v,a[1]+dy*t+dx/len*v]);}});return out;}
const path=p=>'M'+p.map(a=>a.map(v=>v.toFixed(1)).join(',')).join('L')+'Z';
const save=(name,body)=>writeFileSync(new URL(name,dir),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500" preserveAspectRatio="none">${body}</svg>`);
contours.forEach((p,i)=>{
 const outside=path(rough(p,12+i,2.3));
 // 5–23px of exposed paper, changing along each side rather than a stroke.
 const inset=p.map(([x,y],j)=>{const edge=9+8*(1+Math.sin(j*2.1+i));return [x+(x<500?edge:-edge),y+(y<250?edge*.65:-edge*.85)];});
 const inside=path(rough(inset,93+i,1.7));
 save(`work-${i+1}-outer.svg`,`<path d="${outside}" fill="white"/>`);
 save(`work-${i+1}-mask.svg`,`<path d="${inside}" fill="white"/>`);
 save(`work-${i+1}-frame.svg`,`<defs><mask id="m"><path d="${outside}" fill="white"/><path d="${inside}" fill="black"/></mask><linearGradient id="p" x2=".8" y2="1"><stop stop-color="#e8e0cf"/><stop offset=".4" stop-color="#bdb19c"/><stop offset=".46" stop-color="#f2eadb"/><stop offset="1" stop-color="#d6c9b5"/></linearGradient><pattern id="g" width="9" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".8" fill="#4e493e"/><path d="M6 0l-1 4" stroke="#665d4b" stroke-width=".5"/></pattern></defs><g mask="url(#m)"><path d="${outside}" fill="url(#p)"/><path d="${outside}" fill="url(#g)" opacity=".24"/></g>`);
});
console.log('Five layered paper compositions generated.');
