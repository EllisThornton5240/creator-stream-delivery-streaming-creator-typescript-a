import assert from "node:assert/strict";
import { makeEvents, RequestBody } from "../src/creator_stream.js";

const request = RequestBody.parse({ subscriberId: "sub-7", prompt: "hello", assetId: "asset-2" });
const events = makeEvents(request, "A bright poster");
assert.deepEqual(events, [
  { type: "subscriber.updated", subscriberId: "sub-7", status: "processing" },
  { type: "content.delta", text: "A bright poster" },
  { type: "asset.ready", assetId: "asset-2", text: "A bright poster" }
]);
assert.throws(() => RequestBody.parse({ subscriberId: "", prompt: "hello", assetId: "asset-2" }));
console.log("creator workflow test passed");
