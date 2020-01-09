<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
 <script type="text/javascript">
  
 var custg_mdl_id_list = "";
 var spec_cust_list = "";
 var slideIndex = 4;
 var view_height = "";
 
 
//TM Start ===============================================================================================
//MD별 기본정보 조회(등급, 접근고객수)-------------------------	
var platform_grd = "";
var store_grd = "";	
var cust_cnt = "";
var bmp_cust_cnt = "";

var mdInfoTm = new oza_TMHandler('com.obzen.bmp.DocApproachCust', 'selectMDInfo', '1', '\@#%');
mdInfoTm.setAddDataField('CAMP_ID', camp_id);
mdInfoTm.returnlist('INTG_BRAN_NM;PLATFORM_GRD;STORE_GRD;CUST_CNT;BMP_CUST_CNT');
mdInfoTm.execute(null, false);

intg_bran_nm = mdInfoTm.ElementValue('INTG_BRAN_NM');//브랜드명
platform_grd = mdInfoTm.ElementValue('PLATFORM_GRD');//플랫폼등급
store_grd = mdInfoTm.ElementValue('STORE_GRD');//매장등급
cust_cnt = mdInfoTm.ElementValue('CUST_CNT');//최대 접근가능 고객수
bmp_cust_cnt = mdInfoTm.ElementValue('BMP_CUST_CNT');//최대 접근가능 고객수
mdInfoTm.clear();

//타겟 주제별 접근 고객수 조회-------------------------	
var custCntTm = new oza_TMHandler('com.obzen.bmp.ColApproachCust', 'selectCustCnt', '0', '\@#%');
custCntTm.setAddDataField('CAMP_ID', camp_id);
custCntTm.setAddDataField('APP_CUST_CNT', cust_cnt);
custCntTm.execute(null, false);

var custCntTmResult = custCntTm.getResult();
var custCntTm_json = "";
if(custCntTmResult != ""){custCntTm_json = JSON.parse(custCntTmResult);}
custCntTm.clear();



//고객수 재조회
var spec_cust = 0;

