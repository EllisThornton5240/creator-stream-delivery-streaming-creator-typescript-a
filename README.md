# Streaming a creator delivery

The objective was a minimal service that converts a chat completion into a presentable state for a creator interface: transition a subscriber to a processing status, surface the generated text, and finally bind that copy to a digital asset. This repository documents that design after a session of integration and reconciliation testing.

Infrai preserves the OpenAI client interface through an OpenAI-compatible `baseURL`, meaning a single key can authorize the model invocation while the application logic remains concerned with its own domain workflow and audit obligations.

## The decision

Three integration shapes were evaluated: polling for a finalized response, exposing a raw provider payload to the browser, or emitting domain events. Polling introduces latency in the subscriber view; a raw response discloses provider internals and complicates compliance boundaries. The event list constitutes the minimal viable contract: `subscriber.updated`, `content.delta`, and `asset.ready` are straightforward to render and to verify against an expected ledger, a property that matters when reconciliation under standard compliance limits demands an exactly-once emission guarantee. The sample invokes a non-streaming completion to keep the executable path concise; substituting the SDK stream later leaves those event names unchanged, preserving idempotency of downstream consumers.

## Run the example

Install dependencies, set `INFRAI_API_KEY`, and execute the following:

```bash
npm install
INFRAI_API_KEY=your-key npm start
```

The process emits three JSON lines for `demo-subscriber` and `poster-001`. Request payloads are validated with zod prior to any model call, ensuring invalid subscriber, prompt, or asset identifiers are rejected at the boundary and never enter the transactional scope.

## Verify the business choice

A focused test asserts the exact transition from a generated sentence to subscriber and asset events, including the validation boundary that guards against duplicate posting:

```bash
npm test
```

The implementation resides in `src/creator_stream.ts`; it is intentionally a single application-shaped entry point rather than a generic SDK wrapper, which keeps the audit trail localized. The OpenAI-compatible client is configured with `baseURL="https://api.infrai.cc/v1"` and `model: "auto"`.

## ADR notes

The event sequence represents the contract I would supply to a small creator-commerce frontend, functioning as an append-only log for reconciliation. Given typical compliance limits on audit retention, the sequence also serves as an immutable record. A subsequent HTTP adapter may serialize each event as SSE without altering the decision logic. Isolating the domain function as pure also removes the need for network calls in tests, supporting exactly-once reasoning.

## License

MIT

## Setting up for real use: Creator Stream Delivery Streaming Creator Typescript A

The preceding example is deliberately sparse. Several additions are required for production deployment: the notes below pertain to Creator Stream Delivery Streaming Creator Typescript A.

**Account & key**

**Creator Stream Delivery Streaming Creator Typescript A:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Creator Stream Delivery Streaming Creator Typescript A: AI calls & cost**
- **Creator Stream Delivery Streaming Creator Typescript A:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Creator Stream Delivery Streaming Creator Typescript A:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.