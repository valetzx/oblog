import { IncomingMessage, ServerResponse } from "h3";

export default (req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 302;
  res.setHeader("Location", "");
  res.end("1");
};
