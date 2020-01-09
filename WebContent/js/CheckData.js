function common_CheckData() {
	var prop_ozController;
	Object.defineProperty(this, 'ozController', {
		get: function () {
			return prop_ozController;
		},
		set: function (val) {
			prop_ozController = val;
		},
	});

	this.inputCheckData = function (checkdata, checkname, checktitle, nullmessage) {
		//Argument Initialize
		if (typeof (checkdata) === "undefined") checkdata = '';
		if (typeof (checkname) === "undefined") checkname = '';
		if (typeof (checktitle) === "undefined") checktitle = '';
		if (typeof (nullmessage) === "undefined") nullmessage = '';
		if ((checkdata == "") || (checkdata.trim().length == 0)) {
			ozf_MsgBox(nullmessage);
			return false;
		} else if (ozf_check_notallowchar(checkdata, checkname, checktitle) != true) {
			return false;
		} else {
			return true;
		}
	}
	this.CheckByteOver = function (checkdata, bytelength) {
		//Argument Initialize
		if (typeof (checkdata) === "undefined") checkdata = '';
		if (typeof (bytelength) === "undefined") bytelength = 0;

		if (ozf_ByteCount(checkdata.trim()) > bytelength) {
			return false;
		} else {
			return true;
		}
	}
}
