<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<!DOCTYPE html>
<html lang="ko">
 <head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <link rel="stylesheet" href="css/style.css">
  <title>MD 검색</title>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->
<%
String md_cd = XSScheck(request.getParameter("md_cd"));
String user_id = XSScheck(request.getParameter("user_id"));
%>
 <script type="text/javascript">

 var s_store_cd = "";
 var s_md_nm = ""; 
 
 var md_cd = "";
 var user_id = "";
 var ozController;


 
 
//화면 로드 시 실행
 $(document).ready(function() {
	 
	 screenLog("조회", "web_brandprofile_pop", "MD 검색",get_client_ip);//화면 로그(공통)
	 
	 ozController = new oz_frame();//ozController 정의
	 ozController.Ctllist.push(new oz_ItemValue('com.obzen.bmpanly.ColCommMng', 'selectMdList'));//그리드 아이디 정의
	 
	 //md_cd = "<%=md_cd%>";
	 //user_id = "<%=user_id%>";
	 
	 md_cd = $(opener.document).find("#md_cd").val();
	 user_id = $(opener.document).find("#user_id").val();
	
	 selectBoxDesign();
	 
	 //$("#s_store_cd option:eq(1)").attr("selected","selected");
	 //s_store_cd = $("#sel_store_cd option:selected").val();
		
	 searchGrid();//검색 목록 조회 및 그리드 생성
	 
	 
	 
});

 /**========================================================================================
 * 지점명 선택 박스 그리기
 ========================================================================================*/
 function selectBoxDesign(){
 	var selectBox = "";
 	var i = 0;
 	
 	
 	//점포
 	var storeTm = new oza_TMHandler('com.obzen.bmp.ColBMPComm', 'selectStoreDW', '0', '\@#%');
 	//storeTm.setAddDataField('MD_CD', md_cd);
 	storeTm.setAddDataField('USERID', user_id);
 	storeTm.execute(null, false);
 	var storeTmResult = storeTm.getResult();
 	var storeTmResult_json = "";
 	if(storeTmResult != ""){
 		storeTmResult_json = JSON.parse(storeTmResult);
 	}
 	storeTm.clear();
 	
 	
 	selectBox += "<option value=''>::선택::</option>";
 	
 	for(i=0; i<storeTmResult_json.length; i++) {
 		selectBox += "<option value='"+storeTmResult_json[i].ITEM_CD+"'>"+storeTmResult_json[i].ITEM_NM+"</option>";
 	}
 	
 	$("#s_store_cd").html(selectBox);
 }


