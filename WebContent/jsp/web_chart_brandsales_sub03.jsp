<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">

//성별 고객현황
var selectMyBrandSaleGender = new oza_TMHandler('com.obzen.bmpanly.DocGraspMyBrand', 'selectMyBrandSaleGender', '1', '\@#%');
selectMyBrandSaleGender.setAddDataField('BASE_YEAR', sel_year);
selectMyBrandSaleGender.setAddDataField('BASE_MON', sel_month);
selectMyBrandSaleGender.setAddDataField('STORE_CD', store_cd);
selectMyBrandSaleGender.setAddDataField('MD_CD', md_cd);
selectMyBrandSaleGender.returnlist('MAN_CNT'+//남성응답고객수
        				   		   ';WOM_CNT'+//여성응답고객수
        						   ';MAN_AMT'+//남성행사매출
        					       ';WOM_AMT'+//여성행사매출
        					       ';TOP5_MAN_CNT'+//TOP5남성응답고객수
        					       ';TOP5_WOM_CNT'+//TOP5여성응답고객수
        						   ';TOP5_MAN_AMT'+//TOP5남성행사매출
        						   ';TOP5_WOM_AMT');//TOP5여성행사매출
selectMyBrandSaleGender.execute(null, false);
var man_cnt = selectMyBrandSaleGender.ElementValue('MAN_CNT');
var woman_cnt = selectMyBrandSaleGender.ElementValue('WOM_CNT');
var man_amt = selectMyBrandSaleGender.ElementValue('MAN_AMT');
var woman_amt = selectMyBrandSaleGender.ElementValue('WOM_AMT');
var top5_man_cnt = selectMyBrandSaleGender.ElementValue('TOP5_MAN_CNT');
var top5_woman_cnt = selectMyBrandSaleGender.ElementValue('TOP5_WOM_CNT');
var top5_man_amt = selectMyBrandSaleGender.ElementValue('TOP5_MAN_AMT');
var top5_woman_amt = selectMyBrandSaleGender.ElementValue('TOP5_WOM_AMT');
selectMyBrandSaleGender.clear();

man_cnt = parseInt(isNullZero(man_cnt));
woman_cnt = parseInt(isNullZero(woman_cnt));
top5_man_cnt = parseInt(isNullZero(top5_man_cnt));
top5_woman_cnt = parseInt(isNullZero(top5_woman_cnt));

man_amt = parseInt(isNullZero(man_amt));
woman_amt = parseInt(isNullZero(woman_amt));
top5_man_amt = parseInt(isNullZero(top5_man_amt));
top5_woman_amt = parseInt(isNullZero(top5_woman_amt));
if(man_amt != 0) {man_amt = exCeil(man_amt/division_amt, 1);}
if(woman_amt != 0) {woman_amt = exCeil(woman_amt/division_amt, 1);}
if(top5_man_amt != 0) {top5_man_amt = exCeil(top5_man_amt/division_amt, 1);}
if(top5_woman_amt != 0) {top5_woman_amt = exCeil(top5_woman_amt/division_amt, 1);}

//연령별 고객 매출현황
var selectMyBrandSaleAge = new oza_TMHandler('com.obzen.bmpanly.ColGraspMyBrand', 'selectMyBrandSaleAge', '0', '\@#%');
selectMyBrandSaleAge.setAddDataField('BASE_YEAR', sel_year);
selectMyBrandSaleAge.setAddDataField('BASE_MON', sel_month);
selectMyBrandSaleAge.setAddDataField('STORE_CD', store_cd);
selectMyBrandSaleAge.setAddDataField('MD_CD', md_cd);
selectMyBrandSaleAge.execute(null, false); //  tm 실행
var tmResult_SaleAge = selectMyBrandSaleAge.getResult(); //  컬렉션 TM 결과 호출
var tmSaleAge_json = "";
if(tmResult_SaleAge != ""){tmSaleAge_json = JSON.parse(tmResult_SaleAge);} //  자바스크립트 객체로 변환
selectMyBrandSaleAge.clear();

