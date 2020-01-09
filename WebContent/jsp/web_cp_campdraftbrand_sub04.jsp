<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
 <script type="text/javascript">
 
 
 
 
//TM Start ===============================================================================================

var offer_id1 = "";
var offer_id2 = "";
var offer_id3 = "";
var offer_id4 = "";

var styleFlag1 = "";
var styleFlag2 = "";
var styleFlag3 = "";
var styleFlag4 = "";
var styleFlag5 = "";
var styleFlag6 = "";

var offer_prdt_cost = "";//예상비용
var offer_prdt_cust_cnt = "";//예상고객수


//등급별 DMS 정률 쿠폰
//OFFER_ID : 오퍼ID
//DISC_RATE : 할인율(예:3%)
//REG_OFFER_ID : 캠페인오퍼ID(미등록 시 NULL 값 반환)
//MIN_PUR_AMT : 최소 구매액(1만원)
//MAX_DISC_AMT : 최대 할인액(5만원)
var dmsRateTm = new oza_TMHandler('com.obzen.bmp.ColCampOfferSel', 'selectDmsRateByGrade', '0', '\@#%');
dmsRateTm.setAddDataField('CAMP_ID', camp_id);
dmsRateTm.execute(null, false);
var dmsRateTmResult = dmsRateTm.getResult();
var dmsRateTm_json = "";
if(dmsRateTmResult != ""){dmsRateTm_json = JSON.parse(dmsRateTmResult);}
dmsRateTm.clear();


//등급별 DMS 정액 쿠폰
//OFFER_ID : 오퍼ID
//DISC_RATE : 할인율(예:3%)
//REG_OFFER_ID : 캠페인오퍼ID(미등록 시 NULL 값 반환)
//MIN_PUR_AMT : 최소 구매액(1만원)
var dmsAmtTm = new oza_TMHandler('com.obzen.bmp.ColCampOfferSel', 'selectDmsAmtByGrade', '0', '\@#%');
dmsAmtTm.setAddDataField('CAMP_ID', camp_id);
dmsAmtTm.execute(null, false);
var dmsAmtTmResult = dmsAmtTm.getResult();
var dmsAmtTm_json = "";
if(dmsAmtTmResult != ""){dmsAmtTm_json = JSON.parse(dmsAmtTmResult);}
dmsAmtTm.clear();



//상품권 사은행사 조회(프로모션)
//OFFER_ID : 오퍼ID
//SPPL_RT : 상품권 증정률
//DISC_AMT : 구매금액
//DISC_OFFER : 증정상품권금액
//REG_OFFER_ID : 캠페인오퍼ID(미등록 시 NULL 값 반환)
var prmEvtTm = new oza_TMHandler('com.obzen.bmp.ColCampOfferSel', 'selectPrmEvtByGrade', '0', '\@#%');
prmEvtTm.setAddDataField('CAMP_ID', camp_id);
prmEvtTm.execute(null, false);
var prmEvtTmResult = prmEvtTm.getResult();
var prmEvtTm_json = "";
if(prmEvtTmResult != ""){prmEvtTm_json = JSON.parse(prmEvtTmResult);}
prmEvtTm.clear();




//등급별 세일리지 오퍼 조회
//GRD_CD : 전체 플랫폼 등급
//OFFER_ID : 오퍼ID
//DISC_RATE : 할인율
//LMT_AMT : 한도금액
//USE_YN : 사용여부 Y/N(등급에 할당되지 않으면 N)
//REG_OFFER_ID : 캠페인오퍼ID(미등록 시 NULL 값 반환)
var saleageTm = new oza_TMHandler('com.obzen.bmp.ColCampOfferSel', 'selectSaleageByGrade', '0', '\@#%');
saleageTm.setAddDataField('CAMP_ID', camp_id);
saleageTm.execute(null, false);
var saleageTmResult = saleageTm.getResult();
var saleageTm_json = "";
if(saleageTmResult != ""){saleageTm_json = JSON.parse(saleageTmResult);}
saleageTm.clear();



//등급별 마일리지 혜택 조회
//GRD_CD : 전체 플랫폼 등급
//OFFER_ID : 오퍼ID
//ACC_AMT : 누적금액
//PAY_AMT : 지급금액
//USE_YN : 사용여부 Y/N(등급에 할당되지 않으면 N)
//REG_OFFER_ID : 캠페인오퍼ID(미등록 시 NULL 값 반환)
var mileageTm = new oza_TMHandler('com.obzen.bmp.ColCampOfferSel', 'selectMileage', '0', '\@#%');
mileageTm.setAddDataField('CAMP_ID', camp_id);
mileageTm.execute(null, false);
var mileageTmResult = mileageTm.getResult();
var mileageTm_json = "";
if(mileageTmResult != ""){mileageTm_json = JSON.parse(mileageTmResult);}
mileageTm.clear();



//등급별 멤버스바 오퍼 조회
//GRD_CD : 전체 플랫폼 등급
//OFFER_ID : 오퍼ID
//ACNY_CNT : 동반인원
//USE_CNT : 사용횟수
//USE_YN : 사용여부 Y/N(등급에 할당되지 않으면 N)
//REG_OFFER_ID : 캠페인오퍼ID(미등록 시 NULL 값 반환)
var membersBarTm = new oza_TMHandler('com.obzen.bmp.ColCampOfferSel', 'selectMembersBar', '0', '\@#%');
membersBarTm.setAddDataField('CAMP_ID', camp_id);
membersBarTm.execute(null, false);
var membersBarTmResult = membersBarTm.getResult();
var membersBarTm_json = "";
if(membersBarTmResult != ""){membersBarTm_json = JSON.parse(membersBarTmResult);}
membersBarTm.clear();



//등급별 주차권 혜택 조회
//OFFER_ID : 오퍼ID
//USE_TIME : 주차시간
//REG_OFFER_ID : 캠페인오퍼ID(미등록 시 NULL 값 반환)
var parkingTm = new oza_TMHandler('com.obzen.bmp.ColCampOfferSel', 'selectParking', '0', '\@#%');
parkingTm.setAddDataField('CAMP_ID', camp_id);
parkingTm.execute(null, false);
var parkingTmResult = parkingTm.getResult();
var parkingTm_json = "";
if(parkingTmResult != ""){parkingTm_json = JSON.parse(parkingTmResult);}
parkingTm.clear();



//인증번호 조회
var crtfc_num = ""; 

var crtfcNumTm = new oza_TMHandler('com.obzen.bmp.DocCampOfferSel', 'selectCrtfcNum', '1', '\@#%');
crtfcNumTm.setAddDataField('CAMP_ID', camp_id);
crtfcNumTm.returnlist('CRTFC_NUM');
crtfcNumTm.execute(null, false);
crtfc_num = crtfcNumTm.ElementValue('CRTFC_NUM');
crtfcNumTm.clear();



//MD별 사용 가능한 혜택 조회
var offer_11 = ""; 
var offer_12 = "";
var offer_13 = "";
var offer_14 = "";
var offer_15 = "";
var offer_16 = "";
var offer_17 = "";

