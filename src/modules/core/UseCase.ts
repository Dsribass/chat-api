export interface UseCase<P, R> {
  execute: (param: P) => Promise<R>;
}
