var source   = document.getElementById("question-card-template").innerHTML;
var template = Handlebars.compile(source);

var region = ["obolon", "nivki", "galagany", "podil", "rusanivka", "troya", "vidradny", "voskresenka", "vynogradar", "syrez"];
var img_folder = "data/areas_one_size/";


var scenario = window.scenario.map(function(q, i) {
    return {
        total: 10,
        question_number: i + 1,
        img_path: img_folder + q.img + ".png",
        description: q.descr,
        text: q.text,
        answers: [q.ans0, q.ans1, q.ans2, q.ans3],
        correct: q.correct
    }

});


// for (var i = 0; i < 10; i++) {
//     scenario.push({
//         total: 10,
//         question_number: i+1,
//         img_path: "data/areas_one_size/" + region[i] + ".png",
//         img_path_answered: "data/areas_one_size/add_info/color_" + region[i] + ".png",
//
//         description: "Оболонь легко впізнати по характерній формі будинків на березі Дніпра. Таких немає у жодному іншому районі Києва",
//         answers: [
//             "Борщагівка",
//             "Оболонь",
//             "Нова Забудова (Голосіїво)",
//             "Троєщина"
//         ],
//         correct: 1
//     });
// }

var q_index = 0;

var card_container = d3.select("main");



document.getElementById("btn-game-start").addEventListener("click", function(){
    renderQuestion(0)
});



function renderQuestion(q_idx) {
    card_container.html(template(scenario[q_idx]));

    var buttons = card_container
        .selectAll(".answers button")
        .data([0, 1, 2, 3])
        .on("click", function(selected) {
            if (selected === scenario[q_idx].correct) {
                // correct

            } else {
                // wrong
                d3.select(this).classed("ans-wrong", true);

            }

            card_container.select(".description").classed("d-none", false);

            buttons
                .attr("disabled", true)
                .classed("ans-correct", ii => ii == scenario[q_idx].correct);

            card_container
                .select("#btn-next-question")
                .attr("disabled", null)
                .on("click", function(){
                    renderQuestion(q_idx + 1);
                });
        })

        .each(function() {


        });

    card_container.node().scrollIntoView(true);
}

function offset(el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

