function common_MFB() {
	var prop_ozController;
	Object.defineProperty(this, 'ozController', {
		get: function () {
			return prop_ozController;
		},
		set: function (val) {
			prop_ozController = val;
		},
	});

	this.getLoginInfo = function () {
		var EmployeeID = ozController.UserID;//직원번호
		var EmployeeName = ozController.UserName;//직원명
		var BranchNo = ozController.GroupName;//부점
		//convert : html에서 지원하지 않는 구문 입니다.
		//var BranchName=;//부점명
		var sValue = ozf_GetTempContent(ozController.getRefMain(), '강제로그인', false, '로그인');

		if ((sValue == "1")) {//강제로그인인 경우

		} else {
			//FrameTester 실행시 부점 Set
			if ((BranchNo.toUpperCase() == "OBZG" || EmployeeID.toUpperCase() == "ADMIN")) {
				BranchNo = '4055';
			}

			ozf_SetTempContent(ozController.getRefMain(), 'BranchNo', BranchNo, '로그인'); //로그인 부점
			ozf_SetTempContent(ozController.getRefMain(), 'BranchName', BranchName, '로그인'); //로그인 부점명
			ozf_SetTempContent(ozController.getRefMain(), 'EmployeeID', EmployeeID, '로그인'); //로그인 직원
			ozf_SetTempContent(ozController.getRefMain(), 'EmployeeName', EmployeeName, '로그인'); //로그인 직원명

			//지역본부, 부실점구분
			NewTmHandler = new oza_TMHandlerFrame(ozController);
			NewTmHandler.package = commonPackage;//패키지명
			NewTmHandler.classname = ClassName;//클래스명
			NewTmHandler.methodname = 'MFB72B01SA';//메서드명
			NewTmHandler.delimiter = Delimiter;//구분자
			NewTmHandler.tmtype = 1;//0:Element, 1:Collection
			NewTmHandler.addDataField('부점코드', BranchNo);
			NewTmHandler.execute();

			if (NewTmHandler.isError()) {//서비스 에러
				ozf_MsgBoxEx('로그인 실패. 잠시후에 다시 사용해 주십시오.', 0, '로그인 정보');
				return true;
			} else {//서비스 에러가 없을 경우
				ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
				if (ReportHandler == null) {//조회결과가 없을 경우
					ozf_MsgBoxEx('해당 직원이 존재하지 않습니다.', 0, '로그인 정보');
					return true;
				} else {
					//convert : html에서 지원하지 않는 구문 입니다.
					//MyFunctions.setTempContent('BranchHqCode', ReportHandler.CellDataByIndex(0, 1), '로그인'); //지역본부코드
					//convert : html에서 지원하지 않는 구문 입니다.
					//MyFunctions.setTempContent('BranchHqFlag', ReportHandler.CellDataByIndex(1, 1), '로그인'); //지역본부여부
					//convert : html에서 지원하지 않는 구문 입니다.
					//MyFunctions.setTempContent('BranchRM', ReportHandler.CellDataByIndex(2, 1), '로그인'); //RM점여부
				}
			}

			//FrameTester 실행시 보안 인증 패스를 위한
			if ((BranchNo.toUpperCase() == "OBZG" || EmployeeID.toUpperCase() == "ADMIN")) {
				ozf_SetTempContent(ozController.getRefMain(), 'BranchRM', '1', '로그인'); //RM점 여
				ozf_SetTempContent(ozController.getRefMain(), 'BranchHqFlag', '1', '로그인'); //지역본부 여
				ozf_SetTempContent(ozController.getRefMain(), 'BbrnFlag', '0', '로그인'); //영업점여부
				ozf_SetTempContent(ozController.getRefMain(), 'ITFlag', '1', '로그인'); //전산여부
				ozf_SetTempContent(ozController.getRefMain(), 'HQFlag', '0', '로그인'); //본부여부
				ozf_SetTempContent(ozController.getRefMain(), 'BranchFlag', '1', '로그인'); //지점장 여
				ozf_SetTempContent(ozController.getRefMain(), 'PrintFlag', '1', '로그인'); //출력권한 여
				ozf_SetTempContent(ozController.getRefMain(), 'SCFlag', '1', '로그인'); //SC 여
				ozf_SetTempContent(ozController.getRefMain(), 'CSFlag', '1', '로그인'); //CS 여
				ozf_SetTempContent(ozController.getRefMain(), 'IPFlag', '1', '로그인'); //IP 여
			} else {
				var SystemSecurity = MyFunctions.Get_SystemSecurity;//보안에서 넘어온 기능

				//convert : html에서 지원하지 않는 구문 입니다.
				//if (SystemSecurity.CallAuthority) {
				//convert : html에서 지원하지 않는 구문 입니다.
				//var sVlaue1=SystemSecurity.CheckAuthority('MFB_영업점직원');//영업직원여부
				//convert : html에서 지원하지 않는 구문 입니다.
				//var sVlaue2=SystemSecurity.CheckAuthority('MFB_전산담당자');//전산담당자여부
				//convert : html에서 지원하지 않는 구문 입니다.
				//var sVlaue3=SystemSecurity.CheckAuthority('MFB_영업점직원외사용자');//본부직원여부
				//convert : html에서 지원하지 않는 구문 입니다.
				//var sVlaue4=SystemSecurity.CheckAuthority('MFB_지점장');//지점장여부
				//convert : html에서 지원하지 않는 구문 입니다.
				//var sVlaue5=SystemSecurity.CheckAuthority('MFB_인쇄출력권한');//인쇄출력권한여부
				//convert : html에서 지원하지 않는 구문 입니다.
				//var sVlaue6=SystemSecurity.CheckAuthority('MFB_SC권한');//사이버브렌치 SC권한여부
				//convert : html에서 지원하지 않는 구문 입니다.
				//var sVlaue7=SystemSecurity.CheckAuthority('MFB_CS권한');//사이버브렌치 CS권한여부
				//convert : html에서 지원하지 않는 구문 입니다.
				//var sVlaue8=SystemSecurity.CheckAuthority('MFB_IP권한');//사이버브렌치 IP권한여부

				if ((((((((sVlaue1 == null || sVlaue2 == null) || sVlaue3 == null) || sVlaue4 == null) || sVlaue5 == null) || sVlaue6 == null) || sVlaue7 == null) || sVlaue8 == null)) {
					ozf_MsgBoxEx('보안 모듈 접속에 실패 하였습니다.', 0, '로그인');
					return true;
				}

				ozf_SetTempContent(ozController.getRefMain(), 'BbrnFlag', sVlaue1, '로그인');
				ozf_SetTempContent(ozController.getRefMain(), 'ITFlag', sVlaue2, '로그인');
				ozf_SetTempContent(ozController.getRefMain(), 'HQFlag', sVlaue3, '로그인');
				ozf_SetTempContent(ozController.getRefMain(), 'BranchFlag', sVlaue4, '로그인');
				ozf_SetTempContent(ozController.getRefMain(), 'PrintFlag', sVlaue5, '로그인');
				ozf_SetTempContent(ozController.getRefMain(), 'SCFlag', sVlaue6, '로그인');
				ozf_SetTempContent(ozController.getRefMain(), 'CSFlag', sVlaue7, '로그인');
				ozf_SetTempContent(ozController.getRefMain(), 'IPFlag', sVlaue8, '로그인');
			} else {
				ozf_MsgBoxEx('보안 모듈 접속에 실패 하였습니다.', 0, '로그인');
				return true;
			}
		}
	}
	return false;
}
this.getAuthority = function () {
	if (ozf_GetTempContent(ozController.getRefMain(), "btn_Authority", false, "로그인") == "1") {
		return true;
	} else {
		return false;
	}
	return false;
}
this.getBranchAuthority = function () {
	if (ozf_GetTempContent(ozController.getRefMain(), "BranchAuthority", false, "로그인") == "1") {
		return true;
	} else {
		return false;
	}
	return false;
}
this.getBranchSelect = function () {
	if (ozf_GetTempContent(ozController.getRefMain(), "BranchSelect", false, "로그인") == "1") {
		return true;
	} else {
		return false;
	}
	return false;
}
this.getBranchHqFlag = function () {
	if (ozf_GetTempContent(ozController.getRefMain(), "BranchHqFlag", false, "로그인") == "1") {
		return true;
	} else {
		return false;
	}
	return false;
}
this.getBbrnFlag = function () {
	if (ozf_GetTempContent(ozController.getRefMain(), "BbrnFlag", false, "로그인") == "1") {
		return true;
	} else {
		return false;
	}
	return false;
}
this.getITFlag = function () {
	if (ozf_GetTempContent(ozController.getRefMain(), "ITFlag", false, "로그인") == "1") {
		return true;
	} else {
		return false;
	}
	return false;
}
this.getHQFlag = function () {
	if (ozf_GetTempContent(ozController.getRefMain(), "HQFlag", false, "로그인") == "1") {
		return true;
	} else {
		return false;
	}
	return false;
}
this.getEmployeeID = function () {


	if (ozf_GetTempContent(ozController.getRefMain(), 'EmployeeID', false, '로그인')) {
		return true;
	} else {
		return false;
	}
}
this.getEmployeeName = function () {


	if (ozf_GetTempContent(ozController.getRefMain(), 'EmployeeName', false, '로그인')) {
		return true;
	} else {
		return false;
	}
}
this.getBranchHqCode = function () {


	if (ozf_GetTempContent(ozController.getRefMain(), 'BranchHqCode', false, '로그인')) {
		return true;
	} else {
		return false;
	}
}
this.getBranchNo = function () {


	if (ozf_GetTempContent(ozController.getRefMain(), 'BranchNo', false, '로그인')) {
		return true;
	} else {
		return false;
	}
}
this.getBranchName = function () {


	if (ozf_GetTempContent(ozController.getRefMain(), 'BranchName', false, '로그인')) {
		return true;
	} else {
		return false;
	}
}
this.getBranchFlag = function () {
	if (ozf_GetTempContent(ozController.getRefMain(), "BranchFlag", false, "로그인").trim() == "1") {
		return true;
	}
	return false;
}
this.getBranchRM = function () {
	if (ozf_GetTempContent(ozController.getRefMain(), "BranchRM", false, "로그인").trim() == "1") {
		return true;
	}
	return false;
}
this.getSBSC = function () {
	if (ozf_GetTempContent(ozController.getRefMain(), "SCFlag", false, "로그인").trim() == "1") {
		return true;
	}
	return false;
}
this.getSBCS = function () {
	if (ozf_GetTempContent(ozController.getRefMain(), "CSFlag", false, "로그인").trim() == "1") {
		return true;
	}
	return false;
}
this.getSBIP = function () {
	if (ozf_GetTempContent(ozController.getRefMain(), "IPFlag", false, "로그인").trim() == "1") {
		return true;
	}
	return false;
}
this.getPrintFlag = function () {
	if (ozf_GetTempContent(ozController.getRefMain(), "PrintFlag", false, "로그인") == "1") {
		return true;
	} else {
		return false;
	}
	return false;
}//End Region

//화면통제, 화면인스턴스, 화면권한체크
//Region "ScreenLoad"
var ScreenDstcd = 0;//화면유형구분
var bAuthority = 0;//권한부서구분

this.getMain = function () {
	//로그인 정보
	//convert : html에서 지원하지 않는 구문 입니다.
	//if (getLoginInfo) {
	ozController.ExitEvent = true;
	ozf_ClosePage(ozController.getRefMain(), ozController.Addr);
	return false;
}

//보안사용자 여부가 없는 경우
if ((((getBbrnFlag == false) && (getITFlag == false)) && (getHQFlag == false))) {
	ozf_MsgBoxEx('해당 화면의 사용권한이 없습니다.', 0, '기업CRM');
	ozController.ExitEvent = true;
	ozf_ClosePage(ozController.getRefMain(), ozController.Addr);
	return false;
}

//화면정보 : 서비스통제구분, 서비스통제내용, 메세지 타이틀, 화면유형구분, 권한부서구분
//convert : html에서 지원하지 않는 구문 입니다.
//if (getScreen) {
ozController.ExitEvent = true;
ozf_ClosePage(ozController.getRefMain(), ozController.Addr);
return false;
}

