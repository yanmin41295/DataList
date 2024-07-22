import {JMap} from "./JMap";


export function stream<T>(dataList: T[]) {
    return Stream.of(...dataList)
}

/**
 * array指定初始化大小比push扩容更快
 */
export class Stream<T> {
    private readonly dataProvider: () => T[]

    static of<T>(...elements: T[]) {
        return new Stream<T>(() => elements);
    }


    constructor(...dataList: T[])
    constructor(dataProvider: () => T[])
    constructor(construct: T[] | (() => T[])) {
        if (Array.isArray(construct)) {
            this.dataProvider = this.fun(construct, "constructor")
        } else {
            this.dataProvider = this.fun(construct(), "constructor")
        }
    }

    filter(predicate: (item: T) => boolean): Stream<T> {
        return new Stream<T>(this.fun(this.dataProvider().filter(predicate), "filter"))
    }

    concat(steam: Stream<T>): Stream<T> {
        return new Stream<T>(this.fun(this.dataProvider().concat(steam.dataProvider()), "concat"))
    }

    map<R>(mapFun: (item: T) => R): Stream<R> {
        return new Stream<R>(this.fun(this.dataProvider().map(mapFun), "map"))
    }

    flatMap<R>(mapFun: (item: T) => R[]): Stream<R> {
        return new Stream<R>(this.fun(this.dataProvider().flatMap(mapFun), "flatMap"))
    }

    reduce(init: T, fn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T {
        return this.dataProvider().reduce(fn, init);
    }

    reduceRight(init: T, fn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T {
        return this.dataProvider().reduceRight(fn, init);
    }

    anyMatch(predicate: (item: T) => boolean): boolean {
        return this.dataProvider().some(predicate);
    }

    allMatch(predicate: (item: T) => boolean) {
        return this.dataProvider().every(predicate)
    }

    noneMatch(predicate: (item: T) => boolean) {
        return this.dataProvider().every(item => !predicate(item));
    }

    find(predicate: (item: T) => boolean) {
        return this.dataProvider().find(predicate);
    }

    average(fn: (item: T) => number): number {
        let sum = 0;
        let dataList = this.dataProvider();
        for (let data of dataList) {
            sum += fn(data)
        }
        return sum / dataList.length;
    }

    //   Optional<T> min(Comparator<? super T> comparator);
    min(fn: (item: T) => number) {
        let dataList = this.dataProvider();
        let minItem = dataList[0];
        let min = fn(minItem);
        for (let i = 1; i < dataList.length; i++) {
            let result = fn(dataList[i]);
            if (result < min) {
                minItem = dataList[i];
                min = result;
            }
        }
        return minItem;
    }

    max(fn: (item: T) => number) {
        let dataList = this.dataProvider();
        let maxItem = dataList[0];
        let max = fn(maxItem);
        for (let i = 1; i < dataList.length; i++) {
            let result = fn(dataList[i]);
            if (result > max) {
                maxItem = dataList[i];
                max = result;
            }
        }
        return maxItem;
    }

    count() {
        return this.dataProvider().length;
    }

    peek(fun: T extends object ? (item: T) => void : (item: T) => T): Stream<T> {
        return new Stream<T>(this.fun(this.dataProvider().map((item: T, index: number, array: T[]) => {
            if (typeof item === "object") {
                fun(item);
                return item;
            } else {
                return fun(item) as T;
            }
        }), "peek"))
    }

    slice(start: number, end?: number) {
        return new Stream<T>(this.fun(this.dataProvider().slice(start, end!), "slice"))
    }

    splice(start: number, deleteCount: number, ...items: T[]) {
        return new Stream<T>(this.fun(this.dataProvider().splice(start, deleteCount, ...items), "slice"))
    }

    sort(compareFn: (a: T, b: T) => number): Stream<T> {
        return new Stream<T>(this.fun([...this.dataProvider()].sort(compareFn), "sort"))
    }

    distinct<K = T>(fn: (item: T) => K, fromHead: boolean = true) {
        const map = new Map<K, T>;
        let dataList = this.dataProvider();
        if (!fromHead) {
            for (let i = dataList.length - 1; i >= 0; i--) {
                if (map.has(fn(dataList[i]))) {
                    continue
                }
                map.set(fn(dataList[i]), dataList[i]);
            }
        } else {
            for (let i = 0; i < dataList.length; i++) {
                if (map.has(fn(dataList[i]))) {
                    continue
                }
                map.set(fn(dataList[i]), dataList[i]);
            }
        }
        let list = new Array<T>(map.size);
        let index = 0
        for (let value of map.values()) {
            list[index++] = value
        }
        return new Stream<T>(...list)
    }

    toArray(): T[] {
        return this.dataProvider();
    }

    toMap<K>(mapKeyFun: (item: T) => K): JMap<K, T> {
        let map = new JMap<K, T>();
        this.dataProvider().forEach(item => {
            let key = mapKeyFun(item);
            if (map.has(key)) {
                throw new Error("duplicate key")
            }
            map.set(key, item);
        })
        return map
    }

    toGroupMap<K, V = T>(groupKeyFun: (item: T) => K, groupItemFun: ((key: K, value?: T[], index?: number) => V) = ((key: K, array?: T[], index?: number) => array![index!] as unknown as V)): JMap<K, V[]> {
        let map = new JMap<K, V[]>();
        this.dataProvider().forEach((item, index, array) => {
            let key = groupKeyFun(item);
            let value = groupItemFun(key, array, index)
            let groupList = map.get(key);
            if (groupList) {
                groupList.push(value)
            } else {
                map.set(key, [value])
            }
        })
        return map
    }

    private fun<D>(dataList: D[], tag: string): () => D[] {
        console.log(tag)
        console.log(dataList)
        return () => dataList;
    }
}


/**
 npm i chai -D
 npm i mocha -D
 npm i chai -D

 */