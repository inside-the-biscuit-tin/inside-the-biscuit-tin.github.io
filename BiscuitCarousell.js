initialiseWidget();
function initialiseWidget(data){
    //variable exists, do what you want
    // var imageList = data.imageList;
    // var occasionList = data.occasionList;

biscuit_fp = "https://inside-the-biscuit-tin.github.io/Biscuits/"
imageList = [biscuit_fp + "Biscuits1.png",
        biscuit_fp + "Biscuits4.png",
        biscuit_fp + "Biscuits3_both.png",
        biscuit_fp + "Biscuits1.png",
        biscuit_fp + "Biscuits4.png",
        biscuit_fp + "Biscuits3_both.png",
        biscuit_fp + "Biscuits1.png",
        biscuit_fp + "Biscuits4.png",
        biscuit_fp + "Biscuits3_both.png"];

   
occasionList = ["Epidemics",
            "Moving",
            "Epidemics",
            "Epidemics",
            "Moving",
            "Epidemics",
            "Epidemics",
            "Moving",
            "Epidemics"];

    im_coords = [{left: "210px", top: "580px"},
                {left: "135px", top: "390px"},
                {left: "215px", top: "210"},
                {left: "400px", top: "140px"},
                {left: "585px", top: "220px"},
                {left: "665px", top: "400px"},
                {left: "590px", top: "590px"},
                {left: "395px", top: "665px"}];

    occasion_coords = []

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

    for (var i=0; i < 8; i++) {
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

        occasion.style.transformOrigin = "0px 400px";
        occasion.style.transform = `rotate(${angle}deg) translate(-50%,-140%)`;
    }

    function displayOccasion(occasion_str, i) {
        letters_fp = "https://inside-the-biscuit-tin.github.io/Letters/"
        
        occasion = document.querySelector("#occasion" + i.toString());
        occasion.innerHTML ="";

        N = occasion_str.length;
        for (var i=0; i < N; i++) {
            char = occasion_str[i];
            img = document.createElement("img");
            img.src = letters_fp + char.toUpperCase() + ".png";
            img.classList.add("letters");
            if (char == " ") {
                img.id = "letter_space";
            }

            cal_ratio = ((i+0.5)-(N/2))/(1.5*N);
            letter_shift = Math.round(Math.pow(cal_ratio,2) * 40);
            if (char=="m" || char =="M") {
                console.log("break")
            }
            rot_angle = cal_ratio * 25;
            img.style.transform = `translate(0,${letter_shift}px) rotate(${rot_angle}deg)`;

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
    document.documentElement.addEventListener("mouseup",endWind);

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
        if (e.target.type ="HTML") {
            if(winding) {
                winding = false;
            }
        }  else {
            winding=false;
        }
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
            out_occasion = document.getElementById("occasion0");
            out_biscuit = document.getElementById("biscuit0");
        } else if (rot_direction == 1) {
            out_occasion = document.getElementById("occasion6");
            out_biscuit = document.getElementById("biscuit6");
        }
        in_occasion = document.getElementById("occasion7");
        in_biscuit = document.getElementById("biscuit7");


        void container.offsetWidth;
        void bisc_growing.offsetWidth;
        void bisc_growing.parentElement.offsetWidth;
        void biscuit3.offsetWidth;
        void biscuit3.parentElement.offsetWidth;
        void out_occasion.offsetWidth;
        void in_occasion.offsetWidth;
        void out_biscuit.offsetWidth;
        void in_biscuit.offsetWidth;

        container.classList.add("rotate_container");

        bisc_growing.style.animationDirection = "normal";
        bisc_growing.classList.add("magnify_biscuit");
        bisc_growing.parentElement.classList.add("float_biscuit");

        biscuit3.style.animationDirection = "normal";
        biscuit3.classList.add("shrink_biscuit");
        biscuit3.parentElement.classList.add("sink_biscuit");

        in_occasion.style.visibility= "visible";
        in_biscuit.style.visibility= "visible";
        
        in_occasion.classList.add("fading_in");
        out_occasion.classList.add("fading_out");
        in_biscuit.classList.add("fading_in");
        out_biscuit.classList.add("fading_out");
    }

    function endAnimation() {
        container.classList.remove('rotate_container');  

        bisc_growing.classList.remove("magnify_biscuit");
        bisc_growing.parentElement.classList.remove("float_biscuit");

        biscuit3.classList.remove("shrink_biscuit");
        biscuit3.parentElement.classList.remove("sink_biscuit");

        in_occasion.classList.remove("fading_in");
        out_occasion.classList.remove("fading_out");
        in_biscuit.classList.remove("fading_in");
        out_biscuit.classList.remove("fading_out");
        out_occasion.style.visibility= "hidden";
        out_biscuit.style.visibility= "hidden";

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
        for (var i=0; i < 7; i++) {
            bisc_img = document.getElementsByClassName('biscuits')[i];
            bisc_div = bisc_img.parentElement;

            var style_obj = {width: null, height: null};
            computedStyle = window.getComputedStyle(bisc_div);
            style_obj.top = computedStyle.top;
            style_obj.left = computedStyle.left;

            occasion_div = document.getElementsByClassName("occasion")[i];

            ind = i - shift;
            if ( ind < 0 ) {
                bisc_img.id = "";
                unset_img = bisc_img;
                unset_occasion = occasion_div;
            } else if (ind == POSITION_NO) {
                bisc_img.id = "";
                unset_img = bisc_img;
                unset_occasion = occasion_div;
            } else {
                bisc_img.id = "biscuit" + ind.toString();
                bisc_img.parentElement.id = "bisc_div" + ind.toString();
                occasion_div.id = "occasion" + ind.toString();
            }
        }

        biscuit7 = document.getElementById("biscuit7");
        biscuit7.id = `biscuit${mod(7 - shift,8)}`;
        bisc_div7 = document.getElementById("bisc_div7");
        bisc_div7.id = `bisc_div${mod(7 - shift,8)}`;
        occasion7 = document.getElementById("occasion7");
        occasion7.id = `occasion${mod(7 - shift,8)}`;

        bisc_shrunk = document.getElementById(`biscuit${3 + rot_direction}`);
        bisc_grown = document.getElementById("biscuit3");

        ind = mod((carousell_pos+POSITION_NO-1), biscuit_n);
        unset_img.src = imageList[ind];
        unset_img.occasionAttached = occasionList[ind];
        unset_img.id = "biscuit7";
        unset_img.parentElement.id = "bisc_div7";
        unset_img.style.visibility = "hidden";

        occasion_str = occasionList[ind];
        unset_occasion.id = "occasion7";
        displayOccasion(occasion_str, 7);
        unset_occasion.style.visibility = "hidden";
        
        bisc_grown.style.transform = transform_str;
        bisc_grown.parentElement.style.zIndex = 4;
        bisc_shrunk.style.transform = t_origin_str;
        bisc_shrunk.parentElement.style.zIndex = 3;

        ind= mod(ROTATION_MEAS+7,8);

        unset_div = unset_img.parentElement;
        unset_div.style.transform = `translate(-50%,-50%) rotate(${mod(45*ROTATION_MEAS-180, 360)}deg)`;
        unset_div.style.top = im_coords[ind].top;
        unset_div.style.left = im_coords[ind].left;

        unset_occasion.style.transform = `rotate(${mod(45*ROTATION_MEAS-180, 360)}deg) translate(-50%,-140%)`

        if (rot_direction == 1) {
            bisc_div7.parentElement.prepend(bisc_div7);
            occasion7.parentElement.prepend(occasion7);
        } else if (rot_direction == -1) {
            unset_div.parentElement.append(unset_div);
            unset_occasion.parentElement.append(unset_occasion);
        }

        document.getElementById("container2").style.transform = `rotate(${mod((-ROTATION_MEAS*45), 360)}deg)`;

        for (var i = 0; i < 8; i++) {
            displayOccasion(document.getElementById("biscuit" + i.toString()).occasionAttached,i);
        }
    }

    function mod(n, m) {
      return ((n % m) + m) % m;
    }
}