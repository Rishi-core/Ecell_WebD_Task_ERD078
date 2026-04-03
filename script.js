const progressBar = document.getElementById('scrollProgress');
const revealElements = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.nav a');
const sections = document.querySelectorAll('section[id]');
const tiltCards = document.querySelectorAll('.tilt-card');
const traceCards = document.querySelectorAll('.trace-card');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add('visible');
		}
	});
}, { threshold: 0.14 });

revealElements.forEach((element) => observer.observe(element));

const highlightNav = () => {
	const scrollPosition = window.scrollY + 140;

	sections.forEach((section) => {
		const top = section.offsetTop;
		const bottom = top + section.offsetHeight;
		const id = section.getAttribute('id');

		if (scrollPosition >= top && scrollPosition < bottom) {
			navLinks.forEach((link) => {
				link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
			});
		}
	});

	const docHeight = document.documentElement.scrollHeight - window.innerHeight;
	const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
	progressBar.style.transform = `scaleX(${progress})`;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const resetTilt = (card) => {
	if (card.classList.contains('trace-card')) {
		card.style.transform = 'none';
	} else {
		card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0)';
	}
	card.style.setProperty('--glow-x', '50%');
	card.style.setProperty('--glow-y', '50%');
	card.style.setProperty('--glow-opacity', '0');
	card.classList.remove('tilt-active');
	card.classList.remove('trace-active');
};

const updateTiltCard = (card, event) => {
	const rect = card.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	const normalizedX = (x / rect.width) - 0.5;
	const normalizedY = (y / rect.height) - 0.5;
	const rotateY = clamp(normalizedX * 14, -11, 11);
	const rotateX = clamp(-normalizedY * 12, -9, 9);
	card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
	card.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
	card.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
	card.style.setProperty('--glow-opacity', '1');
};

const updateTraceCard = (card, event) => {
	const rect = card.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	card.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
	card.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
	card.style.setProperty('--glow-opacity', '1');
	card.classList.add('trace-active');
	if (card.classList.contains('schedule-card')) {
		card.style.transform = 'none';
	}
};

if (canHover) {
	tiltCards.forEach((card) => {
		card.addEventListener('pointerenter', (event) => {
			card.classList.add('tilt-active');
			updateTiltCard(card, event);
		});

		card.addEventListener('pointermove', (event) => {
			updateTiltCard(card, event);
		});

		card.addEventListener('pointerleave', () => {
			resetTilt(card);
		});

		card.addEventListener('pointercancel', () => {
			resetTilt(card);
		});
	});

	traceCards.forEach((card) => {
		card.addEventListener('pointerenter', (event) => {
			card.classList.add('trace-active');
			updateTraceCard(card, event);
		});

		card.addEventListener('pointermove', (event) => {
			updateTraceCard(card, event);
		});

		card.addEventListener('pointerleave', () => {
			resetTilt(card);
		});

		card.addEventListener('pointercancel', () => {
			resetTilt(card);
		});
	});
}

window.addEventListener('scroll', highlightNav, { passive: true });
window.addEventListener('load', () => {
	highlightNav();
	if (!canHover) {
		tiltCards.forEach((card) => resetTilt(card));
		traceCards.forEach((card) => resetTilt(card));
	}
});