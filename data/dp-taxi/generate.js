const faker = require('faker');
const fs = require('fs');

faker.locale = 'en_US';

const totalDrivers = 10;
let allDrivers = [];

class Person {
  constructor(id) {
    this.id = id;
    const gender = faker.random.number(1);
    this.gender = gender ? 'F' : 'M';
    this.name = faker.name.findName(null, null, gender);
    this.ssn = `${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 100)}-${Math.floor(
      Math.random() * 10000,
    )}`;
    this.photo = faker.image.avatar();
    this.email = faker.internet.email();
    this.street = faker.address.streetAddress();
    this.city = faker.address.city();
    this.state = faker.address.stateAbbr();
    this.zipcode = faker.address.zipCodeByState(this.state);
    this.username = faker.internet.userName();
    this.password = faker.internet.password();

    const contextualCard = faker.helpers.contextualCard();
    this.dob = contextualCard.dob;
  }
}

for (let id = 1; id <= totalDrivers; id++) {
  let driverDetails = new Person(id);

  // Financial
  driverDetails.bic = faker.finance.bic();
  driverDetails.routing = faker.finance.routingNumber();

  // Driving details
  driverDetails.dlState = faker.address.stateAbbr();
  driverDetails.dlnumber = Math.floor(Math.random() * 1000000000);
  driverDetails.vin = faker.vehicle.vin();
  driverDetails.licenceplate = faker.vehicle.vrm();

  allDrivers.push(driverDetails);
}

console.log('-------');
console.log(allDrivers);
console.log('-------');

try {
  fs.writeFileSync('data.json', JSON.stringify(allDrivers, null, 4));
} catch (err) {
  console.error(err);
}
