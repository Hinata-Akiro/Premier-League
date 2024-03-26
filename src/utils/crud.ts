import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { setToCache } from '../middleware/caching-middleware';

export type DocumentModel<T> = {
    create(data: T): Promise<T>;
    findOneAndUpdate(query: any, update: any): Promise<T>;
    deleteOne(query: any): Promise<any>;
};

const addDocument = <T>(Model: DocumentModel<T>) => async (data: T) => {
    return Model.create(data);
};

const editDocument = <T>(Model: DocumentModel<T>) => async (data: T & { id: string }) => {
    const { id, ...res } = data;
    return Model.findOneAndUpdate({ _id: id }, { $set: res });
};

const deleteDocument = <T>(Model: DocumentModel<T>) => async (id: string) => {
    return Model.deleteOne({ _id: id });
};


const fetchOne = <T>(fn: (id: string) => Promise<T>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
          const id = req.params.id;
        if (!id ||!mongoose.Types.ObjectId.isValid(id)) {
            return next({ code: 400, msg: 'Invalid  ID' });
        }
        const data = await fn(req.params.id);
        if (!data) {
            return next({ code: 404, msg: 'Data not found' });
        }

        const cacheKey = req.originalUrl
        await setToCache(cacheKey,data,600)
        return res.status(200).json({ code: 200, data: (data as any) });
    } catch (error) {
        return next({ code: 404, msg: (error as Error).message });
    }
};

const fetchAll = <T>(fn: () => Promise<T[]>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await fn();
        const cacheKey = req.originalUrl
        await setToCache(cacheKey,data,600)
        return res.status(200).json({ code: 200,msg:"Successfully fetched", data: data });
    } catch (error) {
        return next({ code: 404, msg: (error as Error).message });
    }
};



export {
    addDocument,
    editDocument,
    deleteDocument,
    fetchAll,
    fetchOne,
};
