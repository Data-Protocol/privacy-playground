const faker = require('faker');
const fs = require('fs');
const csv = require('csv-parser');

// let mysql = require('mysql');

const mysql = require('mysql2');

const host = 'localhost';
const user = 'elitecars';
const password = 'elitecars';
const database = 'elitecars';

faker.locale = 'en_US';

const totalDrivers = 1;
let totalCustomers = null;
let totalTrips = 100;

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function cleanDbTables(db) {
  // dbconnection = await mysql.createConnection(pool);
  const dropSql = 'DROP TABLE IF EXISTS drivers, customers, trips';
  const dropResult = await db.execute(dropSql);
  console.log(dropResult);
  console.log('tables dropped');

  const driverTable = `CREATE TABLE drivers( 
        id int NOT NULL PRIMARY KEY,
        gender CHAR NOT NULL,
        name varchar(64) NOT NULL,
        ssn varchar(16) NOT NULL,
        photo varchar(128) NOT NULL,
        email varchar(64) DEFAULT NULL,
        street varchar(64) DEFAULT NULL,
        city varchar(32) NOT NULL,
        state varchar(4) NOT NULL,
        zipcode varchar(8) NOT NULL,
        username varchar(32) NOT NULL,
        password varchar(32) NOT NULL,
        dob DATE NOT NULL,
        bic varchar(32) NOT NULL,
        routing varchar(32) NOT NULL,
        dlstate varchar(5) NOT NULL,
        dlnumber varchar(32) NOT NULL,
        vin varchar(64) NOT NULL,
        licenceplate varchar(32) NOT NULL 
        )`;

  const driverTableResult = await db.execute(driverTable);
  console.log(driverTableResult);
  console.log('drivers table created');
  const customerTable = `CREATE TABLE customers( 
        id int  NOT NULL PRIMARY KEY,
        gender CHAR NOT NULL,
        name varchar(64) NOT NULL,
        ssn varchar(16) NOT NULL,
        photo varchar(128) NOT NULL,
        email varchar(64) DEFAULT NULL,
        street varchar(64) DEFAULT NULL,
        city varchar(32) NOT NULL,
        state varchar(4) NOT NULL,
        zipcode varchar(8) NOT NULL,
        username varchar(32) NOT NULL,
        password varchar(32) NOT NULL,
        ccn varchar(48) NOT NULL,
        ccv varchar(4) NOT NULL,
        expdate varchar(8) NOT NULL
        )`;
  const customerTableResult = await db.execute(customerTable);
  console.log(customerTableResult);
  console.log('customers table created');

  const tripsTable = `CREATE TABLE trips( 
    id int PRIMARY KEY NOT NULL,
    custid int NOT NULL,
    driverid int NOT NULL,
    tpep_pickup_datetime DATETIME NOT NULL,
    tpep_dropoff_datetime DATETIME NOT NULL,
    passenger_count INT NOT NULL,
    trip_distance varchar(8) NOT NULL,
    pickup_longitude varchar(32) NOT NULL,
    pickup_latitude varchar(32) NOT NULL,
    dropoff_longitude varchar(32) NOT NULL,
    dropoff_latitude varchar(32) NOT NULL,
    fare_amount varchar(8) NOT NULL,
    extra varchar(8) NOT NULL,
    mta_tax varchar(8) NOT NULL,
    tip_amount varchar(8) NOT NULL,
    tolls_amount varchar(8) NOT NULL,
    improvement_surcharge varchar(8) NOT NULL,
    total_amount varchar(8) NOT NULL,
    FOREIGN KEY (custid) REFERENCES customers(id),
    FOREIGN KEY (driverid) REFERENCES drivers(id)
    )`;

  const tripsTableResult = await db.execute(tripsTable);
  console.log(tripsTableResult);
  console.log('trips table created');
}

async function generate() {
  let dbconnection = null;
  try {
    dbconnection = mysql.createConnection({
      host,
      user,
      password,
      database,
    });
    console.log('db connected');
    dbconnection.config.namedPlaceholders = true;
    await cleanDbTables(dbconnection);
    await genDrivers(dbconnection);
    await genCustomers(dbconnection);
    await genTrips(dbconnection);
  } catch (err) {
    console.error(err);
    await dbconnection.end();
    console.log('error! db connections ended');
  }
}
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
    this.state = 'NY';
    this.zipcode = faker.address.zipCodeByState(this.state);
    this.username = faker.internet.userName();
    this.password = faker.internet.password();

    const contextualCard = faker.helpers.contextualCard();
    this.dob = contextualCard.dob;
  }
}

async function tripWriteDb(db, trip) {
  await db.execute(
    'INSERT INTO trips SET id = ?, custid = ?, driverid = ?, tpep_pickup_datetime = ?, tpep_dropoff_datetime = ?,passenger_count = ?, trip_distance = ?, pickup_longitude = ?, pickup_latitude = ?, dropoff_longitude = ?, dropoff_latitude = ?, fare_amount = ?, extra = ?, mta_tax = ?, tip_amount = ?, tolls_amount = ?, improvement_surcharge = ?, total_amount = ?',
    [
      trip.id,
      trip.custid,
      trip.driverid,
      trip.tpep_pickup_datetime,
      trip.tpep_dropoff_datetime,
      trip.passenger_count,
      trip.trip_distance,
      trip.pickup_longitude,
      trip.pickup_latitude,
      trip.dropoff_longitude,
      trip.dropoff_latitude,
      trip.fare_amount,
      trip.extra,
      trip.mta_tax,
      trip.tip_amount,
      trip.tolls_amount,
      trip.improvement_surcharge,
      trip.total_amount,
    ],
  );
  console.log('create trip db entry: ' + trip.id);
}

