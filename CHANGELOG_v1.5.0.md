# CHANGELOG v1.5.0

## Added

- `data/imports/*.txt` 자동 SREF import 파이프라인
- 여러 TXT 파일 통합 및 자동 중복 제거
- 가중치(`::`), `--niji`, `--v`, `--profile` 메타데이터 보존
- 원본 파일명/행 번호/원문 출현 기록
- 자동 생성 JSON DB
- JSON 기준 Excel 자동 생성
- 배포용 public Excel 자동 생성
- SREF 파서 및 파이프라인 테스트

## Changed

- 실제 웹앱 DB를 하드코딩 TypeScript 배열에서 생성 JSON으로 전환
- `srefDatabase.ts`는 JSON 호환 API 레이어로 단순화
- 기존 837개 DB를 TXT 원본 구조로 마이그레이션
- 기존 v1.4.1 Excel은 archive로 이동
- `build`, `dev`, `check` 실행 전에 DB 자동 생성

## Data integrity

- 기존 837개 코드의 값과 순서 100% 보존
- 현재 원본 출현 851회
- 최종 고유 코드 837개
