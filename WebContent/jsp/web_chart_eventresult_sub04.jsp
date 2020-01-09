<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<script type="text/javascript">

//브랜드 혜택 쿠폰 사용실적
//var selectEvtBrandOffer = new oza_TMHandler('com.obzen.bmpanly.ColEvtSaleRate', 'selectEvtBrandOffer', '0', '\@#%');
//selectEvtBrandOffer.setAddDataField('CAMP_ID', camp_id);
//selectEvtBrandOffer.execute(null, false); //  tm 실행
//var tmResult = selectEvtBrandOffer.getResult(); //  컬렉션 TM 결과 호출
//var tmBrandOffer_json = "";
//if(tmResult != ""){tmBrandOffer_json = JSON.parse(tmResult);} //  자바스크립트 객체로 변환
//selectEvtBrandOffer.clear();

var brand_offer1_yn  = "";
var brand_offer2_yn  = "";
var brand_offer3_yn  = "";
var brand_offer1_nm  = "";
var brand_offer2_nm  = "";
var brand_offer3_nm  = "";
var brand_offer1_use_cnt = "";
var brand_offer2_use_cnt = "";
var brand_offer3_use_cnt = "";
var brand_offer_tot_dwn_cnt = "";
var selectEvtBrandOffer = new oza_TMHandler('com.obzen.bmpanly.DocEvtSaleRate', 'selectEvtBrandOffer', '1', '\@#%');
selectEvtBrandOffer.setAddDataField('CAMP_ID', camp_id);
selectEvtBrandOffer.returnlist('BRAND_OFFER1_YN;BRAND_OFFER2_YN;BRAND_OFFER3_YN;BRAND_OFFER1_NM;BRAND_OFFER2_NM;BRAND_OFFER3_NM;BRAND_OFFER1_USE_CNT;BRAND_OFFER2_USE_CNT;BRAND_OFFER3_USE_CNT;BRAND_OFFER_DWN_CNT');
selectEvtBrandOffer.execute(null, false);
brand_offer1_yn = selectEvtBrandOffer.ElementValue('BRAND_OFFER1_YN');
brand_offer2_yn = selectEvtBrandOffer.ElementValue('BRAND_OFFER2_YN');
brand_offer3_yn = selectEvtBrandOffer.ElementValue('BRAND_OFFER3_YN');
brand_offer1_nm = selectEvtBrandOffer.ElementValue('BRAND_OFFER1_NM');
brand_offer2_nm = selectEvtBrandOffer.ElementValue('BRAND_OFFER2_NM');
brand_offer3_nm = selectEvtBrandOffer.ElementValue('BRAND_OFFER3_NM');
brand_offer1_use_cnt = selectEvtBrandOffer.ElementValue('BRAND_OFFER1_USE_CNT');
brand_offer2_use_cnt = selectEvtBrandOffer.ElementValue('BRAND_OFFER2_USE_CNT');
brand_offer3_use_cnt = selectEvtBrandOffer.ElementValue('BRAND_OFFER3_USE_CNT');
brand_offer_tot_dwn_cnt = selectEvtBrandOffer.ElementValue('BRAND_OFFER_DWN_CNT');
selectEvtBrandOffer.clear();
brand_offer1_use_cnt = parseInt(isNullZero(brand_offer1_use_cnt));
brand_offer2_use_cnt = parseInt(isNullZero(brand_offer2_use_cnt));
brand_offer3_use_cnt = parseInt(isNullZero(brand_offer3_use_cnt));
brand_offer_tot_dwn_cnt = parseInt(isNullZero(brand_offer_tot_dwn_cnt));


