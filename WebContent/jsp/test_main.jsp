<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.io.*, java.util.*, java.lang.*, java.net.*" %>


<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Test</title>
<style>

	table_test {font-family:"돋움", Dotum;}
	.table_test div{margin-top:100px}
  	.table_test h3{text-align:center;}
  	.table_test table{width:800px; margin:0 auto; border-top:1px solid #f8f8f8; border-right:1px solid #f8f8f8; border-spacing:0px;border-collapse:collapse;}
	.table_test table thead th{text-align:center; background:#ccc}
	.table_test table thead th, table tbody td{border-bottom:1px solid #f8f8f8; border-left:1px solid #f8f8f8; padding:5px;}
  
	#layer{width:600px; height:800px;}	
	.layerpop{display:none;cursor:move; background:#fff; border:2px solid #ccc; z-index:1000; position:relative;}
	.layerpop .tit{padding-left:10px;}
	.layerpop .close_btn{position:absolute; top:10px; right:10px; width:50px; height:50px; border:1px solid #000;}
	.layerpop .layer_cnt{padding:10px; }
</style>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->
<script>


$(document).ready(function() {
	
	
	//init();
	
	
	var test = null.length;
	var test2 = null.substring(0,3);
	
	
	//init2();
	
	//console.log("sub="+("20196".substring(5,1)));
	
	//spinStart();//로딩바
	//paging2(totalData, dataPerPage, pageCount, 1);
	
	
	
});




/*=======================================================
레이어 팝업 열기
=======================================================*/
function popupOpen() {
    
  //선택한 Tab Page로 이동  
	var param = "test=김태호&test1=1234";
  	$.ajax({
  		url : "web_test_layer_pop.jsp",
		data:param,
		type:"POST",
  		//dataType:"json"
		success:function(result) {
			$("#layer").html(result);//id가 tab_content에 내용을 보여줌
			
			//레이어 팝업 보여주기
			$('.layerpop').css("position", "absolute");
			$('.layerpop').css("top",(($(window).height() - $('.layerpop').outerHeight()) / 2) + $(window).scrollTop());
		    $('.layerpop').css("left",(($(window).width() - $('.layerpop').outerWidth()) / 2) + $(window).scrollLeft());
		    $('.layerpop').draggable();//팝업 이동
		    $('#layer').show();
  		},
  		error:function(request, status, error){
  			cmdMessage(0,"code : "+request.status+"\n"+"message : "+request.responseText+"\n"+"error:"+error);
		}
  	});
}


/*=======================================================
레이어 팝업 닫기
=======================================================*/
function popupClose() {
    $('#layer').hide();
    
    //var getVal = $("#layer").contents().find('#testValue').val();//하위 페이지의 id value 가져오기
    var getVal = $('#testValue').html();//팝업의 id가 testValue인 부분 가져오기  
}




/*=======================================================
엑셀 다운로드
=======================================================*/
function excel() {
	
	var excelHtml = "";
	
	excelHtml += "<html>";
	excelHtml += "<head>";
	excelHtml += "<meta charset=\"utf-8\" />";
	excelHtml += "<title> new document </title>";
	excelHtml += "<style>";
	excelHtml += ".table_test {font-family:\"돋움\", Dotum;}";
	excelHtml += ".table_test div{margin-top:100px}";
	excelHtml += ".table_test h3{text-align:center;}";
	excelHtml += ".table_test table{width:800px; margin:0 auto; border-top:1px solid #f8f8f8; border-right:1px solid #f8f8f8; border-spacing:0px;border-collapse:collapse;}";
	excelHtml += ".table_test table thead th{text-align:center; background:#ccc}";
	excelHtml += ".table_test table thead th, table tbody td{border-bottom:1px solid #f8f8f8; border-left:1px solid #f8f8f8; padding:5px;}";
	excelHtml += "</style>";
	excelHtml += "</head>";
	excelHtml += "<body>";
	excelHtml += $("#excel").html();
	excelHtml += "</body>";
	excelHtml += "</html>";
	
	$("#file_name").val("Excel_다운로드_Test");
	$("#excel_table").val(excelHtml);
	$("#excel_form").attr("action", "./common/excel_download.jsp");
	$("#excel_form").submit();
	//console.log(excelHtml);
}



/*=======================================================
엑셀 다운로드(poi)
=======================================================*/
function excel_poi() {
	$("#excel_form").attr("action", "./common/excel_download_poi.jsp");
	$("#excel_form").submit();
}



/*=======================================================
엑셀 다운로드(poi) 커스터마이징
=======================================================*/
function excel_poi2() {
	$("#excel_form").attr("action", "./common/excel_download_poi2.jsp");
	$("#excel_form").submit();
}



/*=======================================================
엑셀 다운로드(excellentexport.js)
=======================================================*/
function newApi(format) {
    return ExcellentExport.convert({
        anchor: 'anchorNewApi-' + format,
        filename: 'data_123.' + format,
        format: format
    }, [{
        name: 'Sheet Name Here 1',
        from: {
            table: 'excel'
        }
    }]);
}




/*=======================================================
그리드
=======================================================*/
var ctlInst;
var view;//페이징 데이터 변수
function init() {
    // create some random data
    var countries = 'US,Germany,UK,Japan,Italy,Greece'.split(',');
    var data = [];
    for (var i = 0; i < countries.length; i++) {
        data.push({
            id: i,
            country: countries[i],
            sales: Math.random() * 10000,
            expenses: Math.random() * 5000
        });
    }
    
  //그리드 Start-------------------------------------------------------------------------------------------------
    var grdTableColcolinfo = [ 
    	{header : 'Country', binding: 'country', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
    	{header : 'Sales', binding: 'sales', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
    	{header : 'Expenses', binding: 'expenses', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, width: '*', allowMerging : false}
  	];

  	
  	
    var mergedrow0 = [ 
    	{binding: 'country', caption: 'Country'}, 
      	{binding: 'sales', caption: '부가정보'}, 
      	{binding: 'expenses', caption: '부가정보'}
  	  
  	];

	var grdTableColinitinfo = {
		autoGenerateColumns: false,
		columns: grdTableColcolinfo,
		formatItem: function (s, e) {
        	//console.log("e.panel="+e.panel);
        	//console.log("s.cells="+s.cells);
        	
            if (e.panel == s.cells) {
            	var item = s.rows[e.row].dataItem;
            	var col = s.columns[e.col];
            	
            	
            	if (col.binding == "country"){
            		var vnow = s.getCellData(e.row, e.col);
            		//console.log("e.row="+e.row+" e.col="+(e.col)+" vnow="+vnow);
            		e.cell.innerHTML = '<div class="v-transform">' + e.cell.innerHTML + '<image src=\'../img/web/icon/ic_c4.png\' width=\'25\' height=\'25\'></div>';
            	}
            	
            	//console.log("e.cell.innerHTML="+e.cell.innerHTML);
            }
        }
	};
	
	ctlInst = new oz_grid('#theGrid');
	ozgrid_instMgr.add(ctlInst);
	ctlInst.initialize(grdTableColinitinfo);
	ctlInst.addMergedHeader(mergedrow0);
	ctlInst.selectionHeader = '';
	ctlInst.disableAllChecked = false;
	ctlInst.dateDelimiter = '';
	ctlInst.delimiter = ';';
	ctlInst.exportDelimiter = ';';
	ctlInst.showRadioButton = true;
	ctlInst.indexColumnVisible = false;
	ctlInst.selectionMode = wijmo.grid.SelectionMode.Row;
	ctlInst.applySettings();
	ctlInst.setItemsSource(data,4);//페이징 적용 4를 기준으로 페이징
 	
	//그리드 End-------------------------------------------------------------------------------------------------
	var curr =(view.pageIndex + 1)+" / "+view.pageCount;
    document.getElementById('spanCurrent').value = curr;

    //
    // show the data in a grid
    
    
    $("#btnFirst").click(function() {
    	view.moveToFirstPage();

    	curr =(view.pageIndex + 1)+" / "+view.pageCount;
        document.getElementById('spanCurrent').value = curr;
    });
    
    $("#btnPrev").click(function() {
    	view.moveToPreviousPage();
    	curr =(view.pageIndex + 1)+" / "+view.pageCount;
        document.getElementById('spanCurrent').value = curr;
    });
    
    $("#btnNext").click(function() {
    	view.moveToNextPage();
    	curr =(view.pageIndex + 1)+" / "+view.pageCount;
        document.getElementById('spanCurrent').value = curr;
    });
    
    $("#btnLast").click(function() {
    	view.moveToLastPage();
    	curr =(view.pageIndex + 1)+" / "+view.pageCount;
        document.getElementById('spanCurrent').value = curr;
    });
}


/*=======================================================
선택(그리드)
=======================================================*/
function selection(){
	var pageParam = new Array(); //Parameters
	pageParam.push(new oz_para('in', 'Country', ctlInst.getDataSourceValue('country'), ''));
	pageParam.push(new oz_para('in', 'Sales', ctlInst.getDataSourceValue('sales'), ''));
	pageParam.push(new oz_para('in', 'Expenses', ctlInst.getDataSourceValue('expenses'), ''));
	
	console.log(pageParam[0].value);
	console.log(pageParam[1].value);
	console.log(pageParam[2].value);
}





function init2() {
    //
    // create some random data
    var countries = 'US,Germany,UK,Japan,Italy,Greece'.split(',');
    var products = 'Piano,Violin,Flute,Guitar,Cello'.split(',');
    var data = [];
    for (var i = 0; i < 100; i++) {
        data.push({
            id: i,
            country: countries[i % countries.length],
            product: products[i % products.length],
            sales: Math.random() * 10000,
            expenses: Math.random() * 5000
        });
    }
    //
    // create a CollectionView with 20 items per page
    
    
    
    var gridColumn = [
            { binding: 'id', header: 'ID', width: 50, isReadOnly: true ,allowMerging: true},
            { binding: 'country', header: 'Country', isReadOnly: true },
            { binding: 'product', header: 'Product', isReadOnly: true },
            { binding: 'sales', header: 'Sales', isReadOnly: true },
            { binding: 'expenses', header: 'Expenses', isReadOnly: true }
        ];
    
    
    /*---------------------------------------------------------
    그리드 페이징
    
    데이터 재정의 후 페이지 사이즈 설정이 핵심
    1. 데이터 재정의 : var view = new wijmo.collections.CollectionView(data); 
    2. 페이지 사이즈 : view.pageSize = 6;
    
    
    view.pageIndex + 1 : 현재 페이지
    view.pageCount : 총 페이지
    view.moveToFirstPage(); 첫번째 페이지로 이동
    view.moveToPreviousPage(); 이전 페이지로 이동
    view.moveToNextPage(); 다음 페이지로 이동
    view.moveToLastPage(); 마지막 페이지로 이동
    ----------------------------------------------------------*/
    var view = new wijmo.collections.CollectionView(data);//데이터 재정의 
    view.pageSize = 6;//페이지 사이즈 
    var curr =(view.pageIndex + 1)+" / "+view.pageCount;
    document.getElementById('spanCurrent2').value = curr;

    //
    // show the data in a grid
    var flex = new wijmo.grid.FlexGrid('#theGrid2', {
    		allowMerging: 'ColumnHeaders',
        alternatingRowStep: 0,
        itemsSource: view,
        headersVisibility: 'Column',
        columns : gridColumn,
        formatItem: function (s, e) {
        	//console.log("e.panel="+e.panel);
        	//console.log("s.cells="+s.cells);
        	
            if (e.panel == s.cells) {
            	var item = s.rows[e.row].dataItem;
            	var col = s.columns[e.col];
            	
            	
            	if (col.binding == "country"){
            		var vnow = s.getCellData(e.row, e.col);
            		//console.log("e.row="+e.row+" e.col="+(e.col)+" vnow="+vnow);
            		e.cell.innerHTML = '<div class="v-transform">' + e.cell.innerHTML + '<image src=\'../img/web/icon/ic_c4.png\' width=\'25\' height=\'25\'></div>';
            	}
            	
            	//console.log("e.cell.innerHTML="+e.cell.innerHTML);
            }
        }
    });
    
    
    
  //create extra header row
  var extraRow = new wijmo.grid.Row();
  extraRow.allowMerging = true;
  
  // add extra header row to the grid
  var panel = flex.columnHeaders;
  panel.rows.splice(0, 0, extraRow);
  
  // populate the extra header row
  for (let colIndex = 1; colIndex <= 2; colIndex++) {
      panel.setCellData(0, colIndex, '행사기본정보');
  }


  //merge  headers vertically
  ['ID'].forEach(function (binding) {
      let col = flex.getColumn(binding);
      col.allowMerging = true;
      panel.setCellData(0, col.index, col.header);
  });
    
    
    $("#btnFirst2").click(function() {
    	view.moveToFirstPage();

    	curr =(view.pageIndex + 1)+" / "+view.pageCount;
        document.getElementById('spanCurrent2').value = curr;
    });
    
    $("#btnPrev2").click(function() {
    	
    	
    	view.moveToPreviousPage();
    	view.pageIndex = 5;
    	console.log("dsfsdf="+(view.pageIndex + 1));
    	curr =(view.pageIndex + 1)+" / "+view.pageCount;
        document.getElementById('spanCurrent2').value = curr;
    });
    
    $("#btnNext2").click(function() {
    	view.moveToNextPage();
    	curr =(view.pageIndex + 1)+" / "+view.pageCount;
        document.getElementById('spanCurrent2').value = curr;
    });
    
    $("#btnLast2").click(function() {
    	view.moveToLastPage();
    	curr =(view.pageIndex + 1)+" / "+view.pageCount;
        document.getElementById('spanCurrent2').value = curr;
    });
    
    
    
    //검색 필터 Start==================================================================================================================
    //필터 적용
    var filterValue = "";
    var filterValue2 = ""; 
    var oldVal = "";
    var oldVal2 = "";
    
    $("#filter").on("propertychange change keyup paste input", function() {
        var currentVal = $(this).val();
        if(currentVal == oldVal) {
            return;
        }
     
        oldVal = currentVal;
        
        
        flex.collectionView.filter = function (item) {
        	if(!flex){
        		return true;
        	}
        	
        	filterValue = currentVal.toLowerCase();
        	filterValue2 = $("#filter2").val().toLowerCase();
        	//console.log("filter="+item.country.toLowerCase()+"   flag="+(item.country.toLowerCase().indexOf(filterValue) > -1));
        	
        	
        	if(filterValue2 != ""){
        		if(item.country.toLowerCase().indexOf(filterValue) > -1 && item.product.toLowerCase().indexOf(filterValue2) > -1){
        			return true;//검색
        		}else{
        			return false;//제외
        		}
        	}else{
        		if(item.country.toLowerCase().indexOf(filterValue) > -1){
            		return true;//검색
            }else{
            		return false;//제외
            }
        	}
        };
        
        
        curr =(view.pageIndex + 1)+" / "+view.pageCount;
        document.getElementById('spanCurrent2').value = curr;
    });
    
    
    
    $("#filter2").on("propertychange change keyup paste input", function() {
        var currentVal = $(this).val();
        if(currentVal == oldVal2) {
            return;
        }
     
        oldVal2 = currentVal;
        
        
        flex.collectionView.filter = function (item) {
        	if(!flex){
        		return true;
        	}
        	
        	filterValue2 = currentVal.toLowerCase();
        	filterValue = $("#filter").val().toLowerCase();
        	//console.log("filter="+item.country.toLowerCase()+"   flag="+(item.country.toLowerCase().indexOf(filterValue) > -1));
        	
        	
        	if(filterValue != ""){
        		if(item.country.toLowerCase().indexOf(filterValue) > -1 && item.product.toLowerCase().indexOf(filterValue2) > -1){
        			return true;//검색
        		}else{
        			return false;//제외
        		}
        	}else{
        		if(item.product.toLowerCase().indexOf(filterValue2) > -1){
            		return true;//검색
            }else{
            		return false;//제외
            }
        	}
        };
        
        
        curr =(view.pageIndex + 1)+" / "+view.pageCount;
        document.getElementById('spanCurrent2').value = curr;
    });
    
  	//검색 필터 End==================================================================================================================
    
    
    
    
    
    
    
    
    /*
    document.getElementById('filter').addEventListener('input', function (e) {
        var filter = e.target.value.toLowerCase();
        console.log("filter="+filter);
        
        flex.collectionView.filter = function (item) {
        	return filter.length == 0 || item.country.toLowerCase().indexOf(filter) > -1;
        };
        
        curr =(view.pageIndex + 1)+" / "+view.pageCount;
        document.getElementById('spanCurrent2').value = curr;
    });
    
    
    document.getElementById('filter2').addEventListener('input', function (e) {
        var filter = e.target.value.toLowerCase();
        console.log("filter2="+filter);
        flex.collectionView.filter = function (item) {
        	return filter.length == 0 || item.product.toLowerCase().indexOf(filter) > -1;
        };
        
        curr =(view.pageIndex + 1)+" / "+view.pageCount;
        document.getElementById('spanCurrent2').value = curr;
    });
    */
}




/*===============================================================
html 카드 클릭
===============================================================*/
function calClick(cardNm, day){
	   alert("카드명 : "+cardNm+"   일자 : "+day);
	   
	   
	   var param = cardNm+":"+day;
	   
	   location.href = "cal_top_receive.html?"+encodeURI(param);
	}

 /*=======================================================
 html 값 받기
 =======================================================*
 function selection(){
	 temp = location.href.split("?");
	 data=decodeURI(temp[1]).split(":");
	 cardNm = data[0];
	 day = data[1];
	 document.write(cardNm + " " + day);
 }
 */

 
 
 var totalData = 1000;    // 총 데이터 수
 var dataPerPage = 20;    // 한 페이지에 나타낼 데이터 수
 var pageCount = 10;        // 한 화면에 나타낼 페이지 수

 function paging2(totalData, dataPerPage, pageCount, currentPage){
     
     //console.log("currentPage : " + currentPage);
     
     var totalPage = Math.ceil(totalData/dataPerPage);    // 총 페이지 수
     var pageGroup = Math.ceil(currentPage/pageCount);    // 페이지 그룹
     
     //console.log("pageGroup : " + pageGroup);
     
     var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
     if(last > totalPage)
         last = totalPage;
     var first = last - (pageCount-1);    // 화면에 보여질 첫번째 페이지 번호
     var next = last+1;
     var prev = first-1;
     
     //console.log("last : " + last);
     //console.log("first : " + first);
     //console.log("next : " + next);
     //console.log("prev : " + prev);

     var $pingingView = $("#paging2");
     
     var html = "";
     
     if(prev > 0)
         html += "<a href=# id='prev'><</a> ";
     
     for(var i=first; i <= last; i++){
         html += "<a href='#' id=" + i + ">" + i + "</a> ";
     }
     
     if(last < totalPage)
         html += "<a href=# id='next'>></a>";
     
     $("#paging2").html(html);    // 페이지 목록 생성
     $("#paging2 a").css("color", "black");
     $("#paging2 a#" + currentPage).css({"text-decoration":"none", 
                                        "color":"red", 
                                        "font-weight":"bold"});    // 현재 페이지 표시
                                        
     $("#paging2 a").click(function(){
         
         var $item = $(this);
         var $id = $item.attr("id");
         var selectedPage = $item.text();
         
         if($id == "next")    selectedPage = next;
         if($id == "prev")    selectedPage = prev;
         
         paging2(totalData, dataPerPage, pageCount, selectedPage);
     });
                                        
 }

function paging3(totalData, dataPerPage, pageCount, currentPage){
     
     //console.log("currentPage : " + currentPage);
     
     var totalPage = Math.ceil(totalData/dataPerPage);    // 총 페이지 수
     var pageGroup = Math.ceil(currentPage/pageCount);    // 페이지 그룹
     
     //console.log("pageGroup : " + pageGroup);
     
     var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
     if(last > totalPage)
         last = totalPage;
     var first = last - (pageCount-1);    // 화면에 보여질 첫번째 페이지 번호
     var next = last+1;
     var prev = first-1;
     
     //console.log("last : " + last);
     //console.log("first : " + first);
     //console.log("next : " + next);
     //console.log("prev : " + prev);

     var $pingingView = $("#paging2");
     
     var html = "";
     
     if(prev > 0)
         html += "<a href=# id='prev'><</a> ";
     
     for(var i=first; i <= last; i++){
         html += "<a href='#' id=" + i + ">" + i + "</a> ";
     }
     
     if(last < totalPage)
         html += "<a href=# id='next'>></a>";
     
     $("#paging2").html(html);    // 페이지 목록 생성
     $("#paging2 a").css("color", "black");
     $("#paging2 a#" + currentPage).css({"text-decoration":"none", 
                                        "color":"red", 
                                        "font-weight":"bold"});    // 현재 페이지 표시
                                        
     $("#paging2 a").click(function(){
         
         var $item = $(this);
         var $id = $item.attr("id");
         var selectedPage = $item.text();
         
         if($id == "next")    selectedPage = next;
         if($id == "prev")    selectedPage = prev;
         
         paging2(totalData, dataPerPage, pageCount, selectedPage);
     });
                                        
 }

 
 
function file_download(){
	$("#file_name").val("test.txt");
	
	$("#excel_form").attr("action", "./common/file_download.jsp");
	$("#excel_form").submit();
}
</script>

</head>
<body>

<form name="excel_form" id="excel_form" method="post" target="_blank">
<input type="hidden" name="excel_table" id="excel_table" />
<input type="hidden" name="file_name" id="file_name" />

<input type="hidden" name="current" id="current" />
<input type="hidden" name="max" id="max" />
</form>
<a href="javascript:excel();">Excel 다운로드</a>
<p><a href="javascript:excel_poi();">Excel(Poi) 다운로드</a></p>
<p><a href="javascript:excel_poi2();">Excel(Poi)수정 다운로드</a></p>
<p><a href="#" id="anchorNewApi-xlsx" onclick="return newApi('xlsx');">Export to Excel: XLSX format</a></p>
<p><a href="javascript:popupOpen();">팝업열기</a></p>
<p><a href="javascript:file_download();">파일다운로드</a></p>
<div id="layer" class="layerpop"></div>
<br><br>
<div class="container-fluid">
    <p id="selectedItem"></p>
    <div id="theGrid"></div>
    <div id="pager" class="wj-control wj-content wj-pager">
    <div class="wj-input-group">
      <span class="wj-input-group-btn">
        <button id="btnFirst" class="wj-btn wj-btn-default" type="button">
          <span class="wj-glyph-left" style="margin-right: -4px;"></span>
          <span class="wj-glyph-left"></span>
        </button>
      </span>
      <span class="wj-input-group-btn">
        <button id="btnPrev" class="wj-btn wj-btn-default" type="button">
          <span class="wj-glyph-left"></span>
        </button>
      </span>
      <input id="spanCurrent" class="wj-form-control" disabled type="text">
      <span class="wj-input-group-btn">
        <button id="btnNext" class="wj-btn wj-btn-default" type="button">
          <span class="wj-glyph-right"></span>
        </button>
      </span>
      <span class="wj-input-group-btn">
        <button id="btnLast" class="wj-btn wj-btn-default" type="button">
          <span class="wj-glyph-right"></span>
          <span class="wj-glyph-right" style="margin-left: -4px;"></span>
        </button>
      </span>
    </div>
  </div>
</div>
<p><a href="#" onclick="javascript:selection();">선택</a></p>
<br><br>
<div id="paging" style="display:none;"></div>
<br><br>
<div id="paging2"></div>
<br><br>
<br><br>

<div class="container-fluid">
  <div class="input-group">
    <div class="input-group-addon"><span class="glyphicon glyphicon-search"></span></div>    
    <input id="filter" class="form-control" placeholder="Country Filter">
    <input id="filter2" class="form-control" placeholder="Product Filter">
  </div> 
  <div id="theGrid2">
  </div>
  <div id="pager2" class="wj-control wj-content wj-pager">
    <div class="wj-input-group">
      <span class="wj-input-group-btn">
        <button id="btnFirst2" class="wj-btn wj-btn-default" type="button">
          <span class="wj-glyph-left" style="margin-right: -4px;"></span>
          <span class="wj-glyph-left"></span>
        </button>
      </span>
      <span class="wj-input-group-btn">
        <button id="btnPrev2" class="wj-btn wj-btn-default" type="button">
          <span class="wj-glyph-left"></span>
        </button>
      </span>
      <input id="spanCurrent2" class="wj-form-control" disabled type="text">
      <span class="wj-input-group-btn">
        <button id="btnNext2" class="wj-btn wj-btn-default" type="button">
          <span class="wj-glyph-right"></span>
        </button>
      </span>
      <span class="wj-input-group-btn">
        <button id="btnLast2" class="wj-btn wj-btn-default" type="button">
          <span class="wj-glyph-right"></span>
          <span class="wj-glyph-right" style="margin-left: -4px;"></span>
        </button>
      </span>
    </div>
  </div>
</div>
<br><br>
<br><br>
<div id="excel" style="display:none;">
<div class="table_test">
  	<h3>타이틀</h3>
	<table>
		<thead>
			<tr>
				<th>일</th>
				<th>월</th>
				<th>화</th>
				<th>수</th>
				<th>목</th>
				<th>금</th>
				<th>토</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>2</td>
				<td>3</td>
				<td>4</td> 
				<td>5</td>
				<td>6</td>
				<td>7</td>
			</tr>
			<tr>
				<td>8</td>
				<td>9</td>
				<td>10</td>
				<td>11</td>
				<td>12</td>
				<td>13</td>
				<td>14</td>
			</tr>
			<tr>
				<td>15</td>
				<td>16</td>
				<td>17</td>
				<td>18</td>
				<td>19</td>
				<td>20</td>
				<td>21</td>
			</tr>
			<tr>
				<td>22</td>
				<td>23</td>
				<td>24</td>
				<td>25</td>
				<td>26</td>
				<td>27</td>
				<td>28</td>
			</tr>
			<tr>
				<td>29</td>
				<td>30</td>
				<td>31</td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>
		</tbody>
	</table>
  </div>
  

</div>

<div>
  	<table class="table_test" style="display:none;">
		<thead>
			<tr>
				<th style="background-color:red;">일</th>
				<th>월</th>
				<th>화</th>
				<th>수</th>
				<th>목</th>
				<th>금</th>
				<th>토</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>2</td>
				<td>3</td>
				<td>4</td> 
				<td>5</td>
				<td>6</td>
				<td>7</td>
			</tr>
			<tr>
				<td>8</td>
				<td>9</td>
				<td>10</td>
				<td>11</td>
				<td>12</td>
				<td>13</td>
				<td>14</td>
			</tr>
			<tr>
				<td>15</td>
				<td>16</td>
				<td>17</td>
				<td>18</td>
				<td>19</td>
				<td>20</td>
				<td>21</td>
			</tr>
			<tr>
				<td>22</td>
				<td>23</td>
				<td>24</td>
				<td>25</td>
				<td>26</td>
				<td>27</td>
				<td>28</td>
			</tr>
			<tr>
				<td>29</td>
				<td>30</td>
				<td>31</td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>
		</tbody>
	</table>
  
  </div>
</body>
</html>