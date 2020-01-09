<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title> 행사 조회</title>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->

<script type="text/javascript">
var md_cd = "";
var store_cd = "";
var sys_div = "";
var staff_inc_yn = "N";
var sis_div_flag = "";
var stg_md_cd = "";  //스토리지 md_cd
var stg_store_cd = "";//스토리지 store_cd

//화면 로드 시 실행
$(document).ready(function() {
	
	do_RefreshPage("onload");

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
	webCopCd : 협력업체코드
	======================================================*/
	web_Init(window);//세션정보
	sys_div = webSysDiv;
	stg_md_cd = wevMdCd;
	stg_store_cd = webStoreCd;
	webPageMove();
	
}

/**========================================================================================
* 로딩 시작(서브 페이지용)
========================================================================================*/ 
function loadingStart(){
	spinStart('1');
} 


/**========================================================================================
* 로딩 종료(서브 페이지용)
========================================================================================*/ 
function loadingStop(){
	spinStop();
}

/**========================================================================================
 * 화면 이동
 ========================================================================================*/
function webPageMove(){
	var actionUrl = "";
	
	actionUrl = "web_chart_eventinfo_sub.jsp";
	
	//Page로 이동  
	var param = "";
	
	$.ajax({
		url:actionUrl,
		data:param,
		type:"POST",
	 	beforeSend : function(){
			spinStart();
		},
	 	success:function(result) {
	 		$("#web_content2").html(result);
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
  <div id="web_wrap">
    <div class="web_container">
      <div id="web_content2"></div>
      <!-- 워터마크 영역 -->
		<div id="back_mark"></div>
		<!-- 워터마크 영역 -->
    </div>
    
   </div>
  </body>
</html>
