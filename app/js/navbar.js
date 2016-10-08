/*jslint browser: true*/
/*global window*/
/* functions for navbar */

/* runs both the hamburger & cross and the dropdown feature */
	var navDrop = document.getElementById("navdropdown");
	var navHeight = document.getElementById("nav-height");

function show(target, drop) {
	"use strict";
	document.getElementById(target).style.display = "block";
	

	if (document.getElementById("nav-height").style.height == "512px") {
		document.getElementById("nav-height").style.height = "60px";
	} else {
		document.getElementById("nav-height").style.height = "512px"
	}
}

/* hides the relevant target */
function hide(target) {
	"use strict";
	document.getElementById(target).style.display = "none";
}