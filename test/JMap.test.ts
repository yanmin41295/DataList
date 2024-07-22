import {describe, expect, test} from "vitest";
import {JMap} from "../src";


describe('JMap', () => {
    let obj = {"user1": "user1", "user2": "user2", "user3": "user3"}
    test("putIfAbsent", () => {
        let map = new JMap<string, string>().init(obj)
        map.putIfAbsent("user4", "user4")
        expect(map.get("user4")).to.equal("user4")
    })

    test("computeIfAbsent", () => {
        let map = new JMap<string, string>().init(obj)
        map.computeIfAbsent("user4", key => key)
        expect(map.get("user4")).to.equal("user4")
    })

    test("computeIfPresent", () => {
        let map = new JMap<string, string>().init(obj)
        map.computeIfPresent("user3", key => "user333")
        expect(map.get("user3")).to.equal("user333")
    })
    test("getOfDefault", () => {
        let map = new JMap<string, string>().init(obj)
        let result = map.getOfDefault("user4", "user4")
        expect(result).to.equal("user4")
    })
    test("filter", () => {
        let map = new JMap<string, string>().init(obj)
        map = map.filter((key, value) => value.startsWith("user1"))
        expect(map.get("user3")).to.equal(undefined)
    })

    test("toObj", () => {
        let map = new JMap<string, string>().init(obj)
        let result = map.toObj()
        expect(result).to.deep.equal(obj)
    })

    test("reMap", () => {
        let order = {
            userId: 1,
            orderId: 2
        }
        let map = new JMap<string, number>().init(order)
        let newMap = map.reMap((value, key) => value + 1, (value, key) => key + "")
        expect(newMap).to.deep.equal(new JMap().init({"userId": 2, "orderId": 3}))
    })
})