//지역별 고객 매출현황
var selectMyBrandSaleSido = new oza_TMHandler('com.obzen.bmpanly.ColGraspMyBrand', 'selectMyBrandSaleSido', '0', '\@#%');
selectMyBrandSaleSido.setAddDataField('BASE_YEAR', sel_year);
selectMyBrandSaleSido.setAddDataField('BASE_MON', sel_month);
selectMyBrandSaleSido.setAddDataField('STORE_CD', store_cd);
selectMyBrandSaleSido.setAddDataField('MD_CD', md_cd);
selectMyBrandSaleSido.execute(null, false); //  tm 실행
var tmResult_SaleSido = selectMyBrandSaleSido.getResult(); //  컬렉션 TM 결과 호출
var tmSaleArea_json = "";
if(tmResult_SaleSido != ""){tmSaleArea_json = JSON.parse(tmResult_SaleSido);} //  자바스크립트 객체로 변환
selectMyBrandSaleAge.clear();

//화면 시작 시 실행
$(document).ready(function() {
	screenLog("조회", "web_chart_brandsales_sub02", "분석>내 브랜드 알기>고객현황(기타)",get_client_ip);//화면 로그(공통)
	var innerHtml = "";
	var grow_rt_cls =  grow_rt_color == 'R' ? "fc_red" : "fc_blue";
	var ms_cls =  ms_color == 'R' ? "fc_red" : "fc_blue";
	var vip_sale_rate_cls  = vip_sale_rate_color == 'R' ? "fc_red" : "fc_blue";
	var new_cust_sale_rate_cls = new_cust_sale_rate_color == 'R' ? "fc_red" : "fc_blue";
	//상단 고정 내용 시작------------------------------------------------------------
	var innerHtml = "";
	if(md_cd == "") {
		innerHtml += "<div class='md_noti'><p><strong>MD</strong>를 선택해주세요.</p></div>"
	} else {
		innerHtml += "<p>매출신장률은 <strong class='" + grow_rt_cls + "'>\"" + grow_rt_cont + "\"</strong>, M/S는 <strong class='" + ms_cls + "'>\"" + ms_cont + "\"</strong>추세 입니다.<br>"
		innerHtml += "<span>Top5 브랜드와 비교시 주요 고객특징은</span> <strong>VIP비중</strong>이 <strong class='" + vip_sale_rate_cls + "'>\"" + vip_sale_rate_cont + "\"</strong> <strong>신규고객비중</strong>이 <strong class='" + new_cust_sale_rate_cls + "'>\"" + new_cust_sale_rate_cont + "\"</strong></p>"
	}
	$(".br_top").html(innerHtml);
	//상단 고정 내용 종료------------------------------------------------------------
	
	drawSaleGenderInfo();
	drawSaleAgeInfo();
	drawSaleAreaInfo();
	
});

