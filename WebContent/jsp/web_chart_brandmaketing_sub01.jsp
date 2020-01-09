<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">
var titleTxt = "";

//행사 매출 순위
var sales_nm_01 = "";
var sales_amt_01 = 0;
var sales_nm_02 = "";
var sales_amt_02 = 0;
var sales_nm_03 = "";
var sales_amt_03 = 0;
var sales_nm_04 = "";
var sales_amt_04 = 0;
var sales_nm_05 = "";
var sales_amt_05 = 0;

//행사 응답률 순위
var res_nm_01 = "";
var res_rt_01 = 0;
var res_nm_02 = "";
var res_rt_02 = 0;
var res_nm_03 = "";
var res_rt_03 = 0;
var res_nm_04 = "";
var res_rt_04 = 0;
var res_nm_05 = "";
var res_rt_05 = 0;

//브랜드 등급점수 순위
var brand_nm_01 = "";
var brand_scr_01 = 0;
var brand_nm_02 = "";
var brand_scr_02 = 0;
var brand_nm_03 = "";
var brand_scr_03 = 0;
var brand_nm_04 = "";
var brand_scr_04 = 0;
var brand_nm_05 = "";
var brand_scr_05 = 0;

//for test
/*
yyyy_div = "20193";
store_cd = "01";
md_cd = "000111";
*/
//TM Start =================================================================================================
//행사매출순위 조회-------------------------
var evtAmtTm = new oza_TMHandler('com.obzen.bmpanly.ColMarketCond', 'selectEvtAmtRank', '0', '\@#%');
evtAmtTm.setAddDataField('BASE_QRT', yyyy_div);//20192
evtAmtTm.setAddDataField('STORE_CD', store_cd);
evtAmtTm.setAddDataField('MD_CD', md_cd);
evtAmtTm.execute(null, false);
var evtAmtTmResult = evtAmtTm.getResult();
var evtAmtTm_json = "";
if(evtAmtTmResult != ""){
  evtAmtTm_json = JSON.parse(evtAmtTmResult);
  
  /*
  MD_CD : MD코드
  MD_NM : MD명
  RANK : 순위
  AMT : 매출액
  */
}
evtAmtTm.clear(); 

//행사 응답률 순위 조회-------------------------
var evtRateTm = new oza_TMHandler('com.obzen.bmpanly.ColMarketCond', 'selectEvtRateRank', '0', '\@#%');
evtRateTm.setAddDataField('BASE_QRT', yyyy_div);
evtRateTm.setAddDataField('STORE_CD', store_cd);
evtRateTm.setAddDataField('MD_CD', md_cd);
evtRateTm.execute(null, false);
var evtRateTmResult = evtRateTm.getResult();
var evtRateTm_json = "";
if(evtRateTmResult != ""){
  evtRateTm_json = JSON.parse(evtRateTmResult);
  /*
  MD_CD : MD코드
  MD_NM : MD명
  RANK : 순위
  RATE : 응답율
  */
}
evtRateTm.clear();



//브랜드 등급 순위 조회-------------------------
var brandTm = new oza_TMHandler('com.obzen.bmpanly.ColMarketCond', 'selectBrandRank', '0', '\@#%');
brandTm.setAddDataField('BASE_QRT', yyyy_div);
brandTm.setAddDataField('STORE_CD', store_cd);
brandTm.setAddDataField('MD_CD', md_cd);
brandTm.execute(null, false);
var brandTmResult = brandTm.getResult();
var brandTm_json = "";
if(brandTmResult != ""){
  brandTm_json = JSON.parse(brandTmResult);
  /*
  MD_CD : MD코드
  MD_NM : MD명
  RANK : 순위
  SCORE : 응답율
  */
}
brandTm.clear();



//경쟁/신규 매출정보 조회-------------------------
var mymd_sale_cnt = 0; 
var otmd_camp_rcv_cust_cnt = 0; //타브랜드행사수신고객수
var mymd_sale_amt = 0;
var otmd_camp_rcv_sale_amt = 0;
var otmd_cust_camp_rcv_cnt = 0; //타브랜드고객행사수신고객수
var mymd_new_cust_cnt = 0;
var mymd_new_cust_sale_amt = 0;
var otmd_sale_cnt = 0;
var otmd_sale1_cnt = 0;
var otmd_sale2_cnt = 0;
var otmd_sale3_cnt = 0;


