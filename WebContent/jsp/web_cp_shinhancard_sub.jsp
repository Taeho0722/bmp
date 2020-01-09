<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<script type="text/javascript">
var sel_store_cd = "";
var sel_store_nm = "";
var camp_stat = "";

var usr_cls = "";
var intg_bran_cd = "";
var intg_bran_nm = "";
var store_cd = "";
var store_nm = "";
var evt_flr = "";
var tget_store_cd = "";//선택한 점포코드

var shop_phone_no = "";
var store_addr = "";

var md_grd_cd = "";
var max_cust_cnt = "";
var cate_cd = "";
var cate_nm = "";

var offerSHTm_json = "";

var evt_str_dt = "";
var evt_end_dt = "";
var shn_crd_evt_yn = "";
var shn_crd_offer_code = "";
var shn_crd_max_cust_cnt = "";
var camp_nm = "";
var camp_desc = "";

var storeTmResult_json = "";

var athor_desc = "";//검토요청 내용

var mod_flag = "Y";

//오른쪽 뷰용(오퍼내용)
var offer1 = "";
var offer2 = "";
var offer3 = "";


//TM Start ===============================================================================================
//신한카드행사 등록권한 체크
var sh_auth = "N";
var authChkTm = new oza_TMHandler('com.obzen.bmp.DocCampRegSH', 'selectShAuthChk', '1', '\@#%');
authChkTm.setAddDataField('MD_CD', md_cd);
authChkTm.returnlist('SH_AUTH');
authChkTm.execute(null, false);
sh_auth = authChkTm.ElementValue('SH_AUTH');
authChkTm.clear();	
	
	
	
//매장 정보 조회
var storeInfoTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'selectStoreInfo', '1', '\@#%');
storeInfoTm.setAddDataField('USER_ID', user_id);
storeInfoTm.setAddDataField('MD_CD', md_cd);
storeInfoTm.returnlist('USR_CLS;INTG_BRAN_CD;INTG_BRAN_NM;STORE_CD;STORE_NM;EVT_FLR_SH');
storeInfoTm.execute(null, false);
usr_cls = storeInfoTm.ElementValue('USR_CLS');//사용자구분 (1:일반협력사, 4:샵마스터)
intg_bran_cd = storeInfoTm.ElementValue('INTG_BRAN_CD');//브랜드코드
intg_bran_nm = storeInfoTm.ElementValue('INTG_BRAN_NM');//브랜드명
store_cd = storeInfoTm.ElementValue('STORE_CD');//점포코드
store_nm = storeInfoTm.ElementValue('STORE_NM');//점포명
evt_flr = storeInfoTm.ElementValue('EVT_FLR_SH');//층
storeInfoTm.clear();	


	
//매장전화번호, 주소 조회
var storeNoTm = new oza_TMHandler('com.obzen.bmp.DocCampRegSH', 'selectStoreNo', '1', '\@#%');
storeNoTm.setAddDataField('MD_CD', md_cd);
storeNoTm.setAddDataField('STORE_CD', store_cd);
storeNoTm.returnlist('SHOP_PHONE_NO;STORE_ADDR');
storeNoTm.execute(null, false);
shop_phone_no = storeNoTm.ElementValue('SHOP_PHONE_NO');//매장전화번호
store_addr = storeNoTm.ElementValue('STORE_ADDR');//매장주소
storeNoTm.clear();	


//MD등급 카테고리 정보 조회
var mdInfoShTm = new oza_TMHandler('com.obzen.bmp.DocCampRegSH', 'selectMdInfoSH', '1', '\@#%');
mdInfoShTm.setAddDataField('MD_CD', md_cd);
mdInfoShTm.setAddDataField('STORE_CD', store_cd);
mdInfoShTm.returnlist('MD_GRD_CD;MAX_CUST_CNT;CATE_CD;CATE_NM');
mdInfoShTm.execute(null, false);
md_grd_cd = mdInfoShTm.ElementValue('MD_GRD_CD');//MD등급
max_cust_cnt = mdInfoShTm.ElementValue('MAX_CUST_CNT');//예상접근고객수
cate_cd = mdInfoShTm.ElementValue('CATE_CD');//카테고리CD
cate_nm = mdInfoShTm.ElementValue('CATE_NM');//카테고리
mdInfoShTm.clear();	



//오퍼 정보 조회 CDM_CD_NM CDM_CD
if(md_grd_cd != ""){
	var offerSHTm = new oza_TMHandler('com.obzen.bmp.ColCampRegSH', 'selectOfferShWeb', '0', '\@#%');
	offerSHTm.setAddDataField('MD_GRD_CD', md_grd_cd);
	offerSHTm.execute(null, false);
	var offerSHTmResult = offerSHTm.getResult();
	if(offerSHTmResult != ""){
		offerSHTm_json = JSON.parse(offerSHTmResult);
	}
	offerSHTm.clear();	
}


