/**
 * Next.js 15.5 still loads `middleware.ts`. Logic lives in `proxy.ts` (Next 16+ convention).
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 */
export { proxy as middleware, config } from "./proxy";
