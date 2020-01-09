<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>



<!DOCTYPE html>
<html lang="ko">
 <head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>분석 Report</title>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->

<%
String camp_id = XSScheck(request.getParameter("camp_id"));
%>

<script type="text/javascript">
var division_amt = 1000000;//금액 : 백만원
var division_ppc = 10000;  //객단가 : 만원

var flag = "1";//탭 구분
var sys_div = "";
var stg_store_cd = "";
var stg_md_cd = "";
var sys_div_flag = "";
var camp_id = "";

camp_id = "<%=camp_id%>";
//camp_id = "B1000020957";
//camp_id = "B1000014691";
//camp_id = "B1000013463";


//고정 내용 부분
var top_md_tot_cust_cnt = "";//MD 전체고객수
var top_md_tot_cust_price = "";//MD 전체고객 객단가
var top_rsp_cust_sale_amt = "";//행사매출(응답매출)
var top_rsp_cust_cnt = "";//응답고객수
var top_rsp_cust_price = "";//응답고객 객단가


//행사 고객 VIP 분석 변수 ---------------------------------
//1.행사참여고객 중 신세계 vip고객 비중
var shin_tot_rate = "";
var shin_tot_vip_cnt = ""
var shin_tot_rsp_cust_cnt = "";
var shin_top5_cust_rate = "";
var shin_top5_cust_vip_cnt = ""
var shin_top5_rsp_cnt = "";
var shin_sale_rate = "";
var shin_sale_rsp_amt = "";
var shin_sale_vip_amt = "";
var shin_top5_sale_rate = "";
var shin_top5_sale_rsp_amt = "";
var shin_top5_sale_vip_amt = "";

//2.행사참여고객 중 신규고객 비중
var new_tot_rate = "";
var new_tot_rsp_cust_cnt = ""
var new_tot_new_cust_cnt = ""
var new_top5_cust_rate = "";
var new_top5_rsp_cust_cnt = ""
var new_top5_new_cust_cnt = ""
var new_sale_rate = "";
var new_sale_rsp_amt = "";
var new_sale_new_amt = "";

var new_top5_sale_rate = "";
var new_top5_rsp_amt = "";
var new_top5_new_amt = "";

//행사 고객 분석 변수 ---------------------------------
/**===================================================
반환값
webUserId : 유저 아이디
webUserName : 유저 명
webGroupName : 그룹명
webGroupDescription : 그룹 설명
webSysDiv : 권한
wevMdCd : MD 코드
webStoreCd: 점포코드
======================================================*/
web_Init(window);//세션정보
stg_md_cd = wevMdCd;
stg_store_cd = webStoreCd;
sys_div = webSysDiv;
sys_div_flag = webSysDivFlag;

//분석 Report 메뉴에서 진입시
if(camp_id == ""){
	if(sys_div == "1"){ 
		var selectCampIdInfo = new oza_TMHandler('com.obzen.bmpanly.DocEvtSaleRate', 'selectInitCampId', '1', '\@#%');
		selectCampIdInfo.setAddDataField('MD_CD', stg_md_cd);
		selectCampIdInfo.setAddDataField('STORE_CD', stg_store_cd);
		selectCampIdInfo.returnlist('CAMP_ID');
		selectCampIdInfo.execute(null, false);
		camp_id = selectCampIdInfo.ElementValue('CAMP_ID');
		selectCampIdInfo.clear();
		
	} 
}

//TM Start =================================================================================================

	
//행사정보
var incDay = "";
var mainTitle = "";
var mainTitleDate = "";
var titleDate = "";
var selectEvtInfo = new oza_TMHandler('com.obzen.bmpanly.DocEvtSaleRate', 'selectEvtInfo', '1', '\@#%');
selectEvtInfo.setAddDataField('CAMP_ID', camp_id);
selectEvtInfo.returnlist('EVT_NAME;EVT_PERIOD1;EVT_PERIOD2');
selectEvtInfo.execute(null, false);
mainTitle = selectEvtInfo.ElementValue('EVT_NAME');
titleDate = selectEvtInfo.ElementValue('EVT_PERIOD1');
incDay = selectEvtInfo.ElementValue('EVT_PERIOD2');
mainTitleDate = titleDate + "(" + incDay + "일간)";
selectEvtInfo.clear();

