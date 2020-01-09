<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>공지사항(브랜드)</title>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->

<script type="text/javascript">

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
	======================================================*/
	web_Init(window);//세션정보
	
	
	if(gubun == "onload"){
		md_cd = wevMdCd;
		store_cd = webStoreCd;
		user_id = webUserId;
	}
	
	
	//화면이동
	pageMove(flag);
	
}



/**========================================================================================
 * 화면이동
 ========================================================================================*/
function pageMove(flag){
  
	var actionUrl = "";
	  
	if(flag == "1"){actionUrl = "web_brandnotice_sub_pop.jsp";}
	
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
  			$("#web_content2").html(result);//id가 tab_content에 내용을 보여줌
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