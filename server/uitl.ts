import { $fetch } from "ohmyfetch";

interface fetchConfig {
  method: "GET" | "POST";
  retry?: number;
  cache?: "no-cache";
  parseResponse?: (r: string) => any;
}

export const getAccessToken = async (): Promise<string> => {
  const config = useRuntimeConfig();
  const data_body = new URLSearchParams();
  data_body.append("client_id", config.clientId);
  data_body.append("redirect_uri", config.redirectUri);
  data_body.append("client_secret", config.clientSecret);
  data_body.append("refresh_token", config.refreshToken);
  data_body.append("grant_type", "refresh_token");

  return $fetch<{ access_token: string }>(
    "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    {
      method: "POST",
      retry: 1,
      cache: "no-cache",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data_body,
      parseResponse: JSON.parse,
    }
  ).then((data) => {
    return data.access_token;
  });
};

export const api = async (uri: string, cfg: fetchConfig) => {
  return $fetch(uri, {
    headers: {
      Authorization: "bearer " + (await getAccessToken()),
    },
    cache: "no-cache",
    ...cfg,
  }).then((data) => {
    return data;
  });
};
