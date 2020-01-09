function common_FrameSystemLog() {
	var prop_ozController;
	Object.defineProperty(this, 'ozController', {
		get: function () {
			return prop_ozController;
		},
		set: function (val) {
			prop_ozController = val;
		},
	});
	//<summary>
	// DB Query LOG 전달을 위한 메시지 
	// </summary>
	var TmQueryLog = '';

	this.FrameOpened = function () {
		var PageAdd = '';
		PageAdd = ozf_MetaTranslateFramaddr(ozController.Addr).replace('/FrameExec', '');

		try {

			this.LogTMCall(PageAdd); //tm 호출
		}
		catch (ex) {

		}

	}
	this.FrameTmQueryLog = function () {
		var PageAdd = '';
		PageAdd = ozf_MetaTranslateFramaddr(ozController.Addr).replace('/FrameExec', '');
		TmQueryLog = 'FrameName=' + PageAdd;

		return TmQueryLog;
	}
	this.FrameAction = function () {

		var RaiseEventControl = null;////현재 클릭된 컨트롤

		if (ozController.RaiseEventControl == null) {
			RaiseEventControl = 'Frame';
		} else {
			RaiseEventControl = ozController.RaiseEventControl.text;
		}

		var SystemLogParameterInfo = ozController.systemLogParameterInfo;
		var SystemLogElapsedTimeInfo = ozController.systemLogElapsedTimeInfo;

		//convert : html에서 지원하지 않는 구문 입니다.
		//var LogParaDelimiterAction=;
		//convert : html에서 지원하지 않는 구문 입니다.
		//var LogParaDelimiterPara=;
		//convert : html에서 지원하지 않는 구문 입니다.
		//var LogParaDelimiterValue=;

		var TmInfo = '';
		var Para_arr = null;
		var ParaInfo = '';
		var ValueInfo = '';
		var ElapsedTimeInfo = '';

		//convert : html에서 지원하지 않는 구문 입니다.
		//var LogPara_arr=SystemLogParameterInfo.split([LogParaDelimiterAction], StringSplitOptions.None);
		//convert : html에서 지원하지 않는 구문 입니다.
		//var LogTime_arr=SystemLogElapsedTimeInfo.split([LogParaDelimiterAction], StringSplitOptions.None);

		var SubLogInfo_arr = null;
		var TimeInfo = '';

		for (var i = 0; i <= LogPara_arr.length - 1; i += 1) {
			//convert : html에서 지원하지 않는 구문 입니다.
			//SubLogInfo_arr = LogPara_arr(i).split([LogParaDelimiterPara], StringSplitOptions.None);////[#]
			TimeInfo = LogTime_arr[i];////Tm ElapsedTimeInfo

			if (SubLogInfo_arr.length == 1) {////만약 값이 하나일경우에는 파라미터가 없다는것
				TmInfo = SubLogInfo_arr[0];
				ParaInfo = '';
				ValueInfo = '';
				this.CallLogTm(TmInfo, ParaInfo, ValueInfo, TimeInfo); ////Log저장 TM호출
			} else {
				for (var j = 0; j <= SubLogInfo_arr.length - 1; j += 1) {
					if (j == 0) {
						TmInfo = SubLogInfo_arr[j];
					} else {
						//convert : html에서 지원하지 않는 구문 입니다.
						//Para_arr = SubLogInfo_arr(j).split([LogParaDelimiterValue], StringSplitOptions.None);////[$]

						if (ozf_StringIsEmpty(ParaInfo) == true) {
							ParaInfo = Para_arr[0];
							ValueInfo = Para_arr[1];
						} else {
							ParaInfo += ';' + Para_arr[0];
							ValueInfo += ';' + Para_arr[1];
						}
					}
				}
				this.CallLogTm(TmInfo, ParaInfo, ValueInfo, TimeInfo); ////Log저장 TM호출
			}
		}
	}
	this.CallLogTm = function (tminfo, parainfo, valueinfo, timeinfo) {
		//convert : Argument Initialize
		if (typeof (tminfo) === "undefined") tminfo = null;
		if (typeof (parainfo) === "undefined") parainfo = null;
		if (typeof (valueinfo) === "undefined") valueinfo = null;
		if (typeof (timeinfo) === "undefined") timeinfo = null;
		// msgbox(" TmInfo ::::::::: " & TmInfo)
		// msgbox(" ParaInfo ::::::::: " & ParaInfo)
		// msgbox(" ValueInfo ::::::::: " & ValueInfo)
		// msgbox(" TimeInfo ::::::::: " & TimeInfo)
	}
	this.FrameClosed = function () {
		//msgbox("3")
	}
	this.LogTMCall = function (pageadd) {
		//convert : Argument Initialize
		if (typeof (pageadd) === "undefined") pageadd = null;
		var NewTmHandler = null;
		NewTmHandler = new oza_TMHandlerFrame(ozController);

		NewTmHandler.package = 'com.obzen.systemlog';
		NewTmHandler.classname = 'DocSystemPageLog';
		NewTmHandler.methodname = 'insertPageLog';
		NewTmHandler.delimiter = '$%^';
		//TM 유형 설정
		NewTmHandler.tmtype = 0;//0:Element, 1:Collection

		//TM 값 전달 방법
		NewTmHandler.addDataField('PAGE_ADDR', PageAdd);

		//TM 수행
		NewTmHandler.execute;

		//에러 여부 체크
		if (NewTmHandler.isError()) {
			ozf_MsgBox('ACTIONLOG ERROR : ' + NewTmHandler.getErrormessage + ' / ' + NewTmHandler.getErrorcode + ' / ' + NewTmHandler.errorDesc);
		}
		NewTmHandler = null;
	}
}

