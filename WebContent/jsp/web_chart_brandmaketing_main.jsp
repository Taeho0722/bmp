<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<!DOCTYPE html>
<html>
<head>
<title>FIT 경쟁현황</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->

<script type="text/javascript">
var division_amt = 1000000;//백만원


var flag = "1";//탭 구분

var user_id = "";//로그인 아이디
var sys_div = "";//로그인 유저 권한
var sis_div_flag = "";//로그인 유저 세부권한

var md_cd = "";//MD코드
var store_cd = "";//점포코드
var team_cd = "";//팀코드
var floor_cd = "";//층코드
var pc_cd = "";//PC코드
var crnr_cd = "";//코너코드
var yyyy_div = "";
var year_cd = "";
var div_cd = "";

//화면 로드 시 실행
$(document).ready(function() {
	do_RefreshPage("onload");//함수명 고정
});

function do_RefreshPage(gubun) {
	/**===================================================
	세션 반환값
	webUserId : 유저 아이디
	webUserName : 유저 명
	webGroupName : 그룹명
	webGroupDescription : 그룹 설명
	webSysDiv : 권한
	wevMdCd : MD 코드
	webStoreCd: 점포코드
	======================================================*/
	web_Init(window);//세션정보
	
	
	//초기 화면 Load 시 적용 Start------------------------------------------
	if(gubun == "onload"){
		
		//Session 값 설정
		md_cd = wevMdCd;//MD코드
		store_cd = webStoreCd;//점포코드
		user_id = webUserId;//로그인 아이디
		sys_div = webSysDiv;//로그인 권한
		sis_div_flag = webSysDivFlag;//로그인 세부 권한
		
		//Select Box
		selectStoreCd();//점포
		initStoreCd();//접속권한에 따른 점포코드 초기설정
		
		selectTeamCd();//팀
		selectFloorCd();//층
		selectPcCd();//PC
		selectCrnrCd();//코너
		selectMdCd();//MD
		selectBaseYearCd();//기준년도 조회
		
		initBaseYearCd();//기준년도 초기설정
		setSelectBoxStatus();//권한 체크

		search("onload"); //최초 조회
	}
	//초기 화면 Load 시 적용 End--------------------------------------------
	
	selectChange();//Select Box 변경 이벤트 설정
	pageMove(flag);//페이지 이동
}


