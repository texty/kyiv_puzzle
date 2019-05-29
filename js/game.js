var source = document.getElementById("question-card-template").innerHTML;
var source_final  = document.getElementById("final-card-template").innerHTML;
var all_regions_source  = document.getElementById("all-regions-template").innerHTML;

var template = Handlebars.compile(source);
var final_template = Handlebars.compile(source_final);
var all_regions_template = Handlebars.compile(all_regions_source);

var img_folder = "data/districts/";
var img_color_folder = "data/districts_color/";
var img_locator_folder = "data/map/";

var questions_total = 10;

var locator_imgs;

window.__questions__= window.__questions__.map(function(q, i) {
    return {
        total: questions_total,
        img: q.img,
        img_path: img_folder + q.img + ".png",
        img_color_path: img_color_folder + "color_" + q.img + ".png",
        img_locator_path: img_locator_folder + q.img + ".png",
        description: q.descr,
        text: q.text,
        correct: q.ans0,
        ans0: q.ans0,
        ans1: q.ans1,
        ans2: q.ans2,
        ans3: q.ans3,
        color: q.color
    }
});

var scenario
    , correct_count
    , card_container = d3.select("main")
    ;



document.getElementById("btn-game-start").addEventListener("click", function(){
    startGame();
    d3.select(".main-text").remove();
});

function startGame() {
    scenario = shuffle(window.__questions__.slice()).slice(0, questions_total);

    locator_imgs = ["clear.png"];
    scenario.forEach(q => locator_imgs.push(q.img + ".png"));

    scenario.forEach(function(q, i){
        q.question_number = i + 1;
        q.next_button_text = i < questions_total - 1 ? "Наступне запитання" : "Показати результат";
        q.locator_before = locator_imgs.slice(0, i + 1);
        q.answers = shuffle([q.ans0, q.ans1, q.ans2, q.ans3]);
    });

    correct_count = 0;
    d3.select("main").attr("class", "");
    renderQuestion(0)
}

function renderQuestion(q_idx) {
    var q = scenario[q_idx];
    card_container.html(template(q));
    
    card_container
        .selectAll(".question-counter span")
        .classed("active", (d, i) => i === q_idx);

    var buttons = card_container
        .selectAll(".answers button")
        .data(q.answers)
        .on("click", function(selected) {
            if (selected == q.correct) {
                // correct
                correct_count++;
            } else {
                // wrong
                d3.select(this).classed("ans-wrong", true);
                playWrong();
            }

            card_container
                .select(".description")
                .classed("d-none", false);

            buttons
                .attr("disabled", true)
                .classed("ans-correct", c_ans => c_ans == q.correct);

            card_container
                .select("#btn-next-question")
                .attr("disabled", null)
                .attr("autofocus", true)
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
    window.__final__.forEach(function(r) {
        r.min_score = +r.score.split(";")[0];
        r.max_score = +r.score.split(";")[1];
    });

    var result = window.__final__.filter(r => score >= r.min_score && score <= r.max_score)[0];

    card_container.classed("result-screen", true);
    card_container.html(final_template({score: score, total: total, result: result}));
    card_container.node().scrollIntoView(true);

    d3.select("#btn-view-districts")
        .on("click", function() {
            card_container
                .classed("result-screen", false)
                .html(all_regions_template());

            d3.select("#btn-game-restart")
                .on("click", startGame);
        });

    d3.select("#btn-replay")
        .on("click", function() {
            startGame();
        })
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

function shuffle(array) {

    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function playWrong() {
    document.getElementById('audiotag1').play();
}