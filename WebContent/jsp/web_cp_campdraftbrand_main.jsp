<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title> 캠페인 기획</title>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->

<%
String camp_id = XSScheck(request.getParameter("camp_id"));
%>

<script type="text/javascript">
var flag = "1";//화면 이동 정보
var md_cd = "";
var user_id = "";
var camp_id = "";
var camp_nm = "";
var bmpevtTy_cd = "";
var camp_ex_ty = "";//캠페인 실행 유형
var camp_stat = "";//캠페인 상태 값
var web_dvt_ty_coice = "N";//행사유형 0000
var camp_base_reg = "N";//행사정보입력 0100
var camp_approach_cust = "N";//접근고객선택 0106
var camp_offer_select = "N";//프로모션선택 0107
var camp_approach_chan = "N";//채널/발송일 선택 0110
var chan_script = "N";//채널 문구 작성 0300
var camp_confirm = "N";//검토 요청 0380
var camp_reject_yn = "N";//반려 0395
var camp_complete_yn = "N";//승인의뢰(완료) 0400
var cprn_comp_cd = "";
var chk_msg_snd_yn = "";
var reg_id = "";
var content_flag = "";
var cate_cd = "";
var ctrtdoc_ncss_yn = "";


//수정가능영부
var mod_flag = "Y";

//복사여부
var copy_yn = "N";


