/*
* @Author: lai_lc
* @Date:   2017-12-01 15:00:45
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-12-01 15:52:44
*/
'use strict';

import Ids from '../models/ids';

export default class BaseComponent {
	/**
	 * 构造函数
	 */
	constructor() {
		this.idList = ['restaurant_id', 'food_id', 'order_id', 'user_id', 'address_id', 'cart_id', 'img_id', 'category_id', 'item_id', 'sku_id', 'admin_id', 'statis_id'];
	};

	//获取id列表
	async getId(type){
		if (!this.idList.includes(type)) {
			console.log('id类型错误');
			throw new Error('id类型错误');
			return
		}
		try{
			const idData = await Ids.findOne();

			idData[type] ++ ;
			await idData.save();
			return idData[type]
		}catch(err){
			console.log('获取ID数据失败');
			throw new Error(err)
		}
	};

}