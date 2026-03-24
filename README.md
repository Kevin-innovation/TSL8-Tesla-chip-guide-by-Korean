## Access Gate (인증번호)

- `TSL_ACCESS_CODES`: 쉼표로 구분한 인증번호 목록
- `TSL_AUTH_SECRET`: 세션 쿠키 서명용 시크릿(프로덕션에서 반드시 변경)

## Deploy (Vercel)

Vercel 프로젝트 환경변수에 아래 값을 추가합니다.

- `TSL_ACCESS_CODES`
- `TSL_AUTH_SECRET`

## Notes

- `references/tsl6_extract_raw.txt`는 제공된 PDF에서 추출한 원문 텍스트입니다.
