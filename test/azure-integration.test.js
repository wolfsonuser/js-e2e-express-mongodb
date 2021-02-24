const dataMongoDB = require('../src/azure/azure-cosmosdb-mongodb');
const dataSQLAPI = require('../src/azure/azure-cosmosdb-sql-api');
require('dotenv').config();

const DATABASE_DOCS = [{ a: 1 }, { a: 2 }, { a: 3 }];
const ALL_DOCS = null;



describe('mongoDB native API', () => {

    const dbProcess = async (data, docs) => {
        await data.connectToDatabase();

        // insert new docs
        const insertResult = await data.insert(
            docs
        );
        expect(insertResult).not.toBe(undefined);

        // get first ID of array - delete later
        const id = insertResult.insertedIds[0].toString();

        const findResult = await data.find(
            ALL_DOCS
        );
        expect(findResult.length).not.toBe(0);

        const count = findResult.length;

        await data.remove(id);

        const findResult2 = await data.find(
            ALL_DOCS
        );
        expect(findResult2.length).not.toBe(0);

        expect(findResult2.length).toEqual(count - 1);

        const removeResult = await data.remove(
            ALL_DOCS
        );
        expect(removeResult).not.toBe(undefined);

        const findResult3 = await data.find(
            ALL_DOCS
        );
        expect(findResult3.length).toBe(0);

        return true;
    }

    test('integration with mongodb', async (done) => {

        try {
            process.env.COSMOSDB_API = "MONGODB";
            const result = dbProcess(dataMongoDB, DATABASE_DOCS);
            done();
        } catch {
            (err) => done(err);
        }
    });
    
    test('integration with SQL API', async (done) => {

        try {
            process.env.COSMOSDB_API = "SQLAPI"
            const result = dbProcess(dataSQLAPI, DATABASE_DOCS);
            done();
        } catch {
            (err) => done(err);
        }
    });
});
