/**
 * @description : advanced filter
 */
//property
function oz_newfilter(id) {
    var id = '#' + id;
    var dimtitle = '디멘전';
    var dimaddr = '/ManageBaseServer/Marketing/CustomerAnls/디멘전';
    var facttitle = '팩트';
    var factaddr = '/ManageBaseServer/Marketing/CustomerAnls/팩트[필터]';
    var mtitle = '메져';
    var maddr = '/ManageBaseServer/Marketing/CustomerAnls/메져[템플릿]';
    var hidefolderlist;
    var allowsqlfilter = true;
    var descriptionvisible = true;
    var tabitemvisible = true;
    var treewidth = '';
    var tabfindvisible = true;
    var autoload = false;
    var tabfavoritevisible = true;
    var treevisible = true;
    var itemvaluelist = new ozf_Collection();

    //Control
    var tab1;
    var ozPanel1;
    var metatree1;
    var rditem;
    var cboper;
    var itemlabel;
    var itemimg;
    var itemexample;
    var itemdesc;
    var ozWaitIndicator;
    var listpanel;
    var inputpanel;
    var listValue1;
    var listValue2;
    var txtInput1;
    var txtInput2;

    var inputtype;
    var loadcondition = null;
    //Information
    var curitem = null;
    var displaytypes = 'dimensions;dimension;facts;fact;measures;measure';
    
    Object.defineProperty(this, 'DimesionTitle', {
        get: function () {
            return dimtitle;
        },
        set: function (val) {
            dimtitle = val;
        }
    });
    Object.defineProperty(this, 'DimensionAddr', {
        get: function () {
            return dimaddr;
        },
        set: function (val) {
            dimaddr = val;
        }
    });
    Object.defineProperty(this, 'FactTitle', {
        get: function () {
            return facttitle;
        },
        set: function (val) {
            facttitle = val;
        }
    });
    Object.defineProperty(this, 'FactAddr', {
        get: function () {
            return factaddr;
        },
        set: function (val) {
            factaddr = val;
        }
    });
    Object.defineProperty(this, 'MeasureTitle', {
        get: function () {
            return mtitle;
        },
        set: function (val) {
            mtitle = val;
        }
    });
    Object.defineProperty(this, 'MeasureAddr', {
        get: function () {
            return maddr;
        },
        set: function (val) {
            maddr = val;
        }
    });
    Object.defineProperty(this, 'HideFolderList', {
        get: function () {
            return hidefolderlist;
        },
        set: function (val) {
            hidefolderlist = val;
        }
    });
    Object.defineProperty(this, 'AllowSQLFilter', {
        get: function () {
            return allowsqlfilter;
        },
        set: function (val) {
            allowsqlfilter = val;
        }
    });
    Object.defineProperty(this, 'DescriptionVisible', {
        get: function () {
            return descriptionvisible;
        },
        set: function (val) {
            descriptionvisible = val;
        }
    });
    Object.defineProperty(this, 'TabItemVisible', {
        get: function () {
            return tabitemvisible;
        },
        set: function (val) {
            tabitemvisible = val;
        }
    });
    Object.defineProperty(this, 'TreeWidth', {
        get: function () {
            return treewidth;
        },
        set: function (val) {
            treewidth = val;
        }
    });
    Object.defineProperty(this, 'TabFindVisible', {
        get: function () {
            return tabfindvisible;
        },
        set: function (val) {
            tabfindvisible = val;
        }
    });
    Object.defineProperty(this, 'QueryFirstNodeWhenLoaded', {
        get: function () {
            return autoload;
        },
        set: function (val) {
            autoload = val;
        }
    });
    Object.defineProperty(this, 'TabFavoriteVisible', {
        get: function () {
            return tabfavoritevisible;
        },
        set: function (val) {
            tabfavoritevisible = val;
        }
    });
    Object.defineProperty(this, 'TreeVisible', {
        get: function () {
            return treevisible;
        },
        set: function (val) {
            treevisible = val;
            if (tab1 != null) {
                if (!treevisible) {
                    tab1.setVisible(false);
                    ozPanel1.setAttr('left', '0px');
                }
                else {
                    tab1.setVisible(true);
                    ozPanel1.setAttr('left', '256px');
                }
            }
        }
    });
    //todo
    Object.defineProperty(this, 'NotSearchInfo', {
        get: function () {
            return allowsqlfilter;
        },
        set: function (val) {
            allowsqlfilter = val;
        }
    });
    Object.defineProperty(this, 'NotDefineMessage', {
        get: function () {
            return allowsqlfilter;
        },
        set: function (val) {
            allowsqlfilter = val;
        }
    });
    Object.defineProperty(this, 'TabCaptionItem', {
        get: function () {
            return allowsqlfilter;
        },
        set: function (val) {
            allowsqlfilter = val;
        }
    });
    Object.defineProperty(this, 'TabCaptionSearch', {
        get: function () {
            return allowsqlfilter;
        },
        set: function (val) {
            allowsqlfilter = val;
        }
    });

    this.init = function () {        
        var htmltag;
        htmltag = "<div class='ozadvancedfiltercontainer' id='ozadvancedfiltertemplate'>";
        htmltag = htmltag + "<div id='tabctl' style='position:absolute;left:0px;width:254px;top:0px;height:100%;z-index:998; ' tabindex='2'>";
        htmltag = htmltag + "<div class='oztabs-container' id='tabctl_header' style='position:absolute;height:32px'>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "<div class='oztabs-content' id='tabctl_container' style='position:absolute;left:0px;top:32px;right:0px;bottom:0px;'>";
        htmltag = htmltag + "<div id='c_TabPage1' style='position:absolute;left:0px;top:0px;right:0px;bottom:0px'>";
        htmltag = htmltag + "<div id='divmetatree' style='position:absolute;left:0px;top:0px;right:0px;bottom:0px'>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "<div id='c_TabPage2' style='position:absolute;left:0px;top:0px;right:0px;bottom:0px;display:none'>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "<div id='c_TabPage3' style='position:absolute;left:0px;top:0px;right:0px;bottom:0px;display:none'>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "</div><!--ozTabControl1_container-->";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "<div id='ozPanel1' class='ozpanel ozadvancedfilterlist' style='position:absolute;left:256px;right:0px;top:0px;height:100%;z-index:999; ' tabindex='1'>";
        htmltag = htmltag + "<div class='div-container selected-item-container'>";
        htmltag = htmltag + "<img id='itemimg' class='ozimage' style='position:absolute;left:7px;width:16px;top:7px;height:16px;z-index:989; ' tabindex='7'>";
        htmltag = htmltag + "<label for='data' id='itemname' class='oztitle' style='position:absolute;left:26px;right:5px;top:3px;height:20px;z-index:990; ' tabindex='7'></label>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "<div class='div-container optr-container'>";
        htmltag = htmltag + "<label for='data' id='ozLabel1' class='oztitle' style='position:absolute;left:4px;width:50px;top:36px;height:22px;z-index:991; ' tabindex='0'></label>";
        htmltag = htmltag + "<div id='ozComboBox1' class='ozcombo' style='position:absolute;left:55px;right:5px;top:37px;height:26px;z-index:992; ' tabindex='6'></div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "<div class='div-container radio-container'>";
        htmltag = htmltag + "<div id='ozRadioGroup1' class='ozradio' style='position:absolute;left:5px;right:5px;top:73px;height:21px;z-index:993; ' tabindex='5'></div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "<div class='div-container'>";
        htmltag = htmltag + "<div id='panelinput' class='ozpanel' style='position:absolute;left:3px;right:3px;top:110px;bottom:85px;z-index:994; ' tabindex='4'>";
        htmltag = htmltag + "<div id='divlist'>";
        htmltag = htmltag + "<div class='list-container left'>";
        htmltag = htmltag + "<div id='divlist1' class='split'></div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "<div class='list-container right'>";
        htmltag = htmltag + "<div id='divlist2' class='split'></div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "<div id='divinput'>";
        htmltag = htmltag + "<div class='input-container left'>";
        htmltag = htmltag + "<div id='divinput1' class='split'></div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "<div class='input-container right'>";
        htmltag = htmltag + "<div id='divinput2' class='split'></div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "<div class='div-container'>";
        htmltag = htmltag + "<div id='panelexample' class='ozpanel' style='position:absolute;left:3px;right:3px;bottom:50px;height:32px;z-index:995; ' tabindex='3'>";
        htmltag = htmltag + "<div id='divexample' style='height: 80%;overflow-y:scroll;' ></div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "<div class='div-container'>";
        htmltag = htmltag + "<div id='paneldesc' class='ozpanel' style='position:absolute;left:0px;right:0px;bottom:0px;height:47px;z-index:998; ' tabindex='2'>";
        htmltag = htmltag + "<div class='div-container'>";
        htmltag = htmltag + "<label for='data' id='ozLabel2' class='oztitle' style='position:absolute;left:3px;width:68px;top:2px;height:18px;z-index:996; ' tabindex='0'></label>";
        htmltag = htmltag + "<label for='data' id='lblDesc' class='oztitle' style='position:absolute;left:13px;width:214px;top:17px;height:27px;z-index:997;color:#666;text-overflow: ellipsis;' tabindex='0'></label>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "<div class='filter-cover'>";
        htmltag = htmltag + "<label>항목을 선택하세요.</label>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "</div>";
        htmltag = htmltag + "<div id='loadpanel'></div>";
        htmltag = htmltag + "</div>";

        $(id).append(htmltag);
        load_Control();
    }

    this.Set_ItemValueList = function (itemname, captionlist, codelist, delim) {
        if (!itemvaluelist.containsKey(itemname)) {
            var item = {};
            item.ValueList = captionlist;
            item.CodeList = codelist;
            item.Delimiter = delim;
            itemvaluelist.put(itemname, item)
        }
    }

    this.Show_FavoriteList = function (list, desc, delim) {
        //todo
    }

    this.SetData = function (purpos, address, content) {
        //todo
    }

    this.Get_FilterXML = function () {
        if (!check_value()) {
            return '';
        }
        var Writer1 = new ozf_XMLWriter("", "");
        Writer1.WriteStartDocument();
        Writer1.WriteStartElement("List");
        Writer1.WriteStartElement("LogicOperator");
        Writer1.WriteAttributeString("isnot", "F");
        Writer1.WriteAttributeString("operator", "AND")
        getxml_condition(Writer1);
        Writer1.WriteEndElement(); //LogicOperator
        Writer1.WriteEndElement(); //List
        Writer1.WriteEndElement();

        var xmlinfo = Writer1.flush();
        xmlinfo = ozf_ReplaceString(xmlinfo, '"', "'");
        return xmlinfo;
    }

    function getxml_condition(Writer1) {
        var iscustom = 'F';
        var oper = cboper.getValue();
        var valuetype = 'codevalue';
        var valuea = new filter_value()
        var valueb = new filter_value()

        valuea.value = get_Value(true);
        valuea.code = get_Code(true);
        if (valuea.code === '') {
            valuea.code = valuea.value;
        }

        if (inputtype === '2') {
            iscustom = 'T'
        } else if (inputtype === '3') {
            valuetype = 'Sql';
        }
        valuea.valuetype = valuetype;

        if (is_betweenoper(oper)) {
            valueb.value = get_Value(false);
            valueb.code = get_Code(false);
            valueb.valuetype = valuetype;
            if (valueb.code === '') {
                valueb.code = valueb.value;
            }
        }

        Writer1.WriteStartElement("Condition");
        Writer1.WriteAttributeString("edittype", "Editor");
        Writer1.WriteAttributeString("iscustom", iscustom);

        var newoper = oper;
        if (is_notoper(oper)) {
            Writer1.WriteAttributeString("isnot", 'T')
            newoper = ozf_mid(newoper, 5, newoper.length - 4);
        } else {
            Writer1.WriteAttributeString("isnot", 'F')
        }
        Writer1.WriteAttributeString("operator", newoper);

        Writer1.WriteStartElement("Editor");
        Writer1.WriteStartElement("RefItem");
        Writer1.WriteAttributeString("Inneroperator", "");
        Writer1.WriteAttributeString("Leftoperator", "");
        Writer1.WriteAttributeString("Rightoperator", "");
        Writer1.WriteAttributeString("itemtype", curitem.type);
        Writer1.WriteAttributeString("name", curitem.name);
        Writer1.WriteAttributeString("ozid", curitem.ozid);
        Writer1.WriteEndElement(); //RefItem
        Writer1.WriteEndElement(); //Editor

        Writer1.WriteStartElement("Values");
        var ismulti = is_multioper(oper);
        valuea.getxml(Writer1, ismulti)
        if (is_betweenoper(oper)) {
            valuea.getxml(Writer1, ismulti)
        }
        Writer1.WriteEndElement(); //Values
        Writer1.WriteEndElement(); //Condition
    }

    function check_value() {
        if (curitem === null) {
            return false;
        }
        var oper = cboper.getValue();
        var valuea = get_Value(true);
        if (ozf_StringIsEmpty(valuea)) {
            return false;
        }
        if (is_betweenoper(oper)) {
            var valueb = get_Value(false);
            if (ozf_StringIsEmpty(valueb)) {
                return false;
            }
        }
        return true;
    }

    this.Set_FilterXML = function (xml) {
        var xmlDoc = ozf_getXMLDoc(xml);
        var xroot = xmlDoc.documentElement;
        var xitem = xroot.firstChild;
        loadcondition = new filter_condition();

        loadcondition.setxml(xitem.firstChild);
        curitem = new Object();
        curitem.ozid = loadcondition.ozid;
        curitem.type = loadcondition.type;
        curitem.name = loadcondition.name;
        curitem.img = ozf_geticonpath(loadcondition.type);

        cboper.setValueLower(loadcondition.oper);

        show_item();
        //if (loadcondition.iscustom) {
        //    if (loadcondition.valuea.valuetype = 'Sql') {
        //        rditem.setCode('3');
        //    } else {
        //        rditem.setCode('2');
        //    }
        //} else {
        //    rditem.setCode('1');
        //}
    }

    // 위젯 초기화  
    function load_Control() {
        //initialize loading panel
        ozWaitIndicator = new oz_LoadPanel('loadpanel');
        ozWaitIndicator.init('#ozadvancedfiltertemplate');

        //Tab
        tab1 = new oz_Tabs('tabctl');
        var ozTabControl1_headers;
        ozTabControl1_headers = [{
            id: 0, text: '항목', icon: 'check', content: 'ozTabControl1_container'
        }, {
            id: 1, text: '검색', icon: 'menu', content: 'ozTabControl1_container'
        }, {
            id: 2, text: '즐겨 찾기', icon: 'menu', content: 'ozTabControl1_container'
        }];
        tab1.init(ozTabControl1_headers, 0);

        tab1.ctl.option('onSelectionChanged', function (data) {
            try {
                tab_changed(data);
            }
            catch (e) {
            }
        });

        ozPanel1 = new oz_panel('ozPanel1');
        var ctlInst;

        itemlabel = new oz_label('itemname');
        itemlabel.setValue('');
        //itemlabel.height = 30;
        //itemlabel.textAlign = 16;

        itemimg = new oz_image('itemimg');

        listpanel = new oz_panel('divlist')
        listpanel.init();

        listValue1 = new oz_listbox('divlist1');
        listValue1.init();
        listValue1.delimiter = ",";
        listValue1.addEventListener('onClick', function (data) {
            listValue1_changed();
        });
        listValue2 = new oz_listbox('divlist2');
        listValue2.init();
        listValue2.delimiter = ",";
        listValue2.multiSelectmode = false;
        listValue2.addEventListener('onClick', function (data) {
            listValue2_changed();
        });

        inputpanel = new oz_panel('divinput')
        inputpanel.init();
        inputpanel.visible = false;
        txtInput1 = new oz_textarea('divinput1');
        txtInput1.init();
        txtInput1.dontbytecheck = true;
        txtInput1.addEventListener('onChanged', function (data) {
            txtinput_changed();
        });
        txtInput2 = new oz_textarea('divinput2');
        txtInput2.init();
        txtInput2.dontbytecheck = true;
        txtInput2.addEventListener('onChanged', function (data) {
            txtinput_changed();
        });

        itemdesc = new oz_label('lblDesc');
        itemdesc.textAlign = 16;

        itemexample = new oz_label('divexample');

        ctlInst = new oz_label('ozLabel2');
        ctlInst.setValue(ozf_EscapeStringExceptQuot('항목 설명'));
        ctlInst.height = 18;
        ctlInst.textAlign = 16;

        rditem = new oz_radio('ozRadioGroup1');
        rditem.init();
        rditem.FlowDirection = '0';
        rditem.addEventListener('onValueChanged', function (data) {
            radio_changed();
        });
        radio_init(true);


        if (!descriptionvisible) {
            $('#paneldesc').hide();
        }

        cboper = new oz_combo('ozComboBox1');
        cboper.init();
        cboper.userdefined = true;
        cboper.setListDelimiter(',');
        cboper.setCodeList('');
        cboper.setValueList('=,>,<,>=,<=,Like,IN,Not IN,Between,Not Between,IS');
        cboper.setValue('=');
        cboper.addEventListener('onValueChanged', function (data) {
            combo_changed();
        });

        ctlInst = new oz_label('ozLabel1');
        ctlInst.setValue(ozf_EscapeStringExceptQuot('연산자'));
        ctlInst.height = 22;
        ctlInst.textAlign = 16;

        itemimg = new oz_image('itemimg');
        itemimg.setImagePath("../image/type/dimension.png");

        metatree1 = new oz_metatreefilter();
        metatree1.DimesionTitle = dimtitle;
        metatree1.DimensionAddr = dimaddr;
        metatree1.FactTitle = facttitle;
        metatree1.FactAddr = factaddr;
        metatree1.MeasureTitle = mtitle;
        metatree1.MeasureAddr = maddr;
        metatree1.init('#divmetatree', autoload);
        metatree1.addEventListener('dblclick', metatree_dblclick);

        if (!treevisible) {
            tab1.setVisible(false);
            ozPanel1.setAttr('left', '0px');
        }
    }

    function radio_changed() {
        inputtype = rditem.getCode();
        switch (rditem.getCode()) {
            case "1":
                control_input(true);
                break;
            case '2':
                control_input(false);
                break;
            default:
                control_input(false);
        }
    }

    function combo_changed() {
        control_Oper();
        show_example();
    }

    function metatree_dblclick(e) {
        if (curitem !== null) {
            if (curitem.ozid === e.ozid) {
                return;
            }
        }
        curitem = e;
        show_item();
    }

    function radio_init(allowquery) {
        if (allowquery) {
            if (rditem.ListCount === 3) {
                return;
            }
            rditem.userdefined = true;
            rditem.setListDelimiter(',');

            if (allowsqlfilter) {
                rditem.setCodeList('1,2,3');
                rditem.setValueList('검색 ,입력 ,SQL ');
            } else {
                rditem.setCodeList('1,2');
                rditem.setValueList('검색 ,입력 ');
            }

            rditem.setCode('1');
            inputtype = '1';
        } else {
            if (rditem.ListCount === 2) {
                return;
            }
            rditem.userdefined = true;
            rditem.setListDelimiter(',');
            if (allowsqlfilter) {
                rditem.setCodeList('2,3');
                rditem.setValueList('입력 ,SQL ');
            } else {
                rditem.setCodeList('2');
                rditem.setValueList('입력 ');
            }
            rditem.setCode('2');
            inputtype = '2';
        }
    }

    function show_item() {
        hideFilterCover();
        input_clear();
        itemlabel.setValue(curitem.name);
        itemimg.setImagePath(curitem.img);
        //get description
        var addr = ozf_AddressXML(curitem.ozid);
        itemdesc.setValue(ozf_getItemDesc(addr));
        //check allowquery
        var allowquery = is_allowquery(addr);
        radio_init(allowquery);
        control_input(allowquery);
        if (allowquery) {
            get_ValueList();
        } else {
            show_conditionvalue(false);
        }
        show_example();
    }

    function input_clear() {
        listValue1.clear();
        listValue2.clear();
        txtInput1.setValue('');
        txtInput2.setValue('');
    }

    function is_allowquery(addr) {
        var ret = ozf_GetMetaData('Content', addr, "<List><Info option='standard'/></List>");
        if (!ozf_StringIsEmpty(ret)) {
            var xmlDoc = ozf_getXMLDoc(ret)
            var xResult = xmlDoc.documentElement.childNodes[0];
            var allowquery = ozf_GetAttributeValue(xResult, "allowquery");
            if (allowquery === 'T') {
                curitem.allowquery = true;
                curitem.cubeozid = ozf_GetAttributeValue(xResult, "cubeozid");
                return true;
            }
        }
        return false;
    }

    function get_ValueList() {
        showSplash("항목 조회 중...");
        if (itemvaluelist.containsKey(curitem.name)) {
            var item = itemvaluelist.get(curitem.name);
            fill_valuelist(item.ValueList, item.CodeList, item.Delimiter)
        } else {
            var addr = ozf_AddressXMLCube(curitem.ozid, curitem.cubeozid);
            ozf_OLAPHandler('ValueList', addr, "<List><Info option='standard'/></List>", false, ret_ValueList);
        }
    }

    function listValue1_changed() {
        show_example();
    }

    function listValue2_changed() {
        show_example();
    }

    function txtinput_changed() {
        show_example();
    }

    function ret_ValueList(callinist, returncontent, iserror, handler) {
        if (!iserror) {
            var parser = new oz_ValueListParser();
            parser.parse(returncontent);
            listValue1.clear();
            if (parser.ListCount > 0) {
                fill_valuelist(parser.CaptionList, parser.CodeList, parser.delimiter)
            }
        }
        hideSplash();
    }

    function fill_valuelist(captionlist, codelist, delimiter) {
        listValue1.setListDelimiter(delimiter);
        listValue1.setValueList(captionlist);
        listValue1.setCodeList(codelist);
        listValue1.refresh();
        listValue1.setListDelimiter(",");

        listValue2.setListDelimiter(delimiter);
        listValue2.setValueList(captionlist);
        listValue2.setCodeList(codelist);
        listValue2.refresh();
        listValue2.setListDelimiter(",");

				control_Oper();

        if (codelist !== null) {
            show_conditionvalue(true);
        } else {
            show_conditionvalue(false);
        }
    }

    function show_conditionvalue(iscode) {
        if (loadcondition === null) {
            return;
        }
        if (loadcondition.valuea.valuetype.toLowerCase() === 'sql') {
            inputtype = '3';
        } else if (loadcondition.iscustom) {
            inputtype = '2';
        } else {
            inputtype = '1';
        }

				rditem.setCode(inputtype);
        radio_changed();
        switch (inputtype) {
            case "1":
                if (iscode) {
                    listValue1.Code = loadcondition.valuea.code;
                } else {
                    listValue1.Value = loadcondition.valuea.value;
                }
                if (loadcondition.valueb !== null) {
                    if (iscode) {
                        listValue2.Code = loadcondition.valueb.code;
                    } else {
                        listValue2.Value = loadcondition.valueb.value;
                    }
                }
                break;
            case "2":
                txtInput1.setValue(loadcondition.valuea.value);
                if (loadcondition.valueb !== null) {
                    txtInput2.setValue(loadcondition.valueb.value);
                }
                break;
            case "3":
                txtInput1.setValue(loadcondition.valuea.value);
                if (loadcondition.valueb !== null) {
                    txtInput2.setValue(loadcondition.valueb.value);
                }
                break;
        }        
        loadcondition = null;
    }

    function control_Oper() {
        switch (cboper.getValue().toLowerCase()) {
            case "in":
            case "not in":
                //control_input(true);
                listValue1.multiSelectmode = true;
                splitLayout(false);
                break;
            case "is":
                //control_input(false);
                splitLayout(false);
                break;
            case "between":
            case "not between":
                listValue1.multiSelectmode = false;
                splitLayout(true);
                break;
            default:
                //control_input(true);
                listValue1.multiSelectmode = false;
                splitLayout(false);
                break;
        }
    }

    function show_example() {
        var oper = cboper.getValue();
        var val1 = get_Value(true);
        var exp;
        switch (oper.toLowerCase()) {
            case "between":
            case "not between":
                var val2 = get_Value(false);
                exp = "{0} {1} ({2} And {3})".format(itemlabel.getValue(), oper, val1, val2);
                break;
            default:
                exp = "{0} {1} ({2})".format(itemlabel.getValue(), oper, val1);
        }
        itemexample.setValue(exp);
    }

    function get_Value(isFirst) {
        var val;
        if (inputtype === '1') {
            if (isFirst) {
                val = listValue1.Value;
            } else {
                val = listValue2.Value;
            }
        } else {
            if (isFirst) {
                val = txtInput1.getValue();
            } else {
                val = txtInput2.getValue();
            }
        }
        return val;
    }

    function get_Code(isFirst) {
        var val;
        if (curitem.allowquery) {
            if (isFirst) {
                val = listValue1.Code;
            } else {
                val = listValue2.Code;
            }
        } else {
            if (isFirst) {
                val = txtInput1.getValue();
            } else {
                val = txtInput2.getValue();
            }
        }
        return val;
    }

    function splitLayout(val) {
        if (val) {
            $(".list-container.left").css("width", "50%");
            $(".list-container.right").css("width", "50%");
            $(".list-container.right").css("display", "block");
            $(".input-container.left").css("width", "50%");
            $(".input-container.right").css("width", "50%");
            $(".input-container.right").css("display", "block");
        } else {
            $(".list-container.left").css("width", "100%");
            $(".list-container.right").css("width", "0%");
            $(".list-container.right").css("display", "none");
            $(".input-container.left").css("width", "100%");
            $(".input-container.right").css("width", "0%");
            $(".input-container.right").css("display", "none");
        }
    }

    function control_input(val) {
        //조회 금지 경우
        if (curitem.is_allowquery === false) {
            inputpanel.visible = true;
            return;
        }
        if (val) { //valuelist
            listpanel.visible = true;
            inputpanel.visible = false;
        } else {
            listpanel.visible = false;
            inputpanel.visible = true;
        }
    }

    //Tab Changed
    function tab_changed(data) {

    }

    //show load panel
    function showSplash(msg, shadow) {
        if (msg == null || msg == '' || msg == undefined) {
            msg = '조회 중 ...';
        }
        if (shadow == undefined) {
            shadow = true;
        }
        ozWaitIndicator.message(msg);
        ozWaitIndicator.ctl.option('shading', shadow);
        ozWaitIndicator.ctl.show();
    }

    //Hide Load Panel
    function hideSplash() {
        if (ozWaitIndicator !== null) {
            ozWaitIndicator.ctl.hide();
        }
    }


    function filter_condition() {
        this.isnot = false;
        this.oper;
        this.valuea;
        this.valueb;
        this.iscustom = false;
        this.ozid;
        this.name;
        this.type;

        this.init = function () {
            this.valuea = new filter_value();
            this.valueb = new filter_value();
        }

        this.setxml = function (xnode) {
            var i;
            var val;
            var code;
            this.init();
            val = ozf_GetAttributeValue(xnode, "iscustom");
            if (val.toLowerCase() === 't') { this.iscustom = true; }
            val = ozf_GetAttributeValue(xnode, "isnot");
            if (val.toLowerCase() === 't') { this.isnot = true; }
            this.oper = ozf_GetAttributeValue(xnode, "operator");
            if (this.isnot) { this.oper = "NOT " + this.oper; }
            var xref = ozf_getSelectedSingleNode(xnode, "Editor/RefItem");
            if (xref !== null) {
                this.type = ozf_GetAttributeValue(xref, "itemtype");
                this.ozid = ozf_GetAttributeValue(xref, "ozid");
                this.name = ozf_GetAttributeValue(xref, "name");
            }
            var xvalues = ozf_getSelectedSingleNode(xnode, "Values");
            if (xvalues !== null) {
                if (is_multioper(this.oper)) {
                    var xvalueitem;
                    val = '';
                    code = '';
                    this.valuea.valuetype = ozf_GetAttributeValue(xvalues.firstchild, "valuetype");
                    //this.valuea.path = ozf_GetFindElementText(xnode, "Contentfullpath");
                    //this.valuea.type = ozf_GetFindElementText(xnode, "ItemType");
                    for (i = 0; i < xvalues.childNodes.length; i++) {
                        xvalueitem = xvalues.childNodes[i];
                        val = val + ozf_GetFindCDATAText(xvalueitem, "Value");
                        val = val + ',';
                        code = code + ozf_GetFindCDATAText(xvalueitem, "Code");
                        code = code + ',';
                    }
                    this.valuea.value = val;
                    this.valuea.code = code;
                } else {
                    var xvaluea;
                    var xvalueb;
                    xvaluea = xvalues.childNodes[0];
                    this.valuea.setxml(xvaluea);
                    if (xvalues.childNodes.length > 1) {
                        xvalueb = xvalues.childNodes[1];
                        this.valueb.setxml(xvalueb);
                    }
                }
            }
        } //setxml                                    
    }

    function filter_value() {
        this.value = '';
        this.valuetype = 'codevalue';
        this.code = '';
        this.delimiter = ',';
        this.getxml = function (writer1, ismulti) {
            if (ismulti) {
                var i;
                var value = this.value.split(this.delimiter);
                if (ozf_StringIsEmpty(this.code)) {
                    for (i = 0; i < value.length; i++) {
                        writer1.WriteStartElement('ValueItem');
                        writer1.WriteAttributeString("valuetype", this.valuetype);

                        writer1.WriteStartElement('Value');
                        writer1.WriteCDATA(value[i]);
                        writer1.WriteEndElement(); //Value

                        writer1.WriteEndElement(); //ValueItem
                    }
                } else {
                    var code = this.code.split(this.delimiter);
                    if (value.length === code.length) {
                        for (i = 0; i < value.length; i++) {
                            writer1.WriteStartElement('ValueItem');
                            writer1.WriteAttributeString("valuetype", this.valuetype);

                            writer1.WriteStartElement('Value');
                            writer1.WriteCDATA(value[i]);
                            writer1.WriteEndElement(); //Value

                            writer1.WriteStartElement('Code');
                            writer1.WriteCDATA(code[i]);
                            writer1.WriteEndElement(); //Code

                            writer1.WriteEndElement(); //ValueItem
                        }
                    }
                }
            } else {
                writer1.WriteStartElement('ValueItem');
                writer1.WriteAttributeString("valuetype", this.valuetype);

                writer1.WriteStartElement('Value');
                writer1.WriteCDATA(this.value);
                writer1.WriteEndElement(); //Value

                writer1.WriteStartElement('Code');
                writer1.WriteCDATA(this.code);
                writer1.WriteEndElement(); //Code

                writer1.WriteEndElement(); //ValueItem
            }
        }
        this.setxml = function (xnode) {
            this.valuetype = ozf_GetAttributeValue(xnode, "valuetype");
            this.value = ozf_GetFindCDATAText(xnode, "Value");
            this.code = ozf_GetFindCDATAText(xnode, "Code");
        }
    }

    function is_multioper(oper) {
        switch (oper.toLowerCase()) {
            case "in":
            case "not in":
                return true
                break;
            default:
                return false;
        }
    }

    function is_betweenoper(oper) {
        switch (oper.toLowerCase()) {
            case "between":
            case "not between":
                return true
                break;
            default:
                return false;
        }
    }

    function is_notoper(oper) {
        return oper.toLowerCase().startsWith("not");
    }

    function hideFilterCover() {
        $(".filter-cover").hide();
    }
}