const Database = require('./login.contr')

const db = new Database();

const amount = 10000;

const username = 'james';
const password = 'james';


let user = async function() {
    await db.select('james').then((result) => {return result});

    const res = user();
    const id = res.id;

    console.log(id);
}


user();