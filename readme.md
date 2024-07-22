# collect tools for nodejs

## DataList  like java arraylist

- warp array methods and use like stream in java
- most of method are used like the same method in array, and it return a new DataList

### usage

#### stream-like method: always return a new DataList wrapping a new array

```typescript
import {datalist, DataList} from "./DataList";

const users = [{userId: "1", userAge: 18}, {userId: "2", userAge: 28}]
const orders = [{orderId: "1", userId: "1"}]


// instance DataList with array
let userDataList = new DataList(users)
let orderDataList = datalist(orders)

// filter element in datalist and return an new DataList with the elements 
// like  users.filter(user => user.userId === "2")
//and return DataList with array [{userId: 1, userAge: 18 }]
userDataList.filter(user => user.userId === 2)

// the same logic with such method below

userDataList.concat(userDataList)
userDataList.slice(0, 1)


userDataList.reverse()
userDataList.map(user => user.userAge)
userDataList.unshift(userDataList)
userDataList.reduce((sum, user) => sum + user.userAge, 0)
userDataList.reduceRight((sum, user) => sum + user.userAge, 0)
userDataList.every(user => user.age > 18)
userDataList.some(user => user.age > 18)
userDataList.forEach(user => user.age++)

// join DataList like sql join
// [{userId:"1",orderId:"1",userAge:18}]
useDataList.join(orderDataList,
    (user, order) => user.userId === order.userId,
    (user, order) => ({...user, ...order}))
// join DataList like sql join
// [{userId:"1",userAge:18,orderList:[{orderId:"1",userId:"1"}]}]
useDataList.leftJoin(orderDataList,
    (user, order) => user.userId === order.userId,
    "userOrderList")

// [{userId:"1",userAge:18,orderList:[{orderId:"1",userId:"1"}]}]
orderDataList.rightJoin(useDataList,
    (order, user) => user.userId === order.userId,
    "userOrderList")

// [1,2,3,4]
dataList([[1, 2], [3, 4]]).flatMap(item => item)

userDataList.distinct(user => user.userId)
/**
 * the methods below  won't change the array in origin DataList but return an new DataList warp an new array
 * which are different from array
 */
userDataList.sort((user1, user2) => user1.userAge - user2.userAge)

// splice is much a bit of more different,
// when the second is negative, it means back from the end of array
// when the second is positive, it means delete count after start index
userDataList.splice(1, -1)

```

#### calculate methods

```typescript

/*
 * return the first element and index in DataList which satisfy the condition
 {
    item: {userId: "1", userAge: 18},
    index:0
 }
 */
userDataList.firstOf(user => user.age == 18)
userDataList.lastOf(user => user.age == 18)


// {value:28,items:[{userId:1,age:18}]}
userDataList.min(user => user.userAge)
// {value:28,items:[{userId:2,age:28}]}
userDataList.max(user => user.userAge)

userDataList.size()
userDataList.isEmpty()
userDataList.toArray()
userDataList.toString()
userDataList.getItem(1)
userDataList.getLastItem()

userDataList.toMap(user => user.userId)
userDataList.groupBy(user => user.userAge)
userDataList.toGroupMap(user => user.userAge, user => user)
userDataList.groupReduceMap(user => user.userAge, (pre, cur, list) => pre + cur.userAge, 0)

```

