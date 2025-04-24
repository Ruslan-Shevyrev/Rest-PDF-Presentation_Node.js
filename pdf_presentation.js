const express = require("express");
const oracledb = require('oracledb');
const dbConfig = require('./config/dbconfig.js');
const fs = require("fs");
const app = express();
const config = require('./config/config.json');

try {
    //oracledb.initOracleClient({libDir: config.instantclient_path});
	oracledb.fetchAsBuffer = [ oracledb.BLOB ];
  } catch (err) {
    console.error(err);
    process.exit(1);
  }; 

app.get("/pdf/put", function(req, res){
	async function run() {
			 try{
				connection = await oracledb.getConnection(dbConfig);
				
				binds = {};

			options = {
			  outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
			  // extendedMetaData: true,               // get extra metadata
			  // prefetchRows:     100,                // internal buffer allocation size for tuning
			  // fetchArraySize:   100                 // internal buffer allocation size for tuning
			};
			
			result = await connection.execute('SELECT FILE_NAME, BDATA FROM PDF_PRESENTATION where active = 1 and id = (select max(id) from PDF_PRESENTATION where active = 1)', binds, options);
			//console.dir(result.metaData, { depth: null });
			
			//console.dir(result.rows[0]['BDATA']);
			
			fs.writeFileSync(config.file_dir+result.rows[0]['FILE_NAME'], result.rows[0]['BDATA']);
			res.end('success');
			 }
			 catch (err) {
				console.error(err);
			  } finally {
				if (connection) {
				  try {
					await connection.close();
				  } catch (err) {
					console.error(err);
				  }
				}
			  }
		}
run();
});

// получение одного пользователя по id
app.get("/", function(req, res){
       
    const id = req.params.id; // получаем id
    res.end("Hello");
});
   
app.listen(config.listener_port, function(){
    console.log("Сервер ожидает подключения...");
});