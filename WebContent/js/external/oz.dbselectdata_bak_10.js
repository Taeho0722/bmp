function ozgetmetadata() {
    var parser = new DOMParser();  //parser

    /**
     * Report 정보 알아오기
     * @param {any} item
     */
    this.GetReportInfo = function (item) {
        var vpurpose = "ServerHelper";
        var vaddress = "<List><Item address='" + item + "'/></List>";
        var voption = "<List><Item option='translate'/></List>";
        var xml = ozf_GetMetaData(vpurpose, vaddress, voption);
        return xml;
    }


    /**
    *address를 가지고서 항목 조회하기
    */
    this.GetItem_address = function (itemAddress) {
        var sList = "";
        sList = this.GetItemInfo(itemAddress);
        return sList;
    }
    /**
    *정보 읽기
    */
    this.GetItemInfo = function (address) {
        var xml = this.GetItem(address);
        return xml;
    }


    /**
    *InstanceID 만들기
    */
    this.GetInstanceID = function (ozid, pivotContent, gCubeOzid) {
        if (typeof (pivotContent) === "undefined") pivotContent = "";
        if (typeof (gCubeOzid) === "undefined") gCubeOzid = "";
        var instancdID = "";
        var meta = "";
        var merr;
        var metaXML;
        var option = "<List><Info option='standard'/></List>";

        if (!pivotContent.equals("")) {
            option = pivotContent;
        }

        option = ozf_ReplaceString(option, '"', "'");

        var vpurpose = "ReportInstance";
        var vaddress = "<List><Item address='" + ozid + "' cubeozid='" + gCubeOzid + "' reportname='Report'/></List>";

        meta = ozf_OLAPHandler(vpurpose, vaddress, option, false);
        metaXML = parser.parseFromString(meta, "text/xml");
        instancdID = metaXML.children[0].children[0].getAttribute('instanceid');
        return instancdID;
    }


    /**
    * address 를 가지고서 항목 조회하기
    */
    this.GetItem = function (itemAdd) {
        var sList = "";
        var spurpose = "Content";
        var address = "<List><Item address='" + itemAdd + "'/></List>";
        var sOption = "<List><Info option='all'/></List>";
        sList = ozf_GetMetaData(spurpose, address, sOption);
        return sList;
    }


    /**
    *ozid로 해당 ITEM 조회 정보 알아오기
    */
    this.GetOzidInfo = function (ozid, FindName) {
        var xml = this.GetItem(ozid);
        var rs = "";
        var metaXML;
        metaXML = parser.parseFromString(xml, "text/xml");
        rs = metaXML.children[0].children[0].getAttribute(FindName);
        return rs;
    }



    /**
     * 리포트 Cont 조회
     * @param {any} addr
     */
    this.GetReportCont = function (vaddress) {
        var vpurpose = "Content";
        var voption = "<List><Info option='standard' address='show'/></List>";
        var xml = ozf_GetMetaData(vpurpose, vaddress, voption);
        return xml;
    }



    /**
    *ozid의 xml 가져오기
    */
    this.GetItemXML = function (item) {
        var vpurpose = "TableContent";
        var vaddress = "<List><Item address='" + item + "'/></List>";
        var voption = "<List><Tables option='standard'/></List>";
        var xml = ozf_GetMetaData(vpurpose, vaddress, voption);
        return xml;
    }



    /**
    *Dummyozid 만들기
    */
    this.GetDummyOzid = function () {
        var e_Purpose = "ServerHelper";
        var e_Address = "<List><Item address=''/></List>";
        var e_Option = "<List><Item option='dummyozid'/></List>";
        var xml = ozf_GetMetaData(e_Purpose, e_Address, e_Option);

        var MainDoc = parser.parseFromString(xml, "text/xml");
        var node = ozf_getSelectedSingleNode(MainDoc, "/List/Item");

        var Dummyozid = node.getAttribute("ozid");
        return Dummyozid;
    }



    /**
    *SQL가져오기
    */
    this.getsql = function (xml, ozid, RankExist) {
        if (typeof (RankExist) === "undefined") RankExist = false;
        var sql = "";

        var Purpose = "";
        var address = "";
        var soption = "";
        var meta = "";
        var metaXML = "";
        var instanceID = this.GetInstanceID(ozid, xml);


        Purpose = "ReportContent";
        address = "<List><Item address='" + ozid + "' instanceid='" + instanceID + "'/></List>";
        
        if (RankExist === false) {//기본적으로 Rank가 없을경우 
            vOption = "<List><Option informationonly='T' informationorderby='F'/></List>";
        } else {
            soption = "<List><Option informationonlywithorder='T'/></List>";
        }

        meta = ozf_OLAPHandler(Purpose, address, soption, false);
       
        metaXML = parser.parseFromString(meta, "text/xml");
        var SNode = ozf_getSelectedSingleNode(metaXML, "/List/ServiceContent");
        var vdbServer = SNode.getAttribute('dbname');
        //this.DBServer = vdbServer;

        var sqlNode = ozf_getSelectedSingleNode(metaXML, "/List/ServiceContent/ExecutionItems/Sql");
        sql = sqlNode.textContent;
        
        return sql;
    }

}



