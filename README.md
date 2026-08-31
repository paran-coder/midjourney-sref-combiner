# Midjourney SREF Combiner

검수된 Midjourney SREF 코드와 임의 코드를 DB·랜덤·혼합 방식으로 조합하는 웹 애플리케이션입니다.

## v1.5.0 데이터 관리 구조

이 버전부터 SREF 데이터를 TypeScript 배열과 Excel에 각각 수동 입력하지 않습니다.

```text
data/imports/*.txt
        ↓
scripts/build-sref-db.mjs
        ↓
client/src/data/sref-database.json
        ↓
웹앱 + Excel 자동 생성
```

### 새 SREF 추가 방법

1. `data/imports/` 폴더에 `.txt` 파일을 추가합니다.
2. 파일 안에는 Midjourney 명령을 원문 그대로 넣어도 됩니다.
3. GitHub에 Commit/Push 합니다.
4. Vercel 빌드 시 자동으로 모든 TXT 파일을 읽어 DB를 갱신합니다.

예시:

```text
--sref 3186922520
--sref 1636187491 2354286329
--sref 2921367196 --niji 7
--sref 1235558871::1 --niji 7
--sref 4371870492 --profile op2hwq1
```

자동 파서는 코드뿐 아니라 다음 메타데이터도 보존합니다.

- SREF 가중치 (`::1`, `::0.8` 등)
- Niji 버전 (`--niji 7`)
- Midjourney 버전 (`--v 8.1`)
- 프로필 (`--profile ...`)
- 원본 파일명과 행 번호

동일 코드가 여러 TXT 파일에 등장하면 최종 코드 DB에서는 한 번만 포함되며, 출현 기록은 모두 메타데이터로 남습니다. 현재 데이터는 **837개 고유 코드 / 851회 출현 / 2개 TXT**입니다.

## 주요 기능

- DB 전용 / 완전 랜덤 / 혼합 3가지 생성 모드
- 검수 DB에서 중복 없는 코드 선택
- 100000~999999 범위 6자리 랜덤 코드 생성
- DB + 랜덤 혼합 조합
- 가중치 생성
- 스타일 프리셋
- 키워드 추천
- 히스토리 및 즐겨찾기
- 공유/비교

## 데이터 파일

- 원본 import: `data/imports/*.txt`
- 최종 웹앱 DB: `client/src/data/sref-database.json` (자동 생성)
- Excel: `data/generated/midjourney_sref_database.xlsx` (자동 생성)
- 배포용 Excel: `client/public/data/midjourney_sref_database.xlsx` → 사이트의 `/data/midjourney_sref_database.xlsx`
- 호환 API: `client/src/lib/srefDatabase.ts`

`client/src/data/sref-database.json`과 `data/generated/*`는 빌드 스크립트가 생성하므로 직접 편집하지 않는 것을 권장합니다.

## 실행

```bash
pnpm install
pnpm dev
```

프로덕션 빌드:

```bash
pnpm build
```

DB만 다시 생성하려면:

```bash
pnpm generate:sref
```

## 배포

GitHub 저장소가 Vercel에 연결되어 있으면 `data/imports`에 새 TXT 파일을 올리고 Commit하는 것만으로 다음 배포에서 DB가 갱신됩니다.

## 기술 스택

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- pnpm
