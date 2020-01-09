/*
 * oz.grid.js
 * obzen Grid Control, Copyright 2000 - 2015 obzen, Inc
 *
 * 학습용으로 작업한 khlee_flexgrid.js 참고로 작성
 *
 * 참고
 * FlexGrid Class   http://wijmo.com/5/docs/topic/wijmo.grid.FlexGrid.Class.html
 * wijmo FlexGrid import/export Excel  http://demos.wijmo.com/5/Angular/ExcelImportExport/ExcelImportExport/
 *
 *
 *
 * Pivot Grid Sample  http://demos.wijmo.com/5/Angular/OlapShowAs/OlapShowAs/
 *
 *
 *
 */


/******************************************************************************

wijmo.FlexGrid의 셀 영역은 다음처럼 구분된다.

    ┌──────────────┬─────────────────────────┐
    │ topLeftCells │      columnHeaders      │
    ├──────────────┼─────────────────────────┤-+-
    │              │                         │ |
    │              │                         │ | 
    │ rowHeaders   │                         │rows 
    │              │                         │ | 
    │              │                         │ |
    └──────────────┴─────────────────────────┘-+-
                   |←--------columns--------→| 

    topLeftCells, columnHeaders, rowHeaders As GridPanel
    columns As ColumnCollection
    rows As RowCollection
    
    GridPanel.columns As ColumnCollection
    GridPanel.rows As RowCollection
    GridPanel.getCellData(r, c[, formatted])
    GridPanel.setCellData(r, c, value)

    fg.getCellData(r, c[, formatted])
    fg.setCellData(r, c, value)



** checkColumn, radioButtonColumn 등은 selectionMode 속성에 따라서 추가/삭제 된다.
    selectionMode = None 일때는 두개 컬럼이 모두 사라지고, 
    selectionMode = Row 일때는 radioButtonColumn이 나타남.
        .NET 에서는 showRadioButton값이 true 일때만 라디오컬럼이 나타나고, false면 체크박스를 보여줬는데
        라디오버튼이 뒤늦게 추가 되면서 showRadioButton을 사용해 구분하고 있지만,
        Web에선 selectionMode = Row 일때는 showRadioButton값을 무시하고 라디오로 보여준다.
    selectionMode = ListBox 일때는 checkColumn이 나타난다.

** .NET C1FlexGrid SelectionMode vs wijmo.FlexGrid selectionMode
    0-Default               0-None
    1-Cell                  1-Cell
    2-CellRange             2-CellRange
    3-Row                   3-Row
    4-RowRange              4-RowRange
    5-Column                5-ListBox
    6-ColumnRange
    7-ListBox

setAllowMerging 메서드 확인할것.



[2017/12/27]
- checkboxPressed 변수 추가. boolean타입 컬럼의 checkbox를 클릭했을때는 검출하기 위해서.

[2017/12/22]
- getBackColor, setBackColor 메서드에서 오류 확인됨. this.backColor 배열에 값을 넣고 배경색을 반영하는 경우
    그리드의 헤더를 클릭해서 sort가 될때 itemSource와 연결된 속성이 아니다 보니 항상 동일한 셀의 배경색을 바꾸는 문제가 있다.
    C1FlexGrid의 UserData같은 속성이 있으면 좋겠는데 없어서 구현을 못한다.
- getCellTagData, setCellTagData 메서드와 this.cellTags 속성도 this.backColor 처럼 sort가 될때 문제가됨.

[2017/12/21]
- clipSeparators 속성 추가.
- autoColumnWidthByHeaderSuffix 메서드 수정.
- beginUpdate, endUpdate 메서드 추가.

[2017/12/20]
- initialize 메서드에서 마지막 컬럼의 minWidth를 지정하는 부분은 생략하고, setAutoSizeColumns 메서드에서 컬럼폭 조정부분을 수정함.

[2017/12/19]
- findRow0, findRow 메서드에서 검색 컬럼의 dataType이 Date 이거나 입력값이 date형 일때 입력값을 문자열로 바꿔서 비교한다.

[2017/12/18]
- allColumnValue 메서드에서 isSelected(r) 메서드로 체크한다.

[2017/12/11]
- setColumnEditor에서 oz_combo컨트롤의 Caption값이 문자열로 되어 있어서, 그 값이 숫자임에도
    sort를 하면 원하는 정렬이 되지 않는다. 그래서 isNumeric 메서드를 추가해서 Caption의 내용이
    숫자값을 가질때는 숫자형으로 변경하는 과정을 추가함.
- createSheet 메서드에서 itemsSource를 빈 상태로 생성한다.
        
[2017/12/09]
- sort 메서드 수정. CollectionView객체에 대해서 SortDescription객체를 추가하여 sort하자.

[2017/12/08]
- setItemsSource 메서드에서 itemsSource에 배열을 직접 지정하지 말고, CollectionView 객체를 만들어서
    지정하도록 수정한다. 이렇게 해야 itemsSource를 삭제할때 rows도 함께 삭제된다.
    행 추가/삭제등의 작업시 CollectionView에 대해서 수행해야 컨트롤의 view에도 반영이되고,
    sort/filter등을 수행할때도 CollectionView에 대해 수행해야 한다.

[2017/12/06]
- setItemsSource 메서드 수정. binding이 정의되지 않은 컬럼에 대해서는 임의로 binding 키값을 정의한다.
    binding이 정의되어 있어야만 setCellData 메서드로 값을 지정할때 itemsSource에도 반영할 수 있고,
    itemsSource가 반영되어야 헤더를 클릭했을때 sort가 된다.

[2017/12/05]
- this.fgObj.cellEditEnding 이벤트의 핸들러 추가.
    콤보값이 변경되었을때 setColumnEditor에서 지정한 combo컨트롤에게 알려야 한다.

[2017/11/30] 
- hidColumn 메서드가 반대로 동작하는 오류 수정.

[2017/09/21]
    setTextAlignFixed, setTextAlign, autoColumnWithByHeaderSuffix, setColumnEditor 메서드 추가.

[2017/09/20]
    fixedRows, rows, cols, enabled, visible 속성 추가
    getFixedRows(), setFixedRows(), getRows(), setRows(), getCols(), setCols() 메서드 사용중지 (아직은 삭제하지 않고 유지)
    allowSorting, allowResizing, text, wordWrap 속성 추가

[2017/02/21] initialize 메서드의 두번째 파라미터로 True를 지정하면 그때 MergeManager를 사용하도록 한다.
    물론 MergeManager를 사용하게 되면 fgObj.columns[c].allowMerging, fgObj.rows[r].allowMerging 등이 수행되지 않는다.

[2017/01/17] rowCur 속성추가. rowSel의 경우는 radioButtonColumn을 사용하면 selectedRadioRow값을 사용하는데,
    rowCur은 radioButtonColumn의 유무에 상관없이 현재 선택된 행을 0베이스 값으로 리턴합니다.

[2017/01/09] Map 객체는 IE11 이후로 지원하기 때문에 Map 대신에 oz.framework.js에 정의된 ozf_Collection을 사용한다.

[2016/12/08] tooltipVisible, useDataForTooltip 추가.

[2016/12/05] 공통스크립트의 마스킹 기능을 사용하기 위해서 executeMaskingProc, 
    getCellTagData, setCellTagData 추가하고, frameSecurityObject객체의 GridMaskingProc를 호출한다.


[2016/12/02] oz_grid_InstanceManager 클래스에 clear 메서드 추가.
[2016/11/25] radioButtonColumn 추가. 기존에는 항상 checkColumn이 추가되어 있으면서 Visible만 변경하곤 했는데..
    이제는 checkColumn, radioButtonColumn 이 selectionMode 속성에 따라서 추가/삭제 되도록 수정함.

[2016/11/24] setRowHeightPx, setColWidthPx 메서드 추가.

[2016/11/03] MergeManager를 정의해서 Custom으로 merge를 수행하는 경우
    fgObj.columns[c].allowMerging, fgObj.rows[r].allowMerging 등이 수행되지 않는 문제가 있다.
    그래서 createSheet메서드에서 MergeManager를 지정하는 방법은 잠시 생략한다.

[2016/11/02]
    - setAllowMerging, getMergeCol, setMergeCol 메서드 추가.
    - selectionMode가 None일때는 체크컬럼을 제외한 컬럼개수를 리턴해야 한다.
[2016/10/25]
    getRowHeight, setRowHeight, getColWidth, setColWidth 메서드 추가.
    colWidthMax, colWidthMin 속성 추가.
    tw2px, px2tw 메서드 추가.
    headersVisible 속성 추가.

[2016/10/19] setItemsSource 메서드 호출시 사용된 데이터값에 빈 공백이나, 공백 1개(" ")만 들어 있는경우..
    해당 컬럼의 dataType이 Number이면 wijmo FlexGrid 에서는 'NaN' 으로 표시된다.
    이것은 Number형의 format에 사용된 Standard Numeric Format(https://msdn.microsoft.com/en-us/library/dwhawy9k(v=vs.110).aspx)
    의 결과이므로 어쩔수없이 'NaN' 이다.
    dataType이 Number형이면서 'NaN'으로 표시되는걸 피하기 위해서 소스 데이터를 하나씩 검증해서
    빈 공백이나, 공백 1개가 있을때는 '0'으로 변경하도록 한다.

[2016/10/17] mergeCellRanges 배열, addMergeCell 메서드를 추가하고,
    createSheet 메서드에서 MergeManger를 정의하고 mergeCellRange를 체크해서 Custom Merge를 수행함.
    → [2016/11/03] MergeManger 사용 하는데 문제점 참고!
[2016/10/13] selectedColumnValue 메서드의 두번째 파라미터를 생략하면 ","를 기본값으로 사용한다.
[2016/10/12] rowSel, colSel 속성 추가.
[2016/10/11] getBackColor, setBackColor 메서드 추가.

[2016/09/01] addMergedHeader메서드로 mergedRows를 추가했을때 columnHeaders영역에 merge를 적용하고,
    verticalAlign을 middle로 지정하기 위해서 스타일을 지정한다.
    CSS파일에 'v-transform' 클래스를 정의해야 한다.
    참조: http://jsfiddle.net/Wijmo5/ezo797pt/

******************************************************************************/

document.write('<style>.wj-flexgrid{box-shadow:unset !important;</style>');

//Utility
function Const_CDataDelimiter() {
    return ";^";
}

//var timeLog = "";
function padLeft(src, length, str) {
    if (length > String(src).length)
        return Array(length - String(src).length + 1).join(str || '0') + src;
    else
        return src;
}

function timeStamp() {
    // Create a date object with the current time
    var now = new Date();
    var do24hours = true;
    var doMilliseconds = true;

    // Create an array with the current month, day and time
    //var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
    var date = [now.getFullYear(), now.getMonth() + 1, now.getDate()];

    // Create an array with the current hour, minute and second
    var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

    if (!do24hours) {
        // Determine AM or PM suffix based on the hour
        var suffix = (time[0] < 12) ? "AM" : "PM";

        // Convert hour from military time
        time[0] = (time[0] < 12) ? time[0] : time[0] - 12;

        // If hour is 0, set it to 12
        time[0] = time[0] || 12;
    }

    // If seconds and minutes are less than 10, add a zero
    for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
            time[i] = "0" + time[i];
        }
    }

    // Return the formatted string
    var ret = date.join("/") + " " + time.join(":")
    if (doMilliseconds) ret += "." + now.getMilliseconds();
    if (!do24hours) ret += " " + suffix;

    return ret;
}




var ozgrid_instMgr = new oz_grid_InstanceManager();
function oz_grid_InstanceManager() {
    this.list = {}; //new Object();

    //[2016/12/02] 초기화 메서드 추가
    this.clear = function () {
        this.list = {};     //[];
    }
}
oz_grid_InstanceManager.prototype.add = function (grid) {
    this.list[grid.id] = grid;
}
oz_grid_InstanceManager.prototype.getInstance = function (idOrFG) {
    if (typeof idOrFG == "string") {
        if (idOrFG.charAt(0) != '#')  //if (!idOrFG.startsWith("#"))  ** startsWith 메서드는 IE의경우 12버전부터 지원함.
            idOrFG = "#" + idOrFG;
        return this.list[idOrFG];
    } else if (typeof idOrFG == "object") {
        for (var key in this.list) {
            if (this.list[key].fgObj == idOrFG)
                return this.list[key];
        }
    }
}