//영업점 : 부점변경불가, 버튼통제
if (getBbrnFlag) {
	//화면이 영업점 화면일 경우 버튼 통제 해제, 본부화면일 경우 화면통제(1-ALL, 5-영업점)
	if (((ScreenDstcd == 1) || (ScreenDstcd == 5))) {
		ozf_SetTempContent(ozController.getRefMain(), 'BranchAuthority', '0', '로그인'); //조회부점 변경 불가
		ozf_SetTempContent(ozController.getRefMain(), 'BranchSelect', '0', '로그인'); //조회부점 검색 가능
		ozf_SetTempContent(ozController.getRefMain(), 'btn_Authority', '0', '로그인'); //버튼 통제권한
	} else {
		ozf_MsgBoxEx('해당 화면의 사용권한이 없습니다.', 0, '로그인');
		ozController.ExitEvent = true;
		ozf_ClosePage(ozController.getRefMain(), ozController.Addr);
		return false;
	}
	//개발자 : 부점변경가능, 버튼가능, 출력권한
} else if (getITFlag) {
	ozf_SetTempContent(ozController.getRefMain(), 'BranchAuthority', '1', '로그인'); //조회부점 변경 가능
	ozf_SetTempContent(ozController.getRefMain(), 'BranchSelect', '1', '로그인'); //조회부점 검색 가능
	ozf_SetTempContent(ozController.getRefMain(), 'btn_Authority', '1', '로그인'); //버튼 미통제
	//본부여부
} else if (getHQFlag) {
	//지역본부 : 자기관할부점변경가능, 버튼통제
	if (getBranchHqFlag) {
		//화면이 영업점 화면일 경우
		if (((ScreenDstcd == 1) || (ScreenDstcd == 5))) {
			ozf_SetTempContent(ozController.getRefMain(), 'BranchAuthority', '0', '로그인'); //조회부점 변경 불가
			ozf_SetTempContent(ozController.getRefMain(), 'BranchSelect', '1', '로그인'); //조회부점 검색 가능
			ozf_SetTempContent(ozController.getRefMain(), 'btn_Authority', '0', '로그인'); //버튼 통제
		} else {
			ozf_MsgBoxEx('해당 화면의 사용권한이 없습니다.', 0, '로그인');
			ozController.ExitEvent = true;
			ozf_ClosePage(ozController.getRefMain(), ozController.Addr);
			return false;
		}
		//권한부서 : 부점변경가능, 버튼직원별 통제
	} else {
		//화면 버튼 권한 조회
		//convert : html에서 지원하지 않는 구문 입니다.
		//if (setScreenBtn) {
		ozController.ExitEvent = true;
		ozf_ClosePage(ozController.getRefMain(), ozController.Addr);
		return false;
	}
}
}

this.setScreen();

//화면인스턴스
//convert : html에서 지원하지 않는 구문 입니다.
//if (getIntance) {
ozController.ExitEvent = true;
ozf_ClosePage(ozController.getRefMain(), ozController.Addr);
return false;
}

//화면인스턴스 초기값
//convert : html에서 지원하지 않는 구문 입니다.
//if (getIntanceSelect) {
ozController.ExitEvent = true;
ozf_ClosePage(ozController.getRefMain(), ozController.Addr);
return false;
}

