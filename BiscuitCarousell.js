
biscuit_fp = "https://inside-the-biscuit-tin.github.io/Biscuits/"
imageList = [biscuit_fp + "Biscuits1.png",
        biscuit_fp + "Biscuits4.png",
        biscuit_fp + "Biscuits3_both.png",
        biscuit_fp + "Biscuits1.png",
        biscuit_fp + "Biscuits4.png",
        biscuit_fp + "Biscuits3_both.png",
        biscuit_fp + "Biscuits1.png"];

letters_fp = "https://inside-the-biscuit-tin.github.io/Letters/"
occasionList = ["Epidemics",
            "Moving",
            "Epidemics",
            "Epidemics",
            "Moving",
            "Epidemics",
            "Epidemics"];

im_coords = [{left: "210px", top: "580px"},
            {left: "135px", top: "390px"},
            {left: "215px", top: "210"},
            {left: "400px", top: "140px"},
            {left: "585px", top: "220px"},
            {left: "665px", top: "400px"},
            {left: "590px", top: "590px"},
            {left: "395px", top: "665px"}];

transform_str = window.getComputedStyle(document.documentElement).getPropertyValue('--biscuit-transform');
t_origin_str = "scale(1,1) translate(0,0)";

carousell_pos = 0;
POSITION_NO = 7;
ROTATION_MEAS = 0;
biscuit_n = imageList.length;

stepping = false;
winding = false;
mouse_raised = false;
untaken_steps = 0;
untaken_step_dirs = [];

for (var i=0; i < 7; i++) {
    img = document.querySelector("#biscuit" + i.toString());
    img.src = imageList[i];

    bisc_div = document.querySelector("#bisc_div" + i.toString());

    bisc_div.style.top = im_coords[i].top;
    bisc_div.style.left = im_coords[i].left;

    angle = i*45 - 135;
    initial_transform = `translate(-50%,-50%) rotate(${angle}deg)`
    bisc_div.style.transform = initial_transform;
    bisc_div.style.zIndex = 3;
    if(i == 3) {
        img.style.transform = transform_str;
        img.style.zIndex = 4;
    } 
    img.occasionAttached = occasionList[i];

    occasion = document.querySelector("#occasion" + i.toString());

    displayOccasion(occasionList[i],i);
}

function displayOccasion(occasion_str, i) {
    occasion = document.querySelector("#occasion" + i.toString());
    occasion.innerHTML ="";

    for (var i=0; i <occasion_str.length; i++) {
        char = occasion_str[i];
        img = document.createElement("img");
        img.src = letters_fp + char.toUpperCase() + ".png";
        img.classList.add("letters")
        occasion.appendChild(img);
    }
}

container = document.getElementById("container");
controls = document.getElementById("controls_div");
step_forward = document.getElementById("step_forward");
step_back = document.getElementById("step_back");
forward_wind = document.getElementById("forward_wind");
rewind = document.getElementById("rewind");

step_forward.setAttribute('draggable', false);
step_back.setAttribute('draggable', false);
forward_wind.setAttribute('draggable', false);
rewind.setAttribute('draggable', false);

forward_wind.addEventListener("mousedown", initiateWind);
rewind.addEventListener("mousedown", initiateWind);
forward_wind.addEventListener("mouseup", endWind);
rewind.addEventListener("mouseup", endWind);

step_back.addEventListener("click", initiateStep);
step_forward.addEventListener("click", initiateStep);

function initiateStep (e) {
    clicked_el = e.target;
    e.preventDefault();

    if (!stepping && !winding) {
        document.documentElement.style.setProperty("--rot-anim-dur","0.7s");

        setDirectionParameters(e.target.id);
        
        initiateAnimation();
        stepping=true;
    } else if (stepping && !winding) {
        untaken_steps +=1;
        untaken_step_dirs.push(e.target.id);
    }
}

function initiateWind(e) {
    if (!winding && !stepping) {
        if (e.target.id == "forward_wind") {
            rot_direction = 1;
        } else if (e.target.id == "rewind") {
            rot_direction = -1;
        }

        document.documentElement.style.setProperty("--rot-anim-dur","0.45s");
        // document.documentElement.style.setProperty("--rot-anim-dur","0.2s");
        // document.documentElement.style.setProperty("--rot-anim-dur","0.2s");

        winding=true;
        initiateAnimation();
    } 
}

function endWind(e) {
    winding=false;
}
function setDirectionParameters(step_dir) {
    if (step_dir == "step_back") {
            rot_direction = -1;
            out_occasion = document.getElementById("occasion1");
            in_occasion = document.getElementById("occasion6");
    } else if (step_dir == "step_forward") {
        rot_direction = 1;
        out_occasion = document.getElementById("occasion5");
        in_occasion = document.getElementById("occasion0");
    }
}