var otMdTm = new oza_TMHandler('com.obzen.bmpanly.DocMarketCond', 'selectOtMdInfo', '1', '\@#%');
otMdTm.setAddDataField('BASE_QRT', yyyy_div);
otMdTm.setAddDataField('STORE_CD', store_cd);
otMdTm.setAddDataField('MD_CD', md_cd);
otMdTm.setAddDataField('PC_CD', pc_cd);
otMdTm.returnlist('OTMD_CAMP_REC_CUST_CNT;OTMD_SALE_CNT;OTMD_CAMP_REC_SALE_AMT;OTMD_SALE1_CNT;OTMD_SALE2_CNT;OTMD_SALE3_CNT;NEW_CUST_CNT;OTMD_CUST_CAMP_REC_CNT;NEW_CUST_SALE_AMT;MD_SALE_AMT;MD_SALE_CNT');
otMdTm.execute(null, false);
otmd_camp_rcv_cust_cnt = otMdTm.ElementValue('OTMD_CAMP_REC_CUST_CNT');//타브랜드 행사수신 고객수
otmd_sale_cnt = otMdTm.ElementValue('OTMD_SALE_CNT');//타브랜드 구매 고객
otmd_camp_rcv_sale_amt = otMdTm.ElementValue('OTMD_CAMP_REC_SALE_AMT');//타브랜드 행사매출
otmd_sale1_cnt = otMdTm.ElementValue('OTMD_SALE1_CNT');//타브랜드 구매고객1회
otmd_sale2_cnt = otMdTm.ElementValue('OTMD_SALE2_CNT');//타브랜드 구매고객2회
otmd_sale3_cnt = otMdTm.ElementValue('OTMD_SALE3_CNT');//타브랜드 구매고객3회
mymd_new_cust_cnt = otMdTm.ElementValue('NEW_CUST_CNT');// 내 브랜드 신규 고객
otmd_cust_camp_rcv_cnt = otMdTm.ElementValue('OTMD_CUST_CAMP_REC_CNT');//타MD고객중 행사수신 고객수(고객 아닌데 행사내용 받은 사람)
mymd_new_cust_sale_amt = otMdTm.ElementValue('NEW_CUST_SALE_AMT');//신규 고객 내브랜드 구매 실적
mymd_sale_amt = otMdTm.ElementValue('MD_SALE_AMT');//내 매출 전체
mymd_sale_cnt = otMdTm.ElementValue('MD_SALE_CNT');//내 고객수 전체
otMdTm.clear();
//test
//mymd_sale_amt = 20833110;
//otmd_camp_rcv_sale_amt = 7219440;

otmd_sale_cnt= parseInt(isNullZero(otmd_sale_cnt));
mymd_new_cust_cnt = parseInt(isNullZero(mymd_new_cust_cnt));
otmd_camp_rcv_cust_cnt = parseInt(isNullZero(otmd_camp_rcv_cust_cnt));
otmd_camp_rcv_cust_cnt = parseInt(isNullZero(otmd_camp_rcv_cust_cnt));
otmd_cust_camp_rcv_cnt = parseInt(isNullZero(otmd_cust_camp_rcv_cnt));
mymd_sale_cnt = parseInt(isNullZero(mymd_sale_cnt));

otmd_camp_rcv_sale_amt = parseInt(isNullZero(otmd_camp_rcv_sale_amt));
if(otmd_camp_rcv_sale_amt != 0)     otmd_camp_rcv_sale_amt = exCeil(otmd_camp_rcv_sale_amt/division_amt, 1);
mymd_new_cust_sale_amt = parseInt(isNullZero(mymd_new_cust_sale_amt));
if(mymd_new_cust_sale_amt != 0)     mymd_new_cust_sale_amt = exCeil(mymd_new_cust_sale_amt/division_amt, 1);
mymd_sale_amt = parseInt(isNullZero(mymd_sale_amt));
if(mymd_sale_amt != 0)     mymd_sale_amt = exCeil(mymd_sale_amt/division_amt, 1);

//TM End =================================================================================================

//화면 시작 시 실행
$(document).ready(function() {
  screenLog("조회", "web_chart_brandsales_sub01", "행사결과보기>FIT 경쟁현황",get_client_ip);//화면 로그(공통)
  
  //상단 타이틀
  
  //$("#title_txt").addClass("fail");
  //titleTxt = "“S-플랫폼을 잘 활용하여 <strong class='fc_red'>신규고객획득</strong>에 더 집중해 보세요”";
  //내 구매고객수와 타브랜드 구매고객수 비교하여 낮으면  p태그에 class = fail
  	if(md_cd == "") {
  		titleTxt = "<div class='md_noti'><p><strong>MD</strong>를 선택해주세요.</p></div>";
  	} else {
  		
  		if(mymd_new_cust_cnt > otmd_sale_cnt) {
  			titleTxt = "<p>“FIT PARTNERS를 잘 활용하여 <strong class='fc_blue'>많은 신규고객</strong>을 획득하고 있습니다.”</p>";  
  	  	} else {
  			titleTxt = "<p>“FIT PARTNERS를 잘 활용하여 <strong class='fc_red'>신규고객획득</strong>에 더 집중해보세요.”</p>";
  			$("#title_txt").find(">p").addClass("fail");
  	  	}
  	}
	
  
  	$("#title_txt").html(titleTxt);
  
	drawRankInfo(); //행사매출 순위, 행사응답률 순위, 브랜드 등급점수 순위
	drawMyCustomer();
	drawDiffBrandCus();
	drawMyPurchase();
	drawNewCustomer1();
	drawNewCustomer2();
	drawNewCustomer3();
});





