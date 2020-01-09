//D3 Charts
function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width")),
      height = parseInt(svg.style("height")),
      aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type,
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}

//*******************************************************************
//  Bubble
//*******************************************************************
function oz_bubble(id) {
    this.id = '#' + id;
    this.init = function () {
        var sheet = document.createElement('style');
        sheet.innerHTML = " text {font: 14px sans-serif;}";
        document.body.appendChild(sheet);
    }
    this.getEnabled = function () {
        return !$(this.id).prop('disabled');
    }
    this.setEnabled = function (val) {
        $(this.id).prop('disabled', !val);
    }
    this.clear = function () {
        d3.select("svg").remove();				// remove existing sankey diagram.
    }
    this.getVisible = function () {
        if ($(this.id).prop('style').display == 'none') {
            return false;
        }
        else {
            return true;
        }
    }
    this.setVisible = function (val) {
        if (val == true) {
            $(this.id).prop('style').display = 'inline-block';
        }
        else {
            $(this.id).prop('style').display = 'none';
        }
    }
    
    var diameterw = 800, diameterh = 600, format = d3.format(",d");

    var palettecolor = ["#C4C4C4", "#FFFF00", "#69B40F", "#C8125C", "#008FC8", "#10218B", "#134B24", "#737373"];
    var bubble = d3.layout.pack()
            .sort(null)
            .size([diameterw, diameterh])
            .padding(1.5);
    var obj = this;
    this.setPalette = function (colorlist) {
        palettecolor = [];
        var i;
        var arrdata = colorlist.split(",");
        for (i = 0; i < arrdata.length; i++) {
            palettecolor.push(arrdata[i]);
        }
    }

    this.setItemsSource = function (tm) {
        var vrow, vcol;
        var datalist;
        var i, j;
        var keyslist = [];

        datalist = JSON.parse(tm.getResult());
        vrow = datalist.length;
        for (var key in datalist[0]) {
            keyslist.push(key)
        }

        vcol = keyslist.length;

        var sb = [];
        
        for (i = 0; i < vrow; i++) {
            for (j = 0; j < vcol; j++) {
                sb.push(datalist[i][keyslist[j]]);
                sb.push(",");
            }
        }
        datalist = sb.join("");
        datalist = ozf_RemoveLastDelimiter(datalist, ",");
        draw(datalist, vrow, vcol);
    }

    function draw(datalist, rows, cols) {
        var arrdata = datalist.split(",");
        var i, j;
        var item;
        var root;
        var arritem = [];

        var value, name;
        var index = 0;
        var islast;
        root = new Object();
        root['name'] = 'root';
        root['children'] = [];

        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                if (j == cols - 1) { value = arrdata[index]; }
                else { name = arrdata[index]; }
                index = index + 1;
                if (j == cols - 2) { islast = true; }
                else { islast = false; }

                if (j == 0) {
                    item = find_child(root, name, islast);
                }
                else if (j < cols - 1) {
                    if (j < cols - 2) {
                        item = find_child(item, name, islast);
                    }
                    else {
                        item = find_child(item, name, islast);
                    }
                }
                else {
                    item['size'] = parseFloat(value);
                }
            }
        }
        draw_svg(root);
    }

    function find_child(pitem, findname, islast) {
        if (findname == "") {
            return pitem;
        }
        if (findname.trim() == "") {
            return pitem;
        }
        var i;
        var child;
        if (pitem.hasOwnProperty("children") == true) {
            for (i = 0; i < pitem['children'].length; i++) {
                child = pitem['children'][i];
                if (child['name'] == findname) {
                    return child;
                }
            }
        }
        child = new Object();
        child['name'] = findname;
        if (islast == false) {
            child['children'] = [];
        }
        if (pitem.hasOwnProperty("children") == true) {
            pitem['children'].push(child);
        }
        return child;
    }

    function draw_svg(jsondata) {
        d3.select("svg").remove();				// remove existing sankey diagram.
        var svg = d3.select(obj.id).append("svg")
            .attr({ "width": diameterw, "height": diameterh })
            .call(responsivefy)
            .attr("class", "bubble");

        root = jsondata;
        var node = svg.selectAll(".node")
            .data(bubble.nodes(classes(root))
            .filter(function (d) { return !d.children; }))
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("title")
            .text(function (d) { return d.className + ": " + format(d.value); });

        node.append("circle")
            .attr("r", function (d) { return d.r; })
            .style("fill", function (d, i) {
                i = i % palettecolor.length;
                return palettecolor[i];
            });

        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function (d) { return d.className.substring(0, d.r / 3); });
    }
    // Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) {
                node.children.forEach(function (child) { recurse(node.name, child); });
            }
            else {
                classes.push({ packageName: name, className: node.name, value: node.size });
            }
        }
        recurse("root", root);
        return { children: classes };
    }
}

