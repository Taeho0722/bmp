//  Class ozolapsheet
//      var osheet = new ozolapsheet("divOlapSheet1");
//      osheet.myHdlr = new ozReportHandler();
//      osheet.draw();
// 조건>>> ozReportHandler(oz.dp.viewer)
//  colmeasure/colrow/colcolumn 이용
//  parser(ozResultParser) 사용

var gOSID = 'divOlapSheet1'; //fixed
function getRefOLAPSheet() {
    //부모Control(EasyOLAP)의 ID 찾아 ModelDataClass 가져온 후 olapsheet Class 반환
    var pDiv = document.getElementById(gOSID);
    pDiv = pDiv.parentElement.parentElement;
    return getCtl(pDiv.id).olapSheet; // .sheet;    
}


var ozolapsheet_instMgr = new oz_olapsheet_InstanceManager();
function oz_olapsheet_InstanceManager() {
    this.list = new Object();

    //[2016/12/02] 초기화 메서드 추가
    this.clear = function () {
        this.list = [];
    }
}
oz_olapsheet_InstanceManager.prototype.add = function (olapsheet) {
    this.list[olapsheet.mvarid] = olapsheet;
}
oz_olapsheet_InstanceManager.prototype.getInstance = function (idOrFG) {
    if (typeof idOrFG == "string") {
        if (idOrFG.charAt(0) != '#')  //if (!idOrFG.startsWith("#"))  ** startsWith 메서드는 IE의경우 12버전부터 지원함.
            idOrFG = "#" + idOrFG;
        return this.list[idOrFG];
    } else if (typeof idOrFG == "object") {
        for (var key in this.list) {
            if (this.list[key].myFlex == idOrFG)
                return this.list[key];
        }
    }
}



//Utility======================================================================From
function Const_CDataDelimiter() {
	return ";^";
}
Array.matrix = function (numrows, numcols, initial) {
	var arr = [];
	for (var i = 0; i < numrows; ++i){
	    var columns = [];
	    for (var j = 0; j < numcols; ++j){
	        columns[j] = initial;
	    }
	    arr[i] = columns;
	}
	return arr;
}
function GetElementText(xElem, TagNm) {
	    if (xElem.getElementsByTagName(TagNm).length > 0) {
	      	if (!window.ActiveXObject)
	      	    return xElem.getElementsByTagName(TagNm)[0].textContent;
	      	else
                return xElem.getElementsByTagName(TagNm)[0].textContent;
	      	    // return xElem.getElementsByTagName(TagNm)[0].text; //nodeTypedValue; //.text
	    }
	    return "";
}
function getColorValue(sBrushXML) {
    var xDoc = ozf_getXMLDoc(sBrushXML);
    if (xDoc.getElementsByTagName("SolidColorBrush").length > 0) {
        return xDoc.getElementsByTagName("SolidColorBrush")[0].getAttribute("Color");
    }
    return "#000000";
}
function Convert_StrTF2Bool(strVal) {
	if (strVal.toUpperCase() == "T") {
	    return true;
	} else {
	    return false;        
	}
}
function Convert_String2Bool(strVal) {
    if (strVal.toLowerCase() == "true") {
        return true;
    } else {
        return false;
    }
}
function Convert_HAlign2TextAlign(intVal) {
	switch (intVal) {
	    case 0: return "left";
	    case 2: return "right";
	    case 1: return "center";
	    default: return "left";
	}	    
}
//Utility======================================================================To

//ClsAreaStyle
function ClsAreaStyle() {
	this.BackColor = "#FFFFFF";
	this.ForeColor = "#000000";
	this.AlterBackColor = this.BackColor;
	this.AlterForeColor = this.ForeColor;
	this.GridColor = "#C9CACA";
	this.FontSize = 7.5;
	this.FontBold = false;
	this.FontItalic = false;
	this.HAlignment = "left"; //0:left 1:center 2:right
}

//ClsGridStyleManager
function ClsGridStyleManager() {
	this.DefBackColor = "#FFFFFF";
	this.DefForeColor = "#000000";
	this.DefFontSize = 7.5;
	this.DefGridColor = "##c6c6c6";
	this.BorderStyle = "";
	this.BorderRight = "";
	this.BorderBottom = "";

	this.TopLeftArea = new ClsAreaStyle();
	this.RowHeaderArea = new ClsAreaStyle();
	this.RowHeaderArea.FontBold = true;
	this.ColHeaderArea = new ClsAreaStyle();
	this.ColHeaderArea.FontBold = true;
	this.ColHeaderArea.HAlignment = "center"; //1;
	this.ValueArea = new ClsAreaStyle();
	this.ValueArea.AlterBackColor = "#E8F0FE";
	this.ValueArea.HAlignment = "right"; //2;
	this.GrandTotalHeaderArea = new ClsAreaStyle();
	this.GrandTotalHeaderArea.ForeColor = "#4F81BD";
	this.GrandTotalHeaderArea.FontBold = true;
	this.GrandTotalValueArea = new ClsAreaStyle();
	this.SubtotalHeaderArea = new ClsAreaStyle();
	this.SubtotalHeaderArea.ForeColor = "#4F81BD";
	this.SubtotalHeaderArea.FontBold = true;
	this.SubtotalValueArea = new ClsAreaStyle();

	this.UseStyleTopLeft = false;
	//this.UseStyleHeader = false; //원래사용안함
	this.UseStyleRowHeader = false;
	this.UseStyleColHeader = false;
	this.UseStyleGTHeader = false;
	this.UseStyleSTHeader = false;
	this.UseStyleValue = true;
	this.UseStyleValueAlter = false;
	this.UseStyleGTValue = false;
	this.UseStyleSTValue = false;
}

