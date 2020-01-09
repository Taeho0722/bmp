<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>운영현황</title>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->

<script type="text/javascript">
var flag = "1";//탭 구분

var sys_div = "";
var md_cd = "";
var result_cd1 = "";
var result_nm1 = "";
var result_cd2 = "";
var result_cd3 = "";
var compare_cd1 = "";
var compare_nm1 = "";
var compare_cd2 = "";
var compare_cd3 = "";

var str_ym = "";
var end_ym = "";
var camp_stat = "";
var sis_div_flag = "";

var group_div = "1";//1:점포, 2:본부
var tm_method1 = "selectStoreCd";
var tm_method2 = "selectTeamCd";
var tm_method3 = "selectPcCd";
var tm1_setCol = "STORE_CD";
var tm2_setCol = "TEAM_CD";
var tm3_setCol = "PC_CD";
var tm1_nm = "점";
var tm2_nm = "팀";
var tm3_nm = "PC";
var tm_sub_method1 = "selectEvtRstTop5";
var tm_sub_method2 = "selectEvtResult";



//전월, 현재월 구하기
var datepicker = new Date();//오늘 날짜//내 컴퓨터 로컬을 기준으로 today에 Date 객체를 넣어줌
var p_year = datepicker.getFullYear();
var str_month = datepicker.getMonth();
var end_month = datepicker.getMonth()+1;
if(str_month < 10){str_month = "0"+str_month;}
if(end_month < 10){end_month = "0"+end_month;}
var p_str_ym = p_year+""+str_month;
var p_end_ym = p_year+""+end_month;


//화면 로드 시 실행
$(document).ready(function() {
 	
	do_RefreshPage("onload");
	
	
	
	//Radio change event
	$('input[name="group_check"]').change(function() {
		group_div = $(":input:radio[name=group_check]:checked").val();//체크값 가져오기
		
		//점포
		if(group_div == "1"){
			tm_method1 = "selectStoreCd";
			tm_method2 = "selectTeamCd";
			tm_method3 = "selectPcCd";
			tm1_setCol = "STORE_CD";
			tm2_setCol = "TEAM_CD";
			tm3_setCol = "PC_CD";
			tm1_nm = "점";
			tm2_nm = "팀";
			tm3_nm = "PC";
			tm_sub_method1 = "selectEvtRstTop5";
			tm_sub_method2 = "selectEvtResult";
			
		//본부	
		}else if(group_div == "2"){
			tm_method1 = "selectHQSectCd";
			tm_method2 = "selectHQGenreCd";
			tm_method3 = "selectHQPcCd";
			tm1_setCol = "SECT_CD";
			tm2_setCol = "GENRE_CD";
			tm3_setCol = "PC_CD";
			tm1_nm = "담당";
			tm2_nm = "장르";
			tm3_nm = "PC";
			tm_sub_method1 = "selectEvtRstTop5HQ";
			tm_sub_method2 = "selectEvtResultHQ";
		}
		
		do_RefreshPage("check");
	});
	
	
});



