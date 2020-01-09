<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title> 내 브랜드 알기 </title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->

<script type="text/javascript">

var division_amt = 1000000;//백만원
var division_ppc = 10000;//만원

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
var sel_year = "";
var sel_month = "";
var yyyymm = "";//기준년월


//화면 로드 시 실행
$(document).ready(function() {
	do_RefreshPage("onload");//함수명 고정
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
		selectBaseYear();//기준년도 조회
		initBaseYearMonthCd();//기준년월 초기설정
		selectBaseMonth();//기준월 조회
		
		setSelectBoxStatus();//권한 체크

		
		
		search("onload"); //최초 조회
	}
	//초기 화면 Load 시 적용 End--------------------------------------------
	
	selectChange();//Select Box 변경 이벤트 설정
	tabMove();//Tab 이동
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
	$("#sel_year").val(sel_year).attr("selected","selected");
	$("#sel_month").val(sel_month).attr("selected","selected");
	
	//탭 변경
	$("ul.tab_style01 li").click(function() {
		$("ul.tab_style01 li").removeClass("on"); //Remove any "active" class
		$(this).addClass("on"); //Add "active" class to selected tab
		
		var tab = $("ul.tab_style01 li").index(this);//선택된 Tab index
		flag = tab + 1;//Page url구분
	});
	
	
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
	
	
	//년도 변경
	$("#sel_year").change(function(){
		sel_year = $("#sel_year option:selected").val();
		
		selectBaseMonth();
	});
	
	//월 변경
	$("#sel_month").change(function(){
		sel_month = $("#sel_month option:selected").val();
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
function selectBaseYear(){
	var innerHtml = "";
	
	var baseYearTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectBaseYear', '0', '\@#%');
	baseYearTm.execute(null, false);
	var baseYearTmResult = baseYearTm.getResult();
	var baseYearTmResult_json = "";
	if(baseYearTmResult != ""){baseYearTmResult_json = JSON.parse(baseYearTmResult);}
	baseYearTm.clear();
	
	innerHtml += "<option value=''>::년도::</option>";
	for(var i=0; i<baseYearTmResult_json.length; i++) {
		var item_cd = baseYearTmResult_json[i].ITEM_CD;
		
		//2018년 부터 조회
		if(parseInt(item_cd) > 2017){
			innerHtml += "<option value='"+baseYearTmResult_json[i].ITEM_CD+"'>"+baseYearTmResult_json[i].ITEM_NM+"년</option>";	
		}
	}
	
	$("#sel_year").html(innerHtml);
}


/**========================================================================================
* 월  selectbox 조회
* TM을 호출하여 월 조회
========================================================================================*/
function selectBaseMonth(){
	var innerHtml = "";
	
	var baseMMTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectBaseMM', '0', '\@#%');
	baseMMTm.setAddDataField('YEAR', sel_year);
	baseMMTm.execute(null, false);
	var baseMMTmResult = baseMMTm.getResult();
	var baseMMTmResult_json = "";
	if(baseMMTmResult != ""){baseMMTmResult_json = JSON.parse(baseMMTmResult);}
	baseMMTm.clear();
	
	innerHtml += "<option value=''>::전체::</option>";
	for(var i=0; i<baseMMTmResult_json.length; i++) {
		innerHtml += "<option value='"+baseMMTmResult_json[i].ITEM_CD+"'>"+baseMMTmResult_json[i].ITEM_NM+"월</option>";
	}
	$("#sel_month").html(innerHtml);
	
	$("#sel_month option:eq(1)").attr("selected","selected");
	sel_month = $("#sel_month option:selected").val();
}


/**========================================================================================
* 년월  selectbox 조회
* TM을 호출하여 년월 조회
========================================================================================*/
function selectBaseYearMonthCd(){
	var innerHtml = "";
	
	var baseYmTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectBaseYm', '0', '\@#%');
	baseYmTm.execute(null, false);
	var baseYmTmResult = baseYmTm.getResult();
	var baseYmTmResult_json = "";
	if(baseYmTmResult != ""){baseYmTmResult_json = JSON.parse(baseYmTmResult);}
	baseYmTm.clear();
	
	innerHtml += "<option value=''>::년월::</option>";
	for(var i=0; i<baseYmTmResult_json.length; i++) {
		innerHtml += "<option value='"+baseYmTmResult_json[i].ITEM_CD+"'>"+baseYmTmResult_json[i].ITEM_NM+"</option>";
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
function initBaseYearMonthCd(){
	var curr_date = new Date();
	var curr_month = curr_date.getMonth();
	var curr_yyyy = curr_date.getFullYear();
	if(curr_month < 10){curr_month = "0"+curr_month;}
	var base_yyyymm = curr_yyyy + "" + curr_month; 
	
	//sel_year = curr_yyyy;
	
	$("#sel_year option:eq(1)").attr("selected","selected");
	sel_year = $("#sel_year option:selected").val();
	
	
	//sel_month = curr_month;
	
}

/**========================================================================================
* select box 상태 변경
* 권한에 따라 select box 상태 변경
========================================================================================*/
function setSelectBoxStatus(){
	if(sis_div_flag == "1.1"){
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
		
	} else if(sis_div_flag == "1.2"){
		//브랜드-본사 사용자는 점포만 선택가능  ACTIVE
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
		
	} else if(sis_div_flag == "2.1"){
		//백화점사용자는 모든 조직정보 선택 가능 
	} else if(sis_div_flag == "2.2"){
		//백화점사용자는 모든 조직정보 선택 가능
	}
}

 
 
/**========================================================================================
* data 조회
* 조회조건 : 점포(필수), 층, 팀, PC, 코너, MD(필수), 기준년도(필수, sel_year)
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
	var srh_month = $("#sel_month").val();
	
	
	
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
			cmdMessage(3,"년도");
			$("#sel_year").focus();
			return;
		}	
	}
	
	
	if(md_cd == ""){
		//md 정보가 없는 운영정보 사용자같은 경우 최초 로딩시 md를 선택하라는 메시지를 display 
		checkData();
	}else {
		selectBrandSale();
	}
	

	if(search_flag != "onload"){
		do_RefreshPage("search");	
	}
}
 
 

 /**========================================================================================
 * 내브랜드 공통 영역조회
 * 조회조건 : 점포(필수), 층, 팀, PC, 코너, MD(필수), 기준년도(필수, sel_year)
 ========================================================================================*/
//상단 출력내용
var grow_rt_cont = "";
var grow_rt_color = "";
var ms_cont = "";
var ms_color = "";
var vip_sale_rate_cont = "";
var vip_sale_rate_color = "";
var new_cust_sale_rate_cont = "";
var new_cust_sale_rate_color = "";
var dd_avg_sale_amt = "";
var md_mm_amt = "";
var pc_mm_amt = "";
var md_mm_ms_rate = "";
var top5_md_mm_ms_rate = "";
var top5_md_mm_amt = "";
var top5_pc_mm_amt = "";
var tot_sale_cust_cnt = "";

//내점 횟수
var visit_sale_1t_cust_cnt = "";
var visit_sale_2t_cust_cnt = "";
var visit_sale_3t_cust_cnt = "";
var visit_sale_4t_cust_cnt = "";
var visit_year_sale_5t_cust_cnt = "";
var visit_sale_1t_ppc = "";
var visit_sale_2t_ppc = "";
var visit_sale_3t_ppc = "";
var visit_sale_4t_ppc = "";
var visit_year_sale_5t_ppc = "";
var top5_tot_sale_cust_cnt = "";
var visit_top5_sale_1t_cust_cnt = "";
var visit_top5_sale_2t_cust_cnt = "";
var visit_top5_sale_3t_cust_cnt = "";
var visit_top5_sale_4t_cust_cnt = "";
var visit_top5_year_sale_5t_cust_cnt = "";
var visit_top5_sale_1t_ppc = "";
var visit_top5_sale_2t_ppc = "";
var visit_top5_sale_3t_ppc = "";
var visit_top5_sale_4t_ppc = "";
var visit_top5_year_sale_5t_ppc = "";

//vip고객 비중
var vip_cust_cnt = "";
var vip_top5_cust_cnt = "";
var vip_sale_amt = "";
var vip_top5_sale_amt = "";
var vip_sale_rate = "";
var vip_top5_sale_rate = "";
var vip_rate = "";
var vip_top5_rate = "";

//신규고객비중
var new_cust_cnt = "";
var new_top5_cust_cnt = "";
var new_sale_amt = "";
var new_top5_sale_amt = "";
var new_sale_rate = "";
var new_top5_sale_rate = "";
var new_cust_rate = "";
var new_top5_cust_rate = "";

 
function selectBrandSale(){
	//상단 내용 조회------------------------- 20191029 stj 추가
	var myBrandSaleTm = new oza_TMHandler('com.obzen.bmpanly.DocGraspMyBrand', 'selectMyBrandSale', '1', '\@#%');
	myBrandSaleTm.setAddDataField('BASE_YEAR', sel_year);
	myBrandSaleTm.setAddDataField('BASE_MON', sel_month);
	myBrandSaleTm.setAddDataField('STORE_CD', store_cd);
	myBrandSaleTm.setAddDataField('MD_CD', md_cd);
	myBrandSaleTm.returnlist('MD_MM_GROW_RATE'+//
            				';MD_PRE_MM_GROW_RATE'+//
            				';MD_MM_MS_RATE'+//
            				';MD_PRE_MM_MS_RATE'+//
            				';VIP_SALE_RATE'+//
            				';NEW_CUST_SALE_RATE'+//
            				';MD_MM_AMT'+//
            				';PC_MM_AMT'+//
            				';DD_AVG_SALE_AMT' +
            				';TOT_SALE_CUST_CNT'+
            				';SALE_1T_CUST_CNT'+
            				';SALE_2T_CUST_CNT'+
            				';SALE_3T_CUST_CNT'+
            				';SALE_4T_CUST_CNT'+
            				';YEAR_SALE_5T_CUST_CNT'+
            				';SALE_1T_CUST_PPC'+
            				';SALE_2T_CUST_PPC'+
            				';SALE_3T_CUST_PPC'+
            				';SALE_4T_CUST_PPC'+
            				';YEAR_SALE_5T_CUST_PPC'+
            				';VIP_CNT'+
            				';VIP_SALE_AMT'+
            				';VIP_RATE'+
            				';NEW_CUST_CNT'+
            				';NEW_CUST_SALE_AMT'+
            				';NEW_CUST_RATE'+
            				';TOP5_MD_MM_AMT' +
            				';TOP5_PC_MM_AMT' +
            				';TOP5_MD_MM_MS_RATE' +
            				';TOP5_TOT_SALE_CUST_CNT'+
            				';TOP5_SALE_1T_CUST_CNT'+
            				';TOP5_SALE_2T_CUST_CNT'+
            				';TOP5_SALE_3T_CUST_CNT'+
            				';TOP5_SALE_4T_CUST_CNT'+
            				';TOP5_YEAR_SALE_5T_CUST_CNT'+
            				';TOP5_SALE_1T_CUST_PPC'+
            				';TOP5_SALE_2T_CUST_PPC'+
            				';TOP5_SALE_3T_CUST_PPC'+
            				';TOP5_SALE_4T_CUST_PPC'+
            				';TOP5_YEAR_SALE_5T_CUST_PPC'+
            				';TOP5_VIP_CNT'+
            				';TOP5_VIP_SALE_AMT'+
            				';TOP5_VIP_RATE'+
            				';TOP5_VIP_SALE_RATE'+
            				';TOP5_NEW_CUST_CNT'+
            				';TOP5_NEW_CUST_SALE_AMT'+
            				';TOP5_NEW_CUST_RATE'+
            				';TOP5_NEW_CUST_SALE_RATE'+
            				';GROW_RT_CONT' +
            				';GROW_RT_COLOR' +
            				';MS_CONT' +
            				';MS_COLOR' +
            				';VIP_SALE_RATE_CONT' +
            				';VIP_SALE_RATE_COLOR' +
            				';NEW_CUST_SALE_RATE_CONT' +
            			  ';NEW_CUST_SALE_RATE_COLOR');//
  myBrandSaleTm.execute(null, false);
	grow_rt_cont = myBrandSaleTm.ElementValue('GROW_RT_CONT');
	grow_rt_color = myBrandSaleTm.ElementValue('GROW_RT_COLOR');
	ms_cont = myBrandSaleTm.ElementValue('MS_CONT');
	ms_color = myBrandSaleTm.ElementValue('MS_COLOR');
	vip_sale_rate_cont = myBrandSaleTm.ElementValue('VIP_SALE_RATE_CONT');
	vip_sale_rate_color = myBrandSaleTm.ElementValue('VIP_SALE_RATE_COLOR');
	new_cust_sale_rate_cont = myBrandSaleTm.ElementValue('NEW_CUST_SALE_RATE_CONT');
	new_cust_sale_rate_color = myBrandSaleTm.ElementValue('NEW_CUST_SALE_RATE_COLOR');
	md_mm_amt = myBrandSaleTm.ElementValue('MD_MM_AMT');
	pc_mm_amt = myBrandSaleTm.ElementValue('PC_MM_AMT');
	dd_avg_sale_amt = myBrandSaleTm.ElementValue('DD_AVG_SALE_AMT');
	md_mm_ms_rate = myBrandSaleTm.ElementValue('MD_MM_MS_RATE');
	top5_md_mm_amt = myBrandSaleTm.ElementValue('TOP5_MD_MM_AMT');
	top5_pc_mm_amt = myBrandSaleTm.ElementValue('TOP5_PC_MM_AMT');
	top5_md_mm_ms_rate = myBrandSaleTm.ElementValue('TOP5_MD_MM_MS_RATE');
	tot_sale_cust_cnt = myBrandSaleTm.ElementValue('TOT_SALE_CUST_CNT');
	visit_sale_1t_cust_cnt = myBrandSaleTm.ElementValue('SALE_1T_CUST_CNT');
	visit_sale_2t_cust_cnt = myBrandSaleTm.ElementValue('SALE_2T_CUST_CNT');
	visit_sale_3t_cust_cnt = myBrandSaleTm.ElementValue('SALE_3T_CUST_CNT');
	visit_sale_4t_cust_cnt = myBrandSaleTm.ElementValue('SALE_4T_CUST_CNT');
	visit_year_sale_5t_cust_cnt = myBrandSaleTm.ElementValue('YEAR_SALE_5T_CUST_CNT');
	visit_sale_1t_ppc = myBrandSaleTm.ElementValue('SALE_1T_CUST_PPC');
	visit_sale_2t_ppc = myBrandSaleTm.ElementValue('SALE_2T_CUST_PPC');
	visit_sale_3t_ppc = myBrandSaleTm.ElementValue('SALE_3T_CUST_PPC');
	visit_sale_4t_ppc = myBrandSaleTm.ElementValue('SALE_4T_CUST_PPC');
	visit_year_sale_5t_ppc = myBrandSaleTm.ElementValue('YEAR_SALE_5T_CUST_PPC');
	top5_tot_sale_cust_cnt = myBrandSaleTm.ElementValue('TOP5_TOT_SALE_CUST_CNT');
	visit_top5_sale_1t_cust_cnt = myBrandSaleTm.ElementValue('TOP5_SALE_1T_CUST_CNT');
	visit_top5_sale_2t_cust_cnt = myBrandSaleTm.ElementValue('TOP5_SALE_2T_CUST_CNT');
	visit_top5_sale_3t_cust_cnt = myBrandSaleTm.ElementValue('TOP5_SALE_3T_CUST_CNT');
	visit_top5_sale_4t_cust_cnt = myBrandSaleTm.ElementValue('TOP5_SALE_4T_CUST_CNT');
	visit_top5_year_sale_5t_cust_cnt = myBrandSaleTm.ElementValue('TOP5_YEAR_SALE_5T_CUST_CNT');
	visit_top5_sale_1t_ppc = myBrandSaleTm.ElementValue('TOP5_SALE_1T_CUST_PPC');
	visit_top5_sale_2t_ppc = myBrandSaleTm.ElementValue('TOP5_SALE_2T_CUST_PPC');
	visit_top5_sale_3t_ppc = myBrandSaleTm.ElementValue('TOP5_SALE_3T_CUST_PPC');
	visit_top5_sale_4t_ppc = myBrandSaleTm.ElementValue('TOP5_SALE_4T_CUST_PPC');
	visit_top5_year_sale_5t_ppc = myBrandSaleTm.ElementValue('TOP5_YEAR_SALE_5T_CUST_PPC');
	vip_cust_cnt = myBrandSaleTm.ElementValue('VIP_CNT');
	vip_top5_cust_cnt = myBrandSaleTm.ElementValue('TOP5_VIP_CNT');
	vip_sale_amt = myBrandSaleTm.ElementValue('VIP_SALE_AMT');
	vip_top5_sale_amt = myBrandSaleTm.ElementValue('TOP5_VIP_SALE_AMT');
	vip_rate = myBrandSaleTm.ElementValue('VIP_RATE');
	vip_sale_rate = myBrandSaleTm.ElementValue('VIP_SALE_RATE');
	vip_top5_sale_rate = myBrandSaleTm.ElementValue('TOP5_VIP_SALE_RATE');
	vip_top5_rate = myBrandSaleTm.ElementValue('TOP5_VIP_RATE');
	new_cust_cnt = myBrandSaleTm.ElementValue('NEW_CUST_CNT');
	new_top5_cust_cnt = myBrandSaleTm.ElementValue('TOP5_NEW_CUST_CNT');
	new_sale_amt = myBrandSaleTm.ElementValue('NEW_CUST_SALE_AMT');
	new_top5_sale_amt = myBrandSaleTm.ElementValue('TOP5_NEW_CUST_SALE_AMT');
	new_cust_rate = myBrandSaleTm.ElementValue('NEW_CUST_RATE');
	new_top5_cust_rate = myBrandSaleTm.ElementValue('TOP5_NEW_CUST_RATE');
	new_sale_rate = myBrandSaleTm.ElementValue('NEW_CUST_SALE_RATE');
	new_top5_sale_rate = myBrandSaleTm.ElementValue('TOP5_NEW_CUST_SALE_RATE');
	myBrandSaleTm.clear();
	checkData();
}

function checkData(){
	dd_avg_sale_amt = parseInt(isNullZero(dd_avg_sale_amt));
	if(dd_avg_sale_amt != 0){dd_avg_sale_amt = exCeil(dd_avg_sale_amt/division_amt, 1);}
	md_mm_amt = parseInt(isNullZero(md_mm_amt));
	if(md_mm_amt != 0){md_mm_amt = exCeil(md_mm_amt/division_amt, 1);}
	pc_mm_amt = parseInt(isNullZero(pc_mm_amt));
	if(pc_mm_amt != 0){pc_mm_amt = exCeil(pc_mm_amt/division_amt, 1);}
	top5_md_mm_amt = parseInt(isNullZero(top5_md_mm_amt));
	
	if(top5_md_mm_amt != 0){top5_md_mm_amt = exCeil(top5_md_mm_amt/division_amt, 1);}
	top5_pc_mm_amt = parseInt(isNullZero(top5_pc_mm_amt));
	if(top5_pc_mm_amt != 0){top5_pc_mm_amt = exCeil(top5_pc_mm_amt/division_amt, 1);}
	vip_sale_amt = parseInt(isNullZero(vip_sale_amt));
	if(vip_sale_amt != 0){vip_sale_amt = exCeil(vip_sale_amt/division_amt, 1);}
	vip_top5_sale_amt = parseInt(isNullZero(vip_top5_sale_amt));
	if(vip_top5_sale_amt != 0){vip_top5_sale_amt = exCeil(vip_top5_sale_amt/division_amt, 1);}
	
	new_sale_amt = parseInt(isNullZero(new_sale_amt));
	if(new_sale_amt != 0){new_sale_amt = exCeil(new_sale_amt/division_amt, 1);}
	new_top5_sale_amt = parseInt(isNullZero(new_top5_sale_amt));
	if(new_top5_sale_amt != 0){new_top5_sale_amt = exCeil(new_top5_sale_amt/division_amt, 1);}
	
	md_mm_ms_rate = exCeil(parseFloat(isNullZero(md_mm_ms_rate)), 2);
	top5_md_mm_ms_rate = exCeil(parseFloat(isNullZero(top5_md_mm_ms_rate)), 2);
	vip_rate = exCeil(parseFloat(isNullZero(vip_rate)), 2);
	vip_sale_rate = exCeil(parseFloat(isNullZero(vip_sale_rate)), 2);
	vip_top5_sale_rate = exCeil(parseFloat(isNullZero(vip_top5_sale_rate)), 2);
	vip_top5_rate = exCeil(parseFloat(isNullZero(vip_top5_rate)), 2);
	
	new_cust_rate = exCeil(parseFloat(isNullZero(new_cust_rate)), 2);
	new_top5_cust_rate = exCeil(parseFloat(isNullZero(new_top5_cust_rate)), 2);
	new_sale_rate = exCeil(parseFloat(isNullZero(new_sale_rate)), 2);
	new_top5_sale_rate = exCeil(parseFloat(isNullZero(new_top5_sale_rate)), 2);
	
	tot_sale_cust_cnt = parseInt(isNullZero(tot_sale_cust_cnt));
	visit_sale_1t_cust_cnt = parseInt(isNullZero(visit_sale_1t_cust_cnt));
	visit_sale_2t_cust_cnt = parseInt(isNullZero(visit_sale_2t_cust_cnt));
	visit_sale_3t_cust_cnt = parseInt(isNullZero(visit_sale_3t_cust_cnt));
	visit_sale_4t_cust_cnt = parseInt(isNullZero(visit_sale_4t_cust_cnt));
	visit_year_sale_5t_cust_cnt = parseInt(isNullZero(visit_year_sale_5t_cust_cnt));
	top5_tot_sale_cust_cnt = parseInt(isNullZero(top5_tot_sale_cust_cnt));
	visit_top5_sale_1t_cust_cnt = parseInt(isNullZero(visit_top5_sale_1t_cust_cnt));
	visit_top5_sale_2t_cust_cnt = parseInt(isNullZero(visit_top5_sale_2t_cust_cnt));
	visit_top5_sale_3t_cust_cnt = parseInt(isNullZero(visit_top5_sale_3t_cust_cnt));
	visit_top5_sale_4t_cust_cnt = parseInt(isNullZero(visit_top5_sale_4t_cust_cnt));
	visit_top5_year_sale_5t_cust_cnt = parseInt(isNullZero(visit_top5_year_sale_5t_cust_cnt));
	
	vip_cust_cnt = parseInt(isNullZero(vip_cust_cnt));
	vip_top5_cust_cnt = parseInt(isNullZero(vip_top5_cust_cnt));
	new_cust_cnt  = parseInt(isNullZero(new_cust_cnt));
	new_top5_cust_cnt  = parseInt(isNullZero(new_top5_cust_cnt));
	
	visit_sale_1t_ppc = parseFloat(isNullZero(visit_sale_1t_ppc));
	if(visit_sale_1t_ppc != 0){visit_sale_1t_ppc = exCeil(visit_sale_1t_ppc/division_ppc, 1);}
	visit_sale_2t_ppc = parseFloat(isNullZero(visit_sale_2t_ppc));
	if(visit_sale_2t_ppc != 0){visit_sale_2t_ppc = exCeil(visit_sale_2t_ppc/division_ppc, 1);}
	visit_sale_3t_ppc = parseFloat(isNullZero(visit_sale_3t_ppc));
	if(visit_sale_3t_ppc != 0){visit_sale_3t_ppc = exCeil(visit_sale_3t_ppc/division_ppc, 1);}
	visit_sale_4t_ppc = parseFloat(isNullZero(visit_sale_4t_ppc));
	if(visit_sale_4t_ppc != 0){visit_sale_4t_ppc = exCeil(visit_sale_4t_ppc/division_ppc, 1);}
	visit_year_sale_5t_ppc = parseFloat(isNullZero(visit_year_sale_5t_ppc));
	if(visit_year_sale_5t_ppc != 0){visit_year_sale_5t_ppc = exCeil(visit_year_sale_5t_ppc/division_ppc, 1);}
	
	
	visit_top5_sale_1t_ppc = parseFloat(isNullZero(visit_top5_sale_1t_ppc));
	if(visit_top5_sale_1t_ppc != 0){visit_top5_sale_1t_ppc = exCeil(visit_top5_sale_1t_ppc/division_ppc, 1);}
	visit_top5_sale_2t_ppc = parseFloat(isNullZero(visit_top5_sale_2t_ppc));
	if(visit_top5_sale_2t_ppc != 0){visit_top5_sale_2t_ppc = exCeil(visit_top5_sale_2t_ppc/division_ppc, 1);}
	visit_top5_sale_3t_ppc = parseFloat(isNullZero(visit_top5_sale_3t_ppc));
	if(visit_top5_sale_3t_ppc != 0){visit_top5_sale_3t_ppc = exCeil(visit_top5_sale_3t_ppc/division_ppc, 1);}
	visit_top5_sale_4t_ppc = parseFloat(isNullZero(visit_top5_sale_4t_ppc));
	if(visit_top5_sale_4t_ppc != 0){visit_top5_sale_4t_ppc = exCeil(visit_top5_sale_4t_ppc/division_ppc, 1);}
	visit_top5_year_sale_5t_ppc = parseFloat(isNullZero(visit_top5_year_sale_5t_ppc));
	if(visit_top5_year_sale_5t_ppc != 0){visit_top5_year_sale_5t_ppc = exCeil(visit_top5_year_sale_5t_ppc/division_ppc, 1);}

}


/**========================================================================================
* Tab 이동
========================================================================================*/
function tabMove(){
 
  var actionUrl = "";
  
  
  if(flag == "1"){actionUrl = "web_chart_brandsales_sub01.jsp";}//행사매출/응답율(비용)
  else if(flag == "2"){actionUrl = "web_chart_brandsales_sub02.jsp";}//행사고객분석(VIP/신규)
  else if(flag == "3"){actionUrl = "web_chart_brandsales_sub03.jsp";}//행사고객분석(성별/연령)
  
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
	
	search("search");
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
			<ul class="tab_style01">
				<li class="on"><a href="javascript:tabMove();">매출현황</a></li>
				<li><a href="javascript:tabMove();">고객현황</a></li>
				<li><a href="javascript:tabMove();">고객현황(기타)</a></li>
			</ul>
			<div class="inquiry_wrap">
				<div class="select_wrap">
          <select id="sel_store_cd"></select>
          <select id="sel_team_cd"></select>
          <select id="sel_floor_cd"></select>
          <select id="sel_pc_cd"></select>
          <select id="sel_crnr_cd"></select>
          <select id="sel_md_cd"></select>
          <select id="sel_year"></select>
          <select id="sel_month"></select>
        </div>
				<a href="javascript:popupMd();" class="btn_md">MD검색</a>
        <a href="javascript:search();" class="btn_inquiry">조회하기</a>
			</div>
			<div id="tab_content"></div>
			
			  <!-- 워터마크 영역 -->
      	<div id="back_mark"></div>
      	<!-- 워터마크 영역 -->
			</div>
	</div>
</body>
</html>