var c_camp_id = "";//복사 행사 아이디
var s_store_cd = "";//복사전 선택한 점포 코드
var s_store_nm = "";//복사전 선택한 점포명
var s_evt_flr = "";//복사전 선택한 층정보

 //화면 로드 시 실행
 $(document).ready(function() {
		
	 //분석화면 링크 시 
	 if("<%=camp_id%>" != ""){camp_id = "<%=camp_id%>"; flag = "2";}

	 
	 do_RefreshPage("onload");
});


 //필수 함수 
 //명칭 수정 금지
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
		if(gubun == "onload"){
			web_Init(window);//세션정보
			md_cd = wevMdCd;
			user_id = webUserId;
			cprn_comp_cd = webCopCd;
		}
	 
	 
		//TM Start ===============================================================================================
		//카테고리 CD 조회
		var cateCdTm = new oza_TMHandler('com.obzen.bmp.DocBMPComm', 'selectCateCd', '1', '\@#%');
		cateCdTm.setAddDataField('MD_CD', md_cd);
		cateCdTm.returnlist('CATE_CD');
		cateCdTm.execute(null, false);
		cate_cd = cateCdTm.ElementValue('CATE_CD');//카테고리
		cateCdTm.clear();
		//TM End =================================================================================================	

		
		
		
	 if(gubun == "new"){
		 flag = "1";
		 camp_id = "";
		 camp_nm = "";
		 bmpevtTy_cd = "";
		 web_dvt_ty_coice = "N";//행사유형 0000
		 camp_base_reg = "N";//행사정보입력 0100
		 camp_approach_cust = "N";//접근고객선택 0106
		 camp_offer_select = "N";//프로모션선택 0107
		 camp_approach_chan = "N";//채널/발송일 선택 0110
		 chan_script = "N";//채널 문구 작성 0300
		 camp_confirm = "N";//검토 요청 0380
	 }
	 
	//TM Start ===============================================================================================
	//캠페인 정보 검색-------------------------
	var campTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'selectCampDraftBrandInfo', '1', '\@#%');
	campTm.setAddDataField('CAMP_ID', camp_id);
	campTm.returnlist('CAMP_EX_TY;CAMP_NM;CAMP_OZID;CAMP_BRCH;CAMP_STAT;CAMP_DRFT_DT;CAMP_ID');
	campTm.execute(null, false);
	
	camp_nm = campTm.ElementValue('CAMP_NM');
	camp_ex_ty = campTm.ElementValue('CAMP_EX_TY');
	camp_stat = campTm.ElementValue('CAMP_STAT');//최종 상태
	campTm.clear();

	//수정불가
	if(parseInt(camp_stat) == 380){
		mod_flag = "N";
	}else if(parseInt(camp_stat) == 381){
		mod_flag = "N";
	}else if(parseInt(camp_stat) == 382){
		mod_flag = "N";
	}else if(parseInt(camp_stat) == 385){
		mod_flag = "N";
	}else if(parseInt(camp_stat) == 386){
		mod_flag = "N";
	}else if(parseInt(camp_stat) == 387){
		mod_flag = "N";
	}else if(parseInt(camp_stat) == 388){
		mod_flag = "N";
	}else if(parseInt(camp_stat) == 389){
		mod_flag = "N";
	}else if(parseInt(camp_stat) >= 400){
		mod_flag = "N";
	}else{
		mod_flag = "Y";
	}
	

	//캠페인 상태 이력 조회-------------------------
	var campHisTm = new oza_TMHandler('com.obzen.bmp.ColCampSearch', 'selectCampHistMng', '0', '\@#%');
	campHisTm.setAddDataField('CAMP_ID', camp_id);
	campHisTm.execute(null, false); //  tm 실행
	var tmResult = campHisTm.getResult(); //  컬렉션 TM 결과 호출
	var tmResult_json = "";
	if(tmResult != ""){
		tmResult_json = JSON.parse(tmResult);
		
		
		web_dvt_ty_coice = "N";//행사유형 0000
		camp_base_reg = "N";//행사정보입력 0100
		camp_approach_cust = "N";//접근고객선택 0106
		camp_offer_select = "N";//프로모션선택 0107
		camp_approach_chan = "N";//채널/발송일 선택 0110
		chan_script = "N";//채널 문구 작성 0300
		camp_confirm = "N";//검토 요청 0380
		camp_reject_yn = "N";//반려 0395
		camp_complete_yn = "N";//승인의뢰(완료) 0400
		
		for(var i=0; i<tmResult_json.length; i++) { //  결과값 숫자형 변환
			if(tmResult_json[i].HM_CAMP_STAT == "0000"){web_dvt_ty_coice = "Y";}
			else if(tmResult_json[i].HM_CAMP_STAT == "0100"){camp_base_reg = "Y";}
			else if(tmResult_json[i].HM_CAMP_STAT == "0106"){camp_approach_cust = "Y";}
			else if(tmResult_json[i].HM_CAMP_STAT == "0107"){camp_offer_select = "Y";}
			else if(tmResult_json[i].HM_CAMP_STAT == "0110"){camp_approach_chan = "Y";}
			else if(tmResult_json[i].HM_CAMP_STAT == "0300"){chan_script = "Y";}
			else if(tmResult_json[i].HM_CAMP_STAT == "0380" || tmResult_json[i].HM_CAMP_STAT == "0382"){camp_confirm = "Y";}
			else if(tmResult_json[i].HM_CAMP_STAT == "0395"){camp_reject_yn = "Y";}
			else if(tmResult_json[i].HM_CAMP_STAT == "0400"){camp_complete_yn = "Y";}
		}
	}
	campHisTm.clear();
	//TM End =================================================================================================	

	
		//첫 번째 화면 로드
		webPageMove(flag);
	  	
  	//최초 로딩 시 스타일 설정-----------------------
  	if(camp_id != "" && camp_id != null){
  		$("#camp_dl").css("display","");
  		$("#camp_p").css("display","none");
  	}else{
  		$("#camp_dl").css("display","none");
  		$("#camp_p").css("display","");
  	}
  
  	//최초 로딩 시 스타일 설정-----------------------
  	
  	
  	
  	//캠페인 아이디, 명 설정
  	$("#camp_id").val(camp_id);
  	
  	//작성시작 완료 일때
  	if(parseInt(camp_stat) > 0){$("#camp_nm").val(camp_nm);}
 }

 /**========================================================================================
  * 화면 이동
  ========================================================================================*/
 function webPageMove(flag, flag_gubun){
	var actionUrl = "";
	$('html, body').animate({scrollTop: $('#web_cmp_content').offset().top}, 'fast');
	
	styleTop(flag);
	
	//행사유형
	if(flag == "1"){
		if(camp_id != ""){return;}
		actionUrl = "web_cp_campdraftbrand_sub01.jsp";
	//행사정보 입력
	}else if(flag == "2"){
		actionUrl = "web_cp_campdraftbrand_sub02.jsp";
		
		if(web_dvt_ty_coice == "N"){return ;}
	//접근고객 선택
	}else if(flag == "3"){
		actionUrl = "web_cp_campdraftbrand_sub03.jsp";
		if(camp_base_reg == "N"){return;}
	//프로모션 선택	
	}else if(flag == "4"){
		actionUrl = "web_cp_campdraftbrand_sub04.jsp";
		
		if(camp_approach_cust == "Y" && (bmpevtTy_cd == "2" || bmpevtTy_cd == "3")){
			cmdMessage(0,"신세계 고객 대상 알리기 + 신세계 프로모션 유형만 작성 할 수 있습니다.");
			return;
		}else{
			if(camp_approach_cust == "N"){return;}	
		} 
	
	//채널/발송일 선택
	}else if(flag == "5"){
		actionUrl = "web_cp_campdraftbrand_sub05.jsp";
		
		if(camp_approach_cust == "N"){return;}
		if(bmpevtTy_cd != "2" && bmpevtTy_cd != "3"){
			if(camp_offer_select == "N"){return;}
		}
		
	//채널문구 작성
	}else if(flag == "6"){
		actionUrl = "web_cp_campdraftbrand_sub06.jsp";
		
		
		if(camp_approach_chan == "Y" && chk_msg_snd_yn == "N"){
			cmdMessage(0,"문자 전송 안함 선택 시 작성 할 수 없습니다.");
			return;
		}else{
			if(camp_approach_chan == "N"){return;}	
		}
		
		
	//검토 요청
	}else if(flag == "7"){
		actionUrl = "web_cp_campdraftbrand_sub07.jsp";
		
		if(camp_approach_chan == "N"){return;}
		if(chk_msg_snd_yn == "Y"){
			if(chan_script == "N"){return;}	
		}
		
		content_flag = flag_gubun;
	}
	
	
	
	//Page로 이동  
	var param = "camp_id="+camp_id+"&bmpevtTy_cd="+bmpevtTy_cd;
 	$.ajax({
 		url:actionUrl,
		data:param,
		type:"POST",
	 	beforeSend : function(){
	 		spinStart();
		},
	 	success:function(result) {
	 		styleTopMove(flag);//스타일 변경
	 		$("#web_cmp_content").html(result);
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
 
 
 /**========================================================================================
  * 상단 네이게이션 스타일 변경
  ========================================================================================*/
 function styleTop(flag){
 
	 //첫페이지 상단 네비게이션 안보이게 하기 
	 if(flag == "1"){$("#top_navigation").css("display","none");}
	 else{$("#top_navigation").css("display","");}

	 
	 
	 $(".list1").css("cursor","pointer");
	 
   //행사유형
	 if(web_dvt_ty_coice == "Y"){
		 if(!$(".list1").hasClass("on")){
			 $(".list1").addClass("off");	 
		 }
		$(".list2").css("cursor","pointer");
	 }else{
  	$(".list1").removeClass("off");
  	$(".list2").css("cursor","default");
   }

	 //행사정보입력
	 if(camp_base_reg == "Y"){
		 if(!$(".list2").hasClass("on")){
			 $(".list2").addClass("off");	 
		 }
  	 $(".list3").css("cursor","pointer");
	 }else{
  	 $(".list2").removeClass("off");
  	 $(".list3").css("cursor","default");
	 }

	 //접근고객
	 if(camp_approach_cust == "Y"){
		 if(!$(".list3").hasClass("on")){
			 $(".list3").addClass("off");	 
		 }
  	 
		 if(bmpevtTy_cd == "2" || bmpevtTy_cd == "3"){
			 $(".list4").css("cursor","default");
		 }else{
			 $(".list4").css("cursor","pointer");	 
		 }
		 
  	}else{
  	 $(".list3").removeClass("off");
  	 $(".list4").css("cursor","default");
   }

	 //프로모션
	 if(camp_offer_select == "Y"){
		 if(!$(".list4").hasClass("on")){
			 $(".list4").addClass("off");	 
		 }
  	 $(".list5").css("cursor","pointer");
	 }else{
  	 $(".list4").removeClass("off");
  	 
  	if(camp_approach_cust == "Y" && (bmpevtTy_cd == "2" || bmpevtTy_cd == "3")){
  		$(".list5").css("cursor","pointer");
  	}else{
  		$(".list5").css("cursor","default");
  	}
  }

	 //채널발송일
	 if(camp_approach_chan == "Y"){
		 if(!$(".list5").hasClass("on")){
			 $(".list5").addClass("off");	 
		 }
		 
		 if(chk_msg_snd_yn == "Y"){
			 $(".list6").css("cursor","pointer");
		 }else{
			 $(".list6").css("cursor","default");
		 }
		 
	 }else{
  	 $(".list5").removeClass("off");
  	 $(".list6").css("cursor","default");
	 }

	 //채널 문구
	 if(chan_script == "Y"){
		  if(!$(".list6").hasClass("on")){
			  $(".list6").addClass("off");	 
		  }
  	  $(".list7").css("cursor","pointer");
	 }else{
  	  $(".list6").removeClass("off");
  	 
    	if(camp_approach_chan == "Y" && chk_msg_snd_yn == "N"){
    		$(".list7").css("cursor","pointer");
    	}else{
    		$(".list7").css("cursor","default");
    	}
  	}

	 
	 //검토 요청
	 if(camp_confirm == "Y"){
		 if(!$(".list7").hasClass("on")){
			 $(".list7").addClass("off");	 
		 }
		 $(".list7").css("cursor","pointer");
	 }else{
  	 $(".list7").removeClass("off");
  	}
  }
 
 
 /**========================================================================================
  *  상단 네이게이션 스타일 변경(이동시)
  ========================================================================================*/
 function styleTopMove(flag){
	//첫페이지 상단 네비게이션 안보이게 하기 
	 if(flag == "1"){$("#top_navigation").css("display","none");}
	 else{$("#top_navigation").css("display","");}
	 
	 if(flag == "1"){
		$(".list1").addClass("on");$(".list1").removeClass("off");
		$(".list2").removeClass("on");
		$(".list3").removeClass("on");
		$(".list4").removeClass("on");
		$(".list5").removeClass("on");
		$(".list6").removeClass("on");
		$(".list7").removeClass("on");
	}else if(flag == "2"){
		$(".list1").removeClass("on");
		$(".list2").addClass("on");$(".list2").removeClass("off");
		$(".list3").removeClass("on");
		$(".list4").removeClass("on");
		$(".list5").removeClass("on");
		$(".list6").removeClass("on");
		$(".list7").removeClass("on");
	}else if(flag == "3"){
		$(".list1").removeClass("on");
		$(".list2").removeClass("on");
		$(".list3").addClass("on");$(".list3").removeClass("off");
		$(".list4").removeClass("on");
		$(".list5").removeClass("on");
		$(".list6").removeClass("on");
		$(".list7").removeClass("on");
	}else if(flag == "4"){
		$(".list1").removeClass("on");
		$(".list2").removeClass("on");
		$(".list3").removeClass("on");
		$(".list4").addClass("on");$(".list4").removeClass("off");
		$(".list5").removeClass("on");
		$(".list6").removeClass("on");
		$(".list7").removeClass("on");
	}else if(flag == "5"){
		$(".list1").removeClass("on");
		$(".list2").removeClass("on");
		$(".list3").removeClass("on");
		$(".list4").removeClass("on");
		$(".list5").addClass("on");$(".list5").removeClass("off");
		$(".list6").removeClass("on");
		$(".list7").removeClass("on");
	}else if(flag == "6"){
		$(".list1").removeClass("on");
		$(".list2").removeClass("on");
		$(".list3").removeClass("on");
		$(".list4").removeClass("on");
		$(".list5").removeClass("on");
		$(".list6").addClass("on");$(".list6").removeClass("off");
		$(".list7").removeClass("on");
	}else if(flag == "7"){
		$(".list1").removeClass("on");
		$(".list2").removeClass("on");
		$(".list3").removeClass("on");
		$(".list4").removeClass("on");
		$(".list5").removeClass("on");
		$(".list6").removeClass("on");
		$(".list7").addClass("on");$(".list7").removeClass("off");
	}
	 
	 styleTop(flag);
 }
 
 
 /**========================================================================================
  * 새로 만들기
  ========================================================================================*/
  function create(){
	 
	 /*
    if(cmdMessage(1, "새로만들기를 진행 하시겠습니까?") == false){
      	return;
    }
   */
   
    do_RefreshPage("new");
  }
 

 
 /**========================================================================================
  * 검색(팝업 호출)
  ========================================================================================*/
 function searchPopup() {
	 var name = "web_cp_campsearch";
   var option = "location=no,menubar=no,resizable=no,scrollbars=no,titlebar=no,toolbar=no";
   
 	 //해상도 계산하여 위치 조절
	 var popupX = (document.body.offsetWidth / 2) - (200 / 2);
   var popupY = (document.body.offsetHeight / 2) - (300 / 2);
	 
	 option += ",top="+popupY+",left="+popupX+",height=512,width=825";
   
	 var frm = $("form#frm")[0];
   frm.r_flag.value = flag;
   frm.r_camp_id.value = camp_id;
   frm.r_camp_stat.value = camp_stat;
   frm.r_bmpevtTy_cd.value = bmpevtTy_cd;
   frm.shn_crd_evt_yn.value = "N";
	 
   var ret = window.open("web_cp_campsearch_pop.jsp", name, option);
   
   /*
   //post 방식
   var frm = $("form#frm")[0];
   frm.r_flag.value = flag;
   frm.r_camp_id.value = camp_id;
   frm.r_camp_stat.value = camp_stat;
   frm.r_bmpevtTy_cd.value = bmpevtTy_cd;
   frm.shn_crd_evt_yn.value = "N";
   frm.action = "web_cp_campsearch_pop.jsp";
   frm.target = name;
   frm.method = "post";
   frm.submit();
   */
   
   $("#mask").css("display","");//팝업 호출 시 보이게 설정
   
   $('#mask').click(function() {
 		ret.focus();
 	});
   
}    
 
 
 /**========================================================================================
  * 팝업 반환값
  ========================================================================================*/
 function getReturnValue(pageParam){
	var refresh_flag = "";
	
	if(pageParam != ""){
		copy_yn = pageParam[1].value;
		
		if(copy_yn == "Y"){c_camp_id = pageParam[0].value;}
		else{camp_id = pageParam[0].value;}
		
		refresh_flag = "return";
			
	}else{
		refresh_flag = "new";
	}
	
	flag = "2";
	if(copy_yn != "Y"){bmpevtTy_cd = "";}
	web_dvt_ty_coice = "N";//행사유형 0000
 	camp_base_reg = "N";//행사정보입력 0100
 	camp_approach_cust = "N";//접근고객선택 0106
 	camp_offer_select = "N";//프로모션선택 0107
 	camp_approach_chan = "N";//채널/발송일 선택 0110
 	chan_script = "N";//채널 문구 작성 0300
 	camp_confirm = "N";//검토 요청 0380
 	
 	do_RefreshPage(refresh_flag);
 }
 
 

/**========================================================================================
* 로딩 시작(서브 페이지용)
========================================================================================*/ 
function loadingStart(){
	spinStart("1");
} 


/**========================================================================================
* 로딩 종료(서브 페이지용)
========================================================================================*/ 
function loadingStop(){
	spinStop();
}
 
 
</script>

</head>

<body id="body_frame">
<form id="frm" method="post">
<input type="hidden" id="r_flag" name="r_flag"/>
<input type="hidden" id="r_camp_id" name="r_camp_id"/>
<input type="hidden" id="r_camp_stat" name="r_camp_stat"/>
<input type="hidden" id="r_bmpevtTy_cd" name="r_bmpevtTy_cd"/>
<input type="hidden" id="shn_crd_evt_yn" name="shn_crd_evt_yn"/>



	<div id="web_wrap">
		<div class="web_container">
			<div id="web_content2">
				<div class="campaign_wrap">
					<div class="campaign_top">
						<div class="campaign_sel">
							<dl id="camp_dl" style="display:none;">
								<dt>선택된 캠페인명</dt>
								<dd>
									<input type="text" class="c_code" id="camp_id" name="camp_id" disabled />
									<input type="text" class="c_title" id="camp_nm" name="camp_nm" disabled />
								</dd>
							</dl>
							<p id="camp_p" style="display:none;">캠페인 기본정보를 등록해 주세요.</p>
							<div class="btn_box">
								<a href="javascript:searchPopup();" class="btn_search">불러오기</a>
								<a href="javascript:create();" class="btn_new">새로만들기</a>
							</div>
						</div>
            
            <div class="campaign_stage" id="top_navigation" >
              <ul>
              
                <!-- 안보이게 처리 시작-->
                <li class="list1" onclick="javascript:webPageMove('1');" style="display:none">
                  <div>
                    <p class="stage">step 0</p>
                    <p class="stage_txt">행사 유형</p>
                  </div>
                </li>
                <!-- 안보이게 처리 종료-->
                
                
                 
                <li class="list2" onclick="javascript:webPageMove('2');">
                  <div>
                    <p class="stage">step 1</p>
                    <p class="stage_txt">행사정보 입력</p>
                  </div>
                </li>
                <li class="list3" onclick="javascript:webPageMove('3');">
                  <div>
                    <p class="stage" >step 2</p>
                    <p class="stage_txt">접근고객 선택</p>
                  </div>
                </li>
                <li class="list4" onclick="javascript:webPageMove('4');">
                  <div>
                    <p class="stage" >step 3</p>
                    <p class="stage_txt">프로모션 선택</p>
                  </div>
                </li>
                <li class="list5" onclick="javascript:webPageMove('5');">
                  <div>
                    <p class="stage" >step 4</p>
                    <p class="stage_txt">채널/발송일선택</p>
                  </div>
                </li>
                <li class="list6" onclick="javascript:webPageMove('6');">
                  <div>
                    <p class="stage">step 5</p>
                    <p class="stage_txt">채널문구 작성</p>
                  </div>
                </li>
                <li class="list7" onclick="javascript:webPageMove('7');">
                  <div>
                    <p class="stage">step 6</p>
                    <p class="stage_txt">검토 요청</p>
                  </div>
                </li>
                
                 
                <!--
                <li class="list2">
                  <div>
                    <p class="stage">step 1</p>
                    <p class="stage_txt">행사정보 입력</p>
                  </div>
                </li>
                <li class="list3">
                  <div>
                    <p class="stage" >step 2</p>
                    <p class="stage_txt">접근고객 선택</p>
                  </div>
                </li>
                <li class="list4">
                  <div>
                    <p class="stage" >step 3</p>
                    <p class="stage_txt">프로모션 선택</p>
                  </div>
                </li>
                <li class="list5">
                  <div>
                    <p class="stage" >step 4</p>
                    <p class="stage_txt">채널/발송일선택</p>
                  </div>
                </li>
                <li class="list6">
                  <div>
                    <p class="stage">step 5</p>
                    <p class="stage_txt">채널문구 작성</p>
                  </div>
                </li>
                <li class="list7">
                  <div>
                    <p class="stage">step 6</p>
                    <p class="stage_txt">검토 요청</p>
                  </div>
                </li>
                 -->
                
              </ul>
            </div>
          
          </div>
					
					<!-- content 영역 -->
					<div id="web_cmp_content"></div>
          <!-- content 영역 -->
          
				</div>
			</div>
      
      
      
      <!-- 워터마크 영역 -->
      <div id="back_mark"></div>
      <!-- 워터마크 영역 -->
      
		</div>
	</div>
	
	
</form>
</body>
</html>
