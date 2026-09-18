# Seoteuk Mate v2.1 — Antigravity DEV 모드

## 핵심 구조

`웹앱 -> http://127.0.0.1:8765 -> antigravity_bridge.py -> agy CLI -> Antigravity 로그인 세션`

이 버전에서 `antigravity`는 더 이상 `/api/ai` 서버 프록시의 별명이 아닙니다.
Antigravity CLI의 headless 실행 결과를 웹앱으로 돌려주는 **별도 개발자 엔진**입니다.

## 최초 1회

1. Antigravity CLI가 설치되어 있어야 합니다.
2. 터미널에서 `agy`를 실행해 Google 계정 로그인을 완료합니다.
3. `START_ANTIGRAVITY_BRIDGE.bat`를 실행합니다.
4. 검은 창에 표시되는 **토큰**을 복사합니다.
5. 웹앱 상단 `⚡ 안티그래비티 DEV` -> 토큰 입력 -> `연결 테스트`.
6. 이후 AI 생성은 Antigravity DEV 모드에서 로컬 브리지를 통해 `agy`로 전송됩니다.

## 데스크탑 화면

데스크탑 모드에서는 브라우저 실제 폭과 상관없이 다음 구조를 강제로 유지합니다.

- 왼쪽: AI 입력 / 관찰 키워드 / 바이블 매크로 / Antigravity DEV 연결 상태
- 오른쪽: 세특 결과 / 직접 편집 / 바이트 / 진단 / 버전 관리

스마트폰 모드만 카드식 화면으로 전환됩니다.

## 보안

- 브리지는 `127.0.0.1`에만 바인딩됩니다.
- 생성 요청은 별도 브리지 토큰이 있어야 실행됩니다.
- 토큰은 사용자 홈의 `.seoteukmate/antigravity_bridge_token.txt`에 저장되어 재실행 후에도 유지됩니다.
- 브라우저 HTML에 Google 계정 비밀번호나 Antigravity 로그인 토큰을 저장하지 않습니다.

## 이미지 OCR

현재 공식 Antigravity CLI headless 스트림은 텍스트 블록 중심이므로 이 브리지는 **텍스트 생성 패킷**을 우선 지원합니다. 이미지 OCR은 기존 Gemini/서버 AI 경로를 사용하세요.