//*******************************************************************
//  Sunburst
//*******************************************************************
function oz_sunburst(id) {
    this.id = '#' + id;
    this.init = function () {
        var sheet = document.createElement('style');
        sheet.innerHTML = "path {stroke: #000000;fill-rule: evenodd;}text {font-family: Arial, sans-serif;font-size: 15px;}";
        document.body.appendChild(sheet);
    }
    this.getEnabled = function () {
        return !$(this.id).prop('disabled');
    }
    this.setEnabled = function (val) {
        $(this.id).prop('disabled', !val);
    }
    this.clear = function () {
        d3.select("svg").remove();				// remove existing sankey diagram.
    }
    this.getVisible = function () {
        if ($(this.id).prop('style').display == 'none') {
            return false;
        }
        else {
            return true;
        }
    }
    this.setVisible = function (val) {
        if (val == true) {
            $(this.id).prop('style').display = 'inline-block';
        }
        else {
            $(this.id).prop('style').display = 'none';
        }
    }
    
    var palettecolor = ["#C4C4C4", "#C4C4C4", "#69B40F", "#C8125C", "#008FC8", "#10218B", "#134B24", "#737373"];
    this.setPalette = function (colorlist) {
        palettecolor = [];
        var i;
        var arrdata = colorlist.split(",");
        for (i = 0; i < arrdata.length; i++) {
            palettecolor.push(arrdata[i]);
        }
    }

    this.setItemsSource = function (tm) {
        var vrow, vcol;
        var datalist;
        var i, j;
        var keyslist = [];

        datalist = JSON.parse(tm.getResult());
        vrow = datalist.length;
        for (var key in datalist[0]) {
            keyslist.push(key)
        }

        vcol = keyslist.length;

        var sb = [];
        for (i = 0; i < vrow; i++) {
            for (j = 0; j < vcol; j++) {
                sb.push(datalist[i][keyslist[j]]);
                sb.push(",");
            }
        }
        datalist = sb.join("");
        datalist = ozf_RemoveLastDelimiter(datalist, ",");
        draw(datalist, vrow, vcol);
    }

    function draw(datalist, rows, cols) {
        var arrdata = datalist.split(",");
        var i, j;
        var item;
        var root;
        var arritem = [];

        var value, name;
        var index = 0;
        var islast;
        root = new Object();
        root['name'] = 'root';
        root['children'] = [];

        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                if (j == cols - 1) { value = arrdata[index]; }
                else { name = arrdata[index]; }
                index = index + 1;
                if (j == cols - 2) { islast = true; }
                else { islast = false; }

                if (j == 0) {
                    item = find_child(root, name, islast);
                }
                else if (j < cols - 1) {
                    if (j < cols - 2) {
                        item = find_child(item, name, islast);
                    }
                    else {
                        item = find_child(item, name, islast);
                    }
                }
                else {
                    item['size'] = parseFloat(value);
                    delete item['children'];
                }
            }
        }
        draw_svg(root);
    }

    function find_child(pitem, findname, islast) {
        if (findname == "") {
            return pitem;
        }
        if (findname.trim() == "") {
            return pitem;
        }
        var i;
        var child;
        if (pitem.hasOwnProperty("children") == true) {
            for (i = 0; i < pitem['children'].length; i++) {
                child = pitem['children'][i];
                if (child['name'] == findname) {
                    return child;
                }
            }
        }
        child = new Object();
        child['name'] = findname;
        if (islast == false) {
            child['children'] = [];
        }
        if (pitem.hasOwnProperty("children") == true) {
            pitem['children'].push(child);
        }
        return child;
    }

    var width = 960,
       height = 700,
       radius = Math.min(width, height) / 2;
    var obj = this;
    var x = d3.scale.linear()
	    .range([0, 2 * Math.PI]);

    var y = d3.scale.linear()
	    .range([0, radius]);

    var svg;

    var partition = d3.layout.partition()
	    .value(function (d) { return d.size; });

    var arc = d3.svg.arc()
	    .startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
	    .endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
	    .innerRadius(function (d) { return Math.max(0, y(d.y)); })
	    .outerRadius(function (d) { return Math.max(0, y(d.y + d.dy)); });

    function draw_svg(node) {
        d3.select("svg").remove();
        svg = d3.select(obj.id).append("svg")
       .attr("width", width)
       .attr("height", height)
        .call(responsivefy)
       .append("g")
       .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 0) + ")");

        var g = svg.selectAll("g")
      .data(partition.nodes(node))
    .enter().append("g");

        var path = g.append("path")
          .attr("d", arc)
           .style("fill", function (d, i) {
               i = i % palettecolor.length;
               return palettecolor[i];
           })
          .on("click", click);

        var text = g.append("text")
          .attr("transform", function (d) { return "rotate(" + computeTextRotation(d) + ")"; })
          .attr("x", function (d) { return y(d.y); })
          .attr("dx", "6") // margin
          .attr("dy", ".35em") // vertical-align
          .text(function (d) { return d.name; });
        //.text(function(d) { return d.name + "(" + d.value.format() + ")"; });

        function click(d) {
            // fade out all text elements
            text.transition().attr("opacity", 0);

            path.transition()
              .duration(750)
              .attrTween("d", arcTween(d))
              .each("end", function (e, i) {
                  // check if the animated element's data e lies within the visible angle span given in d
                  if (e.x >= d.x && e.x < (d.x + d.dx)) {
                      // get a selection of the associated text element
                      var arcText = d3.select(this.parentNode).select("text");
                      // fade in the text element and recalculate positions
                      arcText.transition().duration(750)
                        .attr("opacity", 1)
                        .attr("transform", function () { return "rotate(" + computeTextRotation(e) + ")" })
                        .attr("x", function (d) { return y(d.y); });
                  }
              });
        }
    }

    d3.select(self.frameElement).style("height", height + "px");

    // Interpolate the scales!
    function arcTween(d) {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
        return function (d, i) {
            return i
                ? function (t) { return arc(d); }
                : function (t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
        };
    }

    function computeTextRotation(d) {
        return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
    }
}


