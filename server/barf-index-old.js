var express = require('express'),
    path = require('path'), // handles smooth joining of file paths (inserts slashes where needed, prevents double slashes)
    bodyParser = require('body-parser'),
    httpProxy = require('http-proxy'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon'),
    compression = require('compression'),
    cors = require('cors'),
    dotenv = require('dotenv'),
    logger = require('morgan');

module.exports = (env, serverType) => {
    // Grabs key-value pairs from ".env" folder and sets keys as properties on "process.env" object accessable anywhere in the app
    // dotenv.config(); // .env is magically found because it's no the root


    var serverTypeMap = {
        prod: 3030,
        qa: 3020,
        dev: 3010
    },
    serverPort = serverTypeMap[serverType] || process.env.PORT || 3000,
    apiPort = serverPort - 1;

    var api = express();

    console.log ( "env! ", env );

    if(!env || env!=='prod') api.use(logger('dev'));
    api.use(bodyParser.urlencoded({
        limit: '750mb',
        extended: true
    }));
    api.use(bodyParser.json({
        limit: '750mb'
    }));
    api.use(cookieParser());

    // use setValue and getValue for storing and retrievin app vars
    api.setValue = api.set.bind(api);
    api.getValue = (path) => api.get(path);

    // set app vars
    api.setValue('env', env);
    api.setValue('apiPort', apiPort);
    api.setValue('serverPort', serverPort);
    api.setValue('serverRootPath', path.join(__dirname, '..'));
    api.setValue('apiUtilsPath',path.join(api.getValue('serverRootPath'), 'server','utils'));
    api.setValue('clientRootPath', path.join(api.getValue('serverRootPath'), 'public'));

    // API config
    // require('./config')(api);


    // Set cors
    api.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    api.use('/api', require('./apiRoutes')(api));

    // init content-serving app
    var app = express();

    // Request parsing middleware
    app.use(bodyParser.json()); // allows request body parsing
    app.use(bodyParser.urlencoded({ extended: false })); // allows request query string parsing, extended : false means query string values cannot contain JSON (must be simple key-value)
    app.use(cookieParser()); // allows cookie parsing (cookies are simple key value stores in the browser) [ used by Passport ]


    // use logger if not prod
    if(!env || env!=='prod') app.use(logger('dev'));

    // app.use(favicon('path to favicon')); //assume we'll make this at some point
    app.set('serverType', serverType);

    // Set static folder
    app.use(express.static(path.join(api.getValue('clientRootPath'))));

    // Set cors, not sure if necessary
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // Create proxy server
    var proxy = new httpProxy.createProxyServer();
    proxy.on('error', (err) => console.log('could not connect to proxy: ', err));

    // set "/api" routes to pass to API port
    app.use('/api*', (req, res, next) =>{
        console.log ( "!! API ", `${req.protocol}://${req.hostname}:${apiPort}${req.originalUrl}` );
        proxy.web(req, res, {
            target: `${req.protocol}://${req.hostname}:${apiPort}${req.originalUrl}`
        });
    });

    // Auth routes from auth folder
    require('./auth')(app);

    app.get('/*', (req, res, next) =>
        res.sendFile('index.html', {
            root: api.getValue('clientRootPath')
        }));
    
    return {
        serverPort: serverPort,
        apiPort: apiPort,
        api: api,
        app: app
    };

};
