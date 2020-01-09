<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<script type="text/javascript">
var intg_bran_cd = "";
var intg_bran_nm = "";
var md_lvl_cd = "";
var md_lvl_score = "";
var md_lvl_need_score = "";
var offer_11 = "";
var offer_13 = "";
var offer_14 = "";
var offer_15 = "";
var offer_16 = "";
var offer_17 = "";
var lms_yn = "";
var mms_yn = "";
var edm_yn = ""; 	
var following_cust_cnt = "";




//화면 로드 시 실행
$(document).ready(function() {
	screenLog("조회", "web_brandprofile_sub", "브랜드 프로필",get_client_ip);//화면 로그(공통)
	
	brand();
	cust();
	promotion();
	history();
});




/**========================================================================================
* 브랜드, 점포 등급
========================================================================================*/
function brand(){
	
	
	//브랜드 및 프로모션 정보
	var brandInfoTm = new oza_TMHandler('com.obzen.bmpanly.DocBrandProfile', 'selectBrandInfo', '1', '\@#%');
	brandInfoTm.setAddDataField('STORE_CD', store_cd);
	brandInfoTm.setAddDataField('MD_CD', md_cd);
	brandInfoTm.returnlist('INTG_BRAN_CD'+//통합브랜드코드
	                  		';INTG_BRAN_NM'+//통합브랜드명
	                  		';MD_LVL_CD'+//브랜드등급
	                  		';MD_LVL_SCORE'+//현재스코어
	                  		';MD_LVL_NEED_SCORE'+//다음 등급까지 남은 점수
	                  		';OFFER_11'+//할인쿠폰 가능여부
	                  		';OFFER_13'+//상품권 가능 여부
	                  		';OFFER_14'+//세일리지 가능 여부
	                  		';OFFER_15'+//멤버스바 사용여부
	                  		';OFFER_16'+//주차권 사용 여부
	                  		';OFFER_17'+//마일맂지 사용 여부
	                  		';FLW_CUST_CNT'+//팔로잉 고객수
	                  		';LMS_YN'+//LMS 채널 사용 여부
	                  		';MMS_YN'+//MMS 채널 사용 여부
	                  		';EDM_YN');//EDM 채널 사용 여부
	brandInfoTm.execute(null, false);
	intg_bran_cd = brandInfoTm.ElementValue('INTG_BRAN_CD');
	intg_bran_nm = brandInfoTm.ElementValue('INTG_BRAN_NM');
	md_lvl_cd = brandInfoTm.ElementValue('MD_LVL_CD');
	md_lvl_score = brandInfoTm.ElementValue('MD_LVL_SCORE');
	md_lvl_need_score = brandInfoTm.ElementValue('MD_LVL_NEED_SCORE');
	offer_11 = brandInfoTm.ElementValue('OFFER_11');
	offer_13 = brandInfoTm.ElementValue('OFFER_13');
	offer_14 = brandInfoTm.ElementValue('OFFER_14');
	offer_15 = brandInfoTm.ElementValue('OFFER_15');
	offer_16 = brandInfoTm.ElementValue('OFFER_16');
	offer_17 = brandInfoTm.ElementValue('OFFER_17');
	lms_yn = brandInfoTm.ElementValue('LMS_YN');
	mms_yn = brandInfoTm.ElementValue('MMS_YN');
	edm_yn = brandInfoTm.ElementValue('EDM_YN');
	following_cust_cnt = brandInfoTm.ElementValue('FLW_CUST_CNT');
	brandInfoTm.clear();
	
	
	
	if(intg_bran_cd != ""){$("#intg_bran_cd").text("("+intg_bran_cd+")");}
	$("#intg_bran_nm").text(intg_bran_nm);
	
	$("#md_lvl_score").text(md_lvl_score);
	$("#md_lvl_need_score").text(md_lvl_need_score);
	$("#following_cust_cnt").text(AddComma(isNullZero(following_cust_cnt))+"명");
	
	
	//레벨
	var lvl_cd = "";
	
	if(md_lvl_cd == "10"){
		lvl_cd = "<img src='../../img/web/icon/p_rating1.png' alt=''><p class='rating_txt1'>LEVEL 1</p>";
	}else if(md_lvl_cd == "20"){
		lvl_cd = "<img src='../../img/web/icon/p_rating2.png' alt=''><p class='rating_txt2'>LEVEL 2</p>";
	}else if(md_lvl_cd == "30"){
		lvl_cd = "<img src='../../img/web/icon/p_rating3.png' alt=''><p class='rating_txt3'>LEVEL 3</p>";
	}else if(md_lvl_cd == "40"){
		lvl_cd = "<img src='../../img/web/icon/p_rating4.png' alt=''><p class='rating_txt4'>LEVEL 4</p>";
	}else if(md_lvl_cd == "50"){
		lvl_cd = "<img src='../../img/web/icon/p_rating5.png' alt=''><p class='rating_txt5'>LEVEL 5</p>";
	}
	$(".rating_cnt").html(lvl_cd);
	
	
	
	
	
	
	//MD별 점포 조회
	var storeLvlTm = new oza_TMHandler('com.obzen.bmpanly.ColBrandProfile', 'selectStoreLvl', '0', '\@#%');
	storeLvlTm.setAddDataField('MD_CD', md_cd);
	storeLvlTm.execute(null, false);
	var storeLvlTmResult = storeLvlTm.getResult();
	var storeLvlTm_json = "";
	if(storeLvlTmResult != ""){
		storeLvlTm_json = JSON.parse(storeLvlTmResult);
	}
	storeLvlTm.clear();
	
	
	
	var innerHtml = "";
	
	var sel_store_cd = "";
	var sel_store_nm = "";
	var sel_store_flag = "";
	var sel_store_lvl_cd = "";
	var classType = "";
	var classStyle = "";
	
	
	
	for(var i=0; i<storeLvlTm_json.length; i++) {
		sel_store_cd = storeLvlTm_json[i].STORE_CD;
		sel_store_nm = storeLvlTm_json[i].STORE_NM;
		sel_store_flag = storeLvlTm_json[i].STORE_FLAG;//0:비활성, 1:활성
		sel_store_lvl_cd = storeLvlTm_json[i].STORE_LVL_CD;//A,B,C,D,E
	
		if(sel_store_flag == "0"){classType = "";}
		if(sel_store_flag == "1"){classType = "on";}
		
		
		if(i == 0){
			classStyle = "bor_l0";
		}else if(i ==  6){
			classStyle = "bor_b0 bor_l0";
		}else if(i >  6){
			classStyle = "bor_b0";
		}else{
			classStyle = "";
		}
		
		
		innerHtml += "<li class='"+classType+" "+classStyle+"'>";
		
		if(sel_store_lvl_cd == "A"){innerHtml += "<img src='../../img/web/icon/s_rating1s.png' alt=''>";}
		else if(sel_store_lvl_cd == "B"){innerHtml += "<img src='../../img/web/icon/s_rating2s.png' alt=''>";}
		else if(sel_store_lvl_cd == "C"){innerHtml += "<img src='../../img/web/icon/s_rating3s.png' alt=''>";}
		else if(sel_store_lvl_cd == "D"){innerHtml += "<img src='../../img/web/icon/s_rating4s.png' alt=''>";}
		//else if(sel_store_lvl_cd == "E"){innerHtml += "<img src='../../img/web/icon/s_rating5s.png' alt=''>";}
		else if(sel_store_lvl_cd == "E"){innerHtml += "<img src='../../img/web/icon/s_rating6s.png' alt=''>";}
		
		innerHtml += "<p>"+sel_store_nm+"</p>";
		innerHtml += "</li>";
		
		
	}
	
	$("#store_list").html(innerHtml);
	
	

}



