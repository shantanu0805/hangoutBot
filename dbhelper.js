var dbhelper = {};
const pg = require('pg');

const {
    Pool,
    Client
} = require('pg');
var connectionString = '';
var env = process.env.NODE_ENV || 'development';
connectionString = env == 'production' ? process.env.DATABASE_URL : "postgres://postgres:t1992107@localhost:5432/hangoutTimeBot";
console.log('>> connectionString : ' + connectionString);
const pool = new Pool({
    connectionString: connectionString,
})

dbhelper.insertUserQueryRequest = function (userQueryJSON) {
    console.log('>> insertUserQueryRequest : ' + JSON.stringify(userQueryJSON));
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        } else {
            client.query('INSERT INTO public."UserQueries"( "ServerTimestamp", "UserQueryText", "BotAnswer", "ApiRequestType", "HangoutUserName", "BotSuccess", "HangoutRoomName", "HangoutRoomOrDM") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [userQueryJSON.Timestamp, userQueryJSON.QueryText, userQueryJSON.BotAnswer, userQueryJSON.RequestType, userQueryJSON.UserName, userQueryJSON.Success, userQueryJSON.RoomName, userQueryJSON.RoomOrDM],
                function (err, result) {
                    //done();
                    if (err) {
                        console.log('>> Error in inserting record in db : ' + err);
                    } else {
                        console.log('Succesfully inserted record in db');
                    }
                })
        }
    })
}

module.exports = dbhelper;