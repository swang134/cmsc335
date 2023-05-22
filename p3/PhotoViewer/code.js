window.onload = main; /* When main should be called */
pictures = [];
index = 0;
l = false;
let idGlobal;
let idRamdom;
const intervalInMilliseconds = 1000;

function main() {
    document.getElementById("img").addEventListener("click", next);
}

function load() {
    let s = Number(document.querySelector("#start").value); 
    let e = Number(document.querySelector("#end").value);
    if (s > e){
        document.querySelector("#msg").innerHTML = "Error: Invalid Range";
    }else {
        let p = document.querySelector("#path").value;
        let n = document.querySelector("#name").value;
        let start = s; 
        let size = e-s+1;
        pictures.length = size;
        for(i=0; i<pictures.length; i++){
            pictures[i] = p+n+start+".jpg";
            start++;
        }
        document.getElementById("img").src = pictures[0];
        document.querySelector("#msg").innerHTML = "Photo Viewer System";
        document.getElementById("display").value = pictures[0];
        l = true;
    }
}

function next() {
    if (l ===false){
        document.querySelector("#msg").innerHTML = "Error: you must load data first";
    }else {
        if(index === pictures.length-1){
            index = 0;
        }else{
            index++;
        }
        document.getElementById("img").src = pictures[index];
        document.getElementById("display").value = pictures[index];
    }
}

function previous() {
    if (l ===false){
        document.querySelector("#msg").innerHTML = "Error: you must load data first";
    }else {
        if(index === 0){
            index = pictures.length-1;
        }else{
            index--;
        }
        document.getElementById("img").src = pictures[index];
        document.getElementById("display").value = pictures[index];
    }
}


let first = () => {
    if (l ===false){
        document.querySelector("#msg").innerHTML = "Error: you must load data first";
    }else {
        index = 0;
        document.getElementById("img").src = pictures[0];
        document.getElementById("display").value = pictures[0];
    }
}

let last = () => {
    if (l ===false){
        document.querySelector("#msg").innerHTML = "Error: you must load data first";
    }else {
        index = pictures.length-1;
        document.getElementById("img").src = pictures[pictures.length-1];
        document.getElementById("display").value = pictures[pictures.length-1];
    }
}

function inorder(){
    if (l ===false){
        document.querySelector("#msg").innerHTML = "Error: you must load data first";
    }else {
        idGlobal = setInterval("swapImages()", intervalInMilliseconds);
    }
}

function random(){
    if (l ===false){
        document.querySelector("#msg").innerHTML = "Error: you must load data first";
    }else {
        idRandom = setInterval("randomImages()", intervalInMilliseconds);
    }
}

function swapImages() {
    let imageElement = document.querySelector("#img");
    let currentImage = imageElement.src, nextImage;
    nextImage = pictures[0];
    for(let i=0; i<pictures.length-1; i++){
        if (currentImage.includes(pictures[i])) {
                nextImage = pictures[i+1];
        }
    }
    imageElement.src = nextImage;
    document.getElementById("display").value = nextImage;
}

function randomImages() {
    let imageElement = document.querySelector("#img");
    let currentImage = imageElement.src, nextImage;
    let r = Math.floor(Math.random() * pictures.length);
    nextImage = pictures[r];
    imageElement.src = nextImage;
    document.getElementById("display").value = nextImage;
}
        
function stopAnimation() {
    if (l ===false){
        document.querySelector("#msg").innerHTML = "Error: you must load data first";
    }else {
        clearInterval(idGlobal);
        clearInterval(idRandom);
        l = false;
    }
}