return true;
}
this.getScreen = function () {
	NewTmHandler = new oza_TMHandlerFrame(ozController);
	NewTmHandler.package = commonPackage;//패키지명
	NewTmHandler.classname = ClassName;//클래스명
	NewTmHandler.methodname = 'MFB72B01S0';//메서드명
	NewTmHandler.delimiter = Delimiter;//구분자
	NewTmHandler.tmtype = 1;//0:Element, 1:Collection
	NewTmHandler.addDataField('화면번호', screenName);
	NewTmHandler.addDataField('부점코드', getBranchNo);
	NewTmHandler.execute();

	if (NewTmHandler.isError()) {//서비스 에러
		if (((NewTmHandler.getErrorcode.trim().length > 0) || (NewTmHandler.errorDesc.trim().length > 0))) {
			ozf_MsgBoxEx('화면 조회중 에러 발생. 잠시후에 다시 사용해 주십시오.', 0, '화면정보');
		} else {
			ozf_MsgBoxEx('해당 화면이 존재하지 않습니다.', 0, '화면정보');
		}
	} else {//서비스 에러가 없을 경우
		ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
		if (ReportHandler == null) {//결과값이 없는 경우
			ozf_MsgBoxEx('해당 화면이 존재하지 않습니다.', 0, '화면정보');
		} else {
			//convert : html에서 지원하지 않는 구문 입니다.
			//var sValue=ReportHandler.CellDataByIndex(0, 1);
			if (sValue.trim() == "1") {//화면통제
				//convert : html에서 지원하지 않는 구문 입니다.
				//ozf_MsgBox(ReportHandler.CellDataByIndex(1, 1), 0, '화면정보'); 
			} else {
				if (sValue.trim() == "2") {//알림
					//convert : html에서 지원하지 않는 구문 입니다.
					//ozf_MsgBox(ReportHandler.CellDataByIndex(1, 1), 0, '화면정보'); 
				}
				//convert : html에서 지원하지 않는 구문 입니다.
				//MyFunctions.MessageTitle = ReportHandler.CellDataByIndex(2, 1);
				//convert : html에서 지원하지 않는 구문 입니다.
				//ozController.messageTitle = ReportHandler.CellDataByIndex(2, 1);
				//convert : html에서 지원하지 않는 구문 입니다.
				//ScreenDstcd = parseInt(ReportHandler.CellDataByIndex(3, 1));
				//convert : html에서 지원하지 않는 구문 입니다.
				//bAuthority = parseInt(ReportHandler.CellDataByIndex(4, 1));
				return false;
			}
		}
	}
	return true;
}
this.get잠재권한 = function () {
	NewTmHandler = new oza_TMHandlerFrame(ozController);
	NewTmHandler.package = commonPackage;//패키지명
	NewTmHandler.classname = ClassName;//클래스명
	NewTmHandler.methodname = 'MFB72B01S9';//메서드명
	NewTmHandler.delimiter = Delimiter;//구분자
	NewTmHandler.tmtype = 1;//0:Element, 1:Collection
	NewTmHandler.addDataField('직원번호', getEmployeeID);
	NewTmHandler.execute();

	if (NewTmHandler.isError()) {//서비스 에러
		ozf_MsgBoxEx('잠재 권한 에러.', 0, '잠재권한');
	} else {//서비스 에러가 없을 경우
		ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
		if (ReportHandler == null) {//결과값이 없는 경우
			ozf_MsgBoxEx('조회권한이없습니다(부점장,기업금융담당자만가능)' + "\n" + '소호담당자일경우 인사시스템에서 직무를 등록해주세요' + "\n" + '등록후 익일부터 조회가능합니다.', 0, '화면정보');
		} else {
			//convert : html에서 지원하지 않는 구문 입니다.
			//var nValue=ReportHandler.CellDataByIndex(0, 1);
			if ((nValue == 0)) {//화면통제
				ozf_MsgBoxEx('조회권한이없습니다(부점장,기업금융담당자만가능)' + "\n" + '소호담당자일경우 인사시스템에서 직무를 등록해주세요' + "\n" + '등록후 익일부터 조회가능합니다.', 0, '화면정보');
			} else {
				return false;
			}
		}
	}
	return true;
}
this.getIntance = function () {
	var ctlName = '', ctlCode = '', ctlValue = '', ctlName2 = '', ctl = null, ctlType = 0;
	var IntanceName = '', sValue1 = '', sValue2 = '', IntanceNames = null, ctlNames = null;
	NewTmHandler = new oza_TMHandlerFrame(ozController);

	NewTmHandler.package = commonPackage;//패키지명
	NewTmHandler.classname = ClassName;//클래스명
	NewTmHandler.methodname = 'MFB72B01S1';//메서드명
	NewTmHandler.delimiter = Delimiter;//구분자
	NewTmHandler.tmtype = 1;//0:Element, 1:Collection
	NewTmHandler.addDataField('조회조건', '1');
	NewTmHandler.addDataField('화면번호', screenName);
	NewTmHandler.execute();

	if (NewTmHandler.isError()) {
		if (((NewTmHandler.getErrorcode.trim().length > 0) || (NewTmHandler.errorDesc.trim().length > 0))) {
			ozf_MsgBoxEx('화면 인스턴스 오류[' + NewTmHandler.errorDesc.trim + ']' + "\n" + '잠시후에 다시 사용하여주십시오.', 0, '화면인스턴스');
			return true;
		}
	} else {//서비스 에러가 없을 경우
		ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
		if (ReportHandler != null) {//결과값이 없는 경우가 아니면
			//convert : html에서 지원하지 않는 구문 입니다.
			//for (var i = 1; i <= ReportHandler.RecordCount;  i += 1) {
			//convert : html에서 지원하지 않는 구문 입니다.
			//ctlName = ReportHandler.CellDataByIndex(0, i);//화면항목명
			//convert : html에서 지원하지 않는 구문 입니다.
			//ctlCode = ReportHandler.CellDataByIndex(1, i);//인스턴스코드
			//convert : html에서 지원하지 않는 구문 입니다.
			//ctlValue = ReportHandler.CellDataByIndex(2, i);//인스턴스내용
			//convert : html에서 지원하지 않는 구문 입니다.
			//IntanceName = ReportHandler.CellDataByIndex(3, i);//인스턴스명
			//convert : html에서 지원하지 않는 구문 입니다.
			//ctl = getControlByName(ctlName);
			//convert : html에서 지원하지 않는 구문 입니다.
			//ctlType = parseInt(getControlTypeByName(ctlName));
			switch (ctlType) {
				//convert : html에서 지원하지 않는 구문 입니다.
				//case ControlType.cbo :  //콤보박스
				if (ctlName2 != ctlName) {//현재콤보박스와 이전콤보박스가 다를 경우
					//convert : html에서 지원하지 않는 구문 입니다.
					//ctl.Init_Information; //콤보박스에 클리어
					//convert : html에서 지원하지 않는 구문 입니다.
					//if (ctl.Tag.AllAddValue) {//콤보박스에 전체가 선택되어 있을 경우
					ctl.addItem('<전체>', '%');
					ctl.setCode('%');
				}
				ctlName2 = ctlName;
			}

			//convert : html에서 지원하지 않는 구문 입니다.
			//ctl.AddItem(ctlValue.trim, ctlCode.trim); //콤보박스 Name2에 이름 값저장
			if (((IntanceName == "지원본부조회조건") || (IntanceName == "주거래고객명세_조회구분"))) {//인스턴스 명이 지원본부 조회조건일 경우
				if ((sValue1.indexOf(IntanceName) < 0)) {
					sValue1 = sValue1 + IntanceName + sDelimiter;
					sValue2 = sValue2 + ctlName + sDelimiter;
				}
			}
			break;
			Default  //lbl_ 등의 기준년월일을 위한 
			//convert : html에서 지원하지 않는 구문 입니다.
			//clearControlValue(ctlName); 
			//convert : html에서 지원하지 않는 구문 입니다.
			//setControlValueByName(ctlName, ctlValue.trim); 
break;
		}
	}

	if ((sValue1.length > 0)) {
		IntanceNames = sValue1.split(sDelimiter);
		ctlNames = sValue2.split(sDelimiter);
		for (var i = 0; i <= IntanceNames.length - 1; i += 1) {
			ctlName = ctlNames[i];
			IntanceName = IntanceNames[i];
			//convert : html에서 지원하지 않는 구문 입니다.
			//ctl = getControlByName(ctlName);
			if ((IntanceName == "주거래고객명세_조회구분")) {
				if ((getAuthority == false)) {//지원본부 여부가 여가 아닐 경우
					//convert : html에서 지원하지 않는 구문 입니다.
					//ctl.removeItemByCode('%'); 
					//convert : html에서 지원하지 않는 구문 입니다.
					//ctl.removeItemByCode('2'); 
					ctl.setEnabled(false);
					ctl.setCode('1');
				}
			} else if ((IntanceName == "지원본부조회조건")) {
				if ((getAuthority == false)) {//지원본부 여부가 여가 아닐 경우
					//convert : html에서 지원하지 않는 구문 입니다.
					//ctl.removeItemByCode('%'); 
					ctl.setEnabled(false);
				}

				if ((getBranchRM && (getAuthority == false))) {//RM점일경우
					//convert : html에서 지원하지 않는 구문 입니다.
					//ctl.removeItemByCode('2'); 
					ctl.setCode('1');
				} else if (((getBranchRM == false) && (getAuthority == false))) {//개인점일경우
					//convert : html에서 지원하지 않는 구문 입니다.
					//ctl.removeItemByCode('1'); 
					ctl.setCode('2');
				}
			}
		}
	}
}
}
return false;
}
this.getIntanceSelect = function () {
	var ctlName = '';
	var ctlCode = '';
	var ctlYn = '';
	var ctl = null;
	var ctlType = 0;
	NewTmHandler = new oza_TMHandlerFrame(ozController);

	NewTmHandler.package = commonPackage;//패키지명
	NewTmHandler.classname = ClassName;//클래스명
	NewTmHandler.methodname = 'MFB72B01S1';//메서드명
	NewTmHandler.delimiter = Delimiter;//구분자
	NewTmHandler.tmtype = 1;//0:Element, 1:Collection
	NewTmHandler.addDataField('조회조건', '2');
	NewTmHandler.addDataField('화면번호', screenName);
	NewTmHandler.execute();

	if (NewTmHandler.isError()) {
		if (((NewTmHandler.getErrorcode.trim().length > 0) || (NewTmHandler.errorDesc.trim().length > 0))) {
			ozf_MsgBoxEx('화면 인스턴스 오류[' + NewTmHandler.errorDesc.trim + ']' + "\n" + '잠시후에 다시 사용하여주십시오.', 0, '화면인스턴스초기값');
			return true;
		}
	} else {//서비스 에러가 없을 경우
		ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
		if (ReportHandler != null) {//결과값이 없는 경우가 아니면
			//convert : html에서 지원하지 않는 구문 입니다.
			//for (var i = 1; i <= ReportHandler.RecordCount;  i += 1) {
			//convert : html에서 지원하지 않는 구문 입니다.
			//ctlName = ReportHandler.CellDataByIndex(0, i);//화면항목명
			//convert : html에서 지원하지 않는 구문 입니다.
			//ctlCode = ReportHandler.CellDataByIndex(1, i);//인스턴스코드
			//convert : html에서 지원하지 않는 구문 입니다.
			//ctlYn = ReportHandler.CellDataByIndex(2, i);//초기값여부
			try {

				if ((ctlYn == null || (ctlYn == ""))) {
					ctlYn = '0';
				}
			}
			catch (e) {
				ctlYn = '0';
			}

			//convert : html에서 지원하지 않는 구문 입니다.
			//ctl = getControlByName(ctlName);
			//convert : html에서 지원하지 않는 구문 입니다.
			//ctlType = parseInt(getControlTypeByName(ctlName));
			switch (ctlType) {
				//convert : html에서 지원하지 않는 구문 입니다.
				//case ControlType.cbo :  //콤보박스
				if (ctlYn == "1") {
					//convert : html에서 지원하지 않는 구문 입니다.
					//ctl.setCode(ctlCode.trim);
				} else {
					ctl.setSelectedIndex(0);
				}
				break;
			}
		}
	}
}
return false;
}
this.setScreen = function () {
	var Ctl = null;
	var sName = '';
	Myfunctions.FrameInfo.SplashShowTime = 1;//Splash모드 쿼리시에만 적용
	//convert : html에서 지원하지 않는 구문 입니다.
	// = 'MFB';//프레임 태크
	for (var ieach = 0, Ctl; Ctl = Myfunctions.ColControls[ieach]; ieach++) {
		sName = ctl.Name;
		//convert : html에서 지원하지 않는 구문 입니다.
		//switch (sName.trim) { 
		case 'btn_엑셀' : case 'btn_출력' : case 'btn_인쇄' :  //출력 권한에 의한 통제
		ctl.setEnabled(getPrintFlag);
		break;
		case 'btn_검색' :  //부점변경 권한에 의한 통제
		ctl.setVisible(getBranchSelect);
		break;
		Default
if (((sName.trim().indexOf("파일보기") >= 0) || (sName.trim().indexOf("파일열기") >= 0))) {
			Myfunctions.FrameInfo.SplashShowTime = 0;//Splash모드 쿼리시에만 적용을 변경
		}
		break;
	}

	//convert : html에서 지원하지 않는 구문 입니다.
	//var nType=getControlTypeByName(sName);
	//convert : html에서 지원하지 않는 구문 입니다.
	//if (((nType == ControlType.mak) || (nType == ControlType.txt))) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//if ((sName.trim().EndsWith("부점") || sName.trim().EndsWith("관리점"))) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//setControlValueByName(sName, getBranchNo); //로그인 부점으로 세팅
	//convert : html에서 지원하지 않는 구문 입니다.
	//setControlEnabledByName(sName, getBranchAuthority); //권한적용
	//convert : html에서 지원하지 않는 구문 입니다.
	//} else if ((sName.trim().EndsWith("부점명") || sName.trim().EndsWith("관리점명"))) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//setControlValueByName(sName, getBranchName); //로그인부점명
	//convert : html에서 지원하지 않는 구문 입니다.
	//} else if ((sName.trim().EndsWith("직원번호") || sName.trim().EndsWith("직원"))) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//setControlValueByName(sName, getEmployeeID); //로그인직원
	//convert : html에서 지원하지 않는 구문 입니다.
	//setControlEnabledByName(sName, getBranchAuthority); //권한적용
	//convert : html에서 지원하지 않는 구문 입니다.
	//} else if ((sName.trim().EndsWith("직원번호명") || sName.trim().EndsWith("직원명"))) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//setControlValueByName(sName, getEmployeeName); //로그인직원명
}
}
}
}
this.setScreenBtn = function () {
	NewTmHandler = new oza_TMHandlerFrame(ozController);
	NewTmHandler.package = commonPackage;//패키지명
	NewTmHandler.classname = ClassName;//클래스명
	NewTmHandler.methodname = 'MFB72B01S2';//메서드명
	NewTmHandler.delimiter = Delimiter;//구분자
	NewTmHandler.tmtype = 1;//0:Element, 1:Collection
	NewTmHandler.addDataField('화면번호', screenName);
	NewTmHandler.addDataField('부점코드', getBranchNo);
	NewTmHandler.addDataField('직원번호', getEmployeeID);
	NewTmHandler.execute();

	if (NewTmHandler.isError()) {//서비스 에러
		if (((NewTmHandler.getErrorcode.trim().length > 0) || (NewTmHandler.errorDesc.trim().length > 0))) {
			ozf_MsgBoxEx('화면버튼권한오류[' + NewTmHandler.errorDesc.trim + ']' + "\n" + '잠시후에 다시 사용하여주십시오.', 0, '화면 버튼 권한 조회');
			return false;
		}
	} else {//서비스 에러가 없을 경우
		ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
		if (ReportHandler != null) {//결과값이 없는 경우
			var sValue1 = '';
			var sValue2 = '';
			var sValue3 = '';
			var Ctl = null;
			var bCheck = true;
			//convert : html에서 지원하지 않는 구문 입니다.
			//for (var i = 1; i <= ReportHandler.RecordCount;  i += 1) {
			//convert : html에서 지원하지 않는 구문 입니다.
			//sValue1 = ReportHandler.CellDataByIndex(0, i);//버튼분류
			//convert : html에서 지원하지 않는 구문 입니다.
			//sValue2 = ReportHandler.CellDataByIndex(1, i);//버튼명
			//convert : html에서 지원하지 않는 구문 입니다.
			//sValue3 = ReportHandler.CellDataByIndex(2, i);//버튼권한여부
			ctl = this.getControlByName(sValue2);
			if ((sValue1 == "1")) {//부점검색 권한
				ozf_SetTempContent(ozController.getRefMain(), 'BranchSelect', sValue3, '로그인'); //조회부점 검색
				ozf_SetTempContent(ozController.getRefMain(), 'BranchAuthority', sValue3, '로그인'); //조회부점 변경 가능
			} else {//기타버튼
				if ((sValue3 == "0")) {//버튼 권한이 없는 경우
					if (ctl != null) {
						ctl.setEnabled(false);
					}
					if (bCheck) {
						bCheck = false;
					}
				} else {
					if (ctl != null) {
						ctl.setEnabled(true);
					}
				}
			}
		}

		if (bCheck) {
			ozf_SetTempContent(ozController.getRefMain(), 'btn_Authority', '1', '로그인'); //버튼 미통제
		} else {
			ozf_SetTempContent(ozController.getRefMain(), 'btn_Authority', '0', '로그인'); //버튼 통제
		}
	}
}
return false;
}
this.OnLoad = function (controlname, strscreendstic) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	if (typeof (strscreendstic) === "undefined") strscreendstic = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.Frame_SetVariableValue('mVar_화면구분', strScreenDstic, ''); 
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.Frame_SetVariableValue('mVar_조회구분', '0', ''); 
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.Frame_ExecuteAction('Frame', 'OnLoad'); 
	return true;
}
this.getCust = function (controlname) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.Frame_ExecuteAction('mak_조회값', 'MaskFulled'); 


	if (Cust_Code) {
		return true;
	} else {
		return false;
	}
}
this.getCustName = function (controlname) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';


	if (Cust_Name) {
		return true;
	} else {
		return false;
	}
}
this.selectPotal = function (nindex) {
	//convert : Argument Initialize
	if (typeof (nindex) === "undefined") nindex = 0;
	var sAddress = null;
	var sTitle = null;
	switch ((nIndex + 1)) {
		case 1 :
			sTitle = '고객별월간일정';
			sAddress = ozf_AddressXML('/ManageBaseServer/Frames/MFB/02_고객포탈/MFB75201000/FrameExec');
			break;
		case 2 :
			sTitle = '기본정보';
			sAddress = ozf_AddressXML('/ManageBaseServer/Frames/MFB/02_고객포탈/MFB75202000/FrameExec');
			break;
		case 3 :
			sTitle = '계좌정보';
			sAddress = ozf_AddressXML('/ManageBaseServer/Frames/MFB/02_고객포탈/MFB72203000/FrameExec');
			break;
		case 4 :
			sTitle = '섭외정보등록';
			sAddress = ozf_AddressXML('/ManageBaseServer/Frames/MFB/02_고객포탈/MFB75204000/FrameExec');
			break;
		case 5 :
			sTitle = '최적상품';
			sAddress = ozf_AddressXML('/ManageBaseServer/Frames/MFB/02_고객포탈/MFB75205000/FrameExec');
			break;
		case 6 :
			sTitle = '수익정보';
			sAddress = ozf_AddressXML('/ManageBaseServer/Frames/MFB/02_고객포탈/MFB72206000/FrameExec');
			break;
		case 7 :
			sTitle = '기업고객분석보고서';
			sAddress = ozf_AddressXML('/ManageBaseServer/Frames/MFB/02_고객포탈/MFB72207000/FrameExec');
			break;
		case 8 :
			sTitle = '주거래고객정보';
			sAddress = ozf_AddressXML('/ManageBaseServer/Frames/MFB/02_고객포탈/MFB75208000/FrameExec');
			break;
	}
	MyFunctions.Execute_OpenPage;
}
this.movePotal = function (custcode, custname) {
	//convert : Argument Initialize
	if (typeof (custcode) === "undefined") custcode = '';
	if (typeof (custname) === "undefined") custname = '';
	try {

		custCode = custCode.replace(/-/g, '');
		if (((((custCode.trim().length > 0) && (custCode.trim().length <= 13))) && (custName.trim().length > 0))) {
			Cust_Code = custCode;
			Cust_Name = custName;
			//convert : html에서 지원하지 않는 구문 입니다.
			//selectPotal(1); 
		} else {
			ozf_MsgBoxEx('고객정보가 없습니다.', 0, '기본정보이동');
		}
	}
	catch (e) {
		ozf_MsgBoxEx('고객정보가 없습니다.', 0, '기본정보이동');
	}

}
this.moveACRMPotal = function (custcode) {
	//convert : Argument Initialize
	if (typeof (custcode) === "undefined") custcode = '';
	try {

		if (((custCode.trim().length > 10) && (custCode.trim().length <= 13))) {
			custCode = custCode.replace(/-/g, '');
			MyFunctions.SetTempContent_BySelector;
			MyFunctions.Execute_RequestEvent;
		} else {
			ozf_MsgBoxEx('고객정보가 없습니다.', 0, '개인포탈이동');
		}
	}
	catch (e) {
		ozf_MsgBoxEx('고객정보가 없습니다.', 0, '개인포탈이동');
	}

}
this.selectGCRM = function (inqurycndn, inqurycode, controlname) {
	//convert : Argument Initialize
	if (typeof (inqurycndn) === "undefined") inqurycndn = '';
	if (typeof (inqurycode) === "undefined") inqurycode = '';
	if (typeof (controlname) === "undefined") controlname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	var sValue = '';
	var sCONTENT = null;
	var sMAPINTER = null;
	var i = 0;
	var j = 0;
	sMAPINTER = MyFunctions.MessageTitle + '^' + InquryCndn + '^';
	//convert : html에서 지원하지 않는 구문 입니다.
	//sMAPINTER += ctl.ExportDelimiter + '^';
	if ((InquryCode.length == 13)) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//InquryCode = getCustBrnCode(InquryCode);
	}

	sMAPINTER += InquryCode + '^';

	for (var i = 0; i <= ctl.cols - 1; i += 1) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//sValue = ctl.fgObj.ColumnCollection(i).Caption;
		if (sValue == "개인법인고객고유번호") {
			//convert : html에서 지원하지 않는 구문 입니다.
			//sMAPINTER += ctl.ExportDelimiter + '^';
			for (var j = ctl.fixedRows; j <= ctl.rows - 1; j += 1) {
				//convert : html에서 지원하지 않는 구문 입니다.
				//sCONTENT += ctl.getCellData + ctl.ExportDelimiter;
			}
			break;
		}
		if (sValue == "주민사업자번호") {
			//convert : html에서 지원하지 않는 구문 입니다.
			//sMAPINTER += ctl.ExportDelimiter + '^';
			for (var j = ctl.fixedRows; j <= ctl.rows - 1; j += 1) {
				//convert : html에서 지원하지 않는 구문 입니다.
				//sCONTENT += ctl.getCellData + ctl.ExportDelimiter;
			}
			break;
		}
		if (sValue == "주민등록번호") {
			//convert : html에서 지원하지 않는 구문 입니다.
			//sMAPINTER += ctl.ExportDelimiter + '^';
			for (var j = ctl.fixedRows; j <= ctl.rows - 1; j += 1) {
				//convert : html에서 지원하지 않는 구문 입니다.
				//sCONTENT += ctl.getCellData + ctl.ExportDelimiter;
			}
			break;
		}
	}
	ozf_SetTempContent(ozController.getRefMain(), 'GKB_MFB_MAPINTERFACEXML', sMAPINTER, '');
	ozf_SetTempContent(ozController.getRefMain(), 'GKB_MFB_CONTENTXML', sCONTENT.replace(/-/g, ''), '');
	MyFunctions.Execute_OpenPage;
}
this.selectDM = function (controlname) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	if ((ControlName.length > 0)) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//var ctl=getControlByName(ControlName);
		var sMAPINTER = null;
		var sValue = '';
		var i = 0;
		var j = 0;
		var sCONTENT = null;

		for (var i = 0; i <= ctl.cols - 1; i += 1) {
			//convert : html에서 지원하지 않는 구문 입니다.
			//sValue = ctl.fgObj.ColumnCollection(i).Caption;
			if (sValue == "개인법인고객고유번호") {
				for (var j = ctl.fixedRows; j <= ctl.rows - 1; j += 1) {
					//convert : html에서 지원하지 않는 구문 입니다.
					//sCONTENT += ctl.getCellData + ctl.ExportDelimiter;
				}
				break;
			}
			if (sValue == "주민사업자번호") {
				for (var j = ctl.fixedRows; j <= ctl.rows - 1; j += 1) {
					//convert : html에서 지원하지 않는 구문 입니다.
					//sCONTENT += ctl.getCellData + ctl.ExportDelimiter;
				}
				break;
			}
			if (sValue == "주민등록번호") {
				for (var j = ctl.fixedRows; j <= ctl.rows - 1; j += 1) {
					//convert : html에서 지원하지 않는 구문 입니다.
					//sCONTENT += ctl.getCellData + ctl.ExportDelimiter;
				}
				break;
			}
		}

		//convert : html에서 지원하지 않는 구문 입니다.
		//MyFunctions.SetTempContent('GKB_MFB_DMDELIMITER', ctl.ExportDelimiter, 'DM'); 
		ozf_SetTempContent(ozController.getRefMain(), 'GKB_MFB_DMSENDLIST', sCONTENT.replace(/-/g, ''), 'DM');
		ozf_SetTempContent(ozController.getRefMain(), 'GKB_MFB_DMDSTIC', '2', 'DM');
		MyFunctions.Execute_OpenPage;
	} else {
		MyFunctions.Execute_RequestEvent;
	}
}
this.moveACRMDM = function (controlname) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	var sCONTENT = null;
	//convert : html에서 지원하지 않는 구문 입니다.
	//sCONTENT = ctl.ContentXML;
	MyFunctions.SetTempContent_BySelector;
	MyFunctions.SetTempContent_BySelector;
	//DM 발송 화면 호출
	MyFunctions.Execute_RequestEvent;
}
this.moveOpera = function (operaname, operaid) {
	//convert : Argument Initialize
	if (typeof (operaname) === "undefined") operaname = '';
	if (typeof (operaid) === "undefined") operaid = '';
	MyFunctions.Execute_RequestEvent; //오페라 화면 호출
}
this.OpenCustPopup = function (strscreendstic, strinqurycndn, strvalue) {
	//convert : Argument Initialize
	if (typeof (strscreendstic) === "undefined") strscreendstic = '';
	if (typeof (strinqurycndn) === "undefined") strinqurycndn = '';
	if (typeof (strvalue) === "undefined") strvalue = '';
	ozf_SetTempContent(ozController.getRefMain(), '화면구분', strScreenDstic, '공통');
	ozf_SetTempContent(ozController.getRefMain(), '조회조건', strInquryCndn, '공통');
	ozf_SetTempContent(ozController.getRefMain(), '조회값', strValue, '공통');
	var Address = ozf_AddressXML('/ManageBaseServer/Frames/MFB/00_공통/MFB72A02001/FrameExec');
	do_OpenModalFromXML(Address, '', 'OpenDialogReturn1');
}
//OpenCustPopup's OpenDialog CallBackFunction
function OpenCustPopup_DialogReturn() {
	return true;
}
this.getCustPopup = function (strscreendstic, controlcode, controlname) {
	//convert : Argument Initialize
	if (typeof (strscreendstic) === "undefined") strscreendstic = '';
	if (typeof (controlcode) === "undefined") controlcode = '';
	if (typeof (controlname) === "undefined") controlname = '';
	if (strScreenDstic == "0") {//공통인경우
		//convert : html에서 지원하지 않는 구문 입니다.
		//setControlValueByName(ControlCode, Cust_Code); 
		//convert : html에서 지원하지 않는 구문 입니다.
		//setControlValueByName(ControlName, Cust_Name); 
	} else if (strScreenDstic == "1") {//KB STAR인경우
		//convert : html에서 지원하지 않는 구문 입니다.
		//setControlValueByName(ControlCode, Cust_Saup_Code); 
		//convert : html에서 지원하지 않는 구문 입니다.
		//setControlValueByName(ControlName, Cust_Saup_Name); 
	}
}
this.CallHelp = function () {
	var Address = ozf_AddressXML('/ManageBaseServer/Frames/MFB/00_공통/MFB72A06001/FrameExec');
	ozf_SetTempContent(ozController.getRefMain(), '화면번호', screenName, '도움말');
	do_OpenModalFromXML(Address, '', 'OpenDialogReturn2');
}
//CallHelp's OpenDialog CallBackFunction
function CallHelp_DialogReturn() {
}
Object.defineProperty(this, 'Cust_Name', {
	get: function () {


		if (ozf_GetTempContent(ozController.getRefMain(), '고객명', false, '공통')) {
			return true;
		} else {
			return false;
		}
	},
	set: function (svalue) {
		//convert : Argument Initialize
		if (typeof (svalue) === "undefined") svalue = '';

		ozf_SetTempContent(ozController.getRefMain(), '고객명', sValue, '공통');
	}
});

