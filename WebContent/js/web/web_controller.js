function web_Rootbodyframe(cObj) {
    var p;
    p = cObj;
    return p;
}

//win: FramePage의 window
function web_gRefMain(win) {
    if($(win.parent.document).find("object").length > 0) {
        var frameEle = web_Rootbodyframe(win.parent);
    } else {
        var frameEle = web_Rootbodyframe(win);
    }
    return frameEle.parent;
}


/**========================================================================================
 * 세션 정보 가져오기
 * 이름, 그룹명, 비고, 권한
 ========================================================================================*/
var webUserId = "";
var webUserName = "";
var webGroupName = "";
var webGroupDescription = "";
var webSysDiv = "";
var webSysDivFlag = "";
var wevMdCd = "";
var webStoreCd = "";
var webCopCd = "";
var webBrandNm = "";

function web_Init(win) {
	winobj = web_gRefMain(win);
	webUserId = winobj.gUser();
    var info = winobj.GetUserInfo();
    if (info != "") {
    	var list = info.split(";");

            webUserName = list[0];
            webGroupName = list[1];
            webGroupDescription = list[2];
            webSysDiv = sessionStorage.getItem("SYSDIV");
            wevMdCd = sessionStorage.getItem("MD_CD");
            selectStoreCdPerUser();
            webStoreCd = sessionStorage.getItem("STORE_CD");
            webCopCd = sessionStorage.getItem("COP_CD");
            webBrandNm = sessionStorage.getItem("BRAND_NM");
        }
    
    
    //권한 체크 시작===========================================================================================
	//브랜드 사용자(EDI)	
	if(webSysDiv == "1"){
		if(webStoreCd != ""){
			webSysDivFlag = "1.1";//매장(샵매니저)
		}else{
			webSysDivFlag = "1.2";//본사
		}
	//운영정보 사용자	
	}else if(webSysDiv == "2"){
		if(webStoreCd != ""){
			webSysDivFlag = "2.1";//점포
		}else{
			webSysDivFlag = "2.2";//본사
		}
	//스마트허브	
	}else if(webSysDiv == "3"){
		if(webStoreCd != ""){
			webSysDivFlag = "3.1";//매장(샵매니저)
		}else{
			webSysDivFlag = "3.2";//본사
		}
	}
	
	//권한 체크 종료===========================================================================================
	
	
	if($("#mask").length < 1){
		//태그 추가
		//백그라운드 투명 이미지(팝업 호출 시 클릭 못하도록 처리)
		$("body").append("<div id='mask' style='display:none;'></div>");
	}
}



/**========================================================================================
 * 점포 코드 조회 하기
 ========================================================================================*/
function selectStoreCdPerUser(){
	
	//console.log("세션점포코드 = "+sessionStorage.getItem("STORE_CD"));
	var exeMethod = "";
	
	//한번만 실행
	if(sessionStorage.getItem("STORE_CD") == ""){
		
		if(webSysDiv == "1"){
			//EDI 시스템 사용자 점포코드 얻기
			exeMethod = "selectStoreCdPerUser";
			
		}else if(webSysDiv == "2"){
			//운영 정보 사용자 점포코드 얻기
			exeMethod = "selectStoreCdSysMng";
		}else{
			exeMethod = "selectStoreCdPerUser";
		}
		
		
		
		var selStoreCd = new oza_TMHandler('com.obzen.bmp.DocBMPComm', exeMethod, '1', '\@#%');
		selStoreCd.setAddDataField('USER_ID', webUserId);
		selStoreCd.returnlist("STORE_CD")
		selStoreCd.execute(null, false);
		sessionStorage.setItem("STORE_CD", selStoreCd.ElementValue('STORE_CD'));
		
		//console.log("실행="+exeMethod);
		selStoreCd.clear();
	}
}



/**========================================================================================
 * 화면 로그 저장
 ========================================================================================*/
function screenLog(pgm_dstic, frame_id, frame_nm, client_ip){
	
	var NewTmHandler = null;
	var commonPackage = 'com.obzen.ssgcmp';
	var Delimiter = '@#%';
	
	if (typeof (pgm_dstic) === "undefined") pgm_dstic = '';
	
	var FrameName = frame_nm;
	var FrameID = frame_id;
	var ClientIP= client_ip;
	var UserID = webUserId;
	var UserName = webUserName;
	
	NewTmHandler = new oza_TMHandlerFrame();
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
	NewTmHandler.execute();
	//NewTmHandler.clear();
	return null;
}




/**========================================================================================
 * 팝업 호출(공통)
 ========================================================================================*/
