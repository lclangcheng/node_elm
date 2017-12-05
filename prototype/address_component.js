/*
* @Author: lai_lc
* @Date:   2017-12-04 10:30:55
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-12-04 14:18:25
*/
'use strict';

import BaseComponent from './base_component';


export default class AddressComponent extends BaseComponent {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
	};


	/**
	 * 获取定位地址
	 * @param  {Object} req request
	 * @return {Object}     定位地址
	 */
	async guessPosition(req) {
		return 'Beijing';
	};

}