function do_RefreshPage(gubun) {
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
	sys_div = webSysDiv;
	
	if(gubun == "onload"){
		md_cd = wevMdCd;
		result_cd1 = webStoreCd;
		sis_div_flag = webSysDivFlag;
		
	}
	
	selectStrYmBox();
	selectEndYmBox();
	selectBoxCampDesign();//행사상태 셀렉트 박스 그리기
	selectBox1("1");
	selectBox2("1");
	selectBox3("1");
	selectBox1("2");
	selectBox2("2");
	selectBox3("2");
	selectBoxChange();//셀렉트 박스 변경 이벤트
	
	
	if(result_cd1 == ""){
		//$("#sel_result_cd1 option:eq(1)").attr("selected","selected");
		//result_cd1 = $("#sel_result_cd1 option:selected").val();
		//result_nm1 = $("#sel_result_cd1 option:selected").text();
	}
	
	
	if(compare_cd1 == ""){
		//$("#sel_compare_cd1 option:eq(1)").attr("selected","selected");
		//compare_cd1 = $("#sel_compare_cd1 option:selected").val();
		//compare_nm1 = $("#sel_compare_cd1 option:selected").text();
	}
	
	
	
	if(sis_div_flag == "2.1"){
		$("#sel_result_cd1").val(result_cd1).attr("selected","selected");
		$("#sel_compare_cd1").val(compare_cd1).attr("selected","selected");
	}	
	
	
	
	$('input:radio[name=group_check]:input[value=' + group_div + ']').attr("checked", true);
	

	//조회하기 시 셀렉트 박스 선택
	if(gubun == "search"){
		$("#sel_str_ym").val(str_ym).attr("selected","selected");
		$("#sel_end_ym").val(end_ym).attr("selected","selected");
		$("#sel_camp_stat").val(camp_stat).attr("selected","selected");
		
		$("#sel_result_cd1").val(result_cd1).attr("selected","selected");
		$("#sel_result_cd2").val(result_cd2).attr("selected","selected");
		$("#sel_result_cd3").val(result_cd3).attr("selected","selected");
		
		$("#sel_compare_cd1").val(compare_cd1).attr("selected","selected");
		$("#sel_compare_cd2").val(compare_cd2).attr("selected","selected");
		$("#sel_compare_cd3").val(compare_cd3).attr("selected","selected");
	}
	
	
	//초기 기준년월 설정
	if(gubun == "onload" || gubun == "check" ){
		if(str_ym == ""){
			
			if(p_str_ym == temp_str_ym){
				$("#sel_str_ym").val(p_str_ym).attr("selected","selected");	
			}else{
				$("#sel_str_ym").val(temp_str_ym).attr("selected","selected");
			}
		}else{
			$("#sel_str_ym").val(str_ym).attr("selected","selected");
		}
		
		if(end_ym == ""){
			if(p_end_ym == temp_end_ym){
				$("#sel_end_ym").val(p_end_ym).attr("selected","selected");	
			}else{
				$("#sel_end_ym").val(temp_end_ym).attr("selected","selected");
			}
		}else{
			$("#sel_end_ym").val(end_ym).attr("selected","selected");
		}
	}
	
	contentMove(flag);//서브 페이지 이동
	
}



/**========================================================================================
* 선택 박스 그리기(기준시작년월)
========================================================================================*/
var temp_str_ym = "";
function selectStrYmBox(){
	var selectBox = "";
	var i = 0;
	
	var baseYmTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectBaseYm', '0', '\@#%');
	baseYmTm.execute(null, false);
	var baseYmTmResult = baseYmTm.getResult();
	var baseYmTmResult_json = "";
	if(baseYmTmResult != ""){baseYmTmResult_json = JSON.parse(baseYmTmResult);}
	baseYmTm.clear();

	selectBox += "<option value=''>::선택::</option>";
	for(i=0; i<baseYmTmResult_json.length; i++) {
		selectBox += "<option value='"+baseYmTmResult_json[i].ITEM_CD+"'>"+baseYmTmResult_json[i].ITEM_NM+"</option>";
		if(i == 1){temp_str_ym = baseYmTmResult_json[i].ITEM_CD;}
	}
	
	$("#sel_str_ym").html(selectBox);
}


/**========================================================================================
* 선택 박스 그리기(기준종료년월)
========================================================================================*/
var temp_end_ym = "";
function selectEndYmBox(){
	var selectBox = "";
	var i = 0;
	
	var baseYmTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectBaseYm', '0', '\@#%');
	baseYmTm.execute(null, false);
	var baseYmTmResult = baseYmTm.getResult();
	var baseYmTmResult_json = "";
	if(baseYmTmResult != ""){baseYmTmResult_json = JSON.parse(baseYmTmResult);}
	baseYmTm.clear();

	selectBox += "<option value=''>::선택::</option>";
	for(i=0; i<baseYmTmResult_json.length; i++) {
		selectBox += "<option value='"+baseYmTmResult_json[i].ITEM_CD+"'>"+baseYmTmResult_json[i].ITEM_NM+"</option>";
		if(i == 0){temp_end_ym = baseYmTmResult_json[i].ITEM_CD;}
	}
	
	$("#sel_end_ym").html(selectBox);
}


