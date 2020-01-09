var enum_serverlist = 'serverlist';
var enum_machine = 'machineinfo';
var enum_currentstat = 'currentstat';
var enum_servicelist = 'servicelist';
var enum_serviceinfo = 'serviceinfo';
var enum_completed = 'servercompleted';
var enum_servicelistcompleted = 'servicelistcompleted';
var enum_serviceinfocompleted = 'serviceinfocompleted';

var enum_logstatus = 'logstatus';
var enum_logstatuscompleted = 'logstatuscompleted';
var enum_logstart = 'logstart';
var enum_logstartcompleted = 'logstartcompleted';
var enum_logrestart = 'logrestart';
var enum_logrestartcompleted = 'logrestartcompleted';
var enum_logstop = 'logstop';
var enum_logstopcompleted = 'logstopcompleted';
var enum_makelogList = 'logList';
var enum_getlogdata = 'logData';
var enum_dailychart = 'dailychart';
var enum_weeklychart = 'weeklychart';
var enum_dailychartinit = 'dailychartinit';
var enum_weeklychartinit = 'weeklychartinit';

/*--------------------------------------------------
* obzen ELP Handler
----------------------------------------------------*/
function oz_ELPHandler() {
	var serviceResultError;    
    var serverList = [];
    this.callbackfunc = [];

    //register callback function
    this.addHandler = function (fn) {
        this.callbackfunc[this.callbackfunc.length] = fn;
    }
    //raise event
    this.raiseEvent = function (sender, e) {
        var i = 0;
        for (i = 0 ; i < this.callbackfunc.length; i++) {
            this.callbackfunc[i](sender, e);
        }
    }

    //ServerList Get/Set
    this.getServerList = function () {
        return serverList;
    }

    this.initServerList = function() {
    	executeMon('machine_list', '', '', '', enum_serverlist);
    }

    //ServerStatus Get
    this.getServerStat = function() {
    	executeMon('machine_stats', '*', '', '', enum_currentstat);	
    }

    this.cmdLog = function(command, ip, servicename, content, servicetype){
        executeLogCmd(command, ip, servicename, content, servicetype);
    }

    function setServerList(data){
        serverList = [];
    	var servers = [];
        servers = JSON.parse(data).elpServerBaseList;
        
        var item;
        for(var i=0; i<servers.length; i++){
            item = new oz_elpserver();
            item.ip = servers[i].ip;
            item.alias = servers[i].hostName;
            item.color = colorset[i];
            serverList.push(item);
            item.result = '';
        }
        this.elp.raiseEvent(this, enum_serverlist)
        // executeMon('machine_stats', '*', '', '', enum_currentstat);
    }

    function setServerStat(data){
        var servers = JSON.parse(data).result;

        var server = new Object();
        for(var j=0; j<serverList.length; j++){    
            for(var i=0; i<servers.length; i++){
                if(servers[i].ip == serverList[j].ip) {
                    if(servers[i].timestamp == null){
                        server = serverList[j];
                        server.isError = true;
                        server.result = servers[i];
                        server.cpu = 0.0;
                        server.timestamp = null;
                        server.memory = 0.0;
                        server.filesystems = [];
                        server.network_devices = [];
                    }
                    else {
                        server = serverList[j];
                        server.isError = false;
                        server.result = servers[i];
                        server.parse_stats();
                    }
                    break;
                }
            }
        }
    }

    // check server information
    function check_serverinfo() {
        var item;
        for (var i = 0; i < serverList.length ; i++) {
            item = serverList[i];
            if (item.status() == false) {
                return;
            }            
        }
        //raise complete
        this.elp.raiseEvent(this, enum_completed)
    }

    //request Monitoring Data
    function executeMon(purpose, ip, servicename, content, servicetype) {
        serviceResult = '';
        serviceResultError = false;

        var info;
        info = '[{"service":"elp"}, {"method":"getdata"},';
        info = info + '{"purpose":"' + purpose + '"},';
        info = info + '{"address":"' + ip + '"},';
        info = info + '{"servicename":"' + servicename + '"},';
        info = info + '{"content":"' + content + '"}]';

        $.ajax({
            type: 'POST',
            url: baseurl + "/rest/elp/mon",
            data: info,
            async: false,
            success: function (data, status) {
                receiveResult(ip, data, servicetype, servicename);
                //alert(data);
            },
            error: function (x, e) {
                if (x.status === 0) {
                    serviceResultError = true;
                    console.log('Not connect. Please check your network.');
                } else if (x.status == 404) {
                    serviceResultError = true;
                    console.log('Requested page not found. [404]');
                } else if (x.status == 500) {
                    serviceResultError = true;
                    console.log('Internal Server Error [500].');
                } else if (e === 'parsererror') {
                    serviceResultError = true;
                    console.log('Parsing JSON Request failed.');
                } else if (e === 'timeout') {
                    serviceResultError = true;
                    //alert('Request Time out.');
                } else if (e === 'abort') {
                    serviceResultError = true;
                    //alert('Ajax request aborted.');
                } else {
                    serviceResultError = true;
                    //alert("Unknow Error: " + x.status + " " + x.responseText);
                }
            }
        });
    }

    //request Monitoring Data
    function executeLogCmd(purpose, ip, servicename, content, servicetype) {
        serviceResult = '';
        serviceResultError = false;

        var info;
        info = '[{"service":"elp"}, {"method":"getdata"},';
        info = info + '{"purpose":"' + purpose + '"},';
        info = info + '{"address":"' + ip + '"},';
        info = info + '{"servicename":"' + servicename + '"},';
        if(content == null) {
            info = info + '{"content":' + content + '}]';
        } else {
            info = info + '{"content":"' + content + '"}]';
        }
        // console.log(info);

        $.ajax({
            type: 'POST',
            url: baseurl + "/rest/elp/cmd/log",
            data: info,
            async: false,
            success: function (data, status) {
                receiveResult(ip, data, servicetype, servicename);
            },
            error: function (x, e) {
                if (x.status === 0) {
                    serviceResultError = true;
                    console.log('Not connect. Please check your network.');
                } else if (x.status == 404) {
                    serviceResultError = true;
                    console.log('Requested page not found. [404]');
                } else if (x.status == 500) {
                    serviceResultError = true;
                    console.log('Internal Server Error [500].');
                } else if (e === 'parsererror') {
                    serviceResultError = true;
                    console.log('Parsing JSON Request failed.');
                } else if (e === 'timeout') {
                    serviceResultError = true;
                    //alert('Request Time out.');
                } else if (e === 'abort') {
                    serviceResultError = true;
                    //alert('Ajax request aborted.');
                } else {
                    serviceResultError = true;
                    //alert("Unknow Error: " + x.status + " " + x.responseText);
                }
            }
        });
    }

    //Return
    function receiveResult(ip, info, servicetype, servicealias) {
        var item;
        if(servicetype == enum_serverlist){
            setServerList(info);
            return;
        }
        if(ip == '*'){
            setServerStat(info);
        } 
        else {
            for (var i = 0; i < serverList.length ; i++) {
                item = serverList[i];
                if (item.ip == ip) {
                    item.isError = false;
                    item.result = info;
                    switch (servicetype) {
                        case enum_machine:
                            item.parse();
                            break;
                        case enum_currentstat:
                            item.parse_stats();
                            break;
                        case enum_servicelist:
                            item.parse_service();
                            break;
                        case enum_serviceinfo:
                            if(servicealias == '*'){
                                item.parse_servicedetail_all();
                            } else {
                                item.parse_servicedetail(servicealias);
                            }
                            break;
                    }                
                    break;
                }
            }
        }
        switch (servicetype) {
            case enum_currentstat:
                this.elp.raiseEvent(this, enum_completed);
                break;
            case enum_servicelist:
                this.elp.raiseEvent(this, enum_servicelistcompleted);
                break;
            case enum_serviceinfo:
                this.elp.raiseEvent(this, enum_serviceinfocompleted);
                break;
            case enum_logstatus:
                this.elp.raiseEvent(info, enum_logstatuscompleted);
                break;
            case enum_logstart:
                this.elp.raiseEvent(info, enum_logstartcompleted);
                break;
            case enum_logrestart:
                this.elp.raiseEvent(info, enum_logrestartcompleted);
                break;
            case enum_logstop:
                this.elp.raiseEvent(info, enum_logstopcompleted);
                break;
            case enum_makelogList:
                this.elp.raiseEvent(info, enum_makelogList);
                break;
            case enum_getlogdata:
                this.elp.raiseEvent(info, enum_getlogdata);
                break;
            case enum_dailychart:
                this.elp.raiseEvent(info, enum_dailychart);
                break;
            case enum_weeklychart:
                this.elp.raiseEvent(info, enum_weeklychart);
                break;
            case enum_dailychartinit:
                this.elp.raiseEvent(info, enum_dailychartinit);
                break;
            case enum_weeklychartinit:
                this.elp.raiseEvent(info, enum_weeklychartinit);
                break;
            default:
                //check_serverinfo();
        }
    }

    //Return
    function receiveError(ip, info, servicetype, servicealias) {
        var item;
        for (var i = 0; i < serverList.length ; i++) {
            item = serverList[i];
            if (item.ip == ip) {
                item.isError = true;
                switch (servicetype) {
                    case enum_machine:
                        break;
                    case enum_currentstat:
                        // this.elp.raiseEvent(this, enum_currentstat)
                        break;
                    case enum_servicelist:
                        break;
                }
                break;
            }
        }
        switch (servicetype) {
            case enum_servicelist:
                this.elp.raiseEvent(this, enum_servicelistcompleted)
                break;
            case enum_serviceinfo:
                this.elp.raiseEvent(this, enum_serviceinfocompleted)
                break;
            case enum_logstart:
                this.elp.raiseEvent(info, enum_logstartcompleted)
                break;
            default:
                check_serverinfo();
        }
    }

}

