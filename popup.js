// var sitelist = [];

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
	});
});

function display(extension) {
	var container = document.getElementById('container');

	var extensionDiv = document.createElement('div');
	extensionDiv.classList.add(extension.enabled? 'extension-div-enabled': 'extension-div-disabled');

	var nameDiv = document.createElement('div');
	nameDiv.classList.add('name-div');
	nameDiv.innerHTML = extension.name;

	var descDiv = document.createElement('div');
	descDiv.classList.add('desc-div');
	descDiv.setAttribute('title', extension.description);
	descDiv.innerHTML = extension.description;

	extensionDiv.appendChild(nameDiv);
	extensionDiv.appendChild(descDiv);
	container.appendChild(extensionDiv);

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
			this.parentNode.parentNode.classList.add('extension-div-enabled')
			this.parentNode.parentNode.classList.remove('extension-div-disabled');
		} else {
			chrome.management.setEnabled(this.id, false);
			this.parentNode.parentNode.classList.add('extension-div-disabled')
			this.parentNode.parentNode.classList.remove('extension-div-enabled');
		}
	}, false);


	var label = document.createElement('label');
	label.setAttribute('for', extension.id);
	label.appendChild(document.createTextNode(extension.enabled? "Enabled": "Disabled"));

	optionsDiv.appendChild(checkbox);
	optionsDiv.appendChild(label);

	extensionDiv.appendChild(optionsDiv);

			// <div class="extension-div">
			// 	<div class="name-div">Grammarly</div>
			// 	<div class="desc-div">this extension does this</div>
			// 	<div class="options">
			// 		<input type="checkbox" id="chr1">
			// 		<label for="chr1">Enabled</label>
			// 	</div>
			// </div>
}