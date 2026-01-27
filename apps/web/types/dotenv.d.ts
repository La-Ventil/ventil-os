declare module 'dotenv' {
  export function config(options?: { path?: string }): {
    parsed?: Record<string, string>;
  };
}
