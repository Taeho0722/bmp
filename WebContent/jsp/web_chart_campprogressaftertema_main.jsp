<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<!DOCTYPE html>
<html>
<head>
<title> 행사 진행 현황 </title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->

<script type="text/javascript">
var flag = "1";//탭 구분

var sys_div = "";
var md_cd = "";
var store_cd = "";
var pc_cd = "";
var team_cd = "";
var floor_cd = "";
var crnr_cd = "";
var sect_cd = "";
var genre_cd = "";
var group_div = "1";//1:점포, 2:본부
var str_dt = "";
var end_dt = "";
var camp_stat = "";
var sis_div_flag = "";

var bmpevt_ty_cd = "1";//1:임직원행사 포함, 2:임직원 행사 미포함
var bran_offer_dstic_cd = "";
var offer_brch = "";



var datepicker = new Date();//오늘 날짜//내 컴퓨터 로컬을 기준으로 today에 Date 객체를 넣어줌
var p_year = datepicker.getFullYear();
var p_month = datepicker.getMonth()+1;
if(p_month.toString().length == 1) {
	p_month = '0'+p_month;
}
var p_date = p_year+"-"+p_month+"-01";


//TM method
var md_tm = "selectMdCd";
var store_tm = "selectStoreCd";
var pc_tm = "selectPcCd";
var team_tm = "selectTeamCd";
var floor_tm = "selectFloorCd";
var crnr_tm = "selectCrnrCd";
var sect_tm = "selectHQSectCd";
var genre_tm = "selectHQGenreCd";



