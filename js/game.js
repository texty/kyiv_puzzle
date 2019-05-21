var source   = document.getElementById("question-card-template").innerHTML;
var template = Handlebars.compile(source);


document.getElementById("start").addEventListener("click", function(){
    document.getElementById("card-placeholder").innerHTML = template({});



});