/**========================================================================================
* select box change event
========================================================================================*/
function selectBoxChange(){
	
	
	//실적 기준 점포,담당 변경
	$("#sel_result_cd1").change(function(){
		var innerHtml = "";
		
		result_cd1 = $("#sel_result_cd1 option:selected").val();
		result_nm1 = $("#sel_result_cd1 option:selected").text();
		
		//팀, 장르 코드 조회
		var TMmanger2 = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', tm_method2, '0', '\@#%');
		TMmanger2.setAddDataField(tm1_setCol, result_cd1);
		TMmanger2.execute(null, false);
		var tm2Result = TMmanger2.getResult();
		var tm2Result_json = "";
		if(tm2Result != ""){
			tm2Result_json = JSON.parse(tm2Result);
		}
		TMmanger2.clear();
		
		innerHtml += "<option value=''>::"+tm2_nm+"::</option>";
		for(var i=0; i<tm2Result_json.length; i++) {
			innerHtml += "<option value='"+tm2Result_json[i].ITEM_CD+"'>"+tm2Result_json[i].ITEM_NM+"</option>";
		}
		
		$("#sel_result_cd2").html(innerHtml);
		$("#sel_result_cd3").html("<option value=''>::PC::</option>");
	});
	
	
	//실적 기준 팀, 장르 변경
	$("#sel_result_cd2").change(function(){
		var innerHtml = "";
		
		result_cd2 = $("#sel_result_cd2 option:selected").val();
		
		//PC 코드 조회
		var TMmanger3 = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', tm_method3, '0', '\@#%');
		TMmanger3.setAddDataField(tm1_setCol, result_cd1);
		TMmanger3.setAddDataField(tm2_setCol, result_cd2);
		TMmanger3.execute(null, false);
		var tm3Result = TMmanger3.getResult();
		var tm3Result_json = "";
		if(tm3Result != ""){
			tm3Result_json = JSON.parse(tm3Result);
		}
		TMmanger3.clear();
		
		innerHtml += "<option value=''>::"+tm3_nm+"::</option>";
		for(var i=0; i<tm3Result_json.length; i++) {
			innerHtml += "<option value='"+tm3Result_json[i].ITEM_CD+"'>"+tm3Result_json[i].ITEM_NM+"</option>";
		}
		
		$("#sel_result_cd3").html(innerHtml);
		
	});
	
	
	//비교 기준 점포 변경
	$("#sel_compare_cd1").change(function(){
		var innerHtml = "";
		
		compare_cd1 = $("#sel_compare_cd1 option:selected").val();
		compare_nm1 = $("#sel_compare_cd1 option:selected").text();
		
		//팀코드 조회
		var TMmanger2 = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', tm_method2, '0', '\@#%');
		TMmanger2.setAddDataField(tm1_setCol, compare_cd1);
		TMmanger2.execute(null, false);
		var tm2Result = TMmanger2.getResult();
		var tm2Result_json = "";
		if(tm2Result != ""){
			tm2Result_json = JSON.parse(tm2Result);
		}
		TMmanger2.clear();
		
		innerHtml += "<option value=''>::"+tm2_nm+"::</option>";
		for(var i=0; i<tm2Result_json.length; i++) {
			innerHtml += "<option value='"+tm2Result_json[i].ITEM_CD+"'>"+tm2Result_json[i].ITEM_NM+"</option>";
		}
		
		$("#sel_compare_cd2").html(innerHtml);
		$("#sel_compare_cd3").html("<option value=''>::PC::</option>");
	});
	
	
	//비교 기준 팀 변경
	$("#sel_compare_cd2").change(function(){
		var innerHtml = "";
		
		compare_cd2 = $("#sel_compare_cd2 option:selected").val();
		
		//PC 코드 조회
		var TMmanger3 = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', tm_method3, '0', '\@#%');
		TMmanger3.setAddDataField(tm1_setCol, compare_cd1);
		TMmanger3.setAddDataField(tm2_setCol, compare_cd2);
		TMmanger3.execute(null, false);
		var tm3Result = TMmanger3.getResult();
		var tm3Result_json = "";
		if(tm3Result != ""){
			tm3Result_json = JSON.parse(tm3Result);
		}
		TMmanger3.clear();
		
		innerHtml += "<option value=''>::"+tm3_nm+"::</option>";
		for(var i=0; i<tm3Result_json.length; i++) {
			innerHtml += "<option value='"+tm3Result_json[i].ITEM_CD+"'>"+tm3Result_json[i].ITEM_NM+"</option>";
		}
		
		$("#sel_compare_cd3").html(innerHtml);
	});
	
	
	//기준시작년월
	$("#sel_str_ym").change(function(){
		str_ym = $("#sel_str_ym option:selected").val();
	});
	
	//기준종료년월
	$("#sel_end_ym").change(function(){
		end_ym = $("#sel_end_ym option:selected").val();
	});
	
}