var selCustCntTm = new oza_TMHandler('com.obzen.bmp.DocApproachCust', 'selectCustCntSum', '1', '\@#%');
selCustCntTm.setAddDataField('CAMP_ID', camp_id);
selCustCntTm.returnlist('CUST_CNT;BMP_CUST_CNT');
selCustCntTm.execute(null, false);
spec_cust = selCustCntTm.ElementValue('CUST_CNT');//중복제거된 고객수
selCustCntTm.clear();
//TM End =================================================================================================	


 
 //화면 로드 시 실행
 $(document).ready(function() {
	 //$('html, body').animate({scrollTop: $('#web_cmp_content').offset().top}, 'fast');
	 
	 screenLog("조회", "web_cp_campdraftbrand_sub03", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>접근고객선택",get_client_ip);//화면 로그(공통)
	 
	 
	 //플랫폼 등급 이미지 분기
	 var platform_grd_html = "";
	 if(platform_grd == "50"){
		 $("#platform_grd").addClass("rating5");
		 platform_grd_html += "<img src='../img/web/icon/p_rating5.png' alt=''> Level 5";
	 }else if(platform_grd == "40"){
		 $("#platform_grd").addClass("rating4");
		 platform_grd_html += "<img src='../img/web/icon/p_rating4.png' alt=''> Level 4";
	 }else if(platform_grd == "30"){
		 $("#platform_grd").addClass("rating3");
		 platform_grd_html += "<img src='../img/web/icon/p_rating3.png' alt=''> Level 3";
	 }else if(platform_grd == "20"){
		 $("#platform_grd").addClass("rating2");
		 platform_grd_html += "<img src='../img/web/icon/p_rating2.png' alt=''> Level 2";
	 }else if(platform_grd == "10"){
		 $("#platform_grd").addClass("rating1");
		 platform_grd_html += "<img src='../img/web/icon/p_rating1.png' alt=''> Level 1";
	 }
	 
	 
	 
	 //매장 등급 이미지 분기
	 var store_grd_html = "";
	 if(store_grd == "A"){
		 store_grd_html += "<img src='../img/web/icon/s_rating1.png' alt=''>";
	 }else if(store_grd == "B"){
		 store_grd_html += "<img src='../img/web/icon/s_rating2.png' alt=''>";
	 }else if(store_grd == "C"){
		 store_grd_html += "<img src='../img/web/icon/s_rating3.png' alt=''>";
	 }else if(store_grd == "D"){
		 store_grd_html += "<img src='../img/web/icon/s_rating4.png' alt=''>";
	 }else if(store_grd == "E"){
		 //store_grd_html += "<img src='../img/web/icon/s_rating5.png' alt=''>";
		 store_grd_html += "<img src='../img/web/icon/s_rating6.png' alt=''>";
	 }
	 
	 
	 $("#intg_bran_nm").text(intg_bran_nm);
	 $("#platform_grd").html(platform_grd_html);
	 $("#store_grd").html(store_grd_html);
	 $("#cust_cnt").html("<strong>"+AddComma(isNullZero(cust_cnt))+"</strong>명");
	 $("#bmp_cust_cnt").html("<span>/</span><strong>"+AddComma(isNullZero(bmp_cust_cnt))+"</strong>명");
	 
	 //$("#spec_cust_sum").html("합산고객<strong>"+AddComma(cust_cnt)+"<span>명</span></strong>");
	 //$("#cust_cnt2").text(AddComma(cust_cnt));

	 $("#notice_txt").html("<p><span class=''></span></p>");
	 $("#spec_cust").text(AddComma(isNullZero(spec_cust)));
	 
	 //bmpevtTy_cd = "3";
	 
	 
	 $(".top1").css("width","35%");
	 $(".top2").css("width","20%");
	 $(".top3").css("width","45%");
	 $(".top4").css("display","none");
	 
	 /*
	 //임직원 행사 유형이 아니면
	 if(bmpevtTy_cd != "3"){
		 $(".top1").css("width","25%");
		 $(".top2").css("width","20%");
		 $(".top3").css("width","27.5%");
		 $(".top4").css("width","27.5%");
		 $(".top4").css("display","");
	 }else{
		 $(".top1").css("width","35%");
		 $(".top2").css("width","20%");
		 $(".top3").css("width","45%");
		 $(".top4").css("display","none");
	 }
	 */
	 
	 
	 designSlideDiv();//슬라이드 영역 그리기
	 
	 plusSlides(0, "");//슬라이드 이동
	 
	 view_height = $(document).scrollTop();
	 view_height = parseInt(view_height) + parseInt(document.body.offsetHeight);
	 
	 $(window).scroll(function(){
		 view_height = $(document).scrollTop();
		 view_height = parseInt(view_height) + parseInt(document.body.offsetHeight);
		});
	 
	 
	 if(parseInt(isNullZero(cust_cnt))  >= parseInt(isNullZero(spec_cust))){
		 $("#notice_txt").html("<p><span class='pass'>선정 고객 접근 가능</span></p>"); 
	 }else{
		 $("#notice_txt").html("<p><span class='nopass'>접근 가능 고객 수 초과</span></p>");
	 }
	 
	 
	 //수정불가
	 if(mod_flag == "N" || (user_id != reg_id)){
		 $("#cust_cnt_button").css("cursor","default");
		 $(".btn_prev").css("cursor","default");
		 $(".btn_next").css("cursor","default");
		}
	 
	 
	});





 /**========================================================================================
 * 슬라이드 그리기
 ========================================================================================*/
 function designSlideDiv(){
	 
	 $(".prev").addClass("off");
	  
  var divHtml = "";
  var spec_cust_cnt_input = "";
  var custg_mdl_id_input = "";
  var rage_id = "";
  var spec_cust_sum = 0;
  var class_id = "";
  var li_class_id = "";
  var grd_cust_cnt = "";
  var resc_cd_nm = "";
  var auth_yn = "";
  var custg_mdl_id = "";
  
  var slide_cnt = 0;
  
  //사용불가 설정
  var ableFlag = "";
  if(mod_flag == "N"){ableFlag = "disabled";}
  if(user_id != reg_id){ableFlag = "disabled";}
  
  custg_mdl_id_list = "";//id 셋팅 ; 로 구분
  spec_cust_list = "";//고객수 셋팅 ; 로 구분
  
  for(var i=0; i < custCntTm_json.length; i++) {
		spec_cust_cnt_input = "spec_cust_cnt"+i;
		custg_mdl_id_input = "custg_mdl_id"+i;
		rage_id = "rage_"+i;
		
		if(parseInt((i+1)%5) == 0){
			class_id = "list5";
		}else{
			class_id = "list"+(parseInt((i+1)%5));  		
		}
		
		li_class_id = "li_"+(i+1);
		
		spec_cust_sum += parseInt(isNullZero(custCntTm_json[i].SPEC_CUST_CNT));
		grd_cust_cnt = parseInt(isNullZero(custCntTm_json[i].CUST_CNT));
		auth_yn = custCntTm_json[i].AUTH_YN;
		custg_mdl_id = custCntTm_json[i].CUSTG_MDL_ID;
		resc_cd_nm = isNull(custCntTm_json[i].RESC_CD_NM);
		
		if(resc_cd_nm.length > 14){
			resc_cd_nm = resc_cd_nm.substring(0,14)+"<br>"+resc_cd_nm.substring(14,resc_cd_nm.length);
		}
		
		if(custg_mdl_id == "005"){resc_cd_nm = "AI 추천 경쟁 브랜드<br>고객";}else{resc_cd_nm = resc_cd_nm;}
		
		if(custg_mdl_id != ""){
			
			//권한에 따른 사용 불가 유무 체크
			if(mod_flag == "Y" && (user_id == reg_id)){
				if(auth_yn == "Y"){ableFlag = "";}else if(auth_yn == "N"){ableFlag = "disabled";}	
			}
			
			divHtml += "<li class='list "+class_id+"' id='"+li_class_id+"'>";
			divHtml += "<p class='tit'>"+resc_cd_nm+"</p>";
			divHtml += "<strong><span>MAX</span> "+AddComma(grd_cust_cnt)+"</strong>";
			divHtml += "<div class='input_box'>";
			divHtml += "<input type='range' "+ableFlag+" min='0' max='"+grd_cust_cnt+"' id='"+rage_id+"' value='"+custCntTm_json[i].SPEC_CUST_CNT+"' onchange=\"javascript:rangeChange(this.value,'"+rage_id+"','"+spec_cust_cnt_input+"');\">";
			//20191030 stj 수정
			//divHtml += "<p>접근 대상 고객</p>";
			divHtml += "<p>선택된 고객</p>";
			divHtml += "<input type='text' "+ableFlag+" id='"+spec_cust_cnt_input+"' name='spec_cust_cnt' value='"+AddComma(custCntTm_json[i].SPEC_CUST_CNT)+"' onblur=\"javascript:inputChange(this.value,'"+rage_id+"','"+spec_cust_cnt_input+"', '"+grd_cust_cnt+"','"+custCntTm_json[i].RESC_CD_NM+"');\" onKeyDown=\"javascript:if(event.keyCode == 13){inputChange(this.value,'"+rage_id+"','"+spec_cust_cnt_input+"', '"+grd_cust_cnt+"','"+custCntTm_json[i].RESC_CD_NM+"');}\">";
			divHtml += "<input type='hidden' id='"+custg_mdl_id_input+"' name='custg_mdl_id'  value='"+custCntTm_json[i].CUSTG_MDL_ID+"'>";
			divHtml += "</div>";
			divHtml += "</li>";
			
			
			if(i == 0){
				custg_mdl_id_list += custg_mdl_id;
				spec_cust_list += custCntTm_json[i].SPEC_CUST_CNT;
			}else{
				custg_mdl_id_list += ";"+custg_mdl_id;
				spec_cust_list += ";"+custCntTm_json[i].SPEC_CUST_CNT;
			}
			
			slide_cnt ++;
		}
	}
  
  /*
  if(parseInt((slide_cnt+1)%5) == 0){
		class_id = "list5";
	}else{
		class_id = "list"+(parseInt((slide_cnt+1)%5));  		
	}
  */
	
  li_class_id = "li_"+(parseInt(slide_cnt+1));
  divHtml += "<li class='list list5' id='"+li_class_id+"'>";
	divHtml += "<p class='tit'>기본형</p>";
	divHtml += "<strong><span>&nbsp;</span> </strong>";
	divHtml += "<div class='input_box'>";
	divHtml += "<input type='range' disabled>";
	divHtml += "<p>선택된 고객</p>";
	divHtml += "<input type='text' disabled>";
	divHtml += "</div>";
	divHtml += "</li>";
	
	li_class_id = "li_"+(parseInt(slide_cnt+2));
	divHtml += "<li class='list list5' id='"+li_class_id+"'>";
	divHtml += "<p class='tit'>기본형</p>";
	divHtml += "<strong><span>&nbsp;</span> </strong>";
	divHtml += "<div class='input_box'>";
	divHtml += "<input type='range' disabled>";
	divHtml += "<p>선택된 고객</p>";
	divHtml += "<input type='text' disabled>";
	divHtml += "</div>";
	divHtml += "</li>";
		
	li_class_id = "li_"+(parseInt(slide_cnt+3));
	divHtml += "<li class='list list5' id='"+li_class_id+"'>";
	divHtml += "<p class='tit'>기본형</p>";
	divHtml += "<strong><span>&nbsp;</span> </strong>";
	divHtml += "<div class='input_box'>";
	divHtml += "<input type='range' disabled>";
	divHtml += "<p>선택된 고객</p>";
	divHtml += "<input type='text' disabled>";
	divHtml += "</div>";
	divHtml += "</li>";

	
  
	$("#slide_div").html(divHtml);
	$("#spec_cust_sum").html("고객카드 합산 고객 수 <strong>"+AddComma(spec_cust_sum)+"<span> 명</span></strong>");
	
 }


  /**========================================================================================
  * 슬라이드바 변경 시 input에 값 설정
  ========================================================================================*/
  function rangeChange(sVal, id, input_id){
	  exe_flag = "N";
		$("#"+input_id).val(AddComma(sVal));
	 	custCntSum(id, input_id);
  }
 
  
  /**========================================================================================
  * input 값 변경 시 슬라이드 바 변경
  ========================================================================================*/
  function inputChange(sVal, id, input_id, max_value, max_nm){
	 max_value = parseInt(isNullZero(max_value));
	 exe_flag = "N";
	 
	 if(isNumber(sVal) == false){
		 	cmdMessage(0, "숫자만 입력하세요.");
		 	$("#"+input_id).val("0");
		 	$("#"+input_id).focus();
			return;
		}
	 
	 
	 
	 sVal = parseInt(isNullZero(DelComma(sVal)));
	 
	 
	 if(max_value < sVal){
		 cmdMessage(0, max_nm+" " +AddComma(max_value)+"명을 초과 할 수 없습니다.");
		 $("#"+id).val(0);
		 $("#"+input_id).val("0");
		 $("#"+input_id).focus;
		 
		 custCntSum(id, input_id);
		 //$("#notice_txt").html("<p><span class='nopass'>접근 가능 고객 수 초과</span></p>");
		 return;
	 }
	 
	 $("#"+id).val(sVal);
	 $("#"+input_id).val(AddComma(sVal));
	 
	 custCntSum(id, input_id);
  }

 
 
  /**========================================================================================
  * 선택한 접근 고객수 합
  ========================================================================================*/
  function custCntSum(id, input_id){
	  
	  var custCntSumValue = 0;
	  var spec_cust_name_value = 0;
	  var size = $("input[name='spec_cust_cnt']").length;
	  
	  spec_cust_list = "";
	  
    for(var i=0; i < size; i++){
  	  //spec_cust_name_value = $("input[name='spec_cust_cnt']").eq(i).attr("value");
  	  spec_cust_name_value = $("input[name='spec_cust_cnt']")[i].value;
  	  
  	  custCntSumValue += parseInt(DelComma(spec_cust_name_value));
  	  
  	  if(i == 0){
  		  spec_cust_list += DelComma(spec_cust_name_value);	
		  }else{
			  spec_cust_list += ";"+DelComma(spec_cust_name_value);
		  }
    }
    
    /*
    if(parseInt(cust_cnt) < custCntSumValue){
  	 cmdMessage(0, "최대 접근 가능 고객 수 "+AddComma(cust_cnt)+"명을 초과 할 수 없습니다."); 
 		 $("#"+input_id).val("0");
 		 $("#"+id).val(0);
 		 $("#"+input_id).focus;
 		 
 		 spec_cust_list = "";
 		 custCntSumValue = 0;
	
      for(var i=0; i < size; i++){
    	  spec_cust_name_value = $("input[name='spec_cust_cnt']")[i].value;
    	  
    	  custCntSumValue += parseInt(DelComma(spec_cust_name_value));
    	  
    	  
    	  if(i == 0){
    		  spec_cust_list += DelComma(spec_cust_name_value);	
 			  }else{
 				  spec_cust_list += ";"+DelComma(spec_cust_name_value);
 			  }
      } 
      
     $("#notice_txt").html("<p><span class='nopass'>접근 가능 고객 수 초과</span></p>");
      
 	 }else{
 		$("#notice_txt").html("<p><span class='pass'>선정 고객 접근 가능</span></p>");
 	 }
   */ 
    $("#spec_cust_sum").html("고객카드 합산 고객 수 <strong>"+AddComma(custCntSumValue)+"<span>명</span></strong>");
    
    exe_flag == "N";
  }
  

 /**========================================================================================
 * 이전 단계
 ========================================================================================*/
 function preStep02(){
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
	 
 	 webPageMove("2");
 }


 
 
/**========================================================================================
* 고객수 조회(중복제거)
========================================================================================*/
var exe_flag = "N";
function selectCustCnt(){
	
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
	
	var str = "실제 발송 고객수를 확인 하시겠습니까?"+"\n\n"+
						"발송 고객 수에 따라 추출 시간이 지연 될 수 있습니다.";
	
	if(cmdMessage(1,str) == false){return ;}
	
	exe_flag = "Y";
	
	loadingStart();
	
	//cmdMessage(0, "최종 발송 고객 시뮬레이션을 시작 합니다.\n\n종료 메시지가 나올 때 까지 기다려 주세요.");
	
	selectCustCntTm();//중복제거 함수 호출
}


/**========================================================================================
* 고객수 조회(중복제거) TM 호출
========================================================================================*/
var sel_cust_cnt = 0;
var startTime = 0;
var mdlCustCntTm = "";
function selectCustCntTm(){
	screenLog("등록", "web_cp_campdraftbrand_sub03", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>대상고객선택>고객중복제거",get_client_ip);//화면 로그(공통)
	
	
	startTime = new Date().getTime();
	  
	//캠페인 대상 모형 저장
	var insertTm = new oza_TMHandler('com.obzen.bmp.DocApproachCust', 'insertCampMdl', '1', '\@#%');
	insertTm.setAddDataField('CAMP_ID', camp_id);//캠페인ID
	insertTm.setAddDataField('CUSTG_MDL_ID_LIST', custg_mdl_id_list);//타켓주제(슬라이드)ID ;
	insertTm.setAddDataField('SPEC_CUST_CNT_LIST', spec_cust_list);//타켓주제(슬라이드)접근고객수 ;
	insertTm.returnlist('LOGMSG');
	insertTm.execute(null, false);
	
	var msg = insertTm.ElementValue('LOGMSG');//리턴 처리 메시지
	insertTm.clear();
	
	
	//저장 성공 시
	if(msg == "1"){
		//고객수 중복 제거
	  mdlCustCntTm = new oza_TMHandler('com.obzen.bmp.DocApproachCust', 'insertMdlCustCnt', '1', '\@#%');
	  mdlCustCntTm.setAddDataField('CAMP_ID', camp_id);
	  mdlCustCntTm.setAddDataField('MD_CD', md_cd);
	  mdlCustCntTm.returnlist('CUST_CNT');
	  mdlCustCntTm.execute(callBackCustCnt, true);//비동기 실행, 콜백 함수 실행
	  
	}
}


/**========================================================================================
* 고객수 조회(중복제거) 콜백 함수(비동기)
========================================================================================*/
function callBackCustCnt(mdlCustCntTm){
	
	console.log("중복 제거된 고객수 : "+mdlCustCntTm.ElementValue('CUST_CNT'));
	
	//sel_cust_cnt = mdlCustCntTm.ElementValue('CUST_CNT');//중복제거된 고객수
	mdlCustCntTm.clear();
	
	
	//고객수 재조회
	var mdlCustCntTm = new oza_TMHandler('com.obzen.bmp.DocApproachCust', 'selectCustCntSum', '1', '\@#%');
	mdlCustCntTm.setAddDataField('CAMP_ID', camp_id);
	mdlCustCntTm.returnlist('CUST_CNT');
	mdlCustCntTm.execute(null, false);
	sel_cust_cnt = mdlCustCntTm.ElementValue('CUST_CNT');//중복제거된 고객수
	mdlCustCntTm.clear();
	
	console.log("중복 제거된 고객수 재조회 : "+sel_cust_cnt);
	
	
	loadingStop();
	//cmdMessage(0, "최종 발송 고객 시뮬레이션을 종료 합니다.");
		
	if(parseInt(isNullZero(cust_cnt))  >= parseInt(isNullZero(sel_cust_cnt))){
		 $("#notice_txt").html("<p><span class='pass'>선정 고객 접근 가능</span></p>"); 
	}else{
		 $("#notice_txt").html("<p><span class='nopass'>접근 가능 고객 수 초과</span></p>");
	}
  
  $("#spec_cust").html(AddComma(isNullZero(sel_cust_cnt)));//실제 접근 고객수에 설정
}




 /**========================================================================================
  * 다음 단계(등록/수정)
 ========================================================================================*/
 function nextStep02(){
	 
	 /*
	 if(mod_flag == "N"){
		 	if(bmpevtTy_cd == "2" || bmpevtTy_cd == "3"){
		 		webPageMove('5');	
		 	}else{
		 		webPageMove('4');
		 	}
		 	
		 	return;
	 }
	
	 
	 if(user_id != reg_id){
		 if(bmpevtTy_cd == "2" || bmpevtTy_cd == "3"){
		 		webPageMove('5');	
		 	}else{
		 		webPageMove('4');
		 	}
		 return;
		}
	 */
	 
	 if(mod_flag == "N"){return;}
	 if(user_id != reg_id){return;}
	 
	 
	 
	 	if(exe_flag == "N" && $("#spec_cust").text() == "0"){
		 	cmdMessage(0, "최종 발송 고객 시뮬레이션을 먼저 진행 하세요.");
		 	return;
		}
	 	
	 	
	 	if($("#spec_cust").text() == "0"){
		 	cmdMessage(0, "접근 가능 고객 수를 확인하세요.");
		 	return;
		}
	 	
	 
	 	if(parseInt(isNullZero(cust_cnt))  < parseInt(DelComma($("#spec_cust").text()))){
	 		cmdMessage(0, "접근 가능 고객 수가 초과 되었습니다.");
		 	return;
		}
	 	
	 	/*
  	if(cmdMessage(1, "다음 단계로 이동 하시겠습니까?") == false){
  		return;
  	}
  	*/ 
  	
  	lodingImgOn();//백그라운드 이미지 활성(더블클릭방지)
  	
   	//모형 선택완료 진행상태 Update
   	var updateTm = new oza_TMHandler('com.obzen.bmp.DocApproachCust', 'updateCampMdlStat', '1', '\@#%');
   	updateTm.setAddDataField('CAMP_ID', camp_id);
   	updateTm.setAddDataField('USERID', user_id);
   	updateTm.returnlist('LOGMSG');
   	updateTm.execute(null, false);
   	
   	var msg = updateTm.ElementValue('LOGMSG');//리턴 처리 메시지
   	updateTm.clear();
   	
   	
   	screenLog("등록", "web_cp_campdraftbrand_sub03", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>대상고객선택",get_client_ip);//화면 로그(공통)
   	//cmdMessage(0,msg);
  
   	if(bmpevtTy_cd == "2" || bmpevtTy_cd == "3"){
			flag = "5";	
		}else{
			flag = "4";
		}
		
		camp_id = camp_id;
		bmpevtTy_cd = bmpevtTy_cd;
		
		do_RefreshPage("onload");
 }

 
 
 
 
/**========================================================================================
* 이전/다음 슬라이드
========================================================================================*/
function plusSlides(n, classIdVal) {
	var slides = $("ul.write2_list li.list");
	
	if(slides.length == 4){
		$(".prev").addClass("off");
		$(".next").addClass("off");
		$(".prev").css("cursor","default");
		$(".next").css("cursor","default");
		return;
	}

	if(classIdVal == "prev" && $(".prev").hasClass("off")){slideIndex = 4; return;}
	if(classIdVal == "next" && $(".next").hasClass("off")){slideIndex = slides.length; return;}
	
	slideIndex = parseInt(slideIndex+n);
	
	if (slideIndex <= 4) {
		slideIndex = 4;
	}
	
	
	if (slideIndex > slides.length) {
		slideIndex = 4;
	}
	
  
	if(slideIndex == slides.length){
	  $(".next").addClass("off");
		$(".next").css("cursor","default");
	}
	
	if(slideIndex > 4){
	  $(".prev").removeClass("off");
		$(".prev").css("cursor","pointer");
  }
	
	
	if(slideIndex == 4){
	  $(".prev").addClass("off");
		$(".prev").css("cursor","default");
	}

	
	if(slideIndex < slides.length){
		$(".next").removeClass("off");
		$(".next").css("cursor","pointer");
	}
	
	//모두 안보이게 처리
	for (var i = 1; i <= slides.length; i++) {
    $("#li_"+i).css("display","none");  
	}

	
	//이동된 목록만 조회
	for (var j = (slideIndex-3); j <=slideIndex; j++) {
      $("#li_"+j).css("display","");  
  }
}


/**========================================================================================
* 상태 진행바
========================================================================================*/
function progressBar(bar_flag) {
	
	if(bar_flag == "1"){$(".loading_wrap").css("display","");}
	if(bar_flag == "2"){$(".loading_wrap").css("display","none");return;}
	
	
  var width = 1;
  var id = setInterval(frame, 100);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      $("#progress_bar").css("width",width + '%');
    }
  }
}
 
</script>


<div class="c_write_wrap">
<div class="tip_txt">실제 발송고객 대상을 직접 선정하는 단계입니다.<br>행사 유형에 맞게 그룹별 비율 조정도 가능합니다. 발송고객수는 브랜드/매장 등급에 따라 상이합니다.</div>
  <div class="c_write_2">
    <ul class="write2_top">
      <li class="top1">
        <p>브랜드 등급</p>
        <span id="platform_grd"></span>
      </li>
      <li class="top2">
        <p>점포 등급</p>
        <span id="store_grd"></span>
      </li>
      <li class="top3">
        <p>등급에 따른 최대 접근 가능 고객 수</p>
        <span id="cust_cnt"></span>
      </li>
      <li class="top4">
        <p><span>/</span>등급에 따른 최대 접근 가능 고객 수</p>
        <span id="bmp_cust_cnt"></span>
      </li>
    </ul>
    <div class="slide_wrap">
      <p class="tit">대상선정<span>* 최적의 비율로 세팅된 고객군 입니다. 각 그룹별 고객수는 직접 조정 가능 합니다.</span></p>
      <div class="write_list_slide">
        <ul class="write2_list" id="slide_div">
        </ul>
        <div class="prev_next">
          <a href="javascript:plusSlides(-1, 'prev');" class="prev">이전</a>
          <a href="javascript:plusSlides(1, 'next');" class="next">다음</a>
        </div>
      </div>
      <div class="notice_txt"></div>
      <div class="total" id="spec_cust_sum">
      </div>
    </div>
    <div class="write2_btm clear">
      <div class="txt1 f_l">
        <!-- <a href="javascript:selectCustCnt();" id="cust_cnt_button">최종 발송 고객 시뮬레이션</a> --><!-- 20191030 stj 수정 -->
        <a href="javascript:selectCustCnt();" id="cust_cnt_button">실제 접근 고객 수 확인하기<span>고객군별 중복제거, 행사일정별 해당 제휴카드<br>소지고객한정으로 고객추출이 이루어집니다.</span></a>
      </div>
      <div class="btm_txt f_r">
        <div class="txt2">
          <!-- <div class="real_total"><p>실제 접근 고객 수</p><strong id="spec_cust"></strong></div> --><!-- 20191030 stj 수정 -->
          <div class="real_total"><p>실제 접근 고객 수</p><strong id="spec_cust"></strong><span> 명</span></div>
        </div>
        <div class="txt3" id="notice_txt">
          
        </div>
      </div>
    </div>
  </div>
  
  <div class="btn_box">
    <a href="javascript:preStep02();" class="btn_prev">이전단계</a>
    <a href="javascript:nextStep02();" class="btn_next">다음단계</a>
  </div>
</div>


<!-- 로딩바 -->
<div class="loading_wrap" style="display:none;">
  <p>Loading...</p>
  <div class="loading_bar" >
  <p id="progress_bar"></p>
  </div>
</div>
