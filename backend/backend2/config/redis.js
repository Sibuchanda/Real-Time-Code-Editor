// backend2/config/redis.js
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://delicate-bluegill-30759.upstash.io",
  token: "AXgnAAIjcDFjNDQxOTRjNzdmNGI0NzdlODk2OTZhMDYxMThmYzMyZnAxMA",
});

export default redis;

