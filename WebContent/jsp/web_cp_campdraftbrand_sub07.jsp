<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
 <script type="text/javascript">

 var slideIndex = 3;
 
//TM Start ===============================================================================================

//행사 정보 조회
var exa_camp_nm = "";
var exa_camp_desc = "";
var exa_camp_str_dt = "";
var exa_camp_end_dt = "";
var exa_store_nm = "";
var exa_tget_store_cd = "";
var exa_evt_flr = "";
var exa_brand_nm = "";
var exa_bran_offer1 = "";
var exa_bran_offer2 = "";
var exa_bran_offer3 = "";
var exa_bran_offer1_desc = "";
var exa_bran_offer2_desc = "";
var exa_bran_offer3_desc = "";
var exa_offer1 = "";
var exa_offer2 = "";
var exa_offer3 = "";
var exa_offer4 = "";
var flr_nm = "";
var str_day = "";
var end_day = "";


var athor_desc = "";//검토요청 내용

var campSummaryTm = new oza_TMHandler('com.obzen.bmp.DocActInfo', 'selectCampSummary', '1', '\@#%');
campSummaryTm.setAddDataField('CAMP_ID', camp_id);
campSummaryTm.returnlist('CAMP_NM'+//행사명
                   		';CAMP_DESC'+//행사설명                		
                   		';CAMP_STR_DT'+//행사시작일자
                   		';CAMP_END_DT'+//행사종료일자
                   		';CAMP_STR_DAY'+//행사시작요일
                   		';CAMP_END_DAY'+//행사종료요일
                   		';STORE_NM'+//점포명
                   		';EVT_FLR'+//층정보(행사장소)
                   		';TGET_STORE_CD'+//점포코드
                   		';BRAN_OFFER1'+//md혜택
                  		';BRAN_OFFER2'+//할인혜택
                  		';BRAN_OFFER3'+//증정혜택
                  		';BRAN_OFFER1_DESC'+//md혜택 설명
                  		';BRAN_OFFER2_DESC'+//할인혜택 설명
                  		';BRAN_OFFER3_DESC'+//증정혜택 설명
                   		';OFFER1'+//제공혜택1
                  		';OFFER2'+//제공혜택2
                  		';OFFER3'+//제공혜택3
                  		';OFFER4'+//제공혜택4
                   		';INTG_BRAN_NM');//브랜드명
campSummaryTm.execute(null, false);
exa_camp_nm = campSummaryTm.ElementValue('CAMP_NM');
exa_camp_desc = campSummaryTm.ElementValue('CAMP_DESC');
exa_camp_str_dt = campSummaryTm.ElementValue('CAMP_STR_DT');
exa_camp_end_dt = campSummaryTm.ElementValue('CAMP_END_DT');
str_day = campSummaryTm.ElementValue('CAMP_STR_DAY');
end_day = campSummaryTm.ElementValue('CAMP_END_DAY');
exa_store_nm = campSummaryTm.ElementValue('STORE_NM');
exa_tget_store_cd = campSummaryTm.ElementValue('TGET_STORE_CD');
exa_evt_flr = campSummaryTm.ElementValue('EVT_FLR');
exa_brand_nm = campSummaryTm.ElementValue('INTG_BRAN_NM');
exa_bran_offer1 = campSummaryTm.ElementValue('BRAN_OFFER1');
exa_bran_offer2 = campSummaryTm.ElementValue('BRAN_OFFER2');
exa_bran_offer3 = campSummaryTm.ElementValue('BRAN_OFFER3');
exa_bran_offer1_desc = campSummaryTm.ElementValue('BRAN_OFFER1_DESC');
exa_bran_offer2_desc = campSummaryTm.ElementValue('BRAN_OFFER2_DESC');
exa_bran_offer3_desc = campSummaryTm.ElementValue('BRAN_OFFER3_DESC');
exa_offer1 = campSummaryTm.ElementValue('OFFER1');
exa_offer2 = campSummaryTm.ElementValue('OFFER2');
exa_offer3 = campSummaryTm.ElementValue('OFFER3');
exa_offer4 = campSummaryTm.ElementValue('OFFER4');
campSummaryTm.clear();
	 

//검토이력 조회
var old_sysid = "";

var appHisTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'selectAppHis', '1', '\@#%');
appHisTm.setAddDataField('CAMP_ID', camp_id);
appHisTm.returnlist('OLD_SYSID');
appHisTm.execute(null, false);
old_sysid = appHisTm.ElementValue('OLD_SYSID');
appHisTm.clear();


//스크립트 정보 조회
var exa_scrt_ttl = "";
var exa_script = "";
var exa_edm_url = "";

var actInfoBMPTm = new oza_TMHandler('com.obzen.bmp.DocActInfo', 'selectActInfoBMP', '1', '\@#%');
actInfoBMPTm.setAddDataField('CAMP_ID', camp_id);
actInfoBMPTm.returnlist('SCRT_TTL;SCRIPT;EDM_URL');
actInfoBMPTm.execute(null, false);
exa_scrt_ttl = actInfoBMPTm.ElementValue('SCRT_TTL');
exa_script = actInfoBMPTm.ElementValue('SCRIPT');
exa_edm_url = actInfoBMPTm.ElementValue('EDM_URL');
actInfoBMPTm.clear();


//무료수신거부 번호 조회
var scrt_add_cont1 = "";
var scrt_add_cont2 = "";

var refusalNoTm = new oza_TMHandler('com.obzen.bmp.DocBMPComm', 'selectRefusalNo', '1', '\@#%');
refusalNoTm.returnlist('SCRT_ADD_CONT1;SCRT_ADD_CONT2');
refusalNoTm.execute(null, false);
scrt_add_cont1 = refusalNoTm.ElementValue('SCRT_ADD_CONT1');//신세계 전체
scrt_add_cont2 = refusalNoTm.ElementValue('SCRT_ADD_CONT2');//브랜드
refusalNoTm.clear();


//공문명, 약정서 작성여부 조회
var doc_no = "";
var ofldc_titl = "";

var docTm = new oza_TMHandler('com.obzen.bmp.DocCampConfirm', 'selectDoc', '1', '\@#%');
docTm.setAddDataField('CAMP_ID', camp_id);
docTm.returnlist('DOC_NO;OFLDC_TITL');
docTm.execute(null, false);
doc_no = docTm.ElementValue('DOC_NO');//약정서 번호
ofldc_titl = docTm.ElementValue('OFLDC_TITL');//공문명
if(ofldc_titl == ""){ofldc_titl = "공문없음";};
if(doc_no == ""){doc_no = "작성안함";};
docTm.clear();



//약정서 캠페인정보 조회
var ctrt_store_cd = "";
var offer_prdt_cost = "";
var ctrt_camp_nm = "";
var ctrt_str_dt = "";
var ctrt_end_dt = "";
var ctrt_brand_nm = "";
var ctrt_brand_cd = "";

