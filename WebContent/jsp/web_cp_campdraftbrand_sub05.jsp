<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
 <script type="text/javascript">

 var sel_input_id = "";//
 
//TM Start ===============================================================================================
	
	
//프로모션 선택 화면에서 혜택2부분 선택
//(0보다 큰 경우 App 노출 옵션에서 선정고객한정접근 만 활성화)
var offer2_cnt = "";

var offer2Tm = new oza_TMHandler('com.obzen.bmp.DocCampOfferSel', 'selectIsOffer2', '1', '\@#%');
offer2Tm.setAddDataField('CAMP_ID', camp_id);
offer2Tm.returnlist('OFFER2_CNT');
offer2Tm.execute(null, false);
offer2_cnt = offer2Tm.ElementValue('OFFER2_CNT');//혜택2 선택 여부
offer2Tm.clear();


//이전 등록 데이터 조회
var app_camp_str_dt = "";
var app_show_dstic_code = "";
var app_dn_max_cust_cnt = "";
var msg_snd_yn = "";
var chan_tran_dt = "";
var chan_tran_prdt_cust_cnt = "";

var appMsgInfoTm = new oza_TMHandler('com.obzen.bmp.DocApproachCust', 'selectAppMsgInfo', '1', '\@#%');
appMsgInfoTm.setAddDataField('CAMP_ID', camp_id);
appMsgInfoTm.returnlist('CAMP_STR_DT;APP_SHOW_DSTIC_CODE;APP_DN_MAX_CUST_CNT;MSG_SND_YN;CHAN_TRAN_DT;CHAN_TRAN_PRDT_CUST_CNT');
appMsgInfoTm.execute(null, false);
app_camp_str_dt = appMsgInfoTm.ElementValue('CAMP_STR_DT');//행사 시작 일자
app_show_dstic_code = appMsgInfoTm.ElementValue('APP_SHOW_DSTIC_CODE');//APP노출표시(T:선정고객한정, F:선정+팔로우, A:선정+전체)
app_dn_max_cust_cnt = appMsgInfoTm.ElementValue('APP_DN_MAX_CUST_CNT');//추가고객 인원수(5000~10000~20000, 0인 경우 제한없음)
msg_snd_yn = appMsgInfoTm.ElementValue('MSG_SND_YN');//문자전송여부 Y/N
chan_tran_dt = appMsgInfoTm.ElementValue('CHAN_TRAN_DT');//문자 발송 일자
chan_tran_prdt_cust_cnt = appMsgInfoTm.ElementValue('CHAN_TRAN_PRDT_CUST_CNT');//문자 전송 발송 고객수
appMsgInfoTm.clear();


//발송 가능 일자 조회
//DT : 발송가능 예상일자(총7일)
//D_DAY : (-3,-2,-1,0,1,2,3)
//DT_DAY : 요일(1:일,2:월,3:화....)
var tranDtTm = new oza_TMHandler('com.obzen.bmp.ColApproachCust', 'selectTranDt', '0', '\@#%');
tranDtTm.setAddDataField('CAMP_ID', camp_id);
tranDtTm.execute(null, false);
var tranDtTmResult = tranDtTm.getResult();
var tranDtTm_json = "";
if(tranDtTmResult != ""){tranDtTm_json = JSON.parse(tranDtTmResult);}
tranDtTm.clear();



//App 프로모션 노출 고객수 조회
//APP_CNT1 : APP 고객수1
//APP_CNT2 : APP 고객수2
//APP_CNT3 : APP 고객수3
var app_cnt1 = "";
var app_cnt2 = "";
var app_cnt3 = "";

var appCustCntTm = new oza_TMHandler('com.obzen.bmp.DocActInfo', 'selectAppCustCnt', '1', '\@#%');
appCustCntTm.returnlist('APP_CNT1;APP_CNT2;APP_CNT3');
appCustCntTm.execute(null, false);
app_cnt1 = appCustCntTm.ElementValue('APP_CNT1');
app_cnt2 = appCustCntTm.ElementValue('APP_CNT2');
app_cnt3 = appCustCntTm.ElementValue('APP_CNT3');
appCustCntTm.clear();



//발송가능 고객 수 조회
//발송예상일 선택 시
var sel_chan_tran_dt = "";
var sel_chan_tran_prdt_cust_cnt = "";



