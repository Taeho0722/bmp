<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">

var division_value2 = 1000000;//백만원

var ozController;

var view;//페이징 데이터 변수
var totalData = 0;// 총 데이터 수
var dataPerPage = 100;// 한 페이지에 나타낼 데이터 수
var pageCount = 10;// 한 화면에 나타낼 페이지 수
var totalPage = 0;
var pageGroup = 0;
var last = 0;
var first = 0;
var next = 0;
var prev = 0;

//변수 정의
var order = "";//순서
var md_nm = "";//MD명
var md_lvl_nm = "";//등급명
var md_lvl_score = "";//점수
var cust_cnt = "";//접근고객
var rst_cust_cnt = "";//응답고객수
var new_cust_cnt = "";//신규고객수
var slae_amt = "";//매출액
var camp_cnt = "";//행사횟수
var cost_amt = "";//비용
var lms_yn = "";//LMS가능여부
var mms_yn = "";//MMS가능여부
var edm_yn = "";//EDM가능여부
var offer1 = "";//정률쿠폰사용가능여부
var offer2 = "";//정액쿠폰사용가능여부
var offer3 = "";//사은행사사용가능여부
var offer4 = "";//세일리지사용가능여부
var offer5 = "";//마일리지사용가능여부
var offer6 = "";//멤버스바사용가능여부
var offer7 = "";//주차권사용가능여부
var cust_cnt1 = "";//고객자원수(브랜드구매고객)
var cust_cnt2 = "";//고객자원수(브랜드TOP 100고객)
var cust_cnt3 = "";//고객자원수(AI 추천 브랜드 잠재고객)
var cust_cnt4 = "";//고객자원수(AI 추천 경재브랜드 잠재고객)
	
var now_page = 1;

	
 
//화면 로드 시 실행
$(document).ready(function() {
  screenLog("조회", "web_brand_info_sub", "운영현황>브랜드등급현황",get_client_ip);//화면 로그(공통)
  
  ozController = new oz_frame();//ozController 정의
	ozController.Ctllist.push(new oz_ItemValue('com.obzen.bmp.ColCampEvent', 'grd_list'));//그리드 아이디 정의
  
	$("#search_all").css("cursor","pointer");
	$("#search_lv1").css("cursor","pointer");
	$("#search_lv2").css("cursor","pointer");
	$("#search_lv3").css("cursor","pointer");
	$("#search_lv4").css("cursor","pointer");
	$("#search_lv5").css("cursor","pointer");
	
	$("#"+search_id).addClass("on");
	brandInfoList();
	searchClickEvent();
});


