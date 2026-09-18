# Seoteuk Mate v2.5 실행 방법

## 가장 빠른 확인
ZIP을 풀고 `index.html`을 열 수 있습니다. 다만 브라우저 정책에 따라 음성·서비스워커·클라우드·일부 외부 CDN 기능은 HTTP/HTTPS 환경에서 더 안정적입니다.

### 로컬 웹서버 권장
Windows에서 해당 폴더를 열고 터미널에서:

```bash
python -m http.server 8080
```

브라우저에서 `http://localhost:8080` 접속.

## Antigravity DEV
1. Antigravity/agy 로그인을 완료합니다.
2. `START_ANTIGRAVITY_BRIDGE.bat` 실행.
3. 앱 상단 `⚡ 안티그래비티 DEV`에서 브리지 주소·토큰을 확인/입력.
4. `문장 생성 테스트`로 실제 AG 응답과 엔진 메타를 확인합니다.

## 기본 지식팩
별도 설정 없이 자동 로드됩니다.

- 3,426개 검색 청크
- 바이블·추천도서·2026 기재요령 기반
- `지식 & 코디`의 PDF Knowledge Vault에서 `📦 기본 지식팩` 상태 확인
- 필요하면 추가 PDF도 기존 방식으로 색인 가능

## Google/Firebase 클라우드(선택)
`firebase-config.js`의 빈 값을 본인의 Firebase 웹 앱 구성값으로 교체합니다.

Google Authentication과 Firestore를 활성화하면 기존 앱 상태와 프로젝트 카드가 클라우드 동기화 대상에 포함됩니다.

## Vercel 서버 AI(선택)
Vercel 환경변수:

```text
GEMINI_API_KEY=본인키
```

`api/ai.js`가 `/api/ai` 서버 프록시 역할을 합니다.

## 권장 사용 순서
1. `📐 규칙`에서 교과 규칙 확인
2. `🛡️ 2026 규정` 확인
3. `🧭 교과 작성기` 실행
4. 한국사는 성취기준 선택
5. 수업활동/교사관찰/산출물/사료 입력
6. `🔎 근거 충족도 검사`
7. `✨ 세특 초안 생성`
8. `2026 점검`
9. 교사 직접 윤문
10. 필요시 `📁 프로젝트`에 저장
