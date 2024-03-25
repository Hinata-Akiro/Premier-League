import { Request, Response, NextFunction } from 'express';

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error.code) {
        return res.status(error.code).json({ error });
    }
    res.status(500).json({ error });
};

const errorLogger = (error: any, req: Request, res: Response, next: NextFunction) => {
    return next(error);
};

const invalidUrl = (req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({ error: { code: 404, msg: "Url not found. Kindly check and try again" } });
};

export { errorHandler, errorLogger, invalidUrl };
