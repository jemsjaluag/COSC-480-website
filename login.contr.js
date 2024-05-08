
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
    #Account;


    constructor() {

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

        // define the user model
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

        this.#Account = this.#sequelize.define('accounts', {
            account: {
                type: DataTypes.FLOAT,
                allowNull: false
            }
        });


        // one-to-one association
        this.#User.hasOne(this.#Account);
        this.#Account.belongsTo(this.#User);
    }

    // insert a user
    async insert(user, pword) {
        this.#sequelize.sync();

        await this.#User.create({
            username: user,
            password: pword,
            account: {account: 0}
        }, { 
            include: this.#Account
        },
        ).then(() => {
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
            return { detected: false, res: null };
        }
        else {
            console.log(`User retrieved: ${result.username}`);
            return { detected: true, res: result };
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
            return {
                detected: false,
                res: null,
                password: null
            };
        }
        else {
            console.log(`User retrieved: ${result.username}`);
            return {
                detected: true,
                res: result,
                username: result.username,
                password: result.password,
                userid: result.id
            };
        }

    };

    async getAccount(userId) {
        this.#sequelize.sync();

        let result = await this.#Account.findOne({
            where: {
                userId: userId
            },
            raw: true
        }).then((result) => {
            return result;
        })
        .catch((error) => {
            console.log('Failed to retrieve data', error);
        });

        if (!result) {
            console.log('ACCOUNT: No user detected! User ID ' + userId);
            return { detected: false, res: null };
        }
        else {
            console.log(`ACOUNT: User retrieved with ID: ${result.userId}`);
            return { 
                detected: true,
                savings: result.account
            };
        }
    }

    async updateAccount(userId, amount) {

        const result = await this.#Account.update(
            {account: amount},
            {where: {
                userId: userId
            }}
        ).then((result) => {
            console.log('ACCOUNT: Account amount updated');
            return result;
        }).catch((error) => {
            console.log('Account cannot be updated', error);
        });
        
        if (!result) {
            console.log('Account cannot be updated.');
            return { detected: false, res: null };
        }
        else {
            console.log(`Account updated. New amount: ${result.account}`);
            return { detected: true, res: result };
        }

        /*
        let userAccount = await this.#User.findOne({
            where: {
                username: user
            },
            include: {
                model: this.#Account
            },
            raw: true
        }).catch((error) => {
            console.log('Failed to retrieve data', error);
        });
        */
        


    }






}


module.exports = Controller;