/*
* @Author: lai_lc
* @Date:   2017-12-04 10:14:01
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-12-04 15:07:34
*/
'use strict';

import express from 'express';
import Admin from '../controller/admin/admin';
const router = express.Router();

router.post('/login', Admin.login);
router.post('/register', Admin.register);
router.get('/signout', Admin.signout);
router.get('/all', Admin.getAllAdmin);
router.get('/count', Admin.getAdminCount);
router.get('/info', Admin.getAdminInfo);
router.post('/update/avatar/:admin_id', Admin.updateAvatar)

export default router;