

/**
 * @description :  MetaTree
 */
function oz_metatree() {
    var metatree; //Tree
    //Nodes
    var rootnode;
        
    var mvarrootlabel = "관리";    
    var mvarrootozid ="ManageBaseServer";
    var mvarrooticon ="../../image/type/managebaseserver.png";
    var mvardisplaytypes;
    //mvarmetatree_cube.displaytypes =  "ManageBaseServer;Cube;CubeFolder;";
    //mvarmetatree_cube.displaytypes =  "Dimensions;Dimension;Facts;Fact;Measures;Measure";
    var mvaritemtypes = "";
    var mvarcubeozid ="";
    var mvarcurpath = "";
	var mvarcubelabel ="";
    var mvarselectdname = "";
    var mvarselecteditem =null;
    
    //Current Node Info
    var curnode, curnodechildren;
    var mvardblclickfn = null; //Event Listener list

	this.selectdname = function() {return mvarselectdname};
    this.cubeozid = function () { return mvarcubeozid; };
	this.cubelabel = function () { return mvarcubelabel; };    
    
    this.root = function (val) { return mvarrootozid = val; };
    this.rootlabel = function (val) { mvarrootlabel = val; };
    this.rooticon = function (val) { mvarrooticon = val; };
    this.itemtypes = function (val) { return mvaritemtypes = val; };
    this.cubelabel = function () { return mvarcubelabel; };
    this.selecteditem = function () {
        return mvarselecteditem;
    };

    //메세지 박스 타이틀
    Object.defineProperty(this, 'ActionEventfn', {
        get: function () {
            return mvardblclickfn;
        },
        set: function (val) {
            mvardblclickfn = val;
        }
    });

    //Initialize
    this.init = function (id, ozid, label, displaytypes) {
        mvarrootozid = ozid;
        mvarrootlabel = label;
        mvardisplaytypes = displaytypes;
        var source = [
            { icon: mvarrooticon, id:ozid, label: mvarrootlabel, value: mvarrootozid, expanded: true, type:'cube' }
        ];
		
		var treeH = $(window).height() - 110;
		
        $(id).jqxTree({allowDrag: false, allowDrop: false, source: source, width: '100%', height: '100%' });
                
        //Tree Event
        $(id).on("select", event_selectnode);
        $(id).jqxTree('selectItem', $(id).find('li:first')[0]);
        $(id).click(function (event) {
            var that = this;
            setTimeout(function () {
                var dblclick = parseInt($(that).data('double'), 10);
                if (dblclick > 0) {
                    $(that).data('double', dblclick - 1);
                } else {
                    //singleClick.call(that, event);
                }
            }, 300);
        }).dblclick(function (event) {
            $(this).data('double', 2);
            if (mvarselecteditem !== null) {
                raiseActionEvent(mvarselecteditem);
            }           
        });
    }
	
	this.init1 = function (id, ozid) {
        mvarrootozid = ozid;
        var source = [
            { icon: mvarrooticon, id:ozid, label: mvarcubelabel, value: mvarrootozid, expanded: true }
        ];
		
		var treeH = $(window).height() - 110;
		
        $(id).jqxTree({allowDrag: false, allowDrop: false, source: source, width: '100%', height: treeH });

        //Tree Event
        $(id).on("select", event_selectnode);
        $(id).click(function (event) {
            var that = this;
            setTimeout(function () {
                var dblclick = parseInt($(that).data('double'), 10);
                if (dblclick > 0) {
                    $(that).data('double', dblclick - 1);
                } else {
                    //singleClick.call(that, event);
                }
            }, 300);
        }).dblclick(function (event) {
            $(this).data('double', 2);
            if (mvarselecteditem !== null) {
                raiseActionEvent(mvarselecteditem); 
            }           
        });
    }
     
    //Select Node
    function event_selectnode(event) {
        metatree = event.target;
        
        var id = "#" + event.target.id;
        var args = event.args;
        curnode = $(id).jqxTree('getItem', args.element);
        mvarselecteditem = null;
        if (!curnode.hasItems) {
            var ozid = curnode.id;
            var type = curnode.value;
            
            if (type.toLowerCase() === "cube"){
                mvarcubeozid = ozid;
				mvarcubelabel = curnode.label;
            }            
            mvarselectdname = curnode.label;
            if (isfolderfromozid(ozid)) {
                get_childnode(ozid, curnode, id, mvarcubeozid);
            } else {
                mvarselecteditem = new Object();
                mvarselecteditem.ozid = curnode.id;
                mvarselecteditem.type = curnode.value;
                mvarselecteditem.name = curnode.label;
                mvarselecteditem.img = curnode.icon;
            }
        }        
    }
    
    //Get Child Items
    function get_childnode(mvarrootozid, pnode, treeid, cubeozid, cubelabel) {
        var addr = "<List><Item address='{0}'/></List>".format(mvarrootozid);
        var metahandler = new oza_MetaHandler("content", addr, "<List><Info option='all'/></List>");
        metahandler.execute(this, false);
        if (metahandler.iserror === true) {
            return;
        }
               
       var xmlDoc;
       xmlDoc = ozf_getXMLDoc(metahandler.returncontent);
		
        var xroot = xmlDoc.documentElement;
		if (xroot.childNodes.length === 0) {return;}
		
		xroot = xroot.childNodes[0]; 		
        var i, xitem;
		/**************************************************************************/
		/*  IE 버전 수정본 chrome, safari, firefox childNodes.length <> IE childNodes.length */
		/**************************************************************************/
		// if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
        if ( (navigator.appName === 'Netscape' && navigator.userAgent.search('Trident') !== -1) || (navigator.userAgent.indexOf("msie") !== -1) ) {
			if (xroot.childNodes.length > 0) {
				for (i = 1; i < xroot.childNodes.length; i=i+2) {
					xitem = xroot.childNodes[i];
					create_itemnode(xitem, pnode, treeid,cubeozid, cubelabel);
				}
				$(treeid).jqxTree('render');
				$(treeid).jqxTree('expandItem', pnode.element)
			}
		} else {
            if (xroot.childNodes.length > 0) {
                var colitem = new ozf_KeyValue();
                var  name;

				for (i = 1; i < xroot.childNodes.length; i=i+2) {
                    xitem = xroot.childNodes[i];
                    name = ozf_GetAttributeValue(xitem, "name", "");
                    colitem.add(xitem, name);					
                }
                colitem.sort();

                for (i = 0; i < colitem.length(); i ++ ) {                    
                    xitem = colitem.item(i);
                    create_itemnode(xitem.key, pnode, treeid, cubeozid, cubelabel);
                }
               
				$(treeid).jqxTree('render');
				$(treeid).jqxTree('expandItem', pnode.element)
			}
		}
    }
    
    function raiseActionEvent(e) {
        if (mvardblclickfn !== null) {
            mvardblclickfn(e);
        }        
    }
     
    //Create Node
    function create_itemnode(xitem, pnode, treeid, cubeozid, cubelabel) {
        var nid, ntext, ntype, newnodeid, iconpath;
        nid = ozf_GetAttributeValue(xitem, "ozid", "");
        ntext = ozf_GetAttributeValue(xitem, "name", "");
        ntype = ozf_GetAttributeValue(xitem, "type", "");
        
        if (! ozf_StringIsEmpty(mvardisplaytypes)) {
        	if (! mvardisplaytypes.match(ntype.toLowerCase() + ";")){
        		return;	
        	}            
        }        
        
        iconpath = get_iconpath(ntype);
        if (!ozf_StringIsEmpty(iconpath)) {
            $(treeid).jqxTree('addTo', { "id": nid, "label": ntext, "value": ntype, "icon": iconpath, "cube" : cubeozid, "cubelabel" : cubelabel}, pnode.element, false);
        }
    }

    function get_iconpath(itemtype) {
        switch (itemtype.toLowerCase()){
            case "managebaseserver":
                return "../image/type/managebaseserver.png";
            case "privatebaseserver":
                return "../image/type/privatebaseserver.png";
            case "publicbaseserver":
                return "../image/type/publicbaseserver.png";
            case "cube":
                return "../image/type/cube.png";
            case "cubefolder":
                return "../image/type/cubefolder.png";
            case "reports":
            case "analyticreports":
                return "../image/type/reports.png";
            case "report":
            case "analyticreport":
                return "../image/type/report.png";
            case "crossreport":
                return "../image/type/crossreport.png";
            case "listreport":
                return "../image/type/listreport.png";
            case "dashboard":
            	return "../image/type/dashboard.png";
            case "folder":
            	return "../image/type/folder.png";            	
            case "dimensions":
                return "../image/type/dimensions.png";
            case "dimension":
                return "../image/type/dimension.png";
            case "facts":
                return "../image/type/facts.png";
            case "fact":
                return "../image/type/fact.png";
            case "measures":
                return "../image/type/measures.png";
            case "measure":
                return "../image/type/measure.png";
            default:
                return ""
        }        
    }

    function isfolderfromozid(ozid) {
        if (ozid.startsWith("20")) {
            return true;
        }
        if (ozid.startsWith("21")) {
            return true;
        }
        if (ozid.startsWith("22")) {
            return true;
        }
        if (ozid.startsWith("/ManageBaseServer")) {
            return true;
        }
        if (ozid.startsWith("/PublicBaseServer")) {
            return true;
        }
        if (ozid.startsWith("/PrivateBaseServer")) {
            return true;
        }
    }
}