if (mainTitle.length >= 20) {
	mainTitle = mainTitle.substring(0, 19) + "..";	
}

	
//브랜드 행사 결과 정보 20191022 stj 추가
var grd_level = "";
var grd_msg = "";

var selectEvtTopContent = new oza_TMHandler('com.obzen.bmpanly.DocEvtSaleRate', 'selectEvtTopContent', '1', '\@#%');
selectEvtTopContent.setAddDataField('CAMP_ID', camp_id);
selectEvtTopContent.returnlist('GRD_LEVEL;GRD_MSG');
selectEvtTopContent.execute(null, false);
grd_level = selectEvtTopContent.ElementValue('GRD_LEVEL');
grd_msg = selectEvtTopContent.ElementValue('GRD_MSG');
selectEvtTopContent.clear();

//행사 고객 분석
//행사매출누계, 응답고객수, 응답고객 객단가, 비행사 고객 객단가 때문에 해당 페이지에서 씀
var evtPureCustTm = new oza_TMHandler('com.obzen.bmpanly.DocEvtSaleRate', 'selectEvtPurcCust', '1', '\@#%');
evtPureCustTm.setAddDataField('CAMP_ID', camp_id);
evtPureCustTm.returnlist('MD_TOT_SALE_AMT'+//전체MD매출누계
		                ';MD_TOT_CUST_CNT'+//전체고객수
		                ';MD_TOT_PPC'+//전체객단가
		                ';RSP_CUST_SALE_AMT'+//행사매출누계
                      	';RSP_CUST_CNT'+//응답고객수
                      	';RSP_CUST_PPC'+//응답고객객단가
                      	';VIP_CNT'+//VIP고객
                      	';VIP_CNT_RATE'+//VIP고객비율
                      	';VIP_SALE_AMT'+//VIP 매출
                      	';VIP_SALE_AMT_RATE'+//VIP 매출비용
                      	';NEW_CUST_CNT'+//신규고객
                      	';NEW_CUST_CNT_RATE'+//신규고객수 비율
                      	';NEW_CUST_SALE_AMT'+//신규고객 매출
                      	';NEW_CUST_SALE_AMT_RATE'+//신규고객매출 비율
                      	';TOP5_RSP_CUST_CNT'+//TOP5 평균 응답 고객수
                      	';TOP5_RSP_CUST_SALE_AMT'+//TOP5 평균 매출
                      	';TOP5_VIP_CNT_RATE'+//TOP5 VIP 고객 비율
                      	';TOP5_VIP_CNT'+//TOP5 VIP 고객
                      	';TOP5_VIP_SALE_AMT_RATE'+//TOP5 VIP 고객 매출 비율
                      	';TOP5_VIP_SALE_AMT'+//TOP5 VIP 매출
                      	';TOP5_NEW_CUST_CNT_RATE'+//TOP5 신규고객 비율 
                      	';TOP5_NEW_CUST_CNT'+//TOP5 신규고객 수
                      	';TOP5_NEW_CUST_SALE_AMT_RATE'+//TOP5 신규고객 매출 비율
                      	';TOP5_NEW_CUST_SALE_AMT');//TOP5 신규고객 매출
evtPureCustTm.execute(null, false);

//공통-상단 SUMMARY 영역
top_md_tot_cust_cnt = evtPureCustTm.ElementValue('MD_TOT_CUST_CNT');
top_md_tot_cust_price = evtPureCustTm.ElementValue('MD_TOT_PPC');
top_rsp_cust_sale_amt = evtPureCustTm.ElementValue('RSP_CUST_SALE_AMT');
top_rsp_cust_cnt = evtPureCustTm.ElementValue('RSP_CUST_CNT');
top_rsp_cust_price = evtPureCustTm.ElementValue('RSP_CUST_PPC');

