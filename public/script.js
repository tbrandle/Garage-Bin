
const appendItems = (items) => {
  // need to clear out the items wrapper
  items.map(item => {
    $('.items-wrapper').append(`<div>${item.name}${item.reason}${item.cleanliness}</div>`)
  })
}


$('.open-garage').on('click', () => {
  fetch('/api/v1/items')
    .then((response) => response.json())
    .then((items) => appendItems(items))
    .catch(error => console.log(error))
})

$('.add-item').on('click', () => {
  const $name = $('.name-input').val()
  const $reason = $('.reason-input').val()
  const $cleanliness = $('.cleanliness-input').val()
  console.log($name, $reason, $cleanliness);
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
