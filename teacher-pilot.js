/* Seoteuk Mate v2.7 Teacher Pilot — evidence-first pilot layer */
(function(){
'use strict';
const V='2.7.1', METRIC_KEY='seoteukMate.pilotMetrics.v27', PREF_KEY='seoteukMate.pilotPrefs.v27';
let knowledgePromise=null, originalDraft='', bulkCancel=false;
const ACTION_RX=/(질문|확인|비교|분석|검토|설명|토론|수정|구성|작성|발표|제안|참여|탐구|적용|해석|조율|피드백|선택|분류|요약|근거|인용|반론|재구성|찾아|정리)/g;
const VAGUE_RX=/(열심히|잘함|잘 함|적극적|성실|우수|탁월|좋았|훌륭|관심이 많|노력함)/g;
const STRONG_RX=/(매우\s*탁월|탁월함|탁월한|완벽|압도적|최고|전문가\s*수준|우수함|우수한|완성도\s*높|주도적|주도함|급우들의\s*이해|청중과\s*상호작용|뛰어난|돋보임|학문적\s*태도|역량을\s*(?:보임|나타냄|드러냄)|역량이\s*(?:우수|뛰어|돋보))/g;
function norm(s){return String(s||'').replace(/\s+/g,' ').trim();}
function toks(s){return [...new Set((norm(s).toLowerCase().match(/[가-힣a-z0-9]{2,}/g)||[]).filter(x=>!['학생','수업','활동','교과','관련','통해','내용','대한','있는','과정'].includes(x)))];}
function toast(m,t='info'){window.showToast?.(m,t);}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function family(s){s=norm(s);if(/한국사|세계사|동아시아사|역사/.test(s))return'history';if(/국어|문학|독서|언어|매체/.test(s))return'korean';if(/수학|미적분|확률|통계|기하/.test(s))return'math';if(/물리|화학|생명|지구|과학/.test(s))return'science';if(/사회|경제|정치|법|윤리|지리/.test(s))return'social';return'common';}
function recordMetric(type,data={}){try{const a=JSON.parse(localStorage.getItem(METRIC_KEY)||'[]');a.push({type,ts:Date.now(),...data});localStorage.setItem(METRIC_KEY,JSON.stringify(a.slice(-800)));}catch(_){}}
function getPrefs(){try{return JSON.parse(localStorage.getItem(PREF_KEY)||'{}')||{};}catch(_){return{};}}
function savePrefs(p){try{localStorage.setItem(PREF_KEY,JSON.stringify(p));}catch(_){}}
window.__pilotV27={version:V,recordMetric};
function analyzeObservation(text){
 const s=norm(text), actions=(s.match(ACTION_RX)||[]), vague=(s.match(VAGUE_RX)||[]), issues=[];
 if(!s)issues.push('관찰 기록이 비어 있습니다.');
 if(s.length<12)issues.push('관찰 기록이 너무 짧습니다.');
 if(actions.length===0)issues.push('질문·비교·확인·설명·수정처럼 교사가 실제로 본 행동이 필요합니다.');
 if(vague.length && actions.length<2)issues.push('“열심히/잘함/적극적” 대신 실제 행동을 한 가지 더 적어 주세요.');
 const concrete=actions.length>=2 || (actions.length>=1&&s.length>=28);
 return {pass:issues.length===0&&concrete,issues,actions:actions.length,vague:vague.length,length:s.length};
}
window.__pilotAnalyzeObservation=analyzeObservation;
function evidenceBox(){
 let box=document.getElementById('pilot-evidence-box'); if(box)return box;
 const input=document.getElementById('input-chat'); if(!input)return null;
 box=document.createElement('div');box.id='pilot-evidence-box';box.className='hidden mt-2 p-3 rounded-2xl border text-[11px] leading-5';
 input.parentElement?.parentElement?.insertAdjacentElement('beforeend',box);return box;
}
function showEvidenceGate(r){
 const b=evidenceBox();if(!b)return;
 b.className='mt-2 p-3 rounded-2xl border text-[11px] leading-5 '+(r.pass?'bg-emerald-50 border-emerald-200 text-emerald-900':'bg-amber-50 border-amber-200 text-amber-950');
 b.innerHTML=r.pass?'<b>✅ 생성 가능한 관찰 근거</b> · 구체적 행동이 확인됩니다.':`<b>⚠️ 생성 전에 관찰을 조금 더 구체화하세요.</b><ul class="list-disc pl-4 mt-1">${r.issues.map(x=>'<li>'+esc(x)+'</li>').join('')}</ul><div class="mt-1 text-amber-800">예: “자료조사 잘함” → “서로 다른 두 자료의 주장 차이를 표시하고, 근거가 약한 문장을 스스로 수정함.”</div>`;
}
window.runPilotEvidencePrecheck=()=>{const r=analyzeObservation(document.getElementById('input-chat')?.value||'');showEvidenceGate(r);return r;};
function ensureKnowledgePack(){
 if(Array.isArray(window.__SEOTEUK_DEFAULT_KNOWLEDGE)&&window.__SEOTEUK_DEFAULT_KNOWLEDGE.length)return Promise.resolve(window.__SEOTEUK_DEFAULT_KNOWLEDGE);
 if(knowledgePromise)return knowledgePromise;
 const started=performance.now();knowledgePromise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='./knowledge-pack.js';s.async=true;
  s.onload=()=>{recordMetric('knowledge_load',{ms:Math.round(performance.now()-started),chunks:window.__SEOTEUK_DEFAULT_KNOWLEDGE_META?.chunkCount||0});updateKnowledgeStatus();resolve(window.__SEOTEUK_DEFAULT_KNOWLEDGE||[]);};
  s.onerror=()=>{knowledgePromise=null;reject(new Error('기본 지식팩을 불러오지 못했습니다.'));};document.head.appendChild(s);
 });return knowledgePromise;
}
window.ensureKnowledgePackV27=ensureKnowledgePack;
function updateKnowledgeStatus(){
 const e=document.getElementById('v25-pack-status');if(!e)return;const m=window.__SEOTEUK_DEFAULT_KNOWLEDGE_META||{};
 e.innerHTML=`<div class="flex flex-wrap items-center justify-between gap-2"><div><b>📦 기본 지식팩</b> · ${Number(m.chunkCount||0).toLocaleString()}청크 · 필요할 때만 로드됨</div><button type="button" aria-label="기본 지식팩 자료목록" onclick="ensureKnowledgePackV27().then(()=>openDefaultKnowledgeSources())" class="font-black underline">자료목록</button></div><div class="mt-1 text-emerald-700">세특 생성의 사실 근거가 아니라 탐구 아이디어 참고용입니다.</div>`;
}
function numberRisks(draft,obs){const a=(String(draft).match(/\d+(?:[.,]\d+)?%?/g)||[]),b=new Set((String(obs).match(/\d+(?:[.,]\d+)?%?/g)||[]));return a.filter(x=>!b.has(x));}
function hypotheticalFactRisk(draft,question){const q=String(question||'');if(!/(라면|다면|일까|인가|여부|가능성)/.test(q))return false;return /(나타난|존재한|확인된|드러난|발생한)\s*(차이|괴리|영향|원인)|사이에\s*(?:나타난|확인된|드러난)\s*차이|사이에\s*차이가\s*[^,.]{0,10}(?:발생|있었|존재|나타|확인|드러)/.test(String(draft||''));}
function questionToRecord(question){
 let q=norm(question).replace(/[?？]+$/,'');
 q=q.replace(/인가$/,'인지').replace(/는가$/,'는지').replace(/한가$/,'한지').replace(/일까$/,'인지').replace(/까$/,'지');
 return q?('활동 후 '+q+' 질문함.'):'';
}
function canonicalizeQuestionSentence(txt,question){
 const safe=questionToRecord(question);if(!safe)return txt;
 let parts=String(txt||'').split(/(?<=함\.|됨\.|임\.|보임\.|나타냄\.|드러냄\.)\s+/).filter(Boolean);
 const idx=parts.findLastIndex(s=>/(질문|의문|후속|탐구를\s*확장)/.test(s));
 if(idx>=0)parts[idx]=safe;else parts.push(safe);
 return parts.join(' ').replace(/\s+/g,' ').trim();
}
function draftRisk(draft,obs){
 const ot=toks(obs), sentences=String(draft||'').split(/(?<=[.!?]|함\.|됨\.|임\.)\s+|\n+/).filter(Boolean);let inference=0;
 for(const s of sentences){const st=toks(s);if(st.length&&st.filter(x=>ot.includes(x)).length===0)inference++;}
 const strong=(draft.match(STRONG_RX)||[]).filter(x=>!String(obs).includes(x)), nums=numberRisks(draft,obs);
 return {risk:strong.length>0||nums.length>0||inference>Math.max(1,Math.floor(sentences.length/2)),strong,nums,inference,total:sentences.length};
}
window.__pilotDraftRisk=draftRisk;
function setPilotRisk(r){window.__pilotRiskState=r;const b=document.getElementById('pilot-risk-banner');if(!b)return;
 b.className='mb-2 p-2.5 rounded-xl border text-xs '+(r?.risk?'bg-rose-50 border-rose-200 text-rose-900':'bg-emerald-50 border-emerald-200 text-emerald-900');
 b.innerHTML=r?.risk?`<b>⛔ 근거 밖 확장 가능성</b> · 교사 검토 전 복사/내보내기 잠금 (${r.inference}/${r.total}문장 추론 가능)`:'<b>✅ 근거 연결 1차 확인</b> · 최종 사실 확인은 교사가 수행합니다.';
}
async function conservativeRewrite(txt,obs,subject){
 const r=draftRisk(txt,obs);if(!r.risk)return txt;
 const p=`다음은 ${subject} 학교생활기록부 초안이다. 실제 교사 관찰은 아래 입력뿐이다. 관찰에 없는 평가·성과·역할·수치·청중 반응을 모두 제거하고, 직접 확인되는 행동과 그 행동에서 최소한으로 드러나는 사고과정만 보수적으로 윤문하라. 학생이 가정형 질문이나 가능성으로 제기한 내용은 확정된 사실로 바꾸지 말고 반드시 ‘…라는 질문을 제기함’처럼 질문 상태로 남긴다. 새 사실을 절대 추가하지 않는다. 결과 본문만 출력한다.\n\n[교사 관찰 및 근거]\n${obs}\n\n[초안]\n${txt}`;
 try{return await window.__requestAI(p);}catch(_){return txt;}
}
async function preserveHypotheticalQuestion(txt,question,subject){
 if(!question||!hypotheticalFactRisk(txt,question))return txt;
 const p=`다음 ${subject} 학교생활기록부 초안에서 학생의 후속 질문 전제가 확정 사실처럼 바뀌었다. 다른 문장은 새 사실 없이 최대한 유지하고, 후속 질문 부분만 고쳐라.\n\n[학생이 실제 제기한 질문]\n${question}\n\n강제 규칙:\n- 질문 속 ‘라면/다면/있었다면/가능성’ 같은 조건 표현을 삭제하거나 사실로 확정하지 않는다.\n- ‘차이가 나타남/발생함/존재함’처럼 질문의 전제를 사실로 단정하지 않는다.\n- 후속 부분은 “...있었다면 ...인지 질문함” 또는 “...라는 질문을 제기함”처럼 질문 상태로 끝낸다.\n- 결과 본문만 출력한다.\n\n[초안]\n${txt}`;
 try{return await window.__requestAI(p);}catch(_){return txt;}
}
async function strictQuickGenerate(){
 const input=document.getElementById('input-chat'), msg=norm(input?.value), subject=window.activeSubject||document.getElementById('subject-select')?.value||'';
 const gate=analyzeObservation(msg);showEvidenceGate(gate);if(!gate.pass){recordMetric('quick_block',{reason:'evidence',chars:msg.length});toast('근거가 부족해 생성을 멈췄습니다. 관찰 행동을 조금 더 구체화해 주세요.','warning');return;}
 if(!subject){toast('과목을 먼저 선택하세요.','warning');return;}
 window.__lastObservationV3=msg;window.appendChatMessage?.('user',msg);if(input)input.value='';
 const rules=(window.getActiveSeoteukRules?.(subject,document.getElementById('input-career')?.value||'')||[]).map(r=>r.text||'').join('\n');
 const off=(window.getOfficial2026Rules?.(window.activeCategory||'교과세특')||[]).map(r=>r.text||'').join('\n');
 const prompt=`고등학교 교사가 2026 학교생활기록부 초안을 윤문 보조용으로 작성한다. 과목: ${subject}.\n실제 교사 관찰: ${msg}\n\n[공식 규칙]\n${off}\n[교과 규칙]\n${rules}\n\n강제: 관찰에 없는 사실·자료명·도서·논문·수치·역할·성과·청중반응·최상급 평가를 추가하지 않는다. “열심히/잘함”을 임의로 “탁월함/우수함/완성도 높음”으로 확대하지 않는다. 관찰에서 확인되는 행동→사고과정 중심으로 한국어 개조식 종결형, 1,500바이트 이내 본문만 출력한다.`;
 const btn=document.getElementById('btn-send-chat'),t=performance.now();if(btn){btn.disabled=true;btn.textContent='근거 확인 후 생성 중…';}
 try{
  let txt=await window.__requestAI(prompt);txt=await conservativeRewrite(txt,msg,subject);const r=draftRisk(txt,msg);
  originalDraft=txt;window.__pilotOriginalDraft=txt;setPilotRisk(r);window.appendChatMessage?.('assistant',txt);window.setCurrentText?.(txt);
  const ta=document.getElementById('seoteuk-textarea');if(ta)ta.value=txt;window.updateNeisStats?.();window.__markOfficialDraft?.('v2.7 Teacher Pilot 생성');window.auditEvidenceLocal?.();
  recordMetric('quick_generate',{ms:Math.round(performance.now()-t),subject:family(subject),inputChars:msg.length,outputChars:txt.length,risk:r.risk,inference:r.inference});
 }catch(e){window.appendChatMessage?.('assistant','⚠️ 생성 실패: '+e.message);toast('AI 연결을 확인하세요. 자동 대체문은 만들지 않았습니다.','warning');recordMetric('quick_error',{message:String(e.message||'').slice(0,80)});}
 finally{if(btn){btn.disabled=false;btn.textContent='생성';}}
}
window.sendChatMessage=strictQuickGenerate;
const originalWriter=window.generateFromSubjectWriter;
window.generateFromSubjectWriter=async function(){
 const obs=document.getElementById('v25-writer-observation')?.value||'', activity=document.getElementById('v25-writer-activity')?.value||'';
 const standard=document.getElementById('v25-writer-standard-text')?.value||document.getElementById('v25-writer-standard-custom')?.value||'';
 const g=analyzeObservation(obs);if(!standard.trim()){toast('성취기준/수업 목표를 먼저 확인하세요.','warning');return;}
 if(!g.pass||norm(activity).length<5){showWriterPilotGate(g,activity);recordMetric('writer_block',{reason:'evidence'});return;}
 const t=performance.now();await originalWriter?.();let txt=document.getElementById('v25-writer-result')?.textContent||document.getElementById('seoteuk-textarea')?.value||'';
 if(txt){const question=document.getElementById('v25-writer-question')?.value||'',subject=document.getElementById('v25-writer-subject')?.value||window.activeSubject||'교과';const support=[obs,activity,document.getElementById('v25-writer-artifact')?.value||'',document.getElementById('v25-writer-source')?.value||'',document.getElementById('v25-writer-role')?.value||'',document.getElementById('v25-writer-growth')?.value||'',question,document.getElementById('v25-writer-notes')?.value||''].join(' ');let r=draftRisk(txt,support),qRisk=hypotheticalFactRisk(txt,question);if(r.risk||qRisk){txt=await conservativeRewrite(txt,support,subject);r=draftRisk(txt,support);qRisk=hypotheticalFactRisk(txt,question);}if(qRisk){txt=await preserveHypotheticalQuestion(txt,question,subject);}txt=canonicalizeQuestionSentence(txt,question);r=draftRisk(txt,support);qRisk=hypotheticalFactRisk(txt,question);const out=document.getElementById('v25-writer-result');if(out)out.textContent=txt;window.setCurrentText?.(txt);const ta=document.getElementById('seoteuk-textarea');if(ta)ta.value=txt;window.updateNeisStats?.();if(qRisk)r={...r,risk:true,hypothetical:true,strong:[...(r.strong||[]),'가정형 질문 사실화']};originalDraft=txt;window.__pilotOriginalDraft=txt;setPilotRisk(r);recordMetric('writer_generate',{ms:Math.round(performance.now()-t),risk:r.risk,hypothetical:qRisk});}
};
function showWriterPilotGate(g,activity){
 let e=document.getElementById('v25-writer-evidence');if(!e)return;e.className='p-3 rounded-2xl border bg-amber-50 border-amber-200 text-xs text-amber-950';
 e.innerHTML='<b>⚠️ Teacher Pilot 생성 잠금</b><ul class="list-disc pl-4 mt-1">'+[...(g.issues||[]),...(norm(activity).length<5?['실제 수업 활동을 구체적으로 입력해 주세요.']:[])].map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
}
const originalKnowledge=window.generateKnowledgeFromVault;
window.generateKnowledgeFromVault=async function(){const r=document.getElementById('knowledge-result');if(r){r.classList.remove('hidden');r.textContent='기본 지식팩을 불러오는 중…';}try{await ensureKnowledgePack();return await originalKnowledge?.();}catch(e){if(r)r.textContent='지식팩 로드 실패: '+e.message;}};
const originalSources=window.openDefaultKnowledgeSources;
window.openDefaultKnowledgeSources=async function(){await ensureKnowledgePack();return originalSources?.();};
function renderPilotBulk(){
 const list=document.getElementById('bulk-student-list');if(!list)return;
 list.innerHTML=(window.bulkStudents||[]).map((x,j)=>`<button type="button" onclick="window.selectedBulkIndex=${j};document.getElementById('bulk-detail-textarea').value=window.bulkStudents[${j}].result||'';document.getElementById('detail-student-header').textContent=(window.bulkStudents[${j}].no||'')+' '+(window.bulkStudents[${j}].name||'');" class="w-full text-left p-2.5 text-xs hover:bg-blue-50 border-b border-slate-100"><div class="flex justify-between gap-2"><b>${esc(x.no)} · ${esc(x.name)}</b><span class="${x.pilotStatus==='완료'?'text-emerald-700':x.pilotStatus==='근거 부족'||x.pilotStatus==='오류'?'text-rose-700':'text-amber-700'} font-black">${esc(x.pilotStatus||'대기')}</span></div><div class="text-[10px] text-slate-500 mt-0.5 truncate">${esc(x.result||x.observation||'기록 없음')}</div></button>`).join('');
 const s=document.getElementById('pilot-bulk-summary');if(s){const a=window.bulkStudents||[],ok=a.filter(x=>analyzeObservation(x.observation).pass).length;s.innerHTML=`총 ${a.length}명 · 생성 가능 ${ok}명 · 근거 보강 필요 ${a.length-ok}명`;}
}
window.stopPilotBulkGeneration=function(){bulkCancel=true;toast('현재 학생 처리 후 일괄 생성을 중지합니다.','warning');};
window.startBulkBatchProcess=async function(){
 const arr=window.bulkStudents||[];if(!arr.length){toast('먼저 엑셀을 업로드하세요.','warning');return;}bulkCancel=false;
 const subject=document.getElementById('bulk-subject')?.value.trim()||window.activeSubject||'',cat=document.getElementById('bulk-category')?.value||'교과세특';
 const btn=document.getElementById('btn-start-bulk');if(btn){btn.disabled=true;btn.textContent='근거 점검 후 생성 중…';}
 for(const s of arr){const g=analyzeObservation(s.observation);s.pilotStatus=g.pass?'대기':'근거 부족';if(!g.pass)s.result='';}
 renderPilotBulk();recordMetric('bulk_start',{count:arr.length,eligible:arr.filter(x=>x.pilotStatus==='대기').length});
 const off=(window.getOfficial2026Rules?.(cat)||[]).map(r=>r.text||'').join('\n'), soft=(window.getActiveSeoteukRules?.(subject,'')||[]).map(r=>r.text||'').join('\n');
 for(let i=0;i<arr.length;i++){if(bulkCancel)break;const s=arr[i];if(s.pilotStatus!=='대기')continue;s.pilotStatus='생성 중';window.selectedBulkIndex=i;renderPilotBulk();
  const p=`고등학교 ${cat} 교사 검토용 초안을 작성한다. 과목/영역: ${subject}. 실제 관찰: ${s.observation}. 희망 진로: ${s.career||'미입력'}.\n[2026 공식 규칙]\n${off}\n[교과 규칙]\n${soft}\n강제: 관찰에 없는 사실·수치·자료명·독서·역할·성과·청중반응·최상급 평가를 만들지 않는다. 실제 관찰 행동과 최소한의 사고과정만 1,500바이트 이내 개조식으로 작성한다. 본문만 출력한다.`;
  const t=performance.now();try{let txt=await window.__requestAI(p);txt=await conservativeRewrite(txt,s.observation,subject);const risk=draftRisk(txt,s.observation);s.result=txt;s.pilotRisk=risk;s.pilotStatus=risk.risk?'검토 필요':'완료';recordMetric('bulk_item',{ms:Math.round(performance.now()-t),status:s.pilotStatus});}
  catch(e){s.result='';s.pilotStatus='오류';s.pilotError=String(e.message||e);recordMetric('bulk_error',{});}renderPilotBulk();
 }
 if(btn){btn.disabled=false;btn.textContent='🚀 일괄 생성';}toast(bulkCancel?'일괄 생성을 중지했습니다.':'일괄 생성 완료 · 근거 부족 학생은 자동으로 건너뛰었습니다.','success');
};
function installBulkPilot(){
 const btn=document.getElementById('btn-start-bulk');if(!btn||document.getElementById('pilot-bulk-summary'))return;
 const box=document.createElement('div');box.className='flex items-center gap-2 flex-wrap';box.innerHTML='<span id="pilot-bulk-summary" class="text-[10px] text-slate-600">엑셀 업로드 후 근거 충족도를 먼저 검사합니다.</span><button type="button" onclick="stopPilotBulkGeneration()" class="px-2 py-1 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-[10px] font-bold">중지</button>';btn.parentElement?.insertAdjacentElement('afterend',box);
 const file=[...document.querySelectorAll('input[type=file]')].find(e=>(e.getAttribute('accept')||'').includes('xlsx'));file?.addEventListener('change',()=>setTimeout(renderPilotBulk,400));
}
function exportPilotFeedback(){
 const data={version:V,exportedAt:new Date().toISOString(),metrics:JSON.parse(localStorage.getItem(METRIC_KEY)||'[]')};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='SeoteukMate_v27_pilot_feedback.json';a.click();URL.revokeObjectURL(a.href);
}
window.exportPilotFeedback=exportPilotFeedback;
function installPilotUI(){
 if(document.getElementById('pilot-stepbar'))return;
 document.body.classList.add('pilot-simple');
 const input=document.getElementById('input-chat');const host=input?.parentElement?.parentElement;
 if(host){const bar=document.createElement('div');bar.id='pilot-stepbar';bar.className='mb-3 p-3 rounded-2xl border border-blue-200 bg-blue-50 no-print';
  bar.innerHTML='<div class="flex items-center justify-between gap-2"><div class="font-black text-blue-950 text-xs">🧑‍🏫 Teacher Pilot · 3단계 작성</div><button id="pilot-advanced-toggle" type="button" class="text-[10px] px-2 py-1 rounded-lg bg-white border border-blue-200 font-bold">고급도구 보기</button></div><div class="grid grid-cols-3 gap-2 mt-2 text-[10px]"><button type="button" data-pilot-step="subject" class="p-2 rounded-xl bg-white border font-bold">1. 과목 확인</button><button type="button" data-pilot-step="obs" class="p-2 rounded-xl bg-white border font-bold">2. 관찰 입력</button><button type="button" data-pilot-step="generate" class="p-2 rounded-xl bg-blue-600 text-white font-black">3. 초안 생성</button></div>';
  host.insertAdjacentElement('afterbegin',bar);bar.querySelector('[data-pilot-step=subject]').onclick=()=>document.getElementById('subject-select')?.focus();bar.querySelector('[data-pilot-step=obs]').onclick=()=>input?.focus();bar.querySelector('[data-pilot-step=generate]').onclick=()=>strictQuickGenerate();bar.querySelector('#pilot-advanced-toggle').onclick=toggleAdvanced;
 }
 const editor=document.getElementById('tab-content-editor');if(editor&&!document.getElementById('pilot-risk-banner')){const b=document.createElement('div');b.id='pilot-risk-banner';b.className='hidden';editor.prepend(b);}
 installDiffModal();installFeedback();installBulkPilot();installSaveBadge();applyAccessibility();applyLastSubject();cleanupVersionText();updateKnowledgeStatus();
}
function toggleAdvanced(){
 const simple=document.body.classList.toggle('pilot-simple');document.getElementById('pilot-advanced-toggle').textContent=simple?'고급도구 보기':'간단모드로';
 const p=getPrefs();p.advanced=!simple;savePrefs(p);recordMetric('advanced_toggle',{advanced:!simple});
}
function markAdvancedTargets(){
 ['left-tab-macro','btn-history-newspaper','tab-btn-coordinator','tab-btn-interview','btn-v25-projects'].forEach(id=>document.getElementById(id)?.classList.add('pilot-advanced-target'));
 const texts=['꼬리물기','근거·맥락 보강','추천도서 연계','1,500B 정밀 완충','교과 맞춤 근거 보강','AI 면접 진행'];
 document.querySelectorAll('button').forEach(b=>{if(texts.some(t=>(b.innerText||'').includes(t)))b.classList.add('pilot-advanced-target');});
}
function installStyles(){
 const s=document.createElement('style');s.id='pilot-v27-style';s.textContent=`
 body.pilot-simple .pilot-advanced-target{display:none!important}
 html,body{max-width:100%;overflow-x:hidden}
 .pilot-save-badge{font-size:10px}
 @media(max-width:767px){
  html,body,.viewport-container,#app,.panel-left,.panel-right{max-width:100vw!important;min-width:0!important;width:100%!important;overflow-x:hidden!important}
  header{min-height:auto!important;height:auto!important;padding:4px 8px!important;gap:6px!important;flex-wrap:nowrap!important}
  header>div{max-width:100%!important;flex-wrap:nowrap!important;gap:4px!important}
  header>div:first-child{min-width:0!important;flex:1 1 auto!important}
  header>div:first-child>div:last-child{min-width:0!important}
  header h1{font-size:12px!important;white-space:nowrap!important}
  header h1+span{display:none!important}
  header>div:last-child>label,#btn-launch-antigravity,#btn-toggle-eval-mode{display:none!important}
  header>div:last-child button:not(#btn-v25-writer):not(#btn-header-ai-indicator):not(#btn-cloud-account){display:none!important}
  #btn-header-ai-indicator{padding:4px 6px!important}
  #btn-cloud-account{padding:4px 6px!important}
  .panel-left,.panel-right{position:relative!important;left:auto!important;right:auto!important}
  input,textarea,select{max-width:100%!important}
  #pilot-mobile-bar{display:flex!important}
 }
 @media(min-width:768px){#pilot-mobile-bar{display:none!important}}
 `;document.head.appendChild(s);
 const mb=document.createElement('div');mb.id='pilot-mobile-bar';mb.className='hidden fixed bottom-0 inset-x-0 z-[90] bg-white border-t p-2 gap-2 no-print';
 mb.innerHTML='<button class="flex-1 py-2 rounded-xl border font-bold text-xs" onclick="document.getElementById(\'input-chat\')?.focus()">관찰 입력</button><button class="flex-1 py-2 rounded-xl bg-blue-600 text-white font-black text-xs" onclick="sendChatMessage()">초안 생성</button><button class="flex-1 py-2 rounded-xl border font-bold text-xs" onclick="openOfficial2026Check()">검토</button>';document.body.appendChild(mb);
}
function applyAccessibility(){
 document.querySelectorAll('button').forEach((b,i)=>{const txt=norm(b.innerText);if(!b.getAttribute('aria-label')){const map={'btn-v25-writer':'교과별 작성기','btn-v25-projects':'프로젝트 카드','btn-official-2026':'2026 기재요령','btn-toggle-eval-mode':'근거 검토 모드','btn-google-tts-play':'문장 읽어주기','btn-cloud-account':'클라우드 계정'};b.setAttribute('aria-label',b.title||map[b.id]||txt||('버튼 '+(i+1)));}if(!b.title&&b.getAttribute('aria-label'))b.title=b.getAttribute('aria-label');});
 document.querySelectorAll('input,textarea,select').forEach((e,i)=>{if(!e.getAttribute('aria-label'))e.setAttribute('aria-label',e.placeholder||e.id||('입력 '+(i+1)));});
 document.querySelectorAll('[id*="modal"]').forEach(m=>{m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const ms=[...document.querySelectorAll('[role=dialog]')].filter(x=>!x.classList.contains('hidden'));const m=ms.at(-1);m?.querySelector('button[aria-label*="닫"],button[title*="닫"],button')?.click();}if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();strictQuickGenerate();}});
}
function applyLastSubject(){
 const sel=document.getElementById('subject-select'),p=getPrefs();if(!sel)return;if(p.lastSubject&&[...sel.options].some(o=>o.value===p.lastSubject||o.text===p.lastSubject)){sel.value=p.lastSubject;window.handleSubjectChange?.(p.lastSubject);}
 sel.addEventListener('change',()=>{const q=getPrefs();q.lastSubject=sel.value;savePrefs(q);});
}
function cleanupVersionText(){
 document.title='Seoteuk Mate P.O.H.A.N.G v2.7.1 Teacher Pilot';
 document.querySelectorAll('body *').forEach(e=>{if(e.children.length===0&&typeof e.textContent==='string'&&e.textContent.includes('v2.5'))e.textContent=e.textContent.replaceAll('v2.5','v2.7');});
 const sub=[...document.querySelectorAll('header *')].find(e=>(e.textContent||'').includes('v2.6 GITHUB READY'));if(sub)sub.textContent=(sub.textContent||'').replace('v2.6 GITHUB READY','v2.7.1 TEACHER PILOT');
}
function installSaveBadge(){
 const h=document.querySelector('header > div:last-child');if(!h||document.getElementById('pilot-save-badge'))return;const b=document.createElement('span');b.id='pilot-save-badge';b.className='pilot-save-badge px-2 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold';b.textContent='로컬 저장됨';h.appendChild(b);
 let timer;document.addEventListener('input',e=>{if(!e.target.matches('input,textarea,select'))return;b.textContent='저장 중…';clearTimeout(timer);timer=setTimeout(()=>b.textContent='로컬 저장됨',650);});
}
function installDiffModal(){
 if(document.getElementById('pilot-diff-modal'))return;const d=document.createElement('div');d.id='pilot-diff-modal';d.className='hidden fixed inset-0 z-[190] bg-slate-950/60 p-3 items-center justify-center no-print';d.innerHTML='<div class="bg-white rounded-3xl w-full max-w-5xl max-h-[88vh] overflow-hidden flex flex-col"><div class="p-4 border-b flex justify-between"><b>🔎 AI 원문 ↔ 교사 수정본 비교</b><button onclick="closePilotDiff()" aria-label="비교 창 닫기" class="px-3">✕</button></div><div class="grid md:grid-cols-2 gap-3 p-4 overflow-auto"><div><b class="text-xs">AI 원문</b><pre id="pilot-diff-original" class="mt-2 p-3 bg-slate-50 rounded-xl whitespace-pre-wrap text-xs"></pre></div><div><b class="text-xs">현재 수정본</b><pre id="pilot-diff-current" class="mt-2 p-3 bg-blue-50 rounded-xl whitespace-pre-wrap text-xs"></pre></div></div></div>';document.body.appendChild(d);
 window.openPilotDiff=()=>{document.getElementById('pilot-diff-original').textContent=originalDraft||'기록된 AI 원문 없음';document.getElementById('pilot-diff-current').textContent=window.getCurrentText?.()||document.getElementById('seoteuk-textarea')?.value||'';d.classList.remove('hidden');d.classList.add('flex');};window.closePilotDiff=()=>{d.classList.add('hidden');d.classList.remove('flex');};
 const banner=document.getElementById('official-ai-draft-banner');if(banner){const x=document.createElement('button');x.type='button';x.onclick=window.openPilotDiff;x.className='ml-2 px-2 py-1 rounded-lg border bg-white text-[10px] font-bold';x.textContent='AI 원문 비교';banner.appendChild(x);}
}
function installFeedback(){
 const ta=document.getElementById('seoteuk-textarea');if(!ta||document.getElementById('pilot-feedback'))return;const box=document.createElement('div');box.id='pilot-feedback';box.className='mt-3 p-3 rounded-2xl border border-violet-200 bg-violet-50 no-print';
 box.innerHTML='<div class="flex flex-wrap items-center gap-2"><b class="text-xs text-violet-950">🧪 파일럿 피드백</b><button data-v="good" class="px-2 py-1 bg-white border rounded-lg text-[10px] font-bold">👍 그대로 쓸 만함</button><button data-v="edit" class="px-2 py-1 bg-white border rounded-lg text-[10px] font-bold">△ 많이 수정</button><button data-v="bad" class="px-2 py-1 bg-white border rounded-lg text-[10px] font-bold">👎 못 씀</button><select id="pilot-feedback-reason" class="p-1 border rounded-lg text-[10px]"><option value="">이유 선택</option><option>과장</option><option>사실오류</option><option>근거부족</option><option>문체</option><option>너무김</option><option>너무짧음</option><option>기타</option></select><button onclick="openPilotDiff()" class="px-2 py-1 rounded-lg bg-white border text-[10px] font-bold">AI 원문 비교</button><button onclick="exportPilotFeedback()" class="ml-auto px-2 py-1 rounded-lg bg-violet-700 text-white text-[10px] font-bold">피드백 내보내기</button></div><div class="mt-1 text-[9px] text-violet-700">학생 이름·학번·관찰 원문은 피드백 로그에 저장하지 않습니다.</div>';
 ta.parentElement?.insertAdjacentElement('afterend',box);box.querySelectorAll('button[data-v]').forEach(b=>b.onclick=()=>{const cur=window.getCurrentText?.()||ta.value||'',orig=originalDraft||'',ratio=orig?Math.abs(cur.length-orig.length)/Math.max(1,orig.length):null;recordMetric('teacher_feedback',{vote:b.dataset.v,reason:document.getElementById('pilot-feedback-reason')?.value||'',subject:family(window.activeSubject),outputChars:cur.length,editLengthRatio:ratio});toast('파일럿 피드백을 익명 지표로 저장했습니다.','success');});
}
function wrapExports(){
 const oc=window.copyCurrentCleanText;if(typeof oc==='function'&&!oc.__pilot){const f=function(){if(window.__pilotRiskState?.risk){setPilotRisk(window.__pilotRiskState);toast('근거 밖 확장 가능성이 남아 있어 복사를 잠갔습니다. 수정 후 다시 점검하세요.','warning');return;}return oc();};f.__pilot=true;window.copyCurrentCleanText=f;}
 const oe=window.exportCurrentToTxt;if(typeof oe==='function'&&!oe.__pilot){const f=function(){if(window.__pilotRiskState?.risk){toast('근거 위험 표시를 먼저 해소하세요.','warning');return;}return oe();};f.__pilot=true;window.exportCurrentToTxt=f;}
}
function pilotSelfTest(){
 const checks=[['Teacher Pilot 로드',true],['근거 게이트',typeof window.__pilotAnalyzeObservation==='function'],['Knowledge lazy load',!Array.isArray(window.__SEOTEUK_DEFAULT_KNOWLEDGE)||typeof window.ensureKnowledgePackV27==='function'],['일괄 fallback 제거',String(window.startBulkBatchProcess).includes('pilotStatus')],['모바일 바',!!document.getElementById('pilot-mobile-bar')],['익명 피드백',!!document.getElementById('pilot-feedback')],['접근성 이름',![...document.querySelectorAll('button')].some(b=>!b.getAttribute('aria-label'))]];return checks;
}
window.runPilotSelfTest=function(){const c=pilotSelfTest(),ok=c.filter(x=>x[1]).length;alert('v2.7 Teacher Pilot 자가진단 '+ok+'/'+c.length+'\n\n'+c.map(x=>(x[1]?'✅ ':'⚠️ ')+x[0]).join('\n'));};
function install(){
 if(window.SeoteukAI?.request) window.__requestAI=window.SeoteukAI.request;
 installStyles();installPilotUI();markAdvancedTargets();wrapExports();const p=getPrefs();if(p.advanced)document.body.classList.remove('pilot-simple');
 const ta=document.getElementById('seoteuk-textarea');ta?.addEventListener('input',()=>{const obs=window.__lastObservationV3||'';if(obs&&ta.value.trim())setPilotRisk(draftRisk(ta.value,obs));});
 const coord=document.getElementById('tab-btn-coordinator');coord?.addEventListener('click',()=>ensureKnowledgePack().catch(e=>toast(e.message,'warning')));
 setTimeout(()=>{applyAccessibility();installBulkPilot();updateKnowledgeStatus();},700);
 recordMetric('pilot_open',{vw:innerWidth,mobile:innerWidth<768});console.info('Seoteuk Mate Teacher Pilot',V);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,120));else setTimeout(install,120);
})();