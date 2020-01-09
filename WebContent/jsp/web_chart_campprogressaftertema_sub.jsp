<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">
var division_amt = 1000000;//금액 :백만원


var ctlInst;
var view;//페이징 데이터 변수
var totalData = 0;// 총 데이터 수
var dataPerPage = 10;// 한 페이지에 나타낼 데이터 수
var pageCount = 10;// 한 화면에 나타낼 페이지 수


var totalPage = 0;
var pageGroup = 0;
var last = 0;
var first = 0;
var next = 0;
var prev = 0;

var col_check = "N";
var col_check2 = "N";
var ozController;
var now_page = 1;


var appr = "";
var store_nm = "";
var md_nm = "";
var ex_camp_nm = "";
//var camp_str_dt = "";
//var camp_end_dt = "";
var chan_nm = "";
var evt_dstic = "";
var evt_offer = "";
var ent_cust_cnt  = 0;
var rsp_cust_cnt  = 0;
var new_cust_cnt  = 0;
var camp_rsp_rate = 0;
var rsp_cust_sale_amt = 0;
var rsp_cust_sale_rate = 0;
var pmot_rsp_amt = 0;
var sale_gain_amt = 0;
var cost_tot_amt = 0;
var net_profit_amt = 0;

var chart_store_cd = "";
var chart_team_cd = "";
var chart_floor_cd = "";
var chart_pc_cd = "";
var chart_crnr_cd = "";
var chart_md_cd = "";
var chart_sect_cd = "";
var chart_genre_cd = "";


var event_cnt = 0;
var res_cust_cnt = 0;
var res_cust_cnt2 = 0;
var sales_amt = 0;

//TM Start =================================================================================================

//행사 건수(Chart) 조회-------------------------
var evtCntTm = new oza_TMHandler('com.obzen.bmpanly.ColEvtProgress', 'selectEvtCnt', '0', '\@#%');
evtCntTm.setAddDataField('STR_DT', str_dt);//시작일자
evtCntTm.setAddDataField('END_DT', end_dt);//종료일자
evtCntTm.setAddDataField('CAMP_STAT', camp_stat);//행사상태
evtCntTm.setAddDataField('SEARCH_DIV', group_div);//점포, 본부 구분
evtCntTm.setAddDataField('STORE_CD', store_cd);//점포 
evtCntTm.setAddDataField('TEAM_CD', team_cd);//팀
evtCntTm.setAddDataField('FLOOR_CD', floor_cd);//층
evtCntTm.setAddDataField('PC_CD', pc_cd);//PC
evtCntTm.setAddDataField('CRNR_CD', crnr_cd);//코너
evtCntTm.setAddDataField('MD_CD', md_cd);//MD
evtCntTm.setAddDataField('HQ_SECT_CD', sect_cd);//담당
evtCntTm.setAddDataField('HQ_GENRE_CD', genre_cd);//장르
evtCntTm.setAddDataField('HQ_FLOOR_CD', floor_cd);//층
evtCntTm.setAddDataField('HQ_PC_CD', pc_cd);//PC
evtCntTm.setAddDataField('HQ_CRNR_CD', crnr_cd);//코너
evtCntTm.setAddDataField('HQ_MD_CD', md_cd);//MD
evtCntTm.setAddDataField('BMPEVT_TY_CD', bmpevt_ty_cd);//임직원 행사포함 여부
evtCntTm.setAddDataField('BRAN_OFFER_DSTIC_CD', bran_offer_dstic_cd);//브랜드 혜택 코드
evtCntTm.setAddDataField('OFFER_BRCH', offer_brch);//신세계 혜택 코드
evtCntTm.execute(null, false);
var evtCntTmResult = evtCntTm.getResult();
var evtCntTm_json = "";
if(evtCntTmResult != ""){
	evtCntTm_json = JSON.parse(evtCntTmResult);
}
evtCntTm.clear();	





	
//TM End ===================================================================================================
	
	

//화면 시작 시 실행
$(document).ready(function() {
	screenLog("조회", "web_chart_campprogressinfo_sub01", "운영현황>FIT행사현황",get_client_ip);//화면 로그(공통)
	
	ozController = new oz_frame();//ozController 정의
	ozController.Ctllist.push(new oz_ItemValue('com.obzen.bmpanly.ColEvtProgress', 'grd_list'));//그리드 아이디 정의
  
	txtSetting("select");
	eventCnt();
	eventInfo("select");
	
	
	
});