/**========================================================================================
* 성별 고객 매출현황
========================================================================================*/
function drawSaleGenderInfo(){
	$("#man_amt").text(AddComma(man_amt));
	$("#woman_amt").text(AddComma(woman_amt));
	$("#man_cnt").text(AddComma(man_cnt));
	$("#woman_cnt").text(AddComma(woman_cnt));
	$("#top5_man_amt").text(AddComma(top5_man_amt));
	$("#top5_woman_amt").text(AddComma(top5_woman_amt));
	$("#top5_man_cnt").text(AddComma(top5_man_cnt));
	$("#top5_woman_cnt").text(AddComma(top5_woman_cnt));
	
	var tot_amt = 0;
	var tot_cnt = 0;
	var top5_tot_amt = 0;
	var top5_tot_cnt = 0;
	
	
	//for test
	tot_amt = man_amt + woman_amt;
	tot_cnt = man_cnt + woman_cnt;
	top5_tot_amt = top5_man_amt + top5_woman_amt;
	top5_tot_cnt = top5_man_cnt + top5_woman_cnt;
	
	var man_amt_rt = 0;
	if(tot_amt > 0){ man_amt_rt = exCeil(man_amt * 100 / tot_amt, 2);}
	var woman_amt_rt = 0;
	if(tot_amt > 0){ woman_amt_rt = exCeil(100 - man_amt_rt, 2);}
	var man_cnt_rt = 0;
	if(tot_cnt > 0){ man_cnt_rt = exCeil(man_cnt * 100 / tot_cnt, 2);}
	var woman_cnt_rt = 0;
	if(tot_cnt > 0){ woman_cnt_rt = exCeil(100 - man_cnt_rt, 2);}
	var top5_man_amt_rt = 0;
	if(top5_tot_amt > 0){ top5_man_amt_rt = exCeil(top5_man_amt * 100 / top5_tot_amt, 2);}
	var top5_woman_amt_rt = 0;
	if(top5_tot_amt > 0){ top5_woman_amt_rt = exCeil(100 - top5_man_amt_rt, 2);}
	var top5_man_cnt_rt = 0;
	if(top5_tot_cnt > 0){ top5_man_cnt_rt = exCeil(top5_man_cnt * 100 / top5_tot_cnt, 2);}
	var top5_woman_cnt_rt = 0;
	if(top5_tot_cnt > 0){ top5_woman_cnt_rt = exCeil(100 - top5_man_cnt_rt, 2);}
	
	$("#man_amt_rt").html("<p>" + AddComma(man_amt_rt) + "%</p>");
	$("#woman_amt_rt").html("<p>" + AddComma(woman_amt_rt) + "%</p>");
	$("#man_cnt_rt").html("<p>" + AddComma(man_cnt_rt) + "%</p>");
	$("#woman_cnt_rt").html("<p>" + AddComma(woman_cnt_rt) + "%</p>");
	
	$("#top5_man_amt_rt").html("<p>" + AddComma(top5_man_amt_rt) + "%</p>");
	$("#top5_woman_amt_rt").html("<p>" + AddComma(top5_woman_amt_rt) + "%</p>");
	$("#top5_man_cnt_rt").html("<p>" + AddComma(top5_man_cnt_rt) + "%</p>");
	$("#top5_woman_cnt_rt").html("<p>" + AddComma(top5_woman_cnt_rt) + "%</p>");
	
	$("#man_amt_rt").css("width", man_amt_rt+"%");
	$("#woman_amt_rt").css("width", woman_amt_rt+"%");
	$("#man_cnt_rt").css("width", man_cnt_rt+"%");
	$("#woman_cnt_rt").css("width", woman_cnt_rt+"%");
	
	$("#top5_man_amt_rt").css("width", top5_man_amt_rt+"%");
	$("#top5_woman_amt_rt").css("width", top5_woman_amt_rt+"%");
	$("#top5_man_cnt_rt").css("width", top5_man_cnt_rt+"%");
	$("#top5_woman_cnt_rt").css("width", top5_woman_cnt_rt+"%");
	
}