var offerAuthTm = new oza_TMHandler('com.obzen.bmp.DocCampOfferSel', 'selectOfferAuth', '1', '\@#%');
offerAuthTm.setAddDataField('CAMP_ID', camp_id);
offerAuthTm.returnlist('OFFER_11;OFFER_12;OFFER_13;OFFER_14;OFFER_15;OFFER_16;OFFER_17');
offerAuthTm.execute(null, false);
offer_11 = offerAuthTm.ElementValue('OFFER_11');//DMS(정률) Y/N
offer_12 = offerAuthTm.ElementValue('OFFER_12');//DMS(정액) Y/N
offer_13 = offerAuthTm.ElementValue('OFFER_13');//사은행사 Y/N
offer_14 = offerAuthTm.ElementValue('OFFER_14');//세일리지 Y/N
offer_15 = offerAuthTm.ElementValue('OFFER_15');//멤버스바 Y/N
offer_16 = offerAuthTm.ElementValue('OFFER_16');//주차권 Y/N
offer_17 = offerAuthTm.ElementValue('OFFER_17');//마일리지 Y/N
offerAuthTm.clear();



//행사적용대상 카드 조회
var pay_method = "";

var payMethodTm = new oza_TMHandler('com.obzen.bmp.DocCampOfferSel', 'selectPayMethod', '1', '\@#%');
payMethodTm.setAddDataField('CAMP_ID', camp_id);
payMethodTm.returnlist('PAY_METHOD');
payMethodTm.execute(null, false);
pay_method = payMethodTm.ElementValue('PAY_METHOD');
payMethodTm.clear();

