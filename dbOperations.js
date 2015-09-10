module.exports = {
  getRecords: function(req, res) {    
        var pg = require('pg');        
        //You can run command "heroku config" to see what is Database URL from Heroku belt
        var conString = process.env.DATABASE_URL || "postgres://postgres:Welcome123@localhost:5432/postgres";
        var client = new pg.Client(conString);
        client.connect();
        var query = client.query("select * from cards");
        query.on("row", function (row, result) { 
            result.addRow(row); 
        });
        query.on("end", function (result) {          
            client.end();
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(JSON.stringify(result.rows, null, "    ") + "\n");
            res.end();  
        });
  },
    addRecord : function(req, res){
        var pg = require('pg');          
        var conString = process.env.DATABASE_URL ||  "postgres://postgres:Welcome123@localhost:5432/postgres";
        console.log(conString);
        var client = new pg.Client(conString);
        client.connect();
        var query = client.query("insert into cards (name,description,location,company,jtitle,photo) "+ 
                                "values ('"+req.query.name+"','"+req.query.description+"','"+
                                    req.query.location+"','"+req.query.company+
                                    "','"+req.query.jtitle+"','"+req.query.photo+
                                    "')");    
        query.on("end", function (result) {          
            client.end(); 
            res.write('Success');
            res.end();  
        });
    },    
     delRecord : function(req, res){
        var pg = require('pg');           
        var conString = process.env.DATABASE_URL ||  "postgres://postgres:Welcome123@localhost:5432/postgres";
        var client = new pg.Client(conString);
        client.connect();         
        var query = client.query( "Delete from cards Where id ="+req.query.id);    
        query.on("end", function (result) {          
            client.end(); 
            res.write('Success');
            res.end();  
        });
    },    
    createTable : function(req, res){
        var pg = require('pg');
        var conString = process.env.DATABASE_URL ||  "postgres://postgres:Welcome123@localhost:5432/postgres";
        var client = new pg.Client(conString);
        client.connect();         
        var query = client.query( "CREATE TABLE cards"+
                                    "("+
                                      "name character varying(50),"+
                                      "description character varying(50),"+
                                      "location character varying(50),"+
                                      "company character varying(50),"+
                                      "jtitle character varying(50),"+
                                      "photo character varying(200),"+
                                      "id serial NOT NULL"+
                                    ")");    
        query.on("end", function (result) {          
            client.end(); 
            res.write('Table Schema Created');
            res.end();  
        });
    },    
    dropTable : function(req, res){
        var pg = require('pg');           
        var conString = process.env.DATABASE_URL || "postgres://postgres:Welcome123@localhost:5432/postgres";
        var client = new pg.Client(conString);
        client.connect();         
        var query = client.query( "Drop TABLE cards");    
        query.on("end", function (result) {          
            client.end(); 
            res.write('Table Schema Deleted');
            res.end();  
        });
    }    
};