/**========================================================================================
* 셀렉트 박스 변경 이벤트
========================================================================================*/
function selectChange(){
	$("#sel_store_cd").val(store_cd).attr("selected","selected");
	$("#sel_team_cd").val(team_cd).attr("selected","selected");
	$("#sel_floor_cd").val(floor_cd).attr("selected","selected");
	$("#sel_pc_cd").val(pc_cd).attr("selected","selected");
	$("#sel_crnr_cd").val(crnr_cd).attr("selected","selected");
	$("#sel_md_cd").val(md_cd).attr("selected","selected");
	$("#sel_year").val(year_cd).attr("selected","selected");
	$("#sel_div").val(div_cd).attr("selected","selected");
	
	
	//점포 변경
	$("#sel_store_cd").change(function(){
		store_cd = $("#sel_store_cd option:selected").val();
		
		
		//백화점사용자일 경우만 점포코드 변경시 하위 팀코드 변경.
		if(sys_div == "2"){
			team_cd = "";
			floor_cd = "";
			pc_cd = "";
			crnr_cd = "";
			md_cd = "";
			
			selectTeamCd();
			$("#sel_floor_cd").html("<option value=''>::층::</option>");
			$("#sel_pc_cd").html("<option value=''>::PC::</option>");
			$("#sel_crnr_cd").html("<option value=''>::코너::</option>");
			$("#sel_md_cd").html("<option value=''>::MD::</option>");
		}
	});
	
	//팀 변경
	$("#sel_team_cd").change(function(){
		team_cd = $("#sel_team_cd option:selected").val();
		floor_cd = "";
		pc_cd = "";
		crnr_cd = "";
		md_cd = "";
		
		selectFloorCd();
		$("#sel_pc_cd").html("<option value=''>::PC::</option>");
		$("#sel_crnr_cd").html("<option value=''>::코너::</option>");
		$("#sel_md_cd").html("<option value=''>::MD::</option>");
	});
	
	//층 변경
	$("#sel_floor_cd").change(function(){
		floor_cd = $("#sel_floor_cd option:selected").val();
		pc_cd = "";
		crnr_cd = "";
		md_cd = "";
		
		selectPcCd();
		$("#sel_crnr_cd").html("<option value=''>::코너::</option>");
		$("#sel_md_cd").html("<option value=''>::MD::</option>");
	});
	
	//pc 변경
	$("#sel_pc_cd").change(function(){
		pc_cd = $("#sel_pc_cd option:selected").val();
		crnr_cd = "";
		md_cd = "";
		
		selectCrnrCd();
		$("#sel_md_cd").html("<option value=''>::MD::</option>");
	});
	
	//코너 변경
	$("#sel_crnr_cd").change(function(){
		crnr_cd = $("#sel_crnr_cd option:selected").val();
		md_cd = "";
		
		selectMdCd();
	});
	
	
	//MD 변경
	$("#sel_md_cd").change(function(){
		md_cd = $("#sel_md_cd option:selected").val();
	});
	
	
	$("#sel_year").change(function(){
		year_cd = $("#sel_year option:selected").val();
	});
	
	$("#sel_div").change(function(){
		div_cd = $("#sel_div option:selected").val();
	});
}


/**========================================================================================
* 점포 코드 selectbox 조회(기존)
========================================================================================*/
function selectStoreCd(){
	var innerHtml = "";
	var i = 0;
	
	//점포
	var storeTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectStoreCd', '0', '\@#%');
	if(sys_div == "1"){storeTm.setAddDataField('MD_CD', md_cd);}
	storeTm.setAddDataField('USERID', user_id);
	storeTm.execute(null, false);
	var storeTmResult = storeTm.getResult();
	var storeTmResult_json = "";
	if(storeTmResult != ""){storeTmResult_json = JSON.parse(storeTmResult);}
	storeTm.clear();
	
	innerHtml += "<option value=''>::전체::</option>";
	
	for(i=0; i<storeTmResult_json.length; i++) {
		innerHtml += "<option value='"+storeTmResult_json[i].ITEM_CD+"'>"+storeTmResult_json[i].ITEM_NM+"</option>";
	}
	
	$("#sel_store_cd").html(innerHtml);
}	

/**========================================================================================
* 팀 코드 selectbox 조회
========================================================================================*/
function selectTeamCd(){
	var innerHtml = "";
	var teamTmResult_json = "";
	
	if(store_cd != ""){
		var teamTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectTeamCd', '0', '\@#%');
		teamTm.setAddDataField('STORE_CD', store_cd);
		teamTm.setAddDataField('MD_CD', md_cd);
		teamTm.execute(null, false);
		var teamTmResult = teamTm.getResult();
		if(teamTmResult != ""){teamTmResult_json = JSON.parse(teamTmResult);}
		teamTm.clear();	
	}
	
	innerHtml += "<option value=''>::팀::</option>";
	for(var i=0; i<teamTmResult_json.length; i++) {
		innerHtml += "<option value='"+teamTmResult_json[i].ITEM_CD+"'>"+teamTmResult_json[i].ITEM_NM+"</option>";
	}
	$("#sel_team_cd").html(innerHtml);
}


