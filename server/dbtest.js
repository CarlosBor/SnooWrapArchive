var snoowrap = require('snoowrap');
var request = require('request');
var fs = require('fs');
var config = require('../config/config.js');
var fileIO = require('../js/fileIO.js');
const util = require('util');
const Mongo = require('mongodb');

/////////////////////////////
////Ejemplos basicos SYNC////
/////////////////////////////


/*
const url = 'mongodb://localhost:27017'
mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
  if (err) {
    console.error(err)
    return
  }
  const db = client.db('Test1')


  db.collection('Testitems', function (err, collection) {
    /*
    collection.insert({ id: 1, firstName: 'Ray', lastName: 'Vough' });
    collection.insert({ id: 2, firstName: 'Alfred', lastName: 'McQuack' });
    collection.insert({ id: 3, firstName: 'Andrea', lastName: 'Maria' });
    collection.insert({ id: 4, firstName: 'Steve', lastName: 'Jobs' });
    collection.insert({ id: 5, firstName: 'Bill', lastName: 'Gates' });
    collection.insert({ id: 6, firstName: 'James', lastName: 'Bond' });
    */
   // collection.find().toArray((err, items) => {console.log(items)})
      /*
      collection.updateOne(
        {firstName:"Bill"},
        {$set: {lastName:"Puertas"}}
      )
      */
     /*
     collection.deleteOne(
      {firstName:"James"}
    )
      })
      */


//////////////////////////////
///Ejemplos Basicos ASYNC/////
//////////////////////////////
MongoClient = Mongo.MongoClient;
async function main(){
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */

    const uri = config.dburi;
    const client = new MongoClient(uri, { useNewUrlParser: true });
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        const database = client.db("sample_supplies");
        const collection = database.collection("sales");

        // Make the appropriate DB calls
        //await  listDatabases(client);
 
        //Create
        const doc = {field1 : "test", field2: "moreTest" };
        const result = await collection.insertOne(doc);
        
        //Retrieve
        const findResult = await collection.find({
           field1: "modifyTest",
        });
        await findResult.forEach(console.dir);

        //Update
        const filter = {field2: "moreTest"};
        const updateTestDocument = {$set: {field1: "modifyTest"}};
        const result = await collection.updateOne(filter, updateTestDocument);

        //Modify
          const query = {field1: "modifyTest"};
          const result = await collection.deleteOne(query);

          
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};