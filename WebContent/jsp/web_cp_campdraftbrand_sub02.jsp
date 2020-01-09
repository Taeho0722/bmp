<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<script type="text/javascript">
var txtHtml = "";
var sel_store_cd = "";
var sel_store_nm = "";

var view_flag = "Y";
 
//컨텐츠 중복 제거
var dstic_cd1_exit = "";
var dstic_cd2_exit = "";
var dstic_cd3_exit = "";

 
//TM Start ===============================================================================================

	
//행사정보-------------------------
var store_cd = "";//점포코드
var tget_store_cd = "";//선택한 점포코드
var store_nm = "";//점포명
var camp_desc = "";//행사설명
var camp_str_dt = "";//행사시작일자
var camp_end_dt = "";//행사종료일자
var evt_flr = "";//행사장소
var bran_offer1_dstic_cd = "";//컨텐츠선택_첫번째컨텐츠코드
var bran_offer2_dstic_cd = "";//컨텐츠선택_두번째컨텐츠
var bran_offer3_dstic_cd = "";//컨텐츠선택_세번째컨텐츠
var bran_offer1_dstic_nm = "";//컨텐츠선택_첫번째컨텐츠명
var bran_offer2_dstic_nm = "";//컨텐츠선택_두번째컨텐츠명
var bran_offer3_dstic_nm = "";//컨텐츠선택_세번째컨텐츠명
var bran_offer1_desc = "";//컨텐츠설명_첫번째컨텐츠
var bran_offer2_desc = "";//컨텐츠설명_두번째컨텐츠
var bran_offer3_desc = "";//컨텐츠설명_세번째컨텐츠
var bran_offer1_prestat = "";//유의사항_첫번째컨텐츠
var bran_offer2_prestat = "";//유의사항_두번째컨텐츠
var bran_offer3_prestat = "";//유의사항_세번째컨텐츠
var pay_cd = "";//결재수단코드
var shn_crd_evt_yn = "N";//고정
var input_camp_nm = "";


var mainTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'selectCampInfo', '1', '\@#%');
mainTm.setAddDataField('CAMP_ID', camp_id);
mainTm.returnlist('CAMP_NM'+//행사명
									';INTG_BRAN_CD'+//통합브랜드코드
									';INTG_BRAN_NM'+//통합브랜드명
									';STORE_CD'+//점포코드
									';STORE_NM'+//점포명
									';EVT_FLR'+//층정보
									';CAMP_DESC'+//행사설명
									';CAMP_STR_DT'+//행사시작일자
									';CAMP_END_DT'+//행사종료일자
									';BRAN_OFFER1_DSTIC_CD'+//컨텐츠선택_첫번째컨텐츠코드
									';BRAN_OFFER2_DSTIC_CD'+//컨텐츠선택_두번째컨텐츠
									';BRAN_OFFER3_DSTIC_CD'+//컨텐츠선택_세번째컨텐츠
									';BRAN_OFFER1_DSTIC'+//컨텐츠선택_첫번째컨텐츠명
									';BRAN_OFFER2_DSTIC'+//컨텐츠선택_두번째컨텐츠명
									';BRAN_OFFER3_DSTIC'+//컨텐츠선택_세번째컨텐츠명
									';BRAN_OFFER1_DESC'+//컨텐츠설명_첫번째컨텐츠
									';BRAN_OFFER2_DESC'+//컨텐츠설명_두번째컨텐츠
									';BRAN_OFFER3_DESC'+//컨텐츠설명_세번째컨텐츠
									';BRAN_OFFER1_PRESTAT'+//
									';BRAN_OFFER2_PRESTAT'+//
									';BRAN_OFFER3_PRESTAT'+//
									';BMPEVT_TY_CD'+//프로모션유형
									';MSG_SND_YN'+//메시지발송여부(Y/N)
									';CTRTDOC_NCSS_YN'+//공동판촉약정서필수체크 여부(Y/N)
									';CAMP_DRFT_EMP'+//등록자 아이디
									';PAY_CD');//결재수단코드
mainTm.execute(null, false);

camp_nm = mainTm.ElementValue('CAMP_NM');
intg_bran_cd = mainTm.ElementValue('INTG_BRAN_CD');
intg_bran_nm = mainTm.ElementValue('INTG_BRAN_NM');
store_cd = mainTm.ElementValue('STORE_CD');
store_nm = mainTm.ElementValue('STORE_NM');
evt_flr = mainTm.ElementValue('EVT_FLR');
camp_desc = mainTm.ElementValue('CAMP_DESC');
camp_str_dt = mainTm.ElementValue('CAMP_STR_DT');
camp_end_dt = mainTm.ElementValue('CAMP_END_DT');
bran_offer1_dstic_cd = mainTm.ElementValue('BRAN_OFFER1_DSTIC_CD');
bran_offer2_dstic_cd = mainTm.ElementValue('BRAN_OFFER2_DSTIC_CD');
bran_offer3_dstic_cd = mainTm.ElementValue('BRAN_OFFER3_DSTIC_CD');
bran_offer1_dstic_nm = mainTm.ElementValue('BRAN_OFFER1_DSTIC');
bran_offer2_dstic_nm = mainTm.ElementValue('BRAN_OFFER2_DSTIC');
bran_offer3_dstic_nm = mainTm.ElementValue('BRAN_OFFER3_DSTIC');
bran_offer1_desc = mainTm.ElementValue('BRAN_OFFER1_DESC');
bran_offer2_desc = mainTm.ElementValue('BRAN_OFFER2_DESC');
bran_offer3_desc = mainTm.ElementValue('BRAN_OFFER3_DESC');
bran_offer1_prestat = mainTm.ElementValue('BRAN_OFFER1_PRESTAT');
bran_offer2_prestat = mainTm.ElementValue('BRAN_OFFER2_PRESTAT');
bran_offer3_prestat = mainTm.ElementValue('BRAN_OFFER3_PRESTAT');
if(bmpevtTy_cd == ""){bmpevtTy_cd = bmpevtTy_cd = mainTm.ElementValue('BMPEVT_TY_CD');}
pay_cd = mainTm.ElementValue('PAY_CD');
chk_msg_snd_yn = mainTm.ElementValue('MSG_SND_YN');
reg_id = mainTm.ElementValue('CAMP_DRFT_EMP');
if(ctrtdoc_ncss_yn == ""){ctrtdoc_ncss_yn = mainTm.ElementValue('CTRTDOC_NCSS_YN');}
if(reg_id == ""){reg_id = user_id;}
mainTm.clear();	


//복사하기 일때 
if(copy_yn == "Y"){
	var copyInfoTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'selectCampInfo', '1', '\@#%');
	copyInfoTm.setAddDataField('CAMP_ID', c_camp_id);//복사 할 행사 아이디
	copyInfoTm.returnlist('CAMP_NM'+//행사명
										';CAMP_DESC'+//행사설명
										';BRAN_OFFER1_DSTIC_CD'+//컨텐츠선택_첫번째컨텐츠코드
										';BRAN_OFFER2_DSTIC_CD'+//컨텐츠선택_두번째컨텐츠
										';BRAN_OFFER3_DSTIC_CD'+//컨텐츠선택_세번째컨텐츠
										';BRAN_OFFER1_DSTIC'+//컨텐츠선택_첫번째컨텐츠명
										';BRAN_OFFER2_DSTIC'+//컨텐츠선택_두번째컨텐츠명
										';BRAN_OFFER3_DSTIC'+//컨텐츠선택_세번째컨텐츠명
										';BRAN_OFFER1_DESC'+//컨텐츠설명_첫번째컨텐츠
										';BRAN_OFFER2_DESC'+//컨텐츠설명_두번째컨텐츠
										';BRAN_OFFER3_DESC'+//컨텐츠설명_세번째컨텐츠
										';BRAN_OFFER1_PRESTAT'+//
										';BRAN_OFFER2_PRESTAT'+//
										';BRAN_OFFER3_PRESTAT');//결재수단코드
	copyInfoTm.execute(null, false);
	camp_nm = copyInfoTm.ElementValue('CAMP_NM');
	camp_desc = copyInfoTm.ElementValue('CAMP_DESC');
	bran_offer1_dstic_cd = copyInfoTm.ElementValue('BRAN_OFFER1_DSTIC_CD');
	bran_offer2_dstic_cd = copyInfoTm.ElementValue('BRAN_OFFER2_DSTIC_CD');
	bran_offer3_dstic_cd = copyInfoTm.ElementValue('BRAN_OFFER3_DSTIC_CD');
	bran_offer1_dstic_nm = copyInfoTm.ElementValue('BRAN_OFFER1_DSTIC');
	bran_offer2_dstic_nm = copyInfoTm.ElementValue('BRAN_OFFER2_DSTIC');
	bran_offer3_dstic_nm = copyInfoTm.ElementValue('BRAN_OFFER3_DSTIC');
	bran_offer1_desc = copyInfoTm.ElementValue('BRAN_OFFER1_DESC');
	bran_offer2_desc = copyInfoTm.ElementValue('BRAN_OFFER2_DESC');
	bran_offer3_desc = copyInfoTm.ElementValue('BRAN_OFFER3_DESC');
	bran_offer1_prestat = copyInfoTm.ElementValue('BRAN_OFFER1_PRESTAT');
	bran_offer2_prestat = copyInfoTm.ElementValue('BRAN_OFFER2_PRESTAT');
	bran_offer3_prestat = copyInfoTm.ElementValue('BRAN_OFFER3_PRESTAT');
	
	//복사하기 전 선택한 점포, 층정보 설정
	if(s_store_cd != ""){store_cd = s_store_cd;}
	if(s_store_nm != ""){store_nm = s_store_nm;}
	if(s_evt_flr != ""){evt_flr = s_evt_flr;} 
		
	copyInfoTm.clear();	
}



//매장 정보 조회-------------------------
//행사정보가 등록 되기전 조회
var usr_cls = "";

var storeInfoTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'selectStoreInfo', '1', '\@#%');
storeInfoTm.setAddDataField('USER_ID', user_id);
storeInfoTm.setAddDataField('MD_CD', md_cd);
storeInfoTm.returnlist('USR_CLS'+//1:일반협력사, 4:샵마스터
                  		 ';INTG_BRAN_CD'+//통합브랜드코드
                  		 ';INTG_BRAN_NM'+//통합브랜드명
                  		 ';EVT_FLR'+//층정보
                  		 ';STORE_CD'+//점포코드
                  		 ';STORE_NM');//점포명
