const CosmosClient = require("@azure/cosmos").CosmosClient;
const newGuid = require("../utils/utils").newGuid;
require('dotenv').config();

const config = {
    COSMOSDB_SQL_API_URI: process.env.COSMOSDB_SQL_API_URI,
    COSMOSDB_SQL_API_KEY: process.env.COSMOSDB_SQL_API_KEY,
    COSMOSDB_SQL_API_DATABASE_NAME: process.env.COSMOSDB_SQL_API_DATABASE_NAME,
    COSMOSDB_SQL_API_CONTAINER_NAME:process.env.COSMOSDB_SQL_API_CONTAINER_NAME
}
    


let client = null;
let db = null;
let container = null;

/* eslint no-console: 0 */
//console.log(`${JSON.stringify(config)}`);

// insert 1
const insert = async (newItems) => {
    
    
    for (const item of newItems) {
        
        item.id = newGuid();
        await container.items.create(item);
      }
    
    return;
};

const find = async (query) => {
    
    if (query == null) {
        query = "SELECT * from c"
    } else {
        query = `SELECT * from c where c.id = ${query}`
    }
    
    const result = await container.items
    .query(query)
    .fetchAll();
    
    return result && result.resources ? result.resources : [];
}

const remove = async (id) => {
    
    // remove 1
    if (id) {
        await container.item(id).delete();
    } else {
        
        // get all items
        const items = await find();
        
        // remove all
        for await (const item of items) {
            await container.item(item.id).delete();
        }
    }
    
    return;
}
const connect = () => {
    try {
        
        const connectToCosmosDB = {
            endpoint: config.COSMOSDB_SQL_API_URI,
            key: config.COSMOSDB_SQL_API_KEY
        }
 
        return new CosmosClient(connectToCosmosDB);
        
    } catch (err) {
        console.log('Cosmos DB SQL API - can\'t connected - err');
        console.log(err);
    }
}
const connectToDatabase = async () => {
    
    client = connect();
    
    if (client) {
        
        console.log(config.COSMOSDB_SQL_API_DATABASE_NAME);
        const databaseResult = await client.databases.createIfNotExists({ id: config.COSMOSDB_SQL_API_DATABASE_NAME });
        db = databaseResult.database;
    
        if (db) {
            const containerResult = await db.containers.createIfNotExists({ id: config.COSMOSDB_SQL_API_CONTAINER_NAME });
            container = containerResult.container;
            return !!db;
        }
    } else {
        throw new Error("can't connect to database");
    }
    
    
}
module.exports = {
    insert,
    find,
    remove,
    connectToDatabase
};