//행사고객분석-VIP매출 비중
shin_tot_rsp_cust_cnt = evtPureCustTm.ElementValue('RSP_CUST_CNT');
shin_tot_vip_cnt = evtPureCustTm.ElementValue('VIP_CNT');
shin_tot_rate = evtPureCustTm.ElementValue('VIP_CNT_RATE');
shin_top5_rsp_cnt = evtPureCustTm.ElementValue('TOP5_RSP_CUST_CNT');
shin_top5_cust_vip_cnt = evtPureCustTm.ElementValue('TOP5_VIP_CNT');
shin_top5_cust_rate = evtPureCustTm.ElementValue('TOP5_VIP_CNT_RATE');
shin_sale_rsp_amt = evtPureCustTm.ElementValue('RSP_CUST_SALE_AMT');
shin_sale_vip_amt = evtPureCustTm.ElementValue('VIP_SALE_AMT');
shin_sale_rate = evtPureCustTm.ElementValue('VIP_SALE_AMT_RATE');
shin_top5_sale_rate = evtPureCustTm.ElementValue('TOP5_VIP_SALE_AMT_RATE');
shin_top5_sale_rsp_amt = evtPureCustTm.ElementValue('TOP5_RSP_CUST_SALE_AMT');
shin_top5_sale_vip_amt = evtPureCustTm.ElementValue('TOP5_VIP_SALE_AMT');

//행사고객분석-신규고객 비중
new_tot_new_cust_cnt = evtPureCustTm.ElementValue('NEW_CUST_CNT');
new_tot_rsp_cust_cnt = evtPureCustTm.ElementValue('RSP_CUST_CNT');
new_tot_rate = evtPureCustTm.ElementValue('NEW_CUST_CNT_RATE');
new_top5_cust_rate = evtPureCustTm.ElementValue('TOP5_NEW_CUST_CNT_RATE');
new_top5_rsp_cust_cnt = evtPureCustTm.ElementValue('TOP5_RSP_CUST_CNT');
new_top5_new_cust_cnt = evtPureCustTm.ElementValue('TOP5_NEW_CUST_CNT');
new_sale_new_amt = evtPureCustTm.ElementValue('NEW_CUST_SALE_AMT');
new_sale_rsp_amt = evtPureCustTm.ElementValue('RSP_CUST_SALE_AMT');
new_sale_rate = evtPureCustTm.ElementValue('NEW_CUST_SALE_AMT_RATE');
new_top5_sale_rate = evtPureCustTm.ElementValue('TOP5_NEW_CUST_SALE_AMT_RATE');
new_top5_sale_rsp_amt = evtPureCustTm.ElementValue('TOP5_RSP_CUST_SALE_AMT');
new_top5_sale_new_amt = evtPureCustTm.ElementValue('TOP5_NEW_CUST_SALE_AMT');

//백분율 유효성 체크 및 변환처리(소수점 첫째자리 올림)
shin_tot_rate       = exCeil(parseFloat(isNullZero(shin_tot_rate)), 2); //vip고객수비중
shin_top5_cust_rate = exCeil(parseFloat(isNullZero(shin_top5_cust_rate)), 2); //vip고객수비중-top5
shin_sale_rate      = exCeil(parseFloat(isNullZero(shin_sale_rate)), 2); //vip매출액비중
shin_top5_sale_rate = exCeil(parseFloat(isNullZero(shin_top5_sale_rate)), 2); //vip매출액비중 - top5
new_tot_rate        = exCeil(parseFloat(isNullZero(new_tot_rate)), 2);  //신규고객수비중
new_top5_cust_rate  = exCeil(parseFloat(isNullZero(new_top5_cust_rate)), 2); //신규고객수비중-top5
new_sale_rate       = exCeil(parseFloat(isNullZero(new_sale_rate)), 2); //신규매출비중
new_top5_sale_rate  = exCeil(parseFloat(isNullZero(new_top5_sale_rate)), 2);//신규매출비중-top5

