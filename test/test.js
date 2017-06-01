const chai = require('chai');
require('script.js')


describe('Garage', () => {
  it('by default the garage should be open', () => {
    let garage = new Garage()
    console.log(garage);
    // expect(garage.open).to.equal(false)
  })
})
