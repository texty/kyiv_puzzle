var source   = document.getElementById("question-card-template").innerHTML;
var template = Handlebars.compile(source);

var region = ["obolon", "nivki", "galagany", "podil", "rusanivka", "troya"];

var scenario = [];

for (var i = 0; i<10; i++) {
    scenario.push({
        total: 10,
        question_number: i+1,
        img_path: "data/areas_one_size/" + region[i] + ".png"
    });
}

var q_index = 0;

var card_container = document.querySelector("main");

document.getElementById("btn-game-start").addEventListener("click", function(){
    renderQuestion(0)
});



function renderQuestion(i) {
    card_container.innerHTML = template(scenario[i]);
    document.getElementById("btn-next-question").addEventListener("click", function() {
       renderQuestion(i+1);
    });

    card_container.scrollIntoView(true);
}

function offset(el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