container.addEventListener("animationend", function(e) {
    if (e.target.id == "container") {
        if (winding) {
            endAnimation();
            initiateAnimation();
        } else if (!winding && untaken_steps) {
            endAnimation();

            setDirectionParameters(untaken_step_dirs[0]);
            untaken_step_dirs.shift();
            untaken_steps -= 1;

            initiateAnimation();
        } else {
            endAnimation();
            stepping = false;
        }
    }
});
// container.addEventListener("animationiteration", checkWindStop); 
// container.addEventListener("webkitAnimationIteration", checkWindStop);

function initiateAnimation() {
    document.documentElement.style.setProperty('--rot-direction',rot_direction);

    biscuit3 = document.getElementById("biscuit3");
    bisc_growing = document.getElementById(`biscuit${3 - rot_direction}`);
    occasion_div = document.getElementById("occasion_div");
    if (rot_direction == -1) {
        out_occasion = document.getElementById("occasion1");
        in_occasion = document.getElementById("occasion6");
    } else if (rot_direction == 1) {
        out_occasion = document.getElementById("occasion5");
        in_occasion = document.getElementById("occasion0");
    }


    void container.offsetWidth;
    void bisc_growing.offsetWidth;
    void bisc_growing.parentElement.offsetWidth;
    void biscuit3.offsetWidth;
    void biscuit3.parentElement.offsetWidth;
    void out_occasion.offsetWidth;
    void in_occasion.offsetWidth;

    container.classList.add("rotate_container");

    bisc_growing.classList.add("magnify_biscuit");
    bisc_growing.parentElement.classList.add("float_biscuit");

    biscuit3.classList.add("shrink_biscuit");
    biscuit3.parentElement.classList.add("sink_biscuit");

    occasion_div.classList.add("shift_occasions");

    in_occasion.style.visibility= "visible";
    in_occasion.style.animationDirection = "reverse";
    out_occasion.style.animationDirection = "forward";
    
    in_occasion.classList.add("fading_occasions");
    out_occasion.classList.add("fading_occasions");
}

function endAnimation() {
    container.classList.remove('rotate_container');  

    bisc_growing.classList.remove("magnify_biscuit");
    bisc_growing.parentElement.classList.remove("float_biscuit");

    biscuit3.classList.remove("shrink_biscuit");
    biscuit3.parentElement.classList.remove("sink_biscuit");

    occasion_div.classList.remove("shift_occasions");

    in_occasion.classList.remove("fading_occasions");
    out_occasion.classList.remove("fading_occasions");
    in_occasion.style.visibility= "hidden";

    adjustForRotation(rot_direction);
}

function checkWindStop(e) {
    if(e.target.id == "container" && !winding) {
        endAnimation();
    }
}

function adjustForRotation(rot_direction) {

    if (rot_direction == -1) {
        shift = 1;
        carousell_pos = mod((carousell_pos + shift), biscuit_n);
        ROTATION_MEAS += 1;
    } else if (rot_direction == 1) {
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
        }
    }

    bisc_shrunk = document.getElementById(`biscuit${3 + rot_direction}`);
    bisc_grown = document.getElementById("biscuit3");

    ind = mod((carousell_pos+POSITION_NO-1), biscuit_n);
    unset_img.src = imageList[ind];
    unset_img.occasionAttached = occasionList[ind];
    unset_img.id = `biscuit${mod(7 + rot_direction,8)}`;
    unset_img.parentElement.id = `bisc_div${mod(7 + rot_direction,8)}`;
    
    bisc_grown.style.transform = transform_str;
    bisc_grown.parentElement.style.zIndex = 4;
    bisc_shrunk.style.transform = t_origin_str;
    bisc_shrunk.parentElement.style.zIndex = 3;

    ind= mod(ROTATION_MEAS+7-shift,8);

    unset_div = unset_img.parentElement;
    unset_div.style.transform = `translate(-50%,-50%) rotate(${mod((ind*45)-135, 360)}deg)`;
    unset_div.style.top = im_coords[ind].top;
    unset_div.style.left = im_coords[ind].left;
    if (rot_direction == 1) {
        unset_div.parentElement.prepend(unset_div);
    } else if (rot_direction == -1) {
        unset_div.parentElement.append(unset_div);
    }

    document.getElementById("container2").style.transform = `rotate(${mod((-ROTATION_MEAS*45), 360)}deg)`;

    for (var i = 0; i < 7; i++) {
        displayOccasion(document.getElementById("biscuit" + i.toString()).occasionAttached,i);
        if (document.getElementById("biscuit" + i.toString()).occasionAttached==undefined) {
            console.log("break");
        }
    }
}

function mod(n, m) {
  return ((n % m) + m) % m;
}