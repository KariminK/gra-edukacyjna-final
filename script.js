let reqbtn = $("#reqbtn");
let req = $(".req");
let fullscrnbtn = $(".switchfscrn");

$(reqbtn).click(function (e) { 
    e.preventDefault();
    $(req).toggleClass("hidden");
});
fullscrnbtn.addEventListener('click', ()=>{
    if (!document.fullscreenElement){
        document.documentElement.requestFullscreen();
    }else if(document.exitFullscreen){
        document.exitFullscreen();
    }
})