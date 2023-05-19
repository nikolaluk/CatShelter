const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds');
const cats = require('../data/cats');


module.exports = (req,res) => {
    const pathname = url.parse(req.url).pathname;

    if(pathname === '/cats/add-cat' && req.method === 'GET'){
        let viewPath = './views/addCat.html';
        fs.readFile(viewPath, (err, data) => {
            if (err) 
            {
                console.log(err);

                res.writeHead(404,{'Content-Type':'text/plain'});
                res.write("Error");

                res.end();

                return;
            }
            let catBreedPlaceHolder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
            let modifiedData = data.toString().replace('{{catBreeds}}',catBreedPlaceHolder);

            res.writeHead(200,{'Content-Type':'text/html'});
            res.write(modifiedData);

            res.end();
          });

    } else if(pathname === '/cats/add-breed' && req.method === 'GET'){
        let viewPath = './views/addBreed.html';
        fs.readFile(viewPath, (err, data) => {
            if (err) 
            {
                console.log(err);

                res.writeHead(404,{'Content-Type':'text/plain'});
                res.write("Error");

                res.end();

                return;
            }

            res.writeHead(200,{'Content-Type':'text/html'});
            res.write(data);

            res.end();
          });
    } else if(pathname === '/cats/add-breed' && req.method === 'POST'){
        
        let formData = '';
        req.on('data', (data) => {
            console.log(data);
            formData += data;
        });
        
        req.on('end', () => {
            let body = qs.decode(formData);
            
            fs.readFile('./data/breeds.json',(err,data) => {
                if(err){
                    throw err;
                }

                let breeds = JSON.parse(data);
                breeds.push(body.breed);
                let json = JSON.stringify(breeds);

                fs.writeFile('./data/breeds.json',json,'utf-8', () => console.log('The breed was added succesfully!'));
            });

            res.writeHead(301, { Location: "/" });
            res.end();
        });
        
        
    } else if(pathname === '/cats/add-cat' && req.method === 'POST'){
        let form = new formidable.IncomingForm();

        form.parse(req, (err,fields,files) => {
            if(err){
                throw err;
            }

            let name = fields.name;
            let description = fields.description;
            let breed = fields.breed;


            fs.readFile('./data/cats.json','utf-8',(err,data) => {
                if(err){
                    throw err;
                }

                let cats = JSON.parse(data);
                cats.push({id:cats.length,name,description,breed,image: files.upload.originalFilename});
                let json = JSON.stringify(cats);

                fs.writeFile('./data/cats.json',json,'utf-8', () => {
                    
                res.writeHead(301, { Location: "/" });
                res.end();

                });
            })
            
        });
    } else if(pathname.includes('/cats-edit') && req.method === 'GET'){
        let viewPath = './views/editCat.html';
        fs.readFile(viewPath, (err, data) => {
            if (err) 
            {
                console.log(err);

                res.writeHead(404,{'Content-Type':'text/plain'});
                res.write("Error");

                res.end();

                return;
            }

            const id = pathname.split('/')[2]; 

            for (const cat of cats) {
                if(id == cat.id){
                    let modifiedData = data.toString().replace('{{id}}',id);
                    modifiedData = modifiedData.replace('{{name}}',cat.name);
                    modifiedData = modifiedData.replace('{{description}}',cat.description);

                    const breedsAsOptions = breeds.map((b) => `<option value="${b}">${b}</option>`);
                    modifiedData = modifiedData.toString().replace('{{catBreeds}}',breedsAsOptions.join('/'));

                    modifiedData = modifiedData.replace("{{breed}}", cat.breed);

                    res.writeHead(200,{'Content-Type':'text/html'});
                    res.write(modifiedData);

                    res.end();
                }
            }
          });

    } else if(pathname.includes('/cats-find-new-home') && req.method === 'GET'){
        let viewPath = './views/catShelter.html';

        const id = pathname.split('/')[2]; 
        fs.readFile(viewPath, (err, data) => {
            if (err) 
            {
                console.log(err);

                res.writeHead(404,{'Content-Type':'text/plain'});
                res.write("Error");

                res.end();

                return;
            }

            for (const cat of cats) {
                if(cat.id == id){
                    let modifiedData = data.toString().replace('{{name}}',cat.name);
                    modifiedData = modifiedData.replace('{{description}}',cat.description);
                    modifiedData = modifiedData.replace('{{breed}}',cat.breed);
                    modifiedData = modifiedData.replace('{{breed}}',cat.breed);
                    modifiedData = modifiedData.replace('{{image}}',`../content/images/${cat.image}`);

                    res.writeHead(200,{'Content-Type':'text/html'});
                    res.write(modifiedData);

                    res.end();
                }
            }
          });
    } else if(pathname.includes('/cats-edit') && req.method === 'POST'){
        let form = new formidable.IncomingForm();

        console.log(form);

        form.parse(req, (err,fields,files) => {
            if(err){
                throw err;
            } else{
                console.log(fields, files);

            let name = fields.name;
            let description = fields.description;
            let breed = fields.breed;
            const id = pathname.split('/')[2]; 


            fs.readFile('./data/cats.json','utf-8',(err,data) => {
                if(err){
                    throw err;
                }

                let cats = JSON.parse(data);
                for (const cat of cats) {
                    if(cat.id == id){
                        cat.name = name;
                        cat.description = description;
                        cat.breed = breed;
                    }
                }
                let json = JSON.stringify(cats);

                fs.writeFile('./data/cats.json',json,'utf-8', () => {
                    
                res.writeHead(301, { Location: "/" });
                res.end();

                });
            })
            }
            
            
        });
    } else if(pathname.includes('/cats-find-new-home') && req.method === 'POST'){
        const id = pathname.split('/')[2]; 
        
        fs.readFile('./data/cats.json','utf-8',(err,data) => {
            if(err){
                throw err;
            }

            let cats = JSON.parse(data);
            cats.splice(id,1);
            let json = JSON.stringify(cats);

            fs.writeFile('./data/cats.json',json,'utf-8', () => {
                
            res.writeHead(301, { Location: "/" });
            res.end();

            });
        })
    } 
    else {
        return true;
    }
}