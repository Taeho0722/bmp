<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<script type="text/javascript">
var md_tot_sale_amt = "";
var rsp_cust_sale_amt = "";
var camp_rsp_rate = "";

var division_amt = 1000000;//금액 :백만원
var division_ppc = 10000;//객단가 : 만원


//화면 로드 시 실행
$(document).ready(function() {
	
	screenLog("조회", "web_chart_eventinfo_sub", "브랜드마케팅>분석>행사 조회",get_client_ip);//화면 로그(공통)
	
	selectStoreCd();//점포코드 그리기
	initStoreCd();//점포코드 초기설정
	setSelectBoxStatus(); //select box 상태 변경
	search();

});

/**========================================================================================
* 점포코드 selectbox 조회
* TM을 호출하여 점포코드 조회
========================================================================================*/
function selectStoreCd(){
	var innerHtml = "";
	var storeTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMngCRM', 'selectStoreCd', '0', '\@#%');
	var l_md_cd = stg_md_cd;
	
	storeTm.setAddDataField('MD_CD', l_md_cd);
	storeTm.setAddDataField('USERID', webUserId);
	storeTm.execute(null, false);
	var storeTmResult = storeTm.getResult();
	var storeTmResult_json = "";
	if(storeTmResult != ""){
		storeTmResult_json = JSON.parse(storeTmResult);
	}
	storeTm.clear();
	
	innerHtml += "<option value=''>::선택::</option>";
	for(var i=0; i<storeTmResult_json.length; i++) {
		innerHtml += "<option value='"+storeTmResult_json[i].ITEM_CD+"'>"+storeTmResult_json[i].ITEM_NM+"</option>";
	}
	$("#sel_store_cd").html(innerHtml);
	
}

/**========================================================================================
* 점포코드 초기세팅
========================================================================================*/
function initStoreCd(){
	if(webSysDivFlag == "1.1"){ //브랜드-매장사용자 : 세션정보 점포코드
		$("#sel_store_cd").val(stg_store_cd).attr("selected","selected");	
	} else if(webSysDivFlag == "1.2"){ //브랜드-본사사용자 : 세션정보md에 해당하는 첫번째 점포코드 
		$("#sel_store_cd option:eq(1)").attr("selected","selected");
	}
}

/**========================================================================================
* select box 상태 변경
* 권한에 따라 select box 상태 변경
========================================================================================*/
function setSelectBoxStatus(){
	if(webSysDivFlag == "1.1"){
		$("#sel_store_cd").attr("disabled",true);
		$("#sel_store_cd").addClass("disabled");
	
	} else if(webSysDivFlag == "1.2"){
		//브랜드-본사 사용자는 점포만 선택가능  ACTIVE
	}
}

/**========================================================================================
* 조회 영역 그리기
========================================================================================*/