function oz_grid(id) {
    //that = this;

    this.id = id;       // "#gsFlexGrid"  #이 앞에 포함됨.
    this.delimiter = ";";
    this.dateDelimiter = "";    // getData() 메서드에서 사용할 날짜의 분리자.
    this.exportDelimiter = ";";
    this.extendLastCol = true;
    this.selectionHeader = "";
    this.indexColumnVisible = false;

    // 체크박스 표시 컬럼은 selectionMode == ListBox일때만 보여지고, 나머지는 감춰진다.
    //  이 값은 외부에서 사용자가 지정하는 값이 아니라.. 프로그램 내부에서 applySettings메서드가 수행될때 결정된다.
    //this.checkColumnVisible = false;

    // 체크박스 컬럼의 헤더영역을 클릭했을때 해당 컬럼의 체크박스값 전체를 true/false로 변경시키는 기능이 있는데..
    //  이 값이 true이면 그 기능을 정지시킨다. 기본값은 false 여서 기능이 동작한다.
    this.disableAllChecked = false;
    this.allCheckValue = true;

    // SelectionMode가 Row일때, 이 속성값에 따라서 라디오버튼 컬럼을 보여준다. selectionMode 보다 먼저 지정할것!
    this.showRadioButton = false;   // [2017/11/20] 일단은 두고, 적용은 하지말자.

    // true값 일때 공통스크립트의 Masking 메서드를 호출 합니다.
    this.executeMaskingProc = false;
    //this.maskingProc = new Function('GridMaskingProc("' + this + '")');

    // true값 일때 tooltip을 보여줌.
    this.tooltipVisible = true;         

    // true값 일때 tooltip으로 getCellTagData값을 표시합니다. 이때 getCellTagData값이 undefind면 해당 셀의 값을 표시합니다.
    //  false값 이면 tooltip으로 해당 셀의 값을 표시합니다.
    this.useDataForTooltip = false;     



    this.mergedRows = [];
    this.checkValues = [];      // setCheckValue메서드로 배열을 지정하고, 그 값을 적용하려면 refresh()를 호출한다.
    this.backColor = [];        // 2차원 배열로 만들어서 셀별 배경색값을 보관하는 용도로 사용한다. 이 값은 itemFormatter에서 사용한다. rowHeader영역은 보관하지 않는다.
    this.mergeCellRanges = [];  // wijmo.grid.CellRange를 보관하는 배열. 이 값을 읽어서 Custom Merge를 적용한다.


    this.indexColumn = new wijmo.grid.Column();
    this.indexColumn.align = "center";
    this.indexColumn.allowDragging = false;
    this.indexColumn.allowMerging = true;
    this.indexColumn.allowResizing = true;
    this.indexColumn.allowSorting = false;
    this.indexColumn.binding = "_sequence_";
    this.indexColumn.header = "No";     //[2017/12/07] 추가
    //this.indexColumn.width = "10";    //--- rowHeader에 사용할땐 오류??
    this.indexColumn.visible = false;

    this.checkColumn = new wijmo.grid.Column();
    this.checkColumn.align = "center";
    this.checkColumn.allowDragging = false;
    // mergedRows 배열에 머지할 헤더가 추가되어 있으면 checkColumn.allowMerging을 true로 해도 되지만,
    //  그렇지 않을땐 this.fgObj.allowMerging == wijmo.grid.AllowMerging.All 이므로 체크박스가 머지되는 현상이 생길수 있다.
    //  그래서 여기서는 checkColumn.allowMerging을 지정하지 않고, applySettings 메서드에서 지정하도록 하자.
    //this.checkColumn.allowMerging = true;
    this.checkColumn.allowSorting = false;
    this.checkColumn.binding = "_check_";
    this.checkColumn.dataType = wijmo.DataType.Boolean;    //0-Object, 1-String, 2-Number, 3-Boolean, 4-Date, 5-Array
    this.checkColumn.visible = false;

    this.radioButtonColumn = new wijmo.grid.Column();
    this.radioButtonColumn.align = "center";
    this.radioButtonColumn.allowDragging = false;
    this.radioButtonColumn.allowMerging = false;
    this.radioButtonColumn.allowResizing = false;
    this.radioButtonColumn.allowSorting = false;
    this.radioButtonColumn.binding = "_radiobutton_";
    this.radioButtonColumn.dataType = wijmo.DataType.Boolean;    //0-Object, 1-String, 2-Number, 3-Boolean, 4-Date, 5-Array
    this.radioButtonColumn.visible = false;

    this.selectedRadioRow = -1;


    ////Tooltip
    //this.CellTip = new wijmo.Tooltip();
    //this.TipContent = null;
    ////-this.TipRng;

    // events
    this.onClick = null;
    this.onHyperClick = null;
    this.onSortColumn = null;

    this.onCheckClickHandler = null;
    this.onCheckClick = function (e) {
        var grid = ozgrid_instMgr.getInstance(this);  // this == wijmo.grid.FlexGrid
        var fg = grid.fgObj;
        if (grid.onCheckClickHandler) {
            grid.onCheckClickHandler();

            //var fg = grid.fgObj;
            //fg.beginUpdate();
            //for (var r = 0; r < fg.rows.length; r++) {
            //    //var flag = (fg.getSelectedState(r, 0) != wijmo.grid.SelectedState.None);
            //    var flag = grid.isSelected(r);
            //    if (flag != fg.getCellData(r, e.col))
            //        fg.setCellData(r, e.col, flag);
            //}
            //fg.endUpdate();
        }
        //if (grid.mousePressed)
        //    grid.mousePressed = false;

        grid.checkboxPressed = true;    // [2017/12/27]
    }
    this.onSortedColumn = function (e) {    // e: CellRangeEventArgs
        var grid = ozgrid_instMgr.getInstance(this);  // this = wijmo.grid.FlexGrid
        //var fg = grid.fgObj;
        //alert("onSortedColumn-" + fg.getCellData(0, 0) + ", " + fg.getCellData(99, 0));
        //alert("onSortedColumn-" + fg.getCellData(0, 0));
        if (grid.onSortColumn) {
            grid.onSortColumn();
        }
        
        grid.refreshIndex();
    }
    this.onSortingColumn = function (e) {    // e: CellRangeEventArgs
        var grid = ozgrid_instMgr.getInstance(this);  // this = wijmo.grid.FlexGrid
        var fg = grid.fgObj;
        //alert("onSortingColumn-" + fg.getCellData(0, 0) + ", " + fg.getCellData(99, 0));
        //alert("onSortingColumn-" + fg.getCellData(0, 0));
        if (!fg.itemsSource || fg.itemsSource.length == 0)
            return false;   // sort 동작이 취소된다.
        else
            return true;
    }

    this.onResizedColumn = function (e) {   // e: CellRangeEventArgs
        var grid = ozgrid_instMgr.getInstance(this);
        grid.setAutoSizeFixedRows();    // 컬럼폭이 조정될때 FixedRows 영역의 높이를 자동으로 맞춰주자.
    }

    this.onItemsSourceChanged = function (e) {   // EventArgs
        //that.refresh();
        var grid = ozgrid_instMgr.getInstance(this);
        if (grid)
            grid.refresh();
    }


    
    //$(this.id + " input[type=checbox]").change(function (e) {
    //    var grid = ozgrid_instMgr.getInstance(this.id);
    //    var fg = grid.fgObj;
    //    var ht = fg.hitTest(e.pageX, e.pageY);

    //    grid.mousePressed = false;
    //    mousePressPoint = ht.point;

    //    //if (ht.row == 0 && ht.col == 1) {
    //    //    grid.test();
    //    //}
    //    if (this.checked) {
    //        console.log("checked");
    //    } else {
    //        console.log("unchecked");
    //    }
    //});




    // 내부적으로 사용하는 private 메서드. -- 현재는 public으로 공개된 형태로 사용. private으로 바꾸려면?
    //  컬럼타입을 확인해서 Date형식일때는 적당한 표기로 변경해서 리턴하고,
    //  Date형식의 컬럼이 아니면.. 그냥 해당 값을 리턴한다.
    //  파라미터 col의 경우 컬럼인덱스나 컬럼키값을 사용할 수 있으며..
    //  내부적으로 사용하는 메서드인 만큼 selectionMode에 따른 체크컬럼 부분을 따로 처리하지 않고
    //  주어진 컬럼인덱스(혹은 컬럼키)를 그대로 사용한다.
    //if (!oz_grid.prototype.getDate) {
    //    oz_grid.prototype.getDate =
    this.getData = function (row, col) {
        var fg = this.fgObj;
        var r = parseInt(row), c = col;

        if (typeof col === "string")
            c = fg.columns.getColumn(col).index;

        if (fg.columns[c].dataType == wijmo.DataType.Date) {
            //Date타입 컬럼의 값을 getCellData(r, c, [false])로 구하면 javascript의 Date객체로 리턴된다.
            //  그러므로 fg.getCellData(r, c).getFullYear() 처럼 .getMonth(), getDate() 등의 Date객체 메서드를 직접 호출할 수 있다.
            var value = fg.getCellData(r, c, true);
            var y, m, d;
            if (value.length == 8) {
                y = value.substr(0, 4);
                m = value.substr(4, 2);
                d = value.substr(6, 2);
            } else if (value.length == 10) {
                y = value.substr(0, 4);
                m = value.substr(5, 2);
                d = value.substr(8, 2);
            } else {
                return fg.getCellData(r, c, true);
            }
            return y + this.dateDelimiter + m + this.dateDelimiter + d;
        } else
            return fg.getCellData(r, c, true);
    }



    //Property는 해당 클래스내에 정의해야 한다.
    // wijmo.FlexGrid에 맞는 값으로 김태완 부장이 변화해서 넣어줌.
    Object.defineProperty(this, "selectionMode", {
        set: function (value) {
            var fg = this.fgObj;

            //fg.beginUpdate();
            switch (value) {
                case wijmo.grid.SelectionMode.None:     // 0
                    fg.columns.remove(this.checkColumn);
                    this.checkColumn.visible = false;
                    fg.columns.remove(this.radioButtonColumn);
                    this.radioButtonColumn.visible = false;

                    // .NET grid는 None일때도 행이 선택된게 표시되지만, wijmo는 선택이 진짜 안된다. 그래서 임의로 Row로 설정함.
                    value = wijmo.grid.SelectionMode.Row;
                    break;

                case wijmo.grid.SelectionMode.Row:      // 3 SingleSelection
                    //if (this.showRadioButton) {
                    this.radioButtonColumn.header = this.selectionHeader == "" ? " " : this.selectionHeader;
                    this.radioButtonColumn.visible = true;
                    if (!fg.columns.getColumn(this.radioButtonColumn.binding)) {
                        fg.columns.insert(0, this.radioButtonColumn);
                        fg.autoSizeColumn(0);
                    }
                    //}
                    break;

                case wijmo.grid.SelectionMode.RowRange: // 4 ListSelection
                    break;

                case wijmo.grid.SelectionMode.ListBox:  // 5 MultiSelection
                    // 체크박스는 rowHeaders에 추가하면 보이지 않고, columns에 추가 할때만 보인다.
                    this.checkColumn.header = this.selectionHeader == "" ? " " : this.selectionHeader;
                    this.checkColumn.visible = true;
                    if (!fg.columns.getColumn(this.checkColumn.binding)) {
                        fg.columns.insert(0, this.checkColumn);
                        fg.autoSizeColumn(0);

                        // 체크컬럼이 추가될때는 기본값으로 false를 지정한다.
                        for (var r = 0; r < fg.rows.length; r++)
                            fg.setCellData(r, this.checkColumn.index, false);
                    }
                    break;

                default:
                    value = wijmo.grid.SelectionMode.Row;
            }

            fg.selectionMode = value;
            //fg.endUpdate();
        }
    });



    //.NET ozgrid의 행 값은 헤더영역이 포함된 값이고, wijmo FlexGrid는 CellType.ColumnHeader 와
    //  CellType.Cell 영역의 행 값을 별도로 인덱스 하므로 fixedRows 값을 적절히 빼주고, 더해주고 해야만
    //  .NET기준의 행 값을 흉내 낼수 있다.
    Object.defineProperty(this, "rowSel", {
        get: function () {
            if (this.radioButtonColumn.visible)     // && this.showRadioButton)
                return (this.selectedRadioRow + this.fixedRows);
            else
                return (this.fgObj.selection.row +this.fixedRows);
        },
        set: function (value) {
            value -= this.fixedRows;
            if (value >= 0) {
                this.fgObj.selection = new wijmo.grid.CellRange(value, this.fgObj.selection.col);
            }
        }
    });
    Object.defineProperty(this, "colSel", {
        get: function () {
            //.NET의 ozgrid에서 일련번호 컬럼은 별도의 컨트롤이라서 컬럼값을 구하는데는 포함되지 않는다.
            return this.fgObj.selection.col;
        },
        set: function (value) {
            var col = parseInt(value);
            this.fgObj.selection = new wijmo.grid.CellRange(this.fgObj.selection.row, col);
        }
    });


    //[2017/01/17] 신규 추가.
    Object.defineProperty(this, "rowCur", {
        get: function () {
            //[2017/01/17] radioButtonColumn의 유무에 상관없이 무조건 선택된 행의 값을 구한다.
            return (this.fgObj.selection.row + this.fixedRows);
        },
        set: function (value) {
            value -= this.fixedRows;
            if (value >= 0) {
                this.fgObj.selection = new wijmo.grid.CellRange(value, this.fgObj.selection.col);
            }            
        }
    });

    //[2017/09/21] 신규추가.
    //  .NET ozgrid의 경우 fgObj.Row, fgObj.Col에 해당하는 텍스트
    Object.defineProperty(this, "text", {
        get: function () {
            // [2017/12/12] 서식 없이 값만 리턴.
            return this.getCellData(this.rowCur, this.colSel, false);
        },
        set: function (value) {
            this.setCellData(this.rowCur, this.colSel, value);
        }
    });


    // 다음처럼 속성에 두개 이상의 파라미터를 추가하는게 안된다.
    //Object.defineProperty(this, "textAlignFixed", {
    //    get: function (c) {
    //        return this.fgObj.columnHeaders.columns[c].align;
    //    },
    //    set: function (c, value) {
    //        this.fgObj.columnHeaders.columns[c].align = value;    //'left|right|center'
    //    }
    //});

    //Object.defineProperty(this, "textAlign", {
    //    get: function (c) {    <----- undefined!
    //        return this.fgObj.columns[c].align;
    //    },
    //    set: function (c, value) {
    //        this.fgObj.columns[c].align = value;    //'left|right|center'
    //    }
    //});


    // _mouseRow는 값을 세팅하는 시점이 다른 메서드 이므로 var로 선언하지 않고, this를 붙였다.
    this._mouseRow = 0;     
    Object.defineProperty(this, "mouseRow", {
        get: function () {
            return this._mouseRow;
        },
        //set: function (value) {       ** mouseRow, mouseCol은 readonly 속성임.
        //    this._mouseRow = value;
        //}
    });

    this._mouseCol = 0;
    Object.defineProperty(this, "mouseCol", {
        get: function () {
            return this._mouseCol;
        },
        //set: function (value) {
        //    this._mouseCol = value;
        //}
    });




    Object.defineProperty(this, "fixedRows", {
        get: function () {
            return this.fgObj.columnHeaders.rows.length;
        },
        set: function (rows) {
            if (rows < 0) return;   // 최소한 1개 행은 항상 있다고 치고..

            var fg = this.fgObj;
            fg.beginUpdate();
            if (rows <= this.fixedRows) {
                var cnt = this.fixedRows - rows;
                while (cnt > 0) {
                    //fg.columnHeaders.rows.removeAt(0);   // 헤더영역에서 첫번째 행만 계속 삭제하자

                    // 헤더영역에서 맨 끝행만 계속 삭제하자
                    fg.columnHeaders.rows.removeAt(fg.columnHeaders.rows.length - 1);  
                    cnt--;
                }
            } else {
                var cnt = rows - this.fixedRows;
                while (cnt > 0) {
                    //fg.columnHeaders.rows.insert(0, new wijmo.grid.Row());
                    fg.columnHeaders.rows.push(new wijmo.grid.Row());
                    cnt--;
                }
            }
            this.fgObj.endUpdate();
        }
    });
    Object.defineProperty(this, "fixedCols", {
        get: function () {
            //return this.fgObj.rowHeaders.columns.length;
            return this.fgObj.frozenColumns;
        },
        set: function (cols) {
            if (cols < 0) return;   // 최소한 1개 행은 항상 있다고 치고..

            var fg = this.fgObj;
            fg.beginUpdate();
            //if (cols <= this.fixedCols) {
            //    var cnt = this.fixedCols - cols;
            //    while (cnt > 0) {
            //        //fg.rowHeaders.columns.removeAt(0);   // 헤더영역에서 첫번째 컬럼만 계속 삭제하자
            //        fg.rowHeaders.columns.removeAt(fg.rowHeaders.columns.length - 1);
            //        cnt--;
            //    }
            //} else {
            //    var cnt = cols - this.fixedRows;
            //    while (cnt > 0) {
            //        //fg.rowHeaders.columns.insert(0, new wijmo.grid.Column());
            //        fg.rowHeaders.columns.push(new wijmo.grid.Column());
            //        cnt--;
            //    }
            //}
            fg.frozenColumns = cols;
            fg.endUpdate();
        }
    });

    Object.defineProperty(this, "rows", {
        get: function () {
            return (this.fixedRows + this.fgObj.rows.length);
        },
        set: function (rows) {
            if (rows < 0) return;   // 최소한 1개 행은 항상 있다고 치고..

            var fg = this.fgObj;
            fg.beginUpdate();
            if (rows <= this.fixedRows) {
                //fg.itemsSource.clear();     //[2017/12/06] clear메서드 없음!       
                var cnt = fg.rows.length;
                while (cnt > 0) {
                    fg.itemsSource.removeAt(0);     // itemsSource의 행을 삭제하면 rows도 함께 삭제된다.
                    //fg.rows.clear(); 
                    cnt--;
                }

                var cnt = this.fixedRows - rows;
                while (cnt > 0) {
                    fg.columnHeaders.rows.removeAt(fg.columnHeaders.rows.length - 1);
                    cnt--;
                }
            } else {
                if (rows <= this.rows) {
                    var cnt = this.rows - rows;
                    while (cnt > 0) {
                        fg.itemsSource.removeAt(fg.rows.length - 1);    // itemsSource의 행을 삭제하면 rows도 함께 삭제된다.
                        //fg.rows.removeAt(idx); 
                        cnt--;
                    }
                } else {
                    var cnt = rows - this.rows;
                    while (cnt > 0) {
                        //fg.rows.push(new wijmo.grid.Row());
                        //fg.itemsSource.push({});  
                        fg.itemsSource.addNew();    // itemsSource의 행을 추가하면 rows도 추가된다.
                        cnt--;
                    }
                }
            }
            fg.endUpdate();
        }
    });
    //.NET의 ozgrid에서 일련번호 컬럼은 별도의 컨트롤이라서 cols값을 구하는데는 포함되지 않는다.
    Object.defineProperty(this, "cols", {
        get: function () {            
            return this.fgObj.columns.length;
        },
        set: function (cols) {
            if (cols < 0) return;   // 최소한 1개 컬럼(체크컬럼)은 항상 있다고 치고..

            var fg = this.fgObj;
            fg.beginUpdate();
            if (cols <= this.cols) {
                var cnt = this.cols - cols;
                while (cnt > 0) {
                    var idx = fg.columns.length - 1;
                    fg.columns.removeAt(idx);
                    cnt--;
                }
            } else {
                var cnt = cols - this.cols;
                while (cnt > 0) {
                    var cobj = new wijmo.grid.Column();
                    cobj.binding = "key_" + fg.columns.length;    //[2017/12/06] 새로 추가되는 컬럼에는 임의로 키를 부여한다.
                    cobj.header = " ";      //헤더를 따로 지정하지 않거나 "" 으로 지정하면 binding값이 표시되므로 " "을 지정한다.
                    fg.columns.push(cobj);                    
                    cnt--;
                }
            }

            // extendLastCol 일때 cols값이 변경되면 마지막 컬럼을 확장해주자.
            if (this.extendLastCol && fg.columns.length > 0) {
                for (var c = 0; c < fg.columns.length - 1; c++) {
                    if (fg.columns[c].width == "*")
                        fg.columns[c].width = undefined;
                }
                fg.columns[fg.columns.length - 1].width = "*";
            }
            fg.endUpdate();
        }
    });



    var _colWidthMax = undefined;
    // .NET fgObj.ColWidthMax 속성 구현. (.NET에선 twips단위, js에선 pixels단위)
    Object.defineProperty(this, "colWidthMax", {
        get: function () {
            return this.px2tw(_colWidthMax);
        },
        set: function (value) {
            _colWidthMax = this.tw2px(value);

            this.fgObj.beginUpdate();
            for (var c = 0; c < this.fgObj.columns.length; c++) {
                // 체크 컬럼이나 라디오버튼 컬럼은 스킵한다.
                //if (this.fgObj.columns[i].binding == this.checkColumn.binding || this.fgObj.columns[i].binding == this.radioButtonColumn.binding) continue;
                if (this.fgObj.columns[i] == this.checkColumn || this.fgObj.columns[i] == this.radioButtonColumn) continue;
                this.fgObj.columns[c].maxWidth = _colWidthMax;
            }
            this.fgObj.endUpdate();
        }
    })

    var _colWidthMin = undefined;
    // .NET fgObj.ColWidthMin 속성 구현. (.NET에선 twips단위, js에선 pixels단위)
    Object.defineProperty(this, "colWidthMin", {
        get: function () {
            return this.px2tw(_colWidthMin);
        },
        set: function (value) {
            _colWidthMin = this.tw2px(value);

            this.fgObj.beginUpdate();
            for (var c = 0; c < this.fgObj.columns.length; c++) {
                // 체크 컬럼이나 라디오버튼 컬럼은 스킵한다.
                //if (this.fgObj.columns[i].binding == this.checkColumn.binding || this.fgObj.columns[i].binding == this.radioButtonColumn.binding) continue;
                if (this.fgObj.columns[i] == this.checkColumn || this.fgObj.columns[i] == this.radioButtonColumn) continue;
                this.fgObj.columns[c].minWidth = _colWidthMin;
            }
            this.fgObj.endUpdate();
        }
    })

    //var _allowSorting = 2   //0-None, 1-SingleColumn, 2-MultiColumn
    //Object.defineProperty(this, "allowSorting", {
    //    get: function () {
    //        return _allowSorting;
    //    },
    //    set: function (value) {
    //        _allowSorting = value;
    //        for (var c = 0; c < this.fgObj.columns.length; c++) {
    //            // 체크 컬럼이나 라디오버튼 컬럼은 스킵한다.
    //            //if (this.fgObj.columns[i].binding == this.checkColumn.binding || this.fgObj.columns[i].binding == this.radioButtonColumn.binding) continue;
    //            if (this.fgObj.columns[i] == this.checkColumn || this.fgObj.columns[i] == this.radioButtonColumn) continue;
    //            this.fgObj.columns[c].allowSorting = (_allowSorting == 0 ? false : true);
    //        }
    //    }
    //})
    Object.defineProperty(this, "allowSorting", {
        get: function () {
            return this.fgObj.allowSorting;     //기본값은 true.
        },
        set: function (value) {
            this.fgObj.allowSorting = value;    //ture, false
        }
    })

    // 0~3까지는 C1FlexGrid 속성의 값이랑 같다.
    Object.defineProperty(this, "allowResizing", {
        get: function () {
            return this.fgObj.allowResizing;
        },
        set: function (value) {
            this.fgObj.allowResizing = value;   //0-wijmo.grid.AllowResizing.None, 1-Columns, 2-Rows, 3-Both
        }
    })


    var _wordWrap = false;
    Object.defineProperty(this, "wordWrap", {
        get: function () {
            return _wordWrap;
        },
        set: function (value) {
            _wordWrap = value;      //true|false

            this.fgObj.beginUpdate();
            for (var c = 0; c < this.fgObj.columns.length; c++) {
                // 체크 컬럼이나 라디오버튼 컬럼은 스킵한다.
                //if (this.fgObj.columns[i].binding == this.checkColumn.binding || this.fgObj.columns[i].binding == this.radioButtonColumn.binding) continue;
                if (this.fgObj.columns[i] == this.checkColumn || this.fgObj.columns[i] == this.radioButtonColumn) continue;
                this.fgObj.columns[c].wordWrap = value;
            }
            this.fgObj.endUpdate();
        }
    })



    // .NET ozgrid.HideHeader 속성 구현. 컬럼헤더의 Visible을 설정한다.
    Object.defineProperty(this, "headersVisible", {
        get: function () {
            if (this.fgObj.headersVisibility == wijmo.grid.HeadersVisibility.All)
                return true;
            else
                return false;
        },
        set: function (value) {
            if (value)
                this.fgObj.headersVisibility = wijmo.grid.HeadersVisibility.All;
            else
                this.fgObj.headersVisibility = wijmo.grid.HeadersVisibility.Row;
        }
    });


    var _clipSeparators = "\t\r";   //String.fromCharCode(9) + String.fromCharCode(10)
    Object.defineProperty(this, "clipSeparators", {
        get: function () {
            return _clipSeparators;
        },
        set: function (value) {
            _clipSeparators = value;   
        }
    });



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // getEnabled, setEnabled 대신에 enabled 속성을 사용하자. ////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    this.getEnabled = function () {
        return !this.fgObj.disabled;
    }
    this.setEnabled = function (value) {
        this.fgObj.disabled = !value;
    }
    Object.defineProperty(this, "enabled", {
        get: function () {
            return !this.fgObj.disabled;
        },
        set: function (value) {
            this.fgObj.disabled = !value;
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // getVisible, setVisible 대신에 visible 속성을 사용하자. ////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    this.getVisible = function () {
        return eval($(this.id).css('display') == '' || $(this.id).css('display') == 'inline-block');
    }
    this.setVisible = function (value) {
        if (value == true) {
            $(this.id).css('display', '');
            //this.fgObj.refresh();
            this.setAutoSizeColumns();
        } else {
            $(this.id).css('display', 'none');
        }
    }
    Object.defineProperty(this, "visible", {
        get: function () {
            return eval($(this.id).css('display') == '' || $(this.id).css('display') == 'inline-block');
        },
        set: function (value) {
            if (value == true) {
                $(this.id).css('display', '');
                //this.fgObj.refresh();
                this.setAutoSizeColumns();
            } else {
                $(this.id).css('display', 'none');
            }
        }
    });


    //console.log(padLeft("oz.grid('" + this.id + "') Start → ", 50, ' ') + timeStamp());
    //timeLog = padLeft("oz.grid('" + this.id + "') Start → ", 50, ' ') + timeStamp();


    this.fgObj = this.createSheet();
    //this.colView;       // wijmo.collections.CollectionView
    this.colObj = [];   // setColumnEditor 메서드에서 할당한 객체 보관.
    this.fgObj.cellEditEnding.addHandler(function (sender, e) {
        var grid = ozgrid_instMgr.getInstance(sender);
        var fg = sender;
        var obj = grid.colObj[e.col];   // setColumnEditor 메서드에서 할당한 객체를 사용해야 한다.
        if (obj && obj.constructor.name == "oz_combo") {
            var oldVal = fg.getCellData(e.row, e.col, true);
            var newVal = fg.activeEditor.value;

            //if (oldVal != newVal)     '값의 변경유무 체크하지 않고 무조건 호출해야 .NET버전을 구현한다.
            obj.setValueRaiseEvent(newVal);
        }
    });

    this.checkboxPressed = false;   // boolean타입 컬럼의 checkbox를 눌렀을때.
    this.mousePressed = false;  // 마우스 버튼의 눌려진 상태값을 갖는다.
    var mousePoint = null;
    this.fgObj.hostElement.addEventListener("mousedown", function (e) {
        var grid = ozgrid_instMgr.getInstance(this.id);
        var fg = grid.fgObj;
        var ht = fg.hitTest(e.pageX, e.pageY);

        //console.log("___mouse down___");
        grid.mousePressed = true;
        mousePressPoint = ht.point;

        //if (ht.row == 0 && ht.col == 1) {
        //    grid.test();
        //}
    });

    this.fgObj.hostElement.addEventListener("mouseup", function (e) {
        var grid = ozgrid_instMgr.getInstance(this.id);
        var fg = grid.fgObj;
        var ht = fg.hitTest(e.pageX, e.pageY);
        var col = fg.columns[ht.col];

        if (grid.mousePressed) {
            grid.mousePressed = false;
            //console.log("___mouse up___");

            //alert("mouseup-" + fg.getCellData(0, 0) + ", " + fg.getCellData(99, 0));
            //grid.resetIndexAndCheck();

            var x1, x2, y1, y2;
            x1 = mousePressPoint.x - 2;
            y1 = mousePressPoint.y - 2;
            x2 = mousePressPoint.x + 2;
            y2 = mousePressPoint.y + 2;

            switch (ht.cellType) {
                case wijmo.grid.CellType.ColumnHeader:
                    if ((x1 <= ht.point.x && ht.point.x <= x2) && (y1 <= ht.point.y && ht.point.y <= y2)) {
                        if ((ht.row == 0) && (grid.checkColumn.visible && (ht.col == grid.checkColumn.index) && !grid.disableAllChecked)) {
                            for (var r = 0; r < fg.rows.length; r++) {
                                fg.setCellData(r, grid.checkColumn.index, grid.allCheckValue);
                            }
                            grid.allCheckValue = !grid.allCheckValue;
                        }
                    }
                    break;

                case wijmo.grid.CellType.Cell:
                    //if ((x1 <= ht.point.x && ht.point.x <= x2) && (y1 <= ht.point.y && ht.point.y <= y2)) {
                    //if (grid.selectedRowCount() >= 1) {

                    if (fg.columns[ht.col].dataMap)     // column에 콤보를 정의한 경우 그것만 보여주도록 여기서 break 한다.
                        break;

                    if (fg.selectedRows.length >= 1) {

                        if (grid.checkColumn.visible && grid.checkboxPressed == false) {
                            // 행을 클릭할때 체크 컬럼을 세팅하자.
                            var checked = fg.getCellData(ht.row, grid.checkColumn.index);
                            fg.setCellData(ht.row, grid.checkColumn.index, !checked);
                        }                        
                        if (grid.checkboxPressed) {
                            grid.checkboxPressed = false;
                        }

                        if (grid.radioButtonColumn.visible) {   // && grid.showRadioButton) {

                            //var cell = grid.getCellElement(ht.row + grid.fixedRows, grid.radioButtonColumn.index);
                            //if (cell) {
                            //    var radio = cell.children[0];
                            //    if (radio) {
                            //        radio.checked = true;
                            //        this.selectedRadioRow = ht.row;
                            //    }
                            //}

                            var radio = document.getElementById(grid.id + "_" + ht.row)
                            if (radio) {
                                radio.checked = true;
                                //this.selectedRadioRow = ht.row;
                            }
                            grid.selectRadioRowIndex(ht.row);
                            
                        }

                        if (col.name == "_hyper_") {
                            if (grid.onHyperClick != null) grid.onHyperClick();
                        } else {
                            if (grid.onClick != null) grid.onClick();
                        }
                    }
                    break;

                default:
                    //flexGrid_OnMouseUp(ht);
                    break;
            }
        }
    });

    // 클래스에서만 사용하는 Private메서드. 파라미터 row는 this.fgObj.rows 영역에 대한 인덱싱만 사용한다.
    this.selectRadioRowIndex = function (row) {
        var fg = this.fgObj;

        // row는 this.fgObj.rows 영역에 대한 인덱싱만 사용하므로 다음 코드블럭은 필요없다.
        //if (row < this.fixedRows)
        //    return;     // nothing
        //else
        //    row -= this.fixedRows;

        this.selectedRadioRow = row;
        fg.beginUpdate();
        for (r = 0; r < fg.rows.length; r++) {
            fg.setCellData(r, this.radioButtonColumn.index, (r == row ? true : false));
        }
        fg.endUpdate();
    }


    // https://www.grapecity.com/en/forums/wijmo/set-css-class-for-a-cell-i
    //// 내부적으로 사용하는 private 메서드. --> 제대로 Private가 되려면 var getCellElement = function (r, c) {} 이렇게 해야함!
    //this.getCellElement = function (r, c) {
    //    var fg = this.fgObj;
    //    var rc, cell;

    //    //// find the cell from its bounding rectangle
    //    //var rc = fg.getCellBoundingRect(r, c);
    //    //var cell = document.elementFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2);

    //    //// make sure this is a regular cell (not a header)
    //    //if (wijmo.hasClass(cell, 'wj-header')) {
    //    //    cell = null;
    //    //}


    //    //** document.elementFromPoint 메서드로 DOM element를 구할때, flexgrid위에 오버랩된게 있으면 그 element가 리턴되는 문제가 있다.
    //    if (r < this.fixedRows)
    //        rc = fg.columnHeaders.getCellBoundingRect(r, c);
    //    else {
    //        r -= this.fixedRows;
    //        rc = fg.getCellBoundingRect(r, c);
    //    }
    //    cell = document.elementFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2);

    //    // make sure this is not an element within a cell
    //    while (cell && !wijmo.hasClass(cell, 'wj-cell')) {
    //        cell = cell.parentElement;
    //    }


    //    //** 다음의 루틴처럼 row/column값으로 계산된 cell element를 구하게되면, 정상적인 경우는 괜찮지만, 
    //    //  행여 hidden된 컬럼이 있을때는 그 element가 없어서 계산된 위치가 틀어지는 오류가 생길 수 있다.
    //    //// $("#gsFlexGrid .wj-cells")[0].children[5].style.backgroundColor = "red"
    //    //var selector = this.id + " ";
    //    //var index = 0;
    //    //if (r < fixedRows) {
    //    //    selector += ".wj-colheaders";
    //    //} else {
    //    //    selector += ".wj-cells";
    //    //    r -= fixedRows;
    //    //}
    //    //index = r * this.getCols() + c;
    //    //cell = $(selector)[0].children[index];
    //
    //    return cell;
    //};

    var cellTags = new ozf_Collection();
    this.getCellTagData = function (r, c) {
        //var cellElement = this.getCellElement(r, c);
        //return cellElement.tag;

        var key = r + "," + c;
        if (cellTags.containsKey(key))
            return cellTags.get(key);
        else
            return undefined;
    }
    this.setCellTagData = function(r, c, value) {
        //var cellElement = this.getCellElement(r, c);
        //cellElement.tag = value;

        var key = r + "," + c
        cellTags.put(key, value);
    }


    var tip = new wijmo.Tooltip();
    var tipRng = null;
    this.fgObj.hostElement.addEventListener("mousemove", function (e) {
        //console.log("fgObj.mousemove - " + e.pageX + ", " + e.pageY);
        var grid = ozgrid_instMgr.getInstance(this.id);
        var fg = grid.fgObj;
        var ht = fg.hitTest(e); //fg.hitTest(e.pageX, e.pageY);

        grid._mouseRow = ht.row + grid.fixedRows;   //헤더부분 추가.
        grid._mouseCol = ht.col;

        if (grid.tooltipVisible && !ht.range.equals(tipRng)) {
            if (ht.cellType == wijmo.grid.CellType.Cell) {
                tipRng = ht.range;
                var cellBounds = fg.getCellBoundingRect(ht.row, ht.col);

                // mouseRow, mouseCol 확인용 테스트 코드
                //tip.show(fg.hostElement, "mouse Row=" + grid.mouseRow + " Col=" + grid.mouseCol);
                //return;


                //var cellElement = document.elementFromPoint(e.clientX, e.clientY);
                //var data = wijmo.escapeHtml(fg.getCellData(tipRng.row, tipRng.col, true));
                //var font = cellElement.style.fontSize + " " + cellElement.style.fontFamily;
                //var tipContent = 'cell (' + rng.row + ' ' + rng.col + ') contains "<b>' + data + '</b>"';

                //var tipContent = cellElement.tag;
                //if (tipContent && (cellElement.className.indexOf('wj-cell') > -1)) {                    

                var tipContent = "";
                var row = grid.fixedRows;
                row += ht.row;

                if (fg.columns[ht.col].dataType != wijmo.DataType.Boolean) {
                    tipContent = grid.getCellTagData(row, ht.col);
                    if (grid.useDataForTooltip) {
                        tipContent = grid.getCellTagData(row, ht.col);
                        if (!tipContent)
                            tipContent = fg.getCellData(ht.row, ht.col, true);
                    } else {
                        tipContent = fg.getCellData(ht.row, ht.col, true);
                    }
                }

                if (tipContent) {
                    tip.show(fg.hostElement, tipContent, cellBounds);
                } else {
                    tip.hide();
                }
            }
        }
    });
    this.fgObj.hostElement.addEventListener("mouseout", function () {
        tip.hide();
        tipRng = null;
    });
    this.fgObj.hostElement.addEventListener("click", function (e) {
        //** 이미 선택된 행을 선택할때만 click이벤트가 발생함.  왜 이렇게 한템포 늦는건지 모르겠다.
        //** 이래가지곤 이거 사용할 수 있겠나.  나참.. mouseDown, mouseUp을 직접 체크해서 Click으로 처리해야 할거 같다.


        //grid.test();    // for test ///////////////////////////////////////////////
    });

    //this.fgObj.hostElement.addEventListener("show", function (e) {
    //    var grid = ozgrid_instMgr.getInstance(this.id);
    //    grid.fgObj.refresh();
    //});

}
////////////////////////////////////////////////////////////////////////////////////////////////////
// Eof oz_grid /////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////



if (!oz_grid.prototype.initialize) {
    oz_grid.prototype.initialize = function (options, /*optional*/ useCustomMerge) {
        //[2017/12/20] setAutoSizeColumns 에서 컬럼폭을 조정하므로 여기는 생략하자.
        //// 마지막 컬럼을 확장하는 경우, 컬럼폭이 작게 남아있으면 setAutoSizeFixedRows 메서드에 의해서
        ////  헤더영역의 행높이가 유별리 높아지는 경우가 있다. 이를 해소하기 위해 마지막 컬럼의 width = "*" 일때는
        ////  minWidth를 50 정도로 지정하자.
        //var lastCol = options.columns.length - 1;
        //if (lastCol >= 0 && options.columns[lastCol].width == "*") {
        //    if (options.columns[lastCol].minWidth == undefined) {
        //        options.columns[lastCol].minWidth = 50;
        //    }
        //}

        this.fgObj.initialize(options);

        // [2017/02/21] Custom Merge를 사용할꺼면 MergeManager를 정의 해야한다.
        //  그런데 MergeManager를 정의하면 setMergeCol 메서드로 지정하는게 적용되지 않는다.
        if (useCustomMerge) {
            this.fgObj.mergeManager = new MyMergeManager(this.fgObj);
        }

        //this.refresh();
    }
}

if (!oz_grid.prototype.dispose) {
    oz_grid.prototype.dispose = function () {
        //string, array, object 초기화 시키기

        this.id = "";
        this.delimiter = "";
        this.dateDelimiter = "";
        this.exportDelimiter = "";
        this.selectionHeader = "";

        this.mergedRows = [];
        this.checkValues = [];
        this.backColor = [];
        this.mergeCellRanges = [];

        this.indexColumn = null;
        this.checkColumn = null;
        this.radioButtonColumn = null;

        this.onClick = null;
        this.onHyperClick = null;
        this.onCheckClickHandler = null;
        this.onCheckClick = null;
        this.onSortedColumn = null;
        this.onSortingColumn = null;
        this.onResizedColumn = null;
        this.onItemsSourcedChanged = null;

        this.fgObj = null;
    }
}

if (!oz_grid.prototype.setAttr) {
    oz_grid.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}


if (!oz_grid.prototype.setItemsSource) {
    oz_grid.prototype.setItemsSource = function (src, pageVal) {
        var fg = this.fgObj;
        
        
        //[2017/11/29] autoGenerateColumns 일때는 컬럼이 자동으로 계속 추가되므로 미리 cols = 0으로 만들고 진행해야 한다.
        if (fg.autoGenerateColumns)
            this.cols = 0;

        if (src.length > 0) {
            //"REBM/실시간이벤트모니터링/일별실시간이벤트추이분석" (ebm_realdailyprogress.html) 
            //  setItemsSource 호출시 컬럼정보가 없고, 당연히 binding이 없는경우.
            //  initialize메서드를 호출하지 않으니까, autoGenerateColumns 속성값이 기본값인 true가 되어서
            //  아래에서 fg.itemsSource를 지정하며 컬럼이 늘어나는 현상이 생김. 그래서 이렇게 binding이 없는 경우는 컬럼을 
            //  삭제하고 시작하려 해봤는데.. 옳은 방법은 아니다.  
            //  createSheet에서 autoGenerateColumns = false로 지정하게 되면 itemsSource를 지정해도 컬럼이 늘어나지 않게된다.
            //for (var i = fg.columns.length - 1; i >= 0; i--) {
            //    if (!fg.columns[i].binding)
            //        fg.columns.removeAt(i);
            //}

            var hasBinding = false;
            var colCnt = fg.columns.length;
            for (var i = 0; i < colCnt; i++) {
                // 체크 컬럼이나 라디오버튼 컬럼은 스킵한다.
                if (fg.columns[i] == this.checkColumn || fg.columns[i] == this.radioButtonColumn) continue;

                if (fg.columns[i].binding != null) {
                    hasBinding = true;  // binding된 컬럼이 하나라도 있으면...
                    break;
                }
            }

            var keylist = [];
            for (key in src[0]) {
                //console.log("key:" + key + " value:" + src[0][key]);
                keylist.push(key);
            }

            var keyIndex = 0;
            for (var i = 0; i < colCnt; i++) {
                // 체크 컬럼이나 라디오버튼 컬럼은 스킵한다.
                if (fg.columns[i] == this.checkColumn || fg.columns[i] == this.radioButtonColumn) continue;

                if (!fg.columns[i].header)
                    //header와 binding이 null일때 binding이 지정되면 header는 binding값과 같아진다.
                    //  그래서 이경우 binding보다 header를 먼저 지정함. 
                    fg.columns[i].header = " ";    // ""으로 지정하면 적용이 안되서 공백문자를 입력함.

                var binding = "";
                if (hasBinding) {                    
                    if (fg.columns[i].binding != null)
                        binding = fg.columns[i].binding.trim();

                    //[2016/11/17] binding값이 ""은 아니지만, TM이 수정되면서 keylist에는 없는 경우가 있다. 
                    //  이때는 binding 값으로 TM의 키값을 대신하자.
                    //if (binding == "" || !keylist.includes(binding)) {   <--- IE11 에서도 includes를 지원하지 않는다.
                    if (binding == "") {
                        if (keyIndex < keylist.length)
                            binding = keylist[keyIndex];
                        else
                            binding = "key_" + i;
                    } else if (keylist.indexOf(binding) == -1) {
                        // binding이 keylist에 없으면, src의 현재 keylist[keyIndex] 속성값을 binding 속성으로 추가하고, 
                        //  keylist[keyIndex] 속성을 object에서 삭제한다.
                        src.forEach(function changeSrcKey(rowData) {
                            if (keyIndex < keylist.length) {
                                rowData[binding] = rowData[keylist[keyIndex]];
                                delete rowData[keylist[keyIndex]];
                            } 
                        });
                    }
                } else {
                    // 컬럼정의에 binding이 하나도 없으면 TM으로 조회한 데이터의 키를 binding으로 사용한다.
                    binding = (keyIndex < keylist.length) ? keylist[keyIndex] : "key_" + i;
                    fg.columns[i].binding = binding;
                }
                keyIndex++;

                if (fg.columns[i].dataType == wijmo.DataType.Number) {
                    // Number형 컬럼에 지정할 값이 NullString이면 '0'으로 표시되도록 한다.
                    src.forEach(function verifyNullString(rowData) {
                        if (typeof rowData[binding] !== 'undefined') {
                            var value = rowData[binding].trim();
                            if (value == "")
                                rowData[binding] = 0;   //"0";
                        }
                    });
                }
            }
        }

        
        /**=====================================================
         * 그리드 페이징 처리 추가
         =====================================================*/
        if(pageVal != null && pageVal != "" && pageVal != undefined && pageVal != "undefined"){
        	view = new wijmo.collections.CollectionView(src);
            view.pageSize = pageVal;
            fg.itemsSource = view;
        }else{
        	fg.itemsSource = new wijmo.collections.CollectionView(src);
        }
        
        //fg.itemsSource.moveCurrentToLast();   /////// 테스트를 위한 호출.  
        //fg.itemsSource.moveCurrentToFirst();

        //this.refresh(); --- 여기서 호출하지 말고 onItemsSourceChanged 에서 호출하자.

        if (this.executeMaskingProc && frameSecurityObject) frameSecurityObject.GridMaskingProc(this);
    }
}




// wijmo FlexGrid의 CollectionView객체를 사용해서 sort를 해야 한다.
//  http://cafe.naver.com/grapecity/2881
if (!oz_grid.prototype.sort) {
    oz_grid.prototype.sort = function (order, col1, col2) {
        var fg = this.fgObj;
        if (typeof col2 === "undefined") col2 = col1;

        order = order.toLowerCase();    // 'asc', 'desc'
        var isAsc = order == 'asc' ? true : false;
        
        var sd = fg.itemsSource.sortDescriptions;
        sd.clear();
        for (var c = col1; c <= col2; c++) {
            var binding = fg.columns[c].binding;
            var sd1 = new wijmo.collections.SortDescription(binding, isAsc);
            sd.push(sd1);
        }
        fg.itemsSource.refresh();
    }
}


////// wijmo FlexGrid에서는 이렇게 직접 cell값을 읽어서 정렬하는건 좋은 방법이 아니다. ////////
//if (!oz_grid.prototype.sort) {
//    oz_grid.prototype.sort = function (order, col1, col2) {
//        var fg = this.fgObj;
//        if (typeof col2 === "undefined") col2 = col1;

//        order = order.toLowerCase();
//        var iOrder = order == 'asc' ? 1 : -1;

//        for (var i = 0; i < fg.rows.length - 1; i++) {
//            for (var j = i + 1; j < fg.rows.length; j++) {
//                var comp = compareTo(fg, i, j, order, col1, col2)

//                if (comp == 1) {
//                    for (var c = 0; c < fg.columns.length; c++) {
//                        var tmp = fg.getCellData(i, c);
//                        fg.setCellData(i, c, fg.getCellData(j, c));
//                        fg.setCellData(j, c, tmp);
//                    }
//                }
//            }
//        }
//    }
//}
//function compareTo(fg, i, j, order, col1, col2) {
//    var ret = 0;
//    for (var c = col1; c <= col2; c++) {
//        var val1 = fg.getCellData(i, c);
//        var val2 = fg.getCellData(j, c);

//        if (val1 != val2) {
//            ret = val1 < val2 ? -1 : 1;
//            if (order == 'desc')
//                ret = -ret;
//            break;
//        }
//    }
//    return ret;
//}



// ** 상호 호환성이 떨어지므로 단방향으로 set만 하는게 좋겠다. **
//// .NET VSFlexGrid의 MergeCells 속성을 wijmo FlexGrid로 구현.
////  allowMerging 지정후에 wijmo FlexGrid의 rows, columns에 대해서 allowMerging을 지정해야한다.
////  .NET > 0-flexMergeNever, 1-flexMergeFree, 2-flexMergeRestrictRows, 3-flexMergeRestrictColumns, 4-flexMergeRestrictAll, 5-flexMergeFixedOnly, 6-flexMergeSpill, 7-flexMergeOutline
////  wijmo FlexGrid > 0-None, 1-Cells, 2-ColumnHeaders, 4-RowHeaders, 6-AllHeaders, 7-All
//// --- 변환룰 ---
//// 0-flexMergeNever           → 0-None
//// 1-flexMergeFree            → 1-All     'Cells
//// 2-flexMergeRestrictRows    → 4-RowHeaders
//// 3-flexMergeRestrictColumns → 2-ColumnHeaders
//// 4-flexMergeRestrictAll     → 7-All
//// 5-flexMergeFixedOnly       → 6-AllHeaders
//// 6-flexMergeSpill           → X (Cells)
//// 7-flexMergeOutline         → X (Cells)
//Object.defineProperty(this, "allowMerging", {
//    get: function () {
//        return this.fgObj.allowMerging;
//    },
//    set: function (value) {
//        this.fgObj.allowMerging = value;
//    }
//})

//[2016/11/04] .NET ozGrid에서는 헤더 디스플레이를 설정하면서 flexMergeFree로 지정하고 있다.
//  그래서 createSheet에 정의된 fgObj.allowMerging을 AllowMerging.All로 사용해야겠다.
//  그러므로 잠시 사용을 보류하는 메서드.
if (!oz_grid.prototype.setAllowMerging) {
    oz_grid.prototype.setAllowMerging = function (merging) {
        var merging;
        switch (merging) {
            case 0:     // flexMergeNever
                merging = wijmo.grid.AllowMerging.None;
                break;
            case 1:     // flexMergeFree
                merging = wijmo.grid.AllowMerging.All;  //Cells;
                break;
            case 2:     // flexMergeRestrictRows
                merging = wijmo.grid.AllowMerging.RowHeaders;
                break;
            case 3:     // flexMergeRestrictColumns
                merging = wijmo.grid.AllowMerging.ColumnHeaders;
                break;
            case 4:     // flexMergeRestrictAll
                merging = wijmo.grid.AllowMerging.All;
                break;
            case 5:     // flexMergeFixedOnly
                merging = wijmo.grid.AllowMerging.AllHeaders;
                break;
            case 6:     // flexMergeSpill
                merging = wijmo.grid.AllowMerging.Cells;
                break;
            case 7:     // flexMergeOutline
                merging = wijmo.grid.AllowMerging.Cells;
                break;
            default:
                merging = wijmo.grid.AllowMerging.ColumnHeaders;
                break;
        }
        this.fgObj.allowMerging = merging;
    }
}


// allowMerging 속성을 먼저 정의하고, 이것을 호출해야 한다.
if (!oz_grid.prototype.getMergeCol) {
    oz_grid.prototype.getMergeCol = function (c) {
        return this.fgObj.columns[c].allowMerging;
    }
}
if (!oz_grid.prototype.setMergeCol) {
    oz_grid.prototype.setMergeCol = function (c, value) {
        this.fgObj.columns[c].allowMerging = value; // true|false
    }
}



// .NET fgObj.RowHeight 속성 구현. (.NET에선 twips단위, js에선 pixels단위. 리턴할때는 단위변환 없이 그대로 리턴하자.)
if (!oz_grid.prototype.getRowHeight) {
    oz_grid.prototype.getRowHeight = function (r) {
        var fg = this.fgObj;
        var value = 0;

        if (r < this.fixedRows)
            value = fg.columnHeaders.rows[r].height;
        else {
            r -= this.fixedRows;
            value = fg.rows[r].height;
        }
        //return this.px2tw(value);    // twips단위로 변환해서 리턴.
        return value;   //[2016/11/24] 변환없이 그대로 리턴하자.
    }
}
// .NET fgObj.RowHeight 속성 구현. (.NET에선 twips단위, js에선 pixels단위. twip단위 값을 받아서 pixels로 변환해 사용한다.)
if (!oz_grid.prototype.setRowHeight) {
    oz_grid.prototype.setRowHeight = function (r, value) {
        var fg = this.fgObj;
        value = this.tw2px(value);   // pixels단위로 변환

        if (r < this.fixedRows)
            fg.columnHeaders.rows[r].height = value;
        else {
            r -= this.fixedRows;
            fg.rows[r].height = value;
        }
    }
}
// .NET fgObj.RowHeight 속성 구현. (.NET에선 twips단위, js에선 pixels단위. 단위변환 없이 주어진 pixels값을 그대로 사용한다.)
if (!oz_grid.prototype.setRowHeightPx) {
    oz_grid.prototype.setRowHeightPx = function (r, value) {
        var fg = this.fgObj;

        if (r < this.fixedRows)
            fg.columnHeaders.rows[r].height = value;
        else {
            r -= this.fixedRows;
            fg.rows[r].height = value;
        }
    }
}



// .NET fgObj.ColWidth 속성 구현. (.NET에선 twips단위, js에선 pixels단위. 리턴할때는 단위변환 없이 그대로 리턴하자.)
if (!oz_grid.prototype.getColWidth) {
    oz_grid.prototype.getColWidth = function (c) {
        var fg = this.fgObj;
        //return this.px2tw(fg.columns[c].width);
        return fg.columns[c].width;   //[2016/11/24] 변환없이 그대로 리턴하자.
    }
}
// .NET fgObj.ColWidth 속성 구현. (.NET에선 twips단위, js에선 pixels단위. twip단위 값을 받아서 pixels로 변환해 사용한다.)
if (!oz_grid.prototype.setColWidth) {
    oz_grid.prototype.setColWidth = function (c, value) {
        this.fgObj.columns[c].width = this.tw2px(value);
    }
}
// .NET fgObj.ColWidth 속성 구현. (.NET에선 twips단위, js에선 pixels단위. 단위변환 없이 주어진 pixels값을 그대로 사용한다.)
if (!oz_grid.prototype.setColWidthPx) {
    oz_grid.prototype.setColWidthPx = function (c, value) {
        this.fgObj.columns[c].width = value;
    }
}

//if (!oz_grid.prototype.getColWidth) {
//    oz_grid.prototype.getColWidth = function (col) {
//        var fg = this.fgObj;

//        if (typeof col === "string")
//            c = fg.columns.getColumn(col).index;
//        else
//            c = col;

//        return fg.columns[c].width;
//    }
//}
//if (!oz_grid.prototype.setColWidth) {
//    oz_grid.prototype.setColWidth = function (col, width) {
//        var fg = this.fgObj;

//        if (typeof col === "string")
//            c = fg.columns.getColumn(col).index;
//        else
//            c = col;

//        fg.columns[c].width = width;
//    }
//}








// .NET vsFlexGrid의 컬럼 폭, 행 높이등을 지정할때 사용하는 단위 twips을 wijmo FlexGrid에서 사용하는 pixels 단위로 변경하기
if (!oz_grid.prototype.tw2px) {
    oz_grid.prototype.tw2px = function (twips) {
        //return (twips / 20) * 1.333333;
        return twips / 15;
    }
}
if (!oz_grid.prototype.px2tw) {
    oz_grid.prototype.px2tw = function (pixels) {
        //return (pixels / 1.333333) * 20;
        return pixels * 15;
    }
}


if (!oz_grid.prototype.hideColumn) {
    oz_grid.prototype.hideColumn = function (c, value) {
        var fg = this.fgObj;

        fg.beginUpdate();
        if (0 <= c && c < fg.columns.length) {
            fg.columns[c].visible = !value;
        }
        fg.endUpdate();
    }
}

if (!oz_grid.prototype.setAutoSizeColumns) {
    oz_grid.prototype.setAutoSizeColumns = function (extra) {
        var fg = this.fgObj;

        fg.beginUpdate();
        if (typeof extra != "number") extra = 10;
        var lastCol = fg.columns.length - 1;
        var allWidth = 0;

        while (lastCol > 0 && !fg.columns[lastCol].visible)
            lastCol--;

        ////[2017/12/20] 컬럼폭을 조정할때 화면이 올라오기 전이면 $(this.id).width() 값이 0이라서 마지막 컬럼의 width="*" 으로 지장할 수 없다. 다른 코드로 구현해보자.
        //if (lastCol >= 0) {            
        //    // 마지막 컬럼의 width = '*' 로 지정되어 있을때 autoSizeColumns를 호출하면 마지막 컬럼의 폭이 아주 작게 설정되는 경우가 생긴다.
        //    fg.columns[lastCol].width = undefined;
        //    fg.autoSizeColumns(0, lastCol, false, extra);
        //    for (var i = 0; i <= lastCol; i++)
        //        if (fg.columns[i].visible)
        //            allWidth += fg.columns[i].width;
            
        //    if (allWidth < $(this.id).width() && this.extendLastCol)
        //        fg.columns[lastCol].width = "*";
        //}

        // 위 컬럼폭 조정부분을 다르게 구현해 보자.
        if (lastCol == 0) {
            if (this.extendLastCol) {
                fg.columns[lastCol].minWidth = 50;
                fg.columns[lastCol].width = "*";
            }                
        } else {
            fg.autoSizeColumns(0, lastCol, false, extra);
            if (this.extendLastCol) {
                fg.columns[lastCol].minWidth = 50;
                fg.columns[lastCol].width = "*";
            }
        }

        this.setAutoSizeFixedRows();    // 컬럼폭이 조정될때 FixedRows 영역의 높이를 자동으로 맞춰주자.
        fg.endUpdate();
    }
}

if (!oz_grid.prototype.setAutoSizeFixedRows) {
    oz_grid.prototype.setAutoSizeFixedRows = function (extra) {
        var fg = this.fgObj;
        if (typeof extra != "number") extra = 0;
        var lastRow = fg.columnHeaders.rows.length - 1;
        if (lastRow >= 0)
            fg.autoSizeRows(0, lastRow, true, extra);
    }
}
if (!oz_grid.prototype.setAutoSizeRows) {
    oz_grid.prototype.setAutoSizeRows = function (extra) {
        var fg = this.fgObj;
        if (typeof extra != "number") extra = 0;
        var lastRow = fg.rows.length - 1;
        if (lastRow >=0)
            fg.autoSizeRows(0, lastRow, false, extra);
    }
}


if (!oz_grid.prototype.createSheet) {
    oz_grid.prototype.createSheet = function () {
        this.fgObj = new wijmo.grid.FlexGrid(this.id);

        //컬럼정보를 지정하기 위해서 initialize 메서드를 호출하면 autoGenerateColumns 속성의 값이 false로 지정된다.
        //  그러나 컬럼정보를 사용하지 않고 TM결과만 지정할때는 TM결과에 따라 컬럼이 생성 되어야 하므로
        //  autoGenerateColumns 속성의 기본값 true가 사용되어야 한다.
        //this.fgObj.autoGenerateColumns = false;

        //this.fgObj.allowSorting = false;    기본값은 true다.

        //[2016/11/04] .NET ozGrid에서는 헤더 디스플레이를 설정하면서 MergeCells = flexMergeFree로 지정하고 있다.
        //  그래서 AllowMerging.ColumnHeaders 대신에 AllowMerging.All로 사용해야겠다.
        //  단, 컬럼헤더 영역에 임의로 Merged헤더가 추가되면 fgObj.allowMerging = wijmo.grid.AllowMerging.ColumnHeaders; 으로 바꿔준다.
        //this.fgObj.allowMerging = wijmo.grid.AllowMerging.ColumnHeaders;
        this.fgObj.allowMerging = wijmo.grid.AllowMerging.All;

        //this.fgObj.allowResizing = wijmo.grid.AllowResizing.Both;   //default-Columns
        this.fgObj.onCellEditEnded = this.onCheckClick;    //체크박스 클릭은 여기서만 검출된다.
        //this.fgObj.onGotFocus = this.onGotFocus;
        this.fgObj.onSortedColumn = this.onSortedColumn;
        this.fgObj.onSortingColumn = this.onSortingColumn;
        //this.fgObj.onUpdatedView = this.onUpdatedView;
        this.fgObj.itemFormatter = itemFormatter;
        this.fgObj.onItemsSourceChanged = this.onItemsSourceChanged;
        this.fgObj.onResizedColumn = this.onResizedColumn;

        // [2017/12/11] undefined가 되지 않도록 한번 추가한다.
        this.fgObj.itemsSource = new wijmo.collections.CollectionView([]);

        // 다음의 문장으로 VerticalAlign을 지정할 순 있지만.. 체크박스 컬럼을 셋팅하는 setCheckValue 메서드가 동작하지 않고,
        //  체크박스 UI를 클릭했을때의 동작도 정상적이지 않은 문제가 있어서 사용을 보류한다.
        //// center-align vertically with a transform
        //this.fgObj.formatItem.addHandler(function (s, e) {
        //    e.cell.innerHTML = '<div class="v-transform">' + e.cell.innerHTML + '</div>';
        //});




        // Custom MergeManager http://jsfiddle.net/Wijmo5/rjohm6vv/
        //var mm = new wijmo.grid.MergeManager(this.fgObj);
        //mm.__proto__.getMergedRange = function (panel, r, c) {
        //    if ((panel.cellType == wijmo.grid.CellType.Cell) && (that.mergeCellRanges.length > 0)) {
        //        //r -= this.fixedRows;
        //        // this.mergedCellRanges에는 .NET에서 사용하는 좌표 그대로 저장된다.
        //        for (var i in that.mergeCellRanges) {     // this를 사용할 수 없다.
        //            if (r >= 0 && c >= 0 && that.mergeCellRanges[i].contains(r, c)) {
        //                return that.mergeCellRanges[i];
        //            }
        //        }
        //    }
        //    return null;
        //};
        //this.fgObj.mergeManager = mm;

        // 위에 __proto__를 사용하는 방법은 IE11 이상 에서만 가능하므로 대신 다음을 사용함.
        // [2016/11/03] 다음의 MergeManager를 사용하는 Custom방식은 잠시 보류한다.
        // [2017/02/21] initialize 메서드의 두번째 파라미터로 True를 지정하면 그때 MergeManager를 사용하도록 한다.
        //this.fgObj.mergeManager = new MyMergeManager(this.fgObj);

        return this.fgObj;
    }
}



// 위에 createSheet 메서드에서 __proto__ 를 사용하는 경우 IE11만 가능하고 그 이전 버전은 오류가 발생함.
//  그래서 wijmo.grid.MergeManager를 상속받아서 Custom Merge를 수행하는 다음 방식으로 코드를 변경함.
function MyMergeManager(fg) {
    // Call the parent constructor
    wijmo.grid.MergeManager.call(this, fg);
}

// inherit Parent
MyMergeManager.prototype = new wijmo.grid.MergeManager();

// correct the constructor pointer because it points to Parent -- 이부분을 빼도 수행이되네??
MyMergeManager.prototype.constructor = MyMergeManager;

MyMergeManager.prototype.getMergedRange = function (panel, r, c) {
    var grid = ozgrid_instMgr.getInstance(panel.grid);
    if (grid.mergeCellRanges.length > 0) {
        if (panel.cellType == wijmo.grid.CellType.ColumnHeader) {   
            for (var i = 0; i < grid.mergeCellRanges.length; i++) {     // this를 사용할 수 없다.
                var rng = grid.mergeCellRanges[i];
                if (r >= 0 && c >= 0 && rng.contains(r, c)) {
                    return grid.mergeCellRanges[i];
                }
            }
        } else if (panel.cellType == wijmo.grid.CellType.Cell) {  
            // this.mergedCellRanges에는 .NET에서 사용하는 좌표 그대로 저장된다.
            for (var i = 0; i < grid.mergeCellRanges.length; i++) {     // this를 사용할 수 없다.
                var rng = grid.mergeCellRanges[i];
                var r1 = rng.row - grid.fixedRows;
                var c1 = rng.col;
                var r2 = rng.row2 - grid.fixedRows;
                var c2 = rng.col2;
                if ((r1 >= 0 && c1 >= 0) && (r1 <= r && r <= r2) && (c1 <= c && c <= c2)) {
                    return new wijmo.grid.CellRange(r1, c1, r2, c2);
                }
            }
        }
    }
    return null;
}

if (!oz_grid.prototype.addMergeCell) {
    oz_grid.prototype.addMergeCell = function (row1, col1, row2, col2) {
        // .NET Grid에서 사용하는 좌표 그대로 사용한다.
        var r1 = parseInt(row1);
        var c1 = parseInt(col1);
        var r2 = parseInt(row2);
        var c2 = parseInt(col2);

        var rng = new wijmo.grid.CellRange(r1, c1, r2, c2);
        this.mergeCellRanges.push(rng);
        this.fgObj.refresh();   // 여기서 refresh를 호출해야 곧바로 화면이 갱신된다.
    }
}




if (!oz_grid.prototype.addEventListener) {
    oz_grid.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "onClick":
                this.onClick = f;
                break;

            case "onCheckClick":
                //this.fgObj.onCellEditEnded = f;
                this.onCheckClickHandler = f;
                break;

            case "onHyperClick":
                this.onHyperClick = f;
                break;
            
            case "onSortedColumn":
                this.onSortColumn = f;
                break;    
        }
    }
}



