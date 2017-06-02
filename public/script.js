
const appendGarageStatus = (results) => {
  const { Dusty, Rancid, Sparkling, totalCount } = results
  $('.garage-info').prepend(`
    <div class="garage-div">
      <p class="status">Garage Status:</p>
      <p class="item-count">Total count: ${totalCount || 0}</p>
      <p>Sparkling: ${Sparkling || 0}</p>
      <p>Dusty: ${Dusty || 0}</p>
      <p>Rancid: ${Rancid || 0}</p>
    </div>
    `)
}

const appendItems = (items) => {
  items.map(item => {
    $('.garage-items').append(`<div id=${item.id} class="item">${item.name}</div>`)
  })
}

const appendItemInfo = (item) => {
  clearSection('.item-info-wrapper')
  $('.item-info-wrapper').append(`
    <div id=${item.id} class="item-info">
    <p>name: ${item.name}</p>
    <p>reason: ${item.reason}</p>
    <p>cleanliness: ${item.cleanliness}</p>
    <p class="edit-cleanliness">edit cleanliness:</p>
    <select class="change-cleanliness">
      <option>Sparkling</option>
      <option>Dusty</option>
      <option>Rancid</option>
    </select>
    <button class="btn edit-submit">submit</button>
    </div>`
  )
}

//PATCH request
$('.item-info-wrapper').on('click', '.edit-submit', () => {
  const $itemId = $('.item-info-wrapper').children('.item-info').attr('id')
  const $cleanlinessEdit = $('.change-cleanliness').val();
  fetch(`/api/v1/${$itemId}/item`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: $itemId,
        cleanliness: $cleanlinessEdit
      })
    })
    .then(response => response.json())
    .then(updatedItem => console.log(updatedItem) )

})

const clearSection = (section)=> {
  $(section).children().remove()
}

const fetchItems = () => {
  fetch('/api/v1/items')
    .then((response) => response.json())
    .then(result => {
      clearSection('.garage-info')
      clearSection('.garage-items')
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

let garageOpen = false;
$('.open-garage').on('click', () => {
  if (garageOpen) {
    clearSection('.garage-items')
    clearSection('.garage-info')
    garageOpen = false
  } else {
    fetchItems()
    garageOpen = true;
  }
})

$('.add-item').on('click', () => {
  postItem()
})

$('.garage-items').on('click', '.item', function () {
  const $id = $(this).attr('id')
  fetch(`/api/v1/${$id}/item`)
    .then(response => response.json())
    .then(item => appendItemInfo(item[0]))
})

$('.sort-items').on('click', () => {
  fetch('/api/v1/items/sort')
    .then(response => response.json())
    .then(items => {
      clearSection('.garage-items')
      appendItems(items)
    })
})
