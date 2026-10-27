// Local rule-based assistant. Replace reply() with a fetch() to a RAG backend later.
const KB:{k:string[];a:string}[]=[
{k:['document'],a:'Commonly requested: class 10/12 marksheets, entrance scorecard, category certificate (if applicable), ID proof, photographs, transfer certificate. The exact list varies by year.'},
{k:['rank','evaluate'],a:'Compare your rank with historical cutoffs for each college-branch and group choices into stretch, possible and safe. Cutoffs change every year.'},
{k:['choice','before'],a:'Check eligibility, fees, branch versus college priority, past cutoff trend, location and hostel cost, and the official choice-filling schedule.'},
{k:['compare'],a:'Compare fees, location, branch availability and cutoff history side by side on the Explore page.'},
{k:['allotment','factor'],a:'Allotment depends on rank, category, seat availability, your choice order and the number of rounds.'},
{k:['scholarship'],a:'Check the official state and central scholarship portals and your college for schemes matching your category and income.'}]
export function reply(q:string){const l=q.toLowerCase();const h=KB.find(e=>e.k.some(w=>l.includes(w)))
 return h?h.a+'\n\nDemo answer from a small built-in knowledge base, not a live official source. Verify on the official REAP/DTE portal.':'I have no demo answer for that. Time-sensitive details such as dates and fees must be verified on the official admission portal.'}
export const SUGGESTED=['What documents are required?','How should I evaluate colleges using my rank?','What factors affect allotment?','How can I find scholarship information?']