if (!oz_grid.prototype.addMergedHeader) {
    oz_grid.prototype.addMergedHeader = function (mergedRow) {
        this.mergedRows.push(mergedRow);
    }
}

// .NET Grid의 디스플레이 설정에 정의된 CheckValue, IsCheck 속성을 구현하기 위해서 배열값을 받도록 한다.
//  배열에 주어지는 객체는 다음처럼 index, checkValue 값을 갖어야 한다.
//  index는 컬럼 인덱스임.
//    ex) var grdCheckValue = [ { index: '3', checkValue: 1 },
//                              { index: '4', checkValue: '20140907' } ];
//        ozgrid1.setCheckValue(grdCheckValue);
if (!oz_grid.prototype.setCheckValue) {
    oz_grid.prototype.setCheckValue = function (checkValue) {
        this.checkValues = [];
        this.checkValues = checkValue;
    }
}


if (!oz_grid.prototype.setColumnEditor) {
    oz_grid.prototype.setColumnEditor = function (c, obj) {
        var col = this.fgObj.columns[c];
        if (col && obj) {
            col.isReadOnly = false;
            if (obj.constructor.name == "oz_combo") {
                //var cap = [];
                //for (var i = 0; i < obj.cbdatasource.length; i++)
                //    cap.push(obj.cbdatasource[i].Caption);
                //col.dataMap = cap;

                this.colObj[c] = obj;   // 잠시 보관.
                for (var i = 0; i < obj.cbdatasource.length; i++) {
                    if (isNumeric(obj.cbdatasource[i].Caption))
                        obj.cbdatasource[i].Caption = Number(obj.cbdatasource[i].Caption);
                }
                var dm = new wijmo.grid.DataMap(obj.cbdatasource, "Code", "Caption");
                col.dataMap = dm;
            }
        } else if (col) {
            col.isReadOnly = true;
            col.dataMap = null;
        }
    }
}

