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

	//#region Курсор
	if (document.body.clientWidth > 1024) {
		const cursor = document.getElementById('cursor'),
			aura = document.getElementById('aura'),
			links = document.getElementsByTagName('a'),
			buttons = document.getElementsByTagName('button'),
			formElements = document.querySelectorAll('.form-control'),
			videos = document.querySelectorAll('.video'),
			body = document.body;

		let mouseX = 0,
			mouseY = 0,
			posX = 0,
			posY = 0;

		function mouseCoords(e) {
			mouseX = e.pageX;
			mouseY = e.pageY;
		}

		gsap.to({}, .01, {
			repeat: -1,
			onRepeat: () => {
				posX += (mouseX - posX) / 5;
				posY += (mouseY - posY) / 5;

				gsap.set(cursor, {
					css: {
						left: mouseX - 3,
						top: mouseY - 3,
					}
				});
				gsap.set(aura, {
					css: {
						left: posX - 22,
						top: posY - 22,
					}
				});
			}
		});

		for (let i = 0; i < links.length; i++) {
			const link = links[i];
			link.addEventListener('mouseover', () => {
				cursor.classList.add('_active');
				aura.classList.add('_active');
			});
			link.addEventListener('mouseout', () => {
				cursor.classList.remove('_active');
				aura.classList.remove('_active');
			});
		}

		for (let i = 0; i < buttons.length; i++) {
			const button = buttons[i];
			button.addEventListener('mouseover', () => {
				cursor.classList.add('_active');
				aura.classList.add('_active');
			});
			button.addEventListener('mouseout', () => {
				cursor.classList.remove('_active');
				aura.classList.remove('_active');
			});
		}

		for (let i = 0; i < formElements.length; i++) {
			const formElement = formElements[i];
			formElement.addEventListener('mouseover', () => {
				cursor.classList.add('_active');
				aura.classList.add('_active');
			});
			formElement.addEventListener('mouseout', () => {
				cursor.classList.remove('_active');
				aura.classList.remove('_active');
			});
		}

		for (let i = 0; i < videos.length; i++) {
			const video = videos[i];
			video.addEventListener('mouseover', () => {
				aura.classList.add('_play');
			});
			video.addEventListener('mouseout', () => {
				aura.classList.remove('_play');
			});
		}

		body.addEventListener('mousemove', e => {
			mouseCoords(e);
			cursor.classList.remove('_hidden');
			aura.classList.remove('_hidden');
		});

		body.addEventListener('mouseout', () => {
			cursor.classList.add('_hidden');
			aura.classList.add('_hidden');
		});
	}
	//#endregion

	//#region Валидация форм
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
});
