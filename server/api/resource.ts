import { escape } from "querystring";
import { api } from "../uitl";

export default defineEventHandler(async (event) => {
  const result = {
    url: "",
    error: "",
  };

  const params = await useQuery(event);
  const home = params.home as string;
  const path = params.path as string;
  const password = params.password as string;

  let basePath = useRuntimeConfig().onedriveUri + "/root:";
  useRuntimeConfig()
    .rootPath.split("/")
    .forEach((p) => {
      if (p !== "") {
        basePath = `${basePath}/${escape(p)}`;
      }
    });
  basePath = `${basePath}/${escape(home)}`;

  let location1 = `${basePath}/${escape("settings.json")}:/content`;

  path.split("/").forEach((p) => {
    if (p !== "") {
      basePath = `${basePath}/${escape(p)}`;
    }
  });
  let location2 = `${basePath}?select=@microsoft.graph.downloadUrl`;
  const p1 = api(location1, {
    method: "GET",
    parseResponse: JSON.parse,
  }).then((data): boolean => {
    if (data.password !== undefined && data.password !== "") {
      if (data.password === password) {
        return true;
      }
    } else {
      return true;
    }
    return false;
  });
  const p2 = api(location2, {
    method: "GET",
    parseResponse: JSON.parse,
  }).then((data): string => {
    return data["@microsoft.graph.downloadUrl"];
  });

  await Promise.all([p1, p2])
    .then((data) => {
      if (data[0]) {
        result.url = data[1];
      } else {
        result.error = "wrong password";
      }
    })
    .catch((error) => {
      result.error = error.message;
    });

  return result;
});
