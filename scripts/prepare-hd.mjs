import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
const videos=JSON.parse(fs.readFileSync('src/content/videos.json','utf8'));
const dir='public/media/hd';fs.mkdirSync(dir,{recursive:true});
const run=(cmd,args)=>new Promise((resolve,reject)=>{const p=spawn(cmd,args,{stdio:['ignore','ignore','inherit']});p.on('error',reject);p.on('close',code=>code===0?resolve():reject(new Error(cmd+' exited '+code)));});
const queue=[...videos];
async function worker(){while(queue.length){const v=queue.shift(),out=path.join(dir,v.slug+'.mp4');if(fs.existsSync(out)&&fs.statSync(out).size>10000)continue;const temp=path.join(os.tmpdir(),v.slug+'-source.mp4');try{
await run('curl',['-fLsS','--retry','3','--max-time','900','https://drive.usercontent.google.com/download?id='+v.id+'&export=download&confirm=t','-o',temp]);
let first=fs.openSync(temp,'r'),head=Buffer.alloc(20);fs.readSync(first,head,0,20,0);fs.closeSync(first);if(head.toString().includes('<!DOCTYPE')||head.toString().includes('<html')){const html=fs.readFileSync(temp,'utf8');const params=new URLSearchParams([...html.matchAll(/name="([^"]+)" value="([^"]+)"/g)].map(m=>[m[1],m[2]]));if(!params.has('id'))throw Error('Drive download unavailable: '+v.slug);await run('curl',['-fLsS','--retry','3','--max-time','900','https://drive.usercontent.google.com/download?'+params,'-o',temp]);}
await run('ffmpeg',['-y','-hide_banner','-loglevel','error','-threads','2','-i',temp,'-vf',"scale='if(gte(iw,ih),-2,1080)':'if(gte(iw,ih),1080,-2)'",'-c:v','libx264','-preset','fast','-crf','21','-maxrate','8M','-bufsize','16M','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',out]);console.log('1080p ready:',v.slug);
}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}}}
await Promise.all([worker(),worker(),worker()]);