if(camp_id != ""){
	//등록된 캠페인 조회
	var campInfoSHTm = new oza_TMHandler('com.obzen.bmp.DocCampRegSH', 'selectCampInfoSH', '1', '\@#%');
	campInfoSHTm.setAddDataField('CAMP_ID', camp_id);
	campInfoSHTm.returnlist('INTG_BRAN_CD'+//통합브랜드코드
			                  ';INTG_BRAN_NM'+//통합브랜드명
			                  ';TGET_STORE_CD'+//점포코드
			                  ';STORE_NM'+//점포명
			                  ';MD_GRD_CD'+//md등급
			                  ';CATE_CD'+//카테고리코드
			                  ';CATE_NM'+//카테고림
			                  ';EVT_STR_DT'+//행사시작일자
			                  ';EVT_END_DT'+//행사종료일자
			                  ';SHN_CRD_EVT_YN'+//신한카드행사여부
			                  ';EVT_FLR'+//층
			                  ';SHN_CRD_OFFER_CODE'+//신한카드오퍼코드
			                  ';SHN_CRD_MAX_CUST_CNT'+//예상접근고객수
			                  ';CAMP_NM'+//행사명
			                  ';CAMP_DESC'+//행사설명
			                  ';CAMP_STAT'+//진행상태
			                  ';CAMP_DRFT_EMP'+//등록자 아이디
			                  ';SHOP_PHONE_NO');//매장전화번호
	campInfoSHTm.execute(null, false);
	intg_bran_cd = campInfoSHTm.ElementValue('INTG_BRAN_CD');
	intg_bran_nm = campInfoSHTm.ElementValue('INTG_BRAN_NM');
	tget_store_cd = campInfoSHTm.ElementValue('TGET_STORE_CD');
	store_nm = campInfoSHTm.ElementValue('STORE_NM');
	md_grd_cd = campInfoSHTm.ElementValue('MD_GRD_CD');
	cate_cd = campInfoSHTm.ElementValue('CATE_CD');
	cate_nm = campInfoSHTm.ElementValue('CATE_NM');
	evt_str_dt = campInfoSHTm.ElementValue('EVT_STR_DT');
	evt_end_dt = campInfoSHTm.ElementValue('EVT_END_DT');
	shn_crd_evt_yn = campInfoSHTm.ElementValue('SHN_CRD_EVT_YN');
	evt_flr = campInfoSHTm.ElementValue('EVT_FLR');
	shn_crd_offer_code = campInfoSHTm.ElementValue('SHN_CRD_OFFER_CODE');
	shn_crd_max_cust_cnt = campInfoSHTm.ElementValue('SHN_CRD_MAX_CUST_CNT');
	camp_nm = campInfoSHTm.ElementValue('CAMP_NM');
	camp_desc = campInfoSHTm.ElementValue('CAMP_DESC');
	shop_phone_no = campInfoSHTm.ElementValue('SHOP_PHONE_NO');
	camp_stat = campInfoSHTm.ElementValue('CAMP_STAT');
	reg_id = campInfoSHTm.ElementValue('CAMP_DRFT_EMP');
	campInfoSHTm.clear();
}

	
//MD별 점포 조회-------------------------
var storeTm = new oza_TMHandler('com.obzen.bmp.ColBMPComm', 'selectStoreMdMapping', '0', '\@#%');
storeTm.setAddDataField('MD_CD', md_cd);
storeTm.setAddDataField('USERID', user_id);
storeTm.execute(null, false);

var storeTmResult = storeTm.getResult();

if(storeTmResult != ""){
	storeTm_json = JSON.parse(storeTmResult);
}
storeTm.clear();	
	
//TM End =================================================================================================



//화면 로드 시 실행
$(document).ready(function() {
	
	
	//최초 로딩 시 스타일 설정-----------------------
	if(camp_id != "" && camp_id != null){
		$("#camp_dl").css("display","");
		$("#camp_p").css("display","none");
	}else{
		$("#camp_dl").css("display","none");
		$("#camp_p").css("display","");
	}
	
	$("#top_camp_id").val(camp_id);
  $("#top_camp_nm").val(camp_nm);
  $("#camp_nm").val(camp_nm);
  
  
	//수정불가
	if(parseInt(camp_stat) == 380){
		mod_flag = "N";
	}else if(parseInt(camp_stat) == 381){
		mod_flag = "N";
	}else if(parseInt(camp_stat) == 382){
		mod_flag = "N";
	}else if(parseInt(camp_stat) == 385){
		mod_flag = "N";
	}else if(parseInt(camp_stat) == 386){
		mod_flag = "N";
	}else if(parseInt(camp_stat) == 387){
		mod_flag = "N";
	}else if(parseInt(camp_stat) == 388){
		mod_flag = "N";
	}else if(parseInt(camp_stat) == 389){
		mod_flag = "N";
	}else if(parseInt(camp_stat) >= 400){
		mod_flag = "N";
	}else{
		mod_flag = "Y";
	}
	
	
	//행사기간 시작일자
	$("#evt_str_dt").datepicker({
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
    ,minDate: "8D" //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
  });
	
	//행사기간 종료일자
	$("#evt_end_dt").datepicker({
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
    ,minDate: "8D" //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
  });
	
	//값 설정
	$("#cate_cd").val(cate_cd);
	$("#cate_nm").val(cate_nm);
	$("#camp_nm").val(camp_nm);
	$("#intg_bran_cd").val(intg_bran_cd);
	$("#intg_bran_nm").val(intg_bran_nm);
	$("#store_nm").text(store_nm);
	if(tget_store_cd == ""){$("#tget_store_cd").val(store_cd);}
	else{$("#tget_store_cd").val(tget_store_cd);}
	$("#evt_flr").val(evt_flr);
	$("#evt_flr_nm").text(evt_flr);
	$("#camp_desc").val(camp_desc);
	if(shn_crd_max_cust_cnt == ""){$("#max_cust_cnt").val(AddComma(max_cust_cnt)+" 명");}
	else{$("#max_cust_cnt").val(AddComma(shn_crd_max_cust_cnt)+" 명");}
	$("#shn_crd_offer_code").val(shn_crd_offer_code);
	$("#shop_phone_no").val(shop_phone_no);
	
	offerCode();//오퍼코드 그리기
	storeList();//점포 그리기
	phoneNumberCheck("shop_phone_no");//매장 전화번호 체크

	
	
	if(mod_flag == "N" || (reg_id != "" && user_id != reg_id) || sh_auth == "N"){
		$("#camp_nm").attr("disabled",true);
		$("#intg_bran_nm").attr("disabled",true);
		$("#camp_desc").attr("disabled",true);
		$("#shop_phone_no").attr("disabled",true);
		$("#evt_str_dt").attr("disabled",true);
		$("#evt_end_dt").attr("disabled",true);
		$('#evt_str_dt').datepicker('option', 'disabled', true);
		$('#evt_end_dt').datepicker('option', 'disabled', true);
		$("#store_nm_button").css("display","none");
		$("#evt_flr_nm_button").css("display","none");
		$(".offer1").css("cursor","default");
		$(".offer2").css("cursor","default");
		$(".btn_save").css("cursor","default");
		$(".btn_review").css("cursor","default");
		
	}
	
	
	if(evt_str_dt == ""){$('#evt_str_dt').datepicker('setDate', '+8D');}
	else{$("#evt_str_dt").val(setValidDate(evt_str_dt));}
	
	if(evt_end_dt == ""){$('#evt_end_dt').datepicker('setDate', '+8D');}
	else{$("#evt_end_dt").val(setValidDate(evt_end_dt));}
	
	
	preView();//미리보기
	
	
	//행사종료기간 체크 
	$("#evt_end_dt").on("propertychange change keyup paste input", function() {
	    view_flag = "N";
		
	    var str_dt = $("#evt_str_dt").val();
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
			toCalDate = getCalDate(str_dt,end_dt ,"D");
			
			//행사시작일자 체크
		  if(toCalDate < 1){
			  cmdMessage(0,"행사종료일자를 확인하세요");
			  return false;
		  }  
	});
	
	
	//매장전화번호 체크 
	$("#shop_phone_no").on("propertychange change keyup paste input", function() {
		phoneNumberCheck('shop_phone_no');
	});
	
	/*
	//행사명 체크 
	$("#camp_nm").on("propertychange change keyup paste input", function() {
		inputCheck('50',  $(this).val(), 'camp_nm');
	});
	
	//행사설명 체크 
	$("#camp_desc").on("propertychange change keyup paste input", function() {
		inputCheck('1000',  $(this).val(), 'camp_desc');
	});
	
	
	//브랜드명 체크 
	$("#intg_bran_nm").on("propertychange change keyup paste input", function() {
		inputCheck('1000',  $(this).val(), 'intg_bran_nm');
	});
	
	//층정보 체크 
	$("#input_evt_flr_nm").on("propertychange change keyup paste input", function() {
		inputCheck('20',  $(this).val(), 'input_evt_flr_nm');
	});
	
	//요청사항 체크 
	$("#athor_desc").on("propertychange change keyup paste input", function() {
		inputCheck('512',  $(this).val(), 'athor_desc');
	});
	*/
});	




