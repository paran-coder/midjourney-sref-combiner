# SREF 데이터 출처 — v1.5.0

## 단일 데이터 흐름

v1.5.0부터 SREF 데이터는 `data/imports/*.txt`를 원본으로 관리합니다.

```text
data/imports/*.txt
        ↓
scripts/build-sref-db.mjs
        ↓
client/src/data/sref-database.json
        ↓
웹앱 / Excel
```

## 현재 원본

- `data/imports/000-midjourney-korea-base.txt`: 기존 검수 DB 778개
- `data/imports/2026-08-03-user-additions.txt`: 사용자 제공 명령 52줄, SREF 출현 73회
- 최종 고유 코드: **837개**
- 전체 출현 기록: **851회**
- 중복 출현: **14회**
- 원본 TXT: **2개**

기존 v1.4.1 Excel은 `data/archive/midjourney_korea_sref_codes-v1.4.1.xlsx`에 보관합니다. 더 이상 실제 DB 원본으로 사용하지 않습니다.

## 메타데이터 보존

v1.4.x에서는 옵션을 코드에서 제외하기만 했지만, v1.5.0부터는 다음 정보를 출현 메타데이터로 보존합니다.

- `1235558871::1` → code `1235558871`, weight `1`
- `--niji 7` → niji `7`
- `--v 8.1` → version `8.1`
- `--profile op2hwq1` → profile `op2hwq1`
- sourceFile → 원본 TXT 파일명
- line → 원본 행 번호
- raw → 원본 명령줄

옵션은 해당 줄의 모든 SREF 코드 출현에 연결됩니다. 가중치는 각 코드 토큰별로 저장됩니다.

## 자동 생성 파일

- `client/src/data/sref-database.json`: 웹앱이 읽는 최종 DB
- `data/generated/sref-database.json`: 데이터 확인용 JSON 사본
- `data/generated/midjourney_sref_database.xlsx`: 자동 생성 Excel
- `client/public/data/midjourney_sref_database.xlsx`: Vite 배포에 포함되는 Excel 사본

위 파일은 직접 수정하지 않고 `data/imports/*.txt`를 수정하는 것이 원칙입니다.
