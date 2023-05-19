const fs = require('fs');
const url = require('url');

function getContentType(url){
    if(url.endsWith('css')){
        return 'text/css';
    } else if(url.endsWith('js')){
        return 'text/javascript';
    } else if(url.endsWith('html')){
        return 'text/html';
    } else if(url.endsWith('png')){
        return 'image/png';
    } else if(url.endsWith('ico')){
        return 'image/vnd.microsoft.icon';
    } else if(url.endsWith('jpg')){
        return 'image/jpg';
    }
}

module.exports = (req,res) => {
    const pathname = url.parse(req.url).pathname;

    if(pathname.startsWith('/content') && req.method === 'GET'){
        let filePath = `.${pathname}`;
        fs.readFile(filePath, (err, data) => {
            if (err) 
            {
                console.log(err);

                res.writeHead(404,{'Content-Type':'text/plain'});
                res.write("Error");

                res.end();

                return;
            }

            let contentType = getContentType(pathname);
            res.writeHead(200,{'Content-Type':contentType});
            res.write(data);

            res.end();
          });
    } else{
        return true;
    }
}