storeInfoTm.execute(null, false);

usr_cls = storeInfoTm.ElementValue('USR_CLS');
if(intg_bran_cd == ""){intg_bran_cd = storeInfoTm.ElementValue('INTG_BRAN_CD');}
if(intg_bran_nm == ""){intg_bran_nm = storeInfoTm.ElementValue('INTG_BRAN_NM');}
if(store_cd == ""){store_cd = storeInfoTm.ElementValue('STORE_CD');}
if(store_nm == ""){store_nm = storeInfoTm.ElementValue('STORE_NM');}
if(evt_flr == ""){evt_flr = storeInfoTm.ElementValue('EVT_FLR');}
storeInfoTm.clear();



//MD별 점포 조회-------------------------
var storeTm = new oza_TMHandler('com.obzen.bmp.ColBMPComm', 'selectStoreMdMapping', '0', '\@#%');
storeTm.setAddDataField('MD_CD', md_cd);
storeTm.setAddDataField('USERID', user_id);
storeTm.execute(null, false);

var storeTmResult = storeTm.getResult();
var storeTmResult_json = "";
if(storeTmResult != ""){
	storeTm_json = JSON.parse(storeTmResult);
}
storeTm.clear();




//첫번째컨텐츠 목록 조회-------------------------
var dsticCd1Tm = new oza_TMHandler('com.obzen.bmp.ColBMPComm', 'selectDsticCd', '0', '\@#%');
dsticCd1Tm.execute(null, false);

var dsticCd1TmResult = dsticCd1Tm.getResult();
var dsticCd1TmResult_json = "";
if(dsticCd1TmResult != ""){
	dsticCd1Tm_json = JSON.parse(dsticCd1TmResult);
}
dsticCd1Tm.clear();


//두번째컨텐츠 목록 조회-------------------------
var dsticCd2Tm = new oza_TMHandler('com.obzen.bmp.ColBMPComm', 'selectDsticCd', '0', '\@#%');
dsticCd2Tm.execute(null, false);

var dsticCd2TmResult = dsticCd2Tm.getResult();
var dsticCd2TmResult_json = "";
if(dsticCd2TmResult != ""){
	dsticCd2Tm_json = JSON.parse(dsticCd2TmResult);
}
dsticCd2Tm.clear();


//세번째컨텐츠 목록 조회-------------------------
var dsticCd3Tm = new oza_TMHandler('com.obzen.bmp.ColBMPComm', 'selectDsticCd', '0', '\@#%');
dsticCd3Tm.execute(null, false);
var dsticCd3TmResult = dsticCd3Tm.getResult();
var dsticCd3TmResult_json = "";
if(dsticCd3TmResult != ""){
	dsticCd3Tm_json = JSON.parse(dsticCd3TmResult);
}
dsticCd3Tm.clear();


//캘린더 데이터 조회-------------------------
var calTm = new oza_TMHandler('com.obzen.bmp.ColCampReg', 'selectCardEvtCalWeb', '0', '\@#%');
calTm.setAddDataField('STORE_CD', store_cd);
calTm.execute(null, false);
var calTmResult = calTm.getResult();
var calTm_json = "";
if(calTmResult != ""){
	calTm_json = JSON.parse(calTmResult);
}
calTm.clear();


//TM End =================================================================================================	