Object.defineProperty(this, 'Cust_Code', {
	get: function () {


		if (ozf_GetTempContent(ozController.getRefMain(), '고객번호', false, '공통')) {
			return true;
		} else {
			return false;
		}
	},
	set: function (svalue) {
		//convert : Argument Initialize
		if (typeof (svalue) === "undefined") svalue = '';

		ozf_SetTempContent(ozController.getRefMain(), '고객번호', sValue, '공통');
	}
});

Object.defineProperty(this, 'Cust_Saup_Name', {
	get: function () {


		if (ozf_GetTempContent(ozController.getRefMain(), '사업자명', false, '공통')) {
			return true;
		} else {
			return false;
		}
	},
	set: function (svalue) {
		//convert : Argument Initialize
		if (typeof (svalue) === "undefined") svalue = '';

		ozf_SetTempContent(ozController.getRefMain(), '사업자명', sValue, '공통');
	}
});

Object.defineProperty(this, 'Cust_Saup_Code', {
	get: function () {


		if (ozf_GetTempContent(ozController.getRefMain(), '사업자번호', false, '공통')) {
			return true;
		} else {
			return false;
		}
	},
	set: function (svalue) {
		//convert : Argument Initialize
		if (typeof (svalue) === "undefined") svalue = '';

		ozf_SetTempContent(ozController.getRefMain(), '사업자번호', sValue, '공통');
	}
});
//End Region

//기업소호시스템 내부 사용 공통 코드
//Region "Code"
var Color_Default = "#CDC8DC";//일반
var Color_Focus = "#5F3B9B";//선택
var Color_Input = "#F8B91E";//필수
var Color_Disable = "#E1DED2";//입력불가
var Color_Error = "#FF435F";//에러
var Color_Edit = "#FFD366";//수정

this.getDateFormat = function (strdate, gubun) {
	//convert : Argument Initialize
	if (typeof (strdate) === "undefined") strdate = '';
	if (typeof (gubun) === "undefined") gubun = 0;
	if ((strDate != null && strDate.trim().length != 0)) {
		strDate = strDate.replace(/-/g, '');
		strDate = strDate.replace(/\//g, '');
		switch (Gubun) {
			case 1 :
				strDate = strDate.substr(0, 4) + strDate.substr(4, 2) + strDate.substr(6, 2);
				break;
			case 2 :
				strDate = strDate.substr(0, 4) + strDate.substr(4, 2);
				break;
			case 3 :
				strDate = strDate.substr(0, 4);
				break;
			case 4 :
				strDate = strDate.substr(0, 4) + '-' + strDate.substr(4, 2) + '-' + strDate.substr(6, 2);
				break;
			case 5 :
				strDate = strDate.substr(0, 4) + '-' + strDate.substr(4, 2);
				break;
			case 6 :
				strDate = strDate.substr(0, 4) + '년 ' + strDate.substr(4, 2) + '월 ' + strDate.substr(6, 2) + '일';
				break;
			case 7 :
				strDate = strDate.substr(0, 4) + '년 ' + strDate.substr(4, 2) + '월';
				break;
			case 8 :
				strDate = strDate.substr(0, 4) + '년';
				break;
				Default
strDate = strDate;
				break;
		}
	}
	return strDate;
}
this.getToday = function (gubun) {
	//convert : Argument Initialize
	if (typeof (gubun) === "undefined") gubun = 0;


	if (getDateFormat(ozf_left(ozController.ServerDate, 8), Gubun)) {
		return true;
	} else {
		return false;
	}
}
this.getSumToday = function (sumdate, gubun, ymgubun) {
	//convert : Argument Initialize
	if (typeof (sumdate) === "undefined") sumdate = 0;
	if (typeof (gubun) === "undefined") gubun = 0;
	if (typeof (ymgubun) === "undefined") ymgubun = 0;
	//convert : html에서 지원하지 않는 구문 입니다.
	//var sToday=getToday(4);
	if ((ymGubun == 1)) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//

		if (getDateFormat(ozf_DateAdd('yyyy', sumDate, ozf_CDate(sToday)), Gubun)) {
			return true;
		} else {
			return false;
		}
	} else if ((ymGubun == 2)) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//

		if (getDateFormat(ozf_DateAdd('m', sumDate, ozf_CDate(sToday)), Gubun)) {
			return true;
		} else {
			return false;
		}
	} else if ((ymGubun == 3)) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//

		if (getDateFormat(ozf_DateAdd('d', sumDate, ozf_CDate(sToday)), Gubun)) {
			return true;
		} else {
			return false;
		}
	}
	return null;
}
this.getSumDate = function (strdate, sumdate, gubun, ymgubun) {
	//convert : Argument Initialize
	if (typeof (strdate) === "undefined") strdate = '';
	if (typeof (sumdate) === "undefined") sumdate = 0;
	if (typeof (gubun) === "undefined") gubun = 0;
	if (typeof (ymgubun) === "undefined") ymgubun = 0;
	if ((ymGubun == 1)) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//

		if (getDateFormat(DateAdd('yyyy', sumDate, datevalue(getDateFormat(strDate, 4))), Gubun)) {
			return true;
		} else {
			return false;
		}
	} else if ((ymGubun == 2)) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//

		if (getDateFormat(DateAdd('m', sumDate, datevalue(getDateFormat(strDate, 4))), Gubun)) {
			return true;
		} else {
			return false;
		}
	} else if ((ymGubun == 3)) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//

		if (getDateFormat(DateAdd('d', sumDate, datevalue(getDateFormat(strDate, 4))), Gubun)) {
			return true;
		} else {
			return false;
		}
	}
	return null;
}
this.getMonValiCheck = function (fromdate, todate, gubun) {
	//convert : Argument Initialize
	if (typeof (fromdate) === "undefined") fromdate = '';
	if (typeof (todate) === "undefined") todate = '';
	if (typeof (gubun) === "undefined") gubun = 0;
	var nFrom = 0, nTo = 0, nSum = 0;
	nFrom = parseInt(fromDate);
	nTo = parseInt(toDate);
	nSum = parseInt(nTo - nFrom);
	if ((Gubun == 1)) {


		if (ozf_IIF((nSum <= 0), false, true)) {
			return true;
		} else {
			return false;
		}
	} else {


		if (ozf_IIF((nSum < 0), false, true)) {
			return true;
		} else {
			return false;
		}
	}
	return null;
}
this.getNumberOfDate = function (fromdate, todate, ymgubun) {
	//convert : Argument Initialize
	if (typeof (fromdate) === "undefined") fromdate = '';
	if (typeof (todate) === "undefined") todate = '';
	if (typeof (ymgubun) === "undefined") ymgubun = 0;
	if ((ymGubun == 1)) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//

		if (parseInt(DateDiff('yyyy', fromDate, toDate))) {
			return true;
		} else {
			return false;
		}
	} else if ((ymGubun == 2)) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//

		if (parseInt(DateDiff('m', fromDate, toDate))) {
			return true;
		} else {
			return false;
		}
	} else if ((ymGubun == 3)) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//

		if (parseInt(DateDiff('d', fromDate, toDate))) {
			return true;
		} else {
			return false;
		}
	}
	return null;
}
this.getNumberValiCheck = function (sfrom, sto, gubun) {
	//convert : Argument Initialize
	if (typeof (sfrom) === "undefined") sfrom = '';
	if (typeof (sto) === "undefined") sto = '';
	if (typeof (gubun) === "undefined") gubun = 0;
	var nFrom = null, nTo = null, nSum = null;
	nFrom = parseInt(sfrom);
	nTo = parseInt(sto);
	nSum = parseInt(nTo - nFrom);
	if ((Gubun == 1)) {


		if (ozf_IIF((nSum <= 0), false, true)) {
			return true;
		} else {
			return false;
		}
	} else if ((Gubun == 2)) {


		if (ozf_IIF((nSum < 0), false, true)) {
			return true;
		} else {
			return false;
		}
	}
	return null;
}
this.getSemian = function (strdate, gubun) {
	//convert : Argument Initialize
	if (typeof (strdate) === "undefined") strdate = '';
	if (typeof (gubun) === "undefined") gubun = 0;
	var Yr = 0, Mo = 0;
	Yr = parseInt(strDate.substr(0, 4));
	Mo = parseInt(strDate.substr(4, 2));
	if (((((((Mo == 1) || (Mo == 2)) || (Mo == 3)) || (Mo == 4)) || (Mo == 5)) || (Mo == 6))) {
		if ((Gubun == 1)) {
			Yr = parseInt(Yr - 1);


			if (Yr + '07') {
				return true;
			} else {
				return false;
			}
		} else if ((Gubun == 2)) {


			if (Yr + '.상') {
				return true;
			} else {
				return false;
			}
		}
	} else if (((((((Mo == 7) || (Mo == 8)) || (Mo == 9)) || (Mo == 10)) || (Mo == 11)) || (Mo == 12))) {
		if ((Gubun == 1)) {


			if (Yr + '01') {
				return true;
			} else {
				return false;
			}
		} else if ((Gubun == 2)) {


			if (Yr + '.하') {
				return true;
			} else {
				return false;
			}
		}
	}
	return null;
}
this.getControlByName = function (controlname) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	if (Myfunctions.ColControls.includes(ControlName)) {


		if (Myfunctions.ColControls) {
			return true;
		} else {
			return false;
		}
	} else {
		return null;
	}
}
this.getControlValueByName = function (controlname) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctlType=getControlTypeByName(ControlName);

	switch (ctlType) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//case ControlType.cbo : case ControlType.dtt : case ControlType.mak :  


		if (ctl.getValue()) {
			return true;
		} else {
			return false;
		}break;
		Default


