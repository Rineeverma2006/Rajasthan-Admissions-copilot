type Request = { method?: string; body?: unknown }
type Response = { status: (code:number)=>Response; json: (data:unknown)=>void; setHeader: (name:string,value:string)=>void }

type CollegeRow = {
  id: string
  college_name: string
  city: string
  branch: string
  annual_fee: number | null
  cutoff_rank: number
  cutoff_year: number
  counselling: string
  source_url: string
  verified_at: string | null
  category: string | null
  quota: string | null
  round: string | null
}

export default async function handler(req: Request, res: Response) {
  res.setHeader("Cache-Control", "no-store")
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })
  const body = req.body as { rank?: unknown; branch?: unknown; city?: unknown; budget?: unknown; counselling?: unknown; category?: unknown } | undefined
  const rank = Number(body?.rank), budget = Number(body?.budget ?? 500000)
  const branch = typeof body?.branch === "string" ? body.branch.trim() : ""
  const city = typeof body?.city === "string" ? body.city.trim() : ""
  const counselling = typeof body?.counselling === "string" ? body.counselling.trim() : "REAP"
  const category = typeof body?.category === "string" ? body.category.trim().toUpperCase() : "GEN"
  const allowedCategories = ["SC","ST","OBC","TSP","MBC","EWS","GEN","FSC","FST","FOBC","FTSP","FMBC","FEWS","FGEN"]
  if (!allowedCategories.includes(category)) return res.status(400).json({ error: "Choose a valid REAP category." })
  if (!Number.isInteger(rank) || rank < 1 || rank > 10000000) return res.status(400).json({ error: "Rank must be a positive whole number." })
  if (!Number.isFinite(budget) || budget < 0) return res.status(400).json({ error: "Budget must be zero or higher." })
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(503).json({ error: "Database is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel." })
  try {
    const params = new URLSearchParams({ select: "id,college_name,city,branch,annual_fee,cutoff_rank,cutoff_year,counselling,source_url,verified_at,category,quota,round", counselling: `eq.${counselling}`, or: `(annual_fee.lte.${budget},annual_fee.is.null)`, cutoff_rank: "not.is.null", order: "cutoff_year.desc", limit: "500" })
    params.set("category", `eq.${category}`)
    if (branch) params.set("branch", `eq.${branch}`)
    if (city) params.set("city", `eq.${city}`)
    const r = await fetch(`${url}/rest/v1/college_programs?${params}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
    if (!r.ok) return res.status(502).json({ error: "Could not retrieve college records from the database." })
    let rows = await r.json() as CollegeRow[]
    if (rows.length === 0 && category === "GEN" && (!city || /jodhpur/i.test(city))) {
      // Limited MBM University REAP-2022 indicative merit; category/quota/round are not available.
      const source = "https://api.mbm.ac.in/assets/a2e441bd-a951-43e1-bd27-3bbf04085766.pdf"
      const historic: Array<[string,number]> = [["CSE",476],["AI & Data Science",1632],["Chemical",3261],["Civil",4402],["Electrical",3998],["ECE",1986],["IT",643],["Mechanical",3667],["Mining",4411],["Petroleum",3731],["Production & Industrial",3711]]
      const aliases: Record<string,string[]> = {"CSE":["cse","computer science","computer science and engineering"],"AI & Data Science":["ai & data science","ai","artificial intelligence and data science"],"ECE":["ece","electronics and communication","electronics & communication"],"IT":["it","information technology"]}
      rows = historic.filter(([b]) => !branch || b.toLowerCase() === branch.toLowerCase() || (aliases[b] || []).some(a => a === branch.toLowerCase())).map(([b,cutoff],i) => ({id:String(-2400-i),college_name:"MBM University",city:"Jodhpur",branch:b,annual_fee:null,cutoff_rank:cutoff,cutoff_year:2022,counselling:"REAP",source_url:source,verified_at:null,category:null,quota:null,round:null}))
    }
    const results = rows.filter(c => Number(c.cutoff_rank) > 0).map(c => {
      const historical = !c.verified_at || Number(c.cutoff_year) < 2025
      const historicalNote = Number(c.cutoff_year) === 2019
        ? `REAP 2019 Round 1 historical cutoff from the uploaded PDF. Category: ${c.category ?? "not available"}; quota/type: ${c.quota ?? "not available"}. This record has not been independently verified in this app and is not a current-year admission prediction. Annual fee is unknown.`
        : c.college_name === "MBM University" && Number(c.cutoff_year) === 2022
          ? "Published MBM University REAP-2022 indicative merit only. Source says values are candidate self-declared and not verified by the Admission Office. Category, quota, round and fee are unavailable. This is not a verified closing rank or current-year admission prediction."
          : `Historical cutoff record for ${c.cutoff_year}. It is not a current-year admission prediction or guarantee. Annual fee is ${c.annual_fee == null ? "unknown" : "shown as listed"}.`
      const ratio = rank / Number(c.cutoff_rank)
      const fit = historical ? "Historical reference" : (ratio <= 0.85 ? "Likely" : ratio <= 1.15 ? "Possible" : "Stretch")
      return { ...c, fit, note: `Your entered rank: ${rank.toLocaleString()}. ${historicalNote}` }
    }).sort((a,b) => a.cutoff_year-b.cutoff_year || a.college_name.localeCompare(b.college_name) || a.cutoff_rank-b.cutoff_rank)
    const hasHistorical = results.some(c => !c.verified_at || Number(c.cutoff_year) < 2025)
    const disclaimer = "Results are historical references, not current-year admission predictions. REAP 2019 entries represent Round 1 category-wise ranks from the uploaded cutoff PDF and have not been independently verified in this app. Annual fees are unknown for these rows. Actual allotment depends on the applicable year, category, quota, round, seat availability and counselling rules."
    return res.status(200).json({ results, count: results.length, dataStatus: results.length ? (hasHistorical ? "historical_published_benchmark" : "historical_database_records") : "no_matching_records", disclaimer })
  } catch {
    return res.status(502).json({ error: "Database request failed. Please try again." })
  }
}
