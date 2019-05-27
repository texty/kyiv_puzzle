var source = document.getElementById("question-card-template").innerHTML;
var template = Handlebars.compile(source);

var source_final  = document.getElementById("final-card-template").innerHTML;
var final_template = Handlebars.compile(source_final);

var img_folder = "data/districts/";
var img_color_folder = "data/districts_color/";
var img_locator_folder = "data/map/";

var questions_total = 10;

var locator_imgs = ["clear.png"];
window.scenario.forEach(q => locator_imgs.push(q.img + ".png"));


var scenario = window.scenario.map(function(q, i) {
    return {
        total: questions_total,
        question_number: i + 1,
        img_path: img_folder + q.img + ".png",
        img_color_path: img_color_folder + "color_" + q.img + ".png",
        img_locator_path: img_locator_folder + q.img + ".png",
        description: q.descr,
        text: q.text,
        answers: [q.ans0, q.ans1, q.ans2, q.ans3],
        correct: q.correct,
        color: q.color,
        next_button_text: i < questions_total - 1 ? "Наступне запитання" : "Показати результат",
        locator_before: locator_imgs.slice(0, i + 1)
    }
});

var correct_count = 0;

var card_container = d3.select("main");


document.getElementById("btn-game-start").addEventListener("click", function(){
    d3.select(".first-screen").classed("first-screen", false);
    renderQuestion(0)
});

function renderQuestion(q_idx) {
    var q = scenario[q_idx];
    card_container.html(template(q));
    
    card_container
        .selectAll(".question-counter span")
        .classed("active", (d, i) => i === q_idx);

    var buttons = card_container
        .selectAll(".answers button")
        .data([0, 1, 2, 3])
        .on("click", function(selected) {
            
            if (selected == q.correct) {
                // correct
                correct_count++;
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
                .classed("d-none", false)
                .on("click", function() {
                    if (q_idx === questions_total - 1) renderFinish(correct_count, questions_total);
                    else renderQuestion(q_idx + 1);
                });

            if (scenario[q_idx].color) {
                card_container
                    .select(".img-placeholder img")
                    .attr("src", q.img_color_path)
            }

            card_container.select(".locator-map").append("img").attr("src", q.img_locator_path);

        });

    card_container.node().scrollIntoView(true);
    if (q.color) preload(q.img_color_path);
}

function renderFinish(score, total) {
    window.final.forEach(function(r) {
        r.min_score = +r.score.split(";")[0];
        r.max_score = +r.score.split(";")[1];
    });

    var result = window.final.filter(r => score >= r.min_score && score <= r.max_score)[0];

    card_container.classed("result-screen", true);
    card_container.html(final_template({score: score, total: total, result: result}));
    card_container.node().scrollIntoView(true);
}

function offset(el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

function preload(image_path) {
    if (document.images) {
        var img1 = new Image();
        img1.src = image_path;
    }
}