/**========================================================================================
* 행사기간 디자인
========================================================================================*
function dateDesing(){
	//행사기간 선택
	$("#sel_str_ym").datepicker({
		dateFormat: 'yy-mm-dd' //Input Display Format 변경
    ,showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
    ,showMonthAfterYear:true //년도 먼저 나오고, 뒤에 월 표시
    ,changeYear: true //콤보박스에서 년 선택 가능
    ,changeMonth: true //콤보박스에서 월 선택 가능                
    ,showOn: "both" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
    ,buttonImage: "../../img/web/icon/ic_calendar.png" //버튼 이미지 경로
    ,buttonImageOnly: true //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
    ,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 텍스트
    ,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
    ,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
    ,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트
  });
	
	$("#sel_end_ym").datepicker({
		dateFormat: 'yy-mm-dd' //Input Display Format 변경
    ,showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
    ,showMonthAfterYear:true //년도 먼저 나오고, 뒤에 월 표시
    ,changeYear: true //콤보박스에서 년 선택 가능
    ,changeMonth: true //콤보박스에서 월 선택 가능                
    ,showOn: "both" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
    ,buttonImage: "../../img/web/icon/ic_calendar.png" //버튼 이미지 경로
    ,buttonImageOnly: true //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
    ,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 텍스트
    ,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
    ,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
    ,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트
   });
}

*/



		
/**========================================================================================
* 컨텐츠 조회
========================================================================================*/
function contentMove(flag){
  
var actionUrl = "";

if(flag == "1"){actionUrl = "web_chart_manage_info_sub.jsp";}


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
		$("#web_content").html(result);//id가 tab_content에 내용을 보여줌
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
* 행사 상태 선택 박스 그리기
========================================================================================*/
function selectBoxCampDesign(){
	var selectBox = "";
	var i = 0;
	
	//TM Start--------------------------------------------------------------------
	
	//캠페인 상태
	var campTm = new oza_TMHandler('com.obzen.bmp.ColBMPComm', 'selectCampStatAnly', '0', '\@#%');
	campTm.execute(null, false);
	var campTmResult = campTm.getResult();
	var campTmResult_json = "";
	if(campTmResult != ""){
		campTmResult_json = JSON.parse(campTmResult);
	}
	campTm.clear();
	//TM End----------------------------------------------------------------------
	
	
	selectBox += "<option value=''>::전체::</option>";
	for(i=0; i<campTmResult_json.length; i++) {
		selectBox += "<option value='"+campTmResult_json[i].ITEM_CD+"'>"+campTmResult_json[i].ITEM_NM+"</option>";
	}
	
	$("#sel_camp_stat").html(selectBox);
}


/**========================================================================================
* 선택 박스 그리기(실적기준 점포, 담당)
========================================================================================*/
function selectBox1(sel_flag){
	var selectBox = "";
	var i = 0;
	var sel_id = "";
	
	if(sel_flag == "1"){sel_id = "sel_result_cd1";}
	else if(sel_flag == "2"){sel_id = "sel_compare_cd1";}
	
	var TMmanger1 = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', tm_method1, '0', '\@#%');
	TMmanger1.execute(null, false);
	var tm1Result = TMmanger1.getResult();
	var tm1Result_json = "";
	if(tm1Result != ""){tm1Result_json = JSON.parse(tm1Result);}
	TMmanger1.clear();
	
	selectBox += "<option value=''>::"+tm1_nm+"::</option>";
	for(i=0; i<tm1Result_json.length; i++) {
		selectBox += "<option value='"+tm1Result_json[i].ITEM_CD+"'>"+tm1Result_json[i].ITEM_NM+"</option>";
	}
	
	$("#"+sel_id).html(selectBox);
}


/**========================================================================================
* 선택 박스 그리기(실적기준 팀, 장르)
========================================================================================*/
function selectBox2(sel_flag){
	var selectBox = "";
	var i = 0;
	var sel_id = "";
	var sel_result_cd1 = "";
	
	if(sel_flag == "1"){sel_id = "sel_result_cd2"; sel_result_cd1 = result_cd1;}
	else if(sel_flag == "2"){sel_id = "sel_compare_cd2"; sel_result_cd1 = compare_cd1;}
	
	var TMmanger2 = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', tm_method2, '0', '\@#%');
	TMmanger2.setAddDataField(tm1_setCol, sel_result_cd1);
	TMmanger2.execute(null, false);
	var tm2Result = TMmanger2.getResult();
	var tm2Result_json = "";
	if(tm2Result != ""){tm2Result_json = JSON.parse(tm2Result);}
	TMmanger2.clear();
	
	selectBox += "<option value=''>::"+tm2_nm+"::</option>";
	for(i=0; i<tm2Result_json.length; i++) {
		selectBox += "<option value='"+tm2Result_json[i].ITEM_CD+"'>"+tm2Result_json[i].ITEM_NM+"</option>";
	}
	
	$("#"+sel_id).html(selectBox);
}



/**========================================================================================
* 선택 박스 그리기(실적기준 PC)
========================================================================================*/
function selectBox3(sel_flag){
	var selectBox = "";
	var i = 0;
	var sel_id = "";
	var sel_result_cd1 = "";
	var sel_result_cd2 = "";
	
	if(sel_flag == "1"){sel_id = "sel_result_cd3"; sel_result_cd1 = result_cd1;  sel_result_cd2 = result_cd2;}
	else if(sel_flag == "2"){sel_id = "sel_compare_cd3"; sel_result_cd1 = compare_cd1;  sel_result_cd2 = compare_cd2;}
	
	var TMmanger3 = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', tm_method3, '0', '\@#%');
	TMmanger3.setAddDataField(tm1_setCol, sel_result_cd1);
	TMmanger3.setAddDataField(tm2_setCol, sel_result_cd2);
	TMmanger3.execute(null, false);
	var tm3Result = TMmanger3.getResult();
	var tm3Result_json = "";
	if(tm3Result != ""){tm3Result_json = JSON.parse(tm3Result);}
	TMmanger3.clear();
	
	selectBox += "<option value=''>::"+tm3_nm+"::</option>";
	for(i=0; i<tm3Result_json.length; i++) {
		selectBox += "<option value='"+tm3Result_json[i].ITEM_CD+"'>"+tm3Result_json[i].ITEM_NM+"</option>";
	}
	
	$("#"+sel_id).html(selectBox);
}




/**========================================================================================
* 조회하기
========================================================================================*/
var srh_str_ym = "";
var srh_end_ym = "";
var srh_camp_stat = "";
var srh_result_cd1 = "";
var srh_result_nm1 = "";
var srh_result_cd2 = "";
var srh_result_cd3 = "";
var srh_compare_cd1 = "";
var srh_compare_nm1 = "";
var srh_compare_cd2 = "";
var srh_compare_cd3 = "";

function searchChart(){
	srh_str_ym = $("#sel_str_ym").val();
	srh_end_ym = $("#sel_end_ym").val();
	srh_camp_stat = $("#sel_camp_stat").val();
	
	srh_result_cd1 = $("#sel_result_cd1").val();
	srh_result_nm1 = $("#sel_result_cd1 option:selected").text();
	srh_result_cd2 = $("#sel_result_cd2").val();
	srh_result_cd3 = $("#sel_result_cd3").val();

	srh_compare_cd1 = $("#sel_compare_cd1").val();
	srh_compare_nm1 = $("#sel_compare_cd1 option:selected").text();
	srh_compare_cd2 = $("#sel_compare_cd2").val();
	srh_compare_cd3 = $("#sel_compare_cd3").val();

	//srh_str_ym = $("#sel_str_ym").val();
	
	result_cd1 = srh_result_cd1;
	result_nm1 = srh_result_nm1;
	result_cd2 = srh_result_cd2;
	result_cd3 = srh_result_cd3;
	
	compare_cd1 = srh_compare_cd1;
	compare_nm1 = srh_compare_nm1;
	compare_cd2 = srh_compare_cd2;
	compare_cd3 = srh_compare_cd3;

	
	if(result_cd1 == ""){
		
		if(group_div == "1"){cmdMessage(3,"실적기준 점포");}
		if(group_div == "2"){cmdMessage(3,"실적기준 담당");}
		
		$("#sel_result_cd1").focus();
		return;
	}
	
	/*
	if(compare_cd1 == ""){
		cmdMessage(3,"비교기준 점포");
		$("#sel_compare_cd1").focus();
		return;
	}
	*/
	
	str_ym = srh_str_ym;
	end_ym = srh_end_ym;
	camp_stat = srh_camp_stat;
	
	do_RefreshPage("search");
}



</script>
</head>
<body>
  <div id="web_wrap">
    <div class="web_container">
      <div class="top_fixed">
        <div class="top_search">
            <dl>
              <dt>기준년월</dt>
              <dd><select id="sel_str_ym"></select> ~ <select id="sel_end_ym"></select></dd>
              <dt>캠페인상태</dt>
              <dd>
                <select id="sel_camp_stat"></select>
              </dd>
            </dl>
            <div class="btn_box">
            <!-- 
              <a href="">그리드조회</a>
              <a href="">실적</a>
             -->  
          </div>
        </div>
        <div class="inquiry_wrap2">
          <div class="radio_box">
            <label for="radio1"><input type="radio" id="radio1" name="group_check" value="1">점포</label>
            <label for="radio2"><input type="radio" id="radio2" name="group_check" value="2">본부</label>
          </div>
          <div class="select_wrap">
            <div class="select_left">
              <label for="">실적기준</label>
              <select id="sel_result_cd1"></select>
              <select id="sel_result_cd2"></select>
              <select id="sel_result_cd3"></select>
            </div>
            <div class="select_right">
              <label for="">비교기준</label>
              <select id="sel_compare_cd1"></select>
              <select id="sel_compare_cd2"></select>
              <select id="sel_compare_cd3"></select>
            </div>
          </div>
          <a href="javascript:searchChart();" class="btn_inquiry">조회하기</a>
        </div>
      </div>
      <div id="web_content">
      </div>
      <!-- 워터마크 영역 -->
      <div id="back_mark"></div>
      <!-- 워터마크 영역 -->
    </div>
  </div>
</body>
</html>
 