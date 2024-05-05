
const bcrypt = require('bcrypt');


const user = 'james';
const pwd = 'james';

/*
const hashedPass = hashPass(pwd).then((result) => {
    console.log(result);
    return result});
    */
let hashPass =  function(pass){
    return bcrypt.hash(pass, 10);
}

/*
const hashedPass = hashPass(pwd).then(function(result) {
                    console.log(result);
                    return result});
*/

bcrypt.hash(pwd, 10).then((result) => console.log(result));

//console.log(hashedPass);

//console.log(hashedPass);

/*
hashedPass.then(function(hashed) {
    console.log(hashed);
    return hashed});
*/



/*
hashedPass.then(function(result) {
    console.log(result);
})
*/
