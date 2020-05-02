imageList = ["https://inside-the-biscuit-tin.github.io/Biscuits1.png",
        "https://inside-the-biscuit-tin.github.io/Biscuits4.png",
        "https://inside-the-biscuit-tin.github.io/Biscuits3_both.png",
        "https://inside-the-biscuit-tin.github.io/Biscuits1.png",
        "https://inside-the-biscuit-tin.github.io/Biscuits4.png",
        "https://inside-the-biscuit-tin.github.io/Biscuits3_both.png",
        "https://inside-the-biscuit-tin.github.io/Biscuits1.png"];

im_coords = [{left: "210px", top: "580px"},
            {left: "135px", top: "390px"},
            {left: "215px", top: "210"},
            {left: "400px", top: "140px"},
            {left: "585px", top: "220px"},
            {left: "665px", top: "400px"},
            {left: "590px", top: "590px"},
            {left: "395px", top: "665px"}];

translate_str = "translate(0,+20%)";
translate_str2 = "translate(0,0)";

carousell_pos = 0;
POSITION_NO = 7;
ROTATION_MEAS = 0;
biscuit_n = imageList.length;

for (var i=0; i < 7; i++) {
    img = document.querySelector("#biscuit" + i.toString());
    img.src = imageList[i];

    bisc_div = document.querySelector("#bisc_div" + i.toString());

    bisc_div.style.top = im_coords[i].top;
    bisc_div.style.left = im_coords[i].left;

    angle = i*45 - 135;
    bisc_div.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`;
    if(i == 3) {
        img.style.transform = "scale(1.5,1.5)" + translate_str;
        img.style.zIndex = 4;
    }
}

container = document.getElementById("container");

container.addEventListener("click", function(e) {
    e.preventDefault();

    biscuit2= document.getElementById("biscuit2");
    biscuit3= document.getElementById("biscuit3");

    // container.classList.remove("rotate");


    void container.offsetWidth;
    void biscuit2.offsetWidth;
    void biscuit2.parentElement.offsetWidth;
    void biscuit3.offsetWidth;
    void biscuit3.parentElement.offsetWidth;

    container.classList.add("rotate_container");

    biscuit2.classList.add("magnify_biscuit");
    biscuit2.parentElement.classList.add("float_biscuit");

    biscuit3.classList.add("shrink_biscuit");
    biscuit3.parentElement.classList.add("sink_biscuit");
});

container.addEventListener("animationend", function(e) {
    if(e.target.id == "container") {
        container.classList.remove('rotate_container');  

        biscuit2.classList.remove("magnify_biscuit");
        biscuit2.parentElement.classList.remove("float_biscuit");

        biscuit3.classList.remove("shrink_biscuit");
        biscuit3.parentElement.classList.remove("sink_biscuit");

        adjustForRotation("forward");
    }
});

// biscuit2.addEventListener("animationend", function(e) {

// });

// biscuit3.addEventListener("animationend", function(e) {
// adjustForShrinking();
// biscuit3.classList.remove("shrink_biscuit");
// });

function adjustForRotation(rot_direction) {

    if (rot_direction == "back") {
        shift = 1;
        carousell_pos = mod((carousell_pos + shift), biscuit_n);
        ROTATION_MEAS += 1;
    } else if (rot_direction == "forward") {
        shift = -1;
        carousell_pos = mod((carousell_pos + shift), biscuit_n);
        ROTATION_MEAS -= 1;
    }

    var unset_img;
    for (var i=0; i < POSITION_NO; i++) {
        bisc_img = document.getElementsByClassName('biscuits')[i];
        bisc_div = bisc_img.parentElement;

        var style_obj = {width: null, height: null};
        computedStyle = window.getComputedStyle(bisc_div);
        style_obj.top = computedStyle.top;
        style_obj.left = computedStyle.left;

        ind = i - shift;
        if ( ind < 0 ) {
            bisc_img.id = "";
            unset_img = bisc_img;
        } else if (ind == POSITION_NO) {
            bisc_img.id = "";
            unset_img = bisc_img;
        } else {
            bisc_img.id = "biscuit" + ind.toString();
            bisc_img.parentElement.id = "bisc_div" + ind.toString();
            // bisc_div.style.left = style_obj.left;
            // bisc_div.style.top = style_obj.top;
        }
    }

    // rotation_angle = (ROTATION_MEAS * 45) % 360;
    // biscuit4_origin = `translate(-50%,-50%) rotate(${rotation_angle + 45}deg) scale(1,1)`;
    // biscuit3_origin = `translate(-50%,-50%) rotate(${rotation_angle}deg) scale(2,2)`;
    // biscuit2_origin = `translate(-50%,-50%) rotate(${rotation_angle - 45}deg) scale(1,1)`;

    biscuit2 = document.getElementById("biscuit2");
    biscuit3 = document.getElementById("biscuit3");
    biscuit4 = document.getElementById("biscuit4");

    if (rot_direction == "back") {
        unset_img.src = imageList[mod((carousell_pos+POSITION_NO-1), biscuit_n)];
        unset_img.id = "biscuit6";
        unset_img.parentElement.id = "bisc_div6";
        
        biscuit3.style.transform = "scale(1.5,1.5) " + translate_str;
        biscuit3.parentElement.style.zIndex = 4;
        biscuit2.style.transform = "scale(1,1)" + translate_str2;
        biscuit2.parentElement.style.zIndex = 3;
    } else if (rot_direction == "forward") {
        unset_img.src = imageList[carousell_pos];
        unset_img.id = "biscuit0";
        unset_img.parentElement.id = "bisc_div0";
        biscuit3.style.transform = "scale(1.5,1.5)" + translate_str;
        biscuit3.parentElement.style.zIndex = 4;
        biscuit4.style.transform = "scale(1,1)" + translate_str2;
        biscuit4.parentElement.style.zIndex = 3;
    }
    ind= mod(ROTATION_MEAS+7-shift,8);

    unset_div = unset_img.parentElement;
    unset_div.style.transform = `translate(-50%,-50%) rotate(${mod((ind*45)-135, 360)}deg)`;
    unset_div.style.top = im_coords[ind].top;
    unset_div.style.left = im_coords[ind].left;
    unset_div.parentElement.prepend(unset_div)

    document.getElementById("container2").style.transform = `rotate(${mod((-ROTATION_MEAS*45), 360)}deg)`;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}