# 작업 컨텍스트

- 기준 버전: `midjourney-sref-combiner-v1.4.1-synced-xlsx.zip`
- 결과 버전: `midjourney-sref-combiner-v1.5.0`
- 작업일: 2026-08-31
- 목적: `data/imports/*.txt`에 SREF 자료를 추가하면 빌드 시 자동으로 파싱·중복 제거·통합하여 웹앱 DB와 Excel을 생성하는 데이터 파이프라인 구축
- 핵심 구조: TXT 원본 → 생성 JSON → 웹앱 + Excel
- 메타데이터: `::weight`, `--niji`, `--v`, `--profile`, 파일명, 행 번호, 원문을 보존
- 기존 837개 코드의 값·순서는 v1.4.1과 완전히 동일하게 유지
- 현재 DB: 837개 고유 코드 / 851회 출현 / 2개 TXT
- 새 TXT를 GitHub `data/imports/`에 추가하고 Commit하면 Vercel의 `pnpm build` 과정에서 DB가 자동 재생성됨
- 별도 GitHub API, 서버 DB, 관리자 로그인은 필요하지 않음