//*******************************************************************
//  Chord
//*******************************************************************
function oz_chord(id) {
    this.id = '#' + id;
    this.init = function () {
        var sheet = document.createElement('style');
        sheet.innerHTML = "#tooltip {color: white;opacity: .9;background: #333;padding: 5px;border: 1px solid lightgrey;border-radius: 5px;position: absolute;z-index: 10;visibility: hidden;white-space: nowrap;pointer-events: none;}#circle circle {fill: none;pointer-events: all;}path.group {fill-opacity: .8;}path.chord {fill-opacity: .8;}text {font-size: 10px;}.titles{font-size: 14px;}#circle:hover path.fade {display: none;}";
        document.body.appendChild(sheet);
    }
    this.getEnabled = function () {
        return !$(this.id).prop('disabled');
    }
    this.setEnabled = function (val) {
        $(this.id).prop('disabled', !val);
    }
    this.getVisible = function () {
        if ($(this.id).prop('style').display == 'none') {
            return false;
        }
        else {
            return true;
        }
    }
    this.setVisible = function (val) {
        if (val == true) {
            $(this.id).prop('style').display = 'inline-block';
        }
        else {
            $(this.id).prop('style').display = 'none';
        }
    }
    this.clear = function () {
        d3.select("svg").remove();				// remove existing sankey diagram.
    }

    //*******************************************************************
    //  CHORD MAPPER 
    //*******************************************************************
    function chordMpr(data) {
        var mpr = {}, mmap = {}, n = 0,
            matrix = [], filter, accessor;

        mpr.setFilter = function (fun) {
            filter = fun;
            return this;
        },
        mpr.setAccessor = function (fun) {
            accessor = fun;
            return this;
        },
        mpr.getMatrix = function () {
            matrix = [];
            _.each(mmap, function (a) {
                if (!matrix[a.id]) matrix[a.id] = [];
                _.each(mmap, function (b) {
                    var recs = _.filter(data, function (row) {
                        return filter(row, a, b);
                    })
                    matrix[a.id][b.id] = accessor(recs, a, b);
                });
            });
            return matrix;
        },
        mpr.getMap = function () {
            return mmap;
        },
        mpr.printMatrix = function () {
            _.each(matrix, function (elem) {
                console.log(elem);
            })
        },
        mpr.addToMap = function (value, info) {
            if (!mmap[value]) {
                mmap[value] = { name: value, id: n++, data: info }
            }
        },
        mpr.addValuesToMap = function (varName, info) {
            var values = _.uniq(_.pluck(data, varName));
            _.map(values, function (v) {
                if (!mmap[v]) {
                    mmap[v] = { name: v, id: n++, data: info }
                }
            });
            return this;
        }
        return mpr;
    }
    //*******************************************************************
    //  CHORD READER
    //*******************************************************************
    function chordRdr(matrix, mmap) {
        return function (d) {
            var i, j, s, t, g, m = {};
            if (d.source) {
                i = d.source.index; j = d.target.index;
                s = _.where(mmap, { id: i });
                t = _.where(mmap, { id: j });
                m.sname = s[0].name;
                m.sdata = d.source.value;
                m.svalue = +d.source.value;
                m.stotal = _.reduce(matrix[i], function (k, n) { return k + n }, 0);
                m.tname = t[0].name;
                m.tdata = d.target.value;
                m.tvalue = +d.target.value;
                m.ttotal = _.reduce(matrix[j], function (k, n) { return k + n }, 0);
            } else {
                g = _.where(mmap, { id: d.index });
                m.gname = g[0].name;
                m.gdata = g[0].data;
                m.gvalue = d.value;
            }
            m.mtotal = _.reduce(matrix, function (m1, n1) {
                return m1 + _.reduce(n1, function (m2, n2) { return m2 + n2 }, 0);
            }, 0);
            return m;
        }
    }


    var palettecolor = ["#C4C4C4", "#000000", "#69B40F", "#C8125C", "#008FC8", "#10218B", "#134B24", "#737373"];
    this.setPalette = function (colorlist) {
        palettecolor = [];
        var i;
        var arrdata = colorlist.split(",");
        for (i = 0; i < arrdata.length; i++) {
            palettecolor.push(arrdata[i]);
        }
    }
    this.setItemsSource = function (tm) {
        var vrow, vcol;
        var datalist;
        var i, j;
        var keyslist = [];

        datalist = JSON.parse(tm.getResult());
        vrow = datalist.length;
        for (var key in datalist[0]) {
            keyslist.push(key)
        }

        vcol = keyslist.length;

        var sb = [];
        for (i = 0; i < vrow; i++) {
            for (j = 0; j < vcol; j++) {            
                sb.push(datalist[i][keyslist[j]]);
                sb.push(",");
            }
        }
        datalist = sb.join("");
        datalist = ozf_RemoveLastDelimiter(datalist, ",");
        draw(datalist, vrow, vcol);
    }

    function draw(datalist) {
        var arrdata = datalist.split(",");
        var i;
        var item;
        var arritem = [];
        var remain;
        var total = 0;
        for (i = 0; i < arrdata.length; i++) {
            remain = i % 3;
            switch (remain) {
                case 0:
                    item = new Object;
                    item['has'] = arrdata[i].trim();
                    break;
                case 1:
                    item['prefers'] = arrdata[i].trim();
                    break;
                default:
                    item['count'] = parseFloat(arrdata[i]);
                    total = total + item['count'];
                    arritem.push(item);
                    break;
            }
        }
        for (i = 0; i < arritem.length; i++) {
            item = arritem[i];
            item['count'] = (item['count'] / total) * 100;
            item['count'] = parseFloat(item['count'].toFixed(3));
        }
        draw_chord(arritem);
    }

    var obj = this;
    function draw_chord(data) {
        var root = data;
        var mpr = chordMpr(root);

        mpr
          .addValuesToMap('has')
          .setFilter(function (row, a, b) {
              return (row.has === a.name && row.prefers === b.name)
          })
          .setAccessor(function (recs, a, b) {
              if (!recs[0]) return 0;
              return +recs[0].count;
          });
        drawChords(mpr.getMatrix(), mpr.getMap());
    }
    //*******************************************************************
    //  DRAW THE CHORD DIAGRAM
    //*******************************************************************
    function drawChords(matrix, mmap) {
        var w = 800, h = 600, r1 = h / 2, r0 = r1 - 100;
        var col2 = " -> ";
        var innerRadius = Math.min(w, h) * .39,
        outerRadius = innerRadius * 1.09;

        //var color = ["#C4C4C4","#000000","#69B40F","#C8125C","#008FC8","#10218B","#134B24","#737373"];
        var fill = d3.scale.ordinal()
        .domain(d3.range(matrix.length))
        .range(palettecolor);


        var chord = d3.layout.chord()
            .padding(.04)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending)
            .matrix(matrix);

        var arc = d3.svg.arc()
	    .innerRadius(innerRadius)
	    .outerRadius(outerRadius);


        d3.select("svg").remove();
        var svg = d3.select(obj.id).append("svg")
            .attr("width", w)
            .attr("height", h)
            .call(responsivefy)
          	.append("svg:g")
              .attr("transform", "translate(" + (w / 2) + "," + (h / 2 + 10) + ")");

        var rdr = chordRdr(matrix, mmap);

        var g = svg.selectAll("g.group")
            .data(chord.groups)
          .enter().append("svg:g")
            .attr("class", "group")
            .on("mouseover", mouseover)
            .on("mouseout", function (d) {
                d3.select("#tooltip").style("visibility", "hidden")
                svg.selectAll("path.chord")
               .filter(function (d) { return d.source.index != -1 && d.target.index != -1; })
               .transition()
               .style("stroke-opacity", .80)
               .style("fill-opacity", .80);
            });

        g.append("svg:path")
  .style("stroke", function (d) { return fill(d.index); })
  .style("fill", function (d) { return fill(d.index); })
  .attr("d", arc);


        ////////////////////////////////////////////////////////////
        ////////////////// Append Ticks ////////////////////////////
        ////////////////////////////////////////////////////////////

        var ticks = svg.append("svg:g").selectAll("g.ticks")
            .data(chord.groups)
            .enter().append("svg:g").selectAll("g.ticks")
            .attr("class", "ticks")
            .data(groupTicks)
            .enter().append("svg:g")
            .attr("transform", function (d) {
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                    + "translate(" + outerRadius + 40 + ",0)";
            });

        ticks.append("svg:line")
            .attr("x1", 1)
            .attr("y1", 0)
            .attr("x2", 5)
            .attr("y2", 0)
            .style("stroke", "#000");

        ticks.append("svg:text")
            .attr("x", 8)
            .attr("dy", ".35em")
            .attr("transform", function (d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
            .style("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
            .text(function (d) { return d.label; });

        g.append("svg:text")
		  .each(function (d) { d.angle = (d.startAngle + d.endAngle) / 2; })
		   .attr("dx", ".70em")
		  .attr("dy", ".35em")
		  .attr("class", "titles")
		  .attr("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
		  .attr("transform", function (d) {
		      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
              + "translate(" + (innerRadius + 65) + ")"
              + (d.angle > Math.PI ? "rotate(180)" : "");
		  })
            .text(function (d) { return rdr(d).gname; });

        var chordPaths = svg.selectAll("path.chord")
        .data(chord.chords)
        .enter().append("svg:path")
        .attr("class", "chord")
        .style("stroke", function (d) { return d3.rgb(fill(d.source.index)).darker(); })
        .style("fill", function (d) { return fill(d.source.index); })
        .attr("d", d3.svg.chord().radius(innerRadius))
          .on("mouseover", function (d) {
              d3.select("#tooltip")
                .style("visibility", "visible")
                .html(chordTip(rdr(d)))
                .style("top", function () { return (d3.event.pageY - 100) + "px" })
                .style("left", function () { return (d3.event.pageX - 100) + "px"; })
          })
            .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });

        function chordTip(d) {
            var p = d3.format(".2%"), q = d3.format(",.3r")
            return "Chord Info:<br/>"
              + p(d.svalue / d.stotal) + " (" + q(d.svalue) + ") of "
              + d.sname + col2 + d.tname
              + (d.sname === d.tname ? "" : ("<br>"
              + p(d.tvalue / d.ttotal) + " (" + q(d.tvalue) + ") of "
              + d.tname + col2 + d.sname))
        }

        function groupTip(d) {
            var p = d3.format(".1%"), q = d3.format(",.3r")
            return "Group Info:<br/>"
                + d.gname + " : " + q(d.gvalue) + "<br/>"
                + p(d.gvalue / d.mtotal) + " of Matrix Total (" + q(d.mtotal) + ")"
        }

        function mouseover(d, i) {
            d3.select("#tooltip")
              .style("visibility", "visible")
              .html(groupTip(rdr(d)))
              .style("top", function () { return (d3.event.pageY - 80) + "px" })
              .style("left", function () { return (d3.event.pageX - 130) + "px"; })

            chordPaths.classed("fade", function (p) {
                return p.source.index != i
                    && p.target.index != i;
            });

            svg.selectAll("path.chord")
       .filter(function (d) { return d.source.index != i && d.target.index != i; })
       .transition()
       .style("stroke-opacity", 0.02)
       .style("fill-opacity", 0.02);

            svg.selectAll("path.chord")
            .filter(function (d) { return d.source.index == i && d.target.index == i; })
            .transition()
            .style("stroke-opacity", 1)
            .style("fill-opacity", 1);
        }
    }

    // Returns an array of tick angles and labels, given a group.
    function groupTicks(d) {
        var k = (d.endAngle - d.startAngle) / d.value;
        return d3.range(0, d.value, 1).map(function (v, i) {
            return {
                angle: v * k + d.startAngle,
                label: i % 5 ? null : v + "%"
            };
        });
    }//groupTicks
}