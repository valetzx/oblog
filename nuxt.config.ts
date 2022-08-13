import { defineNuxtConfig } from "nuxt";

export default defineNuxtConfig({
  modules: ["@inkline/nuxt", "nuxt-windicss"],
  inkline: {
    colorMode: "system",
    locale: "zh",
    routerComponent: "router-link",
    size: "md",
  },
  runtimeConfig: {
    clientId: "",
    clientSecret: "",
    redirectUri: "",
    refreshToken: "",
    rootPath: "",
    onedriveUri: "https://graph.microsoft.com/v1.0/me/drive",
    oauthUri: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
  },
});
