function oz_BRTree(id){
	var rowHandle ;
    var CheckRuleDeleteCnt = 0;
    //선택된 NODE 정보
    var NODE_TYPE;
    var NODE_ID;
    var NODE_NAME;
    var NODE_HRANK_NODE_ID;
    var NODE_DESC;

    //Copy 및 Cut, Paste
    //var BUFFER;
    //var BUFFERLIST;
    //var Copy;
    //var MultiCopy;
    //var Cut;
    //var CopyNodeId_Buffer;
    //var CutNodeId_Buffer;
    //var CopyNodeNm_Buffer;
    //var CutNodeNm_Buffer;
    //var CopyNodeDesc_Buffer;
    //var CutNodeDesc_Buffer;
    //var CopyNodeType_Buffer;
    //var CutNodeType_Buffer;
    //var CopyNodeHrankNodeId_Buffer;
    //var CutNodeHrankNodeId_Buffer;

    //public SearchControl As New DevExpress.Xpf.Editors.SearchControl
    //public SearchComboEdit As New DevExpress.Xpf.Editors.ComboBoxEdit
    var SearchControl;
    var SearchComboEdit;

    //삭제한 NODE_ID
    //var DeleteNodeId;

    //새로만들기로 추가한 NODE 정보
    //var ADD_NODE_ID;
    //var ADD_NODE_TYPE;
    //var ADD_NODE_NM;
    //var ADD_NODE_DESC;
    //var ADD_NODE_HRANK_NODE_ID;
    //var ADD_NODE_DEPTH;
    //var ADD_OUTPUT_ITEM;

    //새로만들기로 추가한 NODE에 대한 기본생성 NODE 정보 
    //테이블 : C_NODE_TYPE_AUTO_CRAT
    //var AUTO_CREATE_NODE_ID;
    //var AUTO_CREATE_NODE_TYPE;
    //var AUTO_CREATE_NODE_NM;
    //var AUTO_CREATE_NODE_DESC;
    //var AUTO_CREATE_NODE_HRANK_NODE_ID;
    //var AUTO_CREATE_NODE_DEPTH;

    //이름바꾸기한 NODE 정보
    //var RENAME_NODE_ID;
    //var RENAME_NODE_TYPE;
    //var RENAME_NODE_NM;
    //var RENAME_NODE_DESC;
    //var RENAME_NODE_HRANK_NODE_ID;
    //var RENAME_NODE_DEPTH;

    //붙여넣기한 NODE 정보
    //var PASTE_NODE_ID;
    //var PASTE_NODE_TYPE;
    //var PASTE_NODE_NM;
    //var PASTE_NODE_DESC;
    //var PASTE_NODE_HRANK_NODE_ID;
    //var PASTE_NODE_DEPTH;

    //eCube서버와 통신할 eCubeAgent 
    //var gVareCubeAgentUX As eCubeAgent7Lib.Agent7 = New eCubeAgent7Lib.Agent7

    //기본트리 출력시 수행되어야 할 GetData정보
    //var InitSelector;
    //var InitPurpose;
    //var InitAddress;
    //var InitContent;

    //트리 ContextMenu(오른쪽버튼) 출력시 수행되어야 할 GetData정보
    //관련 테이블 : C_NODE_TYPE_LRANK_INFO
    /*
    var NewCreateMenuSelector; = String.Empty
    var NewCreateMenuPurpose; = String.Empty
    var NewCreateMenuAddress; = String.Empty
    var NewCreateMenuContent; = String.Empty

    '트리 NODE 새로만들기시 수행되어야 할 GetData정보
    '관련 테이블 C_NODE_INFO
    var AddNodeSelector; = String.Empty
    var AddNodePurpose; = String.Empty
    var AddNodeAddress; = String.Empty
    var AddNodeContent; = String.Empty

    '트리 NODE 삭제시 해당노드가 다른곳에서 쓰이고있는지 확인하는 GetData정보
    '관련 테이블 : C_RULE_USE_NODE_LIST
    var AuthCheckSelector; = String.Empty
    var AuthCheckPurpose; = String.Empty
    var AuthCheckAddress; = String.Empty
    var AuthCheckContent; = String.Empty


    '트리 NODE 삭제시 해당노드가 다른곳에서 쓰이고있는지 확인하는 GetData정보
    '관련 테이블 : C_RULE_USE_NODE_LIST
    var DelNodeUseCheckSelector; = String.Empty
    var DelNodeUseCheckPurpose; = String.Empty
    var DelNodeUseCheckAddress; = String.Empty
    var DelNodeUseCheckContent; = String.Empty

    '트리 NODE 삭제시 수행되어야 할 GetData정보
    '관련 테이블 C_NODE_INFO
    var DelNodeSelector; = String.Empty
    var DelNodePurpose; = String.Empty
    var DelNodeAddress; = String.Empty
    var DelNodeContent; = String.Empty

    '트리 NODE 복사시 수행되어야 할 GetData정보
    '관련 테이블 C_NODE_INFO
    var CopyNodeSelector; = String.Empty
    var CopyNodePurpose; = String.Empty
    var CopyNodeAddress; = String.Empty
    var CopyNodeContent; = String.Empty

    '트리 NODE 잘라내기시 수행되어야 할 GetData정보
    '관련 테이블 C_NODE_INFO
    var CutNodeSelector; = String.Empty
    var CutNodePurpose; = String.Empty
    var CutNodeAddress; = String.Empty
    var CutNodeContent; = String.Empty

    '트리 NODE 이름바꾸기시 수행되어야 할 GetData정보
    '관련 테이블 C_NODE_INFO
    var ReNameNodeSelector; = String.Empty
    var ReNameNodePurpose; = String.Empty
    var ReNameNodeAddress; = String.Empty
    var ReNameNodeContent; = String.Empty

    '트리 Search콤보박스에 NODE_TYPE 출력시 수행되어야 할 GetData정보
    '관련 테이블 C_NODE_TYPE_INFO
    var TypeSearchSelector; = String.Empty
    var TypeSearchPurpose; = String.Empty
    var TypeSearchAddress; = String.Empty
    var TypeSearchContent; = String.Empty
    var TypeSearchComboTemp As New ComboBox

    '트리 NODE Search시 수행되어야 할 GetData정보
    var TreeSearchSelector; = String.Empty
    var TreeSearchPurpose; = String.Empty
    var TreeSearchAddress; = String.Empty
    var TreeSearchContent; = String.Empty

    'Easy Sheet 생성시 새로만들기 화면에서 OutputItem 추가시 수행되어야 할 GetData정보(사용안함)
    var OutputItemAddSelector; = String.Empty
    var OutputItemAddPurpose; = String.Empty
    var OutputItemAddAddress; = String.Empty
    var OutputItemAddContent; = String.Empty

    var RuleTreeDrag As Boolean 'RuleTree 드래그 허용여부
    var ItemTreeDrag As Boolean 'ItemTree 드래그 허용여부
    var FuncTreeDrag As Boolean 'FuncTree 드래그 허용여부
    var TmTreeDrag As Boolean 'TMTree 드래그 허용여부
    var DragDataType; = String.Empty    '드래그 앤 드롭시 전달할 데이터 종류

    var AllNodeExpand As Boolean '노드 전체 펼치기 여부
    var MouseRightButtonUse As Boolean '마우스 오른쪽 버튼 사용여부

    var NotSearchOpen As Boolean 'Search 콤보 Open 제어
    var SearchString; = String.Empty 'Search 시 찾을 문자열
    var SearchKind; = String.Empty   'Search 모드 ex(ID,종류..등)

    var ContextMenuMng; = String.Empty  '트리 ContextMenu에 출력할 항목 ex(ReName;DEL..등)
    var SingleCheckMode As Boolean   'NODE 선택시 SingleSelection 여부
    var Columns As TreeListColumnCollection '트리에 표시될 ColumnCollection

    var CheckNodeBuffer; = String.Empty
    var OnlySpecialRule; = String.Empty
    var BeforeRadio; = String.Empty
    var PasteCnt As Integer
    var FormulaSeq As Integer = 0
    var DragNodeType; = String.Empty
    var VisibleNode; = String.Empty
	
	
	*/
	
	var inst = this;
	this.treeview;
	var items = [];
	var dataStructure = 'plain';
	var parentIdExpr = 'HRANK_NODE_ID';
	var keyExpr = 'NODE_ID';
	var displayExpr = 'NODE_NM';
	var width = 320;
	var height = 500;
	this.id = '#' + id;
	var animationEnabled = '';
	var selectedItem;
	
	this.selNodeId = '';
	this.selNodeNm = '';
	this.selNodeType = '';
	
	var onClick;
	
	this.Init = function (a,b,c,d) {
		var tmhandler = new oza_TMHandler('com.obzen.ruleWeb.Col_0001', 'selBusinessRule', '0', '@#%');
	    tmhandler.execute(null, false);
	    if (tmhandler.getIsError()) {
	        ozf_MsgBox('조회 중 다음과 같은 오류가 발생했습니다.\n' + tmhandler.getErrormessage(), function () {
	            return;
	        });
	    }
	    var TMResult = tmhandler.getResult();
	    var Nodes = JSON.parse(TMResult);
	    Nodes[0].HRANK_NODE_ID = null;
	    Nodes[0].expanded = true
	    items = Nodes;
	    this.treeview.option("items", items);
	}
	this.init = function () {
		//화면 오픈시 수행
		/*
		var tmhandler = new oza_TMHandler('com.obzen.ruleWeb.Col_0001', 'selBusinessRule', '0', '@#%');
        tmhandler.execute(null, false);
        if (tmhandler.getIsError()) {
            ozf_MsgBox('조회 중 다음과 같은 오류가 발생했습니다.\n' + tmhandler.getErrormessage(), function () {
                return;
            });
        }
        var TMResult = tmhandler.getResult();
        var Nodes = JSON.parse(TMResult);
        Nodes[0].HRANK_NODE_ID = null;
        Nodes[0].expanded = true
        items = Nodes;*/
		
        $(this.id).dxTreeView({
        	animationEnabled: animationEnabled,
        	items: items,
        	dataStructure: dataStructure,
        	parentIdExpr: parentIdExpr,
        	keyExpr: keyExpr,
        	displayExpr: displayExpr,
        	onItemClick: function (e) {
        		selectedItem = e.itemData;
        		inst.selNodeId =selectedItem.NODE_ID;
        		inst.selNodeNm =selectedItem.NODE_NM;
        		inst.selNodeType =selectedItem.NODE_TYPE;
        		//alert(selectedItem.NODE_ID);
        		inst.ruleclick();
            },
        	onItemRendered: function (e){
        	    $(this.id + " .dx-icon").css("width", "16px");
        	    $(this.id + " .dx-icon").css("height", "16px");    	
        	}
        	
        });
        this.treeview = $(this.id).dxTreeView('instance');
        $(this.id).addClass("ozbrtree");
        $(this.id + " .dx-treeview-node").css("font-size", "12px");
        $(this.id + " .dx-treeview-item").css("min-height", "24px");
        return this.treeview;
    }
	
	this.TypeSearch = function (a,b,c,d) {}
	this.GetTypeComboData = function () {}
	this.TreeSearch = function (a,b,c,d) {}
	this.HideSearch = function (a) {}
	this.HideToolSearchIcon = function (a) {}
	this.TreeInit = function () {}
	this.ColumnsClear = function () {}
	this.Add_Column = function (a,b) {}
	this.Column_Visible = function () {}
	this.ShowCheckboxes = function (a) {}
	this.KeyFieldName = function (a) {}
	this.ParentFieldName = function (a) {}
	this.ShowColumnHeaders = function (a) {}
	this.ExpandAllNode = function (a) {}
	this.MouseRightUse = function () {}
	this.ImageFieldName = function () {}
	this.dispose = function () {}
	this.ChildNodeByNodeId = function (a) {}
	
	Object.defineProperty(this, 'SetDragDataType', {
        get: function () {
            
        },
        set: function (val) {
        	
        }
    });
	
	Object.defineProperty(this, 'SetRuleTreeDrag', {
        get: function () {
            
        },
        set: function (val) {
        	
        }
    });
	
	Object.defineProperty(this, 'DragNodeType', {
        get: function () {
            
        },
        set: function (val) {
        	
        }
    });
	
	
	
	//디자인 속성 추가
	if (!oz_BRTree.prototype.setAttr) {
		oz_BRTree.prototype.setAttr = function (attr, val) {
	        $(this.id).css(attr, val);        
	    }
	}
	//활성화 여부 반환
	if (!oz_BRTree.prototype.getEnabled) {
		oz_BRTree.prototype.getEnabled = function () {
	        return !this.treeview.option('disabled');
	    }
	}
	//활성화 여부 설정
	if (!oz_BRTree.prototype.setEnabled) {
		oz_BRTree.prototype.setEnabled = function (val) {
	        this.treeview.option('disabled', !val);
	    }
	}
	//Visible 여부 반환
	if (!oz_BRTree.prototype.getVisible) {
		oz_BRTree.prototype.getVisible = function () {
	        return this.treeview.option('visible');
	    }
	}
	//Visible 여부 설정
	if (!oz_BRTree.prototype.setVisible) {
		oz_BRTree.prototype.setVisible = function (val) {      
	        this.treeview.option('visible', val);
	    }
	}
	
	
	
	
	
	
	
    Object.defineProperty(this, 'items', {
        get: function () {
            return items;
        },
        set: function (val) {
        	items = val;
        }
    });
    
    Object.defineProperty(this, 'dataStructure', {
        get: function () {
            return dataStructure;
        },
        set: function (val) {
        	dataStructure = val;
        }
    });
    
    Object.defineProperty(this, 'parentIdExpr', {
        get: function () {
            return parentIdExpr;
        },
        set: function (val) {
        	parentIdExpr = val;
        }
    });
    
    Object.defineProperty(this, 'keyExpr', {
        get: function () {
            return keyExpr;
        },
        set: function (val) {
        	keyExpr = val;
        }
    });
    
    Object.defineProperty(this, 'displayExpr', {
        get: function () {
            return displayExpr;
        },
        set: function (val) {
        	displayExpr = val;
        }
    });
    
    Object.defineProperty(this, 'animationEnabled', {
        get: function () {
            return animationEnabled;
        },
        set: function (val) {
        	animationEnabled = val;
        }
    });
    
    Object.defineProperty(this, 'Enabled', {
        get: function () {
            return !this.treeview.option('disabled');
        },
        set: function (val) {
        	this.treeview.option('disabled', !val);
        }
    });

    Object.defineProperty(this, 'Visible', {
        get: function () {
            return this.treeview.option('visible');
        },
        set: function (val) {
        	this.treeview.option('visible', val);
        }
    });
    
    /**
    * 클릭시 이벤트 발생
    */
    this.ruleclick = function (e) { }
    if (!oz_BRTree.prototype.addEventListener) {
    	oz_BRTree.prototype.addEventListener = function (e, f) {
            if (e === "ruleclick") {
            	this.ruleclick = f;
            }
        }
    }
}