//건수 유효성 체크
top_md_tot_cust_cnt   = parseInt(isNullZero(top_md_tot_cust_cnt));
top_rsp_cust_cnt          = parseInt(isNullZero(top_rsp_cust_cnt));  
shin_tot_rsp_cust_cnt = parseInt(isNullZero(shin_tot_rsp_cust_cnt));
shin_tot_vip_cnt      = parseInt(isNullZero(shin_tot_vip_cnt));
shin_top5_rsp_cnt     = parseInt(isNullZero(shin_top5_rsp_cnt));
shin_top5_cust_vip_cnt = parseInt(isNullZero(shin_top5_cust_vip_cnt));
new_tot_rsp_cust_cnt = parseInt(isNullZero(new_tot_rsp_cust_cnt));
new_tot_new_cust_cnt = parseInt(isNullZero(new_tot_new_cust_cnt));
new_tot_rsp_cust_cnt = parseInt(isNullZero(new_tot_rsp_cust_cnt));
new_tot_new_cust_cnt = parseInt(isNullZero(new_tot_new_cust_cnt));
new_top5_new_cust_cnt = parseInt(isNullZero(new_top5_new_cust_cnt));
new_top5_rsp_cust_cnt = parseInt(isNullZero(new_top5_rsp_cust_cnt));

//금액 유효성 체크 및 변환처리(객단가 : 만원, 매출 : 백만원 올림)
top_rsp_cust_sale_amt = parseInt(isNullZero(top_rsp_cust_sale_amt));
shin_sale_rsp_amt = parseInt(isNullZero(shin_sale_rsp_amt));
shin_sale_vip_amt = parseInt(isNullZero(shin_sale_vip_amt));
shin_top5_sale_rsp_amt = parseInt(isNullZero(shin_top5_sale_rsp_amt));
shin_top5_sale_vip_amt = parseInt(isNullZero(shin_top5_sale_vip_amt));
new_sale_rsp_amt = parseInt(isNullZero(new_sale_rsp_amt));
new_sale_new_amt = parseInt(isNullZero(new_sale_new_amt));
new_top5_sale_rsp_amt = parseInt(isNullZero(new_top5_sale_rsp_amt));
new_top5_sale_new_amt = parseInt(isNullZero(new_top5_sale_new_amt));
if(top_rsp_cust_sale_amt != 0)     top_rsp_cust_sale_amt = exCeil(top_rsp_cust_sale_amt/division_amt, 1);
if(shin_sale_rsp_amt != 0)     shin_sale_rsp_amt = exCeil(shin_sale_rsp_amt/division_amt, 1);
if(shin_sale_vip_amt != 0)     shin_sale_vip_amt = exCeil(shin_sale_vip_amt/division_amt, 1);
if(shin_top5_sale_rsp_amt != 0) shin_top5_sale_rsp_amt = exCeil(shin_top5_sale_rsp_amt/division_amt, 1);
if(shin_top5_sale_vip_amt != 0) shin_top5_sale_vip_amt = exCeil(shin_top5_sale_vip_amt/division_amt, 1);
if(new_sale_rsp_amt != 0)       new_sale_rsp_amt = exCeil(new_sale_rsp_amt/division_amt, 1);
if(new_sale_new_amt != 0)       new_sale_new_amt = exCeil(new_sale_new_amt/division_amt, 1);
if(new_top5_sale_rsp_amt != 0)  new_top5_sale_rsp_amt = exCeil(new_top5_sale_rsp_amt/division_amt, 1);
if(new_top5_sale_new_amt != 0)  new_top5_sale_new_amt = exCeil(new_top5_sale_new_amt/division_amt, 1);

//객단가 유효성 체크 및 변환처리(객단가 : 만원, 매출 : 백만원 올림)
top_rsp_cust_price = parseFloat(isNullZero(top_rsp_cust_price));
top_md_tot_cust_price = parseFloat(isNullZero(top_md_tot_cust_price));

if(top_rsp_cust_price != 0)     top_rsp_cust_price = exCeil(top_rsp_cust_price/division_ppc, 1);
if(top_md_tot_cust_price != 0)  top_md_tot_cust_price = exCeil(top_md_tot_cust_price/division_ppc, 1);

evtPureCustTm.clear();

//TM End =================================================================================================
	
if(sys_div == "2" && camp_id == ""){ //운영정보 사용자가 camp_id 없이 접근시 메시지 처리
	grd_level = "0";
	mainTitle = "";
	mainTitleDate = "";
}