/**========================================================================================
 * 매출,상위 SMD 비교 매출 추이(지난 3개월)
 ========================================================================================*/
function drawRankInfo(){
  
  var i = 0;

  
  for(i=0; i<evtAmtTm_json.length; i++) {
    if(1 == evtAmtTm_json[i].RANK){
      sales_amt_01 = parseInt(isNullZero(evtAmtTm_json[i].AMT));
      sales_nm_01 = evtAmtTm_json[i].MD_NM;
    }else if(2 == evtAmtTm_json[i].RANK){
      sales_amt_02 = parseInt(isNullZero(evtAmtTm_json[i].AMT));
      sales_nm_02 = evtAmtTm_json[i].MD_NM;
    }else if(3 == evtAmtTm_json[i].RANK){
      sales_amt_03 = parseInt(isNullZero(evtAmtTm_json[i].AMT));
      sales_nm_03 = evtAmtTm_json[i].MD_NM;
    }else if(4 == evtAmtTm_json[i].RANK){
      sales_amt_04 = parseInt(isNullZero(evtAmtTm_json[i].AMT));
      sales_nm_04 = evtAmtTm_json[i].MD_NM;
    }else if(5 == evtAmtTm_json[i].RANK){
      sales_amt_05 = parseInt(isNullZero(evtAmtTm_json[i].AMT));
      sales_nm_05 = evtAmtTm_json[i].MD_NM;
    }
  }
  
  for(i=0; i<evtRateTm_json.length; i++) {
    if(1 == evtRateTm_json[i].RANK){
      res_rt_01 = parseFloat(isNullZero(evtRateTm_json[i].RATE));
      res_nm_01 = evtRateTm_json[i].MD_NM;
    }else if(2 == evtRateTm_json[i].RANK){
      res_rt_02 = parseFloat(isNullZero(evtRateTm_json[i].RATE));
      res_nm_02 = evtRateTm_json[i].MD_NM;
    }else if(3 == evtRateTm_json[i].RANK){
      res_rt_03 = parseFloat(isNullZero(evtRateTm_json[i].RATE));
      res_nm_03 = evtRateTm_json[i].MD_NM;
    }else if(4 == evtRateTm_json[i].RANK){
      res_rt_04 = parseFloat(isNullZero(evtRateTm_json[i].RATE));
      res_nm_04 = evtRateTm_json[i].MD_NM;
    }else if(5 == evtRateTm_json[i].RANK){
      res_rt_05 = parseFloat(isNullZero(evtRateTm_json[i].RATE));
      res_nm_05 = evtRateTm_json[i].MD_NM;
    }
  }
  
  for(i=0; i<brandTm_json.length; i++) {
    if(1 == brandTm_json[i].RANK){
      brand_scr_01 = parseInt(isNullZero(brandTm_json[i].SCORE));
      brand_nm_01 = brandTm_json[i].MD_NM;
    }else if(2 == brandTm_json[i].RANK){
      brand_scr_02 = parseInt(isNullZero(brandTm_json[i].SCORE));
      brand_nm_02 = brandTm_json[i].MD_NM;
    }else if(3 == brandTm_json[i].RANK){
      brand_scr_03 = parseInt(isNullZero(brandTm_json[i].SCORE));
      brand_nm_03 = brandTm_json[i].MD_NM;
    }else if(4 == brandTm_json[i].RANK){
      brand_scr_04 = parseInt(isNullZero(brandTm_json[i].SCORE));
      brand_nm_04 = brandTm_json[i].MD_NM;
    }else if(5 == brandTm_json[i].RANK){
      brand_scr_05 = parseInt(isNullZero(brandTm_json[i].SCORE));
      brand_nm_05 = brandTm_json[i].MD_NM;
    }
  }
  
  //행사 매출 순위
  if (sales_nm_01.length >= 6) {sales_nm_01 = sales_nm_01.substring(0, 5) + "..";}
  if (sales_nm_02.length >= 6) {sales_nm_02 = sales_nm_02.substring(0, 5) + "..";}
  if (sales_nm_03.length >= 6) {sales_nm_03 = sales_nm_03.substring(0, 5) + "..";}
  if (sales_nm_04.length >= 6) {sales_nm_04 = sales_nm_04.substring(0, 5) + "..";}
  if (sales_nm_05.length >= 6) {sales_nm_05 = sales_nm_05.substring(0, 5) + "..";}
  sales_amt_01 = exCeil(sales_amt_01/division_amt, 1);
  sales_amt_02 = exCeil(sales_amt_02/division_amt, 1);
  sales_amt_03 = exCeil(sales_amt_03/division_amt, 1);
  sales_amt_04 = exCeil(sales_amt_04/division_amt, 1);
  sales_amt_05 = exCeil(sales_amt_05/division_amt, 1);
  $("#sales_nm_01").text(sales_nm_01);
  $("#sales_amt_01").html("<span>" + AddComma(sales_amt_01) + "</span>백만");
  $("#sales_nm_02").text(sales_nm_02);
  $("#sales_amt_02").html("<span>" + AddComma(sales_amt_02) + "</span>백만");
  $("#sales_nm_03").text(sales_nm_03);
  $("#sales_amt_03").html("<span>" + AddComma(sales_amt_03) + "</span>백만");
  $("#sales_nm_04").text(sales_nm_04);
  $("#sales_amt_04").html("<span>" + AddComma(sales_amt_04) +"</span>백만");
  $("#sales_nm_05").text(sales_nm_05);
  $("#sales_amt_05").html("<span>" + AddComma(sales_amt_05) +"</span>백만");
  
  //행사 응답률 순위
  if (res_nm_01.length >= 6) {res_nm_01 = res_nm_01.substring(0, 5) + "..";}
  if (res_nm_02.length >= 6) {res_nm_02 = res_nm_02.substring(0, 5) + "..";}
  if (res_nm_03.length >= 6) {res_nm_03 = res_nm_03.substring(0, 5) + "..";}
  if (res_nm_04.length >= 6) {res_nm_04 = res_nm_04.substring(0, 5) + "..";}
  if (res_nm_05.length >= 6) {res_nm_05 = res_nm_05.substring(0, 5) + "..";}
  
  res_rt_01 = exCeil(res_rt_01, 2);
  res_rt_02 = exCeil(res_rt_02, 2);
  res_rt_03 = exCeil(res_rt_03, 2);
  res_rt_04 = exCeil(res_rt_04, 2);
  res_rt_05 = exCeil(res_rt_05, 2);
  
  $("#res_nm_01").text(res_nm_01);
  $("#res_rt_01").html("<span>" + res_rt_01 + "</span>%");
  $("#res_nm_02").text(res_nm_02);
  $("#res_rt_02").html("<span>" + res_rt_02 + "</span>%");
  $("#res_nm_03").text(res_nm_03);
  $("#res_rt_03").html("<span>" + res_rt_03 + "</span>%");
  $("#res_nm_04").text(res_nm_04);
  $("#res_rt_04").html("<span>" + res_rt_04 + "</span>%");
  $("#res_nm_05").text(res_nm_05);
  $("#res_rt_05").html("<span>" + res_rt_05 + "</span>%");
  
  //브랜드 등급점수 순위
  //brand_nm_01 = "질스튜어트뉴";
 // brand_nm_02 = "";
  //brand_nm_03 = "";
  //brand_nm_04 = "";
  //brand_nm_05 = "";
 
  if (brand_nm_01.length >= 6) {brand_nm_01 = brand_nm_01.substring(0, 5) + "..";}
  if (brand_nm_02.length >= 6) {brand_nm_02 = brand_nm_02.substring(0, 5) + "..";}
  if (brand_nm_03.length >= 6) {brand_nm_03 = brand_nm_03.substring(0, 5) + "..";}
  if (brand_nm_04.length >= 6) {brand_nm_04 = brand_nm_04.substring(0, 5) + "..";}
  if (brand_nm_05.length >= 6) {brand_nm_05 = brand_nm_05.substring(0, 5) + "..";}
  
  $("#brand_nm_01").text(brand_nm_01);
  $("#brand_scr_01").html("<span>" + AddComma(brand_scr_01) + "</span>점");
  $("#brand_nm_02").text(brand_nm_02);
  $("#brand_scr_02").html("<span>" + AddComma(brand_scr_02) + "</span>점");
  $("#brand_nm_03").text(brand_nm_03);
  $("#brand_scr_03").html("<span>" + AddComma(brand_scr_03) + "</span>점");
  $("#brand_nm_04").text(brand_nm_04);
  $("#brand_scr_04").html("<span>" + AddComma(brand_scr_04) + "</span>점");
  $("#brand_nm_05").text(brand_nm_05);
  $("#brand_scr_05").html("<span>" + AddComma(brand_scr_05) + "</span>점");
  
}

