var source   = document.getElementById("question-card-template").innerHTML;
var template = Handlebars.compile(source);

var img_folder = "data/areas_one_size/";
var img_color_folder = "data/areas_one_size/add_info/";

var questions_total = 10;

var scenario = window.scenario.map(function(q, i) {
    return {
        total: questions_total,
        question_number: i + 1,
        img_path: img_folder + q.img + ".png",
        img_color_path: img_color_folder + "color_" + q.img + ".png",
        description: q.descr,
        text: q.text,
        answers: [q.ans0, q.ans1, q.ans2, q.ans3],
        correct: q.correct,
        color: q.color,
        next_button_text: i < questions_total - 1 ? "Наступне питання" : "Показати результат"
    }
});

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
            var q = scenario[q_idx];

            if (selected === q.correct) {
                // correct

            } else {
                // wrong
                d3.select(this).classed("ans-wrong", true);
            }

            card_container
                .select(".description")
                .classed("d-none", false);

            buttons
                .attr("disabled", true)
                .classed("ans-correct", ii => ii == q.correct);

            card_container
                .select("#btn-next-question")
                .attr("disabled", null)
                .on("click", function() {
                    if (q_idx === questions_total - 1) renderFinish();
                    else renderQuestion(q_idx + 1);
                });

            if (scenario[q_idx].color) {
                card_container
                    .select(".img-placeholder img")
                    .attr("src", q.img_color_path)
            }
        });

    card_container.node().scrollIntoView(true);
}

function renderFinish() {
    alert("кінець")



}

function offset(el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

