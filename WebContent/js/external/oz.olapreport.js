/*
 * oz.olapreport.js
 * obzen OlapReport Control
 *
 * 
 *
 * 참고
 * FlexGrid Class   http://wijmo.com/5/docs/topic/wijmo.grid.FlexGrid.Class.html
 * wijmo FlexGrid import/export Excel  http://demos.wijmo.com/5/Angular/ExcelImportExport/ExcelImportExport/
 *
 *
 *
 * 
 *
 *
 *
 */



//  Class ozolapsheet
//      var osheet = new ozolapsheet("divOlapSheet1");
//      osheet.myHdlr = new ozReportHandler();
//      osheet.draw();
// 조건>>> ozReportHandler(oz.dp.viewer)
//  colmeasure/colrow/colcolumn 이용
//  parser(ozResultParser) 사용

var g_olap_Sheet_id = 'olapSheet1'; //fixed



 



////////////////////////////////////////////////////////////////////////////////////////////////////
// oz_olapreport ///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
function oz_olapreport(sID) {
    this.mvarid = '#' + sID;
    this.ctl;


    this.appOzid;
   



    //this.ozid = ozid;
    var refPDiv = document.getElementById(sID);
    //divOLAPSheet1
    refPDiv.innerHTML =
        "<div id='tabctl' style='position:absolute;left:0px;top:0px;width:269px;bottom:10px; border-style:dotted; border-color:#ff0000'>" +
        "  <div id='tabctl_header' class='oztabs-container' style='position:absolute;height:30px'></div>" + 
        "  <div id='tabctl_container' class='oztabs-content' style='position:absolute;left:0px;top:31px;right:0px;bottom:0px;' >" +
        "    <div id= 'c_TabPage1' style='position:absolute;left:0px;top:0px;right:0px;bottom:0px' >" +
        "      <div id='divmetatree' style='position:absolute;left:0px;top:0px;right:0px;bottom:0px'></div>" + 
        "    </div>" +
        "  </div>" + 
        "</div>" + 
    "<div id='" + g_olap_Sheet_id + "' style='position:absolute;left:271px;top:0px;width:70%;height:70%; border-style:solid; border-color:#00ff00' ></div>";

    this.oDiv = document.getElementById(g_olap_Sheet_id);

    load_MetaTree();
    this.olapSheet = new ozolapsheet(g_olap_Sheet_id);
    ozolapsheet_instMgr.add(this.olapSheet);

    //this.olapSheet.myHdlr = new ozReportHandler();


    //Tooltip
    this.CellTip = new wijmo.Tooltip();
    this.TipContent = "";
    this.TipRng;

    //this.MtxRowState; // = new oz_matrix(iRows, 3, -1);
    //this.MtxColState; // = new oz_matrix(3, iCols, -1);
    //this.ColHeaderTotalState = [];
    //this.RowHeaderTotalState = [];
    ////this.collTotalRIdx = new oz_Collection();  //?사용안함
    ////this.collTotalCIdx = new oz_Collection();

    ////Sort
    //this.mtxSortList;
    //this.ArrColSortInfo = [];   //0:None 1:Asc -1:Dsc

    ////getFormattedValue-param
    //this._eDataType = 0;
    //this._sFormatStr = "";
    //this._bIsPercent = false;

    ////UI, MergeManger
    //this.myFlex = this.createSheet();
    //this.myOrgMM = this.myFlex.mergeManager;        
    //var myMM = new wijmo.grid.MergeManager(this.myFlex);
    //this.GetMyMM = function () { return myMM;}
    //var myMMRng;




    this.init = function () {
        var htmltag;
        htmltag  = "<div id='tabctl' style='position:absolute;left:0px;top:0px;width:269px;bottom:10px; border-style:dotted; border-color:#ff0000'>";
        htmltag += "  <div id='tabctl_header' class='oztabs-container' style='position:absolute;height:30px'></div>";
        htmltag += "  <div id='tabctl_container' class='oztabs-content' style='position:absolute;left:0px;top:31px;right:0px;bottom:0px;' >";
        htmltag += "    <div id= 'c_TabPage1' style='position:absolute;left:0px;top:0px;right:0px;bottom:0px' >";
        htmltag += "      <div id='divmetatree' style='position:absolute;left:0px;top:0px;right:0px;bottom:0px'></div>";
        htmltag += "    </div>";
        htmltag += "  </div>";
        htmltag += "</div>";
        htmltag += "<div id='" + g_olap_Sheet_id + "' style='position:absolute;left:271px;top:0px;width:70%;height:70%; border-style:solid; border-color:#00ff00' ></div>";
    }

    function load_MetaTree() {
        tab1 = new oz_Tabs('tabctl');
        var ozTabControl1_headers;
        ozTabControl1_headers = [
            { id: 0, text: '항목', icon: 'check', content: 'ozTabControl1_container' },
            { id: 1, text: '검색', icon: 'menu', content: 'ozTabControl1_container' },
            { id: 2, text: '즐겨 찾기', icon: 'menu', content: 'ozTabControl1_container' }];
        tab1.init(ozTabControl1_headers, 0);

        tab1.ctl.option('onSelectionChanged', function (data) {
            try {
                tab_changed(data);
            }
            catch (e) {
            }
        });

        var cubeaddr = '/ManageBaseServer/Marketing/CustomerAnls';
        var displaytypes = 'dimensions;dimension;facts;fact;measures;measure';

        var cubename = ozf_GetNameFromAddr(cubeaddr);
        metatree1 = new oz_metatree();
        metatree1.init('#divmetatree', cubeaddr, cubename, displaytypes);
        metatree1.rooticon = "../image/type/cube.png";
        metatree1.addEventListener('dblclick', metatree_dblclick);
    }
    function metatree_dblclick(e) {
        //alert(mvarcubeozid);
        mvarcubeozid = e;
        mvarcubename = mvarmetatree_cube.cubelabel();
    }
    function tab_changed(data) {
    }



    this.requestdrillreport = null;


}
//Eof oz_olapreport --------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////
// Eof oz_olapreport ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////