/**========================================================================================
* 고객지원
========================================================================================*/
function cust(){
	
	
	//주제별 접근 고객수 조회
	var custThemaTm = new oza_TMHandler('com.obzen.bmpanly.ColBrandProfile', 'selectCustThema', '0', '\@#%');
	custThemaTm.setAddDataField('MD_CD', md_cd);
	custThemaTm.setAddDataField('STORE_CD', store_cd);
	custThemaTm.execute(null, false);
	var custThemaTmResult = custThemaTm.getResult();
	var custThemaTm_json = "";
	if(custThemaTmResult != ""){
		custThemaTm_json = JSON.parse(custThemaTmResult);
	}
	custThemaTm.clear();
	
	
	
	var innerHtml = "";
	
	var custg_mdl_id = "";
	var custg_mdl_nm = "";
	var cust_cnt = "";
	
	
	for(var i=0; i<custThemaTm_json.length; i++) {
		custg_mdl_id = custThemaTm_json[i].CUSTG_MDL_ID;
		custg_mdl_nm = custThemaTm_json[i].CUSTG_MDL_NM;
		cust_cnt = custThemaTm_json[i].CUST_CNT;

		if(custg_mdl_nm.length > 5){
			custg_mdl_nm = custg_mdl_nm.substring(0,5)+"<br>"+custg_mdl_nm.substring(5,custg_mdl_nm.length);
  	}
		
		
		if(custg_mdl_id == "001"){custg_mdl_nm = "브랜드<br>구매 고객";}
		if(custg_mdl_id == "002"){custg_mdl_nm = "브랜드<br>TOP 100 고객";}
		if(custg_mdl_id == "004"){custg_mdl_nm = "AI 추천<br>브랜드 잠재고객<br>(브랜드 미구매 고객)";}
		if(custg_mdl_id == "005"){custg_mdl_nm = "AI 추천<br>경쟁 브랜드 고객<br>(브랜드 미구매 고객)";}
		
		
		innerHtml += "<li class='list"+(i+1)+"'>";
		innerHtml += "<div>"+custg_mdl_nm+"</div>";
		innerHtml += "<p>"+AddComma(isNullZero(cust_cnt))+"</p>";
		innerHtml += "</li>";
	}
	
	$("#cust_list").html(innerHtml);
}



