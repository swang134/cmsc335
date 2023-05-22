window.onload = main;
function check(){
    for (const el of document.getElementById('form').querySelectorAll("[required]")) {
      if (!el.reportValidity()) {
        return;
      }
    }
    let valid = true;
    let text1 = document.getElementById("p1").value;
    let text2 = document.getElementById("p2").value;
    let text3 = document.getElementById("p3").value;
    let result = ""
    if(/^\d{3}$/.test(text1) === false){
        valid = false;
        result += "Invalid phone number\n";
    }else if(/^\d{3}$/.test(text2) === false){
        valid = false;
        result += "Invalid phone number\n";
    } else if(/^\d{4}$/.test(text3) === false){
        valid = false;
        result += "Invalid phone number\n";
    }
    
    let checked = false;
    if(document.getElementById('b1').checked) 
        checked = true;
    if(document.getElementById('b2').checked) 
        checked = true;
    if(document.getElementById('b3').checked) 
        checked = true;
    if(document.getElementById('b4').checked) 
        checked = true;
    if(document.getElementById('b5').checked){
        if(checked === true){
            valid = false;
            result += "Invalid conditions selection\n";
        }
        checked = true;
    } 
    
    if(checked === false){
        valid = false;
        result += "No conditions selected\n";
    }
    
    let selected = false;
    if(document.getElementById('r1').checked) 
        selected = true;
    else if(document.getElementById('r2').checked) 
        selected = true;
    else if(document.getElementById('r3').checked) 
        selected = true;
    else if(document.getElementById('r4').checked) 
        selected = true;
    if(selected === false){
        valid = false;
        result += "No time period selected\n";
    }
    
    let i1 = document.getElementById("id1").value;
    let i2 = document.getElementById("id2").value;
    if(/^A\d{3}$/.test(i1) === false){
        valid = false;
        result += "Invalid study id \n";
    }else if(/^B\d{3}$/.test(i2) === false){
        valid = false;
        result += "Invalid study id\n";
    }
    
    if(valid){
        result = "Do you want to submit the form data?";
        valid = confirm(result);
    }else 
        alert(result);
    return valid;
}