var ctrtDocTm = new oza_TMHandler('com.obzen.bmp.DocCtrtDoc', 'selectCtrtDoc', '1', '\@#%');
ctrtDocTm.setAddDataField('CAMP_ID', camp_id);
ctrtDocTm.returnlist('CAMP_NM;CAMP_STR_DT;CAMP_END_DT;BRAND_CD;BRAND_NM;STORE_CD;OFFER_PRDT_COST');
ctrtDocTm.execute(null, false);
ctrt_camp_nm = ctrtDocTm.ElementValue('CAMP_NM');
ctrt_str_dt = ctrtDocTm.ElementValue('CAMP_STR_DT');
ctrt_end_dt = ctrtDocTm.ElementValue('CAMP_END_DT');
ctrt_brand_cd = ctrtDocTm.ElementValue('BRAND_CD');
ctrt_brand_nm = ctrtDocTm.ElementValue('BRAND_NM');
ctrt_store_cd = ctrtDocTm.ElementValue('STORE_CD');
offer_prdt_cost = ctrtDocTm.ElementValue('OFFER_PRDT_COST');//예상비용
ctrtDocTm.clear();


//약정서 신세계 기본 부담 비용 조회
var ssg_base_burd_amt = "";

var ssgBurdAmtTm = new oza_TMHandler('com.obzen.bmp.DocCtrtDoc', 'selectSSGBurdAmt', '1', '\@#%');
ssgBurdAmtTm.returnlist('SSG_BASE_BURD_AMT');
ssgBurdAmtTm.execute(null, false);
ssg_base_burd_amt = ssgBurdAmtTm.ElementValue('SSG_BASE_BURD_AMT');//신세계기본부담비용
ssgBurdAmtTm.clear();


//약정서 정보 조회
var cnt = "";
var ctrt_doc_no = "";
var expt_prof_amt = "";
var purs_expt_prof_amt = "";
var supler_expt_prof_amt = "";
var brand_ratio = "";
var bran_cont_expt_amt = "";

var ctrtDocNoTm = new oza_TMHandler('com.obzen.bmp.DocCtrtDoc', 'selectCtrtDocNo', '1', '\@#%');
ctrtDocNoTm.setAddDataField('CAMP_ID', camp_id);
ctrtDocNoTm.returnlist('CNT;DOC_NO;EXPT_PROF_AMT;PURS_EXPT_PROF_AMT;SUPLER_EXPT_PROF_AMT;BRAND_RATIO;BRAN_CONT_EXPT_AMT');
ctrtDocNoTm.execute(null, false);
cnt = ctrtDocNoTm.ElementValue('CNT');
ctrt_doc_no = ctrtDocNoTm.ElementValue('DOC_NO');
expt_prof_amt = ctrtDocNoTm.ElementValue('EXPT_PROF_AMT');//예상이익
purs_expt_prof_amt = ctrtDocNoTm.ElementValue('PURS_EXPT_PROF_AMT');//예상이익 신세계
supler_expt_prof_amt = ctrtDocNoTm.ElementValue('SUPLER_EXPT_PROF_AMT');//예상이익 브랜드
brand_ratio = ctrtDocNoTm.ElementValue('BRAND_RATIO');//
bran_cont_expt_amt = ctrtDocNoTm.ElementValue('BRAN_CONT_EXPT_AMT');//브랜드컨텐츠부담비용
ctrtDocNoTm.clear();


//혜택1선택여부 조회(약정서 작성을 위해)
var offer1_cnt = "";

var isOffer1Tm = new oza_TMHandler('com.obzen.bmp.DocCampOfferSel', 'selectIsOffer1', '1', '\@#%');
isOffer1Tm.setAddDataField('CAMP_ID', camp_id);
isOffer1Tm.returnlist('OFFER1_CNT');
isOffer1Tm.execute(null, false);
offer1_cnt = isOffer1Tm.ElementValue('OFFER1_CNT');
isOffer1Tm.clear();



//공동판촉약정서 필수체크 여부 조회
var ctrtDocNcssYnTm = new oza_TMHandler('com.obzen.bmp.DocCtrtDoc', 'selectCtrtDocNcssYn', '1', '\@#%');
ctrtDocNcssYnTm.setAddDataField('CAMP_ID', camp_id);
ctrtDocNcssYnTm.returnlist('CTRTDOC_NCSS_YN');
ctrtDocNcssYnTm.execute(null, false);
if(ctrtdoc_ncss_yn == ""){ctrtdoc_ncss_yn = ctrtDocNcssYnTm.ElementValue('CTRTDOC_NCSS_YN');}
ctrtDocNcssYnTm.clear();


//TM End =================================================================================================



var ssg_ratio = "";
var expt_burd_amt = offer_prdt_cost;
var purs_expt_burd_amt = "";
var supler_expt_burd_amt = "";
var brand_nm_input = "";
var share_ratio = "";