/*===============================================================
오퍼코드
===============================================================*/
function offerCode(){
  
  var innerHtml = "";
  var classType = "";
  var cursorType = "";
  var classId = "";
  var offer_brch = "";
  
  
  var offerId = "";
  var offerNm = "";
  var offerNm1 = "";
  var offerNm2 = "";
  var offerNm3 = "";
  
  
  innerHtml += "<label for='오퍼'>오퍼</label>";
  
  for(var i=0; i<offerSHTm_json.length; i++) {
	  cursorType = "pointer";
	  
	  offerId = offerSHTm_json[i].OFFER_ID;
	  offerNm = offerSHTm_json[i].OFFER_NM;
	  offerNm1 = offerSHTm_json[i].OFFER_NM1;
	  offerNm2 = offerSHTm_json[i].OFFER_NM2;
	  offerNm3 = offerSHTm_json[i].OFFER_NM3;
	  
	  offerNm1 = AddComma(offerNm1);
	  offerNm2 = AddComma(offerNm2);
	  
	  if(shn_crd_offer_code == offerId){
		  classType = "on";
		  offer1 = offerNm1;//최소 구매액
		  offer2 = offerNm2;//최대 할인액 or 할인액
		  offer3 = offerNm3;//할인율
		  
		}else{
			classType = "";
		}
	  
	  offer_brch = offerSHTm_json[i].OFFER_BRCH; 
	  offer_brch = offer_brch.substring(0,2);
	  
	  if(offer_brch == "11"){classId = "offer1";}//정률
	  if(offer_brch == "12"){classId = "offer2";}//정액
	  
	  innerHtml += "<div class='"+classId+" "+classType+"' style='cursor:"+cursorType+"' onclick=\"javascript:selectOfferCode('"+classId+"' , '"+offerId+"', '"+offerNm1+"', '"+offerNm2+"', '"+offerNm3+"');\">";
	  innerHtml += "<dl>";
	  innerHtml += "<dt>"+offerNm+"</dt>";
	  innerHtml += "<dd class='dd1'>최소 구매액:"+offerNm1+"원</dd>";
	  
	  //정률
	  if(offer_brch == "11"){
		  innerHtml += "<dd class='dd2'>최대 할인액:"+offerNm2+"원</dd>";
		  innerHtml += "<dd class='dd3'>할인율:"+offerNm3+"%</dd>";
		
		//정액  
		}else{
			innerHtml += "<dd class='dd2'>할인액:"+offerNm2+"원</dd>";	
		}
	  
	  innerHtml += "</dl>";
	  innerHtml += "</div>";
	}
  
  $("#offer_list").html(innerHtml);
}



