export interface Service<P, R> {
  execute: (param: P) => Promise<R>;
}