// 출처: http://sometimes-n.tistory.com/34 [종종 올리는 블로그]
function isNumeric(num, opt) {
    // 좌우 trim(공백제거)을 해준다.
    num = String(num).replace(/^\s+|\s+$/g, "");

    if (typeof opt == "undefined" || opt == "1") {
        // 모든 10진수 (부호 선택, 자릿수구분기호 선택, 소수점 선택)
        var regex = /^[+\-]?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
    } else if (opt == "2") {
        // 부호 미사용, 자릿수구분기호 선택, 소수점 선택
        var regex = /^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
    } else if (opt == "3") {
        // 부호 미사용, 자릿수구분기호 미사용, 소수점 선택
        var regex = /^[0-9]+(\.[0-9]+)?$/g;
    } else {
        // only 숫자만(부호 미사용, 자릿수구분기호 미사용, 소수점 미사용)
        var regex = /^[0-9]$/g;
    }

    if (regex.test(num)) {
        num = num.replace(/,/g, "");
        return isNaN(num) ? false : true;
    } else { return false; }
}








if (!oz_grid.prototype.refresh) {
    oz_grid.prototype.refresh = function () {
        this.fgObj.beginUpdate();
        this.fgObj.refresh();
        //this.fgObj.autoSizeColumn(this.checkColumn.index);

        this.resetIndexAndCheck();
        this.setAutoSizeColumns();

        // checkValues의 체크값을 확인해서 checkColumn에 반영한다.
        if (this.checkColumn.visible && this.checkValues.length > 0) {
            var fg = this.fgObj;
            for (var i = 0; i < this.checkValues.length; i++) {
                var c = parseInt(this.checkValues[i].index);
                var colType = fg.columns[c].dataType;
                if (colType == wijmo.DataType.Boolean) {
                    var valueTF = (this.checkValues[i].checkValue == 1 ? true: false);
                    for (var r = 0; r < fg.rows.length; r++) {
                        if (fg.getCellData(r, c) == valueTF)
                            fg.setCellData(r, this.checkColumn.index, true);
                    }
                } else {
                    for (var r = 0; r < fg.rows.length; r++) {
                        if (fg.getCellData(r, c, true) == this.checkValues[i].checkValue)
                            fg.setCellData(r, this.checkColumn.index, true);
                    }
                }
            }
        }
        this.fgObj.endUpdate();
    }
}

