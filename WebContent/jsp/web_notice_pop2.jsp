<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>공지사항</title>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->
<script type="text/javascript">

var ozController;
var store_cd = "";


//화면 로드 시 실행
$(document).ready(function() {
	screenLog("조회", "web_notice_pop2", "공지사항(팝업)",get_client_ip);//화면 로그(공통)
	
	ozController = new oz_frame();//ozController 정의
	ozController.Ctllist.push(new oz_ItemValue('com.obzen.bmp.DocBMPBoard', 'grd_notice'));//그리드 아이디 정의
	
	store_cd = sessionStorage.getItem("STORE_CD");
	
	notice();
	noticeDetail();
	
});


/**========================================================================================
* 공지사항
========================================================================================*/
var board_id = "";
var listTmResult_json = "";
function notice(){

	var listTm = new oza_TMHandler('com.obzen.bmp.ColBMPBoard', 'selectBoardList', '0', '\@#%');
  listTm.setAddDataField('STORE_CD', store_cd);
  listTm.execute(null, false);
	var listTmResult = listTm.getResult();
  if(listTmResult != ""){listTmResult_json = JSON.parse(listTmResult);}
  listTm.clear();
	
  var gridCampInfocolinfo = [ 
		{header : '점포', binding: 'STORE_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
		{header : '제목', binding: 'BOARD_TTL', align : 'left', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, width: '*',allowMerging : false}, 
  	{header : '작성자', binding: 'CRAT_EMP_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
  	{header : '등록일자', binding: 'CRAT_DT', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : 'yyyy-MM-dd',visible : true,  allowMerging : false},
  	{header : '점포코드', binding: 'STORE_CD', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : '', visible : false, allowMerging : false},
  	{header : '공지사항ID', binding: 'BOARD_ID', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : '', visible : false,allowMerging : false}
	];


	var gridCampInfoinitinfo = {
		autoGenerateColumns: false,
		columns: gridCampInfocolinfo,
		formatItem: function (s, e) {//grid 셀에 이미지 태그 추가 
		  //헤더 색깔구분
  	if(e.panel.cellType == wijmo.grid.CellType.ColumnHeader){
  			wijmo.addClass(e.cell, 'head_bg');	
  	}else{
  		wijmo.setCss(e.cell, {cursor:'pointer'});
  	}
		}
	};
	
	ctlInst = new oz_grid('#notice_list');
	ozgrid_instMgr.add(ctlInst);
	ctlInst.initialize(gridCampInfoinitinfo);
	//ctlInst.selectionHeader = '선택';
	ctlInst.disableAllChecked = false;
	ctlInst.dateDelimiter = '';
	ctlInst.delimiter = ';';
	ctlInst.exportDelimiter = ';';
	ctlInst.showRadioButton = false;
	ctlInst.indexColumnVisible = true;
	ctlInst.selectionMode = wijmo.grid.SelectionMode.None;
	ctlInst.addEventListener("onClick",noticeDetail);//Click 이벤트 
	ctlInst.applySettings();
	ozController.registerControl(ctlInst, 'grd_notice', true, true);
  
  getCtl('grd_notice').setItemsSource(listTmResult_json);
}





/**========================================================================================
* ozController 컨트롤 가져오기
========================================================================================*/
function getCtl(id) {
	return ozController.getControl(id);
}

/**========================================================================================
* 공지사항 상세보기
========================================================================================*/
var det_store_cd = "";
var det_store_nm = "";
var det_board_ttl = "";
var det_board_cont = "";
var det_crat_emp_nm = "";
var det_crat_dt = "";

function noticeDetail(){
	board_id = getCtl('grd_notice').getDataSourceValue('BOARD_ID');
	
	var boardInfoTm = new oza_TMHandler('com.obzen.bmp.DocBMPBoard', 'selectBoardInfo', '1', '\@#%');
	boardInfoTm.setAddDataField('BOARD_ID', board_id);
	boardInfoTm.returnlist('STORE_CD'+
	                  		 ';STORE_NM'+
	                  		 ';BOARD_TTL'+
	                  		 ';BOARD_CONT'+
	                  		 ';CRAT_EMP_NM'+
	                  		 ';CRAT_DT');
	boardInfoTm.execute(null, false);
	det_store_cd = boardInfoTm.ElementValue('STORE_CD');
	det_store_nm = boardInfoTm.ElementValue('STORE_NM');
	det_board_ttl = boardInfoTm.ElementValue('BOARD_TTL');
	det_board_cont = boardInfoTm.ElementValue('BOARD_CONT');
	det_crat_emp_nm = boardInfoTm.ElementValue('CRAT_EMP_NM');
	det_crat_dt = boardInfoTm.ElementValue('CRAT_DT');
	boardInfoTm.clear();
	
	$("#det_store_nm").text(det_store_nm);
	$("#det_board_ttl").text(det_board_ttl);
	$("#det_crat_emp_nm").text(det_crat_emp_nm);
	$("#det_crat_dt").text(setValidDate(det_crat_dt));
	$("#det_board_cont").html(det_board_cont.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
	
	//layerPopOpen("layer_noticeDetail");
}



/*===============================================================
팝업 Close
===============================================================*/
function popupClose(popupN) {
	window.close();
}

</script>
</head>


<body>
    <div id="layer_noticeView" class="layer_window">
      <p class="tit">공지사항<a href="javascript:popupClose();" class="btn_close">닫기</a></p>
      <div class="detail_cnt">
      <div class="notice_list" id="notice_list"></div>
      <ul>
        <li class="wd30">
          <span>점포</span>
          <p id="det_store_nm"></p>
        </li>
        <li class="wd30">
          <span>작성일</span>
          <p id="det_crat_dt"></p>
        </li>
        <li class="wd30">
          <span>작성자</span>
          <p id="det_crat_emp_nm"></p>
        </li>
        <li>
          <span>제목</span>
          <p id="det_board_ttl"></p>
        </li>
        <li class="bor0">
          <span>내용</span>
          <div id="det_board_cont"></div>
        </li>
      </ul>
      </div>
      <div class="pop_btn">
        <a href="javascript:popupClose();" class="btn_cancel">닫기</a>
      </div>
    </div>
  </body>
</html>