//화면 로드 시 실행
$(document).ready(function() {
	//$('html, body').animate({scrollTop: $('#web_cmp_content').offset().top}, 'fast');
	screenLog("조회", "web_cp_campdraftbrand_sub02", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>행사정보입력",get_client_ip);//화면 로그(공통)
	
	//상단 스타일 재적용
	//문자 발송 여부 때문에 실행
	styleTop();
	
	 
	storeList();
	dsticCdList("1",bran_offer1_dstic_cd,bran_offer2_dstic_cd,bran_offer3_dstic_cd);//첫번째컨텐츠선택목록조회
	dsticCdList("2",bran_offer1_dstic_cd,bran_offer2_dstic_cd,bran_offer3_dstic_cd);//두번째컨텐츠선택목록조회
	dsticCdList("3",bran_offer1_dstic_cd,bran_offer2_dstic_cd,bran_offer3_dstic_cd);//세번째컨텐츠선택목록조회
	dsticCheck();//체크 및 사용여부 
	
	
	
	//행사기간 선택
	$("#camp_str_dt").datepicker({
		dateFormat: 'yy-mm-dd' //Input Display Format 변경
        ,showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
        ,showMonthAfterYear:true //년도 먼저 나오고, 뒤에 월 표시
        ,changeYear: true //콤보박스에서 년 선택 가능
        ,changeMonth: true //콤보박스에서 월 선택 가능                
        ,showOn: "both" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
        ,buttonImage: "../../img/web/icon/ic_calendar2.png" //버튼 이미지 경로
        ,buttonImageOnly: true //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
        ,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 텍스트
        ,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
        ,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
        ,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트
        ,minDate: "1D" //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
        
    });
	
	
	$("#camp_end_dt").datepicker({
		dateFormat: 'yy-mm-dd' //Input Display Format 변경
        ,showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
        ,showMonthAfterYear:true //년도 먼저 나오고, 뒤에 월 표시
        ,changeYear: true //콤보박스에서 년 선택 가능
        ,changeMonth: true //콤보박스에서 월 선택 가능                
        ,showOn: "both" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
        ,buttonImage: "../../img/web/icon/ic_calendar2.png" //버튼 이미지 경로
        ,buttonImageOnly: true //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
        ,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 텍스트
        ,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
        ,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
        ,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트
        ,minDate: "1D" //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
        
    });
	
	
	//값 설정
	$("#camp_nm").val(camp_nm);
	$("#input_camp_nm").val(camp_nm);
	$("#intg_bran_cd").val(intg_bran_cd);
	$("#intg_bran_nm").val(intg_bran_nm);
	$("#tget_store_cd").val(store_cd);
	$("#evt_flr").val(evt_flr);
	$("#camp_desc").val(camp_desc);
	$("#camp_str_dt").val(setValidDate(camp_str_dt));
	$("#camp_end_dt").val(setValidDate(camp_end_dt));
	$("#bran_offer1_dstic_cd").val(bran_offer1_dstic_cd);
	$("#bran_offer2_dstic_cd").val(bran_offer2_dstic_cd);
	$("#bran_offer3_dstic_cd").val(bran_offer3_dstic_cd);
	$("#bran_offer1_desc").val(bran_offer1_desc);
	$("#bran_offer2_desc").val(bran_offer2_desc);
	$("#bran_offer3_desc").val(bran_offer3_desc);
	$("#bran_offer1_prestat").val(bran_offer1_prestat);
	$("#bran_offer2_prestat").val(bran_offer2_prestat);
	$("#bran_offer3_prestat").val(bran_offer3_prestat);
	
	$("#brand_nm").html(intg_bran_nm + "<span>(" + intg_bran_cd +")</span>");
	$("#store_nm").text(store_nm);
	$("#evt_flr_nm").text(evt_flr);
	
	
	if(camp_str_dt == ""){$('#camp_str_dt').datepicker('setDate', '+1D');}//최초 내일로 설정
	if(camp_end_dt == ""){$('#camp_end_dt').datepicker('setDate', '+1D');}//최초 내일로 설정
	
	
	//disabled
	if(mod_flag == "N" || (user_id != reg_id)){
		$("#input_camp_nm").attr("disabled",true);
		$("#camp_desc").attr("disabled",true);
		$("#camp_str_dt").attr("disabled",true);
		$("#camp_end_dt").attr("disabled",true);
		$('#camp_str_dt').datepicker('option', 'disabled', true);
		$('#camp_end_dt').datepicker('option', 'disabled', true);
		$("#bran_offer1_dstic_cd").attr("disabled",true);
		$("#bran_offer1_desc").attr("disabled",true);
		$("#bran_offer2_dstic_cd").attr("disabled",true);
		$("#bran_offer2_desc").attr("disabled",true);
		$("#bran_offer3_dstic_cd").attr("disabled",true);
		$("#bran_offer3_desc").attr("disabled",true);
		$("#bran_offer1_prestat").attr("disabled",true);
		$("#bran_offer2_prestat").attr("disabled",true);
		$("#bran_offer3_prestat").attr("disabled",true);
		
		$("#input_camp_nm").val(camp_nm);
		
		$("#store_nm_button").css("display","none");
		$("#evt_flr_nm_button").css("display","none");
		
		$("#cal_button").css("cursor","default");
		$(".btn_mview").css("cursor","default");
		$(".btn_next").css("cursor","default");
	}
	

	
	//행사종료기간 체크 
	$("#camp_str_dt").on("propertychange change keyup paste input", function() {
	    view_flag = "N";
		
	    var str_dt = $(this).val();
		  
		  if(str_dt != ""){
			  if(str_dt.length > 7){
				  setValidDate(str_dt);				  
			  }else{
				  return;
			  }
			}
		  
		  
		  str_dt = sDelHypn(str_dt);
		  
		  //오늘 날짜
		  var todate = new Date();
		  var month   = todate.getMonth()+1; 
		  var day     = todate.getDate();
		  if(month.toString().length == 1) {
		       month = '0'+month;
		  }
		  if(day.toString().length == 1) {
		       day = '0'+day;
		  }   
		  var dateVal = todate.getFullYear()+""+month+""+day;//현재일
		  var toCalDate = getCalDate(dateVal,str_dt ,"D");

		  if(toCalDate < 3){
			  cmdMessage(0,"현재날짜를 기준으로 1일 후만 입력 가능합니다.");
			  $('#camp_str_dt').datepicker('setDate', '+1D');
			  $(this).focus();
			  return;
		  }
	});
	
	
	
	//행사종료기간 체크 
	$("#camp_end_dt").on("propertychange change keyup paste input", function() {
	    view_flag = "N";
		
	    var str_dt = $("#camp_str_dt").val();
		  var end_dt = $(this).val();
		  
		  if(str_dt != ""){
			  if(str_dt.length > 7){
				  setValidDate(str_dt);				  
			  }else{
				  return;
			  }
			}
		  
		  if(end_dt != ""){
			  if(end_dt.length > 7){
				  setValidDate(end_dt);				  
			  }else{
				  return;
			  }
			}
		  
		  
		  str_dt = sDelHypn(str_dt);
		  end_dt = sDelHypn(end_dt);
		  
		  
			//오늘 날짜
		  var todate = new Date();
		  var month   = todate.getMonth()+1; 
		  var day     = todate.getDate();
		  if(month.toString().length == 1) {
		       month = '0'+month;
		  }
		  if(day.toString().length == 1) {
		       day = '0'+day;
		  }   
		  var dateVal = todate.getFullYear()+""+month+""+day;//현재일	
		  
		  var toCalDate2 = getCalDate(dateVal,end_dt ,"D");

		  if(toCalDate2 < 3){
			  cmdMessage(0,"현재날짜를 기준으로 1일 후만 입력 가능합니다.");
			  $('#camp_end_dt').datepicker('setDate', '+1D');
			  $(this).focus();
			  return;
		  }
		  
		  
			var toCalDate = getCalDate(str_dt,end_dt ,"D");
			
			//행사시작일자 체크
		  if(toCalDate < 1){
			  cmdMessage(0,"행사종료일자를 확인하세요");
			  //$('#camp_str_dt').datepicker('setDate', '+1D');
			  $(this).focus();
			  return false;
		  }
			
		  if(str_dt != "" && end_dt != ""){
				//행사기간 체크
				if(!dateCheck()){return;}  
		  }
	});
	
	
	//임직원 유형일때
	if(bmpevtTy_cd == "3"){
		txtHtml = "";
		txtHtml += "<p>일부 품목 제외</p>";
		txtHtml += "<p>다른 사은행사와 중복 가능</p>";
		txtHtml += "<p>당일 구매 영수증에 한함</p>";
		txtHtml += "<p>선착순 증정으로 조기 소진 예정</p>";
		txtHtml += "<p>당첨에 한하여 개별 연락 예정</p>";
		txtHtml += "<p>1인 1회에 한함</p>";
		txtHtml += "<p>임직원 에누리 추가적용 불가능</p>";
		txtHtml += "<p>교환환불 불가</p>";
	}else{
		txtHtml = "";
		txtHtml += "<p>일부 품목 제외</p>";
		txtHtml += "<p>다른 사은행사와 중복 가능</p>";
		txtHtml += "<p>당일 구매 영수증에 한함</p>";
		txtHtml += "<p>선착순 증정으로 조기 소진 예정</p>";
		txtHtml += "<p>당첨에 한하여 개별 연락 예정</p>";
		txtHtml += "<p>1인 1회에 한함</p>";
	}
	
	$("#note_txt").html(txtHtml);
	
	
	
	/*
	//행사명 체크 
	$("#input_camp_nm").on("propertychange change keyup paste input", function() {
		inputCheck('50',  $(this).val(), 'input_camp_nm');
	});
	
	
	//행사설명 체크 
	$("#camp_desc").on("propertychange change keyup paste input", function() {
		inputCheck('1000',  $(this).val(), 'camp_desc');
	});
	
	
	//층정보 체크 
	$("#input_evt_flr_nm").on("propertychange change keyup paste input", function() {
		inputCheck('20',  $(this).val(), 'input_evt_flr_nm');
	});
	
	//브랜드행사 설명 체크 
	$("#bran_offer1_desc").on("propertychange change keyup paste input", function() {
		inputCheck('80',  $(this).val(), 'bran_offer1_desc');
	});
	
	
	//두번째컨텐츠 설명 체크 
	$("#bran_offer2_desc").on("propertychange change keyup paste input", function() {
		inputCheck('80',  $(this).val(), 'bran_offer2_desc');
	});
	
	
	//세번째컨텐츠 설명 체크 
	$("#bran_offer3_desc").on("propertychange change keyup paste input", function() {
		inputCheck('80',  $(this).val(), 'bran_offer3_desc');
	});
	*/
});






/*===============================================================
점포목록
===============================================================*/
function storeList(){
  
  var storeHtml = "";
  var classType = "";
  var p_id = "";
  var cursorType = "";
  
  for(var i=0; i<storeTm_json.length; i++) {
	  
	  p_id = "store_sel_p"+i;
	  
	  if(store_cd == storeTm_json[i].CDM_CD){classType = "on";}else{classType = "";}
	  
	  if(storeTm_json[i].MD_STORE == "1"){
			if(mod_flag == "N"){cursorType = "default";}else{cursorType = "pointer";}
		  
		  storeHtml += "<p id='"+p_id+"' class='"+classType+"' style='cursor:"+cursorType+"' onclick=\"javascript:selectCode('1', '"+p_id+"' , '"+storeTm_json[i].CDM_CD+"', '"+storeTm_json[i].CDM_CD_NM+"','"+storeTm_json[i].MD_STORE+"');\">"+storeTm_json[i].CDM_CD_NM+"</p>";
	  }
	}
  $("#store").html(storeHtml);
}


/*===============================================================
코드 선택
===============================================================*/
function selectCode(flag, id, cdm_cd, cdm_nm, md_store){
  
  if(mod_flag == "N"){return;}
  if(user_id != reg_id){return;}
  
  if(flag == "1" && md_store == "1"){
	  
	  sel_store_cd = cdm_cd;
		sel_store_nm = cdm_nm;
		
	  $("#store p").removeClass("on");
	  $("#"+id).addClass("on");
	  
  	
  	
  }
}	 
  
  
  
/*===============================================================
컨텐츠 목록 조회
===============================================================*/
function dsticCdList(flag, val1, val2, val3){
  var innerHtml = "";
  
  var innerId = "sel_dstic_cd"+flag;
  var selId = "bran_offer"+flag+"_dstic_cd";
  var optionStr = "선택안함";
  var data;
  
  
  dstic_cd1_exit=val1;
  dstic_cd2_exit=val2;
  dstic_cd3_exit=val3;
  
  
  //if(flag == "1"){optionStr = "브랜드 행사 종류를 선택해주세요."; data=dsticCd1Tm_json;}
  //if(flag == "2"){optionStr = "할인 컨텐츠 종류를 선택해주세요."; data=dsticCd2Tm_json;}
  //if(flag == "3"){optionStr = "증정 컨텐츠 종류를 선택해주세요."; data=dsticCd3Tm_json;}
  
  if(flag == "1"){optionStr = "선택안함"; data=dsticCd1Tm_json;}
  if(flag == "2"){optionStr = "선택안함"; data=dsticCd2Tm_json;}
  if(flag == "3"){optionStr = "선택안함"; data=dsticCd3Tm_json;}
  
  
  innerHtml += "<select id='"+selId+"' onchange=\"javascript:dsticChange('"+flag+"', this.value, this.options[this.selectedIndex].text);\">";
  innerHtml += "<option value=''>"+optionStr+"</option>";
  
  for(var i=0; i < data.length; i++) {
	  innerHtml += "<option value='"+data[i].CDM_CD+"'>"+data[i].CDM_CD_NM+"</option>";
	  
	  /*
	  if(flag == 1){
		  if(dstic_cd2_exit != "" && dstic_cd2_exit == data[i].CDM_CD){innerHtml += "";}
		  else if(dstic_cd3_exit != "" && dstic_cd3_exit == data[i].CDM_CD){innerHtml += "";}
		  else{innerHtml += "<option value='"+data[i].CDM_CD+"'>"+data[i].CDM_CD_NM+"</option>";}
		}
	  
	  if(flag == 2){
		  if(dstic_cd1_exit != "" && dstic_cd1_exit == data[i].CDM_CD){innerHtml += "";}
		  else if(dstic_cd3_exit != "" && dstic_cd3_exit == data[i].CDM_CD){innerHtml += "";}
		  else{innerHtml += "<option value='"+data[i].CDM_CD+"'>"+data[i].CDM_CD_NM+"</option>";}
		}
	  
	  
	  if(flag == 3){
		  if(dstic_cd1_exit != "" && dstic_cd1_exit == data[i].CDM_CD){innerHtml += "";}
		  else if(dstic_cd2_exit != "" && dstic_cd2_exit == data[i].CDM_CD){innerHtml += "";} 
		  else{innerHtml += "<option value='"+data[i].CDM_CD+"'>"+data[i].CDM_CD_NM+"</option>";}
		}
	  */
   
  }
  
  innerHtml += "</select>";
  
  
  $("#"+innerId).html(innerHtml);
  /*
  bran_offer1_dstic_cd = dstic_cd1_exit;
  bran_offer2_dstic_cd = dstic_cd2_exit;
  bran_offer3_dstic_cd = dstic_cd3_exit;
  
  $("#bran_offer1_dstic_cd").val(dstic_cd1_exit);
  $("#bran_offer2_dstic_cd").val(dstic_cd2_exit);
  $("#bran_offer3_dstic_cd").val(dstic_cd3_exit);
  */
}


/*===============================================================
셀렉트 박스 변경
===============================================================*/
function dsticChange(sel_flag, sel_val, sel_txt){
	view_flag = "N";
	
	if(sel_flag == "1"){
		
		if(sel_val == ""){
			
			if(cmdMessage(1, "선택및 입력한 모든 컨텐츠 정보가 초기화 됩니다.\n진행 하시겠습니까?") == false){
				return;
			}
			
			$("#bran_offer1_dstic_cd").val("");
			$("#bran_offer2_dstic_cd").val("");
			$("#bran_offer3_dstic_cd").val("");
			$("#bran_offer1_desc").val("");
			$("#bran_offer2_desc").val("");
			$("#bran_offer3_desc").val("");
			$("#bran_offer1_prestat").val("");
			$("#bran_offer2_prestat").val("");
			$("#bran_offer3_prestat").val("");
			$("#benefit_check1").removeClass("on");
			$("#benefit_check2").removeClass("on");
			$("#benefit_check3").removeClass("on");
			return;
		}
		
		
		if(sel_val == $("#bran_offer2_dstic_cd").val() && sel_val != ""){
			cmdMessage(0,"중복 선택 입니다.");
			$("#bran_offer1_dstic_cd").val("");
			return;
		}
		
		if(sel_val == $("#bran_offer3_dstic_cd").val() && sel_val != ""){
			cmdMessage(0,"중복 선택 입니다.");
			$("#bran_offer1_dstic_cd").val("");
			return;
		}
		
		bran_offer1_dstic_nm = sel_txt;
	}
	
	if(sel_flag == "2"){
		
		if(sel_val == ""){
			if(cmdMessage(1, "두번째/세번째 컨텐츠 정보가 초기화 됩니다.\n진행 하시겠습니까?") == false){
				return;
			}
			
			$("#bran_offer2_dstic_cd").val("");
			$("#bran_offer3_dstic_cd").val("");
			$("#bran_offer2_desc").val("");
			$("#bran_offer3_desc").val("");
			$("#bran_offer2_prestat").val("");
			$("#bran_offer3_prestat").val("");
			$("#benefit_check2").removeClass("on");
			$("#benefit_check3").removeClass("on");
			return;
		}
		
		
		if($("#bran_offer1_dstic_cd").val() == ""){cmdMessage(0,"첫번째컨텐츠을 선택하세요.");$("#bran_offer2_dstic_cd").val("");return;}
		
		if($("#bran_offer1_dstic_cd").val() == sel_val && sel_val != ""){
			cmdMessage(0,"중복 선택 입니다.");
			$("#bran_offer2_dstic_cd").val("");
			return;
		}
		
		if(sel_val == $("#bran_offer3_dstic_cd").val() && sel_val != ""){
			cmdMessage(0,"중복 선택 입니다.");
			$("#bran_offer2_dstic_cd").val("");
			return;
		}
		
		bran_offer2_dstic_nm = sel_txt;
	}
	
	if(sel_flag == "3"){
		
		if(sel_val == ""){
			if(cmdMessage(1, "세번째 컨텐츠 정보가 초기화 됩니다.\n진행 하시겠습니까?") == false){
				return;
			}
			
			$("#bran_offer3_dstic_cd").val("");
			$("#bran_offer3_desc").val("");
			$("#bran_offer3_prestat").val("");
			$("#benefit_check3").removeClass("on");
			return;
		}
		
		
		if($("#bran_offer1_dstic_cd").val() == ""){cmdMessage(0,"첫번째컨텐츠을 선택하세요.");$("#bran_offer3_dstic_cd").val("");return;}
		if($("#bran_offer2_dstic_cd").val() == ""){cmdMessage(0,"두번째컨텐츠을 선택하세요.");$("#bran_offer3_dstic_cd").val("");return;}
		
		if(sel_val == $("#bran_offer2_dstic_cd").val() && sel_val != ""){
			cmdMessage(0,"중복 선택 입니다.");
			$("#bran_offer3_dstic_cd").val("");
			return;
		}
		
		if($("#bran_offer1_dstic_cd").val() == sel_val && sel_val != ""){
			cmdMessage(0,"중복 선택 입니다.");
			$("#bran_offer3_dstic_cd").val("");
			return;
		}
		
		bran_offer3_dstic_nm = sel_txt;
	}
	
	
	if(sel_val != ""){$("#benefit_check"+sel_flag).addClass("on");}
	else{$("#benefit_check"+sel_flag).removeClass("on");}
	
	
	
	/*
	if(sel_flag == "1"){
		dsticCdList("1", sel_val,bran_offer2_dstic_cd,bran_offer3_dstic_cd);
		dsticCdList("2", sel_val,bran_offer2_dstic_cd,bran_offer3_dstic_cd);
		dsticCdList("3", sel_val,bran_offer2_dstic_cd,bran_offer3_dstic_cd);
	}
	
	
	if(sel_flag == "2"){
		dsticCdList("1", bran_offer1_dstic_cd,sel_val,bran_offer3_dstic_cd);
		dsticCdList("2", bran_offer1_dstic_cd,sel_val,bran_offer3_dstic_cd);
		dsticCdList("3", bran_offer1_dstic_cd,sel_val,bran_offer3_dstic_cd);
	}
	
	if(sel_flag == "3"){
		dsticCdList("1", bran_offer1_dstic_cd,bran_offer2_dstic_cd,sel_val);
		dsticCdList("2", bran_offer1_dstic_cd,bran_offer2_dstic_cd,sel_val);
		dsticCdList("3", bran_offer1_dstic_cd,bran_offer2_dstic_cd,sel_val);
	}
	*/
}



/*===============================================================
컨텐츠 선택 on/off, 사용여부 체크
===============================================================*/
function dsticCheck(){
	
	
	//사용안함으로 변경
	$("#benefit_tit1").css("cursor","default");
	$("#benefit_tit2").css("cursor","default");
	$("#benefit_tit3").css("cursor","default");
	
	
	
	if(bran_offer1_dstic_cd != ""){
		$("#benefit_check1").addClass("on");
		//$("#bran_offer1_dstic_cd").attr("disabled",false);
		//$("#bran_offer1_desc").attr("disabled",false);
	}else{
		$("#benefit_check1").removeClass("on");
		//$("#bran_offer1_dstic_cd").attr("disabled",true);
		//$("#bran_offer1_desc").attr("disabled",true);
	}
	
	
	if(bran_offer2_dstic_cd != ""){
		$("#benefit_check2").addClass("on");
		//$("#bran_offer2_dstic_cd").attr("disabled",false);
		//$("#bran_offer2_desc").attr("disabled",false);
	}else{
		$("#benefit_check2").removeClass("on");
		//$("#bran_offer2_dstic_cd").attr("disabled",true);
		//$("#bran_offer2_desc").attr("disabled",true);
	}
	
	
	if(bran_offer3_dstic_cd != ""){
		$("#benefit_check3").addClass("on");
		//$("#bran_offer3_dstic_cd").attr("disabled",false);
		//$("#bran_offer3_desc").attr("disabled",false);
	}else{
		$("benefit_check3").removeClass("on");
		//$("#bran_offer3_dstic_cd").attr("disabled",true);
		//$("#bran_offer3_desc").attr("disabled",true);
	}
	
	
	
	if(mod_flag == "N"){
		$("#benefit_tit1").css("cursor","default");
		$("#benefit_tit2").css("cursor","default");
		$("#benefit_tit3").css("cursor","default");
		
		$("#bran_offer1_dstic_cd").attr("disabled",true);
		$("#bran_offer1_desc").attr("disabled",true);
		$("#bran_offer2_dstic_cd").attr("disabled",true);
		$("#bran_offer2_desc").attr("disabled",true);
		$("#bran_offer3_dstic_cd").attr("disabled",true);
		$("#bran_offer3_desc").attr("disabled",true);
	}
	
	
	if(user_id != reg_id){
		$("#benefit_tit1").css("cursor","default");
		$("#benefit_tit2").css("cursor","default");
		$("#benefit_tit3").css("cursor","default");
		
		$("#bran_offer1_dstic_cd").attr("disabled",true);
		$("#bran_offer1_desc").attr("disabled",true);
		$("#bran_offer2_dstic_cd").attr("disabled",true);
		$("#bran_offer2_desc").attr("disabled",true);
		$("#bran_offer3_dstic_cd").attr("disabled",true);
		$("#bran_offer3_desc").attr("disabled",true);
	}
	
	
  /*
	$("#benefit_tit1").click(function() {
		if(mod_flag == "N"){return;}
		if(user_id != reg_id){return;}
		view_flag = "N";
		
		if($("#benefit_check1").hasClass("on")){
			$("#benefit_check1").removeClass("on");
			$("#bran_offer1_dstic_cd").attr("disabled",true);
			$("#bran_offer1_desc").attr("disabled",true);
			
			$("#bran_offer1_dstic_cd").val("");
			$("#bran_offer1_desc").val("");
		}else{
			$("#benefit_check1").addClass("on");	
			$("#bran_offer1_dstic_cd").attr("disabled",false);
			$("#bran_offer1_desc").attr("disabled",false);
		}
	});
	
	$("#benefit_tit2").click(function() {
		if(mod_flag == "N"){return;}
		if(user_id != reg_id){return;}
		view_flag = "N";
		
		if($("#benefit_check2").hasClass("on")){
			$("#benefit_check2").removeClass("on");
			$("#bran_offer2_dstic_cd").attr("disabled",true);
			$("#bran_offer2_desc").attr("disabled",true);
			
			$("#bran_offer2_dstic_cd").val("");
			$("#bran_offer2_desc").val("");
		}else{
			$("#benefit_check2").addClass("on");	
			$("#bran_offer2_dstic_cd").attr("disabled",false);
			$("#bran_offer2_desc").attr("disabled",false);
		}
	});
	
	
	$("#benefit_tit3").click(function() {
		if(mod_flag == "N"){return;}
		if(user_id != reg_id){return;}
		view_flag = "N";
		
		if($("#benefit_check3").hasClass("on")){
			$("#benefit_check3").removeClass("on");
			$("#bran_offer3_dstic_cd").attr("disabled",true);
			$("#bran_offer3_desc").attr("disabled",true);
			
			$("#bran_offer3_dstic_cd").val("");
			$("#bran_offer3_desc").val("");
		}else{
			$("#benefit_check3").addClass("on");
			$("#bran_offer3_dstic_cd").attr("disabled",false);
			$("#bran_offer3_desc").attr("disabled",false);
		}
	});
	*/
}

  
  
/*===============================================================
입력값 체크 
층정보 : 20
행사명 : 50
===============================================================*/
function inputCheck(byte_value, input_value, input_id){
	
	byte_value = parseInt(byte_value);
  view_flag = "N";
  
  if(byte_value < getByteLength(input_value)){ 
 		cmdMessage(0,"최대 "+byte_value+"Bytes를 넘을 수 없습니다.");
 		
 		$("#"+input_id).val(getByteVal(input_value,byte_value));
 		$("#"+input_id).focus();
 		
		return false; 
 	}
  
  
  
  if((byte_value/2) < input_value.length){ 
		cmdMessage(0,"최대 "+(byte_value/2)+"글자를 넘을 수 없습니다.");
		
		$("#"+input_id).val(getByteVal(input_value,(byte_value/2)));
		$("#"+input_id).focus();
		
		return false; 
	}
  
  
  
  $("#"+input_id).val(input_value);
  
  
  
  if(input_id == "bran_offer1_desc"){
	  if(input_value != ""){
		  $("#benefit_check1").addClass("on");
		}else{
			$("#benefit_check1").removeClass("on");
	  }
	}
  
  if(input_id == "bran_offer2_desc"){
	  if(input_value != ""){
		  if($("#bran_offer1_dstic_cd").val() == ""){cmdMessage(0,"첫번째컨텐츠을 선택하세요.");$("#bran_offer2_desc").val("");return;}
		  $("#benefit_check2").addClass("on");
		}else{
			$("#benefit_check2").removeClass("on");
	  }
	}
  
  if(input_id == "bran_offer3_desc"){
	  if(input_value != ""){
		  if($("#bran_offer1_dstic_cd").val() == ""){cmdMessage(0,"첫번째컨텐츠을 선택하세요.");$("#bran_offer3_desc").val("");return;}
		  if($("#bran_offer2_dstic_cd").val() == ""){cmdMessage(0,"두번째컨텐츠을 선택하세요.");$("#bran_offer3_desc").val("");return;}
		  $("#benefit_check3").addClass("on");
		}else{
			$("#benefit_check3").removeClass("on");
	  }
	}
  
  
  if(input_id == "bran_offer2_prestat"){
	  if(input_value != ""){
		  if($("#bran_offer1_dstic_cd").val() == ""){cmdMessage(0,"첫번째컨텐츠을 선택하세요.");$("#bran_offer2_prestat").val("");return;}
		  $("#benefit_check2").addClass("on");  
	  }else{
		  $("#benefit_check2").removeClass("on");
	  }
	}
  
  
  if(input_id == "bran_offer3_prestat"){
	  if(input_value != ""){
		  if($("#bran_offer1_dstic_cd").val() == ""){cmdMessage(0,"첫번째컨텐츠을 선택하세요.");$("#bran_offer3_prestat").val("");return;}
		  if($("#bran_offer2_dstic_cd").val() == ""){cmdMessage(0,"두번째컨텐츠을 선택하세요.");$("#bran_offer3_prestat").val("");return;}
		  $("#benefit_check3").addClass("on");  
	  }else{
		  $("#benefit_check3").removeClass("on");
	  }
	}
  
  
  view_flag = "N";
}




  
/*===============================================================
카드 행사 기간 체크
===============================================================*/
function dateCheck(chk_flag){
  
  if(mod_flag == "N"){return;}
  //if(user_id != reg_id){return;}
  
  
  if($("#tget_store_cd").val() == ""){
	  cmdMessage(0,"점포를 선택하세요.");
	  return false;
	}
  
  var str_dt = $("#camp_str_dt").val();
  var end_dt = $("#camp_end_dt").val();
	
  
  setValidDate(str_dt);
  setValidDate(end_dt);
  
  str_dt = sDelHypn(str_dt);
  end_dt = sDelHypn(end_dt);
	  
  //오늘 날짜
  var todate = new Date();
  var month   = todate.getMonth()+1; 
  var day     = todate.getDate();
  if(month.toString().length == 1) {
       month = '0'+month;
  }
  if(day.toString().length == 1) {
       day = '0'+day;
  }   
  var dateVal = todate.getFullYear()+""+month+""+day;//현재일	
  var toCalDate1,toCalDate2; 
  
  toCalDate1 = getCalDate(dateVal,str_dt ,"D");
  toCalDate2 = getCalDate(dateVal,end_dt ,"D");
  
  
  if(dateVal == str_dt){
	  cmdMessage(0,"행사시작일자를 확인하세요");$("#camp_str_dt").focus();
  	return false;
  }
  
  
  if(dateVal == end_dt){
	  cmdMessage(0,"행사종료일자를 확인하세요");$("#camp_end_dt").focus();
  	return false;
  }
  
  
  //행사시작일자 체크
  if(toCalDate1 < 1){
	  cmdMessage(0,"행사시작일자를 확인하세요");
		//오늘 날짜 설정
		$("#camp_str_dt").focus();
	  return false;
  }
  
  
	//행사종료일자 체크
  if(toCalDate2 < 1){
	  cmdMessage(0,"행사종료일자를 확인하세요");
		//오늘 날짜 설정
		$("#camp_end_dt").focus();
	  return false;
  }  
  
  var calDate = getCalDate(str_dt,end_dt ,"D");//시작일 보다 종료일이 작지 않도록 체크
  
  if(calDate < 1){
	  cmdMessage(0,"행사 기간을 확인 하세요.");
		//오늘 날짜 설정
		$("#camp_str_dt").focus();
	  return false;
  }  
  
  
  if(bmpevtTy_cd == "1"){
		//캠페인 정보 검색-------------------------
		var msg = "";
	  var flag = "";
		var evtDtCheckTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'selectCardEvtDtCheck', '1', '\@#%');
		evtDtCheckTm.setAddDataField('TGET_STORE_CD', $("#tget_store_cd").val());
		evtDtCheckTm.setAddDataField('CAMP_STR_DT', str_dt);
		evtDtCheckTm.setAddDataField('CAMP_END_DT', end_dt);
		evtDtCheckTm.returnlist('FLAG;LOGMSG');
		evtDtCheckTm.execute(null, false);
		flag = evtDtCheckTm.ElementValue('FLAG');//0:성공, 1:실패
		msg = evtDtCheckTm.ElementValue('LOGMSG');//최종 상태
		evtDtCheckTm.clear();
		
		//실패  
		if(flag == "1"){
		  cmdMessage(0,msg);
		  $("#camp_str_dt").focus();
		  return false;
		}  
	}
  
  
	//view_flag = "N";
	
	return true;
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
	
	
	if(popupN == "floor_popup"){
		$("#input_evt_flr_nm").val($("#evt_flr_nm").text());
	}
	
	
	if(popupN == "floor_popup2"){
		
		var input_evt_flr_nm = $.trim($("#input_evt_flr_nm").val()); 
		
		if(input_evt_flr_nm == ""){
			cmdMessage(2, "층정보");
			$("#input_evt_flr_nm").focus();
			return;
		}
		
		popupClose('floor_popup');
		$("#span_evt_flr_nm").text(input_evt_flr_nm);
	}
	
	
	
	//모바일 미리 보기
	if(popupN == "layer_mobView"){
		view_flag = "Y";
		
		var imgUrl = "";
		
		if(cate_cd = "01"){imgUrl = "<img src='../../img/web/icon/brand_ic18.png' alt='브랜드아이콘' />";}//화장품
		else if(cate_cd = "02"){imgUrl = "<img src='../../img/web/icon/brand_ic14.png' alt='브랜드아이콘' />";}//잡화
		else if(cate_cd = "03"){imgUrl = "<img src='../../img/web/icon/brand_ic08.png' alt='브랜드아이콘' />";}//모피
		else if(cate_cd = "04"){imgUrl = "<img src='../../img/web/icon/brand_ic11.png' alt='브랜드아이콘' />";}//아동
		else if(cate_cd = "05"){imgUrl = "<img src='../../img/web/icon/brand_ic10.png' alt='브랜드아이콘' />";}//식품
		else if(cate_cd = "06"){imgUrl = "<img src='../../img/web/icon/brand_ic01.png' alt='브랜드아이콘' />";}//F&B
		else if(cate_cd = "07"){imgUrl = "<img src='../../img/web/icon/brand_ic09.png' alt='브랜드아이콘' />";}//스포츠
		else if(cate_cd = "08"){imgUrl = "<img src='../../img/web/icon/brand_ic02.png' alt='브랜드아이콘' />";}//골프
		else if(cate_cd = "09"){imgUrl = "<img src='../../img/web/icon/brand_ic12.png' alt='브랜드아이콘' />";}//아웃도어
		else if(cate_cd = "10"){imgUrl = "<img src='../../img/web/icon/brand_ic05.png' alt='브랜드아이콘' />";}//디지털리빙
		else if(cate_cd = "11"){imgUrl = "<img src='../../img/web/icon/brand_ic17.png' alt='브랜드아이콘' />";}//홈,인테리어
		else if(cate_cd = "12"){imgUrl = "<img src='../../img/web/icon/brand_ic07.png' alt='브랜드아이콘' />";}//럭셔리뷰틱
		else if(cate_cd = "13"){imgUrl = "<img src='../../img/web/icon/brand_ic15.png' alt='브랜드아이콘' />";}//주얼리,시계
		else if(cate_cd = "14"){imgUrl = "<img src='../../img/web/icon/brand_ic16.png' alt='브랜드아이콘' />";}//캐주얼
		else if(cate_cd = "15"){imgUrl = "<img src='../../img/web/icon/brand_ic13.png' alt='브랜드아이콘' />";}//여성클랙식
		else if(cate_cd = "16"){imgUrl = "<img src='../../img/web/icon/brand_ic03.png' alt='브랜드아이콘' />";}//남성클랙식
		else if(cate_cd = "17"){imgUrl = "<img src='../../img/web/icon/brand_ic04.png' alt='브랜드아이콘' />";}//남성트랜디
		else if(cate_cd = "18"){imgUrl = "<img src='../../img/web/icon/brand_ic06.png' alt='브랜드아이콘' />";}//란제리
		
		
		$(".b_nm").html(imgUrl+intg_bran_nm);
		$("#mv_camp_nm").text($("#input_camp_nm").val());
		//$("#mv_camp_desc").text($("#camp_desc").val());//행사 설명 안나오게 처리
		$("#mv_store_nm").text($("#store_nm").text()+""+$("#evt_flr_nm").text());
		$("#mv_date").text($("#camp_str_dt").val()+" ~ "+$("#camp_end_dt").val());
		
		innerHtml +="<ul>";
		innerHtml +="<li>";
		innerHtml +="<strong>"+intg_bran_nm+"</strong>";
		
		var mo_desc = $("#camp_desc").val();
		if(mo_desc.length > 30){mo_desc = mo_desc.substring(0,27)+"...";}
		
		innerHtml +="<p>"+mo_desc+"</p>";
		innerHtml +="<span>브랜드의 쇼핑혜택을 다운로드 하시겠습니까?</span>";
		innerHtml +="</li>";
		
		if($("#bran_offer1_dstic_cd").val() != ""){
			var mo_text1 = $("#bran_offer1_desc").val();
			if(mo_text1.length > 20){mo_text1 = mo_text1.substring(0,17)+"...";}
			
			innerHtml +="<li>";
			innerHtml +="<strong>"+bran_offer1_dstic_nm+"</strong>";
			innerHtml +="<p>"+mo_text1+"</p>";
			innerHtml +="</li>";
		}
		
		if($("#bran_offer2_dstic_cd").val() != ""){
			var mo_text2 = $("#bran_offer2_desc").val();
			if(mo_text2.length > 20){mo_text2 = mo_text2.substring(0,17)+"...";}
			
			innerHtml +="<li>";
			innerHtml +="<strong>"+bran_offer2_dstic_nm+"</strong>";
			innerHtml +="<p>"+mo_text2+"</p>";
			innerHtml +="</li>";
		}
		
		if($("#bran_offer3_dstic_cd").val() != ""){
			var mo_text3 = $("#bran_offer3_desc").val();
			if(mo_text3.length > 20){mo_text3 = mo_text3.substring(0,17)+"...";}
			
			innerHtml +="<li>";
			innerHtml +="<strong>"+bran_offer3_dstic_nm+"</strong>";
			innerHtml +="<p>"+mo_text3+"</p>";
			innerHtml +="</li>";
		}
		
		innerHtml +="</ul>";
		
		$(".view_detail").html(innerHtml);
		
		var dt1 = sDelHypn($("#camp_str_dt").val());
		var dt2 = sDelHypn($("#camp_end_dt").val());
		
		dt1 = dt1.substring(4,6)+"월"+dt1.substring(6,8)+"일";
		dt2 = dt2.substring(4,6)+"월"+dt2.substring(6,8)+"일 까지";
		
		mobileText += "\r\n";
		mobileText += "(광고)신세계백화점 "+$("#store_nm").text()+"\r\n";
		mobileText += intg_bran_nm+"의 맞춤 FIT제안\r\n\r\n";
		mobileText += dt1+" - "+dt2+"\r\n";
		mobileText += "신세계 "+$("#store_nm").text()+" "+$("#evt_flr_nm").text()+"\r\n\r\n";
		
		//12.10 컨텐츠 유형, 설명 항목 추가
		mobileText += "혜택1"+"\r\n";
		mobileText += $("#bran_offer1_desc").val()+"\r\n";
		
		
		if($("#bran_offer2_desc").val() != ""){
			mobileText += "혜택2"+"\r\n";
			mobileText += $("#bran_offer2_desc").val()+"\r\n";	
		}
		
		if($("#bran_offer3_desc").val() != ""){
			mobileText += "혜택3"+"\r\n";
			mobileText += $("#bran_offer3_desc").val()+"\r\n";
		}
		
		$("#mobile_txt").val(mobileText);
	}
	
	
  $layer.css("position", "absolute");

  $layer.css("top",(($(window).height() - $layer.outerHeight()) / 2) + $(window).scrollTop());
  $layer.css("left",(($(window).width() - $layer.outerWidth()) / 2) + $(window).scrollLeft());
  $layer.draggable();
  $layer.show();
}