if (!ClsGridStyleManager.prototype.SetXML) {
    ClsGridStyleManager.prototype.SetXML = function (xStyle) {
        var tags = xStyle.getElementsByTagName("GridStyle");
        var xItem;
        if (tags.length > 0) {
            xItem = tags[0];
            this.UseStyleTopLeft = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "UseStyleTopLeft", "F"));
            this.UseStyleRowHeader = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "UseStyleRowHeader", "F"));
            this.UseStyleColHeader = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "UseStyleColHeader", "F"));
            this.UseStyleGTHeader = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "UseStyleGTHeader", "F"));
            this.UseStyleSTHeader = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "UseStyleSTHeader", "F"));
            this.UseStyleValue = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "UseStyleValue", "F"));
            this.UseStyleValueAlter = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "UseStyleValueAlter", "F"));
            this.UseStyleGTValue = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "UseStyleGTValue", "F"));
            this.UseStyleSTValue = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "UseStyleSTValue", "F"));
            this.DefFontSize = parseFloat(ozf_GetAttributeValue(xItem, "DefFontSize", "7.5"));                
            var sVal;
            sVal = GetElementText(xItem, "DefGridColor");
            if (sVal != "") this.DefGridColor = getColorValue(sVal);
            sVal = ozf_GetAttributeValue(xItem, "DefGridVisibility", "all").toLowerCase();
            switch (sVal) {
                case "all":
                    this.BorderStyle = "border-right:1px solid {0};border-bottom:1px solid {0};".format(this.DefGridColor);
                    this.BorderRight = "1px solid " + this.DefGridColor;
                    this.BorderBottom = "1px solid " + this.DefGridColor;
                    break;
                case "horizontal":
                    this.BorderStyle = "border-right:0px solid {0};border-bottom:1px solid {0};".format(this.DefGridColor);
                    this.BorderRight = "0px solid " + this.DefGridColor;
                    this.BorderBottom = "1px solid " + this.DefGridColor;
                    break;
                case "vertical":
                    this.BorderStyle = "border-right:1px solid {0};border-bottom:0px solid {0};".format(this.DefGridColor);
                    this.BorderRight = "1px solid " + this.DefGridColor;
                    this.BorderBottom = "0px solid " + this.DefGridColor;
                    break;
                default: //none
                    this.BorderStyle = "border-right:0px solid {0};border-bottom:1px solid {0};".format(this.DefGridColor);
                    this.BorderRight = "0px solid " + this.DefGridColor;
                    this.BorderBottom = "0px solid " + this.DefGridColor;
                    break;
            }
            //Grid가 하나만 있을 때 가능
            sVal = GetElementText(xItem, "DefBackColor");
            if (sVal != "") this.DefBackColor = getColorValue(sVal);
            sVal = GetElementText(xItem, "DefForeColor");
            if (sVal != "") this.DefForeColor = getColorValue(sVal);
            // <SolidColorBrush Color='#xxxxxx'/>
            if (this.UseStyleTopLeft == true) {
                this.TopLeftArea.BackColor = getColorValue(GetElementText(xItem, "TLBackColor"));
                this.TopLeftArea.ForeColor = getColorValue(GetElementText(xItem, "TLForeColor"));
                this.TopLeftArea.HAlignment = GetElementText(xItem, "TLHAlign").toLowerCase();
                this.TopLeftArea.FontBold = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "TLBold", "F"));
                this.TopLeftArea.FontItalic = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "TLItalic", "F"));
            }
            else {
               	this.TopLeftArea.BackColor = this.DefBackColor;
               	this.TopLeftArea.ForeColor = this.DefForeColor;
               	this.TopLeftArea.HAlignment = ozf_GetAttributeValue(xItem, "DefHeaderHAlign").toLowerCase();
               	this.TopLeftArea.FontBold = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "DefFontBold", "F"));
               	this.TopLeftArea.FontItalic = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "DefFontItalic", "F"));
            }
            this.TopLeftArea.FontSize = this.DefFontSize;
            if (this.UseStyleRowHeader == true) {
                this.RowHeaderArea.BackColor = getColorValue(GetElementText(xItem, "RowBackColor"));
                this.RowHeaderArea.ForeColor = getColorValue(GetElementText(xItem, "RowForeColor"));
                this.RowHeaderArea.HAlignment = GetElementText(xItem, "RowHeaderHAlign").toLowerCase();
                this.RowHeaderArea.FontBold = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "RowHeaderBold", "F"));
                this.RowHeaderArea.FontItalic = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "RowHeaderItalic", "F"));
            } else {
               	this.RowHeaderArea.BackColor = this.DefBackColor;
               	this.RowHeaderArea.ForeColor = this.DefForeColor;
               	this.RowHeaderArea.HAlignment = ozf_GetAttributeValue(xItem, "DefHeaderHAlign").toLowerCase();
               	this.RowHeaderArea.FontBold = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "DefFontBold", "F"));
               	this.RowHeaderArea.FontItalic = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "DefFontItalic", "F"));
            }
            this.RowHeaderArea.FontSize = this.DefFontSize;
            if (this.UseStyleColHeader == true) {
                this.ColHeaderArea.BackColor = getColorValue(GetElementText(xItem, "ColBackColor"));
                this.ColHeaderArea.ForeColor = getColorValue(GetElementText(xItem, "ColForeColor"));
                this.ColHeaderArea.HAlignment = GetElementText(xItem, "ColHeaderHAlign").toLowerCase();
                this.ColHeaderArea.FontBold = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "ColHeaderBold", "F"));
                this.ColHeaderArea.FontItalic = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "ColHeaderItalic", "F"));
            } else {
               	this.ColHeaderArea.BackColor = this.DefBackColor;
               	this.ColHeaderArea.ForeColor = this.DefForeColor;
               	this.ColHeaderArea.HAlignment = ozf_GetAttributeValue(xItem, "DefHeaderHAlign").toLowerCase();
               	this.ColHeaderArea.FontBold = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "DefFontBold", "F"));
               	this.ColHeaderArea.FontItalic = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "DefFontItalic", "F"));
            }
            this.ColHeaderArea.FontSize = this.DefFontSize;
            if (this.UseStyleGTHeader == true) {
                	this.GrandTotalHeaderArea.BackColor = getColorValue(GetElementText(xItem, "GTHBackColor"));
                	this.GrandTotalHeaderArea.ForeColor = getColorValue(GetElementText(xItem, "GTHForeColor"));
                	this.GrandTotalHeaderArea.HAlignment = (GetElementText(xItem, "GTHeaderHAlign"));
                	this.GrandTotalHeaderArea.FontBold = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "GTHBold", "F"));
                	this.GrandTotalHeaderArea.FontItalic = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "GTHItalic", "F"));
                } else {
               	this.GrandTotalHeaderArea.BackColor = this.DefBackColor;
               	this.GrandTotalHeaderArea.ForeColor = this.DefForeColor;
               	this.GrandTotalHeaderArea.HAlignment = ozf_GetAttributeValue(xItem, "DefHeaderHAlign").toLowerCase();
               	this.GrandTotalHeaderArea.FontBold = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "DefFontBold", "F"));
               	this.GrandTotalHeaderArea.FontItalic = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "DefFontItalic", "F"));
            }
            this.GrandTotalHeaderArea.FontSize = this.DefFontSize;
            if (this.UseStyleSTHeader == true) {
                this.SubtotalHeaderArea.BackColor = getColorValue(GetElementText(xItem, "STHBackColor"));
                this.SubtotalHeaderArea.ForeColor = getColorValue(GetElementText(xItem, "STHForeColor"));
                this.SubtotalHeaderArea.HAlignment = GetElementText(xItem, "STHeaderHAlign").toLowerCase();
                this.SubtotalHeaderArea.FontBold = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "STHBold", "F"));
                this.SubtotalHeaderArea.FontItalic = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "STHItalic", "F"));
            } else {
                this.SubtotalHeaderArea.BackColor = this.DefBackColor;
                this.SubtotalHeaderArea.ForeColor = this.DefForeColor;
                this.SubtotalHeaderArea.HAlignment = ozf_GetAttributeValue(xItem, "DefHeaderHAlign").toLowerCase();
                this.SubtotalHeaderArea.FontBold = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "DefFontBold", "F"));
                this.SubtotalHeaderArea.FontItalic = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "DefFontItalic", "F"));
            }
            this.SubtotalHeaderArea.FontSize = this.DefFontSize;
            if (this.UseStyleValue == true) {
                this.ValueArea.BackColor = getColorValue(GetElementText(xItem, "ValueBackColor"));
                this.ValueArea.ForeColor = getColorValue(GetElementText(xItem, "ValueForeColor"));
            }
            else {
                this.ValueArea.BackColor = this.DefBackColor;
                this.ValueArea.ForeColor = this.DefForeColor;
            }
            this.ValueArea.HAlignment = ozf_GetAttributeValue(xItem, "DefValueHAlign").toLowerCase();
            this.ValueArea.FontSize = this.DefFontSize;
            if (this.UseStyleValueAlter == true) {
                this.ValueArea.AlterBackColor = getColorValue(GetElementText(xItem, "ValueAlterBackColor"));
                this.ValueArea.AlterForeColor = getColorValue(GetElementText(xItem, "ValueAlterForeColor"));
            }
            else {
                this.ValueArea.AlterBackColor = this.DefBackColor;
                this.ValueArea.AlterForeColor = this.DefForeColor;
            }
            if (this.UseStyleGTValue == true) {
                this.GrandTotalValueArea.BackColor = getColorValue(GetElementText(xItem, "GTVBackColor"));
                this.GrandTotalValueArea.ForeColor = getColorValue(GetElementText(xItem, "GTVForeColor"));
            } else {
                this.GrandTotalValueArea.BackColor = this.DefBackColor;
                this.GrandTotalValueArea.ForeColor = this.DefForeColor;
            }
            this.GrandTotalValueArea.HAlignment = ozf_GetAttributeValue(xItem, "DefValueHAlign").toLowerCase();
            this.GrandTotalValueArea.FontSize = this.DefFontSize;
            if (this.UseStyleSTValue == true) {
                this.SubtotalValueArea.BackColor = getColorValue(GetElementText(xItem, "STVBackColor"));
                this.SubtotalValueArea.ForeColor = getColorValue(GetElementText(xItem, "STVForeColor"));
            } else {
                this.SubtotalValueArea.BackColor = this.DefBackColor;
                this.SubtotalValueArea.ForeColor = this.DefForeColor;
            }
            this.SubtotalValueArea.HAlignment = ozf_GetAttributeValue(xItem, "DefValueHAlign").toLowerCase();
            this.SubtotalValueArea.FontSize = this.DefFontSize;
        }
    }
}