/**========================================================================================
 * 타브랜드 행사내용 받은 사람
 ========================================================================================*/
function drawMyCustomer(){
  
	var data = null;
	var l_mymd_sale_cnt = mymd_sale_cnt;
	var l_otmd_camp_rcv_cust_cnt = otmd_camp_rcv_cust_cnt;
	
	if(l_mymd_sale_cnt != 0) {
		var diff_cust_rt1 = exCeil(l_otmd_camp_rcv_cust_cnt/l_mymd_sale_cnt * 100, 2);
		$("#diff_cus_chart_tooltip").attr("title", diff_cust_rt1 + "%");	
	}
	
	$("#otmd_camp_rcv_cust_cnt").text(AddComma(l_otmd_camp_rcv_cust_cnt));
	
	//점유율 100% 초과시 100% 한정
	if (l_mymd_sale_cnt < l_otmd_camp_rcv_cust_cnt){
		l_mymd_sale_cnt = l_otmd_camp_rcv_cust_cnt;
	}
	
  	data = [
	    {
	        column: "명",
	        val1: l_otmd_camp_rcv_cust_cnt,
	        val2: l_mymd_sale_cnt ? l_mymd_sale_cnt - l_otmd_camp_rcv_cust_cnt : 1
	    }
	];
  
  	$("#diff_cus_chart").dxChart({ // id = bar2_chart0 태그에서 차트 생성
		animation:{ // 애니메이션 속성
        	duration: 2000 // 로딩 milliseconds 지정
	    },
	    dataSource: data,  //  TM 결과의 자바스크립트 객체를 데이터소스로 지정
	    commonSeriesSettings: {
	    	argumentField: "column",  // argumentField 지정
	        type: "fullStackedBar"
	    },
	    size: {  width : 120, height : 148 },
	    margin: {bottom : 8, left : 5, right:10 },
	    argumentAxis: { visible: false, label: {visible:false} }, // x축 옵션
	    valueAxis: { visible : false, // y축 옵션
	    		grid : { visible : false },
	            tick: {visible : false},
	            label: {visible : false}
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
	        	return { text: AddComma(arg.valueText) + "건"};
	        }
	    }
	});
}

