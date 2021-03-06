/**
 * @description
 */
function ozdbtransaction(id) {
    var vid = id; //div 태그 아이디
    var inst = this;
    this.id = '#' + id;

    //this.ChoiceFilterFnc = function (e) { } //필터 클릭하였을때 이벤트

    //var ctldbtransaction;  //dbtransaction
    //var treedataSource = [];

    //var OperationsList = [];  //연산자 List
    //var DoNotDisplayFilterList = [];  //보여지지않은필터 목록
    //var ExplorerSqlDataList = [];  //ExplorerSqlData  '//선.후행 SQl


    var PivotList = [];  //Pivot List
    var RankItemList = [];  // RankItemList

    var UseItem = []; //사용중인 ITEM

    var parser = new DOMParser();  //parser

    var newconverterxml = new ozconverterxml();
    var newgetmetadata = new ozgetmetadata();

    //Visible 여부 설정
    this.setVisible = function (val) {
        var vis = val ? "inline-block" : "none";
        $(this.id).css("display", vis);
    }

    var ReportXml = "";

    /**
    *기본 ReportXml
    */
    this.tempReportxml = function () {
        var tempxml = "";
        //tempxml += " <List>                                                         ";
        //tempxml += " 	<DDME ozid='' name='DDMEBase'>                                ";
        //tempxml += "        <ModelDataProvider> </ModelDataProvider>                    ";
        //tempxml += " 		<Report name='DBSelect' version='080918' reporttype='LIST'> ";
        //tempxml += " 			<Pivot name='DTFReport' reporttype='LIST'>                ";
        //tempxml += " 				<ListTypeItems> </ListTypeItems>                      ";
        //tempxml += " 			</Pivot>                                                  ";
        //tempxml += " 			<MeasureFilter></MeasureFilter>                           ";
        //tempxml += " 			<Filter iserror='F' maxpromptid='8'>                      ";
        //tempxml += " 			</Filter>                                                 ";
        //tempxml += " 			<ReportDefinedOLAPItems></ReportDefinedOLAPItems>         ";
        //tempxml += " 			<SelectedFields></SelectedFields>                         ";
        //tempxml += " 			<Ranks isdistinct='T'></Ranks>                            ";
        //tempxml += " 			<MadeSQL>                                                 ";
        //tempxml += " 				<![CDATA[]]>                                            ";
        //tempxml += " 			</MadeSQL>                                                ";
        //tempxml += " 		</Report>                                                   ";
        //tempxml += " 	</DDME>                                                       ";
        //tempxml += " </List>                                                        ";
        tempxml = "<List><DDME name='DDMEBase'><ModelDataProvider> </ModelDataProvider><Report name='DBSelect' version='080918' reporttype='LIST'><Pivot name='DTFReport' reporttype='LIST'><ListTypeItems> </ListTypeItems></Pivot><MeasureFilter></MeasureFilter><Filter iserror='F' maxpromptid='8'></Filter><ReportDefinedOLAPItems></ReportDefinedOLAPItems><SelectedFields></SelectedFields><Ranks isdistinct='T'></Ranks><MadeSQL><![CDATA[]]></MadeSQL></Report></DDME></List>";
        return tempxml;
    }


    /**
    *LoadServerSelector 설정
    * 사용하지 않음
    */
    var vLoadServerSelector = "";
    this.LoadServerSelector = function (val) {
        vLoadServerSelector = val;
    }

    /**
     * Mode
     */
    var vMode = "";
    Object.defineProperty(this, 'Mode', {
        get: function () {
            return vMode;
        },
        set: function (val) {
            vMode = val;
        }
    });



    /**
     * ItemRank
     */
    var vItemRank = "";
    Object.defineProperty(this, 'ItemRank', {
        get: function () {
            return vItemRank;
        },
        set: function (val) {
            vItemRank = val;
            this.setRankItem();
        }
    });


    /**
    *초기화
    */
    this.Initialize = function () {
        UseItem = [];  //초기화
        this.setcont();
        ReportXml = this.tempReportxml();  //기본XML설정
    }



    this.setcont = function () {
        var rootid = '#' + vid;
        var dbtTable = "";
        dbtTable += "<table id='dbtTable' class='dbtTable'> ";
        dbtTable += "</table>";

        $(rootid).append(dbtTable);

    }



    var vPRVD_XML = "";
    /**
    *프로바이더 XML
    */
    this.SetPRVD_XML = function (ProviderXML) {
        vPRVD_XML = ProviderXML;
    }

    /**
    * Pivot 초기화
    */
    this.PivotClear = function () {
      //  PivotList = [];
    }

    /**
    * XML가져오기
    */
    this.ExportXML = function () {
        //ReportXml = ReportXml.replace("@@ModelDataProvider@@", vPRVD_XML);
        this.setPrvdxml();  //프로바이더 설정

        ReportXml = ozf_ReplaceString(ReportXml, '"', "'");
        var pdata = ozf_Encode(ReportXml);
        return pdata;
    }


    /**
    * XML IMPORT
    */
    this.ImportXML = function (cont, PrvdID, MPXML) {
        if (typeof (PrvdID) === "undefined") PrvdID = "";
        if (typeof (MPXML) === "undefined") MPXML = "";
        
        var xml = ozf_Decode(cont);

        if (this.Mode == 4) {  //전체 import
            ReportXml = xml;
        } else if (this.Mode == 5) {  //Filter부분만 

            var MainDoc = parser.parseFromString(ReportXml, "text/xml");
            var node = ozf_getSelectedSingleNode(MainDoc, "/List/DDME/Report/Filter");

            var FilterDoc = parser.parseFromString(xml, "text/xml");
            var Fnode = ozf_getSelectedSingleNode(FilterDoc, "/DBSelect/Filter/LogicOperator");
            node.appendChild(Fnode);

            ReportXml = (new XMLSerializer()).serializeToString(MainDoc);
            //ReportXml = ReportXml.replace("@@FilterLogicOperator@@", Filterxml);
        }
    }

    /**
    *SQL 만들기
    */
    this.GetSQL = function () {
        var SQL = "";

        var itemRankUse = false;

        if (!this.ItemRank.equals("")) {
            this.setrankxml();  //Rank설정
            itemRankUse = true;
        }


        this.getpivotUseItem();
        this.getfilterUseItem();
        this.selectedField();
        
        var ozid = newgetmetadata.GetDummyOzid();


        var MainDoc = parser.parseFromString(ReportXml, "text/xml");
        var node = ozf_getSelectedSingleNode(MainDoc, "/List/DDME");
        node.setAttribute("ozid", ozid);
        ReportXml = (new XMLSerializer()).serializeToString(MainDoc);

        SQL = newgetmetadata.getsql(ReportXml, ozid, itemRankUse)
        
        return SQL;
    }



    /**
    *Pivot에서 사용하는 ITEM UseITem에 등록하기
    */
    this.getpivotUseItem = function () {
        var MainDoc = parser.parseFromString(ReportXml, "text/xml");
        var nodes = ozf_getSelectedNodes(MainDoc, "/List/DDME/Report/Pivot/ListTypeItems/RefItem");
        var itemozid = "";
        for (var i = 0; i < nodes.length; i++) {
            itemozid = nodes[i].getAttribute("ozid");
            this.UseItemAdd(itemozid);
        }
    }

    /**
    *Filter에서 사용하는 ITEM UseITem에 등록하기
    */
    this.getfilterUseItem = function () {
        var MainDoc = parser.parseFromString(ReportXml, "text/xml");
        var nodes = ozf_getSelectedNodes(MainDoc, "/List/DDME/Report/Filter/LogicOperator");
        this.getFilterUseItemSub(nodes);
    }


    /**
    *Filter에서 사용하는 ITEM 찾아서 등록
    */
    this.getFilterUseItemSub = function (nodes) {
        var nodeNm = "";
        var snodes;
        var node;
        var rnode;
        var ozid = "";
        for (var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            nodeNm = node.nodeName;
            if (nodeNm.equals("LogicOperator")) {
                snodes = node.childNodes;
                this.getFilterUseItemSub(snodes);
            } else if (nodeNm.equals("Condition")) {
                rnode = ozf_getSelectedSingleNode(node, "/Editor/RefItem");
                ozid = rnode.getAttribute("ozid");
                this.UseItemAdd(ozid);
            }
        }
    }




    /**
    *선택된 Item설정
    */
    this.selectedField = function () {
        var ozid = "";
        var xml = "";

        var itemnm = "";
        var itemalias = "";
        var itemtype = "";
        var temptype = "";
        var tableozid = "";
        var tablename = "";

        var Fxml = "";

        var MainDoc = parser.parseFromString(ReportXml, "text/xml");
        var Selectednode = ozf_getSelectedSingleNode(MainDoc, "/List/DDME/Report/SelectedFields");

        for (var i = 0; i < UseItem.length; i++) {
            ozid = UseItem[i].ozid;
            xml = newgetmetadata.GetItemXML(ozid);
            var ItemDoc = parser.parseFromString(xml, "text/xml");
            var node = ozf_getSelectedSingleNode(ItemDoc, "/List/Field");

            itemnm = node.getAttribute("name");
            itemalias = node.getAttribute("alias");
            temptype = node.getAttribute("type");
            tableozid = node.getAttribute("tableozid");
            tablename = node.getAttribute("tablename");

            if (temptype.equals("DIMENSION")) {
                itemtype = "CHAR";
            } else if (temptype.equals("FACT")) {
                itemtype = "NUMBER";
            }

            Fxml = "<Field ozid='" + ozid + "' name='" + itemnm + "' alias='" + itemalias + "' type='" + temptype + "' tablename='" + tablename + "' tableozid='" + tableozid + "' />";

            var SelectedDoc = parser.parseFromString(Fxml, "text/xml");
            var Fnode = ozf_getSelectedSingleNode(SelectedDoc, "/Field");
            Selectednode.appendChild(Fnode);
        }
        ReportXml = (new XMLSerializer()).serializeToString(MainDoc);
    }



   
    /**
    *Rank xml 설정
    */
    this.setrankxml = function () {
        var itemozid = "";
        var itemname = "";
        var itemtype = "";
        var ordernm = "";
        var ordercd = "";

        var MainDoc = parser.parseFromString(ReportXml, "text/xml");
        var Ranksnode = ozf_getSelectedSingleNode(MainDoc, "/List/DDME/Report/Ranks");

        for (var i = 0; i < RankItemList.length; i++) {
            itemozid = RankItemList[i].itemozid;
            itemname = RankItemList[i].itemname;
            itemtype = RankItemList[i].itemtype;
            ordernm = RankItemList[i].ordernm;
            ordercd = RankItemList[i].ordercd;

            var rankxml = "<RankItem itemtype='" + itemtype + "' ozid='" + itemozid + "' name='" + itemname + "' method='" + ordercd + "'> </RankItem>";

            var RankDoc = parser.parseFromString(rankxml, "text/xml");
            var node = ozf_getSelectedSingleNode(RankDoc, "/RankItem");
            Ranksnode.appendChild(node);

            this.UseItemAdd(itemozid);  //사용ITEM 넣어두기 중복되지 않게

        }
        ReportXml = (new XMLSerializer()).serializeToString(MainDoc);
    }


    /**
    * 사용ITEM 넣어두기 중복되지 않게
    */
    this.UseItemAdd = function (itemozid) {
        var dupitem = false;
        var tempitem = "";

        //UseITEM설정
        for (var i = 0; i < UseItem.length; i++) {
            tempitem = UseItem[i].ozid;

            if (itemozid.equals(tempitem)) {
                dupitem = true;
                break;
            }
        }

        if (dupitem === false) {
            this.addUseItem(itemozid);  //사용ITEM 넣어두기 중복되지 않게
        }
    }

    /**
    *프로바이더XML 넣어주기
    */
    this.setPrvdxml = function () {
        if (!vPRVD_XML.equals("")) {
            var MainDoc = parser.parseFromString(ReportXml, "text/xml");
            var Providernode = ozf_getSelectedSingleNode(MainDoc, "/List/DDME/ModelDataProvider");
            Providernode.remove();

            var node = ozf_getSelectedSingleNode(MainDoc, "/List/DDME");

            var ProvDoc = parser.parseFromString(vPRVD_XML, "text/xml");
            var pnode = ozf_getSelectedSingleNode(ProvDoc, "/ModelDataProvider");

            node.appendChild(pnode);

            ReportXml = (new XMLSerializer()).serializeToString(MainDoc);
        }
    }

    
    /**
    *Rank설정
    */
    this.setRankItem = function () {
        //5c0a0047-497687ab;본인수신3개월평잔;Fact;오름차순;ASC!@#5c0a0045-497687ab;본인수신잔액;Fact;오름차순;ASC

        RankItemList = [];
        if (!this.ItemRank.equals("")) {

            var itemozid = "";
            var itemname = "";
            var itemtype = "";
            var ordernm = "";
            var ordercd = "";
            
            var tempitem_arr = new Array();
            tempitem_arr = this.ItemRank.split("!@#");

            for (var i = 0; i < tempitem_arr.length; i++) {
                var item_arr = new Array();
                item_arr = tempitem_arr[i].split(";");

                itemozid = item_arr[0];
                itemname = item_arr[1];
                itemtype = item_arr[2];
                ordernm = item_arr[3];
                ordercd = item_arr[4];

                this.addRankItem(itemozid, itemname, itemtype, ordernm, ordercd);
            }
        }
    }



    
    /**
    *RankData
    */
    this.addRankItem = function (ozid, ItemName, ItemType, OrderNm, Ordercd) {
        //5c0a0047-497687ab;본인수신3개월평잔;Fact;오름차순;ASC
        var RankItemdata = new Object();
        RankItemdata.itemozid = ozid;
        RankItemdata.itemname = ItemName;
        RankItemdata.itemtype = ItemType;
        RankItemdata.ordernm = OrderNm;
        RankItemdata.ordercd = Ordercd;
        
        RankItemList.push(RankItemdata);
    }



    /**
    *사용중이 ITEM
    */
    this.addUseItem = function (ozid) {
        var UseItemdata = new Object();
        UseItemdata.ozid = ozid;
        UseItem.push(UseItemdata);
    }
    
}


/**
* 클릭시 이벤트 발생
*/
//if (!ozexplorerfilter.prototype.addEventListener) {
//    ozexplorerfilter.prototype.addEventListener = function (e, f) {
//        if (e === "choicefilter") {
//            this.ChoiceFilterFnc = f;
//        }
//    }
//}
