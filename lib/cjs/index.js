"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function middleware(data, callback) {
    return new Promise((resolve, reject) => {
        if (Array.isArray(data)) {
            const promises = [];
            data.forEach(_data => {
                promises.push(new Promise((resolve, reject) => {
                    Object.keys(_data).forEach((d) => _data[d] === undefined && delete _data[d]);
                    callback(_data, { resolve, reject });
                }));
            });
            Promise.all(promises).then((result) => resolve(result)).catch((err) => reject(err));
        }
        else {
            Object.keys(data).forEach((d) => data[d] === undefined && delete data[d]);
            callback(data, { resolve, reject });
        }
    });
}
class DBModel {
    constructor(collectionName, schema, mongoose) {
        this.schemaModel = mongoose.model(collectionName, new mongoose.Schema(schema, { versionKey: false }), collectionName);
    }
    select(filters = {}, options = {}) {
        const model = this.schemaModel;
        const { multiple = true, limit, sort, skip, select, populate } = options;
        return middleware(filters, (filter, { resolve, reject }) => {
            model[multiple ? "find" : "findOne"](filter).select(select).skip(skip).limit(limit).sort(sort).populate(populate).exec((err, response) => {
                if (err)
                    reject(err);
                else
                    resolve(response);
            });
        });
    }
    insert(properties = {}) {
        const model = this.schemaModel;
        return middleware(properties, (property, { resolve, reject }) => {
            new model(property)
                .save({}, (err, response) => {
                if (err)
                    reject(err);
                else
                    resolve(response);
            });
        });
    }
    update(filter = {}, property = {}, { multiple = true } = {}) {
        const model = this.schemaModel;
        return new Promise((resolve, reject) => {
            model[multiple ? "updateMany" : "updateOne"](filter, property, (err, response) => {
                if (err)
                    reject(err);
                else
                    resolve(response);
            });
        });
    }
    delete(filters = {}, { multiple = true } = {}) {
        const model = this.schemaModel;
        return middleware(filters, (filter, { resolve, reject }) => {
            model[multiple ? "deleteMany" : "deleteOne"](filter, (err, response) => {
                if (err)
                    reject(err);
                else
                    resolve(response);
            });
        });
    }
    count(filters = {}) {
        const model = this.schemaModel;
        return middleware(filters, (filter, { resolve, reject }) => {
            model.countDocuments(filter, (err, response) => {
                if (err)
                    reject(err);
                else
                    resolve(response);
            });
        });
    }
}
exports.default = DBModel;