/**========================================================================================
 * 타브랜드구매고객
 ========================================================================================*/
function drawDiffBrandCus(){
  
	var data = null;
  	var l_mymd_sale_cnt = mymd_sale_cnt;
	var l_otmd_sale_cnt = otmd_sale_cnt;
	
	if(l_mymd_sale_cnt != 0) {
		var diff_cust_rt2 = exCeil(l_otmd_sale_cnt/l_mymd_sale_cnt * 100, 2);
		$("#diff_cus_chart2_tooltip").attr("title", diff_cust_rt2 + "%");	
	}
	
	$("#otmd_sale_cnt").text(AddComma(l_otmd_sale_cnt));
	
	if (l_mymd_sale_cnt < l_otmd_sale_cnt){
		l_mymd_sale_cnt = l_otmd_sale_cnt;
	}
	
  	data = [
	    {
	        column: "명",
	        val1: l_otmd_sale_cnt,
	        val2: l_mymd_sale_cnt ? l_mymd_sale_cnt - l_otmd_sale_cnt : 1
	    }
	];
  
	$("#diff_cus_chart2").dxChart({
		 animation:{ // 애니메이션 속성
             duration: 2000 // 로딩 milliseconds 지정
        },
        dataSource: data,  //  TM 결과의 자바스크립트 객체를 데이터소스로 지정
        commonSeriesSettings: {
            argumentField: "column",  // argumentField 지정
            type: "fullStackedBar"
        },
        size: {  width : 120, height : 148 },
        margin: {bottom : 8, left : 5, right:10 },
        argumentAxis: { visible: false, label: {visible:false} }, // x축 옵션
        valueAxis: { visible : false, // y축 옵션
              grid : { visible : false },
              tick: {visible : false},
              label: {visible : false}
        },
        series: [
          { valueField: "val1", name: "val1", color: "#76D350" }, // valueField 지정
          { valueField: "val2", name: "val2", color: "#E1E6ED"}
        ],
        legend: {
            visible: false
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: AddComma(arg.valueText) + "건"
                };
            }
        }
	  });

}

/**========================================================================================
 * 타브랜드 구매실적
 ========================================================================================*/