/**========================================================================================
* 프로모션, 발송 채널
========================================================================================*/
function promotion(){
	
	if(offer_11 == "Y"){$(".prom1").addClass("on");}
	if(offer_13 == "Y"){$(".prom2").addClass("on");}
	if(offer_14 == "Y"){$(".prom3").addClass("on");}
	if(offer_15 == "Y"){$(".prom5").addClass("on");}
	if(offer_16 == "Y"){$(".prom6").addClass("on");}
	if(offer_17 == "Y"){$(".prom4").addClass("on");}
	
	if(lms_yn == "Y"){$(".channel1").addClass("on");}
	if(mms_yn == "Y"){$(".channel2").addClass("on");}
	if(edm_yn == "Y"){$(".channel3").addClass("on");}
}



/**========================================================================================
* History
========================================================================================*/
function history(){
	var innerHtml = "";
	
	//행사 목록 조회
	var evtListTm = new oza_TMHandler('com.obzen.bmpanly.ColBrandProfile', 'selectEvtList', '0', '\@#%');
	evtListTm.setAddDataField('MD_CD', md_cd);
	evtListTm.setAddDataField('STORE_CD', store_cd);
	evtListTm.execute(null, false);
	var evtListTmResult = evtListTm.getResult();
	var evtListTm_json = "";
	if(evtListTmResult != ""){
		evtListTm_json = JSON.parse(evtListTmResult);
	}
	evtListTm.clear();
	
	
	
	var base_ym = "";
	var his_store_nm = "";
	var camp_nm = "";
	var camp_stat_cd = "";
	var camp_stat_nm = "";
	var classType = "";
	var old_ym = "";
	var camp_period = "";
	
	for(var i=0; i<evtListTm_json.length; i++) {
		base_ym = evtListTm_json[i].BASE_YM;
		his_store_nm = evtListTm_json[i].STORE_NM;
		camp_nm = evtListTm_json[i].CAMP_NM;
		camp_stat_cd = evtListTm_json[i].CAMP_STAT_CD;//2:진행중, 3:완료
		camp_stat_nm = evtListTm_json[i].CAMP_STAT_NM;//진행중, 완료
		camp_period = evtListTm_json[i].CAMP_PERIOD;//기간
		
		if(camp_stat_cd == "2"){classFlag = "on";}//진행중
		if(camp_stat_cd == "3"){classFlag = "off";}//완료
		
		
		if(i == 0){
			innerHtml += "<li>";
			innerHtml += "<div class='date'>";
			innerHtml += "<p>"+base_ym.substring(0,4)+"년 "+base_ym.substring(4,6)+"월</p>";
			innerHtml += "</div>";
			
			old_ym = base_ym;
		}else{
			if(base_ym != old_ym){
				innerHtml += "</li>";
				innerHtml += "<li>";
				innerHtml += "<div class='date'>";
				innerHtml += "<p>"+base_ym.substring(0,4)+"년 "+base_ym.substring(4,6)+"월</p>";
				innerHtml += "</div>";
				old_ym = base_ym;
			}
		}
		
		
		
		innerHtml += "<div class='his_list "+classFlag+"'>";
		innerHtml += "<strong>"+his_store_nm+"<span>"+camp_stat_nm+"</span></strong>";
		innerHtml += "<div>"
		innerHtml += "<p>"+camp_nm+"</p>";
		innerHtml += "<p>"+camp_period+"</p>";
		innerHtml += "</div>"
		innerHtml += "</div>";
		
		
	}
	innerHtml += "</li>";
	
	
	$(".his_cnt").html(innerHtml);
}





