var colors = ["#6babac", "#e55253"];

var data = [
    { arg: "Asia", val: 3007613498, parentID: "" },
    { arg: "North America", val: 493603615, parentID: "" },
    { arg: "Europe", val: 438575293, parentID: "" },
    { arg: "Africa", val: 381331438, parentID: "" },
    { arg: "South America", val: 331126555, parentID: "" },
    { arg: "Nigeria", val: 181562056, parentID: "Africa" },
    { arg: "Egypt", val: 88487396, parentID: "Africa" },
    { arg: "Congo", val: 77433744, parentID: "Africa" },
    { arg: "Morocco", val: 33848242, parentID: "Africa" },
    { arg: "China", val: 1380083000, parentID: "Asia" },
    { arg: "India", val: 1306687000, parentID: "Asia" },
    { arg: "Pakistan", val: 193885498, parentID: "Asia" },
    { arg: "Japan", val: 126958000, parentID: "Asia" },
    { arg: "Russia", val: 146804372, parentID: "Europe" },
    { arg: "Germany", val: 82175684, parentID: "Europe" },
    { arg: "Turkey", val: 79463663, parentID: "Europe" },
    { arg: "France", val: 66736000, parentID: "Europe" },
    { arg: "United Kingdom", val: 63395574, parentID: "Europe" },
    { arg: "United States", val: 325310275, parentID: "North America" },
    { arg: "Mexico", val: 121005815, parentID: "North America" },
    { arg: "Canada", val: 36048521, parentID: "North America" },
    { arg: "Cuba", val: 11239004, parentID: "North America" },
    { arg: "Brazil", val: 205737996, parentID: "South America" },
    { arg: "Colombia", val: 48400388, parentID: "South America" },
    { arg: "Venezuela", val: 30761000, parentID: "South America" },
    { arg: "Peru", val: 28220764, parentID: "South America" },
    { arg: "Chile", val: 18006407, parentID: "South America" }
];


$(function () {
    var isFirstLevel = true,
        chartContainer = $("#drillDown_chart"),
        chart = chartContainer.dxChart({
            dataSource: filterData(""),
            //rotated: true,
            //argumentAxis: { visible: false, label: {visible:false} }, // x축 옵션
            //valueAxis: { visible : false, // y축 옵션
             //            grid : { visible : false },
               //          tick: {visible : false},
                 //        label: {visible : false}
            //},
            title: "The Most Populated Countries by Continents",
            series: {
                type: "bar"
            },
            legend: {
                visible: false
            },
            valueAxis: {
                showZero: false
            },
            onPointClick: function (e) {
            	
            	/*
            	if (isFirstLevel) {
                    isFirstLevel = false;
                    removePointerCursor(chartContainer);
                    
                    
	            	$("#drillDown_chart").dxPieChart({  //  id=pie 태그에 차트 생
	            		dataSource: filterData(e.target.originalArgument),
	                    //dataSource: tmResult_json, // 데이터소스 지정
	                    legend:{  // 범례
	                      horizontalAlignment: "center",
	                      verticalAlignment: "bottom"
	                    },
	                    series: [
	                        {
	                            argumentField: "arg", // argument 지정
	                            valueField: "val", // value 지정
	                            label: {
	                                visible: true,
	                                connector: {
	                                    visible: true,
	                                    width: 1
	                                },
	                                position : "columns",
	                                customizeText : function(arg){
	                                	return arg.valueText + "(" + arg.percentText +")";
	                                }
	                            }
	                        }
	                    ],
	
	                });
	            	
	            	$("#backButton")
                    .dxButton("instance")
                    .option("visible", true);
            	
            	}
            	*/
            	// series type
            	//'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' 
            	//| 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' 
            	//| 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock
            	
            	
            	
                if (isFirstLevel) {
                    isFirstLevel = false;
                    removePointerCursor(chartContainer);
                    
                    chart.option({
                        dataSource: filterData(e.target.originalArgument),
                        series: {
                            //type: "line"
                        	//type: "pie" x
                        	type : "fullstackedbar"
                        },
                    });
                    
                    
                    $("#backButton")
                        .dxButton("instance")
                        .option("visible", true);
                }
            	
            },
            customizePoint: function () {
                var pointSettings = {
                    color: colors[Number(isFirstLevel)]
                };

                if (!isFirstLevel) {
                    pointSettings.hoverStyle = {
                        hatching: "none"
                    };
                }

                return pointSettings;
            }
        }).dxChart("instance");

    $("#backButton").dxButton({
        text: "Back",
        icon: "chevronleft",
        visible: false,
        onClick: function () {
            if (!isFirstLevel) {
                isFirstLevel = true;
                addPointerCursor(chartContainer);
                //chart.option("dataSource", filterData(""));
                
                chart.option({
                    dataSource: filterData(""),
                    series: {
                        type: "bar"
                    },
                });
                
                this.option("visible", false);
            }
        }
    });

    addPointerCursor(chartContainer);
});

function filterData(name) {
    return data.filter(function (item) {
        return item.parentID === name;
    });
}

function addPointerCursor(container) {
    container.addClass("pointer-on-bars");
}

function removePointerCursor(container) {
    container.removeClass("pointer-on-bars");
}





function piedown_char(e){
	$("#piedrillDown_chart").dxPieChart({  //  id=pie 태그에 차트 생
        size: {
            width: 233,
            height: 262

        },
        palette: ["#4590EB", "#E1E6ED"],  // 색상 두가지 지정
        dataSource: filterData(e.target.originalArgument),
        //dataSource: tmResult_json, // 데이터소스 지정
        legend:{  // 범례
          horizontalAlignment: "center",
          verticalAlignment: "bottom"
        },
        series: [
            {
                argumentField: "arg", // argument 지정
                valueField: "val", // value 지정
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1
                    },
                    position : "columns",
                    customizeText : function(arg){
                    	return arg.valueText + "(" + arg.percentText +")";
                    }
                }
            }
        ],

    });
}