/*===============================================================
팝업 Close
===============================================================*/
function popupClose(popupN) {
	var $layer = $("#"+ popupN);
  $layer.hide();
}



/*===============================================================
점포 팝업 확인
===============================================================*/
var sel_floor = "";
function storeConfirm(){
	
	if(sel_store_cd != ""){
		$("#tget_store_cd").val(sel_store_cd);
		$("#store_nm").text(sel_store_nm);
		
		s_store_cd = sel_store_cd;
		s_store_nm = sel_store_nm;
		
		//점포 변경 시 층정보 조회-------------------------
  	var floorTm = new oza_TMHandler('com.obzen.bmp.DocBMPComm', 'selectFloor', '1', '\@#%');
  	floorTm.setAddDataField('STORE_CD', sel_store_cd);
  	floorTm.setAddDataField('MD_CD', md_cd);
  	floorTm.returnlist('EVT_FLR');//층정보
  	floorTm.execute(null, false);
  	sel_floor = floorTm.ElementValue('EVT_FLR');
  	floorTm.clear();
  
  	if(sel_floor != ""){
  		$("#evt_flr_nm").text(sel_floor);
			$("#evt_flr").val(sel_floor);
			s_evt_flr = sel_floor;
  	}
	}
	
	popupClose('snm_popup'); 
	view_flag = "N";
}