/*===============================================================
오퍼 코드 선택
===============================================================*/
function selectOfferCode(id, cdm_cd, val1, val2, val3){
	if(mod_flag == "N"){return;}
	if(reg_id != "" && user_id != reg_id){return;}
	if(sh_auth == "N"){return;}
	 
	
	//오른쪽 프리뷰용 변수 설정
	offer1 = val1;//최소구매액
	offer2 = val2;//최대 할인액 or 할인액
	offer3 = val3;//할인률
	
  $("#shn_crd_offer_code").val(cdm_cd);
	$(".offer1").removeClass("on");
	$(".offer2").removeClass("on");
	$("."+id).addClass("on");
	
	preView();
}



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
			//if(parseInt(camp_stat) >= 100){cursorType = "default";}else{cursorType = "pointer";}
		  
			cursorType = "pointer";
		  storeHtml += "<p id='"+p_id+"' class='"+classType+"' style='cursor:"+cursorType+"' onclick=\"javascript:selectCode('1', '"+p_id+"' , '"+storeTm_json[i].CDM_CD+"', '"+storeTm_json[i].CDM_CD_NM+"','"+storeTm_json[i].MD_STORE+"');\">"+storeTm_json[i].CDM_CD_NM+"</p>";
	  }
	}
  
  $("#store").html(storeHtml);
}


/*===============================================================
코드 선택
===============================================================*/
function selectCode(flag, id, cdm_cd, cdm_nm, md_store){
  
  if(flag == "1" && md_store == "1"){
	  
	  sel_store_cd = cdm_cd;
		sel_store_nm = cdm_nm;
		
	  $("#store p").removeClass("on");
	  $("#"+id).addClass("on");
	}
}	 



/**========================================================================================
* 전화번호 형식 체크
========================================================================================*/
function phoneNumberCheck(inputId){
	//if(parseInt(camp_stat) >= 300){return;}
	
	var inputValue = $("#"+inputId).val();
	
	if(inputValue == "" || inputValue == null){return;}
	
	inputValue= formatPhone(inputValue);
	//inputValue= formatMobile(inputValue);
	
	if(isValidPhone(inputValue) == false){
		cmdMessage(0, "번호를 확인하세요");
	 	$("#"+inputId).val("");
	 	$("#"+inputId).focus();
		return;
	}
	
	$("#"+inputId).val(inputValue);
	
	preView();
}



/*===============================================================
행사 기간 체크
===============================================================*/
function dateCheck(){
  var str_dt = sDelHypn($("#evt_str_dt").val());
  var end_dt = sDelHypn($("#evt_end_dt").val());
	  
  var calDate = getCalDate(str_dt,end_dt ,"D");//시작일 보다 종료일이 작지 않도록 체크
  
  if(calDate < 1){
	  cmdMessage(0,"행사 기간을 확인 하세요.");
		
		$('#evt_str_dt').datepicker('setDate', '+8D');
		$('#evt_end_dt').datepicker('setDate', '+8D');
	  
	  $("#evt_str_dt").focus();
	  return;
  }
  
  preView();
}




/*===============================================================
점포 팝업 확인
===============================================================*/
function storeConfirm(){
	
	if(sel_store_cd != ""){
		$("#tget_store_cd").val(sel_store_cd);
		$("#store_nm").text(sel_store_nm);

		
		//점포 변경 시 층정보,매장전화번호 조회-------------------------
  	var sel_floor = "";
  	var sel_telno = "";
  	
  	var selStoreNoTm = new oza_TMHandler('com.obzen.bmp.DocCampRegSH', 'selectStoreNo', '1', '\@#%');
  	selStoreNoTm.setAddDataField('MD_CD', md_cd);
  	selStoreNoTm.setAddDataField('STORE_CD', sel_store_cd);
  	selStoreNoTm.returnlist('SHOP_PHONE_NO;STORE_ADDR;EVT_FLR_SH');
  	selStoreNoTm.execute(null, false);
  	sel_floor = selStoreNoTm.ElementValue('EVT_FLR_SH');
  	sel_telno = selStoreNoTm.ElementValue('SHOP_PHONE_NO');
  	store_addr = selStoreNoTm.ElementValue('STORE_ADDR');
  	selStoreNoTm.clear();	
  	
  
  	if(sel_floor != ""){
  		$("#evt_flr_nm").text(sel_floor);
			$("#evt_flr").val(sel_floor);	
  	}else{
  		$("#evt_flr_nm").text("");
			$("#evt_flr").val("");
  	}
  	
  	
  	if(sel_telno != ""){
  		$("#shop_phone_no").val(sel_telno);
  		phoneNumberCheck("shop_phone_no");//매장 전화번호 체크
  	}else{
  		$("#shop_phone_no").val("");
  	}
  	
  	
  	
    //예상 접근 고객수 조회
    var sel_max_cust_cnt = "0";
  	var selMdInfoShTm = new oza_TMHandler('com.obzen.bmp.DocCampRegSH', 'selectMdInfoSH', '1', '\@#%');
  	selMdInfoShTm.setAddDataField('MD_CD', md_cd);
  	selMdInfoShTm.setAddDataField('STORE_CD', sel_store_cd);
  	selMdInfoShTm.returnlist('MD_GRD_CD;MAX_CUST_CNT;CATE_CD;CATE_NM');
  	selMdInfoShTm.execute(null, false);
  	sel_max_cust_cnt = selMdInfoShTm.ElementValue('MAX_CUST_CNT');//예상접근고객수
  	selMdInfoShTm.clear();	
  	
  	
  	if(sel_max_cust_cnt != ""){
  		$("#max_cust_cnt").val(AddComma(sel_max_cust_cnt)+" 명");
  	}else{
  		$("#max_cust_cnt").val("0 명");
  	}
  }
	
	
	popupClose('snm_popup'); 
	
	preView();
}

