# Midjourney sref Combiner

미드저니 스타일 참조(sref) 코드를 무작위로 생성하고 조합하는 웹 애플리케이션입니다.

## 🎨 기능

- **무작위 코드 생성**: 1~5개의 sref 코드를 무작위로 생성
- **가중치 할당**: 각 코드에 선택적 가중치 부여
- **프리셋 템플릿**: 6가지 스타일 카테고리 프리셋 (포토리얼리즘, 애니메이션, 회화 등)
- **커스텀 프리셋**: 사용자가 자신만의 프리셋 생성 및 저장
- **AI 추천**: 스타일 설명을 입력하면 자동으로 추천 조합 생성
- **히스토리 및 즐겨찾기**: 로컬 스토리지에 생성 기록 저장
- **공유 기능**: 생성된 코드 조합 공유 및 이미지 내보내기
- **비교 모드**: 여러 조합을 나란히 비교
- **클립보드 복사**: 한 번의 클릭으로 명령어 복사

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