/*===============================================================
층정보 팝업 확인
===============================================================*/
function floorConfirm(){
	
	var input_evt_flr_nm = "";
	input_evt_flr_nm = $.trim($("#input_evt_flr_nm").val());
	
	if(input_evt_flr_nm != ""){
		$("#evt_flr_nm").text(input_evt_flr_nm);
		$("#evt_flr").val(input_evt_flr_nm);
		s_evt_flr = input_evt_flr_nm;
	}
	
	popupClose('floor_popup2'); 
	view_flag = "N";
}



/**========================================================================================
* 이전 단계
========================================================================================*/
function preStep01(){
	webPageMove("1");
}




/**========================================================================================
* 다음 단계(등록/수정)
========================================================================================*/
function nextStep01(){
	
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
	
	//행사기간 체크
	if(!dateCheck()){return;}
	
	
	camp_desc = $("#camp_desc").val(); 
	camp_str_dt = $.trim($("#camp_str_dt").val());
	camp_end_dt = $.trim($("#camp_end_dt").val()); 
	intg_bran_cd = $.trim($("#intg_bran_cd").val());
	intg_bran_nm = $.trim($("#intg_bran_nm").val());
	tget_store_cd = $.trim($("#tget_store_cd").val()); 
	evt_flr = $.trim($("#evt_flr").val());
	bran_offer1_dstic_cd = $("#bran_offer1_dstic_cd").val();
	bran_offer2_dstic_cd = $("#bran_offer2_dstic_cd").val();
	bran_offer3_dstic_cd = $("#bran_offer3_dstic_cd").val();
	bran_offer1_desc = $("#bran_offer1_desc").val();
	bran_offer2_desc = $("#bran_offer2_desc").val();
	bran_offer3_desc = $("#bran_offer3_desc").val();
	input_camp_nm = $.trim($("#input_camp_nm").val());
	bran_offer1_prestat = $("#bran_offer1_prestat").val();
	bran_offer2_prestat = $("#bran_offer2_prestat").val();
	bran_offer3_prestat = $("#bran_offer3_prestat").val();
	
	if(tget_store_cd == ""){cmdMessage(3, "점포"); $("#tget_store_cd").focus();return;}
	if(evt_flr == ""){cmdMessage(2, "층정보"); $("#evt_flr").focus();return;}
	if(input_camp_nm == ""){cmdMessage(2, "행사명"); $("#input_camp_nm").focus();return;}
	if(camp_desc == ""){cmdMessage(2, "행사설명"); $("#camp_desc").focus();return;}
	if(camp_str_dt == ""){cmdMessage(2, "행사기간 시작일"); $("#camp_str_dt").focus();return;}
	if(camp_end_dt == ""){cmdMessage(2, "행사기간 종료일"); $("#camp_end_dt").focus();return;}
	
	//if($("#benefit_check1").hasClass("on")){if(bran_offer1_dstic_cd == ""){cmdMessage(3, "첫번째컨텐츠"); $("#bran_offer1_dstic_cd").focus();return;}}
	//if($("#benefit_check2").hasClass("on")){if(bran_offer2_dstic_cd == ""){cmdMessage(3, "두번째컨텐츠"); $("#bran_offer2_dstic_cd").focus();return;}}
	//if($("#benefit_check3").hasClass("on")){if(bran_offer3_dstic_cd == ""){cmdMessage(3, "세번째컨텐츠"); $("#bran_offer3_dstic_cd").focus();return;}}
	
	if(bran_offer1_dstic_cd != "" && bran_offer1_desc == ""){cmdMessage(2, "첫번째컨텐츠 설명"); $("#bran_offer1_desc").focus();return;}
	if(bran_offer2_dstic_cd != "" && bran_offer2_desc == ""){cmdMessage(2, "두번째컨텐츠 설명"); $("#bran_offer2_desc").focus();return;}
	if(bran_offer3_dstic_cd != "" && bran_offer3_desc == ""){cmdMessage(2, "세번째컨텐츠 설명"); $("#bran_offer3_desc").focus();return;}
	
	if(bran_offer1_dstic_cd == "" && bran_offer1_desc != ""){cmdMessage(3, "첫번째컨텐츠"); $("#bran_offer1_dstic_cd").focus();return;}
	if(bran_offer2_dstic_cd == "" && bran_offer2_desc != ""){cmdMessage(3, "두번째컨텐츠"); $("#bran_offer2_dstic_cd").focus();return;}
	if(bran_offer3_dstic_cd == "" && bran_offer3_desc != ""){cmdMessage(3, "세번째컨텐츠"); $("#bran_offer3_dstic_cd").focus();return;}
	
	
	if(bran_offer1_dstic_cd == "" && bran_offer2_dstic_cd == "" && bran_offer3_dstic_cd == ""){cmdMessage(3, "컨텐츠"); return;}
	
	
	if(bran_offer2_dstic_cd != "" && bran_offer1_dstic_cd == ""){cmdMessage(0,"첫번째컨텐츠을 선택하세요.");$("#bran_offer1_dstic_cd").focus();return;}
	if(bran_offer3_dstic_cd != "" && bran_offer1_dstic_cd == ""){cmdMessage(0,"첫번째컨텐츠을 선택하세요.");$("#bran_offer1_dstic_cd").focus();return;}
	if(bran_offer3_dstic_cd != "" && bran_offer2_dstic_cd == ""){cmdMessage(0,"두번째컨텐츠을 선택하세요.");$("#bran_offer2_dstic_cd").focus();return;}
	
	
	if(input_camp_nm != ""){
	  var charCheck = "";
	  
	  if(input_camp_nm.indexOf("$") > -1){charCheck = "$";}
	  if(input_camp_nm.indexOf("&") > -1){charCheck = "&";}
	  if(input_camp_nm.indexOf(">") > -1){charCheck = ">";}
	  if(input_camp_nm.indexOf("<") > -1){charCheck = "<";}
	  if(input_camp_nm.indexOf("/") > -1){charCheck = "/";}
	  if(input_camp_nm.indexOf("\'") > -1){charCheck = "\'";}
	  if(input_camp_nm.indexOf("\"") > -1){charCheck = "\"";}
	  if(input_camp_nm.indexOf(";") > -1){charCheck = ";";}
	  
	  if(charCheck != ""){
	  	cmdMessage(0,"행사명에 특수문자는 사용할 수 없습니다. ($&<>/\'\";)");
	  	return;
	  }
	}
	
	
	if(view_flag == "N"){
		cmdMessage(0, "모바일 미리보기를 먼저 진행 하세요.");
		return;
	}
	
	//날짜형식 체크
	setValidDate(camp_str_dt);
	setValidDate(camp_end_dt);
	
	//날짜 - 제거
	camp_str_dt = sDelHypn(camp_str_dt);
	camp_end_dt = sDelHypn(camp_end_dt);
	
	/*
	if(cmdMessage(1, "다음 단계로 이동 하시겠습니까?") == false){
		return;
	}
	*/
	
	
	//행사진행 가능여부 체크
	var checkBmpEvtTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'checkBmpevt', '1', '\@#%');
	checkBmpEvtTm.setAddDataField('MD_CD', md_cd);//MD코드
	checkBmpEvtTm.setAddDataField('CAMP_ID', camp_id);//행사코드
	checkBmpEvtTm.setAddDataField('TGET_STORE_CD', tget_store_cd);//점포코드
	checkBmpEvtTm.setAddDataField('CAMP_STR_DT', camp_str_dt);//행사 시작 일자
	checkBmpEvtTm.setAddDataField('BMPEVT_TY_CD', bmpevtTy_cd);//프로모션 유형
	checkBmpEvtTm.setAddDataField('SHN_CRD_EVT_YN', shn_crd_evt_yn);
	checkBmpEvtTm.returnlist('BMPEVT_YN;ING_CAMP_ID;ING_CAMP_NM');
	checkBmpEvtTm.execute(null, false);
	var bmpevt_yn = checkBmpEvtTm.ElementValue('BMPEVT_YN');
	var ing_camp_id = checkBmpEvtTm.ElementValue('ING_CAMP_ID');
	var ing_camp_nm = checkBmpEvtTm.ElementValue('ING_CAMP_NM');
	checkBmpEvtTm.clear();
	
	if(bmpevt_yn == "N"){cmdMessage(0, ing_camp_nm+"("+ing_camp_id+")가 진행 중 입니다."); return;}
	
	lodingImgOn();//백그라운드 이미지 활성(더블클릭방지)
	
	var insertTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'insertCampInfo', '1', '\@#%');
	insertTm.setAddDataField('CAMP_ID', camp_id);//캠페인ID
	insertTm.setAddDataField('CAMP_NM', input_camp_nm);//행사명
	insertTm.setAddDataField('CAMP_DESC', camp_desc);//행사설명
	insertTm.setAddDataField('CAMP_STR_DT', camp_str_dt);//행사 시작 일자
	insertTm.setAddDataField('CAMP_END_DT', camp_end_dt);//행사 종료 일자
	insertTm.setAddDataField('INTG_BRAN_CD', intg_bran_cd);//브랜드코드
	insertTm.setAddDataField('INTG_BRAN_NM', intg_bran_nm);//브랜드명
	insertTm.setAddDataField('TGET_STORE_CD', tget_store_cd);//점포코드
	insertTm.setAddDataField('EVT_FLR', evt_flr);//층
	insertTm.setAddDataField('BRAN_OFFER1_DSTIC_CD', bran_offer1_dstic_cd);//컨텐츠선택_첫번째컨텐츠코드
	insertTm.setAddDataField('BRAN_OFFER2_DSTIC_CD', bran_offer2_dstic_cd);//컨텐츠선택_두번째컨텐츠
	insertTm.setAddDataField('BRAN_OFFER3_DSTIC_CD', bran_offer3_dstic_cd);//컨텐츠선택_세번째컨텐츠
	insertTm.setAddDataField('BRAN_OFFER1_DESC', bran_offer1_desc);//컨텐츠설명_첫번째컨텐츠
	insertTm.setAddDataField('BRAN_OFFER2_DESC', bran_offer2_desc);//컨텐츠설명_두번째컨텐츠
	insertTm.setAddDataField('BRAN_OFFER3_DESC', bran_offer3_desc);//컨텐츠설명_세번째컨텐츠
	insertTm.setAddDataField('BRAN_OFFER1_PRESTAT', bran_offer1_prestat);//
	insertTm.setAddDataField('BRAN_OFFER2_PRESTAT', bran_offer2_prestat);//
	insertTm.setAddDataField('BRAN_OFFER3_PRESTAT', bran_offer3_prestat);//
	insertTm.setAddDataField('BMPEVT_TY_CD', bmpevtTy_cd);//프로모션 유형
	insertTm.setAddDataField('MD_CD', md_cd);//MD코드
	insertTm.setAddDataField('SHN_CRD_EVT_YN', shn_crd_evt_yn);
	insertTm.setAddDataField('CTRTDOC_NCSS_YN', ctrtdoc_ncss_yn);
	insertTm.setAddDataField('USERID', user_id);
	insertTm.setAddDataField('PAY_CD', pay_cd);//선택된 카드사 코드(카드자산코드) 여러 개 선택된 경우 ;로 구분자 추가
	insertTm.returnlist('LOGMSG;CAMP_STAT');
	insertTm.execute(null, false);
	var msg = insertTm.ElementValue('LOGMSG');//리턴 처리 메시지
	var return_camp_stat = insertTm.ElementValue('CAMP_STAT');//리턴 등록 상태
	insertTm.clear();
	
	
	screenLog("등록", "web_cp_campdraftbrand_sub02", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>행사정보입력",get_client_ip);//화면 로그(공통)
	//cmdMessage(0,msg);
	
	flag = "3";
	camp_id = camp_id;
	bmpevtTy_cd = bmpevtTy_cd;
	copy_yn = "N";
	
	do_RefreshPage("onload");
	
}




