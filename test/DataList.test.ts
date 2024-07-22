import {describe, expect, test} from 'vitest'
import {datalist} from "../src";
import {Order, User} from "../src/model";
import {JMap} from "../src";


describe('datatable common', () => {
    test("filter", () => {
        let arr = [1, 2, 3, 4, 5]
        let arrayTable = datalist(arr)
        let filterFun = item => item % 2 == 0
        let array = arrayTable.filter(filterFun).toArray();
        expect(array).to.deep.equal(arr.filter(filterFun))
    })

    test("concat", () => {
        let arr = [1, 2]
        let arr2 = [3, 4]
        let arrayTable = datalist(arr)
        let arrayTable2 = datalist(arr2)
        let array = arrayTable.concat(arrayTable2).toArray()
        expect(array).to.deep.equal(arr.concat(arr2))
    })

    test("sort", () => {
        let arr = [3, 1, 4, 5, 2]
        let arrayTable = datalist(arr)
        let comparator = (a, b) => a - b
        let array = arrayTable.sort(comparator).toArray()
        expect(array).to.deep.equal(arr.sort(comparator))
    })

    test("reverse", () => {
        let arr = [1, 2, 3, 4, 5]
        let arrayTable = datalist(arr)
        let array = arrayTable.reverse().toArray()
        expect(array).to.deep.equal(arr.reverse())
    })

    test("map", () => {
        let arr = [1, 2, 3, 4, 5]
        let arrayTable = datalist(arr)
        let mapFun = item => item + 1
        let array = arrayTable.map(mapFun).toArray()
        expect(array).to.deep.equal(arr.map(mapFun))
    })


    test("unshift", () => {
        let arr = [1, 2]
        let arr2 = [3, 4]
        let arrayTable = datalist(arr)
        let arrayTable2 = datalist(arr2)
        let array = arrayTable.unshift(arrayTable2).toArray()
        arr.unshift(...arr2)
        expect(array).to.deep.equal(arr)
    })


    test("every", () => {
        let arr = [1, 1, 1, 1]
        let arrayTable = datalist(arr)
        let predicate = item => item == 1
        let result1 = arrayTable.every(predicate)
        let result2 = arr.every(predicate)
        expect(result1).to.equal(true)
        expect(result2).to.equal(true)
    })

    test("some", () => {
        let arr = [1, 1, 2, 1]
        let arrayTable = datalist(arr)
        let predicate = item => item == 1
        let result1 = arrayTable.some(predicate)
        let result2 = arr.some(predicate)
        expect(result1).to.equal(true)
        expect(result2).to.equal(true)
    })

    test("flatMap", () => {
        let arr = [[1, 2], [3, 4]];
        let arrayTable = datalist(arr)
        let arrays = arrayTable.flatMap(item => item).toArray();
        expect(arrays).to.deep.equal(arr.flatMap(item => item))
    })

    test("min", () => {
        let arr = [1, 2, 3, 3, 1];
        let arrayTable = datalist(arr)
        let min = arrayTable.min(item => item)
        expect(min?.value).to.equal(1)
        expect(min?.items).to.deep.equal([{index: 0, item: 1}, {index: 4, item: 1}])
    })

    test("max", () => {
        let arr = [1, 2, 3, 3, 1];
        let arrayTable = datalist(arr)
        let max = arrayTable.max(item => item)
        expect(max?.value).to.equal(3)
        expect(max?.items).to.deep.equal([{index: 2, item: 3}, {index: 3, item: 3}])
    })
    test("toMap", () => {
        let arr = [1, 2, 3];
        let arrayTable = datalist(arr)
        let map = arrayTable.toMap(item => item + "");
        expect(map).to.deep.equal(new JMap([["1", 1], ["2", 2], ["3", 3]]))
    })

    test("getLastItem", () => {
        let arr = [1, 2, 3];
        let arrayTable = datalist(arr)
        let result = arrayTable.getLastItem();
        expect(result).to.equal(arr[arr.length - 1])
    })
    test("getItem", () => {
        let arr = [1, 2, 3];
        let arrayTable = datalist(arr)
        let result = arrayTable.getItem(-1);
        expect(result).to.equal(arr[arr.length - 1])
    })

    test("getItem when out range", () => {
        let arr = [1, 2, 3];
        let arrayTable = datalist(arr)
        let result = arrayTable.getItem(-5);
        expect(result).to.equal(undefined)
    })

    test("distinct", () => {
        let arr = [1, 2, 3, 3];
        let arrayTable = datalist(arr)
        let result = arrayTable.distinct(item => item).toArray();
        expect(result).to.deep.equal([1, 2, 3])
    })

    test("toString", () => {
        let arr = [1, 2, 3];
        let arrayTable = datalist(arr)
        let result = arrayTable.toString();
        expect(result).to.equal(arr.toString())
    })

    test("groupBy", () => {
        let arr = [1, 2, 3, 3, 1];
        let arrayTable = datalist(arr)
        let map = arrayTable.groupBy(item => item);
        expect(map).to.deep.equal(new JMap<number, number[]>([[1, [1, 1]], [2, [2]], [3, [3, 3]]]))
    })

    test("toGroupMap", () => {
        let arr = [1, 2, 3, 3, 1];
        let arrayTable = datalist(arr)
        let map = arrayTable.toGroupMap(item => item + "",
            (value, key) => {
                return value.map(item => item + "")
            });
        expect(map).to.deep.equal(new JMap([["1", ["1", "1"]], ["2", ["2"]], ["3", ["3", "3"]]]))
    })

})

