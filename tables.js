const Sequelize = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');
require('dotenv').config()

async function test() {
    this.hostname = process.env.DB_HOST;
    this.user = process.env.DB_USER;
    this.pass = process.env.DB_PASSWORD;
    this.db = process.env.DB_DATABASE;
    this.port = process.env.DB_PORT;


    this.sequelize = new Sequelize(
        this.db, this.user, this.pass,
        {
            host: this.hostname,
            dialect: 'mysql'
        }
    );

    // authenticate
    this.sequelize.authenticate().then(() => {
        console.log('Database connection has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to the database: ', error);
    });

    // define the user model
    this.User = this.sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    this.Account = this.sequelize.define('accounts', {
        account: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false
        }
    });

    this.User.hasOne(this.Account);
    this.Account.belongsTo(this.User);

    await this.sequelize.sync().catch((error) => {
        console.log('Unable to create table.', error);
    });

    /*
    await this.User.create({
        username: 'james',
        password: 'james',
        account: {account: 5}
    }, {
        include: [this.Account],
    },
    );
    */

    const userId = 15;

    
    await this.Account.findOne({
        where: {
            userId: userId
        },
        raw: true
    }).then((result) => {
        console.log(result.account);
    });
    

    await this.Account.update(
        {account: 1111},
        {where: {
            userId: userId
        }}
    ).then((result) => {
        console.log(result.account);
    });

    await this.sequelize.close();
}

test();