if (!oz_olapreport.prototype.addEventListener) {
    oz_olapreport.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "requestdrillreport":
                this.requestdrillreport = f;
                break;

            case "onCheckClick":
                //this.fgObj.onCellEditEnded = f;
                this.onCheckClickHandler = f;
                break;

            case "onHyperClick":
                this.onHyperClick = f;
                break;

        }
    }
}



if (!oz_olapreport.prototype.getDrillOption) {
    oz_olapreport.prototype.getDrillOption = function (clsRepHdlr) {
        this.myHdlr = clsRepHdlr;
        if (this.myHdlr == null) return;
        this.myParser = this.myHdlr.parser;

        this.ColHeaderTotalState = [this.myParser.ColumnCount];
        for (var c = 0; c < this.myParser.ColumnCount; c++)
            this.ColHeaderTotalState[c] = -1;
        this.RowHeaderTotalState = [this.myParser.RecordCount];
        for (var r = 0; r < this.myParser.RecordCount; r++)
            this.RowHeaderTotalState[r] = -1;

        this.ArrColSortInfo = [this.myParser.ColumnCount];
        for (var c = 0; c < this.myParser.ColumnCount; c++)
            this.ArrColSortInfo[c] = 0;

        if (this.myFlex == null) this.createSheet();
        this.drawSheet(this.myFlex);
    }
}



