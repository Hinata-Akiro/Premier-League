import { addDocument, deleteDocument, DocumentModel, editDocument, fetchAll } from "../../utils/crud";

describe('addDocument', () => {
    it('should create a new document when valid data is provided', async () => {
        const mockModel: DocumentModel<any> = {
            create: jest.fn().mockResolvedValue('new document'),
            findOneAndUpdate: jest.fn().mockResolvedValue('updated document'),
            deleteOne: jest.fn().mockResolvedValue('deleted document')
        };
        const data = { name: 'John Doe' };

        const result = await addDocument(mockModel)(data);

        expect(mockModel.create).toHaveBeenCalledWith(data);
        expect(result).toBe('new document');
    });
});

describe('editDocument', () => {
    it('should edit a document when valid data with an id is provided', async () => {
        const mockModel: DocumentModel<any> = {
            create: jest.fn().mockResolvedValue('new document'),
            findOneAndUpdate: jest.fn().mockResolvedValue('updated document'),
            deleteOne: jest.fn().mockResolvedValue('deleted document')
        };
        
        const data = { id: '123', name: 'Updated Name', age: 30 };
        
        const expectedQuery = { _id: data.id };
        const expectedUpdate = { $set: { name: 'Updated Name', age: 30 } };
        
        const editFunction = editDocument(mockModel);
        await editFunction(data);

        expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(expectedQuery, expectedUpdate);
    });
});

describe('deleteDocument', () => {
    it('should delete a document when a valid id is provided', async () => {
        const mockModel: DocumentModel<any> = {
            create: jest.fn().mockResolvedValue('new document'),
            findOneAndUpdate: jest.fn().mockResolvedValue('updated document'),
            deleteOne: jest.fn().mockResolvedValue('deleted document')
        };
        
        const id = '123';
        
        const expectedQuery = { _id: id };
        
        const deleteFunction = deleteDocument(mockModel);
        await deleteFunction(id);

        expect(mockModel.deleteOne).toHaveBeenCalledWith(expectedQuery);
    });

})

describe('fetchAll', () => {
    it('should fetch all data and return it when successful', async () => {
        const mockData = [{ id: '1', name: 'Data 1' }, { id: '2', name: 'Data 2' }];
        const mockedFn = jest.fn().mockResolvedValue(mockData);
        const req: any = {};
        const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next: any = jest.fn();

        await fetchAll(mockedFn)(req, res, next);

        expect(mockedFn).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ code: 200, msg: 'Successfully fetched', data: mockData });
        expect(next).not.toHaveBeenCalled();
    }) });