describe('firstOf', () => {
    let arr = [1, 2, 3, 4, 5, 1, 2, 4, 2]
    let arrayTable = datalist(arr)
    test("firstOf found", () => {
        let result = arrayTable.firstOf(item => item == 4);
        expect(result).to.deep.equal({
            index: 3,
            item: 4
        });
    })
    test("firstOf unFound", () => {
        let result = arrayTable.firstOf(item => item == 6);
        expect(result).to.equal(undefined)
    })
})

describe('lastOf', () => {
    let arr = [1, 2, 3, 4, 5, 1, 2, 4, 2]
    let arrayTable = datalist(arr)
    test("lastOf found", () => {
        let result = arrayTable.lastOf(item => item == 4);
        expect(result).to.deep.equal({
            index: 7,
            item: 4
        })
    })
    test("lastOf unFound", () => {
        let result = arrayTable.lastOf(item => item == 6);
        expect(result).to.equal(undefined)
    })
})


describe('datatable slice', () => {
    let arr = [1, 2, 3, 4, 5]
    let arrayTable = datalist(arr)
    test(`slice 0 --> length(${arr.length})`, () => {
        let array = arrayTable.slice().toArray();
        expect(array).to.deep.equal(arr.slice())
    })


    test("slice 1 --> 4", () => {
        let array = arrayTable.slice(1, 4).toArray();
        expect(array).to.deep.equal(arr.slice(1, 4))
    })

    test("slice -1 --> 6", () => {
        let array = arrayTable.slice(-1, 6).toArray();
        expect(array).to.deep.equal(arr.slice(-1, 6))
    })

    test("slice 1 --> -1", () => {
        let array = arrayTable.slice(1, -1).toArray();
        expect(array).to.deep.equal(arr.slice(1, -1))
    })

    test("slice -4 --> -1", () => {
        let array = arrayTable.slice(-4, -1).toArray();
        expect(array).to.deep.equal(arr.slice(-4, -1))
    })

    test("slice -4 --> 4", () => {
        let array = arrayTable.slice(-4, 4).toArray();
        expect(array).to.deep.equal(arr.slice(-4, 4))
    })

    test(`slice 1 --> length+1(6)`, () => {
        let array = arrayTable.slice(1, arr.length + 1).toArray();
        expect(array).to.deep.equal(arr.slice(1, arr.length + 1))
    })

    test("slice 1 --> -5", () => {
        let array = arrayTable.slice(1, -5).toArray();
        expect(array).to.deep.equal(arr.slice(1, -5))
    })

    test("slice 7 --> 9", () => {
        let array = arrayTable.slice(7, 9).toArray();
        expect(array).to.deep.equal(arr.slice(7, 9))
    })
})

describe("splice", () => {
    let arr = [1, 2, 3, 4, 5]
    let arrayTable = datalist(arr)

    test("splice 2 -> 1", () => {
        let array = arrayTable.splice(2, 1).toArray();
        arr.splice(2, 1)
        expect(array).to.deep.equal(arr)
    })

    test("splice 2 -> 4", () => {
        let array = arrayTable.splice(2, 4).toArray();
        arr.splice(2, 4)
        expect(array).to.deep.equal(arr)
    })

    test("splice 0 -> 4", () => {
        let array = arrayTable.splice(0, 4).toArray();
        arr.splice(0, 4)
        expect(array).to.deep.equal(arr)
    })

    test("splice 0 -> 9", () => {
        let array = arrayTable.splice(0, 9).toArray();
        arr.splice(0, 9)
        expect(array).to.deep.equal(arr)
    })

    test("splice 1 -> -2", () => {
        let array = arrayTable.splice(1, -2).toArray();
        arr.splice(1, arr.length - 2 - 1)
        expect(array).to.deep.equal(arr)
    })

    test("splice 1 -> -6", () => {
        let array = arrayTable.splice(1, -6).toArray();
        arr.splice(1, -1)
        expect(array).to.deep.equal(arr)
    })
    test("splice -4 -> 2", () => {
        let array = arrayTable.splice(-4, 2).toArray();
        arr.splice(arr.length - 4, arr.length - (arr.length - 4) - 2)
        expect(array).to.deep.equal(arr)
    })

    test("splice -4 -> -2", () => {
        let array = arrayTable.splice(-4, -2).toArray();
        arr.splice(arr.length - 4, arr.length - 2 - (arr.length - 4)
        )
        expect(array).to.deep.equal(arr)
    })
})

