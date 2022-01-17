export default class DBModel<schema> {
    schemaModel: any;
    constructor(collectionName: string, schema: schema, mongoose: any);
    select(filters?: Partial<schema>, options?: {
        multiple?: boolean;
        limit?: number;
        sort?: 'ascending' | 'asc' | 1 | -1 | 'desc' | 'descending';
        skip?: number;
        select?: Partial<schema>;
        populate?: any;
    }): Promise<schema | schema[]>;
    insert(properties?: Partial<schema> | Partial<schema>[]): Promise<unknown>;
    update(filter?: Partial<schema>, property?: Partial<schema>, { multiple }?: {
        multiple?: boolean | undefined;
    }): Promise<unknown>;
    delete(filters?: Partial<schema> | Partial<schema>[], { multiple }?: {
        multiple?: boolean | undefined;
    }): Promise<unknown>;
    count(filters?: Partial<schema>): Promise<unknown>;
}