/**========================================================================================
* 연령별 고객 매출현황
========================================================================================*/
function drawSaleAgeInfo(){
	
	var data = null;
	data = tmSaleAge_json;
	var age_sale_amt = "";
	var top5_age_sale_amt = "";
	for(var i=0; i<data.length; i++){//  결과값 숫자형 변환
		data[i].AGE_NM = data[i].AGE_NM;
		data[i].AGE_CUST_CNT = parseInt(data[i].AGE_CUST_CNT);
	    age_sale_amt = parseInt(data[i].AGE_SALE_AMT) / division_amt;
		data[i].AGE_SALE_AMT = exCeil(age_sale_amt, 1);//행사매출
	    data[i].TOP5_AGE_CUST_CNT = parseInt(data[i].TOP5_AGE_CUST_CNT);
	    top5_age_sale_amt = parseInt(data[i].TOP5_AGE_SALE_AMT) / division_amt ;
		data[i].TOP5_AGE_SALE_AMT = exCeil(top5_age_sale_amt, 1);//TOP5행사매출
    }
	
	if(data.length == 0){
		$("#age_sale_chart").html("<p class='nodata'>연령대별 매출 데이터가 없습니다.</p>");
		$("#age_cust_chart").html("<p class='nodata'>연령대별 고객수 데이터가 없습니다.</p>");
		
	} else {
		
		$("#age_sale_chart").dxChart({
			dataSource: data,
			commonSeriesSettings: {
				//argumentField: "BASE_DT",
				argumentField: "AGE_NM",
				type: "bar",
				hoverMode: "allArgumentPoints",
				selectionMode: "allArgumentPoints",
				label: {
					visible: false
				}
			},
			series: [
				{ axis: "amt", valueField: "AGE_SALE_AMT"     , name: "내브랜드매출"       , color: '#4092f8',barWidth:5 },
		        { axis: "amt", valueField: "TOP5_AGE_SALE_AMT", name: "Top5평균매출", color: '#a1a1a1',barWidth:5 }
		  ],
			valueAxis: [
				{
					name: "amt",
					//position: "right",//값 위치
					grid: {visible: true},
					label: {
						customizeText : function(arg){
							var items = arg.valueText.split("\n");
							$.each(items, function(index, item) {
			                   items[index] = AddComma(items[index]);//숫자에 콤마
			                });
							
							return items;
						}
					}
				}
			],
			legend: {
	    	    visible: false
	    },
			"export": {
				enabled: false
			},
			tooltip: {  // hover 속성
		          enabled: true,
		          //format: "millions",
		          customizeTooltip: function (arg) {
		                      return {
		                  text:AddComma(arg.valueText)  + "백만"
		              };
		          }
		      },
			onPointClick: function (e) {
				e.target.select();
			}
		});
		
		$("#age_cust_chart").dxChart({
			dataSource: data,
			commonSeriesSettings: {
				//argumentField: "BASE_DT",
				argumentField: "AGE_NM",
				type: "bar",
				hoverMode: "allArgumentPoints",
				selectionMode: "allArgumentPoints",
				label: {
					visible: false
				}
			},
			series: [
				{ axis: "cust", valueField: "AGE_CUST_CNT"     , name: "내브랜드고객수"       , color: '#2dd790',barWidth:5 },
		        { axis: "cust", valueField: "TOP5_AGE_CUST_CNT", name: "Top5평균고객수", color: '#a1a1a1',barWidth:5 }
		  ],
			valueAxis: [
				{
					name: "cust",
					//position: "right",//값 위치
					grid: {visible: true},
					label: {
						customizeText : function(arg){
							var items = arg.valueText.split("\n");
							$.each(items, function(index, item) {
			                   items[index] = AddComma(items[index]);//숫자에 콤마
			                });
							
							return items;
						}
					}
				}
			],
			legend: {
	    	    visible: false
	    },
			"export": {
				enabled: false
			},
			tooltip: {  // hover 속성
		          enabled: true,
		          //format: "millions",
		          customizeTooltip: function (arg) {
		                      return {
		                  text:AddComma(arg.valueText) + "명"
		              };
		          }
		      },
			onPointClick: function (e) {
				e.target.select();
			}
		});
		
	}
	
	
}

