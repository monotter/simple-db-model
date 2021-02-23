# SimpleDBModel
SimpleDBModel is a NodeJS library for manipulating MongoDB with Mongoose.

## Installation
Use the package manager [npm](https://www.npmjs.com/) to install SimpleDBModel.

```bash
npm install mongoose
npm install simple-db-model
```

## Overview and importing
```js
const DBModel = require("simple-db-model")
const mongo = require("mongoose")
//mongo.connect("mongodb://localhost/ExampleDatabase")
const PersonModel = new DBModel("Person", {
    Name: String,
    Surname: String,
    Age: Number
},mongo)
```
This part of code makes new Collection named `Person` with Name, Surname and Age properties at specified database on MongoDB.

## Examples

### Insert
```js
await PersonModel.insert({ Name: "Mert", Surname: "Çelik", Age: 18 })
```
This part of code inserts this data to `Person` collection and returns them.

### Select
```js
await PersonModel.select({ Age: 18 })
```
This part of code finds documents on `Person` collection which is `Age` property is `18` and returns them.

### Update
```js
await PersonModel.update({ Name: "Mert" }, { Surname: "CoolOne" })
```
This part of code finds documents on `Person` collection which is `Name` property is `Mert` and replaces their `Surname` property to `CoolOne`.

### Count
```js
await PersonModel.count({Surname: "CoolOne"})
```
This part of code finds documents on `Person` collection which is `Surname` property is `CoolOne` and returns count of them.

### Delete
```js
await PersonModel.delete({Age:{$gt:17}})
```
This part of code finds documents on `Person` collection which is `Age` property more than `17` and deletes them.

## Mesh Examples

### Collections
```js
var collection = [
    { ExampleData1: "Hello", ExampleData2:100 },
    { ExampleData1: "Hello", ExampleData2:300 },
    { ExampleData1: "Hi", ExampleData2:300 }
]
await ExampleModel.insert(collection)
await ExampleModel.select(collection)
await ExampleModel.count(collection)
await ExampleModel.delete(collection)
```

### Single Operations
```js
await ExampleModel.select({ ExampleData1: "Hello", ExampleData2:100 }, { multiple: false })
await ExampleModel.update({ ExampleData1: "Hello", ExampleData2:100 }, { multiple: false })
await ExampleModel.delete({ ExampleData1: "Hello", ExampleData2:100 }, { multiple: false })
```

### Limit, Skip, Sort, Populate and Select
```js
await ExampleModel.select(undefined, { limit: 5 })
await ExampleModel.select(undefined, { skip: 2 })
await ExampleModel.select(undefined, { sort: { ExampleData2: "descending" }})
await ExampleModel.select(undefined, { select: [ "ExampleData1" ] })
await ExampleModel.select(undefined, { populate: "ObjectIDField" })

await ExampleModel.select(undefined, { limit: 5, skip: 2, populate:["ExampleData1", "ExampleData2"], sort: { ExampleData2: "descending" }, select: [ "ExampleData1" ] })
```

### Structure
```
[async] <Model>.select(<filter[object]|filters[array of objects]>, { multiple[default: true], limit, sort, skip, select, populate } = {})
[async] <Model>.insert(<property[object]|properties[array of objects]>)
[async] <Model>.update(<filter[object]>, <property[object]>, { multiple[default: true] } = {})
[async] <Model>.delete(<filter[object]|filters[array of objects]>, { multiple[default: true] } = {})
[async] <Model>.count(<filter[object]|filters[array of objects]>)
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)