/**========================================================================================
* 검색 클릭 이벤트
========================================================================================*/
function searchClickEvent(){
	
	if(sel_cd1 == ""){return;}
	//if(sel_cd2 == ""){return;}
	//if(sel_cd3 == ""){return;}
	if(base_ym == ""){return;}
	
	$("#search_all").click(function(e) {
		if(!$(this).hasClass("on")){
			$(this).addClass("on");
			$("#search_lv1").removeClass("on");
			$("#search_lv2").removeClass("on");
			$("#search_lv3").removeClass("on");
			$("#search_lv4").removeClass("on");
			$("#search_lv5").removeClass("on");
			search_id = "search_all";
			md_lvl_cd = "";
			do_RefreshPage("search");
		}
	});
	
	
	$("#search_lv1").click(function(e) {
		if(!$(this).hasClass("on")){
			$(this).addClass("on");
			$("#search_all").removeClass("on");
			$("#search_lv2").removeClass("on");
			$("#search_lv3").removeClass("on");
			$("#search_lv4").removeClass("on");
			$("#search_lv5").removeClass("on");
			search_id = "search_lv1";
			md_lvl_cd = "10";
			do_RefreshPage("search");
		}
	});
	
	$("#search_lv2").click(function(e) {
		if(!$(this).hasClass("on")){
			$(this).addClass("on");
			$("#search_all").removeClass("on");
			$("#search_lv1").removeClass("on");
			$("#search_lv3").removeClass("on");
			$("#search_lv4").removeClass("on");
			$("#search_lv5").removeClass("on");
			search_id = "search_lv2";
			md_lvl_cd = "20";
			do_RefreshPage("search");
		}
	});
	
	$("#search_lv3").click(function(e) {
		if(!$(this).hasClass("on")){
			$(this).addClass("on");
			$("#search_all").removeClass("on");
			$("#search_lv1").removeClass("on");
			$("#search_lv2").removeClass("on");
			$("#search_lv4").removeClass("on");
			$("#search_lv5").removeClass("on");
			search_id = "search_lv3";
			md_lvl_cd = "30";
			do_RefreshPage("search");
		}
	});
	
	$("#search_lv4").click(function(e) {
		if(!$(this).hasClass("on")){
			$(this).addClass("on");
			$("#search_all").removeClass("on");
			$("#search_lv1").removeClass("on");
			$("#search_lv2").removeClass("on");
			$("#search_lv3").removeClass("on");
			$("#search_lv5").removeClass("on");
			search_id = "search_lv4";
			md_lvl_cd = "40";
			do_RefreshPage("search");
		}
	});
	
	$("#search_lv5").click(function(e) {
		if(!$(this).hasClass("on")){
			$(this).addClass("on");
			$("#search_lv1").addClass("on");
			$("#search_lv1").removeClass("on");
			$("#search_lv2").removeClass("on");
			$("#search_lv3").removeClass("on");
			$("#search_lv4").removeClass("on");
			search_id = "search_lv5";
			md_lvl_cd = "50";
			do_RefreshPage("search");
		}
	});
}