/**========================================================================================
* 층 코드 selectbox 조회
========================================================================================*/
function selectFloorCd(){
	var innerHtml = "";
	var floorTmResult_json = "";
	
	if(store_cd != "" && team_cd != ""){
		var floorTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectFloorCd', '0', '\@#%');
		floorTm.setAddDataField('STORE_CD', store_cd);
		floorTm.setAddDataField('MD_CD', md_cd);
		floorTm.setAddDataField('TEAM_CD', team_cd);
		floorTm.execute(null, false);
		var floorTmResult = floorTm.getResult();
		if(floorTmResult != ""){floorTmResult_json = JSON.parse(floorTmResult);}
		floorTm.clear();	
	}
	
	innerHtml += "<option value=''>::층::</option>";
	for(var i=0; i<floorTmResult_json.length; i++) {
		innerHtml += "<option value='"+floorTmResult_json[i].ITEM_CD+"'>"+floorTmResult_json[i].ITEM_NM+"</option>";
	}
	$("#sel_floor_cd").html(innerHtml);
}


/**========================================================================================
* PC 코드 selectbox 조회
========================================================================================*/
function selectPcCd(){
	var innerHtml = "";
	var pcTmResult_json = "";
	
	if(store_cd != "" && floor_cd != ""){
		var pcTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectPcCd', '0', '\@#%');
		pcTm.setAddDataField('STORE_CD', store_cd);
		pcTm.setAddDataField('MD_CD', md_cd);
		pcTm.setAddDataField('FLOOR_CD', floor_cd);
		pcTm.execute(null, false);
		var pcTmResult = pcTm.getResult();
		if(pcTmResult != ""){pcTmResult_json = JSON.parse(pcTmResult);}
		pcTm.clear();	
	}
	
	innerHtml += "<option value=''>::PC::</option>";
	for(var i=0; i<pcTmResult_json.length; i++) {
		innerHtml += "<option value='"+pcTmResult_json[i].ITEM_CD+"'>"+pcTmResult_json[i].ITEM_NM+"</option>";
	}
	$("#sel_pc_cd").html(innerHtml);
}

/**========================================================================================
* 코너 코드 selectbox 조회
========================================================================================*/
function selectCrnrCd(){
	var innerHtml = "";
	var crnrTmResult_json = "";
	
	if(store_cd != "" && pc_cd != ""){
		var crnrTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectCrnrCd', '0', '\@#%');
		crnrTm.setAddDataField('STORE_CD', store_cd);
		crnrTm.setAddDataField('MD_CD', md_cd);
		crnrTm.setAddDataField('PC_CD', pc_cd);
		crnrTm.execute(null, false);
		var crnrTmResult = crnrTm.getResult();
		if(crnrTmResult != ""){crnrTmResult_json = JSON.parse(crnrTmResult);}
		crnrTm.clear();	
	}
	
	innerHtml += "<option value=''>::코너::</option>";
	for(var i=0; i<crnrTmResult_json.length; i++) {
		innerHtml += "<option value='"+crnrTmResult_json[i].ITEM_CD+"'>"+crnrTmResult_json[i].ITEM_NM+"</option>";
	}
	$("#sel_crnr_cd").html(innerHtml);
}

/**========================================================================================
* MD코드 selectbox 조회
========================================================================================*/
function selectMdCd(){
	var innerHtml = "";
	var mdTmResult_json = "";
	
	var mdTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectMdCd', '0', '\@#%');
	mdTm.setAddDataField('STORE_CD', store_cd);
	mdTm.setAddDataField('FLOOR_CD', floor_cd);
	mdTm.setAddDataField('PC_CD', pc_cd);
	mdTm.setAddDataField('CRNR_CD', crnr_cd);
	mdTm.setAddDataField('MD_CD', md_cd);
	mdTm.execute(null, false);
	var mdTmResult = mdTm.getResult();
	if(mdTmResult != ""){mdTmResult_json = JSON.parse(mdTmResult);}
	mdTm.clear();
	
	innerHtml += "<option value=''>::MD::</option>";
	for(var i=0; i<mdTmResult_json.length; i++) {
		innerHtml += "<option value='"+mdTmResult_json[i].ITEM_CD+"'>"+mdTmResult_json[i].ITEM_NM+"</option>";
	}
	$("#sel_md_cd").html(innerHtml);
}