//TM End =================================================================================================	
 
 
 //화면 로드 시 실행
 $(document).ready(function() {
	 //$('html, body').animate({scrollTop: $('#web_cmp_content').offset().top}, 'fast');
	 screenLog("조회", "web_cp_campdraftbrand_sub05", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>채널/발송일 선택",get_client_ip);//화면 로그(공통)
	 
	 
	 //초기 마우스 커서 설정
	 $(".app_cntTop ul li.sel1").css("cursor","pointer");
	 $(".app_cntTop ul li.sel2").css("cursor","pointer");
	 $(".app_cntTop ul li.sel3").css("cursor","pointer");
	 $(".lmsbtn1").css("cursor","pointer");
	 $(".lmsbtn2").css("cursor","pointer");
	
	 
	 
	 if(mod_flag == "N" || (user_id != reg_id)){
		 $(".app_cntTop ul li.sel1").css("cursor","default");
		 $(".app_cntTop ul li.sel2").css("cursor","default");
		 $(".app_cntTop ul li.sel3").css("cursor","default");
		 $(".lmsbtn").css("cursor","default");
		 $(".lmsbtn1").css("cursor","default");
		 $(".lmsbtn2").css("cursor","default");
		 $(".btn_prev").css("cursor","default");
		 $(".btn_next").css("cursor","default");
		}
	 
	 
	 
	 if(app_show_dstic_code == ""){app_show_dstic_code = "T";}
	 if(msg_snd_yn == ""){msg_snd_yn = "Y";}
	 
	 
	 if(!$(".app_cntTop ul li").hasClass){
		 $(".app_cntTop ul li.sel1").addClass("on");  
	 }
	 
	 
	 //문자 선택 on/off
	 if(app_show_dstic_code == "T"){
		 $(".app_cntTop ul li.sel1").addClass("on");
		 $(".none").css("display","");
	 	 $(".app_cntBtm").css("display","none");
	 }else if(app_show_dstic_code == "F"){
		 $(".app_cntTop ul li.sel2").addClass("on");
		 $(".app_cntBtm").css("display","");
	 	 $(".none").css("display","none");
	 	 custDesign();
	 }else if(app_show_dstic_code == "A"){
		 $(".app_cntTop ul li.sel3").addClass("on");
		 $(".app_cntBtm").css("display","");
	 	 $(".none").css("display","none");
	 	 custDesign();
	 }
	 
	 //문자 선택 on/off
	 if(msg_snd_yn == "Y"){
		 $(".lmsbtn1").addClass("on");
	 }else if(msg_snd_yn == "N"){
		 $(".lmsbtn2").addClass("on");
	 }
	 
	 
	 if(chan_tran_prdt_cust_cnt == ""){chan_tran_prdt_cust_cnt = "0";}
	 if(app_dn_max_cust_cnt == ""){app_dn_max_cust_cnt = "";}
	 
	 
	 tranDtDesign();//발송 일자 그리기
	 
	 
	 //STEP2 선택그룹
	 $(".app_cntTop ul li.sel1").click(function() {
		 if(mod_flag == "N"){return false;}
		 if(user_id != reg_id){return false;}
		 
		 $(".app_cntTop ul li").removeClass("on");
		 	
		 	if(!$(this).hasClass("on")){
		 		$(this).addClass("on");
		 		$(".none").css("display","");
		 		$(".app_cntBtm").css("display","none");
		 		app_show_dstic_code = "T";
		 		app_dn_max_cust_cnt = "";
		 	}else{
		 		$(this).removeClass("on");
		 	}
		 	
		 	return false;
		});
	 
	 //FIT 팔로우 고객
	 $(".app_cntTop ul li.sel2").click(function() {
		 if(mod_flag == "N"){return false;}
		 if(user_id != reg_id){return false;}
		 if(parseInt(isNullZero(offer2_cnt)) > 0){cmdMessage(0, "선택 할 수 없습니다.");return;}
		 if(bmpevtTy_cd == "3"){cmdMessage(0, "선택 할 수 없습니다.");return;}//신세계 임직원 대상 알리기 유형
		 
		 $(".app_cntTop ul li").removeClass("on");
		 	
		 	if(!$(this).hasClass("on")){
		 		$(this).addClass("on");
		 		$(".app_cntBtm").css("display","");
		 		$(".none").css("display","none");
		 		app_show_dstic_code = "F";
		 		custDesign();
		 	}else{
		 		$(this).removeClass("on");
		 	}
		 	
		 	return false;
		});
	 
	 //전체고객
	 $(".app_cntTop ul li.sel3").click(function() {
		 if(mod_flag == "N"){return false;}
		 if(user_id != reg_id){return false;}
		 if(parseInt(isNullZero(offer2_cnt)) > 0){cmdMessage(0, "선택 할 수 없습니다.");return;}
		 if(bmpevtTy_cd == "3"){cmdMessage(0, "선택 할 수 없습니다.");return;}//신세계 임직원 대상 알리기 유형
		 
		 $(".app_cntTop ul li").removeClass("on");
		 
		 	if(!$(this).hasClass("on")){
		 		$(this).addClass("on");
		 		$(".app_cntBtm").css("display","");
		 		$(".none").css("display","none");
		 		app_show_dstic_code = "A";
		 		custDesign();
		 	}else{
		 		$(this).removeClass("on");
		 	}
		 	
		 	return false;
		});
	 
	 //문자전송하기
	 $(".lmsbtn1").click(function() {
		 if(mod_flag == "N"){return false;}
		 if(user_id != reg_id){return false;}
		 
		 $(".lms_cntTop ul li").removeClass("on");
		 
		 	if(!$(this).hasClass("on")){
		 		$(this).addClass("on");
		 		msg_snd_yn = "Y";
		 		tranDtDesign();
		 	}else{
		 		$(this).removeClass("on");
		 	}
		 	
		 	return false;
		});
	 
	 //문자 전송안함
	 $(".lmsbtn2").click(function() {
		 if(mod_flag == "N"){return false;}
		 if(user_id != reg_id){return false;}
		 
		 if(sel_chan_tran_dt != "" || chan_tran_dt != ""){
			 if(cmdMessage(1, "문자 발송일 선택을 취소하고 문자를 발송하지 않으시겠습니까?") == false){return;} 
		 }
		 
		 $(".lms_cntTop ul li").removeClass("on");
		 
		 	if(!$(this).hasClass("on")){
		 		$(this).addClass("on");
		 		msg_snd_yn = "N";
		 		tranDtDesign("no");
		 		sel_chan_tran_dt = "";
		 		sel_chan_tran_prdt_cust_cnt = "0";
		 	}else{
		 		$(this).removeClass("on");
		 	}
		 	
		 	return false;
		});
	 
	 
 });




/**========================================================================================
* 선정고객+팔로우고객 / 선정고객+전체고객
========================================================================================*/
function custDesign(){
 	var innerHtml = "";
 	var cursorType = "cursor:pointer";
 	var classFlag1 = "";
 	var classFlag2 = "";
 	var classFlag3 = "";
 	var classFlag4 = "";
 	var classFlag5 = "";
 	var input_cnt = "";
 	
 	if(mod_flag == "N"){cursorType = "cursor:default";}
 	if(user_id != reg_id){cursorType = "cursor:default";}
 	
 	if(parseInt(app_dn_max_cust_cnt) == parseInt(app_cnt1)){
 		classFlag1 = "on";
 	}else if(parseInt(app_dn_max_cust_cnt) == parseInt(app_cnt2)){
 		classFlag2 = "on";
 	}else if(parseInt(app_dn_max_cust_cnt) == parseInt(app_cnt3)){
 		classFlag3 = "on";
 	}else if(parseInt(app_dn_max_cust_cnt) == 0){
 		classFlag5 = "on";
 	}else{
 		classFlag4 = "on";
 		input_cnt = AddComma(app_dn_max_cust_cnt);
 	}

 	innerHtml += "<li style='"+cursorType+"' class='"+classFlag1+"' id='app_cnt_1' onclick=\"javascript:selectCust('app_cnt_1');\">";
 	innerHtml += "<div>";
 	innerHtml += "<p>선착순 설정</p>";
 	innerHtml += "<strong>"+AddComma(app_cnt1)+"</strong>";
 	innerHtml += "<input type='hidden' id='input_app_cnt1' value='"+app_cnt1+"'>";
 	innerHtml += "</div>";
 	innerHtml += "</li>";
 	
 	innerHtml += "<li style='"+cursorType+"' class='"+classFlag2+"' id='app_cnt_2' onclick=\"javascript:selectCust('app_cnt_2');\">";
 	innerHtml += "<div>";
 	innerHtml += "<p>선착순 설정</p>";
 	innerHtml += "<strong>"+AddComma(app_cnt2)+"</strong>";
 	innerHtml += "<input type='hidden' id='input_app_cnt2' value='"+app_cnt2+"'>";
 	innerHtml += "</div>";
 	innerHtml += "</li>";
 	
 	innerHtml += "<li style='"+cursorType+"' class='"+classFlag3+"' id='app_cnt_3' onclick=\"javascript:selectCust('app_cnt_3');\">";
 	innerHtml += "<div>";
 	innerHtml += "<p>선착순 설정</p>";
 	innerHtml += "<strong>"+AddComma(app_cnt3)+"</strong>";
 	innerHtml += "<input type='hidden' id='input_app_cnt3' value='"+app_cnt3+"'>";
 	innerHtml += "</div>";
 	innerHtml += "</li>";
 	
 	innerHtml += "<li style='"+cursorType+"' class='"+classFlag4+"' id='app_cnt_4' onclick=\"javascript:selectCust('app_cnt_4');\" >";
 	innerHtml += "<div>";
 	innerHtml += "<p>선착순 설정</p>";
 	//innerHtml += "<input type='text' id='input_app_cnt4' disabled value='"+input_cnt+"' onKeyDown=\"javascript:if(event.keyCode == 13){inputAppCnt('input_app_cnt4');}\"  onblur=\"javascript:inputAppCnt('input_app_cnt4');\">";
 	innerHtml += "<input type='text' id='input_app_cnt4' style = 'text-align:center;' disabled value='"+input_cnt+"' onblur=\"javascript:inputAppCnt('input_app_cnt4');\">";
 	innerHtml += "</div>";
 	innerHtml += "</li>";
 	
 	innerHtml += "<li style='"+cursorType+"' class='"+classFlag5+"' id='app_cnt_5' onclick=\"javascript:selectCust('app_cnt_5');\" >";
 	innerHtml += "<div>";
 	innerHtml += "<p>제한 없음</p>";
 	innerHtml += "<input type='hidden' id='input_app_cnt5' value='0'>";
 	innerHtml += "</div>";
 	innerHtml += "</li>";
 	
 	$("#cust_list").html(innerHtml);
}


/**========================================================================================
* 선착순 설정 입력 체크
========================================================================================*/
function inputAppCnt(inputId){
	var inputValue = $("#"+inputId).val();
	
	if(inputValue == "" || inputValue == null){return false;}
	
	//숫자 입력 체크
	if(isNumber(inputValue) == false){
		cmdMessage(0, "숫자만 입력하세요.");
	 	$("#"+inputId).val("");
	 	$("#"+inputId).focus();
		return false;
	}
	
	if(parseInt(inputValue) == parseInt(app_cnt1)){
		cmdMessage(0, "이미 설정되어 있는 고객 수 입니다.");
		$("#"+inputId).val("");
		$("#"+inputId).focus();
		return false;
	}else if(parseInt(inputValue) == parseInt(app_cnt2)){
		cmdMessage(0, "이미 설정되어 있는 고객 수 입니다.");
		$("#"+inputId).val("");
		$("#"+inputId).focus();
		return false;
	}else if(parseInt(inputValue) == parseInt(app_cnt3)){
		cmdMessage(0, "이미 설정되어 있는 고객 수 입니다.");
		$("#"+inputId).val("");
		$("#"+inputId).focus();
		return false;
	}else if(parseInt(inputValue) <= 0){
		cmdMessage(0, "0보다 큰 숫자를 입력하세요");
		$("#"+inputId).val("");
		$("#"+inputId).focus();
		return false;
	}else if(parseInt(inputValue) >= 50000){
		cmdMessage(0, "5,0000명까지 설정 가능 합니다.");
		$("#"+inputId).val("");
		$("#"+inputId).focus();
		return false;
	}
	
	
	$("#"+inputId).val(AddComma(inputValue));
	app_dn_max_cust_cnt = inputValue;
}



/**========================================================================================
* 고객 선택
========================================================================================*/
function selectCust(liId){
	
	if(mod_flag == "N"){return false;}
	if(user_id != reg_id){return false;}
  
  $("#cust_list li").removeClass("on");
  $("#"+liId).addClass("on");
  
  
  if(liId == "app_cnt_1"){app_dn_max_cust_cnt = $("#input_app_cnt1").val();}
  if(liId == "app_cnt_2"){app_dn_max_cust_cnt = $("#input_app_cnt2").val();}
  if(liId == "app_cnt_3"){app_dn_max_cust_cnt = $("#input_app_cnt3").val();}
	
  if(liId == "app_cnt_4"){
	  $("#input_app_cnt4").attr("disabled",false);
	}else{
	  $("#input_app_cnt4").attr("disabled",true);
	  $("#input_app_cnt4").val("");
  }
  
  if(liId == "app_cnt_5"){app_dn_max_cust_cnt = "0";}
}
 
 

/**========================================================================================
* 발송 일자별 접근 가능 고객
========================================================================================*/
function tranDtDesign(flag){
	var innerHtml = "";
	
	var class_name = "";
	var dt = "";
	var d_day = "";
	var dt_day = "";
	var dt_day_nm = "";
	var input_id = "";
	var cursorType = "cursor:pointer";
	var classFlag = "";
	var inputValue = "";
	
	if(flag == "no"){cursorType = "cursor:default";}
	else{cursorType = "cursor:pointer";}
	
	if(mod_flag == "N"){cursorType = "cursor:default";}
	if(user_id != reg_id){cursorType = "cursor:default";}
	
	for(var i=0; i < tranDtTm_json.length; i++) {
	  class_name = "dday"+(i+1);
	  input_id = "input_dday_"+(i+1);
	  dt = tranDtTm_json[i].DT;
	  dt = setValidDate(dt);
	  d_day = tranDtTm_json[i].D_DAY;
	  dt_day = tranDtTm_json[i].DT_DAY;
	  
	  if(dt_day == "1"){dt_day_nm = "일";}
	  else if(dt_day == "2"){dt_day_nm = "월";}
	  else if(dt_day == "3"){dt_day_nm = "화";}
	  else if(dt_day == "4"){dt_day_nm = "수";}
	  else if(dt_day == "5"){dt_day_nm = "목";}
	  else if(dt_day == "6"){dt_day_nm = "금";}
	  else if(dt_day == "7"){dt_day_nm = "토";}
	  
	  if(sDelHypn(dt) == chan_tran_dt){classFlag = "on";inputValue = AddComma(isNullZero(chan_tran_prdt_cust_cnt));sel_input_id = input_id;}else{inputValue = "Click!";classFlag = "";};
	  if(flag == "no"){inputValue = "0";classFlag = "";}
	  
	  
	  innerHtml += "<li class='"+class_name+" "+classFlag+"' style='"+cursorType+"' onclick=\"javascript:selectTranDt('"+flag+"', '"+class_name+"', '"+input_id+"', '"+sDelHypn(dt)+"', '"+dt_day+"');\">";
	  innerHtml += "<p>"+dt+"("+dt_day_nm+")</p>";
	  innerHtml += "<input type='text' id='"+input_id+"' disabled value='"+inputValue+"'>";
	  innerHtml += "</li>";
	}

  $("#tran_dt_list").html(innerHtml);
}



/**========================================================================================
* 날짜 선택
========================================================================================*/
var sel_class_name = "";

function selectTranDt(flagValue, className, inputId, dtValue, dtDay){
	if(mod_flag == "N"){return false;}
	if(user_id != reg_id){return false;}
	
	if(flagValue == "no"){return false;;};
	
	//오늘일자 구하기--------------------------
	var date = new Date(); 
	var year = date.getFullYear(); 
	var month = new String(date.getMonth()+1); 
	var day = new String(date.getDate()); 
  var today_date = "";
	
	
	// 한자리수일 경우 0을 채워준다. 
	if(month.length == 1){ 
	  month = "0" + month; 
	} 
	if(day.length == 1){ 
	  day = "0" + day; 
	} 

	today_date = year + "" + month + "" + day;
	//오늘일자 구하기--------------------------
	
	
	//오늘 , 이전 선택 불가
	if(getCalDate(today_date, dtValue, "D") < 2){cmdMessage(0, "해당 날짜 이후로 선택하세요.");return false;}
	//if(dtDay == "5"){cmdMessage(0, "묙요일은 발송 불가 합니다. 다른 일자를 선택해주세요.");return false;}
	
	startTime = new Date().getTime();
	
	sel_chan_tran_dt = dtValue;
	
	loadingStart();
	
	var tranCustTm = new oza_TMHandler('com.obzen.bmp.DocCustg', 'selectTranCustCnt', '1', '\@#%');
	tranCustTm.setAddDataField('CHAN_TRAN_DT', sel_chan_tran_dt);
	tranCustTm.setAddDataField('CAMP_ID', camp_id);
	tranCustTm.returnlist('CHAN_TRAN_PRDT_CUST_CNT');
	tranCustTm.execute(callBackTranCustCnt, true);
	
	sel_class_name = className;
	sel_input_id = inputId;
}



/**========================================================================================
* 날짜 선택 콜백 함수(비동기)
========================================================================================*/
function callBackTranCustCnt(tranCustTm){
	sel_chan_tran_prdt_cust_cnt = tranCustTm.ElementValue('CHAN_TRAN_PRDT_CUST_CNT');//문자 전송 발송 고객수
	tranCustTm.clear();
	
	loadingStop();
	
	$("#tran_dt_list li").removeClass("on");
	$("."+sel_class_name).addClass("on");
	$("#"+sel_input_id).val(AddComma(isNullZero(sel_chan_tran_prdt_cust_cnt)));
}



/**========================================================================================
* 이전 단계
========================================================================================*/
function preStep04(){
	
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
	
	
	if(bmpevtTy_cd == "2" || bmpevtTy_cd == "3"){
		webPageMove("3");
	}else{
		webPageMove("4");	
	}
}


/**========================================================================================
* 다음 단계(등록/수정)
========================================================================================*/
function nextStep04(){
	
	var msg = "";
	/*
	if(mod_flag == "N"){
		if(msg_snd_yn == "N"){
			webPageMove('7');	
		}else{
			webPageMove('6');
		}
		
		return;
	}
	
	if(user_id != reg_id){
		if(msg_snd_yn == "N"){
			webPageMove('7');	
		}else{
			webPageMove('6');
		}
		
		return;
	}
	*/
	
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
	

	//입력 체크 시작-----------------------------------------------------
	if(app_show_dstic_code == ""){
 		cmdMessage(3,"APP 프로모션 노출 설정");
 		return;
 	}
	
	
	if(app_show_dstic_code == "F" || app_show_dstic_code == "A"){
		if(!$("#cust_list li").hasClass("on")){
			cmdMessage(3,"추가 고객");
	   	return;	
		}
	}
	
	
	if(msg_snd_yn == ""){
 		cmdMessage(3,"문자 전송 여부");
 		return;
 	}
	
	
	if(sel_chan_tran_dt == ""){sel_chan_tran_dt = chan_tran_dt;} 
	
	if($(".lmsbtn1").hasClass("on")){
		if(!$("#tran_dt_list li").hasClass("on")){
  		cmdMessage(3,"채널 발송 일자");
   		return;
  	}
		
		if(sel_chan_tran_dt == ""){
   		cmdMessage(3,"채널 발송 일자");
   		return;
   	}
	}
	
	
	if($(".sel2").hasClass("on") || $(".sel3").hasClass("on")){
		if($("#app_cnt_4").hasClass("on")){
			if($("#input_app_cnt4").val() == "" || $("#input_app_cnt4").val() == "0"){
				cmdMessage(2,"선착순 설정");
		   	return;
			}
		}	
	}
	
	
	//문자발송하기 + 문자발송인원 0일때 체크
	if(parseInt(isNullZero(DelComma($("#"+sel_input_id).val()))) < 1 && msg_snd_yn == "Y"){
		cmdMessage(0,"발송 일자 별 접근 가능 고객이 0명 입니다.");
	  return;
	}
	
	
	
  //입력 체크 종료-----------------------------------------------------
	
  /*
	if(cmdMessage(1, "다음 단계로 이동 하시겠습니까?") == false){
  	return;
  }
	*/
  
  
	lodingImgOn();//백그라운드 이미지 활성(더블클릭방지)
  
	//캠페인 대상 모형 고객 리스트 저장
	var insertMdlCustTm = new oza_TMHandler('com.obzen.bmp.DocCustg', 'insertMdlCustList', '1', '\@#%');
	insertMdlCustTm.setAddDataField('CAMP_ID', camp_id);
	insertMdlCustTm.setAddDataField('CHAN_TRAN_DT', sel_chan_tran_dt);//채널발송일자
	//insertMdlCustTm.setAddDataField('CHAN_TRAN_PRDT_CUST_CNT', sel_chan_tran_prdt_cust_cnt);//문자전송_발송고객수
	insertMdlCustTm.setAddDataField('USERID', user_id);
	insertMdlCustTm.setAddDataField('MSG_SND_YN', msg_snd_yn);//문자전송여부
	insertMdlCustTm.returnlist('LOGMSG;CHAN_TRAN_PRDT_CUST_CNT');
	insertMdlCustTm.execute(null, false);
	var return_cnt = insertMdlCustTm.ElementValue('CHAN_TRAN_PRDT_CUST_CNT');//리턴 처리 메시지
	insertMdlCustTm.clear();
	
	
	if(msg_snd_yn == "Y" && parseInt(isNullZero(DelComma($("#"+sel_input_id).val()))) != parseInt(isNullZero(return_cnt))){
		msg = "실제 발송 고객은 "+AddComma(isNullZero(return_cnt))+"명 입니다.";
		cmdMessage(0,msg);
	}
	
	
	//캠페인 고객군 생성
	var insertCustBMPTm = new oza_TMHandler('com.obzen.bmp.DocCustg', 'insertCustgBMP', '1', '\@#%');
	insertCustBMPTm.setAddDataField('CAMP_ID', camp_id);
	insertCustBMPTm.setAddDataField('USERID', user_id);
	insertCustBMPTm.execute(null, false);
	insertCustBMPTm.clear();
	
	
	//App 채널 활동정보 생성
	var insertAppActTm = new oza_TMHandler('com.obzen.bmp.DocActInfo', 'insertAppAct', '1', '\@#%');
	insertAppActTm.setAddDataField('CAMP_ID', camp_id);
	insertAppActTm.setAddDataField('APP_SHOW_DSTIC_CODE', app_show_dstic_code);//app노출표시(T:선정고객한정, F:선정+팔로우, A:선정+전체)
	insertAppActTm.setAddDataField('APP_DN_MAX_CUST_CNT', app_dn_max_cust_cnt);//추가고객 인원수(5000~10000~20000, 0인 경우 제한없음)
	insertAppActTm.setAddDataField('MSG_SND_YN', msg_snd_yn);//문자전송여부
	insertAppActTm.setAddDataField('USERID', user_id);
	insertAppActTm.returnlist('LOGMSG');
	insertAppActTm.execute(null, false);
  //var msg = insertAppActTm.ElementValue('LOGMSG');//리턴 처리 메시지
	insertAppActTm.clear();
	
	screenLog("등록", "web_cp_campdraftbrand_sub05", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>채널/발송일 등록",get_client_ip);//화면 로그(공통)
	

	if(msg_snd_yn == "N"){
		flag = "7";	
	}else{
		flag = "6";
	}
	
	camp_id = camp_id;
	bmpevtTy_cd = bmpevtTy_cd;
	chk_msg_snd_yn = msg_snd_yn;

	do_RefreshPage("onload");
}


/*===============================================================
팝업 Open
===============================================================*/
function layerPopOpen(popupN){
	
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
	
	var innerHtml = "";
	var mobileText = "";
	
	var $layer = $("#"+ popupN);
	
	//다른일자 확인하기 조회 ----------------------------------------------------------
	if(popupN == "layer_other"){
		
		var anotherDateTm = new oza_TMHandler('com.obzen.bmp.ColApproachCust', 'selectTranDt2', '0', '\@#%');
		anotherDateTm.setAddDataField('CAMP_ID', camp_id);
		anotherDateTm.execute(null, false);
		var anotherDateTmResult = anotherDateTm.getResult();
		var anotherDateTm_json = "";
		if(anotherDateTmResult != ""){anotherDateTm_json = JSON.parse(anotherDateTmResult);}
		anotherDateTm.clear();
		
		var on_flag = "";//class on 여부
		var date_nm = "";//일,월
		var dday = "";//d day
		var dday_cnt = "0";//고객수
		var cust_date = "";
		var input_id = "";
		var styleCursor = "";
		
		for(var i=0; i < anotherDateTm_json.length; i++) {
			date_nm = anotherDateTm_json[i].CUST_DT;
			dday = anotherDateTm_json[i].CUST_DAY;
			cust_date = anotherDateTm_json[i].CUST_DATE;
			input_id = "input_custdt_"+(i+1);
			//dday_cnt = anotherDateTm_json[i].CUST_CNT;
			
			if(dday === "D+8"){on_flag = "";styleCursor = "cursor:default";}
			else if(dday === "D+9"){on_flag = "";styleCursor = "cursor:default";}
			else if(dday === "D+10"){on_flag = "";styleCursor = "cursor:default";}
			else if(dday === "D-8"){on_flag = "";styleCursor = "cursor:default";}
			else if(dday === "D-9"){on_flag = "";styleCursor = "cursor:default";}
			else if(dday === "D-10"){on_flag = "";styleCursor = "cursor:default";}
			else{on_flag = "on";styleCursor = "cursor:pointer";}
			
			innerHtml += "<li class='"+on_flag+"'  style='"+styleCursor+"' onclick=\"javascript:selectEtcTranDt('"+on_flag+"','"+input_id+"', '"+sDelHypn(cust_date)+"');\">";
			innerHtml += "<div class='date'>";
			innerHtml += date_nm;
			innerHtml += "<strong>"+dday+"</strong>";
			innerHtml += "</div>";
			innerHtml += "<div class='client' id='"+input_id+"'>";
			//innerHtml += AddComma(dday_cnt);
			innerHtml += "?";
			innerHtml += "</div>";
			innerHtml += "</li>";	
		}
		
		$("#other_cal").html(innerHtml);	
	}
	
	$layer.css("position", "absolute");
  $layer.css("top",(($(window).height() - $layer.outerHeight()) / 2) + $(window).scrollTop());
  $layer.css("left",(($(window).width() - $layer.outerWidth()) / 2) + $(window).scrollLeft());
  $layer.draggable();
  $layer.show();
}



/**========================================================================================
* 날짜 선택(다른 일자 확인하기)
========================================================================================*/
var sel_input_cnt_id = "";
function selectEtcTranDt(onFlag,inputId, dtValue){

	if(onFlag != "on"){return;}
	
	loadingStart();
	
	var tranEtcCustTm = new oza_TMHandler('com.obzen.bmp.DocCustg', 'selectTranCustCnt', '1', '\@#%');
	tranEtcCustTm.setAddDataField('CHAN_TRAN_DT', dtValue);
	tranEtcCustTm.setAddDataField('CAMP_ID', camp_id);
	tranEtcCustTm.returnlist('CHAN_TRAN_PRDT_CUST_CNT');
	tranEtcCustTm.execute(callBackTranEtcCustCnt, true);
	
	sel_input_cnt_id = inputId;
}


/**========================================================================================
* 날짜 선택(다른 일자 확인하기) 콜백 함수(비동기)
========================================================================================*/
function callBackTranEtcCustCnt(tranEtcCustTm){
	var sel_cust_cnt = tranEtcCustTm.ElementValue('CHAN_TRAN_PRDT_CUST_CNT');//문자 전송 발송 고객수
	tranEtcCustTm.clear();
	
	loadingStop();
  
  $("#"+sel_input_cnt_id).text(AddComma(isNullZero(sel_cust_cnt)));
}


/*===============================================================
팝업 Close
===============================================================*/
function popupClose(popupN) {
	var $layer = $("#"+ popupN);
  $layer.hide();
}


</script>
<div class="c_write_wrap">
<div class="tip_txt">커뮤니케이션(APP/문자) 및 행사문자 발송일을 선택하는 단계입니다.<br>일자별 발송 가능한 고객수를 확인 하실 수 있습니다. 가장 많은 고객에게 접근 할 수 있는 날짜를 선택 해보세요.</div>
	<div class="c_write_4">
		<div class="app_wrap box">
			<p class="tit">APP 프로모션 노출 설정<span>* APP고객 공개 범위를 선택하실 수 있습니다.</span></p>
			<div class="app_cntTop">
				<ul>
					<li class="sel1">
						<p>STEP2 선택그룹</p>
						<span>STEP2에서 선택한<br>고객그룹에게만 혜택을<br>알립니다.</span>
					</li>
					<li class="sel2">
						<p>FIT 팔로우고객</p>
						<span>APP에서 브랜드별<br>팔로잉한 고객그룹에게도<br>혜택을 추가 알립니다.</span>
					</li>
					<li class="sel3">
						<p>전체고객</p>
						<span>APP 이용고객 전체에게<br>혜택을 노출합니다.<br>&nbsp;</span>
					</li>
				</ul>
			</div>
      
      
			<div class="app_cntBtm" style="display:none;">
				<ul id="cust_list">
				</ul>
				<div class="txt">
					<p>선착순 혜택 다운로드 완료시 자동으로 비노출 되며, 선정된 고객에게만 혜택이 노출됩니다.</p>
				</div>
			</div>
      
      
			<div class="none">
				STEP2 선택그룹 외 추가 고객 노출 선택 시 공개 범위를 선택하실 수 있습니다.
			</div>
      
      
			<div class="app_cntImg"><img src="../../img/web/icon/app_img.png" alt="앱픽토그램"></div>
		</div>
		<div class="lms_wrap box">
			<p class="tit">문자 전송<span>* 문자 발송일을 선택 하실 수 있습니다. 발송일에 따라 접근 고객 수가 달라집니다.</span> </p>
			<div class="lms_cntTop">
				<ul>
					<li class="lmsbtn1">
						문자 (LMS) 전송하기
					</li>
					<li class="lmsbtn2">
						문자 (LMS) 전송안함
					</li>
				</ul>
			</div>
			<div class="lms_cntBtm">
				<p>발송 일자 별 접근 가능 고객<span>* 문자수신 미동의 고객과 타 브랜드에서 최근 접근한 고객이 제외됩니다.</span></p>
				<ul id="tran_dt_list">
				</ul>
			</div>
			<div class="lms_cntImg"><img src="../../img/web/icon/message_img.png" alt=""></div>
			<a href="javascript:javascript:layerPopOpen('layer_other');" class="lms_btn">다른 일자 <br>확인하기</a>
		</div>
	</div>
  
  
   <!-- 다른 일자 확인하기 레이어 팝업 시작 -->
  <div class="layer" id="layer_other">
    <p class="tit">발송 가능일 외 접근 가능 고객<a href="javascript:popupClose('layer_other');" class="btn_close">닫기</a></p>
    <div class="other_client">
      <p class="info_txt">행사 시작일 D+7, D-7까지 예상 고객이 표시됩니다.<br>다른 일자에 발송을 원하시는 경우, STEP1에서 행사일자를 수정해주세요.</p>
      <ul id="other_cal">
      </ul>
    </div>
    <div class="pop_btn">
      <a href="javascript:popupClose('layer_other');" class="btn_cancel">닫기</a>
    </div>
  </div>
  <!-- 다른 일자 확인하기 레이어 팝업 종료 -->
  
  
	<div class="btn_box">
		<a href="javascript:preStep04();" class="btn_prev">이전단계</a>
		<a href="javascript:nextStep04();" class="btn_next">다음단계</a>
	</div>
</div>