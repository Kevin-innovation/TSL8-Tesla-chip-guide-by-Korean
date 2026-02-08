TSL 셋팅 공유 사이트 (TK테슬라방 - 하쿠)

## Getting Started

환경변수 설정:

```bash
cp .env.example .env.local
```

개발 서버 실행:

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속 → `/gate`에서 인증번호 입력.

## Access Gate (인증번호)

- `TSL_ACCESS_CODES`: 쉼표로 구분한 인증번호 목록
- `TSL_AUTH_SECRET`: 세션 쿠키 서명용 시크릿(프로덕션에서 반드시 변경)

## Deploy (Vercel)

Vercel 프로젝트 환경변수에 아래 값을 추가합니다.

- `TSL_ACCESS_CODES`
- `TSL_AUTH_SECRET`

## Notes

- `references/tsl6_extract_raw.txt`는 제공된 PDF에서 추출한 원문 텍스트입니다.
