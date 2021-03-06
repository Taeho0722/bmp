//ozf_GetAttributeValue     ozf_StringIsEmpty
//oz_ConvertDataTypeNoToENUM

//ReportHandler
    function ozReportHandler() {

        this.parser = new ozResultParser();
        this.colrow = new ozf_Collection();
        this.colcolumn = new ozf_Collection();
        this.colmeasure = new ozf_Collection();
        this.colfilter = new ozf_Collection();

    }


    /*=================================================
    * Report Result Parse
    ==================================================*/
    function ozResultParser() {
        this.RowLabelValueTypeList = new oz_Hashtable();
        this.ColumnLabelValueTypeList = new oz_Hashtable();

        this.ReportName;
        this.ParseError = false;
        this.ParseErrorContent;
        this.RowLabelList;
        this.Delimiter = ";";
        this.IsCross = true;
        this.HasNoData = false;
        this.IsMeasureOnColumn = true;
        this.MeasurePosIdx = 0;
        this.RowLevelCount = 0;
        this.ColumnLevelCount = 0;
        this.RecordCount = 0;
        this.ColumnCount = 0;

        this.DataExceeded = false;
        this.HasCode = false;
        this.HasCodeSort = false;

        this._lists = new ozf_Collection(); // new oz_Hashtable;
        this.FilterContent;

        this.xFormulaSet;

        this.GrandTotalLabel = "Grand Total";
        this.SubTotalLabel = "Total";
        this.RowDataMaxSizeList = "";
        this.ColDataMaxSizeList = "";

        this.MatrixValues;
        this.MatrixRowLabels;
        this.MatrixColumnLabels;
        this.MatrixRowLabels_Code;
        this.MatrixColumnLabels_Code;
        this.MatrixTopLeft;
        this.MatrixValueLocRow;
        this.MatrixValueLocCol;

        this.ColSummary;
        this.xMeasureFactSummary;
    }

    /*---------------------------------------------------
    * Parse
    ---------------------------------------------------*/
    ozResultParser.prototype.Parse = function (xmlcontent) {
        this.ParseError = false;
        this.ParseErrorContent = "";
        this.HasNoData = false;

        this.ColSummary = null;

        if (ozf_StringIsEmpty(xmlcontent)) {
            this.ParseError = true;
            this.ParseErrorContent = "Null Content";
            return false;
        }

        var xmlDoc;
        xmlDoc = ozf_getXMLDoc(xmlcontent);

        var xEroot = xmlDoc.documentElement.childNodes[0];
        var xCDat;
        var MeasurePosition;
        if (ozf_GetAttributeValue(xEroot, "error") == "LIMIT") {
            this.ParseError = false; 
            this.ParseErrorContent = "검색 결과 최대치 '{0}'값을 넘어갔습니다.".format(ozf_GetAttributeValue(xEroot, "resultlimitcount"));
            this.RecordCount = 0;
            return false;
        }

        this.ReportName = ozf_GetAttributeValue(xEroot, "reportname")

        //--Data Structure
        this.Delimiter = ozf_GetAttributeValue(xEroot, "cdatadelimiter");
        this.IsCross = ozf_GetAttributeValue(xEroot, "reporttype") == "CROSS" ? true : false;

        if (ozf_GetAttributeValue(xEroot, "measurelabellocation").toUpperCase() == "COLUMN") {
            this.IsMeasureOnColumn = true;
        } else {
            this.IsMeasureOnColumn = false;
        }
        this.MeasurePosIdx = parseInt(ozf_GetAttributeValue(xEroot, "measurepositionondims", "0"));
        this.RowDataMaxSizeList = ozf_GetAttributeValue(xEroot, "rowdatamaxsizelist");
        this.ColDataMaxSizeList = ozf_GetAttributeValue(xEroot, "columndatamaxsizelist");
        this.GrandTotalLabel = ozf_GetAttributeValue(xEroot, "grandtotallabel", "Grand Total");
        this.SubTotalLabel = ozf_GetAttributeValue(xEroot, "subtotallabel", "Total");

        //Filter
        var xfind;

        xfind = oz_GetFindElement(xEroot, "Filter");
        if (xfind != null) {
            xCDat = xfind.childNodes[0];
            this.FilterContent = xCDat.wholeText.trim();
        }

        //Formula    
        xfind = oz_GetFindElement(xEroot, "FormulaSet");
        if (xfind != null) {
            this.xFormulaSet = xfind.childNodes[0];
        }

        xfind = oz_GetFindElement(xEroot, "MeasureFactSummary");
        if (xfind != null) {
            this.xMeasureFactSummary = xfind; //.childNodes[0]; //ejyoon0617
        }

        var iColCnt, iRowCnt;
        var idx1, idx2;
        var sTokList;
        var DataList;
        var Dimidx;
        var pOItem;
        var sType;
        var i, r, c;

        if (parseInt(ozf_GetAttributeValue(xEroot, "columnlabelcount", "0")) + parseInt(ozf_GetAttributeValue(xEroot, "rowlabelcount", "0")) == 0) {
            this.HasNoData = true;
        }

        this.ColumnCount = parseInt(ozf_GetAttributeValue(xEroot, "columnlabelcount", "0"));

        var sV = oz_ReplaceString(ozf_GetAttributeValue(xEroot, "olapitemcodesizelist").trim(), this.Delimiter, "");
        if (sV.Length > 0) {
            this.HasCode = true;
        }
        sV = oz_ReplaceString(ozf_GetAttributeValue(xEroot, "olapitemsortsizelist").trim(), this.Delimiter, "");
        if (sV.Length > 0) {
            this.HasCodeSort = true;
        }
        this._lists.clear();

        //Cross
        if (this.IsCross) {
            if (this.ColumnCount == 0) {
                this.ColumnCount = 1;
            }
            this.RecordCount = parseInt(ozf_GetAttributeValue(xEroot, "rowlabelcount", "0"));
            if (this.RecordCount == 0) {
                this.RecordCount = 1;
            }

            if (this.xMeasureFactSummary != null) {
                var newfield;
                for (i = 0; i < this.xMeasureFactSummary.childNodes.length; i++) {
                    xitem = this.xMeasureFactSummary.childNodes[i];
                    newfield = new ozField();
                    newfield.Name = ozf_GetAttributeValue(xitem, "ozid");
                    newfield.Alias = ozf_GetAttributeValue(xitem, "name");
                    sType = ozf_GetAttributeValue(xitem, "baseformat");
                    if (!ozf_StringIsEmpty(sType.Length)) {
                        //baseformatÀÌ ÀÖ´Â °æ¿ì »ç¿ë
                        newfield.DataType = sType;
                    } else {
                        //baseformatÀÌ ¾øÀ¸¸é reffieldvaluetype »ç¿ë
                        newfield.RefFieldID = ozf_GetAttributeValue(xitem, "reffieldozid");
                        sType = ozf_GetAttributeValue(xitem, "reffieldvaluetype");
                        newfield.DataType = oz_ConvertDataTypeNoToENUM(sType);
                    }

                    if (this._lists.containsKey(newfield.Alias)) {
                        //Diagnostics.Debug.WriteLine(String.Format("ClsResult_Parse:_list.add:'{0}'", newfield.Alias))
                    } else {
                        this._lists.put(newfield.Alias, newfield);
                    }
                }
            }

            //==Label Area==
            //==Row Label Area=========================================================
            this.RowLevelCount = parseInt(ozf_GetAttributeValue(xEroot, "rowlabelitemcount", "0"));
            iRowCnt = this.RecordCount;
            iColCnt = this.RowLevelCount;
            if (iRowCnt == 0 || iColCnt == 0) {
                this.MatrixRowLabels = new oz_matrix(0, 0, "");
                this.MatrixRowLabels_Code = new oz_matrix(0, 0, "");
            } else {
                this.MatrixRowLabels = new oz_matrix(iRowCnt, iColCnt, "");
                this.MatrixRowLabels_Code = new oz_matrix(iRowCnt, iColCnt, "");
            }

            sTokList = ozf_GetAttributeValue(xEroot, "rowoziditemlist");
            var CodeList = ozf_GetAttributeValue(xEroot, "olapitemcodesizelist");
            var SortCodeList = ozf_GetAttributeValue(xEroot, "olapitemsortsizelist")

            this.RowLabelValueTypeList = this.Arrange_ItemCodeValueType(sTokList, this.Delimiter, CodeList, SortCodeList, 0);
            this.RowLabelList = ozf_GetAttributeValue(xEroot, "rowlabelitemlist");

            xCDat = xEroot.getElementsByTagName("RowLabelList")[0].childNodes[0];
            DataList = oz_SplitToArray(xCDat.wholeText.trim(), this.Delimiter);
            idx1 = 0;

            if (!this.IsMeasureOnColumn) {
                this.MeasurePosition = iColCnt - this.MeasurePosIdx - 1;
            }

            for (r = 0; r < iRowCnt; r++) {
                Dimidx = 0;
                for (c = 0; c < iColCnt; c++) {
                    //Cº°·Î ÄÚµå, ÄÚµå¼ÒÆ®°¡ Á¸Àç ¿©ºÎ Ã¼Å©
                    this.MatrixRowLabels[r][c] = DataList[idx1];
                    idx1 += 1;

                    if (!this.IsMeasureOnColumn) {
                        if (c != this.MeasurePosition) {
                            if (!this.RowLabelValueTypeList.isEmpty()) {
                                //Rº°·Î ÄÚµå, ÄÚµå¼ÒÆ®°¡ Á¸Àç ¿©ºÎ Ã¼Å©
                                switch (this.Get_ItemValueType(this.RowLabelValueTypeList, Dimidx, true)) {
                                    case "code":
                                        this.MatrixRowLabels_Code[r][c] = DataList[idx1];
                                        idx1 += 1;
                                        break;
                                    case "sortcode":
                                        //Sort´Â Á¦¿Ü
                                        idx1 += 1;
                                        this.MatrixRowLabels_Code[r][c] = DataList[idx1];
                                        idx1 += 1;
                                        break;
                                    default:
                                }
                                Dimidx += 1;
                            }
                        } else {
                            this.MatrixRowLabels_Code[r][c] = "";
                        }
                    } else {
                        if (!this.RowLabelValueTypeList.isEmpty()) {
                            switch (this.Get_ItemValueType(this.RowLabelValueTypeList, c, false)) {
                                case "code":
                                    this.MatrixRowLabels_Code[r][c] = DataList[idx1];
                                    idx1 += 1;
                                    break;
                                case "sortcode":
                                    //Sort´Â Á¦¿Ü
                                    idx1 += 1;
                                    this.MatrixRowLabels_Code[r][c] = DataList[idx1];
                                    idx1 += 1;
                                    break;
                                default:
                            }
                        }
                    }
                }
            }
            //==Row Label Area=========================================================

            //==Column Label Area=========================================================
            this.ColumnLevelCount = parseInt(ozf_GetAttributeValue(xEroot, "columnlabelitemcount", "0"));
            iRowCnt = this.ColumnLevelCount;
            iColCnt = this.ColumnCount;
            if (iRowCnt == 0 || iColCnt == 0) {
                this.MatrixColumnLabels = new oz_matrix(0, 0, "");
                this.MatrixColumnLabels_Code = new oz_matrix(0, 0, "");
            } else {
                this.MatrixColumnLabels = new oz_matrix(iRowCnt, iColCnt, "");
                this.MatrixColumnLabels_Code = new oz_matrix(iRowCnt, iColCnt, "");
            }

            sTokList = ozf_GetAttributeValue(xEroot, "columnoziditemlist");
            this.ColumnLabelValueTypeList = this.Arrange_ItemCodeValueType(sTokList, this.Delimiter, CodeList, SortCodeList, this.RowLevelCount);

            xCDat = xEroot.getElementsByTagName("ColumnLabelList")[0].childNodes[0];
            DataList = oz_SplitToArray(xCDat.wholeText.trim(), this.Delimiter);
            idx1 = 0;
            //bug
            if (this.IsMeasureOnColumn) {
                this.MeasurePosition = iRowCnt - this.MeasurePosIdx - 1;
            }

            for (c = 0; c < iColCnt; c++) {
                Dimidx = 0;
                for (r = 0; r < iRowCnt; r++) {
                    //Cº°·Î ÄÚµå, ÄÚµå¼ÒÆ®°¡ Á¸Àç ¿©ºÎ Ã¼Å©
                    this.MatrixColumnLabels[r][c] = DataList[idx1];
                    idx1 += 1;
                    if (this.IsMeasureOnColumn) {
                        if (r != this.MeasurePosition) {
                            if (!this.ColumnLabelValueTypeList.isEmpty()) {
                                //Rº°·Î ÄÚµå, ÄÚµå¼ÒÆ®°¡ Á¸Àç ¿©ºÎ Ã¼Å©
                                switch (this.Get_ItemValueType(this.ColumnLabelValueTypeList, Dimidx, true)) {
                                    case "code":
                                        this.MatrixColumnLabels_Code[r][c] = DataList[idx1];
                                        idx1 += 1;
                                        break;
                                    case "sortcode":
                                        //Sort´Â Á¦¿Ü
                                        idx1 += 1;
                                        this.MatrixColumnLabels_Code[r][c] = DataList[idx1];
                                        idx1 += 1;
                                        break;
                                    default:
                                }
                                Dimidx += 1;
                            }
                        } else {
                            this.MatrixColumnLabels_Code[r][c] = "";
                        }
                    } else {
                        if (!this.ColumnLabelValueTypeList.isEmpty()) {
                            switch (this.Get_ItemValueType(this.ColumnLabelValueTypeList, c, false)) {
                                case "code":
                                    this.MatrixColumnLabels_Code[r][c] = DataList[idx1];
                                    idx1 += 1
                                    break;
                                case "sortcode":
                                    //Sort´Â Á¦¿Ü
                                    idx1 += 1
                                    this.MatrixColumnLabels_Code[r][c] = DataList[idx1];
                                    idx1 += 1
                                    break;
                                default:
                            }
                        }
                    }
                }
            }
            //==Column Label Area=========================================================

            //==Data Area========================================================
            iRowCnt = this.RecordCount;
            iColCnt = this.ColumnCount;

            this.MatrixValues = new oz_matrix(iRowCnt, iColCnt, "");
            this.MatrixValueLocCol = [iColCnt];
            this.MatrixValueLocRow = [iRowCnt];

            xCDat = xEroot.getElementsByTagName("DataList")[0].childNodes[0];
            DataList = oz_SplitToArray(xCDat.wholeText.trim(), this.Delimiter);

            if (DataList.length == 0) {
                this.HasNoData = true;
            }

            if (!this.HasNoData) {
                idx1 = 0;
                for (r = 0; r < iRowCnt; r++) {
                    for (c = 0; c < iColCnt; c++) {
                        //this.MatrixValues[r][c] = getTypedValue(DataList(idx1), r, c)
                        this.MatrixValues[r][c] = DataList[idx1];
                        idx1 += 1;
                    }
                }
            }

            //==Top Left Area =============================================================
            if (this.RowLevelCount > 0 && this.ColumnLevelCount > 0) {
                var mindex = this.MeasureLevelIndex();
                this.MatrixTopLeft = new oz_matrix(this.ColumnLevelCount, this.RowLevelCount, "");

                if (this.IsMeasureOnColumn) {
                    DataList = oz_SplitToArray(ozf_GetAttributeValue(xEroot, "rowlabelitemlist"), this.Delimiter);
                    for (c = 0; c < this.RowLevelCount; c++) {
                        this.MatrixTopLeft[mindex][c] = DataList[c];
                    }
                    DataList = oz_SplitToArray(ozf_GetAttributeValue(xEroot, "columnlabelitemlist"), this.Delimiter);
                    idx1 = 0;
                    for (r = 0; r < this.ColumnLevelCount; r++) {
                        if (r == mindex) {
                            continue;
                        }
                        this.MatrixTopLeft[r][this.RowLevelCount - 1] = DataList[idx1];
                        idx1 += 1;
                    }
                } else {
                    DataList = oz_SplitToArray(ozf_GetAttributeValue(xEroot, "rowlabelitemlist"), this.Delimiter);
                    idx1 = 0;
                    for (c = 0; c < this.RowLevelCount; c++) {
                        if (c == mindex) {
                            continue;
                        }
                        this.MatrixTopLeft[this.ColumnLevelCount - 1][c] = DataList[idx1];
                        idx1 += 1;
                    }
                    DataList = oz_SplitToArray(ozf_GetAttributeValue(xEroot, "columnlabelitemlist"), this.Delimiter);
                    for (r = 0; r < this.ColumnLevelCount; r++) {
                        this.MatrixTopLeft[r][mindex] = DataList[r];
                    }
                }
            }
        }
        // Cross===========================================================================

        // List===========================================================================
        else {
            this.RecordCount = parseInt(ozf_GetAttributeValue(xEroot, "recordcount", "0"));
            if (this.ReportName == "__VALUELIST__") {
                if (ozf_GetAttributeValue(xEroot, "dataexceeded", "F") == "T") {
                    this.DataExceeded = true;
                } else {
                    this.DataExceeded = false;
                }
            }
            //==Label Area==
            var sIDList;
            var sTypList = ozf_GetAttributeValue(xEroot, "olapitemtypelist");
            idx1 = 0;
            idx2 = 0;
            var idx0 = 0;
            var pfield;

            if (this.IsMeasureOnColumn) {
                //==Label
                this.ColumnLevelCount = 1;
                this.RowLevelCount = 0;
                this.MatrixColumnLabels = new oz_matrix(this.ColumnLevelCount, this.ColumnCount, "");

                xCDat = xEroot.getElementsByTagName("ColumnLabelList")[0].childNodes[0];
                DataList = oz_SplitToArray(xCDat.wholeText.trim(), this.Delimiter);
                for (c = 0; c < this.ColumnCount; c++) {
                    this.MatrixColumnLabels[0][c] = DataList[c];
                }
                //==Lists Ã¤¿ì±â :
                sIDList = ozf_GetAttributeValue(xEroot, "columnoziditemlist");
                var sAliasList = ozf_GetAttributeValue(xEroot, "columnlabelitemlist")

                var arr1 = sIDList.split(this.Delimiter);
                var arr2 = sAliasList.split(this.Delimiter);
                var arr3 = sTypList.split(this.Delimiter);
                for (c = 1; c <= this.ColumnCount; c++) {
                    //pfield = this.addListItem(oz_getToken(sIDList, this.Delimiter, Object(idx0)), oz_getToken(sAliasList, this.Delimiter, Object(idx1)), oz_getToken(sTypList, this.Delimiter, Object(idx2)), "", "")
                    pfield = this.addListItem(arr1[c - 1], arr2[c - 1], arr3[c - 1], "", "");
                    if (pfield == null) {
                        this.ParseError = true;
                        if (this.ReportName == "__SAMPLE__") {
                            this.ParseErrorContent = "컬럼 아이디로 사용되는 필드 헤더가 중복됐습니다. 파일에 헤더가 없는 경우 체크버튼을 헤제하십시오.";
                            continue;
                        } else {
                            this.ParseErrorContent = "원천 테이블 정보와 eCube에 등록된 정보가 다릅니다.";
                        }
                        return false;
                    }
                }

                //ValueListOnly : 컬럼이 1개이지만 코드가 있으면 2, 소트까지 있으면 3으로 지정하고 같이 읽어둠
                if (this.ReportName == "__VALUELIST__") {
                    if (this.HasCode) {
                        ColumnCount += 1;
                        if (this.HasCodeSort) {
                            ColumnCount += 1;
                        }
                    }
                }
            } else {
                //==Label
                this.ColumnLevelCount = 0;
                this.RowLevelCount = 1;
                this.MatrixRowLabels = new oz_matrix(this.RecordCount, this.RowLevelCount, "");

                xCDat = xEroot.getElementsByTagName("RowLabelList")[0].childNodes[0];
                DataList = oz_SplitToArray(xCDat.wholeText.trim(), this.Delimiter);
                for (r = 0; r < this.RecordCount; r++) {
                    MatrixRowLabels[r][0] = DataList[r];
                }

                //==Lists 채우기 :
                sIDList = ozf_GetAttributeValue(xEroot, "rowoziditemlist");
                var sAliasList = ozf_GetAttributeValue(xEroot, "rowlabelitemlist");
                for (r = 1; r <= this.RecordCount; r++) {
                    pfield = this.addListItem(getToken(sIDList, this.Delimiter, idx0), getToken(sAliasList, this.Delimiter, idx1), getToken(sTypList, this.Delimiter, idx2), "", "")
                }

                //#ValueListOnly : 이리로 올 일이 없는 듯하나
                if (this.ReportName == "__VALUELIST__") {
                    if (this.HasCode) {
                        this.RowLevelCount += 1;
                        if (this.HasCodeSort) {
                            RowLevelCount += 1;
                        }
                    }
                }
            }

            //==Data Area========================================================
            this.MatrixValues = new oz_matrix(this.RecordCount, this.ColumnCount, "");
            idx1 = 0;

            xCDat = xEroot.getElementsByTagName("DataList")[0].childNodes[0];
            DataList = oz_SplitToArray(xCDat.wholeText.trim(), this.Delimiter);
            var codesortList = new Array();
            var i;
            if (this.HasCode) {
                var tmpList = oz_SplitToArray(ozf_GetAttributeValue(xEroot, "olapitemcodesizelist").trim(), this.Delimiter);
                for (i = 0; i < tmpList.length; i++) {
                    if (tmpList[i].Length == 0) {
                        codesortList.push("none");
                    } else {
                        codesortList.push("code");
                    }
                }
                if (this.HasCodeSort) {
                    tmpList = oz_SplitToArray(ozf_GetAttributeValue(xEroot, "olapitemsortsizelist").trim(), this.Delimiter);
                    for (i = 0; i < tmpList.length; i++) {
                        if (tmpList[i].Length > 0) {
                            codesortList[i] = "sortcode";
                        }
                    }
                }
            }

            var isbreak = false;
            var isValueList = this.ReportName == "__VALUELIST__" ? true : false;
            for (r = 0; r < this.RecordCount; r++) {
                for (c = 0; c < this.ColumnCount; c++) {
                    if (idx1 >= DataList.length) {
                        isbreak = true;
                        break;
                    }
                    this.MatrixValues[r][c] = DataList[idx1]; //getTypedValue(DataList[idx1], r, c);
                    idx1 += 1;
                    if (!isValueList) { //ValueList가 아니면 코드/소트 값 버림
                        if (this.HasCode) {
                            if (codesortList[c] == "code") {
                                //getTypedValue(DataList(idx1), r, c)
                                idx1 += 1;
                            }
                        }
                        if (this.HasCodeSort) {
                            if (codesortList[c] == "sortcode") {
                                //getTypedValue(DataList(idx1), r, c);
                                idx1 += 1;
                            }
                        }
                    }
                }
                if (isbreak) {
                    break;
                }
            }
        }
        DataList.splice(0, DataList.length);
        return true;
    }

    ozResultParser.prototype.addListItem = function (sName, sAlias, sType, sCodeSz, sSortSz) {
        if (sAlias.length == 0) {
            return null;
        }
        var pClsO = new ozField();
        pClsO.Alias = sAlias;
        pClsO.Name = sName;
        pClsO.DataType = oz_ConvertDataTypeNoToENUM(sType);

        if (sCodeSz.trim.length > 0) {
            pClsO.HasCode = true;
        }
        if (sSortSz.trim.length > 0) {
            pClsO.IsSortRef = true;
        }
        if (this._lists.containsKey(pClsO.Name)) {
            return null;
        }
        this._lists.put(pClsO.Name, pClsO)
        return pClsO;
    }
    ozResultParser.prototype.Get_ItemValueType = function (LabelValueTypeList, Index, IsColumn) {
        var Key;
        Key = LabelValueTypeList.keys()[Index];
        return LabelValueTypeList.get(Key);
    }

    //Check Measure Level
    ozResultParser.prototype.IsMeasureLevel = function (IsColumnSide, iLevIdx0) {
        if (this.IsMeasureOnColumn == IsColumnSide) {
            if (this.IsMeasureOnColumn) {
                if ((this.ColumnLevelCount - iLevIdx0 - 1) == this.MeasurePosIdx) {
                    return true;
                }
            } else {
                if ((this.RowLevelCount - iLevIdx0 - 1) == this.MeasurePosIdx) {
                    return true;
                }
            }
        }
        return false;
    }
    //Check Code
    ozResultParser.prototype.Arrange_ItemCodeValueType = function (ItemOZIDList, Delim, CodeSizeList, SortSizeList, StartIndex) {
        var LabelValueTypeList = new oz_Hashtable();
        var Index;
        var Code;
        var Sort;

        var ValueType;
        ItemOZIDList = oz_RemoveLastDelimiter(ItemOZIDList, Delim);
        CodeSizeList = oz_RemoveLastDelimiter(CodeSizeList, Delim);
        SortSizeList = oz_RemoveLastDelimiter(SortSizeList, Delim);
        var ItemList = oz_SplitToArray(ItemOZIDList, Delim);
        var CodeList = oz_SplitToArray(CodeSizeList, Delim);
        var SortList = oz_SplitToArray(SortSizeList, Delim);

        var ozid;
        for (i = 0; i < ItemList.length; i++) {
            ozid = ItemList[i];
            Index = i + StartIndex;
            Code = CodeList[Index];
            Sort = SortList[Index];

            if ((!ozf_StringIsEmpty(Code)) && (!ozf_StringIsEmpty(Sort))) {
                ValueType = "sortcode";
            } else if (!ozf_StringIsEmpty(Code)) {
                ValueType = "code";
            } else {
                ValueType = "none";
            }
            LabelValueTypeList.put(ozid, ValueType)
        }

        return LabelValueTypeList;
    }


    /*---------------------------------------------------
    * Get
    ---------------------------------------------------*/
    //Get Measure Index
    ozResultParser.prototype.MeasureLevelIndex = function () {
        if (this.IsCross) {
            if (this.IsMeasureOnColumn) {
                return this.ColumnLevelCount - this.MeasurePosIdx - 1;
            } else {
                return this.RowLevelCount - this.MeasurePosIdx - 1;
            }
        } else {
            return 0;
        }
    }



    /*=================================================
    * Field Information
    ==================================================*/
    function ozField() {
        this.Name;
        this.Alias;
        this.Type;
        this.SumValue;
        this.AvgValue;
        this.MinValue;
        this.MaxValue;
        this.MeanValue;
        this.StdDevValue;
        this.VarValue;
        //Extend
        this.DataType;
        this.RefFieldID;
        this.displayformat;
        this.HasCode;
        this.IsSortRef;
        this.dataList = [];
    }
    ozField.prototype.setxml = function (xfield) {
        this.Name = oz_GetAttributeValue(xfield, "name", "");
        this.Alias = oz_GetAttributeValue(xfield, "alias", "");
        this.Type = oz_GetAttributeValue(xfield, "itemtype", "");
        this.DataType = oz_GetAttributeValue(xfield, "datatype", "");
        var xinfo, xdisplay;
        var xfind;
        xfind = xfield.getElementsByTagName("info");
        if (xfind.length > 0) {
            xinfo = xfind[0];
            if (xinfo.childElementCount > 0) { //children.length > 0) { //Err In IE
                xfind = xfield.getElementsByTagName("displayformat");
                if (xfind.length > 0) {
                    xdisplay = xfind[0];
                    if (xdisplay.childNodes.length > 0) {
                        this.displayformat = xdisplay.childNodes[0].textContent;
                    }
                }
            }
        }
    }
    ozField.prototype.getValueList = function (acubeid, cubeid) {
        if (this.dataList.length == 0) {
            var olapHandler1 = new oz_olaphandler();
            var addr = "<List><Item address='{0}' analyticcube='{1}' cubeozid='{2}'/></List>".format(this.Name, acubeid, cubeid);
            var olapHandler1 = new oz_olaphandler(oz_const_valuelist(), addr, "<List></List>");
            olapHandler1.execute(null, null, false, false);
            var ret = olapHandler1.returncontent;
            this.dataList = [];
            if (olapHandler1.iserror == false) {
                var value, code, item;
                var resultparser = new ozResultParser();
                resultparser.Parse(ret);

                item = new Object();
                item['value'] = "ALL";
                item['code'] = "%";
                this.dataList.push(item);

                for (var i = 0; i < resultparser.RecordCount; i++) {
                    if (resultparser.ColumnCount > 1) {
                        value = resultparser.MatrixValues[i][0];
                        code = resultparser.MatrixValues[i][1];
                    } else {
                        value = resultparser.MatrixValues[i][0];
                        code = resultparser.MatrixValues[i][0];
                    }
                    item = new Object();
                    item['value'] = value;
                    item['code'] = code;
                    this.dataList.push(item);
                }
            }
        }
        return this.dataList;
    }


    function oz_SplitToArray(liststr, delimiter) {
        var idx = 0, j, record = "", isDelim, count = 0, islastdelimlength;
        var txt1 = liststr;
        var delim = delimiter;
        var delimlen = delim.length;
        var txtlen = txt1.length;
        var datalist = new Array();

        while (idx < txtlen) {
            if (txt1.charAt(idx) == delim.charAt(0)) {
                if (delimlen > 1) {
                    islastdelimlength = true;
                    for (j = 1; j < (delimlen - 1); j++) {
                        if (txt1.charAt(idx + j) != delim.charAt(j)) {
                            islastdelimlength = false;
                            break;
                        }
                    }

                    if (islastdelimlength = true) {
                        datalist.push(record);
                        record = "";
                        idx = idx + delimlen - 1;
                        isDelim = true;
                    }
                    else {
                        record = record + txt1.charAt(idx)
                    }
                }
                else {
                    isDelim = true;
                    datalist.push(record);
                    record = "";
                }
            }
            else {
                isDelim = false;
                record = record + txt1.charAt(idx);
            }
            idx = idx + 1;
        }

        if (record.length > 0 || isDelim == false) {
            datalist.push(record);
            record = "";
        }
        return datalist;
    }


    /*--------------------------------------------------
        HashTable
    ----------------------------------------------------*/
    oz_Hashtable = function () {
        this.map = new Object();
    };
    oz_Hashtable.prototype = {
        put: function (key, value) {
            this.map[key] = value;
        },
        get: function (key) {
            return this.map[key];
        },
        containsKey: function (key) {
            return key in this.map;
        },
        containsValue: function (value) {
            for (var prop in this.map) {
                if (this.map[prop] == value) return true;
            }
            return false;
        },
        isEmpty: function (key) {
            return (this.size() == 0);
        },
        clear: function () {
            for (var prop in this.map) {
                delete this.map[prop];
            }
        },
        remove: function (key) {
            delete this.map[key];
        },
        keys: function () {
            var keys = new Array();
            for (var prop in this.map) {
                keys.push(prop);
            }
            return keys;
        },
        values: function () {
            var values = new Array();
            for (var prop in this.map) {
                values.push(this.map[prop]);
            }
            return values;
        },
        size: function () {
            var count = 0;
            for (var prop in this.map) {
                count++;
            }
            return count;
        }
    };


    //get xml Children
    function oz_GetFindElement(xitem, tagname) {
        var xfind = xitem.getElementsByTagName(tagname);
        if (xfind.length > 0) {
            return xfind[0];
        }
        else {
            return null;
        }
    }

    function oz_ReplaceString(svalue, findstr, replacement) {
        if (svalue == "") {
            return "";
        }
        else {
            return svalue.replace(new RegExp('[' + findstr + ']', 'g'), replacement);
        }
    }

    function oz_ConvertDataTypeNoToENUM(sType) {
        if (ozf_StringIsEmpty(sType)) { return "other"; }

        if (sType >= 0 && sType <= 9) {
            return "string";
        } else if (sType >= 10 && sType <= 12) {
            return "integer";
        } else if (sType >= 20 && sType <= 23) {
            return "date";
        } else if (sType >= 30 && sType <= 35) {
            return "integer ";
        } else if (sType = 40) {
            return "real"; //eCube_DataType.Real
        } else if (sType = 41) {
            return "real"; //eCube_DataType.Decimal
        } else if (sType = 61) {
            return "year"; //eCube_DataType.Year
        } else if (sType = 62) {
            return eCube_DataType.Quarter
        } else if (sType = 63) {
            return eCube_DataType.Month
        } else if (sType = 64) {
            return eCube_DataType.Day
        } else if (sType = 65) {
            return eCube_DataType.Hour
        } else if (sType = 66) {
            return eCube_DataType.Minute
        } else if (sType = 67) {
            return "second";
        } else {
            return "other";
        }
    }

    //Create Matrix
    function oz_matrix(rows, cols, defaultValue) {
        var arr = [];
        // Creates all lines:
        for (var i = 0; i < rows; i++) {
            // Creates an empty line
            arr.push([]);
            // Adds cols to the empty line:
            arr[i].push([cols]);
            for (var j = 0; j < cols; j++) {
                // Initializes:
                arr[i][j] = defaultValue;
            }
        }
        return arr;
    }

    function oz_RemoveLastDelimiter(liststr, delimiter) {
        if (liststr == null) {
            return liststr;
        }

        if (delimiter == null) {
            return liststr;
        }

        var txt1 = liststr;
        var delim = delimiter;
        var delimlen = delim.length;
        var txtlen = txt1.length;

        if ((txtlen - delimlen) < 0) {
            return liststr;
        }

        if (txt1.substr(txtlen - delimlen, delimlen) == delim) {
            return txt1.substr(0, txtlen - delimlen);
        }
        return liststr;
    }