// Sort, removeItem, removeSelItem등을 수행할때 내부적으로 호출해서 행의 일련번호를 새로 갱신시킨다.
if (!oz_grid.prototype.refreshIndex) {
    oz_grid.prototype.refreshIndex = function () {
        if (this.indexColumn.visible) {
            var fg = this.fgObj;

            fg.beginUpdate();
            for (var r = 0; r < fg.rows.length; r++) {
                fg.rowHeaders.setCellData(r, "_sequence_", r + 1);
            }

            // indexColumn의 헤더 지정
            for (var r = 0; r < fg.topLeftCells.rows.length; r++) {
                fg.topLeftCells.setCellData(r, 0, this.indexColumn.header);
            }

            fg.autoSizeColumn(this.indexColumn.index, true, 4);
            fg.endUpdate();
        }
    }
}

// itemsSource가 새로 지정될때 일련번호랑 체크박스값을 새로 리셋합니다.
if (!oz_grid.prototype.resetIndexAndCheck) {
    oz_grid.prototype.resetIndexAndCheck = function () {
        var fg = this.fgObj;

        fg.beginUpdate();
        for (var r = 0; r < fg.rows.length; r++) {
            if (this.indexColumn.visible)
                fg.rowHeaders.setCellData(r, "_sequence_", r + 1);

            if (this.checkColumn.visible) {
                //var flag = this.isSelected(r);
                //if (flag != fg.getCellData(r, this.checkColumn.index))
                //    fg.setCellData(r, this.checkColumn.index, flag);
                fg.setCellData(r, this.checkColumn.index, false);
            }
        }

        // indexColumn의 헤더 지정
        for (var r = 0; r < fg.topLeftCells.rows.length; r++) {
            fg.topLeftCells.setCellData(r, 0, this.indexColumn.header);
        }

        fg.autoSizeColumn(this.indexColumn.index, true, 4);
        fg.endUpdate();
    }
}