//화면 로드 시 실행
$(document).ready(function() {
	//$('html, body').animate({scrollTop: $('#web_cmp_content').offset().top}, 'fast');
	screenLog("조회", "web_cp_campdraftbrand_sub07", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>검토 요청",get_client_ip);//화면 로그(공통)
	
	//메시지 Byte 계산
	inputCheck("2000", exa_script, "script_byte");
	
	$("#brand_nm").html(intg_bran_nm + "(" + intg_bran_cd +")");
	
	if(exa_camp_nm.length > 21){exa_camp_nm = exa_camp_nm.substring(0,18)+"...";}
	if(exa_camp_desc.length > 24){exa_camp_desc = exa_camp_desc.substring(0,21)+"...";}
	
	flr_nm = exa_store_nm+""+exa_evt_flr;
	if(flr_nm.length > 7){flr_nm = flr_nm.substring(0,5)+"...";}
	
	
	str_day = "("+str_day+")";
	end_day = "("+end_day+")";
	
	$("#exa_camp_nm").text(exa_camp_nm);
	$("#exa_camp_desc").html(exa_camp_desc);
	$("#exa_camp_dt").text(setValidDate2(exa_camp_str_dt).substring(5,10)+str_day+" ~ "+setValidDate2(exa_camp_end_dt).substring(5,10)+end_day);
	$("#exa_evt_flr").text(flr_nm);
	$("#exa_brand_nm").text(exa_brand_nm);
	
	$("#exa_camp_nm2").text(exa_camp_nm);
	$("#exa_camp_desc2").html(exa_camp_desc);
	$("#exa_camp_dt2").text(setValidDate2(exa_camp_str_dt).substring(5,10)+str_day+" ~ "+setValidDate2(exa_camp_end_dt).substring(5,10)+end_day);
	$("#exa_evt_flr2").text(flr_nm);
	$("#exa_brand_nm2").text(exa_brand_nm);
	
	$("#exa_edm_url").text(exa_edm_url);
	if(exa_edm_url == ""){$(".edm_btn").css("display","none");}
	$("#exa_scrt_ttl").text(exa_scrt_ttl);
	$("#exa_script").html(exa_script.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
	$("#scrt_add_cont").html(scrt_add_cont1+"</br>"+scrt_add_cont2);
	$("#ofldc_titl").text(ofldc_titl);
	//$("#doc_no").text(doc_no);
	
	
	var imgUrl = "";
	
	if(cate_cd = "01"){imgUrl = "<img src='../../img/web/icon/brand_ic18.png' alt='화장품' />";}//화장품
	else if(cate_cd = "02"){imgUrl = "<img src='../../img/web/icon/brand_ic14.png' alt='잡화' />";}//잡화
	else if(cate_cd = "03"){imgUrl = "<img src='../../img/web/icon/brand_ic08.png' alt='모피' />";}//모피
	else if(cate_cd = "04"){imgUrl = "<img src='../../img/web/icon/brand_ic11.png' alt='아동' />";}//아동
	else if(cate_cd = "05"){imgUrl = "<img src='../../img/web/icon/brand_ic10.png' alt='식품' />";}//식품
	else if(cate_cd = "06"){imgUrl = "<img src='../../img/web/icon/brand_ic01.png' alt='F&B' />";}//F&B
	else if(cate_cd = "07"){imgUrl = "<img src='../../img/web/icon/brand_ic09.png' alt='스포츠' />";}//스포츠
	else if(cate_cd = "08"){imgUrl = "<img src='../../img/web/icon/brand_ic02.png' alt='골프' />";}//골프
	else if(cate_cd = "09"){imgUrl = "<img src='../../img/web/icon/brand_ic12.png' alt='아웃도어' />";}//아웃도어
	else if(cate_cd = "10"){imgUrl = "<img src='../../img/web/icon/brand_ic05.png' alt='디지털리빙' />";}//디지털리빙
	else if(cate_cd = "11"){imgUrl = "<img src='../../img/web/icon/brand_ic17.png' alt='홈인테리어' />";}//홈,인테리어
	else if(cate_cd = "12"){imgUrl = "<img src='../../img/web/icon/brand_ic07.png' alt='럭셔리뷰티' />";}//럭셔리뷰티
	else if(cate_cd = "13"){imgUrl = "<img src='../../img/web/icon/brand_ic15.png' alt='주얼리시계' />";}//주얼리,시계
	else if(cate_cd = "14"){imgUrl = "<img src='../../img/web/icon/brand_ic16.png' alt='캐주얼' />";}//캐주얼
	else if(cate_cd = "15"){imgUrl = "<img src='../../img/web/icon/brand_ic13.png' alt='여성클래식' />";}//여성클래식
	else if(cate_cd = "16"){imgUrl = "<img src='../../img/web/icon/brand_ic03.png' alt='남성클래식' />";}//남성클래식
	else if(cate_cd = "17"){imgUrl = "<img src='../../img/web/icon/brand_ic04.png' alt='남성트랜디' />";}//남성트랜디
	else if(cate_cd = "18"){imgUrl = "<img src='../../img/web/icon/brand_ic06.png' alt='란제리' />";}//란제리
	
	$("#exa_brand_img").html(imgUrl);
	$("#exa_brand_img2").html(imgUrl);
	
	designSlideDiv();//APP(내쿠폰함)
	plusSlides(0, "");//슬라이드 이동
	
	//비용분담 비율 콤보 박스 그리기
	expenseSharingDesign();

	
	//공동 약정 판촉서
	$("#ctrt_brand_cd").val(ctrt_brand_cd);
	$("#brand_nm_input").val(ctrt_brand_nm);
	$("#ctrt_camp_nm").val(ctrt_camp_nm);
	$("#ctrt_str_dt").val(setValidDate(ctrt_str_dt));
	$("#ctrt_end_dt").val(setValidDate(ctrt_end_dt));
	$("#offer_prdt_cost").val(AddComma(isNullZero(offer_prdt_cost)));
	$("#cprn_comp_cd").val(cprn_comp_cd);
	$("#expt_prof_amt").text(AddComma(isNullZero(expt_prof_amt)));
	$("#purs_expt_prof_amt").val(AddComma(isNullZero(purs_expt_prof_amt)));
	$("#supler_expt_prof_amt").val(AddComma(isNullZero(supler_expt_prof_amt)));
	$("#bran_cont_expt_amt").val(AddComma(isNullZero(bran_cont_expt_amt)));
	$("#ssg_base_burd_amt").text(AddComma(isNullZero(ssg_base_burd_amt))+"원");
	
	
	if(brand_ratio == ""){brand_ratio = "0";}
	$("#share_ratio").val(brand_ratio);
	if(brand_ratio != ""){expAmt();}
	
	
	if(ssg_ratio != "" && brand_ratio != ""){
		$("#ratio_txt").text("신세계 :"+ssg_ratio+" , 브랜드:"+brand_ratio);
	}else{
		$("#ratio_txt").text("");	
	}
	
	
	
	//약정서 버튼 
	if(offer1_cnt == "0"){
		$("#doc_pop").css("display","none");
	}else{
		$("#doc_pop").css("display","");
	}
	
	//==========================================================================
	//2019.12.17
	//작성자 : 김태호
	//작성내용 : ctrtdoc_ncss_yn가 Y 인 것만 약정서 보이게 처리
	//           적용 안할 시 해당 부분 삭제
	//약정서 버튼 
	if(ctrtdoc_ncss_yn == "Y"){
		$("#doc_pop").css("display","");
	}else{
		$("#doc_pop").css("display","none");
	}
	//==========================================================================
	
	
  //약정서 미리보기 버튼
	if(cnt == "0"){
		$("#pre_view").css("display","none");
	}else{
		$("#pre_view").css("display","");
	}
	
	
	//콤보 박스 변경 이벤트
	$("#share_ratio").change(function(){
		expAmt();
		
	});
	
	
	
	if(mod_flag == "N"){
		$("#ofldc_pop").css("display","none");
		$("#doc_pop").css("display","none");
		$(".btn_prev").css("cursor","default");
		$(".btn_review").css("cursor","default");
	}
	
	if(user_id != reg_id){
		$("#ofldc_pop").css("display","none");
		$("#btn_contract").css("display","none");
		$(".btn_review").css("cursor","default");
		$("#brand_nm_input").attr("disabled",true);
		$("#share_ratio").attr("disabled",true);
		$("#purs_expt_prof_amt").attr("disabled",true);
		$("#supler_expt_prof_amt").attr("disabled",true);
		$("#offer_prdt_cost").attr("disabled",true);
	}
	
	
	//약정서 저장 후 열기
	if(content_flag == "save"){
		$('html, body').animate({scrollTop:$('.review_wrap2').offset().top}, 'fast');
		layerPopOpen('layer_contract'); content_flag = "";
	}
	
	
	//신세계 예상이익
	$("#purs_expt_prof_amt").on("propertychange change keyup paste input", function() {
		expProfitAmt();
	});
	
	
	//브랜드 예상이익
	$("#supler_expt_prof_amt").on("propertychange change keyup paste input", function() {
		expProfitAmt();
	});
	
	//예상 비용
	$("#offer_prdt_cost").on("propertychange change keyup paste input", function() {
		expAmt();
	});
	
	
	//브랜드 컨텐츠 예상 비용
	$("#bran_cont_expt_amt").on("propertychange change keyup paste input", function() {
		expAmt();
	});
	
	/*
	//요청사항 체크 
	$("#athor_desc").on("propertychange change keyup paste input", function() {
		inputCheck('512',  $(this).val(), 'athor_desc');
	});
	*/
});

 
/*===============================================================
* 공문 불러오기
===============================================================*/ 
function officialView(){
  var name = "web_cp_official";
  var option = "location=no,menubar=no,resizable=no,scrollbars=no,titlebar=no,toolbar=no";
  
  
  //해상도 계산하여 위치 조절
  var popupX = (document.body.offsetWidth / 2) - (200 / 2);
  var popupY = (document.body.offsetHeight / 2) - (300 / 2);
  	 
  option += ",top="+popupY+",left="+popupX+",height=550,width=825";
  
  var frm = $("form#frmStep06")[0];
  frm.camp_id.value = camp_id;
  frm.user_id.value = user_id;
  frm.intg_bran_cd.value = intg_bran_cd;
  frm.cprn_comp_cd.value = cprn_comp_cd;
  
  //var ret = window.open(url, name, option);
  var ret = window.open("web_cp_official_pop.jsp", name, option);
  
  /*
  //post 방식
  var frm = $("form#frmStep06")[0];
  frm.camp_id.value = camp_id;
  frm.user_id.value = user_id;
  frm.intg_bran_cd.value = intg_bran_cd;
  frm.cprn_comp_cd.value = cprn_comp_cd;
  frm.action = "web_cp_official_pop.jsp";
  frm.target = name;
  frm.method = "post";
  frm.submit();
  */
  
  $("#mask").css("display","");//팝업 호출 시 보이게 설정
  
  $('#mask').click(function() {
  		ret.focus();
  });
  
  //popupOpen(url, name, "550", "825", option);
	
	
  //window.open(url, name, option);
} 



/**========================================================================================
* 공문 팝업 반환값
========================================================================================*/
function officialReturn(pageParam){
	webPageMove("7");
}


/*===============================================================
* 공동 판촉 약정서 저장
===============================================================*/
function contractSave(){
	
	share_ratio = $("#share_ratio option:selected").val();
	brand_nm_input = DelComma($("#brand_nm_input").val());
	purs_expt_prof_amt = DelComma($("#purs_expt_prof_amt").val());
	supler_expt_prof_amt = DelComma($("#supler_expt_prof_amt").val());
	expt_burd_amt = DelComma($("#offer_prdt_cost").val());
	purs_expt_burd_amt = DelComma($("#purs_expt_burd_amt").text());
	supler_expt_burd_amt = DelComma($("#supler_expt_burd_amt").text());
	expt_prof_amt = DelComma($("#expt_prof_amt").text());
	bran_cont_expt_amt = DelComma($("#bran_cont_expt_amt").val());
	
	if(share_ratio == ""){
		cmdMessage(3,"비용분담 비율");
		$("#share_ratio").focus();
		return;
	}
	
	
	if(brand_nm_input == ""){
		cmdMessage(2,"통합브랜드명");
		$("#brand_nm_input").focus();
		return;
	}
	
	
	if(purs_expt_prof_amt == ""){
		cmdMessage(2,"신세계 예상이익");
		$("#purs_expt_prof_amt").focus();
		return;
	}
	
	
	if(parseInt(bran_cont_expt_amt) == 0){
		cmdMessage(2,"브랜드 컨텐츠 부담 비용");
		$("#bran_cont_expt_amt").focus();
		return;
	}

	/*
	if(cmdMessage(1, "저장 하시겠습니까?") == false){
   	return;
  }
  */
	
	//EDI 약정서 진행상태 확인
 	var checkEdiTm = new oza_TMHandler('com.obzen.bmp.DocCampConfirm', 'checkEdiDocProgStat_SM', '1', '\@#%');
 	checkEdiTm.setAddDataField('CAMP_ID', camp_id);
 	checkEdiTm.returnlist('LOGMSG;LOGCD');
 	checkEdiTm.execute(null, false);
 	var log_cd = checkEdiTm.ElementValue('LOGCD');//1:진행, 2:서명완료(브랜드) 5:?, 7:승인(최종완료)
 	var log_msg = checkEdiTm.ElementValue('LOGMSG');
 	checkEdiTm.clear();	
 	
 	//2, 5, 7 저장 불가
 	if(parseInt(isNullZero(log_cd)) > 1){
 		cmdMessage(0, log_msg);
 		return;
 	}
  
  
	var insertCtrtDocTm = new oza_TMHandler('com.obzen.bmp.DocCtrtDoc', 'insertCtrtDoc', '1', '\@#%');
	insertCtrtDocTm.setAddDataField('CAMP_ID', camp_id);
	insertCtrtDocTm.setAddDataField('MD_CD', md_cd);
	insertCtrtDocTm.setAddDataField('USER_ID', user_id);
	insertCtrtDocTm.setAddDataField('CPRN_COMP_CD', cprn_comp_cd);//협력회사코드
	insertCtrtDocTm.setAddDataField('STORE_CD', ctrt_store_cd);//점포코드
	insertCtrtDocTm.setAddDataField('SSG_RATIO', ssg_ratio);//신세계분담률
	insertCtrtDocTm.setAddDataField('BRAND_RATIO', brand_ratio);//브랜드분담률
	insertCtrtDocTm.setAddDataField('EXPT_BURD_AMT', expt_burd_amt);//예상비용
	insertCtrtDocTm.setAddDataField('PURS_EXPT_BURD_AMT', purs_expt_burd_amt);//예상비용 신세계
	insertCtrtDocTm.setAddDataField('SUPLER_EXPT_SURD_AMT', supler_expt_burd_amt);//예상비용 브랜드
	insertCtrtDocTm.setAddDataField('EXPT_PROF_AMT', expt_prof_amt);//예상이익
	insertCtrtDocTm.setAddDataField('PURS_EXPT_PROF_AMT', purs_expt_prof_amt);//예상이익 신세계
	insertCtrtDocTm.setAddDataField('SUPLER_EXPT_PROF_AMT', supler_expt_prof_amt);//예상이익 브랜드
	insertCtrtDocTm.setAddDataField('BRAND_NM_INPUT', brand_nm_input);//브랜드명
	insertCtrtDocTm.setAddDataField('BRAN_CONT_EXPT_AMT', bran_cont_expt_amt);//브랜드컨텐츠부담비용
	insertCtrtDocTm.setAddDataField('SSG_BASE_BURD_AMT', ssg_base_burd_amt);//신세계기본부담비용
	insertCtrtDocTm.returnlist('LOGMSG');
	insertCtrtDocTm.execute(null, false);
	var msg = insertCtrtDocTm.ElementValue('LOGMSG');//리턴 처리 메시지
	insertCtrtDocTm.clear();
	
	
	screenLog("등록", "web_cp_campdraftbrand_sub07", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>검토요청>공동판촉약정서",get_client_ip);//화면 로그(공통)
 	//cmdMessage(0,msg);
 	
	
	//popupClose('layer_contract');
 	webPageMove("7","save");
}



/**========================================================================================
* 비용 분담 비율 그리기
========================================================================================*/
function expenseSharingDesign(){
	var innerHtml = "";
	
	var shareRatioTm = new oza_TMHandler('com.obzen.bmp.ColCtrtDoc', 'selectShareRatio', '0', '\@#%');
	shareRatioTm.execute(null, false);
	var shareRatioTmResult = shareRatioTm.getResult();
	var shareRatioTmResult_json = "";
	if(shareRatioTmResult != ""){
		shareRatioTmResult_json = JSON.parse(shareRatioTmResult);
	}
	shareRatioTm.clear();
	
	
	innerHtml += "<option value=''>::선택::</option>";
	for(var i=0; i<shareRatioTmResult_json.length; i++) {
		innerHtml += "<option value='"+shareRatioTmResult_json[i].CODE+"' >"+shareRatioTmResult_json[i].VALUE+"</option>";
	}
	
	$("#share_ratio").html(innerHtml);
	
	

}



/*===============================================================
* 공동 판촉 약정서 미리보기
===============================================================*/
function contractPreView(){
	
	if(ctrt_doc_no == ""){return;}
	
	var bmpKeyEncTm = new oza_TMHandler('com.obzen.bmp.DocCrypto', 'bmpKeyEnc', '1', '\@#%');
	bmpKeyEncTm.setAddDataField('USER_ID', user_id);
	bmpKeyEncTm.setAddDataField('DOC_NO', ctrt_doc_no);
	bmpKeyEncTm.returnlist('ENC_TEXT');
	bmpKeyEncTm.execute(null, false);
	var enc_text = bmpKeyEncTm.ElementValue('ENC_TEXT');//리턴 처리 메시지
	bmpKeyEncTm.clear();
	
	enc_text = replaceAll(enc_text, "+","%2B");
	
	var url = "";
	
	if(document.location.host == "bmp.shinsegae.com"){
		url = "http://edi.shinsegae.com/websquare/websquare.html?w2xPath=/wq/EDI/CM/CM/popup/bmpOzPreView.xml&keyv="+enc_text;
	}else{
		url = "http://edidev.shinsegae.com/websquare/websquare.html?w2xPath=/wq/EDI/CM/CM/popup/bmpOzPreView.xml&keyv="+enc_text;
	}
	
	window.open(url, "ifrmTarget3"); 
}
 
 
/*===============================================================
* 팝업 Open
===============================================================*/
function layerPopOpen(popupN){
  var innerHtml = "";
  
  var $layer = $("#"+ popupN);
  
  //약정서
  if(popupN == "layer_contract"){
	  expAmt();
	  expProfitAmt();
  }
  
  $layer.css("position", "absolute");
  $layer.css("top",(($(window).height() - $layer.outerHeight()) / 2) + $(window).scrollTop());
  $layer.css("left",(($(window).width() - $layer.outerWidth()) / 2) + $(window).scrollLeft());
  
  //레이어에 스크롤이 생기면 draggable 기능에 버그 발생 
  //스크롤 클릭 후 마우스를 계속 따라다니는 현상
  //해당 현상을 방지하기 위해 스크롤 생기는 레이어는 
  //타이틀 부분만 스크롤이 가능하도록 처리
  if(popupN == "layer_imgcnt2"){
	  $layer.draggable({
		  //handle:'.tit',//해당 영역만 이동 가능
		  cancel : ".img_wrap"//해당 영역만 제외하고 이동 가능
		});  
  }else{
	  $layer.draggable();
  }
  
  $layer.show();
}


/*===============================================================
* 팝업 Close
===============================================================*/
function popupClose(popupN) {
  var $layer = $("#"+ popupN);
  $layer.hide();
}




/*===============================================================
*예상비용 계산
===============================================================*/
function expAmt() {
	
	expt_burd_amt = DelComma($("#offer_prdt_cost").val());
	bran_cont_expt_amt = DelComma($("#bran_cont_expt_amt").val());
	offer_prdt_cost = DelComma($("#offer_prdt_cost").val());
	
	if(isNumber(expt_burd_amt) == false){
	 	cmdMessage(0, "숫자만 입력하세요.");
	 	$("#expt_burd_amt").val("0");
	 	$("#expt_burd_amt").focus();
		return false;
	}
	
	
	if(isNumber(bran_cont_expt_amt) == false){
	 	cmdMessage(0, "숫자만 입력하세요.");
	 	$("#bran_cont_expt_amt").val("0");
	 	$("#bran_cont_expt_amt").focus();
		return false;
	}
	
	
	brand_ratio = parseInt($("#share_ratio option:selected").val());
	ssg_ratio = 100 - brand_ratio;
	
	expt_burd_amt = parseInt(isNullZero(expt_burd_amt));
	bran_cont_expt_amt = parseInt(isNullZero(bran_cont_expt_amt));
	offer_prdt_cost = parseInt(isNullZero(offer_prdt_cost));
	ssg_base_burd_amt = parseInt(isNullZero(ssg_base_burd_amt));
	
	if(expt_burd_amt > 0){
		purs_expt_burd_amt = ssg_base_burd_amt + parseInt((expt_burd_amt * ssg_ratio) / 100);//신세계
		supler_expt_burd_amt = bran_cont_expt_amt + parseInt((expt_burd_amt * brand_ratio) / 100);//브랜드
	}
	
	
	//offer_prdt_cost = purs_expt_burd_amt+supler_expt_burd_amt;
	
	$("#ex_sel").html("* DMS 사은행사에 한하여 세일리지, 마일리지, 주차, 멤버스바 프로모션 비용은<br>신세계에서 "+ssg_ratio+"% 부담합니다.");
	$("#expt_burd_amt").val(AddComma(isNullZero(expt_burd_amt)));
	$("#purs_expt_burd_amt").text(AddComma(isNullZero(purs_expt_burd_amt)));
	$("#supler_expt_burd_amt").text(AddComma(isNullZero(supler_expt_burd_amt)));
	$("#bran_cont_expt_amt").val(AddComma(isNullZero(bran_cont_expt_amt)));
	$("#offer_prdt_cost").val(AddComma(isNullZero(offer_prdt_cost)));
}


/*===============================================================
*예상이익 계산
===============================================================*/
function expProfitAmt() {
	
	purs_expt_prof_amt = DelComma($("#purs_expt_prof_amt").val());
	supler_expt_prof_amt = DelComma($("#supler_expt_prof_amt").val());
	
	
	if(isNumber(purs_expt_prof_amt) == false){
	 	cmdMessage(0, "숫자만 입력하세요.");
	 	$("#purs_expt_prof_amt").val("0");
	 	$("#purs_expt_prof_amt").focus();
		return false;
	}
	
	
	if(isNumber(supler_expt_prof_amt) == false){
	 	cmdMessage(0, "숫자만 입력하세요.");
	 	$("#supler_expt_prof_amt").val("0");
	 	$("#supler_expt_prof_amt").focus();
		return false;
	}

	purs_expt_prof_amt = parseInt(isNullZero(purs_expt_prof_amt));
	supler_expt_prof_amt = parseInt(isNullZero(supler_expt_prof_amt));
	
	expt_prof_amt = purs_expt_prof_amt + supler_expt_prof_amt; 
	
	$("#purs_expt_prof_amt").val(AddComma(isNullZero(purs_expt_prof_amt)));
	$("#supler_expt_prof_amt").val(AddComma(isNullZero(supler_expt_prof_amt)));
	$("#expt_prof_amt").text(AddComma(isNullZero(expt_prof_amt)));
}



/**========================================================================================
* 이전 단계
========================================================================================*/
function preStep06(){
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
	
	if(chk_msg_snd_yn == "N"){
		webPageMove("5");	
	}else{
		webPageMove("6");
	}
} 


/**========================================================================================
* 검토요청
========================================================================================*/
function checkRequest(){
	
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
	
	if(old_sysid != ""){
		cmdMessage(0,"이미 검토 요청 되었습니다.");
		return;
	}
	
	
	//행사시작일자, 문자전송일자 체크 시작-------------------------------------- 
	var campDtChkTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'campDtChk', '1', '\@#%');
	campDtChkTm.setAddDataField('CAMP_ID', camp_id);
	campDtChkTm.returnlist('LOGMSG;LOGCD');
	campDtChkTm.execute(null, false);
	var chk_msg = campDtChkTm.ElementValue('LOGMSG');
	var chk_result = campDtChkTm.ElementValue('LOGCD');
	campDtChkTm.clear();	
	
	if(chk_result != "1"){cmdMessage(0,chk_msg); return;}
	//행사시작일자, 문자전송일자 체크 종료--------------------------------------
	
	
	if(ofldc_titl == "공문없음"){
		cmdMessage(0,"공문을 선택하세요.");
		return;
	}
	
	/*==========================================================================
	작성일시 : 2019.12.31
	작성자 : 김태호
	작성내용 : 임시해제
	
	if((offer1_cnt != "0"|| ctrtdoc_ncss_yn == "Y") && doc_no == "작성안함" ){
		cmdMessage(0,"공동 판촉 약정서를 작성하세요");
		return;
	}
	*/
	
	
	if(ctrtdoc_ncss_yn == "Y" && doc_no == "작성안함"){
		cmdMessage(0,"공동 판촉 약정서를 작성하세요");
		return;
	}
	
	//검토요청 내용 입력 팝업 호출
	layerPopOpen('layer_review');
	
	
}


/*===============================================================
입력값 체크 
===============================================================*/
function inputCheck(byte_value, input_value, input_id){
  input_value = $.trim(input_value);
  byte_value = parseInt(byte_value);
  
	//메시지 문구
  if(input_id == "script_byte"){
	  input_value += scrt_add_cont1;
	  input_value += scrt_add_cont2;
	  
	  $("#script_byte").html("");
	  $("#script_byte").text(getByteLength(input_value)+" bytes");
  }else{
	  if(byte_value < getByteLength(input_value)){ 
	 		cmdMessage(0,"최대 "+byte_value+"Bytes를 넘을 수 없습니다.");
	 		$("#"+input_id).val(getByteVal(input_value,byte_value));
	 		$("#"+input_id).focus();
	 		
			return; 
	 	}
	  
	  
	  $("#"+input_id).val(input_value);  
  }
}


/*===============================================================
검토요청 팝업 확인
===============================================================*/
function checkConfirm(){
	
	var input_athor_desc = "";
	input_athor_desc = $.trim($("#athor_desc").val());
	
	if(input_athor_desc != ""){
		$("#athor_desc").val(input_athor_desc);
	}else{
		cmdMessage(2,"요청사항");
		return;
	}
	
	
	if(cmdMessage(1, "검토 요청을 진행 하시겠습니까?") == false){
	  	return;
	}
	
	/*==========================================================================
	작성일시 : 2019.12.31
	작성자 : 김태호
	작성내용 : 약정서 체크 임시 해제
	
	if(offer1_cnt != "0"){
  	//EDI 약정서 진행상태 확인
   	var checkEdiTm = new oza_TMHandler('com.obzen.bmp.DocCampConfirm', 'checkEdiDocProgStat_SM', '1', '\@#%');
   	checkEdiTm.setAddDataField('CAMP_ID', camp_id);
   	checkEdiTm.returnlist('LOGMSG;LOGCD');
   	checkEdiTm.execute(null, false);
   	var log_cd = checkEdiTm.ElementValue('LOGCD');//1:진행, 2:서명완료(브랜드) 5:?, 7:승인(최종완료)
   	var log_msg = checkEdiTm.ElementValue('LOGMSG');
   	checkEdiTm.clear();	
   	
   	//2, 5, 7 검토 요청 가능
   	if(parseInt(isNullZero(log_cd)) < 2){
   		cmdMessage(0, log_msg);
   		return;
   	}
  }
	*/
	
	if(ctrtdoc_ncss_yn == "Y"){
  	//EDI 약정서 진행상태 확인
   	var checkEdiTm = new oza_TMHandler('com.obzen.bmp.DocCampConfirm', 'checkEdiDocProgStat_SM', '1', '\@#%');
   	checkEdiTm.setAddDataField('CAMP_ID', camp_id);
   	checkEdiTm.returnlist('LOGMSG;LOGCD');
   	checkEdiTm.execute(null, false);
   	var log_cd = checkEdiTm.ElementValue('LOGCD');//1:진행, 2:서명완료(브랜드) 5:?, 7:승인(최종완료)
   	var log_msg = checkEdiTm.ElementValue('LOGMSG');
   	checkEdiTm.clear();	
   	
   	//2, 5, 7 검토 요청 가능
   	if(parseInt(isNullZero(log_cd)) < 2){
   		cmdMessage(0, log_msg);
   		return;
   	}
  }
	
	
	//lodingImgOn();//백그라운드 이미지 활성(더블클릭방지)
	
 	//SM검토요청
 	var insertAppReqSmTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'insertAppReqSm', '1', '\@#%');
 	insertAppReqSmTm.setAddDataField('CAMP_ID', camp_id);
 	insertAppReqSmTm.setAddDataField('USERID', user_id);
 	insertAppReqSmTm.setAddDataField('ATHOR_DESC', input_athor_desc);
 	insertAppReqSmTm.returnlist('LOGMSG');
 	insertAppReqSmTm.execute(null, false);
 	msg = insertAppReqSmTm.ElementValue('LOGMSG');
 	var log_cd = insertAppReqSmTm.ElementValue('LOGCD');
 	insertAppReqSmTm.clear();
 	
 	screenLog("검토요청", "web_cp_campdraftbrand_sub07", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>검토요청",get_client_ip);//화면 로그(공통)
 	
 	cmdMessage(0,msg);
	if(log_cd == "0"){return;}
 	
	/* 페이지 reload
 	flag = "7";
	camp_id = camp_id;
	bmpevtTy_cd = bmpevtTy_cd;
	
	do_RefreshPage("onload");
	*/
	
	
	//Tab 닫기
	//닫을 Tab의 메인 페이지 명을 지정한다.
	//검토요청 후 자동으로 Tab을 닫는다.
	parent.ClosePage("/ManageBaseServer/Frames/Campaign/BMP/CampPlan/web_cp_campdraftbrand_main");
}


/**========================================================================================
* 모바일DM 확인 팝업 
========================================================================================*/
function eDMPopup(){
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
	
	var url = "";
  	
	
	if(document.location.host == "bmp.shinsegae.com"){
		url = "http://bmpadmin.shinsegae.com/bmp/create/list.do?storeCd="+exa_tget_store_cd+"&campId="+camp_id+"&intgBranCd="+md_cd+"&branCd="+intg_bran_cd+"&user_id="+user_id;
	}else{
		url = "http://10.102.0.28:11900/bmp/create/list.do?storeCd="+exa_tget_store_cd+"&campId="+camp_id+"&intgBranCd="+md_cd+"&branCd="+intg_bran_cd+"&user_id="+user_id;
	}
	
	
  window.open(url, "_blank");
}



/**========================================================================================
* 슬라이드 그리기
========================================================================================*/

function designSlideDiv(){
	var innerHtml = "";
	var slide_cnt = 1;
	
	var slide_list = "";
	
	/*
	//테스트
	exa_bran_offer1 = "컨텐츠1";
	exa_bran_offer2 = "컨텐츠2";
	exa_bran_offer3 = "컨텐츠3";
	exa_offer1 = "프로모션1";
	exa_offer2 = "프로모션2";
	exa_offer3 = "프로모션3";
	exa_offer4 = "프로모션4";
	*/
	
	//if(exa_bran_offer2 != ""){slide_list += ";"+exa_bran_offer2;}
	//if(exa_bran_offer3 != ""){slide_list += ";"+exa_bran_offer3;}
	if(exa_offer1 != ""){slide_list += exa_offer1+";";}
	if(exa_offer2 != ""){slide_list += exa_offer2+";";}
	if(exa_offer3 != ""){slide_list += exa_offer3+";";}
	if(exa_offer4 != ""){slide_list += exa_offer4;}

	
	//끝에 ; 제거
	if(slide_list.substring(slide_list.length-1, slide_list.length) == ";"){slide_list = slide_list.substring(0,slide_list.length-1);}
	
	
	//컨텐츠-----------------------------
	if(exa_bran_offer1 != ""){
		innerHtml += "<li id='li_1'>";
		innerHtml += "<p>"+exa_bran_offer1+"</p>";
		innerHtml += "<ul>";
		innerHtml += "<li>"+flr_nm+"</li>";
		innerHtml += "<li>"+setValidDate2(exa_camp_str_dt).substring(5,10)+str_day+"~"+setValidDate2(exa_camp_end_dt).substring(5,10)+end_day+"</li>";
		innerHtml += "</ul>";
		innerHtml += "</li>";	
	}
	
	if(exa_bran_offer2 != ""){
		innerHtml += "<li id='li_2'>";
		innerHtml += "<p>"+exa_bran_offer2+"</p>";
		innerHtml += "<ul>";
		innerHtml += "<li>"+flr_nm+"</li>";
		innerHtml += "<li>"+setValidDate2(exa_camp_str_dt).substring(5,10)+str_day+"~"+setValidDate2(exa_camp_end_dt).substring(5,10)+end_day+"</li>";
		innerHtml += "</ul>";
		innerHtml += "</li>";	
	}
		
	if(exa_bran_offer3 != ""){
		innerHtml += "<li id='li_3'>";
		innerHtml += "<p>"+exa_bran_offer3+"</p>";
		innerHtml += "<ul>";
		innerHtml += "<li>"+flr_nm+"</li>";
		innerHtml += "<li>"+setValidDate2(exa_camp_str_dt).substring(5,10)+str_day+"~"+setValidDate2(exa_camp_end_dt).substring(5,10)+end_day+"</li>";
		innerHtml += "</ul>";
		innerHtml += "</li>";	
	}
	
	
	//프로모션 -----------------------------
	var exa_offer_list =  "";
	if(slide_list != "") {exa_offer_list =  slide_list.split(";");}
	var li_cnt = 0;
	var offer_list_nm = "";
	
	for(var i=0; i<exa_offer_list.length; i++){
		li_cnt = parseInt(i+4);
		offer_list_nm = exa_offer_list[i];
		
		if(offer_list_nm.length > 18){offer_list_nm = offer_list_nm.substring(0,15)+"...";}
		
		innerHtml += "<li id='li_"+li_cnt+"'>";
		innerHtml += "<p>"+offer_list_nm+"</p>";
		innerHtml += "<ul>";
		innerHtml += "<li>"+flr_nm+"</li>";
		innerHtml += "<li>"+setValidDate2(exa_camp_str_dt).substring(5,10)+str_day+"~"+setValidDate2(exa_camp_end_dt).substring(5,10)+end_day+"</li>";
		innerHtml += "</ul>";
		innerHtml += "</li>";	
	}
	
	//페이지 개수 
	if(exa_offer_list.length > 1 && exa_offer_list.length < 4){slide_cnt = 2;}
	if(exa_offer_list.length > 3){slide_cnt = 3;}
	
	
	//Html에 설정
	$("#slide_div").html(innerHtml);
	$(".page").text("1/"+slide_cnt);
}



/**========================================================================================
* 이전/다음 슬라이드
========================================================================================*/
function plusSlides(n, classIdVal) {
	var slides = $("#slide_div li p");
	var first_page = 0;
	var last_page = 1;
	
	if(exa_offer1 != ""){last_page = 2;}
	if(exa_offer2 != ""){last_page = 2;}
	if(exa_offer3 != ""){last_page = 2;}
	if(exa_offer4 != ""){last_page = 3;}
	
	if(classIdVal == "prev" && $("#sl_prev").hasClass("off")){slideIndex = 3; return;}
	if(classIdVal == "next" && $("#sl_next").hasClass("off")){slideIndex = (last_page*3); return;}
	
	slideIndex = parseInt(slideIndex+n);
	
	if (slideIndex <= 3) {
		slideIndex = 3;
	}
	
	
	if (slideIndex > (last_page*3)) {
		slideIndex = 3;
	}
	
  
	if(slideIndex == (last_page*3)){
		$("#sl_next").addClass("off");
	  $("#sl_next").css("cursor","default");
	}
	
	if(slideIndex > 3){
		$("#sl_prev").removeClass("off");
	  $("#sl_prev").css("cursor","pointer");
  }
	
	
	if(slideIndex == 3){
		$("#sl_prev").addClass("off");
	  $("#sl_prev").css("cursor","default");
	}

	
	if(slideIndex < (last_page*3)){
		$("#sl_next").removeClass("off");
		$("#sl_next").css("cursor","pointer");
	}
	
	//모두 안보이게 처리
	for (var i = 1; i <= (last_page*3); i++) {
    $("#li_"+i).css("display","none");  
	}

	//console.log("slideIndex="+slideIndex);
	//console.log("(last_page*3)="+(last_page*3));
	
	first_page = parseInt(slideIndex/3);
	
	//이동된 목록만 조회
	for (var j = (slideIndex-2); j <=slideIndex; j++) {
      $("#li_"+j).css("display","");  
  }
	
	$(".page").text(first_page+"/"+last_page);
}

</script>
<div class="c_write_wrap">
<div class="tip_txt">최종 행사요약 확인 및 공문/약정서 작성 불러오기 단계 입니다.<br>최종 검토 요청 시 담당 SM/팀장에게 검토가 요청 됩니다.<br>검토 진행상태는 행사 history 조회에서 실시간으로 확인하실 수 있습니다.</div>
  <div class="c_write_6">
    <div class="review_wrap1">
      <p class="tit">행사 내용 최종 확인<span>검토요청 전 앞에서 등록된 행사내용을 최종적으로 확인해 주세요.</span><a href="javascript:layerPopOpen('layer_imgcnt2');">APP 쿠폰 샘플 확인 하기</a></p>
     
     <!--  모바일 화면 영역 시작 -->
      <div class="appview_wrap">
      
        <!-- 1번째 모바일 화면 시작 -->     
        <div class="app1">
          <p class="app_tit">LMS</p>
          <div class="lms_cnt">
            <div class="lms_txt" id="exa_script">
            </div>  
            <div class="noti_txt" id="scrt_add_cont">
            </div>
          </div>
          <span id="script_byte"></span>
        </div>
        <!-- 1번째 모바일 화면 종료 -->
        
        
        
        <!-- 2번째 모바일 화면 시작 -->
        <div class="app2">
          <p class="app_tit">APP(추천혜택)</p>
          <div class="app2_cnt">
            <div class="brandimg" id="exa_brand_img">
            </div>
            <div class="brand_benefit">
              <p class="brand_nm" id="exa_brand_nm"></p>
              <p class="event_nm" id="exa_camp_nm"></p>
              <p class="event_txt" id="exa_camp_desc"></p>
              <ul>
                <li id="exa_evt_flr"></li>
                <li id="exa_camp_dt"></li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 2번째 모바일 화면 종료 -->
        
        
        
        <!-- 3번째 모바일 화면 시작 -->
        <div class="app3">
          <p class="app_tit">APP(내쿠폰함)</p>
          <div class="app3_cnt">
            <div class="brand_wrap">
              <div class="brandimg" id="exa_brand_img2">
              </div>
              <div class="brand_benefit">
                <p class="brand_nm" id="exa_brand_nm2"></p>
                <p class="event_nm" id="exa_camp_nm2"></p>
                <ul>
                  <li id="exa_evt_flr2"></li>
                  <li id="exa_camp_dt2"></li>
                </ul>
              </div>
            </div>
            
            <!-- 슬라이드 부분 시작 -->
            <div class="brand_coupon">
              <ul id="slide_div">
              </ul>
            </div>
            <!-- 슬라이드 부분 종료 -->
            
          </div>
          <div class="paging">
            <a href="javascript:plusSlides(-3, 'prev');" class="btn_prev" id="sl_prev">이전</a>
            <div class="page"></div>
            <a href="javascript:plusSlides(3, 'next');" class="btn_next" id="sl_next">다음</a>
          </div>
        </div>
        <!-- 3번째 모바일 화면 종료 -->
      </div>
      <!--  모바일 화면 영역 종료 -->
      
      
      <div class="m_dm">
        <div>
          <span>모바일 DM</span>
          <p id="exa_edm_url"></p>
        </div>
        <a href="javascript:eDMPopup();" class="edm_btn">모바일DM확인</a>
      </div>
    </div>
    <div class="review_wrap2">
      <p class="tit">공문/약정서 등록하기</p>
      <div class="review_btn">
        <div class="btn1">
          <a href="javascript:officialView();" id="ofldc_pop">공문불러오기<span>행사를 진행하기 전 공문 등록이 필수 입니다.</span></a>
          <div class="ofldc">
            <span>공문 명</span>
            <p id="ofldc_titl"></p>
          </div>
        </div>
        <div class="btn2">
          <a href="javascript:layerPopOpen('layer_contract');" id="doc_pop">공동 판촉약정서<span>사전에 협약된 판촉비용 분담금액에 따라 작성해 주세요.<br>*신세계와 사전에 협약하여 진행하는 행사일 경우에만 작성해 주세요.</span></a>
        </div>
      </div>
    </div>
  </div>  
  
  <div class="btn_box">
    <a href="javascript:preStep06();" class="btn_prev">이전단계</a>
    <a href="javascript:checkRequest();" class="btn_review">검토요청</a>
  </div>
</div>


 <!-- 공동 판촉 약정서 팝업 시작 -->
<div id="layer_contract" class="layer">
  <p class="tit">공동 판촉 약정서<a href="javascript:popupClose('layer_contract');" class="btn_close">닫기</a></p>
  <div class="contract_cnt">
    <ul>
      <li>
        <div class="comp_cd wd180">
          <label for="">협력업체 코드</label>
          <input type="text" placeholder="Ex&gt;" disabled id="cprn_comp_cd">
        </div>
      </li>
      <li>
        <div>
          <label for="">통합브랜드 명</label>
          <input type="text" placeholder="Ex&gt; 나이키와해외" id="brand_nm_input" onblur="javascript:inputCheck('120',  this.value, 'brand_nm_input');">
        </div>
        <div class="brand_cd wd180">
          <label for="">통합브랜드 코드</label>
          <input type="text" placeholder="Ex&gt;" id="ctrt_brand_cd" disabled>
        </div>
      </li>
      <li>
        <div>
          <label for="">행사 명</label>
          <input type="text" placeholder="Ex&gt; 나이키와해외" id="ctrt_camp_nm" disabled>
        </div>
        <div class="camp_priod">
          <label for="">행사 기간</label>
          <input type="text" id="ctrt_str_dt" disabled> ~ <input type="text" id="ctrt_end_dt" disabled>
        </div>
      </li>
      <li>
        <div class="wd180">
          <label for="">비용분담 비율</label>
          <select id="share_ratio">
          </select>
          <p id="ex_sel" class="noti_txt"></p>
        </div>
      </li>
      <li>
        <div class="wd180">
          <label for="">신세계 예상이익 (원)</label>
          <input type="text" placeholder="Ex&gt;100,000" id="purs_expt_prof_amt">
        </div>
        <div class="wd180">
          <label for="">브랜드 예상이익 (원)</label>
          <input type="text" placeholder="Ex&gt;100,000" id="supler_expt_prof_amt">
        </div>
        <div class="borb">
          <span>예상이익(원)</span>
          <p id="expt_prof_amt"></p>
        </div>
      </li>
      <li>
        <div class="wd180">
          <label for="">브랜드 컨텐츠 예상 비용 (원)</label>
          <input type="text" placeholder="Ex&gt;100,000"  id="bran_cont_expt_amt">
        </div>
        <div class="wd180">
          <label for="">예상 비용 (원)</label>
          <input type="text" placeholder="Ex&gt;100,000"  id="offer_prdt_cost">
        </div>
        <div class="borb wd180">
          <span>신세계(원)</span>
          <p id="purs_expt_burd_amt"></p>
        </div>
        <div class="borb wd180">
          <span>브랜드(원)</span>
          <p id="supler_expt_burd_amt"></p>
        </div>
      </li>
      <li>
        <p class="noti_txt">* 브랜드에서 준비한 컨텐츠의<br>총 예상비용을 기입해 주세요.</p>
        <p class="noti_txt">* 신세계 기본부담금 (<span id="ssg_base_burd_amt"></span>)이 포함 되어 있습니다.<br>문자발송비, DB사용료, 시스템 사용료 외</p>
      </li>
    </ul>
  </div>
  <div class="pop_btn">
    <a href="javascript:contractSave();" class="btn_submit" id="btn_contract">저장</a>
    <a href="javascript:contractPreView();" class="btn_view" id="pre_view" >미리보기(서명)</a>
    <a href="javascript:popupClose('layer_contract');" class="btn_cancel">닫기</a>
  </div>
</div>
 <!-- 공동 판촉 약정서 팝업 종료 -->
 
 
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


<!-- APP 샘플 팝업 시작 -->
<div id="layer_imgcnt2" class="layer">
  <p class="tit">APP 쿠폰 샘플 확인<a href="javascript:popupClose('layer_imgcnt2');" class="btn_close">닫기</a></p>
  <div class="img_wrap">
    <img src="../../img/web/icon/app_sample3.png">
  </div>
  <div class="pop_btn">
    <a href="javascript:popupClose('layer_imgcnt2');" class="btn_cancel">닫기</a>
  </div>
</div>
<!-- APP 샘플 팝업 종료 -->

<form id="frmStep06" method="post" >
<input type="hidden" id="camp_id" name="camp_id"/>
<input type="hidden" id="user_id" name="user_id"/>
<input type="hidden" id="intg_bran_cd" name="intg_bran_cd"/>
<input type="hidden" id="cprn_comp_cd" name="cprn_comp_cd"/>
</form>

<iframe id="ifrmTarget2" name="ifrmTarget2" width="0" height="0"></iframe>
<iframe id="ifrmTarget3" name="ifrmTarget3" width="0" height="0"></iframe>