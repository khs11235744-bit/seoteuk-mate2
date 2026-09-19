# Seoteuk Mate v2.7.1 — Teacher Pilot + Full Demo Student

실제 교사 파일럿을 위한 **근거 우선(Evidence First)** 버전입니다. v2.6의 Multi API·Antigravity 기능은 유지하면서, 근거 부족 생성 차단·일괄처리 안전장치·간단모드·Knowledge 지연 로딩·모바일·접근성·익명 피드백을 강화했습니다. v2.7.1에는 모든 핵심 근거 항목이 채워진 **가상학생 전체 예시**와 실제 AI 생성 자동검증을 추가했습니다.

## 1. GitHub 저장소 루트 모습

```text
index.html
ai-providers.js
knowledge-pack.js
rules-engine.js
official-2026.js
project-writer.js
teacher-pilot.js
teacher-demo.js
firebase-config.js
firebase-cloud.js
manifest.webmanifest
sw.js
package.json
vercel.json
antigravity-bridge.py
start-antigravity-bridge.bat
api/
  ai.js
icons/
  icon-192.png
  icon-512.png
```

`index.html`만 올리면 기능이 완성되지 않습니다. 위 파일/폴더 전체를 같은 구조로 올리세요.

## 2. 이번 v2.6에서 복구된 AI 엔진

- ⚡ Antigravity DEV: 로컬 브리지 → `agy` CLI → Antigravity 로그인 세션
- 🔐 서버 AI: Vercel 환경변수에 등록된 API 키
- Gemini API Key
- OpenAI API Key
- Claude / Anthropic API Key
- DeepSeek API Key
- Ollama 로컬
- OpenAI-compatible Custom Endpoint

AI 연결센터에서 각 엔진을 선택한 뒤 **연결 테스트**를 누르면 실제 짧은 생성 요청으로 확인합니다.

### 서버 AI용 선택 환경변수

Vercel에서 직접 키를 관리하고 싶다면 아래 중 필요한 것만 등록합니다.

```text
AI_PROVIDER=gemini        # gemini / openai / claude / deepseek
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash

OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.6-luna

ANTHROPIC_API_KEY=...
ANTHROPIC_MODEL=claude-sonnet-5

DEEPSEEK_API_KEY=...
DEEPSEEK_MODEL=deepseek-flash
```

웹앱 화면에 직접 입력한 API 키는 Firebase로 동기화하지 않습니다. 저장 시 해당 브라우저 localStorage에만 남으며, Vercel이 있는 경우 `/api/ai` 프록시를 우선 사용합니다.

## 3. Antigravity DEV 연결

### 설치

Windows PowerShell:

```powershell
irm https://antigravity.google/cli/install.ps1 | iex
```

설치 기본 위치는 `%LOCALAPPDATA%\agy\bin\agy.exe`입니다.

설치 후 **새 PowerShell 창**을 열고:

```powershell
agy
```

를 실행하여 Google 계정 로그인과 첫 설정을 1회 완료합니다.

### 브리지

1. `start-antigravity-bridge.bat` 실행
2. 검은 창을 닫지 않음
3. 토큰은 Windows에서 자동으로 클립보드 복사를 시도함
4. 웹앱 → `⚡ Antigravity DEV`
5. 브리지 토큰 붙여넣기
6. `연결 테스트`
7. `문장 생성 테스트`
8. `engine=antigravity-cli`와 실제 문장이 표시되면 완료

브리지는 `127.0.0.1:8765`와 `localhost:8765`를 자동 탐색합니다. HTTPS 웹앱에서 Chrome/Edge가 **로컬 네트워크 접근** 권한을 묻는 경우 허용해야 합니다.

### v2.5에서 연결이 계속 실패했던 핵심 버그

v2.5 웹앱은 `/health`에서 `token_valid=true`를 요구했지만 브리지는 해당 값을 반환하지 않았습니다. v2.6은 `/health`로 브리지/agy 존재를 확인한 뒤 `/v1/ping`으로 토큰을 별도 검증하도록 수정했습니다.

## 4. 배포 후 예전 화면이 남는 경우

v2.6은 Service Worker를 네트워크 우선 방식으로 변경하고 이전 캐시를 삭제합니다.

그래도 예전 화면이면:

`AI 연결센터 → 🧹 배포 캐시 초기화`

을 누르세요. Service Worker와 Cache Storage를 지운 뒤 자동 새로고침합니다.

## 5. Firebase

Google 로그인 / Firestore를 쓰려면 `firebase-config.js`에 Firebase 웹앱 설정값을 넣습니다. 설정하지 않아도 로컬 저장과 AI 기능은 사용할 수 있습니다.

## 6. v2.7.1 가상학생 전체 예시

Teacher Pilot 3단계 패널에 **가상학생 전체 예시**가 탑재되어 있습니다. 실제 학생 정보가 아니며, 한국사 물산장려운동 역사신문 활동을 기준으로 다음 핵심 근거를 모두 채웁니다.

- 학번·가상 이름·과목·희망 진로
- 2022 개정 한국사 성취기준
- 실제 수업 활동
- 교사 직접 관찰
- 학생 산출물
- 실제 사용 자료
- 학생 실제 역할
- 피드백·수정·성장
- 학생 후속 질문
- 기타 관찰 메모
- 역사신문 전용 10개 근거 항목
- 학생 프로젝트 카드
- 빠른 생성 관찰 기록
- Knowledge 탐구 질문
- 다인수 일괄처리 샘플 행

`전체 입력 불러오기`는 입력 내용을 살펴보기 위한 기능이고, `세특 생성+자동검증`은 현재 선택한 AI 엔진으로 실제 초안을 만든 뒤 2026 규정·근거·바이트·교과 문법을 자동 검사합니다.

자동검증을 통과하더라도 결과는 **교사 검토용 초안**이며 최종 기재 전 교사가 사실관계와 표현을 확인해야 합니다. 상세 검증 결과는 `FULL_DEMO_VALIDATION_REPORT.md`에 기록합니다.
