// Test if MathML is supported by Reading System
// This is a hueristic:
// There are probably cases where this should return false because the screen readers we
//   know about (NVDA, JAWS, VoiceOver, TalkBack, ChromeVox) all handle MathML.
// So the basic assumption is that MathML is accessible if JS runs.
// Cases where this isn't true:
//		Linux (none of the above screen readers work there)
//		?? Non Safari on MacOS
function CanUseMathML() {
	var isLinux = function(){
		var matches = navigator.userAgent.match(/Linux/);
		return (matches!=null && matches.length==1);
	};
	return !isLinux();
}


// ForFach method for working on a nodelist as opposed to the built-in one for arrays
// IMHO, this makes for cleaner code
function ForEach(nodeList, callback, scope) {
  for (var i = 0; i < nodeList.length; i++) {
	 callback(nodeList[i], i, nodeList); // passes back stuff we need
  }
};


function MakeMathAccessible() {
	if (!CanUseMathML())
		return;
		
	var setARIAHidden = function(element) {
		element.setAttribute("aria-hidden", "true");
	};
	var unsetARIAHidden = function(element) {
		element.setAttribute("aria-hidden", "false");
		var parent = element.parentNode;
		if (parent.tagName == "div" || parent.tagName == "span") {
			parent.setAttribute("aria-hidden", "false");
		}
	};
	var changeImage = function(element) {
		if (element.getAttribute("role")=="math") {
			element.setAttribute("alt", "");
			element.setAttribute("aria-hidden", "true");
		}
	};
	var changeMathSpan = function(element) {
		if (element.getAttribute("role")=="math") {
			element.setAttribute("aria-hidden", "true");
		}
		if (element.getAttribute("class") && 
			 element.getAttribute("class").indexOf("MathMLNoDisplay") >=0) {
			element.parentNode.removeChild(element)
		}
	};
	
	ForEach( document.getElementsByTagName("math"), unsetARIAHidden );
	ForEach( document.getElementsByTagName("img"), changeImage );
	
	// used for HTML math case to remove the text from AT to avoid double speak
	ForEach( document.getElementsByTagName("span"), changeMathSpan );
	
	// make sure an MathJax CSS math is hidden, not needed for properly done pages
	ForEach( document.getElementsByClassName("MathJax"), setARIAHidden );
}