function searchData(){
	var innerHtml = "";
	var i = 0;
	var classFlag = "";
	
	
	var con_camp_id = "";
	var con_camp_sale_id = "";
	var con_base_ym = "";
	var con_camp_nm = "";
	var con_camp_str_dt = "";
	var con_camp_end_dt = "";
	var con_camp_period = "";
	var con_camp_stat_cd = "";
	var con_camp_stat_div_cd = "";
	var con_camp_stat_div_nm = "";
	var con_camp_stat_div_detail_nm = "";
	var con_ent_cust_cnt = "";
	var con_rsp_cust_cnt = "";
	var con_rsp_cust_sale_amt = "";
	var con_rsp_cust_rate = "";
	var con_pmot_str = "";
	var old_ym = "";
	var shn_crd_evt_yn = "";
	var bmpevt_ty_cd = "";
	var bmpevt_ty_nm = "";
	var ctrtdoc_ncss_yn = "N"; 
	
	
	//spinStart();
	
	//TM Start ===============================================================================================
	//행사누적매출 / 평균응답률 조회 
	var evtSummInfoTm = new oza_TMHandler('com.obzen.bmpanly.DocEvtProgress', 'selectEvtSummInfo', '1', '\@#%');
	evtSummInfoTm.setAddDataField('STORE_CD', store_cd);
	evtSummInfoTm.setAddDataField('MD_CD', md_cd);
	evtSummInfoTm.setAddDataField('STAFF_EVT_INC_YN', staff_inc_yn);
	evtSummInfoTm.returnlist('RSP_CUST_SALE_AMT;MD_TOT_SALE_AMT;CAMP_RSP_RATE');
	evtSummInfoTm.execute(null, false);
	rsp_cust_sale_amt = evtSummInfoTm.ElementValue('RSP_CUST_SALE_AMT');
	camp_rsp_rate = evtSummInfoTm.ElementValue('CAMP_RSP_RATE');
	evtSummInfoTm.clear();

	//for test
	//md_cd = "011724";//011724
	//행사목록조회
	var evtInfoListTm = new oza_TMHandler('com.obzen.bmpanly.ColEvtProgressCRM', 'selectEvtInfoList', '0', '\@#%');
	evtInfoListTm.setAddDataField('STORE_CD', store_cd);
	evtInfoListTm.setAddDataField('MD_CD', md_cd);
	evtInfoListTm.setAddDataField('STAFF_EVT_INC_YN', staff_inc_yn);
	evtInfoListTm.execute(null, false);
	var evtInfoListTmResult = evtInfoListTm.getResult();
	var evtInfoListTmResult_json = "";
	if(evtInfoListTmResult != ""){
		evtInfoListTmResult_json = JSON.parse(evtInfoListTmResult);
	}
	evtInfoListTm.clear();
	
	var evtSaleInfoListTm = new oza_TMHandler('com.obzen.bmpanly.ColEvtProgress', 'selectEvtSaleList', '0', '\@#%');
	evtSaleInfoListTm.setAddDataField('STORE_CD', store_cd);
	evtSaleInfoListTm.setAddDataField('MD_CD', md_cd);
	evtSaleInfoListTm.setAddDataField('STAFF_EVT_INC_YN', staff_inc_yn);
	evtSaleInfoListTm.execute(null, false);
	var evtSaleInfoListTmResult = evtSaleInfoListTm.getResult();
	var evtSaleInfoListTmResult_json = "";
	
	if(evtSaleInfoListTmResult != ""){
		evtSaleInfoListTmResult_json = JSON.parse(evtSaleInfoListTmResult);
	}
	evtSaleInfoListTm.clear();
	
	//TM End =================================================================================================	

	
	//행사 매출 누계
	if(rsp_cust_sale_amt != 0)     {rsp_cust_sale_amt = exCeil(rsp_cust_sale_amt/division_amt, 1);}
	rsp_cust_sale_amt = parseInt(isNullZero(rsp_cust_sale_amt));
	$("#rsp_cust_sale_amt").html(AddComma(rsp_cust_sale_amt)+"<span>&nbsp;백만</span>");
	
	//행사 평균 응답률
	camp_rsp_rate = exCeil(parseFloat(isNullZero(camp_rsp_rate)), 2);
	$("#camp_rsp_rate").html(AddComma(camp_rsp_rate)+"<span>&nbsp;%</span>");
	
	if(evtInfoListTmResult_json.length == 0){
		innerHtml += "<p class='nodata'>행사조회 데이터가 없습니다.</p>";
	}else{
		innerHtml += "<ul>";
		
		for(i=0; i<evtInfoListTmResult_json.length; i++) {
			con_camp_id = evtInfoListTmResult_json[i].CAMP_ID;//캠페인 ID
			con_base_ym = evtInfoListTmResult_json[i].BASE_YM;//기준년월 YYYYMM
			con_camp_nm = evtInfoListTmResult_json[i].CAMP_NM;//행사명
			con_camp_period = evtInfoListTmResult_json[i].CAMP_PERIOD;//행사기간
			con_camp_stat_cd= evtInfoListTmResult_json[i].CAMP_STAT_CD;//캠페인상태코드
			con_camp_stat_div_cd = evtInfoListTmResult_json[i].CAMP_STAT_DIV_CD;//캠페인 상태 구분 코드
			con_camp_stat_div_nm = evtInfoListTmResult_json[i].CAMP_STAT_DIV_NM;//캠페인 상태 구분명
			con_camp_stat_div_detail_nm = evtInfoListTmResult_json[i].CAMP_STAT_DIV_DETAIL_NM;//캠페인 상태 상세명
			if(con_camp_stat_div_detail_nm != "") {
				
				con_camp_stat_div_nm = con_camp_stat_div_nm + " " + con_camp_stat_div_detail_nm;
			}
			
			con_pmot_str = evtInfoListTmResult_json[i].PMOT_STR;//프로모션정보
			
			if(con_pmot_str.length >= 42){
				
				con_pmot_str = con_pmot_str.substring(0, 40) + "...";
				
			}
			
			bmpevt_ty_cd = evtInfoListTmResult_json[i].BMPEVT_TY_CD;//행사유형
			bmpevt_ty_nm = evtInfoListTmResult_json[i].BMPEVT_TY_NM;//행사유형명
			ctrtdoc_ncss_yn = evtInfoListTmResult_json[i].CTRTDOC_NCSS_YN;//공동판촉행사여부
			
			if(con_camp_stat_div_cd == "1"){classFlag = "ing";}//작성중 : green
			if(con_camp_stat_div_cd == "2"){classFlag = "standby";}//승인대기 : green2
			if(con_camp_stat_div_cd == "3"){classFlag = "return";}//반려 : red
			if(con_camp_stat_div_cd == "4"){classFlag = "on";}//진행중 : blue
			if(con_camp_stat_div_cd == "5"){classFlag = "off";}//완료 : gray
			
			con_ent_cust_cnt = 0;
			con_rsp_cust_cnt = 0;
			con_rsp_cust_sale_amt = 0;
			con_rsp_cust_rate = 0;
			
			if(con_camp_stat_div_cd == "4" || con_camp_stat_div_cd == "5") {
				for(var j=0; j<evtSaleInfoListTmResult_json.length; j++) {
					
					con_camp_sale_id = evtSaleInfoListTmResult_json[j].CAMP_ID;//캠페인 ID
						
						if(con_camp_id == con_camp_sale_id) {
						
							con_ent_cust_cnt = evtSaleInfoListTmResult_json[j].ENT_CUST_CNT;//접근고객수
							con_rsp_cust_cnt = evtSaleInfoListTmResult_json[j].RSP_CUST_CNT;//응답고객수
							con_rsp_cust_sale_amt = evtSaleInfoListTmResult_json[j].RSP_CUST_SALE_AMT;//응답매출액
							con_rsp_cust_rate = evtSaleInfoListTmResult_json[j].RSP_CUST_RATE;
							con_camp_sale_id = "";
							break;
						}
				} 
			}
			con_ent_cust_cnt = parseInt(isNullZero(con_ent_cust_cnt));
			con_rsp_cust_cnt = parseInt(isNullZero(con_rsp_cust_cnt));
			con_rsp_cust_sale_amt = parseInt(isNullZero(con_rsp_cust_sale_amt));
			if(con_rsp_cust_sale_amt != 0)     {con_rsp_cust_sale_amt = exCeil(con_rsp_cust_sale_amt/division_amt, 1);}
			con_rsp_cust_rate = exCeil(parseFloat(isNullZero(con_rsp_cust_rate)), 2);//응답률
			
			
			/*
			con_ent_cust_cnt = evtInfoListTmResult_json[i].ENT_CUST_CNT;//접근고객수
			con_rsp_cust_cnt = evtInfoListTmResult_json[i].RSP_CUST_CNT;//응답고객수
			con_rsp_cust_rate = exCeil(parseFloat(isNullZero(evtInfoListTmResult_json[i].RSP_CUST_RATE)), 2);//응답률
			con_rsp_cust_sale_amt = evtInfoListTmResult_json[i].RSP_CUST_SALE_AMT;//응답매출액
			con_rsp_cust_sale_amt = parseInt(isNullZero(con_rsp_cust_sale_amt));
			if(con_rsp_cust_sale_amt != 0)     {con_rsp_cust_sale_amt = exCeil(con_rsp_cust_sale_amt/division_amt, 1);}
			*/
			
			if(i == 0){
				innerHtml += "<li>";
				innerHtml += "<p class='date'>"+con_base_ym.substring(0,4)+"년 "+con_base_ym.substring(4,6)+"월</p>";	
				old_ym = con_base_ym;
			}else{
				if(con_base_ym != old_ym){
					innerHtml += "<li>";
					innerHtml += "<p class='date'>"+con_base_ym.substring(0,4)+"년 "+con_base_ym.substring(4,6)+"월</p>";
					old_ym = con_base_ym;
				}else{
					innerHtml += "<li>";
				}
			}
			
			innerHtml += "<div class='list_box "+classFlag+"'>";
			if(bmpevt_ty_cd == "3"){
				innerHtml += "<p class='list_tit1'>"+ bmpevt_ty_nm + "</p>";  //임직원대상은 class="list_tit1"
			} else {
				innerHtml += "<p class='list_tit2'>"+ bmpevt_ty_nm + "</p>";  //신세계고객대상은 class="list_tit2"
			} 
			
			if(ctrtdoc_ncss_yn == "Y"){
				innerHtml += "<p class='list_tit3'>공동판촉행사</p>";  //고객판촉대상행사는 class="list_tit3"	
			}
			
			innerHtml += "<div>";
			innerHtml += "<ul>";
			innerHtml += "<li>";
			innerHtml += "<span>행사 명</span>";
			innerHtml += "<p>"+con_camp_nm+"</p>";
			innerHtml += "</li>";
			innerHtml += "<li>";
			innerHtml += "<span>행사 기간</span>";
			innerHtml += "<p>"+ con_camp_period +"<strong>("+con_camp_stat_div_nm + ")</strong></p>";
			innerHtml += "</li>";
			
			innerHtml += "<li class='wd80 mr20'>";
			innerHtml += "<span>응답/접근고객수</span>";
			innerHtml += "<p>" +  AddComma(con_rsp_cust_cnt) + "/" + AddComma(con_ent_cust_cnt)  +" (응답률 : " + con_rsp_cust_rate + " %)</p>";
			innerHtml += "</li>";
			
			innerHtml += "<li class='wd20'>";
			innerHtml += "<span>응답고객 매출액</span>";		
			innerHtml += "<p>"+ AddComma(con_rsp_cust_sale_amt) + " 백만</p>";//20191029 stj 수정
			
			innerHtml += "<li>";
			innerHtml += "<span>프로모션 정보</span>";
			innerHtml += "<p>"+con_pmot_str+"</p>";
			innerHtml += "</li>";
			innerHtml += "</ul>";
			
			
			if(con_camp_stat_div_cd == "1"){ //작성중
				innerHtml += "<div class='state'>";
				innerHtml += "<p class='view1' style='cursor:pointer' onclick=\"javascript:resultLink('1','"+con_camp_id+"');\">행사수정</p>";
				innerHtml += "<p class='view2' style='cursor:pointer' onclick=\"javascript:deleteEvtInfo('"+con_camp_id+"');\">행사삭제</p>";
				innerHtml += "</div>";
			} else if(con_camp_stat_div_cd == "4"){ //진행중
				innerHtml += "<div class='state'>";
				innerHtml += "<p class='view1' style='cursor:pointer' onclick=\"javascript:resultLink('2','"+con_camp_id+"');\">요약보기</p>";
				//innerHtml += "<p class='view1' style='cursor:pointer' >요약보기</p>";
				innerHtml += "<p class='view2' style='cursor:pointer' onclick=\"javascript:resultLink('3','"+con_camp_id+"');\">결과보기</p>";
				innerHtml += "</div>";
			
			} else if(con_camp_stat_div_cd == "5"){ //완료
				innerHtml += "<div class='state'>";
				innerHtml += "<p class='view1' style='cursor:pointer' onclick=\"javascript:resultLink('2','"+con_camp_id+"');\">요약보기</p>";
				//innerHtml += "<p class='view1' style='cursor:pointer' >요약보기</p>";
				innerHtml += "<p class='view2' style='cursor:pointer' onclick=\"javascript:resultLink('3','"+con_camp_id+"');\">결과보기</p>";
				innerHtml += "</div>";
			} else if(con_camp_stat_div_cd == "2"){ //승인대기
				innerHtml += "<div class='state'>";
				innerHtml += "<p class='view1' style='cursor:pointer' onclick=\"javascript:resultLink('2','"+con_camp_id+"');\">요약보기</p>";
				innerHtml += "<p class='view2' style='cursor:pointer' onclick=\"javascript:showAthorStat('"+con_camp_id+"', '"+ con_camp_stat_cd +"');\">승인상태보기</p>";
				innerHtml += "</div>";	
			} else if(con_camp_stat_div_cd == "3"){ //반려
				innerHtml += "<div class='state'>";
				innerHtml += "<p class='view1' style='cursor:pointer' onclick=\"javascript:checkCampAthorStat('"+con_camp_id+"', '"+con_camp_stat_cd+"');\">행사수정</p>";
				innerHtml += "<p class='view2' style='cursor:pointer' onclick=\"javascript:showAthorRtnReason('"+con_camp_id+"', '"+ con_camp_stat_cd +"');\">반려의견보기</p>";
				innerHtml += "<p class='view3' style='cursor:pointer' onclick=\"javascript:deleteEvtInfo('"+con_camp_id+"');\">행사삭제</p>";
				innerHtml += "</div>";	
			} else {
				innerHtml += "<div class='state'>";
				innerHtml += "<p class='view1' style='cursor:pointer' onclick=\"javascript:resultLink('2','"+con_camp_id+"');\">요약보기</p>";
				//innerHtml += "<p class='view1' style='cursor:pointer' >요약보기</p>";
				innerHtml += "<p class='view2' style='cursor:pointer' onclick=\"javascript:resultLink('3','"+con_camp_id+"');\">결과보기</p>";
				innerHtml += "</div>";
			}
			
			
			innerHtml += "<span class='bg'></span>";
			innerHtml += "</div>";
			
			innerHtml += "<div class='tooltip'>";
			
			if(con_camp_stat_div_cd == "1"){innerHtml += "<p>작성중</p>";}//작성중
			if(con_camp_stat_div_cd == "2"){innerHtml += "<p>승인대기</p>";}//승인대기
			if(con_camp_stat_div_cd == "3"){innerHtml += "<p>반려</p>";}//반려
			if(con_camp_stat_div_cd == "4"){innerHtml += "<p>진행중</p>";}//진행중
			if(con_camp_stat_div_cd == "5"){innerHtml += "<p>완료</p>";}//완료
			
			innerHtml += "</div>";
			innerHtml += "</div>";
			
			//console.log("con_base_ym="+con_base_ym+"   old_ym="+old_ym);
			
			innerHtml += "</li>";
		}
		
		innerHtml += "</ul>";
	}
	
	$("#content_list").html(innerHtml);
	
}	


