var snoowrap = require('snoowrap');
var request = require('request');
var fs = require('fs');
var config = require('../config/config.js');
var fileIO = require('../js/fileIO.js');
const util = require('util');
const mongo = require('mongodb');

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
    collection.insert({ id: 4, firstName: 'Steve', lastName: 'Jobs' });
    collection.insert({ id: 5, firstName: 'Bill', lastName: 'Gates' });
    collection.insert({ id: 6, firstName: 'James', lastName: 'Bond' });
    collection.find().toArray((err, items) => {
        console.log(items)
      })
});

})

    
