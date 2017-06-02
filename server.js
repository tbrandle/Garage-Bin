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

const getItemCounts = (items) => {
  const cleanlinessCount =  items.reduce((obj, item) => {
    const key = item.cleanliness
    if (!obj[key]) {
      obj[key] = 0
    }
    obj[key]+=1
    return obj
  }, {})
  const result = Object.assign({}, cleanlinessCount, { totalCount: items.length })
  return result
}

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file);
  });
});

app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then(items => {
      const counts = getItemCounts(items)
      const itemsWithCounts = Object.assign({}, counts, { items })
      response.status(200).json(itemsWithCounts)
    })
    .catch(error => console.log(error))
})

app.get('/api/v1/items/sort', (request, response) => {
  database('items').orderBy('name', 'asc').select()
    .then(items => {
      response.status(200).json(items)
    })
    .catch(error => console.log(error))
})

app.get('/api/v1/:id/item', (request, response) => {
    database('items').where('id', request.params.id).select()
    .then(item => response.status(200).json(item))
    .catch(error => response.status(422).send({
      success: false,
      message: error.message
    }));

})

/**************** POST requests *****************/

app.post('/api/v1/items', (request, response) => {
  const { name, reason, cleanliness } = request.body
  if (name && reason && cleanliness) {
    database('items').insert(request.body, ['id', 'name', 'reason', 'cleanliness'])
    .then(item => response.json(item))
    .catch(error => response.status(422).send({
      success: false,
      message: error.message
    }));
  } else {
    response.status(422).send({
      success: false,
      message: 'Please include name, reason, and cleanliness'
    });
  }
})

/**************** PATCH requests *****************/

app.patch('/api/v1/:id/item', (request, response) => {
  const { cleanliness } = request.body
    database('items').where('id', request.params.id).update('cleanliness', cleanliness)
    .then(item => response.status(200).json(item))
    .catch(error => response.status(422).send({
      success: false,
      message: error.message
    }));

})


module.exports = app
