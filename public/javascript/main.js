/*
PHASE 2 & 3 
CCAPDEV S11
    Group Members: 
        Ng, Sherilyn Kaye
        Vizmanos, Julianne 
*/

// slideshow of images at the main page

var image = [];
var i = 0;
image[0] = "../images/main1.png";
image[1] = "../images/main2.png";
image[2] = "../images/main3.png";
image[3] = "../images/main4.png";
image[4] = "../images/main5.png";
function slideshow(){

    document.getElementById("feature").style
    document.getElementById("feature").src = image[i];

    if (i < image.length - 1)
    {
        i++;
    }
    else 
    {
        i = 0;
    }
    
    setTimeout("slideshow()", 5000);
}
window.onload = slideshow;


