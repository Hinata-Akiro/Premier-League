import mongoose from 'mongoose';
import config from './varibales';

mongoose.set('strictQuery', false);

const url: string | undefined = config.mongoUri;

const dbConnection = (): Promise<void> => {
    if (!url) {
        throw new Error('MongoDB connection URL is not provided');
    }

    return mongoose.connect(url)
        .then(() => {
            console.log('MongoDB connected successfully!');
        })
        .catch(error => {
            throw new Error('Sorry, we could not connect to the database at the moment');
        });
};

export { dbConnection };
