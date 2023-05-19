const http = require('http');
const port = 3000;
const handlers = require('./handlers/indexHandlers');

http.createServer((req,res) => {

    for(let handler of handlers){
        if(!handler(req,res)){
            break;
        }
        handler(req,res)
    }


}).listen(port);