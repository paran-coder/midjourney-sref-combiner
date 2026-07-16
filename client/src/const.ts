/**
 * Shared browser constants.
 *
 * The original export pointed to a missing `shared/const` module, which made
 * TypeScript checks fail after the project was moved out of its original
 * Manus workspace.
 */
export const COOKIE_NAME = "midjourney-sref-combiner";
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// Generate login URL at runtime so the redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  if (!oauthPortalUrl || !appId) {
    throw new Error("OAuth 환경 변수가 설정되지 않았습니다.");
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);
  const url = new URL("app-auth", `${oauthPortalUrl.replace(/\/+$/, "")}/`);

  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