/**========================================================================================
*조건별 행사건수, 실적 조회
========================================================================================*/
function txtSetting(search_flag){
	
	if(search_flag == "search"){
		
		if(chart_store_cd == "" && store_cd != ""){chart_store_cd = store_cd;}
		if(chart_team_cd == "" && team_cd != ""){chart_team_cd = team_cd;}
		if(chart_floor_cd == "" && floor_cd != ""){chart_floor_cd = floor_cd;}
		if(chart_pc_cd == "" && pc_cd != ""){chart_pc_cd = pc_cd;}
		if(chart_crnr_cd == "" && crnr_cd != ""){chart_crnr_cd = crnr_cd;}
		if(chart_md_cd == "" && md_cd != ""){chart_md_cd = md_cd;}
		if(chart_sect_cd == "" && sect_cd != ""){chart_sect_cd = sect_cd;}
		if(chart_genre_cd == "" && genre_cd != ""){chart_genre_cd = genre_cd;}
		
		/*
		console.log("chart_store_cd="+chart_store_cd);
		console.log("chart_team_cd="+chart_team_cd);
		console.log("chart_floor_cd="+chart_floor_cd);
		console.log("chart_pc_cd="+chart_pc_cd);
		console.log("chart_crnr_cd="+chart_crnr_cd);
		console.log("chart_md_cd="+chart_md_cd);
		console.log("chart_sect_cd="+chart_sect_cd);
		console.log("chart_genre_cd="+chart_genre_cd);
		console.log("                           ");
		*/
		
		
		//조건별 행사건수, 실적 조회-------------------------
		var evtSumInfoTm = new oza_TMHandler('com.obzen.bmpanly.DocEvtProgress', 'selectEvtSumInfo', '1', '\@#%');
		evtSumInfoTm.setAddDataField('STR_DT', str_dt);//시작일자
		evtSumInfoTm.setAddDataField('END_DT', end_dt);//종료일자
		evtSumInfoTm.setAddDataField('CAMP_STAT', camp_stat);//행사상태
		evtSumInfoTm.setAddDataField('SEARCH_DIV', group_div);//점포, 본부 구분
		evtSumInfoTm.setAddDataField('STORE_CD', chart_store_cd);//점포 
		evtSumInfoTm.setAddDataField('TEAM_CD', chart_team_cd);//팀
		evtSumInfoTm.setAddDataField('FLOOR_CD', chart_floor_cd);//층
		evtSumInfoTm.setAddDataField('PC_CD', chart_pc_cd);//PC
		evtSumInfoTm.setAddDataField('CRNR_CD', chart_crnr_cd);//코너
		evtSumInfoTm.setAddDataField('MD_CD', chart_md_cd);//MD
		evtSumInfoTm.setAddDataField('HQ_SECT_CD', chart_sect_cd);//담당
		evtSumInfoTm.setAddDataField('HQ_GENRE_CD', chart_genre_cd);//장르
		evtSumInfoTm.setAddDataField('HQ_FLOOR_CD', chart_floor_cd);//층
		evtSumInfoTm.setAddDataField('HQ_PC_CD', chart_pc_cd);//PC
		evtSumInfoTm.setAddDataField('HQ_CRNR_CD', chart_crnr_cd);//코너
		evtSumInfoTm.setAddDataField('HQ_MD_CD', chart_md_cd);//MD
		evtSumInfoTm.setAddDataField('BMPEVT_TY_CD', bmpevt_ty_cd);//임직원 행사포함 여부
		evtSumInfoTm.setAddDataField('BRAN_OFFER_DSTIC_CD', bran_offer_dstic_cd);//브랜드 혜택 코드
		evtSumInfoTm.setAddDataField('OFFER_BRCH', offer_brch);//신세계 혜택 코드
		evtSumInfoTm.returnlist('CAMP_CNT;ENT_CUST_CNT;RSP_CUST_CNT;RSP_CUST_SALE_AMT');
		evtSumInfoTm.execute(null, false);
		event_cnt = evtSumInfoTm.ElementValue('CAMP_CNT');//행사건수
		res_cust_cnt = evtSumInfoTm.ElementValue('ENT_CUST_CNT');//접근고객수
		res_cust_cnt2 = evtSumInfoTm.ElementValue('RSP_CUST_CNT');//응답고객수
		sales_amt = evtSumInfoTm.ElementValue('RSP_CUST_SALE_AMT');//매출액
		evtSumInfoTm.clear();	
	}else{
		//조건별 행사건수, 실적 조회-------------------------
		var evtSumInfoTm = new oza_TMHandler('com.obzen.bmpanly.DocEvtProgress', 'selectEvtSumInfo', '1', '\@#%');
		evtSumInfoTm.setAddDataField('STR_DT', str_dt);//시작일자
		evtSumInfoTm.setAddDataField('END_DT', end_dt);//종료일자
		evtSumInfoTm.setAddDataField('CAMP_STAT', camp_stat);//행사상태
		evtSumInfoTm.setAddDataField('SEARCH_DIV', group_div);//점포, 본부 구분
		evtSumInfoTm.setAddDataField('STORE_CD', store_cd);//점포 
		evtSumInfoTm.setAddDataField('TEAM_CD', team_cd);//팀
		evtSumInfoTm.setAddDataField('FLOOR_CD', floor_cd);//층
		evtSumInfoTm.setAddDataField('PC_CD', pc_cd);//PC
		evtSumInfoTm.setAddDataField('CRNR_CD', crnr_cd);//코너
		evtSumInfoTm.setAddDataField('MD_CD', md_cd);//MD
		evtSumInfoTm.setAddDataField('HQ_SECT_CD', sect_cd);//담당
		evtSumInfoTm.setAddDataField('HQ_GENRE_CD', genre_cd);//장르
		evtSumInfoTm.setAddDataField('HQ_FLOOR_CD', floor_cd);//층
		evtSumInfoTm.setAddDataField('HQ_PC_CD', pc_cd);//PC
		evtSumInfoTm.setAddDataField('HQ_CRNR_CD', crnr_cd);//코너
		evtSumInfoTm.setAddDataField('HQ_MD_CD', md_cd);//MD
		evtSumInfoTm.setAddDataField('BMPEVT_TY_CD', bmpevt_ty_cd);//임직원 행사포함 여부
		evtSumInfoTm.setAddDataField('BRAN_OFFER_DSTIC_CD', bran_offer_dstic_cd);//브랜드 혜택 코드
		evtSumInfoTm.setAddDataField('OFFER_BRCH', offer_brch);//신세계 혜택 코드
		evtSumInfoTm.returnlist('CAMP_CNT;ENT_CUST_CNT;RSP_CUST_CNT;RSP_CUST_SALE_AMT');
		evtSumInfoTm.execute(null, false);
		event_cnt = evtSumInfoTm.ElementValue('CAMP_CNT');//행사건수
		res_cust_cnt = evtSumInfoTm.ElementValue('ENT_CUST_CNT');//접근고객수
		res_cust_cnt2 = evtSumInfoTm.ElementValue('RSP_CUST_CNT');//응답고객수
		sales_amt = evtSumInfoTm.ElementValue('RSP_CUST_SALE_AMT');//매출액
		evtSumInfoTm.clear();	
	}
	
	
	
	
	$("#event_cnt").text(AddComma(isNullZero(event_cnt)));
	$("#res_cust_cnt").text(AddComma(isNullZero(res_cust_cnt)));
	$("#res_cust_cnt2").text(AddComma(isNullZero(res_cust_cnt2)));
	sales_amt = AddComma(exCeil(parseInt(isNullZero(sales_amt))/division_amt, 1));
	$("#sales_amt").text(sales_amt);
}