if (ctl.getValue()) {
			return true;
		} else {
			return false;
		}break;
	}
	return null;
}
this.setControlValueByName = function (controlname, strvalue) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	if (typeof (strvalue) === "undefined") strvalue = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctlType=getControlTypeByName(ControlName);

	switch (ctlType) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//case ControlType.cbo :  
		ctl.setCode(strValue);
		break;
		//convert : html에서 지원하지 않는 구문 입니다.
		//case ControlType.dtt : case ControlType.dte :  
		ctl.setValue(strValue.replace(/-/g, ''));
		break;
		Default
ctl.setValue(strValue);
		break;
	}
}
this.getControlContentByName = function (controlname) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctlType=getControlTypeByName(ControlName);

	switch (ctlType) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//case ControlType.cbo :  


		if (ctl.getCode()) {
			return true;
		} else {
			return false;
		}break;
		Default


if (ctl.getValue()) {
			return true;
		} else {
			return false;
		}break;
	}
	return null;
}
this.setControlEnabledByName = function (controlname, enabled, colortype) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	if (typeof (enabled) === "undefined") enabled = false;
	if (typeof (colortype) === "undefined") colortype = 0;
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	ctl.setEnabled(enabled);
	if (enabled) {
		if ((ColorType == null)) {
			ctl.ctl.css("background-color", Color_Default);
			MyFunctions.Set_RecoverControlLookAndFeel;
		} else {
			//convert : html에서 지원하지 않는 구문 입니다.
			//ctl.ctl.css( "background-color",getColor(ColorType));
		}
	} else {
		ctl.ctl.css("background-color", Color_Disable);
	}
}
this.setControlVisibleByName = function (controlname, visible, colortype) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	if (typeof (visible) === "undefined") visible = false;
	if (typeof (colortype) === "undefined") colortype = 0;
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	ctl.setVisible(Visible);
	if (Visible) {
		if ((ColorType == null)) {
			ctl.ctl.css("background-color", Color_Default);
			MyFunctions.Set_RecoverControlLookAndFeel;
		} else {
			//convert : html에서 지원하지 않는 구문 입니다.
			//ctl.ctl.css( "background-color",getColor(ColorType));
		}
	} else {
		ctl.ctl.css("background-color", Color_Disable);
	}
}
this.setFocusByName = function (controlname) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	//convert : html에서 지원하지 않는 구문 입니다.
	//if (ctl.CanFocus) {
	myFunctions.focus;
	ctl.ctl.css("background-color", Color_Focus);
	MyFunctions.Set_RecoverControlLookAndFeel;
}
}
this.clearControlValue = function (controlname) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctlType=getControlTypeByName(ControlName);
	var ctl2 = null;

	switch (ctlType) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//case ControlType.pnl :  
		for (var ieach = 0, ctl2; ctl2 = ctl.Controls[ieach]; ieach++) {
			//convert : html에서 지원하지 않는 구문 입니다.
			//clearControl(ctl2); 
		}
		break;
		//convert : html에서 지원하지 않는 구문 입니다.
		//case ControlType.cbo :  
		ctl.setSelectedIndex(- 1);
		break;
		Default
MyFunctions.ClearControl;
		break;
	}
}
this.getControlEnabledByName = function (controlname) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//

	if (getControlByName(ControlName).getEnabled()) {
		return true;
	} else {
		return false;
	}
}
this.setAllColumnValue = function (controlname, col, value) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	if (typeof (col) === "undefined") col = 0;
	if (typeof (value) === "undefined") value = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	for (var i = ctl.fixedRows; i <= ctl.rows - 1; i += 1) {
		ctl.setCellData(i, Col, Value);
	}
}
this.setCallName = function (controlname, returnname) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	if (typeof (returnname) === "undefined") returnname = '';
	var sReturn = null;

	//convert : html에서 지원하지 않는 구문 입니다.
	//clearControlValue(returnName); //초기화

	//직원번호
	if ((ControlName.endsWith("직원번호") || ControlName.endsWith("직원"))) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//sReturn = getEmnm(getControlValueByName(ControlName));
		//부점코드 or 관리점 or 연계점
	} else if (((ControlName.endsWith("부점") || ControlName.endsWith("관리점")) || ControlName.endsWith("연계점"))) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//sReturn = getBrnName(getControlValueByName(ControlName));
		//개인법인고객고유번호
	} else if (ControlName.endsWith("개인법인고객고유번호")) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//sReturn = getCustnm('1', '1', getControlValueByName(ControlName));
		//대표사업자번호
	} else if (ControlName.endsWith("대표사업자번호")) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//sReturn = getCustnm('1', '2', getControlValueByName(ControlName));
		//사업자번호
	} else if (ControlName.endsWith("사업자번호")) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//sReturn = getCustnm('2', '2', getControlValueByName(ControlName));
		//주민번호
	} else if (ControlName.endsWith("주민번호")) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//sReturn = getCustnm('3', '3', getControlValueByName(ControlName));
		//관리번호
	} else if (ControlName.endsWith("관리번호")) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//sReturn = getCustnm('4', '4', getControlValueByName(ControlName));
		//뱅킹ID
	} else if (ControlName.endsWith("뱅킹ID")) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//sReturn = getCustnm('4', '5', getControlValueByName(ControlName));
	}

	if (sReturn == null) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//setControlValueByName(returnName, ''); 
		return false;
	} else {
		//convert : html에서 지원하지 않는 구문 입니다.
		//setControlValueByName(returnName, sReturn); 
		return true;
	}
}
this.setCallNameByCombobox = function (cbocontrolname, controlname, returnname) {
	//convert : Argument Initialize
	if (typeof (cbocontrolname) === "undefined") cbocontrolname = '';
	if (typeof (controlname) === "undefined") controlname = '';
	if (typeof (returnname) === "undefined") returnname = '';
	var sReturn = null;
	//convert : html에서 지원하지 않는 구문 입니다.
	//var sValue=getControlValueByName(cboControlName);

	//convert : html에서 지원하지 않는 구문 입니다.
	//clearControlValue(returnName); //초기화

	//직원번호
	//convert : html에서 지원하지 않는 구문 입니다.
	//if ((sValue.endsWith("직원번호") || sValue.endsWith("컨설턴트"))) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//sReturn = getEmnm(getControlValueByName(ControlName));
	//부점코드 or 관리점
	//convert : html에서 지원하지 않는 구문 입니다.
	//} else if (((sValue.endsWith("부점") || sValue.endsWith("관리점")) || sValue.endsWith("직원"))) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//sReturn = getBrnName(getControlValueByName(ControlName));
	//개인법인고객고유번호
	//convert : html에서 지원하지 않는 구문 입니다.
	//} else if (sValue.endsWith("개인법인고객고유번호")) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//sReturn = getCustnm('1', '1', getControlValueByName(ControlName));
	//법인등록번호
	//convert : html에서 지원하지 않는 구문 입니다.
	//} else if (sValue.endsWith("법인등록번호")) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//sReturn = getCustnm('1', '1', getControlValueByName(ControlName));
	//대표사업자번호
	//convert : html에서 지원하지 않는 구문 입니다.
	//} else if (sValue.endsWith("대표사업자번호")) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//sReturn = getCustnm('1', '2', getControlValueByName(ControlName));
	//사업자번호
	//convert : html에서 지원하지 않는 구문 입니다.
	//} else if (sValue.endsWith("사업자번호")) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//sReturn = getCustnm('2', '2', getControlValueByName(ControlName));
	//주민번호
	//convert : html에서 지원하지 않는 구문 입니다.
	//} else if (sValue.endsWith("주민번호")) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//sReturn = getCustnm('3', '3', getControlValueByName(ControlName));
	//관리번호
} else if (ControlName.endsWith("관리번호")) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//sReturn = getCustnm('4', '4', getControlValueByName(ControlName));
	//뱅킹ID
} else if (ControlName.endsWith("뱅킹ID")) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//sReturn = getCustnm('4', '5', getControlValueByName(ControlName));
}

if (sReturn == null) {
	return false;
} else {
	//convert : html에서 지원하지 않는 구문 입니다.
	//setControlValueByName(returnName, sReturn); 
	return true;
}
}
this.setCallNameByGrid = function (gubun, svalue) {
	//convert : Argument Initialize
	if (typeof (gubun) === "undefined") gubun = '';
	if (typeof (svalue) === "undefined") svalue = '';
	var sReturn = null;
	//부점
	if ((Gubun == "1")) {
		if ((sValue.length == 4)) {
			//convert : html에서 지원하지 않는 구문 입니다.
			//sReturn = getBrnName(sValue);
		}
		//직원
	} else if ((Gubun == "2")) {
		if ((sValue.length == 7)) {
			//convert : html에서 지원하지 않는 구문 입니다.
			//sReturn = getEmnm(sValue);
		}
	}
	return sReturn;
}
this.setSubtotal = function (controlname, nsetting, ngrouup, ncell, sformat, scaption) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	if (typeof (nsetting) === "undefined") nsetting = 0;
	if (typeof (ngrouup) === "undefined") ngrouup = 0;
	if (typeof (ncell) === "undefined") ncell = 0;
	if (typeof (sformat) === "undefined") sformat = '';
	if (typeof (scaption) === "undefined") scaption = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	var i = 0;
	var j = 0;

	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.fgObj.OutlineBar = 1;
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.fgObj.SubTotalPosition = 1;
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.SubTotal(nSetting, 1, nGrouup, nCell, sFormat, "#ADFF2F", "#000000", true, sCaption); 

	for (var i = ctl.fixedRows; i <= ctl.rows - 1; i += 1) {
		for (var j = 1; j <= ctl.cols - 1; j += 1) {
			//convert : html에서 지원하지 않는 구문 입니다.
			//if (ctl.fgObj.ColumnCollection(j).Visible) {
			if (ctl.getCellData == null) {
				ctl.setCellData;
				break;
			}
			break;
		}
	}
}

this.setColResizeByText(ControlName, nCell);
//convert : html에서 지원하지 않는 구문 입니다.
//ctl.Redraw_RowIndex; 
}
this.setSubtotal1 = function (controlname, nsetting, ngrouup, ncell, sformat, scaption) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	if (typeof (nsetting) === "undefined") nsetting = 0;
	if (typeof (ngrouup) === "undefined") ngrouup = 0;
	if (typeof (ncell) === "undefined") ncell = 0;
	if (typeof (sformat) === "undefined") sformat = '';
	if (typeof (scaption) === "undefined") scaption = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	var i = 0;
	var j = 0;

	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.fgObj.OutlineBar = 1;
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.fgObj.SubTotalPosition = 1;
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.SubTotal(nSetting, 2, nGrouup, nCell, sFormat, "#ADFF2F", "#000000", true, sCaption); 

	for (var i = ctl.fixedRows; i <= ctl.rows - 1; i += 1) {
		for (var j = 1; j <= ctl.cols - 1; j += 1) {
			//convert : html에서 지원하지 않는 구문 입니다.
			//if (ctl.fgObj.ColumnCollection(j).Visible) {
			if (ctl.getCellData == null) {
				ctl.setCellData;
				break;
			}
			break;
		}
	}
}