/*===============================================================
층정보 팝업 확인
===============================================================*/
function floorConfirm(){
	
	var input_evt_flr_nm = "";
	input_evt_flr_nm = $("#input_evt_flr_nm").val();
	
	$("#evt_flr_nm").text(input_evt_flr_nm);
	$("#evt_flr").val(input_evt_flr_nm);
	
	popupClose('floor_popup2'); 
	
	preView();
}


/*===============================================================
팝업 Open
===============================================================*/
function layerPopOpen(popupN){
  var innerHtml = "";
  
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
	
	
  $layer.css("position", "absolute");
	$layer.css("top",(($(window).height() - $layer.outerHeight()) / 2) + $(window).scrollTop() - 130);
  $layer.css("left",(($(window).width() - $layer.outerWidth()) / 2) + $(window).scrollLeft() - 420);
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
  
  
	
  
  if(input_id != "athor_desc"){preView();}
}



/*===============================================================
모바일 미리보기
===============================================================*/
function preView() {
	var innerHtml = "";
	
	var mo_flr = $("#evt_flr").val();
	
	if(mo_flr != ""){
		if(mo_flr.indexOf("-") > -1){
			mo_flr = "B"+mo_flr.replace("-","")+"층"
		}else{
			mo_flr = mo_flr+"층"	
		}
	}
	
	innerHtml += "<div class='txt'>";
	innerHtml += "<strong>혜택 매장</strong>";
	innerHtml += "<p>"+$("#intg_bran_nm").val()+" "+$("#store_nm").text()+"<br>"+mo_flr+"<br>"+store_addr;
	innerHtml += "<br>매장 전화 번호 : "+$("#shop_phone_no").val();
	innerHtml += "<strong>"+$("#camp_nm").val()+"<br>"+$("#camp_desc").val().replace(/(?:\r\n|\r|\n)/g,"<br>")+"</strong>";
	innerHtml += "</p>";
	innerHtml += "<strong>혜택 안내</strong>";
	
	if(offer3 != ""){
		innerHtml += "<p>"+offer3+"% 결제일 할인<br>("+offer1+"원 이상 결재시, 최대 "+offer2+"원 까지 <br>할인)</p>";	
	}else{
		innerHtml += "<p>"+offer1+"원 이상 결재시, "+offer2+"원 할인</p>";
	}
	
	innerHtml += "<span class='mt20'>- 혜택 더하기 후 혜택 적용이 가능합니다.</span>";
	innerHtml += "<span>- 할인적용 내역은, 결제 후 결제일할인(청구할인)<br>";
	innerHtml += "적용시 점에서 확인 가능합니다.(단 결제일 할인<br>";
	innerHtml += "(청구할인) 적용시점은 매장에 따라 차이가 있을 수 <br>";
	innerHtml += "있습니다.</span>";
	innerHtml += "<strong>혜택 제공기간</strong>";
	innerHtml += "<p>"+setValidDate2(replaceAll($("#evt_str_dt").val(),"-","."))+" ~ "+setValidDate2(replaceAll($("#evt_end_dt").val(),"-","."))+"</p>";
	innerHtml += "</div>";
	
	innerHtml += "<div class='coupon'>";
	innerHtml += "<div class='c_txt'>";
	innerHtml += "<p class='txt1'>"+$("#intg_bran_nm").val()+" "+$("#store_nm").text()+"</p>";
	innerHtml += "<p class='txt3'>"+$("#store_nm").text()+"["+mo_flr+"]</p>";
	
	if(offer3 != ""){
		innerHtml += "<strong>"+offer3+"%</strong>";	
	}else{
		innerHtml += "<strong>"+offer2+"원</strong>";
	}
	
	innerHtml += "<p class='txt3'>결제일 할인</p>";
	
	if(offer3 != ""){
		innerHtml += "<p class='txt2'>"+offer1+"원 이상 결제시<br>최대 "+offer2+"원 까지</p>";	
	}else{
		innerHtml += "<p class='txt2'>"+offer1+"원 이상 결제시<br>"+offer2+"원 까지</p>";
	}
	
	innerHtml += "<p class='txt4'>"+$("#camp_nm").val()+"</p>";
	innerHtml += "<p class='txt2'>"+setValidDate2(replaceAll($("#evt_str_dt").val(),"-","."))+" ~ "+setValidDate2(replaceAll($("#evt_end_dt").val(),"-","."))+"</p>";
	innerHtml += "</div>";
	innerHtml += "</div>";
	innerHtml += "<div class='btn_more'><p>혜택 더하기</p></div>";
	
	$("#pre_view").html(innerHtml);
}



/*===============================================================
임시 저장
===============================================================*/
var new_camp_id = "";
var custg_id = "";
var act_id = "";
var old_act_id = "";

