const Config = {
  apiOrigin: process.env.NEXT_PUBLIC_API_ORIGIN as string,
  uiOrigin: process.env.NEXT_PUBLIC_UI_ORIGIN as string,
  oauthSlackRedirectUri: process.env.NEXT_PUBLIC_SLACK_OAUTH_REDIRECT_URI as string,
};

export default Config;