this.setColResizeByText(ControlName, nCell);
//convert : html에서 지원하지 않는 구문 입니다.
//ctl.Redraw_RowIndex; 
}
this.setGrandtotal = function (controlname, nsetting, ngrouup, ncell, sformat, scaption) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	if (typeof (nsetting) === "undefined") nsetting = 0;
	if (typeof (ngrouup) === "undefined") ngrouup = 0;
	if (typeof (ncell) === "undefined") ncell = 0;
	if (typeof (sformat) === "undefined") sformat = '';
	if (typeof (scaption) === "undefined") scaption = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	var i = 0;

	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.fgObj.OutlineBar = 1;
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.fgObj.SubTotalPosition = 1;
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.SubTotal(nSetting, 0, -1, nCell, sFormat, "#ADFF2F", "#000000", true, sCaption); 

	for (var i = 1; i <= ctl.cols - 1; i += 1) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//if (ctl.fgObj.ColumnCollection(i).Visible) {
		if (ctl.getCellData == null) {
			ctl.setCellData;
			break;
		}
		break;
	}
}

this.setColResizeByText(ControlName, nCell);
//convert : html에서 지원하지 않는 구문 입니다.
//ctl.Redraw_RowIndex; 
}
this.setColResizeByText = function (controlname, ncol) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	if (typeof (ncol) === "undefined") ncol = 0;
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	var sText = '';//각 셀의 내용
	var nRowCount = ctl.rows;//Row의 총 갯수
	var nMaxWidth = 0;//각 Text중 길이가 가장 긴 값
	var szfInfo = null;//MeasureString함수에서 리턴값(넓이, 높이)
	var i = 0;

	for (var i = 0; i <= nRowCount - 1; i += 1) {
		sText = ctl.getCellData;
		//convert : html에서 지원하지 않는 구문 입니다.
		//szfInfo = System.Drawing.Graphics.FromHwnd(ctl.Handle).MeasureString(sText, ctl.Font);
		if (nMaxWidth < parseInt(szfInfo.width())) {
			nMaxWidth = parseInt(szfInfo.width());
		}
	}

	var nWidth = nMaxWidth * 1.3;
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.fgObj.ColumnCollection(nCol).Width = nWidth;
}//End Region

//내부 사용 스크립트
//Region "Private"
//색깔구분
//convert : html에서 지원하지 않는 구문 입니다.
//
//색깔구분
//convert : html에서 지원하지 않는 구문 입니다.
//
this.screenName = function () {
	if (MyFunctions.FrameInfo.name == null) {
		return null;
	} else {


		if (MyFunctions.FrameInfo.name) {
			return true;
		} else {
			return false;
		}
	}
}
this.getColor = function (type) {
	//convert : Argument Initialize
	if (typeof (type) === "undefined") type = 0;
	//convert : html에서 지원하지 않는 구문 입니다.
	//if ((Type == ColorType.Default_color)) {
	return Color_Default;//convert : html에서 지원하지 않는 구문 입니다.
	//} else if ((Type == ColorType.Disable_color)) {
	return Color_Disable;//convert : html에서 지원하지 않는 구문 입니다.
	//} else if ((Type == ColorType.Error_color)) {
	return Color_Error;//convert : html에서 지원하지 않는 구문 입니다.
	//} else if ((Type == ColorType.Focus_color)) {
	return Color_Focus;//convert : html에서 지원하지 않는 구문 입니다.
	//} else if ((Type == ColorType.Input_color)) {
	return Color_Input;
}
}
this.getControlType = function (control) {
	//convert : Argument Initialize
	if (typeof (control) === "undefined") control = null;
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctlType=Control.GetType.Name;

	if (ctlType == "obzenmask") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.mak
	} else if (ctlType == "obzenTextArea") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.txa
	} else if (ctlType == "obzenComboBox") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.cbo
	} else if (ctlType == "obzenButton") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.btn
	} else if (ctlType == "obzenCheckBox") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.chk
	} else if (ctlType == "obzenDate") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.dte
	} else if (ctlType == "obzenDateTime") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.dtt
	} else if (ctlType == "obzenGrid") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.grd
	} else if (ctlType == "ObzenEditableGrid") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.grd
	} else if (ctlType == "obzenLabel") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.lbl
	} else if (ctlType == "obzenPanel") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.pnl
	} else if (ctlType == "obzenRadioGroup") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.rdo
	} else if (ctlType == "obzenTabControl") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.tab
	} else if (ctlType == "obzenTextBox") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.txt
	} else if (ctlType == "obzenTitleLabel") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.lbl
	} else if (ctlType == "obzenControlContainer") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.pnl
	} else if (ctlType == "obzenExpandPanel") {
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getControlType = ControlType.pnl
	}

	return ret_getControlType;
}
this.getControlTypeByName = function (controlname) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//

	if (getControlType(getControlByName(ControlName))) {
		return true;
	} else {
		return false;
	}
}
this.clearControl = function (control) {
	//convert : Argument Initialize
	if (typeof (control) === "undefined") control = null;
	var ctl = Control;
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctlType=getControlType(Control);

	switch (ctlType) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//case ControlType.cbo :  
		ctl.setSelectedIndex(- 1);
		break;
		Default
MyFunctions.ClearControl;
		break;
	}
}
var commonPackage = 'com.kbstar.mfb.common';
var actionPackage = 'com.kbstar.mfb.action';
var ClassName = 'COL_MFB72B01000';
var Delimiter = '$%^';
var ReportHandler = null;
var NewTmHandler = null;
var i = 0;