//신세계 DMS행사 실적
var appr_evt_yn = "";
var cpn_evt_yn = "";
var app_show_dstic_cd = "";
var dnld_cust_cnt = "";
var dnld_cust_sale_cnt = "";
var dnld_cust_sale_amt = "";
var dnld_cust_sale_ppc = "";
var dms_rsp_cust_cnt = "";
var dms_pmot_cust_cnt = "";
var dms_pmot_cost = "";
var selectEvtDmsOfferInfo = new oza_TMHandler('com.obzen.bmpanly.DocEvtSaleRate', 'selectEvtDmsOffer', '1', '\@#%');
selectEvtDmsOfferInfo.setAddDataField('CAMP_ID', camp_id);
selectEvtDmsOfferInfo.returnlist('APPR_EVT_YN;CPN_EVT_YN;APP_SHOW_DSTIC_CD;DNLD_CUST_CNT;DNLD_CUST_SALE_CNT;DNLD_CUST_SALE_AMT;DNLD_CUST_SALE_PPC;DMS_RSP_CUST_CNT;DMS_PMOT_CUST_CNT;DMS_PMOT_COST');
selectEvtDmsOfferInfo.execute(null, false);
appr_evt_yn = selectEvtDmsOfferInfo.ElementValue('APPR_EVT_YN');
cpn_evt_yn = selectEvtDmsOfferInfo.ElementValue('CPN_EVT_YN');
app_show_dstic_cd = selectEvtDmsOfferInfo.ElementValue('APP_SHOW_DSTIC_CD');
dnld_cust_cnt = selectEvtDmsOfferInfo.ElementValue('DNLD_CUST_CNT');
dnld_cust_sale_cnt = selectEvtDmsOfferInfo.ElementValue('DNLD_CUST_SALE_CNT');
dnld_cust_sale_amt = selectEvtDmsOfferInfo.ElementValue('DNLD_CUST_SALE_AMT');
dnld_cust_sale_ppc = selectEvtDmsOfferInfo.ElementValue('DNLD_CUST_SALE_PPC');
dms_rsp_cust_cnt = selectEvtDmsOfferInfo.ElementValue('DMS_RSP_CUST_CNT');
dms_pmot_cust_cnt = selectEvtDmsOfferInfo.ElementValue('DMS_PMOT_CUST_CNT');
dms_pmot_cost = selectEvtDmsOfferInfo.ElementValue('DMS_PMOT_COST');
selectEvtDmsOfferInfo.clear();

dnld_cust_cnt = parseInt(isNullZero(dnld_cust_cnt));
dnld_cust_sale_cnt = parseInt(isNullZero(dnld_cust_sale_cnt));
dms_rsp_cust_cnt = parseInt(isNullZero(dms_rsp_cust_cnt));
dms_pmot_cust_cnt = parseInt(isNullZero(dms_pmot_cust_cnt));

dnld_cust_sale_amt = parseInt(isNullZero(dnld_cust_sale_amt));
dms_pmot_cost = parseInt(isNullZero(dms_pmot_cost));
dnld_cust_sale_ppc = parseInt(isNullZero(dms_pmot_cost));
if(dnld_cust_sale_amt != 0) {dnld_cust_sale_amt = exCeil(dnld_cust_sale_amt/division_amt, 1);}
if(dms_pmot_cost != 0)      {dms_pmot_cost = exCeil(dms_pmot_cost/division_amt, 1);}
if(dnld_cust_sale_ppc != 0) {dnld_cust_sale_ppc = exCeil(dnld_cust_sale_ppc/division_ppc, 1);}

