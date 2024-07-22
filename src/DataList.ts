import {JMap} from "./JMap";

export class DataList<T> {
    dataArray: T[];

    constructor(dataList?: T[]) {
        this.dataArray = dataList ?? [];
    }

    /**
     * {@link Array.prototype.filter}
     * @param predicate
     */
    filter(predicate: (item: T) => boolean): DataList<T> {
        return new DataList<T>(this.dataArray.filter(predicate))
    }

    /**
     * {@link Array.prototype.concat}
     * @param dataList
     */
    concat(dataList: DataList<T>) {
        let list: T[] = new Array<T>(this.size() + dataList.dataArray.length)
        this.forEach((item, index) => list[index] = item)
        dataList.forEach((item, index) => list[index + this.size()] = item)
        return new DataList(list)
    }


    /**
     * {@link Array.prototype.slice}
     */
    slice(start: number = 0, end: number = this.size()): DataList<T> {
        let range = this.correctRange({start, end})
        let result: T[] = [];
        start = range.start;
        end = range.end;
        if (end > start) {
            result = new Array<T>(end - start);
            for (let index = 0; index < end - start; index++) {
                result[index] = this.dataArray[index + start]
            }
        }
        return new DataList<T>(result);
    }

    /**
     * {@link Array.prototype.sort}
     */
    sort(compareFn: (a: T, b: T) => number) {
        let list = new Array<T>(this.size());
        this.forEach((item, index) => list[index] = item)
        list.sort(compareFn)
        return new DataList(list);
    }

    /**
     * {@link Array.prototype.splice}
     */
    splice(start: number, deleteCount: number = 0): DataList<T> {
        if (start > this.size()) {
            start = this.size()
        } else if (start < -this.size()) {
            start = 0
        } else if (start < 0) {
            start = this.size() + start;
        }
        let end;
        if (deleteCount < start - this.size()) {
            end = start;
        } else if (deleteCount < 0) {
            end = this.size() + deleteCount
        } else {
            end = start + deleteCount;
        }
        if (end <= start) {
            end = start;
        } else if (end > this.size()) {
            end = this.size()
        }
        let list = new Array<T>(this.size() - end + start)
        for (let index = 0; index < start; index++) {
            list[index] = this.dataArray[index]
        }
        for (let index = end; index < this.size(); index++) {
            list[index - end + start] = this.dataArray[index]
        }
        return new DataList<T>(list);
    }

    /**
     * {@link Array.prototype.reverse}
     */
    reverse() {
        let list = new Array<T>(this.size());
        this.forEach((item, index) => list[this.size() - 1 - index] = item)
        return new DataList(list);
    }

    /**
     * {@link Array.prototype.map}
     */
    map<R>(mapFun: (item: T) => R): DataList<R> {
        return new DataList(this.dataArray.map(mapFun))
    }

    /**
     * {@link DataList#concat}
     * {@link Array.prototype.unshift}
     * @param dataList
     */
    unshift(dataList: DataList<T>) {
        let list: T[] = new Array<T>(this.size() + dataList.dataArray.length)
        dataList.forEach((item, index) => list[index] = item)
        this.dataArray.forEach((item, index) => list[index + dataList.dataArray.length] = item)
        return new DataList(list)
    }