function popupOpen(url, name, height, width, option) {
    /*
    - channelmode=yes|no|1|0 : 전체화면으로 창이 열립니다. IE에서만 동작합니다.
    - directories=yes|no|1|0 : (사용되지 않습니다.) 디렉토리 버튼의 표시여부
    - fullscreen=yes|no|1|0 : 전체 화면 모드. IE에서만 동작합니다.
    - height=pixels : 창의 높이를 지정합니다.(height=600)
    - width=pixels : 창의 너비를 지정합니다.(width=500)
    - left=pixels : 창의 화면 왼쪽에서의 위치를 지정합니다. 음수는 사용할 수 없습니다.
    - top=pixels : 창의 화면 위쪽에서의 위치를 지정합니다. 음수는 사용할 수 없습니다.
    - location=yes|no|1|0 : 주소 표시줄 사용여부를 지정합니다. Opera에서만 동작합니다.
    - menubar=yes|no|1|0 : 메뉴바 사용여부를 지정합니다.
    - resizable=yes|no|1|0 : 창의 리사이즈 가능 여부를 지정합니다. IE에서만 동작합니다.
    - scrollbars=yes|no|1|0 : 스크롤바 사용여부를 지정합니다. IE, Firefox, Opera에서 동작합니다.
    - status=yes|no|1|0 : 상태바를 보여줄지 지정합니다.
    - titlebar=yes|no|1|0 : 타이틀바를 보여줄지 지정합니다. 호출 응용 프로그램이 HTML 응용 프로그램이거나 신뢰할 수있는 대화 상자가 아니면 무시됩니다.
    - toolbar=yes|no|1|0 : 툴바를 보여줄지 지정합니다. IE, Firefox에서 동작합니다.
	 */
    
	//해상도 계산하여 위치 조절
	var popupX = (document.body.offsetWidth / 2) - (200 / 2);
    var popupY = (document.body.offsetHeight / 2) - (300 / 2);
	 
	option += ",top="+popupY+",left="+popupX+",height="+height+",width="+width;
    
    var ret = window.open(url, name, option);
    
    $("#mask").css("display","");//팝업 호출 시 보이게 설정
    
    $('#mask').click(function() {
  		ret.focus();
  	});
}  


/**========================================================================================
 * 팝업 닫았을때 백그라운드 이미지 제거
 ========================================================================================*/
function popupImageRemove(){
	 $("#mask").css("display","none");
}


var spinner;
/**========================================================================================
 * 프로그래스 바 시작
 ========================================================================================*/
function spinStart(msg_flag) {
	spinner = new Spinner().spin();
	
	$(document.body).append(spinner.el);
	
	
	if(msg_flag == "1"){
		var spinerTextFontSize = 14;
		var spinerTextPadding = 10;
		var spinerTextWidth = 200;
		var spinerTextBorderWidth = 2;
		var spinerTextMarginTop = (((spinerTextFontSize + (spinerTextBorderWidth * 2) + (spinerTextPadding * 2)) / 2) * -1)+110;
		var spinerTextMarginLeft = -100;
		var spinnerMarginLeft = (spinerTextWidth/2);
	
		$(spinner.el).append('<div class="spinerText"><div class="spinerTextDiv">처리 중 입니다.</div></div>');
		$(".spinerText").css("width",spinerTextWidth + "px");
		$(".spinerText").css("font-size",spinerTextFontSize + "px");
		$(".spinerText").css("line-height",spinerTextFontSize + "px");
		$(".spinerText").css("margin-top",spinerTextMarginTop + "px");
		$(".spinerText").css("margin-left",spinerTextMarginLeft + "px");
		$(".spinerText").css("padding",spinerTextPadding + "px");
		$(".spinerText").css("background-color","#fff");
		$(".spinerText").css("border",spinerTextBorderWidth + "px solid #5AA2DD");
		$(".spinerText").css("position","absolute");
		$(".spinerText").css("font-weight","bold");
		$(".spinerText").css("display","table");
		$(".spinerTextDiv").css("display","table-cell");
		$(".spinerTextDiv").css("text-align","center");
		$(".spinerTextDiv").css("vertical-align","middle");
	
		$(spinner.el).css('margin-left','-' + spinnerMarginLeft + 'px');
	}
	
	
	lodingImgOn();
}


/**========================================================================================
 * 프로그래스 바 종료
 ========================================================================================*/
function spinStop() {
	spinner.stop();
	lodingImgOff();
}





/**========================================================================================
* 워터마크 컨트롤
* 높이 측정용 클래스 또는 아이디
* 페이지마다 호출 
========================================================================================*/
function waterMarkText(innerId){
 var watermarkHtml = "";

 var waterCnt = 510;//고정 개수
 
 //var windowHeight = $('#'+innerId).prop('scrollHeight');
 var windowHeight = $('#'+innerId).height();
 
 if(windowHeight > 831){
	 //waterCnt = parseInt((408*windowHeight)/767);
	 //waterCnt = waterCnt + parseInt((400*(windowHeight-831))/700);
	 waterCnt = parseInt((510*windowHeight)/831)+100;
 }else{
	 waterCnt = 510;
 }
 
 //console.log("windowHeight="+windowHeight);
 //console.log("waterCnt="+waterCnt);
 
 for(var u=0; u < waterCnt; u++){
 	watermarkHtml += "<p>"+webBrandNm+"("+webUserId+")"+webUserName+"</p>";
 }

 $("#back_mark").html(watermarkHtml);//메인 페이지에 위치 할 것
 $("#back_mark").css("overflow","hidden");
 $("#back_mark").css("height",windowHeight+"px");
}


/**========================================================================================
* 이미지 활성화
========================================================================================*/
function lodingImgOn(){
	$("#mask").css("display","");
	$("#mask").css("height","2000");
	$("#mask").css("background","#EAEAEA");
	$("#mask").css("opacity","0.7");
	$("#mask").css("filter","Alpha(opacity=50)");
}



/**========================================================================================
* 이미지 비활성화
========================================================================================*/
function lodingImgOff(){
	$("#mask").css("display","none");
}