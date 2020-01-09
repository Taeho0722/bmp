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
	
	
	screenLog("조회", "sample", "샘플",get_client_ip);//화면 로그(공통)
	test1();
	test2();
	test3();
	test4();
}


//TM Start ===============================================================================================
//MD명 조회	
var md_nm = "";

var mdNmTm = new oza_TMHandler('com.obzen.bmp.DocBMPComm', 'selectMdNm', '1', '\@#%');
mdNmTm.setAddDataField('MD_CD', md_cd);
mdNmTm.setAddDataField('CPRN_COMP_CD', cprn_comp_cd);
mdNmTm.returnlist('MD_NM');
mdNmTm.execute(null, false);
md_nm = mdNmTm.ElementValue('MD_NM');
mdNmTm.clear();	



//MD별 점포 조회-------------------------
var sel_store_cd = "";
var sel_store_nm = "";

var storeTm = new oza_TMHandler('com.obzen.bmp.ColBMPComm', 'selectStoreMD', '0', '\@#%');
storeTm.setAddDataField('MD_CD', md_cd);
storeTm.setAddDataField('USERID', user_id);
storeTm.execute(null, false);
var storeTmResult = storeTm.getResult();
var storeTm_json = ""; 
if(storeTmResult != ""){storeTm_json = JSON.parse(storeTmResult);}
storeTm.clear();
//TM End =================================================================================================	

	
	
/*===============================================================
* 첫번째 호출 함수
===============================================================*/
function test1(){


}


/*===============================================================
* 두번째 호출 함수
===============================================================*/
function test2(){


}

/*===============================================================
* 세번째 호출 함수
===============================================================*/
function test3(){


}

/*===============================================================
* 네번째 호출 함수
===============================================================*/
function test4(){


}


/**========================================================================================
* 등록 시 예제
========================================================================================*/ 
var crtfc_num = "";
var mod_crtfc_num = "";
function insert() {
	mod_crtfc_num = $.trim($("#mod_crtfc_num").val()); 
	
	//등록 값 체크
	if(sel_store_cd == ""){cmdMessage(3, "테스트1"); $("#sel_store").focus();return;}
	if(mod_crtfc_num == ""){cmdMessage(2, "테스트2"); $("#mod_crtfc_num").focus();return;}
	
	//insert TM 호출 시작--------------------------
	var insertTm = new oza_TMHandler('com.obzen.bmp.DocCampOfferSel', 'insertCrtfcNum', '1', '\@#%');
	insertTm.setAddDataField('MD_CD', md_cd);
	insertTm.setAddDataField('STORE_CD', sel_store_cd);
	insertTm.setAddDataField('MOD_CRTFC_NUM', mod_crtfc_num);
	insertTm.setAddDataField('USERID', user_id);
	insertTm.returnlist('LOGMSG');
	insertTm.execute(null, false);
	var msg = insertTm.ElementValue('LOGMSG');//리턴 처리 메시지
	insertTm.clear();
	//insert TM 호출 종료--------------------------

	//화면 로그(공통)
	screenLog("등록", "web_cp_verificationcode_sub", "행사등록하기>인증번호 관리",get_client_ip);
	
	//리턴 메시지 알림창
	cmdMessage(0,msg);
	
	
	//화면 reload-----------------------------
	store_cd = sel_store_cd;//Reload 시 필요한 변수 값 설정한다.
	do_RefreshPage("update");//메인의 함수 호출 구분값은 달리 설정(개발자가 임의로 결정)
	//화면 reload-----------------------------
	
}

</script>
</head>
<body>
<div id="web_wrap">
    <div class="web_container">
    
      <!-- Sub 영역 -->
      <div id="web_content2">
        <div class="certify_wrap">
          <div class="certify_cnt">
            <p class="tit">샘플</p>
            <div class="certify_input">
              <label for="테스트 항목명">테스트 항목명</label>
              <div class="clear">
                <p class="brand_nm f_l" id="md_nm"></p><p class="brand_nb f_r" id="md_cd"></p>
              </div>
              <label for="테스트1">테스트1</label>
              <select id="sel_store"></select>
              <label for="테스트2">테스트2</label>
              <input type="text" maxlength="6" id="crtfc_num" disabled>
              <label for="테스트3">테스트3</label>
              <input type="text" maxlength="6" id="mod_crtfc_num">
            </div>
          </div>
          <div class="certify_btn">
            <a href="javascript:insert();">등록</a>
          </div>
        </div>
      </div>
      <!-- Sub 영역 -->
      
    </div>
    <!-- 워터마크 영역 -->
    <div id="back_mark"></div>
    <!-- 워터마크 영역 -->
  </div>
</body>
</html>