//화면 로드 시 실행
$(document).ready(function() {
 	
	do_RefreshPage("onload");
	
	
	/* Radio change event */
	$('input[name="group_check"]').change(function() {
		group_div = $(":input:radio[name=group_check]:checked").val();//체크값 가져오기
		
		//점포
		if(group_div == "1"){
			store_tm = "selectStoreCd";
			pc_tm = "selectPcCd";
			team_tm = "selectTeamCd";
			floor_tm = "selectFloorCd";
			crnr_tm = "selectCrnrCd";
			md_tm = "selectMdCd";
			
		//본부	
		}else if(group_div == "2"){
			sect_tm = "selectHQSectCd";
			genre_tm = "selectHQGenreCd";
			floor_tm = "selectHQFloorCd";
			pc_tm = "selectHQPcCd";
			crnr_tm = "selectHQCrnrCd";
			md_tm = "selectHQMdCd";
		}
		
		do_RefreshPage("check");
	});
	
	
	
	/* 임직원 행사 Radio change event */
	$('input[name="camp_check"]').change(function() {
		bmpevt_ty_cd = $(":input:radio[name=camp_check]:checked").val();//체크값 가져오기
		
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
		store_cd = webStoreCd;
		sis_div_flag = webSysDivFlag;
	}
	
	/*
	console.log("store_tm="+store_tm);
	console.log("pc_tm="+pc_tm);
	console.log("team_tm="+team_tm);
	console.log("floor_tm="+floor_tm);
	console.log("crnr_tm="+crnr_tm);
	console.log("sect_tm="+sect_tm);
	console.log("genre_tm="+genre_tm);
	console.log("md_tm="+md_tm);
	*/
	
	//Test
	//sys_div = "2"; 
	//md_cd = wevMdCd;
	//store_cd = "";
	
	$('input:radio[name=group_check]:input[value=' + group_div + ']').attr("checked", true);
	$('input:radio[name=camp_check]:input[value=' + bmpevt_ty_cd + ']').attr("checked", true);
	//dateDesing();//행사기간
	selectBoxCampDesign();//행사상태 셀렉트 박스 그리기
	selectBoxDesign();//셀렉트 박스 그리기
	selectBoxBrand();//브랜드 컨텐츠 박스
	selectBoxShin();//신세계 혜택
	selectBoxChange();//셀렉트 박스 변경 이벤트
	//dateCheck();//날짜 변경 체크
	
	
	if(sis_div_flag == "2.1" && group_div == "1"){
		$("#sel_store_cd").val(store_cd).attr("selected","selected");
	}	
		
	
	//조회하기 시 셀렉트 박스 선택
	if(gubun == "search"){
		
		//점포, 본부 Radio 
		if(group_div == "1"){
			$("#sel_store_cd").val(store_cd).attr("selected","selected");
			$("#sel_team_cd").val(team_cd).attr("selected","selected");
			$("#sel_floor_cd").val(floor_cd).attr("selected","selected");
			$("#sel_pc_cd").val(pc_cd).attr("selected","selected");
			$("#sel_corner_cd").val(crnr_cd).attr("selected","selected");
			$("#sel_md_cd").val(md_cd).attr("selected","selected");
			
		}else if(group_div == "2"){
			$("#sel_sect_cd").val(sect_cd).attr("selected","selected");
			$("#sel_genre_cd").val(genre_cd).attr("selected","selected");
			$("#sel_floor_cd").val(floor_cd).attr("selected","selected");
			$("#sel_pc_cd").val(pc_cd).attr("selected","selected");
			$("#sel_corner_cd").val(crnr_cd).attr("selected","selected");
			$("#sel_md_cd").val(md_cd).attr("selected","selected");
		}
		
		
		//$("#camp_str_dt").val(setValidDate(str_dt));
		//$("#camp_end_dt").val(setValidDate(end_dt));
		$("#sel_camp_stat").val(camp_stat).attr("selected","selected");
		$("#sel_bran_offer_dstic_cd").val(bran_offer_dstic_cd).attr("selected","selected");
		$("#sel_offer_brch").val(offer_brch).attr("selected","selected");
	}
	
	
	//오늘 날짜 설정
	if(gubun == "onload"){
		//$('#camp_str_dt').val(p_date);
		//$('#camp_end_dt').datepicker('setDate', '-1D');	
	}

	calChangeEvent();//행사 캘린더 년월 변경 이벤트
	
	
	if(gubun == "onload"){
		searchChart();
	}else{
		contentMove(flag);//서브 페이지 이동	
	}
	
}




/**========================================================================================
* select box change event
========================================================================================*/
function selectBoxChange(){
	
	
	//점포 변경
	$("#sel_store_cd").change(function(){
		var innerHtml = "";
		
		store_cd = $("#sel_store_cd option:selected").val();
		
		//팀
		var teamTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', team_tm, '0', '\@#%');
		teamTm.setAddDataField('STORE_CD', store_cd);
		teamTm.setAddDataField('MD_CD', md_cd);
		teamTm.execute(null, false);
		var teamTmResult = teamTm.getResult();
		var teamTmResult_json = "";
		if(teamTmResult != ""){
			teamTmResult_json = JSON.parse(teamTmResult);
		}
		teamTm.clear();
		
		innerHtml += "<option value=''>::팀::</option>";
		for(var i=0; i<teamTmResult_json.length; i++) {
			innerHtml += "<option value='"+teamTmResult_json[i].ITEM_CD+"'>"+teamTmResult_json[i].ITEM_NM+"</option>";
		}
		
		$("#sel_team_cd").html(innerHtml);
		$("#sel_floor_cd").html("<select id='sel_floor_cd'><option value=''>::층::</option></select>");
		$("#sel_pc_cd").html("<select id='sel_pc_cd'><option value=''>::PC::</option></select>");
		$("#sel_corner_cd").html("<select id='sel_corner_cd'><option value=''>::코너::</option></select>");
		
	});
	
	
	
	//담당 변경
	$("#sel_sect_cd").change(function(){
		var innerHtml = "";
		
		sect_cd = $("#sel_sect_cd option:selected").val();
		
		//장르
		var genreTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', genre_tm, '0', '\@#%');
		genreTm.setAddDataField('SECT_CD', sect_cd);
		genreTm.execute(null, false);
		var genreTmResult = genreTm.getResult();
		var genreTmResult_json = "";
		if(genreTmResult != ""){
			genreTmResult_json = JSON.parse(genreTmResult);
		}
		genreTm.clear();
		
		innerHtml += "<option value=''>::장르::</option>";
		for(var i=0; i<genreTmResult_json.length; i++) {
			innerHtml += "<option value='"+genreTmResult_json[i].ITEM_CD+"'>"+genreTmResult_json[i].ITEM_NM+"</option>";
		}
		
		$("#sel_genre_cd").html(innerHtml);
		$("#sel_floor_cd").html("<select id='sel_floor_cd'><option value=''>::층::</option></select>");
		$("#sel_pc_cd").html("<select id='sel_pc_cd'><option value=''>::PC::</option></select>");
		$("#sel_corner_cd").html("<select id='sel_corner_cd'><option value=''>::코너::</option></select>");
		
	});
	
	
	
	//장르 변경
	$("#sel_genre_cd").change(function(){
		var innerHtml = "";
		
		genre_cd = $("#sel_genre_cd option:selected").val();
		
		//층
		var floorTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', floor_tm, '0', '\@#%');
		floorTm.setAddDataField('GENRE_CD', genre_cd);
		floorTm.execute(null, false);
		var floorTmResult = floorTm.getResult();
		var floorTmResult_json = "";
		if(floorTmResult != ""){
			floorTmResult_json = JSON.parse(floorTmResult);
		}
		floorTm.clear();
		
		innerHtml += "<option value=''>::층::</option>";
		for(var i=0; i<floorTmResult_json.length; i++) {
			innerHtml += "<option value='"+floorTmResult_json[i].ITEM_CD+"'>"+floorTmResult_json[i].ITEM_NM+"</option>";
		}
		
		
		$("#sel_floor_cd").html(innerHtml);
		$("#sel_pc_cd").html("<select id='sel_pc_cd'><option value=''>::PC::</option></select>");
		$("#sel_corner_cd").html("<select id='sel_corner_cd'><option value=''>::코너::</option></select>");
		
	});
	
	
	//팀 변경
	$("#sel_team_cd").change(function(){
		var innerHtml = "";
		
		team_cd = $("#sel_team_cd option:selected").val();
		
		//층
		var floorTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', floor_tm, '0', '\@#%');
		floorTm.setAddDataField('STORE_CD', store_cd);
		floorTm.setAddDataField('MD_CD', md_cd);
		floorTm.setAddDataField('TEAM_CD', team_cd);
		floorTm.execute(null, false);
		var floorTmResult = floorTm.getResult();
		var floorTmResult_json = "";
		if(floorTmResult != ""){
			floorTmResult_json = JSON.parse(floorTmResult);
		}
		floorTm.clear();
		
		innerHtml += "<option value=''>::층::</option>";
		for(var i=0; i<floorTmResult_json.length; i++) {
			innerHtml += "<option value='"+floorTmResult_json[i].ITEM_CD+"'>"+floorTmResult_json[i].ITEM_NM+"</option>";
		}
		
		
		$("#sel_floor_cd").html(innerHtml);
		$("#sel_pc_cd").html("<select id='sel_pc_cd'><option value=''>::PC::</option></select>");
		$("#sel_corner_cd").html("<select id='sel_corner_cd'><option value=''>::코너::</option></select>");
		
	});
	
	
	
	//층 변경
	$("#sel_floor_cd").change(function(){
		var innerHtml = "";
		
		floor_cd = $("#sel_floor_cd option:selected").val();
		
		//PC
		var pcTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', pc_tm, '0', '\@#%');
		pcTm.setAddDataField('STORE_CD', store_cd);
		pcTm.setAddDataField('MD_CD', md_cd);
		pcTm.setAddDataField('FLOOR_CD', floor_cd);
		
		pcTm.execute(null, false);
		var pcTmResult = pcTm.getResult();
		var pcTmResult_json = "";
		if(pcTmResult != ""){
			pcTmResult_json = JSON.parse(pcTmResult);
		}
		pcTm.clear();
		
		innerHtml += "<option value=''>::PC::</option>";
		for(var i=0; i<pcTmResult_json.length; i++) {
			innerHtml += "<option value='"+pcTmResult_json[i].ITEM_CD+"'>"+pcTmResult_json[i].ITEM_NM+"</option>";
		}
		$("#sel_pc_cd").html(innerHtml);
		$("#sel_corner_cd").html("<select id='sel_corner_cd'><option value=''>::코너::</option></select>");
		
	});
	
	
	
	
	//PC 변경
	$("#sel_pc_cd").change(function(){
		var innerHtml = "";
		
		pc_cd = $("#sel_pc_cd option:selected").val();
		
		//코너
		var crnrTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', crnr_tm, '0', '\@#%');
		crnrTm.setAddDataField('STORE_CD', store_cd);
		crnrTm.setAddDataField('MD_CD', md_cd);
		crnrTm.setAddDataField('PC_CD', pc_cd);
		crnrTm.execute(null, false);
		var crnrTmResult = crnrTm.getResult();
		var crnrTmResult_json = "";
		if(crnrTmResult != ""){
			crnrTmResult_json = JSON.parse(crnrTmResult);
		}
		crnrTm.clear();
		
		
		innerHtml += "<option value=''>::코너::</option>";
		for(var i=0; i<crnrTmResult_json.length; i++) {
			innerHtml += "<option value='"+crnrTmResult_json[i].ITEM_CD+"'>"+crnrTmResult_json[i].ITEM_NM+"</option>";
		}
		
		$("#sel_corner_cd").html(innerHtml);
		
	});
	
	
	//코너 변경
	$("#sel_corner_cd").change(function(){
		var innerHtml = "";
		
		crnr_cd = $("#sel_corner_cd option:selected").val();
		
		//MD
		var mdTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', md_tm, '0', '\@#%');
		mdTm.setAddDataField('STORE_CD', store_cd);
		mdTm.setAddDataField('MD_CD', md_cd);
		mdTm.setAddDataField('FLOOR_CD', floor_cd);
		mdTm.setAddDataField('PC_CD', pc_cd);
		mdTm.setAddDataField('CRNR_CD', crnr_cd);
		mdTm.execute(null, false);
		var mdTmResult = mdTm.getResult();
		var mdTmResult_json = "";
		if(mdTmResult != ""){
			mdTmResult_json = JSON.parse(mdTmResult);
		}
		mdTm.clear();
		
		innerHtml += "<option value=''>::MD::</option>";
		for(var i=0; i<mdTmResult_json.length; i++) {
			innerHtml += "<option value='"+mdTmResult_json[i].ITEM_CD+"'>"+mdTmResult_json[i].ITEM_NM+"</option>";
		}
		$("#sel_md_cd").html(innerHtml);
		$("#sel_md_cd").val(md_cd).attr("selected","selected");
	});
	
}





/**========================================================================================
* 행사기간 디자인
========================================================================================*/
function dateDesing(){
	//행사기간 선택
	$("#camp_str_dt").datepicker({
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
	
	
	
	$("#camp_end_dt").datepicker({
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





		
/**========================================================================================
* 컨텐츠 조회
========================================================================================*/
function contentMove(flag){
  
var actionUrl = "";

if(flag == "1"){actionUrl = "web_chart_campprogressaftertema_sub.jsp";}


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
	
	
	selectBox += "<select id='sel_camp_stat'>";
	selectBox += "<option value=''>::전체::</option>";
	for(i=0; i<campTmResult_json.length; i++) {
		selectBox += "<option value='"+campTmResult_json[i].ITEM_CD+"'>"+campTmResult_json[i].ITEM_NM+"</option>";
	}
	selectBox += "</select>";
	
	
	$("#select_camp_design").html(selectBox);
}




/**========================================================================================
* 브랜드 혜택 선택 박스 그리기
========================================================================================*/
function selectBoxBrand(){
	var selectBox = "";
	var i = 0;
	
	//TM Start--------------------------------------------------------------------
	var brandContCdTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectBrandContCd', '0', '\@#%');
	brandContCdTm.execute(null, false);
	var brandContCdTmResult = brandContCdTm.getResult();
	var brandContCdTmResult_json = "";
	if(brandContCdTmResult != ""){
		brandContCdTmResult_json = JSON.parse(brandContCdTmResult);
	}
	brandContCdTm.clear();
	//TM End----------------------------------------------------------------------
	
	selectBox += "<option value=''>::전체::</option>";
	for(i=0; i<brandContCdTmResult_json.length; i++) {
		selectBox += "<option value='"+brandContCdTmResult_json[i].ITEM_CD+"'>"+brandContCdTmResult_json[i].ITEM_NM+"</option>";
	}
	
	$("#sel_bran_offer_dstic_cd").html(selectBox);
}



/**========================================================================================
* 신세계 혜택 선택 박스 그리기
========================================================================================*/
function selectBoxShin(){
	var selectBox = "";
	var i = 0;
	
	//TM Start--------------------------------------------------------------------
	var offerBrchCdTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectOfferBrchCd', '0', '\@#%');
	offerBrchCdTm.execute(null, false);
	var offerBrchCdTmResult = offerBrchCdTm.getResult();
	var offerBrchCdTmResult_json = "";
	if(offerBrchCdTmResult != ""){
		offerBrchCdTmResult_json = JSON.parse(offerBrchCdTmResult);
	}
	offerBrchCdTm.clear();
	//TM End----------------------------------------------------------------------
	
	selectBox += "<option value=''>::전체::</option>";
	for(i=0; i<offerBrchCdTmResult_json.length; i++) {
		selectBox += "<option value='"+offerBrchCdTmResult_json[i].ITEM_CD+"'>"+offerBrchCdTmResult_json[i].ITEM_NM+"</option>";
	}
	
	$("#sel_offer_brch").html(selectBox);
}


/**========================================================================================
* 선택 박스 그리기
========================================================================================*/
function selectBoxDesign(){
	var selectBox = "";
	var i = 0;
	
	//TM Start--------------------------------------------------------------------
	
	//MD
	var mdTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', md_tm, '0', '\@#%');
	mdTm.setAddDataField('STORE_CD', store_cd);
	mdTm.setAddDataField('MD_CD', md_cd);
	mdTm.setAddDataField('GENRE_CD', genre_cd);
	mdTm.setAddDataField('FLOOR_CD', floor_cd);
	mdTm.setAddDataField('PC_CD', pc_cd);
	mdTm.setAddDataField('CRNR_CD', crnr_cd);
	mdTm.execute(null, false);
	var mdTmResult = mdTm.getResult();
	var mdTmResult_json = "";
	if(mdTmResult != ""){
		mdTmResult_json = JSON.parse(mdTmResult);
	}
	mdTm.clear();
	
	
	
	
	
	//Radio 점포
	if(group_div == "1"){
		
		//점포
		var storeTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', store_tm, '0', '\@#%');
		storeTm.setAddDataField('MD_CD', md_cd);
		storeTm.execute(null, false);
		var storeTmResult = storeTm.getResult();
		var storeTmResult_json = "";
		if(storeTmResult != ""){
			storeTmResult_json = JSON.parse(storeTmResult);
		}
		storeTm.clear();
		
		
		//팀
		var teamTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', team_tm, '0', '\@#%');
		teamTm.setAddDataField('STORE_CD', store_cd);
		teamTm.setAddDataField('MD_CD', md_cd);
		teamTm.execute(null, false);
		var teamTmResult = teamTm.getResult();
		var teamTmResult_json = "";
		if(teamTmResult != ""){
			teamTmResult_json = JSON.parse(teamTmResult);
		}
		teamTm.clear();
		
		
	//Radio 본부	
	}else if(group_div == "2"){
		//담당
		var sectTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', sect_tm, '0', '\@#%');
		sectTm.execute(null, false);
		var sectTmResult = sectTm.getResult();
		var sectTmResult_json = "";
		if(sectTmResult != ""){
			sectTmResult_json = JSON.parse(sectTmResult);
		}
		sectTm.clear();
		
		//장르
		var genreTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', genre_tm, '0', '\@#%');
		genreTm.setAddDataField('SECT_CD', sect_cd);
		genreTm.execute(null, false);
		var genreTmResult = genreTm.getResult();
		var genreTmResult_json = "";
		if(genreTmResult != ""){
			genreTmResult_json = JSON.parse(genreTmResult);
		}
		genreTm.clear();
	}
	
	
	//층
	var floorTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', floor_tm, '0', '\@#%');
	floorTm.setAddDataField('STORE_CD', store_cd);
	floorTm.setAddDataField('MD_CD', md_cd);
	floorTm.setAddDataField('TEAM_CD', team_cd);
	floorTm.setAddDataField('GENRE_CD', genre_cd);
	floorTm.execute(null, false);
	var floorTmResult = floorTm.getResult();
	var floorTmResult_json = "";
	if(floorTmResult != ""){
		floorTmResult_json = JSON.parse(floorTmResult);
	}
	floorTm.clear();
	
	
	//PC
	var pcTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', pc_tm, '0', '\@#%');
	pcTm.setAddDataField('STORE_CD', store_cd);
	pcTm.setAddDataField('MD_CD', md_cd);
	pcTm.setAddDataField('FLOOR_CD', floor_cd);
	pcTm.execute(null, false);
	var pcTmResult = pcTm.getResult();
	var pcTmResult_json = "";
	if(pcTmResult != ""){
		pcTmResult_json = JSON.parse(pcTmResult);
	}
	pcTm.clear();
	
	
	//코너
	var crnrTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', crnr_tm, '0', '\@#%');
	crnrTm.setAddDataField('STORE_CD', store_cd);
	crnrTm.setAddDataField('MD_CD', md_cd);
	crnrTm.setAddDataField('PC_CD', pc_cd);
	crnrTm.execute(null, false);
	var crnrTmResult = crnrTm.getResult();
	var crnrTmResult_json = "";
	if(crnrTmResult != ""){
		crnrTmResult_json = JSON.parse(crnrTmResult);
	}
	crnrTm.clear();
	
	
	
	//Radio 점포
	if(group_div == "1"){
		//점포
		selectBox += "<select id='sel_store_cd'>";
		selectBox += "<option value=''>::점::</option>";
		for(i=0; i<storeTmResult_json.length; i++) {
			selectBox += "<option value='"+storeTmResult_json[i].ITEM_CD+"'>"+storeTmResult_json[i].ITEM_NM+"</option>";
		}
		selectBox += "</select>";
		
		//팀
		selectBox += "<select id='sel_team_cd'>";
		selectBox += "<option value=''>::팀::</option>";
		for(i=0; i<teamTmResult_json.length; i++) {
			selectBox += "<option value='"+teamTmResult_json[i].ITEM_CD+"'>"+teamTmResult_json[i].ITEM_NM+"</option>";
		}
		selectBox += "</select>";
		
	//Radio 본부	
	}else if(group_div == "2"){
		//담당
		selectBox += "<select id='sel_sect_cd'>";
		selectBox += "<option value=''>::담당::</option>";
		for(i=0; i<sectTmResult_json.length; i++) {
			selectBox += "<option value='"+sectTmResult_json[i].ITEM_CD+"'>"+sectTmResult_json[i].ITEM_NM+"</option>";
		}
		selectBox += "</select>";
		
		//장르
		selectBox += "<select id='sel_genre_cd'>";
		selectBox += "<option value=''>::장르::</option>";
		for(i=0; i<genreTmResult_json.length; i++) {
			selectBox += "<option value='"+genreTmResult_json[i].ITEM_CD+"'>"+genreTmResult_json[i].ITEM_NM+"</option>";
		}
		selectBox += "</select>";
	}
	
	//층
	selectBox += "<select id='sel_floor_cd'>";
	selectBox += "<option value=''>::층::</option>";
	for(i=0; i<floorTmResult_json.length; i++) {
		selectBox += "<option value='"+floorTmResult_json[i].ITEM_CD+"'>"+floorTmResult_json[i].ITEM_NM+"</option>";
	}
	selectBox += "</select>";	
	
	//PC
	selectBox += "<select id='sel_pc_cd'>";
	selectBox += "<option value=''>::PC::</option>";
	for(i=0; i<pcTmResult_json.length; i++) {
		selectBox += "<option value='"+pcTmResult_json[i].ITEM_CD+"'>"+pcTmResult_json[i].ITEM_NM+"</option>";
	}
	selectBox += "</select>";
	
	
	
	//코너
	selectBox += "<select id='sel_corner_cd'>";
	selectBox += "<option value=''>::코너::</option>";
	for(i=0; i<crnrTmResult_json.length; i++) {
		selectBox += "<option value='"+crnrTmResult_json[i].ITEM_CD+"'>"+crnrTmResult_json[i].ITEM_NM+"</option>";
	}
	selectBox += "</select>";
	
	
	//MD
	selectBox += "<select id='sel_md_cd'>";
	selectBox += "<option value=''>::MD::</option>";
	for(i=0; i<mdTmResult_json.length; i++) {
		selectBox += "<option value='"+mdTmResult_json[i].ITEM_CD+"'>"+mdTmResult_json[i].ITEM_NM+"</option>";
	}
	selectBox += "</select>";
	
	
	$("#select_design").html(selectBox);
}


/**========================================================================================
* 조회하기
========================================================================================*/
var srh_str_dt = "";
var srh_end_dt = "";
var srh_camp_stat = "";
var srh_store_cd = "";
var srh_floor_cd = "";
var srh_team_cd = "";
var srh_pc_cd = "";
var srh_crnr_cd = "";
var srh_md_cd = "";
var srh_sect_cd = "";
var srh_genre_cd = "";
var srh_bran_offer_dstic_cd = "";
var srh_offer_brch = "";

function searchChart(){
	//srh_str_dt = $("#camp_str_dt").val();
	//srh_end_dt = $("#camp_end_dt").val();
	srh_camp_stat = $("#sel_camp_stat").val();
	srh_bran_offer_dstic_cd = $("#sel_bran_offer_dstic_cd").val();
	srh_offer_brch = $("#sel_offer_brch").val();
	
	
	//Radio 점포
	if(group_div == "1"){
		srh_store_cd = $("#sel_store_cd").val();
		srh_floor_cd = $("#sel_floor_cd").val();
		srh_team_cd = $("#sel_team_cd").val();
		srh_pc_cd = $("#sel_pc_cd").val();
		srh_crnr_cd = $("#sel_corner_cd").val();
		srh_md_cd = $("#sel_md_cd").val();
	
		/*
		if(srh_store_cd == ""){
			cmdMessage(3,"점포");
			$("#sel_store_cd").focus();
			return;
		}
		*/
		
		
		store_cd = srh_store_cd;
		md_cd = srh_md_cd;
		pc_cd = srh_pc_cd;
		team_cd = srh_team_cd;
		floor_cd = srh_floor_cd;
		crnr_cd = srh_crnr_cd;
		
	//Radio 본부	
	}else if(group_div == "2"){
		srh_sect_cd = $("#sel_sect_cd").val();
		srh_genre_cd = $("#sel_genre_cd").val();
		srh_pc_cd = $("#sel_pc_cd").val();
		srh_crnr_cd = $("#sel_corner_cd").val();
		srh_md_cd = $("#sel_md_cd").val();
		
		/*
		if(srh_sect_cd == ""){
			cmdMessage(3,"담당");
			$("#sel_sect_cd").focus();
			return;
		}
		*/
		
		sect_cd = srh_sect_cd;
		srh_genre_cd = srh_genre_cd;
		pc_cd = srh_pc_cd;
		crnr_cd = srh_crnr_cd;
		md_cd = srh_md_cd;
	}
	
	/*
	if(srh_md_cd == ""){
		cmdMessage(3,"MD");
		$("#sel_md_cd").focus();
		return;
	}
	*/
	
	str_dt = sDelHypn(srh_str_dt,"-","");
	end_dt = sDelHypn(srh_end_dt,"-","");
	camp_stat = srh_camp_stat;
	bran_offer_dstic_cd = srh_bran_offer_dstic_cd;
	offer_brch = srh_offer_brch;
	
	do_RefreshPage("search");
}







//행사 캘린더 Layer 팝업 관련 시작---------------------------------------------------------------------------------------------------------------------------------------


/*===============================================================
날짜 체크
===============================================================*/
function dateCheck(){
	//행사시작기간 체크 
	$("#camp_str_dt").on("propertychange change keyup paste input", function() {
	  	var str_dt = $(this).val();
		  var end_dt = $("#camp_end_dt").val();
		  
		  
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
		  
			var calDate = getCalDate(str_dt,end_dt ,"D");//시작일 보다 종료일이 작지 않도록 체크
		  
		  if(calDate < 1){
			  cmdMessage(0,"행사 기간을 확인 하세요.");
				//오늘 날짜 설정
				$('#camp_str_dt').datepicker('setDate', 'today');
				
			  $("#camp_str_dt").focus();
			  return;
		  }
	});
	
	
	
	//행사종료기간 체크 
	$("#camp_end_dt").on("propertychange change keyup paste input", function() {
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
		  
			var calDate = getCalDate(str_dt,end_dt ,"D");//시작일 보다 종료일이 작지 않도록 체크
		  
		  if(calDate < 1){
			  cmdMessage(0,"행사 기간을 확인 하세요.");
				//오늘 날짜 설정
				$('#camp_str_dt').datepicker('setDate', 'today');
				
			  $("#camp_end_dt").focus();
			  return;
		  }
	});
}


/*===============================================================
행사 캘린더 변경 이벤트
===============================================================*/
function calChangeEvent(){
	//년도 변경 시  
	$("#sel_year").change(function(){
		sel_year = $("#sel_year").val();
		sel_month = $("#sel_month").val();
		
		calendarDesign(sel_year,sel_month);
		eventBrandList("search");
	});
	
	
	//월 변경 시 
	$("#sel_month").change(function(){
		sel_year = $("#sel_year").val();
		sel_month = $("#sel_month").val();
		
		calendarDesign(sel_year,sel_month);
		eventBrandList("search");
	});
	
	
	//MD건수 클릭 시
	$("#md_cnt").click(function() {
		sel_year = $("#sel_year").val();
		sel_month = $("#sel_month").val();
		
		eventBrandList("search");
  });
}

/*===============================================================
팝업 Open
===============================================================*/
//오늘 날짜 셋팅
var today = new Date();//오늘 날짜//내 컴퓨터 로컬을 기준으로 today에 Date 객체를 넣어줌
var date = new Date();//today의 Date를 세어주는 역할

var now_year = today.getFullYear();
var now_month = today.getMonth()+1;
if(now_month.toString().length == 1) {
	now_month = '0'+now_month;
}
var now_date = today.getDate();

var sel_year = "";
var sel_month = "";
var sel_date = "";

function layerPopOpen(popupN){
	
	var $layer = $("#"+ popupN);
	
	//행사 캘린더
	if(popupN == "layer_mdcalendar"){
		calendarDesign(now_year,now_month);
		eventBrandList();
	}
	
	$layer.css("position", "absolute");
	$layer.css("top",(($(window).height() - $layer.outerHeight()) / 2) + $(window).scrollTop());
  $layer.css("left",(($(window).width() - $layer.outerWidth()) / 2) + $(window).scrollLeft());
  $layer.draggable();
  $layer.show();
}


/*===============================================================
년월 
===============================================================*/
function selectBox(iYear, iMonth){
	 var selectYearHtml = "";
	 var selectMonthHtml = "";
	 var selectedValue = "";
	 var yearCnt = 0;
	 var monthCnt = 0;
	 var i = 0;
	 var yearSelect = "";
	 var monthSelect = "";
	 
	 
	 //년도
	 for(i=(parseInt(iYear)-10);i<(parseInt(iYear)+10);i++){
		 if(parseInt(iYear) == i){yearSelect = "selected";}else{yearSelect = "";}
		 selectYearHtml += "<option value='"+i+"' "+yearSelect+">"+i+"년</option>";
		 yearCnt++;
	 }
	 
	 $("#sel_year").html(selectYearHtml);
	 
	 
	 //월
	 for(var j=1;j<13;j++){
		 if(iMonth == j){monthSelect = "selected";}else{monthSelect = "";}
		 
		 if(j < 10){selectMonthHtml += "<option value='0"+j+"' "+monthSelect+">"+j+"월</option>";}
		 else{selectMonthHtml += "<option value='"+j+"' "+monthSelect+">"+j+"월</option>";}
		  
		 monthCnt++;
	 }
	 $("#sel_month").html(selectMonthHtml);
	  
	 
}


/*===============================================================
년월 변경 시
===============================================================*/
function selectChange(){
   sel_year = $("#sel_year").val();
   sel_month = $("#sel_month").val();
   
 	 //달력 그리기
   calendarDesign(sel_year,sel_month);
}


/*===============================================================
달력 데이터 세팅
===============================================================*/
function fBuildCal(iYear, iMonth) 
{ 
 var aMonth=new Array(); 
   
   for(i=1;i<7;i++) 
   aMonth[i]=new Array(i); 

   var dCalDate=new Date(iYear, iMonth-1, 1); 
   var iDayOfFirst=dCalDate.getDay(); 
   var iDaysInMonth=new Date(iYear, iMonth, 0).getDate(); 
   var iOffsetLast=new Date(iYear, iMonth-1, 0).getDate()-iDayOfFirst+1; 
   var iDate = 1; 
   var iNext = 1; 

   for (d = 0; d < 7; d++) 
   aMonth[1][d] = (d<iDayOfFirst)?-(iOffsetLast+d):iDate++; 
   for (w = 2; w < 6; w++) 
   for (d = 0; d < 7; d++) 
   aMonth[w][d] = (iDate<=iDaysInMonth)?iDate++:-(iNext++); 
   
   return aMonth;
}

/**========================================================================================
* 달력 그리기
========================================================================================*/
function calendarDesign(iYear, iMonth){
	
	 //캘린더 데이터 조회-------------------------
	  var calTm = new oza_TMHandler('com.obzen.bmpanly.ColManageCond', 'selectCalendarMdCnt', '0', '\@#%');
	  calTm.setAddDataField('BASE_YM', iYear+""+iMonth);
	  calTm.execute(null, false);
	  var calTmResult = calTm.getResult();
	  if(calTmResult != ""){calTm_json = JSON.parse(calTmResult);}
	  calTm.clear();
	  //캘린더 데이터 조회-------------------------
	  
	
  	myMonth = fBuildCal(iYear, iMonth); 

    selectBox(iYear, iMonth);//년월 select 생성
    
    var calHtml = "";
    
    var i = 0; 
    
    var baseDate = "";
    var md_cnt = "";
    var classType = "";
    var calDate = "";
    var calDay = "";
        
    for (w = 0; w < 5; w++)
    {
 	   calHtml += "<tr>";     
        for (d = 0; d < 7; d++)
        {
             
     	    //이전 월 일자
           if (myMonth[w+1][d]<0){ 
               	innerText = -myMonth[w+1][d]; 
               
               	calHtml += "<td>";
               	calHtml += "<span class='off'>"+innerText+"</span>";
               	calHtml += "</td>";
           
           //해당 월 일자    
           }else{  
           		innerText = myMonth[w+1][d];
           	
           		calHtml += "<td>";
           		calHtml += "<span>"+innerText+"</span>";
           	
           		if(d == 0){classType = "type3";}//일요일
           		else if(d == 6){classType = "type2";}//토요일
           		else{classType = "type1";}
       				
           		for(var j=0; j<calTm_json.length; j++) {
           			baseDate 	= calTm_json[j].BASE_DT;
           			md_cnt 		= calTm_json[j].MD_CNT;
           			
           			calDay = "";
           			calDate = "";
           			
           			if(parseInt(innerText) < 10){calDay = "0"+innerText;}else{calDay = innerText;}
           			calDate = iYear+""+iMonth+""+calDay;
           		
           			//날짜가 같으면 MD 값 셋팅
           			if(baseDate == calDate){
           				calHtml += "<p class='"+classType+"' style='cursor:pointer' onclick=\"javascript:selectMdCnt('"+baseDate+"');\">"+md_cnt+"MD</p>";
           			}
           		}
         		
         	calHtml += "</td>";
         	
          }
        }
        calHtml += "</tr>";
    }
    
    $("#calendar").html(calHtml);
}

/**========================================================================================
*MD선택 시 행사 브랜드 목록 조회
========================================================================================*/
function selectMdCnt(val) {
	sel_date = val;
	
	//if(parseInt(sel_date) < 10){sel_date = "0"+sel_date;}
	
	eventBrandList();
}



/*===============================================================
행사 브랜드 목록 조회
===============================================================*/
function eventBrandList(){
	var strHtml = "";
	var ingHtml = "";
	var endHtml = "";
	
	
	//TM 시작--------------------------------------------------------------------------------------------
	var listTm = new oza_TMHandler('com.obzen.bmpanly.ColManageCond', 'selectEvtMdInfo', '0', '\@#%');
  listTm.setAddDataField('BASE_DT', sel_date);
  listTm.execute(null, false);
	var listTmResult = listTm.getResult();
	var listTmResult_json = "";
  if(listTmResult != ""){listTmResult_json = JSON.parse(listTmResult);}
  listTm.clear();
	//TM 종료--------------------------------------------------------------------------------------------
  
	var stat_cd = "";//1:시작, 2:진행중, 3:종료
	var md_nm = "";//MD명
	var camp_str_dt = "";//행사시작일자
	var camp_str_month = "";//행사시작월
	var camp_str_day = "";//행사시작일
	var camp_end_dt = "";//행사종료일자
	var camp_end_month = "";//행사종료월
	var camp_end_day = "";//행사종료일
	var camp_period = "";
	
	for(var i=0; i<listTmResult_json.length; i++) {
		stat_cd = listTmResult_json[i].STAT_CD;
		md_nm = listTmResult_json[i].MD_NM;
		if(md_nm.length > 7){md_nm = md_nm.substring(0,4)+"..."}
		camp_str_dt = listTmResult_json[i].CAMP_STR_DT.replace(".","");
		camp_end_dt = listTmResult_json[i].CAMP_END_DT.replace(".","");
		
		camp_str_month = camp_str_dt.substring(0,2);//월
		camp_str_day = camp_str_dt.substring(2,4);//일
		
		camp_end_month = camp_end_dt.substring(0,2);//월
		camp_end_day = camp_end_dt.substring(2,4);//일
		
	
		if(parseInt(camp_str_month) < 10){camp_str_month = camp_str_month.replace("0", "");}
		if(parseInt(camp_str_day) < 10){camp_str_day = camp_str_day.replace("0", "");}
		
		if(parseInt(camp_end_month) < 10){camp_end_month = camp_end_month.replace("0", "");}
		if(parseInt(camp_end_day) < 10){camp_end_day = camp_end_day.replace("0", "");}
		
		camp_period = camp_str_month+"."+camp_str_day+" ~ "+camp_end_month+"."+camp_end_day;
		
		if(stat_cd == "1"){strHtml += "<p>"+md_nm+" ("+camp_period+")</p>";}//시작
		if(stat_cd == "2"){ingHtml += "<p>"+md_nm+" ("+camp_period+")</p>";}//진행중
		if(stat_cd == "3"){endHtml += "<p>"+md_nm+" ("+camp_period+")</p>";}//종료
	}
    
	$("#str_list").html(strHtml);//시작 
	$("#ing_list").html(ingHtml);//진행중
	$("#end_list").html(endHtml);//종료
}

/*===============================================================
팝업 Close
===============================================================*/
function popupClose(popupN) {
	var $layer = $("#"+ popupN);
  $layer.hide();
}

//행사 캘린더 Layer 팝업 관련 종료---------------------------------------------------------------------------------------------------------------------------------------



</script>
</head>
<body>
	<div id="web_wrap">
		<div class="web_container">
			<div class="top_fixed">
          <div class="top_search search2">
            <form>
              <dl>
               <!--  <dt>행사기간</dt>
                <dd><input type="text" id="camp_str_dt"/> ~ <input type="text" id="camp_end_dt"/></dd>  -->
                <dt>캠페인상태</dt>
                <dd id ="select_camp_design"></dd>
              </dl>
              <div class="radio_box">
                <label for="camp_radio1"><input type="radio" id="camp_radio1" name="camp_check" value="1"/>임직원행사 포함</label>
                <label for="camp_radio2"><input type="radio" id="camp_radio2" name="camp_check" value="2"/>임직원행사 미포함</label>
              </div>
              <dl class="search_sel">
                <dt>브랜드 컨텐츠</dt>
                <dd><select id="sel_bran_offer_dstic_cd"></select></dd>
                <dt>신세계 혜택</dt>
                <dd><select id="sel_offer_brch"></select></dd>
                <dt>혜택공개범위</dt>
                <dd><select id="sel_offer_cust"></select></dd>
              </dl>
              <div class="btn_box">
                <a href="javascript:layerPopOpen('layer_mdcalendar');">행사계획캘린더</a>
              </div>
            </form>
          </div>
          <div class="inquiry_wrap top90">
            <div class="radio_box">
              <label for="radio1"><input type="radio" id="radio1" name="group_check" value="1"/>점포</label>
              <label for="radio2"><input type="radio" id="radio2" name="group_check" value="2"/>본부</label>
            </div>
            <div class="select_wrap" id="select_design"></div>
            <a href="javascript:searchChart();" class="btn_inquiry">조회하기</a>
          </div>
        </div>
        <div id="tab_content"></div>
        <!-- 워터마크 영역 -->
        <div id="back_mark"></div>
        <!-- 워터마크 영역 -->
		</div>
    
    
    
    <!-- 행사 캘린더 레이어 팝업 시작 -->
    <div id="layer_mdcalendar" class="layer">
    <p class="tit">행사진행 MD 캘린더<a href="javascript:popupClose('layer_mdcalendar');" class="btn_close">닫기</a></p>
    <div class="mdcal_cnt">
      <div class="sel_box">
        <select id="sel_year" class="year" ></select>
        <select id="sel_month" class="month"></select>
      </div>
      <table class="mdcalTb">
        <col width="14.285%">
        <col width="14.285%">
        <col width="14.285%">
        <col width="14.285%">
        <col width="14.285%">
        <col width="14.285%">
        <col width="14.285%">
        <thead>
          <tr>
            <th class="fc_red">일</th>
            <th>월</th>
            <th>화</th>
            <th>수</th>
            <th>목</th>
            <th>금</th>
            <th class="fc_blue">토</th>
          </tr>
        </thead>
        <tbody id="calendar"></tbody>
      </table>
      <p class="tip_txt">* 조회 순서는 전년도 매출 상위 순서 입니다.</p>
      <table class="mdlistTb">
        <col width="33.333%" />
        <col width="33.333%" />
        <col width="33.333%" />
        <thead>
          <tr>
            <th>시작</th>
            <th>진행중</th>
            <th>종료</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div id="str_list">
              </div>
            </td>
            <td>
              <div id="ing_list">
              </div>
            </td>
            <td>
              <div id="end_list">
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pop_btn">
      <a href="javascript:popupClose('layer_mdcalendar');" class="btn_cancel">닫기</a>
    </div>
  </div>
  <!-- 행사 캘린더 레이어 팝업 종료 -->
  
  
  
	</div>
</body>
</html>

