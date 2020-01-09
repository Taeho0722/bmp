<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>브랜드 프로필</title>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->


<%
//FIT행사현황에서 전달되는 값
String store_cd = XSScheck(request.getParameter("store_cd"));
String md_cd = XSScheck(request.getParameter("md_cd"));
String md_nm = XSScheck(request.getParameter("md_nm"));
%>

<script type="text/javascript">

var flag = "1";//탭 구분

var user_id = "";//로그인 아이디
var sys_div = "";//로그인 유저 권한
var sys_div_flag = "";//로그인 유저 세부권한

var md_cd = "";//MD코드
var store_cd = "";//점포코드
var store_nm = "";//점포명
var md_nm = "";//MD명
var team_cd = "";//팀코드
var floor_cd = "";//층코드
var pc_cd = "";//PC코드
var crnr_cd = "";//코너코드

//FIT행사현황에서 전달되는 값 받는 변수
var p_store_cd = "";//점포코드
var p_md_cd = "";//MD코드
var p_md_nm = "";//MD명


//화면 로드 시 실행
$(document).ready(function() {
	do_RefreshPage("onload");//함수명 고정
});


function do_RefreshPage(gubun) {
	
	/**===================================================
	반환값
	user_id : 유저 아이디
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
	
		//FIT행사현황에서 전달되는 값 설정
		p_store_cd = "<%=store_cd%>";
		p_md_cd = "<%=md_cd%>";
		p_md_nm = decodeURIComponent("<%=md_nm%>");
		
		//Session 값 설정
		user_id = webUserId;//로그인 아이디
		sys_div = webSysDiv;//로그인 권한
		sys_div_flag = webSysDivFlag;//로그인 세부 권한
		
		//FIT행사현황에서 전달되는 값 체크
		if(p_store_cd != ""){store_cd = p_store_cd;}else{store_cd = webStoreCd;}
		if(p_md_cd != ""){md_cd = p_md_cd;}else{md_cd = wevMdCd;}
		
		//Select Box
		selectStoreCd();
		selectTeamCd();
		selectFloorCd();
		selectPcCd();
		selectCrnrCd();
		selectMdCd();
		
		setSelectBoxStatus();//권한 체크
	}
	//초기 화면 Load 시 적용 End--------------------------------------------
	
	
	selectChange();//Select Box 변경 이벤트 설정
	pageMove(flag);//화면이동
	
}



/**========================================================================================
* select box 상태 변경
* 권한에 따라 select box 상태 변경
========================================================================================*/
function setSelectBoxStatus(){
	
	//브랜드(EDI)
	if(sys_div == "1"){
		$("#md_popup").css("display","none");
		$("#sel_team_cd").css("display","none");
		$("#sel_floor_cd").css("display","none");
		$("#sel_pc_cd").css("display","none");
		$("#sel_crnr_cd").css("display","none");
		$("#sel_md_cd").css("display","none");
	}
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
	
	
	//점포 변경
	$("#sel_store_cd").change(function(){
		store_cd = $("#sel_store_cd option:selected").val();
		
		//백화점사용자일 경우만 점포코드 변경시 하위 팀코드 변경.
		if(sys_div == "2"){
			
			if(store_cd != ""){
				team_cd = "";
				floor_cd = "";
				pc_cd = "";
				crnr_cd = "";
				md_cd = "";
				
				selectTeamCd();
				$("#sel_md_cd").html("<option value=''>::MD::</option>");
			}
			
			//전체 검색 일때
			if(store_cd == ""){
				team_cd = "";
				floor_cd = "";
				pc_cd = "";
				crnr_cd = "";
				
				$("#sel_team_cd").html("<option value=''>::팀::</option>");
			}
			
			
			
			$("#sel_floor_cd").html("<option value=''>::층::</option>");
			$("#sel_pc_cd").html("<option value=''>::PC::</option>");
			$("#sel_crnr_cd").html("<option value=''>::코너::</option>");
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
}


/**========================================================================================
* 점포 코드 selectbox 조회(기존)
========================================================================================*/
function selectStoreCd(){
	var innerHtml = "";
	var i = 0;
	
	//점포
	var storeTm = new oza_TMHandler('com.obzen.bmp.ColBMPComm', 'selectStoreDW', '0', '\@#%');
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
	
	if(store_cd != "" && floor_cd != "" && pc_cd != "" && crnr_cd != ""){
		var mdTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectMdCd', '0', '\@#%');
		
		/*
		//브랜드사용자는 소속 MD_CD에 해당하는 MD_CD만 조회
		if(sys_div == "1"){
			store_cd = "";
			pc_cd = "";
			floor_cd = "";
			crnr_cd = "";
		
		//백화점사용자는 선행 선택된 조직정보에 해당하는 MD_CD 조회	
		}else{
			store_cd = $("#sel_store_cd option:selected").val();
			pc_cd = $("#sel_pc_cd option:selected").val();
			floor_cd = $("#sel_floor_cd option:selected").val();
			crnr_cd = $("#sel_crnr_cd option:selected").val();
			md_cd = "";
		}
		*/
		mdTm.setAddDataField('STORE_CD', store_cd);
		mdTm.setAddDataField('FLOOR_CD', floor_cd);
		mdTm.setAddDataField('PC_CD', pc_cd);
		mdTm.setAddDataField('CRNR_CD', crnr_cd);
		mdTm.setAddDataField('MD_CD', md_cd);
		mdTm.execute(null, false);
		var mdTmResult = mdTm.getResult();
		if(mdTmResult != ""){mdTmResult_json = JSON.parse(mdTmResult);}
		mdTm.clear();
	}
	
	innerHtml += "<option value=''>::MD::</option>";
	for(var i=0; i<mdTmResult_json.length; i++) {
		innerHtml += "<option value='"+mdTmResult_json[i].ITEM_CD+"'>"+mdTmResult_json[i].ITEM_NM+"</option>";
	}
	$("#sel_md_cd").html(innerHtml);
}


/**========================================================================================
* 조회하기
========================================================================================*/
function search(){
	var srh_store_cd = $("#sel_store_cd").val();
	var srh_md_cd = $("#sel_md_cd").val();
	
	//운영정보 사용자 일때만 체크
	if(sys_div == "2"){
		if(srh_md_cd == ""){
			cmdMessage(3,"MD");
			$("#sel_md_cd").focus();
			return;
		}	
	}
	
	console.log("store_cd="+store_cd);
	console.log("md_cd="+md_cd);
	do_RefreshPage("search");
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


/**=====================================================================================
* 화면이동
========================================================================================*/
function pageMove(flag){
  
	var actionUrl = "";
	  
	if(flag == "1"){actionUrl = "web_brandprofile_sub.jsp";}
	
	//선택한 Page로 이동  
	var param = "";
	 	$.ajax({
  	 	url:actionUrl,
  		data:param,
  		type:"POST",
  		beforeSend : function(){
  			spinStart();
  		},
  	 	success:function(result) {
  			$(".brand_cnt").html(result);//id가 tab_content에 내용을 보여줌
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
      <div id="web_content3">
        <div class="brand_wrap">
          <div class="brand_search" >
          
            <select id="sel_store_cd"></select>
            <select id="sel_team_cd"></select>
            <select id="sel_floor_cd"></select>
            <select id="sel_pc_cd"></select>
            <select id="sel_crnr_cd"></select>
            <select id="sel_md_cd"></select>
            
            <p class="search_btn" onclick="javascript:popupMd();" style="cursor:pointer;" id="md_popup">MD검색</p>
            <p class="search_btn" onclick="javascript:search();" style="cursor:pointer;">조회하기</p>
          </div>
          
          <!-- 컨텐츠 영역 -->
          <div class="brand_cnt clear">
          </div>
          <!-- 컨텐츠 영역 -->
          
        </div>
      </div>
    </div>
    <!-- 워터마크 영역 -->
    <div id="back_mark"></div>
    <!-- 워터마크 영역 -->
  </div>
  
</body>
</html>