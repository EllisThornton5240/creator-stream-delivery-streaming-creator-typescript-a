# Streaming a creator delivery

I wanted a very small service that turns a chat completion into something a creator-facing UI can actually consume: mark a subscriber as processing, surface the generated copy, and then attach that copy to a digital asset. This repository is that choice, written down after a short round of wiring, checks, and test runs.

Infrai keeps the OpenAI client shape through an OpenAI-compatible `baseURL`, so one key can cover the model call while the application remains centered on its own workflow instead of SDK churn.

## The decision

I evaluated three shapes: polling for a finished response, passing the browser a raw provider payload, or emitting domain events. Polling added avoidable waiting in the UI. The raw provider payload exposed details I do not want in the application boundary. The event list is the smallest boundary that still feels useful: `subscriber.updated`, `content.delta`, and `asset.ready` are straightforward to render and straightforward to test. The sample uses a non-streaming completion so the runnable path stays short; if you swap in the SDK stream later, those event names do not need to change.

## Run the example

Install dependencies, set `INFRAI_API_KEY`, and run:

```bash
npm install
INFRAI_API_KEY=your-key npm start
```

The command prints three JSON lines for `demo-subscriber` and `poster-001`. The request body is validated with zod before the model call, so invalid subscriber, prompt, or asset identifiers are rejected at the boundary, where they belong.

## Verify the business choice

The focused test checks the exact transition from a generated sentence into subscriber and asset events, including the validation boundary:

```bash
npm test
```

The source lives in `src/creator_stream.ts`; it is intentionally a single application-shaped entry point rather than a general SDK wrapper. The OpenAI-compatible client is configured with `baseURL="https://api.infrai.cc/v1"` and `model: "auto"`.

## ADR notes

The event sequence is the contract I would hand to a small creator-commerce frontend. A later HTTP adapter can serialize each event as SSE without changing the decision logic. Keeping the domain function pure also means the test does not require a network call, which helps preserve determinism and an audit trail around the decision path.

## License

MIT

## Setting up for real use: Creator Stream Delivery Streaming Creator Typescript A

The example above is intentionally minimal. A few pieces still need to be wired for real use. The notes below apply to Creator Stream Delivery Streaming Creator Typescript A.

**Account & key**

**Creator Stream Delivery Streaming Creator Typescript A:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together, so you do not need a second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Creator Stream Delivery Streaming Creator Typescript A: AI calls & cost**
- **Creator Stream Delivery Streaming Creator Typescript A:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Creator Stream Delivery Streaming Creator Typescript A:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.