//TM End =================================================================================================	
 
	
	
	
	
 //화면 로드 시 실행
 $(document).ready(function() {
	 //$('html, body').animate({scrollTop: $('#web_cmp_content').offset().top}, 'fast');
	 screenLog("조회", "web_cp_campdraftbrand_sub04", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>프로모션 등록",get_client_ip);//화면 로그(공통)
	
	 
	 dmsRateList();//할인쿠폰
	 prmEvtList();//상품권 사은행사
	 saleageList();//세일리지
	 mileageList();//마일리지
	 membersBarList();//멤버스바
	 parkingList();//주차권
	 
	 $("#card_txt1").html("행사적용 대상 신세계 제휴 카드 :<br>"+pay_method);
	 $("#card_txt2").html("행사적용 대상 신세계 제휴 카드 :<br>"+pay_method);
	 
	 if(mod_flag == "N"){
		 $("#benefit1_none").css("display","none");
		 $("#benefit2_none").css("display","none");
		 $("#benefit3_none").css("display","none");
		 $("#benefit4_none").css("display","none");
		 
		 $("#sel_div1_tab1 a").css("cursor","default");
		 $("#sel_div1_tab2 a").css("cursor","default");
		 $("#sel_div2_tab1 a").css("cursor","default");
		 $("#sel_div2_tab2 a").css("cursor","default");
		 $("#sel_div3_tab1").css("cursor","default");
		 $("#sel_div3_tab2").css("cursor","default");
		 $("#members_bar_list li a").css("cursor","default");
		 $(".btn_prev").css("cursor","default");
		 $(".btn_next").css("cursor","default");
	 }
	 
	 
	 if(user_id != reg_id){
		 $("#benefit1_none").css("display","none");
		 $("#benefit2_none").css("display","none");
		 $("#benefit3_none").css("display","none");
		 $("#benefit4_none").css("display","none");
		 
		 $("#sel_div1_tab1 a").css("cursor","default");
		 $("#sel_div1_tab2 a").css("cursor","default");
		 $("#sel_div2_tab1 a").css("cursor","default");
		 $("#sel_div2_tab2 a").css("cursor","default");
		 $("#sel_div3_tab1").css("cursor","default");
		 $("#sel_div3_tab2").css("cursor","default");
		 $("#members_bar_list li a").css("cursor","default");
	 }
	 
	 
	 if(styleFlag1 != ""){
		 $("#sel_div1_tab1").addClass("on");
		 $("#benefit_list1").css("display","");
		 $("#benefit1_none").css("display","none");
		 $("#sel_div1_tab1 a").addClass("chk");
	 }else if(styleFlag2 != ""){
		 $("#sel_div1_tab2").addClass("on");
		 $("#benefit_list2").css("display","");
		 $("#benefit1_none").css("display","none");
		 $("#sel_div1_tab2 a").addClass("chk");
	 }
	 
	 if(styleFlag3 != ""){
		 $("#sel_div2_tab1").addClass("on");
		 $("#benefit_list3").css("display","");
		 $("#benefit2_none").css("display","none");
		 $("#sel_div2_tab1 a").addClass("chk");
	 }else if(styleFlag4 != ""){
		 $("#sel_div2_tab2").addClass("on");
		 $("#benefit_list4").css("display","");
		 $("#benefit2_none").css("display","none");
		 $("#sel_div2_tab2 a").addClass("chk");
	 }
	 
	 
	 if(styleFlag5 != ""){
		 $("#sel_div3_tab1").addClass("on");
		 $("#sel_div3_tab1 p").addClass("chk");
	 }else{
		 $("#members_bar_list").css("display","none");
		 $("#benefit3_none").css("display","");
	 }
	 
	 if(styleFlag6 != ""){
		 $("#sel_div3_tab2").addClass("on");
		 $("#sel_div3_tab2 p").addClass("chk");
	 }else{
		 $("#parking_list").css("display","none");
		 $("#benefit4_none").css("display","");
	 }
	 
	 //등록 후 조회
	 $("#offer_prdt_cost").html(AddComma(isNullZero(offer_prdt_cost))+"<span>원</span>");
	 $("#offer_prdt_cust_cnt").html(AddComma(isNullZero(offer_prdt_cust_cnt))+"<span>명</span>");
	 
	 
	 
	 //할인쿠폰
	 $("#sel_div1_tab1").click(function() {
		 if(mod_flag == "N"){return false;}
		 if(offer_11 == "N" && offer_12 == "N"){return false;}
		 if(user_id != reg_id){return false;}
		 
		 
		 if(!$(this).hasClass("on")){
			 
			 if($("#benefit_list2 ul li").hasClass("on")){
				 if(cmdMessage(1, "상품권 선택을 취소하시겠습니까?") == false){return false;}
			 }
			 	$(this).addClass("on");
		 		$("#sel_div1_tab2").removeClass("on");
		 		$("#benefit_list1").css("display","");
		 		$("#benefit_list2").css("display","none");
		 		$("#benefit1_none").css("display","none");
		 		$("#benefit_list2 ul li").removeClass("on");
		 		$("#offer_prdt_cost").html("0<span>원</span>");
		 		$("#offer_prdt_cust_cnt").html("0<span>명</span>");
		 		offer_prdt_cost = "0";
		 		offer_prdt_cust_cnt = "0";
		 		$("#sel_div1_tab2 a").removeClass("chk");//상품권 체크 표시 해제
		 		$("#sel_div1_tab1 a").addClass("chk");//할인행사 체크 표시
		 }else{
			  $(this).removeClass("on");
			  $("#sel_div1_tab1 a").removeClass("chk");
			  $("#benefit_list1").css("display","none");
			  $("#benefit_list1 ul li").removeClass("on");
			  $("#benefit1_none").css("display","");
			  $("#offer_prdt_cost").html("0<span>원</span>");
				$("#offer_prdt_cust_cnt").html("0<span>명</span>");
		 }
		  //dmsRateList();//할인쿠폰
		  
			return false;
		});
	 
	 
	 //상품권
   $("#sel_div1_tab2").click(function() {
	   if(mod_flag == "N"){return false;}
	   if(offer_13 == "N"){return false;}
	   if(user_id != reg_id){return false;}
	 
  	 if(!$(this).hasClass("on")){
  			
  		  if($("#benefit_list1 ul li").hasClass("on")){
  				if(cmdMessage(1, "할인 쿠폰 선택을 취소하시겠습니까?") == false){return false;}
			  }
  			
  	 		$(this).addClass("on");
  	 		$("#sel_div1_tab1").removeClass("on");
  	 		$("#benefit_list2").css("display","");
  	 		$("#benefit_list1").css("display","none");
	 		  $("#benefit1_none").css("display","none");
	 		  $("#benefit_list1 ul li").removeClass("on");
	 		  $("#offer_prdt_cost").html("0<span>원</span>");
	 		  $("#offer_prdt_cust_cnt").html("0<span>명</span>");
	 		  offer_prdt_cost = "0";
	 		  offer_prdt_cust_cnt = "0";
	 		  $("#sel_div1_tab2 a").addClass("chk");
	 		  $("#sel_div1_tab1 a").removeClass("chk");
  	 	}else{
  	 		$(this).removeClass("on");
			  $("#sel_div1_tab2 a").removeClass("chk");
			  $("#benefit_list2").css("display","none");
			  $("#benefit_list2 ul li").removeClass("on");
			  $("#benefit1_none").css("display","");
			  $("#offer_prdt_cost").html("0<span>원</span>");
				$("#offer_prdt_cust_cnt").html("0<span>명</span>");
		  }
  	 
   		//prmEvtList();//상품권 사은행사
   		return false;
  	});
	 
  	
	 
	  //세일리지
  	$("#sel_div2_tab1").click(function() {
  		if(mod_flag == "N"){return false;}
  		if(offer_14 == "N"){return false;}
  		if(user_id != reg_id){return false;}
    	
  		if(!$(this).hasClass("on")){
  			
  			if($("#benefit_list4 ul li").hasClass("on")){
  				if(cmdMessage(1, "마일리지 선택을 취소하시겠습니까?") == false){return false;}
			  }
  			
  	 		$(this).addClass("on");
  	 		$("#sel_div2_tab2").removeClass("on");
  	 		$("#benefit_list3").css("display","");
  	 		$("#benefit_list4").css("display","none");
	 		  $("#benefit2_none").css("display","none");
	 		  $("#benefit_list4 ul li").removeClass("on");
	 		  $("#sel_div2_tab2 a").removeClass("chk");
	 		  $("#sel_div2_tab1 a").addClass("chk");
  	 	}else{
  	 		$(this).removeClass("on");
  	 		$("#sel_div2_tab1 a").removeClass("chk");
  	 		$("#benefit_list3").css("display","none");
  	 		$("#benefit2_none").css("display","");
			  $("#benefit_list3 ul li").removeClass("on");
		  }
  	 
  		//saleageList();//세일리지
  		return false;
  	});
	 
	 
	  
	  //마일리지
  	$("#sel_div2_tab2").click(function() {
  		if(mod_flag == "N"){return false;}
  		if(offer_17 == "N"){return false;}
  		if(user_id != reg_id){return false;}
  		
  		if(!$(this).hasClass("on")){
  	 		if($("#benefit_list3 ul li").hasClass("on")){
  				if(cmdMessage(1, "세일리지 선택을 취소하시겠습니까?") == false){return false;}
			  }
  	 		
  	 		$(this).addClass("on");
  	 		$("#sel_div2_tab1").removeClass("on");
  	 		$("#benefit_list4").css("display","");
  	 		$("#benefit_list3").css("display","none");
	 		  $("#benefit2_none").css("display","none");
	 		  $("#benefit_list3 ul li").removeClass("on");
	 		  $("#sel_div2_tab1 a").removeClass("chk");
	 		  $("#sel_div2_tab2 a").addClass("chk");
  	 	}else{
  	 		$(this).removeClass("on");
  	 		$("#sel_div2_tab2 a").removeClass("chk");
  	 		$("#benefit_list4").css("display","none");
  	 		$("#benefit2_none").css("display","");
			  $("#benefit_list4 ul li").removeClass("on");
		  }
  	 
  		//mileageList();//마일리지
  		return false;
  	});
	 
  	
  	//멤버스바
  	$("#sel_div3_tab1").click(function() {
  		if(mod_flag == "N"){return false;}
  		if(offer_15 == "N"){return false;}
  		if(user_id != reg_id){return false;}
  		
  		if(!$(this).hasClass("on")){
  	 		$(this).addClass("on");
  	 		$("#members_bar_list").css("display","");
  	 		$("#sel_div3_tab1 p").addClass("chk");
  	 		$(".pro_list1 .cnt_none").css("display","none");
  	 	}else{
  	 		$(this).removeClass("on");
  	 		//offer_id3 = "";
  	 		$("#members_bar_list").css("display","none");
  	 		$("#members_bar_list ul li").removeClass("on");
  	 		$("#sel_div3_tab1 p").removeClass("chk");
  	 		$(".pro_list1 .cnt_none").css("display","");
  	 	}
  	 
  		//membersBarList();//멤버스바
  		return false;
  	});
	 
  	
  	//무료 주차권
  	$("#sel_div3_tab2").click(function() {
  		if(mod_flag == "N"){return false;}
  		if(offer_16 == "N"){return false;}
  		if(user_id != reg_id){return false;}
  		
  		if(!$(this).hasClass("on")){
  	 		$(this).addClass("on");
  	 		$("#parking_list").css("display","");
  	 		$("#sel_div3_tab2 p").addClass("chk");
  	 		$(".pro_list2 .cnt_none").css("display","none");
  	 	}else{
  	 		$(this).removeClass("on");
  	 		//offer_id4 = "";
  	 		$("#parking_list").css("display","none");
  	 		$("#sel_div3_tab2 p").removeClass("chk");
  	 		$(".pro_list2 .cnt_none").css("display","");
  	 	}
  	 
  	 	parkingList();//주차권
  	 	return false;
  	});
  });


/**========================================================================================
* 할인 쿠폰 조회
========================================================================================*/
function dmsRateList(){
 
 var i = 0;	
 var innerHtml = "";
 var offer_id = "";
 var reg_offer_id = "";
 var classFlag = "";
 var cursor = "pointer";
 var offer_cost = "";
 var offer_cnt = "";
 var min_pur_amt = "";
 
 
 if(mod_flag == "N"){cursor = "default";}
 if(user_id != reg_id){cursor = "default";}
 
 
 innerHtml += "<ul>";
 
 if(offer_11 == "Y"){
	 
	 for(i=0; i < dmsRateTm_json.length; i++) {
		 
		 offer_id = dmsRateTm_json[i].OFFER_ID;
		 reg_offer_id = dmsRateTm_json[i].REG_OFFER_ID;
		 offer_cost = dmsRateTm_json[i].PER_COST;
		 offer_cnt = dmsRateTm_json[i].PER_CUST_CNT;
		 min_pur_amt = dmsRateTm_json[i].MIN_PUR_AMT;
		 min_pur_amt = parseInt(isNullZero(min_pur_amt));
		 
		 
		 if(reg_offer_id != "" && offer_id == reg_offer_id){classFlag = "on";styleFlag1 = reg_offer_id;offer_id1 = reg_offer_id;offer_prdt_cust_cnt = offer_cnt;offer_prdt_cost = offer_cost; 
		 }else{classFlag = "";}
		 
		 innerHtml += "<li id='"+offer_id+"'class='"+classFlag+"' style='cursor:"+cursor+"' onclick=\"javascript:divClick('1','"+offer_id+"','','','"+offer_cost+"','"+offer_cnt+"');\">";
		 innerHtml += "<strong>"+dmsRateTm_json[i].DISC_RATE+"</strong>";
		 
		 if(min_pur_amt < 10000){
			 innerHtml += "<p><span>최대 "+dmsRateTm_json[i].MAX_DISC_AMT+"할인</span></p>";
		 }else{
			 
			 if(min_pur_amt < 100000){
				 min_pur_amt = (min_pur_amt/10000)+"만" 
			 }else if(min_pur_amt < 1000000){
				 min_pur_amt = (min_pur_amt/100000)+"십만"
			 }
			 
			 innerHtml += "<p><span>"+min_pur_amt+"원이상 구매<br>최대 "+dmsRateTm_json[i].MAX_DISC_AMT+"할인</span></p>";
		}
		 
		innerHtml += "</li>";
	}
 }
 
 if(offer_12 == "Y"){
	 for(i=0; i < dmsAmtTm_json.length; i++) {
		 offer_id = dmsAmtTm_json[i].OFFER_ID;
		 reg_offer_id = dmsAmtTm_json[i].REG_OFFER_ID;
		 offer_cost = dmsAmtTm_json[i].PER_COST;
		 offer_cnt = dmsAmtTm_json[i].PER_CUST_CNT;
		 
		 if(reg_offer_id != "" && offer_id == reg_offer_id){classFlag = "on";styleFlag1 = reg_offer_id;offer_id1 = reg_offer_id;offer_prdt_cust_cnt = offer_cnt;offer_prdt_cost = offer_cost;
		 }else{classFlag = "";}
		 
		 innerHtml += "<li id='"+offer_id+"' class='"+classFlag+"' style='cursor:"+cursor+"' onclick=\"javascript:divClick('2','"+offer_id+"','','','"+offer_cost+"','"+offer_cnt+"');\">";
		 innerHtml += "<strong>"+dmsAmtTm_json[i].DISC_AMT+"</strong>";
		 innerHtml += "<p><span>"+dmsAmtTm_json[i].MIN_PUR_AMT+" 이상 구매</span></p>";
		 innerHtml += "</li>";
		 
		 if(offer_id == dmsAmtTm_json[i].REG_OFFER_ID){
			 $("#"+offer_id).addClass("on");
		 }
	 }
 }
 

 innerHtml += "</ul>";
 innerHtml += "<div class='txt'>";
 innerHtml += "<p>한 개의 프로모션을 선택하실 수 있습니다.</p>";
 innerHtml += "<p>프로모션 다운로드 고객 결제시 POS 상에 자동으로 노출 됩니다.</p>";
 innerHtml += "</div>";
 
 $("#benefit_list1").html(innerHtml);
 
 
}



 
/**========================================================================================
* 프로모션 조회
========================================================================================*/
function prmEvtList(){
 var innerHtml = "";
 var offer_id = "";
 var reg_offer_id = "";
 var classFlag = "";
 var cursor = "pointer";
 var offer_cost = "";
 var offer_cnt = "";
 
 
 if(mod_flag == "N"){cursor = "default";}
 if(user_id != reg_id){cursor = "default";}
 
 innerHtml += "<ul>";

 for(var i=0; i < prmEvtTm_json.length; i++) {
	 offer_id = prmEvtTm_json[i].OFFER_ID;
	 reg_offer_id = prmEvtTm_json[i].REG_OFFER_ID;
	 offer_cost = prmEvtTm_json[i].PER_COST;
	 offer_cnt = prmEvtTm_json[i].PER_CUST_CNT;
	 
	 
	 if(reg_offer_id != "" && offer_id == reg_offer_id){classFlag = "on";styleFlag2 = reg_offer_id;offer_id1 = reg_offer_id;offer_prdt_cust_cnt = offer_cnt;offer_prdt_cost = offer_cost;
	 }else{classFlag = "";}
	 
	 innerHtml += "<li id='"+offer_id+"' class='"+classFlag+"' style='cursor:"+cursor+"' onclick=\"javascript:divClick('3','"+offer_id+"','','','"+offer_cost+"','"+offer_cnt+"');\">";
	 innerHtml += "<strong>"+prmEvtTm_json[i].SPPL_RT+" 증정</strong>";
	 innerHtml += "<p><span>"+prmEvtTm_json[i].DISC_AMT+"<br>"+prmEvtTm_json[i].DISC_OFFER+"</span></p>";
	 innerHtml += "</li>";
	 
	}

 innerHtml += "</ul>";
 innerHtml += "<div class='txt'>";
 innerHtml += "<p>한 개의 프로모션을 선택하실 수 있습니다.</p>";
 innerHtml += "<p>브랜드 구매 실적에 따라 상품권을 지급합니다. (지급처:해당 점포 사은행사장)</p>";
 innerHtml += "</div>";
 
 $("#benefit_list2").html(innerHtml);
}


/**========================================================================================
* 등급별 세일리지 조회
========================================================================================*/
function saleageList(){
 var innerHtml = "";
 var offer_id = "";
 var reg_offer_id = "";
 var classFlag = "";
 var cursor = "";
 var use_yn = "";
 var disc_rate = "";
 var lmt_amt = "";
 var grd_cd = "";
 var li_id = "";
 
 var check_on = "";

 
 if(mod_flag == "N"){cursor = "default";}
 if(user_id != reg_id){cursor = "default";}
 
 //offer_id2 = "";
 
 innerHtml += "<ul>";
 
 for(var i=0; i < saleageTm_json.length; i++) {
	 offer_id = saleageTm_json[i].OFFER_ID;
	 reg_offer_id = saleageTm_json[i].REG_OFFER_ID;
	 use_yn = saleageTm_json[i].USE_YN;
	 grd_cd = saleageTm_json[i].GRD_CD;
	 li_id = saleageTm_json[i].GRD_CD+"_"+saleageTm_json[i].OFFER_ID;
	 
	 if(grd_cd == "10"){grd_nm = "Lv.1";}
	 else if(grd_cd == "20"){grd_nm = "Lv.2";}
	 else if(grd_cd == "30"){grd_nm = "Lv.3";}
	 else if(grd_cd == "40"){grd_nm = "Lv.4";}
	 else if(grd_cd == "50"){grd_nm = "Lv.5";}
	 else {grd_nm = "";}
	 
	 if(saleageTm_json[i].DISC_RATE != ""){disc_rate = "정상 "+saleageTm_json[i].DISC_RATE;}else{disc_rate = "해당없음";}
	 if(saleageTm_json[i].LMT_AMT != ""){lmt_amt = "(한도 "+saleageTm_json[i].LMT_AMT+")";}else{lmt_amt ="해당없음" ;}
	 
	 
	 if(mod_flag == "Y" && (user_id == reg_id)){
		 if(use_yn == "Y"){cursor = "pointer";}
		 else if(use_yn == "N"){cursor = "default";} 
	 }
	 
	
	 if(use_yn == "Y" && reg_offer_id != "" && offer_id == reg_offer_id && check_on == ""){classFlag = "on";styleFlag3 = reg_offer_id;check_on = grd_cd;offer_id2 = reg_offer_id;
	 }else if(use_yn == "N"){classFlag = "dis";
	 }else{classFlag = "";}
	 
	 
	 innerHtml += "<li id='"+li_id+"' class='"+classFlag+"' style='cursor:"+cursor+"' onclick=\"javascript:divClick('4','"+offer_id+"', '"+use_yn+"','"+li_id+"','','');\">";
	 innerHtml += "<div>"
	 innerHtml += "<strong>"+disc_rate+"</strong>";
	 innerHtml += "<p><span>"+lmt_amt+"</span></p>";
	 innerHtml += "</div>"
	 //innerHtml += "<p class='lv_txt'>"+grd_nm+"</p>"
	 innerHtml += "<p class='lv_txt'></p>"
	 innerHtml += "</li>";
	 
	}

 
 innerHtml += "</ul>";
 innerHtml += "<div class='txt'>";
 innerHtml += "<p>세일리지 혜택 적용은 ‘정상상품 판매시’ 에만 한정됩니다.</p>";
 innerHtml += "<p>한 개의 프로모션을 선택하실 수 있습니다.</p>";
 innerHtml += "<p>프로모션 다운로드 고객 결제시 POS 상에 자동으로 노출 됩니다.</p>";
 innerHtml += "</div>";
 
 $("#benefit_list3").html(innerHtml);
}


/**========================================================================================
* 등급별 마일리지 조회
========================================================================================*/
function mileageList(){
 var innerHtml = "";
 var offer_id = "";
 var reg_offer_id = "";
 var classFlag = "";
 var cursor = "";
 var use_yn = "";
 var acc_amt = "";
 var pay_amt = "";
 var grd_cd = "";
 var grd_nm = "";
 var li_id = "";
 
 var check_on = "";
 
 
 if(mod_flag == "N"){cursor = "default";}
 if(user_id != reg_id){cursor = "default";}
 
 //offer_id2 = "";
 
 innerHtml += "<ul>";
 
 for(var i=0; i < mileageTm_json.length; i++) {
	 offer_id = mileageTm_json[i].OFFER_ID;
	 reg_offer_id = mileageTm_json[i].REG_OFFER_ID;
	 use_yn = mileageTm_json[i].USE_YN;
	 grd_cd = mileageTm_json[i].GRD_CD;
	 li_id = mileageTm_json[i].GRD_CD+"_"+mileageTm_json[i].OFFER_ID;
	 
	 if(grd_cd == "10"){grd_nm = "Lv.1";}
	 else if(grd_cd == "20"){grd_nm = "Lv.2";}
	 else if(grd_cd == "30"){grd_nm = "Lv.3";}
	 else if(grd_cd == "40"){grd_nm = "Lv.4";}
	 else if(grd_cd == "50"){grd_nm = "Lv.5";}
	 else {grd_nm = "";}
	 
	 if(mileageTm_json[i].ACC_AMT != ""){acc_amt = mileageTm_json[i].ACC_AMT+" 누적 시"; }else{acc_amt = "";}
	 if(mileageTm_json[i].PAY_AMT != ""){pay_amt = mileageTm_json[i].PAY_AMT+"<br>지급"; }else{pay_amt = "해당없음";}
	 
	 
	 if(mod_flag == "Y" && (user_id == reg_id)){
		 if(use_yn == "Y"){cursor = "pointer";}
		 else if(use_yn == "N"){cursor = "default";} 
	 }
	 
	 
	 if(use_yn == "Y" && reg_offer_id != "" && offer_id == reg_offer_id && check_on == ""){classFlag = "on";styleFlag4 = reg_offer_id;check_on = grd_cd;offer_id2 = reg_offer_id;
	 }else if(use_yn == "N"){classFlag = "dis";
	 }else{classFlag = "";}
	 
	 
	 innerHtml += "<li id='"+li_id+"' class='"+classFlag+"' style='cursor:"+cursor+"' onclick=\"javascript:divClick('5' ,'"+offer_id+"', '"+use_yn+"','"+li_id+"','','');\">";
	 innerHtml += "<div>"
	 innerHtml += "<p>"+acc_amt+"</p>";
	 innerHtml += "<strong>"+pay_amt+"</strong>";
	 innerHtml += "</div>"
	 //innerHtml += "<p class='lv_txt'>"+grd_nm+"</p>"
	 innerHtml += "<p class='lv_txt'></p>"
	 innerHtml += "</li>";
	 
	 
	}

 innerHtml += "</ul>";
 innerHtml += "<div class='txt'>";
 innerHtml += "<p>한 개의 프로모션을 선택하실 수 있습니다.</p>";
 innerHtml += "<p>해당 브랜드 구매 시 구매금액은 자동으로 적립 됩니다.</p>";
 innerHtml += "<p>적립 완료 시 행사 기간 중 사은행사장 방문, 누적 금액 확인 시에 한하여 상품권 증정이 가능합니다.</p>";
 innerHtml += "</div>";
 
 
 $("#benefit_list4").html(innerHtml);
}



/**========================================================================================
* 등급별 멤버스바 조회
========================================================================================*/
function membersBarList(){
 var innerHtml = "";
 var offer_id = "";
 var reg_offer_id = "";
 var classFlag = "";
 var use_yn = "";
 var acny_cnt = "";
 var use_cnt = "";
 var grd_cd = "";
 var grd_nm = "";
 var li_id = "";
 var cursor = "";
 
 var check_on = "";
 
 /*
 if($("#sel_div3_tab1").hasClass("on") || parseInt(camp_stat) >= 107){
	 
 }else{
	 innerHtml = "";
 }
 */
 
 if(mod_flag == "N"){cursor = "default";}
 if(user_id != reg_id){cursor = "default";}
 
 innerHtml += "<ul>";
 
 for(var i=0; i < membersBarTm_json.length; i++) {
	 offer_id = membersBarTm_json[i].OFFER_ID;
	 reg_offer_id = membersBarTm_json[i].REG_OFFER_ID;
	 use_yn = membersBarTm_json[i].USE_YN;
	 grd_cd = membersBarTm_json[i].GRD_CD;
	 li_id = membersBarTm_json[i].GRD_CD+"_"+membersBarTm_json[i].OFFER_ID;
	 
	 if(grd_cd == "10"){grd_nm = "Lv.1";}
	 else if(grd_cd == "20"){grd_nm = "Lv.2";}
	 else if(grd_cd == "30"){grd_nm = "Lv.3";}
	 else if(grd_cd == "40"){grd_nm = "Lv.4";}
	 else if(grd_cd == "50"){grd_nm = "Lv.5";}
	 else {grd_nm = "&nbsp;";}
	 
	 if(membersBarTm_json[i].ACNY_CNT != ""){acny_cnt = membersBarTm_json[i].ACNY_CNT;}else{acny_cnt = "해당없음";}
	 if(membersBarTm_json[i].USE_CNT != ""){use_cnt = membersBarTm_json[i].USE_CNT;}else{use_cnt = "해당없음";}
	 
	 if(mod_flag == "Y" && (user_id == reg_id)){
		 if(use_yn == "Y"){cursor = "pointer";}
		 else if(use_yn == "N"){cursor = "default";} 
	 }
	 
	 if(use_yn == "Y" && reg_offer_id != "" && offer_id == reg_offer_id && check_on == ""){classFlag = "on";styleFlag5 = reg_offer_id;check_on = grd_cd;offer_id3 = reg_offer_id;
	 }else if(use_yn == "N"){classFlag = "dis";
	 }else{classFlag = "";}
	 
	 innerHtml += "<li id='"+li_id+"' class='"+classFlag+"' style='cursor:"+cursor+"' >";
	 //innerHtml += "<p onclick=\"javascript:divClick('6','"+offer_id+"', '"+use_yn+"','"+li_id+"','','');\">"+acny_cnt;
	 innerHtml += "<p onclick=\"javascript:divClick('6','"+offer_id+"', '"+use_yn+"','"+li_id+"','','');\">"+use_cnt+"</p>";
	 //innerHtml += "<span class='lv_txt'>"+grd_nm+"</span>"
	 innerHtml += "<span class='lv_txt'></span>"
	 innerHtml += "</li>";
	}

 innerHtml += "</ul>";
 innerHtml += "<label for=''>브랜드 인증번호</label>";
 innerHtml += "<input type='text' readonly value='"+crtfc_num+"'>";
 innerHtml += "<div class='txt'>";
 innerHtml += "<p>1회당 2잔씩 제공됩니다.</p>";
 innerHtml += "<p>한 개의 프로모션을 선택하실 수 있습니다.</p>";
 innerHtml += "<p>브랜드 방문 후 인증번호 입력시 음료 제공 권한이 활성화 됩니다.</p>";
 innerHtml += "<p>브랜드 인증번호 변경은 ‘행사 등록하기 > 인증번호 관리’ 에서 가능합니다.</p>";
 innerHtml += "</div>";
 

 $("#members_bar_list").html(innerHtml);
}



/**========================================================================================
* 등급별 주차권 혜택 조회
========================================================================================*/
function parkingList(){
 var innerHtml = "";
 var parking_id = "";
 var reg_offer_id = "";
 
 /*
 if($("#sel_div3_tab2").hasClass("on") ||parseInt(camp_stat) >= 107){
	 
 }else{
	 innerHtml = "";
	 offer_id4 = "";
 }
 */
 
 innerHtml += "<label for=''>브랜드 인증번호</label>";
 innerHtml += "<input type='text' readonly value='"+crtfc_num+"'>";
 innerHtml += "<div class='txt' >";
 
 for(var i=0; i < parkingTm_json.length; i++) {
	 reg_offer_id = parkingTm_json[i].REG_OFFER_ID;
	 
	 if(reg_offer_id != ""){
		 parking_id = parkingTm_json[i].REG_OFFER_ID;
		 styleFlag6 = parkingTm_json[i].REG_OFFER_ID;
	 }else{
		 parking_id = parkingTm_json[i].OFFER_ID;
	 }
	 
	 
	 innerHtml += "<p>"+parkingTm_json[i].USE_TIME+"시간 무료주차권이 발급됩니다.</p>";
	 innerHtml += "<p>브랜드 방문 후 인증번호 입력시 APP 주차권을 다운로드 할 수 있습니다.</p>";
	 innerHtml += "<p>특정점포(하남, 마산)는 주차 서비스가 제공되지 않습니다.</p>";//20191030 stj 수정
	 innerHtml += "<p>브랜드 인증번호 변경은 ‘행사 등록하기 > 인증번호 관리’ 에서 가능합니다.</p>";
	 offer_id4 = parking_id;
	}
 innerHtml += "</div>";
 
 
 $("#parking_list").html(innerHtml);
 
}




/**========================================================================================
* 선택
========================================================================================*/
function divClick(flag, offer_id, use_yn_flag, li_id, cost, cnt){
	if(mod_flag == "N"){return;}
	if(use_yn_flag == "N"){return;}
	if(user_id != reg_id){return;}
	
	var li_name = "";
	
	var old_offer_id = "";
	var old_li_id = "";
	
	if(flag == "1"){
		if(offer_11 == "N"){return false;}
		if($("#benefit_list3 ul li").hasClass("on")){cmdMessage(0, "[할인쿠폰 + 세일리지]는 선택 할 수 없습니다.");return false;}
		li_name = "benefit_list1 ul li";//할인쿠폰 정률
		offer_id1 = offer_id;
		
	}else if(flag == "2"){
		if(offer_12 == "N"){return false;}
		if($("#benefit_list3 ul li").hasClass("on")){cmdMessage(0, "[할인쿠폰 + 세일리지]는 선택 할 수 없습니다.");return false;}
		li_name = "benefit_list1 ul li";//할인쿠폰 정액
		offer_id1 = offer_id;
		
	}else if(flag == "3"){
		if(offer_13 == "N"){return false;}
		if($("#benefit_list3 ul li").hasClass("on")){cmdMessage(0, "[상품권 + 세일리지]는 선택 할 수 없습니다.");return false;}
		if($("#benefit_list4 ul li").hasClass("on")){cmdMessage(0, "[상품권 + 마일리지]는 선택 할 수 없습니다.");return false;}
		li_name = "benefit_list2 ul li";//상품권
		offer_id1 = offer_id;
		
	}else if(flag == "4"){
		if(offer_14 == "N"){return false;}
		if($("#benefit_list1 ul li").hasClass("on")){cmdMessage(0, "[할인쿠폰 + 세일리지]는 선택 할 수 없습니다.");return false;}
		if($("#benefit_list2 ul li").hasClass("on")){cmdMessage(0, "[상품권 + 세일리지]는 선택 할 수 없습니다.");return false;}
		li_name = "benefit_list3 ul li";//세일리지
		offer_id2 = offer_id;
		
	}else if(flag == "5"){
		if(offer_17 == "N"){return false;}
		if($("#benefit_list2 ul li").hasClass("on")){cmdMessage(0, "[상품권 + 마일리지]는 선택 할 수 없습니다.");return false;}
		li_name = "benefit_list4 ul li";//마일리지
		offer_id2 = offer_id;
		
	}else if(flag == "6"){
		if(offer_15 == "N"){return false;}
		li_name = "members_bar_list ul li";//멤버스바
		offer_id3 = offer_id;
		
	}
	
	
	//토글 기능 추가
	if($("#"+li_id).hasClass("on")){
		$("#"+li_id).removeClass("on");
	}else if($("#"+offer_id).hasClass("on")){
		$("#"+offer_id).removeClass("on");
	}else{
		$("#"+li_name).removeClass("on");
		
		if(li_id != ""){
			$("#"+li_id).addClass("on");
		}else{
			$("#"+offer_id).addClass("on");
		}	
	}
	
	offer_prdt_cost = cost;
	offer_prdt_cust_cnt = cnt;
	
	
	if($("#benefit_list1 ul li").hasClass("on") || $("#benefit_list2 ul li").hasClass("on")){
		if(cost != ""){$("#offer_prdt_cost").html(AddComma(offer_prdt_cost)+"<span>원</span>");}
		if(cnt != ""){$("#offer_prdt_cust_cnt").html(AddComma(offer_prdt_cust_cnt)+"<span>명</span>");}	
	}else{
		$("#offer_prdt_cost").html("0<span>원</span>");
		$("#offer_prdt_cust_cnt").html("0<span>명</span>");
	}
}



/**========================================================================================
* 이전 단계
========================================================================================*/
function preStep03(){
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
	
	 webPageMove("3");
}


/**========================================================================================
* 다음 단계(등록/수정)
========================================================================================*/
function nextStep03(){
 
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
 	
 	if(offer_id1 == "" && offer_id2 == "" && offer_id3 == "" && offer_id4 == ""){
 		cmdMessage(3,"혜택");
 		return;
 	}
 	
 	/*
 	if(offer_id2 == ""){
 		cmdMessage(3,"세일리지 또는 마일리지");
 		return;
 	}
 	*/
 	
 	
 	//할인쿠폰과 세일리지 선택  
 	if($("#benefit_list1 ul li").hasClass("on") && $("#benefit_list3 ul li").hasClass("on")){
 		cmdMessage(0, "[할인쿠폰 + 세일리지]는 선택 할 수 없습니다.");
 		return;
 	}
 	
 	
 	//상품권과 세일리지 선택  
 	if($("#benefit_list2 ul li").hasClass("on") && $("#benefit_list3 ul li").hasClass("on")){
 		cmdMessage(0, "[상품권 + 세일리지]는 선택 할 수 없습니다.");
 		return;
 	}
 	
 	//상품권과 마일리지 선택  
 	if($("#benefit_list2 ul li").hasClass("on") && $("#benefit_list4 ul li").hasClass("on")){
 		cmdMessage(0, "[상품권 + 마일리지]는 선택 할 수 없습니다.");
 		return;
 	}
 	
	
 	if($("#benefit_list1 ul li").hasClass("on") == false && $("#benefit_list2 ul li").hasClass("on") == false){offer_id1 = "";}//할인쿠폰,상품권 체크 안되어 있으면 값 삭제
 	if($("#benefit_list3 ul li").hasClass("on") == false && $("#benefit_list4 ul li").hasClass("on") == false){offer_id2 = "";}//세일리지,마일리지 체크 안되어 있으면 값 삭제
 	if($("#members_bar_list ul li").hasClass("on") == false){offer_id3 = "";}//멤버스바 체크 안되어 있으면 값 삭제
 	if($("#sel_div3_tab2").hasClass("on") == false){offer_id4 = "";}//무료 주차권 체크 안되어 있으면 값 삭제
 	
 	
 	if(offer_id1 == "" && offer_id2 == "" && offer_id3 == "" && offer_id4 == ""){
 		cmdMessage(3,"혜택");
 		return;
 	}
 	
 	
	
 	lodingImgOn();//백그라운드 이미지 활성(더블클릭방지)
 	
	//채널 등록
 	var insertTm = new oza_TMHandler('com.obzen.bmp.DocCampOfferSel', 'insertOfferAct', '1', '\@#%');
 	insertTm.setAddDataField('CAMP_ID', camp_id);
 	insertTm.setAddDataField('OFFER_ID1', offer_id1);//혜택군1오퍼(할인쿠폰,사은행사)
 	insertTm.setAddDataField('OFFER_ID2', offer_id2);//혜택군2오퍼(세일리지,마일리지)
 	insertTm.setAddDataField('OFFER_ID3', offer_id3);//혜택군2오퍼(멤버스바)
 	insertTm.setAddDataField('OFFER_ID4', offer_id4);//혜택군2오퍼(무료주차권)
 	insertTm.setAddDataField('CRTFC_NUM', crtfc_num);//인증번호
 	insertTm.setAddDataField('OFFER_PRDT_COST', offer_prdt_cost);
 	insertTm.setAddDataField('OFFER_PRDT_CUST_CNT', offer_prdt_cust_cnt);
 	insertTm.setAddDataField('USERID', user_id);
 	insertTm.returnlist('LOGMSG');
 	insertTm.execute(null, false);
 	
 	var msg = insertTm.ElementValue('LOGMSG');//리턴 처리 메시지
 	insertTm.clear();
 	
 	
 	screenLog("등록", "web_cp_campdraftbrand_sub04", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>프로모션 등록",get_client_ip);//화면 로그(공통)
 	//cmdMessage(0,msg);
 	

 	flag = "5";
	camp_id = camp_id;
	bmpevtTy_cd = bmpevtTy_cd;
	
	do_RefreshPage("onload");
}



/*===============================================================
* 팝업 Open
===============================================================*/
function layerPopOpen(popupN){
  var innerHtml = "";
  var $layer = $("#"+ popupN);
  
  $layer.css("position", "absolute");
  $layer.css("top",(($(window).height() - $layer.outerHeight()) / 2) + $(window).scrollTop());
  $layer.css("left",(($(window).width() - $layer.outerWidth()) / 2) + $(window).scrollLeft());
  $layer.draggable();
  $layer.show();
}


/*===============================================================
* 팝업 Close
===============================================================*/
function popupClose(popupN) {
  var $layer = $("#"+ popupN);
  $layer.hide();
}



</script>
<div class="c_write_wrap">
  <div class="tip_txt">프로모션의 종류를 선택하는 단계입니다.<br>브랜드 등급에 따라 선택할 수 있는  프로모션이 상이하며, 좋은 컨텐츠를 발송할 경우 하단의 신세계 전용 프로모션을 신청하시면 적극 지원해드립니다.</div>
  <div class="c_write_3">
  	<div class="pro1 box">
  		<p class="tit clear">공동 마케팅 <span>신세계와 브랜드가 함께 비용을 분담하는 프로모션입니다.</span><span class="f_r card_txt" id="card_txt1"></span></p>
  		<div class="left">
  			<img src="../../img/web/icon/benefit_img1.png" alt="">
  			<a href="javascript:layerPopOpen('layer_bdetail1');">자세히 보기</a>
  		</div>
  		<div class="right">
  			<ul>
  				<li class="tab1" id="sel_div1_tab1"><!-- class="on" 제어 -->
  					<a href="#">할인쿠폰 증정<span>구매시 일정 요율/금액 할인 제공</span></a>
    			</li>
    			<li class="tab2" id="sel_div1_tab2">
    				<a href="#">상품권 사은행사<span>구매금액별 상품권 증정(사은행사장)</span></a>
    			</li>
    		</ul>
    		<div class="tab_cnt">
    			<div class="tab1_cnt" style="display:none" id="benefit_list1">
    			</div>
    			<div class="tab2_cnt" style="display:none" id="benefit_list2">
    			</div>
    			<div class="tab_none" id="benefit1_none">혜택 항목을 선택 하세요</div>
    		</div>
    	</div>
		<div class="pro_cost">
		  <div class="cost1">
			<p>프로모션 예상 참여 고객</p>
			<strong id="offer_prdt_cust_cnt"></strong>
		  </div>
		  <div class="cost2">
			<p>프로모션 예상비용</p>
			<strong id="offer_prdt_cost"></strong>
		  </div>
		</div>
	</div>
    <div class="pro2 box">
    	<p class="tit clear">신세계 마케팅 지원 <span>신세계에서 비용을 지원하는 프로모션입니다.</span><span class="f_r card_txt" id="card_txt2"></span></p>
    	<div class="pro2_1">
    		<div class="left">
    			<img src="../../img/web/icon/benefit_img2.png" alt="">
    			<a href="javascript:layerPopOpen('layer_bdetail2');">자세히 보기</a>
    		</div>
    		<div class="right">
    			<ul>
    				<li class="tab1" id="sel_div2_tab1"><!-- class="on" 제어 -->
    					<a href="#">세일리지<span>설정된 한도금액 내 브랜드 구매 시 할인 혜택 사용</span></a>
    				</li>
    				<li class="tab2" id="sel_div2_tab2">
    					<a href="#">마일리지<span>구매횟수와 관계없이 설정한 구매금액 도달 시 상품권 증정</span></a>
    				</li>
    			</ul>
    			<div class="tab_cnt">
    				<div class="tab1_cnt" style="display:none" id="benefit_list3">
    				</div>
    				<div class="tab2_cnt" style="display:none" id="benefit_list4">
    				</div>
    				<div class="tab_none" id="benefit2_none">
    					혜택 항목을 선택 하세요
    				</div>
    			</div>
    		</div>
    	</div>
    	<div class="pro2_2">
    		<div class="left">
    		</div>
    		<div class="right">
    			<div class="pro_list1">
    				<div class="tit" id="sel_div3_tab1"><!-- class="on" 제어 -->
    					<p>멤버스 바<span>음료 무료 제공</span></p>
    				</div>
					<div class="cnt_wrap">
						<div class="cnt" id="members_bar_list">
						</div>
						<div class="cnt_none" id="benefit3_none">혜택 항목을 선택 하세요</div>
					</div>
    			</div>
    			<div class="pro_list2">
    				<div class="tit" id="sel_div3_tab2"><!-- class="on" 제어 -->
    					<p>무료 주차권<span>3시간 무료 주차 (APP에서 사용)</span></p>
    				</div>
					<div class="cnt_wrap">
      					<div class="cnt" id="parking_list"> 
      					
      					</div>
						<div class="cnt_none" id="benefit4_none">혜택 항목을 선택 하세요</div>
					</div>
    			</div>
    		</div>
    	</div>
    </div>
  </div>
  <div class="btn_box">
      <a href="javascript:preStep03();" class="btn_prev">이전단계</a>
      <a href="javascript:nextStep03();" class="btn_next">다음단계</a>
    </div>
</div>


<!-- 혜택자세히보기 1 -->
<div id="layer_bdetail1" class="layer" >
  <p class="tit">혜택 자세히보기<a href="javascript:popupClose('layer_bdetail1');" class="btn_close">닫기</a></p>
  <div class="detail_wrap">
    <div class="border_box">
      <div class="b_img">
        <img src="../../img/web/icon/benefit_img01.png" alt="">
      </div>
      <dl>
        <dt>유의 사항</dt>
        <dd>
          <p>타 상품권 사은행사와 중복 증정 불가</p>
          <p>타 할인 쿠폰과 중복 적용 불가</p>
          <p>세일리지와 중복 적용 불가</p>
          <p>당일 구매 영수증에 한함</p>
        </dd>
      </dl>
    </div>
    <div class="border_box mt20">
      <div class="b_img">
        <img src="../../img/web/icon/benefit_img02.png" alt="">
      </div>
      <dl>
        <dt>유의 사항</dt>
        <dd>
          <p>타 상품권 사은행사와 중복 증정 불가</p>
          <p>마일리지와 중복 증정 불가</p>
          <p>세일리지와 중복 불가<br>(VIP 세일리지 제외)</p>
          <p>당일 구매 영수증에 한함</p>
          <p>한장의 영수증을 분할하지 않음</p>
        </dd>
      </dl>
    </div>
  </div>
  <div class="pop_btn">
    <a href="javascript:popupClose('layer_bdetail1');" class="btn_cancel">닫기</a>
  </div>
</div>
<!-- 혜택자세히보기 1 -->


<!-- 혜택자세히보기 2 -->
<div id="layer_bdetail2" class="layer" >
  <p class="tit">혜택 자세히보기<a href="javascript:popupClose('layer_bdetail2');" class="btn_close">닫기</a></p>
  <div class="detail_wrap">
    <div class="border_box">
      <div class="b_img">
        <img src="../../img/web/icon/benefit_img03.png" alt="">
      </div>
      <dl>
        <dt>유의 사항</dt>
        <dd>
          <p>기간 내 횟수와 상관없이 총구매금액 기준</p>
          <p>정상상품에 한하여 기간종료 후 취소시 세일리지 복원 X</p>
          <p>할인쿠폰, VIP 세일리지와 중복적용 불가</p>
          <p>사은행사와 중복 불가<br>(VIP 세일리지 제외)</p>
        </dd>
      </dl>
    </div>
    <div class="border_box mt20">
      <div class="b_img">
        <img src="../../img/web/icon/benefit_img04.png" alt="">
      </div>
      <dl>
        <dt>유의 사항</dt>
        <dd>
          <p>타 상품권 사은행사와 중복 증정 불가</p>
          <p>행사기간 내 영수증에 한함</p>
          <p>한장의 영수증을 분할하지 않음</p>
          <p>행사 종료 후 2주간 증정 가능</p>
        </dd>
      </dl>
    </div>
    <div class="border_box mt20">
      <div class="b_img">
        <img src="../../img/web/icon/benefit_img05.png" alt="">
      </div>
      <dl>
        <dt>유의 사항</dt>
        <dd>
          <p>샵마스터 인증 완료 후 음료 이용 가능</p>
          <p>맴버스바 -> 테이크 아웃 전용 카페</p>
          <p>1일 1회, 1회 2잔 한</p>
          <p>우수고객 혜택과 별도 사용 가능<br>(단 1일 1회)</p>
        </dd>
      </dl>
    </div>
    <div class="border_box mt20">
      <div class="b_img">
        <img src="../../img/web/icon/benefit_img06.png" alt="">
      </div>
      <dl>
        <dt>유의 사항</dt>
        <dd>
          <p>샵 마스터 인증 완료 후 주차권 이용 가능</p>
          <p>APP 주차메뉴에 차량 번호 등록 후 이용</p>
          <p>우수고객 무료주차 헤택과 중복 적용 불가</p>
          <p>점별 사용 조건은 주차 메뉴에서 확인</p>
        </dd>
      </dl>
    </div>
  </div>
  <div class="pop_btn">
    <a href="javascript:popupClose('layer_bdetail2');" class="btn_cancel">닫기</a>
  </div>
</div>
<!-- 혜택자세히보기 2 -->

