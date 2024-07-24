export default class PromiseLock<T, E = void> {

    private readonly promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void
    reject: (reason?: E) => void

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    async lock() {
        return await this.promise
    }

    unlock(result: T) {
        this.resolve(result);
    }

    unlockError(error?: E) {
        this.reject(error);
    }
}