oz_grid.prototype.test = function () {
    var fg = this.fgObj;

    //alert("****" + fg.selectedRows);
    //alert("****" + fg.selectedRows.length);

    this.rowSel = 5;
    console.log(this.rowSel);

    //var sel = fg.selection;
    //alert("selection-" +sel.topRow + " ~ " +sel.bottomRow);
    //alert("selection-" +sel);
    //alert("selectedItems-" +fg.selectedItems.length);
    //alert("selectedRows-" +fg.selectedRows.length);


    //var ecv = fg.collectionView;
    //for (var i = sel.bottomRow; i >= sel.topRow; i--) {
    //    if (fg.rows[i].dataItem) {
    //        ecv.remove(fg.rows[i].dataItem);
    //    }
    //}

    //this.setAutoSizeColumns();

    //------------------------------------------------------------------------------------------
    var col = fg.columns[1];
    col.isReadOnly = false;

    var cap = [{ caption: "일", code: "1" }, { caption: "이", code: "2" }, { caption: "삼", code: "3" }];
    var dm = new wijmo.grid.DataMap(cap, "code", "caption");
    col.dataMap = dm;

}



// MultiSelection일 경우 전체 Row의 체크를 한다.
if (!oz_grid.prototype.checkAll) {
    oz_grid.prototype.checkAll = function () {
        if (this.checkColumn.visible) {
            var fg = this.fgObj;
            fg.beginUpdate();
            for (var r = 0; r < fg.rows.length; r++) {
                fg.setCellData(r, this.checkColumn.index, true);
            }
            fg.endUpdate();
        }
    }
}

// MultiSelection일 경우 전체 Row의 체크를 해제한다.
if (!oz_grid.prototype.unCheckAll) {
    oz_grid.prototype.unCheckAll = function () {
        if (this.checkColumn.visible) {
            var fg = this.fgObj;

            fg.beginUpdate();
            for (var r = 0; r < fg.rows.length; r++) {
                fg.setCellData(r, this.checkColumn.index, false);
            }
            fg.endUpdate();
        }
    }
}





// vsflexgrid.additem 메서드를 구현한다.
//  this.rows를 증가시키면 itemsSource와 연결된 행이 추가되고, 이후에 셀값을 넣는다.
//  wijmo FlexGrid에서는 itemsSource와 연결되지 않으면 sort를 할 수 없다.
if (!oz_grid.prototype.addItem) {      
    oz_grid.prototype.addItem = function (data, rowIndex) {
        var fg = this.fgObj;
        //var robj = {};     //new wijmo.grid.Row();
        var isHeader = rowIndex < this.fixedRows ? true : false;

        fg.beginUpdate();

        if (typeof rowIndex === "undefined") {
            this.rows += 1;
            rowIndex = this.rows - 1;
        }
        else {
            if (isHeader) {
                fg.columnHeaders.rows.splice(rowIndex, 0, new wijmo.grid.Row());
                //헤더쪽에 행이 추가될 때는 itemsSource는 그냥 둔다.
            } else {
                var r = rowIndex - this.fixedRows;

                //***** wijmo FlexGrid는 CollectionView의 맨앞이나 맨뒤에만 추가할 수 있고, 임의의 위치에는 추가할 수 없다. ////
                // http://cafe.naver.com/grapecity/3582
            }
        }

        var vals = data.split(String.fromCharCode(9));
        //console.log("value count=" + vals.length);
        for (var c = 0; c < vals.length; c++) {
            this.setCellData(rowIndex, c, vals[c]);
        }
        fg.itemsSource.commitNew();

        // indexColumn의 refresh는 추가된행의 commit 이후에.
        if (this.indexColumn.visible) {
            this.refreshIndex();
        }

        fg.endUpdate();
    }
}

// vsflexgrid.additem 메서드를 구현한다.
//  →[2017/12/06] 전에는 이 메서드를 사용했는데..  itemsSource도 처리해야 해서 위에 메서드로 대체함.
//if (!oz_grid.prototype.addItem2) {
//    oz_grid.prototype.addItem2 = function (data, rowIndex) {
//        var fg = this.fgObj;
//        var r = new wijmo.grid.Row();
//        var isHeader = rowIndex < this.fixedRows ? true : false;
//
//        fg.beginUpdate();
//
//        if (typeof rowIndex === "undefined")
//            fg.rows.push(r);
//        else {
//            if (isHeader) {
//                fg.columnHeaders.rows.splice(rowIndex, 0, r);
//            } else {
//                rowIndex -= this.fixedRows;
//                fg.rows.splice(rowIndex, 0, r);
//            }
//        }
//
//        var vals = data.split(String.fromCharCode(9));
//        //console.log("value count=" + vals.length);
//        for (var i = 0; i < vals.length; i++) {
//            if (isHeader) {
//                if (this.checkColumn.visible && i == this.checkColumn.index)
//                    fg.columnHeaders.setCellData(r.index, i, false);     // checkbox 컬럼 초기화
//                else
//                    fg.columnHeaders.setCellData(r.index, i, vals[i]);
//            } else {
//                if (this.checkColumn.visible && i == this.checkColumn.index)
//                    fg.setCellData(r.index, i, false);     // checkbox 컬럼
//                else
//                    fg.setCellData(r.index, i, vals[i]);
//            }
//        }
//
//        if (this.indexColumn.visible) {
//            fg.rowHeaders.setCellData(r.index, "_sequence_", r.index + 1);  // 일련번호
//        }
//
//        fg.endUpdate();
//    }
//}


// vsflexgrid.RemoveItem(row) 메서드를 구현한다. 파라미터로 주어진 행을 삭제.
if (!oz_grid.prototype.removeItem) {
    oz_grid.prototype.removeItem = function (r) {
        var row = parseInt(r);
        if (row < 0) return;

        var fg = this.fgObj;
        fg.beginUpdate();
        if (row < this.fixedRows)
            fg.columnHeaders.rows.removeAt(row);
        else {
            row -= this.fixedRows;
            //fg.rows.removeAt(row);
            fg.itemsSource.removeAt(row);   //itemsSource의 행을 삭제하면 rows도 삭제됨.

            //http://jsfiddle.net/Wijmo5/q4k4r7g7/  이글을 참고로 다음처럼 행을 삭제하려 했는데 안된다. 이게 제대로 삭제가 되려면 itemsSource에 배열이 아니라 CollectionView가 지정되어야 함!
            //var dataItem = fg.rows[row].dataItem;
            //fg.itemsSource.remove(dataItem);   
        }
        fg.endUpdate();

        this.refreshIndex();
    }
}

// (columnHeader를 제외한 데이터 영역을 기준으로) 선택된 모든 행을 삭제.
if (!oz_grid.prototype.removeSelItem) {
    oz_grid.prototype.removeSelItem = function () {
        var fg = this.fgObj;

        fg.beginUpdate();
        for (var r = fg.rows.length - 1; r >= 0; r--) {
            if (this.isSelected(r)) {
                //fg.rows.removeAt(r);
                fg.itemsSource.removeAt(r);     // itemsSource의 행을 삭제하면 rows도 함께 삭제된다.
            }
        }
        fg.endUpdate();

        this.refreshIndex();
    }
}


if (!oz_grid.prototype.setTextAlignFixed) {
    oz_grid.prototype.setTextAlignFixed = function (col, align) {
        var value = getAlignTextByNo(align);
        if (col) {
            this.fgObj.columnHeaders.columns[col].align = value;    //'left|right|center'
        } else {
            for (var c = 0; c < this.cols; c++)
                this.fgObj.columnHeaders.columns[c].align = value;   
        }
    }
}
if (!oz_grid.prototype.setTextAlign) {
    oz_grid.prototype.setTextAlign = function (col, align) {
        var value = getAlignTextByNo(align);
        if (col) {
            this.fgObj.columns[col].align = value;    //'left|right|center'
        } else {
            for (var c = 0; c < this.cols; c++)
                this.fgObj.columns[c].align = value;
        }
    }
}

// Private 메서드. 이곳에 정의하면 this == Window 
function getAlignTextByNo(align) {
    //value:
    // 0-LeftTop     3-CenterTop  6-RightTop  9-GeneralTop
    // 1-LeftCenter  4-CC         7-RC       10-GC 
    // 2-LeftBottom  5-CB         8-RB       11-GB
    var value = 'center';
    switch (align) {
        case 0, 1, 2:
            value = 'left';
            break;
        case 3, 4, 5:
            value = 'center'
            break;
        case 6, 7, 8:
            value = 'center'
            break;
    }
    return value
}




if (!oz_grid.prototype.autoColumnWidthByHeaderSuffix) {
    oz_grid.prototype.autoColumnWidthByHeaderSuffix = function (caption) {
        var fg = this.fgObj;

        //for (var c = fg.columns.length - 1; c >= 0; c--) {
        //    if (fg.columns[c].header.endsWith(caption)) {
        //        fg.columns[c].width = '*';
        //        break;
        //    } 
        //}
        
        //setTimeout(function () {
        //}, 100);

        fg.beginUpdate();

        //[2017/12/20] 컬럼폭을 조정할때 화면이 올라오기 전이면 $(this.id).width() 값이 0이라서 마지막 컬럼의 width="*" 으로 지장할 수 없다. 다른 코드로 구현해보자.
        var extra = 10;
        fg.autoSizeColumns(0, fg.columns.length - 1, false, extra);
        for (var c = 0; c < fg.columns.length; c++) {
            if (fg.columns[c].header == caption) {
                fg.columns[c].width = "*";
                break;
            }
        }
        fg.endUpdate();
    }
}




////////////////////////////////////////////////////////////////////////////////////////////////////
// getFixedRows, setFixedRows 메서드 대신에 fixedRows 속성을 사용하자.
////////////////////////////////////////////////////////////////////////////////////////////////////
//if (!oz_grid.prototype.getFixedRows) {
//    oz_grid.prototype.getFixedRows = function () {
//        return this.fgObj.columnHeaders.rows.length;
//    }
//}
//if (!oz_grid.prototype.setFixedRows) {
//    oz_grid.prototype.setFixedRows = function (rows) {
//        if (rows < 0) return;   // 최소한 1개 행은 항상 있다고 치고..

//        var fg = this.fgObj;
//        var getFixedRows = this.getFixedRows();

//        if (getFixedRows >= rows) {
//            var cnt = getFixedRows -rows;
//            while (cnt > 0) {
//                fg.columnHeaders.rows.removeAt(0);   // 헤더영역에서 첫번째 행만 계속 삭제하자
//                cnt--;
//            }
//        } else {
//            var cnt = rows -getFixedRows;
//            while (cnt > 0) {
//                fg.columnHeaders.rows.insert(0, new wijmo.grid.Row());
//                cnt--;
//            }
//        }
//    }
//}



////////////////////////////////////////////////////////////////////////////////////////////////////
// C1FlexGridClassic.rows 속성을 getRows, setRows로 구분해서 구현한다.
// getRows, setRows 메서드 대신에 rows 속성을 사용하자.
////////////////////////////////////////////////////////////////////////////////////////////////////
//if (!oz_grid.prototype.getRows) {
//    oz_grid.prototype.getRows = function () {
//        var fg = this.fgObj;
//        return (fg.columnHeaders.rows.length + fg.rows.length);
//    }
//}
//if (!oz_grid.prototype.setRows) {
//    oz_grid.prototype.setRows = function (rows) {
//        if (rows < 0) return;   // 최소한 1개 행은 항상 있다고 치고..
//
//        var fg = this.fgObj;
//        var getRows = this.getRows();
//
//        if (rows < this.fixedRows)
//            fg.rows.clear();
//        else {
//            if (getRows >= rows) {
//                var cnt = getRows -rows;
//                while (cnt > 0) {
//                    fg.rows.removeAt(fg.rows.length -1);
//                    cnt--;
//                }
//            } else {
//                var cnt = rows -getRows;
//                while (cnt > 0) {
//                    fg.rows.push(new wijmo.grid.Row());
//                    cnt--;
//                }
//            }
//        }
//    }
//}

////////////////////////////////////////////////////////////////////////////////////////////////////
// C1FlexGridClassic.cols 속성을 getCols, setCols로 구분해서 구현한다.
// getCols, setCols 메서드 대신에 cols 속성을 사용하자. 일단 코드는 유지한다.
////////////////////////////////////////////////////////////////////////////////////////////////////
//if (!oz_grid.prototype.getCols) {
//    oz_grid.prototype.getCols = function () {
//        //.NET의 ozgrid에서 일련번호 컬럼은 별도의 컨트롤이라서 cols값을 구하는데는 포함되지 않는다.
//        return this.fgObj.columns.length;
//    }
//}
//if (!oz_grid.prototype.setCols) {
//    oz_grid.prototype.setCols = function (cols) {
//        if (cols < 0) return;   // 최소한 1개 컬럼(체크컬럼)은 항상 있다고 치고..
//
//        var fg = this.fgObj;
//        var getCols = this.getCols();
//
//        if (getCols >= cols) {
//            var cnt = getCols - cols;
//            while (cnt > 0) {
//                fg.columns.removeAt(fg.columns.length - 1);
//                cnt--;
//            }
//        } else {
//            var cnt = cols - getCols;
//            while (cnt > 0) {
//                fg.columns.push(new wijmo.grid.Column());
//                cnt--;
//            }
//        }
//    }
//}




// vsflexgrid.cell(0, r, c) 속성을 구현한다.
if (!oz_grid.prototype.getCellData) {
    oz_grid.prototype.getCellData = function (row, col, formatted) {
        var r = parseInt(row);
        var c = parseInt(col);

        if (typeof formatted === "undefined") formatted = true;

        if (r < this.fixedRows)
            return this.fgObj.columnHeaders.getCellData(r, c, formatted);
        else {
            r -= this.fixedRows;
            var colType = this.fgObj.columns[c].dataType;
            if (colType == wijmo.DataType.Boolean)
                // 해당 컬럼이 체크박스를 표시하는 Boolean타입이면 [true|false] 대신에 [1|2]로 리턴한다.
                // →[2016/10/17] .NET C1FlexGrid 에서 사용하는 CellChecked값은 (http://helpcentral.componentone.com/docs/vsflexgrid8/cellcheckedproperty.htm)
                //  0-FlexNoCheckbox, 1-FlexChecked, 2-FlexUnchecked, .. 등이므로
                //  [true|false] 대신에 [1|2] 로 리턴하도록 변경.
                return (this.fgObj.getCellData(r, c, formatted) == "true" ? 1 : 2);
            else
                return this.fgObj.getCellData(r, c, formatted);
        }
    }
}
if (!oz_grid.prototype.setCellData) {
    oz_grid.prototype.setCellData = function (row, col, value) {
        var r = parseInt(row);
        var c = parseInt(col);

        if (r < this.fixedRows)
            this.fgObj.columnHeaders.setCellData(r, c, value);
        else {
            r -= this.fixedRows;
            var colType = this.fgObj.columns[c].dataType;
            var key = this.fgObj.columns[c].binding;

            if (colType == wijmo.DataType.Boolean) {
                // 해당 컬럼이 체크박스를 표시하는 Boolean타입이면 [1|2] 대신에 [true|false]으로 셋팅한다.
                var valueTF = (value == 1 ? true : false);
                this.fgObj.setCellData(r, c, valueTF);
                //this.fgObj.itemsSource[r][key] = valueTF;    CollectionView를 통해서 추가된 행이면 setCellData만으로도 itemsSource에 잘 반영됨.
            } else if (colType == wijmo.DataType.String && isNumeric(value)) {
                this.fgObj.setCellData(r, c, value.toString());
            } else {
                this.fgObj.setCellData(r, c, value);
                //this.fgObj.itemsSource[r][key] = value;
            }

        }
    }
}