/**========================================================================================
* 지역별 고객 매출현황
========================================================================================*/
function drawSaleAreaInfo(){
	
	var data = null;
	data = tmSaleArea_json;
	var sido_sale_amt = "";
	var top5_sido_sale_amt = "";
	for(var i=0; i<data.length; i++){//  결과값 숫자형 변환
		data[i].SI_DO_NM = data[i].SI_DO_NM;
		data[i].SI_DO_CUST_CNT = parseInt(data[i].SI_DO_CUST_CNT);
		sido_sale_amt = parseInt(data[i].SI_DO_SALE_AMT) / division_amt;
		data[i].SI_DO_SALE_AMT = exCeil(sido_sale_amt, 1);//행사매출
	    data[i].TOP5_SI_DO_CUST_CNT = parseInt(data[i].TOP5_SI_DO_CUST_CNT);
	    top5_sido_sale_amt = parseInt(data[i].TOP5_SI_DO_SALE_AMT) / division_amt ;
		data[i].TOP5_SI_DO_SALE_AMT = exCeil(top5_sido_sale_amt, 1);//TOP5행사매출
    }
	
	
	if(data.length == 0){
		$("#area_sale_chart").html("<p class='nodata'>지역별 매출 데이터가 없습니다.</p>");	
		$("#area_cust_chart").html("<p class='nodata'>지역별 고객수 데이터가 없습니다.</p>");
	} else {
		$("#area_sale_chart").dxChart({
			dataSource: data,
			commonSeriesSettings: {
				//argumentField: "BASE_DT",
				argumentField: "SI_DO_NM",
				type: "bar",
				hoverMode: "allArgumentPoints",
				selectionMode: "allArgumentPoints",
				label: {
					visible: false
				}
			},
			series: [
				{ axis: "amt", valueField: "SI_DO_SALE_AMT"     , name: "내브랜드매출"       , color: '#4092f8',barWidth:5 },
		        { axis: "amt", valueField: "TOP5_SI_DO_SALE_AMT", name: "Top5평균매출", color: '#a1a1a1',barWidth:5 }
		  ],
			valueAxis: [
				{
					name: "amt",
					//position: "right",//값 위치
					grid: {visible: true},
					label: {
						customizeText : function(arg){
							var items = arg.valueText.split("\n");
							$.each(items, function(index, item) {
			                   items[index] = AddComma(items[index]);//숫자에 콤마
			                });
							
							return items;
						}
					}
				}
			],
			legend: {
	    	    visible: false
	    },
			"export": {
				enabled: false
			},
			tooltip: {  // hover 속성
		          enabled: true,
		          //format: "millions",
		          customizeTooltip: function (arg) {
		                      return {
		                  text:AddComma(arg.valueText) + "백만"
		              };
		          }
		      },
			onPointClick: function (e) {
				e.target.select();
			}
		});
		
		$("#area_cust_chart").dxChart({
			dataSource: data,
			commonSeriesSettings: {
				//argumentField: "BASE_DT",
				argumentField: "SI_DO_NM",
				type: "bar",
				hoverMode: "allArgumentPoints",
				selectionMode: "allArgumentPoints",
				label: {
					visible: false
				}
			},
			series: [
				{ axis: "cust", valueField: "SI_DO_CUST_CNT"     , name: "내브랜드고객수"       , color: '#2dd790',barWidth:5 },
		        { axis: "cust", valueField: "TOP5_SI_DO_CUST_CNT", name: "Top5평균고객수", color: '#a1a1a1',barWidth:5 }
		  ],
			valueAxis: [
				{
					name: "cust",
					//position: "right",//값 위치
					grid: {visible: true},
					label: {
						customizeText : function(arg){
							var items = arg.valueText.split("\n");
							$.each(items, function(index, item) {
			                   items[index] = AddComma(items[index]);//숫자에 콤마
			                });
							
							return items;
						}
					}
				}
			],
			legend: {
	    	    visible: false
	    },
			"export": {
				enabled: false
			},
			tooltip: {  // hover 속성
		          enabled: true,
		          //format: "millions",
		          customizeTooltip: function (arg) {
		                      return {
		                  text:AddComma(arg.valueText) + "명"
		              };
		          }
		      },
			onPointClick: function (e) {
				e.target.select();
			}
		});	
		
	}
	
}



