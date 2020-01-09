<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>캠페인 검색</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->  
<%
String store_cd = XSScheck(request.getParameter("store_cd"));
String stnd_ym = XSScheck(request.getParameter("stnd_ym"));
%>



<script type="text/javascript">

 var user_id = "";
 var md_cd = "";
 var store_cd = "";
 var stnd_ym = "";
 
 var camp_id = "";
 var mod_yn = "";
 var reg_id = "";
 
//화면 로드 시 실행
$(document).ready(function() {
	 
	 //store_cd = "<%=store_cd%>";
	 //stnd_ym = "<%=stnd_ym%>";
	 
	 store_cd = $(opener.document).find("#store_cd").val();
	 stnd_ym = $(opener.document).find("#stnd_ym").val();
	 
	 console.log("store_cd="+store_cd);
	 console.log("stnd_ym="+stnd_ym);
	
	 searchGrid();//검색 목록 조회 및 그리드 생성
	 screenLog("조회", "web_brandnotice_sub_pop", "특이사항 목록 조회",get_client_ip);//화면 로그(공통)
});
 
 
 
 
 /*=======================================================
 그리드
 =======================================================*/
 function searchGrid() {
	var tmList = new oza_TMHandler('com.obzen.bmp.ColBMPBoard', 'selectSpecialListDetail', '0', '\@#%');
    tmList.setAddDataField('STORE_CD', store_cd);
    tmList.setAddDataField('STND_YM', stnd_ym);
    tmList.execute(null, false); //  tm 실행
    var tmResult = tmList.getResult(); //  컬렉션 TM 결과 호출
    var tmResult_json = "";
    if(tmResult != ""){tmResult_json = JSON.parse(tmResult);}
    tmList.clear();
    
    //Initialize grid
	var gridCampInfocolinfo = [ 
		{header : '점포명', binding: 'STORE_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
		{header : '제목', binding: 'TTL', align : 'left', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
  	{header : '내용', binding: 'SPCL_ATCL', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
  	{header : '게시시작일자', binding: 'NOTI_STR_DT', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : 'yyyy-MM-dd', visible : true,allowMerging : false},
  	{header : '게시종료일자', binding: 'NOTI_END_DT', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : 'yyyy-MM-dd', visible : true,allowMerging : false},
  	{header : '작성자', binding: 'CRAT_EMP_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : '등록일자', binding: 'CRAT_DT', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : 'yyyy-MM-dd', visible : true, allowMerging : false}
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
	
	ctlInst = new oz_grid('#grid_list');
	ozgrid_instMgr.add(ctlInst);
	ctlInst.initialize(gridCampInfoinitinfo);
	ctlInst.disableAllChecked = false;
	ctlInst.dateDelimiter = '';
	ctlInst.delimiter = ';';
	ctlInst.exportDelimiter = ';';
	ctlInst.showRadioButton = true;
	ctlInst.indexColumnVisible = true;
	ctlInst.applySettings();
	ctlInst.setItemsSource(tmResult_json);
	//그리드 End-------------------------------------------------------------------------------------------------
 }
 
 
 
 /**========================================================================================
  * 검색(팝업 닫기)
  ========================================================================================*/
 function popupClose() {
	 window.opener.popupImageRemove();
	 window.close();
	 
 }
 
 </script>
  
 </head>

 <body onbeforeunload="javascript:popupClose();">
   <div id="search_popup" class="layer_window">
    <p class="tit">특이사항 목록<a href="javascript:popupClose();" class="btn_close">닫기</a></p>
    <div class="search_grid">
      <div class="grid_area" id='grid_list'>
      </div>
    </div>
    <div class="pop_btn2">
      <a href="javascript:popupClose();" class="btn_cancel">닫기</a>
    </div>
  </div>
</body>
</html>