if (!oz_grid.prototype.getCellAlign) {
    oz_grid.prototype.getCellAlign = function (row, col) {
        var r = parseInt(row);
        var c = parseInt(col);

        var align = null;
        if (r < this.fixedRows)
            align = this.fgObj.columnHeaders.columns[c].align;
        else
            align = this.fgObj.columns[c].align;

        switch (align) {
            case "left":
                return 1    //leftCenter
            case "center":
                return 4    //centerCenter
            case "right":
                return 7    //rightCenter
            default:     //general
                return null;
        }
    }
}
//gridCAmpInfo.fgObj.Cell(2, 0, i) = 4;
// → ozController.getControl('gridCampInfo').setCellAlign(0, i, 4);
if (!oz_grid.prototype.setCellAlign) {
    oz_grid.prototype.setCellAlign = function (row, col, value) {
        var r = parseInt(row);
        var c = parseInt(col);

        var align = null;
        switch (value) {
            case 0:     //leftTop
            case 1:     //leftCenter
            case 2:     //leftBottom     
                align = "left";
                break;
            case 3:     //centerTop
            case 4:     //centerCenter
            case 5:     //centerBottom
                align = "center";
                break;
            case 6:     //rightTop
            case 7:     //rightCenter
            case 8:     //rightBottom
                align = "right";
                break;
            case 9:     //general
                break;
        }

        if (r < this.fixedRows)
            this.fgObj.columnHeaders.columns[c].align = align;
        else
            this.fgObj.columns[c].align = align;        
    }
}

if (!oz_grid.prototype.getCellCheck) {
    oz_grid.prototype.getCellCheck = function (row, col) {
        return this.getCellData(row, col);        
    }
}
//columns[c].dataType을 Boolean으로 지정하고 컨트롤이 시작되면 setCellData 메서드로 충분히 체크값을 설정할 수 있다.
//  그런데 dataType을 String으로 지정하고, 스크립트에서 체크값을 지정한 경우가 있어서 체크값을 지정하는 별도의 메서드를 만든다.
//  이 메서드에서는 해당 컬럼이 Boolean타입이 아니면 강제로 Boolean타입으로 지정하도록 했다.
//gridCAmpInfo.fgObj.Cell(5, 0, i) = 1;
// → ozController.getControl('gridCampInfo').setCellCheck(0, i, 1);
if (!oz_grid.prototype.setCellCheck) {
    oz_grid.prototype.setCellCheck = function (row, col, value) {
        var r = parseInt(row);
        var c = parseInt(col);

        if (r < this.fixedRows)
            this.fgObj.columnHeaders.setCellData(r, c, value);
        else {
            r -= this.fixedRows;
            var colType = this.fgObj.columns[c].dataType;
            if (colType != wijmo.DataType.Boolean)
                this.fgObj.columns[c].dataType = wijmo.DataType.Boolean;

            // 해당 컬럼이 체크박스를 표시하는 Boolean타입이면 [1|2] 대신에 [true|false]으로 셋팅한다.
            var valueTF = (value == 1 ? true : false);
            if (this.radioButtonColumn.visible && this.radioButtonColumn.index == c)
                this.selectRadioRowIndex(r);
            else
                this.fgObj.setCellData(r, c, valueTF);
        }
    }
}





if (!oz_grid.prototype.editCell) {
    oz_grid.prototype.editCell = function (row, col) {
        var fg = this.fgObj;
        
        if (fg.columns[col].isReadOnly)
            fg.columns[col].isReadOnly = false;

        // http://demos.wijmo.com/5/Angular/WijmoHelp/WijmoHelp/topic/wijmo.grid.FlexGrid.Class.html#startEditing
        fg.startEditing(true, row, col, true);
    }
}


// 데이터 행만 검색
if (!oz_grid.prototype.findRow) {
    oz_grid.prototype.findRow = function (item, row, col) {
        var fg = this.fgObj;
        var r, c;

        if (typeof row === "undefined") row = this.fixedRows;
        if (typeof col === "undefined") col = -1;

        r = parseInt(row);
        c = parseInt(col);

        if (r >= this.fixedRows) {
            r -= this.fixedRows;

            if (c == -1) {
                //for (var i = r; i < fg.rows.length; i++) {
                //    if (fg.rows[i].dataItem == item)
                //        return i;
                //}
            } else {
                //[2017/12/19] 해당 컬럼의 dataType이 Date이거나 입력값이 date형 일때 입력값을 문자열로 바꿔서 비교한다.
                var colType = fg.columns[c].dataType;
                if ((colType == wijmo.DataType.Date) && (ozf_GetTypeName(item) == "date"))
                    item = ozf_ToShortDateString(item);

                for (var i = r; i < fg.rows.length; i++) {
                    if (fg.getCellData(r, c, true) == item)
                        return i;
                }
            }
        }
        return -1;
    }
}

// 헤더, 데이터행 모두 검색
oz_grid.prototype.findRow0 = function (item, col) {
    var fg = this.fgObj;
    var c = parseInt(col);

    //[2017/12/19] 해당 컬럼의 dataType이 Date이거나 입력값이 date형 일때 입력값을 문자열로 바꿔서 비교한다.
    var colType = fg.columns[c].dataType;
    if ((colType == wijmo.DataType.Date) || (ozf_GetTypeName(item) == "date"))
        item = ozf_ToShortDateString(item);

    for (var i = 0; i < this.fixedRows; i++) {
        if (fg.columnHeaders.getCellData(i, c, true) == item)
            return i;
    }
    for (var i = 0; i < fg.rows.length; i++) {
        if (fg.getCellData(i, c, true) == item)
            return (i + this.fixedRows);
    }
    return -1;
}



if (!oz_grid.prototype.clear) {
    oz_grid.prototype.clear = function () {
        this.setItemsSource([]);
        //this.fgObj.columns.clear();   컬럼 정보는 유지하자.
    }
}




// 파라미터 row는 columnHeader를 제외한 데이터 영역의 0 base 인덱스 이다.
if (!oz_grid.prototype.isSelected) {
    oz_grid.prototype.isSelected = function (row) {
        var fg = this.fgObj;
        // row.isSelected 속성값은 (selectionMode = ListBox) 일때는 정상동작하지만
        //  (selectionMode = Row) 일때는 항상 false값을 리턴해서 사용하기 곤란함.
        //return this.fgObj.rows[row].isSelected; -------- 사용불가!!!

        //if (fg.columns.getColumn(this.checkColumn)) {
        if (this.checkColumn.visible) {
            return fg.getCellData(row, this.checkColumn.index);
        } else if (this.radioButtonColumn.visible) {    // && this.showRadioButton) {
            return (row == this.selectedRadioRow);
        } else {
            return (fg.getSelectedState(row, 0) != wijmo.grid.SelectedState.None)
        }
    }
}

// (columnHeader를 제외한 데이터 영역을 기준으로) 현재 선택된 행의 수를 리턴한다.
if (!oz_grid.prototype.selectedRowCount) {
    oz_grid.prototype.selectedRowCount = function () {
        var fg = this.fgObj;
        var cnt = 0;
        //if (fg.columns.getColumn(this.checkColumn)) {
        //if (this.checkColumn.visible || (this.radioButtonColumn.visible && this.showRadioButton)) {
        if (this.checkColumn.visible || this.radioButtonColumn.visible) {
            for (var r = 0; r < fg.rows.length; r++) {
                if (this.isSelected(r))
                    cnt++;
            }
            return cnt;
        } else {
            return this.fgObj.selectedRows.length;
        }
    }
}

// 현재 선택된 행의 index(columnHeader를 포함하는 인덱스)를 문자열로 리턴한다.
// selectionMode에 따라 여러행이 선택된 경우는 여러행의 index값이 delimiter로 연결된 문자열을 리턴한다.
if (!oz_grid.prototype.selectedRowIndex) {
    oz_grid.prototype.selectedRowIndex = function () {
        var fg = this.fgObj;
        var ret = "";

        //if (fg.columns.getColumn(this.checkColumn)) {
        //if (this.checkColumn.visible || (this.radioButtonColumn.visible && this.showRadioButton)) {
        if (this.checkColumn.visible || this.radioButtonColumn.visible) {
            for (var r = 0; r < fg.rows.length; r++) {
                if (this.isSelected(r))
                    ret += (r + this.fixedRows) + this.delimiter;
            }
        } else {
            for (var i = 0; i < fg.selectedRows.length; i++) {
                ret += (fg.selectedRows[i].index + this.fixedRows) + this.delimiter;
            }
        }

        if (ret.length > 0) ret = ret.substr(0, ret.length - this.delimiter.length);
        return ret;
    }
}


// selectedColumnValue와 기능적으로 동일한 메서드.
//  다만 여기서는 첫번째 파라미터로 컬럼 인덱스(integer) 대신에 컬럼 키(string)만을 사용하고,
//  두번째 파라미터를 생략한 경우에 exportDelimiter를 사용하는게 다르다.
if (!oz_grid.prototype.getDataSourceValue) {
    oz_grid.prototype.getDataSourceValue = function (colKey, delimiter) {
        var fg = this.fgObj;
        var ret = "";
        var c = 0;

        if (typeof colKey != "string") return ret;  //오직 컬럼 키만 받는다.
        c = fg.columns.getColumn(colKey).index

        if (typeof delimiter === "undefined") delimiter = this.exportDelimiter;

        var colType = fg.columns[c].dataType;
        //if (fg.columns.getColumn(this.checkColumn)) {
        //if (this.checkColumn.visible || (this.radioButtonColumn.visible && this.showRadioButton)) {
        if (this.checkColumn.visible || this.radioButtonColumn.visible) {
            for (r = 0; r < fg.rows.length; r++) {
                // row.isSelected 속성값은 (selectionMode = ListBox) 일때는 정상동작하지만
                //  (selectionMode = Row) 일때는 항상 false값을 리턴해서 사용하기 곤란함.
                //  그래서 대신으로 this.isSelected 메서드를 추가함.
                //if (fg.rows[r].isSelected)
                if (this.isSelected(r)) {
                    // getData 메서드는 Date형이나 그외의 경우에도 값을 리턴한다.
                    ret += this.getData(r, colKey) + delimiter;
                }
            }
        } else {
            for (var i = 0; i < fg.selectedRows.length; i++) {
                // getData 메서드는 Date형이나 그외의 경우에도 값을 리턴한다.
                ret += this.getData(fg.selectedRows[i].index, colKey) + delimiter;
            }
        }

        if (ret.length > 0) ret = ret.substr(0, ret.length - delimiter.length);
        return ret;
    }
}

// 선택된 데이터 행에 대한 특정 컬럼의 값을 리턴한다.
//  selectionMode에 따라 여러행이 선택된 경우는 여러행의 특정 컬럼값이 delimiter로 연결된 값을 리턴한다.
//  첫번째 파라미터 col은 integer형 컬럼인덱스나 string형 컬럼키가 함께 사용된다.
if (!oz_grid.prototype.selectedColumnValue) {
    oz_grid.prototype.selectedColumnValue = function (col, delimiter) {
        var fg = this.fgObj;
        var c;
        var ret = "";

        if (typeof col === "string")
            c = fg.columns.getColumn(col).index;
        else
            c = col;

        if (typeof delimiter === "undefined") delimiter = ",";

        var colType = fg.columns[c].dataType;
        //if (fg.columns.getColumn(this.checkColumn)) {
        //if (this.checkColumn.visible || (this.radioButtonColumn.visible && this.showRadioButton)) {
        if (this.checkColumn.visible || this.radioButtonColumn.visible) {
            for (r = 0; r < fg.rows.length; r++) {
                // row.isSelected 속성값은 (selectionMode = ListBox) 일때는 정상동작하지만
                //  (selectionMode = Row) 일때는 항상 false값을 리턴해서 사용하기 곤란함.
                //  그래서 대신으로 this.isSelected 메서드를 추가함.
                //if (fg.rows[r].isSelected)
                if (this.isSelected(r)) {
                    //[2016/04/27] 이 메서드는 현재 화면에 표시되는 값 그대로를 리턴하고, dateDelimiter를 사용하는건 getDataSourceValue 에서만 지원한다.
                    //if (colType == wijmo.DataType.Date)
                    //    ret += this.getDate(r, col) + delimiter;
                    //else
                        ret += fg.getCellData(r, c, true) + delimiter;
                }
            }
        } else {
            for (var i = 0; i < fg.selectedRows.length; i++) {
                //[2016/04/27] 이 메서드는 현재 화면에 표시되는 값 그대로를 리턴하고, dateDelimiter를 사용하는건 getDataSourceValue 에서만 지원한다.
                //if (colType == wijmo.DataType.Date)
                //    ret += this.getDate(fg.selectedRows[i].index, col) + delimiter;
                //else
                    ret += fg.getCellData(fg.selectedRows[i].index, c, true) + delimiter;
            }
        }

        if (ret.length > 0) ret = ret.substr(0, ret.length -delimiter.length);
        return ret;
    }
}


// 모든 데이터 행에 대한 특정 컬럼의 값을 리턴한다.
// 파라미터 col은 숫자만 사용됨.
// selectionMode에 따라 여러행이 선택된 경우는 여러행의 특정 컬럼값이 delimiter로 연결된 값을 리턴한다.
//  .NET 환경의 Get_ColumnAllValue(..) 메서드를 대체하는 용도이다.
if (!oz_grid.prototype.allColumnValue) {
    oz_grid.prototype.allColumnValue = function (col, delimiter) {
        var fg = this.fgObj;
        var ret = "";
        var c = 0;

        //if (typeof col === "string")
        //    c = fg.columns.getColumn(col).index;
        //else
        c = parseInt(col);  //col;    
        if (typeof delimiter === "undefined") delimiter = this.delimiter;

        if (c == 0 && (this.checkColumn.visible || this.radioButtonColumn.visible)) {
            //[2017/12/18] 0번 컬럼이고, checkColumn이나 radioButtonColumn이면 isSelected(r) 행의 값만 리턴.
            for (r = 0; r < fg.rows.length; r++) {
                // row.isSelected 속성값은 (selectionMode = ListBox) 일때는 정상동작하지만
                //  (selectionMode = Row) 일때는 항상 false값을 리턴해서 사용하기 곤란함.
                //  그래서 대신으로 this.isSelected 메서드를 추가함.
                //if (fg.rows[r].isSelected)
                if (this.isSelected(r)) {
                    ret += fg.getCellData(r, c, true) + delimiter;
                }
            }
        } else {
            // 나머지는 모든 행의 값 리턴.
            for (r = 0; r < fg.rows.length; r++) {
                ret += fg.getCellData(r, c, true) + delimiter;
            }
        }

        if (ret.length > 0) ret = ret.substr(0, ret.length - delimiter.length);
        return ret;
    }
}