function tempSave() {
	var msg = "";
	
	if(mod_flag == "N"){return;}
	if(reg_id != "" && user_id != reg_id){return;}
	if(sh_auth == "N"){return;}
	
	cate_cd = $.trim($("#cate_cd").val());
	camp_nm = $.trim($("#camp_nm").val());
	camp_desc = $("#camp_desc").val(); 
	intg_bran_cd = $.trim($("#intg_bran_cd").val());
	intg_bran_nm = $.trim($("#intg_bran_nm").val());
	tget_store_cd = $.trim($("#tget_store_cd").val()); 
	evt_flr = $.trim($("#evt_flr").val());
	shop_phone_no = replaceAll($.trim($("#shop_phone_no").val()),"-","");
	evt_str_dt = sDelHypn($.trim($("#evt_str_dt").val()));
	evt_end_dt = sDelHypn($.trim($("#evt_end_dt").val())); 
	shn_crd_offer_code = $.trim($("#shn_crd_offer_code").val());
	shn_crd_max_cust_cnt = DelComma(replaceAll($.trim($("#max_cust_cnt").val()),"명",""));
	store_addr = $.trim(store_addr);
	
	
	if(camp_nm == ""){cmdMessage(2, "행사명"); $("#camp_nm").focus();return;}
	if(camp_desc == ""){cmdMessage(2, "행사설명"); $("#camp_desc").focus();return;}
	if(intg_bran_nm == ""){cmdMessage(2, "행사 브랜드명"); $("#intg_bran_nm").focus();return;}
	if(tget_store_cd == ""){cmdMessage(3, "점포"); $("#tget_store_cd").focus();return;}
	if(evt_flr == ""){cmdMessage(2, "층정보"); $("#evt_flr").focus();return;}
	if(shop_phone_no == ""){cmdMessage(2, "매장 전화번호"); $("#shop_phone_no").focus();return;}
	if(evt_str_dt == ""){cmdMessage(2, "행사기간 시작일"); $("#evt_str_dt").focus();return;}
	if(evt_end_dt == ""){cmdMessage(2, "행사기간 종료일"); $("#evt_end_dt").focus();return;}
	if(shn_crd_offer_code == ""){cmdMessage(3, "오퍼"); $("#shn_crd_offer_code").focus();return;}
	
	
	if(camp_nm != ""){
	  var charCheck = "";
	  
	  if(camp_nm.indexOf("$") > -1){charCheck = "$";}
	  if(camp_nm.indexOf("&") > -1){charCheck = "&";}
	  if(camp_nm.indexOf(">") > -1){charCheck = ">";}
	  if(camp_nm.indexOf("<") > -1){charCheck = "<";}
	  if(camp_nm.indexOf("/") > -1){charCheck = "/";}
	  if(camp_nm.indexOf("\'") > -1){charCheck = "\'";}
	  if(camp_nm.indexOf("\"") > -1){charCheck = "\"";}
	  if(camp_nm.indexOf(";") > -1){charCheck = ";";}
	  
	  if(charCheck != ""){
	  	cmdMessage(0,"행사명에 특수문자는 사용할 수 없습니다. ($&<>/\'\";)");
	  	return;
	  }
	}
	
	//행사진행 가능여부 체크
	var checkBmpEvtTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'checkBmpevt', '1', '\@#%');
	checkBmpEvtTm.setAddDataField('CAMP_ID', camp_id);//캠페인 id
	checkBmpEvtTm.setAddDataField('MD_CD', md_cd);//MD코드
	checkBmpEvtTm.setAddDataField('TGET_STORE_CD', tget_store_cd);//점포코드
	checkBmpEvtTm.setAddDataField('CAMP_STR_DT', evt_str_dt);//행사 시작 일자
	checkBmpEvtTm.setAddDataField('SHN_CRD_EVT_YN', 'Y');
	checkBmpEvtTm.setAddDataField('BMPEVT_TY_CD', '1');
	checkBmpEvtTm.returnlist('BMPEVT_YN;ING_CAMP_ID;ING_CAMP_NM');
	checkBmpEvtTm.execute(null, false);
	var bmpevt_yn = checkBmpEvtTm.ElementValue('BMPEVT_YN');
	var ing_camp_id = checkBmpEvtTm.ElementValue('ING_CAMP_ID');
	var ing_camp_nm = checkBmpEvtTm.ElementValue('ING_CAMP_NM');
	checkBmpEvtTm.clear();
	
	if(bmpevt_yn == "N"){cmdMessage(0, ing_camp_nm+"("+ing_camp_id+")가 진행 중 입니다."); return;}
	
	 
	 if(cmdMessage(1, "임시 저장 하시겠습니까?") == false){
			return;
	 }
		
	 
	 lodingImgOn();//백그라운드 이미지 활성(더블클릭방지)
	 
	 if(camp_id == ""){
		 //캠페인 ID 생성
		 var insertCampIdTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'insertCampID', '1', '\@#%');
		 insertCampIdTm.setAddDataField('USERID', user_id);
		 insertCampIdTm.returnlist('CAMP_ID');
		 insertCampIdTm.execute(null, false);
		 new_camp_id = insertCampIdTm.ElementValue('CAMP_ID');
		 insertCampIdTm.clear();	 
	 }
	 
	 if(camp_id != ""){new_camp_id = camp_id;}

	 
	 if(new_camp_id != ""){
		 //등록
		 var insertCampInfoTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'insertCampInfo', '1', '\@#%');
		 insertCampInfoTm.setAddDataField('CAMP_ID', new_camp_id);
		 insertCampInfoTm.setAddDataField('CAMP_NM', camp_nm);
		 insertCampInfoTm.setAddDataField('CAMP_DESC', camp_desc);
		 insertCampInfoTm.setAddDataField('CAMP_STR_DT', evt_str_dt);
		 insertCampInfoTm.setAddDataField('CAMP_END_DT', evt_end_dt);
		 insertCampInfoTm.setAddDataField('INTG_BRAN_NM', intg_bran_nm);
		 insertCampInfoTm.setAddDataField('INTG_BRAN_CD', intg_bran_cd);
		 insertCampInfoTm.setAddDataField('TGET_STORE_CD', tget_store_cd);
		 insertCampInfoTm.setAddDataField('EVT_FLR', evt_flr);
		 insertCampInfoTm.setAddDataField('SHN_CRD_OFFER_CODE', shn_crd_offer_code);
		 insertCampInfoTm.setAddDataField('BMPEVT_TY_CD', '1');
		 insertCampInfoTm.setAddDataField('MD_CD', md_cd);
		 insertCampInfoTm.setAddDataField('SHN_CRD_EVT_YN', 'Y');
		 insertCampInfoTm.setAddDataField('USERID', user_id);
		 insertCampInfoTm.setAddDataField('SHN_CRD_MAX_CUST_CNT', shn_crd_max_cust_cnt);
		 insertCampInfoTm.setAddDataField('CATE_CD', cate_cd);
		 insertCampInfoTm.returnlist('LOGMSG');
		 insertCampInfoTm.execute(null, false);
		 msg = insertCampInfoTm.ElementValue('LOGMSG');
		 insertCampInfoTm.clear();	
		 
		 
		 var insertCustgSHTm = new oza_TMHandler('com.obzen.bmp.DocCustg', 'insertCustgSH', '1', '\@#%');
		 insertCustgSHTm.setAddDataField('USERID', user_id);
		 insertCustgSHTm.setAddDataField('CAMP_ID', new_camp_id);
		 insertCustgSHTm.returnlist('CUSTG_ID');
		 insertCustgSHTm.execute(null, false);
		 custg_id = insertCustgSHTm.ElementValue('CUSTG_ID');
		 insertCustgSHTm.clear();
		 
		 
		 var insertOfferSHTm = new oza_TMHandler('com.obzen.bmp.DocCampRegSH', 'insertOfferSH', '1', '\@#%');
		 insertOfferSHTm.setAddDataField('USERID', user_id);
		 insertOfferSHTm.setAddDataField('CAMP_ID', new_camp_id);
		 insertOfferSHTm.setAddDataField('OFFER_ID', shn_crd_offer_code);
		 insertOfferSHTm.setAddDataField('SHOP_PHONE_NO', shop_phone_no);
		 insertOfferSHTm.setAddDataField('STORE_ADDR', store_addr);
		 insertOfferSHTm.setAddDataField('OLD_ACT_ID', old_act_id);
		 insertOfferSHTm.returnlist('ACT_ID;LOGMSG');
		 insertOfferSHTm.execute(null, false);
		 act_id = insertOfferSHTm.ElementValue('ACT_ID');
		 insertOfferSHTm.clear();

	 }
	 
	 //캠페인 설계
	 
	
	 
	 screenLog("임시저장", "web_cp_shinhancard", "브랜드마케팅>행사등록하기>신한카드 FAN 행사등록",get_client_ip);//화면 로그(공통)
	 //cmdMessage(0,msg);
	 
	 camp_id = new_camp_id;
	 do_RefreshPage("save");
}




