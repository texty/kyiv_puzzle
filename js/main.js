
document.getElementById("read-more").addEventListener("click", function(e){
    document.querySelector("main.main-text").scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth"
    });
    e.preventDefault();
    return false;
});