//화면 로드 시 실행
$(document).ready(function() {
	
	do_RefreshPage("onload");
});


function do_RefreshPage(gubun) {
	
	//Tab 클릭 시 Tab active class 변경
	$("ul.tab_style01 li").click(function() {
		$("ul.tab_style01 li").removeClass("on"); //Remove any "active" class
		$(this).addClass("on"); //Add "active" class to selected tab
		
		var tab = $("ul.tab_style01 li").index(this);//선택된 Tab index
		
		flag = tab + 1;
	});
	
	
	//Tab 이동
	tabMove(flag);
  	
}



  
/**========================================================================================
 * Tab 이동
 ========================================================================================*/
function tabMove(flag){
  
	var actionUrl = "";
	  
	if(flag == "1"){actionUrl = "web_chart_eventresult_sub01.jsp";}//행사매출응답률
	else if(flag == "2"){actionUrl = "web_chart_eventresult_sub02.jsp";}//행사고객분석
	else if(flag == "3"){actionUrl = "web_chart_eventresult_sub03.jsp";}//행사고객분석세부
	else if(flag == "4"){actionUrl = "web_chart_eventresult_sub04.jsp";}//다운로드 고객
  
	
	//선택한 Tab Page로 이동  
	var param = "";
	 	$.ajax({
  	 	url:actionUrl,
  		data:param,
  		type:"POST",
  		beforeSend : function(){
  			spinStart();
  		},
  	 	success:function(result) {
  			$("#tab_content").html(result);//id가 tab_content에 내용을 보여줌
  			waterMarkText("web_wrap");//워터마크
  		},
  		complete : function(){
  			spinStop();
  		},
  		error:function(request, status, error){
  			cmdMessage(0,"code : "+request.status+"\n"+"message : "+request.responseText+"\n"+"error:"+error);
  		}
	 	});
}




/**========================================================================================
 * 응답고객 다운로드
 ========================================================================================*/
function resCustCntExcel(){
	if(top_rsp_cust_cnt < 1){return;}
	if(camp_id == ""){return;}
	
	//TM Start =================================================================================================
	var excelTm = new oza_TMHandler('com.obzen.bmpanly.DocEvtSaleRate', 'excelRstCustId', '1', '\@#%');
	excelTm.setAddDataField('CAMP_ID', camp_id);
	excelTm.returnlist('SERVER_FILE_PATH;FILENM');
	excelTm.execute(null, false);
	var file_path = excelTm.ElementValue('SERVER_FILE_PATH');//파일 경로
	var file_name = excelTm.ElementValue('FILENM');//파일 명
 excelTm.clear();
	
	screenLog("다운로드", "web_chart_eventresult_main", "행사결과보기>분석Report",get_client_ip);//화면 로그(공통)
	//TM End ===================================================================================================
	
	if(file_path != "" && file_name != ""){
		$("#file_path").val(file_path);
		$("#file_name").val(file_name);
		$("#excel_form").attr("action", "./common/file_download.jsp");
		$("#excel_form").submit();	
	}else{
		cmdMessage(0,"파일 생성에 실패 하였습니다.");
		return;		
	}
}


  
 </script>
 </head>
<body>
<form name="excel_form" id="excel_form" method="post" target="_blank">
<input type="hidden" name="file_path" id="file_path" />
<input type="hidden" name="file_name" id="file_name" />
</form>

 <div id="web_wrap">
  	<div class="web_container">
		<ul class="tab_style01">
			<li class="on"><a href="javascript:tabMove('1');">행사 매출/응답률</a></li>
			<li><a href="javascript:tabMove('2');">행사 고객분석(VIP/신규)</a></li>
			<li><a href="javascript:tabMove('3');">행사 고객분석(기타)</a></li>
			<li><a href="javascript:tabMove('4');">브랜드 혜택 및 추가참여 고객실적</a></li>
		</ul>
		<div id="tab_content"></div>
		<!-- 워터마크 영역 -->
	      <div id="back_mark"></div>
	      <!-- 워터마크 영역 -->
	</div>
  </div>
 </body>
</html>
