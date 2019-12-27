(function() {

	var items = document.querySelectorAll('.projects li');
	var el = null;
	var del = document.querySelector('.delete');
	var add = document.querySelector('.add');
	var ul = document.querySelector('ul');
	var form = document.querySelector('form');

	function addListeners() {
		[].forEach.call(items, function(item) {
			item.setAttribute('draggable', 'true');
			item.addEventListener('dragstart', dragStart, false);
			item.addEventListener('dragenter', dragEnter, false);
			item.addEventListener('dragover', dragOver, false);
			item.addEventListener('dragleave', dragLeave, false);
			item.addEventListener('drop', dragDrop, false);
			item.addEventListener('dragend', dragEnd, false);
		});
	}

	del.addEventListener('dragover', delOver, false);
	del.addEventListener('dragenter', delEnter, false);
	del.addEventListener('dragleave', delLeave, false);
	del.addEventListener('drop', deleteItem, false);

	add.addEventListener('click', addItem, false);

	function dragStart(e) {
		this.style.opacity = '0.4';
		el = this;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text', el.innerHTML);
		e.dataTransfer.setData('item_id', el.getAttribute('data-id'));
	}

	function dragOver(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.dataTransfer.dropEffect = 'move';
		return false;
	}

	function dragEnter(e) {
		this.classList.add('over');
	}

	function dragLeave(e) {
		this.classList.remove('over');
	}

	function dragDrop(e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		if (el != this) {
			var orig_id = this.getAttribute('data-id');
			el.innerHTML = this.innerHTML;
			el.setAttribute('data-id', orig_id);
			this.innerHTML = e.dataTransfer.getData('text');
			var this_id = e.dataTransfer.getData('item_id');
			this.setAttribute('data-id', this_id);
			listChange();
		}
		return false;
	}

	function delOver(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.dataTransfer.dropEffect = 'move';
		return false;
	}

	function delEnter(e) {
		this.style.borderColor = 'red';
	}

	function delLeave(e) {
		this.style.borderColor = '#ccc';
	}

	function deleteItem(e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		var ID = el.getAttribute('data-id');
		deleteProject(ID);
		el.parentNode.removeChild(el);
		this.style.borderColor = '#ccc';
		return false;
	}

	function dragEnd(e) {
		this.style.opacity = '1';
		[].forEach.call(items, function(item) {
			item.classList.remove('over');
		});
	}

	function addItem(e) {
		e.preventDefault();
		var newItem = document.createElement('li');
		var title = form.elements['project'].value;
		if (title === '') {
			return false;
		}
		var ownerIndex = form.elements['owner'].selectedIndex;
		var owner = form.elements['owner'].options[ownerIndex].value;
		var monthIndex = form.elements['month'].selectedIndex;
		var month = form.elements['month'].options[monthIndex].value;
		var dayIndex = form.elements['day'].selectedIndex;
		var day = form.elements['day'].options[dayIndex].value;

		var newContent = title + ' - ' + owner + ' - ' + month + ' ' + day;
		newItem.innerHTML = newContent;

		ul.appendChild(newItem);
		items = document.querySelectorAll('.projects li'); // update list
		addListeners();
		addNewItem(newItem);
	}

	function addNewItem(newItem) {
		var Item = newItem.innerHTML;
		$.post('index.php', {Add: true, Item: Item}, function(response){checkIfError(response);}, 'json')
		.done(function(response){checkIfError(response);
		newItem.setAttribute('data-id', response[0].inserted_id); // Set DB id of newly added item
		}) // end of done
		.fail(handleError);
	}

	var retries = 1;
	function listChange() {
		var tempItems = document.querySelectorAll('.projects li');
		[].forEach.call(tempItems, function(item, i) {
			if(item.hasAttribute('data-id')){
				var ID = item.getAttribute('data-id');
				// var ItemText = item.innerHTML;
				var Order = i + 1; // so don't start with 0
				// Save Order of List
				$.post('index.php', {ID: ID, Order: Order}, function(response){checkIfError(response);}, 'json')
				.done(function(response){checkIfError(response);
				// console.log(response);
				}) // end of done
				.fail(handleError);
			} else if(retries < 5){ // If an item does not yet have a data-id, only try for 5 times (5 seconds)
				retries++;
				setTimeout(listChange, 1000); // If one didn't have an ID, check again in a second
			} // end elseif
		});
	}

	function deleteProject(ID) {
		$.post('index.php', {ID: ID, Delete: true}, function(response){checkIfError(response);}, 'json')
			.done(function(response){checkIfError(response);}) // end of done
			.fail(handleError);
	}

	addListeners();


function handleError(jqXHR, exception, error) {
	error = error || false;
	var msg = '';
	if (jqXHR.status === 0) {
		msg = 'Check Network Connection';
	} else if (jqXHR.status == 404) {
		msg = 'Requested page not found [404]';
	} else if (jqXHR.status == 500) {
		msg = 'Internal Server Error [500]';
	} else if (exception === 'parsererror') {
		msg = 'Requested JSON parse failed';
	} else if (exception === 'timeout') {
		msg = 'Timeout error';
	} else if (exception === 'abort') {
		msg = 'Request aborted';
	} else if(error){
		msg = error;
	} else {
		msg = 'Uncaught Error: ' + jqXHR.responseText;
	} // end else

	//Handle failure here
	$('#PassiveError').html("Error: " + msg);
	$("#PassiveError").fadeTo(3000, 500).slideUp(500, function(){
	});
	window.scrollTo({top: 0, behavior: 'smooth'}); // scroll so the error can be seen
} // end of function ------------------------------------------------------------------------------------

function checkIfError(response){
	if (response == "DB_ERROR") {
		handleError("","","DB Query error");
	 } else if (response == "DB_0DONE") {
		handleError("","","No data was effected in the database.");
	 } 
} // end of function ------------------------------------------------------------------------------------

})();