/**========================================================================================
* 년도  selectbox 조회
* TM을 호출하여 년도 조회
========================================================================================*/
function selectBaseYearCd(){
	var innerHtml = "";
	
	var baseYearTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectBaseYear', '0', '\@#%');
	baseYearTm.execute(null, false);
	var baseYearTmResult = baseYearTm.getResult();
	var baseYearTmResult_json = "";
	if(baseYearTmResult != ""){baseYearTmResult_json = JSON.parse(baseYearTmResult);}
	baseYearTm.clear();
	
	innerHtml += "<option value=''>::년::</option>";
	for(var i=0; i<baseYearTmResult_json.length; i++) {
		innerHtml += "<option value='"+baseYearTmResult_json[i].ITEM_CD+"'>"+baseYearTmResult_json[i].ITEM_NM+"</option>";
	}
	$("#sel_year").html(innerHtml);
}

/**========================================================================================
* Default 조직 정보 조회
* TM을 호출하여 Default 조직 정보 조회
========================================================================================*/
function selectDefaultOrgInfo(){
	var orgTm = new oza_TMHandler('com.obzen.bmpanly.DocCommMngDW', 'selectDefaultOrgInfo', '1', '\@#%');
	orgTm.setAddDataField('STORE_CD', store_cd);
	orgTm.returnlist('TEAM_CD;FLOOR_CD;PC_CD;CRNR_CD;MD_CD');
	orgTm.execute(null, false);
	team_cd = orgTm.ElementValue('TEAM_CD');
	floor_cd = orgTm.ElementValue('FLOOR_CD');
	pc_cd = orgTm.ElementValue('PC_CD');
	crnr_cd = orgTm.ElementValue('CRNR_CD');
	md_cd = orgTm.ElementValue('MD_CD');
	orgTm.clear();
}

/**========================================================================================
* 점포코드 초기세팅
========================================================================================*/
function initStoreCd(){
	if(sis_div_flag == "1.1"){ //브랜드-매장사용자 : 세션정보 점포코드
			
	}else if(sis_div_flag == "1.2"){ //브랜드-본사사용자 : 세션정보md에 해당하는 첫번째 점포코드
		$("#sel_store_cd option:eq(1)").attr("selected","selected");
		store_cd = $("#sel_store_cd option:selected").val(); 
		
	}else if(sis_div_flag == "2.1"){ //백화점-점포시용자 : 세션정보 점포코드
		
	}else if(sis_div_flag == "2.2"){ //백화점-본사시용자 :본점
		store_cd = "01";
	}
}


/**========================================================================================
* 기준년도-분기 초기세팅
========================================================================================*/
function initBaseYearCd(){
	var curr_date = new Date();
	var curr_month = curr_date.getMonth() + 1;
	var base_yyyy = curr_date.getFullYear();
	var base_yyyy_div = "1";
	
	//현재일자 기준 이전분기로 초기 설정
	if(curr_month >= 1 && curr_month <= 3){
		//현재일자 분기가 1분기라면 전년 4분기 세팅
		//base_yyyy = curr_date.getFullYear() - 1; 
		base_yyyy_div = "1";
	} else if(curr_month >= 4 && curr_month <= 6){
		base_yyyy_div = "2";
	} else if(curr_month >= 7 && curr_month <= 9){
		base_yyyy_div = "3";
	} else if(curr_month >= 10 && curr_month <= 12){
		base_yyyy_div = "4";
	}
	
	year_cd = base_yyyy;
	div_cd = base_yyyy_div;
	
	yyyy_div = year_cd+""+div_cd;
}

