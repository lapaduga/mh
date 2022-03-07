document.addEventListener('DOMContentLoaded', () => {
	//#region Шапка
	// Пункты меню
	let menuArrows = document.querySelectorAll('.menu__arrow');

	if (menuArrows.length > 0) {
		for (let i = 0; i < menuArrows.length; i++) {
			const menuArrow = menuArrows[i];
			menuArrow.addEventListener('click', function (e) {
				menuArrow.parentElement.classList.toggle('_active');
			});
		}
	}

	// Анимация бургера
	const burger = document.querySelector('.header__burger');

	if (burger) {
		const menu = document.querySelector('.menu__body');

		burger.addEventListener('click', () => {
			burger.classList.toggle('_active');
			menu.classList.toggle('_active');
			document.body.classList.toggle('_lock');
		});
	}

	// Плавающая шапка
	let lastScroll = 0;
	const defaultOffset = 100;
	const header = document.querySelector('.header');

	const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop
	const containHide = () => header.classList.contains('_hide');
	window.addEventListener('scroll', () => {
		if (scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOffset) {
			header.classList.add('_hide');
		} else if (scrollPosition() < lastScroll && containHide()) {
			header.classList.remove('_hide');
		}
		if (lastScroll > defaultOffset) {
			header.classList.add('_paint');
		} else {
			header.classList.remove('_paint');
		}

		lastScroll = scrollPosition();
	});
	//#endregion

	//#region Параллакс
	"use strict"
	const parallax = document.querySelector('.block--first');

	if (document.body.clientWidth > 1024) {
		if (parallax) {
			const pic = document.querySelector('.block__image--ilya');
			const pic2 = document.querySelector('.block__image--larisa');
			const ratio = 50;
			const ratio2 = -50;
			const speed = 0.02;

			let positionX = 0;
			let positionY = 0;
			let coordXPercent = 0;
			let coordYPercent = 0;

			function setMouseParallaxStyle() {
				const distX = coordXPercent - positionX;
				const distY = coordYPercent - positionY;

				positionX += (distX * speed);
				positionY += (distY * speed);

				pic.style.cssText = `transform: translate(${positionX / ratio}%,${positionY / ratio}%);`;
				pic2.style.cssText = `transform: translate(${positionX / ratio2}%,${positionY / ratio2}%);`;

				requestAnimationFrame(setMouseParallaxStyle);
			}
			setMouseParallaxStyle();

			parallax.addEventListener('mousemove', (e) => {
				const parallaxWidth = pic.offsetWidth;
				const parallaxHeight = pic.offsetHeight;

				const coordX = e.pageX - parallaxWidth / 2;
				const coordY = e.pageY - parallaxHeight / 2;

				coordXPercent = coordX / parallaxWidth * 100;
				coordYPercent = coordY / parallaxHeight * 100;
			});
		}
	}
	//#endregion

	//#region Обработка форм
	const forms = document.querySelectorAll('.form');

	if (forms) {
		for (let i = 0; i < forms.length; i++) {
			const form = forms[i];
			form.addEventListener('submit', sendForm);

			async function sendForm(e) {
				e.preventDefault();

				let error = validateForm(form);

				let formData = new FormData(form);

				if (error === 0) {
					form.querySelector('.form__alert').classList.remove('_error');
					form.classList.add('_sending');
					let response = await fetch('sendmail.php', {
						method: 'POST',
						body: formData
					});
					if (response.ok) {
						let result = await response.json();
						alert(result.message);
						form.reset();
						form.classList.remove('_sending');
					} else {
						alert("Ошибка");
						form.classList.remove('_sending');
					}
				} else {
					form.querySelector('.form__alert').classList.add('_error');
				}
			}

			function validateForm(form) {
				let error = 0;
				let formReq = document.querySelectorAll('._req');

				for (let i = 0; i < formReq.length; i++) {
					const input = formReq[i];
					formRemoveError(input);

					if (input.classList.contains('_email')) {
						if (emailTest(input)) {
							formAddError(input);
							error++;
						}
					} else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
						formAddError(input);
						error++;
					} else {
						if (input.value === '') {
							formAddError(input);
							error++;
						}
					}
				}

				return error;
			}

			function formAddError(input) {
				input.parentElement.classList.add('_error');
				input.classList.add('_error');
			}

			function formRemoveError(input) {
				input.parentElement.classList.remove('_error');
				input.classList.remove('_error');
			}

			function emailTest(input) {
				return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
			}
		}
	}
	//#endregion

	//#region Попап
	// popup
	const body = document.querySelector('body');
	const lockPadding = document.querySelectorAll('.lock-padding');
	const popupCloseIcons = document.querySelectorAll('.close-popup');

	let unlock = true;

	const timeout = 500;

	body.addEventListener("click", (e) => {
		let targetItem = e.target;
		if (targetItem.closest('.popup-link')) {
			if (targetItem.closest('.popup-link').classList.contains('video-item__link')) {
				let popupTitle = document.querySelector('.popup__heading');
				let popupIframe = document.querySelector('.popup__video iframe');
				let playItemTitle = targetItem.closest('.popup-link').querySelector('.video-item__text');
				let playItemURL = targetItem.closest('.popup-link').dataset.url;
				popupTitle.innerText = playItemTitle.innerText;
				popupIframe.setAttribute('src', playItemURL);
			}
			const popupName = targetItem.closest('.popup-link').getAttribute('href').replace('#', '');
			const currentPopup = document.getElementById(popupName);
			popupOpen(currentPopup);
			e.preventDefault();
		}
	});

	if (popupCloseIcons) {
		for (let i = 0; i < popupCloseIcons.length; i++) {
			const icon = popupCloseIcons[i];
			icon.addEventListener('click', function (e) {
				e.preventDefault();
				popupClose(icon.closest('.popup'));
			});
		}
	}

	function popupOpen(currentPopup) {
		if (currentPopup && unlock) {
			const popupActive = document.querySelector('.popup._open');
			if (popupActive) {
				popupClose(popupActive, false);
			} else {
				bodyLock();
			}
			currentPopup.classList.add('_open');
			currentPopup.addEventListener('click', function (e) {
				if (!e.target.closest('.popup__content')) {
					popupClose(e.target.closest('.popup'));
				}
			});
		}
	}

	function popupClose(popupActive, doUnlock = true) {
		if (unlock) {
			popupActive.classList.remove('_open');
			if (doUnlock) {
				bodyUnlock();
			}
		}
	}

	function bodyLock() {
		const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = lockPaddingValue;
			}
		}
		body.style.paddingRight = lockPaddingValue;
		body.classList.add('_lock');

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, timeout);
	}

	function bodyUnlock() {
		setTimeout(function () {
			if (lockPadding.length > 0) {
				for (let index = 0; index < lockPadding.length; index++) {
					const el = lockPadding[index];
					el.style.paddingRight = '0px';
				}
			}
			body.style.paddingRight = '0px';
			body.classList.remove('_lock');
		}, timeout);

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, timeout);
	}

	document.addEventListener('keydown', function (e) {
		if (e.which === 27) {
			const popupActive = document.querySelector('.popup._open');
			popupClose(popupActive);
		}
	});

	(function () {
		if (!Element.prototype.closest) {
			Element.prototype.closest = function (css) {
				var node = this;
				while (node) {
					if (node.matches(css)) return node;
					else node = node.parentElement;
				}
				return null;
			};
		}
	})();

	(function () {
		if (!Element.prototype.matches) {
			Element.prototype.matches = Element.prototype.matchesSelector ||
				Element.prototype.webkitMatchesSelector ||
				Element.prototype.mozMatchesSelector ||
				Element.prototype.msMatchesSelector;
		}
	})();
	//#endregion

	//#region Слайдер творчества учеников
	new Swiper('.slider', {
		keyboard: {
			enabled: true,
			onlyInViewport: true,
			pageUpDown: true
		},
		mousewheel: {
			sensitivity: 1,
			eventsTarget: '.slider'
		},
		effect: 'cards'
	});
	//#endregion
});
