'use strict';

var frendsList = document.querySelector('.frends-list'),
    favoriteList = document.querySelector('.favorites-frends'),
    saveBtn = document.querySelector('.js--save-fav-list'),
    frendListInput = document.querySelector('.js--frends-list-filtr'),
    favoritListinput = document.querySelector('.js--fav-list-filtr'),
    enterFild = document.querySelector('.js--enter-fild'),
    enterButton = document.querySelector('.js--load-frends-list'),
    mClose = document.querySelector('.js--close-modal'),
    modalWindow = document.querySelector('.modal-wrap');

VK.init({
	apiId: 5973051
});

//load album list

enterFild.addEventListener('keypress', function (event) {
	if (event.keyCode == 13) {
		if (isNumeric(enterFild.value)) {
			enter();
			visabilityModal();
			return false;
		} else {
			alert('ProfileId состоит только из числа!');
		}
	}
});

enterButton.addEventListener('click', function () {
	if (isNumeric(enterFild.value)) {
		enter();
		visabilityModal();
	} else {
		alert('ProfileId состоит только из числа!');
	}
});

modalWindow.addEventListener('click', function (e) {
	return e.target === modalWindow ? modalWindow.style.display = 'none' : null;
});
mClose.addEventListener('click', function (e) {
	return modalWindow.style.display = 'none';
});