//화면 시작 시 실행
$(document).ready(function() {
	
	screenLog("조회", "web_chart_eventresult_sub04", "브랜드마케팅>분석>분석Report>브랜드혜택및 추가참여고객실적",get_client_ip);//화면 로그(공통)
	
	//상단 고정 내용 시작------------------------------------------------------------
	var innerHtml = "";
	
	
	innerHtml += "<div class='top_cnt'>";
	innerHtml += "<div class='top_left'>";
	
	if(grd_level == "1"){
		innerHtml += "<div class='img_wrap'><img src='../../img/web/icon/br_img1.png' alt=''></div>";
		innerHtml += "<div class='txt_wrap'><h2>Excellent!<p><BR>성공적인 행사였습니다. 다시한번 도전~!</p></h2><p><strong>" + grd_msg + "</strong>이 특히 좋았습니다.</p></div>";
	} else if(grd_level == "2"){
		innerHtml += "<div class='img_wrap'><img src='../../img/web/icon/br_img2.png' alt=''></div>";
		innerHtml += "<div class='txt_wrap'><h2>Good!<p><BR>양호한 행사결과였습니다. 조금만 더 노력해보세요!</p></h2><p><strong>" + grd_msg + "</strong>이 특히 부족합니다.</p></div>";
	} else if(grd_level == "3"){
		innerHtml += "<div class='img_wrap'><img src='../../img/web/icon/br_img3.png' alt=''></div>";
		innerHtml += "<div class='txt_wrap'><h2>Cheer up!<p><BR>평균이하의 다소 부진한 행사였습니다.<BR>분석을 통하여 더 좋은 결과를 얻어보세요!</p></h2><p><strong>" + grd_msg + "</strong>이 특히 부족합니다.</p></div>";
	}  else {
		innerHtml += "<div class='txt_wrap fit_noti'><p><strong>'FIT 행사현황'</strong>에서 행사별 자세히 보기 버튼을 클릭해주세요.</p></div>";
	}
	
	innerHtml += "</div>";
	innerHtml += "<div class='top_right'>"+mainTitle+"<br>"+mainTitleDate+"</div>";
	if(sys_div == "2"){innerHtml += "<a href='javascript:resCustCntExcel();' class='btn_down'>응답고객 다운로드</a>";}//운영정보 사용자만 사용
	innerHtml += "</div>";
	innerHtml += "<ul>";
	innerHtml += "<li>";
	innerHtml += "<div class='tit'><span class='tip_img' title='행사대상고객중 실제 구매한 고객'></span><p>응답고객수</p></div>";
	innerHtml += "<p><strong>"+AddComma(top_rsp_cust_cnt)+"</strong>명</p>";
	innerHtml += "</li>";
	innerHtml += "<li>";
	innerHtml += "<div class='tit'><p>응답고객<br>객단가</p></div>";
	innerHtml += "<p><strong>"+AddComma(top_rsp_cust_price)+"</strong>만원</p>";
	innerHtml += "</li>";
	innerHtml += "<li>";
	innerHtml += "<div class='tit'><span class='tip_img'title='동일기간 구매한 모든 고객'></span><p>전체고객수</p></div>";
	innerHtml += "<p><strong>"+AddComma(top_md_tot_cust_cnt)+"</strong>명</p>";
	innerHtml += "</li>";
	innerHtml += "<li>";
	innerHtml += "<div class='tit'><p>전체고객<br>객단가</p></div>";
	innerHtml += "<p><strong>"+AddComma(top_md_tot_cust_price)+"</strong>만원</p>";
	innerHtml += "</li>";
	innerHtml += "</ul>";
	
	$(".analysis_top").html(innerHtml);
	
	drawBrandOfferInfo();
	drawDmsEvtOfferInfo();
	
});

/**========================================================================================
* 브랜드 혜택정보
========================================================================================*/
function drawBrandOfferInfo(){
	var divHtml = "";
	
	$("#brand_offer_tot_dwn_cnt").text(brand_offer_tot_dwn_cnt  + " 명");
	
	if(brand_offer1_yn != "N") {
		divHtml += "<li>";
		divHtml += " <p class='txt_tit'>브랜드 컨텐츠 1 사용 고객</p>";
		divHtml += " <img src='../../img/web/icon/ic_step1.png' alt=''>";
		divHtml += " <p class='txt1'>" + brand_offer1_nm + "</p>";
		divHtml += " <p class='txt2'><strong>" + AddComma(brand_offer1_use_cnt) + "</strong>명</p>";
		divHtml += "</li>";
	}
	
	if(brand_offer2_yn != "N") {
		divHtml += "<li>";
		divHtml += " <p class='txt_tit'>브랜드 컨텐츠 2 사용 고객</p>";
		divHtml += " <img src='../../img/web/icon/ic_step2.png' alt=''>";
		divHtml += " <p class='txt1'>" + brand_offer2_nm + "</p>";
		divHtml += " <p class='txt2'><strong>" + AddComma(brand_offer2_use_cnt) + "</strong>명</p>";
		divHtml += "</li>";
	}
	
	if(brand_offer3_yn != "N") {
		divHtml += "<li>";
		divHtml += " <p class='txt_tit'>브랜드 컨텐츠 3 사용 고객</p>";
		divHtml += " <img src='../../img/web/icon/ic_step3.png' alt=''>";
		divHtml += " <p class='txt1'>" + brand_offer3_nm + "</p>";
		divHtml += " <p class='txt2'><strong>" + AddComma(brand_offer3_use_cnt) + "</strong>명</p>";
		divHtml += "</li>";
	}
	$("#brand_offer_area").html(divHtml);
	
}

