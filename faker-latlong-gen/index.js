const _ = require('lodash');
const faker = require('faker')
const fs = require('fs');

const users = [];

_.times(100, () => {

    const name = faker.name.firstName()+" "+faker.name.lastName();
    const zip = faker.address.zipCode();
    const city = faker.address.city();
    const country = faker.address.country();
    const state = faker.address.state();
    const streetname = faker.address.streetName();
    const streetaddress = faker.address.streetAddress();

    const latitude = faker.address.latitude();
    const longitude = faker.address.longitude();

    const address = {
        name,
        streetaddress, streetname, state, zip, city,
        country, latitude, longitude
    }

    users.push(address);
   console.log(address) 

});

const data = {
    users
};

fs.writeFile('addresses.json', JSON.stringify(data, null, 4), (err)=> {
    
    if(err) {
        console.log(err)
    }else {
        console.log("saved");
    }

})