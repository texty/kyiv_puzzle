(function() {
    var bbox = {
        top: 50.1,
        right: 32.1,
        bottom: 48.1,
        left: 30.1
    };


    var original = {
        width: 1900,
        height: 1343
    };

    var factor = document.getElementById("main_map").width / original.width;

    d3.select(".pick-up-table")
        .selectAll("img.draggable")
        .each(function(d) {
            this.width = this.width * factor;
            this.parentNode.style.width = this.width + "px";
            this.parentNode.style.height = this.height + "px";

            d3.select(this).datum({x: this.offsetLeft, y: this.offsetTop})
        });


    var container = d3.select("#drag_container").node();

    d3.select(".pick-up-table")
        .selectAll(".draggable")
        .call(d3.drag()
            // .subject(function(){
            //
            //     return {x: this.offsetLeft, y: this.offsetTop}
            // })
            .container(container)
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));


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

    }


}());

