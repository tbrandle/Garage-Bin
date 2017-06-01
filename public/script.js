
const appendGarageStatus = (results) => {
  const { Dusty, Rancid, Sparkling, totalCount } = results
  $('.garage').prepend(`
    <section class="garage-info">
      <p class="status">Garage Status:</p>
      <p class="item-count">Total count: ${totalCount || 0}</p>
      <p>Sparkling: ${Sparkling || 0}</p>
      <p>Dusty: ${Dusty || 0}</p>
      <p>Rancid: ${Rancid || 0}</p>
    </section>
    `)
}

const appendItems = (items) => {
  items.map(item => {
    $('.garage').append(`<div id=${item.id} class="item">${item.name}</div>`)
  })
}

const appendItemInfo = (item) => {
  $('.item-info-wrapper').children().remove()
  $('.item-info-wrapper').append(`
    <div id=${item.id} class="item-info">
      <p>${item.name}</p>
      <p>${item.reason}</p>
      <p>${item.cleanliness}</p>
    </div>`
  )
}

const fetchItems = () => {
  fetch('/api/v1/items')
    .then((response) => response.json())
    .then(result => {
      $('.garage').children().remove();
      appendItems(result.items)
      appendGarageStatus(result)
    })
    .catch(error => console.log(error))
}

const postItem = () => {
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
  .then(response => fetchItems())
  .catch(error => console.log(error))
}


$('.open-garage').on('click', () => {
  fetchItems()
})

$('.add-item').on('click', () => {
  postItem()
})

$('.garage').on('click', '.item', function () {
  console.log("working");
  const $id = $(this).attr('id')
  fetch(`/api/v1/${$id}/item`)
    .then(response => response.json())
    .then(item => {
      appendItemInfo(item[0])
    })
})
