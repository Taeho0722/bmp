/**
 * @description
 */
function ozexplorerfilter(id) {
    var vid = id; //div 태그 아이디
    var inst = this;
    this.id = '#' + id;

    this.ChoiceFilterFnc = function (e) { } //필터 클릭하였을때 이벤트

    var ctlexplorerfilter;  //explorerfilter
    var ctlcontextmenu;  //contextmenu
    var treedataSource = [];

    var OperationsList = [];  //연산자 List
    var DoNotDisplayFilterList = [];  //보여지지않은필터 목록
    var ExplorerSqlDataList = [];  //ExplorerSqlData  '//선.후행 SQl

    var parser = new DOMParser();  //parser

    var newconverterxml = new ozconverterxml();
    var newgetmetadata = new ozgetmetadata();

    var treeListRow;  //마우스 오른쪽 버튼클릭시 TreeList의 row


    var rowdata;


    /**
     * 팝업메뉴 목록
     */
    var contextMenuItems = "";


    /**
     * Explorer보기 모드
     * ImportXML_View로 import했을경우 True으로 사용 
     */
    var ViewMode = false;

    /**
    *LoadServerSelector 설정
    * 사용하지 않음
    */
    var vLoadServerSelector = "";
    this.LoadServerSelector = function (val) {
        vLoadServerSelector = val;
    }


    /**
     * CubeAddress
     */
    var vCubeAddress = "";
    Object.defineProperty(this, 'CubeAddress', {
        get: function () {
            return vCubeAddress;
        },
        set: function (val) {
            vCubeAddress = val;
        }
    });

    /**
     * ReportAddress
     */
    var vReportAddress = "";
    Object.defineProperty(this, 'ReportAddress', {
        get: function () {
            return vReportAddress;
        },
        set: function (val) {
            vReportAddress = val;
        }
    });


    /**
     * CUST_ID
     */
    var vCustOzid = "";
    Object.defineProperty(this, 'CustOzid', {
        get: function () {
            return vCustOzid;
        },
        set: function (val) {
            vCustOzid = val;
        }
    });



    /**
    * DBServer
    */
    var gDBServer = "";
    Object.defineProperty(this, 'DBServer', {
        get: function () {
            return gDBServer;
        },
        set: function (val) {
            gDBServer = val;
        }
    });


    /**
    * CubeOZID
    */
    var vCubeozid = "";
    Object.defineProperty(this, 'Cubeozid', {
        get: function () {
            return vCubeozid;
        },
        set: function (val) {
            vCubeozid = val;
        }
    });


    /**
    * Reportozid
    */
    var vReportozid = "";
    Object.defineProperty(this, 'Reportozid', {
        get: function () {
            return vReportozid;
        },
        set: function (val) {
            vReportozid = val;
        }
    });

    /**
    * ReportCont
    */
    var vReportCont = "";
    Object.defineProperty(this, 'ReportCont', {
        get: function () {
            return vReportCont;
        },
        set: function (val) {
            vReportCont = val;
        }
    });

    /**
     * 조건 ID 돌려주기
     */
    var vGetCondId = "";
    Object.defineProperty(this, 'GetCondId', {
        get: function () {
            var vCondId = "";
            var vFilterId = "";

            var vType = "";

            for (var i = 0; i < treedataSource.length; i++) {
                vType = treedataSource[i].type;
                vFilterId = treedataSource[i].cont;
                if ((vType.equals("2")) || (vType.equals("6"))) {
                    vFilterId = ozf_Decode(vFilterId);
                    if (vCondId == "") {
                        vCondId = vFilterId;
                    } else {
                        vCondId += ";" + vFilterId;
                    }
                }
            }
            return vCondId;
        }
    });


    /**
    * ChoiceCont
    */
    var vChoiceCont = "";
    Object.defineProperty(this, 'ChoiceCont', {
        get: function () {
            return vChoiceCont;
        },
        set: function (val) {
            vChoiceCont = val;
        }
    });

    /**
    * ChoiceRow
    */
    var vChoiceRow = "";
    Object.defineProperty(this, 'ChoiceRow', {
        get: function () {
            return vChoiceRow;
        },
        set: function (val) {
            vChoiceRow = val;
        }
    });


    /**
    * ChoiceType
    */
    var vChoiceType = "";
    Object.defineProperty(this, 'ChoiceType', {
        get: function () {
            return vChoiceType;
        },
        set: function (val) {
            vChoiceType = val;
        }
    });

    /**
    * ChoiceOzid
    */
    var vChoiceOzid = "";
    Object.defineProperty(this, 'ChoiceOzid', {
        get: function () {
            return vChoiceOzid;
        },
        set: function (val) {
            vChoiceOzid = val;
        }
    });


    /**
    * ChoiceCondition
    */
    var vChoiceCondition = "";
    Object.defineProperty(this, 'ChoiceCondition', {
        get: function () {
            return vChoiceCondition;
        },
        set: function (val) {
            vChoiceCondition = val;
        }
    });

    /**
    * ChoiceIsnot
    */
    var vChoiceIsnot = "";
    Object.defineProperty(this, 'ChoiceIsnot', {
        get: function () {
            return vChoiceIsnot;
        },
        set: function (val) {
            vChoiceIsnot = val;
        }
    });


    /**
    * ChoiceValue
    */
    var vChoiceValue = "";
    Object.defineProperty(this, 'ChoiceValue', {
        get: function () {
            return vChoiceValue;
        },
        set: function (val) {
            vChoiceValue = val;
        }
    });

    /**
    * ChoiceCode
    */
    var vChoiceCode = "";
    Object.defineProperty(this, 'ChoiceCode', {
        get: function () {
            return vChoiceCode;
        },
        set: function (val) {
            vChoiceCode = val;
        }
    });


    /**
     * 조회건수 컬럼 보여주기
     */
    var vHideColCustCnt = false;
    Object.defineProperty(this, 'HideColCustCnt', {
        get: function () {
            return vHideColCustCnt;
        },
        set: function (val) {
            vHideColCustCnt = val;
        }
    });



    /**
     * 필수 조건
     */
    var vNecessaryItem = "";
    Object.defineProperty(this, 'NecessaryItem', {
        set: function (val) {
            vNecessaryItem = val;
        }
    });

    /**
    * 정렬 항목
    */
    var vItemRank = "";
    Object.defineProperty(this, 'ItemRank', {
        get: function () {
            return vItemRank;
        },
        set: function (val) {
            vItemRank = val;
        }
    });


    /**
    * Explorer에서 사용될 delimiter
    */
    var vDelimiter = ";";
    Object.defineProperty(this, 'ExpDelimiter', {
        get: function () {
            return vDelimiter;
        },
        set: function (val) {
            vDelimiter = val;
        }
    });


    /**
     *숨겨진 필터 xml으로 넘어오기
     */
    var vHiddenFilter = "";
    Object.defineProperty(this, 'HiddenFilter', {
        get: function () {
            return vHiddenFilter;
        },
        set: function (val) {
            vHiddenFilter = val;
        }
    });


    /**
    * PostSQL
    */
    Object.defineProperty(this, 'PostSQL', {
        get: function () {
            var SQL = "";
            var temp = "";
            var tempsql = "";
            for (var i = 0; ExplorerSqlDataList.length; i++) {
                temp = ExplorerSqlDataList[i].flttype;
                tempsql = ExplorerSqlDataList[i].fltCont;
                if (temp.equals("1")) {  //선행SQL일경우
                    if (SQL == "") {
                        SQL = tempsql;
                    } else {
                        SQL += ";" + tempsql;
                    }
                }
            }
            return SQL;
        }
    });

    /**
    * PreSQL
    */
    Object.defineProperty(this, 'PreSQL', {
        get: function () {
            var SQL = "";
            var temp = "";
            var tempsql = "";
            for (var i = 0; ExplorerSqlDataList.length; i++) {
                temp = ExplorerSqlDataList[i].flttype;
                tempsql = ExplorerSqlDataList[i].fltCont;
                if (temp.equals("2")) {  //후행SQL일경우
                    if (SQL == "") {
                        SQL = tempsql;
                    } else {
                        SQL += ";" + tempsql;
                    }
                }
            }
            return SQL;
        }
    });

    /*
    * 연산자 추가 금지
    * 기본은 False 추가 가능
    */
    var vOperNoAdd = false;
    Object.defineProperty(this, 'OperNoAdd', {
        get: function () {
            return vOperNoAdd;
        },
        set: function (val) {
            vOperNoAdd = val;
        }
    });

    /*
    * 연산자 변경 금지
    * 기본은 False 변경 가능
    */
    var vOperNoChange = false;
    Object.defineProperty(this, 'OperNoChange', {
        get: function () {
            return vOperNoChange;
        },
        set: function (val) {
            vOperNoChange = val;
        }
    });



    /**
     * OPER 설정
     */
    var vOpers = "";
    Object.defineProperty(this, 'Opers', {
        set: function (val) {
            vOpers = val.toUpperCase();
            OperationsList = []; //초기화

            if (vOpers != "") {   //값이 있다면
                var Oper_arr = new Array();
                Oper_arr = vOpers.split(";");
                var OperCnt = Oper_arr.length - 1
                var Oper = "";
                var NextOper = "";
                var Opers = 0;
                for (var i = 0; i <= OperCnt; i++) {
                    Oper = Oper_arr[i];
                    if (Oper != "") {
                        if (i == OperCnt) {
                            Opers = 0;
                        } else {
                            Opers = i + 1;
                        }

                        NextOper = Oper_arr[Opers];
                        var NewOperationsList = {};
                        NewOperationsList['Oper'] = Oper;
                        NewOperationsList['NextOper'] = NextOper;
                        OperationsList.push(NewOperationsList);
                    }
                }
            }
        }
    });


    /**
     * 초기화
     */
    this.Initialize = function () {
        this.GetReportContent(); //리포트 ozid와 xml 알아오기
        this.TreeListInit(); //TreeList 초기화
        this.initMouseEnterEvent();
    }



    /**
    * 마우스가 ExplorerTable에 들어왔을때 TreeEnter와 Leave event를 활성화 시키기위해서
    */
    this.initMouseEnterEvent = function () {
        $(this.id).mouseenter(function () {
            inst.initTreeListEnterEvent();
            inst.initTreeListLeaveEvent();
        });
    }

    /**
    *마우스가 TreeList에 들어왔을때 
    */
    this.initTreeListEnterEvent = function () {
        $(".dx-treelist-cell-expandable").mouseenter(function () {
            var vseq = "";
            vseq = inst.getitemseq($(this));

            var pid = inst.FindParentId(vseq);  //상위 id알아오기
            if (pid != 0) {   //parentid가 매위 : 0 이 아니면 dragdrop되도록 설정
                inst.initdragdrop();
            }

        });
    }

    /**
    *현재 클릭한 위치의 seq를 알아온다
    */
    this.getitemseq = function (vitem) {
        var pnode = $(vitem).parent();
        var node;
        var vattr;
        var vattr_arr;
        var vattr_temp;
        var vattr_value;
        var vseq = "";
        for (var i = 0; i < pnode.children().length; i++) {
            node = pnode.children()[i];

            vattr = $(node).attr("aria-label");
            vattr_arr = vattr.split(",");
            vattr_temp = vattr_arr[0].indexOf("Seq");

            if (vattr_temp >= 0) {
                vattr_value = vattr_arr[1];
                vattr_value = vattr_value.replace("Value", "");
                vseq = vattr_value.trim();
            }
        }
        return vseq;
    }


    /**
    *id의 parentid 찾아오기
    */
    this.FindParentId = function (id) {
        var vid = "";
        var pid = "";
        for (var i = 0; i < treedataSource.length; i++) {
            vid = treedataSource[i].id;

            if (id == vid) {
                pid = treedataSource[i].pid;
                break;
            }
        }
        return pid;
    }


    /**
    *마우스가 TreeList에서 떠날때  drag를 취소하도록
    */
    this.initTreeListLeaveEvent = function () {
        $(".dx-treelist-cell-expandable").mouseleave(function () {
            inst.destorydrag();
        });
    }

    /**
    *Drag 안되도록
    */
    this.destorydrag = function () {
        try {
            $(".dx-treelist-cell-expandable").draggable("disable");
        }
        catch (err) {

        }
    }


    /**
    *DragDrop init 되도록 설정
    */
    this.initdragdrop = function () {
        $(".dx-treelist-cell-expandable").draggable(
            //{ revert: true, helper: "clone" } //움직임과 기존값 남아있도록
            { revert: true }  // 움직임 보이도록
        );

        $(".dx-treelist-cell-expandable").draggable("enable");

        $(".dx-treelist-cell-expandable").droppable({
            drop: function (event, ui) {
                inst.afterdrop(event, ui);
            }
        });
    }


    /**
    *drop이후 이벤트
    */
    this.afterdrop = function (event, ui) {

        var toid = inst.getitemseq($(event.target));  //놓은아이
        var torow = this.finddatarow(toid);
        var toitemtype = treedataSource[torow].itemtype;


        //움직일item 정보
        var fromid = inst.getitemseq($(ui.draggable));  //움직인아이
        var fromrow = this.finddatarow(fromid);
        var fromseq = treedataSource[fromrow].seq;
        var fromcode = treedataSource[fromrow].code;
        var fromcondition = treedataSource[fromrow].condition;
        var fromcont = treedataSource[fromrow].cont;
        var fromcustcnt = treedataSource[fromrow].custcnt;
        var fromdel = treedataSource[fromrow].del;
        var fromdesc = treedataSource[fromrow].desc;
        var fromisnot = treedataSource[fromrow].isnot;
        var fromitemtype = treedataSource[fromrow].itemtype;
        var fromname = treedataSource[fromrow].name;
        var fromozid = treedataSource[fromrow].ozid;
        var frompid = treedataSource[fromrow].pid;
        var fromtype = treedataSource[fromrow].type;
        var fromvalue = treedataSource[fromrow].value;
        var fromtemp = "";


        if (fromitemtype.equals("Filter")) {
            var vmove = this.CheckNode(fromid, toid);//이동할 Filter가 자기 아래위치한 필터인지 체크
            if (vmove === true) {  //만약 이동할 ITem이 자기 아래 위치하였다면 못 움직이도록 break
                return;
            }
        }

        var topid = 0;
        var toprow = 0;
        if (torow != 0) {
            topid = treedataSource[torow].pid;  //도착하는 item의 부모id
            toprow = this.finddatarow(topid);  // 도착하는 item의row
        }

        var vid;
        var vseq;
        var vcode;
        var vcondition;
        var vcont;
        var vcustcnt;
        var vdel;
        var vdesc;
        var visnot;
        var vitemtype;
        var vname;
        var vozid;
        var vpid;
        var vtype;
        var vvalue;

        var tempdataSource;
        var datatemp = "";
        var temp = "";

        if (toitemtype.equals("Filter")) {   //도착이 Filter일경우
            fromtemp = '{"id":"' + fromid + '", "seq":"' + fromseq + '", "code":"' + fromcode + '", "condition":"' + fromcondition + '", "cont":"' + fromcont + '", "custcnt":"' + fromcustcnt + '", "del":"' + fromdel + '", "desc":"' + fromdesc + '", "isnot":"' + fromisnot + '", "itemtype":"' + fromitemtype + '", "name":"' + fromname + '", "ozid":"' + fromozid + '", "pid":"' + toid + '", "type":"' + fromtype + '", "value":"' + fromvalue + '"}';

            for (var i = 0; i < treedataSource.length; i++) {
                vid = treedataSource[i].id;
                vseq = treedataSource[i].seq;
                vcode = treedataSource[i].code;
                vcondition = treedataSource[i].condition;
                vcont = treedataSource[i].cont;
                vcustcnt = treedataSource[i].custcnt;
                vdel = treedataSource[i].del;
                vdesc = treedataSource[i].desc;
                visnot = treedataSource[i].isnot;
                vitemtype = treedataSource[i].itemtype;
                vname = treedataSource[i].name;
                vozid = treedataSource[i].ozid;
                vpid = treedataSource[i].pid;
                vtype = treedataSource[i].type;
                vvalue = treedataSource[i].value;

                if (vid != fromid) {
                    if (temp == "") {
                        temp = '{"id":"' + vid + '", "seq":"' + vseq + '", "code":"' + vcode + '", "condition":"' + vcondition + '", "cont":"' + vcont + '", "custcnt":"' + vcustcnt + '", "del":"' + vdel + '", "desc":"' + vdesc + '", "isnot":"' + visnot + '", "itemtype":"' + vitemtype + '", "name":"' + vname + '", "ozid":"' + vozid + '", "pid":"' + vpid + '", "type":"' + vtype + '", "value":"' + vvalue + '"}';
                    } else {
                        temp += ', {"id":"' + vid + '", "seq":"' + vseq + '", "code":"' + vcode + '", "condition":"' + vcondition + '", "cont":"' + vcont + '", "custcnt":"' + vcustcnt + '", "del":"' + vdel + '", "desc":"' + vdesc + '", "isnot":"' + visnot + '", "itemtype":"' + vitemtype + '", "name":"' + vname + '", "ozid":"' + vozid + '", "pid":"' + vpid + '", "type":"' + vtype + '", "value":"' + vvalue + '"}';
                    }

                }
            }
            temp += "," + fromtemp;
        } else {   // 도착이 일반 Item일경우
            fromtemp = '{"id":"' + fromid + '", "seq":"' + fromseq + '", "code":"' + fromcode + '", "condition":"' + fromcondition + '", "cont":"' + fromcont + '", "custcnt":"' + fromcustcnt + '", "del":"' + fromdel + '", "desc":"' + fromdesc + '", "isnot":"' + fromisnot + '", "itemtype":"' + fromitemtype + '", "name":"' + fromname + '", "ozid":"' + fromozid + '", "pid":"' + topid + '", "type":"' + fromtype + '", "value":"' + fromvalue + '"}';

            for (var i = 0; i < treedataSource.length; i++) {
                vid = treedataSource[i].id;
                vseq = treedataSource[i].seq;
                vcode = treedataSource[i].code;
                vcondition = treedataSource[i].condition;
                vcont = treedataSource[i].cont;
                vcustcnt = treedataSource[i].custcnt;
                vdel = treedataSource[i].del;
                vdesc = treedataSource[i].desc;
                visnot = treedataSource[i].isnot;
                vitemtype = treedataSource[i].itemtype;
                vname = treedataSource[i].name;
                vozid = treedataSource[i].ozid;
                vpid = treedataSource[i].pid;
                vtype = treedataSource[i].type;
                vvalue = treedataSource[i].value;

                if (vid != fromid) {  //이동할 node가 아닐경우
                    datatemp = '{"id":"' + vid + '", "seq":"' + vseq + '", "code":"' + vcode + '", "condition":"' + vcondition + '", "cont":"' + vcont + '", "custcnt":"' + vcustcnt + '", "del":"' + vdel + '", "desc":"' + vdesc + '", "isnot":"' + visnot + '", "itemtype":"' + vitemtype + '", "name":"' + vname + '", "ozid":"' + vozid + '", "pid":"' + vpid + '", "type":"' + vtype + '", "value":"' + vvalue + '"}';

                    if (vid == toid) {  //만약 id가 가고자 하는 node일경우
                        if (fromrow < torow) {   // 시작하는 Row가 위에 있을경우
                            temp += "," + datatemp + "," + fromtemp;
                        } if (fromrow > torow) {  //시작하는 Row가아래 있을경우
                            temp += "," + fromtemp + "," + datatemp;
                        }
                    } else {
                        if (temp == "") {
                            temp = datatemp;
                        } else {
                            temp += "," + datatemp;
                        }
                    }
                }
            }
        }
        tempdataSource = "[" + temp + "]";
        treedataSource = JSON.parse(tempdataSource);
        inst.refreshtreelist();
    }


    /**
    *이동할 Filter가 자기 아래위치한 필터인지 체크
    */
    this.CheckNode = function (fromid, toid) {
        var fromrow = this.finddatarow(fromid);
        var torow = this.finddatarow(toid);
        var pid;
        do {
            pid = treedataSource[torow].pid;
            if (pid == 0) {
                return false;
            }

            torow = this.finddatarow(pid);

            if (fromid == pid) {
                return true;
            }
        }
        while (pid != 0);  //상위 아이디가 0이 아니면 계속 0이라면 그건 맨 위에 붙은 node이니까
        return false;
    }


    /**
    *팝업 메뉴 
    */
    this.SetContextMenu = function () {
        $("#context-menu").dxContextMenu({
            dataSource: contextMenuItems,
            width: 100,
            //target: this.id,
            target: "#TreeListtr",
            onItemClick: function (e) {
                if (!e.itemData.items) {
                    inst.ContextMenuClick(e)
                }
            }
        });
        ctlcontextmenu = $("#context-menu").dxContextMenu('instance');
        this.SetOperMenu();
    }

    /**
    *item삭제
    */
    this.removenodeitem = function (removeid) {
        var pid = "";
        var vid = "";
        for (var i = 0; i < treedataSource.length; i++) {
            pid = treedataSource[i].pid;
            vid = treedataSource[i].id;
            if (removeid == pid) {
                this.removenodeitem(vid);
            }
        }
        var removerow = this.finddatarow(removeid);
        treedataSource.splice(removerow, 1);
    }


    /**
    *id로 TreedataSource에서 row찾기
    */
    this.finddatarow = function (id) {
        var vid = "";
        for (var i = 0; treedataSource.length; i++) {
            vid = treedataSource[i].id;

            if (id == vid) {
                return i;
            }
        }

    }

    /**
    *ContextMenu 클릭
    **/
    this.ContextMenuClick = function (e) {
        var vData = e.itemData.text;
        //var vitemtype = treedataSource[treeListRow].itemtype;
        //var vid = treedataSource[treeListRow].id;

        //var vname = treedataSource[treeListRow].name;
        //var vvalue = treedataSource[treeListRow].value;
        //var voper = treedataSource[treeListRow].condition;
        //var visnot = treedataSource[treeListRow].isnot;
        //var pid = treedataSource[treeListRow].pid;


        var vitemtype = rowdata.itemtype;
        var vid = rowdata.id;

        var vname = rowdata.name;
        var vvalue = rowdata.value;
        var voper = rowdata.condition;
        var visnot = rowdata.isnot;
        var pid = rowdata.pid;

        treeListRow = this.finddatarow(vid);


        var notstring = "";
        if (visnot.equals("T")) {
            visnot = "F";
            notstring = "";
        } else if (visnot.equals("F")) {
            visnot = "T";
            notstring = "NOT ";
        }
        var vdesc = "";
        var msg = "";
        switch (vData) {
            case "삭제":
                if (vitemtype.equals("Filter")) {
                    if (treeListRow > 0) {
                        msg = "선택한 조건을 삭제하시겠습니까? 하위 조건이 있을경우 함께 삭제 됩니다.";
                        var rs2 = ozf_MsgBoxYesNo(msg, "알림");
                        if (rs2.equals("6")) { //6 : Yes
                            this.removenodeitem(vid);
                            //ctlexplorerfilter.option('dataSource', treedataSource);
                            //ctlexplorerfilter.repaint();
                            inst.refreshtreelist();
                        } else if (rs2.equals("7")) {  // 7 : NO

                        }

                    } else {
                        msg = "최상위 조건은 삭제할 수 없습니다.";
                        ozf_MsgBoxEx(msg, "0", "알림");
                    }
                } else {
                    treedataSource.splice(treeListRow, 1);
                    inst.refreshtreelist();
                    //ctlexplorerfilter.option('dataSource', treedataSource);
                    //ctlexplorerfilter.repaint();
                }

                break;
            case "AND 조건 삽입":



                var id = this.MakeFilterozid();
                var seq = this.FindMaxSeq();

                treedataSource.push(this.make_NodeData(seq, pid, 'AND', 'AND', id, 'Filter', 'AND', 'F', '', '', '', '', '', '', seq));

                treedataSource[treeListRow].pid = seq;
                //ctlexplorerfilter.option('dataSource', treedataSource);
                //ctlexplorerfilter.repaint();
                inst.refreshtreelist();


                break;
            case "NOT 추가":
                // INV 관련 추가 *************************************************************
                vdesc = "[" + vname + "] " + notstring + voper + " " + vvalue.replace(";", ",");
                treedataSource[treeListRow].desc = vdesc;
                treedataSource[treeListRow].isnot = visnot;
                //ctlexplorerfilter.option('dataSource', treedataSource);
                //ctlexplorerfilter.repaint();
                inst.refreshtreelist();
                break;
            case "NOT 삭제":
                // INV 관련 추가 *************************************************************
                vdesc = "[" + vname + "] " + notstring + voper + " " + vvalue.replace(";", ",");
                treedataSource[treeListRow].desc = vdesc;
                treedataSource[treeListRow].isnot = visnot;
                //ctlexplorerfilter.option('dataSource', treedataSource);
                //ctlexplorerfilter.repaint();
                inst.refreshtreelist();
                break;
            case "AND":
                treedataSource[treeListRow].desc = "AND";
                treedataSource[treeListRow].name = "AND";
                treedataSource[treeListRow].condition = "AND";
                treedataSource[treeListRow].isnot = "F";
                //ctlexplorerfilter.option('dataSource', treedataSource);
                //ctlexplorerfilter.repaint();
                inst.refreshtreelist();
                break;
            case "NOT AND":
                treedataSource[treeListRow].desc = "NOT AND";
                treedataSource[treeListRow].name = "NOT AND";
                treedataSource[treeListRow].condition = "AND";
                treedataSource[treeListRow].isnot = "T";
                //ctlexplorerfilter.option('dataSource', treedataSource);
                //ctlexplorerfilter.repaint();
                inst.refreshtreelist();
                break;
            case "OR":
                treedataSource[treeListRow].desc = "OR";
                treedataSource[treeListRow].name = "OR";
                treedataSource[treeListRow].condition = "OR";
                treedataSource[treeListRow].isnot = "F";
                //ctlexplorerfilter.option('dataSource', treedataSource);
                //ctlexplorerfilter.repaint();
                inst.refreshtreelist();
                break;
            case "NOT OR":
                treedataSource[treeListRow].desc = "NOT OR";
                treedataSource[treeListRow].name = "NOT OR";
                treedataSource[treeListRow].condition = "OR";
                treedataSource[treeListRow].isnot = "T";
                //ctlexplorerfilter.option('dataSource', treedataSource);
                //ctlexplorerfilter.repaint();
                inst.refreshtreelist();
                break;
        }

    }



    /**
    * 팝업메뉴 설정
    */
    this.SetOperMenu = function () {
        var itemtype = "";
        var itemoper = "";
        var itemisnot = "";
        if (ViewMode === true) {  //view모드일경우 안나오도록
            contextMenuItems = null;
        } else if (treeListRow == null) {
            contextMenuItems = null;
        } else if (treeListRow >= 0) {



            itemtype = rowdata.itemtype;
            itemoper = rowdata.condition;
            itemisnot = rowdata.isnot;


            //itemtype = treedataSource[treeListRow].itemtype;
            //itemoper = treedataSource[treeListRow].condition;
            //itemisnot = treedataSource[treeListRow].isnot;

            var menu_total = "";
            var menu_addoper = '';
            var menu_suboper = '';
            var menu_remove = '{"text":"삭제"}';
            var menu_addcond = '{"text":"AND 조건 삽입"}';
            var menu_addnot = '{"text":"NOT 추가"}';
            var menu_removenot = '{"text":"NOT 삭제"}';

            if (itemtype.equals("Filter")) {  //노드가 필터일경우
                if (this.OperNoChange === false) {  //연산자 변경금지가 아닐경우 연산자 변경과 삭제가 나오도록
                    if (OperationsList.length == 0) {
                        menu_suboper = '"items":[{"text":"AND"}, {"text":"NOT AND"},{"text":"OR"},{"text":"NOT OR"}]';
                    } else {
                        var oper = "";
                        for (var i = 0; i < OperationsList.length; i++) {
                            oper = OperationsList[i].Oper;

                            if (menu_suboper == "") {
                                menu_suboper = '{"text":"' + oper + '"}';
                            } else {
                                menu_suboper += ',' + '{"text":"' + oper + '"}';
                            }
                        }
                        menu_suboper = '"items":[' + menu_suboper + ']';
                    }
                    menu_addoper = '{"text":"연산자변경", ' + menu_suboper + '}';
                    menu_total = "[" + menu_addoper + "," + menu_remove + "]";
                    contextMenuItems = JSON.parse(menu_total);
                } else {   //만약 연산자변경금지일경우 삭제만 나오도록
                    menu_total = "[" + menu_remove + "]";
                    contextMenuItems = JSON.parse(menu_total);
                }
            } else {  //노드가 필터가 아닐경우
                if ((itemoper.equals("IN")) || (itemoper.equals("LIKE"))) {
                    if (itemisnot.equals("F")) {
                        menu_total = "[" + menu_addnot + "," + menu_addcond + "," + menu_remove + "]";
                    } else if (itemisnot.equals("T")) {
                        menu_total = "[" + menu_removenot + "," + menu_addcond + "," + menu_remove + "]";
                    }
                } else {
                    menu_total = "[" + menu_addcond + "," + menu_remove + "]";
                }
                contextMenuItems = JSON.parse(menu_total);
            }
        } else {
            contextMenuItems = null;
        }
        ctlcontextmenu.option('dataSource', contextMenuItems);
    }



    /**
    * 리포트 ozid와 xml알아오기
    */
    this.GetReportContent = function () {
        var ozid = "";
        var xml = newgetmetadata.GetReportInfo(this.CubeAddress + this.ReportAddress);
        var xmlDoc = parser.parseFromString(xml, "text/xml");

        var reportnode = xmlDoc.getElementsByTagName("ListReport")[0];
        ozid = reportnode.getAttribute('address');
        this.Reportozid = ozid;

        xml = newgetmetadata.GetReportCont(xml);

        var ReportDoc = parser.parseFromString(xml, "text/xml");
        reportnode = ReportDoc.getElementsByTagName("ListReport")[0];
        ozid = reportnode.getAttribute('cubeozid');

        this.Cubeozid = ozid;
        this.ReportCont = xml;
    }



    /**
    * TreeList 초기화
    */
    this.TreeListInit = function () {
        var rootid = '#' + vid;

        $(rootid).css("background-color", "white");  //background color이있을경우 white로 변경하기 위해서
        $(rootid).css("border", "1px solid #ddd");  //테두리
        $('#TreeListTable').remove();  //기본정보 삭제
        var TreeListTable = "";
        TreeListTable += "<div id='context-menu'></div>                   ";

        TreeListTable += "<table id='TreeListTable' >                    ";
        //TreeListTable += "   <tr id='TreeListActiontr' align ='right'>   ";

        //if (ViewMode === false) {   //view모드에서는 안나오도록
        //    TreeListTable += "      <td>                                     ";
        //    TreeListTable += "      <input id = 'btnmoveup' type='button' value='위로'/>  ";
        //    TreeListTable += "      <input id = 'btnmouvedown' type='button' value='아래로' />                   ";
        //    TreeListTable += "      <input id = 'btnmovelevelup' type='button' value='한단계위로' />             ";
        //    TreeListTable += "      <input id = 'btnmoveleveldown' type='button' value='한단계아래로' />         ";
        //    TreeListTable += "     </td>                                                                        ";
        //}

        //TreeListTable += "   </tr>                                     ";
        TreeListTable += "   <tr id='TreeListtr'>                      ";
        TreeListTable += "      <td/>                                  ";
        TreeListTable += "   </tr>                                     ";
        TreeListTable += "</table>                                     ";

        $(rootid).append(TreeListTable);


        this.SetContextMenu();  // 오른쪽 메뉴설정

        $('#TreeListtr').dxTreeList({
            dataSource: treedataSource,
            keyExpr: 'seq',
            parentIdExpr: 'pid',
            showRowLines: true,
            showColumnHeaders: false,
            showColumnLines: true,
            showBorders: true,
            autoExpandAll: true,
            expandedRowKeys: [1],
            onContextMenuPreparing: function (e) {  //오른쪽버큰 클릭시 이벤트
                rowdata = e.row.data;
                treeListRow = e.rowIndex;
                inst.SetOperMenu();
            },
            onRowClick: function (e) {
                //inst.initdragdrop();
                //alert("keydown");
            },
            onCellClick: function (e) {
                rowdata = e.row.data;
                inst.itemClick(e);
            }
            //,
            //selection: {
            //    mode: 'single'
            //    //mode: 'multiple'
            //}

            //,
            //onDoubleClick: function (e) {
            //    itemDoubleClick(e);
            //}

            //columnAutoWidth: true
        });
        ctlexplorerfilter = $('#TreeListtr').dxTreeList('instance');
        this.Init_Columns();
        this.addAndRoot();
    }


    function itemDoubleClick(e) {
        alert("DoubleClick");
    }

    /**
     *클릭 이벤트
     * @param {any} e
     */
    //this.itemClick = function(e) {
    //function itemClick(e) {
    this.itemClick = function (e) {
        if (ViewMode === false) {  //view Mode 가 아닐경우에 이벤트 발생하도록
            var vid = rowdata.id;
            var row = this.finddatarow(vid);

            var col = e.columnIndex;
            var itemType = e.data.itemtype;
            var itemDesc = e.data.desc;

            vChoiceCont = ozf_Decode(e.data.cont.trim());
            vChoiceRow = row;
            vChoiceType = e.data.type;
            vChoiceOzid = e.data.ozid;
            vChoiceCondition = e.data.condition;
            vChoiceIsnot = e.data.isnot;
            vChoiceValue = e.data.value;
            vChoiceCode = e.data.code;


            if ((row >= 0) && (col == 0)) {
                //이벤트 발생
                if (!itemType.equals("Filter")) {
                    inst.ChoiceFilterFnc();
                } else if (itemType.equals("Filter")) {  //필터 부분일경우 연산자 변경
                    //if (this.OperNoChange === false) {  //연산자 변경 금지가 아닐경우 변경가능하도록
                    //    this.ConditionModi(row, itemDesc);
                    //}

                }
            }
            if ((row > 0) && (col === 2)) {
                if (!itemType.equals("Filter")) {  //필터가 아닐경우에
                    //삭제 이벤트 발생 
                    var a = treedataSource[row];
                    treedataSource.splice(row, 1);
                    //ctlexplorerfilter.option('dataSource', treedataSource);
                    //ctlexplorerfilter.repaint();
                    inst.refreshtreelist();
                }
            }
        }
    }


    /**
    *  초기 기본 정보
    */
    this.addAndRoot = function () {
        treedataSource = [];  //초기화
        var id = this.MakeFilterozid();
        var seq = this.FindMaxSeq();
        treedataSource.push(this.make_NodeData(seq, 0, 'AND', 'AND', id, 'Filter', 'AND', 'F', '', '', '', '', '조회 건수', '', seq));
        //ctlexplorerfilter.option('dataSource', treedataSource);
        //ctlexplorerfilter.repaint();
        inst.refreshtreelist();
    }


    /**
    * ExplorerFilter 컬럼 정보
    */
    this.Init_Columns = function () {
        var vdata;
        var columns;

        var vdel = true;
        if (ViewMode === true) {
            vdel = false;
        }

        var vCustCnt = true;
        if (this.HideColCustCnt === true) {
            vCustCnt = false;
        }

        columns = [
            {
                caption: 'Desc', dataField: 'desc'
                , cellTemplate: function (container, options) {
                    vdata = options.data;
                    var classitem = "";

                    if (vdata) {
                        if (vdata.itemtype.equals("Filter")) {
                            classitem = "filteritemimg"
                        } else if (vdata.itemtype.equals("Dimension")) {
                            classitem = "dimensionitemimg"
                        } else if (vdata.itemtype.equals("Fact")) {
                            classitem = "factitemimg"
                        } else if (vdata.itemtype.equals("Measure")) {
                            classitem = "measureitemimg"
                        } else if (vdata.itemtype.equals("ItemFilter")) {
                            classitem = "itemfilterimg"
                        } else if (vdata.itemtype.equals("CustomDimension")) {
                            classitem = "customdimensionitemimg"
                        }
                        $("<div>", { "class": classitem })
                            .appendTo(container);
                        $("<span>", { "class": "itemname", text: vdata.desc })
                            .appendTo(container);
                    }
                }
            },
            {
                caption: 'Name', dataField: 'name', visible: false
            },
            {
                caption: 'Ozid', dataFeild: 'ozid', visible: false
            },
            {
                caption: 'itemType', dataField: 'itemtype', visible: false
            },
            {
                caption: 'Condition', dataField: 'condition', visible: false
            },
            {
                caption: 'IsNot', dataField: 'isnot', visible: false
            },
            {
                caption: 'Type', dataField: 'type', visible: false
            },
            {
                caption: 'Value', dataField: 'value', visible: false
            },
            {
                caption: 'Code', dataField: 'code', visible: false
            },
            {
                caption: 'Cont', dataField: 'cont', visible: false
            },
            {
                caption: 'CustCnt', dataField: 'custcnt', width: 100, visible: vCustCnt  //, alignment: 'center'
                , cellTemplate: function (container, options) {
                    vdata = options.data;
                    var custcntitem = "";
                    var title = "";
                    if (vdata) {
                        title = vdata.custcnt;
                        if (vdata.itemtype.equals("Filter")) {
                            custcntitem = "searchcnttitle"
                        } else {
                            custcntitem = "searchcnt"
                        }
                        $("<div>", { "class": custcntitem, text: title })
                            .appendTo(container);
                    }
                }

            },
            {
                caption: 'Del', dataField: 'del', width: 50, visible: vdel //, alignment: 'center' 
                , cellTemplate: function (container, options) {
                    vdata = options.data;
                    var delitem = "";

                    if (vdata) {

                        if (vdata.itemtype.equals("Filter")) {
                            delitem = "notdelitemimg"
                        } else {
                            delitem = "delitemimg"
                        }
                        $("<div>", { "class": delitem })
                            .appendTo(container);
                    }
                }
            },
            {
                caption: 'Seq', dataField: 'seq', visible: true, width: 0
            }];
        ctlexplorerfilter.option('columns', columns);
    }


    /**
     * Node 만들기
     * @param {any} id
     * @param {any} pid
     * @param {any} desc
     * @param {any} name
     * @param {any} ozid
     * @param {any} itemtype
     * @param {any} condition
     * @param {any} isnot
     * @param {any} type
     * @param {any} value
     * @param {any} code
     * @param {any} cont
     * @param {any} custcnt
     * @param {any} del
     * @param {any} seq
     */
    this.make_NodeData = function (id, pid, desc, name, ozid, itemtype, condition, isnot, type, value, code, cont, custcnt, del, seq) {
        var nodeitem = new Object();
        nodeitem.id = id;
        nodeitem.pid = pid;
        nodeitem.desc = desc;
        nodeitem.name = name;
        nodeitem.ozid = ozid;
        nodeitem.itemtype = itemtype;
        nodeitem.condition = condition;
        nodeitem.isnot = isnot;
        nodeitem.type = type;
        nodeitem.value = value;
        nodeitem.code = code;
        nodeitem.cont = cont;

        nodeitem.custcnt = custcnt;
        nodeitem.del = del;
        nodeitem.seq = seq;
        return nodeitem;
    }


    /**
    *필터 추가 조건으로
    */
    this.AddFilter_Cond = function (CondId, CondNm, CondCont, Row) {
        var rs = true;
        var desc = CondNm;
        var Name = CondNm;
        var ozid = CondId;
        var itemtype = "CondFilter";
        var voperator = "";
        var visnot = "F";
        var type = "6";  //필터조건
        var value = CondNm;
        var code = "";
        var filtercont = CondId;
        var Condxml = ozf_Decode(CondCont);
        var FilterDoc = parser.parseFromString(Condxml, "text/xml");
        var Node = ozf_getSelectedSingleNode(FilterDoc, '/LogicOperator');

        this.ConvertOfCondXml(Node);  //지울내용 변환
        code = (new XMLSerializer()).serializeToString(FilterDoc);

        filtercont = ozf_Encode(filtercont);
        code = ozf_Encode(code);

        if (Row == 0) {  //신규 등록일경우
            this.addFilterNode("", desc, Name, ozid, itemtype, voperator, visnot, type, value, code, filtercont, "");
        } else {   //만약 들어온값과 있던값의 ozid가 같을경우에 수정되도록하려고 Row가 0보다 크면 수정
            this.MoidFilterNode(Row, desc, value, code, filtercont, voperator, visnot, Name, ozid);
        }

        return rs;
    }



    /**
    *Node에서 FilterCondt찾아서 내용 지우기
    */
    this.ConvertOfCondXml = function (PNode) {
        var CNodes = PNode.childNodes;
        var Node;
        var FilterContNode;
        var NodeNm = "";
        for (var i = 0; i < CNodes.length; i++) {
            Node = CNodes[i];
            NodeNm = Node.nodeName;

            if (NodeNm.equals("LogicOperator")) {
                this.ConvertOfCondXml(Node);
            } else if (NodeNm.equals("Condition")) {
                FilterContNode = ozf_getSelectedSingleNode(Node, "/FilterCont");
                if (FilterContNode != null) {
                    FilterContNode.remove();
                }

            }
        }
    }

    /**
    *필터 추가 Direct방식
    */
    this.AddFilter_Direct = function (ozid, Value, Code, row, Oper, vIsNot, vIsCustom, PRow, isAllCont) {
        if (typeof (oper) === "undefined") oper = "IN";
        if (typeof (vIsNot) === "undefined") vIsNot = "F";
        if (typeof (vIsCustom) === "undefined") vIsCustom = "F";
        if (typeof (PRow) === "undefined") PRow = 0;
        if (typeof (isAllCont) === "undefined") isAllCont = false;

        var rs = true;
        var Type = "3" //Direct 방식

        var xml = "";
        var condition = "";
        var code_arr = Code.split(this.ExpDelimiter);
        var value_arr = Value.split(this.ExpDelimiter);

        for (var i = 0; i < code_arr.length; i++) {
            if (condition == "") {
                condition = this.MakeCondition(code_arr[i], value_arr[i]);
            } else {
                condition += this.MakeCondition(code_arr[i], value_arr[i]);
            }
        }

        var itemtype = newgetmetadata.GetOzidInfo(ozid, "type");
        var itemName = newgetmetadata.GetOzidInfo(ozid, "name");

        switch (Oper) {
            case ">":
                Oper = "&gt;";
                break;
            case "<":
                Oper = "&lt;";
                break;
            case "<>":
                Oper = "&lt;&gt;";
                break;
            case "<=":
                Oper = "&lt;=";
                break;
            case ">=":
                Oper = "&gt;=";
                break;
        }

        xml += "<List>";
        xml += "    <LogicOperator isnot='F' operator='AND'>";
        xml += "        <Condition edittype='Editor' iscustom='" + vIsCustom + "' isnot='" + vIsNot + "' operator='@OPER@'>";
        xml += "		    <Editor>";
        xml += "			    <RefItem Inneroperator='' Leftoperator='' Rightoperator='' itemtype='" + itemtype + "' name='" + itemName + "' ozid='" + ozid + "' />";
        xml += "		    </Editor>";
        xml += "	    	<Values>" + condition + "</Values>";
        xml += "	    </Condition>";
        xml += "    </LogicOperator>";
        xml += "</List>";

        xml = xml.replace("&", "&amp;"); // & 표현을 할수없어서 변경 20160727
        xml = xml.replace("@OPER@", Oper);



        var FilterDoc = parser.parseFromString(xml, "text/xml");
        var Cnodes = FilterDoc.getElementsByTagName("Condition");

        for (var i = 0; i < Cnodes.length; i++) {
            if (isAllCont === false) {  //한번에 넣는것이 아니라면 기본
                this.AddItem_Explorer(Cnodes[i], row, Type);
            } else if (isAllCont === true) { //만약에 한번에 넣는것이라면
                this.AddItem_AllCont(Cnodes[i], row, Type, PRow);
            }
        }

    }



    /**
    *value xml 만들기
    */
    this.MakeCondition = function (code, nm) {
        var xml = "";

        xml += "<ValueItem valuetype='codevalue'>";
        xml += "	<Value>" + nm + "</Value>";
        xml += "	<Code>" + code + "</Code>";
        xml += "</ValueItem>";
        return xml;
    }


    /**
    * 필터 추가 SQL 방식
    */
    this.AddFilter_SQL = function (ozid, Fltid, visnot, oper, SQL_NM, SQL, PostSQL, PreSQL, row, InvMode) {
        if (typeof (InvMode) === "undefined") InvMode = false;

        var rs = true;
        var Type = "";
        if (InvMode === true) {
            Type = "2_INV"; //인벤토리 고객군 생성시 사용
        } else {
            Type = "2";  //SQL 방식
        }


        var xml = "";
        xml += "<List>";
        xml += "   <LogicOperator isnot='F' operator='AND'>";
        xml += "      <Condition isnot='" + visnot + "' operator='" + oper + "'>";
        xml += "         <Editor>";
        xml += "            <RefItem ozid='" + ozid + "' fltid = '" + Fltid + "'/>";
        xml += "         </Editor>";
        xml += "         <Values>";
        xml += "            <ValueItem valuetype='sql'>";
        xml += "               <Value>";
        xml += "                  <![CDATA[" + SQL_NM + "]]>";
        xml += "               </Value>";
        xml += "               <Code>";
        xml += "                  <![CDATA[" + SQL + "]]>";
        xml += "               </Code>";
        xml += "               <Sql_Post>";
        xml += "                  <![CDATA[" + PostSQL + "]]>";
        xml += "               </Sql_Post>";
        xml += "               <Sql_Pre>";
        xml += "                  <![CDATA[" + PreSQL + "]]>";
        xml += "               </Sql_Pre>";
        xml += "            </ValueItem>";
        xml += "         </Values>";
        xml += "      </Condition>";
        xml += "   </LogicOperator>";
        xml += "</List>";

        var FilterDoc = parser.parseFromString(xml, "text/xml");
        var CNodeList = FilterDoc.getElementsByTagName("Condition");

        for (var i = 0; i < CNodeList.length; i++) {
            this.AddItem_Sql(CNodeList[i], row, Type);
        }
    }


    /**
    *SQL으로 조건 넣기
    */
    this.AddItem_Sql = function (node, row, type) {
        var name = "";
        var ozid = "";
        var visnot = "";
        var itemtype = "";
        var viperator = "";
        var iscustom = "";
        var value = "";
        var code = "";
        var desc = "";
        var FilterCont = "";
        var rs = true;
        var Filterozid = "";

        voperator = node.getAttribute("operator");
        visnot = node.getAttribute("isnot");
        var rnode = node.getElementsByTagName('RefItem');

        ozid = rnode[0].getAttribute("ozid");
        FilterCont = rnode[0].getAttribute("fltid");
        name = newgetmetadata.GetOzidInfo(ozid, "name");
        itemtype = newgetmetadata.GetOzidInfo(ozid, "type");

        var vnodes = node.getElementsByTagName('ValueItem');
        var vnode;
        var cnode;

        var sqlpostnode;
        var sqlprenode;
        var SqlPost = "";
        var SqlPre = "";

        for (var i = 0; i < vnodes.length; i++) {
            vnode = vnodes[i].getElementsByTagName('Value');
            cnode = vnodes[i].getElementsByTagName('Code');

            if (value == "") {
                value = vnode[0].textContent.trim();
                code = cnode[0].textContent.trim();
            } else {
                value += ";" + vnode[0].textContent.trim();
                code += ";" + cnode[0].textContent.trim();
            }

            sqlpostnode = vnodes[i].getElementsByTagName("Sql_Post");
            sqlprenode = vnodes[i].getElementsByTagName("Sql_Pre");
            SqlPost = sqlpostnode[0].textContent.trim();  //선행SQL
            SqlPre = sqlprenode[0].textContent.trim();    //후행SQL

            if (SqlPost === false) { //선행SQL
                addExplorerSqlData(FilterCont, "1", SqlPost);
            }

            if (SqlPre === false) { //후행SQL
                addExplorerSqlData(FilterCont, "2", SqlPre);
            }
        }

        var NotString = "";
        if (visnot.equals("T")) {
            NotString = "NOT ";
        } else if (visnot.equals("F")) {
            NotString = "";
        }

        if (type.equals("2_INV")) { //SQL인벤토리 입력일경우
            var invoper = "";
            var temp = NotString + voperator;

            if (temp.equals("IN")) {
                invoper = "포함";
            } else if (temp.equals("NOT IN")) {
                invoper = "미포함";
            }
            desc = value + " " + invoper;
        } else {  //Inv 아닐경우는 모두 기존 방식
            desc = "[" + name + "] " + NotString + voperator + " " + value
        }

        if (row > 0) {
            Filterozid = treedataSource[row].ozid;

            if (!Filterozid.equals(ozid)) {
                row = 0;
            }
        }

        FilterCont = ozf_Encode(FilterCont);

        if (row == 0) {  //신규 등록일경우
            this.addFilterNode("", desc, name, ozid, itemtype, voperator, visnot, type, value, code, FilterCont, "");
        } else {   //만약 들어온값과 있던값의 ozid가 같을경우에 수정되도록하려고 Row가 0보다 크면 수정
            this.MoidFilterNode(row, desc, value, code, FilterCont, voperator, visnot, name, ozid);
        }

        return rs;
    }



    /**
    *필터 추가 explorer기본
    */
    this.AddFilter = function (Cont, Row) {
        var rs = true;
        var Type = "1";
        var FilterDoc = parser.parseFromString(Cont, "text/xml");
        var NodeList = FilterDoc.getElementsByTagName("Condition");
        for (var i = 0; i < NodeList.length; i++) {
            this.AddItem_Explorer(NodeList[i], Row, Type);
        }
        return rs;
    }


    /**
    *필터 추가 NewFilter에서 사용(Filtering)
    */
    this.AddFilter_NewFilter = function (Cont, Row) {
        var rs = true;
        var Type = "";
        var FilterDoc = parser.parseFromString(Cont, "text/xml");

        var CNodeList = FilterDoc.getElementsByTagName("Condition");
        var ValueType = "";

        for (var i = 0; i < CNodeList.length; i++) {

            var TempNodes = CNodeList[0].getElementsByTagName("Values");
            ValueType = TempNodes[0].children[0].getAttribute('valuetype');

            if (ValueType.equals("codevalue")) {
                Type = "4";    //값입력
                this.AddItem_Explorer(CNodeList[i], Row, Type);
            } else if (ValueType.equals("Sql")) {
                Type = "5";    //Sql입력
                this.AddItem_NewFilterSql(CNodeList[i], Row, Type);
            }

        }
        return rs;
    }


    /**
    *Filter Item으로 조건 추가
    */
    this.AddFilter_Filter = function (filterozid, row) {
        var metaXML = "";
        var xml = "";
        xml = newgetmetadata.GetItem(filterozid);
        metaXML = parser.parseFromString(xml, "text/xml");

        var fnode = ozf_getSelectedSingleNode(metaXML, "/List/Filter");
        var fname = fnode.getAttribute('name');

        var desc = fname;
        var name = fname;
        var ozid = filterozid;
        var itemtype = "ItemFilter";
        var voperator = "";
        var visnot = "F";
        var type = "7"; //필터조건
        var value = fname;
        var code = "";
        var filtercont = filterozid;

        if (row == 0) {  //신규 등록일경우
            this.addFilterNode("", desc, name, ozid, itemtype, voperator, visnot, type, value, code, filtercont, "");
        } else {   //만약 들어온값과 있던값의 ozid가 같을경우에 수정되도록하려고 Row가 0보다 크면 수정
            this.MoidFilterNode(row, desc, value, code, filtercont, voperator, visnot, name, ozid);
        }
    }


    /**
    *NewFilter_SQL으로 조건 넣기
    */
    this.AddItem_NewFilterSql = function (node, row, type) {
        var name = "";
        var ozid = "";
        var visnot = "";
        var itemtype = "";
        var voperator = "";
        var iscustom = "";
        var value = "";
        var code = "";
        var desc = "";
        var FilterCont = "";
        var rs = true;
        var Filterozid = "";

        FilterCont = node.textContent;
        voperator = node.getAttribute('operator');
        visnot = node.getAttribute('isnot');

        var rnode = ozf_getSelectedSingleNode(node, '/Editor/RefItem');
        ozid = rnode.getAttribute('ozid');

        name = newgetmetadata.GetOzidInfo(ozid, "name");
        itemtype = newgetmetadata.GetOzidInfo(ozid, "type");


        var vnodes = node.getElementsByTagName("ValueItem");
        var vnode;
        var cnode;

        for (var i = 0; i < vnodes.length; i++) {
            vnode = vnodes[i].getElementsByTagName('Value');
            cnode = vnodes[i].getElementsByTagName('Code');

            if (value == "") {
                value = vnode[0].textContent.trim();
                code = cnode[0].textContent.trim();
            } else {
                value += ";" + vnode[0].textContent.trim();
                code += ";" + cnode[0].textContent.trim();
            }
        }

        var NotString = "";
        if (visnot.equals("T")) {
            NotString = "NOT ";
        } else if (visnot.equals("F")) {
            NotString = "";
        }

        desc = "[" + name + "] " + NotString + voperator + " " + value;

        if (row > 0) {
            Filterozid = treedataSource[row].ozid;
            if (!Filterozid.equals(ozid)) {
                row = 0;
            }
        }

        if (row <= 0) {
            var FindozidRow = 0;
            for (var i = 0; i < treedataSource.length; i++) {
                if (ozid.equals(treedataSource[i].ozid)) {
                    FindozidRow = i;
                    break;
                }
            }

            if (FindozidRow > 0) {   //Cancel 작성하여야함 *****
                var msg = name + " 항목이 이미 등록되어있습니다." + "값을 변경하시겠습니까?";
                var rs2 = ozf_MsgBoxYesNo(msg, "알림");
                if (rs2.equals("6")) { //6 : Yes
                    row = FindozidRow;
                } else if (rs2.equals("7")) {  // 7 : NO
                    row = 0;
                } else {
                    return false;
                }
            }
        }

        FilterCont = ozf_Encode(FilterCont);

        if (row == 0) {  //신규 등록일경우
            this.addFilterNode("", desc, name, ozid, itemtype, voperator, visnot, type, value, code, FilterCont, "");
        } else {   //만약 들어온값과 있던값의 ozid가 같을경우에 수정되도록하려고 Row가 0보다 크면 수정
            this.MoidFilterNode(row, desc, value, code, FilterCont, voperator, visnot, name, ozid);
        }

        return rs;
    }

    /**
    *ITEM 전체 넣기
    */
    this.AddItem_AllCont = function (Node, row, type, Prow) {
        var name = "";
        var ozid = "";
        var itemtype = "";
        var voperator = "";
        var visnot = "";
        var NotString = "";
        var iscustom = "";
        var value = "";
        var code = "";
        var FilterCont = "";
        var rs = true;
        var Filterozid = "";
        var vXml = new XMLSerializer().serializeToString(Node);
        FilterCont = vXml;

        iscustom = Node.getAttribute("iscustom");
        voperator = Node.getAttribute("operator");
        visnot = Node.getAttribute("isnot");

        if (visnot.equals("T")) {
            NotString = "NOT ";
        } else if (visnot.equals("F")) {
            NotString = "";
        }
        var rNode = Node.getElementsByTagName('RefItem');
        ozid = rNode[0].getAttribute('ozid');
        name = rNode[0].getAttribute('name');
        itemtype = rNode[0].getAttribute('itemtype');

        var vNodes = Node.getElementsByTagName('ValueItem');
        var vNode;
        var cNode;

        for (var i = 0; i < vNodes.length; i++) {
            vnode = vNodes[i].getElementsByTagName('Value');
            cNode = vNodes[i].getElementsByTagName('Code');

            if (value == "") {
                if (type.equals("4")) {
                    value = vnode[0].textContent.trim();
                    code = cNode[0].textContent.trim();
                } else {
                    value = vnode[0].textContent.trim();
                    code = cNode[0].textContent.trim();
                }
            } else {
                if (type.equals("4")) {
                    value += ";" + vnode[0].textContent.trim();
                    code += ";" + cNode[0].textContent;
                } else {
                    value += ";" + vnode[0].textContent.trim();
                    code += ";" + cNode[0].textContent.trim();
                }

            }
        }

        if (voperator.equals("BETWEEN")) {
            var value_arr = [];
            value_arr = value.split(";");

            desc = "[" + name + "] " + NotString + voperator + " " + value_arr[0] + " AND " + value_arr[1];
        } else if (voperator.equals("IN")) {
            desc = "[" + name + "] " + NotString + voperator + " " + value.replace(";", ",");
        } else {
            desc = "[" + name + "] " + NotString + voperator + " " + value;
        }

        FilterCont = ozf_Encode(FilterCont);
        this.addFilterNode(Prow, desc, name, ozid, itemtype, voperator, visnot, type, value, code, FilterCont, "");
    }


    /**
     * Explorer 방식 필터 넣기
     * @param {any} Node
     * @param {any} Row
     * @param {any} Type
     */
    this.AddItem_Explorer = function (Node, row, type) {
        var name = "";
        var ozid = "";
        var itemtype = "";
        var voperator = "";
        var visnot = "";
        var NotString = "";
        var iscustom = "";
        var value = "";
        var code = "";
        var desc = "";
        var FilterCont = "";
        var rs = true;
        var Filterozid = "";
        var vXml = new XMLSerializer().serializeToString(Node);
        FilterCont = vXml;

        iscustom = Node.getAttribute('iscustom');
        voperator = Node.getAttribute('operator');
        visnot = Node.getAttribute('isnot');

        if (visnot.equals("T")) {
            NotString = "NOT ";
        } else {
            NotString = "";
        }

        var rNode = Node.getElementsByTagName('RefItem');

        ozid = rNode[0].getAttribute('ozid');
        name = rNode[0].getAttribute('name');
        itemtype = rNode[0].getAttribute('itemtype');

        var vNodes = Node.getElementsByTagName('ValueItem');
        var vNode;
        var cNode;

        for (var i = 0; i < vNodes.length; i++) {
            vnode = vNodes[i].getElementsByTagName('Value');
            cNode = vNodes[i].getElementsByTagName('Code');

            if (value == "") {
                if (type.equals("4")) {
                    value = vnode[0].textContent.trim();
                    code = cNode[0].textContent.trim();
                } else {
                    value = vnode[0].textContent.trim();
                    code = cNode[0].textContent.trim();
                }
            } else {
                if (type.equals("4")) {
                    value += ";" + vnode[0].textContent.trim();
                    code += ";" + cNode[0].textContent;
                } else {
                    value += ";" + vnode[0].textContent.trim();
                    code += ";" + cNode[0].textContent.trim();
                }

            }
        }


        if (voperator.equals("BETWEEN")) {
            var value_arr = [];
            value_arr = value.split(";");

            desc = "[" + name + "] " + NotString + voperator + " " + value_arr[0] + " AND " + value_arr[1];

        } else if (voperator.equals("IN")) {
            desc = "[" + name + "] " + NotString + voperator + " " + value.replace(";", ",");
        } else {
            desc = "[" + name + "] " + NotString + voperator + " " + value;
        }

        if (row > 0) {
            if (treedataSource.length > row) {
                Filterozid = treedataSource[row].ozid;
                if (!Filterozid.equals(ozid)) {
                    row = 0;
                }

            } else {
                row = 0;
            }
        }

        if (row <= 0) {
            var FindozidRow = 0;

            for (var i = 0; i < treedataSource.length; i++) {
                if (ozid.equals(treedataSource[i].ozid)) {
                    FindozidRow = i;
                    break;
                }
            }

            if (FindozidRow > 0) {   //Cancel 작성하여야함 *****
                var msg = name + " 항목이 이미 등록되어있습니다." + "값을 변경하시겠습니까?";
                var rs2 = ozf_MsgBoxYesNo(msg, "알림");
                if (rs2.equals("6")) { //6 : Yes
                    row = FindozidRow;
                } else if (rs2.equals("7")) {  // 7 : NO
                    row = 0;
                } else {
                    return false;
                }

            }
        }

        FilterCont = ozf_Encode(FilterCont);

        if (row == 0) {  //신규 등록일경우
            this.addFilterNode("", desc, name, ozid, itemtype, voperator, visnot, type, value, code, FilterCont, "");
        } else {   //만약 들어온값과 있던값의 ozid가 같을경우에 수정되도록하려고 Row가 0보다 크면 수정
            this.MoidFilterNode(row, desc, value, code, FilterCont, voperator, visnot, name, ozid);
        }
    }



    /**
    *필터값 수정
    */
    this.MoidFilterNode = function (Row, Desc, value, code, FilterCont, voperator, visnot, vName, vOzid) {
        var rs = true;

        treedataSource[Row].desc = Desc;
        treedataSource[Row].name = vName;
        treedataSource[Row].ozid = vOzid;
        treedataSource[Row].condition = voperator;
        treedataSource[Row].isnot = visnot;
        treedataSource[Row].value = value;
        treedataSource[Row].code = code;
        treedataSource[Row].FilterCont = FilterCont;
        //ctlexplorerfilter.option('dataSource', treedataSource);
        //ctlexplorerfilter.repaint();
        inst.refreshtreelist();
        return rs;

    }
    /**
     * 필터 트리에 값 넣기
     * @param {any} pid  상위id
     * @param {any} desc
     * @param {any} name
     * @param {any} ozid
     * @param {any} itemtype
     * @param {any} voperator
     * @param {any} visnot
     * @param {any} type
     * @param {any} value
     * @param {any} code
     * @param {any} FilterCont
     * @param {any} CustCnt
     */
    this.addFilterNode = function (pid, desc, name, ozid, itemtype, voperator, visnot, type, value, code, FilterCont, CustCnt) {

        var r = 0;
        var sType = "";
        var del = "";
        if ((ozid == "") && (itemtype.equals("Filter"))) {
            ozid = this.MakeFilterozid();
        }

        var seq = this.FindMaxSeq();

        if (!itemtype.equals("Filter")) {
            //img ******************\
            del = "삭제";

        }

        if (pid == "") {   //상위 id가 없다면 신규등록
            pid = "1";
            this.additem(pid, desc, name, ozid, itemtype, voperator, visnot, type, value, code, FilterCont, CustCnt, del, seq);
        } else {
            if (!itemtype.equals("Filter")) {
                //img ******************\
                del = "삭제";

            }
            this.additem(pid, desc, name, ozid, itemtype, voperator, visnot, type, value, code, FilterCont, CustCnt, del, seq);

            if (type.equals("2_INV")) {
                //img   **************
            } else {
                //img *************
            }


        }
        return seq;
    }


    /**
     * 필터 트리에 값 넣기 _Inv 용으로 additem_Inv 을 사용함
     * @param {any} pid  상위id
     * @param {any} desc
     * @param {any} name
     * @param {any} ozid
     * @param {any} itemtype
     * @param {any} voperator
     * @param {any} visnot
     * @param {any} type
     * @param {any} value
     * @param {any} code
     * @param {any} FilterCont
     * @param {any} CustCnt
     */
    this.addFilterNode_Inv = function (pid, desc, name, ozid, itemtype, voperator, visnot, type, value, code, FilterCont, CustCnt) {

        var r = 0;
        var sType = "";
        var del = "";
        if ((ozid == "") && (itemtype.equals("Filter"))) {
            ozid = this.MakeFilterozid();
        }

        var seq = this.FindMaxSeq();

        if (!itemtype.equals("Filter")) {
            //img ******************\
            del = "삭제";

        }

        if (pid == "") {   //상위 id가 없다면 신규등록
            pid = "1";
            this.additem_Inv(pid, desc, name, ozid, itemtype, voperator, visnot, type, value, code, FilterCont, CustCnt, del, seq);
        } else {
            if (!itemtype.equals("Filter")) {
                //img ******************\
                del = "삭제";

            }
            this.additem_Inv(pid, desc, name, ozid, itemtype, voperator, visnot, type, value, code, FilterCont, CustCnt, del, seq);

            if (type.equals("2_INV")) {
                //img   **************
            } else {
                //img *************
            }


        }
        return seq;
    }

    /**
    *신규 Data ADD
    */
    this.additem = function (pid, desc, name, ozid, itemtype, condition, isnot, type, value, code, cont, custcnt, del, seq) {
        var id = ozid;
        var nodeitem = this.make_NodeData(seq, pid, desc, name, ozid, itemtype, condition, isnot, type, value, code, cont, custcnt, del, seq);
        treedataSource.push(nodeitem);
        //ctlexplorerfilter.option('dataSource', treedataSource);
        //ctlexplorerfilter.repaint();
        inst.refreshtreelist();
    }

    /**
    *신규 Data ADD  Inv일경우 TreedataSource에만 값을 넣어둔다
    */
    this.additem_Inv = function (pid, desc, name, ozid, itemtype, condition, isnot, type, value, code, cont, custcnt, del, seq) {
        var id = ozid;
        var nodeitem = this.make_NodeData(seq, pid, desc, name, ozid, itemtype, condition, isnot, type, value, code, cont, custcnt, del, seq);
        treedataSource.push(nodeitem);
    }


    /**
    *최대값 찾기
    */
    this.FindMaxSeq = function () {
        var MaxSeq = 0;
        var seq = 0;
        var tempdata = "";
        for (var i = 0; i < treedataSource.length; i++) {
            tempdata = treedataSource[i].seq;

            if (tempdata.length == 0) {
                seq = 0;
            } else {
                seq = parseInt(tempdata);
            }

            if (seq > MaxSeq) {
                MaxSeq = seq;
            }
        }
        MaxSeq++;
        return MaxSeq;
    }


    /**
     * 필터 (AND, OR, 등 )에는 ozid가 없기때문에 특정문자를 만들기 위해서
     * dll에서는 2번째 컬럼(ozid) , 3번째 컬럼(itemType)MakeFilterozid(2,3) 으로 넘김 고정값
     */
    this.MakeFilterozid = function () {
        var FilterOzid = "";
        var temp = "";
        var count = 0;
        var mCount = 0;

        var temp = "";
        for (var i = 0; i < treedataSource.length; i++) {
            temp = treedataSource[i].itemtype;
            if (temp.equals("Filter")) {
                temp = treedataSource[i].ozid;
                temp = temp.replace("filter_", "");
                mCount = parseInt(temp);
                if (mCount >= count) {
                    count = mCount;
                }

            }
        }
        count++;
        FilterOzid = "filter_" + count.toString();
        return FilterOzid;
    }




    /**
    *SQL만들기
    *Type Final : 최종 조회 ,   Step : 단계별 조회
    */
    this.GetSQL = function (vType) {
        var Sql = "";

        if ((treedataSource.length > 1) || (this.HiddenFilter != "")) {

            //필터에서 메져 사용했는지 여부
            var vFilterMeasureUse = this.FilterMeasureUse();

            var ItemRankUse = false;
            if (this.ItemRank != "") {
                ItemRankUse = true;
            }

            //필터에 메져를 사용중이면서 정렬을 사용한다면 불가능하므로 Stop
            if ((vFilterMeasureUse == true) && (ItemRankUse == true)) {
                Sql = "";
                alert("필터로 메져를 사용하면서 정렬을 사용 할 수 없습니다.");
                return Sql;
            }

            //필수조건이 값이 있을경우 필수 조건 체크
            if (vNecessaryItem != "") {
                var RsNecessary = this.CheckNecessaryItem();
                if (RsNecessary == false) {
                    return Sql;
                }
            }

            this.GetReportContent();
            var rs = this.GetFilterXML();
            if (rs == false) {
                return Sql;
            }
            var RankExist = this.SetItemRank(); //Rank 사용여부 (Rank가 사용된경우 XML수정)

            if (vType.equals("Step")) {
                Sql = this.MakeSQL_Step(RankExist);

                console.log(Sql);

                if (Sql == "") {
                    return Sql;
                }
            } else if (vType.equals("Final")) {
                var InstanceID = "";
                var vReportozid = this.Reportozid;
                var vReportcont = this.ReportCont;

                var vCubeozid = this.Cubeozid;
                InstanceID = newgetmetadata.GetInstanceID(vReportozid, vReportcont, vCubeozid);
                Sql = this.GetReportSQL(InstanceID, RankExist);
            }

        } else {
            alert("조건을 선택해 주세요");
        }

        //Sql = Sql.replace(/"/gi, '\\"');
        return Sql;
    }


    /**
    *SQL만들기
    */
    this.GetReportSQL = function (instanceid, RankExist) {
        var meta = "";
        var vPurpose = "ReportContent";
        var vAddress = "<List><Item address='" + this.Reportozid + "' instanceid='" + instanceid + "'/></List>";
        var vOption = "";
        var metaXML = "";
        var sql = "";
        if (RankExist == true) {  //Rank가 있다면
            vOption = "<List><Option informationonlywithorder='T'/></List>";
        } else {  //Rank가 없다면
            vOption = "<List><Option informationonly='T'/></List>";
        }

        meta = ozf_OLAPHandler(vPurpose, vAddress, vOption, false);
        metaXML = parser.parseFromString(meta, "text/xml");
        var SNode = ozf_getSelectedSingleNode(metaXML, "/List/ServiceContent");
        var vdbServer = SNode.getAttribute('dbname');
        this.DBServer = vdbServer;

        var sqlNode = ozf_getSelectedSingleNode(metaXML, "/List/ServiceContent/ExecutionItems/Sql");
        sql = sqlNode.textContent;

        return sql;
    }


    this.rst_GetReportSQL = function (item, returncontent, iserror, handler) {
        metaXML = parser.parseFromString(item, "text/xml");
        var SNode = ozf_getSelectedSingleNode(metaXML, "/List/ServiceContent");
        var vdbServer = SNode.getAttribute('dbname');
        this.DBServer = vdbServer;

        var sqlNode = ozf_getSelectedSingleNode(metaXML, "/List/ServiceContent/ExecutionItems/Sql");
        sql = sqlNode.textContent;

        return sql;
    }

    /**
    *FilterXML만들기           *********** 작업해야함
    */
    this.GetFilterXML = function () {
        var rs = true;
        var ozid = "";
        var xml = "";
        var xDoc;
        var PivotXml = "";
        var PivotItem = "";

        var MainDoc = parser.parseFromString(this.ReportCont, "text/xml");
        var FNode = MainDoc.getElementsByTagName('Filter')[0];


        FNode.removeChild(FNode.firstChild);

        xml = this.MakeFilterXML(0);  //xml만들어오기
        var DoNotDisplayFilterxml = "";
        if (DoNotDisplayFilterList.length > 0) {  //보이지 않는 필터가 있을경우 필터를 먼저 넣어준다
            DoNotDisplayFilterxml = this.MakeDoNotDisplayFilterXML();
            xml = DoNotDisplayFilterxml.replace("@FILTERXML@", xml);
        }

        var SubDoc = parser.parseFromString(xml, "text/xml");
        var addNode = ozf_getSelectedSingleNode(SubDoc, "/LogicOperator");

        var tempNode = MainDoc.importNode(addNode, true);
        FNode.appendChild(tempNode);

        var temp = (new XMLSerializer()).serializeToString(MainDoc);
        this.ReportCont = temp;

        this.ReportCont = newconverterxml.ConverterXML(this.ReportCont);  //****************** 테스트중


        if (temp == "") {
            rs = false;
            this.ReportCont = temp;
        }
        return rs;
    }



    /**
    * 보이지 않는 필터 xml 만들기
    */
    this.MakeDoNotDisplayFilterXML = function () {
        var xml = "";
        var ConditionXML = "";
        var sName = "";
        var sOzid = "";
        var sItemType = "";
        var sCondition = "";
        var sIsnot = "";
        var sValue = "";
        var sCode = "";
        var sFullPath = "";
        var sIsSql = "";
        var ValueType = "";

        xml = "<LogicOperator isnot='F' operator='AND'>";

        for (var i = 0; i < DoNotDisplayFilterList.length; i++) {
            sName = DoNotDisplayFilterList[i].name;
            sOzid = DoNotDisplayFilterList[i].ozid;
            sItemType = DoNotDisplayFilterList[i].ItemType;
            sCondition = DoNotDisplayFilterList[i].Condition;
            sIsnot = DoNotDisplayFilterList[i].Isnot;
            sValue = DoNotDisplayFilterList[i].value;
            sCode = DoNotDisplayFilterList[i].code;
            sFullPath = DoNotDisplayFilterList[i].address;
            sIsSql = DoNotDisplayFilterList[i].issql;

            switch (sCondition) {
                case ">":
                    sCondition = "&gt;";
                    break;
                case "<":
                    sCondition = "&lt;";
                    break;
                case "<>":
                    sCondition = "&lt;&gt;";
                    break;
                case "<=":
                    sCondition = "&lt;=";
                    break;
                case ">=":
                    sCondition = "&gt;=";
                    break;
            }

            if (sIsSql === false) {
                ValueType = "codevalue";
            } else if (sIsSql === true) {
                ValueType = "sql";
            }

            var tempvalue = this.makeValue(sCondition, sValue, sCode, ValueType);

            ConditionXML += "<Condition edittype='Editor' iscustom='T' isnot='" + sIsnot + "' operator='" + sCondition + "'>"
            ConditionXML += "<Editor>"
            ConditionXML += "<RefItem Inneroperator='' Leftoperator='' Rightoperator='' itemtype='" + sItemType + "' name='" + sName + "' ozid='" + sOzid + "' contentfullpath='" + sFullPath + "'/>"
            ConditionXML += "</Editor>"
            ConditionXML += tempvalue;
            ConditionXML += "</Condition>"
        }

        xml += ConditionXML + "@FILTERXML@ </LogicOperator > ";
        return xml;
    }


    /**
    *필터부분 XML
    */
    this.MakeFilterXML = function (row) {
        var xml = "";
        var sName = "";
        var sOzid = "";
        var sItemType = "";
        var sCondition = "";
        var sIsnot = "";
        var stype = "";
        var sValue = "";
        var sCode = "";
        var sFullPath = "";
        var sValueType = "";
        var spid = "";
        var sid = "";

        spid = treedataSource[row].pid;
        sid = treedataSource[row].id;
        sName = treedataSource[row].name;
        sOzid = treedataSource[row].ozid;
        sItemType = treedataSource[row].itemtype;
        sCondition = treedataSource[row].condition;

        if (sCondition.equals(">")) {
            sCondition = "&gt;";
        } else if (sCondition.equals("<")) {
            sCondition = "&lt;";
        } else if (sCondition.equals("<>")) {
            sCondition = "&lt;&gt;";
        } else if (sCondition.equals("<=")) {
            sCondition = "&lt;=";
        } else if (sCondition.equals(">=")) {
            sCondition = "&gt;=";
        }

        sIsnot = treedataSource[row].isnot;
        stype = treedataSource[row].type;
        sValue = treedataSource[row].value;
        sCode = treedataSource[row].code;

        if (stype.equals("2")) { //상세조건추가시 에만 sql입력이므로
            sValueType = "sql";
        } else if (stype.equals("2_INV")) {
            sValueType = "sql";
        } else if (stype.equals("5")) {
            sValueType = "sql";
        } else {
            sValueType = "codevalue";
        }


        if (sItemType.equals("Filter")) {
            xml += "<LogicOperator isnot='" + sIsnot + "' operator='" + sCondition + "'>";
            var temp_pid = "";
            var tempxml = "";
            for (var i = 0; i < treedataSource.length; i++) {
                temp_pid = treedataSource[i].pid;
                if (sid == temp_pid) {
                    tempxml = this.MakeFilterXML(i);
                    xml += tempxml;
                }
            }

            //숨겨진 필터가 있고 맨처음 조건일경우 넣어주기 
            if ((row == 0) && (this.HiddenFilter != "")) {
                xml += HiddenFilter + "</LogicOperator>";
            } else {
                xml += "</LogicOperator>";
            }

        } else if (sItemType.equals("CondFilter")) {  //조건 필터
            sCode = ozf_Decode(sCode);
            xml = sCode;
        } else if (sItemType.equals("ItemFilter")) {  //조건 필터
            var metaXML = "";
            var Filterxml = newgetmetadata.GetItem(sOzid);
            metaXML = parser.parseFromString(Filterxml, "text/xml");
            var fnode = ozf_getSelectedSingleNode(metaXML, "/List/Filter");
            var fname = fnode.getAttribute('name');
            var fadd = fnode.getAttribute('address');
            xml = "<RefItem cubeozid='' Cube='' itemtype='Filter' name='" + fname + "' ozid='" + sOzid + "' contentfullpath='" + fadd + "'/>"

        } else {
            var tempxml = this.GetItem(sOzid);
            var xmlDoc = parser.parseFromString(tempxml, "text/xml");
            var Lnode = ozf_getSelectedSingleNode(xmlDoc, "/List");

            if (Lnode.childElementCount > 0) {
                sFullPath = Lnode.firstChild.getAttribute('address');
            }

            var valuexml = this.makeValue(sCondition, sValue, sCode, sValueType);
            xml += "<Condition edittype='Editor' iscustom='T' isnot='" + sIsnot + "' operator='" + sCondition + "'>";
            xml += "<Editor>";
            xml += "<RefItem Inneroperator='' Leftoperator='' Rightoperator='' itemtype='" + sItemType + "' name='" + sName + "' ozid='" + sOzid + "' contentfullpath='" + sFullPath + "'/>";
            xml += "</Editor>";
            xml += valuexml;
            xml += "</Condition>";
        }
        return xml;
    }

    /**
    *  value 값 만들기
    */
    this.makeValue = function (sCondition, sValue, sCode, sValueType) {
        var xml = "<Values>";
        var values;
        var Codes;

        if (sCondition.equals("BETWEEN")) {
            values = sValue.split(";");
            Codes = sCode.split(";");
        } else {
            if (sValueType.equals("sql")) {
                values = sValue.split(";");
                Codes = sCode.split(";");

                for (var i = 0; i < values.length; i++) {
                    values[i] = values[i].replace(">", "&gt;").replace("<", "&lt;");
                    Codes[i] = Codes[i].replace(">", "&gt;").replace("<", "&lt;");
                }
            } else {
                //values = sValue.replace("'", "").split(";");
                //Codes = sCode.replace("'", "").split(";");
                values = sValue.split(";");
                Codes = sCode.split(";");
            }
        }

        var valueitem = "";
        for (var j = 0; j < values.length; j++) {
            valueitem = valueitem + this.MakeValueItem(values[j].replace("&", "&amp;"), Codes[j], sValueType);
        }
        xml += valueitem + "</Values>";
        return xml
    }

    /**
    *ValueItem만들어오기
    */
    this.MakeValueItem = function (value, code, ValueType) {
        var ValueItemXML = "";
        ValueItemXML += "<ValueItem valuetype='" + ValueType + "'> ";
        ValueItemXML += "   <Code>" + code + "</Code>";
        ValueItemXML += "   <Value>" + value + "</Value>";
        ValueItemXML += "</ValueItem>";
        return ValueItemXML;
    }

    /**
    *필수조건 체크
    */
    this.CheckNecessaryItem = function () {
        var rs = true;
        var NecessaryItem_arr = new [];
        NecessaryItem_arr = vNecessaryItem.split(this.ExpDelimiter);
        var item_ozid = "";
        var ExistItem = false;

        var item_name = "";

        var tempozid = "";

        for (var i = 0; i < NecessaryItem_arr.length; i++) {
            item_ozid = NecessaryItem_arr[i];
            item_name = newgetmetadata.GetOzidInfo(item_ozid, "name");

            ExistItem = false;

            for (var j = 1; j < treedataSource.length; j++) {
                tempozid = treedataSource[j].ozid;
                if (item_ozid.equals(tempozid)) {
                    ExistItem = true;
                    break;
                }
            }

            if (ExistItem === false) {
                var msg = item_name + " 항목은 필수 조건입니다.";
                ozf_MsgBoxEx(msg, "0", "알림");
                rs = false
                break;
            }
        }
        return rs;
    }


    /**
    * Explorer에서 Measure를 사용하였는지 체크
    */
    this.FilterMeasureUse = function () {
        var MUse = false;
        var MCnt = 0;
        var vItemType = "";

        for (var i = 0; i < treedataSource.length; i++) {
            vItemType = treedataSource[i].itemtype.toUpperCase();
            if (vItemType.equals("MEASURE")) {
                MCnt++;
            } else if (vItemType.equals("CONDFILTER")) {  //조건 필터일경우 XML조회 해야하므로
                var xml = treedataSource[i].code;
                var temprs = this.MesureUseInXml(xml);
                if (temprs === true) {
                    MCnt++;
                }
            }
        }
        if (MCnt > 0) {
            MUse = true;
        }
        return MUse;
    }



    /**
    *사용자정의 Filter에서 메져를 사용하였을경우 True Return
    */
    this.MesureUseInXml = function (xml) {
        var rs = false;
        xml = ozf_Decode(xml);
        var MainDoc = parser.parseFromString(xml, "text/xml");
        var Nodes = MainDoc.getElementsByTagName("LogicOperator");
        var Node;

        for (var i = 0; i < Nodes.length; i++) {
            Node = Nodes[i];
            rs = this.UseMeasure(Node);
        }
        return rs;
    }

    /**
    *xml에서 ItemType를 보고 메져가 포함되어있는지 체크
    */
    this.UseMeasure = function (Node) {
        var CNode;
        var MUse = false;
        var ENode;
        var vItemType = "";
        for (var i = 0; i < Node.children.length; i++) {
            CNode = Node.children[i];

            if (CNode.nodeName.equals("Condition")) {  //조건일경우
                ENode = ozf_getSelectedSingleNode(MainDoc, "Editor/RefItem");
                vItemType = ENode.getAttribute("itemtype");

                if (vItemType.equals("Measure")) {
                    MUse = true;
                    return MUse;
                }
            } else if (CNode.nodeName("LogicOperator")) {
                MUse = this.UseMeasure(CNode);
                if (MUse === true) {
                    return MUse;
                }
            }
        }
        return MUse;
    }


    /**
    * address 를 가지고서 항목 조회하기
    */
    this.GetItem = function (add) {
        var sList = "";
        sList = newgetmetadata.GetItemInfo(add);
        return sList;
    }

    /**
    *정렬항목 설정
    */
    this.SetItemRank = function () {
        var item = this.ItemRank;
        var RankExist = false;

        if (item == "") {
            RankExist = false;
            return RankExist;
        } else {
            RankExist = true;
        }

        var Items_Arr = item.split("!@#");
        var ItemOzid = "";
        var ItemName = "";
        var ItemType = "";
        var ItemOrderNm = "";
        var ItemOrderCd = "";
        var items;

        var TempRankXml = "";
        var xml = "";
        var Rankxml = "";

        var temp = "";
        for (var i = 0; i < Items_Arr.length; i++) {
            temp = Items_Arr[i];

            items = temp.split(";");
            ItemOzid = items[0];
            ItemName = items[1];
            ItemType = items[2];
            ItemOrderNm = items[3];
            ItemOrderCd = items[4];
            xml = "<RankItem itemtype='" + ItemType + "' ozid='" + ItemOzid + "' name='" + ItemName + "' method='" + ItemOrderCd + "'/>";
            Rankxml += xml;
        }
        Rankxml = "<List>" + Rankxml + "</List>";
        this.SetRank(Rankxml);
        return RankExist;
    }



    /**
    *RankXml 설정하기
    */
    this.SetRank = function (RankXml) {
        var TempReportCont = this.ReportCont;

        var MainDoc = parser.parseFromString(TempReportCont, "text/xml");
        var Rnode = ozf_getSelectedSingleNode(MainDoc, '/List/ListReport/Ranks');
        var CCnt = Rnode.children.length;
        if (CCnt > 0) {
            Rnode.removeChild(Rnode.firstChild)
        }

        var vAttribute = "isdistinct";
        var HasAttribute = Rnode.hasAttribute(vAttribute);
        if (HasAttribute === false) {
            Rnode.setAttribute("isdistinct", "T");
        }

        var RankDoc = parser.parseFromString(RankXml, "text/xml");

        var tmpNode;
        var addNodeList = RankDoc.getElementsByTagName("RankItem");
        var addNode;

        for (var i = 0; i < addNodeList.length; i++) {
            addNode = addNodeList[i];
            tmpNode = MainDoc.importNode(addNode, true);
            Rnode.appendChild(tmpNode);
        }
        this.ReportCont = (new XMLSerializer()).serializeToString(MainDoc);
    }


    /**
    *쿼리 만들기 단계별
    */
    this.MakeSQL_Step = function (RankExist) {
        var rsSQL = "";
        var SQL = "";
        var Stempxml = "";
        var Step_xDoc;

        var RootOper = "";
        var RootType = "";

        var TempReportCont = this.ReportCont;

        RootOper = treedataSource[0].name;
        RootType = treedataSource[0].itemtype;

        if ((RootType.equals("Filter")) && (RootOper.equals("AND"))) {

        } else {
            var msg = "최상의 조건이 AND일경우에만 단계별 조회가 가능합니다.";
            ozf_MsgBoxEx(msg, "0", "알림");
            return "";
        }

        var Stepxml = this.ReportCont; //전체 xml 

        var index = 0;
        var temppid = "";   // 맨위의 FilterNode에 연결된 item들Cnt
        for (var i = 0; i < treedataSource.length; i++) {
            temppid = treedataSource[i].pid;
            if (temppid == 1) {
                index++;
            }
        }

        index--;

        var cnt = index;
        for (var j = 0; j < cnt; j++) {
            this.GetFilterXML_Step(index);
            Stepxml = this.ReportCont + "@#!" + Stepxml;
            index--;
        }



        var xml_arr = Stepxml.split("@#!");

        for (k = 0; k < xml_arr.length; k++) {
            var InstanceID = newgetmetadata.GetInstanceID(vReportozid, xml_arr[k], vCubeozid);
            Sql = this.GetReportSQL(InstanceID, RankExist);
            if (rsSQL == "") {
                rsSQL = Sql;
            } else {
                rsSQL += ";" + Sql;
            }
        }

        return rsSQL;
    }

    /**
    *FilterXML 만들기 단계별
    **/
    this.GetFilterXML_Step = function (index) {
        var rs = true;
        var ozid = "";
        var xml = "";
        var xDoc;
        var node;
        var PivotXml = "";
        var PivotItem = "";
        var MainDoc;

        var tempxml = this.ReportCont;

        MainDoc = parser.parseFromString(tempxml, "text/xml");
        var FNode = ozf_getSelectedSingleNode(MainDoc, "/List/ListReport/Filter");

        if (FNode.firstChild != null) {
            FNode.removeChild(FNode.firstChild)
        }
        

        var MNode = ozf_getSelectedSingleNode(MainDoc, "/List/ListReport/MeasureFilter");
        

        if (MNode.firstChild != null) {
            MNode.removeChild(MNode.firstChild)
        }

        xml = this.MakeFilterXML_Step(0, index);

        var DoNotDisplayFilterxml = "";
        if (DoNotDisplayFilterList.length > 0) {  //보이지 않는 필터가 있을경우 필터를 먼저 넣어준다
            DoNotDisplayFilterxml = this.MakeDoNotDisplayFilterXML();
            xml = DoNotDisplayFilterxml.replace("@FILTERXML@", xml);
        }

        var SubDoc = parser.parseFromString(xml, "text/xml");
        var addNode = ozf_getSelectedSingleNode(SubDoc, "/LogicOperator");
        var tmpNode = MainDoc.importNode(addNode, true);
        FNode.appendChild(tmpNode);

        this.ReportCont = (new XMLSerializer()).serializeToString(MainDoc);
        this.ReportCont = newconverterxml.ConverterXML(this.ReportCont);

        if (this.ReportCont == "") {
            rs = false;
            this.ReportCont = (new XMLSerializer()).serializeToString(MainDoc);
        }

        return rs;
    }


    /**
    * 필터부분 Step
    **/
    this.MakeFilterXML_Step = function (row, index) {
        var xml = "";
        var sName = "";
        var sOzid = "";
        var sItemType = "";
        var sCondition = "";
        var sIsnot = "";
        var stype = "";
        var sValue = "";
        var sCode = "";
        var sFullPath = "";
        var sValueType = "";


        sName = treedataSource[row].name;
        sOzid = treedataSource[row].ozid;
        sItemType = treedataSource[row].itemtype;
        sCondition = treedataSource[row].condition;

        switch (sCondition) {
            case ">":
                sCondition = "&gt;";
                break;
            case "<":
                sCondition = "&lt;";
                break;
            case "<>":
                sCondition = "&lt;&gt;";
                break;
            case "<=":
                sCondition = "&lt;=";
                break;
            case ">=":
                sCondition = "&gt;=";
                break;
        }
        sIsnot = treedataSource[row].isnot;
        stype = treedataSource[row].type;
        sValue = treedataSource[row].value;
        sCode = treedataSource[row].code;

        if (sItemType.equals("Filter")) {
            xml += "<LogicOperator isnot='" + sIsnot + "' operator='" + sCondition + "'>";

            var temp_id = treedataSource[row].id;
            var temp_pid = "";
            var temp_cnt = 0;
            for (var i = 0; i < treedataSource.length; i++) {
                temp_pid = treedataSource[i].pid;

                if (temp_id == temp_pid) {
                    temp_cnt++;
                    xml += this.MakeFilterXML(i);
                    if (temp_cnt == index) {
                        break;
                    }
                }
            }
            xml += "</LogicOperator>";
        } else {
            var tempxml = this.GetItem(sOzid);
            var xmlDoc = parser.parseFromString(tempxml, "text/xml");
            var Lnode = ozf_getSelectedSingleNode(xmlDoc, "/List");

            if (Lnode.childElementCount > 0) {
                sFullPath = Lnode.firstChild.getAttribute('address');
            }

            var valuexml = this.makeValue(sCondition, sValue, sCode, sValueType);
            xml += "<Condition edittype='Editor' iscustom='T' isnot='" + sIsnot + "' operator='" + sCondition + "'>";
            xml += "<Editor>";
            xml += "<RefItem Inneroperator='' Leftoperator='' Rightoperator='' itemtype='" + sItemType + "' name='" + sName + "' ozid='" + sOzid + "' contentfullpath='" + sFullPath + "'/>";
            xml += "</Editor>";
            xml += valuexml;
            xml += "</Condition>";
        }
        return xml;
    }


    /**
    *숨겨진 필터 삭제
    */
    this.DoNotDisplayFilterClear = function () {
        DoNotDisplayFilterList = [];
    }



    /**
    * DoNotDisplayFilter
    */
    this.DoNotDisplayFilter = function (ozid, Condition, Value, IsSql) {
        if (typeof (IsSql) === "undefined") IsSql = false;

        var vName = "";
        var vOzid = "";
        var vItemType = "";
        var vCondition = "";
        var vIsnot = "";
        var vValue = "";
        var vCode = "";
        var vAddress = "";

        vName = newgetmetadata.GetOzidInfo(ozid, "name");
        vOzid = ozid;
        vItemType = newgetmetadata.GetOzidInfo(ozid, "type");
        vValue = Value;
        vCode = Value;
        vAddress = newgetmetadata.GetOzidInfo(ozid, "address");
        if (Condition.toUpperCase().indexOf("NOT") >= 0) { //not이 있을경우
            vCondition = Condition.toUpperCase().replace("NOT", "").trim();
            vIsnot = "T";
        } else {
            vCondition = Condition;
            vIsnot = "F";
        }
        this.addDoNotDisplayFilter(vName, vOzid, vItemType, vCondition, vIsnot, vValue, vCode, vAddress, IsSql);
    }


    /**
    *선후행 쿼리 정보
    */
    this.addExplorerSqlData = function (fltid, flttype, fltCont) {
        var ExplorerSqlData = new object();
        ExplorerSqlData.fltid = fltid;
        ExplorerSqlData.flttype = flttype;
        ExplorerSqlData.fltCont = fltCont;

        ExplorerSqlDataList.push(ExplorerSqlData)
    }

    /**
    *보이지 않는 필터 넣기
    */
    this.addDoNotDisplayFilter = function (Name, ozid, ItemType, Condition, Isnot, value, code, address, issql) {
        var donotdisplayfilterdata = new Object();
        donotdisplayfilterdata.name = Name;
        donotdisplayfilterdata.ozid = ozid;
        donotdisplayfilterdata.ItemType = ItemType;
        donotdisplayfilterdata.Condition = Condition;
        donotdisplayfilterdata.Isnot = Isnot;
        donotdisplayfilterdata.value = value;
        donotdisplayfilterdata.code = code;
        donotdisplayfilterdata.address = address;
        donotdisplayfilterdata.issql = issql;

        DoNotDisplayFilterList.push(donotdisplayfilterdata);
    }



    /**
    * 고객수 넣기
    */
    this.SetCustCnt = function (Cnt) {
        var Cnt_arr = Cnt.split(";");
        var CustCnt = "";
        this.ClearCustCnt(); //모든 고객수 초기화

        var RootOzid = "";
        var PRow = 0;

        if (Cnt_arr.length == 1) {  //만약 조회 결과값이 하나만 있을경우
            CustCnt = ozf_FormatNumber(Cnt);
            treedataSource[treedataSource.length - 1].custcnt = CustCnt;
        } else {  //조회 결과값이 여러개일경우 단계별 조회
            var rootid = "1";
            var pid = "";
            var cnt = 0;
            var tempCnt = "";

            var k = 0;
            for (var i = 0; i < Cnt_arr.length; i++) {
                tempCnt = Cnt_arr[i];

                CustCnt = ozf_FormatNumber(tempCnt);


                for (var j = k; j < treedataSource.length; j++) {
                    pid = treedataSource[j].pid;
                    if (pid == rootid) {
                        treedataSource[j].custcnt = CustCnt;
                        k = j + 1;
                        break;
                    }
                }
            }
        }
    }


    /**
    *고객수 초기화
    */
    this.ClearCustCnt = function () {
        for (var i = 1; i < treedataSource.length; i++) {
            treedataSource[i].custcnt = "";
        }
        //ctlexplorerfilter.option('dataSource', treedataSource);
        //ctlexplorerfilter.repaint();
        inst.refreshtreelist();
    }



    /**
    *xml Import
    */
    this.ImportXML = function (content) {
        var pdata = ozf_Decode(content);
        treedataSource = [];

        var MainDoc = parser.parseFromString(pdata, "text/xml");

        //필터 넣기
        var FilterRs = false;
        var Fnode = ozf_getSelectedNodes(MainDoc, "/LogicOperator");
        FilterRs = this.setFilter(Fnode, "");
    }



    /**
    *보여주기 모드로 import
    */
    this.ImportXML_View = function (selector, content) {
        ViewMode = true;
        this.HideColCustCnt = true;
        this.TreeListInit(); //TreeList 초기화
        this.ImportXML(content);
    }


    /**
    *필터 값 넣기
    */
    this.setFilter = function (nodes, UpOzid) {
        var custcnt = "";
        if (UpOzid == "") {
            UpOzid = "0";
            custcnt = "조회건수";
        }
        var newUpOzid = "";

        var rs = true;
        var sDesc = "";
        var sName = "";
        var sOzid = "";
        var sItemType = "";
        var sCondition = "";
        var sIsNot = "";
        var sType = "";
        var sValue = "";
        var sCode = "";
        var sFilterCont = "";
        var NextXml;
        var nodeName = "";
        var node;

        var DescNode;
        var FilterContNode;

        for (var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            nodeName = node.nodeName;
            if (nodeName.equals("LogicOperator")) {
                sCondition = node.getAttribute("operator");
                sIsNot = node.getAttribute("isnot");

                if (sIsNot.equals("T")) {
                    sDesc = "NOT " + sCondition;
                } else {
                    sDesc = sCondition;
                }

                sName = sCondition;
                sType = "Filter";
                sOzid = "";
                sValue = "";
                sCode = "";
                newUpOzid = this.addFilterNode(UpOzid, sDesc, sName, sOzid, sType, sCondition, sIsNot, "", sValue, sCode, "", custcnt);
                NextXml = node.childNodes;
                rs = this.setFilter(NextXml, newUpOzid);
            } else if (nodeName.equals("Condition")) {

                sCondition = node.getAttribute("operator");
                sIsNot = node.getAttribute("isnot");
                sType = node.getAttribute("Type");

                if (sType == null) {
                    sType = "1";
                }


                var Rnode = ozf_getSelectedSingleNode(node, "/Editor/RefItem");
                sItemType = Rnode.getAttribute("itemtype");
                sName = Rnode.getAttribute("name");
                sOzid = Rnode.getAttribute("ozid");

                var Vnode = ozf_getSelectedSingleNode(node, "/Values");

                sValue = this.getItemAttr(Vnode, "Value");
                sCode = this.getItemAttr(Vnode, "Code");
                //sDesc = ozf_getSelectedSingleNode(node, "/Values/ValueItem/Desc").textContent;
                //sFilterCont = ozf_getSelectedSingleNode(node, "/FilterCont").textContent;

                DescNode = ozf_getSelectedSingleNode(node, "/Desc");
                FilterContNode = ozf_getSelectedSingleNode(node, "/FilterCont");

                if (DescNode != null) {
                    sDesc = DescNode.textContent;
                } else {
                    DescNode = ozf_getSelectedSingleNode(node, "/Values/ValueItem/Desc");
                    if (DescNode != null) {
                        sDesc = DescNode.textContent;
                    } else {
                        var tempcondition = "";
                        if (sIsNot.equals("T")) {
                            tempcondition = "NOT " + sCondition;
                        } else {
                            tempcondition = sCondition;
                        }
                        sDesc = "[" + sName + "] " + tempcondition + " " + sValue;
                    }
                    
                }

                if (FilterContNode != null) {
                    sFilterCont = FilterContNode.textContent;
                }


                this.addFilterNode(UpOzid, sDesc, sName, sOzid, sItemType, sCondition, sIsNot, sType, sValue, sCode, sFilterCont, "");
            }
        }

        return rs;
    }


    /**
    * VAlue 및 Code값 가져오기
    */
    this.getItemAttr = function (xml, type) {
        var rs = "";
        var nodes = xml.getElementsByTagName("ValueItem");
        var sCode = "";
        var sValue = "";

        var tempNode;
        var tempCNode;
        var tempVNode;

        var valuetype = "";

        for (var i = 0; i < nodes.length; i++) {
            tempNode = nodes[i];
            tempCNode = ozf_getSelectedSingleNode(tempNode, "/Code");
            tempVNode = ozf_getSelectedSingleNode(tempNode, "/Value");

            valuetype = tempNode.getAttribute('valuetype');


            if (sCode == "") {
                if ((valuetype != null) && (!valuetype.equals("")) && (valuetype.equals("sql"))) {
                    if (tempCNode != null) {
                        sCode = tempCNode.textContent;
                    }
                    if (tempVNode != null) {
                        sValue = tempVNode.textContent;
                    }
                } else {
                    if (tempCNode != null) {
                        sCode = tempCNode.textContent.replace("'", "");
                    }
                    if (tempVNode != null) {
                        sValue = tempVNode.textContent.replace("'", "");
                    }
                }
                
            } else {
                if (valuetype.equals("sql")) {
                    if (tempCNode != null) {
                        sCode += ";" + tempCNode.textContent;
                    }
                    if (tempVNode != null) {
                        sValue += ";" + tempVNode.textContent;
                    }
                } else {
                    if (tempCNode != null) {
                        sCode += ";" + tempCNode.textContent.replace("'", "");
                    }
                    if (tempVNode != null) {
                        sValue += ";" + tempVNode.textContent.replace("'", "");
                    }
                }
                
            }
        }

        if (type.equals("Value")) {
            rs = sValue;
        } else if (type.equals("Code")) {
            rs = sCode;
        }
        return rs;
    }


    /**
    *저장용 XML 가져오기
    */
    this.ExportXml = function () {
        var xml = "";
        xml = this.FilterXml(0);
        var pdata = ozf_Encode(xml);
        return pdata;
    }


    /**
    *필터 xml만들기     ***********************
    */
    this.FilterXml = function (row) {
        var xml = "";
        var sDesc = "";
        var sName = "";
        var sOzid = "";
        var sItemType = "";
        var sCondition = "";
        var sIsNot = "";
        var sType = "";
        var sValue = "";
        var sCode = "";
        var sFilterCont = "";
        var sid = "";
        var sValueType = "";

        sid = treedataSource[row].id;
        sDesc = treedataSource[row].desc;
        sName = treedataSource[row].name;
        sOzid = treedataSource[row].ozid;
        spid = treedataSource[row].pid;
        sItemType = treedataSource[row].itemtype;
        sCondition = treedataSource[row].condition;

        switch (sCondition) {
            case ">":
                sCondition = "&gt;";
                break;
            case "<":
                sCondition = "&lt;";
                break;
            case "<>":
                sCondition = "&lt;&gt;";
                break;
            case "<=":
                sCondition = "&lt;=";
                break;
            case ">=":
                sCondition = "&gt;=";
                break;
        }

        sIsNot = treedataSource[row].isnot;
        sType = treedataSource[row].type;
        sValue = treedataSource[row].value;
        sValue = sValue.replace("&", "&amp;");
        sCode = treedataSource[row].code;
        sCode = sCode.replace(">", "&gt;").replace("<", "&lt;")
        sFilterCont = treedataSource[row].cont;
        
        if (sType.equals("2")) {
            sValueType = "sql";
        } else if (sType.equals("2_INV")) {
            sValueType = "sql"
        } else if (sType.equals("5")) {
            sValueType = "sql"
        } else {
            sValueType = "codevalue"
        }
        
        if (sItemType.equals("Filter")) {
            var SubXml = "";
            var temppid = "";
            for (var i = 0; i < treedataSource.length; i++) {
                temppid = treedataSource[i].pid;
                if (temppid == sid) {
                    SubXml += this.FilterXml(i);
                }
            }
            var LogicOperatorXml = "<LogicOperator isnot='" + sIsNot + "' operator='" + sCondition + "'>" + SubXml + "</LogicOperator>";
            xml += LogicOperatorXml;
        } else {
            var ConditionXml = "";
            var valuexml = this.makeValue(sCondition, sValue, sCode, sValueType);

            ConditionXml += "<Condition isnot = '" + sIsNot + "' operator='" + sCondition + "' Type = '" + sType + "'>";
            ConditionXml += "   <Editor>";
            ConditionXml += "      <RefItem name='" + sName + "' ozid='" + sOzid + "' itemtype='" + sItemType + "' />";
            ConditionXml += "   </Editor>";
            ConditionXml += valuexml;
            ConditionXml += "   <Desc><![CDATA[" + sDesc + "]]></Desc>";
            ConditionXml += "   <FilterCont>";
            ConditionXml += "       <![CDATA[" + sFilterCont + "]]>";
            ConditionXml += "   </FilterCont>";
            ConditionXml += "</Condition>";
            xml += ConditionXml;
        }
        return xml;
    }


    /*
    *필터 조건 변경
    */
    this.ConditionModi = function (row, vcont) {
        var cont = vcont;  //현재 oper
        if (OperationsList.length > 0) {   //만약 사용할수있는 연산이 제한되어있다면
            var nextoper = "";
            var oper = "";

            for (var i = 0; i < OperationsList.length; i++) {
                if (cont == OperationsList[i].Oper) {
                    nextoper = OperationsList[i].NextOper;
                    break;
                }
            }

            var NotExist = false;
            NotExist = nextoper.includes("NOT");  //다음 Oper에서 Not이 존재하는지

            var vNotExist = "";
            var vOper = "";

            if (NotExist === true) {   //Not이 있다면
                vNotExist = "T";
                vOper = nextoper.replace("NOT", "").trim();
            } else {
                vNotExist = "F";
                vOper = nextoper.trim();
            }
            treedataSource[row].desc = nextoper;
            treedataSource[row].name = nextoper;
            treedataSource[row].condition = vOper;
            treedataSource[row].isnot = vNotExist;
        } else {  //제한이 없다면
            switch (cont) {
                case "AND":
                    treedataSource[row].desc = "NOT AND";
                    treedataSource[row].name = "NOT AND";
                    treedataSource[row].condition = "AND";
                    treedataSource[row].isnot = "T";
                    break;
                case "NOT AND":
                    treedataSource[row].desc = "OR";
                    treedataSource[row].name = "OR";
                    treedataSource[row].condition = "OR";
                    treedataSource[row].isnot = "F";
                    break;
                case "OR":
                    treedataSource[row].desc = "NOT OR";
                    treedataSource[row].name = "NOT OR";
                    treedataSource[row].condition = "OR";
                    treedataSource[row].isnot = "T";
                    break;
                case "NOT OR":
                    treedataSource[row].desc = "AND";
                    treedataSource[row].name = "AND";
                    treedataSource[row].condition = "AND";
                    treedataSource[row].isnot = "F";
                    break;
            }
        }
        inst.refreshtreelist();
    }

    /**
    * ozid로 항목 찾기
    * Return 으로 몇개인지 돌아옴
    **/
    this.FindItemOzid = function (ozid) {
        var cnt = 0;
        var temp = "";
        for (var i = 0; i < treedataSource.length; i++) {
            temp = treedataSource[i].ozid;
            if (temp.equals(ozid)) {
                cnt++;
            }
        }
        return cnt;
    }



    /**
    *TreeList refresh
    */
    this.refreshtreelist = function () {
        ctlexplorerfilter.option('dataSource', treedataSource);
        //ctlexplorerfilter.option('expandedRowKeys', [1]);
        ctlexplorerfilter.repaint();
    }


    /**
    * Explorer에서 사용하는 Item Count  화면에 보이는 Item의 Count
    * 중복되어서 Count될 수 있음
    */
    Object.defineProperty(this, 'UseItemCnt', {
        get: function () {
            var cnt = 0;
            var type = "";

            for (var i = 0; i < treedataSource.length; i++) {
                type = treedataSource[i].type;
                if (!type.equals("Filter")) {
                    cnt++;
                }
            }
            return cnt;
        }
    });


    /*
    *Inv 필터 그리드 초기화
    */
    this.setInvFilterGrid = function (rootid) {
        $('#TreeListTable_inv').remove();  //기본정보 삭제

        var TreeListTable_inv = "";
        TreeListTable_inv += "<table class ='InvTable' id='TreeListTable_inv' > ";
        TreeListTable_inv += "</table>                                     ";

        $(rootid).append(TreeListTable_inv);


    }


    /*
    *Inv 초기화
    */
    this.Initialize_inv = function () {
        var rootid = '#' + vid;
        $(rootid).css("background-color", "white");  //background color이있을경우 white로 변경하기 위해서
        $(rootid).css("border", "1px solid #ddd");  //테두리
        this.setInvFilterGrid(rootid);  //그리드 초기화
    }



    /*
    *인벤토리 모드 import
    */
    this.ImportXML_Inv = function (selector, content) {
        var rootid = '#' + vid;

        $(rootid).css("background-color", "white");  //background color이있을경우 white로 변경하기 위해서
        $(rootid).css("border", "1px solid #ddd");  //테두리

        this.setInvFilterGrid(rootid);   //그리드 초기화
        var pdata = ozf_Decode(content);

        var xDoc = parser.parseFromString(pdata, "text/xml");
        //필터 넣기
        var FilterRs = false;
        var Fnodes = xDoc.getElementsByTagName("LogicOperator");
        FilterRs = this.setInvFilter(Fnodes);

        //클릭이벤트

        $("div[id^='Modi_']").each(function () {
            $(this).click(function () {
                //alert(this.id);
                inst.itemClick_inv(this);
            });
        });
    }

    /**
    *클릭 이벤트_INV
    */
    this.itemClick_inv = function (e) {
        if (ViewMode === false) {  //view Mode 가 아닐경우에 이벤트 발생하도록

            var id = e.id;
            var Modirow = id.replace("Modi_", "");
            var row = parseInt(Modirow) + 1;

            var invtable = $("tr[id^='TreeListtr_inv_']");
            vdata = invtable[row]

            var cont = "";
            cont = vdata.children[11].innerText;

            if (cont == "") {
                cont = this.MakeChoiceCont_inv(row);
            } else {
                cont = this.ConvertCont(cont);
            }

            vChoiceRow = row;
            vChoiceType = vdata.children[8].innerText;
            vChoiceOzid = vdata.children[4].innerText;
            vChoiceCondition = vdata.children[6].innerText;
            vChoiceIsnot = vdata.children[7].innerText;
            vChoiceValue = vdata.children[9].innerText;
            vChoiceCode = vdata.children[10].innerText;
            vChoiceCont = cont
            
            var itemType = vdata.children[5].innerText;
            var itemDesc = vdata.children[2].innerText;

            inst.ChoiceFilterFnc();  //이벤트 발생
        }
    }

    /**
    *v5의 XML 일경우 Cont가 없으므로 Cont 생성
    */
    this.MakeChoiceCont = function (row) {
        var cont = "";
        cont = this.FilterXml(row);
        return cont;
    }


    /**
    *v5의 XML 일경우 Cont가 없으므로 Cont 생성_inv
    */
    this.MakeChoiceCont_inv = function (row) {
        var cont = "";
        cont = this.InvFilterXml(row);
        return cont;
    }


    /**
    *FilterCont xml으로 인식해본후 안되면 Decode 시켜주기
    */
    this.ConvertCont = function (cont) {
        var isxml = true;
        cont = cont.trim();
        if (cont.indexOf("PEN") == 0) {
            isxml = false;
        }

        //try {
        //    var xDoc = parser.parseFromString(cont, "text/xml");
        //} catch (err) {
        //    isxml = false;
        //}

        if (isxml === false) {  //만약 넘어온 Cont가 xml이 아니라 encode된 String일경우 Decode
            cont = ozf_Decode(cont);
        }
        return cont;
    }


    /*
    *INV 필터값 넣기
    */
    this.setInvFilter = function (nodes) {
        var rs = true;
        var sDesc = "";
        var sName = "";
        var sOzid = "";
        var sItemType = "";
        var sCondition = "";
        var sIsNot = "";
        var sType = "";
        var sValue = "";
        var sCode = "";
        var sFilterCont = "";
        var sChecked = "";

        var NextXml;

        try {
            var nodeName = "";
            for (var i = 0; i < nodes.length; i++) {
                nodeName = nodes[i].nodeName;
                if (nodeName == "LogicOperator") {

                    sCondition = nodes[i].getAttribute('operator');
                    sIsNot = nodes[i].getAttribute('isnot');

                    if (sIsNot == "T") {
                        sDesc = "NOT " + sCondition;
                    } else {
                        sDesc = sCondition;
                    }

                    sName = sCondition;
                    sType = "Filter";
                    sOzid = "";
                    sValue = "";
                    sCode = "";

                    rs = this.addInvFilterNode(sDesc, sName, sOzid, sType, sCondition, sIsNot, "", sValue, sCode, "", sChecked, i);
                    NextXml = nodes[i].childNodes;
                    rs = this.setInvFilter(NextXml);
                } else if (nodeName == "Condition") {
                    sCondition = nodes[i].getAttribute('operator');
                    sCondition = sCondition.toUpperCase();
                    sIsNot = nodes[i].getAttribute('isnot');
                    sType = nodes[i].getAttribute('Type');

                    var vAttribute = "Checked";
                    var HasAttribute = nodes[i].hasAttribute(vAttribute);
                    if (HasAttribute === true) {
                        sChecked = nodes[i].getAttribute(vAttribute);
                    } else {
                        sChecked = "F";
                    }

                    var tempnode = ozf_getSelectedSingleNode(nodes[i], "/Editor/RefItem");
                    sItemType = tempnode.getAttribute('itemtype');
                    sName = tempnode.getAttribute('name');
                    sOzid = tempnode.getAttribute('ozid');

                    tempnode = ozf_getSelectedSingleNode(nodes[i], "/Values");
                    sValue = this.getItemAttr(tempnode, "Value");
                    sCode = this.getItemAttr(tempnode, "Code");

                    tempnode = ozf_getSelectedSingleNode(nodes[i], "/Values/ValueItem/Desc");

                    if (tempnode == null) {
                        tempnode = ozf_getSelectedSingleNode(nodes[i], "/Desc");
                    }
                    sDesc = tempnode.textContent;

                    tempnode = ozf_getSelectedSingleNode(nodes[i], "/FilterCont");
                    sFilterCont = tempnode.textContent;

                    rs = this.addInvFilterNode(sDesc, sName, sOzid, sItemType, sCondition, sIsNot, sType, sValue, sCode, sFilterCont, sChecked, i);
                }
            }

        } catch (err) {

        }

    }

    /*
    *필터 트리에 값 넣기  (html에서는 고민고민)
    */
    this.addInvFilterNode = function (Desc, Name, ozid, ItemType, Condition, vIsNot, type, Value, Code, FilterCont, Checked, seq) {
        //this.addFilterNode_Inv("", Desc, Name, ozid, ItemType, Condition, vIsNot, type, Value, Code, FilterCont, "");   

        var classitem = "";
        if (ItemType.equals("Filter")) {
            classitem = "filteritemimg"
        } else if (ItemType.equals("Dimension")) {
            classitem = "dimensionitemimg"
        } else if (ItemType.equals("Fact")) {
            classitem = "factitemimg"
        } else if (ItemType.equals("Measure")) {
            classitem = "measureitemimg"
        } else if (ItemType.equals("ItemFilter")) {
            classitem = "itemfilterimg"
        } else if (ItemType.equals("CustomDimension")) {
            classitem = "customdimensionitemimg"
        }
        
        var temptr = "";
        var vid = "TreeListtr_inv_" + seq;
        var vcheckid = "TreeCheck_" + seq;
        var vModiid = "Modi_" + seq;
        var trclass = "invtr";
        if (ItemType.equals("Filter")) {
            trclass = "invhiddentr";
        }

        temptr += "<tr class='" + trclass + "' id='" + vid + "'>";
        temptr += "   <td class='Invtd'><input id='" + vcheckid + "' type='checkbox' /></td>";
        temptr += "   <td class='Invtd'><div class='" + classitem + "'></td>";
        temptr += "   <td class='Invtd_desc'><div>" + Desc + "</div></td>";     //2

        temptr += "   <td class='Invtd_Name'><div>" + Name + "</div></td>";     //3
        temptr += "   <td class='Invtd_ozid'><div>" + ozid + "</div></td>";     //4
        temptr += "   <td class='Invtd_ItemType'><div>" + ItemType + "</div></td>";   //5
        temptr += "   <td class='Invtd_Condition'><div>" + Condition + "</div></td>";   //6
        temptr += "   <td class='Invtd_vIsNot'><div>" + vIsNot + "</div></td>";   //7
        temptr += "   <td class='Invtd_type'><div>" + type + "</div></td>";   //8
        temptr += "   <td class='Invtd_Value'><div>" + Value + "</div></td>";  //9
        temptr += "   <td class='Invtd_Code'><div>" + Code + "</div></td>";   //10
        temptr += "   <td class='Invtd_FilterCont'><div>" + FilterCont + "</div></td>";  //11

        temptr += "   <td class='Invtd'><div class='modiitemimg' id ='" + vModiid + "'></td>";
        temptr += "</tr>";

        $('#TreeListTable_inv').append(temptr);
    }



    /**
    * 저장용 InvXML 가져오기
    */
    this.ExportInvXML = function () {
        var xml = "";
        xml = this.InvFilterXml(0);
        var pdata = "";
        pdata = ozf_Encode(xml);
        return pdata;
    }


    /**
    * 필터 xml 만들기
    */
    this.InvFilterXml = function (row) {
        var xml = "";
        var sCheck = "";
        var sDesc = "";
        var sName = "";
        var sOzid = "";
        var sItemType = "";
        var sCondition = "";
        var sIsNot = "";
        var sType = "";
        var sValue = "";
        var sCode = "";
        var sFilterCont = "";

        var invtable = $("tr[id^='TreeListtr_inv_']");

        var vdata;
        if (invtable.length > 0) {
            vdata = invtable[row];

            var tempCheck = vdata.children[0].children[0].checked;

            if (tempCheck === true) {
                sCheck = "T";
            } else if (tempCheck === false) {
                sCheck = "F";
            }

            sDesc = vdata.children[2].innerText;
            sName = vdata.children[3].innerText;
            sOzid = vdata.children[4].innerText;
            sItemType = vdata.children[5].innerText;
            sCondition = vdata.children[6].innerText;

            switch (sCondition) {
                case ">":
                    sCondition = "&gt;";
                    break;
                case "<":
                    sCondition = "&lt;";
                    break;
                case "<>":
                    sCondition = "&lt;&gt;";
                    break;
                case "<=":
                    sCondition = "&lt;=";
                    break;
                case ">=":
                    sCondition = "&gt;=";
                    break;
            }

            sIsNot = vdata.children[7].innerText;
            sType = vdata.children[8].innerText;
            sValue = vdata.children[9].innerText;
            sValue = sValue.replace("&", "&amp;");
            sCode = vdata.children[10].innerText;
            sCode = sCode.replace(">", "&gt;").replace("<", "&lt;")
            sFilterCont = vdata.children[11].innerText;

            if (sItemType.equals("Filter")) {

                var SubXml = "";

                //TreeListTable_inv
                var invtable = $("tr[id^='TreeListtr_inv_']");

                for (var i = 1; i < invtable.length; i++) {
                    SubXml += this.InvFilterXml(i);
                }
                var LogicOperatorXml = "<LogicOperator isnot='" + sIsNot + "' operator='" + sCondition + "'>" + SubXml + "</LogicOperator>"
                xml += LogicOperatorXml;
            } else {

                var ConditionXml = "";
                ConditionXml += "<Condition isnot = '" + sIsNot + "' operator='" + sCondition + "' Type = '" + sType + "' Checked = '" + sCheck + "'>";
                ConditionXml += "   <Editor>";
                ConditionXml += "      <RefItem name='" + sName + "' ozid='" + sOzid + "' itemtype='" + sItemType + "' />";
                ConditionXml += "   </Editor>";
                ConditionXml += "   <Values>";
                ConditionXml += "      <ValueItem>";
                ConditionXml += "         <Code>" + sCode + "</Code>";
                ConditionXml += "         <Value>" + sValue + "</Value>";
                ConditionXml += "         <Desc><![CDATA[" + sDesc + "]]></Desc>";
                ConditionXml += "      </ValueItem>";
                ConditionXml += "   </Values>";
                ConditionXml += "   <FilterCont>";
                ConditionXml += "       <![CDATA[" + sFilterCont + "]]>";
                ConditionXml += "   </FilterCont>";
                ConditionXml += "</Condition>";

                xml += ConditionXml;
            }
        }
        

        return xml;
    }


    /**
    *필터 추가 NewFilter Inv
    */
    this.AddFilter_NewFilter_Inv = function (Cont, Row) {
        var rs = true;
        var Type = "";
        try {
            var FilterDoc = parser.parseFromString(Cont, "text/xml");

            var CNodeList = FilterDoc.getElementsByTagName("Condition");
            var ValueType = "";

            for (var i = 0; i < CNodeList.length; i++) {
                Type = "4";    //값입력
                this.AddItem_Explorer_Inv(CNodeList[i], Row, Type);
            }
        } catch (err) {
            rs = false;
        }
        return rs;
    }



    /**
    *Explorer INV 방식 필터 넣기
    */
    this.AddItem_Explorer_Inv = function (Node, row, type) {
        var name = "";
        var ozid = "";
        var itemtype = "";
        var voperator = "";
        var visnot = "";
        var NotString = "";
        var iscustom = "";
        var value = "";
        var code = "";
        var desc = "";
        var FilterCont = "";
        var rs = true;
        var Filterozid = "";

        try {
            var vXml = new XMLSerializer().serializeToString(Node);
            FilterCont = vXml;
            iscustom = Node.getAttribute('iscustom');
            voperator = Node.getAttribute('operator');
            voperator = voperator.toUpperCase();

            visnot = Node.getAttribute('isnot');

            if (visnot.equals("T")) {
                NotString = "NOT ";
            } else {
                NotString = "";
            }

            var rNode = Node.getElementsByTagName('RefItem');

            ozid = rNode[0].getAttribute('ozid');
            name = rNode[0].getAttribute('name');
            itemtype = rNode[0].getAttribute('itemtype');

            var vNodes = Node.getElementsByTagName('ValueItem');
            var vNode;
            var cNode;


            for (var i = 0; i < vNodes.length; i++) {
                vnode = vNodes[i].getElementsByTagName('Value');
                cNode = vNodes[i].getElementsByTagName('Code');

                if (value == "") {
                    value = vnode[0].textContent.trim();
                    code = cNode[0].textContent.trim();
                } else {
                    value += ";" + vnode[0].textContent.trim();
                    code += ";" + cNode[0].textContent;
                }
            }


            if (voperator.equals("BETWEEN")) {
                var value_arr = [];
                value_arr = value.split(";");

                desc = "[" + name + "] " + NotString + voperator + " " + value_arr[0] + " AND " + value_arr[1];

            } else if (voperator.equals("IN")) {
                desc = "[" + name + "] " + NotString + voperator + " " + value.replace(";", ",");
            } else {
                desc = "[" + name + "] " + NotString + voperator + " " + value;
            }
            
            FilterCont = ozf_Encode(FilterCont);
            this.MoidFilterNode_Inv(row, desc, value, code, FilterCont, voperator, visnot);
        } catch (err) {

        }
    }

    /**
    *Inv 필터값 수정
    */
    this.MoidFilterNode_Inv = function (row, desc, value, code, FilterCont, voperator, visnot) {
        var rs = true;
        var invtable = $("tr[id^='TreeListtr_inv_']");
        var vdata;
        vdata = invtable[row];
        vdata.children[2].innerText = desc;
        vdata.children[9].innerText = value;
        vdata.children[10].innerText = code;
        vdata.children[11].innerText = FilterCont;
        vdata.children[6].innerText = voperator;
        vdata.children[7].innerText = visnot;
        return rs;
    }


    /**
    *선택한 조건 가져오기
    */
    this.GetUseFilterItems = function () {
        var items = "";
        var ozid = "";
        var oper = "";
        var visnot = "";
        var value = "";
        var code = "";
        var type = "";

        try {
            //TreeListTable_inv
            var invtable = $("tr[id^='TreeListtr_inv_']");
            var vdata;
            for (var i = 0; i < invtable.length; i++) {
                vdata = invtable[i];
                var tempCheck = vdata.children[0].children[0].checked;
                if (tempCheck === true) {
                    ozid = vdata.children[4].innerText;
                    oper = vdata.children[6].innerText;
                    visnot = vdata.children[7].innerText;
                    value = vdata.children[9].innerText;
                    code = vdata.children[10].innerText;
                    type = vdata.children[8].innerText;

                    if (oper.equals("BETWEEN")) {
                        value = value.replace(";", ",");
                        code = code.replace(";", ",");
                    }

                    if (items == "") {
                        items = ozid + ";" + oper + ";" + visnot + ";" + value + ";" + code + ";" + type;
                    } else {
                        items += "!@#" + ozid + ";" + oper + ";" + visnot + ";" + value + ";" + code + ";" + type;
                    }
                } 
            }
        }
        catch (err) {

        }
        return items;
    }
}


/**
* 클릭시 이벤트 발생
*/
if (!ozexplorerfilter.prototype.addEventListener) {
    ozexplorerfilter.prototype.addEventListener = function (e, f) {
        if (e === "choicefilter") {
            this.ChoiceFilterFnc = f;
        }
    }
}

if (!ozexplorerfilter.prototype.setVisible) {
    ozexplorerfilter.prototype.setVisible = function (val) {
        var vis = val ? "inline-block" : "none";
        //$('#TreeListtr').css("display", vis)
        $(this.id).css("display", vis)
    }
}

if (!ozexplorerfilter.prototype.getVisible) {
    ozexplorerfilter.prototype.getVisible = function () {
        //var vis = ($('#TreeListtr').css("display") == "none") ? false : true;
        var vis = ($(this.id).css("display") == "none") ? false : true;
        return vis;
    }
}

if (!ozexplorerfilter.prototype.setEnabled) {
    ozexplorerfilter.prototype.setEnabled = function (val) {
        
    }
}