this.getCustBrnCode = function (strcust) {
	//convert : Argument Initialize
	if (typeof (strcust) === "undefined") strcust = '';
	NewTmHandler = new oza_TMHandlerFrame(ozController);
	NewTmHandler.package = actionPackage;//패키지명
	NewTmHandler.classname = 'COL_MFB72A02001';//클래스명
	NewTmHandler.methodname = 'MFB72A02S9';//메서드명
	NewTmHandler.delimiter = Delimiter;//구분자
	NewTmHandler.tmtype = 1;//0:Element, 1:Collection
	NewTmHandler.addDataField('조회조건', '1');
	NewTmHandler.addDataField('조회값', strCust);
	NewTmHandler.execute(); //서비스 호출

	if (!((NewTmHandler.isError()))) {//서비스 에러가 없을 경우
		ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
		//convert : html에서 지원하지 않는 구문 입니다.
		//ret_getCustBrnCode = ReportHandler.CellDataByIndex(5, 1)
		//convert : html에서 지원하지 않는 구문 입니다.
		//

		if (getCustBrnCode.trim) {
			return true;
		} else {
			return false;
		}
	}

	return null;

	return ret_getCustBrnCode;
}
this.getCustnm = function (strinqurydstic, strinqurycndn, strcust) {
	//convert : Argument Initialize
	if (typeof (strinqurydstic) === "undefined") strinqurydstic = '';
	if (typeof (strinqurycndn) === "undefined") strinqurycndn = '';
	if (typeof (strcust) === "undefined") strcust = '';
	NewTmHandler = new oza_TMHandlerFrame(ozController);
	NewTmHandler.package = commonPackage;//패키지명
	NewTmHandler.classname = ClassName;//클래스명
	NewTmHandler.methodname = 'MFB72B01S8';//메서드명
	NewTmHandler.delimiter = Delimiter;//구분자
	NewTmHandler.tmtype = 1;//0:Element, 1:Collection
	NewTmHandler.addDataField('조회구분', strInquryDstic);
	NewTmHandler.addDataField('조회조건', strInquryCndn);
	NewTmHandler.addDataField('조회값', strCust);
	NewTmHandler.execute();

	if (NewTmHandler.isError()) {
		if (((NewTmHandler.getErrorcode.trim().length <= 0) && (NewTmHandler.errorDesc.trim().length <= 0))) {
			ozf_MsgBoxEx('해당 고객이 존재하지 않습니다.', 0, '고객명 조회');
		} else {
			ozf_MsgBoxEx('고객 조회중 에러 발생. 잠시후에 다시 사용해 주십시오.', 0, '고객명 조회');
		}
		instance.cust_code = '';
		instance.cust_name = '';
		return null;
	} else {//서비스 에러가 없을 경우
		ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
		if (ReportHandler == null) {
			ozf_MsgBoxEx('해당 고객이 존재하지 않습니다.', 0, '고객명 조회');
			instance.cust_code = '';
			instance.cust_name = '';
			return null;
		} else {
			ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
			//convert : html에서 지원하지 않는 구문 입니다.
			//ret_getCustnm = ReportHandler.CellDataByIndex(0, 1)

			if ((strInquryCndn == "1" && (getCustnm.trim().length > 0))) {
				instance.cust_code = strCust;
				instance.cust_name = getCustnm;
			} else if ((strInquryCndn == "2" && (getCustnm.trim().length > 0))) {
				instance.cust_saup_code = strCust;
				instance.cust_saup_name = getCustnm;
			}

			//convert : html에서 지원하지 않는 구문 입니다.
			//

			if (getCustnm.trim) {
				return true;
			} else {
				return false;
			}
		}
	}

	return null;

	return ret_getCustnm;
}
this.getBrnName = function (strbrnl) {
	//convert : Argument Initialize
	if (typeof (strbrnl) === "undefined") strbrnl = '';
	if ((strBrnl.trim().length == 4)) {
		NewTmHandler = new oza_TMHandlerFrame(ozController);
		NewTmHandler.package = actionPackage;//패키지명
		NewTmHandler.classname = 'COL_MFB72A05001';//클래스명
		NewTmHandler.methodname = 'MFB72A05S0';//메서드명
		NewTmHandler.delimiter = Delimiter;//구분자
		NewTmHandler.tmtype = 1;//0:Element, 1:Collection
		NewTmHandler.addDataField('조회조건', '1'); //INPUT
		NewTmHandler.addDataField('조회값', strBrnl); //INPUT
		NewTmHandler.execute(); //서비스 호출

		if (NewTmHandler.isError()) {
			//convert : html에서 지원하지 않는 구문 입니다.
			//ozf_MsgBox('부실점명 조회 에러', 0, screenName); 
			ozController.ExitEvent = true;
			return null;
		} else {//서비스 에러가 없을 경우
			ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
			if (ReportHandler == null) {
				//convert : html에서 지원하지 않는 구문 입니다.
				//ozf_MsgBox('해당 부실점이 없습니다', 0, screenName); 
				ozController.ExitEvent = true;
				return null;
			}

			//convert : html에서 지원하지 않는 구문 입니다.
			//ret_getBrnName = ReportHandler.CellDataByIndex(1, 1)
			//convert : html에서 지원하지 않는 구문 입니다.
			//

			if (getBrnName.trim) {
				return true;
			} else {
				return false;
			}
		}
	}
	return null;

	return ret_getBrnName;
}
this.getEmnm = function (strempid) {
	//convert : Argument Initialize
	if (typeof (strempid) === "undefined") strempid = '';
	if ((strEmpid.trim().length == 7)) {
		NewTmHandler = new oza_TMHandlerFrame(ozController);
		NewTmHandler.package = commonPackage;//패키지명
		NewTmHandler.classname = ClassName;//클래스명
		NewTmHandler.methodname = 'MFB72B01S4';//메서드명
		NewTmHandler.delimiter = Delimiter;//구분자
		NewTmHandler.tmtype = 1;//0:Element, 1:Collection
		NewTmHandler.addDataField('직원번호', strEmpid); //INPUT
		NewTmHandler.execute(); //서비스 호출

		if (NewTmHandler.isError()) {
			//convert : html에서 지원하지 않는 구문 입니다.
			//ozf_MsgBox('직원명 조회 에러', 0, screenName); 
		} else {//서비스 에러가 없을 경우
			ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
			//convert : html에서 지원하지 않는 구문 입니다.
			//ret_getEmnm = ReportHandler.CellDataByIndex(1, 1)
			//convert : html에서 지원하지 않는 구문 입니다.
			//

			if (getEmnm.trim) {
				return true;
			} else {
				return false;
			}
		}
	}
	return null;

	return ret_getEmnm;
}
this.getEmnmList = function (strbrnl, returnname) {
	//convert : Argument Initialize
	if (typeof (strbrnl) === "undefined") strbrnl = '';
	if (typeof (returnname) === "undefined") returnname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(returnName);
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.Init_Information; 
	NewTmHandler = new oza_TMHandlerFrame(ozController);
	NewTmHandler.package = commonPackage;//패키지명
	NewTmHandler.classname = ClassName;//클래스명
	NewTmHandler.methodname = 'MFB72B01S4';//메서드명
	NewTmHandler.delimiter = Delimiter;//구분자
	NewTmHandler.tmtype = 1;//0:Element, 1:Collection
	NewTmHandler.addDataField('부점코드', strBrnl); //INPUT
	NewTmHandler.execute(); //서비스 호출

	if (!((NewTmHandler.isError()))) {//서비스 에러가 없을 경우
		ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
		var cboCode = '', cboValue = '';//콤보박스 사용 변수

		ctl.addItem('<전체>', '%');
		//convert : html에서 지원하지 않는 구문 입니다.
		//for (var i = 1; i <= ReportHandler.RecordCount;  i += 1) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//cboCode = ReportHandler.CellDataByIndex(0, i);
		//convert : html에서 지원하지 않는 구문 입니다.
		//cboValue = ReportHandler.CellDataByIndex(1, i);
		//convert : html에서 지원하지 않는 구문 입니다.
		//ctl.AddItem('[' + cboCode.trim + '] ' + cboValue.trim, cboCode.trim); 
	}
	ctl.setSelectedIndex(0);
	return true;
}
return false;
}
this.getEmnmList2 = function (strbrnl, returnname) {
	//convert : Argument Initialize
	if (typeof (strbrnl) === "undefined") strbrnl = '';
	if (typeof (returnname) === "undefined") returnname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(returnName);
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.Init_Information; 
	NewTmHandler = new oza_TMHandlerFrame(ozController);
	NewTmHandler.package = commonPackage;//패키지명
	NewTmHandler.classname = ClassName;//클래스명
	NewTmHandler.methodname = 'MFB72B01S4';//메서드명
	NewTmHandler.delimiter = Delimiter;//구분자
	NewTmHandler.tmtype = 1;//0:Element, 1:Collection
	NewTmHandler.addDataField('관리부점코드', strBrnl); //INPUT
	NewTmHandler.execute(); //서비스 호출

	if (!((NewTmHandler.isError()))) {//서비스 에러가 없을 경우
		ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
		var cboCode = '', cboValue = '';//콤보박스 사용 변수

		//convert : html에서 지원하지 않는 구문 입니다.
		//for (var i = 1; i <= ReportHandler.RecordCount;  i += 1) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//cboCode = ReportHandler.CellDataByIndex(0, i);
		//convert : html에서 지원하지 않는 구문 입니다.
		//cboValue = ReportHandler.CellDataByIndex(1, i);
		//convert : html에서 지원하지 않는 구문 입니다.
		//ctl.AddItem('[' + cboCode.trim + '] ' + cboValue.trim, cboCode.trim); 
	}
	ctl.setSelectedIndex(0);
	return true;
}
return false;
}
this.getPost = function (postgbn, strvalue, returnname) {
	//convert : Argument Initialize
	if (typeof (postgbn) === "undefined") postgbn = '';
	if (typeof (strvalue) === "undefined") strvalue = '';
	if (typeof (returnname) === "undefined") returnname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(returnName);
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.Init_Information; 
	NewTmHandler = new oza_TMHandlerFrame(ozController);
	NewTmHandler.package = actionPackage;//패키지명
	NewTmHandler.classname = 'COL_MFB72A01001';//클래스명
	NewTmHandler.methodname = 'MFB72A01S0';//메서드명
	NewTmHandler.delimiter = Delimiter;//구분자
	NewTmHandler.tmtype = 1;//0:Element, 1:Collection
	NewTmHandler.addDataField('조회조건', PostGbn); //INPUT
	NewTmHandler.addDataField('조회값', strValue); //INPUT
	NewTmHandler.execute(); //서비스 호출

	if (!((NewTmHandler.isError()))) {//서비스 에러가 없을 경우
		ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
		var cboCode = '', cboValue = '';//콤보박스 사용 변수
		var i = 0;

		//convert : html에서 지원하지 않는 구문 입니다.
		//for (var i = 1; i <= ReportHandler.RecordCount;  i += 1) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//cboCode = ReportHandler.CellDataByIndex(0, i);
		//convert : html에서 지원하지 않는 구문 입니다.
		//cboValue = ReportHandler.CellDataByIndex(1, i);
		//convert : html에서 지원하지 않는 구문 입니다.
		//ctl.AddItem(cboValue.trim, cboCode.trim); 
	}
	ctl.setSelectedIndex(0);
	return true;
}
return false;
}
this.getSBErrorCode = function (errorgbn, strvalue, returnname) {
	//convert : Argument Initialize
	if (typeof (errorgbn) === "undefined") errorgbn = '';
	if (typeof (strvalue) === "undefined") strvalue = '';
	if (typeof (returnname) === "undefined") returnname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(returnName);
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.Init_Information; 
	NewTmHandler = new oza_TMHandlerFrame(ozController);
	NewTmHandler.package = commonPackage;//패키지명
	NewTmHandler.classname = ClassName;//클래스명
	NewTmHandler.methodname = 'MFB72B01S3';//메서드명
	NewTmHandler.delimiter = Delimiter;//구분자
	NewTmHandler.tmtype = 1;//0:Element, 1:Collection

	if (errorGbn == "1") {
		NewTmHandler.addDataField('인스턴스명', '장애대분류구분코드'); //INPUT
	} else if (errorGbn == "2") {
		NewTmHandler.addDataField('인스턴스명', '장애중분류구분코드'); //INPUT
	} else if (errorGbn == "3") {
		NewTmHandler.addDataField('인스턴스명', '장애소분류구분코드'); //INPUT
	}

	NewTmHandler.addDataField('조회조건', errorGbn); //INPUT
	NewTmHandler.addDataField('조회값', strValue); //INPUT
	NewTmHandler.execute(); //서비스 호출

	if (!((NewTmHandler.isError()))) {//서비스 에러가 없을 경우
		ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
		var cboCode = '', cboValue = '';//콤보박스 사용 변수
		var i = 0;

		//convert : html에서 지원하지 않는 구문 입니다.
		//for (var i = 1; i <= ReportHandler.RecordCount;  i += 1) {
		//convert : html에서 지원하지 않는 구문 입니다.
		//cboCode = ReportHandler.CellDataByIndex(0, i);
		//convert : html에서 지원하지 않는 구문 입니다.
		//cboValue = ReportHandler.CellDataByIndex(1, i);
		//convert : html에서 지원하지 않는 구문 입니다.
		//ctl.AddItem('[' + cboCode.trim + '] ' + cboValue.trim, cboCode.trim); 
	}
	ctl.setSelectedIndex(0);
	return true;
}
return false;
}
this.getSBMdiaCode = function (strgbn, strvalue, returnname) {
	//convert : Argument Initialize
	if (typeof (strgbn) === "undefined") strgbn = '';
	if (typeof (strvalue) === "undefined") strvalue = '';
	if (typeof (returnname) === "undefined") returnname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(returnName);
	var cboCode = '', cboValue = '';//콤보박스 사용 변수
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.Init_Information; 
	NewTmHandler = new oza_TMHandlerFrame(ozController);
	NewTmHandler.package = commonPackage;//패키지명
	NewTmHandler.classname = ClassName;//클래스명
	NewTmHandler.methodname = 'MFB72B01S3';//메서드명
	NewTmHandler.delimiter = Delimiter;//구분자
	NewTmHandler.tmtype = 1;//0:Element, 1:Collection
	if (strGbn == "1") {
		NewTmHandler.addDataField('인스턴스명', '사이버브랜치매체구분코드'); //INPUT
	} else if (strGbn == "2") {
		NewTmHandler.addDataField('인스턴스명', '종합CMS상품구분코드'); //INPUT
	}
	NewTmHandler.addDataField('조회조건', strGbn); //INPUT
	NewTmHandler.addDataField('조회값', strValue); //INPUT
	NewTmHandler.execute(); //서비스 호출

	if (!((NewTmHandler.isError()))) {//서비스 에러가 없을 경우
		ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
		var i = 0;

		//convert : html에서 지원하지 않는 구문 입니다.
		//if (ctl.Tag.AllAddValue) {
		ctl.addItem('<전체>', '%');
		//convert : html에서 지원하지 않는 구문 입니다.
		//getControlByName(returnName).setCode('%');
	}

	//convert : html에서 지원하지 않는 구문 입니다.
	//for (var i = 1; i <= ReportHandler.RecordCount;  i += 1) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//cboCode = ReportHandler.CellDataByIndex(0, i);
	//convert : html에서 지원하지 않는 구문 입니다.
	//cboValue = ReportHandler.CellDataByIndex(1, i);
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.AddItem('[' + cboCode.trim + '] ' + cboValue.trim, cboCode.trim); 
}
if ((ctl.getSelectedIndex() < 0)) {
	ctl.setSelectedIndex(0);
}
return true;
}
return false;
}
this.getIntanceCode = function (intancegbn, intancename, strvalue, returnname) {
	//convert : Argument Initialize
	if (typeof (intancegbn) === "undefined") intancegbn = '';
	if (typeof (intancename) === "undefined") intancename = '';
	if (typeof (strvalue) === "undefined") strvalue = '';
	if (typeof (returnname) === "undefined") returnname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(returnName);
	var cboCode = '', cboValue = '';//콤보박스 사용 변수
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.Init_Information; 
	NewTmHandler = new oza_TMHandlerFrame(ozController);
	NewTmHandler.package = commonPackage;//패키지명
	NewTmHandler.classname = ClassName;//클래스명
	NewTmHandler.methodname = 'MFB72B01S3';//메서드명
	NewTmHandler.delimiter = Delimiter;//구분자
	NewTmHandler.tmtype = 1;//0:Element, 1:Collection
	NewTmHandler.addDataField('조회조건', IntanceGbn); //INPUT
	NewTmHandler.addDataField('조회값', strValue); //INPUT
	NewTmHandler.addDataField('인스턴스명', IntanceName); //INPUT

	NewTmHandler.execute(); //서비스 호출

	if ((NewTmHandler.isError() == false)) {//서비스 에러가 없을 경우
		ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동

		//convert : html에서 지원하지 않는 구문 입니다.
		//if (ctl.Tag.AllAddValue) {
		ctl.addItem('<전체>', '%');
		//convert : html에서 지원하지 않는 구문 입니다.
		//getControlByName(returnName).setCode('%');
	}

	//convert : html에서 지원하지 않는 구문 입니다.
	//for (var i = 1; i <= ReportHandler.RecordCount;  i += 1) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//cboCode = ReportHandler.CellDataByIndex(0, i);
	//convert : html에서 지원하지 않는 구문 입니다.
	//cboValue = ReportHandler.CellDataByIndex(1, i);
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.AddItem(cboValue.trim, cboCode.trim); 
}
ctl.setSelectedIndex(0);
return true;
}
return false;
}
this.getHQBrncdCode = function (strgbn, strvalue, returnname) {
	//convert : Argument Initialize
	if (typeof (strgbn) === "undefined") strgbn = '';
	if (typeof (strvalue) === "undefined") strvalue = '';
	if (typeof (returnname) === "undefined") returnname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(returnName);
	var sValue = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//ctl.Init_Information; 
	NewTmHandler = new oza_TMHandlerFrame(ozController);

	if (strGbn == "1") {//지원본부
		NewTmHandler.package = commonPackage;//패키지명
		NewTmHandler.classname = ClassName;//클래스명
		NewTmHandler.methodname = 'MFB72B01S3';//메서드명
		NewTmHandler.delimiter = Delimiter;//구분자
		NewTmHandler.tmtype = 1;//0:Element, 1:Collection
		if (strValue == "1") {
			sValue = '기업지원본부';
		} else if (strValue == "2") {
			sValue = '개인지원본부';
		}
		NewTmHandler.addDataField('조회조건', '1'); //INPUT
		NewTmHandler.addDataField('인스턴스명', sValue); //INPUT
	} else if (strGbn == "2") {//부실점
		NewTmHandler.package = actionPackage;//패키지명
		NewTmHandler.classname = 'COL_MFB72A05001';//클래스명
		NewTmHandler.methodname = 'MFB72A05S0';//메서드명
		NewTmHandler.delimiter = Delimiter;//구분자
		NewTmHandler.tmtype = 1;//0:Element, 1:Collection
		NewTmHandler.addDataField('조회조건', '3'); //INPUT
		NewTmHandler.addDataField('조회값', strValue); //INPUT
	}
	NewTmHandler.execute(); //서비스 호출
	//convert : html에서 지원하지 않는 구문 입니다.
	//if (ctl.Tag.AllAddValue) {
	ctl.addItem('<전체>', '%');
	//convert : html에서 지원하지 않는 구문 입니다.
	//getControlByName(returnName).setCode('%');
}

if ((NewTmHandler.isError() == false)) {//서비스 에러가 없을 경우
	ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
	var cboCode = '', cboValue = '';//콤보박스 사용 변수
	var i = 0;

	//convert : html에서 지원하지 않는 구문 입니다.
	//for (var i = 1; i <= ReportHandler.RecordCount;  i += 1) {
	//convert : html에서 지원하지 않는 구문 입니다.
	//cboCode = ReportHandler.CellDataByIndex(0, i);
	//convert : html에서 지원하지 않는 구문 입니다.
	//cboValue = ReportHandler.CellDataByIndex(1, i);
	if (strGbn == "1") {//지원본부
		//convert : html에서 지원하지 않는 구문 입니다.
		//ctl.AddItem(cboValue.trim, cboCode.trim); 
	} else if (strGbn == "2") {//부실점
		//convert : html에서 지원하지 않는 구문 입니다.
		//ctl.AddItem('[' + cboCode.trim + '] ' + cboValue.trim, cboCode.trim); 
	}
}

if (strGbn == "1") {//지원본부
	ctl.setCode(getBranchHqCode);
	if ((getBranchHqFlag || getAuthority)) {
		ctl.setEnabled(true);
	} else {
		ctl.setEnabled(false);
	}
} else if (strGbn == "2") {//부실점
	ctl.setCode(getBranchNo);
	if ((getBranchHqFlag || getAuthority)) {
		ctl.setEnabled(true);
	} else {
		ctl.setEnabled(false);
	}
}