</script>
<div id="web_content2">
  <div class="clientResult_wrap">
    <div class="analysis_wrap">
      <div class="br_top">
      <!-- <p>매출신장률은 <strong class="fc_red">"유지"</strong>, M/S는 <strong class="fc_red">"유지"</strong>추세 입니다.<br><span>Top5 브랜드와 비교시 주요 고객득징은</span> <strong>VIP비중</strong>이 <span class="fc_blue">"비슷하고"</span> <strong>신규고객비중</strong>이 <span class="fc_red">"비슷합니다"</span></p>
       -->
      </div>
      
    </div>
    <div class="clientResult_cnt1">
      <p class="tit">성별</p>
      <ul class="clear">
        <li>
          <div class="area_type1">
            <div class="graph_wrap">
              <p class="graph_tit">내 브랜드 매출비중</p>
              <div class="graph_img1"><img src="../../img/web/chart/chart_img1.png" alt=""></div>
              <div class="graph">
                <div class="bar1" id="man_amt_rt">
                </div>
                <div class="bar2" id="woman_amt_rt">
                </div>
              </div>
              <div class="graph_img2"><img src="../../img/web/chart/chart_img2.png" alt=""></div>
            </div>
            <ul>
              <li>
                <span>남성고객</span>
                <p class="col1"><strong id="man_amt"></strong>백만</p>
              </li>
              <li>
                <span>여성고객</span>
                <p class="col2"><strong id="woman_amt"></strong>백만</p>
              </li>
            </ul>
          </div>
          <div class="area_type2">
            <div class="graph_wrap type2">
              <p class="graph_tit">내 브랜드 고객비중</p>
              <div class="graph_img1"><img src="../../img/web/chart/chart_img5.png" alt=""></div>
              <div class="graph">
                <div class="bar1" id="man_cnt_rt">
                </div>
                <div class="bar2" id="woman_cnt_rt">
                </div>
              </div>
              <div class="graph_img2"><img src="../../img/web/chart/chart_img6.png" alt=""></div>
            </div>
            
            <ul>
              <li>
                <span>남성고객</span>
                <p class="col1"><strong id="man_cnt"></strong>명</p>
              </li>
              <li>
                <span>여성고객</span>
                <p class="col2"><strong id="woman_cnt"></strong>명</p>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div class="area_type3">
            <div class="graph_wrap type3">
              <p class="graph_tit">Top5 평균 매출비중</p>
              <div class="graph_img1"><img src="../../img/web/chart/chart_img3.png" alt=""></div>
              <div class="graph">
                <div class="bar1" id="top5_man_amt_rt">
                </div>
                <div class="bar2" id="top5_woman_amt_rt">
                </div>
              </div>
              <div class="graph_img2"><img src="../../img/web/chart/chart_img4.png" alt=""></div>
            </div>
            
            <ul>
              <li>
                <span>남성고객</span>
                <p class="col1"><strong id="top5_man_amt"></strong>백만</p>
              </li>
              <li>
                <span>여성고객</span>
                <p class="col2"><strong id="top5_woman_amt"></strong>백만</p>
              </li>
            </ul>
          </div>
          <div class="area_type3">
            <div class="graph_wrap type3">
              <p class="graph_tit">Top5 평균 고객비중</p>
              <div class="graph_img1"><img src="../../img/web/chart/chart_img3.png" alt=""></div>
              <div class="graph">
                <div class="bar1" id="top5_man_cnt_rt">
                </div>
                <div class="bar2" id="top5_woman_cnt_rt">
                </div>
              </div>
              <div class="graph_img2"><img src="../../img/web/chart/chart_img4.png" alt=""></div>
            </div>
            <ul>
              <li>
                <span>남성고객</span>
                <p class="col1"><strong id="top5_man_cnt"></strong>명</p>
              </li>
              <li>
                <span>여성고객</span>
                <p class="col2"><strong id="top5_woman_cnt"></strong>명</p>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div class="clientResult_cnt2">
      <p class="tit">연령대별</p>
      <ul>
         <li class="type1">
         <div class="graph_wrap">
           <ul class="graph_regend">
           <li class="regend1"><i></i>내 브랜드 매출</li>
           <li class="regend2"><i></i>Top5 평균 매출</li>
           </ul>
           <div class="graph" id="age_sale_chart"></div>
           <p class="graph_unit">[단위:백만]</p>
         </div>
         </li>
         <li class="type2">
         <div class="graph_wrap">
           <ul class="graph_regend">
           <li class="regend1"><i></i>내 브랜드 고객</li>
           <li class="regend2"><i></i>Top5 평균 고객</li>
           </ul>
           <div class="graph" id="age_cust_chart"></div>
           <p class="graph_unit">[단위:명]</p>
         </div>
         </li>
      </ul>
    </div>
    <div class="clientResult_cnt3">
      <p class="tit">지역별</p>
      <ul>
         <li class="type1">
         <div class="graph_wrap">
           <ul class="graph_regend">
           <li class="regend1"><i></i>내 브랜드 매출</li>
           <li class="regend2"><i></i>Top5 평균사매출</li>
           </ul>
           <div class="graph" id="area_sale_chart"></div>
           <p class="graph_unit">[단위:백만]</p>
         </div>
         </li>
         <li class="type2">
         <div class="graph_wrap">
           <ul class="graph_regend">
           <li class="regend1"><i></i>내 브랜드 고객</li>
           <li class="regend2"><i></i>Top5 평균 고객</li>
           </ul>
           <div class="graph" id="area_cust_chart"></div>
           <p class="graph_unit">[단위:명]</p>
         </div>
         </li>
      </ul>
    </div>
  </div>
</div>