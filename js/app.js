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

//#region Параллакс на главном экране
"use strict"
window.onload = () => {
	const parallax = document.querySelector('.block--first');

	if (document.body.clientWidth > 992) {
		if (parallax) {
			const pic = document.querySelector('.block__image');
			const ratio = 50;
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
}
//#endregion

