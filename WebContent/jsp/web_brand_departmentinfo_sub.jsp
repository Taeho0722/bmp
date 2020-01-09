<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">

//TM Start ===============================================================================================


//행사정보-------------------------
var cond_store_nm = "";
var cond_floor_nm = "";
var cond_pc_nm = "";

var month_sales_rate = "";
var month_cust_rate = "";
var month_sales_rate2 = "";
var month_cust_rate2 = "";

var year_sales_rate = "";
var year_cust_rate = "";
var year_sales_rate2 = "";
var year_cust_rate2 = "";


var mainTm = new oza_TMHandler('com.obzen.bmpanly.DocDeptCond', 'selectDeptCond', '1', '\@#%');
mainTm.setAddDataField('MD_CD', md_cd);
mainTm.setAddDataField('STORE_CD', store_cd);
mainTm.returnlist('STORE_NM'+//점포명
									';FLOOR_NM'+//층명
									';PC_NM'+//PC명
									';FLOOR_MON_AMT_RATE'+//월누계 층 매출신장률
									';FLOOR_MON_CUST_RATE'+//월누계 층 객수 신장률
									';PC_MON_AMT_RATE'+//월누계 PC 매출신장률
									';PC_MON_CUST_RATE'+//월누계 PC 객수신장률
									';FLOOR_YEAR_AMT_RATE'+//연누계 층 매출신장률
									';FLOOR_YEAR_CUST_RATE'+//연누계 층 객수신장률
									';PC_YEAR_AMT_RATE'+//연누계 PC 매출신장률
									';PC_YEAR_CUST_RATE');//연누계 PC 객수신장률
mainTm.execute(null, false);

cond_store_nm = mainTm.ElementValue('STORE_NM');
cond_floor_nm = mainTm.ElementValue('FLOOR_NM');
cond_pc_nm = mainTm.ElementValue('PC_NM');
month_sales_rate = mainTm.ElementValue('FLOOR_MON_AMT_RATE');
month_cust_rate = mainTm.ElementValue('FLOOR_MON_CUST_RATE');
month_sales_rate2 = mainTm.ElementValue('PC_MON_AMT_RATE');
month_cust_rate2 = mainTm.ElementValue('PC_MON_CUST_RATE');
year_sales_rate = mainTm.ElementValue('FLOOR_YEAR_AMT_RATE');
year_cust_rate = mainTm.ElementValue('FLOOR_YEAR_CUST_RATE');
year_sales_rate2 = mainTm.ElementValue('PC_YEAR_AMT_RATE');
year_cust_rate2 = mainTm.ElementValue('PC_YEAR_CUST_RATE');
mainTm.clear();	

//TM End ===============================================================================================



//화면 로드 시 실행
$(document).ready(function() {
  screenLog("조회", "web_brand_departmentinfo_sub", "백화점 매출현황>백화점 매출현황",get_client_ip);//화면 로그(공통)
  
  textSetting();
  monthSum();
  yearSum();
});



/**========================================================================================
* 명칭 설정
========================================================================================*/
function textSetting(){
	var mon_floor_nm = "";
	var mon_pc_nm = "";
	var year_floor_nm = "";
	var year_pc_nm = "";
	
	mon_floor_nm = cond_store_nm +" "+cond_floor_nm
	mon_pc_nm = cond_store_nm +" "+cond_pc_nm
	year_floor_nm = cond_store_nm +" "+cond_floor_nm
	year_pc_nm = cond_store_nm +" "+cond_pc_nm
	
	$("#mon_floor_nm").text(mon_floor_nm);
	$("#mon_pc_nm").text(mon_pc_nm);
	$("#year_floor_nm").text(year_floor_nm);
	$("#year_pc_nm").text(year_pc_nm);
}	

/**========================================================================================
* 월누계
========================================================================================*/
function monthSum(){
	month_sales_rate = parseFloat(isNullZero(month_sales_rate));
	month_cust_rate = parseFloat(isNullZero(month_cust_rate));
	month_sales_rate2 = parseFloat(isNullZero(month_sales_rate2));
	month_cust_rate2 = parseFloat(isNullZero(month_cust_rate2));

	
	if(month_sales_rate > 0){
		$("#month_sales_rate").removeClass("down");
		$("#month_sales_rate").addClass("up");	
	}else if(month_sales_rate < 0){
		$("#month_sales_rate").removeClass("up");
		$("#month_sales_rate").addClass("down");
		month_sales_rate = String(month_sales_rate).replace("-","");
	}else{
		$("#month_sales_rate").removeClass("up");
		$("#month_sales_rate").removeClass("down");
	}
	
	if(month_cust_rate > 0){
		$("#month_cust_rate").removeClass("down");
		$("#month_cust_rate").addClass("up");
	}else if(month_cust_rate < 0){
		$("#month_cust_rate").removeClass("up");
		$("#month_cust_rate").addClass("down");
		month_cust_rate = String(month_cust_rate).replace("-","");
	}else{
		$("#month_cust_rate").removeClass("up");
		$("#month_cust_rate").removeClass("down");
	}
	
	if(month_sales_rate2 > 0){
		$("#month_sales_rate2").removeClass("down");
		$("#month_sales_rate2").addClass("up");	
	}else if(month_sales_rate2 < 0){
		$("#month_sales_rate2").removeClass("up");
		$("#month_sales_rate2").addClass("down");
		month_sales_rate2 = String(month_sales_rate2).replace("-","");
	}else{
		$("#month_sales_rate2").removeClass("up");
		$("#month_sales_rate2").removeClass("down");
	}
	
	if(month_cust_rate2 > 0){
		$("#month_cust_rate2").removeClass("down");
		$("#month_cust_rate2").addClass("up");	
	}else if(month_cust_rate2 < 0){
		$("#month_cust_rate2").removeClass("up");
		$("#month_cust_rate2").addClass("down");
		month_cust_rate2 = String(month_cust_rate2).replace("-","");
	}else{
		$("#month_cust_rate2").removeClass("up");
		$("#month_cust_rate2").removeClass("down");
	}
	
	
	$("#month_sales_rate").html("<strong>"+month_sales_rate+"</strong>%");
	$("#month_cust_rate").html("<strong>"+month_cust_rate+"</strong>%");
	$("#month_sales_rate2").html("<strong>"+month_sales_rate2+"</strong>%");
	$("#month_cust_rate2").html("<strong>"+month_cust_rate2+"</strong>%");
	
}

