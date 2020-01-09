function common_FrameSystemSecurity() {
	var prop_ozController;
	Object.defineProperty(this, 'ozController', {
		get: function () {
			return prop_ozController;
		},
		set: function (val) {
			prop_ozController = val;
		},
	});

	this.Masking_apply = function (ary, headerlist, fixedrows) {
		//Argument Initialize
		if (typeof (ary) === "undefined") ary = null;
		if (typeof (headerlist) === "undefined") headerlist = '';
		if (typeof (fixedrows) === "undefined") fixedrows = 0;
		//headerList = "전담직원번호_TEST;개인법인구분_TEST;전담직원번호_TEST_cpy1;고객명;"
		headerList = ";" + headerList;
		for (var c = 0; c <= (1) - 1; c += 1) {
			if (headerList.indexof(";" + ary[fixedRows - 1, c] + ";") >= 0) {
				for (var r = fixedRows; r <= ary.GetLength(0) - 1; r += 1) {
					ary[r, c] = func_Masking_GetMaskedValue(ary[fixedRows - 1, c], ary[r, c]);
				}
			}
		}
	}
	this.Masking_GetMaskedValue = function (headername, maskvalue) {
		//Argument Initialize
		if (typeof (headername) === "undefined") headername = '';
		if (typeof (maskvalue) === "undefined") maskvalue = '';

		switch (headerName) {
			case "고객명" :case "예금주명" :case "주고객명" :case "수신고객명" :case "예금주" :case "대표고객명" :case "대표명" :

				if (!ozf_StringIsEmpty(MaskValue.trim())) {
					if ((((ozf_asc(ozf_mid(MaskValue.trim, 1, 1)) >= 65) && (ozf_asc(ozf_mid(MaskValue.trim, 1, 1)) <= 90))) || (((ozf_asc(ozf_mid(MaskValue.trim, 1, 1)) >= 97) && (ozf_asc(ozf_mid(MaskValue.trim, 1, 1)) <= 122)))) {//영문'
						MaskValue = ozf_mid(MaskValue.trim, 1, 4) + "*******";
					} else {
						MaskValue = ozf_mid(MaskValue.trim, 1, 2) + "*******";
					}
				}
				break;

			case "고객번호" :
				break;
				//변환루틴...
			default:
				break;
				//아무것도 안하고 들어온값을 그대로 반환한다.
		}

		return MaskValue;
	}
	this.Masking_GetHeaderList = function () {
		var framename = MyBasicVar.FrameName;
		var returnlist = '';
		returnlist = "전담직원번호_TEST;개인법인구분_TEST;전담직원번호_TEST_cpy1;고객명;";
		return returnlist;
	}
	this.GridMaskingProc = function (grid) {
		//Argument Initialize
		if (typeof (grid) === "undefined") grid = null;
		var i = 0;
		var j = 0;
		var rows = grid.getRows() - 1;
		var cols = grid.getCols() - 1;
		if (grid.getCols() > 2) {
			for (var i = 1; i <= rows; i += 1) {
				for (var j = 2; j <= cols; j += 1) {
					if (grid.getCellData(i, j) != "") {
						grid.setCellTagData(i, j, grid.getCellData(i, j));
						grid.setCellData(i, j, "CCC");
					}
				}
			}
		}
	}
}

