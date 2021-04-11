function middleware(data,func){
    return new Promise((resolve, reject)=>{
        if(Array.isArray(data)) {
            const promises = []
            data.forEach(mindata => {
                promises.push(new Promise((resolve,reject)=>{
                    Object.keys(mindata).forEach((d)=>{
                        mindata[d]===undefined && delete mindata[d]
                    })
                    func(mindata,{resolve,reject})
                }))
            })
            Promise.all(promises).then((result)=>{
                resolve(result)
            }).catch((err)=>{
                reject(err)
            })
        }
        else{
            Object.keys(data).forEach((d)=>{
                data[d]===undefined && delete data[d]
            })
            func(data,{resolve,reject})
        }
    })
}
class DBModel {
    constructor() {
        switch (arguments.length) {
            case 1:
                const [schemaModel] = arguments
                this.schemaModel = schemaModel
                break;
            case 2:
                const [CollectionName, schema] = arguments
                this.schemaModel = mongoose.model(CollectionName, schema,CollectionName)
                break;
            case 3:
                const [CollectionName, schema, mongoose] = arguments
                this.schemaModel = mongoose.model(CollectionName, new mongoose.Schema(schema,{versionKey: false}),CollectionName)
                break;
        }
    }
    select(filters, {multiple = true, limit, sort, skip, select, populate} = {}){
        const model = this.schemaModel
        return middleware(filters,(filter,{resolve,reject})=>{
            model[multiple?"find":"findOne"](filter).select(select).skip(skip).limit(limit).sort(sort).populate(populate).exec((err, response)=>{
                if(err) reject(err)
                else resolve(response)
            })
        })
    }
    insert(properties){
        const model = this.schemaModel
        return middleware(properties,(property,{resolve,reject})=>{
            new model(property).save((err, response)=>{
                if(err) reject(err)
                else resolve(response)
            })
        })
    }
    update(filter,property,{multiple = true} = {}){
        const model = this.schemaModel
        return new Promise((resolve, reject)=>{
            model[multiple?"updateMany":"updateOne"](filter,property,(err, response)=>{
                if(err) reject(err)
                else resolve(response)
            })
        })
    }
    delete(filters,{multiple = true} = {}){
        const model = this.schemaModel
        return middleware(filters,(filter,{resolve,reject})=>{
            model[multiple?"deleteMany":"deleteOne"](filter,(err, response)=>{
                if(err) reject(err)
                else resolve(response)
            })
        })
    }
    count(filters){
        const model = this.schemaModel
        return middleware(filters,(filter,{resolve,reject})=>{
            model.countDocuments(filter,(err, response)=>{
                if(err) reject(err)
                else resolve(response)
            })
        })
    }
}
module.exports = DBModel