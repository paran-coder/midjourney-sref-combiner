# Midjourney sref Combiner

검수된 미드저니 스타일 참조(SREF) 코드 데이터베이스와 6자리 임의 숫자를 세 가지 방식으로 선택·조합하는 웹 애플리케이션입니다.

## 🎨 기능

- **3가지 생성 모드**: 검수 DB 전용, 6자리 완전 랜덤, DB와 랜덤을 함께 쓰는 혼합 모드
- **검수 DB 기반 생성**: Midjourney Korea 자료와 사용자 추가분을 합친 837개 고유 SREF 코드 중 1~5개를 중복 없이 선택
- **새 코드 탐색**: 기존 방식대로 100000~999999 범위에서 중복 없는 6자리 숫자 생성
- **가중치 할당**: 각 코드에 선택적 가중치 부여
- **프리셋 템플릿**: 6가지 스타일 카테고리 프리셋 (포토리얼리즘, 애니메이션, 회화 등)
- **커스텀 프리셋**: 사용자가 자신만의 프리셋 생성 및 저장
- **키워드 추천**: 스타일 키워드를 입력하면 검수 DB에서 일관된 추천 조합 생성
- **히스토리 및 즐겨찾기**: 로컬 스토리지에 생성 기록 저장
- **공유 기능**: 생성된 코드 조합 공유 및 이미지 내보내기
- **비교 모드**: 여러 조합을 나란히 비교
- **클립보드 복사**: 한 번의 클릭으로 명령어 복사

## 🗃️ SREF 데이터베이스

- 코드 파일: `client/src/lib/srefDatabase.ts`
- 동기화된 검수 자료: `data/midjourney_korea_sref_codes.xlsx`
- 사용자 추가 원문: `data/user_sref_additions_2026-08-03.txt`
- 포함된 고유 코드: **837개** (기존 778개 + 신규 59개)
- 프로그램 DB와 엑셀 `sref_codes` 시트: **837개로 동기화 완료**
- 현재 제외 코드: **1개** (`8286441601`)
- 원본 자료에서 제외됐다가 사용자 요청으로 재등록된 코드: `4371870492`
- 상세 기준: `DATA_SOURCE.md`

DB 코드는 자릿수가 일정하지 않으므로 문자열로 저장하며, 모든 모드에서 같은 조합 안의 중복을 방지합니다. 혼합 모드는 코드가 2개 이상일 때 DB와 랜덤 출처를 반드시 함께 포함합니다.

## 🚀 시작하기

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/midjourney-sref-combiner.git
cd midjourney-sref-combiner

# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev
```

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

## 📦 배포 (Vercel)

### 1. GitHub에 푸시

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercel 배포

1. [Vercel](https://vercel.com)에 접속
2. "New Project" 클릭
3. GitHub 저장소 선택
4. 다음 설정 입력:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
5. "Deploy" 클릭

또는 Vercel CLI 사용:

```bash
npm i -g vercel
vercel
```


### 배포 전 확인

- 저장소 루트에 `package.json`, `vite.config.ts`, `vercel.json`이 있어야 합니다.
- Vercel의 **Root Directory**는 비워 두거나 이 프로젝트 폴더로 지정합니다.
- Node.js 버전은 `22.x`를 사용합니다.
- 별도의 환경 변수 없이 기본 기능이 동작합니다.

## 🛠️ 기술 스택

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Routing**: Wouter

## 📁 프로젝트 구조

```
midjourney-sref-combiner/
├── client/
│   ├── public/           # 정적 파일
│   ├── src/
│   │   ├── components/   # React 컴포넌트
│   │   ├── pages/        # 페이지 컴포넌트
│   │   ├── lib/          # 유틸리티 함수
│   │   ├── App.tsx       # 메인 앱 컴포넌트
│   │   ├── main.tsx      # 진입점
│   │   └── index.css     # 전역 스타일
│   └── index.html        # HTML 템플릿
├── server/               # Express 서버 (선택사항)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🎯 주요 컴포넌트

- **SrefCombiner**: 메인 코드 생성 컴포넌트
- **StylePresets**: 스타일 프리셋 선택 및 복사
- **CustomPresetManager**: 커스텀 프리셋 관리
- **AIRecommend**: AI 기반 추천 조합
- **HistoryPanel**: 생성 히스토리 및 즐겨찾기
- **ShareAndCompare**: 공유 및 비교 기능

## 📝 라이선스

MIT License

## 🤝 기여

이 프로젝트에 기여하고 싶으신가요?

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 연락처

질문이나 제안사항이 있으시면 이슈를 등록해주세요.

---

**주의**: 이 애플리케이션은 미드저니와 공식적으로 연관되어 있지 않습니다. 미드저니의 sref 코드를 더 쉽게 탐색하고 조합하기 위한 비공식 도구입니다.
