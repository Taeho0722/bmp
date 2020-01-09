<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>매뉴얼</title>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->
<script type="text/javascript">
 
 
var slideIndex = 1;
 
 
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
	
	plusSlides(0, "");//슬라이드 이동
	waterMarkText("web_wrap");//워터마크
}	


/**========================================================================================
* 이전/다음 슬라이드
========================================================================================*/
function plusSlides(n, classIdVal) {
	var slides = $(".manual_img img");
	var size = slides.length;
	
	var first_page = 0;
	var last_page = size;
	
	slideIndex = parseInt(slideIndex+n);
	
	//페이지 인덱스 설정
	if(slideIndex < 1) {slideIndex = 1;}
	if(slideIndex > last_page) {slideIndex = last_page;}
	
	//이전, 다음 버튼 마우스 커서 컨트롤
	if(slideIndex == last_page){$("#sl_next").css("cursor","default");}
	if(slideIndex > 1){$("#sl_prev").css("cursor","pointer");}
	if(slideIndex == 1){$("#sl_prev").css("cursor","default");}
	if(slideIndex < last_page){$("#sl_next").css("cursor","pointer");}
	
	
	//모두 안보이게 처리
	for (var i = 0; i < size; i++) {
		$(".manual_img img").eq(i).css("display","none");  
	}

	//현재 이미지만 보이도록 처리
	$(".manual_img img").eq(slideIndex-1).css("display","");
	
	//페이지 표시
	first_page = slideIndex;
	$(".page").text(first_page+"/"+last_page);
}

</script>
</head>
<body>
  <div id="web_wrap">
    <div class="web_container">
      <div id="web_content2">
        <div class="manual_wrap">
          <div class="manual_img">
          
            <!-- 메뉴얼 이미지 영역 시작 -->
            <img src="../../img/web/menual/FIT_A_1.jpg" alt="">
            <img src="../../img/web/menual/FIT_A_2.jpg" alt="">
            <img src="../../img/web/menual/FIT_B_1.jpg" alt="">
            <img src="../../img/web/menual/FIT_B_2.jpg" alt="">
            <!-- 메뉴얼 이미지 영역 종료 -->
            
          </div>
          <div class="paging">
            <a href="javascript:plusSlides(-1, 'prev');" class="btn_prev" id="sl_prev">이전</a>
            <div class="page"></div>
            <a href="javascript:plusSlides(1, 'next');" class="btn_next" id="sl_next">다음</a>
          </div>
        </div>
      </div>
      <!-- 워터마크 영역 -->
      <div id="back_mark"></div>
      <!-- 워터마크 영역 -->
    </div>
  </div>
 </body>
</html>