/**========================================================================================
* 브랜드 현황 조회(캠페인DB)
========================================================================================*/
var brandInfoTm_json = "";
var col_check = "N";
function brandInfoList(){
	
	//브랜드현황조회(캠페인DB) TM
	var brandInfoTm = new oza_TMHandler('com.obzen.bmpanly.ColManageCond', tm_sub_method1, '0', '\@#%');
	brandInfoTm.setAddDataField(tm1_setCol, sel_cd1);
	brandInfoTm.setAddDataField(tm2_setCol, sel_cd2);
	brandInfoTm.setAddDataField(tm3_setCol, sel_cd3);
	brandInfoTm.setAddDataField('BASE_YM', base_ym);
	brandInfoTm.setAddDataField('MD_LVL_CD', md_lvl_cd);//1:10, 2:20, 3:30, 4:40, 5:50
	brandInfoTm.execute(null, false);
	var brandInfoTmResult = brandInfoTm.getResult();
	if(brandInfoTmResult != ""){brandInfoTm_json = JSON.parse(brandInfoTmResult);}
	brandInfoTm.clear();

	/*
	brandInfoTm_json = [
		{ 
    		ORDER: "1",
    		MD_NM:"MD명칭",
    		MD_LVL_NM : "LEVEL1",
    		STORE_LVL_CD : "C",
    		MD_LVL_SCORE : "234",
    		CUST_CNT5 : "324",
    		CUST_CNT6 : "324",
    		SUM_CUST_CNT : "324",
    		CUST_CNT : "324",
    		RST_CUST_CNT :"43534543",
    		NEW_CUST_CNT :"43534543",
    		SLAE_AMT :"43534344543",
    		CAMP_CNT :"43534543",
    		COST_AMT :"43536784543",
    		LMS_YN :"★",
    		MMS_YN :"★",
    		EDM_YN :"★",
    		OFFER1 : "★",
    		OFFER2 : "★",
    		OFFER3 : "★",
    		OFFER4 : "★",
    		OFFER5 : "★",
    		OFFER6 : "★",
    		OFFER7 : "★",
    		CUST_CNT1 : "100",
    		CUST_CNT2 : "200",
    		CUST_CNT3 : "300",
    		CUST_CNT4 : "500",
    		MD_LVL_CD : "10",
    		MD_CD : "C"
  		}
		];
	*/
	
	
	totalData = brandInfoTm_json.length;
	
	if(brandInfoTm_json != ""){
		//값 세팅
		for(var i=0; i<brandInfoTm_json.length; i++) {
			brandInfoTm_json[i].SLAE_AMT =	String(parseInt(parseInt(isNullZero(brandInfoTm_json[i].SLAE_AMT))/division_value2));//매출액
			brandInfoTm_json[i].COST_AMT =	String(parseInt(parseInt(isNullZero(brandInfoTm_json[i].COST_AMT))/division_value2));//비용
		}	
	}
	
	
	var gridColumn= [
		{binding: 'ORDER', header: '순위', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '',  visible : true, allowMerging : false, align : 'center'},  
		{binding: 'MD_NM', header: 'MD명', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'left'},    
    {binding: 'MD_LVL_NM', header: 'MD등급', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
    {binding: 'STORE_LVL_CD', header: '점포등급', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false, align : 'center'},
    {binding: 'MD_LVL_SCORE', header: '점수', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false, align : 'center'},
    //{binding: 'CUST_CNT5', header: '접근가능고객수(브랜드등급)', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false, align : 'center'},
    {binding: 'CUST_CNT6', header: '접근가능고객수', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false, align : 'center'},
    {binding: 'SUM_CUST_CNT', header: '보유고객수(합산)', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false, align : 'center'},
    {binding: 'CUST_CNT1', header: '구매고객', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false,align:'center'},
    {binding: 'CUST_CNT2', header: '매출상위100', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false,align:'center'},
    {binding: 'CUST_CNT3', header: 'AI브랜드추천', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false,align:'center'},
    {binding: 'CUST_CNT4', header: 'AI장르추천', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false,align:'center'},
    {binding: 'OFFER1', header: '정률할인쿠폰', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false,align:'center'},
    {binding: 'OFFER2', header: '정액할인쿠폰', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false,align:'center'},
    {binding: 'OFFER3', header: '사은행사', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false,align:'center'},
    {binding: 'OFFER4', header: '세일리지', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false,align:'center'},
    {binding: 'OFFER5', header: '마일리지', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false,align:'center'},
    {binding: 'OFFER6', header: '멤버스바', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false,align:'center'},
    {binding: 'OFFER7', header: '주차권', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false,align:'center'},
    {binding: 'LMS_YN', header: 'LMS', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : '', visible : true, allowMerging : false, align : 'center'},
    {binding: 'MMS_YN', header: 'MMS', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : '', visible : true, allowMerging : false, align : 'center'},
    {binding: 'EDM_YN', header: 'EDM', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false,align:'center'},
    {binding: 'CUST_CNT', header: '접근고객', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false, align : 'center'},
    {binding: 'RST_CUST_CNT', header: '응답고객', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false, align : 'center'},
    {binding: 'NEW_CUST_CNT', header: '신규고객', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false, align : 'center'},
    {binding: 'SLAE_AMT', header: '매출액(백만)', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false, align : 'center'},
    {binding: 'CAMP_CNT', header: '행사횟수', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false, align : 'center'},
    {binding: 'COST_AMT', header: '비용(백만)', name : '', isReadOnly : true, dataType : wijmo.DataType.Number, format : '#,##0', visible : true, allowMerging : false, align : 'center'},
    {binding: 'MD_LVL_CD', header: 'MD_LVL_CD', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : false, allowMerging : false,align:'center'},
    {binding: 'MD_CD', header: 'MD_CD', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : false, allowMerging : false,align:'center'}
	];

	var grdTableColinitinfo = {
		autoGenerateColumns: false,
		columns: gridColumn,
		frozenColumns: 3,//컬럼 고정
		selectionChanged: function (s, e) {
			var col = s.columns[e.col];
	    
			if (col.binding == "MD_NM"){
				col_check = "Y";	
			}else{
				col_check = "N";
			}
		},
		formatItem: function (s, e) {//grid 셀에 이미지 태그 추가 
			
		//헤더 색깔구분
	if(e.panel.cellType == wijmo.grid.CellType.ColumnHeader){
			wijmo.addClass(e.cell, 'head_bg');	
	}else{
		wijmo.addClass(e.cell,'td');
		//wijmo.setCss(e.cell, {cursor:'pointer'});
		//$(".wj-flexgrid .wj-cell").css("border-right","0px");//줄 안보이게 하기
	}
	
		
		//프로모션 이미지 설정
	  if (e.panel == s.cells) {
		  
  	var item = s.rows[e.row].dataItem;
  	var col = s.columns[e.col];
  
  	if (col.binding == "MD_NM"){
  		wijmo.setCss(e.cell, {cursor:'pointer'});
  	}
  	
  	
  	if (col.binding == "MD_LVL_NM"){
  		var vnow = s.getCellData(e.row, 27);//MD_LVL_CD

  		if(vnow == "10"){
  			e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/level1.png\' width=\'67\' height=\'30\'></div>';
  		}else if(vnow == "20"){
  			e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/level2.png\' width=\'67\' height=\'30\'></div>';
  		}else if(vnow == "30"){
  			e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/level3.png\' width=\'67\' height=\'30\'></div>';
  		}else if(vnow == "40"){
  			e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/level4.png\' width=\'67\' height=\'30\'></div>';
  		}else if(vnow == "50"){
  			e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/level5.png\' width=\'67\' height=\'30\'></div>';
  		}
  	}
  	
  	
  	
  	if (col.binding == "STORE_LVL_CD"){
  		var vnow = s.getCellData(e.row, e.col);
  		if(vnow == "A"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/s_rating1ss.png\' width=\'26\' height=\'30\'></div>';}
  		if(vnow == "B"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/s_rating2ss.png\' width=\'26\' height=\'30\'></div>';}
  		if(vnow == "C"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/s_rating3ss.png\' width=\'26\' height=\'30\'></div>';}
  		if(vnow == "D"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/s_rating4ss.png\' width=\'26\' height=\'30\'></div>';}
  		//if(vnow == "E"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/s_rating5ss.png\' width=\'26\' height=\'30\'></div>';}
  		if(vnow == "E"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/s_rating6ss.png\' width=\'26\' height=\'30\'></div>';}
  	}
  	
  	/*
  	if (col.binding == "SUM_CUST_CNT"){
  		var vnow = s.getCellData(e.row, e.col);
  		wijmo.setCss(e.cell, {color:'#000000'});
  		wijmo.setCss(e.cell, {fontWeight:'bold'});
  	}
  	*/
  	
  	if (col.binding == "LMS_YN"){
  		var vnow = s.getCellData(e.row, e.col);
  		if(vnow == "★"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/ic_star.png\' width=\'12\' height=\'13\'></div>';}else{e.cell.innerHTML = '';}
  	}
  	
  	if (col.binding == "MMS_YN"){
  		var vnow = s.getCellData(e.row, e.col);
  		if(vnow == "★"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/ic_star.png\' width=\'12\' height=\'13\'></div>';}else{e.cell.innerHTML = '';}
  	}
  	
  	if (col.binding == "EDM_YN"){
  		var vnow = s.getCellData(e.row, e.col);
  		if(vnow == "★"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/ic_star.png\' width=\'12\' height=\'13\'></div>';}else{e.cell.innerHTML = '';}
  	}
  	
  	
  	if (col.binding == "OFFER1"){
  		var vnow = s.getCellData(e.row, e.col);
  		if(vnow == "★"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/ic_star.png\' width=\'12\' height=\'13\'></div>';}else{e.cell.innerHTML = '';}
  	}
  	
  	if (col.binding == "OFFER2"){
  		var vnow = s.getCellData(e.row, e.col);
  		if(vnow == "★"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/ic_star.png\' width=\'12\' height=\'13\'></div>';}else{e.cell.innerHTML = '';}
  	}
  	
  	if (col.binding == "OFFER3"){
  		var vnow = s.getCellData(e.row, e.col);
  		if(vnow == "★"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/ic_star.png\' width=\'12\' height=\'13\'></div>';}else{e.cell.innerHTML = '';}
  	}
  	
  	if (col.binding == "OFFER4"){
  		var vnow = s.getCellData(e.row, e.col);
  		if(vnow == "★"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/ic_star.png\' width=\'12\' height=\'13\'></div>';}else{e.cell.innerHTML = '';}
  	}
  	
  	if (col.binding == "OFFER5"){
  		var vnow = s.getCellData(e.row, e.col);
  		if(vnow == "★"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/ic_star.png\' width=\'12\' height=\'13\'></div>';}else{e.cell.innerHTML = '';}
  	}
  	
  	if (col.binding == "OFFER6"){
  		var vnow = s.getCellData(e.row, e.col);
  		if(vnow == "★"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/ic_star.png\' width=\'12\' height=\'13\'></div>';}else{e.cell.innerHTML = '';}
  	}
  	
  	if (col.binding == "OFFER7"){
  		var vnow = s.getCellData(e.row, e.col);
  		if(vnow == "★"){e.cell.innerHTML = '<div class="ta_c"><image src=\'../../img/web/icon/ic_star.png\' width=\'12\' height=\'13\'></div>';}else{e.cell.innerHTML = '';}
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
	ctlInst.addEventListener("onClick",grdDetail);//Click 이벤트
	ctlInst.addEventListener("onSortedColumn",sortColumn);//정렬 이벤트
	ctlInst.selectionMode = wijmo.grid.SelectionMode.None;
	ctlInst.applySettings();
	ozController.registerControl(ctlInst, 'grd_list', true, true);
	
	
	//데이터 조회
	getCtl('grd_list').setItemsSource(brandInfoTm_json,dataPerPage);
	
	
	
	setGridColWidth();//컬럼 넓이
	setGridRowHeight();//로우 높이
	
	
	/**========================================================================================
  * 그리드 페이징
  ========================================================================================*/
	var curr =(view.pageIndex + 1);
	
	
	if(totalData == 0){
		$("#paging_area").css("display","none");
		$("#dowonload_button").css("display","none");
		
	}else{
		gridPaging(curr);	
		$("#paging_area").css("display","");
		$("#dowonload_button").css("display","");
	}
	
	
	
  
  function gridPaging(currentPage){
	  now_page = currentPage;
	  setGridRowHeight();
	  
		var html = ""; 
		
	 	totalPage = Math.ceil(totalData/dataPerPage);    // 총 페이지 수
   	pageGroup = Math.ceil(currentPage/pageCount);    // 페이지 그룹
   
    last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
   	
   	if(last > totalPage){last = totalPage;}
   	
    //console.log("(last%10)="+(last%10));
    
    
    if((last%pageCount) > 0){
    	first = parseInt(last) - (last%pageCount)+1;
    }else{
    	first = parseInt(last) - parseInt(pageCount-1);
    }
    
    
    if(first < 1) first = 1;
   	next = parseInt(last)+1;
   	prev = parseInt(first)-1;
	  
	  
		for(var i=first; i <= last; i++){
				html += "<li id=page_" + i + "><a href=\"#\"  id="+i+">" + i + "</a></li>";
	  }
		
		
		/*
		console.log("========================================");
		console.log("totalData="+totalData);
		console.log("dataPerPage="+dataPerPage);
		console.log("currentPage="+currentPage);
		console.log("pageCount="+pageCount);
		console.log("totalPage="+totalPage);
		console.log("pageGroup="+pageGroup);
		console.log("last="+last);
		console.log("first="+first);
		console.log("next="+next);
		console.log("prev="+prev);
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
	    //console.log("selectedPage 페이지prev="+selectedPage);
	    view.moveToPage(parseInt(selectedPage)-1);
	    
	    
	    $("#paging li").removeClass("on"); //Remove any "active" class
	  
	  	gridPaging(selectedPage);
	    
			return false;
	  });
  }
  
  
	
  
	//이전 페이지로 이동
  $("#pagePrev").click(function() {
	  //console.log("이전 페이지prev="+prev);
  	if(prev == 0){return false;}
  	//view.moveToPreviousPage();
  	view.moveToPage(prev-1);
  	gridPaging(prev);
  	
  	return false;
  });
  

	//다음 페이지로 이동
  $("#pageNext").click(function() {
	  //console.log("다음 페이지next="+next);
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
* 정렬 후 이벤트 
========================================================================================*/
function sortColumn(){
	setGridRowHeight();
}



/**========================================================================================
* 컬럼 넓이 지정 
* oz.grid.js 참조
========================================================================================*/
function setGridColWidth() {
	getCtl('grd_list').setColWidthPx(0, 40);//순위
	getCtl('grd_list').setColWidthPx(1, 100);//MD명
	getCtl('grd_list').setColWidthPx(2, 100);//MD등급
	
	for(var i = 3; i <= 27 ; i++){
		
		if(i == 5 || i == 6 || i == 7){
			getCtl('grd_list').setColWidthPx(i, 150);
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
* ozController 컨트롤 가져오기
========================================================================================*/
function getCtl(id) {
	return ozController.getControl(id);
}



/**========================================================================================
* 등급 상세보기
========================================================================================*/
var det_md_cd = "";

function grdDetail(){
	var innerHtml = "";
	
	if(col_check == "N"){return;}
	
	det_md_cd = getCtl('grd_list').getDataSourceValue('MD_CD');
	
	//MD별 점포 조회
	var storeLvlTm = new oza_TMHandler('com.obzen.bmpanly.ColManageCond', 'selectStoreLvl', '0', '\@#%');
	storeLvlTm.setAddDataField('MD_CD', det_md_cd);
	storeLvlTm.setAddDataField('BASE_YM', base_ym);
	storeLvlTm.execute(null, false);
	var storeLvlTmResult = storeLvlTm.getResult();
	var storeLvlTm_json = "";
	if(storeLvlTmResult != ""){storeLvlTm_json = JSON.parse(storeLvlTmResult);}
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
	
	layerPopOpen("layer_srating");
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
 * Excel 다운로드
 ========================================================================================*/
function excelDownload(){
	
	//TM Start =================================================================================================
	var excelTm = new oza_TMHandler('com.obzen.bmpanly.DocManageCond', tm_excel_method, '1', '\@#%');
	excelTm.setAddDataField('BASE_YM', base_ym);
	excelTm.setAddDataField(tm1_setCol, sel_cd1);
	excelTm.setAddDataField(tm2_setCol, sel_cd2);
	excelTm.setAddDataField(tm3_setCol, sel_cd3);
 excelTm.setAddDataField('MD_LVL_CD', md_lvl_cd);//1:10, 2:20, 3:30, 4:40, 5:50
	excelTm.returnlist('SERVER_FILE_PATH;FILENM');
	excelTm.execute(null, false);
	var file_path = excelTm.ElementValue('SERVER_FILE_PATH');//파일 경로
	var file_name = excelTm.ElementValue('FILENM');//파일 명
 excelTm.clear();
	
	screenLog("다운로드", "web_brand_info_sub", "운영현황>브랜드등급현황",get_client_ip);//화면 로그(공통)
	//TM End ===================================================================================================
	
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

</script>
<form name="excel_form" id="excel_form" method="post" target="_blank">
<input type="hidden" name="file_path" id="file_path" />
<input type="hidden" name="file_name" id="file_name" />
</form>

<div class="brandState_wrap">
    <div class="brandState_cnt">
      <p class="tit">브랜드 현황</p>
      <ul class="state_tab">
        <li id="search_all">전체</li>
        <li id="search_lv5">LEVEL5</li>
        <li id="search_lv4">LEVEL4</li>
        <li id="search_lv3">LEVEL3</li>
        <li id="search_lv2">LEVEL2</li>
        <li id="search_lv1">LEVEL1</li>
      </ul>
      <div class="grid_area" id="grid_list">
      </div>
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

<div id="layer_srating" class="layer">
  <p class="tit">점포등급<a href="javascript:popupClose('layer_srating');" class="btn_close">닫기</a></p>
  <ul id="store_list"></ul>
  <div class="pop_btn">
    <a href="javascript:popupClose('layer_srating');" class="btn_cancel">닫기</a>
  </div>
</div>