async function genTrips(db) {
  console.log('Creating Trip data');

  let output = fs.createWriteStream('trips.json');
  output.write('[');
  let id = 1;

  fs.createReadStream('tripsTest.csv')
    .pipe(csv())
    .on('data', (row) => {
      delete row.VendorID;
      delete row.RateCodeID;
      delete row.store_and_fwd_flag;
      delete row.payment_type;
      row.id = id++;
      row.driverid = getRandomArbitrary(1, totalDrivers);
      //row.custid = getRandomArbitrary(1, totalCustomers);
      row.custid = getRandomArbitrary(1, 10);
      output.write(JSON.stringify(row, null, 2));
      if (id <= totalTrips) output.write(',');
      tripWriteDb(db, row);
    })
    .on('end', () => {
      output.write(']');
      output.end();
      console.log('CSV file successfully processed');
      db.end();
      console.log('db closed (ended)');
    });
}

async function genDrivers(db) {
  console.log('Creating driver data');

  let allDrivers = [];

  //Make Drivers
  for (let id = 1; id <= totalDrivers; id++) {
    let driverDetails = new Person(id);

    // Financial
    driverDetails.bic = faker.finance.bic();
    driverDetails.routing = faker.finance.routingNumber();

    // Driving details
    driverDetails.dlstate = faker.address.stateAbbr();
    driverDetails.dlnumber = Math.floor(Math.random() * 1000000000);
    driverDetails.vin = faker.vehicle.vin();
    driverDetails.licenceplate = faker.vehicle.vrm();

    await db.execute(
      'INSERT INTO drivers SET id = ?, gender = ?,name = ?, ssn = ?, photo = ?, email = ?,street = ?, city = ?, state = ?, zipcode = ?, username = ?, password = ?, dob = ?,bic = ?, routing = ?, dlstate = ?, dlnumber = ?, vin = ?, licenceplate = ?',
      [
        driverDetails.id,
        driverDetails.gender,
        driverDetails.name,
        driverDetails.ssn,
        driverDetails.photo,
        driverDetails.email,
        driverDetails.street,
        driverDetails.city,
        driverDetails.state,
        driverDetails.zipcode,
        driverDetails.username,
        driverDetails.password,
        driverDetails.dob,
        driverDetails.bic,
        driverDetails.routing,
        driverDetails.dlstate,
        driverDetails.dlnumber,
        driverDetails.vin,
        driverDetails.licenceplate,
      ],
    );
    console.log('create driver db entry: ' + driverDetails.id);
    allDrivers.push(driverDetails);
  }
  fs.writeFileSync('drivers.json', JSON.stringify(allDrivers, null, 4));
}

async function genCustomers(db) {
  console.log('Creating Customer data');

  let allCustomers = [];

  //Make Customers
  totalCustomers = famousNames.length;

  //  for (let id = 1; id <= totalCustomers; id++) {
  for (let id = 1; id <= 10; id++) {
    console.log('creating customer: ' + id);
    let custDetails = new Person(id);

    //Famous Name override
    let i = (Math.random() * famousNames.length) | 0;
    custDetails.name = famousNames.splice(i, 1)[0];

    const famousEmail = custDetails.name.replace(/[^\w\s]|_/g, '').replace(/[\s]/g, '.');
    custDetails.email = custDetails.email.replace(/^.*@/, famousEmail + '@');

    custDetails.state = faker.address.stateAbbr();
    custDetails.zipcode = faker.address.zipCodeByState(custDetails.state);

    // Financial
    custDetails.ccn = faker.finance.creditCardNumber();
    custDetails.ccv = faker.finance.creditCardCVV();
    const expDate = faker.date.future(5);
    custDetails.expdate = `${expDate.getMonth() + 1}/${expDate
      .getFullYear()
      .toString()
      .substr(-2)}`;

    await db.execute(
      'INSERT INTO customers SET id = ?, gender = ?,name = ?, ssn = ?, photo = ?, email = ?,street = ?, city = ?, state = ?, zipcode = ?, username = ?, password = ?, ccn = ?,ccv = ?, expdate = ?',
      [
        custDetails.id,
        custDetails.gender,
        custDetails.name,
        custDetails.ssn,
        custDetails.photo,
        custDetails.email,
        custDetails.street,
        custDetails.city,
        custDetails.state,
        custDetails.zipcode,
        custDetails.username,
        custDetails.password,
        custDetails.ccn,
        custDetails.ccv,
        custDetails.expdate,
      ],
    );
    console.log('create customer db entry: ' + custDetails.id);
    allCustomers.push(custDetails);
  }
  fs.writeFileSync('customers.json', JSON.stringify(allCustomers, null, 4));
}

let famousNames = [];
fs.createReadStream('famousNames.csv')
  .pipe(csv())
  .on('data', (row) => {
    famousNames.push(row.name);
  })
  .on('end', () => {
    console.log('Famous name file successfully processed with length: ' + famousNames.length);
    generate();
  });
console.log('generate exit');