//Server Informaton
function oz_elpserver(){
	this.getServiceURL= function(){
		return "http://" + this.ip + "/";
	}

	this.ip
	this.alias;
    this.color;
	this.timestamp;
	this.cpu = '';
	this.memory;
	this.isError = false;
	this.result;
	this.machineInfo;

	this.machine_id;
	
	this.core = [];
	this.filesystems = [];
	this.network_devices = [];
	
	this.curservice;
	this.servicelist = [];
	       
    //machine Info
	this.parse = function () {
	    this.machineInfo = this.result;
	    this.machine_id = this.result['machine_id'];
	}

	this.clear = function () {
	    this.cpu = '';
	    this.memory = '';
	    this.filesystems =[];
	    this.network_devices = [];
	}

    //container stats
	this.parse_stats = function () {
        var serverstat = this.result;
	    this.cpu = serverstat.cpuUsageTotal;
	    this.timestamp = new Date(serverstat.timestamp);
	    this.memory = serverstat.memoryUsage;
	    this.filesystems = serverstat.elpServerFileSystems;
	    this.network_devices = serverstat.elpServerNetworks;
	}

    //Sort Array
	function dynamicSort(property) {
	    var sortOrder = 1;
	    if (property[0] === "-") {
	        sortOrder = -1;
	        property = property.substr(1);
	    }
	    return function (a, b) {
	        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	        return result * sortOrder;
	    }
	}

	function get_dateString(cur) {
	    var yyyy = cur.getFullYear().toString();
	    var mm = (cur.getMonth() + 1).toString(); // getMonth() is zero-based
	    var dd = cur.getDate().toString();
	    return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]); // padding
	}

    //check ready server information 
	this.status = function () {
	    if (this.isError == true) {
	        return false;
	    }

	    if (this.timestamp == null) {
	        return false;
	    }
	    else {
	        return true;
	    }
	}

}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}