
const Sequelize = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');
require('dotenv').config()

class Controller {

    #hostname;
    #user;
    #pass;
    #db;
    #port;
    #sequelize;
    #User;
    

    constructor(){
       
        this.#hostname = process.env.DB_HOST;
        this.#user = process.env.DB_USER;
        this.#pass = process.env.DB_PASSWORD;
        this.#db = process.env.DB_DATABASE;
        this.#port = process.env.DB_PORT;


        this.#sequelize = new Sequelize(
            this.#db, this.#user, this.#pass,
            {
                host: this.#hostname,
                dialect: 'mysql'
            }
        );

        // authenticate
        this.#sequelize.authenticate().then(() => {
            console.log('Database connection has been established successfully.');
        }).catch((error) => {
            console.error('Unable to connect to the database: ', error);
        });

        // define the model
        this.#User = this.#sequelize.define('user', {
            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });
    }

    // insert a user
    async insert(user, pword) {
        this.#sequelize.sync();

        await this.#User.create({
            username: user,
            password: pword

        }).then(() => {
            console.log(`User ${user} added.`);
        });
    };

    // retrieve user (username only)
    async findUser(user) {
        this.#sequelize.sync();

        let result = await this.#User.findOne({
            where: {
                username: user
            },
            raw: true
        }).catch((error) => {
            console.log('Failed to retrieve data', error);
        });

        if (!result) {
            console.log('No user detected!');
            return {detected: false, res: null};
        }
        else {
            console.log(`User retrieved: ${result.username}`);
            return {detected: true, res: result};
        }

    };


    // retrieve user
    async select(user) {
        this.#sequelize.sync();

        let result = await this.#User.findOne({
            where: {
                username: user
            },
            raw: true
        }).catch((error) => {
            console.log('Failed to retrieve data', error);
        });

        if (!result) {
            console.log('No user detected!');
            return {detected: false, 
                    res: null, 
                    password: null};
        }
        else {
            console.log(`User retrieved: ${result.username}`);
            return {detected: true, 
                    res: result,
                    password: result.password};
        }

    };
    
}


module.exports = Controller;