function drawMyPurchase(){
  
  
	var data = null;
	var l_mymd_sale_amt = mymd_sale_amt;
	var l_otmd_camp_rcv_sale_amt = otmd_camp_rcv_sale_amt;
	
	if(l_mymd_sale_amt != 0) {
		var diff_cust_rt3 = exCeil(l_otmd_camp_rcv_sale_amt/l_mymd_sale_amt * 100, 2);
		$("#diff_cus_chart3_tooltip").attr("title", diff_cust_rt3 + "%");	
	}
	
	$("#otmd_camp_rcv_sale_amt").text(AddComma(l_otmd_camp_rcv_sale_amt));
	
	if (l_mymd_sale_amt < l_otmd_camp_rcv_sale_amt){
		l_mymd_sale_amt = l_otmd_camp_rcv_sale_amt;
	}
	
  	data = [
    {
        column: "구매실적",
        val1: l_otmd_camp_rcv_sale_amt,
        val2: l_mymd_sale_amt ? l_mymd_sale_amt - l_otmd_camp_rcv_sale_amt : 1
    }];
  
  
  	$("#diff_cus_chart3").dxChart({ // id = bar2_chart0 태그에서 차트 생성
      animation:{ // 애니메이션 속성
             duration: 2000 // 로딩 milliseconds 지정
      },
      dataSource: data,  //  TM 결과의 자바스크립트 객체를 데이터소스로 지정
      commonSeriesSettings: {
          argumentField: "column",  // argumentField 지정
          type: "fullStackedBar"
      },
      size: {  width : 110, height : 148 },
      margin: {right: 40, bottom: 6, left : 0},
      argumentAxis: { visible: false, label: {visible:false} }, // x축 옵션
      valueAxis: { visible : false, // y축 옵션
            grid : { visible : false },
            tick: {visible : false},
            label: {visible : false}
      },
      series: [
        { valueField: "val1", name: "val1", color: "#7b57e2" }, // valueField 지정
          { valueField: "val2", name: "val2", color: "#E1E6ED"}
      ],
      legend: {
          visible: false
      },
      tooltip: {
          enabled: true,
          customizeTooltip: function (arg) {
              return {
            	  text: AddComma(arg.valueText) + "백만"
              };
          }
      }
	});  
  
}

/**========================================================================================
 * 고객 아닌데 행사 내용 받은 사람
 ========================================================================================*/
function drawNewCustomer1(){
	
	var l_mymd_sale_cnt = mymd_sale_cnt;
	var l_otmd_cust_camp_rcv_cnt = otmd_cust_camp_rcv_cnt;
	
	$("#otmd_cust_camp_rcv_cnt").text(AddComma(l_otmd_cust_camp_rcv_cnt));
	
	if (l_mymd_sale_cnt < l_otmd_cust_camp_rcv_cnt){
		l_mymd_sale_cnt = l_otmd_cust_camp_rcv_cnt;
	}
  
  	var data = [{
	      region: "받은사람",
	      val: l_otmd_cust_camp_rcv_cnt
	  }, {
	      region: "전체",
	      val: l_mymd_sale_cnt ? l_mymd_sale_cnt - l_otmd_cust_camp_rcv_cnt: 1
	}];
  
  	$("#new_pie_chart1").dxPieChart({  // 해당 id 태그에서 차트 생성
    //size: {width: 160,height: 160},
    innerRadius: 1, // 도넛의 가운데 빈 공간 크기
    type: "doughnut", // 타입 doughnut
    palette: ["#4590EB", "#E1E6ED"],  // 색상 두가지 지정
    dataSource: data,  // 데이터소스 지정
    tooltip: {  // hover 속성
          enabled: true,
          customizeTooltip: function (arg) {
        	  if(l_mymd_sale_cnt + l_otmd_cust_camp_rcv_cnt == 0) arg.valueText = 0;
              return {text: AddComma(arg.valueText) + "건"};
          }
      },
      "export": {
          enabled: false
      },
      legend: {
        visible: false
      },  
      series: [{
          argumentField: "region"
          }
      ]
  	});
}

/**========================================================================================
 * 내 브랜드 신규고객(누적)
 ========================================================================================*/
function drawNewCustomer2(){
	//mymd_new_cust_cnt = 1500;
	//mymd_sale_cnt = 1200;
	var l_mymd_sale_cnt = mymd_sale_cnt;
	var l_mymd_new_cust_cnt = mymd_new_cust_cnt;
	
	$("#mymd_new_cust_cnt").text(AddComma(l_mymd_new_cust_cnt));
  
	if(l_mymd_sale_cnt < l_mymd_new_cust_cnt){
		l_mymd_sale_cnt = l_mymd_new_cust_cnt;
	}
	var data = [{
		region: "신규고객",
	    val: l_mymd_new_cust_cnt
	}, {
	    region: "전체",
	    val: l_mymd_sale_cnt ? l_mymd_sale_cnt - l_mymd_new_cust_cnt : 1
	}];
  
	$("#new_pie_chart2").dxPieChart({  // 해당 id 태그에서 차트 생성
    //size: {width: 160,height: 160},
		innerRadius: 1, // 도넛의 가운데 빈 공간 크기
      	type: "doughnut", // 타입 doughnut
      	palette: ["#76d350", "#E1E6ED"],  // 색상 두가지 지정
      	dataSource: data,  // 데이터소스 지정
      	tooltip: {  // hover 속성
          	enabled: true,
          	customizeTooltip: function (arg) {
        		if(l_mymd_sale_cnt + l_mymd_new_cust_cnt == 0) arg.valueText = 0;
              	return {text: AddComma(arg.valueText) + "명"};
          	}
      	},
	    "export": {
	          enabled: false
	    },
      	legend: {
        	visible: false
      	},  
      	series: [{
        	argumentField: "region"
        }]
  	});
  
}

