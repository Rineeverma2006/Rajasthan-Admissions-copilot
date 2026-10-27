import { COLLEGES, College } from '../data/colleges'
export interface Input{rank:number;branch:string;city:string;budget:number}
export interface Result{college:College;fit:'Likely'|'Possible'|'Stretch';reasons:string[]}
// Deterministic demo logic (NOT ML). Compares rank to a sample cutoff.
export function recommend(i:Input):Result[]{
  const out:Result[]=[]
  for(const c of COLLEGES){
    if(i.branch&&!c.branches.includes(i.branch))continue
    if(i.city&&c.city!==i.city)continue
    if(c.feeSample>i.budget)continue
    const r=i.rank/c.cutoffSample
    const fit=r<=0.85?'Likely':r<=1.15?'Possible':'Stretch'
    out.push({college:c,fit,reasons:[`Your rank ${i.rank.toLocaleString()} vs sample cutoff ${c.cutoffSample.toLocaleString()}`,`Sample fee Rs ${c.feeSample.toLocaleString()}/yr is within budget`,i.branch?`Offers ${i.branch}`:'All branches considered']})
  }
  const o={Likely:0,Possible:1,Stretch:2};return out.sort((a,b)=>o[a.fit]-o[b.fit])
}
