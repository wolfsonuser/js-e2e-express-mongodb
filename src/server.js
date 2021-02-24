// general dependencies
const express = require('express');
const render = require('express-react-views');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const { timeStamp } = require("./utils/utils")

const dataMONGODB =  require('./azure/azure-cosmosdb-mongodb');
const dataSQLAPI = require('./azure/azure-cosmosdb-sql-api');

let data = null;

// data dependency
switch (process.env.COSMOSDB_API) {
    case "MONGODB":
        data = dataMONGODB
        break;
    case "SQLAPI":
        data = dataSQLAPI
        break;
    default:
        throw new Error("feature flag for COSMOS DB is missing from `.env` file.")
}




const create = async () => {

    const dbConnected = await data.connectToDatabase();

    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.set('views', path.join(__dirname, './views'));
    app.set('view engine', 'jsx');
    app.engine(
        'jsx',
        render.createEngine({ beautify: true })
    );
    // Display form and table
    app.get('/', async (req, res) => {

        timeStamp(req);

        const initialData = {
            data: [],
            dbStatus: !!dbConnected
        };

        // get all items
        initialData.data = dbConnected
            ? await data.find()
            : initialData;

        // return react front-end
        res.render('index', initialData);
    });
    // Insert row into table
    app.post('/', async (req, res) => {
        timeStamp(req);

        // insert
        if (req.body && Object.keys(req.body).length > 0) {
            const newItem = [req.body];

            // insert params to db
            await data.insert(newItem);
        }

        // return react front-end
        res.redirect('/');
    });
    // Delete 1 or all - depending on query string
    app.get('/delete', async (req, res) => {
        timeStamp(req);

        const docs = req.query && req.query.id ? req.query.id : null;

        // delete
        await data.remove(docs);

        res.redirect('/');
    });

    return app;
};

module.exports = {
    create
};
