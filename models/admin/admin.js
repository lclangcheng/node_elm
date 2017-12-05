/*
* @Author: lai_lc
* @Date:   2017-12-04 10:46:01
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-12-04 15:13:23
*/
'use strict';


import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const adminScheme = new Schema({
	user_name: String,
	password: String,
	id: Number,
	create_time: String,
	admin:{type: String, default: '管理员'},
	status: Number, //1.普通管理员， 2.超级管理员
	avatar: {type: String, default: 'default.jpg'},
	city: String,
})

adminScheme.index({id: 1});

const Admin = mongoose.model('Admin', adminScheme);

export default Admin;