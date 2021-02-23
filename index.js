function middleware(data,func){
    return new Promise((resolve, reject)=>{
        if(Array.isArray(data)) {
            const promises = []
            data.forEach(mindata => {
                promises.push(new Promise((resolve,reject)=>{
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
            func(data,{resolve,reject})
        }
    })
}
class DBModel {
    constructor(CollectionName, schema, mongoose) {
        this.schemaModel = mongoose.model(CollectionName, new mongoose.Schema(schema,{versionKey: false}))
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