/**========================================================================================
 * 신규 고객 내 브랜드 구매 실적
 ========================================================================================*/
function drawNewCustomer3(){
	
	var l_mymd_sale_amt = mymd_sale_amt;
	var l_mymd_new_cust_sale_amt = mymd_new_cust_sale_amt;
	
	$("#mymd_new_cust_sale_amt").text(AddComma(l_mymd_new_cust_sale_amt));
  
	if (l_mymd_sale_amt < l_mymd_new_cust_sale_amt){
		l_mymd_sale_amt = l_mymd_new_cust_sale_amt;
  	}
	var data = [{
		region: "신규고객",
	    val: l_mymd_new_cust_sale_amt
	}, {
	    region: "전체",
	    val: l_mymd_sale_amt ? l_mymd_sale_amt - l_mymd_new_cust_sale_amt : 1
	}];
  
  	$("#new_pie_chart3").dxPieChart({  // 해당 id 태그에서 차트 생성
    //size: {width: 160,height: 160},
    	innerRadius: 1, // 도넛의 가운데 빈 공간 크기
      	type: "doughnut", // 타입 doughnut
      	palette: ["#7b57e2", "#E1E6ED"],  // 색상 두가지 지정
      	dataSource: data,  // 데이터소스 지정
      	tooltip: {  // hover 속성
        	enabled: true,
          	customizeTooltip: function (arg) {
        		if(l_mymd_sale_amt + l_mymd_new_cust_sale_amt == 0) arg.valueText = 0;
              		return {text: AddComma(arg.valueText) + "백만"};
          	}
      	},
      	"export": {
        	enabled: false
      	},
      	legend: {
        	visible: false
        //font :{size :0},
        //markerSize : 0,
      	},  
      	series: [{
        	argumentField: "region"
        }]
  	});
}
</script>


