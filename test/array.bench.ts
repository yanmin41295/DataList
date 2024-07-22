import {bench, describe} from "vitest";

describe('test concat', () => {
    bench.skip('self implement', () => {
        const a = [1, 2, 3, 4, 5]
        const b = [6, 7, 8, 9, 0]
        const c = new Array<number>(a.length + b.length)
        for (let i = 0; i < a.length; i++) {
            c[i] = a[i]
        }
        let offset = a.length
        for (let i = 0; i < b.length; i++) {
            c[i + offset] = b[i]
        }
        c.length;
    })
    bench.skip('origin implement', () => {
        const a = [1, 2, 3, 4, 5]
        const b = [6, 7, 8, 9, 0]
        const c = a.concat(b)
        c.length
    })
})

describe('test fori and foreach', () => {
    let arr = new Array<number>(100)
    for (let i = 0; i < arr.length; i++) {
        arr[i] = i
    }
    bench.skip('fori', () => {
        for (let index = 0; index < arr.length; index++) {
            index = index + 1
        }
    })
    bench.skip('foreach', () => {
        arr.forEach((item, index, arr) => {
            arr[index] = index + 1
        })
    })
})

describe('test filter', () => {
    let arr = new Array<number>(100)
    for (let i = 0; i < arr.length; i++) {
        arr[i] = i
    }
    let filterFun = (item: number) => item > 50
    bench('filter', () => {
        let result = arr.filter(filterFun)
        result.length
    })
    bench('self filter', () => {
        let data = new Array<number>(arr.length)
        let offset = 0;
        for (let index = 0; index < arr.length; index++) {
            if (filterFun(data[index])) {
                data[offset++] = data[index]
            }
        }
        data.length = offset
    })
})