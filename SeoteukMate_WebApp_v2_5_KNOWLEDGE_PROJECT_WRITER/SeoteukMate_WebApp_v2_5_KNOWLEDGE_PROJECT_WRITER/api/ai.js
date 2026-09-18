export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'POST only'});
  const key=process.env.GEMINI_API_KEY;if(!key)return res.status(500).json({error:'GEMINI_API_KEY not configured'});
  const {prompt,image}=req.body||{};if(!prompt)return res.status(400).json({error:'prompt required'});
  const parts=[{text:String(prompt)}];if(image?.data)parts.push({inline_data:{mime_type:image.mimeType||'image/jpeg',data:image.data}});
  try{const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({contents:[{parts}]})});const d=await r.json();if(!r.ok)return res.status(r.status).json({error:d?.error?.message||'Gemini error'});const text=(d.candidates?.[0]?.content?.parts||[]).map(x=>x.text||'').join('\n').trim();return res.status(200).json({text});}catch(e){return res.status(500).json({error:e.message});}
}