//ClsGridSettings
function ClsGridSettings() {
    this.GrandTotalLabel = "Grand Total";
    this.SubtotalLabel = "Total";
    this.HasGrandTotalForColumns = false;
    this.HasGrandTotalForRows = false;
    this.HasSubtotalsForColumns = false;
    this.HasSubtotalsForRows = false;
        
    this.ExtraWidth = 0.0;
    this.ExtraHeight = 0.0;
    this.FrozenRows = 0;
    this.FrozenCols = 0;
    this.MergeLabels = true;
    this.HideMeasureLabel = false;

}

if (!ClsGridSettings.prototype.SetXML) {
    ClsGridSettings.prototype.SetXML = function (xStyle) {
        this.FrozenRows = parseInt(GetElementText(xStyle, "FrozenRows"));
        this.FrozenCols = parseInt(GetElementText(xStyle, "FrozenColumns"));
        this.MergeLabels = Convert_String2Bool(GetElementText(xStyle, "MergeLabels"));
        var tags, xItem;
        tags = xStyle.getElementsByTagName("Total");
        if (tags.length > 0) {
            xItem = tags[0];
            this.GrandTotalLabel = ozf_GetAttributeValue(xItem, "grandtotallabel", "Grand Total");
            this.SubtotalLabel = ozf_GetAttributeValue(xItem, "subtotallabel", "Total");
            this.HasGrandTotalForRows = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "rowgrandtotal", "F"));
            this.HasGrandTotalForColumns = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "columngrandtotal", "F"));
            this.HasSubtotalsForRows = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "rowsubtotal", "F"));
            this.HasSubtotalsForColumns = Convert_StrTF2Bool(ozf_GetAttributeValue(xItem, "columnsubtotal", "F"));
        }
    }
}
 

//ozolapsheet===================================================================
function ozolapsheet(sID) {
    var that = this;    //private member

    this.mvarid = '#' + sID;
    this.ctl;

    //this.ozid = ozid;
    var refPDiv = document.getElementById(sID);
    //divOLAPSheet1
    refPDiv.innerHTML = "<div id='" + gOSID + "' style='width:100%; height:100%'></div>" +
        "<div id='divOSCM1' class='oz-wf-contextMenu'><ul></ul></div>";
    this.oDiv = document.getElementById(gOSID);
    this.myHdlr = null; //clsRepHdlr;
    this.myParser = null; //this.myHdlr.ReportParser;
    this.ViewMode = 0;
    this.StyleMode = 0; //0:from DP, 1:css
    this.GridSettings = new ClsGridSettings();
    this.GridStyleManager = new ClsGridStyleManager();
    this.myOrgMM;
    //enum
    this.enum_hitArea = {
        Value : 0,
        ColHeader:1,
        RowHeader:2,
        TopLeft:3,
        GrandTotalHeader:4,
        GrandTotalValue:5,
        SubtotalHeader:6,
        SubtotalValue:7,
        Other:8
    }
    //Tooltip
    this.CellTip = new wijmo.Tooltip();
    this.TipContent = "";
    this.TipRng;

    //State 0: 1:TotalState
    this.enum_StateID = {
        Index: 0,       //real index with pseudo?
        Total: 1,       //-1:None 0:GrandTotal 1+:Subtotal level
        Sort: 2         //1:asc 0:none -1:dsc
    }
    this.MtxRowState; // = new oz_matrix(iRows, 3, -1);
    this.MtxColState; // = new oz_matrix(3, iCols, -1);
    this.ColHeaderTotalState = [];
    this.RowHeaderTotalState = [];
    //this.collTotalRIdx = new oz_Collection();  //?사용안함
    //this.collTotalCIdx = new oz_Collection();

    //Sort
    this.mtxSortList;
    this.ArrColSortInfo = [];   //0:None 1:Asc -1:Dsc

    //getFormattedValue-param
    this._eDataType = 0;
    this._sFormatStr = "";
    this._bIsPercent = false;
    //UI, MergeManger
    this.myFlex = this.createSheet();


    //--------------------- Custom mergeManager -----------------------
    /***
    this.myOrgMM = this.myFlex.mergeManager;        
    var myMM = new wijmo.grid.MergeManager(this.myFlex);
    this.GetMyMM = function () { return myMM;}
    var myMMRng;
    // IE
    // myMM.__proto__.getMergedRange = function (panel, r, c) {
    Object.getPrototypeOf(myMM).getMergedRange = function (panel, r, c) {
        var refozSheet = getRefOLAPSheet();
        //var refozSheet = ozolapsheet_instMgr.getInstance(panel.grid);
        var refozSheet = that;
        var cParser = refozSheet.myParser;
        var iRLast0 = cParser.ColumnLevelCount - 1;
        var iCLast0 = cParser.RowLevelCount - 1;
        myMMRng = new wijmo.grid.CellRange(r, c, r, c);
        if (panel.cellType != wijmo.grid.CellType.Cell) return myMMRng;
        if (r > iRLast0 && c > iCLast0) return myMMRng;         //Value
        if (r <= iRLast0 && c <= iCLast0) {                     //TopLeft
            for (var ci = c; ci <= (cParser.RowLevelCount + cParser.ColumnCount - 2) ; ci++) {
                if (panel.grid.getCellData(r, ci) != panel.grid.getCellData(r, ci + 1)) break;
                myMMRng.col2 = ci + 1;
            }
            for (var ci = c; ci >= 1; ci--) {
                if (panel.grid.getCellData(r, ci) != panel.grid.getCellData(r, ci - 1)) break;
                myMMRng.col = ci - 1;
            }
            for (var ri = r; ri <= iRLast0 - 1; ri++) {
                if (panel.grid.getCellData(ri, c) != panel.grid.getCellData(ri + 1, c)) break;
                myMMRng.row2 = ri + 1;
            }
            for (var ri = r; ri >= 1; ri--) {
                if (panel.grid.getCellData(ri, c) != panel.grid.getCellData(ri - 1, c)) break;
                myMMRng.row = ri - 1;
            }
            return myMMRng;
        }
        if (r <= iRLast0 && c > iCLast0) {                      //TopLabel
            if (r == iRLast0) return myMMRng;
            for (var ci = c; ci <= (cParser.RowLevelCount + cParser.ColumnCount - 2) ; ci++) {
                if (panel.grid.getCellData(r, ci) != panel.grid.getCellData(r, ci + 1)) break;
                if (r == 0) {
                    myMMRng.col2 = ci + 1;
                } else {
                    if (panel.grid.getCellData(r - 1, ci) == panel.grid.getCellData(r - 1, ci + 1)) {
                        myMMRng.col2 = ci + 1;
                    }
                }
            }
            for (var ci = c; ci >= 1; ci--) {
                if (panel.grid.getCellData(r, ci) != panel.grid.getCellData(r, ci - 1)) break;
                if (r == 0) {
                    myMMRng.col = ci - 1;
                } else {
                    if (panel.grid.getCellData(r - 1, ci) == panel.grid.getCellData(r - 1, ci - 1)) {
                        myMMRng.col = ci - 1;
                    }
                }
            }
            return myMMRng;
        }
        //else LeftLabel
        for (var ri = r; ri <= (cParser.ColumnLevelCount + cParser.RecordCount - 2) ; ri++) {
            if (panel.grid.getCellData(ri, c) != panel.grid.getCellData(ri + 1, c)) break;
            if (c == 0) {
                myMMRng.row2 = ri + 1;
            } else {
                if (panel.grid.getCellData(ri, c - 1) == panel.grid.getCellData(ri + 1, c - 1)) {
                    myMMRng.row2 = ri + 1;
                }
            }
        }
        for (var ri = r; ri >= iRLast0; ri--) {
            if (panel.grid.getCellData(ri, c) != panel.grid.getCellData(ri - 1, c)) break;
            if (c == 0) {
                myMMRng.row = ri - 1;
            } else {
                if (panel.grid.getCellData(ri, c - 1) == panel.grid.getCellData(ri + 1, c - 1)) {
                    myMMRng.row = ri - 1;
                }
            }
        }
        return myMMRng;
    }
    ***/




    //internal 
    this.myFlex.onSelectionChanged = function (e) {
        $("#status").text("selchg-" + e.range.bottomRow + ":" + e.range.rightCol);
        //if (!$(e.target).wijgrid('option', 'isLoaded')) { // ignore selection changes until wijgrid is not loaded
        //    return;
        //}

        //실제 호출되는 시점에서는 this가 ozolapsheet이 아니고 wijmoGrid임
        //var refozSheet = getRefOLAPSheet();
        var refozSheet = ozolapsheet_instMgr.getInstance(this);  
        if (e.range.isSingleCell) {
            if (refozSheet.myParser.IsCross)
                refozSheet.TipContent = "[전체] Rows:{0}  Columns:{1}".format(refozSheet.myParser.RecordCount + refozSheet.myParser.ColumnLevelCount, refozSheet.myParser.ColumnCount + refozSheet.myParser.RowLevelCount);
            else
                refozSheet.TipContent = "[현재] Row:{2} Column:{3} / [전체] Rows:{0}  Columns:{1}".format(refozSheet.myParser.RecordCount, refozSheet.myParser.ColumnCount, 
                                        e.range.topRow, e.range.leftCol + 1);
        } else {
            var iCnt = 0, dSum = 0.0, dVal;
            for (var r = e.range.topRow; r <= e.range.bottomRow; r++) {
                for (var c = e.range.leftCol; c <= e.range.rightCol; c++) {
                    switch (getCellTypeAt(refozSheet.myParser, r, c)) {
                        case wijmo.grid.CellType.Cell:
                            dVal = parseFloat(e.panel.getCellData(r, c).replace(",",""));
                            if (!isNaN(dVal)) {
                                iCnt++;
                                dSum += dVal;
                            }
                    }
                }
            }
            refozSheet.TipContent = "[선택영역] 개수:{0}  합계:{1}".format(iCnt, wijmo.Globalize.formatNumber(parseFloat(dSum),"N2"));
        }
    }
        
    this.myFlex.hostElement.addEventListener("mouseup", function (e) {
        $("#status").text("mouseup_x:" + e.clientX + "_y:" + e.clientY);

        //doMark(e, this.id);
        doMark(that, e);            
    });



}
////////////////////////////////////////////////////////////////////////////////////////////////////
// Eof oz_grid /////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////


   

