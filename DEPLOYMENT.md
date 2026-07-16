# GitHub → Vercel 배포 안내

## 저장소 구조

GitHub 저장소의 최상위 경로에 다음 파일이 바로 보여야 합니다.

- `package.json`
- `pnpm-lock.yaml`
- `vite.config.ts`
- `vercel.json`
- `client/`

압축 파일 안의 상위 폴더만 저장소에 올려서 위 파일들이 한 단계 아래에 위치하지 않도록 주의하십시오.

## Vercel 설정

대부분 `vercel.json`을 자동으로 읽으므로 별도 입력이 필요하지 않습니다.

- Framework Preset: `Vite`
- Build Command: `pnpm build`
- Output Directory: `dist`
- Node.js: `22.x`
- Root Directory: 저장소 루트

## 로컬 확인

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm preview
```

빌드가 성공하면 저장소에 커밋하고 Vercel에서 재배포하십시오.