function ozconverterxml() {
    var inst = this;
    var parser = new DOMParser();  //parser

    var oper_OR = false;
    var oper_Filter = "";

    /**
     * xml 변환하기
     * @param {any} xml
     */
    this.ConverterXML = function (xml) {
        var MainDoc = parser.parseFromString(xml, "text/xml");
        var node = ozf_getSelectedSingleNode(MainDoc, "/List/ListReport/Filter");

        if (node != null) {
            var CLogic = this.checkLogic(node);

            if (CLogic === false) {
                var msg = "OR연산자에서 메져와 다른항목들은 혼합되어 사용할 수 없습니다.";
                ozf_MsgBoxEx(msg, "0", "알림");
                return "";
            } else {
                oper_OR = false;
                var CLogic2 = this.checkLogic2(node);
                if (CLogic2 === false) {
                    var msg = "OR연산자에서 메져와 다른항목들은 혼합되어 사용할 수 없습니다.";
                    ozf_MsgBoxEx(msg, "0", "알림");
                    return "";
                } else {
                    var tempnode = ozf_getSelectedSingleNode(node, "/LogicOperator");
                    if (tempnode == null) {
                        return xml;
                    } else {
                        var M2node = tempnode.cloneNode(true);
                        var Mnode = ozf_getSelectedSingleNode(MainDoc, "/List/ListReport/MeasureFilter");

                        if (Mnode == null) {
                            Mnode = ozf_getSelectedSingleNode(MainDoc, "/List/ListReport").OwnerDocument.CreateElement("MeasureFilter");
                            var tempMnode = ozf_getSelectedSingleNode(MainDoc, "/List/ListReport").AppendChild(Mnode);
                        }

                        var tempnode2 = Mnode.getElementsByTagName("Condition");
                        if (tempnode2.length > 0) {
                            var msg = "기본 리포트에 메저필터가 포함되어있습니다. 기본 리포트에서 메저필터를 제거해주세요.";
                            ozf_MsgBoxEx(msg, "0", "알림");
                            return "";
                        } else {
                            Mnode.children[0].remove();
                            Mnode.appendChild(M2node);

                            this.setMFilter(Mnode);
                            this.setFilter(node);

                            //this.ConditionExist(ozf_getSelectedSingleNode(MainDoc, "/List/ListReport/MeasureFilter"), "MeasureFilter");
                            //this.ConditionExist(ozf_getSelectedSingleNode(MainDoc, "/List/ListReport/Filter"), "Filter");
                            xml = this.RemoveMeasureFilter((new XMLSerializer()).serializeToString(MainDoc));
                        }

                    }
                }
            }
        }
        return xml;
    }



    /**
    *연산자가 OR이고 값들이 혼합일경우에 False 반환
    */
    this.checkLogic = function (node) {
        var rs = true;
        if (node.innerHTML.equals("")) {
        } else {
            var LogicOperatornode = ozf_getSelectedSingleNode(node, "/LogicOperator");
            if (LogicOperatornode == null) {
                return rs;
            }
            var soperator = LogicOperatornode.getAttribute("operator");
            var nodes = ozf_getSelectedNodes(LogicOperatornode, "/Condition");
            var SameItemType = true;
            var ItemType = "";
            var MItem = 0;
            var FItem = 0;
            var DItem = 0;

            for (var i = 0; i < nodes.length; i++) {
                ItemType = ozf_getSelectedSingleNode(nodes[i], "/Editor/RefItem").getAttribute("itemtype");

                switch (ItemType.toUpperCase()) {
                    case "DIMENSION":
                        DItem++;
                        break;
                    case "FACT":
                        FItem++;
                        break;
                    case "MEASURE":
                        MItem++;
                        break;
                }
                if ((((DItem > 0) || (FItem > 0)) && (MItem > 0))) {
                    SameItemType = false;
                }
            }

            if ((soperator.equals("OR")) && (SameItemType === false)) {
                rs = false;
            } else {
                rs = this.checkLogic(LogicOperatornode);
            }
        }
        return rs;
    }


    /**
    *연산자가 OR이고 아래 항목이 혼합일경우 안되도록
    */
    this.checkLogic2 = function (node) {
        var rs = true;
        if (node.innerHTML.equals("")) {
        } else {
            var LogicOperatornode = ozf_getSelectedSingleNode(node, "/LogicOperator");
            var soper = LogicOperatornode.getAttribute("operator");
            if (soper.equals("OR")) {
                oper_OR = true;
                var Lnodes = ozf_getSelectedNodes(LogicOperatornode, "/Condition");
                if (Lnodes.length == 0) {
                    rs = true;
                } else {
                    oper_Filter = ozf_getSelectedSingleNode(Lnodes[0], "/Editor/RefItem").getAttribute("itemtype");
                }

                var nodes = ozf_getSelectedNodes(LogicOperatornode, "/LogicOperator/Condition");
                if ((nodes == null) || (nodes.length == 0)) {
                    rs = true;
                } else {
                    var tempoper = ozf_getSelectedSingleNode(Lnodes[0], "/Editor/RefItem").getAttribute("itemtype");
                    if ((oper_OR === true) && (!oper_Filter.equals("")) && (!oper_Filter.equals(tempoper))) {
                        rs = false;
                    } else {
                        rs = checkLogic2(LogicOperatornode);
                    }
                }

            }
        }
        return rs;
    }

    /**
    * MFilter에서 디멘젼또는 팩트 빼기
    */
    this.setMFilter = function (node) {
        var ItemType = "";
        var LogicOperatornodes = ozf_getSelectedNodes(node, "/LogicOperator");
        var ConditionNode;

        if (LogicOperatornodes != null) {
            for (var i = LogicOperatornodes.length - 1; i >= 0; i--) {
                if (LogicOperatornodes[i] != null) {
                    this.setMFilter(LogicOperatornodes[i]);

                    ConditionNode = ozf_getSelectedNodes(LogicOperatornodes[i], "/Condition");
                    if (ConditionNode == null) {
                        if (ozf_getSelectedNodes(LogicOperatornodes[i], "/LogicOperator") == null) {
                            node.removeChild(LogicOperatornodes[i]);

                            //LogicOperatornodes[i].remove();
                        }
                    }

                    for (var j = ConditionNode.length - 1; j >= 0; j--) {
                        ItemType = ozf_getSelectedSingleNode(ConditionNode[j], "/Editor/RefItem").getAttribute("itemtype");
                        if ((!ItemType.equals("Measure")) && (!ItemType.equals("CustomField"))) {
                            var tempnode1 = ozf_getSelectedNodes(LogicOperatornodes[i], "/LogicOperator");
                            if ((ConditionNode.length > 1) || (tempnode1 != null)) {
                                LogicOperatornodes[i].removeChild(ConditionNode[j]);
                                //ConditionNode[j].remove();
                            } else {
                                node.removeChild(ConditionNode[j].parentNode);
                                //ConditionNode[j].parentNode.remove();
                            }
                        }
                    }

                } else {
                    if (ozf_getSelectedSingleNode(node, "/Condition") == null) {
                        return "";
                    } else {
                        ItemType = ozf_getSelectedSingleNode(ozf_getSelectedSingleNode(node, "/Condition"), "/Editor/RefItem").getAttribute("itemtype");
                        if ((ItemType.equals("Measure")) && (ItemType.equals("CustomField"))) {
                            node.removeChild(ozf_getSelectedSingleNode(node, "/Condition").parentNode);
                        }
                    }
                }
            }

        }


    }

    /**
    *Filter에서 메져 삭제하기
    */
    this.setFilter = function (node) {
        var ItemType = "";
        var LogicOperatornodes = ozf_getSelectedNodes(node, "/LogicOperator");
        var ConditionNode;

        if (LogicOperatornodes != null) {
            for (var i = LogicOperatornodes.length - 1; i >= 0; i--) {
                if (LogicOperatornodes[i] != null) {
                    this.setFilter(LogicOperatornodes[i]);
                    ConditionNode = ozf_getSelectedNodes(LogicOperatornodes[i], "/Condition");

                    if (ConditionNode.length == 0) {
                        if (ozf_getSelectedNodes(LogicOperatornodes[i], "/LogicOperator") == null) {
                            if (ozf_getSelectedNodes(LogicOperatornodes[i], "/RefItem") == null) {
                                node.removeChild(LogicOperatornodes[i]);
                                // LogicOperatornodes[i].remove();
                            }
                        }
                    }

                    for (var j = ConditionNode.length - 1; j >= 0; j--) {
                        ItemType = ozf_getSelectedSingleNode(ConditionNode[j], "/Editor/RefItem").getAttribute("itemtype");
                        if ((ItemType.equals("Measure")) || (ItemType.equals("CustomField"))) {
                            if (ConditionNode.length > 1) {
                                LogicOperatornodes[i].removeChild(ConditionNode[j]);
                                //ConditionNode[j].remove();
                            } else {
                                node.removeChild(ConditionNode[j].parentNode);
                                //ConditionNode[j].parentNode.remove();
                            }
                        }
                    }
                }
            }
        }
    }

    /**
    *Condition 존재하는지 체크
    */
    this.ConditionExist = function (node, mode) {
        var rs = true;
        var LogicOperatornodes = ozf_getSelectedNodes(node, "/LogicOperator");
        if (LogicOperatornodes != null) {
            for (var i = LogicOperatornodes.length - 1; i >= 0; i--) {
                if (LogicOperatornodes[i] != null) {
                    if (this.ConditionExist(LogicOperatornodes[i], mode) == false) {
                        LogicOperatornodes[i].remove();
                    }
                }
            }
        } else {
            if (mode.equals("MeasureFilter")) {
                var RefItemNodes = ozf_getSelectedNodes(node, "/RefItem");
                if (RefItemNodes != null) {
                    for (var j = RefItemNodes.length - 1; j >= 0; j--) {
                        RefItemNodes[j].remove();
                    }
                }
                ;
                if (node.getElementsByTagName("Condition").length == 0) {
                    rs = false;
                }
            } else {
                if ((node.getElementsByTagName("Condition").length == 0) && (node.getElementsByTagName("RefItem").length == 0)) {
                    rs = false;
                }
            }
        }
    }



    /**
    * MeasureFilter가 없는데 Xml에 MeasureFilter 가있을경우 정리
    */
    this.RemoveMeasureFilter = function (xml) {
        var MainDoc = parser.parseFromString(xml, "text/xml");
        var node = ozf_getSelectedSingleNode(MainDoc, "/List/ListReport/MeasureFilter");

        if (node == null) {
            return xml;
        }
        var rs = this.FindMnode(node);
        xml = (new XMLSerializer()).serializeToString(MainDoc);
        return xml;
    }

    /**
    *node아래 Condition값이 있는지 체크
    */
    this.FindMnode = function (node) {
        var rs = false;
        var cNode;
        var NodeUseCnt = 0;
        var cNodeNm = "";
        for (var i = node.children.length - 1; i >= 0; i--) {
            cNode = node.children[i];
            cNodeNm = cNode.nodeName;
            if (cNodeNm.equals("Condition")) {
                rs = true;
                return rs;
            } else if (cNodeNm.equals("LogicOperator")) {
                rs = this.FindMnode(cNode);
                if (rs == false) {
                    node.removeChild(cNode);
                } else if (rs == true) {
                    NodeUseCnt++;
                }
            }
        }

        if (NodeUseCnt == 0) {
            if (node.children.length > 0) {
                node.children[0].remove();
            }
        } else {
            rs = true;
        }
        return rs;
    }
}