/**========================================================================================
* 신세계 dms혜택정보
========================================================================================*/
function drawDmsEvtOfferInfo(){
	/* 
	app_show_dstic_cd : F(팔로잉고객), A(전체고객)
	appr_evt_yn : Y(상품권사은행사 이벤트)
	cpn_evt_yn : Y(할인쿠폰증정 이벤트)
	*/
	
	$("#f_dnld_cust_cnt").text("0");
	$("#a_dnld_cust_cnt").text("0");
	$("#f_dnld_cust_sale_cnt").text("0");
	$("#a_dnld_cust_sale_cnt").text("0");
	$("#f_dnld_cust_sale_amt").text("0");
	$("#a_dnld_cust_sale_amt").text("0");
	$("#f_dnld_cust_sale_ppc").text("0");
	$("#a_dnld_cust_sale_ppc").text("0");
	
	$("#cpn_dms_pmot_cust").text("0/0");
	$("#appr_dms_pmot_cust").text("0/0");
	$("#cpn_dms_pmot_cost").text("0");
	$("#appr_dms_pmot_cost").text("0");
	
	var f_dnld_cust_cnt = 0;
	var f_dnld_cust_sale_cnt = 0;
	var a_dnld_cust_cnt = 0;
	var a_dnld_cust_sale_cnt = 0;
	
	if(app_show_dstic_cd == "F"){
		$("#f_dnld_cust_cnt").text(AddComma(dnld_cust_cnt));
		$("#f_dnld_cust_sale_cnt").text(AddComma(dnld_cust_sale_cnt));
		$("#f_dnld_cust_sale_amt").text(AddComma(dnld_cust_sale_amt));
		$("#f_dnld_cust_sale_ppc").text(AddComma(dnld_cust_sale_ppc));
		f_dnld_cust_cnt = dnld_cust_cnt;
		f_dnld_cust_sale_cnt = dnld_cust_sale_cnt;
		
	} else if(app_show_dstic_cd == "A"){
		$("#a_dnld_cust_cnt").text(AddComma(dnld_cust_cnt));
		$("#a_dnld_cust_sale_cnt").text(AddComma(dnld_cust_sale_cnt));
		$("#a_dnld_cust_sale_amt").text(AddComma(dnld_cust_sale_amt));
		$("#a_dnld_cust_sale_ppc").text(AddComma(dnld_cust_sale_ppc));
		a_dnld_cust_cnt = dnld_cust_cnt;
		a_dnld_cust_sale_cnt = dnld_cust_sale_cnt;
	}
	
	if(cpn_evt_yn == "Y"){
		$("#cpn_dms_pmot_cust").text(AddComma(dms_pmot_cust_cnt) + "/" + AddComma(dms_rsp_cust_cnt));
		$("#cpn_dms_pmot_cost").text(AddComma(dms_pmot_cost));
		
	}
	if(appr_evt_yn == "Y"){
		$("#appr_dms_pmot_cust").text(AddComma(dms_pmot_cust_cnt) + "/" + AddComma(dms_rsp_cust_cnt));
		$("#appr_dms_pmot_cost").text(AddComma(dms_pmot_cost));
	}
	//f_dnld_cust_cnt = 1000;
	//f_dnld_cust_sale_cnt = 753;
	//팔로잉고객 datasrc
	var following_cust_data = [
		    {
	        column: "명",
	        val1: f_dnld_cust_sale_cnt,
	        val2: f_dnld_cust_cnt ? f_dnld_cust_cnt - f_dnld_cust_sale_cnt : 1
		    }];
	//전체고객 datasrc
	var all_cust_data = [
	    {
        column: "명",
        val1: a_dnld_cust_sale_cnt,
        val2: a_dnld_cust_cnt ? a_dnld_cust_cnt - a_dnld_cust_sale_cnt : 1
	    }];
	if(f_dnld_cust_cnt != 0) {
		
		var f_cust_rt = exCeil(f_dnld_cust_sale_cnt/f_dnld_cust_cnt * 100, 2);
		$("#f_chart_tooltip").attr("title", f_cust_rt + "%");	
	}
	
	if(a_dnld_cust_cnt != 0) {
		
		var a_cust_rt = exCeil(a_dnld_cust_sale_cnt/a_dnld_cust_cnt * 100, 2);
		$("#a_chart_tooltip").attr("title", a_cust_rt + "%");	
	}
	
	
	$("#following_cust_chart").dxChart({
		animation:{
	            duration: 2000 // 로딩 milliseconds 지정
	     },
	     dataSource: following_cust_data,
	     commonSeriesSettings: {
	         argumentField: "column",  // argumentField 지정
	         type: "fullStackedBar"
	     },
	     size: {  width : 130, height : 182 },
	     argumentAxis: { visible: false, label: {visible:false} }, // x축 옵션
	     valueAxis: {visible : true, // y축 옵션
	                  grid : { visible : false },
	                  tick: {visible : false},
	                  label: {visible : false},
	                  position:"right"
	      },
	      series: [
	          { valueField: "val1", name: "val1", color: "#2DD790" }, // valueField 지정
	          { valueField: "val2", name: "val2", color: "#E1E6ED"}
	        ],
	        legend: {
	            visible: false
	        },
	        tooltip: {
	            enabled: true,
	            zIndex:1e3,
	            customizeTooltip: function (arg) {
	                return { text: arg.valueText + "명"};
	            }
	        }
		
		
	});
	
	$("#all_cust_chart").dxChart({
		animation:{
	            duration: 2000 // 로딩 milliseconds 지정
	     },
	     dataSource: all_cust_data,
	     commonSeriesSettings: {
	         argumentField: "column",  // argumentField 지정
	         type: "fullStackedBar"
	     },
	     size: {  width : 130, height : 182 },
	     argumentAxis: { visible: false, label: {visible:false} }, // x축 옵션
	     valueAxis: {visible : true, // y축 옵션
	                  grid : { visible : false },
	                  tick: {visible : false},
	                  label: {visible : false},
	                  position:"right"
	      },
	      series: [
	          { valueField: "val1", name: "val1", color: "#4590eb" }, // valueField 지정
	          { valueField: "val2", name: "val2", color: "#E1E6ED"}
	        ],
	        legend: {
	            visible: false
	        },
	        tooltip: {
	            enabled: true,
	            customizeTooltip: function (arg) {
	                return {
	                    text: arg.valueText
	                };
	            }
	        }
		
		
	});
	
	
}

