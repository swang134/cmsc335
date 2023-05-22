process.stdin.setEncoding("utf8");
let http = require("http");
const path = require("path");
let express = require("express");   /* Accessing express module */
let app = express();  /* app is a request handler function */
let bodyParser = require("body-parser"); /* To handle post parameters */

let fs = require("fs");
const { name } = require("ejs");
const res = require("express/lib/response");
if(process.argv.length != 3){
    console.log(`Usage supermarketServer.js jsonFile`);
    process.exit(0);
}
const port = process.argv[2];

require("dotenv").config({ path: path.resolve(__dirname, 'env/.env') })  
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const dbname = process.env.MONGO_DB_NAME;
const collect = process.env.MONGO_COLLECTION;
 /* Our database and collection */
const databaseAndCollection = {db: dbname, collection:collect};
/****** DO NOT MODIFY FROM THIS POINT ONE ******/
http.createServer(app).listen(port);
async function main(){
    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = `mongodb+srv://${userName}:${password}@cluster0.7ta5n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    app.set("views", path.resolve(__dirname, "templates"));
    app.set("view engine", "ejs");
    app.get("/", function(request, response) {
        response.render("index");
    });
    
    app.get("/apply", function(request, response) {
        let {name, email, gpa, background} =  request.query;
        response.render("apply");
    });

    app.use(bodyParser.urlencoded({extended:false}));

    app.post("/apply", function(request, response) {
        let myDate = new Date();
        let variable = {name:request.body.name, email:request.body.email, gpa:request.body.gpa, background:request.body.background, date:myDate};
        insert(request.body.name,request.body.email,request.body.gpa,request.body.background);
        response.render("confirm", variable);
    });

    async function insert(name, email, gpa, background) {
        //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        try {
            await client.connect();
            let student1 = {_id:email, name: name, email: email, gpa: gpa, background: background};
            await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(student1);
            } catch (e) {
                    console.error(e);
            }
    }

    app.get("/email", function(request, response) {
        let email =  request.query;
        response.render("email");
    });
    app.post("/email", function(request, response) {
        let a = find(request.body.email);
        let myDate = new Date();
        a.then((r) => {
            if (r)
                response.render("confirm", {name:r.name, email:r.email, gpa:r.gpa, background: r.background, date:myDate});
            else 
                response.render("confirm", {name:"Null", email:"Null", gpa:"Null", background:"Null", date:myDate});
        });
            
    });
    async function find(email) {
        try {
            await client.connect();
            const result = await lookUpOne(client, databaseAndCollection, {email: email});
            return result;
        } catch (e) {
            console.error(e);
        }
    }

    async function lookUpOne(client, databaseAndCollection, email) {
        const res = await client.db(databaseAndCollection.db)
                            .collection(databaseAndCollection.collection)
                            .findOne(email);
        return res;
        
    }
    
    app.get("/gpa", function(request, response) {
        let gpa =  request.query;
        response.render("gpa");
    });
    app.post("/gpa", function(request, response) {
        let a = greater();
        let table = "<table border=1><tr><th>Name</th><th>GPA</th></tr>";
        a.then((r) => {
            if (r){
                r.forEach(element => {
                    if(Number(element.gpa) >= Number(request.body.gpa))
                        table += "<tr><td>"+element.name+"</td><td>"+ Number(element.gpa).toFixed(1) +"</td></tr>";
                }); 
                table += "</table>";
                response.render("gpatable", {result: table});
            } else{
                table += "</table>";
                response.render("gpatable", {result: table});
            }
        });
        
    });
    async function greater() {
        try {
            await client.connect();
            let filter = {};
            const cursor = client.db(databaseAndCollection.db)
            .collection(databaseAndCollection.collection)
            .find(filter);
            const result = await cursor.toArray();
            return result;
        } catch (e) {
            console.error(e);
        }
    }

    let deleted;
    app.get("/clean", function(request, response) {
        clean();
        response.render("clean");
    });

    app.post("/clean", function(request, response) {
        let variable = {count:deleted};
        response.render("remove", variable);
    });

    async function clean() {
        //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        try {
            await client.connect();
            const result = await client.db(databaseAndCollection.db)
            .collection(databaseAndCollection.collection)
            .deleteMany({});
            deleted = result.deletedCount;
        } catch (e) {
            console.error(e);
        }
    }
    await client.close();
   
}
main().catch(console.error);


console.log(`Web server is running at http://localhost:${port}`);
process.stdout.write("Stop to shutdown the server: ");
process.stdin.on('readable', function() {
    let dataInput;
    while ((dataInput= process.stdin.read()) !== null){
        if (dataInput !== null) {
            let command = dataInput.trim();
            if (command === "stop") {
                console.log("Shutting down the server");
                process.exit(0);
            } else {
                console.log(`Invalid command: ${command}`);
                process.stdout.write(`Type itemsList or stop to shutdown the server: `);
                //process.exit(0);
            }
        }
    }
});


