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