</script>

<div id="web_content2">
   <div class="analysis_wrap">
     <div class="analysis_top">
     <!-- 상단 -->
       <!-- <div class="top_cnt">
         <div class="top_left">
           <div class="img_wrap"><img src="../../img/web/icon/br_img1.png" alt=""></div>
           <div class="txt_wrap">
             <h2>Excellent!<p>성공적인 행사였습니다. 다시한번 도전~!</p></h2>
             <p><strong>행사 매출, 응답률</strong>이 특히 좋았습니다.</p>
           </div>
         </div>
         <div class="top_right"><br>(일간)</div>
       </div>
       <ul>
         <li>
           <div class="tit">
             <p><span class="tip_img"><span class="tooltip">응답고객이란?<br>행사대상고객중 실제 구매한 고객</span></span>응답고객수</p>
           </div>
           <p><strong>0</strong>명</p>
         </li>
         <li>
           <div class="tit"><p>응답고객<br>객단가</p></div>
           <p><strong>0</strong>만원</p>
         </li>
         <li>
           <div class="tit"><p><span class="tip_img"><span class="tooltip">전체고객이란?<br>동일기간 구매한 모든 고객</span></span>전체고객수</p></div>
           <p><strong>0</strong>명</p>
         </li>
         <li>
           <div class="tit"><p>전체고객<br>객단가</p></div>
           <p><strong>0</strong>만원 </p>
         </li>
       </ul> -->
     </div>
     <div class="download_wrap">
       <div class="box download1">
         <p class="tit">브랜드 컨텐츠 쿠폰 사용실적 (접근고객 + 추가참여고객)</p>
         <ul id="brand_offer_area">
         </ul>
         <div class="downclient">
          <span>다운로드고객 : </span>
          <p id="brand_offer_tot_dwn_cnt"></p>
         </div>
       </div>
       <div class="download2">
         <div class="box2 cnt_left">
           <p class="tit">FIT 팔로잉 고객 (접근고객 외)</p>
           <div class="box_top">
             <ul class="client">
               <li>
                 <span>응답고객</span>
                 <p class="font_color"><strong id="f_dnld_cust_sale_cnt"></strong>명</p>
               </li>
               <li>
                 <span>행사 다운로드고객수</span>
                 <p><strong id="f_dnld_cust_cnt"></strong>명</p>
               </li>
             </ul>
             <div class="graph_wrap">
               <div class="graph" id="following_cust_chart"></div>
               <div class="graph_img"><img src="../../img/web/chart/human_chart3.png" id= "f_chart_tooltip" title=""></div>
             </div>
             <ul>
               <li>
                 <span>응답매출</span>
                 <p><strong id="f_dnld_cust_sale_amt"></strong>백만</p>
               </li>
               <li>
                 <span>객단가</span>
                 <p><strong id="f_dnld_cust_sale_ppc"></strong>만원</p>
               </li>
             </ul>
           </div>
           <div class="box_btm">
             <div class="btm_cnt1">
               <p>할인쿠폰 증정</p>
               <ul>
                 <li>
                   <span>참여인원/응답고객</span>
                   <p><strong id="cpn_dms_pmot_cust"></strong>명</p>
                 </li>
                 <li>
                   <span>발생비용</span>
                   <p><strong id="cpn_dms_pmot_cost"></strong>백만</p>
                 </li>
               </ul>
             </div>
           </div>
         </div>
         <div class="box2 cnt_right">
           <p class="tit">전체 고객 (접근고객 외)</p>
           <div class="box_top">
             <ul class="client">
               <li>
                 <span>응답고객</span>
                 <p class="font_color"><strong id="a_dnld_cust_sale_cnt"></strong>명</p>
               </li>
               <li>
                 <span>행사 다운로드고객수</span>
                 <p><strong id="a_dnld_cust_cnt"></strong>명</p>
               </li>
               
             </ul>
             <div class="graph_wrap">
               <div class="graph" id="all_cust_chart"></div>
               <div class="graph_img"><img src="../../img/web/chart/human_chart4.png" id= "a_chart_tooltip" title=""></div>
             </div>
             <ul>
               <li>
                 <span>응답매출</span>
                 <p><strong id="a_dnld_cust_sale_amt"></strong>백만</p>
               </li>
               <li>
                 <span>객단가</span>
                 <p><strong id="a_dnld_cust_sale_ppc"></strong>만원</p>
               </li>
             </ul>
           </div>
           <div class="box_btm">
             <div class="btm_cnt1">
               <p>상품권 사은행사</p>
               <ul>
                 <li>
                   <span>참여인원/응답고객</span>
                   <p><strong id="appr_dms_pmot_cust"></strong>명</p>
                 </li>
                 <li>
                   <span>발생비용</span>
                   <p><strong id="appr_dms_pmot_cost"></strong>백만</p>
                 </li>
               </ul>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 </div>