/*=======================================================
그리드
=======================================================*/
var tmResult_json = "";
function searchGrid() {
	
	s_store_cd = $("#s_store_cd option:selected").val();
  s_md_nm = $("#s_md_nm").val();

  var gridCampInfocolinfo = [ 
  	{header : 'MD코드', binding: 'MD_CD', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
  	{header : 'MD명', binding: 'MD_NM', align : 'left', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, width:'*', allowMerging : false}, 
  	{header : '점포', binding: 'STORE_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : '팀', binding: 'TEAM_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : '층', binding: 'FLOOR_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : 'PC', binding: 'PC_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : '코너', binding: 'CRNR_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : 'STORE_CD', binding: 'STORE_CD', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : false, allowMerging : false},
  	{header : 'TEAM_CD', binding: 'TEAM_CD', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : false, allowMerging : false},
  	{header : 'FLOOR_CD', binding: 'FLOOR_CD', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : false, allowMerging : false},
  	{header : 'PC_CD', binding: 'PC_CD', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : false, allowMerging : false},
  	{header : 'CRNR_CD', binding: 'CRNR_CD', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : false, allowMerging : false}
  ];
  
    
  var gridCampInfoinitinfo = {
  	autoGenerateColumns: false,
  	columns: gridCampInfocolinfo,
  	formatItem: function (s, e) {//grid 셀에 이미지 태그 추가 
  		
  		//헤더 색깔구분
  		if(e.panel.cellType == wijmo.grid.CellType.ColumnHeader){
  			wijmo.addClass(e.cell, 'head_bg');	
  	  }
  	}
  };
  
  ctlInst = new oz_grid('#grd_list');
  ozgrid_instMgr.add(ctlInst);
  ctlInst.initialize(gridCampInfoinitinfo);
  ctlInst.selectionHeader = '선택';
  ctlInst.disableAllChecked = false;
  ctlInst.dateDelimiter = '';
  ctlInst.delimiter = ';';
  ctlInst.exportDelimiter = ';';
  ctlInst.showRadioButton = true;
  ctlInst.indexColumnVisible = true;
  ctlInst.selectionMode = wijmo.grid.SelectionMode.Row;
  ctlInst.applySettings();
  ozController.registerControl(ctlInst, 'grd_list', true, true);
  
  //데이터 조회
	getCtl('grd_list').setItemsSource(tmResult_json);
  
  ctlInst.setItemsSource(tmResult_json);
  setGridColWidth();//컬럼 넓이
  //그리드 End-------------------------------------------------------------------------------------------------
  
  
  //조회 클릭 시
  $('#search_grid').click(function() {
	  s_store_cd = $("#s_store_cd option:selected").val();
    s_md_nm = $("#s_md_nm").val();
 
    if(s_md_nm == ""){cmdMessage(2,"MD명");$("#s_md_nm").focus();return;}
    //if(s_store_cd == ""){cmdMessage(3,"점포");$("#s_store_cd").focus();return;}
    
    var tmList = new oza_TMHandler('com.obzen.bmpanly.ColCommMng', 'selectMdList', '0', '\@#%');
    tmList.setAddDataField('STORE_CD', s_store_cd);
    tmList.setAddDataField('MD_NM', s_md_nm);
    tmList.execute(null, false);
    var tmResult = tmList.getResult();
    if(tmResult != ""){tmResult_json = JSON.parse(tmResult);}
    tmList.clear();
    
    //데이터 조회
	  getCtl('grd_list').setItemsSource(tmResult_json);
    
	  setGridColWidth();
  });
}


/**========================================================================================
* ozController 컨트롤 가져오기
========================================================================================*/
function getCtl(id) {
	return ozController.getControl(id);
}


/**========================================================================================
* 컬럼 넓이 지정 
* oz.grid.js 참조
========================================================================================*/
function setGridColWidth() {
	getCtl('grd_list').setColWidthPx(0, 50);//선택
	getCtl('grd_list').setColWidthPx(1, 70);//MD코드
	getCtl('grd_list').setColWidthPx(2, 140);//MD명
	getCtl('grd_list').setColWidthPx(3, 80);//점포
	getCtl('grd_list').setColWidthPx(4, 90);//팀
	getCtl('grd_list').setColWidthPx(5, 110);//층
	getCtl('grd_list').setColWidthPx(6, 100);//PC
	getCtl('grd_list').setColWidthPx(7, 100);//코너
}
 

/**========================================================================================
* 선택
========================================================================================*/
function selectMdCd() {

var pageParam = new Array(); //Parameters
pageParam.push(new oz_para('in', 'MD_CD', ctlInst.getDataSourceValue('MD_CD'), ''));
pageParam.push(new oz_para('in', 'STORE_CD', ctlInst.getDataSourceValue('STORE_CD'), ''));
pageParam.push(new oz_para('in', 'STORE_NM', ctlInst.getDataSourceValue('STORE_NM'), ''));
pageParam.push(new oz_para('in', 'MD_NM', ctlInst.getDataSourceValue('MD_NM'), ''));
pageParam.push(new oz_para('in', 'TEAM_CD', ctlInst.getDataSourceValue('TEAM_CD'), ''));
pageParam.push(new oz_para('in', 'FLOOR_CD', ctlInst.getDataSourceValue('FLOOR_CD'), ''));
pageParam.push(new oz_para('in', 'PC_CD', ctlInst.getDataSourceValue('PC_CD'), ''));
pageParam.push(new oz_para('in', 'CRNR_CD', ctlInst.getDataSourceValue('CRNR_CD'), ''));


window.opener.popupReturn(pageParam);
pageParam = null;

popupClose();
}  


 
 
/**========================================================================================
* 검색(팝업 닫기)
========================================================================================*/
function popupClose() {
	 window.opener.popupImageRemove();
	 window.close();
}





/**========================================================================================
* 검색
========================================================================================*/
function search() {
	searchList();//검색 목록 조회 및 그리드 생성
}


</script>
</head>
<body onbeforeunload="javascript:popupClose();">
  <div id="search_popup" class="layer_window">
    <p class="tit">MD 검색<a href="javascript:popupClose();" class="btn_close">닫기</a></p>
    <div class="search_top">
      <label>MD명</label>
      <input type="text" id="s_md_nm">
      <select id="s_store_cd">
      </select>
      <p id="search_grid" style="cursor:pointer;">조회</p>
    </div>
    <div class="search_grid">
      <div class="grid_area2"  id='grd_list'>
      </div>
    </div>
    <div class="pop_btn">
      <a href="javascript:selectMdCd();" class="btn_submit">선택</a>
      <a href="javascript:popupClose();" class="btn_cancel">닫기</a>
    </div>
   </div>
</body>
</html>
