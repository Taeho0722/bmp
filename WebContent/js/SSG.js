function common_SSG() {
	var prop_ozController;
	Object.defineProperty(this, 'ozController', {
		get: function () {
			return prop_ozController;
		},
		set: function (val) {
			prop_ozController = val;
		},
	});
	var NewTmHandler = null;
	var commonPackage = 'com.obzen.ssgcmp';
	var Delimiter = '@#%';

	this.SET_SCREN_ACCS_LOG = function (pgm_dstic, cust_id) {
		//convert : Argument Initialize
		if (typeof (pgm_dstic) === "undefined") pgm_dstic = '';
		if (typeof (cust_id) === "undefined") cust_id = '';
		var FrameName = ozController.messageTitle;
		var FrameID = ozController.FrameName;
		var ClientIP= ""; //TM에서 처리
		var UserID = ozController.UserID;
		var UserName = ozController.UserName;
		
		NewTmHandler = new oza_TMHandlerFrame(ozController);
		NewTmHandler.package = commonPackage;
		NewTmHandler.classname = 'DocSSGComm';
		NewTmHandler.methodname = 'ins_ScrenAccsLog';
		NewTmHandler.delimiter = Delimiter;
		NewTmHandler.tmtype = 0;
		NewTmHandler.addDataField('USER_IP', ClientIP);
		NewTmHandler.addDataField('PGM_ID', FrameID);
		NewTmHandler.addDataField('PGM_NM', FrameName);
		NewTmHandler.addDataField('PGM_DSTIC', pgm_dstic);
		NewTmHandler.addDataField('EMP_CD', UserID);
		NewTmHandler.addDataField('EMP_NM', UserName);
		NewTmHandler.addDataField('CUST_ID', cust_id);

		NewTmHandler.execute();
		return null;
	}
	this.GET_DEPT = function () {
		var UserID = ozController.UserID;
		var DeptNO = '';

		NewTmHandler = new oza_TMHandlerFrame(ozController);
		NewTmHandler.package = commonPackage;
		NewTmHandler.classname = 'DocSSGComm';
		NewTmHandler.methodname = 'sel_DEPT_CD';
		NewTmHandler.delimiter = Delimiter;
		NewTmHandler.tmtype = 0;
		NewTmHandler.addDataField('EMP_CD', UserID);
		NewTmHandler.returnlist = 'DEPT_CD';
		NewTmHandler.execute();
		DeptNO = NewTmHandler.ElementValue('DEPT_CD');
		return DeptNO;
	}
	this.GET_USER_AUTH = function (auth_dtl_cd) {
		//convert : Argument Initialize
		if (typeof (auth_dtl_cd) === "undefined") auth_dtl_cd = '';

		var auth_apl_yn_list = '';
		var auth_yn = 'N';
		var auth_list = [];

		auth_apl_yn_list = ozf_GetTempContent(ozController.getRefMain(), 'AUTH_APL_YN_LIST', false, 'SSGAUTH');

		if (ozf_StringIsEmpty(auth_apl_yn_list) == false) {
			auth_list = auth_apl_yn_list.split(';');

			for (var i = 0; i <= auth_list.length - 1; i += 1) {
				if (auth_dtl_cd == auth_list[i].split("=")) {
					auth_yn = auth_list[i].split('=');
				}
			}
		}

		return auth_yn;
	}
	this.GET_USER_SATL_CD = function () {
		var satl_store_cd_list = '';
		satl_store_cd_list = ozf_GetTempContent(ozController.getRefMain(), 'SATL_STORE_CD_LIST', false, 'SSGAUTH');
		return satl_store_cd_list;
	}
	this.GET_USER_SATL_YN = function () {
		var satl_store_cd_list = '';
		var satl_list = [];
		var satl_yn = 'N';
		satl_store_cd_list = ozf_GetTempContent(ozController.getRefMain(), 'SATL_STORE_CD_LIST', false, 'SSGAUTH');
		satl_list = satl_store_cd_list.split(';');
		if (satl_list.length >= 2) {
			satl_yn = 'Y';
		} else {
			satl_yn = 'N';
		}
		return satl_yn;
	}
	this.GET_VDI_USER_YN = function () {
		var vdi_valid_user_yn = 'N';
		vdi_valid_user_yn = ozf_GetTempContent(ozController.getRefMain(), 'VDI_USER_YN', false, 'SSGAUTH');
		return vdi_valid_user_yn;
	}
}

