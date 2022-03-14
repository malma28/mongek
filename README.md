**Note: I can not give certainty whether this package can be used in Plain JavaScript or not.**

# Installation

```shell
npm i mongek
```

# Docs

This package will marshal class to json.

Currently, this package is only capable of marshal to json string only.

Then how is it different from us using the usual `JSON.stringify`?

The difference is that we can make our fields much easier to organize.

Imagine if you want to have fields in your class that shouldn't be undefined or null when marshaled to JSON, or you want to have fields that shouldn't exist when marshaled to JSON.

With this package, you can do it "all" using a decorator. So you don't have to work hard and take a long time to do it yourself.

## @field(name: string, required: boolean)
This decorator is used to change the field name when marshal to JSON.

The first parameter is filled with the name of the field that will be set when the class is marshalled to JSON.

The second parameter is useful as a choice whether the marshal field is required or not.
If the field is required, then when it is marshalled and the field is empty (the value is undefined or null) then an error will appear.

**Example**
```ts
import * as mongek from "mongek";

class Item {
    mongek.field("id", true)
    id: string;
    mongek.field("name", true)
    name: string;
    mongek.field("owner", false)
    owner: string;
    mongek.field("max_per_slot", true)
    maxPerSlot: number;

    constructor(id: string, name: string, owner: string, maxPerSlot: number) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.maxPerSlot = maxPerSlot;
    }
}

let item1 = new Item("item1", "Item 1", "Malma", 10);
console.log(mongek.marshal(item1));

let item2 = new Item("item2", "Item 2", undefined, 16);
console.log(mongek.marshal(item2));

let item3 = new Item("item3", undefined, "Malma", 10);
console.log(mongek.marshal(item3));
```
**Result**
```shell
{"id":"item1","name":"Item 1","owner":"Malma","max_per_slot":10}
{"id":"item2","name":"Item 2","max_per_slot":16}
Error: Field name is required
```