/**========================================================================================
* 결과보기
========================================================================================*/
function resultLink(flag, val){
	var frameName = "";
	var caption = "";
	var arg = "?camp_id="+val;
	
	//작업중
	if(flag == "1"){
		frameName = "web_cp_campdraftbrand_main";
		caption = "행사 등록(백화점 APP+문자)";
	}
	
	//요약보기
	if(flag == "2"){
		frameName = "web_cp_campdraftbrand_main";
		caption = "요약보기";
		arg += "&chart_flag=Y";
		
	}
	
	//결과보기
	if(flag == "3"){
		frameName = "web_chart_eventresult_main";
		caption = "분석 Report";
	}
	
	
	parent.ClosePage(frameName);//탭 닫기
	parent.OpenPage(caption,frameName,arg);//탭 열기
}

/**========================================================================================
* 수정전 승인상태 체크
========================================================================================*/
function checkCampAthorStat(camp_id, camp_stat){
	
	var msg = "";
	if(camp_stat == "0600"){  //팀장반려
		$("#msg_title").html("행사 수정 불가");
		msg = "팀장 반려된 경우 행사 수정이 불가능합니다.<br/>SM에게 문의해주세요.";
		$("#detail_contents").html(msg.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
		layerPopOpen("floor_popup2");
	} else {
		resultLink("1", camp_id)
	}
		
}

/**========================================================================================
* 내 브랜드 행사결과비교 팝업
========================================================================================*/
function compareEvtPopup(){
	
	//rsp_popup_chart
	var camp_id = "";
	var popup_rsp_cust_sale_amt = 0;
	var popup_rsp_cust_rate = 0;
	
	var evtSaleInfoListTm = new oza_TMHandler('com.obzen.bmpanly.ColEvtProgress', 'selectEvtSaleList', '0', '\@#%');
	evtSaleInfoListTm.setAddDataField('STORE_CD', store_cd);
	evtSaleInfoListTm.setAddDataField('MD_CD', md_cd);
	evtSaleInfoListTm.setAddDataField('STAFF_EVT_INC_YN', staff_inc_yn);
	evtSaleInfoListTm.execute(null, false);
	var evtSaleInfoListTmResult = evtSaleInfoListTm.getResult();
	var evtSaleInfoListTmResult_popup_json = "";
	
	if(evtSaleInfoListTmResult != ""){
		evtSaleInfoListTmResult_popup_json = JSON.parse(evtSaleInfoListTmResult);
	}
	evtSaleInfoListTm.clear();
	
	var pop_data = null;
	pop_data = evtSaleInfoListTmResult_popup_json;
	
	
	if(pop_data.length == 0) {
		alert("등록된 행사 결과가 없습니다.");
		return;		
		
	}
	var cnt = 0;
	cnt = pop_data.length >= 5 ? 5 : pop_data.length;//최대 5건까지 display
	
	for(var i=0; i<cnt; i++) {
		
		popup_rsp_cust_sale_amt = pop_data[i].RSP_CUST_SALE_AMT;
		popup_rsp_cust_rate = pop_data[i].RSP_CUST_RATE;
		popup_rsp_cust_sale_amt = parseInt(isNullZero(popup_rsp_cust_sale_amt));
		if(popup_rsp_cust_sale_amt != 0)     {popup_rsp_cust_sale_amt = exCeil(popup_rsp_cust_sale_amt/division_amt, 1);}
		popup_rsp_cust_rate = exCeil(parseFloat(isNullZero(popup_rsp_cust_rate)), 2);//응답률
		pop_data[i].RSP_CUST_SALE_AMT = popup_rsp_cust_sale_amt;
		pop_data[i].RSP_CUST_RATE = popup_rsp_cust_rate;
	}
	$("#rsp_popup_chart").dxChart({
		dataSource: pop_data,
		commonSeriesSettings: {
			argumentField: "EVT_MONTH",
			tagField :  "CAMP_ID",
			type: "bar",
			barPadding: 0.5,//바 굵기
			hoverMode: "allArgumentPoints",
			selectionMode: "allArgumentPoints",
			label: {
				visible: false
			}
		},
		series: [
			{ axis: "amt", valueField: "RSP_CUST_SALE_AMT", name: "amt", color: '#2ed790'},
			{ axis: "rate", type: "line", valueField: "RSP_CUST_RATE", name: "rate", color: '#7e5be3',
  			  point: { border: {color: "#7e5be3",width: 1,visible: true}//포인트 설정  ->#2ed790
          						, hoverStyle:{border: {color: "#7e5be3",width: 1,visible: true}
          						, color: "#ffffff",size: 10}//포인트 호버 스타일 설정(마우스 오버시)	
  				     }
  			}
	  ],
		valueAxis: [
			{
				name: "amt",
				position: "left",//값 위치
				grid: {visible: true},
				showZero: true,//0부터 시작
				visualRange: {
				    startValue: 0
				    //endValue: 100
				},
				label: {
					customizeText : function(arg){
						var items = arg.valueText.split("\n");
						$.each(items, function(index, item) {
		                   items[index] = AddComma(items[index]);//숫자에 콤마
		                });
						
						return items;
					}
				}
			}, {
				name: "rate",
				position: "right",
				showZero: true,//0부터 시작
				grid: {visible: true}
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
	        	  var unit = "";
	  	        	if(this.seriesName == "amt"){
	  	        		unit = "백만";
	  	        	} else{
	  	        		unit = "%";
	  	        	}
	                      return {
	                  text:AddComma(arg.valueText) + unit
	              };
	          }
	      },
		onPointClick: function (e) {
			e.target.select();
			goResult(e.target.tag);
		}
	});
	layerPopOpen("layer_brpop");
	
}

/**========================================================================================
* 분석Report 이동
========================================================================================*/
function goResult(camp_id){
	resultLink('3',camp_id);
	popupClose("layer_brpop");
}

/**========================================================================================
* 삭제하기
========================================================================================*/
function deleteEvtInfo(val){
	
	var camp_drft_mnu_id = "web_cp_campdraftbrand_main";
	var conTabs = parent.document.getElementById("ulTabs");
   	var iTabCount = conTabs.childElementCount; //.childNodes.length;
    var camp_id = "";
   	for (var i = 0; i < iTabCount; i++) {
    	aTabHead = conTabs.getElementsByTagName("LI")[i];
       if(camp_drft_mnu_id == aTabHead.getAttribute("data-id")){
	    	alert("행사 등록화면이 열려있습니다. 창을 닫은 후 다시 시도해주세요.");	
	    	return false;
	    }
    }
   	//캠페인 상태 다시 체크
   	var camp_mod_yn = "N"; //캠페인수정여부
   	var camp_stat_nm = "";
   	var camp_drft_emp = "";
   	
   	camp_id = val;
   	
   	var selectCampStatInfo = new oza_TMHandler('com.obzen.bmpanly.DocEvtProgressCRM', 'selectCampStatCd', '1', '\@#%');
   	selectCampStatInfo.setAddDataField('CAMP_ID', camp_id);
   	selectCampStatInfo.returnlist('CAMP_STAT_CD;CAMP_STAT_NM;CAMP_DRFT_EMP;CAMP_MOD_YN');
   	selectCampStatInfo.execute(null, false);
   	camp_stat_nm = selectCampStatInfo.ElementValue('CAMP_STAT_NM');
   	camp_drft_emp= selectCampStatInfo.ElementValue('CAMP_DRFT_EMP');
   	camp_mod_yn = selectCampStatInfo.ElementValue('CAMP_MOD_YN');
	selectCampStatInfo.clear();
	
	if(camp_mod_yn == "N"){
		alert("삭제할 수 없습니다.캠페인상태를 확인 해주세요.[" + camp_stat_nm + "]" );
		return false;
		
	}
	
	if(webUserId != camp_drft_emp){
		
		alert("본인이 생성한 행사만 삭제 가능합니다." );
		return false;
	}
	
	if(cmdMessage(1, "선택한 행사를 삭제 하시겠습니까?") == false){
		return;
	}
	
	var deleteBMPTM = new oza_TMHandler('com.obzen.bmp.DocCampaign', 'deleteBMPCamp', '1', '\@#%');
    deleteBMPTM.setAddDataField('CAMP_ID', camp_id);
    deleteBMPTM.returnlist('LOGMSG');
    deleteBMPTM.execute(null, false);
    var msg = deleteBMPTM.ElementValue('LOGMSG');//리턴 처리 메시지
	deleteBMPTM.clear();    
	cmdMessage(0,msg);
	
	webPageMove();
    	
}

/**========================================================================================
* 반려의견보기
========================================================================================*/
function showAthorRtnReason(val, stat_cd){
	
	var camp_id = "";
	camp_id = val;
	
	
	var athorReasonTM = new oza_TMHandler('com.obzen.bmpanly.DocEvtProgressCRM', 'selectAthorDesc', '1', '\@#%');
	athorReasonTM.setAddDataField('CAMP_ID', camp_id);
	athorReasonTM.returnlist('ATHOR_DESC');
	athorReasonTM.execute(null, false);
	var det_rtn_reason  = athorReasonTM.ElementValue('ATHOR_DESC');//반려 사유
	athorReasonTM.clear();
   
	$("#msg_title").html("반려의견 보기");
	$("#detail_contents").html("");
	
	
	if(stat_cd == "0600"){  //팀장반려 SKIP
		det_rtn_reason = "팀장 반려된 경우 행사를 새로 등록하여야 합니다.<br/>SM에게 문의해주세요.";		
	}
    
    if(det_rtn_reason == ""){
    	$("#detail_contents").html("반려의견이 존재하지 않습니다.");
    	layerPopOpen("floor_popup2");
    } else {
    	$("#detail_contents").html(det_rtn_reason.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
    	layerPopOpen("floor_popup2");
    }
  	
}

/**========================================================================================
* 승인상태보기
========================================================================================*/
function showAthorStat(val, stat_cd){
	
	$("#msg_title").html("승인상태 보기");
	var msg = "";
	if(stat_cd == "0400" || stat_cd == "0500"){
		msg = "팀장 검토중(블라썸 결재)";
	} else {
		msg = "SM 검토중(블라썸 결재 전)";
		
	}
	$("#detail_contents").html(msg.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
	layerPopOpen("floor_popup2");
	
}


/*===============================================================
팝업 Open
===============================================================*/
function layerPopOpen(popupN){
	
	var $layer = $("#"+ popupN);
	
	$layer.css("position", "absolute");

  $layer.css("top",(($(window).height() - $layer.outerHeight()) / 2) + $(window).scrollTop());
  $layer.css("left",(($(window).width() - $layer.outerWidth()) / 2) + $(window).scrollLeft());
  $layer.draggable();
  $layer.show();
}


/*===============================================================
팝업 Close
===============================================================*/
function popupClose(popupN) {
	var $layer = $("#"+ popupN);
  	$layer.hide();
}


/**========================================================================================
* 조회하기
========================================================================================*/
function search(){
	var srh_store_cd = $("#sel_store_cd").val();

	if(!srh_store_cd){
		cmdMessage(3,"점포");
		$("#sel_store_cd").focus();
		return;
	}
	
	staff_inc_yn = $(":input:radio[name=rdo_staff_inc]:checked").val();
	store_cd = srh_store_cd;
	md_cd = stg_md_cd;
	searchData();
	
	
}


</script>
<div class="campaign_wrap">
  <div class="campaign_top">
    <div class="camp_inquiry">
      <dl>
        <dt>지점명</dt>
        <dd><select id="sel_store_cd"></select>
          <div class="radio_box">
            <label for=""><input type="radio" id="rdo_staff_inc_Y" name="rdo_staff_inc" value="Y" checked >임직원행사 포함</label>
            <label for=""><input type="radio" id="rdo_staff_inc_N" name="rdo_staff_inc" value="N">임직원행사 미포함</label>
          </div>
          <a href="javascript:search();">검색</a>
        </dd>
      </dl>
    </div>
  </div>
  <div class="camp_inquiry">
    <div class="camp_inquiry_list">
      <div class="list_top">
        <!-- <p class="tit">행사조회<span>관리자용 행사 현황 조회 화면</span></p> -->
        <p class="tit">행사 History 조회</p><!-- 20191029 stj 추가 -->
        <div class="total_wrap">
          <div class="total1">
            <!-- <p>행사 매출 누계</p> -->
            <p>FIT활용 행사매출 누계</p><!-- 20191029 stj 추가 -->
            <strong id="rsp_cust_sale_amt"></strong>
          </div>
          <div class="total2">
            <p>행사 평균응답률</p> <!-- 20191029 stj 추가 -->
            <strong id="camp_rsp_rate"></strong>
          </div>
          <a href="javascript:compareEvtPopup();" class="btn_pop">내 브랜드  행사 결과 비교</a>
        </div>
      </div>
      <div class="list_cnt"  id="content_list">
      </div>
    </div>
  </div>
</div>

<!-- 공통팝업 보기 -->
<div id="floor_popup2" class="layer">
	<p class="tit"><span id="msg_title"></span><a href="javascript:popupClose('floor_popup2');" class="btn_close">닫기</a></p>
	 <div id="floor_popup_con">
    <p id="detail_contents"></p>
    </div>
  <div class="pop_btn">
    <a href="javascript:popupClose('floor_popup2');" class="btn_cancel">닫기</a>
  </div>
</div>

<!-- 공통팝업 보기2 -->
<div id="layer_brpop" class="layer">
	<p class="tit"><span >내 브랜드 행사 결과 비교</span><a href="javascript:popupClose('layer_brpop');" class="btn_close">닫기</a></p>
	 <div class="graph_wrap">
     <ul class="graph_regend">
      <li class="regend1"><i></i>응답고객 매출액</li>
      <li class="regend2"><i></i>응답률</li>
     </ul>
     <div class="graph" id="rsp_popup_chart"></div>
    </div>
  <div class="pop_btn">
    <a href="javascript:popupClose('layer_brpop');" class="btn_cancel">닫기</a>
  </div>
</div>