/*
* @Author: lai_lc
* @Date:   2017-12-04 10:08:19
* @Last Modified by:   lai_lc
* @Last Modified time: 2017-12-04 14:09:52
*/
'use strict';

import admin from  './admin'


export default app => {
	app.use('/admin', admin);
};