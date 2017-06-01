
const appendGarageStatus = (results) => {
  const { Dusty, Rancid, Sparkling, totalCount } = results
  $('.items-wrapper').prepend(`
    <section class="garage-info">
      <p>Garage Status:</p>
      <p class="item-count">Total count: ${totalCount || 0}</p>
      <div class="garage-cleanliness-status">
        <p>Sparkling: ${Sparkling || 0}</p>
        <p>Dusty: ${Dusty || 0}</p>
        <p>Rancid: ${Rancid || 0}</p>
      </div>
    </section>
    `)
}

const appendItems = (items) => {
  // need to clear out the items wrapper
  items.map(item => {
    $('.items-wrapper').append(`<div id=${item.id} class="item">${item.name}</div>`)
  })


}

const fetchItems = () => {
  fetch('/api/v1/items')
    .then((response) => response.json())
    .then(result => {
      appendItems(result.items)
      appendGarageStatus(result)
    })
    .catch(error => console.log(error))
}

$('.open-garage').on('click', () => {
  fetchItems()
})

$('.add-item').on('click', () => {
  const $name = $('.name-input').val()
  const $reason = $('.reason-input').val()
  const $cleanliness = $('.cleanliness-input').val()
  fetch('/api/v1/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: $name,
        reason: $reason,
        cleanliness: $cleanliness
    })
  })
  .then(response => response.json())
  .then(item => appendItems(item))
})

$('.items-wrapper').on('click', '.item', function () {
  const $id = $(this).attr('id')
  fetch(`/api/v1/${$id}/item`)
    .then(response => response.json())
    .then(item => console.log(item))
})
