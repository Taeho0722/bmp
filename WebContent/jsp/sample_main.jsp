<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>페이지 제목</title>
<%@ include file="./common/common_util.jsp" %><!-- 필수!!! Web 전용 공통 컨트롤 -->

<script type="text/javascript">

//전역 변수 선언 시작------------------------------------------------------------------
var reg_id = "";//등록자 아이디
var store_cd = "";//점포코드
var md_cd = "";//MD코드
var user_id = "";//접속자 아이디
var cprn_comp_cd = "";//협력 업체 코드

var flag = "1";//페이지 구분
var work_flag = "N";//수정여부
//전역 변수 선언 종료------------------------------------------------------------------



//화면 로드 시 실행
 $(document).ready(function() {
   do_RefreshPage("onload");//함수 실행
});


/**========================================================================================
* 공통 에이전트에서 쓰는 함수명
* 함수 명칭 수정 금지
* 필수 함수
* 화면 onload 용
========================================================================================*/ 
function do_RefreshPage(gubun) {
	/**===================================================
	web_controller.js
	
	반환값
	webUserId : 유저 아이디
	webUserName : 유저 명
	webGroupName : 그룹명
	webGroupDescription : 그룹 설명
	webSysDiv : 권한
	webSysDivFlag : 세부 권한 
	wevMdCd : MD 코드
	webStoreCd: 점포코드
	webCopCd : 협력업체코드
	======================================================*/
	web_Init(window);//세션정보
	
	//화면 onload 시
	if(gubun == "onload"){
		
		//전역변수에 Session 값 할당
		md_cd = wevMdCd;
		user_id = webUserId;
		cprn_comp_cd = webCopCd;
		store_cd = webStoreCd;
	}
	
	//페이지 이동
	webPageMove(flag);
}


/**========================================================================================
 * 페이지 이동
 ========================================================================================*/
function webPageMove(flag){
	var actionUrl = "";
	
	//flag가 1이면 아래 jsp를 호출한다.
	//호출된 페이지명을 명시한다.
	if(flag == "1"){actionUrl = "sample_sub.jsp";}
	
	//Page로 이동  
	var param = "";//ajax 호출 시 전달한 파라미터 설정
	
	//ajax 호출 영역 시작------------------------------
	$.ajax({
		url:actionUrl,//호출 url
		data:param, //전달한 parameter
		type:"POST", //호출 방식 GET, POST
	 	beforeSend : function(){
			spinStart();//ajax 시작전 로딩바 시작
		},
	 	success:function(result) {
			$("#web_content2").html(result);//ajax 로드 성공 시 web_content2 id 값을 가지는 영역에 로드한다.
			waterMarkText("web_wrap");//워터마크 실행 함수,  호출 web_wrap id값을 가진 영역을 지정
		},
		complete : function(){
			spinStop();//ajax 완료되면 로딩바 종료
		},
		error:function(request, status, error){
			//ajax 에러 처리
			cmdMessage(0,"code : "+request.status+"\n"+"message : "+request.responseText+"\n"+"error:"+error);
		}
	});
	//ajax 호출 영역 종료------------------------------
	
}

</script>
</head>
<body>
<div id="web_wrap">
    <div class="web_container">
    
      <!-- Sub 영역 -->
      <div id="web_content2"></div>
      <!-- Sub 영역 -->
      
    </div>
    <!-- 워터마크 영역 -->
    <div id="back_mark"></div>
    <!-- 워터마크 영역 -->
  </div>
</body>
</html>
