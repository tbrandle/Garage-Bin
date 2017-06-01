class Garage {
  constructor() {
    this.open = false;
    this.items = []
  }

  addItem(item){
    this.items.push(item)
  }

  openDoor(){
    this.open = true;
  }

  closeDoor(){
    this.open = false;
  }

}

const garage = new Garage()
console.log(garage.openDoor);

$('.open-garage').on('click', () => {
  garage.openDoor()
  console.log(garage);
})

$('.close-garage').on('click', () => {
  garage.closeDoor()
  console.log(garage);
})