/*===============================================================
혜택보기
===============================================================*/
function benefit_open(){
		var name = "web_brandprofile_pop2";
	  var option = "location=no,menubar=no,resizable=no,scrollbars=no,titlebar=no,toolbar=no";
	  
	  //해상도 계산하여 위치 조절
	  var popupX = (document.body.offsetWidth / 2) - (200 / 2);
	  var popupY = (document.body.offsetHeight / 2) - (300 / 2);
	  	 
	  option += ",top="+popupY+",left="+popupX+",height=810,width=930";
	  
	  var ret = window.open("web_brandprofile_pop2.jsp", name, option);
	  
	  /*
	  //post 방식
	  var frm = $("form#frmSearch")[0];
	  frm.action = "web_brandprofile_pop2.jsp";
	  frm.target = name;
	  frm.method = "post";
	  frm.submit();
	  */
	  $("#mask").css("display","");//팝업 호출 시 보이게 설정
	  
	  $('#mask').click(function() {
	  		ret.focus();
	  });
}


</script>

<div class="f_l brand_info">
  <div class="info1">
    <div class="brand_nm">
      <!-- <p class="tit">통합 브랜드</p> --><!-- 20191030 stj 수정 -->
      <p class="tit">통합브랜드 명</p>
      <strong id="intg_bran_nm"></strong>
      <span id="intg_bran_cd"></span>
      <dl class="following">
        <dt>팔로잉 고객수</dt>
        <dd id="following_cust_cnt"></dd>
      </dl>
    </div>
    <div class="brand_rate">
      <p class="tit">브랜드 등급<a href="javascript:benefit_open();">혜택보기</a></p>
      <div class="rating_cnt">
        
      </div>
      <ul>
        <li>
          <!-- <span>현재스코어</span> --><!-- 20191030 stj 수정 -->
          <span>현재 점수</span>
          <p><strong id="md_lvl_score"></strong>점</p>
        </li>
        <li>
          <span>다음 등급까지<br>남은 점수</span>
          <p><span id="md_lvl_need_score"></span>점</p>
        </li>
      </ul>
    </div>
    <div class="store_rate">
      <!-- <p class="tit">점포 등급 <span>입점점포 유무로 구분 됩니다.</span></p> --><!-- 20191030 stj 수정 -->
      <p class="tit">점포 등급</p>
      <ul id="store_list">
      </ul>
    </div>
  </div>
  <div class="info2">
    <!--<p class="tit">고객 자원 <span>* 최적의 비율로 세팅된 고객군 입니다.</span></p>--><!-- 20191030 stj 수정 -->
    <p class="tit">고객 자원 <span>* 브랜드별 사용 가능한 고객 POOL입니다. (실제 접근 시는 마케팅활용 동의 및 플랫폼 등급 등에 따라 변경될 수 있습니다.)</span></p>
    <ul id="cust_list">
    </ul>
  </div>
  <div class="info3">
    <div class="prom_wrap">
      <!-- <p class="tit">프로모션<span>사용 가능 여부를 확인 할 수 있습니다.</span></p>--><!-- 20191030 stj 수정 -->
      <p class="tit">프로모션</p>
      <ul>
        <li class="prom1">
          <strong>할인쿠폰</strong>
          <!-- <p>구매시<br>일정 요율/<br>금액 할인</p> --><!-- 20191030 stj 수정 -->
          <p>금액 할인</p>
        </li>
        <li class="prom2">
          <!-- <strong>상품권</strong> --><!-- 20191030 stj 수정 -->
          <strong>사은행사</strong>
          <p>구매금액별<br>상품권증정</p>
        </li>
        <li class="prom3">
          <strong>세일리지</strong>
          <p>한도금액<br>내 할인</p>
        </li>
        <li class="prom4">
          <strong>마일리지</strong>
          <!-- <p>누적금액<br>사은</p> --><!-- 20191030 stj 수정 -->
          <p>누적금액별<br>상품권증정</p>
        </li>
        <li class="prom5">
          <strong>멤버스 바</strong>
          <!-- <p>음료 무료<br>제공</p> --><!-- 20191030 stj 수정 -->
          <p>이용쿠폰</p>
        </li>
        <li class="prom6">
          <strong>주차권</strong>
          <p>무료 주차<br>제공</p>
        </li>
      </ul>
    </div>
    <div class="channel_wrap">
      <p class="tit">발송채널<span>(APP 기본 발송)</span></p>
      <ul>
        <li class="channel1">
          <strong>LMS</strong>
          <p>텍스트로 작성</p>
        </li>
        <li class="channel2">
          <strong>MMS</strong>
          <p>이미지 첨부</p>
        </li>
        <li class="channel3">
          <strong>모바일 DM</strong>
          <!-- <p>제작된 DM사용</p> --><!-- 20191030 stj 수정 -->
          <p>모바일 DM 제작</p>
        </li>
      </ul>
    </div>
  </div>
</div>
<div class="f_l brand_history">
  <p class="tit">History</p>
  <ul class="his_cnt">
  </ul>
</div>