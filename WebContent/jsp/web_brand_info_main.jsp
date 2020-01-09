<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>브랜드현황</title>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->



<script type="text/javascript">
 
var flag = "1";
var sys_div = "";
var md_cd = "";
var sel_cd1 = "";
var sel_nm1 = "";
var sel_cd2 = "";
var sel_cd3 = "";
var base_ym = "";
var user_id = "";
var search_flag = "N";

var search_id = "search_all";
var md_lvl_cd = "";
 
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
var tm_sub_method1 = "selectBrandInfo";
var tm_excel_method = "excelBrandInfo";
 
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
			tm_sub_method1 = "selectBrandInfo";
			tm_excel_method = "excelBrandInfo";
			
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
			tm_sub_method1 = "selectBrandInfoHQ";
			tm_excel_method = "excelBrandInfoHQ";
		}
		
		do_RefreshPage("check");
	});
	
	
	
	
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
	
	if(gubun == "onload"){
		md_cd = wevMdCd;
		sel_cd1 = webStoreCd;
		sis_div_flag = webSysDivFlag;
		user_id = webUserId;
	}
	
	
	if(gubun != "search"){
		selectBox1();
		selectBox2();
		selectBox3();
		selectYmBox();	
	}
	
	
	$('input:radio[name=group_check]:input[value=' + group_div + ']').attr("checked", true);
	
	//조회하기 시 셀렉트 박스 선택
	if(gubun == "search"){
		$("#sel_cd1").val(sel_cd1).attr("selected","selected");
		$("#sel_cd2").val(sel_cd2).attr("selected","selected");
		$("#sel_cd3").val(sel_cd3).attr("selected","selected");
		$("#sel_ym").val(base_ym).attr("selected","selected");
		
		search_flag = "Y";
	}
	
	//초기 기준년월 설정
	if(gubun == "onload" || gubun == "check" ){
		if(base_ym == ""){
			$("#sel_ym option:eq(2)").attr("selected","selected");
			base_ym = $("#sel_ym option:selected").val();
		}else{
			$("#sel_ym").val(base_ym).attr("selected","selected");	
		}
	}
	
	contentMove(flag);
	selectBoxChange();
}	



/**========================================================================================
* select box change event
========================================================================================*/
function selectBoxChange(){
	
	
	//점포,담당 변경
	$("#sel_cd1").change(function(){
		var innerHtml = "";
		
		sel_cd1 = $("#sel_cd1 option:selected").val();
		sel_nm1 = $("#sel_cd1 option:selected").text();
		
		//팀, 장르 코드 조회
		var TMmanger2 = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', tm_method2, '0', '\@#%');
		TMmanger2.setAddDataField(tm1_setCol, sel_cd1);
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
		
		$("#sel_cd2").html(innerHtml);
		$("#sel_cd3").html("<option value=''>::PC::</option>");
	});
	
	
	//팀, 장르 변경
	$("#sel_cd2").change(function(){
		var innerHtml = "";
		
		sel_cd2 = $("#sel_cd2 option:selected").val();
		
		//PC 코드 조회
		var TMmanger3 = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', tm_method3, '0', '\@#%');
		TMmanger3.setAddDataField(tm1_setCol, sel_cd1);
		TMmanger3.setAddDataField(tm2_setCol, sel_cd2);
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
		
		$("#sel_cd3").html(innerHtml);
		
	});
	
	
	//PC 변경
	$("#sel_cd3").change(function(){
		sel_cd3 = $("#sel_cd3 option:selected").val();
	});
	
	
	//기준년월
	$("#sel_ym").change(function(){
		base_ym = $("#sel_ym option:selected").val();
	});
}


/**========================================================================================
* 선택 박스 그리기( 점포, 담당)
========================================================================================*/
function selectBox1(){
	var selectBox = "";
	var i = 0;
	var sel_id = "";
	
	sel_id = "sel_cd1";
	
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
* 선택 박스 그리기( 팀, 장르)
========================================================================================*/
function selectBox2(){
	var selectBox = "";
	var i = 0;
	var sel_id = "";
	var sel_cd1 = "";
	
	sel_id = "sel_cd2";
	
	var TMmanger2 = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', tm_method2, '0', '\@#%');
	TMmanger2.setAddDataField(tm1_setCol, sel_cd1);
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
* 선택 박스 그리기( PC)
========================================================================================*/
function selectBox3(){
	var selectBox = "";
	var i = 0;
	var sel_id = "";
	var sel_cd1 = "";
	var sel_cd2 = "";
	
	sel_id = "sel_cd3";
	
	var TMmanger3 = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', tm_method3, '0', '\@#%');
	TMmanger3.setAddDataField(tm1_setCol, sel_cd1);
	TMmanger3.setAddDataField(tm2_setCol, sel_cd2);
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
* 선택 박스 그리기(기준년월)
========================================================================================*/
function selectYmBox(){
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
	}
	
	$("#sel_ym").html(selectBox);
}



/**========================================================================================
* 검색
========================================================================================*/
var srh_base_ym = "";
var srh_sel_cd1 = "";
var srh_sel_nm1 = "";
var srh_sel_cd2 = "";
var srh_sel_cd3 = "";

function search(){
	var actionUrl = "";
	srh_sel_cd1 = $("#sel_cd1").val();
	srh_sel_nm1 = $("#sel_cd1 option:selected").text();
	srh_sel_cd2 = $("#sel_cd2").val();
	srh_sel_cd3 = $("#sel_cd3").val();
	srh_base_ym = $("#sel_ym").val();
	
	if(!srh_sel_cd1){	
		if(group_div == "1"){cmdMessage(3,"점포");}
		if(group_div == "2"){cmdMessage(3,"담당");}
		$("#sel_cd1").focus();
		return;
	}
	
	if(!srh_base_ym){	
		cmdMessage(3,"기준년월");
		$("#sel_ym").focus();
		return;
	}
	
	sel_cd1 = srh_sel_cd1;
	sel_cd2 = srh_sel_cd2;
	sel_cd3 = srh_sel_cd3;
	base_ym = srh_base_ym;
	
	do_RefreshPage("search");
}

/**========================================================================================
* 컨텐츠 조회
========================================================================================*/
function contentMove(){
  
	var actionUrl = "";

	if(flag == "1"){actionUrl = "web_brand_info_sub.jsp";}
	
	var param = "";
 	$.ajax({
	 	url:actionUrl,
		data:param,
		type:"POST",
		beforeSend : function(){
			spinStart();
		},
	 	success : function(result){
			$("#web_content2").html(result);//id가 tab_content에 내용을 보여줌
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
 
</script>
</head>
<body>
    <div id="web_wrap">
      <div class="web_container">
        <div class="top_fixed">
          <div class="top_search">
            <div class="radio_box">
              <label for="radio1"><input type="radio" id="radio1" name="group_check" value="1">점포</label>
              <label for="radio2"><input type="radio" id="radio2" name="group_check" value="2">본부</label>
            </div>
            <div class="select_wrap">
              <select id="sel_cd1"></select>
              <select id="sel_cd2"></select>
              <select id="sel_cd3"></select>
              <select id="sel_ym"></select>
            </div>
            <div class="btn_box">
              <a href="javascript:search();" class="btn_brown">조회하기</a>
            </div>
          </div>
        </div>
        <div id="web_content2">
        </div>
        <!-- 워터마크 영역 -->
        <div id="back_mark"></div>
        <!-- 워터마크 영역 -->
    </div>
    </div>
  </body>
</html>