<div id="web_content">
  <div class="brandResult_wrap pt0">
    <div class="br_top type2" id="title_txt">
    </div>
    <div class="br_box">
      <div class="rank_wrap">
        <div class="tit"><p>행사 매출 순위<span class='tip_img' title='FIT PARTNERS를 활용한 매출 누적액'></span></p></div>
        <ul class="rank_list">
          <li class="top clear">
            <p class="rank"><img src="../img/web/icon/ic_medal1.png" alt="1"></p>
            <p class="brand_nm" id="sales_nm_01"></p>
            <p class="top1 f_r" id="sales_amt_01"></p>
          </li>
          <li class="top clear">
            <p class="rank"><img src="../img/web/icon/ic_medal2.png" alt="2"></p>
            <p class="brand_nm" id="sales_nm_02"></p>
            <p class="top2 f_r" id="sales_amt_02"></p>
          </li>
          <li class="top clear">
            <p class="rank"><img src="../img/web/icon/ic_medal3.png" alt="3"></p>
            <p class="brand_nm" id="sales_nm_03"></p>
            <p class="top3 f_r" id="sales_amt_03"></p>
          </li>
          <li class="clear">
            <p class="rank">4</p>
            <p id="sales_nm_04"></p>
            <p class="f_r" id="sales_amt_04"></p>
          </li>
          <li class="clear">
            <p class="rank">5</p>
            <p id="sales_nm_05"></p>
            <p class="f_r" id="sales_amt_05"></p>
          </li>
        </ul>
      </div>
      <div class="rank_wrap">
        <div class="tit"><p>행사 응답률 순위<span class='tip_img' title='FIT PARTNERS를 활용한 행사의 접근고객 대비 응답고객 비율'></span></p></div>
        <ul class="rank_list">
          <li class="top clear">
            <p class="rank"><img src="../img/web/icon/ic_medal1.png" alt="1"></p>
            <p class="brand_nm" id="res_nm_01"></p>
            <p class="top1 f_r" id="res_rt_01"></p>
          </li>
          <li class="top clear">
            <p class="rank"><img src="../img/web/icon/ic_medal2.png" alt="2"></p>
            <p class="brand_nm" id="res_nm_02"></p>
            <p class="top2 f_r" id="res_rt_02"></p>
          </li>
          <li class="top clear">
            <p class="rank"><img src="../img/web/icon/ic_medal3.png" alt="3"></p>
            <p class="brand_nm" id="res_nm_03"></p>
            <p class="top3 f_r" id="res_rt_03"></p>
          </li>
          <li class="clear">
            <p class="rank">4</p>
            <p id="res_nm_04"></p>
            <p class="f_r" id="res_rt_04"></p>
          </li>
          <li class="clear">
            <p class="rank">5</p>
            <p id="res_nm_05"></p>
            <p class="f_r" id="res_rt_05"></p>
          </li>
        </ul>
        
      </div>
      <div class="rank_wrap">
        <div class="tit"><p>브랜드 등급점수 순위<span class='tip_img' title='FIT PARTNERS 주요항목 평가 점수'></span></p></div>
        <ul class="rank_list odd">
          <li class="top clear">
            <p class="rank"><img src="../img/web/icon/ic_medal1.png" alt="1"></p>
            <p class="brand_nm" id="brand_nm_01"></p>
            <p class="top1 f_r" id="brand_scr_01"></p>
          </li>
          <li class="top clear">
            <p class="rank"><img src="../img/web/icon/ic_medal2.png" alt="2"></p>
            <p class="brand_nm" id="brand_nm_02"></p>
            <p class="top2 f_r" id="brand_scr_02"></p>
          </li>
          <li class="top clear">
            <p class="rank"><img src="../img/web/icon/ic_medal3.png" alt="3"></p>
            <p class="brand_nm" id="brand_nm_03"></p>
            <p class="top3 f_r" id="brand_scr_03"></p>
          </li>
          <li class="clear">
            <p class="rank">4</p>
            <p id="brand_nm_04"></p>
            <p class="f_r" id="brand_scr_04"></p>
          </li>
          <li class="clear">
            <p class="rank">5</p>
            <p id="brand_nm_05"></p>
            <p class="f_r" id="brand_scr_05"></p>
          </li>
        </ul>
      </div>
    </div>
    <div class="br_box">
      <div class="out_customer">
        <p class="tit">내 브랜드 고객의 경쟁브랜드로의 『고객이탈지표』</p>
        <ul>
          <li class="list1">
            <div class="tit"><p>경쟁 브랜드 행사내용 받은 사람<span class='tip_img' title='경쟁브랜드의 접근을 받은 내 고객'></span></p></div>
            <div class="graph_wrap">
              <div class="graph_img"><img src="../img/web/chart/human_chart2.png" id="diff_cus_chart_tooltip" title=""></div>
              <div class="graph" id="diff_cus_chart"></div>
            </div>
            <p class="txt2"><strong id="otmd_camp_rcv_cust_cnt"></strong>건</p>
          </li>
          <li class="list2">
            <div class="tit"><p>경쟁 브랜드를 구매한 고객<span class='tip_img' title='경쟁브랜드의 접근을 받고 실제 구매를 한 내 고객'></span></p></div>
            <div class="graph_wrap">
              <div class="graph_img"><img src="../img/web/chart/human_chart2.png" id="diff_cus_chart2_tooltip" title=""></div>
              <div class="graph" id="diff_cus_chart2"></div>
            </div>
            <p class="txt2"><strong id="otmd_sale_cnt"></strong>건</p>
          </li>
          <li class="list3">
            <div class="tit"><p>타 브랜드 행사 구매실적<span class='tip_img' title='경쟁브랜드의 접근을 받은 내 고객이 발생시킨 매출액'></span></p></div>
            <div class="graph_wrap">
              <div class="graph_img"><img src="../img/web/chart/img_chart.png" id="diff_cus_chart3_tooltip" title=""></div>
              <div class="graph" id="diff_cus_chart3"></div>
            </div>    
            <!-- <p class="txt1">내 매출 전체 <span id="mymd_sale_amt"></span></p> -->
            <p class="txt2"><strong id="otmd_camp_rcv_sale_amt"></strong>백만</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="br_box">
      <div class="new_customer">
        <p class="tit">신세계 플랫폼 활용 『신규획득고객지표』</p>
        <ul>
          <li class="list1">
            <div class="graph_wrap">
              <div class="graph_img"><img src="../img/web/icon/icon07.png"></div>
              <div class="graph" id="new_pie_chart1"></div>
            </div>
            <p>내 브랜드 행사내용을 받은 사람</p>
            <span><strong id="otmd_cust_camp_rcv_cnt"></strong>건</span>
          </li>
          <li class="list2">
            <div class="graph_wrap">
              <div class="graph_img"><img src="../img/web/icon/icon08.png"></div>
              <div class="graph" id="new_pie_chart2"></div>
            </div>
            <p>신규 고객(최근 1년 미 내점고객)</p>
            <span><strong id="mymd_new_cust_cnt"></strong>명</span>
          </li>
          <li class="list3">
            <div class="graph_wrap">
              <div class="graph_img"><img src="../img/web/icon/icon09.png"></div>
              <div class="graph" id="new_pie_chart3"></div>
            </div>
            <p>신규고객의 매출</p>
            <span><strong id="mymd_new_cust_sale_amt"></strong>백만</span>
          </li>
        </ul>
      </div>
    </div>
    
  </div>
</div>