if (!oz_grid.prototype.allValue) {
    oz_grid.prototype.allValue = function () {
        var fg = this.fgObj;
        var r, c;

        /**
        <List>
            <Selectedinfo delimeter=";" selectionmode="2">
                <Row rowpos="4"><![CDATA[1;개인;중복제거용 1차;중복제거용 1차;4271170;20171109;468;즉시생성(리스트);분석;여의도지점;관리자;]]></Row>
                <Row rowpos="5"><![CDATA[1;개인;결혼한 고객;결혼한 고객_20171108;E1000098261_1001;20171108;787;즉시생성(리스트);Explorer;여의도지점;관리자;]]></Row>
                <Row rowpos="6"><![CDATA[1;개인;Olapp 테스트 합산 평점 고객;Olapp 테스트 합산 평점 고객;4271099;20171108;6763;즉시생성(리스트);분석;여의도지점;관리자;]]></Row>
            </Selectedinfo>
        </List>
        **/

        if (this.selectedRowCount() == 0) return "";

        var xWrt = new ozf_XMLWriter();
        xWrt.WriteStartDocument();
        xWrt.WriteStartElement("List");
        xWrt.WriteStartElement("Selectedinfo");
        xWrt.WriteAttributeString("delimeter", this.delimiter);
        xWrt.WriteAttributeString("selectionmode", this.selectionMode);

        //r =  selectedRow;
        for (r = 0; r < fg.rows.length; r++) {
            if (this.isSelected(r)) {
                tmp = "";
                var isFirst = true;
                for (c = 0; c < fg.columns.length; c++) {
                    if (c == this.checkColumn.index || c == this.radioButtonColumn.index)
                        continue;

                    if (isFirst) {
                        isFirst = false;
                        tmp += fg.getCellData(r, c, true);
                    } else
                        tmp += this.delimiter + fg.getCellData(r, c, true);
                }

                xWrt.WriteStartElement("Row");
                xWrt.WriteAttributeString("rowpos", r + this.fixedRows);
                xWrt.WriteCDATA(tmp);
                xWrt.WriteEndElement();
            }
        }
        xWrt.WriteEndElement();     // Eof 'Selectedinfo'
        xWrt.WriteEndElement();     // Eof 'List'

        tmp = xWrt.flush();
        xWrt.close();

        return tmp;
    }
}





// [2016/10/11] .NET Grid에서 사용하는 전체 좌표(0 ~ rows-1, 0 ~ cols-1) 그대로 사용한다.
if (!oz_grid.prototype.getBackColor) {
    oz_grid.prototype.getBackColor = function (row, col) {
        var r = parseInt(row);
        var c = parseInt(col);

        if (!this.backColor[r])
            return "#ffffff";
        else if (!this.backColor[r][c])
            return "#ffffff";
        else
            return this.backColor[r][c];
    }
}
//if (!oz_grid.prototype.getBackColor) {
//    oz_grid.prototype.getBackColor = function (row, col) {
//        var r = parseInt(row);
//        var c = parseInt(col);

//        var fg;
//        if (r < this.fixedRows)
//            fg = this.fgObj.columnHeaders;
//        else {
//            fg = this.fgObj;
//            r -= this.fixedRows;
//        }

//        if (!fg.rows[r].backColor)
//            return "#ffffff";
//        else if(!fg.rows[r].backColor[c])
//            return "#ffffff";
//        else
//            return fg.rows[r].backColor[c];
//    }
//}


if (!oz_grid.prototype.setBackColor) {
    oz_grid.prototype.setBackColor = function (row1, col1, row2, col2, value) {
        // .NET Grid에서 사용하는 좌표 그대로 사용한다.

        var r1 = parseInt(row1);
        var c1 = parseInt(col1);
        var r2, c2;
        if (typeof value !== "undefined") {
            r2 = parseInt(row2);
            c2 = parseInt(col2);
        } else {
            r2 = r1;
            c2 = c1;
            value = row2;   // color값
        }

        if (r1 > r2) r2 = [r1, r1 = r2][0];     // one-line swap method
        if (c1 > c2) c2 = [c1, c1 = c2][0];
        for (var r = r1; r <= r2; r++) {
            for (var c = c1; c <= c2; c++) {
                if (!this.backColor[r]) this.backColor[r] = [];
                this.backColor[r][c] = value;
            }
        }
        this.fgObj.refresh();
    }
}
//** row 객체에 backColor 배열을 추가해서 구현해보려 했는데.. 이것역시 itemsSource의 것이 아니라서 sort가 되면 삭제되어 쓸 수 없다.
//if (!oz_grid.prototype.setBackColor) {
//    oz_grid.prototype.setBackColor = function (row1, col1, row2, col2, value) {
//        // .NET Grid에서 사용하는 좌표 그대로 사용한다.
//        var fg, rr;
//        var r1 = parseInt(row1);
//        var c1 = parseInt(col1);
//        var r2, c2;
//        if (typeof value !== "undefined") {
//            r2 = parseInt(row2);
//            c2 = parseInt(col2);
//        } else {
//            r2 = r1;
//            c2 = c1;
//            value = row2;   // color값
//        }

//        //if (r1 > r2) r2 = [r1, r1 = r2][0];     // one-line swap method
//        //if (c1 > c2) c2 = [c1, c1 = c2][0];
//        //for (var r = r1; r <= r2; r++) {
//        //    if (r < this.fixedRows) {
//        //        fg = this.fgObj.columnHeaders;
//        //        rr = r;
//        //    }
//        //    else {
//        //        fg = this.fgObj;
//        //        rr = r - this.fixedRows;
//        //    }
//        //    for (var c = c1; c <= c2; c++) {
//        //        //if (!this.backColor[r]) this.backColor[r] = [];
//        //        //this.backColor[r][c] = value;

//        //        //if (!fg.rows[rr].backColor) fg.rows[rr].backColor = [];
//        //        //fg.rows[rr].backColor[c] = value;
//        //    }
//        //}

//        this.fgObj.refresh();
//    }
//}



if (!oz_grid.prototype.beginUpdate) {
    oz_grid.prototype.beginUpdate = function () {
        this.fgObj.beginUpdate();
    }
}
if (!oz_grid.prototype.endUpdate) {
    oz_grid.prototype.endUpdate = function () {
        this.fgObj.endUpdate();
    }
}



if (!oz_grid.prototype.applySettings) {
    oz_grid.prototype.applySettings = function () {
        //alert("applySettings");

        //console.log(padLeft("oz.grid('" + this.id + "') begin applySettings → ", 50, ' ') + timeStamp());
        //timeLog += "\n" + padLeft("oz.grid('" +this.id + "') begin applySettings → ", 50, ' ') +timeStamp();

        var fg = this.fgObj;
        fg.beginUpdate();


        // 행의 일련번호는 rowHeader에 추가.
        this.indexColumn.visible = this.indexColumnVisible;
        if (this.indexColumn.index < 0) {
            fg.rowHeaders.columns.clear();
            fg.rowHeaders.columns.push(this.indexColumn);
        }

        if (this.mergedRows.length > 0) {
            // 컬럼헤더에 Merge를 사용하면.. ColumnHeaders 영역만 머지가 적용 되도록 변경한다.
            fg.allowMerging = wijmo.grid.AllowMerging.ColumnHeaders;

            for (var r = 0; r < this.mergedRows.length; r++) {
                fg.columnHeaders.rows.insert(r, new wijmo.grid.Row());
                fg.columnHeaders.rows[r].allowMerging = true;   //[2016/09/01]

                var columns = this.mergedRows[r];
                for (var c = 0; c < columns.length; c++) {

                    //[2016/11/03] columnHeaders.columns에 대해 allowMerging을 지정했지만, 일반 columns에도 그대로 반영되므로 아래문을 무조건 지정하면 곤란함.
                    //fg.columnHeaders.columns[c].allowMerging = true;    //[2016/09/01]

                    //console.log("columns.length = " +columns.length);
                    //console.log(columns[c].binding + ", " + columns[c].caption);
                    var binding = columns[c].binding;
                    if (binding == "") {
                        if (c < fg.columnHeaders.columns.length) {
                            //binding이 지정되지 않은 컬럼은 인덱스로 접근해 캡션을 지정한다.
                            fg.columnHeaders.setCellData(r, c, columns[c].caption);
                        }
                    } else {
                        fg.columnHeaders.setCellData(r, binding, columns[c].caption);
                    }
                }
            }

            this.checkColumn.allowMerging = true;
        }

        if (fg.columnHeaders.rows.length > 1) {
            // topLeftCells가 여러행이면 헤더가 Merge될 수 있도록 같은값을 넣어준다.
            if (this.indexColumn.visible) {
                for (var r = 0; r < fg.topLeftCells.rows.length; r++)
                    fg.topLeftCells.setCellData(r, 0, this.indexColumn.header);  //fg.topLeftCells.setCellData(r, 0, "No");
                //fg.topLeftCells.columns[0].allowMerging = true;
            }

            if (this.checkColumn.visible) {
                // columnHeaders가 여러행이면 헤더가 Merge될 수 있도록 같은값을 넣어준다.
                for (var r = 0; r < fg.columnHeaders.rows.length - 1; r++)
                    fg.columnHeaders.setCellData(r, this.checkColumn.index, this.selectionHeader);

            }

            if (this.radioButtonColumn.visible) {
                // columnHeaders가 여러행이면 헤더가 Merge될 수 있도록 같은값을 넣어준다.
                for (var r = 0; r < fg.columnHeaders.rows.length - 1; r++)
                    fg.columnHeaders.setCellData(r, this.radioButtonColumn.index, this.selectionHeader);
            }

            // columnHeaders 영역의 새로로 merge를 적용한다.
            //  위에서 fg.allowMerging을 wijmo.grid.AllowMerging.ColumnHeaders 영역으로 한정했기 때문에
            //  이렇게 컬럼별 merge를 설정해도 헤더 영역에만 영향을 주고, 데이터 부분은 merge되지 않는다.
            for (var c = 0; c < fg.columns.length; c++) {
                fg.columnHeaders.columns[c].allowMerging = true;
            }
        }

        //if (this.indexColumn.visible) {
        //    for (var r = 0; r < fg.rows.length; r++) {
        //        fg.rowHeaders.setCellData(r, "_sequence_", r + 1);
        //    }
        //}


        //fg.autoSizeColumns(0, fg.columns.length - 1, false, 4);
        fg.endUpdate();

        this.refresh();

        //console.log(padLeft("oz.grid('" + this.id + "') end applySettings → ", 50, ' ') + timeStamp());
        //timeLog += "\n" + padLeft("oz.grid('" +this.id + "') end applySettings → ", 50, ' ') +timeStamp();
        //alert(timeLog);
    }
}




function itemFormatter(panel, r, c, cell) {
    //alert("itemFormatter");
    var grid = ozgrid_instMgr.getInstance(this)   // this = wijmo.grid.FlexGrid
    var fg = panel.grid;    // panel = flexGrid, flexGrid.columnHeaders, flexGrid.rowHeaders 등등..
    var rr = r;

    //// cell 배경색 적용.
    //// .NET기준의 행 값은 헤더영역이 포함된 값이고, wijmo FlexGrid는 CellType.ColumnHeader 와 CellType.Cell을 구분해야함.    
    //if (panel.rows[r].backColor && panel.rows[r].backColor[c]) 
    //    cell.style.backgroundColor = panel.rows[r].backColor[c];

    //[2016/11/07] <div class='v-transform'>을 사용하면 vertical-align이 적용되긴 하는데.. 체크박스 컬럼이 제대로 동작하지 않아서 다른방법을 찾아야함.
    //[2016/09/01] 모든영역에 VerticalAlign을 middle로 지정하기.
    //cell.style.verticalAlign = "bottom";    //이렇게 지정하는건 적용이 안돼서 아래 루틴으로 대신함. CSS도 지정해야 한다.
    //cell.innerHTML = "<div class='v-transform'>" + cell.innerHTML + "</div>";

    if (panel.cellType == wijmo.grid.CellType.Cell) {
        var col = panel.columns[c];
        var html = cell.innerHTML;

        if (col === grid.radioButtonColumn) {
            //cell.innerHTML = '<input type="radio" ng-model="selectId" value=' + r + '>'; cell.style.padding = '3px';
            // radio버튼은 name에 지정하는 값이 그룹이 된다.
            cell.innerHTML = "<input type='radio' id='" + grid.id + "_" + r + "' name='" + grid.id + "' value='" + r + "'/>";


            // 다음처럼 v-transform 으로 싸면 수직으로 가운데정렬이 되는건 확인하였음. 그러나.. 행을 클릭했을때 선택된 행의 라디오버튼이 
            //  강제로 선택되게 만드는 부분이 진행되지 않는 문제가 있음. 체크박스에서도 마찬가지임.
            //cell.innerHTML = "<div class='v-transform'><input type='radio' name='" + grid.id + "' value=" + r + "/></div>";

            var radio = cell.children[0];
            //radio.onchange = function (e) {  ---> wijmo FlexGrid의 셀들은 보여질때만 element가 존재하므로 그런 element에 이벤트를 정의하는건 의미가 없다.
            //    this.selectedRadioRow = parseInt(e.target.value);
            //    var checked = fg.getCellData(r, c);
            //    fg.setCellData(r, c, !checked);
            //}
            radio.checked = (fg.getCellData(r, c) == true ? true : false);
            return;
        }


        switch (col.dataType) {
            case wijmo.DataType.Number:
                if (typeof fg.getCellData(r, c) === "string") {
                    // getCellData로 구한값이 문자열이라도 이렇게 강제로 숫자로 한번더 입력하면.. 컬럼에 설정된 format이 반영된다.
                    // format이 EmptyString 이어도 숫자값을 setCellData를 호출하면 기본 숫자서식 "n0"가 맘대로 적용된다. ㅠ
                    //  그래서 컬럼의 format 값을 확인해서 EmptryString이 아닐때만 setCellData를 호출하자.
                    if (fg.columns[c].format != "") {
                        var value = parseFloat(fg.getCellData(r, c));
                        fg.setCellData(r, c, value);
                    }
                }
                break;

            case wijmo.DataType.Date:
                if (typeof fg.getCellData(r, c) === "string") {
                    // setCellData메서드로 값을 바꾸면 내부적으로 계속 itemFormatter가 반복 호출 되므로
                    // 특정조건에서 한번만 값을 지정하도록 해야한다.
                    var value = fg.getCellData(r, c, true);
                    if (value.length == 8) {
                        var y = value.substr(0, 4);
                        var m = value.substr(4, 2);
                        var d = value.substr(6, 2);
                        fg.setCellData(r, c, y + "-" + m + "-" + d);
                    }
                }
                break;
        }

        if (col.name == "_hyper_") {
            //html = "<a href='http://www.naver.com/'>Edit</a>";
            //html = "<a style='color: red;'>" + fg.getCellData(r, c, true) + "</a>";
            //html = "<a style='color: #339966; background-color:yellow; cursor: pointer'>" + fg.getCellData(r, c, true) + "</a>";
            //cell.style.backgroundColor = "red";  --- 해당 셀 전체에 배경색을 지정함. cell.innerHTML에 style로 배경색을 지정하면 해당 텍스트의 배경색만 적용된다.

            //cell.innerHTML = "<a style='cursor:pointer' >" + fg.getCellData(r, c, true) + "</a>";
            cell.innerHTML = "<div class='v-transform'><a style='cursor:pointer' >" + html + "</a></div>";

            //** <div ...> 태그로 싸면 checkColumn, radioButtonColumn 을 클릭했을때 제대로 동작하지 않는다.
            //} else {
            //    cell.innerHTML = "<div class='v-transform'>" + html + "</div>";
        }

        // cell 배경색 적용. rowHeader, columnHeader 영역은 제외하고 적용하자.
        // .NET기준의 행 값은 헤더영역이 포함된 값이고, wijmo FlexGrid는 CellType.ColumnHeader 와
        //  CellType.Cell 영역의 행값을 별도로 사용하므로 fixedRows 값을 적절히 빼주고, 더해주고 해야함.
        rr += grid.fixedRows;

        if (grid.backColor[rr] && grid.backColor[rr][c]) {
            cell.style.backgroundColor = grid.backColor[rr][c];
        }

    } else {
        cell.style.textAlign = "center";

        //[2016/11/09] FlexGrid의 formatItem 이벤트에서 VerticalAlign을 지정하므로, 여기서는 생략해도 됨.
        //  → formatItem 이벤트에서 VerticalAlign을 지정하는 부분에 오류가 있어서 아래 헤더를 정렬하는 코드를 계속 사용해야겠음.
        ////[2016/09/01] columnHeader영역에 VerticalAlign을 middle로 지정하기.
        ////cell.style.verticalAlign = "bottom";    //이렇게 지정하는건 적용이 안돼서 아래 루틴으로 대신함. CSS도 지정해야 한다.
        cell.innerHTML = "<div class='v-transform'>" + cell.innerHTML + "</div>";
    }
}