if (!ozolapsheet.prototype.setxml) {
    ozolapsheet.prototype.setxml = function (xStyle) {
        this.GridSettings.SetXML(xStyle);
        if (this.StyleMode == 0) 
            this.GridStyleManager.SetXML(xStyle);
    }
}
if (!ozolapsheet.prototype.draw) {
    ozolapsheet.prototype.draw = function (clsRepHdlr) {
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

if (!ozolapsheet.prototype.createSheet) {
    ozolapsheet.prototype.createSheet = function () {
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

        //MergeManager를 사용하도록 한다.
        this.myFlex.mergeManager = new os_mergeManager(this.myFlex);

        return this.myFlex;
    }
}



//wijmo.grid.MergeManager를 상속받아서 Custom Merge를 수행한다.
function os_mergeManager(fg) {
    // Call the parent constructor
    wijmo.grid.MergeManager.call(this, fg);
}
// inherit Parent
os_mergeManager.prototype = new wijmo.grid.MergeManager();

// correct the constructor pointer because it points to Parent -- 이부분을 빼도 수행이되네??
os_mergeManager.prototype.constructor = os_mergeManager;

os_mergeManager.prototype.getMergedRange = function (panel, r, c) {
    //var refozSheet = getRefOLAPSheet();
    var refozSheet = ozolapsheet_instMgr.getInstance(panel.grid);

    var cParser = refozSheet.myParser;
    var iRLast0 = cParser.ColumnLevelCount - 1;
    var iCLast0 = cParser.RowLevelCount - 1;
    var myMMRng = new wijmo.grid.CellRange(r, c, r, c);
    if (panel.cellType != wijmo.grid.CellType.Cell) return myMMRng;
    if (r > iRLast0 && c > iCLast0) return myMMRng;         //Value
    if (r <= iRLast0 && c <= iCLast0) {                     //TopLeft
        for (var ci = c; ci <= (cParser.RowLevelCount + cParser.ColumnCount - 2); ci++) {
            if (panel.grid.getCellData(r, ci) != panel.grid.getCellData(r, ci + 1)) break;
            myMMRng.col2 = ci + 1;
        }
        for (var ci = c; ci >= 1; ci--) {
            if (panel.grid.getCellData(r, ci) != panel.grid.getCellData(r, ci - 1)) break;
            myMMRng.col = ci - 1;
        }
        for (var ri = r; ri <= iRLast0 - 1; ri++) {
            if (panel.grid.getCellData(ri, c) != panel.grid.getCellData(ri + 1, c)) break;
            myMMRng.row2 = ri + 1;
        }
        for (var ri = r; ri >= 1; ri--) {
            if (panel.grid.getCellData(ri, c) != panel.grid.getCellData(ri - 1, c)) break;
            myMMRng.row = ri - 1;
        }
        return myMMRng;
    }
    if (r <= iRLast0 && c > iCLast0) {                      //TopLabel
        if (r == iRLast0) return myMMRng;
        for (var ci = c; ci <= (cParser.RowLevelCount + cParser.ColumnCount - 2); ci++) {
            if (panel.grid.getCellData(r, ci) != panel.grid.getCellData(r, ci + 1)) break;
            if (r == 0) {
                myMMRng.col2 = ci + 1;
            } else {
                if (panel.grid.getCellData(r - 1, ci) == panel.grid.getCellData(r - 1, ci + 1)) {
                    myMMRng.col2 = ci + 1;
                }
            }
        }
        for (var ci = c; ci >= 1; ci--) {
            if (panel.grid.getCellData(r, ci) != panel.grid.getCellData(r, ci - 1)) break;
            if (r == 0) {
                myMMRng.col = ci - 1;
            } else {
                if (panel.grid.getCellData(r - 1, ci) == panel.grid.getCellData(r - 1, ci - 1)) {
                    myMMRng.col = ci - 1;
                }
            }
        }
        return myMMRng;
    }
    //else LeftLabel
    for (var ri = r; ri <= (cParser.ColumnLevelCount + cParser.RecordCount - 2); ri++) {
        if (panel.grid.getCellData(ri, c) != panel.grid.getCellData(ri + 1, c)) break;
        if (c == 0) {
            myMMRng.row2 = ri + 1;
        } else {
            if (panel.grid.getCellData(ri, c - 1) == panel.grid.getCellData(ri + 1, c - 1)) {
                myMMRng.row2 = ri + 1;
            }
        }
    }
    for (var ri = r; ri >= iRLast0; ri--) {
        if (panel.grid.getCellData(ri, c) != panel.grid.getCellData(ri - 1, c)) break;
        if (c == 0) {
            myMMRng.row = ri - 1;
        } else {
            if (panel.grid.getCellData(ri, c - 1) == panel.grid.getCellData(ri + 1, c - 1)) {
                myMMRng.row = ri - 1;
            }
        }
    }
    return myMMRng;
}




if (!ozolapsheet.prototype.drawSheet) {
    ozolapsheet.prototype.drawSheet = function (flex) {
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
    
if (!ozolapsheet.prototype.getFormattedValue) {
    ozolapsheet.prototype.getFormattedValue = function (r, c) {
        var objVal = this.myParser.MatrixValues[r][c];
        //1. 위치로부터 메져라벨 찾기
        var sMeasureLabel = "";
        if (this.myParser.IsMeasureOnColumn) 
            sMeasureLabel = this.myParser.MatrixColumnLabels[this.myParser.MeasureLevelIndex()][c];
        else
            sMeasureLabel = this.myParser.MatrixRowLabels[r][this.myParser.MeasureLevelIndex()];
            
        //'2. 메져라벨에서 메저 ClsOItem을 찾기
        var pClsOItem = this.myParser._lists.get(sMeasureLabel);
        if (pClsOItem == null) return objVal;
        //'3. DataType 찾기
        this._eDataType = pClsOItem.DataType;
        //4. 적용할 FormatString 찾기
        //this._sFormatStr = "";
        //if (this.myParser.IsCross) {
        //    var pClsF = this.myHdlr.AnalyticCube.getfieldbyname(pClsOItem.Name);
        //    if (pClsF) {
        //        if (pClsF.Type == "Measure") {
        //            this._sFormatStr = convCustom2Numeric(pClsF.displayformat);
        //            if (this._eDataType.toLowerCase() == "other") this._eDataType = pClsF.DataType;
        //        }
        //    }
        //} else {
        //    //should be added
        //}
        //if (this._sFormatStr == "") { //should be added
        //    this._sFormatStr = this.myHdlr.AnalyticCube.DisplayFormatOption.GetFormatString(this._eDataType);
        //}
        if (this._sFormatStr == "") {
            switch (this._eDataType.toLowerCase()) {
                case "real":
                    this._sFormatStr = "N2"; break;
                case "decimal":
                    this._sFormatStr = "N2"; break;
                case "integer":
                    this._sFormatStr = "N0"; break; 
                case "date":
                    this._sFormatStr = pClsOItem.DateFormat; break;
                default:
            }
        }
        //if (this.myParser.IsCross && this.myHdlr.HasMeasureFormulaOption) {
        //    //should be added (MeasureAnalysis)
        //}
        if (objVal == "") return objVal; //위치가 여기여야 함. FormatString정보 구하기 위해.
        return this.getFormattedValue2(objVal);
    }
}
if (!ozolapsheet.prototype.getFormattedValue2) {
    ozolapsheet.prototype.getFormattedValue2 = function (objVal) {
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

if (!ozolapsheet.prototype.cellFormatter) {
    ozolapsheet.prototype.cellFormatter = function (panel, r, c, cell) {
        if (panel.cellType != wijmo.grid.CellType.Cell) return;
        //실제 호출되는 시점에서는 this가 ozolapsheet이 아니고 wijmoGrid임
        //var refozSheet = getRefOLAPSheet();   
        var refozSheet = ozolapsheet_instMgr.getInstance(this);

        //wj-alt 사용안함. label 영역
        if ($(cell).hasClass("wj-alt")) {
            $(cell).removeClass("wj-alt");
        }
        var diffR = refozSheet.myParser.ColumnLevelCount;
        var bIsAlter = false;
        if ((r + 1 - diffR) % 2 == 0) bIsAlter = true;
        var iRow0 = r;

        if (refozSheet.StyleMode == 0) { //Border
            cell.style.borderRight = refozSheet.GridStyleManager.BorderRight;
            cell.style.borderBottom = refozSheet.GridStyleManager.BorderBottom;
        }

        var hitOn = hitTest(refozSheet, refozSheet.myParser, iRow0, c, true);
        switch (hitOn) {
            case refozSheet.enum_hitArea.Value:
                // collevel 에 따라 표시되는 모습이 달라지므로 사용안함
                //if ($(cell).hasClass("wj-alt")) {
                //    bIsAlter = true;
                //    $(cell).removeClass("wj-alt");
                //}
                if (refozSheet.StyleMode == 0) {
                 	if (bIsAlter) {
                 	    cell.style.backgroundColor = refozSheet.GridStyleManager.ValueArea.AlterBackColor;
                 	    cell.style.color = refozSheet.GridStyleManager.ValueArea.AlterForeColor;
                 	} else {
                 	    cell.style.backgroundColor = refozSheet.GridStyleManager.ValueArea.BackColor;
                 	    cell.style.color = refozSheet.GridStyleManager.ValueArea.ForeColor;
                 	}
	                cell.style.fontSize = refozSheet.GridStyleManager.ValueArea.FontSize;
	                cell.style.fontWeight = (refozSheet.GridStyleManager.ValueArea.FontBold == true ? "bold" : "normal");
	                cell.style.fontItalic = (refozSheet.GridStyleManager.ValueArea.FontItalic == true ? "italic" : "normal");
	                cell.style.textAlign = refozSheet.GridStyleManager.ValueArea.HAlignment;

	            } else {
		                if (bIsAlter)
		                    $(cell).addClass("obz-value-alt");
		                else
		                    $(cell).addClass("obz-value");
                }
                break;
            case refozSheet.enum_hitArea.ColHeader:
                if (refozSheet.StyleMode == 0) {
                    cell.style.backgroundColor = refozSheet.GridStyleManager.ColHeaderArea.BackColor; 
                    cell.style.color = refozSheet.GridStyleManager.ColHeaderArea.ForeColor;
                    cell.style.fontSize = refozSheet.GridStyleManager.ColHeaderArea.FontSize;
                    cell.style.fontWeight = (refozSheet.GridStyleManager.ColHeaderArea.FontBold == true ? "bold" : "normal" );
                    cell.style.fontItalic = (refozSheet.GridStyleManager.ColHeaderArea.FontItalic == true ? "italic" : "normal");
                    cell.style.textAlign = (refozSheet.GridStyleManager.ColHeaderArea.HAlignment);
                    cell.innerHTML = "<div>" + cell.innerHTML + "</div>";
                    wijmo.setCss(cell.children[0], {
                        position: 'relative',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    });
                    //sort icon
                 	//asc <span class="wijmo-wijgrid-sort-icon  ui-icon ui-icon-triangle-1-n" style="cursor: pointer;"></span>
                 	//dsc <span class="wijmo-wijgrid-sort-icon  ui-icon ui-icon-triangle-1-s" style="cursor: pointer;"></span>
                 	//cell.innerHTML = wijmo.escapeHtml(content) + '&nbsp;' + this._getSortIcon(col);
                    //CellFactory.prototype._getSortIcon = function (col) {
                    //    return '<span class="wj-glyph-' + (col.currentSort == '+' ? 'up' : 'down') + '"></span>';
                    //};
                } else {
                    $(cell).addClass("obz-colheader");
				}
                break;
            case refozSheet.enum_hitArea.RowHeader:
                if (refozSheet.StyleMode == 0) {
                    cell.style.backgroundColor = refozSheet.GridStyleManager.RowHeaderArea.BackColor;
                    cell.style.color = refozSheet.GridStyleManager.RowHeaderArea.ForeColor;
                    cell.style.fontSize = refozSheet.GridStyleManager.RowHeaderArea.FontSize;
                    cell.style.fontWeight = (refozSheet.GridStyleManager.RowHeaderArea.FontBold == true ? "bold" : "normal");
                    cell.style.fontItalic = (refozSheet.GridStyleManager.RowHeaderArea.FontItalic == true ? "italic" : "normal");
                    cell.style.textAlign = (refozSheet.GridStyleManager.RowHeaderArea.HAlignment);
                    cell.innerHTML = "<div>" + cell.innerHTML +"</div>";
                    wijmo.setCss(cell.children[0], {
                        position: 'relative',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    });
                } else {
                    $(cell).addClass("obz-rowheader");
                }
                break;
            case refozSheet.enum_hitArea.GrandTotalHeader:
                if (refozSheet.StyleMode == 0) {
                    cell.style.backgroundColor = refozSheet.GridStyleManager.GrandTotalHeaderArea.BackColor;
                    cell.style.color = refozSheet.GridStyleManager.GrandTotalHeaderArea.ForeColor;
                    cell.style.fontSize = refozSheet.GridStyleManager.GrandTotalHeaderArea.FontSize;
                    cell.style.fontWeight = (refozSheet.GridStyleManager.GrandTotalHeaderArea.FontBold == true ? "bold" : "normal");
                    cell.style.fontItalic = (refozSheet.GridStyleManager.GrandTotalHeaderArea.FontItalic == true ? "italic" : "normal");
                    cell.style.textAlign = (refozSheet.GridStyleManager.GrandTotalHeaderArea.HAlignment);
                    cell.innerHTML = "<div>" + cell.innerHTML + "</div>";
                    wijmo.setCss(cell.children[0], {
                        position: 'relative',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    });
                } else {
                    $(cell).addClass("obz-gtheader");
                }
                break;
            case refozSheet.enum_hitArea.SubtotalHeader:
                if (refozSheet.StyleMode == 0) {
                    cell.style.backgroundColor = refozSheet.GridStyleManager.SubtotalHeaderArea.BackColor;
                    cell.style.color = refozSheet.GridStyleManager.SubtotalHeaderArea.ForeColor;
                    cell.style.fontSize = refozSheet.GridStyleManager.SubtotalHeaderArea.FontSize;
                    cell.style.fontWeight = (refozSheet.GridStyleManager.SubtotalHeaderArea.FontBold == true ? "bold" : "normal");
                    cell.style.fontItalic = (refozSheet.GridStyleManager.SubtotalHeaderArea.FontItalic == true ? "italic" : "normal");
                    cell.style.textAlign = (refozSheet.GridStyleManager.SubtotalHeaderArea.HAlignment);
                    cell.innerHTML = "<div>" + cell.innerHTML + "</div>";
                    wijmo.setCss(cell.children[0], {
                        position: 'relative',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    });
                } else {
                    $(cell).addClass("obz-stheader");
                }
                break;
            case refozSheet.enum_hitArea.GrandTotalValue:
                if (refozSheet.StyleMode == 0) {
                    if (refozSheet.GridStyleManager.GrandTotalValueArea.BackColor != refozSheet.GridStyleManager.ValueArea.BackColor) {
                        cell.style.backgroundColor = refozSheet.GridStyleManager.GrandTotalValueArea.BackColor;
                        cell.style.color = refozSheet.GridStyleManager.GrandTotalValueArea.ForeColor;
                    } else {
                        if (bIsAlter) {
                            cell.style.backgroundColor = refozSheet.GridStyleManager.ValueArea.AlterBackColor;
                            cell.style.color = refozSheet.GridStyleManager.ValueArea.AlterForeColor;
                        } else {
                            cell.style.backgroundColor = refozSheet.GridStyleManager.ValueArea.BackColor;
                            cell.style.color = refozSheet.GridStyleManager.ValueArea.ForeColor;
                        }
                    }
                    cell.style.fontSize = refozSheet.GridStyleManager.GrandTotalValueArea.FontSize;
                    cell.style.fontWeight = (refozSheet.GridStyleManager.GrandTotalValueArea.FontBold == true ? "bold" : "normal");
                    cell.style.fontItalic = (refozSheet.GridStyleManager.GrandTotalValueArea.FontItalic == true ? "italic" : "normal");
                    cell.style.textAlign = (refozSheet.GridStyleManager.GrandTotalValueArea.HAlignment);
                } else {
                    $(cell).addClass("obz-gtvalue");
                }
                break;
            case refozSheet.enum_hitArea.SubtotalValue:
                if (refozSheet.StyleMode == 0) {
                    if (refozSheet.GridStyleManager.SubtotalValueArea.BackColor != refozSheet.GridStyleManager.ValueArea.BackColor) {
                        cell.style.backgroundColor = refozSheet.GridStyleManager.SubtotalValueArea.BackColor;
                        cell.style.color = refozSheet.GridStyleManager.SubtotalValueArea.ForeColor;
                    } else {
                        if (bIsAlter) {
                            cell.style.backgroundColor = refozSheet.GridStyleManager.ValueArea.AlterBackColor;
                            cell.style.color = refozSheet.GridStyleManager.ValueArea.AlterForeColor;
                        } else {
                            cell.style.backgroundColor = refozSheet.GridStyleManager.ValueArea.BackColor;
                            cell.style.color = refozSheet.GridStyleManager.ValueArea.ForeColor;
                        }
                    }
                    cell.style.fontSize = refozSheet.GridStyleManager.SubtotalValueArea.FontSize;
                    cell.style.fontWeight = (refozSheet.GridStyleManager.SubtotalValueArea.FontBold == true ? "bold" : "normal");
                    cell.style.fontItalic = (refozSheet.GridStyleManager.SubtotalValueArea.FontItalic == true ? "italic" : "normal");
                    cell.style.textAlign = (refozSheet.GridStyleManager.SubtotalValueArea.HAlignment);
                } else {
                    $(cell).addClass("obz-stvalue");
                }
                break;
            case refozSheet.enum_hitArea.TopLeft:
                if (refozSheet.StyleMode == 0) {
                    cell.style.backgroundColor = refozSheet.GridStyleManager.TopLeftArea.BackColor;
                    cell.style.color = refozSheet.GridStyleManager.TopLeftArea.ForeColor;
                    cell.style.fontSize = refozSheet.GridStyleManager.TopLeftArea.FontSize;
                    cell.style.fontWeight = (refozSheet.GridStyleManager.TopLeftArea.FontBold == true ? "bold" : "normal");
                    cell.style.fontItalic = (refozSheet.GridStyleManager.TopLeftArea.FontItalic == true ? "italic" : "normal");
                    cell.style.textAlign = (refozSheet.GridStyleManager.TopLeftArea.HAlignment);
                    cell.innerHTML = "<div>" + cell.innerHTML + "</div>";
                    wijmo.setCss(cell.children[0], {
                        position: 'relative',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    });
                } else {
                    $(cell).addClass("obz-topleft");
                }
                break;
        }
    }        
}

if (!ozolapsheet.prototype.getMeasureItemFromValuePosition) {
    ozolapsheet.prototype.getMeasureItemFromValuePosition = function (refozSheet, iRow0, iCol0) {
        if (refozSheet.myParser.IsCross == false) return null;
        //colmeasure as oz_HashTable
        //메져가 하나일 때는 무조건 해당
        if (refozSheet.myHdlr.colmeasure.Count() == 1 ) return refozSheet.myHdlr.colmeasure.ItemByIndex(0);
        var sMeasureLabel = "";
        if (refozSheet.myParser.IsMeasureOnColumn )
            sMeasureLabel = refozSheet.myParser.MatrixColumnLabels[refozSheet.myParser.MeasureLevelIndex()][iCol0 - refozSheet.myParser.RowLevelCount];
        else
            sMeasureLabel = refozSheet.myParser.MatrixRowLabels[iRow0 - refozSheet.myParser.ColumnLevelCount][refozSheet.myParser.MeasureLevelIndex()];
     
        var field;
        for (var i = 0; i < refozSheet.myHdlr.colmeasure.Keys.length; i++) {
            field = refozSheet.myHdlr.colmeasure.Values[i];
            if (field.Alias == sMeasureLabel) {
                return field;
            }
        }
        return null;
    }
}

function convCustom2Numeric(sCust) {
    if (sCust == null) return "";
    if (sCust == "") return "";
    var sFmt = sCust;
    if (sFmt.indexOf("%") >= 0) {
        sFmt = sFmt.replace("%", "");
        var pos = sFmt.indexOf(".");
        if (pos >= 0) {
            sFmt = "P" + sFmt.substring(pos + 1).length;
        } else {
            sFmt = "P";
        }
    }
    if (sFmt.indexOf("#") >= 0) {
        var pos = sFmt.indexOf(".");
        if (pos >= 0) {
            sFmt = "N" + sFmt.substring(pos + 1).length;
        } else {
            sFmt = "N0";
        }
    }
    return sFmt
}

//function doMark(e, myID) {
function doMark(that, e) {
    //고객군생성 메뉴를 위한 정보 만들때 참조
    var refozSheet = that;  //getRefOLAPSheet();
    //var refozSheet = getRefOLAPSheet();
    var ht = refozSheet.myFlex.hitTest(e.pageX, e.pageY);
    //if (wijmo.grid.CellType(ht.cellType) )
    //alert("mouseup" + (ht.cellType));
    if (ht.cellType == 1) {
        //alert(ht.row);
        if (refozSheet.myParser.IsCross == false) return;
        var CRcollCell = new ozf_Collection();
        var CRcollRow = new ozf_Collection();
        var CRcollCol = new ozf_Collection();
        var bVArea = false, bRArea = false, bCArea = false;
        var cellrng = refozSheet.myFlex.selection;
        var revR;
        for (var r = cellrng.topRow; r <= cellrng.bottomRow; r++) {
            revR = r;
            for (var c = cellrng.leftCol; c <= cellrng.rightCol; c++) {
                switch (getCellTypeAt(refozSheet.myParser, revR, c)) {
                    case wijmo.grid.CellType.Cell:
                        bVArea = true;
                        CRcollCell.Add({ row: revR, col: c }, "");
                        break;
                    case wijmo.grid.CellType.RowHeader:
                        bRArea = true;
                        if (!CRcollRow.containsKey(revR)) CRcollRow.Add(revR, revR);
                        break;
                    case wijmo.grid.CellType.ColumnHeader:
                        bCArea = true;
                        if (!CRcollCol.containsKey(c)) CRcollCol.Add(c, c);
                        break;
                }
            }
        }
        if (!bVArea && !bCArea && !bRArea) return;
        var bHasTotalV = false;
        var sDrillType = "Detail";
        var cnt, r, c, rIdx, cell, sCData, sCDLabel, sCD1;
        var xWrt = new oz_XMLWriter();
        xWrt.WriteStartDocument();
        xWrt.WriteStartElement("CellInfo");
        if (bVArea) {
            sDrillType = "Detail";
            cnt = CRcollCell.length;
            for (var i = 0; i < cnt; i++) {
                cell = CRcollCell.ItemByIndex(i);
                r = cell["row"];
                c = cell["col"];
                //rIdx = refozSheet.myFlex.rows.getItemAt(r).dataItem;
                //var tagCells = $("#" + myID);
                //tagCells = tagCells.children().first().children().first().children().first();
                //var posidx = (r - 1) * (refozSheet.myParser.ColumnCount + refozSheet.myParser.RowLevelCount);
                //posidx += (c - 1);
                //rIdx = tagCells.children().eq(posidx); // r;
                rIdx = r;
                rIdx -= refozSheet.myParser.ColumnLevelCount;
                xWrt.WriteStartElement("Value");
                xWrt.WriteAttributeString("value", refozSheet.myParser.MatrixRowLabels[rIdx][c]); //refozSheet.myFlex.getCellData(r, c));
                xWrt.WriteStartElement("RowLabel");
                var cntC = 0;
                sCData = "";
                for (var f = 0; f < refozSheet.myHdlr.colrow.length() ; f++) {
                    sCData += refozSheet.myHdlr.colrow.ItemByIndex(f).Name;
                    sCData += Const_CDataDelimiter();
                }
                xWrt.WriteAttributeString("fieldid", sCData)
                sCData = "";
                for (var c2 = 0; c2 < refozSheet.myParser.RowLevelCount; c2++) {
                    sCD1 = refozSheet.myParser.MatrixRowLabels_Code[rIdx][c2];
                    if (sCD1 == "") sCD1 = refozSheet.myParser.MatrixRowLabels[rIdx][c2];
                    sCData += sCD1;
                    sCData += Const_CDataDelimiter();
                }
                if (refozSheet.GridSettings.HasGrandTotalForColumns) {
                    if (sCData.indexOf(refozSheet.myParser.GrandTotalLabel) > -1) bHasTotalV = true;
                }
                if (refozSheet.GridSettings.HasSubtotalsForColumns) {
                    if (sCData.indexOf(refozSheet.myParser.SubtotalLabel) > -1) bHasTotalV = true;
                }
                xWrt.WriteString(sCData);
                xWrt.WriteEndElement(); //RowLabel
                xWrt.WriteStartElement("ColumnLabel");
                sCData = "";
                for (var f = 0; f < refozSheet.myHdlr.colcolumn.length() ; f++) {
                    sCData += refozSheet.myHdlr.colcolumn.ItemByIndex(f).Name;
                    sCData += Const_CDataDelimiter();
                }
                xWrt.WriteAttributeString("fieldid", sCData)
                sCData = "";
                for (var r2 = 0; r2 < refozSheet.myParser.ColumnLevelCount; r2++) {
                    sCD1 = refozSheet.myParser.MatrixColumnLabels_Code[r2][c];
                    if (sCD1 == "") sCD1 = refozSheet.myParser.MatrixColumnLabels[r2][c];
                    sCData += sCD1;
                    sCData += Const_CDataDelimiter();
                }
                if (refozSheet.GridSettings.HasGrandTotalForRows) {
                    if (sCData.indexOf(refozSheet.myParser.GrandTotalLabel) > -1) bHasTotalV = true;
                }
                if (refozSheet.GridSettings.HasSubtotalsForRows) {
                    if (sCData.indexOf(refozSheet.myParser.SubtotalLabel) > -1) bHasTotalV = true;
                }
                xWrt.WriteString(sCData);
                xWrt.WriteEndElement(); //ColumnLabel
                xWrt.WriteEndElement(); //Value
            }
        } else if (bRArea) {
            sDrillType = "Row";
            cnt = CRcollRow.length;
            for (var i = 0; i < cnt; i++) {
                xWrt.WriteStartElement("RowLabel");
                r = CRcollRow.ItemByIndex(i);
                rIdx = r;
                rIdx -= refozSheet.myParser.ColumnLevelCount;
                var cntC = 0;
                sCData = "";
                sCDLabel = "";
                for (var f = 0; f < refozSheet.myHdlr.colrow.length() ; f++) {
                    sCData += refozSheet.myHdlr.colrow.ItemByIndex(f).Name;
                    sCData += Const_CDataDelimiter();
                    sCD1 = refozSheet.myParser.MatrixRowLabels_Code[rIdx][cntC];
                    if (sCD1 == "") sCD1 = refozSheet.myParser.MatrixRowLabels[rIdx][cntC];
                    sCDLabel += sCD1;
                    sCDLabel += Const_CDataDelimiter();
                    cntC += 1;
                    if (cntC > c) break;
                }
                xWrt.WriteAttributeString("fieldid", sCData)
                if (refozSheet.GridSettings.HasGrandTotalForColumns) {
                    if (sCDLabel.indexOf(refozSheet.myParser.GrandTotalLabel) > -1) bHasTotalV = true;
                }
                if (refozSheet.GridSettings.HasSubtotalsForColumns) {
                    if (sCDLabel.indexOf(refozSheet.myParser.SubtotalLabel) > -1) bHasTotalV = true;
                }
                xWrt.WriteString(sCDLabel);
                xWrt.WriteEndElement(); //RowLabel
            }
        } else if (bCArea) {
            sDrillType = "Column";
            cnt = CRcollCol.length;
            for (var i = 0; i < cnt; i++) {
                xWrt.WriteStartElement("ColumnLabel");
                r = CRcollCol.ItemByIndex(i);
                var cntR = 0;
                sCData = "";
                sCDLabel = "";
                for (var f = 0; f < refozSheet.myHdlr.colcolumn.length() ; f++) {
                    sCData += refozSheet.myHdlr.colcolumn.ItemByIndex(f).Name;
                    sCData += Const_CDataDelimiter();
                    sCD1 = refozSheet.myParser.MatrixColumnLabels_Code[cntR][c];
                    if (sCD1 == "") sCD1 = refozSheet.myParser.MatrixColumnLabels[cntR][c];
                    sCDLabel += sCD1;
                    sCDLabel += Const_CDataDelimiter();
                    cntR += 1;
                    if (cntR > r) break;
                }
                xWrt.WriteAttributeString("fieldid", sCData)
                if (refozSheet.GridSettings.HasGrandTotalForColumns) {
                    if (sCDLabel.indexOf(refozSheet.myParser.GrandTotalLabel) > -1) bHasTotalV = true;
                }
                if (refozSheet.GridSettings.HasSubtotalsForColumns) {
                    if (sCDLabel.indexOf(refozSheet.myParser.SubtotalLabel) > -1) bHasTotalV = true;
                }
                xWrt.WriteString(sCDLabel);
                xWrt.WriteEndElement(); //RowLabel
            }
        }
        xWrt.WriteEndElement(); //CellInfo
        xWrt.WriteEndDocument();
        var sOptXML = xWrt.flush();
        xWrt.close();

        //alert(sOptXML);
        $("#status").text(sOptXML);
       
    }
}
function getCellTypeAt(refParser, r, c) {
    if (r < 0 || c < 0) return wijmo.grid.CellType.None;
    if (r < refParser.ColumnLevelCount && c < refParser.RowLevelCount) return wijmo.grid.CellType.TopLeft;
    if (r < refParser.ColumnLevelCount && c >= refParser.RowLevelCount) return wijmo.grid.CellType.ColumnHeader;
    if (r >= refParser.ColumnLevelCount && c < refParser.RowLevelCount) return wijmo.grid.CellType.RowHeader;
    if (r >= refParser.ColumnLevelCount && c >= refParser.RowLevelCount) return wijmo.grid.CellType.Cell;
    return wijmo.grid.CellType.None;
}
function hitTest(refozSheetSheet, refParser, iRow0, iCol0, bDetail) {
    if (iRow0 < refParser.ColumnLevelCount && iCol0 < refParser.RowLevelCount) {
        return refozSheetSheet.enum_hitArea.TopLeft;
    }
    if (iRow0 < refParser.ColumnLevelCount && iCol0 < (refParser.RowLevelCount + refParser.ColumnCount)) {
        if (bDetail) {
            var iRelCol = iCol0 - refParser.RowLevelCount;
            if (refozSheetSheet.ColHeaderTotalState[iRelCol] == -1) {
                if (refozSheetSheet.GridSettings.HasGrandTotalForRows) {
                    if (refParser.MatrixColumnLabels[0][iRelCol] == refParser.GrandTotalLabel) {
                        refozSheetSheet.ColHeaderTotalState[iRelCol] = 0
                        return refozSheetSheet.enum_hitArea.GrandTotalHeader;
                    }
                }
                if (refozSheetSheet.GridSettings.HasSubtotalsForRows) {
                    var bFound = false;
                    var iLast = refParser.ColumnLevelCount - 1;
                    if (refParser.IsMeasureOnColumn) iLast--;
                    for (var idx = 1; idx <= iLast; idx++) { //subtotal은 첫레벨은 없음
                        if (refParser.MatrixColumnLabels[idx][iRelCol] == refParser.SubTotalLabel) {
                            refozSheetSheet.ColHeaderTotalState[iRelCol] = idx;
                            bFound = true;
                            break;
                        }
                    }
                    if (bFound)
                        return refozSheetSheet.enum_hitArea.SubtotalHeader;
                }
            } else {
                if (refozSheetSheet.ColHeaderTotalState[iRelCol] == 0) {
                    return refozSheetSheet.enum_hitArea.GrandTotalHeader
                } else if (refozSheetSheet.ColHeaderTotalState[iRelCol] >= 1) {
                    if (iRow0 >= refozSheetSheet.ColHeaderTotalState[iRelCol])
                        return refozSheetSheet.enum_hitArea.SubtotalHeader;
                }
            }
        }
        return refozSheetSheet.enum_hitArea.ColHeader;
    }
    if (iCol0 < refParser.RowLevelCount && iRow0 < (refParser.ColumnLevelCount + refParser.RecordCount)) {
        if (bDetail) {
            var iRelRow = iRow0 - refParser.ColumnLevelCount;
            if (refozSheetSheet.RowHeaderTotalState[iRelRow] == -1) {
                if (refozSheetSheet.GridSettings.HasGrandTotalForColumns) {
                    if (refParser.MatrixRowLabels[iRelRow][0] == refParser.GrandTotalLabel) {
                        refozSheetSheet.RowHeaderTotalState[iRelRow] = 0;
                        return refozSheetSheet.enum_hitArea.GrandTotalHeader;
                    }
                }
                if (refozSheetSheet.GridSettings.HasSubtotalsForColumns) {
                    var bFound = false;
                    var iLast = refParser.RowLevelCount - 1;
                    if (refParser.IsMeasureOnColumn == false) iLast -= 1;
                    for (var idx = 1; idx <= iLast; idx++) { //subtotal은 첫레벨은 없음
                        if (refParser.MatrixRowLabels[iRelRow][idx] == refParser.SubTotalLabel) {
                            refozSheetSheet.RowHeaderTotalState[iRelRow] = idx;
                            bFound = true;
                            break;
                        }
                    }
                    if (bFound) return refozSheetSheet.enum_hitArea.SubtotalHeader;
                }
            } else {
                if (refozSheetSheet.RowHeaderTotalState[iRelRow] == 0) {
                    return refozSheetSheet.enum_hitArea.GrandTotalHeader;
                } else if (refozSheetSheet.RowHeaderTotalState[iRelRow] >= 1) {
                    if (iCol0 >= refozSheetSheet.RowHeaderTotalState[iRelRow])
                        return refozSheetSheet.enum_hitArea.SubtotalHeader;
                }
            }
        }
        return refozSheetSheet.enum_hitArea.RowHeader;
    }
    if (iRow0 < (refParser.ColumnLevelCount + refParser.RecordCount) && iCol0 < (refParser.RowLevelCount + refParser.ColumnCount)) {
        if (bDetail) {
            var iRelCol = iCol0 - refParser.RowLevelCount; // relativeCol(refParser, iCol0);
            var iRelRow = iRow0 - refParser.ColumnLevelCount; //relativeRow(_clsRrefParseresult, iRow0);
            if (refozSheetSheet.RowHeaderTotalState[iRelRow] = -1) {
            }
            // 'GrandTotal영역이 우선
            if (refozSheetSheet.RowHeaderTotalState[iRelRow] == 0) {
                return refozSheetSheet.enum_hitArea.GrandTotalValue;
            }
            if (refozSheetSheet.ColHeaderTotalState[iRelCol] == 0) {
                return refozSheetSheet.enum_hitArea.GrandTotalValue;
            }
            //'SubTotal
            if (refozSheetSheet.RowHeaderTotalState[iRelRow] >= 1) {
                return refozSheetSheet.enum_hitArea.SubtotalValue;
            }
            if (refozSheetSheet.ColHeaderTotalState[iRelCol] >= 1) {
                return refozSheetSheet.enum_hitArea.SubtotalValue;
            }
        }
        return refozSheetSheet.enum_hitArea.Value
    }
    return refozSheetSheet.enum_hitArea.Other;
}

