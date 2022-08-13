import { $fetch } from "ohmyfetch";

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  const code = body.code;
  const client_id = body.client_id;
  const redirect_uri = body.redirect_uri;
  const client_secret = body.client_secret;

  const result: { error: string; token: string } = {
    error: "",
    token: "",
  };

  await $fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
    method: "POST",
    parseResponse: JSON.parse,
    body: new URLSearchParams({
      client_id,
      redirect_uri,
      client_secret,
      code,
      grant_type: "authorization_code",
    }).toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((data) => {
      result.token = data.refresh_token;
    })
    .catch((error) => {
      result.error = error.message;
    });

  return result;
});
