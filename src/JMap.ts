import {IndexType} from "./index";

export class JMap<K, V> extends Map<K, V> {

    init(obj: IndexType<V>) {
        for (let objKey in obj) {
            this.set(objKey, obj[objKey]);
        }
        return this;
    }

    putIfAbsent(key: K, value: V): V | undefined {
        let result = this.get(key)
        if (result) {
            return result
        }
        this.set(key, value)
    }

    /**
     * key不存在，计算不为null，添加并返回新值，计算为null，则不进行操作，返回null
     * key存在，不进行操作，computeIfAbsent方法返回旧值；
     * @param key
     * @param valueFn
     */
    computeIfAbsent(key: K, valueFn: (key: K) => V | undefined): V | undefined {
        let result = this.get(key);
        if (!result) {
            result = valueFn(key)
            if (!result) {
                return undefined;
            }
            this.set(key, result);
        }
        return result;
    }

    /**
     *  key不存在，不进行操作，computeIfPresent方法返回null；
     *  key存在，计算后结果为null，删除当前key，compute方法返回null；新值覆盖旧值，computeIfPresent方法返回新值；
     * @param key
     * @param fn
     */
    computeIfPresent(key: K, fn: (key: K, value: V | undefined) => V) {
        let result = this.get(key);
        if (!result) {
            return undefined;
        }
        result = fn(key, result);
        if (!result) {
            this.delete(key);
            return undefined;
        }
        this.set(key, result);
        return result
    }

    getOfDefault(key: K, value: V): V {
        return this.get(key) ?? value;
    }

    filter(predicate: (key: K, value: V) => boolean): JMap<K, V> {
        let result = new JMap<K, V>();
        this.forEach((value, key) => {
            if (predicate(key, value)) {
                result.set(key, value);
            }
        })
        return result;
    }

    toObj() {
        let result = {} as { [key: string | number]: V };
        this.forEach((value, key) => {
            result[key] = value;
        })
        return result;
    }

    reMap<VV, KK = K>(valueMap: (value: V, key?: K) => VV, keyMap?: (value: V, key?: K) => KK,): JMap<KK, VV> {
        let result = new JMap<KK, VV>();
        this.forEach((value, key) => {
            result.set(keyMap ? keyMap(value, key) : key, valueMap(value, key));
        })
        return result;
    }


}