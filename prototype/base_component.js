/*
* @Author: lai_lc
* @Date:   2017-12-01 15:00:45
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-12-05 10:48:43
*/
'use strict';

import Ids from '../models/ids';
import formidable from 'formidable';
import path from 'path'
import fs from 'fs'
import gm from 'gm'
const im = gm.subClass({ imageMagick: true });

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

	//获取路径
	async getPath(req){
		return new Promise((resolve, reject) => {
			const form = formidable.IncomingForm();
			form.uploadDir = './public/img';
			form.parse(req, async (err, fields, files) => {
				let img_id;
				try{
					img_id = await this.getId('img_id');
				}catch(err){
					console.log('获取图片id失败');
					fs.unlink(files.file.path);
					reject('获取图片id失败')
				}
				const imgName = (Date.now() + Math.ceil(Math.random()*10000)).toString(16) + img_id;
				const fullName = imgName + path.extname(files.file.name);
				const repath = process.cwd() + '/public/img/' + fullName;
				try{
					await fs.rename(files.file.path, repath);
					im(repath)
					.resize(200, 200, "!")
					.write(repath, async (err) => {
						if(err){
							console.log('裁切图片失败');
							console.log(err);
							reject('裁切图片失败');
							return
						}
						resolve(fullName)
					})
				}catch(err){
					console.log('保存图片失败', err);
					fs.unlink(files.file.path)
					reject('保存图片失败')
				}
			});
		})
	};
}