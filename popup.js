var GLOBALS = {
	inactiveExts: 0,
	activeExts: 0,

	rewrite: function() {
		document.getElementById('num-all').innerHTML = (this.activeExts + this.inactiveExts);
		document.getElementById('num-active').innerHTML = (this.activeExts); 
		document.getElementById('info').classList.remove('hide');
	},

	updateForToggle: function(newState) {
		if (newState === 'on') {
			--this.inactiveExts;
			++this.activeExts;
		} else if (newState == 'off') {
			++this.inactiveExts;
			--this.activeExts;
		}
		this.rewrite();
	}

}

chrome.management.getAll(function (allExtensions) {
	allExtensions.sort(function (left, right) {
		var nameorder = left.name === right.name ? 0 : (left.name < right.name ? -1 : 1);
		if ((left.enabled && right.enabled) || (!left.enabled && !right.enabled)) {
			return nameorder;
		} else if (left.enabled) {
			return -1;
		} else {
			return 1;
		}
	});
	ReactDOM.render(<AllExt extensions={allExtensions} />, document.getElementById("container"));
});

var AllExt = React.createClass({
	render: function () {
		var rows = [];

		this.props.extensions.forEach(function (ext, i) {
			// 1 -  count number of extensions
			ext.enabled ? ++GLOBALS.activeExts: ++(GLOBALS.inactiveExts);
			// 2 - check if icon exists for this extension
			var iconSource = '';
			if (ext.icons !== undefined) {
				iconSource = ext.icons.length == 1 ? ext.icons[0].url : ext.icons[1].url; 
			}
			// 3 - create a row for the extension
			rows.push(
				<div className={"extension-div " + (ext.enabled ? 'extension-div-enabled' : 'extension-div-disabled') } name={ext.name.toLowerCase() }>
					<div className="name-div">{ext.name}</div>
					<div className="row">
						<div className="left-div"><img src={iconSource} /></div>
						<div className="mid-div" title={ext.description}>{ext.description.length >= 90 ? (ext.description.substring(0, 90) + '...') : (ext.description.length ? ext.description : 'NO DESC') }</div>
						<div className="right-div" id={ext.id}><DelImg extid={ext.id} /><ToggleImg extid={ext.id} enabled={ext.enabled}/></div>
					</div>
				</div>
			);
		});
		GLOBALS.rewrite();
		return (<div>{rows}</div>)
	}
});

var ToggleImg = React.createClass({

	clickHandler: function () {
		var idToToggle = this.props.extid;
		chrome.management.get(idToToggle, function (ext) {
			if (ext.enabled) {
				GLOBALS.updateForToggle('off');
				chrome.management.setEnabled(idToToggle, false);
				document.getElementById('toggle-' + idToToggle).setAttribute('title', 'Turn On');
				document.getElementById('toggle-' + idToToggle).parentNode.parentNode.parentNode.classList.add('extension-div-disabled')
				document.getElementById('toggle-' + idToToggle).parentNode.parentNode.parentNode.classList.remove('extension-div-enabled');
			} else {
				GLOBALS.updateForToggle('on');
				chrome.management.setEnabled(idToToggle, true);
				document.getElementById('toggle-' + idToToggle).setAttribute('title', 'Turn Off');
				document.getElementById('toggle-' + idToToggle).parentNode.parentNode.parentNode.classList.add('extension-div-enabled')
				document.getElementById('toggle-' + idToToggle).parentNode.parentNode.parentNode.classList.remove('extension-div-disabled');
			}
		});
	},

	render: function () {
		return (
			<img onClick={this.clickHandler} className="start-button" title={"Turn " + (this.props.enabled ? ' Off' : 'On') } src="icons/power.svg" id={"toggle-" + this.props.extid} />
		)
	}
});

var DelImg = React.createClass({

	clickHandler: function () {
		var idToRemove = this.props.extid;
		var nodeToRemove = document.getElementById('delete-' + idToRemove).parentNode.parentNode.parentNode;
		chrome.management.uninstall(this.props.extid);
		chrome.management.onUninstalled.addListener(function (idToRemove) {
			nodeToRemove.parentNode.removeChild(nodeToRemove);
		});
	},

	mouseOver: function() {
		var idToRemove = this.props.extid;
		document.getElementById('delete-' + idToRemove).setAttribute('src', 'icons/garbage-hover.svg');
	},

	mouseOut: function() {
		var idToRemove = this.props.extid;
		document.getElementById('delete-' + idToRemove).setAttribute('src', 'icons/garbage.svg');
	},

	render: function () {
		return (
			<img onClick={this.clickHandler} onMouseOut={this.mouseOut} onMouseOver={this.mouseOver} title="Remove" className="delete-button" src="icons/garbage.svg" id={"delete-" + this.props.extid} />
		)
	}
});


document.getElementById('search').addEventListener('keyup', function (e) {
	var searchTerm = e.target.value.toLowerCase();
	var allExtensionDivs = document.getElementsByClassName('extension-div');
	[].forEach.call(allExtensionDivs, function (ext) {
		var extensionName = ext.getAttribute('name');
		if (extensionName.indexOf(searchTerm) == -1) {
			ext.classList.add('hide');
		} else {
			ext.classList.remove('hide');
		}
	});
}, false);
