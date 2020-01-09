//-***************************************************************************************************************************
// CLASS
//-***************************************************************************************************************************
//--------------------------------------------------------------
//menu class
//--------------------------------------------------------------
    function clsMenu(ozid, isFolder) {
        //caption, desc, img, frameaddr, ozid, isFolder) {
        this.ozid = ozid;
        this.order = -1;
        this.isFolder = isFolder;

        this.caption = ""; //caption;
        this.desc = ""; //desc;
        this.img = "default"; //img;
        this.frameaddr = ""; //frameaddr;
        this.parent = null;
        this.SubMenus = [];
    }
    if (!clsMenu.prototype.getInfo) {
        clsMenu.prototype.getInfo = function (idx) {
            switch (idx) {
                case 0:
                    return this.caption;
                case 1:
                    return this.desc;
                case 2:
                    return this.img;
                case 3:
                    return this.frameaddr;
                case 4:
                    return this.ozid;
                case 5:
                    return this.isFolder;
            }
            return "";
        }
    }
    if (!clsMenu.prototype.setInfo) {
        clsMenu.prototype.setInfo = function (idx, newvalue) {
            switch (idx) {
                case 0:
                    this.caption = newvalue;
                case 1:
                    this.desc = newvalue;
                case 2:
                    if (newvalue != "") this.img = newvalue;
                case 3:
                    this.frameaddr = newvalue;
                case 4:
                    this.ozid = newvalue;
                case 5:
                    this.isFolder = newvalue;
            }
        }
    }
    if (!clsMenu.prototype.addChild) {
        clsMenu.prototype.addChild = function (submenu) {
            this.SubMenus.push(submenu);
        }
    }
    //if (!clsMenu.prototype.SubMenu) {
    //    clsMenu.prototype.SubMenu = function (idx) {
    //        if (idx < this.submenus.length) {
    //            return this.submenus[idx]
    //        }
    //        return null;
    //    }
    //}
    //--------------------------------------------------------------
    //TemporaryContent
    //--------------------------------------------------------------
    function clsDict() {
        this.Keys = [];
        this.Values = [];
        this.keyDelim = "_";
    }
    if (!clsDict.prototype.setData) {
        clsDict.prototype.setData = function (tempName, tempContent, groupName) {
            if (tempName == null) return false;
            if (tempName == "") return false;
            if (typeof (tempName) == "number" || typeof (tempName) == "string") {
                var gName = groupName;
                if (gName == null) gName = "";
                var sKey = tempName + this.keyDelim + gName;
                var found = -1;
                if (this.Keys != undefined) {
                    for (var i = 0, keyslen = this.Keys.length; i < keyslen; i++) {
                        if (this.Keys[i] == sKey) {
                            found = i;
                            break;
                        }
                    }
                }
                if (found >= 0) { //update
                    this.Values[found] = tempContent;
                }
                else { //add                    
                    this.Keys.push(sKey);
                    this.Values.push(tempContent);
                }
            }
            else {
                return false;
            }
            return true;
        }
    }
    if (!clsDict.prototype.add) {
        clsDict.prototype.add = function (sKey, oValue) {
            //clsDict.prototype.setData(sKey, oValue, "");
            if (sKey == null) return false;
            if (sKey == "") return false;
            var found = -1;
            for (var i = 0, keyslen = this.Keys.length; i < keyslen; i++) {
                if (this.Keys[i] == sKey) {
                    found = i;
                    break;
                }
            }
            if (found >= 0) { //update
                this.Values[found] = oValue;
            }
            else { //add                    
                this.Keys.push(sKey);
                this.Values.push(oValue);
            }
        }
    }
    if (!clsDict.prototype.item) {
        clsDict.prototype.item = function (sKey) {
            //clsDict.prototype.getData(sKey, false, "");
            if (sKey == null) return null;
            if (sKey == "") return null;
            var found = -1;
            for (var i = 0, keyslen = this.Keys.length; i < keyslen; i++) {
                if (this.Keys[i] == sKey) {
                    found = i;
                    break;
                }
            }
            if (found >= 0) { //update
                var retVal = this.Values[found];
                return retVal;
            }
            else { //error
                return "";
            }
        }
    }
    if (!clsDict.prototype.getData) {
        clsDict.prototype.getData = function (tempName, deleteAfter, groupName) {
            if (tempName == null) return null;
            if (tempName == "") return null;
            var gName = groupName;
            if (gName == null) gName = "";
            var sKey = tempName + this.keyDelim + gName;
            var found = -1;
            for (var i = 0, keyslen = this.Keys.length; i < keyslen; i++) {
                if (this.Keys[i] == sKey) {
                    found = i;
                    break;
                }
            }
            if (found >= 0) { //update
                var retVal = this.Values[found];
                if (deleteAfter == true) {
                    this.Keys.splice(found, 1);
                    this.Values.splice(found, 1);
                }
                return retVal;
            }
            else { //error
                return "";
            }
        }
    }

    //해당 그룹에 TempContent들 삭제
    if (!clsDict.prototype.clearGroup) {
        clsDict.prototype.clearGroup = function (groupName) {
            if (groupName == null) return;
            var gName = groupName;
            var sKey = this.keyDelim + gName;
            var found = new Array();
            for (var i = 0, keyslen = this.Keys.length; i < keyslen; i++) {
                if (this.Keys[i].endsWith(sKey)) {
                    found.push(i);
                }
            }
            var foundcnt = found.length;
            if (foundcnt >= 0) { //update
                for(var i = foundcnt - 1; i>=0; i--) {
                    this.Keys.splice(found[i], 1);
                    this.Values.splice(found[i], 1);
                }
            }
            else { //error
                return "";
            }
        }
    }