//이벤트 리스너 추가
if (!oz_metatree.prototype.addEventListener) {
    oz_metatree.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "dblclick":
                this.ActionEventfn = f;
                break;
        }
    }
}

oz_metatree.prototype.RemoveHandlerActionEvent = function (fn) {
    this.ActionEventfn = null;
}

//Dispose
oz_metatree.prototype.dispose = function () {
    this.ActionEventfn = null;
}


/**
 * @description :  MetaTree For Filter
 */
function oz_metatreefilter() {
    var metatree; //Tree
    var rootnode;

    var mvarrootlabel = "관리";
    var mvarrootozid = "ManageBaseServer";
    var mvarrooticon = "../../image/type/managebaseserver.png";
    var mvardisplaytypes;
    var mvaritemtypes = "";
    var mvarcurpath = "";
    var mvarselectdname = "";
    var mvarselecteditem = null;

    var dimtitle;
    var dimaddr;
    var facttitle;
    var factaddr;
    var mtitle;
    var maddr;
    var hidefolderlist;


    //Current Node Info
    var curnode, curnodechildren;
    var mvardblclickfn = null; //Event Listener list

    this.selectdname = function () { return mvarselectdname };

    this.root = function (val) { return mvarrootozid = val; };
    this.rootlabel = function (val) { mvarrootlabel = val; };
    this.rooticon = function (val) { mvarrooticon = val; };
    this.itemtypes = function (val) { return mvaritemtypes = val; };
    this.selecteditem = function () {
        return mvarselecteditem;
    };

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
    //메세지 박스 타이틀
    Object.defineProperty(this, 'ActionEventfn', {
        get: function () {
            return mvardblclickfn;
        },
        set: function (val) {
            mvardblclickfn = val;
        }
    });

    //Initialize
    this.init = function (id, autoload) {
        var source = [];
        var item;
        if (!ozf_StringIsEmpty(dimaddr)){
            item = {};
            item.icon = ozf_geticonpath('dimensions');
            item.label = dimtitle;
            item.id = dimaddr;
            item.value = 'dimensions';
            item.expanded = autoload;
            item.type = 'dimension';
            source.push(item);
        }
        if (!ozf_StringIsEmpty(factaddr)) {
            item = {};
            item.icon = ozf_geticonpath('facts');
            item.label = facttitle;
            item.id = factaddr;
            item.value = 'facts';
            item.expanded = autoload;
            item.type = 'fact';
            source.push(item);
        }
        if (!ozf_StringIsEmpty(maddr)) {
            item = {};
            item.icon = ozf_geticonpath('measures');
            item.label = mtitle;
            item.id = maddr;
            item.value = 'measures';
            item.expanded = autoload;
            item.type = 'measure';
            source.push(item);
        }

        var treeH = $(window).height() - 110;

        $(id).jqxTree({ allowDrag: false, allowDrop: false, source: source, width: '100%', height: '100%' });

        //Tree Event
        $(id).on("select", event_selectnode);
        $(id).jqxTree('selectItem', $(id).find('li:first')[0]);
        $(id).click(function (event) {
            var that = this;
            setTimeout(function () {
                var dblclick = parseInt($(that).data('double'), 10);
                if (dblclick > 0) {
                    $(that).data('double', dblclick - 1);
                } else {
                    //singleClick.call(that, event);
                }
            }, 300);
        }).dblclick(function (event) {
            $(this).data('double', 2);
            if (mvarselecteditem !== null) {
                raiseActionEvent(mvarselecteditem);
            }
        });
    }

    //Select Node
    function event_selectnode(event) {
        metatree = event.target;

        var id = "#" + event.target.id;
        var args = event.args;
        curnode = $(id).jqxTree('getItem', args.element);
        mvarselecteditem = null;
        if (!curnode.hasItems) {
            var ozid = curnode.id;
            var type = curnode.value;

            mvarselectdname = curnode.label;
            if (isfolderfromozid(ozid)) {
                get_childnode(ozid, curnode, id, ozid);
            } else {
                mvarselecteditem = new Object();
                mvarselecteditem.ozid = curnode.id;
                mvarselecteditem.type = curnode.value;
                mvarselecteditem.name = curnode.label;
                mvarselecteditem.img = curnode.icon;
            }
        }
    }

    //Get Child Items
    function get_childnode(mvarrootozid, pnode, treeid, cubeozid, cubelabel) {
        var addr = "<List><Item address='{0}'/></List>".format(mvarrootozid);
        var metahandler = new oza_MetaHandler("content", addr, "<List><Info option='all'/></List>");
        metahandler.execute(this, false);
        if (metahandler.iserror === true) {
            return;
        }

        var xmlDoc;
        xmlDoc = ozf_getXMLDoc(metahandler.returncontent);

        var xroot = xmlDoc.documentElement;
        if (xroot.childNodes.length === 0) { return; }

        xroot = xroot.childNodes[0];
        var i, xitem;
        /**************************************************************************/
        /*  IE 버전 수정본 chrome, safari, firefox childNodes.length <> IE childNodes.length */
        /**************************************************************************/
        // if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
        if ((navigator.appName === 'Netscape' && navigator.userAgent.search('Trident') !== -1) || (navigator.userAgent.indexOf("msie") !== -1)) {
            if (xroot.childNodes.length > 0) {
                for (i = 1; i < xroot.childNodes.length; i = i + 2) {
                    xitem = xroot.childNodes[i];
                    create_itemnode(xitem, pnode, treeid, cubeozid, cubelabel);
                }
                $(treeid).jqxTree('render');
                $(treeid).jqxTree('expandItem', pnode.element)
            }
        } else {
            if (xroot.childNodes.length > 0) {
                var colitem = new ozf_KeyValue();
                var name;

                for (i = 1; i < xroot.childNodes.length; i = i + 2) {
                    xitem = xroot.childNodes[i];
                    name = ozf_GetAttributeValue(xitem, "name", "");
                    colitem.add(xitem, name);
                }
                colitem.sort();

                for (i = 0; i < colitem.length(); i++) {
                    xitem = colitem.item(i);
                    create_itemnode(xitem.key, pnode, treeid, cubeozid, cubelabel);
                }

                $(treeid).jqxTree('render');
                $(treeid).jqxTree('expandItem', pnode.element)
            }
        }
    }

    function raiseActionEvent(e) {
        if (mvardblclickfn !== null) {
            mvardblclickfn(e);
        }
    }

    //Create Node
    function create_itemnode(xitem, pnode, treeid, cubeozid, cubelabel) {
        var nid, ntext, ntype, newnodeid, iconpath;
        nid = ozf_GetAttributeValue(xitem, "ozid", "");
        ntext = ozf_GetAttributeValue(xitem, "name", "");
        ntype = ozf_GetAttributeValue(xitem, "type", "");

        if (!ozf_StringIsEmpty(mvardisplaytypes)) {
            if (!mvardisplaytypes.match(ntype.toLowerCase() + ";")) {
                return;
            }
        }

        iconpath = ozf_geticonpath(ntype);
        if (!ozf_StringIsEmpty(iconpath)) {
            $(treeid).jqxTree('addTo', { "id": nid, "label": ntext, "value": ntype, "icon": iconpath, "cube": cubeozid, "cubelabel": cubelabel }, pnode.element, false);
        }
    }

    function isfolderfromozid(ozid) {
        if (ozid.startsWith("20")) {
            return true;
        }
        if (ozid.startsWith("21")) {
            return true;
        }
        if (ozid.startsWith("22")) {
            return true;
        }
        if (ozid.startsWith("/ManageBaseServer")) {
            return true;
        }
        if (ozid.startsWith("/PublicBaseServer")) {
            return true;
        }
        if (ozid.startsWith("/PrivateBaseServer")) {
            return true;
        }
    }
}

//이벤트 리스너 추가
if (!oz_metatreefilter.prototype.addEventListener) {
    oz_metatreefilter.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "dblclick":
                this.ActionEventfn = f;
                break;
        }
    }
}

oz_metatreefilter.prototype.RemoveHandlerActionEvent = function (fn) {
    this.ActionEventfn = null;
}

//Dispose
oz_metatreefilter.prototype.dispose = function () {
    this.ActionEventfn = null;
}