/*===============================================================
캘린더 팝업 호출
===============================================================*/
function calendarPopup(){
	
	var val_store_cd = $.trim($("#tget_store_cd").val());
	
	var name = "frmStore";
  var option = "location=no,menubar=no,resizable=no,scrollbars=yes,titlebar=no,toolbar=no";
  
  //해상도 계산하여 위치 조절
  var popupX = ((document.body.offsetWidth / 2) - (200 / 2)-200);
  //var popupY = (document.body.offsetHeight / 2) - (300 / 2)+300;
  var popupY = (document.body.offsetHeight / 2);
  	 
  option += ",top="+popupY+",left="+popupX+",height=826,width=944";
  
	//post 방식
  var frm = $("form#frmStore")[0];
  frm.store_cd.value = val_store_cd;
  frm.md_cd.value = md_cd;
  frm.user_id.value = user_id;
  
  //var ret = window.open(url, name, option);
  var ret = window.open("web_cp_campdraftbrand_calendar.jsp", name, option);
  
  /*IE11 에서 post 방식으로 팝업을 열면 새탭으로 열리는 버그가 있다.
  그래서 방법을 변경
  팝업을 열기 전 Form 변수에 필요한 값을 설정하고 
  열린 팝업에서 opener의 값을 가져다 쓰는 방식으로 변경
  
  frm.action = "web_cp_campdraftbrand_calendar.jsp";
  frm.target = name;
  frm.method = "post";
  frm.submit();
  */
  
  $("#mask").css("display","");//팝업 호출 시 보이게 설정
  
  $('#mask').click(function() {
  		ret.focus();
  });
}



