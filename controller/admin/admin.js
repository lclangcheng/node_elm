/*
* @Author: lai_lc
* @Date:   2017-12-04 10:28:25
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-12-05 11:00:31
*/


import AdminModel from '../../models/admin/admin';
import AddressComponent from '../../prototype/address_component';
import crypto from 'crypto';
import formidable from 'formidable'
import dtime from 'time-formater'


class Admin extends AddressComponent {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		this.login = this.login.bind(this);
		this.register = this.register.bind(this);
		this.encryption = this.encryption.bind(this);
		this.updateAvatar = this.updateAvatar.bind(this);
	};

	//登录
	async login(req, res, next) {
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				res.send({
					status: 0,
					type: 'FORM_DATA_ERROR',
					msg: '表单信息有误'
				});
				return;
			}
			const {user_name, password, status = 1} = fields;
			try {
				if (!user_name) {
					throw new Error('用户名错误');
				} else if (!password) {
					throw new Error('密码错误');
				}
			} catch (err) {
				console.log(err.message, err);
				res.send({
					status: 0,
					type: 'GET_ERROR_PARAM',
					msg: err.message
				});
			}
			const newpassword = this.encryption(password);
			try {
				const admin = await AdminModel.findOne({user_name});
				if (!admin) {
					console.log('管理员不存在');
					res.send({
						status: 0,
						type: 'ADMIN_NOT_EXIST',
						msg: '管理员不存在'
					})
				} else if (newpassword.toString() != admin.password.toString()) {
					console.log('管理员密码错误');
					res.send({
						status: 0,
						type: 'ERROR_PASSWORD',
						msg: '管理员密码错误'
					});
				} else {
					req.session.admin_id = admin.id;
					res.send({
						status: 1,
						suceess: '登录成功'
					});
				}
			} catch (err) { 
				console.log('登录管理员失效');
				res.send({
					status: 0,
					type: 'LOGIN_ADMIN_FAILED',
					msg: '登录管理员失效'
				});
			}
		})
	};

	 //注册管理员
	async register(req, res, netxt) {
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				res.send({
					status: 0,
					type: 'FORM_DATA_ERROR',
					msg: '表单信息有误'
				})
			}
			const {user_name, password, status = 1} = fields;
			try {
				if (!user_name) {
					throw new Error('用户名错误');
				} else if (!password) {
					throw new Error('密码错误');
				}
			} catch (err) {
				console.log(err.message, err);
				res.send({
					status: 0,
					type: 'GET_ERROR_PARAM',
					msg: err.message
				});

				return;
			}

			try {
				const admin = await AdminModel.findOne({user_name});
				if (admin) {
					console.log('该用户名已存在');
					res.send({
						status: 0,
						type: 'USER_HAS_EXIST',
						msg: '该用户已存在'
					});
				} else {
					const adminTitle = status == 1 ? '管理员': '超级管理员';
					const admin_id = await this.getId('admin_id');
					const newpassword = this.encryption(password);
					const newAdmin = {
						user_name: user_name,
						password: newpassword,
						id: admin_id,
						create_time: dtime().format('YYYY-MM-DD'),
						admin: adminTitle,
						status: status
					}

					await AdminModel.create(newAdmin);
					req.session.admin_id = admin_id;
					res.send({
						status: 1,
						msg: '注册管理员成功'
					});

				}
			} catch (err) {
				console.log('注册管理员失败', err);
				res.send({
					status: 0,
					type: 'REGISTER_ADMIN_FAILED',
					msg:'注册管理员失败'
				});
			}
		})

	};

	encryption(password){
		const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
		return newpassword
	};


	Md5(password){
		const md5 = crypto.createHash('md5');
		return md5.update(password).digest('base64');
	};

	
	//注销
	async signout(req, res, next) {
		try {
			delete req.session.admin_id;
			res.send({
				status: 1,
				msg: 'signout'
			})
		} catch (e) {
			res.send({
				status: 0,
				type: 'SIGNOUT_FAILED',
				msg: 'err'
			})
		}
	};


	//获取所有官员信息
	async getAllAdmin(req, res, next) {
		const {limit = 20, offset = 0} = req.query;
		try {
			const allAdmin = await AdminModel.find({}, '-_id -password').sort({id: -1}).skip(Number(offset)).limit(Number(limit));
			req.send( {
				status: 1, 
				data: allAdmin
			})
		} catch (e) {
			req.send( {
				status: 0, 
				type: 'GET_ALL_ADMIN_FAILED',
				msg: 'err'
			})
		}
	};

	//获取管理员数量
	async getAdminCount(req, res, next) {
		try {
			const count = await AdminModel.count();
			res.send({
				status: 1,
				count: count
			});
		} catch (e) {
			console.log("获取管理员信息失效");
			res.send({
				status: 0,
				type: 'GET_ADMIN_COUNT_FAILED',
				msg: '获取管理员信息失效'
			})
		}
	};

	//获取管理员信息
	async getAdminInfo(req, res, next) {
		const admin_id = req.session.admin_id;
		if (!admin_id || !Number(admin_id)) {
			console.log('获取管理员信息的seesion失效');
			res.send({
				status: 0,
				type: 'ERROR_SESSION_ADMIN_ID',
				msg: 'admin_id参数错误'
			});
			return;
		}
		try {
			const info = await AdminModel.fineOne({id: admin_id}, '-_id -__v -password');
			if (!info) {
				throw new Error('未找到当前管理员');
			} else {
				res.send({
					status: 1,
					data: info
				});
			}
		} catch (e) {
			console.log('获取管理员信息失败');
			res.send({
				status: 0,
				type: 'GET_ADMIN_INFO_FAILED',
				message: '获取管理员信息失败'
			})
		}
	};

	//更新管理员头像
	async updateAvatar(req, res, next) {
		const admin_id = req.session.admin_id;
		if(!admin_id || !Number(admin_id)) {
			console.log('admin_id参数错误', admin_id);
			res.send({
				status: 0,
				type: 'ERROR_SESSION_ADMIN_ID',
				msg: 'admin_id参数错误'
			})
		}
		try {
			const image_path = await this.getPath(req);
			await AdminModel.findOneAndUpdate({id: admin_id}, {$set: {avatar: image_path}})
			res.send({
				status: 1,
				msg:'ok'
			})
		} catch (err) {
			console.log('上传图片失效', err);
			res.send({
				status: 0,
				type: 'ERROR_UPLOAD_IMG',
				msg: '上传图片失效'
			})
		}
	};
}

export default new Admin();