if ((ctl.getSelectedIndex() < 0)) {
	ctl.setSelectedIndex(0);
}
return true;
}
return false;
}
this.getBrnTel = function (controlname, returnname) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	if (typeof (returnname) === "undefined") returnname = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	var strBrnl = this.getControlValueByName(ControlName);

	if ((strBrnl.trim().length == 4)) {
		NewTmHandler = new oza_TMHandlerFrame(ozController);
		NewTmHandler.package = actionPackage;//패키지명
		NewTmHandler.classname = 'COL_MFB72A05001';//클래스명
		NewTmHandler.methodname = 'MFB72A05S0';//메서드명
		NewTmHandler.delimiter = Delimiter;//구분자
		NewTmHandler.tmtype = 1;//0:Element, 1:Collection
		NewTmHandler.addDataField('조회조건', '1'); //INPUT
		NewTmHandler.addDataField('조회값', strBrnl); //INPUT
		NewTmHandler.execute(); //서비스 호출

		if (NewTmHandler.isError()) {
			ozf_MsgBoxEx('부실점명 조회 에러', 0, MyFunctions.MessageTitle);
			ozController.ExitEvent = true;
			return false;
		} else {//서비스 에러가 없을 경우
			ReportHandler = NewTmHandler.Get_CollectionParser;//결과값을 ReportHandler로 이동
			if (ReportHandler == null) {
				ozf_MsgBoxEx('해당 부실점이 없습니다', 0, MyFunctions.MessageTitle);
				ozController.ExitEvent = true;
				return false;
			}

			//convert : html에서 지원하지 않는 구문 입니다.
			//setControlValueByName(returnName, ReportHandler.CellDataByIndex(1, 1)); 
			var sValue = '';
			//convert : html에서 지원하지 않는 구문 입니다.
			//sValue = '전용전화번호 :' + ReportHandler.CellDataByIndex(6, 1) + ' 대표전화번호 : ' + ReportHandler.CellDataByIndex(7, 1);
			//convert : html에서 지원하지 않는 구문 입니다.
			//ctl.ToolTipText = sValue;
		}
	}
	return true;
}
this.FileUpLoad = function (controlname, reportdstic) {
	//convert : Argument Initialize
	if (typeof (controlname) === "undefined") controlname = '';
	if (typeof (reportdstic) === "undefined") reportdstic = '';
	//convert : html에서 지원하지 않는 구문 입니다.
	//var ctl=getControlByName(ControlName);
	//파일명(리포트구분(1)+오늘날자(8)+직원번호(7)+파일명)
	//convert : html에서 지원하지 않는 구문 입니다.
	//var FileName=ReportDstic + getToday(1) + getEmployeeID + ctl.FileName;

	if (MyFunctions.Execute_FileTransferUpLoad) {
		return FileName;
	}
	return null;
}
this.FileDownLoad = function (reportdstic, reportsn, fileopen) {
	//convert : Argument Initialize
	if (typeof (reportdstic) === "undefined") reportdstic = '';
	if (typeof (reportsn) === "undefined") reportsn = 0;
	if (typeof (fileopen) === "undefined") fileopen = false;
	//DB에서 서버에  첨부파일 생성
	NewTmHandler = new oza_TMHandlerFrame(ozController);

	NewTmHandler.package = commonPackage;//패키지명
	NewTmHandler.classname = 'ELE_MFB75B02000';//클래스명
	NewTmHandler.methodname = 'MFB75B02S1';//메서드명
	NewTmHandler.delimiter = Delimiter;//구분자
	NewTmHandler.tmtype = 0;//0:Element, 1:Collection
	NewTmHandler.addDataField('리포트구분', ReportDstic); //INPUT
	NewTmHandler.addDataField('리포트일련번호', ReportSN); //INPUT
	NewTmHandler.returnlist = '서버파일명';
	NewTmHandler.execute(); //서비스 호출

	if (NewTmHandler.isError()) {//서비스 에러인 경우
		ozf_MsgBox('파일 생성 실패. 잠시 후에 다시 사용하십시오.');
		return false;
	} else {//서비스 에러가 없을 경우
		var fileName = NewTmHandler.ElementValue('서버파일명');
		showSplash(); ;
		//Dim SystemSecurity As Object = MyFunctions.Get_SystemSecurity
		//SystemSecurity.SDSystem_Start()
		//파일다운로드
		//convert : html에서 지원하지 않는 구문 입니다.
		//if (MyFunctions.Execute_FileTransferDownLoad( + FileName, FileName, true)) {
		if (FileOpen) {
			var myProcess = null;
			//convert : html에서 지원하지 않는 구문 입니다.
			//myProcess.StartInfo.UseShellExecute = false;
			//convert : html에서 지원하지 않는 구문 입니다.
			//myProcess.StartInfo.FileName = 'cmd';
			//convert : html에서 지원하지 않는 구문 입니다.
			//myProcess.StartInfo.Arguments = '/c ' + '"' +  + FileName + '"';
			//convert : html에서 지원하지 않는 구문 입니다.
			//myProcess.StartInfo.CreateNoWindow = true;
			//convert : html에서 지원하지 않는 구문 입니다.
			//myProcess.Start; 
		}
	}
	//SystemSecurity.SDSystem_End()
	hideSplash(); ;
}
return true;
}
this.Build2Excel_CellMake = function (xlrpt, sname, sr, sc, er, ec, algn) {
	//convert : Argument Initialize
	if (typeof (xlrpt) === "undefined") xlrpt = null;
	if (typeof (sname) === "undefined") sname = '';
	if (typeof (sr) === "undefined") sr = 0;
	if (typeof (sc) === "undefined") sc = 0;
	if (typeof (er) === "undefined") er = 0;
	if (typeof (ec) === "undefined") ec = 0;
	if (typeof (algn) === "undefined") algn = 0;
	var rng = null;
	var nRowH = null;
	var aAry = [];

	nRowH = 16;
	aAry = ozf_SplitString(sName, MicroSoft.VisualBasic.Chr(10));
	//convert : html에서 지원하지 않는 구문 입니다.
	//xlRpt.SetRowHeight(sr, (aAry.GetUpperBound(0) + 1) * nRowH); 
	//convert : html에서 지원하지 않는 구문 입니다.
	//rng = xlRpt.Range(sr, sc, er, ec);
	//convert : html에서 지원하지 않는 구문 입니다.
	//xlRpt.Cells(sr, sc).value = sName;
	//convert : html에서 지원하지 않는 구문 입니다.
	//rng.Merge; 
	//convert : html에서 지원하지 않는 구문 입니다.
	//rng.Font.Size = 10;
	//convert : html에서 지원하지 않는 구문 입니다.
	//xlRpt.SetAlignment(rng, algn); //xlHAlignLeft = -4131
	if (rng != null) {
		rng = null;
	}
}
this.Export_Print_Footer = function () {
	var sValue = '';
	sValue = getEmployeeID + '/';
	sValue += getEmployeeName + '/';
	sValue += getBranchName + '/';
	sValue += this.getToday(4) + ' ';
	sValue += ozf_mid(ozController.ServerDate, 9, 2) + ':' + ozf_mid(ozController.ServerDate, 11, 2);
	sValue += ' 본 문서는 보안문서이므로 외부유출을 금합니다.';
	return sValue;
}//End Region

//로그
//Region "로그"
var sDelimiter = ';';
var pala2Delimiter = '[$]';
var palaDelimiter = '[#]';
var tmDelimiter = '[@]';
var LogInfo = '';//로그파라미터
var LogParameter = [];//거래별 로그파라미터
var LogString = [];//거래별 로그파라미터
var ServiceName = '';//거래명
var PrintServiceName = '';//출력로그용 거래명
var ServiceDstic = '';//거래구분
var ServiceString = [];//거래
var ServiceCode = '';//거래
var ServiceCSType = '';//CS거래구분
var ServiceCSSubType = '';//CS거래보조
var InputParameter = '';//조회조건
var PrintInputParameter = '';//출력로그용 조회조건

this.ActionLog = function () {
	//convert : html에서 지원하지 않는 구문 입니다.
	//makeParameter; 
}
this.PrintLog = function (custcnt) {
	//convert : Argument Initialize
	if (typeof (custcnt) === "undefined") custcnt = 0;
	if (InputParameter == null) {
		ozf_MsgBox('조회후 이용하여 주십시오.');
		ozController.ExitEvent = true;
		return ;
	}

	if (custCnt != 0) {
		if ((InputParameter.trim().length > 0)) {
			var sLog = ServiceDstic + sDelimiter + ServiceName + sDelimiter + custCnt + sDelimiter + InputParameter + sDelimiter + 'F' + sDelimiter;
			ozf_SetTempContent(ozController.getRefMain(), 'GKB_SECURITYLOGINFO', sLog, '');
		}
	}
}
this.makeParameter = function () {
	var j = 0;
	LogInfo = ozController.systemLogParameterInfo;
	LogParameter = ozf_SplitString(LogInfo, tmDelimiter);

	for (var i = 0; i <= LogParameter.length - 1; i += 1) {
		LogString = ozf_SplitString(LogParameter[i], palaDelimiter);
		ServiceName = LogString[0];
		if ((ServiceName.indexOf(actionPackage) >= 0)) {
			ServiceName = ServiceName.substr(ServiceName.indexOf(actionPackage) + actionPackage.length + 1);
			ServiceDstic = 'T';
		} else if ((ServiceName.indexOf(commonPackage) >= 0)) {
			ServiceName = ServiceName.substr(ServiceName.indexOf(commonPackage) + commonPackage.length + 1);
			ServiceDstic = 'T';
		} else {
			ServiceDstic = 'R';
		}

		ServiceString = ozf_SplitString(ServiceName.replace(/\./g, '@'), '@');
		ServiceCode = ServiceString[ServiceString.length - 1];
		if ((ozf_mid(ServiceCode, 9, 1) == "S")) {//조회
			ServiceCSType = '4';
		} else if ((ozf_mid(ServiceCode, 9, 1) == "U")) {//변경/수정
			ServiceCSType = '5';
		} else if ((ozf_mid(ServiceCode, 9, 1) == "R")) {//등록
			ServiceCSType = '6';
		} else if ((ozf_mid(ServiceCode, 9, 1) == "X")) {//삭제
			ServiceCSType = '7';
		} else {
			ServiceCSType = '4';
		}

		if (ServiceDstic == "T") {
			ServiceCSSubType = ozf_mid(ServiceCode, 6, 5);//CS거래보조
		} else {
			ServiceCSSubType = '00000';
		}

		PrintServiceName = PrintServiceName + ServiceName + ozf_IIF((i == LogParameter.length - 1), '', ', ');
		InputParameter = '';

		for (var j = 1; j <= LogString.length - 1; j += 1) {
			InputParameter += LogString[j].replace(/palaDelimiter/g, ', ').replace(/pala2Delimiter/g, ' : ') + ozf_IIF((j == LogString.length - 1), '', ', ');
		}
		PrintInputParameter = PrintInputParameter + InputParameter + ozf_IIF((i == LogParameter.length - 1), '', ',');

		//거래로그 조립후 저장
		var FrameLog = MyFunctions.FrameLogObject;
		//convert : html에서 지원하지 않는 구문 입니다.
		//FrameLog.CRMType = 21;//CRM업무구분 21:기업고객
		//convert : html에서 지원하지 않는 구문 입니다.
		//FrameLog.EmpNo = getEmployeeID;//직원번호
		//convert : html에서 지원하지 않는 구문 입니다.
		//FrameLog.CustomerID = '';//조회고객
		//convert : html에서 지원하지 않는 구문 입니다.
		//FrameLog.BranchNo = getBranchNo;//부점코드
		//convert : html에서 지원하지 않는 구문 입니다.
		//FrameLog.PCNO = ozf_GetTempContent(ozController.getRefMain(),'gKB_TerminalNo', false, '');//단말기번호
		//convert : html에서 지원하지 않는 구문 입니다.
		//FrameLog.PCIP = ;//단말기IP
		//convert : html에서 지원하지 않는 구문 입니다.
		//FrameLog.ScreenID = screenName;//화면번호
		//convert : html에서 지원하지 않는 구문 입니다.
		//FrameLog.ServiceName = ServiceName;//서비스명
		//convert : html에서 지원하지 않는 구문 입니다.
		//FrameLog.ServiceHangulName = MyFunctions.MessageTitle;//서비스한글명
		if ((InputParameter == "")) {
			InputParameter = '조회조건없음';
		}
		//convert : html에서 지원하지 않는 구문 입니다.
		//FrameLog.LogDetail = InputParameter;//로그상세내용
		//convert : html에서 지원하지 않는 구문 입니다.
		//FrameLog.CSType = ServiceCSType;//CS거래구분
		//convert : html에서 지원하지 않는 구문 입니다.
		//FrameLog.CSSubType = ServiceCSSubType;//CS거래보조
		//convert : html에서 지원하지 않는 구문 입니다.
		//FrameLog.ElapsedTime = ;//수행시간
		//convert : html에서 지원하지 않는 구문 입니다.
		//FrameLog.Write_defaultLog; 

		//기업고객분석보서일 경우 로그를 한번만
		if (screenName == "MFB72207000") {
			break;
		}
	}
	ozController.systemLogParameterInfo = '';

}
}

