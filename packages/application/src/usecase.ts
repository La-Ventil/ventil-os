export type Command<Args extends unknown[], Result> = (...args: Args) => Promise<Result>;
export type Query<Args extends unknown[], Result> = (...args: Args) => Promise<Result>;
