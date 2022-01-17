function middleware<T>(data: any, callback: (data: any, { resolve, reject }: { resolve: (value: T) => void, reject: (value: unknown) => void }) => any): Promise<T | T[]>  {
    return new Promise((resolve, reject) => {
        if (Array.isArray(data)) {
            const promises: Promise<any>[] = []
            data.forEach(_data => {
                promises.push(new Promise((resolve,reject) => {
                    Object.keys(_data).forEach((d) => _data[d] === undefined && delete _data[d])
                    callback(_data, { resolve, reject })
                }))
            })
            Promise.all(promises).then((result) => resolve(result)).catch((err) => reject(err))
        } else {
            Object.keys(data).forEach((d) => data[d] === undefined && delete data[d])
            callback(data, { resolve, reject })
        }
    })
}
class DBModel<schema> {
    public schemaModel: any
    constructor(collectionName: string, schema: schema, mongoose: any) {
        this.schemaModel = mongoose.model(collectionName, new mongoose.Schema(schema, { versionKey: false }), collectionName)
    }
    select(filters: Partial<schema> = {}, options: { multiple?: boolean, limit?: number, sort?: 'ascending' | 'asc' | 1 | -1 | 'desc' | 'descending', skip?: number, select?: Partial<schema>, populate?: any } = {}): Promise<schema|schema[]> {
        const model = this.schemaModel
        const { multiple = true, limit, sort, skip, select, populate } = options
        return middleware(filters, (filter, { resolve, reject }) => {
            model[multiple ? "find" : "findOne"](filter).select(select).skip(skip).limit(limit).sort(sort).populate(populate).exec((err: any, response: any) => {
                if(err) reject(err)
                else resolve(response)
            })
        })
    }
    insert(properties: Partial<schema> | Partial<schema>[] = {}){
        const model = this.schemaModel
        return middleware(properties,(property,{ resolve, reject })=>{
            new model(property)
                .save({}, (err: any, response: any) => {
                if(err) reject(err)
                else resolve(response)
            })
        })
    }
    update(filter: Partial<schema> = {}, property: Partial<schema> = {}, { multiple = true } = {}){
        const model = this.schemaModel
        return new Promise((resolve, reject)=>{
            model[multiple?"updateMany":"updateOne"](filter, property, (err: any, response: any) => {
                if(err) reject(err)
                else resolve(response)
            })
        })
    }
    delete(filters: Partial<schema> | Partial<schema>[]={}, { multiple = true } = {}){
        const model = this.schemaModel
        return middleware(filters,(filter,{resolve,reject})=>{
            model[multiple?"deleteMany":"deleteOne"](filter, (err: any, response: any) => {
                if(err) reject(err)
                else resolve(response)
            })
        })
    }
    count(filters: Partial<schema> = {}){
        const model = this.schemaModel
        return middleware(filters, (filter, { resolve, reject }) => {
            model.countDocuments(filter,(err: any, response: any) => {
                if(err) reject(err)
                else resolve(response)
            })
        })
    }
}
export = DBModel