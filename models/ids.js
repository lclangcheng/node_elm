/*
* @Author: lai_lc
* @Date:   2017-12-01 15:02:50
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-12-05 10:33:43
*/


'use strict';

import mongoose from 'mongoose'

const idsSchema = new mongoose.Schema({
	restaurant_id: Number,
	food_id: Number,
	order_id: Number,
	user_id: Number,
	address_id: Number,
	cart_id: Number,
	img_id: Number,
	category_id: Number,
	item_id: Number,
	sku_id: Number, 
	admin_id: Number,
	statis_id: Number,
});

const Ids = mongoose.model('Ids', idsSchema);


//用于初始化数据
Ids.findOne((err, data) => {
	if (!data) {
		const newIds = new Ids({
			restaurant_id: 0,
			food_id: 0,
			order_id: 0,
			user_id: 0,
			address_id: 0,
			cart_id: 0,
			img_id: 0,
			category_id: 0,
			item_id: 0,
			sku_id: 0, 
			admin_id: 0,
			statis_id: 0,
		});
		newIds.save();
	}
})
export default Ids