<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

 <script type="text/javascript">

	
 
 
 
//화면 로드 시 실행
$(document).ready(function() {
	
	
	screenLog("조회", "web_cp_campdraftbrand_sub01", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>행사유형",get_client_ip);//화면 로그(공통)
  	
	if(bmpevtTy_cd == "1"){
		 $("ul li.index01 a").addClass("on");
	 }else if(bmpevtTy_cd == "2"){
		 $("ul li.index02 a").addClass("on");
	 }
	 
	
	if(bmpevtTy_cd == ""){
		//클릭 시 class on 변경
		$("ul li.index01 a").click(function() {
			$("ul li.index01 a").addClass("on"); //Remove any "active" class
			$("ul li.index02 a").removeClass("on"); //Add "active" class to selected tab
		});
		
		$("ul li.index02 a").click(function() {
			$("ul li.index02 a").addClass("on"); //Remove any "active" class
			$("ul li.index01 a").removeClass("on"); //Add "active" class to selected tab
		});	
	}
	
	
	if(web_dvt_ty_coice == "Y"){
		$("#regist_box").css("display","none");
	}else{
		$("#regist_box").css("display","");
	}
	
 });

 
/**========================================================================================
* 작성시작
========================================================================================*/
function regist(bmpevtTy_cd_flag, yn_flag){
 
 if(cate_cd == "" || cate_cd == null){
	 cmdMessage(0, "카테고리 코드가 존재 하지 않습니다.");
	 return;
 }
 
 if(!yn_flag){yn_flag = "N";}
 
 //20191231 추가. 신세계 제휴 카드사 고객 대상 알리기 인 경우 안내 메시지창 띄우기
 if(yn_flag == 'N' && bmpevtTy_cd_flag == "1"){
	 var alertMsg = "";
	 
	 alertMsg += "현재 FIT PARTNERS의 파일럿 기간으로,\n";
	 alertMsg += "프로모션의 비용(발송비, 사은행사 등)은 신세계에서 부담합니다.\n";
	 alertMsg += "향후 정책 변경 시에는 공지사항에 사전 공유 예정입니다.";
	 
	 cmdMessage(0, alertMsg);
	}
 
  $("#bmpevtTy_cd").val(bmpevtTy_cd_flag);
  
  var str = "";
  
  if(bmpevtTy_cd_flag == "1"){
  	str = "신세계 제휴 카드사 고객 대상 알리기";
  }else if(bmpevtTy_cd_flag == "2"){
  	str = "신세계 포인트 회원 전체 알리기";
  }else if(bmpevtTy_cd_flag == "3"){
  	str = "신세계 임직원 대상 알리기";
  }
  
  if(yn_flag == "Y"){ctrtdoc_ncss_yn = yn_flag;}
  
  /*	
  if(cmdMessage(1, str+"\n\n행사를 생성 하시겠습니까?") == false){
  	return;
  }
  */
  
  //등급별 고객모형권한 조회
  var custMdlAuthChkTm = new oza_TMHandler('com.obzen.bmp.DocBMPComm', 'selectCustMdlAuthChk', '1', '\@#%');
  custMdlAuthChkTm.setAddDataField('MD_CD', md_cd);
  custMdlAuthChkTm.setAddDataField('BMPEVT_TY_CD', bmpevtTy_cd_flag);
  custMdlAuthChkTm.returnlist('MDL_AUTH');
  custMdlAuthChkTm.execute(null, false);
  var mdl_auth = custMdlAuthChkTm.ElementValue('MDL_AUTH');//고객모형권한
  custMdlAuthChkTm.clear();
  
  //권한이 없을 경우
  if(mdl_auth == "N"){cmdMessage(0,"접근 가능한 고객군 모형이 없습니다.");return;}
  
  
	//행사 가능한 점포 유무 체크
  var mdStoreAuthChkTm = new oza_TMHandler('com.obzen.bmp.DocBMPComm', 'selectMdStoreAuthChk', '1', '\@#%');
  mdStoreAuthChkTm.setAddDataField('MD_CD', md_cd);
  mdStoreAuthChkTm.setAddDataField('USERID', user_id);
  mdStoreAuthChkTm.returnlist('STORE_AUTH');
  mdStoreAuthChkTm.execute(null, false);
  var store_auth = mdStoreAuthChkTm.ElementValue('STORE_AUTH');//점포유무
  mdStoreAuthChkTm.clear();
  
  //권한이 없을 경우
  if(store_auth == "N"){cmdMessage(0,"현재 MD코드로 등록 가능한 점포가 없습니다.");return;}
  
  
  lodingImgOn();//백그라운드 이미지 활성(더블클릭방지)
  
  var insertTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'insertCampID', '1', '\@#%');
  insertTm.setAddDataField('USERID', user_id);
  insertTm.returnlist('LOGMSG;CAMP_ID');
  insertTm.execute(null, false);
  var msg = insertTm.ElementValue('LOGMSG');//리턴 처리 메시지
  var return_camp_id = insertTm.ElementValue('CAMP_ID');//리턴 캠페인 아이디
  insertTm.clear();
  
  screenLog("등록", "web_cp_campdraftbrand_sub01", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>행사유형",get_client_ip);//화면 로그(공통)
  
  //cmdMessage(0,msg);
  
  flag = "2";
	camp_id = return_camp_id;
	bmpevtTy_cd = $("#bmpevtTy_cd").val();
	do_RefreshPage("onload");
	 
}
</script>
<input type="hidden" id="bmpevtTy_cd" />


<div class="index_wrap">
  <div class="campaign_index">
    <div class="index_tit">
      <strong>행사 유형 선택</strong>
      <p>브랜드 행사 홍보 방식을 선택해 주세요.</p>
      <a href="javascript:regist('1','Y');">버튼</a>
    </div>
    <div class="index_cnt">
      <ul>
        
        <li class="index02">
          <strong>신세계 제휴 카드사 고객 대상 알리기<br>(신세계 프로모션 활용 가능)</strong>
          <p>
            브랜드에서 준비한 혜택과 상품에 신세계 프로모션<br>(세일리지/사은행사/멤버스바 음료권外)을 더하여 구매확률 높은 신세계 제휴카드(씨티, 삼성, 신한, 하나)고객에게 행사를 알려 보세요.<br>※신세계 포인트 회원 접근 불가
          </p>
          <a href="javascript:regist('1');">행사 생성하기</a>
        </li>
        <li class="index01">
          <strong>신세계 포인트 회원 전체 알리기<br>(신세계 프로모션 활용 불가)</strong>
          <p>
            브랜드에서 준비한 혜택과 상품에 신세계 전체 회원<br>(제휴카드 + 포인트)에게 행사를 알려보세요.
          </p>
          <a href="javascript:regist('2');">행사 생성하기</a>
        </li>
        
      </ul>
      <div class="index03">
        <strong>신세계 임직원 대상 알리기</strong>
        <p>임직원에게만 적용, 노출되는 행사를 생성할 수 있습니다.</p>
        <a href="javascript:regist('3');">행사 생성하기</a>
      </div>
    </div>
  </div>
</div>
