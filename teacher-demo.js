/* Seoteuk Mate v2.7.1 — fully populated fictional student demo */
(function(){
'use strict';
const DEMO_ID='demo-full-student-v271';
const DEMO={
  id:DEMO_ID, fictional:true, studentNo:'2101', studentName:'김도윤(가상)',
  subject:'한국사', career:'역사교육·기록콘텐츠', major:'역사교육·미디어콘텐츠 계열',
  title:'물산장려운동 역사신문: 자료의 주장과 실제 참여 범위를 구분해 기사 쓰기',
  standardCode:'10한사2-01-03', standardText:'국내외에서 전개된 민족운동의 흐름을 이해한다.',
  activity:'물산장려운동을 주제로 모둠 역사신문을 제작함. 수업에서 제공된 당대 신문 광고 발췌와 물산장려회 취지문 발췌를 비교한 뒤 기사 초고를 작성하고, 모둠 피드백과 교사 피드백을 반영해 수정본을 완성한 후 핵심 내용을 발표함.',
  teacherObservation:'자료 비교표를 작성하면서 두 자료가 독자에게 요구하는 행동과 강조점이 다르다고 표시함. 기사 초고의 ‘전 국민이 한뜻으로 참여했다’는 문장에 대해 근거가 충분한지 스스로 질문하고, 교사의 ‘자료에서 확인되는 범위만 쓰라’는 피드백 뒤 해당 표현을 ‘국산품 애용을 호소하는 움직임이 전개되었다’로 수정함. 모둠원이 제시한 문장을 검토할 때도 근거가 어느 자료에 있는지 확인한 뒤 반영 여부를 결정함. 발표에서 ‘취지문만으로 실제 참여 범위를 단정할 수 없다’고 설명하고, 활동 후 운동의 목표와 실제 참여 양상 사이의 차이가 생긴 이유를 질문함.',
  artifact:'사료 비교표, 역사신문 기사 초고, 피드백 반영 수정본, 발표용 기사 요약 카드.',
  sourceEvidence:'교과서의 물산장려운동 관련 내용, 수업에서 제공된 당대 신문 광고 발췌, 물산장려회 취지문 발췌, 모둠 기사 초고.',
  role:'사료 근거 확인 및 기사 본문 작성·수정 담당. 모둠원이 작성한 문장의 근거 위치를 함께 확인하고 최종 본문 반영 여부를 제안함.',
  feedbackGrowth:'초고에서 참여 범위를 과도하게 일반화한 표현을 사용했으나, 교사 피드백 후 근거가 직접 확인되는 범위로 문장을 좁혀 수정함. 이후 다른 문장도 자료 근거를 먼저 확인한 뒤 표현을 결정함.',
  studentQuestion:'물산장려운동의 목표와 실제 참여 양상 사이의 차이가 있었다면 그 차이는 어떤 사회·경제적 조건에서 생겼는가?',
  notes:'발표에서 취지문과 실제 참여 범위를 구분해야 한다는 점을 설명함. 동료 피드백 중 근거가 확인되는 제안만 기사에 반영함. 가상학생 테스트 데이터이며 실제 학생 정보가 아님.',
  idea:'추후 확장 아이디어: 운동의 목표·홍보 메시지·수용 양상을 구분해 추가 탐구 가능. 이 문장은 참고 아이디어이며 학생이 실제 수행한 사실이 아님.',
  knowledgeQuery:'물산장려운동 역사신문 사료 비교 관점 분석과 사실·해석 구분',
  quickObservation:'물산장려운동 역사신문 제작에서 당대 신문 광고 발췌와 물산장려회 취지문 발췌를 비교해 두 자료의 강조점 차이를 표시함. 기사 초고의 과도한 일반화 표현에 근거가 충분한지 스스로 질문하고 교사 피드백 후 자료에서 확인되는 범위로 문장을 좁혀 수정함. 모둠원이 작성한 문장도 근거 위치를 확인한 뒤 반영 여부를 제안함. 발표에서 취지문만으로 실제 참여 범위를 단정할 수 없다고 설명하고 활동 후 운동의 목표와 실제 참여 양상 사이의 차이가 생긴 이유를 질문함.',
  history:{
    topic:'일제강점기 물산장려운동',
    article:'물산장려운동의 목표와 실제 참여 범위를 어떻게 구분해 기사로 전달할 것인가',
    sources:'교과서 관련 내용, 당대 신문 광고 발췌, 물산장려회 취지문 발췌, 기사 초고',
    critique:'자료의 작성 목적과 독자에게 요구하는 행동을 비교하고, 취지문만으로 실제 참여 범위를 단정할 수 없다는 한계를 표시함.',
    role:'사료 근거 확인, 기사 본문 작성, 초고 수정',
    factcheck:'‘전 국민이 한뜻으로 참여했다’는 초고 표현의 근거가 충분하지 않다고 보고 자료에서 확인되는 범위로 문장을 좁혀 수정함.',
    perspective:'신문 광고의 호소 방식과 물산장려회 취지문의 주장 범위를 비교함.',
    collab:'모둠원이 제안한 문장의 근거 위치를 함께 확인하고, 근거가 확인되는 제안만 최종 기사에 반영함.',
    observed:'자료 비교표 작성, 근거 확인 질문, 과장 표현 수정, 발표에서 자료의 한계 설명을 교사가 직접 관찰함.',
    followup:'운동의 목표와 실제 참여 양상 사이의 차이가 어떤 사회·경제적 조건에서 생겼는지 질문함.'
  }
};
window.__FULL_DEMO_STUDENT_V271=DEMO;

function setv(id,v){const e=document.getElementById(id);if(e){e.value=v??'';e.dispatchEvent(new Event('input',{bubbles:true}));}}
function sets(id,v){const e=document.getElementById(id);if(e){e.value=v;e.dispatchEvent(new Event('change',{bubbles:true}));}}
function toast(m,t='info'){window.showToast?.(m,t);}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function setSubject(){
  window.activeCategory='교과세특';window.handleSubjectChange?.(DEMO.subject);
  const s=document.getElementById('subject-select');if(s){s.value=DEMO.subject;s.dispatchEvent(new Event('change',{bubbles:true}));}
}
function projectObject(){
  return {id:DEMO_ID,studentNo:DEMO.studentNo,studentName:DEMO.studentName,subject:DEMO.subject,
    career:DEMO.career,title:DEMO.title,question:DEMO.studentQuestion,standardCode:DEMO.standardCode,
    standardText:DEMO.standardText,activity:DEMO.activity,teacherObservation:DEMO.teacherObservation,
    artifact:DEMO.artifact,sourceEvidence:DEMO.sourceEvidence,role:DEMO.role,feedbackGrowth:DEMO.feedbackGrowth,
    idea:DEMO.idea,knowledgeRefs:[],status:'진행',createdAt:Date.now(),updatedAt:Date.now()};
}
function upsertProject(){
  const arr=Array.isArray(window.__projectCardsV25)?window.__projectCardsV25:[];
  window.__projectCardsV25=[projectObject(),...arr.filter(x=>x.id!==DEMO_ID)];
  try{localStorage.setItem('seoteukMate.projects.v25',JSON.stringify(window.__projectCardsV25));}catch(_){}
  window.__scheduleCloudSave?.(window.__getCloudState?.()||{});
}
function fillHistory(){
  const h=DEMO.history, map={
    'hn-topic':h.topic,'hn-article':h.article,'hn-sources':h.sources,'hn-source-critique':h.critique,
    'hn-role':h.role,'hn-factcheck':h.factcheck,'hn-perspective':h.perspective,'hn-collab':h.collab,
    'hn-observed':h.observed,'hn-followup':h.followup
  };
  Object.entries(map).forEach(([id,v])=>setv(id,v));
}
function writerSeed(){return {
  studentNo:DEMO.studentNo,studentName:DEMO.studentName,subject:DEMO.subject,career:DEMO.career,
  standardCode:DEMO.standardCode,standardText:DEMO.standardText,activity:DEMO.activity,
  teacherObservation:DEMO.teacherObservation,artifact:DEMO.artifact,sourceEvidence:DEMO.sourceEvidence,
  role:DEMO.role,feedbackGrowth:DEMO.feedbackGrowth,studentQuestion:DEMO.studentQuestion,notes:DEMO.notes
};}
window.loadFullDemoStudent=function(opts={}){
  setSubject();setv('input-career',DEMO.career);setv('input-major',DEMO.major);setv('input-chat',DEMO.quickObservation);
  sets('official-evidence-type','교사 직접 관찰');setv('knowledge-query',DEMO.knowledgeQuery);setv('coord-major',DEMO.major);
  fillHistory();upsertProject();
  try{localStorage.setItem('seoteukMate.writerDraft.v25',JSON.stringify(writerSeed()));}catch(_){}
  window.bulkStudents=[{no:DEMO.studentNo,name:DEMO.studentName,observation:DEMO.quickObservation,career:DEMO.career,result:'',demo:true}];
  window.__lastObservationV3=DEMO.quickObservation;
  if(opts.openWriter!==false)window.openSubjectWriter?.(writerSeed());
  setTimeout(()=>{sets('v25-writer-standard-select',DEMO.standardCode);setv('v25-writer-standard-text',DEMO.standardText);window.runWriterEvidenceCheck?.();},100);
  const p=document.getElementById('demo-student-status');if(p)p.textContent='예시 탑재 완료 · 모든 핵심 근거 항목이 채워졌습니다.';
  toast('가상학생 전체 예시를 불러왔습니다. 실제 학생 정보가 아닙니다.','success');
  return DEMO;
};
window.clearFullDemoStudent=function(){
  window.__projectCardsV25=(window.__projectCardsV25||[]).filter(x=>x.id!==DEMO_ID);
  try{localStorage.setItem('seoteukMate.projects.v25',JSON.stringify(window.__projectCardsV25));localStorage.removeItem('seoteukMate.writerDraft.v25');}catch(_){}
  ['input-career','input-major','input-chat','knowledge-query','coord-major'].forEach(id=>setv(id,''));
  ['hn-topic','hn-article','hn-sources','hn-source-critique','hn-role','hn-factcheck','hn-perspective','hn-collab','hn-observed','hn-followup'].forEach(id=>setv(id,''));
  const p=document.getElementById('demo-student-status');if(p)p.textContent='예시를 지웠습니다.';
  toast('가상학생 예시를 지웠습니다.','info');
};
function bytes(t){return window.calculateNeisBytes?.(t)||new TextEncoder().encode(String(t||'')).length;}
function validateText(text){
  const findings=window.scanOfficial2026?.(text)||[], hard=findings.filter(x=>x.severity==='hard');
  const risk=window.__pilotRiskState||{};
  const checks=[
    ['본문 생성',String(text||'').trim().length>=80,'본문이 너무 짧지 않은지'],
    ['NEIS 1,500B 이내',bytes(text)<=1500,bytes(text)+' Byte'],
    ['기재금지 위험 없음',hard.length===0,hard.map(x=>x.title).join(', ')||'0건'],
    ['가상학생 식별정보 미출력',!/(2101|김도윤)/.test(text),'학번·이름은 본문에 쓰지 않음'],
    ['근거 비교 과정 반영',/(비교|대조)/.test(text),'자료 비교 행동'],
    ['수정·피드백 과정 반영',/(수정|고쳐|피드백)/.test(text),'변화 과정'],
    ['질문·한계 인식 반영',/(질문|단정|한계)/.test(text),'후속 질문/자료 한계'],
    ['과학 실험 문법 누출 없음',!/(실험\s*변인|측정\s*데이터|정량적\s*오차|센서|반복\s*실험)/.test(text),'역사 교과 문법'],
    ['관찰 밖 확장 경고 없음',!risk.risk,risk.risk?('추론 가능 '+(risk.inference||0)+'/'+(risk.total||0)+'문장'):'통과'],
    ['진로 억지 연결 없음',!/(역사교육|기록콘텐츠|미디어콘텐츠|희망\s*진로)/.test(text),'관찰에 없는 진로 연결 금지'],
    ['강한 평가어 무단확대 없음',!/(주도함|학문적\s*태도|우수함|탁월함|뛰어난|돋보임|역량을\s*(?:나타냄|보임|드러냄))/.test(text),'관찰에 없는 평가어 금지'],
    ['가정형 질문 사실화 없음',!/(나타난|존재한|확인된|드러난|발생한)\s*(차이|괴리|영향|원인)|사이에\s*(?:나타난|확인된|드러난)\s*차이|사이에\s*차이가\s*(?:발생한|있었던|존재한|나타난|확인된)/.test(text),'학생 질문의 가정을 사실로 단정하지 않음']
  ];
  return {checks,findings,hard,bytes:bytes(text),pass:checks.every(x=>x[1])&&hard.length===0};
}
function renderReport(v,text){
  const c=document.getElementById('demo-validation-report');if(!c)return;
  c.classList.remove('hidden');c.className='mt-3 p-3 rounded-2xl border '+(v.pass?'bg-emerald-50 border-emerald-200':'bg-rose-50 border-rose-200');
  c.innerHTML='<div class="font-black text-sm">'+(v.pass?'✅ 전체 예시 세특 검증 통과':'⚠️ 전체 예시 세특 재검토 필요')+'</div>'+
  '<div class="text-[10px] mt-1">'+v.bytes+'/1,500 Byte · 공식검사 '+v.findings.length+'건 · '+v.checks.filter(x=>x[1]).length+'/'+v.checks.length+' 항목 통과</div>'+
  '<div class="grid md:grid-cols-2 gap-1 mt-2">'+v.checks.map(x=>'<div class="text-[10px] p-1.5 rounded bg-white/70">'+(x[1]?'✅':'❌')+' <b>'+esc(x[0])+'</b> · '+esc(x[2])+'</div>').join('')+'</div>'+
  '<details class="mt-2"><summary class="text-[10px] font-bold cursor-pointer">생성된 세특 보기</summary><div class="mt-1 p-2 bg-white rounded-xl text-xs leading-6 whitespace-pre-wrap">'+esc(text)+'</div></details>';
}
window.runFullDemoStudentValidation=async function(){
  window.loadFullDemoStudent({openWriter:true});
  const status=document.getElementById('demo-student-status');if(status)status.textContent='현재 AI 엔진으로 생성…';
  const before=document.getElementById('v25-writer-result')?.textContent||'';
  try{
    await window.generateFromSubjectWriter?.();
    let text=(document.getElementById('v25-writer-result')?.textContent||'').trim();
    if(!text||text===before)text=(document.getElementById('seoteuk-textarea')?.value||'').trim();
    if(!text)throw new Error('세특 본문이 생성되지 않았습니다. AI 연결을 확인하세요.');
    const v=validateText(text);window.__FULL_DEMO_LAST_VALIDATION=v;window.__FULL_DEMO_LAST_TEXT=text;renderReport(v,text);
    if(status)status.textContent=v.pass?'자동 검증 통과 · 교사 최종 확인만 남았습니다.':'자동 검증에서 보완 항목이 발견됐습니다.';
    toast(v.pass?'가상학생 세특 자동검증을 통과했습니다.':'가상학생 세특에 보완할 항목이 있습니다.',v.pass?'success':'warning');
    return v;
  }catch(e){
    if(status)status.textContent='생성/검증 실패: '+e.message;
    toast('가상학생 생성 검증 실패: '+e.message,'warning');throw e;
  }
};
function installDemoUI(){
  if(document.getElementById('demo-student-panel'))return;
  const step=document.getElementById('pilot-stepbar');if(!step)return setTimeout(installDemoUI,250);
  const box=document.createElement('div');box.id='demo-student-panel';box.className='mt-2 p-2.5 rounded-xl border border-cyan-200 bg-cyan-50';
  box.innerHTML='<div class="flex flex-wrap items-center gap-2"><b class="text-xs text-cyan-950">🧪 가상학생 전체 예시</b><span class="text-[9px] text-cyan-700">실제 학생이 아닌 테스트 데이터</span><button type="button" onclick="loadFullDemoStudent()" class="ml-auto px-2.5 py-1.5 rounded-lg bg-white border border-cyan-300 text-cyan-800 text-[10px] font-black">전체 입력 불러오기</button><button type="button" onclick="runFullDemoStudentValidation()" class="px-2.5 py-1.5 rounded-lg bg-cyan-700 text-white text-[10px] font-black">세특 생성+자동검증</button><button type="button" onclick="clearFullDemoStudent()" class="px-2 py-1.5 rounded-lg bg-white border text-slate-500 text-[10px]">예시 지우기</button></div><div id="demo-student-status" class="mt-1 text-[9px] text-cyan-800">모든 핵심 입력칸·프로젝트 카드·역사신문 근거를 한 학생 예시로 채울 수 있습니다.</div><div id="demo-validation-report" class="hidden"></div>';
  step.appendChild(box);
  window.__pilotV27=Object.assign(window.__pilotV27||{},{fullDemoStudent:true,demoVersion:'2.7.1'});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(installDemoUI,650));else setTimeout(installDemoUI,650);
})();
