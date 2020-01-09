<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>백화점현황</title>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->
<script type="text/javascript">
 
var flag = "1";
var sys_div = "";
var md_cd = "";
var store_cd = "";
var user_id = "";
 
 
//화면 로드 시 실행
$(document).ready(function() {
	do_RefreshPage("onload");
  
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
		store_cd = webStoreCd;
		sis_div_flag = webSysDivFlag;
		user_id = webUserId;
		
		selectStoreBox();
		
		if(sis_div_flag == "1.1"){ //브랜드-매장사용자 : 세션정보 점포코드
			$("#sel_store_cd").val(store_cd).attr("selected","selected");	
			$("#sel_store_cd").attr("disabled",true);
			$("#sel_store_cd").addClass("disabled");
		} else if(sis_div_flag == "1.2"){ //브랜드-본사사용자 : 세션정보md에 해당하는 첫번째 점포코드 
			$("#sel_store_cd option:eq(1)").attr("selected","selected");
			store_cd = $("#sel_store_cd option:selected").val();
		}
	}
	
	
	//조회하기 시 셀렉트 박스 선택
	if(gubun == "search"){
		$("#sel_store_cd").val(store_cd).attr("selected","selected");
	}
	
	contentMove(flag);
	
}	



/**========================================================================================
* 선택 박스 그리기(점포)
========================================================================================*/
function selectStoreBox(){
	var selectBox = "";
	var i = 0;
	
	var storeTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectStoreCd', '0', '\@#%');
	storeTm.setAddDataField('MD_CD', md_cd);
	storeTm.execute(null, false);
	var storeTmResult = storeTm.getResult();
	var storeTmResult_json = "";
	if(storeTmResult != ""){storeTmResult_json = JSON.parse(storeTmResult);}
	storeTm.clear();
	
	selectBox += "<option value=''>::점::</option>";
	for(i=0; i<storeTmResult_json.length; i++) {
		selectBox += "<option value='"+storeTmResult_json[i].ITEM_CD+"'>"+storeTmResult_json[i].ITEM_NM+"</option>";
	}
	
	
	$("#sel_store_cd").html(selectBox);
}



/**========================================================================================
* 검색
========================================================================================*/
function search(){
	var actionUrl = "";
	var srh_store_cd = $("#sel_store_cd").val();
	
	if(!srh_store_cd){	
		cmdMessage(3,"점포");
		$("#sel_store_cd").focus();
		return;
	}
	
	store_cd = srh_store_cd;
	
	do_RefreshPage("search");
}

/**========================================================================================
* 컨텐츠 조회
========================================================================================*/
function contentMove(){
  
	var actionUrl = "";

	if(flag == "1"){actionUrl = "web_brand_departmentinfo_sub.jsp";}
	
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
            <form>
            <dl>
              <dt>점포</dt>
              <dd><select id="sel_store_cd"></select></dd>
            </dl>
            <div class="btn_box">
              <a href="javascript:search();" class="btn_brown">조회하기</a>
            </div>
            </form>
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