/**  

if (!oz_olapreport.prototype.setxml) {
    oz_olapreport.prototype.setxml = function (xStyle) {
        this.GridSettings.SetXML(xStyle);
        if (this.StyleMode == 0) 
            this.GridStyleManager.SetXML(xStyle);
    }
}

if (!oz_olapreport.prototype.createSheet) {
    oz_olapreport.prototype.createSheet = function () {
        this.myFlex = new wijmo.grid.FlexGrid(this.oDiv);
        this.myFlex.isReadOnly = true;
        this.myFlex.allowResizing = wijmo.grid.AllowResizing.Both;
        this.myFlex.allowDragging = wijmo.grid.AllowDragging.Both;
        this.myFlex.headersVisibility = wijmo.grid.HeadersVisibility.None;
        this.myFlex.allowSorting = true;
        this.myFlex.autoSizeMode = wijmo.grid.AutoSizeMode.Cells;
        this.myFlex.initialize({
            itemFormatter: this.cellFormatter
        })
        return this.myFlex;
    }
}

    if (!oz_olapreport.prototype.drawSheet) {
    oz_olapreport.prototype.drawSheet = function (flex) {
        // clear
        flex.beginUpdate();
        flex.rows.clear();
        flex.columns.clear();
        if (this.myParser.HasNoData == true) {
            //Tooltip
            //this.TipContent = "데이터가 없습니다.";
            flex.endUpdate();
            return;
        }
        if (this.myParser.IsCross == true)
            if (this.GridSettings.MergeLabels == true) 
                flex.allowMerging = wijmo.grid.AllowMerging.Cells;
            else
                flex.allowMerging = wijmo.grid.AllowMerging.None;
        else
            flex.allowMerging = wijmo.grid.AllowMerging.None;

        var iRowCnt, iColCnt;
        // value area
        iRowCnt = this.myParser.RecordCount;
        for (var r = 0; r < iRowCnt; r++) {
            flex.rows.push(new wijmo.grid.Row());
        }
        iColCnt = this.myParser.ColumnCount;
        for (var c = 0; c < iColCnt; c++) {
            flex.columns.push(new wijmo.grid.Column());
        }
        // populate the scrollable area
        if (this.myParser.IsMeasureOnColumn == true) {
            var objVal;
            for (var c = 0; c < iColCnt; c++) {
                for (var r = 0; r < iRowCnt; r++) {
                    if (r == 0) {
                        this.getFormattedValue(r, c);
                    }
                    objVal = this.myParser.MatrixValues[r][c];
                    if (objVal == "")
                        flex.setCellData(r, c, objVal);
                    else
                        flex.setCellData(r, c, this.getFormattedValue2(objVal));
                }
            }
        } else {

            for (var r = 0; r < iRowCnt; r++) {
                for (var c = 0; c < iColCnt; c++) {
                    //flex.setCellData(r, c, 'r' + r + ',c' + c);
                    flex.setCellData(r, c, this.myParser.MatrixValues[r][c]);
                }
            }
        }

        // add  rows to the column header and  columns to the row header panels
        var col, row;
        for (var c = 0; c < this.myParser.RowLevelCount; c++) {
            //flex.rowHeaders.columns.insert(0, new wijmo.grid.Column());
            flex.columns.insert(0, new wijmo.grid.Column());
            if (c != 0)
                flex.columns[0].allowMerging = this.GridSettings.MergeLabels;
            else
                flex.columns[0].allowMerging = false;
        }
        for (var r = 0; r < this.myParser.ColumnLevelCount; r++) {
            //flex.columnHeaders.rows.insert(0, new wijmo.grid.Row());
            //row.allowMerging = true;
            flex.rows.insert(0, new wijmo.grid.Row());
            if (r != 0)
                flex.rows[0].allowMerging = this.GridSettings.MergeLabels;
            else
                flex.rows[0].allowMerging = false;
        }
        // populate the label area
        //flex.rowHeaders;
        for (var c = 0; c < this.myParser.RowLevelCount; c++) {
            for (var r = 0; r < iRowCnt; r++) {
                flex.setCellData(r + this.myParser.ColumnLevelCount, c, this.myParser.MatrixRowLabels[r][c]);
            }
        }
        //flex.columnHeaders
        for (var r = 0; r < this.myParser.ColumnLevelCount; r++) {
            for (var c = 0; c < iColCnt; c++) {
                flex.setCellData(r, c + this.myParser.RowLevelCount, this.myParser.MatrixColumnLabels[r][c]);
            }
        }
        //TopLeft
        if (this.myParser.IsCross == true) {
            if (this.myParser.RowLevelCount > 0 && this.myParser.ColumnLevelCount > 0) {
                for (var c = 0; c < this.myParser.RowLevelCount; c++) {
                    for (var r = 0; r < this.myParser.ColumnLevelCount; r++) 
                        flex.setCellData(r, c, this.myParser.MatrixTopLeft[r][c]);
                }
            }
        }


        //Collapse Vacant Lines
        if (!ozf_StringIsEmpty(this.myParser.ColDataMaxSizeList)) {
            var lstVals = [];
            lstVals = oz_SplitToArray(this.myParser.ColDataMaxSizeList, Const_CDataDelimiter());
            for (var i = 0; i <= lstVals.length - 2; i++) {
                if (parseInt(lstVals[i + this.myParser.RowLevelCount]) == 0) flex.columns[i].visible = false;
            }
            lstVals = oz_SplitToArray(this.myParser.RowDataMaxSizeList, Const_CDataDelimiter());
            for (var i = 0; i <= lstVals.length - 2; i++) {
                if (parseInt(lstVals[i + this.myParser.ColumnLevelCount]) == 0) flex.rows[i].visible = false;
            }
        }

        flex.columns.frozen = this.GridSettings.FrozenCols;

        flex.endUpdate();

        //Tooltip
        if (this.myParser.IsCross)
            this.TipContent = "[전체] Rows:{0}  Columns:{1}".format(this.myParser.RecordCount + this.myParser.ColumnLevelCount, this.myParser.ColumnCount + this.myParser.RowLevelCount);
        else
            this.TipContent = "[전체] Rows:{0}  Columns:{1}".format(this.myParser.RecordCount, this.myParser.ColumnCount);

        // autosize it
        if (this.GridSettings.UseFixedColWidth == true) {
            var lstWs = [];
            lstWs = oz_SplitToArray(this.GridSettings.FixedColWidthList, "\t");
            var iColCnt = this.myParser.RowLevelCount + this.myParser.ColumnCount;
            for (var c = 0; c < iColCnt; c++) {
                if (c >= lstWs.length) break;
                if (flex.columns[c].visible == true) {
                    flex.columns[c].width = parseFloat(lstWs[c]);
                }
            }
        } else {
            flex.autoSizeColumns(0, flex.columns.length - 1, false, 10);
        }
        flex.select(-1, -1); //selection 표시 제거
    }
}
    
if (!oz_olapreport.prototype.getFormattedValue2) {
    oz_olapreport.prototype.getFormattedValue2 = function (objVal) {
        switch (this._eDataType) {
            case "real":
                return wijmo.Globalize.formatNumber(parseFloat(objVal), this._sFormatStr); break;
            case "_sFormatStr":
                return wijmo.Globalize.formatNumber(parseFloat(objVal), this._sFormatStr); break;
            case "integer":
                if (this._bIsPercent)
                    return wijmo.Globalize.formatNumber(parseFloat(objVal), this._sFormatStr); 
                else
                    return wijmo.Globalize.formatNumber(parseInt(objVal), this._sFormatStr);
                break;
            case "date":
                return wijmo.Globalize.formatDate(Date.parse(objVal), this._sFormatStr); break;
            default:
                return objVal;
        }            
    }
}

**/