/**========================================================================================
* 검토요청
========================================================================================*/
function checkRequest(){
	if(camp_id == ""){return;}
	if(mod_flag == "N"){return;}
	if(reg_id != "" && user_id != reg_id){return;}
	if(sh_auth == "N"){return;}
	
	//검토요청 내용 입력 팝업 호출
	layerPopOpen('layer_review');
}


/*===============================================================
검토요청 팝업 확인
===============================================================*/
function checkConfirm(){
	
	var input_athor_desc = "";
	input_athor_desc = $("#athor_desc").val();
	
	if(input_athor_desc != ""){
		$("#athor_desc").val(input_athor_desc);
	}else{
		cmdMessage(2,"요청사항");
		return;
	}
	
	//행사시작일자, 문자전송일자 체크
	var campDtChkTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'campDtChk', '1', '\@#%');
  campDtChkTm.setAddDataField('CAMP_ID', camp_id);
  campDtChkTm.setAddDataField('SHN_CRD_EVT_YN', "Y");
  campDtChkTm.returnlist('LOGMSG;LOGCD');
  campDtChkTm.execute(null, false);
  var chk_msg = campDtChkTm.ElementValue('LOGMSG');
  var chk_log_cd = campDtChkTm.ElementValue('LOGCD');
  campDtChkTm.clear();
	
  //1이 정상
  if(chk_log_cd == "0"){cmdMessage(0,chk_msg);return;}
  
	
	if(cmdMessage(1, "검토 요청 하시겠습니까?") == false){
		return;
	}
	
	
	//lodingImgOn();//백그라운드 이미지 활성(더블클릭방지)
	
  var insertAppReqSmTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'insertAppReqSm', '1', '\@#%');
  insertAppReqSmTm.setAddDataField('CAMP_ID', camp_id);
  insertAppReqSmTm.returnlist('LOGMSG;LOGCD');
  insertAppReqSmTm.execute(null, false);
  var msg = insertAppReqSmTm.ElementValue('LOGMSG');
  var log_cd = insertAppReqSmTm.ElementValue('LOGCD');
  insertAppReqSmTm.clear();
	
  screenLog("검토요청", "web_cp_shinhancard", "브랜드마케팅>행사등록하기>신한카드 FAN 행사등록");//화면 로그(공통)
  cmdMessage(0,msg);
  if(log_cd == "0"){return;}
  
  
  
  //do_RefreshPage("save");
  
	//Tab 닫기
	//닫을 Tab의 메인 페이지 명을 지정한다.
	//검토요청 후 자동으로 Tab을 닫는다.
	parent.ClosePage("/ManageBaseServer/Frames/Campaign/BMP/CampPlan/web_cp_shinhancard_main");
}


/**========================================================================================
 * 새로 만들기
 ========================================================================================*/
 function create(){
	 
	 /*
   if(cmdMessage(1, "새로만들기를 진행 하시겠습니까?") == false){
     	return;
   }
  */
  
   do_RefreshPage("new");
 }



/**========================================================================================
 * 검색(팝업 호출)
 ========================================================================================*/
