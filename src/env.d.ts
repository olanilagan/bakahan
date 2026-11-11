type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    /** The logged-in member, or null. Set by src/middleware.ts. */
    user: import('./lib/auth').SessionUser | null;
  }
}
