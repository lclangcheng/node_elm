/*
* @Author: lai_lc
* @Date:   2017-12-01 15:00:21
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-12-01 15:38:29
*/
'use strict';


import dtime from 'time-formater';
import BaseComponent from '../prototype/base_component'
import StatisModel from '../models/statis/statis';

class Statistic extends BaseComponent {
	/**
	 * 构造函数
	 */
	constructor(){
		super();
		this.apiRecord = this.apiRecord.bind(this)
	}

	async apiRecord(req, res, next) {
		try {
			const statis_id = await this.getId('statis_id');
			const apiInfo = {
				date: dtime().format('YYYY-MM-DD'),
				origin: req.headers.origin,
				id: statis_id
			}
			StatisModel.create(apiInfo);
		} catch (e) {
			console.log('API记录出错:', e);
		}
		next();
	}
}

export default new Statistic();