/**========================================================================================
* select box 상태 변경
* 권한에 따라 select box 상태 변경
========================================================================================*/
function setSelectBoxStatus(){
	if(webSysDivFlag == "1.1"){
		$("#sel_store_cd").attr("disabled",true);
		$("#sel_store_cd").addClass("disabled");
		$("#sel_team_cd").attr("disabled",true);
		$("#sel_team_cd").addClass("disabled");
		$("#sel_floor_cd").attr("disabled",true);
		$("#sel_floor_cd").addClass("disabled");
		$("#sel_pc_cd").attr("disabled",true);
		$("#sel_pc_cd").addClass("disabled");
		$("#sel_crnr_cd").attr("disabled",true);
		$("#sel_crnr_cd").addClass("disabled");
		$("#sel_md_cd").attr("disabled",true);
		$("#sel_md_cd").addClass("disabled");
		$(".btn_md").css("display","none");
		
	//브랜드-본사 사용자는 점포만 선택가능  ACTIVE	
	}else if(webSysDivFlag == "1.2"){
		
		$("#sel_team_cd").attr("disabled",true);
		$("#sel_team_cd").addClass("disabled");
		$("#sel_floor_cd").attr("disabled",true);
		$("#sel_floor_cd").addClass("disabled");
		$("#sel_pc_cd").attr("disabled",true);
		$("#sel_pc_cd").addClass("disabled");
		$("#sel_crnr_cd").attr("disabled",true);
		$("#sel_crnr_cd").addClass("disabled");
		$("#sel_md_cd").attr("disabled",true);
		$("#sel_md_cd").addClass("disabled");
		$(".btn_md").css("display","none");
		
	}else if(webSysDivFlag == "2.1"){
		//백화점사용자는 모든 조직정보 선택 가능 
	}else if(webSysDivFlag == "2.2"){
		//백화점사용자는 모든 조직정보 선택 가능
	}
}


/**========================================================================================
* data 조회
* 조회조건 : 점포(필수), 층, 팀, PC, 코너, MD(필수), 년분기(필수, yyyy+분기)
========================================================================================*/
function search(search_flag){
	var actionUrl = "";
	var srh_store_cd = $("#sel_store_cd").val();
	var srh_floor_cd = $("#sel_floor_cd").val();
	var srh_team_cd = $("#sel_team_cd").val();
	var srh_pc_cd = $("#sel_pc_cd").val();
	var srh_crnr_cd = $("#sel_crnr_cd").val();
	var srh_md_cd = $("#sel_md_cd").val();
	var srh_year = $("#sel_year").val();
	var srh_div = $("#sel_div").val();
	
	//최초 로딩 시 제외
	if(search_flag != "onload"){
		if(!srh_store_cd){	
			cmdMessage(3,"점포");
			$("#sel_store_cd").focus();
			return;
		}
		
		//운영정보 사용자 일때만 체크
		if(sys_div == "2"){
			if(!srh_md_cd){	
				cmdMessage(3,"MD");
				$("#sel_md_cd").focus();
				return;
			}	
		}
		
		
		if(!srh_year){
			cmdMessage(3,"년");
			$("#sel_year").focus();
			return;
		}
		
		
		if(!srh_div){
			cmdMessage(3,"분기");
			$("#sel_div").focus();
			return;
		}
		
		yyyy_div = srh_year+""+srh_div;
		
		do_RefreshPage("search");
	}
}
	
	
/**=====================================================================================
* 화면이동
========================================================================================*/
function pageMove(flag){
  
	var actionUrl = "";
	  
	if(flag == "1"){actionUrl = "web_chart_brandmaketing_sub01.jsp";}//매출현황
	else if(flag == "2"){actionUrl = "web_chart_brandmaketing_sub02.jsp";}//고객현황Ⅰ(VIP/신규)
	else if(flag == "3"){actionUrl = "web_chart_brandmaketing_sub03.jsp";}//고객현황Ⅱ(성별/연령/지역)
	
	var param = "";
 	$.ajax({
	 	url:actionUrl,
		data:param,
		type:"POST",
		beforeSend : function(){
			spinStart();
		},
	 	success : function(result){
			$("#tab_content").html(result);//id가 tab_content에 내용을 보여줌
			waterMarkText("web_wrap");//워터마크
		},
		complete : function(){
			spinStop();
		},
		error : function(request, status, error){
			cmdMessage(0,"code : "+request.status+"\n"+"message : "+request.responseText+"\n"+"error:"+error);
		}
 	});
}


	
/*===============================================================
MD 검색
===============================================================*/
function popupMd(){
	var name = "web_brandprofile_pop";
  var option = "location=no,menubar=no,resizable=no,scrollbars=no,titlebar=no,toolbar=no";
  
  //해상도 계산하여 위치 조절
  var popupX = (document.body.offsetWidth / 2) - (200 / 2);
  var popupY = (document.body.offsetHeight / 2) - (300 / 2);
  	 
  option += ",top="+popupY+",left="+popupX+",height=550,width=825";
  
  var frm = $("form#frmSearch")[0];
  frm.store_cd.value = "";
  frm.md_cd.value = md_cd;
  frm.user_id.value = user_id;
  
  var ret = window.open("web_brandprofile_pop.jsp", name, option);
  
  $("#mask").css("display","");//팝업 호출 시 보이게 설정
  
  $('#mask').click(function() {
  		ret.focus();
  });
}


