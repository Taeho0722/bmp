<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>공지사항</title>
<!-- WEB -->
<link rel="stylesheet" type="text/css" href="../css/web/style.css"/>
<script type="text/javascript" src="../js/jquery-2.1.4.min.js"></script>
<script type="text/javascript">

//화면 로드 시 실행
$(document).ready(function() {
	
});



/*===============================================================
팝업 Close
===============================================================*/
function popupClose(popupN) {
	window.close();
}

</script>
</head>
<body>
   <div id="layer_imgcnt" class="layer_window" style="display:block;">
    <p class="tit">행사등록 전 사전 준비사항<a href="javascript:popupClose();" class="btn_close">닫기</a></p>
    <div class="img_wrap">
      <img src="../../img/web/icon/login_popup2.png">
    </div>
    <div class="pop_btn">
      <a href="javascript:popupClose();" class="btn_cancel">닫기</a>
    </div>
  </div>
</body>
</html>