/**========================================================================================
 * 행사 건수(Chart)
 ========================================================================================*/
function eventCnt(){
	var data = null;
	data = evtCntTm_json;
	
	
	/*
	data = [
		{ 
			ITEM_NM: "본점",
			CNT:"1000",
			ITEM_CD :"01"
		},
		{ 
			ITEM_NM: "강남점",
			CNT:"500",
			ITEM_CD :"1111"
		},
		{ 
			ITEM_NM: "센트롤시티",
			CNT:"600",
			ITEM_CD :"1111"
		},
		{ 
			ITEM_NM: "영등포점",
			CNT:"900",
			ITEM_CD :"1111"
		},
		{ 
			ITEM_NM: "부산점",
			CNT:"200",
			ITEM_CD :"1111"
		},
		{ 
			ITEM_NM: "천안점",
			CNT:"100",
			ITEM_CD :"1111"
		}
	];
	*/
	
	for(var i=0; i<data.length; i++) {
		data[i].CNT = parseInt(isNullZero(data[i].CNT));
	}
	
		
	//Bar Chart Start====================================================
	
		
	if(data.length == 0){
		$("#event_cnt_chart").html("<p class='nodata'>점포별 행사 운영 현황 데이터가 없습니다.</p>");	
	}else{
		$("#event_cnt_chart").dxChart({
			dataSource: data,
			//size: {  width : 500, height : 170 },
			barWidth:0.4,//바 굵기
			commonSeriesSettings: {
				argumentField: "ITEM_NM",
				type: "bar",
				hoverMode: "allArgumentPoints",
				selectionMode: "allArgumentPoints",
				label : {
							visible: true,font:{color:"#2ed790",weight:690},backgroundColor:"none"
							,customizeText : function(arg){
								var items = arg.valueText.split("\n");
								$.each(items, function(index, item) {
				                   items[index] = AddComma(items[index]);//숫자에 콤마
				                });
								
								return items;
							}
				}
			},
			series: [
				{valueField: "CNT", name: "명", color: '#2ed790' }
			],
			valueAxis: [
				{
					visible: true,
					position: "left",//값 위치
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
			onPointClick: function (e) {//Chart 클릭 시 이벤트
				e.target.select();
			  filterData(e.target.originalArgument);//클릭한 점포의 코드 조회
				
				chart_store_cd = "";
				chart_team_cd = "";
				chart_floor_cd = "";
				chart_pc_cd = "";
				chart_crnr_cd = "";
				chart_md_cd = "";
				chart_sect_cd = "";
				chart_genre_cd = "";
				
				if(group_div == "1"){
					if(store_cd == ""){chart_store_cd = returnValue;}
					else if(team_cd == ""){chart_team_cd = returnValue;}
					else if(floor_cd == ""){chart_floor_cd = returnValue;}
					else if(pc_cd == ""){chart_pc_cd = returnValue;}
					else if(crnr_cd == ""){crnr_cd = returnValue;}
					else if(md_cd == ""){chart_md_cd = returnValue;}	
				}
				
				
				if(group_div == "2"){
					if(sect_cd == ""){chart_sect_cd = returnValue;}
					else if(genre_cd == ""){chart_genre_cd = returnValue;}
					else if(floor_cd == ""){chart_floor_cd = returnValue;}
					else if(pc_cd == ""){chart_pc_cd = returnValue;}
					else if(crnr_cd == ""){crnr_cd = returnValue;}
					else if(md_cd == ""){chart_md_cd = returnValue;}	
				}
							
				txtSetting("search");
				eventInfo("search");
			}
		});
		
		//Bar Chart에 커서 스타일 추가
		$('.dxc-markers').css("cursor","pointer");
	}	
		
		
	
	
	
	/**========================================================================================
	 * 클릭한 점포의 점포코드 조회
	 ========================================================================================*/
	var returnValue = "";
	function filterData(name) {
	    return data.filter(function (item) {
	    			
	    			if(item.ITEM_NM === name){
	    				returnValue = item.ITEM_CD;
	    			}	
	    });
	}
	//Bar Chart End====================================================
}




/**========================================================================================
 * Excel 다운로드
 ========================================================================================*/
function excelDownload(){
	
	if(chart_store_cd == "" && store_cd != ""){chart_store_cd = store_cd;}
	if(chart_team_cd == "" && team_cd != ""){chart_team_cd = team_cd;}
	if(chart_floor_cd == "" && floor_cd != ""){chart_floor_cd = floor_cd;}
	if(chart_pc_cd == "" && pc_cd != ""){chart_pc_cd = pc_cd;}
	if(chart_crnr_cd == "" && crnr_cd != ""){chart_crnr_cd = crnr_cd;}
	if(chart_md_cd == "" && md_cd != ""){chart_md_cd = md_cd;}
	if(chart_sect_cd == "" && sect_cd != ""){chart_sect_cd = sect_cd;}
	if(chart_genre_cd == "" && genre_cd != ""){chart_genre_cd = genre_cd;}
	
	
	
	//TM Start =================================================================================================
	var excelTm = new oza_TMHandler('com.obzen.bmpanly.DocEvtProgress', 'excelDownEvtProgress', '1', '\@#%');
	excelTm.setAddDataField('STR_DT', str_dt);//시작일자
	excelTm.setAddDataField('END_DT', end_dt);//종료일자
	excelTm.setAddDataField('CAMP_STAT', camp_stat);//행사상태
	excelTm.setAddDataField('SEARCH_DIV', group_div);//점포, 본부 구분
	excelTm.setAddDataField('STORE_CD', chart_store_cd);//점포 
	excelTm.setAddDataField('TEAM_CD', chart_team_cd);//팀
	excelTm.setAddDataField('FLOOR_CD', chart_floor_cd);//층
	excelTm.setAddDataField('PC_CD', chart_pc_cd);//PC
	excelTm.setAddDataField('CRNR_CD', chart_crnr_cd);//코너
	excelTm.setAddDataField('MD_CD', chart_md_cd);//MD
	excelTm.setAddDataField('HQ_SECT_CD', chart_sect_cd);//담당
	excelTm.setAddDataField('HQ_GENRE_CD', chart_genre_cd);//장르
	excelTm.setAddDataField('HQ_FLOOR_CD', chart_floor_cd);//층
	excelTm.setAddDataField('HQ_PC_CD', chart_pc_cd);//PC
	excelTm.setAddDataField('HQ_CRNR_CD', chart_crnr_cd);//코너
	excelTm.setAddDataField('HQ_MD_CD', chart_md_cd);//MD
	excelTm.setAddDataField('BMPEVT_TY_CD', bmpevt_ty_cd);//임직원 행사포함 여부
	excelTm.setAddDataField('BRAN_OFFER_DSTIC_CD', bran_offer_dstic_cd);//브랜드 혜택 코드
	excelTm.setAddDataField('OFFER_BRCH', offer_brch);//신세계 혜택 코드
	excelTm.returnlist('SERVER_FILE_PATH;FILENM');
	excelTm.execute(null, false);
	
	var file_path = excelTm.ElementValue('SERVER_FILE_PATH');//파일 경로
	var file_name = excelTm.ElementValue('FILENM');//파일 명

	excelTm.clear();
	
	screenLog("다운로드", "web_chart_campprogressinfo_sub01", "브랜드마케팅>행사등록하기>행사등록(백화점APP+문자)>행사 진행 현황>Excel Download",get_client_ip);//화면 로그(공통)
	//cmdMessage(0,msg);
	//TM End ===================================================================================================
	
	//Test Data	
	//file_path = "/sw/eCubeStudioServer/repository/";
	//file_name = "fic0519220190930105423.xlsx";
	
	//console.log("file_path="+file_path);
	//console.log("file_name="+file_name);
		
	if(file_path != "" && file_name != ""){
		$("#file_path").val(file_path);
		$("#file_name").val(file_name);
		$("#excel_form").attr("action", "./common/file_download.jsp");
		$("#excel_form").submit();	
	}else{
		cmdMessage(0,"파일 생성에 실패 하였습니다.");
		return;		
	}
}



/**========================================================================================
 * 행사 현황(목록)
 ========================================================================================*/
function eventInfo(select_flag){
	
	if(chart_store_cd == "" && store_cd != ""){chart_store_cd = store_cd;}
	if(chart_team_cd == "" && team_cd != ""){chart_team_cd = team_cd;}
	if(chart_floor_cd == "" && floor_cd != ""){chart_floor_cd = floor_cd;}
	if(chart_pc_cd == "" && pc_cd != ""){chart_pc_cd = pc_cd;}
	if(chart_crnr_cd == "" && crnr_cd != ""){chart_crnr_cd = crnr_cd;}
	if(chart_md_cd == "" && md_cd != ""){chart_md_cd = md_cd;}
	if(chart_sect_cd == "" && sect_cd != ""){chart_sect_cd = sect_cd;}
	if(chart_genre_cd == "" && genre_cd != ""){chart_genre_cd = genre_cd;}
	
	/*
	console.log("chart_store_cd="+chart_store_cd);
	console.log("chart_team_cd="+chart_team_cd);
	console.log("chart_floor_cd="+chart_floor_cd);
	console.log("chart_pc_cd="+chart_pc_cd);
	console.log("chart_crnr_cd="+chart_crnr_cd);
	console.log("chart_md_cd="+chart_md_cd);
	console.log("chart_sect_cd="+chart_sect_cd);
	console.log("chart_genre_cd="+chart_genre_cd);
	console.log("                           ");
	*/
	
	var data = "";
	
	//행사 현황(목록) 조회-------------------------
	var eventInfoTm = new oza_TMHandler('com.obzen.bmpanly.ColEvtProgress', 'selectEvtProgInfo', '0', '\@#%');
	eventInfoTm.setAddDataField('STR_DT', str_dt);//시작일자
	eventInfoTm.setAddDataField('END_DT', end_dt);//종료일자
	eventInfoTm.setAddDataField('CAMP_STAT', camp_stat);//행사상태
	eventInfoTm.setAddDataField('SEARCH_DIV', group_div);//점포, 본부 구분
	eventInfoTm.setAddDataField('STORE_CD', chart_store_cd);//점포 
	eventInfoTm.setAddDataField('TEAM_CD', chart_team_cd);//팀
	eventInfoTm.setAddDataField('FLOOR_CD', chart_floor_cd);//층
	eventInfoTm.setAddDataField('PC_CD', chart_pc_cd);//PC
	eventInfoTm.setAddDataField('CRNR_CD', chart_crnr_cd);//코너
	eventInfoTm.setAddDataField('MD_CD', chart_md_cd);//MD
	eventInfoTm.setAddDataField('HQ_SECT_CD', chart_sect_cd);//담당
	eventInfoTm.setAddDataField('HQ_GENRE_CD', chart_genre_cd);//장르
	eventInfoTm.setAddDataField('HQ_FLOOR_CD', chart_floor_cd);//층
	eventInfoTm.setAddDataField('HQ_PC_CD', chart_pc_cd);//PC
	eventInfoTm.setAddDataField('HQ_CRNR_CD', chart_crnr_cd);//코너
	eventInfoTm.setAddDataField('HQ_MD_CD', chart_md_cd);//MD
	eventInfoTm.setAddDataField('BMPEVT_TY_CD', bmpevt_ty_cd);//임직원 행사포함 여부
	eventInfoTm.setAddDataField('BRAN_OFFER_DSTIC_CD', bran_offer_dstic_cd);//브랜드 혜택 코드
	eventInfoTm.setAddDataField('OFFER_BRCH', offer_brch);//신세계 혜택 코드
	
	eventInfoTm.execute(null, false);
	
	var eventInfoTmResult = eventInfoTm.getResult();
	var eventInfoTm_json = "";
	if(eventInfoTmResult != ""){
		eventInfoTm_json = JSON.parse(eventInfoTmResult);
	}
	eventInfoTm.clear();
	
	
	
	
	data = eventInfoTm_json;
	
  totalData = data.length;
  
  if(select_flag != "search"){
	  var gridColumn= [
	      {binding: 'ROWNUM', header: '순번', name : '', isReadOnly : true, dataType : wijmo.DataType.Integer, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'STORE_NM', header: '점포명', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'MD_NM', header: 'MD명', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'MD_CD', header: 'MD코드', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'EX_CAMP_NM', header: '행사명', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'CAMP_STAT_NM', header: '행사상태', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false,align:'center'},
	      {binding: 'CAMP_STR_DT', header: '시작일자', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : 'yyyy-mm-dd', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'CAMP_END_DT', header: '종료일자', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : 'yyyy-mm-dd', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'CHAN_NM', header: '접근채널', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false,align:'center'},
	      {binding: 'ENT_CUST_CNT', header: 'APP접근고객수', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false,align:'center'},
	      {binding: 'RSP_CUST_CNT', header: '응답고객수', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false,align:'center'},
	      {binding: 'RSP_CUST_SALE_AMT', header: '발생매출액', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false,align:'center'},
	      {binding: 'BRAN_OFFER_DSTIC1', header: '브랜드혜택1', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'BRAN_OFFER_DSTIC2', header: '브랜드혜택2', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'BRAN_OFFER_DSTIC3', header: '브랜드혜택3', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'SHIN_OFFER_DSTIC1', header: '신세계혜택1', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'SHIN_OFFER_DSTIC2', header: '신세계혜택2', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'SHIN_OFFER_DSTIC3', header: '신세계혜택3', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'SHIN_OFFER_DSTIC4', header: '신세계혜택4', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'CAHN_TARN_DT', header: '발송일자', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : 'yyyy-mm-dd', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'APP_SHOW_DSTIC', header: '혜택공개범위', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'EVT_TY_NM', header: '행사구분', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'DETAIL', header: '행사결과보기', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'BRNDPROFILE', header: '브랜드프로필', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
	      {binding: 'CAMP_ID', header: 'CAMP_ID', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : false, allowMerging : false, align : 'center'},
	      {binding: 'STORE_CD', header: 'STORE_CD', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : false, allowMerging : false, align : 'center'}
	  ];

	  /*
	  var mergedrow0 = [ 
		  	{binding: 'ROWNUM', caption: '평가'},
	      {binding: 'STORE_NM', caption: '행사 기본정보'},
	      {binding: 'EVT_TY_NM', caption: '행사 기본정보'},
	      {binding: 'EX_CAMP_NM', caption: '행사 기본정보'},
	      {binding: 'CAMP_STR_DT', caption: '행사 기본정보'},
	      {binding: 'CAMP_END_DT', caption: '행사 기본정보'},
	      {binding: 'CHAN_NM', caption: '행사 기본정보'},
	      {binding: 'CAMP_STAT_NM', caption: '행사 기본정보'},
	      {binding: 'EVT_OFFER', caption: '행사 기본정보'},
	      {binding: 'ENT_CUST_CNT', caption: '행사 숫자/결과'},
	      {binding: 'RSP_CUST_CNT', caption: '행사 숫자/결과'},
	      {binding: 'NEW_CUST_CNT', caption: '행사 숫자/결과'},
	      {binding: 'CAMP_RSP_RATE', caption: '행사 숫자/결과'},
	      {binding: 'RSP_CUST_SALE_AMT', caption: '행사 숫자/결과'},
	      {binding: 'RSP_CUST_SALE_RATE', caption: '행사 숫자/결과'},
	      {binding: 'PMOT_RSP_AMT', caption: '프로모션 행사 평가'},
	      {binding: 'SALE_GAIN_AMT', caption: '프로모션 행사 평가'},
	      {binding: 'COST_TOT_AMT', caption: '프로모션 행사 평가'},
	      {binding: 'NET_PROFIT_AMT', caption: '행사손익'}
	  ];
	  */
	  
	  var grdTableColinitinfo = {
				autoGenerateColumns: false,
				columns: gridColumn,
				frozenColumns: 4,//컬럼 고정
				selectionChanged: function (s, e) {
					var col = s.columns[e.col];
			    if (col.binding == "DETAIL"){col_check = "Y";}else{col_check = "N";}
			    if (col.binding == "BRNDPROFILE"){col_check2 = "Y";}else{col_check2 = "N";}
	      },
				formatItem: function (s, e) {//grid 셀에 이미지 태그 추가 
				
				//헤더,셀 스타일 적용
				if(e.panel.cellType == wijmo.grid.CellType.ColumnHeader){
					wijmo.addClass(e.cell, 'head_bg');	
				}else{
				  wijmo.addClass(e.cell, 'td_bg');
			  }
				
				//Cell 설정
	  	  if (e.panel == s.cells) {
	  			var item = s.rows[e.row].dataItem;
	      	var col = s.columns[e.col];
	      
	      	//자세히 보기,브랜드프로필
	      	if (col.binding == "DETAIL" || col.binding == "BRNDPROFILE"){
	      		wijmo.setCss(e.cell, {cursor:'pointer'});
	      		wijmo.addClass(e.cell, 'td_bg_underline');
	      	}
	      	
	      }
			 }
			};
			
	  
	  
	  ctlInst = new oz_grid('#grid_list');
		ozgrid_instMgr.add(ctlInst);
		ctlInst.initialize(grdTableColinitinfo);
		//ctlInst.addMergedHeader(mergedrow0);
		ctlInst.selectionHeader = '';
		ctlInst.disableAllChecked = false;
		ctlInst.dateDelimiter = '';
		ctlInst.delimiter = ';';
		ctlInst.exportDelimiter = ';';
		ctlInst.showRadioButton = false;
		ctlInst.indexColumnVisible = false;
		ctlInst.selectionMode = wijmo.grid.SelectionMode.None;
		ctlInst.addEventListener("onClick",pageLink);//Click 이벤트
		ctlInst.addEventListener("onSortedColumn",sortColumn);//정렬 이벤트
		ctlInst.applySettings();
		ozController.registerControl(ctlInst, 'grd_list', true, true);
  }
  
	
	//데이터 조회
	getCtl('grd_list').setItemsSource(eventInfoTm_json,dataPerPage);
 	
	setGridColWidth();//컬럼 넓이
	setGridRowHeight();//로우 높이
	
	
	//그리드 End-------------------------------------------------------------------------------------------------

	var curr =(view.pageIndex + 1);
	
	if(totalData == 0){
		$("#dowonload_button").css("display","none");
		$("#paging_area").css("display","none");
		
	}else{
		gridPaging(curr);	
		$("#dowonload_button").css("display","");
		$("#paging_area").css("display","");
	}
	
	
	
  /**========================================================================================
  * 그리드 페이징
  ========================================================================================*/
  function gridPaging(currentPage){
	  now_page = currentPage;
	  setGridRowHeight();
	  
	  
		var html = ""; 
		
	 	totalPage = Math.ceil(totalData/dataPerPage);    // 총 페이지 수
   	pageGroup = Math.ceil(currentPage/pageCount);    // 페이지 그룹
   
   	//console.log("pageGroup : " + pageGroup);
   
   	last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
   	if(last > totalPage){last = totalPage;}
   	
   	if((last%pageCount) > 0){
    	first = parseInt(last) - (last%pageCount)+1;
    }else{
    	first = parseInt(last) - parseInt(pageCount-1);
    }
    
   	
   	if(first < 1) first = 1;
   	next = last+1;
   	prev = first-1;
	  
	  
		for(var i=first; i <= last; i++){
				html += "<li id=page_" + i + "><a href=\"#\"  id="+i+">" + i + "</a></li>";
	  }
		
		/*
		console.log("========================================");
		console.log("currentPage="+currentPage);
		console.log("totalPage="+totalPage);
		console.log("pageGroup="+pageGroup);
		console.log("last="+last);
		console.log("first="+first);
		console.log("next="+next);
		console.log("prev="+prev);
		console.log("view.pageCount="+view.pageCount);
		*/
		
		
  	$("#paging").html(html);
  	$("#page_" + currentPage).addClass("on");// 현재 페이지 표시
  	
  	if(prev == 0){$(".page_prev").addClass("off");$("#pagePrev").css("cursor","default");}
  	else{$(".page_prev").removeClass("off");$("#pagePrev").css("cursor","pointer");}
  	if(last == view.pageCount){$(".page_next").addClass("off");$("#pageNext").css("cursor","default");}
  	else{$(".page_next").removeClass("off");$("#pageNext").css("cursor","pointer");}
  	
  	$("#paging a").click(function(){
  	
			var $item = $(this);
	    var $id = $item.attr("id");
	    var selectedPage = $item.text();
	    
	    view.moveToPage(parseInt(selectedPage)-1);
	    
	    $("#paging li").removeClass("on"); //Remove any "active" class
	  
	  	gridPaging(selectedPage);
	    
			return false;
	  });
  }
  
  
	
  
	//이전 페이지로 이동
  $("#pagePrev").click(function() {
  	if(prev == 0){return false;}
  	//view.moveToPreviousPage();
  	view.moveToPage(prev-1);
  	gridPaging(prev);
  	
  	return false;
  });
  

	//다음 페이지로 이동
  $("#pageNext").click(function() {
  	if(last == view.pageCount){return false;}
  	//view.moveToNextPage();
  	view.moveToPage(next-1);
  	gridPaging(next);
  	
  	return false;
  });
  
  /* 처음 / 마지막 페이지로 이동
  $("#pageFirst").click(function() {
  	view.moveToFirstPage();
		curr =(view.pageIndex + 1)+" / "+view.pageCount;
  	$("#input_page_index").val(curr);
  });
  
  $("#pageLast").click(function() {
  	view.moveToLastPage();
  	curr =(view.pageIndex + 1)+" / "+view.pageCount;
  	$("#input_page_index").val(curr);
  });
  */
}


/**========================================================================================
* 컬럼 넓이 지정 
* oz.grid.js 참조
========================================================================================*/
function setGridColWidth() {
	
	for(var i = 0; i <= 23 ; i++){
		if(i == 0){
			getCtl('grd_list').setColWidthPx(i, 40);//순위
		}else if(i == 4){
			getCtl('grd_list').setColWidthPx(i, 200);//행사명
		}else if(i == 11){
			getCtl('grd_list').setColWidthPx(i, 200);//발생매출액	
		}else{
			getCtl('grd_list').setColWidthPx(i, 80);	
		}
	}
}


/**========================================================================================
* 로우 높이 지정 
* oz.grid.js 참조
========================================================================================*/
function setGridRowHeight() {
	getCtl('grd_list').setRowHeightPx(0, 40);
	
	var forCnt = 0;
	
	if(totalData > 0 ){
		
		if(totalData < dataPerPage){
			forCnt = totalData;
		}else{
			
			if(now_page*dataPerPage < totalData){
				forCnt = dataPerPage;	
			}else{
				forCnt = (totalData%dataPerPage);
			}
		}
		
		for(var i=1;i<= forCnt;i++){	
			getCtl('grd_list').setRowHeightPx(i, 45);	
		}
	}
}


/**========================================================================================
* 정렬 후 이벤트 
========================================================================================*/
function sortColumn(){
	setGridRowHeight();
}


/**========================================================================================
* 링크
========================================================================================*/
var link_camp_cd = "";
var link_store_cd = "";
var link_md_cd = "";
var link_md_nm = "";

function pageLink(){
	var frameName = "";
	var caption = "";
	var arg = "";
	
	if(col_check == "Y"){
		link_camp_cd = getCtl('grd_list').getDataSourceValue('CAMP_ID');
		
		frameName = "web_chart_eventresult_main";
		caption = "분석Report";
		arg = "?camp_id="+link_camp_cd;
		
		parent.ClosePage(frameName);//탭 닫기
		parent.OpenPage(caption,frameName,arg);//탭 열기
	}
	
	
	if(col_check2 == "Y"){
		link_store_cd = getCtl('grd_list').getDataSourceValue('STORE_CD');
		link_md_cd = getCtl('grd_list').getDataSourceValue('MD_CD');
		link_md_nm = getCtl('grd_list').getDataSourceValue('MD_NM');
		
		frameName = "web_brandprofile_main";
	  caption = "브랜드 프로필";
		arg = "?store_cd="+link_store_cd+"&md_cd="+link_md_cd+"&md_nm="+encodeURIComponent(encodeURIComponent(link_md_nm));
		
		parent.ClosePage(frameName);//탭 닫기
		parent.OpenPage(caption,frameName,arg);//탭 열기
	}
}


/**========================================================================================
* ozController 컨트롤 가져오기
========================================================================================*/
function getCtl(id) {
	return ozController.getControl(id);
}


</script>


<form name="excel_form" id="excel_form" method="post" target="_blank">
<input type="hidden" name="file_path" id="file_path" />
<input type="hidden" name="file_name" id="file_name" />
</form>

<div id="web_content">
  <div class="brandResult_wrap pt87">
    <div class="br_box">
      <div class="brbox_wrap">
        <p class="tit">점포별 진행 대기 현황(단위/건)</p>
        <div class="graph_top">
          <div class="graph" id="event_cnt_chart"></div>
        </div>
        <ul class="val_list">
            <li class="val1 wd50">
              <span>행사건수</span>
              <div>총 <p><strong id="event_cnt"></strong>건</p></div>
            </li>
            <li class="val2 wd50">
              <span>접근고객</span>
              <div>총 <p><strong  id="res_cust_cnt"></strong>명</p></div>
            </li>
          <!--   <li class="val3">
              <span>매출액</span>
              <div>총 <p><strong id="sales_amt"></strong>백만</p></div>
            </li>  -->
          </ul>
      </div>
    </div>
    <div class="br_box">
      <div class="event_table">
        <p class="tit">행사 현황</p>
        <!-- <div id="grid_content"></div> -->
        <div class="table_wrap" id="grid_list"></div>
        <div class="btm_cnt">
          <div class="page_box">
            <ul id="paging_area">
               <li class="page_prev off"><a href="#" id="pagePrev" style="cursor:default">이전페이지</a></li>
               <li id="paging"></li>
               <li class="page_next"><a href="#" id="pageNext">다음페이지</a></li>
            </ul>
          </div>
          <a id="dowonload_button" class="btn_listdown" href="javascript:excelDownload();">List 다운로드</a>
        </div>
      </div>
    </div>
  </div>
</div>
