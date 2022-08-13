import { escape } from "querystring";
import { api } from "../uitl";

interface SettingData {
  message?: {
    title?: string;
    content?: string;
  };
  desc?: boolean;
  heading?: string;
  saying?: string;
  button?: string;
  pageSize?: number;
  [key: string]: any;
}

export default defineEventHandler(async (_event) => {
  let settings: SettingData = {};
  let errorMessage = "";
  const config = useRuntimeConfig();
  const pathArray = config.rootPath.split("/");
  let path = config.onedriveUri + "/root:";
  pathArray.forEach((p) => {
    if (p !== "") {
      path += "/" + escape(p);
    }
  });
  path += "/" + escape("settings.json") + ":/content";

  await api(path, {
    method: "GET",
    parseResponse: JSON.parse,
  })
    .then((data) => {
      settings = data;
    })
    .catch((error) => {
      errorMessage = error.message;
    });

  return {
    settings,
    error: errorMessage,
  };
});