function searchPopup() {
	 var url = "web_cp_campsearch_pop.jsp";
	 //var url = "web_cp_campsearch_pop2.jsp";
  var name = "web_cp_campsearch";
  var option = "location=no,menubar=no,resizable=no,scrollbars=no,titlebar=no,toolbar=no";
  
	 //해상도 계산하여 위치 조절
	var popupX = (document.body.offsetWidth / 2) - (200 / 2);
  var popupY = (document.body.offsetHeight / 2) - (300 / 2);
	 
	option += ",top="+popupY+",left="+popupX+",height=512,width=825";
  
	var frm = $("form#frm")[0];
	frm.shn_crd_evt_yn.value = "Y";
	
  var ret = window.open("web_cp_campsearch_pop.jsp", name, option);
  
  /*
  //post 방식
  var frm = $("form#frm")[0];
  frm.shn_crd_evt_yn.value = "Y";
  frm.action = "web_cp_campsearch_pop.jsp";
  frm.target = name;
  frm.method = "post";
  frm.submit();
  */
  
  $("#mask").css("display","");//팝업 호출 시 보이게 설정
  
  $('#mask').click(function() {
		ret.focus();
	});
  
	 //popupOpen(url, name, "512", "825", option);
}    


/**========================================================================================
 * 팝업 반환값
 ========================================================================================*/
function getReturnValue(pageParam){
	camp_id = pageParam[0].value;
	
	do_RefreshPage("return");
}

</script>

<input type="hidden" id="cate_cd">
<input type="hidden" id="intg_bran_cd">
<input type="hidden" id="tget_store_cd">
<input type="hidden" id="evt_flr">
<input type="hidden" id="shn_crd_offer_code">
<div class="campaign_wrap">
  <div class="campaign_top">
    <div class="campaign_sel">
      <dl id="camp_dl">
        <dt>선택된 캠페인명</dt>
        <dd>
          <input type="text" class="c_code" id="top_camp_id" name="top_camp_id" disabled />
          <input type="text" class="c_title" id="top_camp_nm" name="top_camp_nm" disabled />
        </dd>
      </dl>
      <p id="camp_p">신한카드 정보를 등록해 주세요.</p>
      <div class="btn_box">
        <a href="javascript:searchPopup();" class="btn_search">불러오기</a>
        <a href="javascript:create();" class="btn_new">새로만들기</a>
      </div>
    </div>
  </div>
</div>
  <div class="coupon_wrap">
    <div class="coupon_cnt">
      <p class="tit">신한 카드 FAN 마이샵 쿠폰 등록<span>브랜드 행사 홍보 방식을 선택해 주세요.</span></p>
      <ul>
        <li>
          <label for="">대상장르</label>
          <input type="text" disabled id="cate_nm">
        </li>
        <li>
          <label for="">행사 명</label>
          <input type="text" id="camp_nm" onblur="javascript:inputCheck('50',  this.value, 'camp_nm');"> 
        </li>
        <li>
          <label for="">행사 설명</label>
          <textarea id="camp_desc" onblur="javascript:inputCheck('1000',  this.value, 'camp_desc');"></textarea>
        </li>
        <li>
          <label for="">행사 브랜드 명</label>
          <input type="text" id="intg_bran_nm" onblur="javascript:inputCheck('1000',  this.value, 'intg_bran_nm');">
        </li>
        <li class="wd50 mr18">
          <label for="">대상 점포</label>
          <p id="store_nm"></p>
          <a id="store_nm_button" href="javascript:layerPopOpen('snm_popup');">점포변경</a>
          <div id="snm_popup" class="layer">
            <p class="tit">대상 점포를 선택해주세요<a href="javascript:popupClose('snm_popup');" class="btn_close">닫기</a></p>
            <div class="list" id="store"></div>
            <div class="pop_btn">
              <a href="javascript:storeConfirm();" class="btn_submit">확인</a>
              <a href="javascript:popupClose('snm_popup');" class="btn_cancel">취소</a>
            </div>
          </div>
        </li>
        <li class="wd50">
          <label for="">층 정보</label>
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
            <p class="tit">층정보 수정<a href="javascript:popupClose('floor_popup2');" class="btn_close">닫기</a></p>
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
        
        
        </li>
        <li>
          <label for="">매장 전화 번호</label>
          <input type="text" id="shop_phone_no">
        </li>
        <li class="period">
          <label for="">행사 일정</label>
          <input type="text" id="evt_str_dt"> ~ <input type="text" id="evt_end_dt">
        </li>
        <li id="offer_list">
        </li>
        <li>
          <label for="">예상 접근 고객 수</label>
          <input type="text" disabled id="max_cust_cnt">
        </li>
      </ul>
      
      <div class="coupon_view">
        <p class="view_tit">신한카드_MySHOP 화면(예시)</p>
        <div class="view_cnt" id="pre_view"></div>
      </div>
      
      
    </div>
    <div class="btn_box">
      <a href="javascript:tempSave();" class="btn_save">임시저장</a>
      <a href="javascript:checkRequest();" class="btn_review">검토요청</a>
    </div>
    
    <!-- 검토요청 팝업 시작 -->
    <div id="layer_review" class="layer">
      <p class="tit">검토요청<a href="javascript:popupClose('layer_review');" class="btn_close">닫기</a></p>
      <div class="lr_cnt">
        <label for="">요청사항</label>
        <textarea id="athor_desc" placeholder="요청사항을 기재하여 주세요.&#13;&#10;(최대 512byte)" onblur="javascript:inputCheck('512',  this.value, 'athor_desc');"></textarea>
      </div>
      <div class="pop_btn">
        <a href="javascript:checkConfirm();" class="btn_submit">확인</a>
        <a href="javascript:popupClose('layer_review');" class="btn_cancel">닫기</a>
      </div>
    </div>
    <!-- 검토요청 팝업 종료 -->
    
  </div>

<form id="frm" method="post" >
<input type="hidden" id="shn_crd_evt_yn" name="shn_crd_evt_yn"/>
</form>
  
  
  