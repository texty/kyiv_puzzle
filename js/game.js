(function() {
    var pic_size = {
        width: 1900,
        height: 1343
    };

    var real = {
        left_top: [30.362, 50.515],
        right_top: [30.682, 50.526],
        left_bottom: [30.338, 50.379],
        right_bottom: [30.699, 50.377]
    };

    var pic = {
        left_top: [173.865, 149.215],
        right_top: [1766.244, 68.191],
        left_bottom: [55.264, 1215.481],
        right_bottom: [1850.616, 1231.967]
    };

    var factor = document.getElementById("main_map").width / pic_size.width;

    var project = projection()
        .x_domain([pic.left_top[0] * factor, pic.right_top[0] * factor])
        .x_range([real.left_top[0], real.right_top[0]])
        .y_domain([pic.left_top[1] * factor, pic.left_bottom[1] * factor])
        .y_range([real.left_top[1], real.left_bottom[1]]);


    document.getElementById("main_map").onload = function() {
        document.querySelector(".pick-up-table").style.height = this.height + "px";
    };

    d3.json("data/districts.geojson")
        .then(function(data) {
            var districts = data.features.map(function(d) {
                return {
                    id: d.properties.id,
                    area_name: d.properties.area_name,
                    cx: d.properties.cx,
                    cy: d.properties.cy,
                    size: turf.area(turf.bboxPolygon(turf.bbox(d.geometry)))
                }
            }).sort((a, b) => b.size - a.size);


            d3.select("svg")
                .selectAll("polygon")
                .data(data.features)
                .enter()
                .append("polygon")
                .attr("points", function(d) {
                    return d.geometry.coordinates[0].map(dd => project.invert(dd).join(",")).join(" ");
                })
                .attr("fill", "none")
                .attr("stroke","black")
                .attr("stroke-width",1);


            var imgs = d3.select(".pick-up-table")
                .selectAll(".pick-item")
                .data(districts)
                .enter()
                .append("div")
                .attr("class", "pick-item")
                .append("img")
                .attr("src", function(d) {return "data/Png_areas/b_" + d.area_name + ".png"})
                .attr("class", "draggable")
                .each(function(d){
                    this.onload = function(e) {
                        this.width = this.width * factor;
                        this.parentNode.style.width = this.width + "px";
                        this.parentNode.style.height = this.height + "px";

                        d.width = this.width;
                        d.height = this.height;

                        d.loaded = true;

                        if (imgs.filter(function(dd) { return !dd.loaded}).size() == 0) {
                            // Значить всі картинки завантажились і можна розраховувати позиції
                            console.log("LOADED");

                            imgs.each(function(dd) {
                                dd.x = this.offsetLeft;
                                dd.y = this.offsetTop;
                            });
                        }
                    };
                });


            var container = d3.select("#drag_container");

            d3.select(".pick-up-table")
                .selectAll(".draggable")
                .call(d3.drag()
                    .container(container.node())
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));


            container.on("click", function(){
                console.log(project([d3.event.layerX, d3.event.layerY]));
            });


            function dragstarted(d) {
                d3.select(this).classed("active", true);
            }

            function dragged(d) {
                d3.select(this)
                    .style("left", d3.event.x + "px")
                    .style("top", d3.event.y + "px");
            }

            function dragended(d) {
                //todo
                // check if we met conditions

                var p = project([d3.event.x + d.width / 2, d3.event.y + d.height / 2]);
                var distance = turf.distance(p, [d.cx, d.cy], {units: "meters"});
                console.log(distance);

                if (distance > 500) {
                    d3.select(this)
                        .transition()
                        .duration(700)
                        .style("left", d.x + "px")
                        .style("top", d.y + "px")
                        .on("end", function() {
                            d3.select(this)
                                .classed("active", false)
                                .style("left", null)
                                .style("top", null);
                        });
                } else {
                    var place = project.invert([d.cx, d.cy]);

                    console.log(place)

                    d3.select(this)
                        .transition()
                        .duration(700)
                        .style("left", place[0] - d.width / 2 + "px")
                        .style("top", place[1] - d.height / 2 + "px")
                        .on("end", function() {
                            d3.select(this)
                                .classed("active", false)
                                .classed("placed", true);
                            
                            d3.select(this.parentNode).classed("empty", true);

                            imgs.each(function(dd) {
                                dd.x = this.offsetLeft;
                                dd.y = this.offsetTop;
                            });
                        });
                }

            }





        });





    function projection() {
        var x = d3.scaleLinear();
        var y = d3.scaleLinear();

        function p(val) {
            return [x(val[0]), y(val[1])];
        }

        p.invert = function(val) {
            return [x.invert(val[0]), y.invert(val[1])];
        };


        p.x_domain = function(_) {
            if (!arguments.length) return x.domain();
            x.domain(_);
            return p;
        };

        p.y_domain = function(_) {
            if (!arguments.length) return y.domain();
            y.domain(_);
            return p;
        };

        p.x_range = function(_) {
            if (!arguments.length) return x.range();
            x.range(_);
            return p;
        };

        p.y_range = function(_) {
            if (!arguments.length) return x.range();
            y.range(_);
            return p;
        };

        return p;
    }

}());