/**========================================================================================
* 년누계
========================================================================================*/
function yearSum(){
	year_sales_rate = parseFloat(isNullZero(year_sales_rate));
	year_cust_rate = parseFloat(isNullZero(year_cust_rate));
	year_sales_rate2 = parseFloat(isNullZero(year_sales_rate2));
	year_cust_rate2 = parseFloat(isNullZero(year_cust_rate2));
	
	if(year_sales_rate > 0){
		$("#year_sales_rate").removeClass("down");
		$("#year_sales_rate").addClass("up");	
	}else if(year_sales_rate < 0){
		$("#year_sales_rate").removeClass("up");
		$("#year_sales_rate").addClass("down");
		year_sales_rate = String(year_sales_rate).replace("-","");
	}else{
		$("#year_sales_rate").removeClass("up");
		$("#year_sales_rate").removeClass("down");
	}
	
	if(year_cust_rate > 0){
		$("#year_cust_rate").removeClass("down");
		$("#year_cust_rate").addClass("up");
	}else if(year_cust_rate < 0){
		$("#year_cust_rate").removeClass("up");
		$("#year_cust_rate").addClass("down");
		year_cust_rate = String(year_cust_rate).replace("-","");
	}else{
		$("#year_cust_rate").removeClass("up");
		$("#year_cust_rate").removeClass("down");
	}
	
	if(year_sales_rate2 > 0){
		$("#year_sales_rate2").removeClass("down");
		$("#year_sales_rate2").addClass("up");	
	}else if(year_sales_rate2 < 0){
		$("#year_sales_rate2").removeClass("up");
		$("#year_sales_rate2").addClass("down");
		year_sales_rate2 = String(year_sales_rate2).replace("-","");
	}else{
		$("#year_sales_rate2").removeClass("up");
		$("#year_sales_rate2").removeClass("down");
	}
	
	if(year_cust_rate2 > 0){
		$("#year_cust_rate2").removeClass("down");
		$("#year_cust_rate2").addClass("up");	
	}else if(year_cust_rate2 < 0){
		$("#year_cust_rate2").removeClass("up");
		$("#year_cust_rate2").addClass("down");
		year_cust_rate2 = String(year_cust_rate2).replace("-","");
	}else{
		$("#year_cust_rate2").removeClass("up");
		$("#year_cust_rate2").removeClass("down");
	}
	

	$("#year_sales_rate").html("<strong>"+year_sales_rate+"</strong>%");
	$("#year_cust_rate").html("<strong>"+year_cust_rate+"</strong>%");
	$("#year_sales_rate2").html("<strong>"+year_sales_rate2+"</strong>%");
	$("#year_cust_rate2").html("<strong>"+year_cust_rate2+"</strong>%");
	
	
}


</script>
<div class="brandTotal_wrap">
  <div class="month_total">
    <p class="tit">월누계<span>전일기준 해당월 1일 ~ 전일까지</span></p>
    <ul>
      <li>
        <p class="sub_tit" id="mon_floor_nm"></p>
        <ul>
          <li class="total1">
            <p>매출 신장률</p>
            <div class="total_percent"><p id="month_sales_rate"></p></div>
          </li>
          <li class="total2">
            <p>객수 신장률</p>
            <div class="total_percent"><p id="month_cust_rate"></p></div>
          </li>
        </ul>
      </li>
      <li>
        <p class="sub_tit" id="mon_pc_nm"></p>
        <ul>
          <li class="total1">
            <p>매출 신장률</p>
            <div class="total_percent"><p id="month_sales_rate2"></p></div>
          </li>
          <li class="total2">
            <p>객수 신장률</p>
            <div class="total_percent"><p id="month_cust_rate2"></p></div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div class="year_total">
    <p class="tit">연 누계<span>전일기준 해당년 1월1일 ~ 전일까지</span></p>
    <ul>
      <li>
        <p class="sub_tit" id="year_floor_nm"></p>
        <ul>
          <li class="total1">
            <p>매출 신장률</p>
            <div class="total_percent"><p id="year_sales_rate"></p></div>
          </li>
          <li class="total2">
            <p>객수 신장률</p>
            <div class="total_percent"><p id="year_cust_rate"></p></div>
          </li>
        </ul>
      </li>
      <li>
        <p class="sub_tit" id="year_pc_nm"></p>
        <ul>
          <li class="total1">
            <p>매출 신장률</p>
            <div class="total_percent"><p id="year_sales_rate2"></p></div>
          </li>
          <li class="total2">
            <p>객수 신장률</p>
            <div class="total_percent"><p id="year_cust_rate2"></p></div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</div>