function calendarPopupForm(){
	var frm = $("form#frmStore")[0];
  frm.store_cd.value = val_store_cd;
  frm.md_cd.value = md_cd;
  frm.user_id.value = user_id;
  frm.action = "web_cp_campdraftbrand_calendar.jsp";
  frm.target = name;
  frm.method = "post";
  frm.submit();
}

</script>
<input type="hidden" id="tget_store_cd">
<input type="hidden" id="intg_bran_nm">
<input type="hidden" id="intg_bran_cd">
<input type="hidden" id="evt_flr">

<div class="c_write_wrap">
  <div class="tip_txt">브랜드가 준비한 행사정보 및 컨텐츠를 입력하는 단계입니다.<br>입력내용은 백화점 APP쿠폰, 문자메세지 등 고객접근시 활용되니 주의하십시오 (하단의 모바일 미리보기 필수확인)</div>
  <div class="c_write1">
    <div class="c_write_top box">
      <ul>
        <li>
          <p>브랜드명</p>
          <div class="bnm_txt">
            <strong id="brand_nm"></strong>
          </div>
        </li>
        <li>
          <p>점포명</p>
          <div class="snm_txt">
            <p id="store_nm"></p>
            <a id="store_nm_button" href="javascript:layerPopOpen('snm_popup');">점포변경</a>
            
            <!-- 점포 Layrer 팝업 시작 -->
            <div id="snm_popup" class="layer">
              <p class="tit">대상 점포를 선택해주세요</p>
              <div class="list" id="store"></div>
              <div class="pop_btn">
                <a href="javascript:storeConfirm();" class="btn_submit">확인</a>
                <a href="javascript:popupClose('snm_popup');" class="btn_cancel">취소</a>
              </div>
            </div>
            <!-- 점포 Layrer 팝업 종료-->
            
          </div>
        </li> 
        <li>
          <p>층 정보</p>
          
          <!-- 수정 -->
            <div class="floor_txt">
              <p id="evt_flr_nm"></p>
              <a id="evt_flr_nm_button" href="javascript:layerPopOpen('floor_popup');">층정보 수정</a>
              
              <!-- 층정보 Layrer 팝업 시작 -->
              <div id="floor_popup" class="layer">
                <p class="tit">층정보 수정<a href="javascript:popupClose('floor_popup');" class="btn_close">닫기</a></p>
                <div id="floor_popup_con">
                  <label for="">매장 위치 직접 입력</label>
                  <input type="text" id="input_evt_flr_nm" onblur="javascript:inputCheck('20',  this.value, 'input_evt_flr_nm');">
                </div>
                <div class="pop_btn">
                  <a href="javascript:layerPopOpen('floor_popup2');" class="btn_submit">확인</a>
                  <a href="javascript:popupClose('floor_popup');" class="btn_cancel">취소</a>
                </div>
              </div>
              <!-- 층정보 Layrer 팝업 종료 -->
              
              <!-- 층정보 확인 Layrer 팝업 시작 -->
              <div id="floor_popup2" class="layer">
                <p class="tit">층정보 수정<a href="javascript:popupClose('floor_popup');" class="btn_close">닫기</a></p>
                  <div id="floor_popup_con">
                  <p>입력한 위치를 확인해주세요</p>
                  <span id="span_evt_flr_nm"></span>
                  </div>
                <div class="pop_btn">
                  <a href="javascript:floorConfirm();" class="btn_submit">확인</a>
                  <a href="javascript:popupClose('floor_popup2');" class="btn_cancel">취소</a>
                </div>
              </div>
              <!-- 층정보 확인 Layrer 팝업 종료 -->
            </div>
            <!-- //수정 -->
        </li>
      </ul>
    </div>
    <div class="c_write_info box">
    <p class="tit">행사 정보<span></span><a href="javascript:layerPopOpen('layer_advice1');">도움말</a></p>
    <div class="info_cnt">
      
        <div class="camp_nm">
          <label for="input_camp_nm">행사 명</label>
          <input type="text" id="input_camp_nm" placeholder="Ex> 나이키 X 오프화이트 콜라보레이션 초대회 ( 최대 25글자)" onblur="javascript:inputCheck('50',  this.value, 'input_camp_nm');">
        </div>
        <div class="camp_explan">
          <label for="camp_desc">행사 설명</label>
          <textarea id="camp_desc" placeholder="Ex>나이키와 해외 유명 스트리트 브랜드 오프화이트 간의 특별한 콜라보 상품을 만나보세요 (최대 500글자)" onblur="javascript:inputCheck('1000',  this.value, 'camp_desc');"></textarea>
        </div>
        <div class="camp_priod">
          <label for="">행사 기간</label>
            <input type="text" id="camp_str_dt"> ~ <input type="text" id="camp_end_dt">
            <a href="javascript:calendarPopup();" id="cal_button">행사 캘린더 보기</a>
          </div>
        
      </div>
    </div>
    <div class="camp_benefit box">
      <p class="tit">브랜드 자체 컨텐츠 입력<span> 브랜드에서 준비한 프로모션을 입력해주세요. (복수선택 가능)</span><a href="javascript:layerPopOpen('layer_advice2');">도움말</a></p>
      
        <ul>
          <li class="benefit1" id="benefit_check1">
						<div class="benefit_tit" id="benefit_tit1">
							<strong>첫번째 컨텐츠</strong>
						</div>
						<div class="benefit_cnt" id="bran_offer1_check">
							<div id="sel_dstic_cd1"></div>
							<textarea id="bran_offer1_desc" placeholder="컨텐츠 상세내용을 기재하여 주세요.&#13;&#10;(최대 40글자)" onblur="javascript:inputCheck('80',  this.value, 'bran_offer1_desc');"></textarea>
              <p>유의사항</p>
              <textarea id="bran_offer1_prestat" placeholder="유의사항 상세내용을 기재하여 주세요.&#13;&#10;(최대 20글자)" onblur="javascript:inputCheck('40',  this.value, 'bran_offer1_prestat');"></textarea>
						</div>
					</li>
					
					
					<li class="benefit2" id="benefit_check2">
						<div class="benefit_tit" id="benefit_tit2">
							<strong>두번째 컨텐츠</strong>
						</div>
						<div class="benefit_cnt" id="bran_offer2_check">
							<div id="sel_dstic_cd2"></div>
							<textarea id="bran_offer2_desc" placeholder="컨텐츠 상세내용을 기재하여 주세요.&#13;&#10;(최대 40글자)" onblur="javascript:inputCheck('80',  this.value, 'bran_offer2_desc');"></textarea>
              <p>유의사항</p>
              <textarea id="bran_offer2_prestat" placeholder="유의사항 상세내용을 기재하여 주세요.&#13;&#10;(최대 20글자)" onblur="javascript:inputCheck('40',  this.value, 'bran_offer2_prestat');"></textarea>
						</div>
					</li>
					
					
					<li class="benefit3" id="benefit_check3">
						<div class="benefit_tit" id="benefit_tit3">
							<strong>세번째 컨텐츠</strong>
						</div>
						<div class="benefit_cnt" id="bran_offer3_check">
							<div id="sel_dstic_cd3"></div>
							<textarea id="bran_offer3_desc" placeholder="컨텐츠 상세내용을 기재하여 주세요.&#13;&#10;(최대 40글자)" onblur="javascript:inputCheck('80',  this.value, 'bran_offer3_desc');"></textarea>
              <p>유의사항</p>
              <textarea id="bran_offer3_prestat" placeholder="유의사항 상세내용을 기재하여 주세요.&#13;&#10;(최대 20글자)" onblur="javascript:inputCheck('40',  this.value, 'bran_offer3_prestat');"></textarea>
						</div>
					</li>
        </ul>
      <div class="notice_txt">
        <p>최소 한 개 이상의 컨텐츠를 선택하셔야 합니다.</p>
        <p>등록한 컨텐츠는 하단의 ‘모바일 미리보기’ 화면에서 확인 하실 수 있습니다.</p>
      </div>
    </div>
  </div>
  
  <div class="btn_box">
    <!-- <a href="javascript:layerPopOpen('mView');" class="btn_mview">모바일 미리보기</a> -->
    <a href="javascript:layerPopOpen('layer_mobView');" class="btn_mview">모바일 미리보기</a>
    <a href="javascript:nextStep01();" class="btn_next">다음단계</a>
  </div>
  
  <!-- 모바일 미리보기 Start -->
	<div id="layer_mobView" class="layer">
		<p class="tit">모바일 미리보기<a href="javascript:popupClose('layer_mobView');" class="btn_close">닫기</a></p>
		<div class="mobView">
			<p>APP 행사 안내 화면</p>
			<div class="view_coupon">
				<div class="b_nm"></div>
				<strong id="mv_camp_nm"></strong>
				<p id="mv_camp_desc"></p>
				<ul>
					<li id="mv_store_nm"></li>
					<li id="mv_date"></li>
				</ul>
			</div>
			<p>컨텐츠 상세 화면</p>
			<div class="view_detail">
			</div>
			<div class="lms_view">
				<p>LMS 발송 문안</p>
				<div class="lms_area">
        <textarea id="mobile_txt" disabled></textarea>
				</div>
			</div>
		</div>
	</div>
	<!-- 모바일 미리보기 End -->
	
	
	<!-- 행사정보 도움말 Start -->
  <div id="layer_advice1" class="layer">
    <p class="tit">행사 정보 입력 예시<a href="javascript:popupClose('layer_advice1');" class="btn_close">닫기</a></p>
    <div class="advice_cnt">
      <ul>
        <li>
          <p class="tit_txt">행사명 예시</p>
          <div class="txt_cnt1">
            <p>이슈/스페셜 테마</p>
            <span>스페셜데이, 스페셜 기획전, 뉴컬렉션 팝업스토어, <br>프리미엄 특집, 맞춤 특별 혜택, Festival, 창립기념,<br>00주년 기념 스페셜, 라인론칭, oooXooo 컬레버레이션,<br>특별할인, New 아이템 출시, 신상품 초대, 패밀리 그룹전</span>
          </div>
          <div class="txt_cnt1">
            <p>시즌테마</p>
            <span>클리어런스, 시즌오프, 브랜드 위크, 브랜드 쇼핑뉴스,<br>인기상품 제안전, HOT ITEM, 기획전, 득템 마켓전, 특가전,<br>브랜드 창고 공개, 웨딩특집, 브랜드 스킨케어쇼,<br>브랜드 뷰티쇼, Gift 제안, 로드쇼, 홈&리빙 페스타</span>
          </div>
          <div class="txt_cnt1">
            <p>오픈/리뉴얼 테마</p>
            <span>New Open, Now Open, Renewal</span>
          </div>
        </li>
        <li>
          <p class="tit_txt">행사설명 예시</p>
          <div class="txt_cnt2">
                    세련된 모덤함과 웨어러블함이 공존하는 
                    라이프 스타일 브랜드인 ooo을(를) 만나보세요.<br><br>
                    
                    나이키와 해외 유명 스트리드 브랜드의 
                    특별한 컬래버레이션 상품을 만나보세요.<br><br>
                    
            20th Anniversary 19F/W 시즌의 
            20주년 리미티드 에디션을 만나보세요.<br><br>
                    
                    어반 빈티지 감성을 담은 고감도의 컨템포러리 
                    브랜드 OOO을(를) 만나보세요.
          </div>
        </li>
      </ul>
    </div>
    <div class="pop_btn">
      <a href="javascript:popupClose('layer_advice1');" class="btn_cancel">닫기</a>
    </div>
  </div>
  <!-- 행사정보 도움말 End -->
  
  <!-- 혜택선택 도움말 Start -->
  <div id="layer_advice2" class="layer">
    <p class="tit">상세내용/ 유의사항 도움말<a href="javascript:popupClose('layer_advice2');" class="btn_close">닫기</a></p>
    <div class="advice_cnt">
      <ul>
        <li>
          <p class="tit_txt">상세내용 예시</p>
          <div class="txt_cnt1">
            <p>SALE 20%</p>
            <p>19년 FW 전상품 10% 할인</p>
            <p>시즌오프 20%</p>
            <p>20만원 이상 구매시 5,000포인트 적립</p>
            <p>브랜드 구매고객께 더블 마일리지 적립</p>
            <p>30/60/100만원 이상 구매시 3/5/10만원 즉시할인</p>
            <p>20만원 이상 구매시 에코백 증정(00만원상당 표현불가)</p>
            <p>30/60/100만원 이상 구매시 3/5/10만원 상품권 증정</p>
            <p>○○○구매고객께 3종 샘플 증정</p>
            <p>○○○ 멤버쉽 신규가입시 2만원 즉시 할인</p>
            <p>○○○상품 구매시 1+1 혜택</p>
            <p>○○○경품 이벤트(상품/상품/상품. ○○명 한)</p>
            <p>20만원 이상 구매시 1만 포인트 적립</p>
            <p>○○○X○○○ 컬레버레이션 상품 한정 판매 </p>
            <p>트랜디 한 ○○○ 잇 아이템(○○매 한) </p>
          </div>
        </li>
        <li>
          <p class="tit_txt">유의사항 예시</p>
          <div class="txt_cnt2" id="note_txt">
          </div>
        </li>
      </ul>
    </div>
    <div class="pop_btn">
      <a href="javascript:popupClose('layer_advice2');" class="btn_cancel">닫기</a>
    </div>
  </div>
  <!-- 혜택선택 도움말 End -->
	
</div>

<form id="frmStore" method="post" >
<input type="hidden" id="store_cd" name="store_cd"/>
<input type="hidden" id="user_id" name="user_id"/>
<input type="hidden" id="md_cd" name="md_cd"/>
</form>
