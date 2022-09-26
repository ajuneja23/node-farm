const fs=require('fs');
const http=require('http');
const url=require("url");

const replace_template=require("./modules/replaceTemplate.js");//imports the function from replaceTemplate.js



//top level code and is only executed once, so isnt that big of a deal that it is synchronous and blocks execution, more efficient honestly
const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');//response is the JSON data we want to send at the specified route we want that data to be communicated at
const template_overview=fs.readFileSync(`${__dirname}/templates/template_overview.html`,'utf-8');
const template_card=fs.readFileSync(`${__dirname}/templates/template_card.html`,'utf-8');
const template_product=fs.readFileSync(`${__dirname}/templates/template_product.html`,'utf-8');//we can res.send html files and it renders like that
const data_obj=JSON.parse(data);//makes JSON string to JS obj
const server=http.createServer((req,res)=>//(req,res) callback, called each time a new request hits the server 
{
    //console.log(url.parse(req.url,true));//parses req.url into object
    const parsed=url.parse(req.url,true);//url.parse takes in a url and returns object w/ url properties
    const query=parsed.query;
    const path_name=parsed.pathname;
    console.log(query);
    console.log(path_name);
    //console.log(req);//4 fun :)
    //Overview Page
    if(path_name==='/overview' || path_name==="/")
    {
        //res.end('This is the overview');
        res.writeHead(200,{'Content-type': 'text/html'});

        const cards_html=data_obj.map(card_data=>replace_template(template_card,card_data)).join('');//stringifies the content, adding a html content for each element in the json 
        console.log(cards_html);//.map allows for dynamic size
            
        //callback executed for each card in the array

        const output=template_overview.replace(/%PRODUCT_CARDS%/g, cards_html);//
        res.end(output);


    }
    //Product Page
    else if(path_name==="/product")//PATH DOES NOT WORK FOR JUST /PRODUCT BECAUSE QUERY IS NULL THEN, AND THERE IS NO QUERY.ID So it'll break
    {
        const product=data_obj[query.id];
        res.writeHead(200,{'Content-type': 'text/html'});
        const output=replace_template(template_product,product);
        res.end(output);//communicated differently based on path name


    }
    //API
    else if(path_name==="/api")
    {
        
        res.writeHead(200,{'Content-type': 'application/json'});
        res.end(data);//sending json string
    }
    //Not found 
    else 
    {
        res.writeHead(404, {
            'Content-type': 'text/html',//expects html to come in
            'custom-header': 'what a w program'
        });//(statusCode, HeaderContent)
        res.end("<h1>Page not found lawlz </h1>");//renders as html since content type was specified as such
    }
    //res.end: 
});//a server is just a server, it isnt connected to a PORT until later. the port is just the comm tool

server.listen(8000,'127.0.0.1',()=>
{
    console.log(`Listening to requests on PORT 8000.`);//callback confirmation message
});//listens on localhost::8000, 127.0.0.1 is localhost