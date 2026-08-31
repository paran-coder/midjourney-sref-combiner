# 사용자 설명서 — v1.5.0

## SREF 데이터를 추가하는 가장 쉬운 방법

앞으로는 `srefDatabase.ts`나 Excel을 직접 수정하지 않습니다.

### 1. TXT 파일 준비

새 SREF 자료를 텍스트 파일로 저장합니다. 파일명은 자유롭지만 출처나 날짜를 알 수 있게 정하는 것을 권장합니다.

예:

```text
data/imports/2026-08-31-new-srefs.txt
```

내용은 원문 그대로 넣어도 됩니다.

```text
--sref 3186922520
--sref 1938142599 2354286329
--sref 2921367196 --niji 7
--sref 1235558871::1 --niji 7
--sref 3623850304 --v 8.1
--sref 4371870492 --profile op2hwq1
```

### 2. GitHub에 TXT만 업로드

`data/imports/` 경로에 파일을 추가한 뒤 Commit합니다.

### 3. 자동 처리

Vercel 빌드가 시작되면 다음 과정이 자동 실행됩니다.

- 모든 `.txt` 파일 검색
- `--sref` 코드 추출
- 한 줄에 여러 코드가 있으면 각각 분리
- 기존 코드와 중복 제거
- 가중치/Niji/버전/프로필 메타데이터 보존
- 최종 JSON DB 생성
- Excel 데이터 파일 생성
- 웹앱 빌드

## 데이터 규칙

### 코드

`--sref` 뒤의 숫자를 SREF 코드로 인식합니다.

### 가중치

```text
1235558871::1
```

코드는 `1235558871`, 가중치는 `1`로 별도 저장합니다.

### Niji

```text
--sref 2921367196 --niji 7
```

코드와 함께 `niji: 7` 메타데이터가 보존됩니다.

### Midjourney 버전

```text
--sref 3623850304 --v 8.1
```

`version: 8.1`로 보존됩니다.

### Profile

```text
--sref 4371870492 --profile op2hwq1
```

`profile: op2hwq1`로 보존됩니다.

## 중복 처리

같은 SREF가 여러 파일이나 여러 줄에 있어도 최종 코드 목록에는 한 번만 들어갑니다. 대신 어느 파일 몇 번째 줄에서 발견됐는지는 출현 기록으로 모두 남습니다.

## 직접 수정하면 안 되는 파일

- `client/src/data/sref-database.json`
- `data/generated/midjourney_sref_database.xlsx`

위 파일들은 자동 생성 결과물입니다. 원본 데이터는 `data/imports/*.txt`입니다.

## GitHub + Vercel에서의 실제 사용 흐름

1. GitHub 저장소의 `data/imports/` 폴더를 엽니다.
2. 새 `.txt` 파일을 업로드합니다.
3. Commit합니다.
4. 연결된 Vercel이 새 배포를 시작합니다.
5. `pnpm build`가 TXT를 읽어 JSON과 Excel을 다시 생성합니다.
6. 새 웹사이트 배포는 갱신된 DB를 사용합니다.

Vercel 빌드가 GitHub 저장소에 생성 파일을 다시 Commit하는 구조는 아닙니다. **사이트 DB 갱신에는 TXT 파일만 Commit하면 충분**합니다. GitHub 저장소 자체의 자동 생성 JSON/Excel까지 Commit 상태로 갱신하려면 별도의 GitHub Actions 자동 커밋 기능을 추가해야 합니다.
