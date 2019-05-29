
document.getElementById("read-more").addEventListener("click", function(e){
    document.querySelector("main.main-text").scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth"
    });
    e.preventDefault();
    return false;
});

var dm_switch = document.querySelector(".dm-switch");

dm_switch.addEventListener("click", function(e){
    window.__dm_mode__ = ! window.__dm_mode__;
    dm_switch.classList.toggle("active")
});