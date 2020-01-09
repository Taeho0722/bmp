<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title> 신한 캠페인 등록 </title>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->
<%
String camp_id = XSScheck(request.getParameter("camp_id"));
%>
<script type="text/javascript">
var md_cd = "";
var cprn_comp_cd = "";
var camp_id = "";
var user_id = "";
var reg_id = "";

//화면 로드 시 실행
$(document).ready(function() {
	do_RefreshPage("onload");
});	



function do_RefreshPage(gubun) {
	screenLog("조회", "web_cp_shinhancard", "브랜드마케팅>행사등록하기>신한카드 FAN 행사등록",get_client_ip);//화면 로그(공통)
	
	
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
	if(gubun == "onload"){
		web_Init(window);//세션정보
		md_cd = wevMdCd;
		user_id = webUserId;
		cprn_comp_cd = webCopCd;
		camp_id = "<%=camp_id%>";
	}
	
	
	if(gubun == "new"){
		 camp_id = "";
		 camp_nm = "";
		 reg_id = "";
	}
	
	webPageMove();
}



/**========================================================================================
 * 화면 이동
 ========================================================================================*/
function webPageMove(){
	var actionUrl = "";
	
	actionUrl = "web_cp_shinhancard_sub.jsp";
	
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
  </div>
  <!-- 워터마크 영역 -->
  <div id="back_mark"></div>
  <!-- 워터마크 영역 -->
</div>
</body>
</html>
