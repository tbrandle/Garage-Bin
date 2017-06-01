
exports.seed = function(knex, Promise) {
  return knex('items').del()
    .then(() => Promise.all([
      knex('items').insert({
        name: 'boots',
        reason: 'too big',
        cleanliness: 'Dusty'
      }, 'id')
    ]))
  }
