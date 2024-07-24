import {test} from "vitest";
import PromiseLock from "../src/PromiseLock";

test("promise", async () => {
    await testPromise()
    console.log("done")
})

async function testPromise() {
    let num: bigint = 0n;
    setTimeout(() => {
        console.log(num)
    }, 1000)
    num++
}


test("promise lock", async () => {
    let steps = []

    function testPromiseLock(callback: () => void) {
        setTimeout(() => {
            steps.push(9)
            callback()
            steps.push(10)
        }, 1000)
    }

    steps.push(1)
    let promiseLock = new PromiseLock<boolean>();
    steps.push(2)
    let num = 0n
    testPromiseLock(async () => {
        try {
            steps.push(3)
            steps.push(4)
            console.log(num)
            promiseLock.unlock(true)
        } catch (e) {
            promiseLock.unlockError()
        }
    })

    steps.push(5);
    try {
        steps.push(6)
        await promiseLock.lock()
        steps.push(7)
    } catch (e) {
        steps.push(8)
    }
    console.log(steps)
})