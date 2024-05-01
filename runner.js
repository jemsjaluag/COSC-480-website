
const Controller = require('./login.contr');

const name = 'james';
const pwd = 'james';


const controller = new Controller();

//controller.insert(name, pwd).then(() => console.log('Inserted'));

fun(name, pwd);


async function fun(username, password) {
    const result = await controller.select(username, password);
    
    if (!result.detected) {
        console.log('NOO PPL');
    }
    else {
        console.log('YES PPL');
    }
}