function visabilityModal() {

	modalWindow.style.display = 'block';
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function enter() {
	var val = enterFild.value;
	VK.Auth.login(function (result) {

		if (result.status == 'connected') {
			console.info('Успешная авторизация');
			VK.api('friends.get', {
				v: 5.64,
				user_id: val,
				order: 'name',
				fields: 'photo_100'
			}, function (result) {
				console.log(result);
				drawFrends(result.response.items);
			});
		} else {
			console.error("Не успешная авторизация");
		}
	}, 4);
}

function drawFrends(data) {
	console.log(data);
	remove_duplicates(data);
	for (var i = 0; i < data.length - 1; i++) {
		createElList(data[i].photo_100, data[i].first_name, data[i].last_name, data[i].id);
	};
};

var wrapFrends = document.querySelector('.app__body');

wrapFrends.addEventListener('mousedown', function (e) {
	if (e.target.classList.contains('frend-list__item')) {
		var getCoords = function getCoords(elem) {
			var box = elem.getBoundingClientRect();
			return {
				top: box.top + pageYOffset,
				left: box.left + pageXOffset
			};
		};

		var moveAt = function moveAt(e) {
			frendItem.style.top = e.clientY - shiftY - wrapFrends.clientHeight + 25 + 'px';
			frendItem.style.left = e.clientX - shiftX - wrapFrends.clientWidth + 'px';
			document.ondragstart = function () {
				return false;
			};
			document.body.onselectstart = function () {
				return false;
			};
		};

		var removeDocumentEventHandler = function removeDocumentEventHandler() {
			document.onmousemove = null;
			frendItem.onmouseup = null;
			frendItem.style.position = '';
			frendItem.style.cursor = '';
			frendItem.style.width = '';
			frendItem.style.background = '';
		};

		var mouseUp = function mouseUp(e, el) {
			console.log(e);
			var targPos = getCoords(el);
			var targWidth = parseInt(el.offsetWidth);
			var targHeight = parseInt(el.offsetHeight);
			if (e.clientX > targPos.left && e.clientX < targPos.left + targWidth && e.clientY > targPos.top && e.clientY < targPos.top + targHeight) {
				frendItem.remove();
				cloneEl.className = 'frend-list__item frend';
				cloneEl.lastChild.className = 'frends-list__del-fav add-btn';
				console.log(cloneEl);
				el.appendChild(cloneEl);
			}
		};

		var frendItem = e.target,
		    dragObject = this,
		    cloneEl = frendItem.cloneNode(true);


		var coords = getCoords(frendItem);
		var shiftY = e.clientY - coords.top;
		var shiftX = e.clientX - coords.left;
		frendItem.style.position = 'absolute';
		frendItem.style.cursor = 'pointer';
		frendItem.style.zIndex = 500;
		frendItem.style.width = frendItem.parentNode.clientWidth + 'px';
		frendItem.style.background = '#f0f0f0';
		moveAt(e);


		document.onmousemove = function (e) {
			moveAt(e);
		};

		favoriteList.onmouseup = function (e) {
			removeDocumentEventHandler();
			mouseUp(e, frendsList);
		};

		frendsList.onmouseup = function (e) {
			removeDocumentEventHandler();
			mouseUp(e, favoriteList);
		};
	};
});

wrapFrends.ondragstart = function () {
	return false;
};

//delete element
function deleteDiv(e) {
	console.log(e);
	e.target.parentNode.remove();
}

//create element from list
function createElList(imgSrc, name, lastName, id) {
	if (lastName == undefined) {
		lastName = '';
	}
	var el = document.createElement('div');
	var frendName = document.createElement('span');
	var img = new Image();
	var addFavBtn = document.createElement('div');
	img.className += 'frend__photo';
	frendName.className += 'frend__name';
	addFavBtn.className += 'frends-list__add-fav add-btn';

	frendName.innerHTML = name + ' ' + lastName;
	img.src = imgSrc;

	el.className += 'frend-list__item frend';
	el.dataset.id = id;
	el.appendChild(img);
	el.appendChild(frendName);
	el.appendChild(addFavBtn);
	frendsList.appendChild(el);
}

//create element from favorite
function createElFav(name, imgSrc, id) {
	var el = document.createElement('div');
	var frendName = document.createElement('span');
	var img = new Image();
	var addFavBtn = document.createElement('div');
	img.className += 'frend__photo';
	frendName.className += 'frend__name';
	addFavBtn.className += 'frends-list__del-fav add-btn';

	frendName.innerHTML = name;
	img.src = imgSrc;

	el.className += 'frend-list__item favorite';
	el.dataset.id = id;
	el.appendChild(img);
	el.appendChild(frendName);
	el.appendChild(addFavBtn);
	favoriteList.appendChild(el);
}

//on click add element
wrapFrends.addEventListener('click', function (e) {
	if (e.target.classList.contains('frends-list__add-fav')) {
		createElFav(e.target.parentNode.childNodes[1].innerHTML, e.target.parentNode.childNodes[0].src, e.target.parentNode.dataset.id);
		deleteDiv(e);
	}
});

// delete element from fav
favoriteList.addEventListener('click', function (e) {
	if (e.target.classList.contains('frends-list__del-fav')) {
		createElList(e.target.parentNode.childNodes[0].src, e.target.parentNode.childNodes[1].innerHTML);
		deleteDiv(e);
		console.log(retObj);
		deleteLocal(e);
	}
});

var savedFrends = [];
function addTolocal() {
	console.log(favoriteList.childNodes.length);
	for (var i = 0; i < favoriteList.childNodes.length; i++) {
		savedFrends.push({
			name: favoriteList.childNodes[i].childNodes[1].innerHTML,
			img: favoriteList.childNodes[i].childNodes[0].src,
			id: favoriteList.childNodes[i].dataset.id
		});
	}
}

function deleteLocal(e) {

	for (var i = 0; i < retObj.length; i++) {
		if (e.target.parentNode.childNodes[1].innerHTML == retObj[i].name) {
			console.log(retObj[i]);
			retObj.splice(retObj[i], 1);
		}
	}
}

if (Object.keys(localStorage) == 0) {
	var retObj = '';
} else {
	var retObj = JSON.parse(localStorage['frend']);
}

function LoadLocal() {
	for (var prop in retObj) {
		createElFav(retObj[prop].name, retObj[prop].img, retObj[prop].id);
	}
}

saveBtn.addEventListener('click', function () {
	addTolocal();
	if (savedFrends.length >= 0) {
		var str = JSON.stringify(savedFrends);
		localStorage['frend'] = str;
	} else {
		null;
	}
	console.log(window.localStorage);
});

function isMatching(full, chunk) {
	full = full.toLowerCase();
	chunk = chunk.toLowerCase();
	if (full.indexOf(chunk) == -1) {
		return false;
	} else {
		return true;
	}
}

function filterCheck(el, input) {
	for (var i = 0; i < el.childNodes.length; i++) {
		el.childNodes[i].style.display = 'block';
		if (isMatching(el.childNodes[i].childNodes[1].innerHTML, input.value)) {
			console.log(true);
		} else {
			console.log(false);
			el.childNodes[i].style.display = 'none';
		}
	}
}

function remove_duplicates(b) {
	for (var i = 0, len = retObj.length; i < len; i++) {
		for (var j = 0, len2 = b.length; j < len2; j++) {
			if (retObj[i].id == b[j].id) {
				console.log(true);
				b.splice(j, 1);
				len2 = b.length;
			}
		}
	}
}

frendListInput.addEventListener('keyup', function () {
	filterCheck(frendsList, frendListInput);
});

favoritListinput.addEventListener('keyup', function () {
	filterCheck(favoriteList, favoritListinput);
});

LoadLocal();