/*===============================================================
MD 검색 리턴
===============================================================*/
function popupReturn(pageParam){
	md_cd = pageParam[0].value;
	store_cd = pageParam[1].value;
	store_nm = pageParam[2].value;
	md_nm = pageParam[3].value;
	team_cd = pageParam[4].value;
	floor_cd = pageParam[5].value;
	pc_cd = pageParam[6].value;
	crnr_cd = pageParam[7].value;
	
	selectStoreCd();
	$("#sel_store_cd").val(store_cd).attr("selected","selected");
	
	selectTeamCd();
	$("#sel_team_cd").val(team_cd).attr("selected","selected");
	
	selectFloorCd();
	$("#sel_floor_cd").val(floor_cd).attr("selected","selected");
	
	selectPcCd();
	$("#sel_pc_cd").val(pc_cd).attr("selected","selected");
	
	selectCrnrCd();
	$("#sel_crnr_cd").val(crnr_cd).attr("selected","selected");
	
	selectMdCd();
	$("#sel_md_cd").val(md_cd).attr("selected","selected");
	
	
	do_RefreshPage("search");
}
	
</script>


</head>

<body>
<form id="frmSearch" method="post" >
<input type="hidden" id="store_cd" name="store_cd"/>
<input type="hidden" id="md_cd" name="md_cd"/>
<input type="hidden" id="user_id" name="user_id"/>
</form>
  <div id="web_wrap">
		<div class="web_container">
			<div class="inquiry_wrap top0">
				<div class="select_wrap">
          <select id="sel_store_cd"></select>
          <select id="sel_team_cd"></select>
          <select id="sel_floor_cd"></select>
          <select id="sel_pc_cd"></select>
          <select id="sel_crnr_cd"></select>
          <select id="sel_md_cd"></select>
          <select id="sel_year"></select>
          <select id="sel_div">
            <option value="">::분기::</option>
            <option value="1">1분기</option>
            <option value="2">2분기</option>
            <option value="3">3분기</option>
            <option value="4">4분기</option>
          </select>
        </div>
        <a href="javascript:popupMd();" class="btn_md">MD검색</a>
				<a href="javascript:search();" class="btn_inquiry">조회하기</a>
			</div>
      
      <!-- 컨텐츠 영역 -->
      <div id="tab_content"></div>
      <!-- 컨텐츠 영역 -->
      
			<!-- 워터마크 영역 -->
			<div id="back_mark"></div>
			<!-- 워터마크 영역 -->
	   </div>
	</div>
</body>
</html>