    /**
     * {@link Array.prototype.reduce}
     */
    reduce(reduceFun: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
    reduce(reduceFun: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
    reduce<R = T>(reduceFun: (previousValue: R, currentValue: T, currentIndex: number, array: T[]) => R, initialValue: R): R;
    reduce<R = T>(reduceFun: (previousValue: R, currentValue: T, currentIndex: number, array: T[]) => R, initialValue?: R): R {
        if (initialValue) {
            return this.dataArray.reduce(reduceFun, initialValue);
        } else {
            return this.dataArray.reduce(reduceFun);
        }
    }

    /**
     * {@link Array.prototype.reduceRight}
     */
    reduceRight(reduceFun: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
    reduceRight(reduceFun: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
    reduceRight<R = T>(reduceFun: (previousValue: R, currentValue: T, currentIndex: number, array: T[]) => R, initialValue: R): R;
    reduceRight<R = T>(reduceFun: (previousValue: R, currentValue: T, currentIndex: number, array: T[]) => R, initialValue?: R): R {
        if (initialValue) {
            return this.dataArray.reduceRight(reduceFun, initialValue);
        } else {
            return this.dataArray.reduceRight(reduceFun);
        }
    }


    /**
     * {@link Array.prototype.every}
     */
    every(predicate: (value: T, index: number, array: T[]) => boolean): boolean {
        return this.dataArray.every(predicate)
    }


    /**
     * {@link Array.prototype.some}
     */
    some(predicate: (value: T, index: number, array: T[]) => boolean): boolean {
        return this.dataArray.some(predicate)
    }

    forEach(eachFun: (value: T, index?: number, arr?: T[]) => void): this;
    forEach(eachFun: (value: T, index?: number, arr?: T[]) => void, range: {
        fromRight?: boolean,
        start?: number,
        end?: number
    }): this
    /**
     * {@link Array.prototype.forEach}
     */
    forEach(eachFun: (value: T, index?: number, arr?: T[]) => void, range?: {
        fromRight?: boolean,
        start?: number,
        end?: number
    }): this {
        let fromRight = range?.fromRight ?? false
        let {start, end} = range ? this.correctRange(range) : {start: 0, end: this.size()}
        if (fromRight) {
            for (let index = end - 1; index >= start; index--) {
                eachFun(this.dataArray[index], index, this.dataArray);
            }
        } else {
            for (let index = start; index < end; index++) {
                eachFun(this.dataArray[index], index, this.dataArray);
            }
        }
        return this;
    }


    join<S, R>(table: DataList<S>, onFun: (item: T, sItem: S) => boolean, mapFun: (item: T, sItem: S) => R, whereFun?: (r: R) => boolean) {
        let result: R[] = [];
        let filerFun: ((r: R) => boolean) = whereFun ?? ((_: R) => true)
        this.forEach(item => {
            table.forEach(sItem => {
                if (onFun(item, sItem)) {
                    let data = mapFun(item, sItem);
                    if (filerFun(data)) {
                        result.push(data);
                    }
                }
            })
        })
        return new DataList(result)
    }

    leftJoin<S, P extends string | ((joinItems: S[], item?: T) => infer R)>(table: DataList<S>,
                                                                            onFun: (item: T, joinItem: S) => boolean,
                                                                            mapFun: P): P extends ((joinItems: S[], item?: T) => infer R) ? DataList<R> : DataList<T & { [key in P]: S[] }> {
        let result = [];
        this.forEach(item => {
            let filterList = table.dataArray.filter(sItem => onFun(item, sItem));
            let data
            if (typeof mapFun === "string") {
                data = {
                    ...item,
                    [mapFun]: filterList
                };
            } else {
                data = mapFun(filterList, item);
            }
            result.push(data);
        })
        return new DataList(result)
    }

    rightJoin<S, P extends string | ((items: T[], item?: S) => infer R)>(table: DataList<S>,
                                                                         onFun: (item: T, joinItem: S) => boolean,
                                                                         mapFun: P): P extends (((items: T[], item?: S) => infer R)) ? DataList<R> : DataList<S & { [key in P]: T[] }> {
        let result = [];
        table.forEach(joinItem => {
            let filterList = this.dataArray.filter(item => onFun(item, joinItem));
            let data
            if (typeof mapFun === "string") {
                data = {
                    ...joinItem,
                    [mapFun]: filterList
                } as const
            } else {
                data = mapFun(filterList, joinItem)
            }
            result.push(data);
        })
        return new DataList(result)
    }

    flatMap<R>(mapFun: (item: T) => R[]) {
        let list: R[] = []
        this.forEach(item => list.push(...mapFun(item)))
        return new DataList(list)
    }

    distinct<K extends string | number>(fn: (item: T) => K, fromRight: boolean = false) {
        let map = new Map<K, T>();
        this.forEach(item => {
            let key = fn(item);
            if (!map.has(key)) {
                map.set(key, item);
            }
        }, {fromRight})

        let result: T[] = new Array(map.size);
        let index = 0
        map.forEach(item => result[index++] = item);
        return new DataList(result);
    }

    private valueCompare(fn: (item: T) => number, smallest: boolean): undefined | {
        value: number,
        items: { item: T, index: number }[]
    } {
        if (this.isEmpty()) {
            return undefined;
        } else {
            let result = {
                items: [{item: this.dataArray[0], index: 0}],
                value: fn(this.dataArray[0])
            };
            this.forEach((item, index: number) => {
                let value = fn(item);
                if (smallest ? value < result.value : (value > result.value)) {
                    result = {
                        items: [{item: this.dataArray[index], index: index}],
                        value: value
                    };
                } else if (value == result.value) {
                    result.items.push({item: this.dataArray[index], index: index})
                }
            }, {start: 1})
            return result;
        }
    }

    /**
     * {@link Array.prototype.indexOf}
     */
    firstOf(matchFun: (item: T) => boolean, start: number = 0): undefined | { item: T, index: number } {
        if (start < -this.size()) {
            start = 0;
        } else if (start < 0) {
            start = this.size() + start
        }
        let result = undefined;
        for (let index = start; index < this.size(); index++) {
            if (matchFun(this.dataArray[index])) {
                result = {item: this.dataArray[index], index: index}
                break;
            }
        }
        return result;
    }

    /**
     * {@link Array.prototype.lastIndexOf}
     */
    lastOf(matchFun: (item: T) => boolean, start: number = 0): undefined | { item: T, index: number } {
        if (start < -this.size()) {
            start = 0;
        } else if (start < 0) {
            start = this.size() + start
        }
        let result = undefined;
        for (let index = this.size() - 1; index >= start; index--) {
            if (matchFun(this.dataArray[index])) {
                result = {item: this.dataArray[index], index: index}
                break;
            }
        }
        return result;
    }

    min(fn: (item: T) => number): undefined | { value: number, items: { item: T, index: number }[] } {
        return this.valueCompare(fn, true)
    }

    /**
     * max
     * @param fn
     */
    max(fn: (item: T) => number): undefined | { value: number, items: { item: T, index: number }[] } {
        return this.valueCompare(fn, false)
    }


    private correctRange(range: { start?: number, end?: number }) {
        let start = range.start ?? 0;
        let end = range.end ?? this.size();
        if (start < -this.size()) {
            start = 0
        } else if (start < 0) {
            start = this.size() + start;
        } else if (start >= this.size()) {
            start = this.size()
        }

        if (end < -this.size()) {
            end = 0;
        } else if (end < 0) {
            end = this.size() + end;
        } else if (end > this.size()) {
            end = this.size();
        }
        return {start, end};
    }

    /**
     * {@link Array.prototype.length}
     */
    size() {
        return this.dataArray.length;
    }

    isEmpty() {
        return this.dataArray.length == 0;
    }

    toArray() {
        return this.dataArray;
    }

    toString() {
        return this.dataArray.toString();
    }

    toMap<K>(mapKeyFun: (item: T) => K): JMap<K, T> {
        let map = new JMap<K, T>();
        this.forEach(item => {
            let key = mapKeyFun(item);
            if (map.has(key)) {
                throw new Error("duplicate key")
            }
            map.set(key, item);
        })
        return map
    }

    groupBy<K, V = T>(groupKeyFun: (item: T, arr?: T[]) => K) {
        let map = new JMap<K, T[]>();
        this.forEach((item, index, array) => {
            let key = groupKeyFun(item, array);
            let groupList = map.get(key);
            if (groupList) {
                groupList.push(item)
            } else {
                map.set(key, [item])
            }
        })
        return map;
    }

    toGroupMap<K, V = T>(groupKeyFun: (item: T, arr?: T[]) => K,
                         groupItemFun: (value: T[], key?: K) => V[]): JMap<K, V[]> {
        let map = this.groupBy(groupKeyFun)
        let resultMap = new JMap<K, V>()
        map.forEach((value, key) => {
            resultMap.set(key, groupItemFun(value, key))
        })
        return resultMap
    }

    groupReduceMap<K>(groupKeyFun: (item: T, arr?: T[]) => K,
                      reduceFn: (pre: T, cur: T, groupList: T[], key?: K) => T)
    groupReduceMap<K>(groupKeyFun: (item: T, arr?: T[]) => K,
                      reduceFn: (pre: T, cur: T, groupList: T[], key?: K) => T,
                      initFun: (key: K, groupList: T[]) => T)
    groupReduceMap<K, V = T>(groupKeyFun: (item: T, arr?: T[]) => K,
                             reduceFn: (pre: V, cur: T, groupList: T[], key?: K) => V,
                             initFun: (key: K, groupList: T[]) => V)
    groupReduceMap<K, V = T>(groupKeyFun: (item: T, arr?: T[]) => K,
                             reduceFn: (pre: V, cur: T, groupList: T[], key?: K, initValue?: V) => V,
                             initFun?: (key: K, groupList: T[]) => V) {
        let jMap = this.groupBy(groupKeyFun);
        let map = new JMap<K, V>();
        jMap.forEach((value, key) => {
            let list = jMap.get(key) as T[]
            let result
            if (initFun) {
                result = list.reduce((previousValue: V, currentValue: T, currentIndex: number, array: T[]) => {
                        return reduceFn(previousValue, currentValue, array, key)
                    }, initFun(key, list)
                )
            } else {
                result = list.reduce((previousValue: V, currentValue: T, currentIndex: number, array: T[]) => {
                        return reduceFn(previousValue, currentValue, array, key);
                    }
                )
            }

            map.set(key, result);
        })
        return map
    }

    getItem(index: number) {
        if (index < -this.size() || index >= this.size()) {
            return undefined
        }
        return this.dataArray[index >= 0 ? index : this.size() + index]
    }

    getLastItem() {
        return this.isEmpty() ? undefined : this.getItem(this.dataArray.length - 1);
    }
}

export function datalist<T>(dataList: T[]) {
    return new DataList(dataList);
}

function createPerson(name: string): { [key: string]: string } {
    return {[name]: name};
}