describe("reduce", () => {
    let arr = [1, 2, 3, 4, 5]
    let arrayTable = datalist(arr)

    test("reduce with init and return same type", () => {
        let result = arrayTable.reduce((a, b) => a + b, 0)
        expect(result).to.equal(arr.reduce((a, b) => a + b, 0))
    })
    test("reduce with  and return same type", () => {
        let result = arrayTable.reduce((a, b) => a + b)
        expect(result).to.equal(arr.reduce((a, b) => a + b))
    })
    test("reduce without return same type", () => {
        let result = arrayTable.reduce((a, b) => a + "" + b, "")
        expect(result).to.equal(arr.reduce((a, b) => a + "" + b, ""))
    })

    test("reduceRight with init and return same type", () => {
        let result = arrayTable.reduceRight((a, b) => a + b, 0)
        expect(result).to.equal(arr.reduceRight((a, b) => a + b, 0))
    })
    test("reduceRight with  and return same type", () => {
        let result = arrayTable.reduceRight((a, b) => a + b)
        expect(result).to.equal(arr.reduceRight((a, b) => a + b))
    })
    test("reduceRight without return same type", () => {
        let result = arrayTable.reduceRight((a, b) => a + "" + b, "")
        expect(result).to.equal(arr.reduceRight((a, b) => a + "" + b, ""))
    })
})


describe("groupReduceMap", () => {
    let arr = [1, 2, 2, 3, 3, 3];
    let arrayTable = datalist(arr)
    test("group reduce without init and return same type", () => {
        let groupSum = arrayTable.groupReduceMap(item => item + "",
            (pre, cur, groupList) => {
                return pre + cur
            })
        expect(groupSum).to.deep.equal(new Map([["1", 1], ["2", 4], ["3", 9]]))
    })

    test("group reduce with init and return same type", () => {
        let groupSum = arrayTable.groupReduceMap(item => item + "",
            (pre, cur, groupList) => {
                return pre + cur
            }, (key, groupList) => 1)
        expect(groupSum).to.deep.equal(new Map([["1", 2], ["2", 5], ["3", 10]]))
    })
    test("group reduce with init and return not same type", () => {
        let groupSum = arrayTable.groupReduceMap(item => item + "",
            (pre, cur, groupList) => {
                return pre + "" + cur
            }, (key, groupList) => key + "")
        expect(groupSum).to.deep.equal(new Map([["1", "11"], ["2", "222"], ["3", "3333"]]))
    })
})

describe('join', () => {
    let userDataList = datalist<User>([{userId: 1, userName: "a"}, {userId: 2, userName: "b"}])
    let orderDataList = datalist<Order>([{orderId: 1, userId: 1}, {orderId: 2, userId: 1}, {orderId: 3, userId: 3}]);


    test('join', () => {
        let userOrderList = userDataList.join(orderDataList,
            (user, order) => user.userId == order.userId,
            (user, order) => ({
                userId: user.userId,
                userName: user.userName,
                orderId: order.orderId
            }))
            .toArray();
        expect(userOrderList).to.deep.equal([{userId: 1, userName: "a", orderId: 1}, {
            userId: 1,
            userName: "a",
            orderId: 2
        }])
    })
    test('leftJoin', () => {
        let userOrderList = userDataList.leftJoin(orderDataList,
            (user, order) => user.userId == order.userId,
            "userOrderList")
            .toArray();
        expect(userOrderList).deep.equal([{
            userId: 1,
            userName: "a",
            userOrderList: [{orderId: 1, userId: 1}, {orderId: 2, userId: 1}]
        }, {userId: 2, userName: "b", userOrderList: []}])
    })

    test('rightJoin', () => {
        let userOrderList = orderDataList.rightJoin(userDataList,
            (order, user) => user.userId == order.userId,
            "userOrderList")
            .toArray();
        expect(userOrderList).deep.equal([{
            userId: 1,
            userName: "a",
            userOrderList: [{orderId: 1, userId: 1}, {orderId: 2, userId: 1}]
        }, {userId: 2, userName: "b", userOrderList: []}])
    })
})


