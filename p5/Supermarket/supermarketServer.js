class information{
        // ..and an (optional) custom class constructor. If one is
        // not supplied, a default constructor is used instead:
        // constructor() { }
    #items 
    constructor(items) {
        this.#items = items;
    }
      
    result(item){
        let tables = "<table border=1><tr><th>Item</th><th>Cost</th></tr>";
        let res = this.#items.filter(element => item.includes(element.name));
        let total = 0;
        res.forEach(element => {
            tables += "<tr><td>"+element.name+"</td><td>"+ Number(element.cost).toFixed(2) +"</td></tr>";
            total += Number(element.cost);
        });
        tables += "<tr><td>Total Cost</td><td>"+ total +"</td></tr></table>"
        return tables;
    }
}
process.stdin.setEncoding("utf8");
let http = require("http");
let path = require("path");
let express = require("express");   /* Accessing express module */
let app = express();  /* app is a request handler function */
let bodyParser = require("body-parser"); /* To handle post parameters */
let portNumber = 5000;

let fs = require("fs");
const { name } = require("ejs");
if(process.argv.length != 3){
    console.log(`Usage supermarketServer.js jsonFile`);
    process.exit(0);
}
const fileName = process.argv[2];

let read = fs.readFileSync(fileName);
let content = JSON.parse(read);
let info = new information(content['itemsList']);

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.get("/", function(request, response) {
    response.render("index");
 });
 app.get("/catalog", function(request, response) {
    let tables = "<table border=1><tr><th>Item</th><th>Cost</th></tr>";
    content['itemsList'].forEach(element => {
        tables += "<tr><td>"+element.name+"</td><td>"+ Number(element.cost).toFixed(2) +"</td></tr>";
    });
    tables += "</table>";
    response.render("displayItems", {itemsTable: tables});
 });
 app.get("/order", function(request, response) {
    let {name, email, delivery,itemsSelected, orderInformation} =  request.query;
    let table;
    content['itemsList'].forEach(element => {
        table += "<option value=\""+element.name+"\">" +element.name+"</option>";
    });
    response.render("placeOrder", {items: table});
 });

 app.use(bodyParser.urlencoded({extended:false}));
 app.post("/order", function(request, response) {
    let s = info.result(request.body.itemsSelected);
    let variable = {name:request.body.name, email:request.body.email, delivery:request.body.delivery,orderTable:s};
    response.render("orderConfirmation", variable);
 });
 app.use(function (request, response) {
    response.status(404).send("Resource not found");
 });
http.createServer(app).listen(portNumber);

console.log(`Web server is running at http://localhost:${portNumber}`);
process.stdout.write("Type itemsList or stop to shutdown the server: ");
process.stdin.on('readable', function() {
    let dataInput;
    while ((dataInput= process.stdin.read()) !== null){
    if (dataInput !== null) {
        let command = dataInput.trim();
        if (command === "stop") {
            console.log("Shutting down the server");
            process.exit(0);
        } else if (command === "itemsList"){
            console.log(content['itemsList'])
            process.stdout.write(`Type itemsList or stop to shutdown the server: `);
            //process.exit(0);
        } else {
            console.log(`Invalid command: ${command}`);
            process.stdout.write(`Type itemsList or stop to shutdown the server: `);
            //process.exit(0);
        }
    }
    }
});


