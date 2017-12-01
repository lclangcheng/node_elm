/*
* @Author: lai_lc
* @Date:   2017-12-01 11:20:50
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-12-01 15:37:58
*/
'use strict';

import config from 'config-lite';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import http from 'http';
import express from 'express';
import Statistic from './middlewares/statistic';
import db from './mongodb/db.js';

var app = express();


const MongoStore = connectMongo(session);
app.use(session({
	name: config.session.name,
	secret: config.session.secret,
	resave: true,
	saveUninitialized: false,
	cookie: config.session.cookie,
	store: new MongoStore({
	  	url: config.url
	})
}))


app.use(Statistic.apiRecord);

app.all('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  	res.header("Access-Control-Allow-Credentials", true); //可以带cookies
	res.header("X-Powered-By", '3.2.1')
	console.log(req.headers);
	console.log(req.headers.origin);
	if (req.method == 'OPTIONS') {
	  	res.send(200);
	} else {
		if (req.session.count) {
			req.session.count++;
		} else {
			req.session.count = 1;
		}
	    next("ok");
	}
});


app.use(function(err, req, res, next) {
	console.log('this next?');
	res.send("ok");
});



var httpServer = http.createServer(app);
httpServer.listen(config.port);

console.log('httpserver listening',  config.port);