var xmlHttp = new XMLHttpRequest();
var adder = updateTheSum();
if (xmlHttp == null) alert('XMLHTTP not supported.');

function init() {
	var buttons = document.getElementsByClassName("button");
    for (var i = 0; i < buttons.length; ++i) {
        var classList = buttons[i].classList;
        classList.remove("completed");
        classList.remove("unable");
        buttons[i].getElementsByClassName("unread")[0].classList.remove("show");
        buttons[i].getElementsByClassName("unread")[0].classList.add("hide");
    	buttons[i].addEventListener("click", getNumber);
    }
    document.getElementById("info-bar").classList.remove("clickable");
    document.getElementById("sum").classList.add("disappear");
    document.getElementById("info-bar").removeEventListener("click", showTheSum);
    var sum = adder(0);
    adder(sum * -1);
}

function getNumber(e) {
    xmlHttp.onreadystatechange = function (button) {
        return function() {
            if (xmlHttp.readyState == 4 && button.getElementsByClassName("unread")[0].classList.contains("show")) {
            	if (xmlHttp.status == 200) {
            		button.getElementsByClassName("unread")[0].innerHTML = xmlHttp.responseText;
                    adder(parseInt(xmlHttp.responseText));
            		button.classList.add("completed");
            		recoverButtons();
            	}
                if (document.getElementsByClassName("completed").length == 5) {
                    document.getElementById("sum").innerHTML = adder(0);
                    document.getElementById("info-bar").classList.add("clickable");
                    document.getElementById("info-bar").addEventListener("click", showTheSum);
                }
            }
        };
    }(e.currentTarget);
    var span = e.currentTarget.getElementsByClassName("unread")[0];
    span.innerHTML = "...";
    span.classList.remove("hide");
    span.classList.add("show");
    xmlHttp.open("GET", "/", true);
    e.currentTarget.removeEventListener("click", getNumber);
    closeButtons(e.currentTarget);
    xmlHttp.send(null);
}

function showTheSum() {
    document.getElementById("sum").classList.remove("disappear");
    document.getElementById("info-bar").removeEventListener("click", showTheSum);
    document.getElementById("info-bar").classList.remove("clickable");
}

function updateTheSum() {
    var sum = 0;
    return function(num) {
        sum += num;
        return sum;
    }
}

function closeButtons(button) {
    var buttons = document.getElementsByClassName('button');
    for (var i = 0; i < buttons.length; ++i) {
    	if (buttons[i].offsetTop != button.offsetTop) {
    		buttons[i].classList.add("unable");
    		buttons[i].removeEventListener("click", getNumber);
    	}
    }
}

function recoverButtons() {
	var buttons = document.getElementsByClassName('unable');
    var toRecover = [];
	for (var i = 0; i < buttons.length; ++i) {
        toRecover.push(buttons[i]);
	}
    for (var i = 0; i < toRecover.length; ++i) {
        toRecover[i].classList.remove("unable");
        toRecover[i].addEventListener("click", getNumber);
    }
}

window.onload = function() {
    init();
    document.getElementById("button").addEventListener("mouseleave", init);
}