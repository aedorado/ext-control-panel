chrome.management.getAll(function(allExtensions) {
	allExtensions.sort(function(left, right){
	    var nameorder = left.name === right.name ? 0 : (left.name < right.name ? -1 : 1);
	    if ((left.enabled && right.enabled) || (!left.enabled && !right.enabled)) {
	        return nameorder;
	    } else if(left.enabled) {
	        return -1;
	    } else {
	        return 1;
	    }
	});

	allExtensions.forEach(function(extension) {
		display(extension);
	});
});

function display(extension) {
	var container = document.getElementById('container');

	var extensionDiv = document.createElement('div');
	extensionDiv.classList.add(extension.enabled ? 'extension-div-enabled': 'extension-div-disabled');


	// create and append the name div
	var nameDiv = document.createElement('div');	// <div class="name-div">Grammarly</div>
	nameDiv.classList.add('name-div');
	nameDiv.innerHTML = extension.name;
	extensionDiv.appendChild(nameDiv);


	var row = document.createElement('div');
	row.classList.add('row');


	var leftDiv = document.createElement('div');
	leftDiv.classList.add('left-div');
	var img = document.createElement('img');
	img.setAttribute('src', extension.icons.length == 1 ? extension.icons[0].url : extension.icons[1].url);
	leftDiv.appendChild(img);
	row.appendChild(leftDiv);


	var midDiv = document.createElement('div');
	midDiv.classList.add('mid-div');
	midDiv.setAttribute('title', extension.description);
	midDiv.innerHTML = extension.description.length >= 90 ? (extension.description.substring(0, 90) + '...') : extension.description;
	midDiv.innerHTML += (extension.description.length == 0) ? 'No description provided by app maker.': '';
	row.appendChild(midDiv);


	var rightDiv = document.createElement('div');
	rightDiv.classList.add('right-div');

	var startButton = document.createElement('img');
	startButton.setAttribute('class', 'start-button');
	startButton.setAttribute('title', (extension.enabled ? 'Turn Off': 'Turn On'));
	startButton.setAttribute('src', 'icons/power.svg');
	startButton.setAttribute('id', 'start-' + extension.id)
	startButton.addEventListener('click', function() {
		var element = this;
		chrome.management.get(this.id.substring(6), function(ext) {
			if (ext.enabled) {
				chrome.management.setEnabled(this.args[0], false);
				element.parentNode.parentNode.parentNode.classList.add('extension-div-disabled')
				element.parentNode.parentNode.parentNode.classList.remove('extension-div-enabled');
			} else {
				chrome.management.setEnabled(this.args[0], true);
				element.parentNode.parentNode.parentNode.classList.add('extension-div-enabled')
				element.parentNode.parentNode.parentNode.classList.remove('extension-div-disabled');
			}
		});
	}, false);

	var deleteButton = document.createElement('img');
	deleteButton.setAttribute('class', 'delete-button');
	deleteButton.setAttribute('src', 'icons/garbage.svg');
	deleteButton.setAttribute('id', 'delete-' + extension.id)
	deleteButton.addEventListener('click', function() {
		var idToRemove = this.id.substring(7);
		var nodeToRemove = this.parentNode.parentNode.parentNode;
		chrome.management.uninstall(this.id.substring(7));
		chrome.management.onUninstalled.addListener(function(idToRemove) {
			nodeToRemove.parentNode.removeChild(nodeToRemove);
		});
	}, false);
	deleteButton.addEventListener('mouseover', function() {
		this.setAttribute('src', 'icons/garbage-hover.svg');	
	}, false);
	deleteButton.addEventListener('mouseout', function() {
		this.setAttribute('src', 'icons/garbage.svg');			
	}, false);

	rightDiv.appendChild(deleteButton);
	rightDiv.appendChild(startButton);
	rightDiv.setAttribute('id', extension.id);


	row.appendChild(rightDiv);

	// var checkbox = document.createElement('input');
	// checkbox.setAttribute('id', extension.id);
	// checkbox.setAttribute('type', 'checkbox');
	// if (extension.enabled) {
	// 	checkbox.setAttribute('checked', extension.enabled);
	// }
	// checkbox.addEventListener('click', function() {
	// 	if (this.checked) {
	// 		chrome.management.setEnabled(this.id, true);
	// 		this.parentNode.parentNode.parentNode.classList.add('extension-div-enabled')
	// 		this.parentNode.parentNode.parentNode.classList.remove('extension-div-disabled');
	// 		this.nextSibling.innerHTML = "Enabled";
	// 	} else {
	// 		chrome.management.setEnabled(this.id, false);
	// 		this.parentNode.parentNode.parentNode.classList.add('extension-div-disabled')
	// 		this.parentNode.parentNode.parentNode.classList.remove('extension-div-enabled');
	// 		this.nextSibling.innerHTML = "Disabled";
	// 	}
	// }, false);

	// var label = document.createElement('label');
	// label.setAttribute('for', extension.id);
	// label.appendChild(document.createTextNode(extension.enabled? "Enabled": "Disabled"));

	// rightOptionsDiv.appendChild(checkbox);
	// rightOptionsDiv.appendChild(label);


	extensionDiv.appendChild(row);
	container.appendChild(extensionDiv);
}

document.getElementById('github-icon').addEventListener('click', function() {
	window.open('https://github.com/aedorado/ext-control-panel');
}, false);

// document.getElementById('extensions-page').addEventListener('click', function() {
// 	window.open('https://github.com/aedorado/ext-control-panel');
// }, false);
