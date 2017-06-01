const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const md5 = require('md5');
const fs = require('fs');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`port is running on ${app.get('port')}.`);
});


/**************** GET requests *****************/

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file);
  });
});

app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then((items) => response.status(200).json(items))
    .catch(error => console.log(error))
})

// app.get('/api/v1/:id/item', (request, response) => {
//   database('items').where('id', req.params.id).select()
//   .then(item => res.status(200).json(item))
//   .catch(error => res.status(422).send({
//     success: false,
//     message: error.message
//   }));
// })

/**************** POST requests *****************/

app.post('/api/v1/items', (request, response) => {
  database('items').insert(request.body, ['id', 'name', 'reason', 'cleanliness'])
    .then(item => response.json(...item))
    .catch(error => res.status(422).send({
      success: false,
      message: error.message
    }));
})
