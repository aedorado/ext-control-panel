chrome.management.getAll(function(allExtensions) {
	allExtensions.sort(function(left, right){
	    var nameorder = left.name === right.name ? 0 : (left.name < right.name ? -1 : 1);
	    if(
	        (left.enabled && right.enabled) || 
	        (!left.enabled && !right.enabled)
	    ) {
	        return nameorder;
	    } else if(left.enabled) {
	        return -1;
	    } else {
	        return 1;
	    }
	});

	allExtensions.forEach(function(extension) {
		display(extension);
		console.log(extension);
	});
});

function display(extension) {
	var container = document.getElementById('container');

	var extensionDiv = document.createElement('div');
	extensionDiv.classList.add(extension.enabled? 'extension-div-enabled': 'extension-div-disabled');

	// create and append the name div
	var nameDiv = document.createElement('div');	// <div class="name-div">Grammarly</div>
	nameDiv.classList.add('name-div');
	nameDiv.innerHTML = extension.name;
	extensionDiv.appendChild(nameDiv);

	// create the desc div
	// <div class="desc">this extension does this this extension does this this extension does this</div>
	var descDiv = document.createElement('div');
	descDiv.classList.add('desc-div');
	descDiv.setAttribute('title', extension.description);
	descDiv.innerHTML = extension.description.length >= 85 ? (extension.description.substring(0, 85) + '...') : extension.description;

	//  create an aptions div which is part of the left div
	//  <div class="options">
	var optionsDiv = document.createElement('div');

	var checkbox = document.createElement('input');
	checkbox.setAttribute('id', extension.id);
	checkbox.setAttribute('type', 'checkbox');
	if (extension.enabled) {
		checkbox.setAttribute('checked', extension.enabled);
	}
	checkbox.addEventListener('click', function() {
		if (this.checked) {
			chrome.management.setEnabled(this.id, true);
			this.parentNode.parentNode.parentNode.classList.add('extension-div-enabled')
			this.parentNode.parentNode.parentNode.classList.remove('extension-div-disabled');
			this.nextSibling.innerHTML = "Enabled";
		} else {
			chrome.management.setEnabled(this.id, false);
			this.parentNode.parentNode.parentNode.classList.add('extension-div-disabled')
			this.parentNode.parentNode.parentNode.classList.remove('extension-div-enabled');
			this.nextSibling.innerHTML = "Disabled";
		}
	}, false);

	var label = document.createElement('label');
	label.setAttribute('for', extension.id);
	label.appendChild(document.createTextNode(extension.enabled? "Enabled": "Disabled"));

	optionsDiv.appendChild(checkbox);
	optionsDiv.appendChild(label);

	var leftDiv = document.createElement('div');
	leftDiv.classList.add('left-content');

	leftDiv.appendChild(descDiv);
	leftDiv.appendChild(optionsDiv);

	extensionDiv.appendChild(leftDiv);

	// create and append the rightDiv
	// <div class="right-img">
	// 		<img src="https://i.stack.imgur.com/YDRAT.jpg?s=48&g=1" alt="">
	// </div>
	var rightDiv = document.createElement('div');
	rightDiv.classList.add('right-img');
	var img = document.createElement('img');
	img.setAttribute('src', extension.icons.length == 1 ? extension.icons[0].url : extension.icons[1].url);
	rightDiv.appendChild(img);
	extensionDiv.appendChild(rightDiv);

	container.appendChild(extensionDiv);
}

document.getElementById('github-icon').addEventListener('click', function() {
	window.open('https://github.com/aedorado/ext-control-panel');
}, false);

document.getElementById('extensions-page').addEventListener('click', function() {
	window.open('https://github.com/aedorado/ext-control-panel');
}, false);
