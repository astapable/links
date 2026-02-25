// FILTERING
// SOURCE: https://stackoverflow.com/questions/69229348/filter-html-elements-vanilla-js
// const since the element won't be changed.
const filterMenu = document.querySelector('#filter-menu');

// Set .active to "All" filter on page load (this add the style only but not filter it yet)
if (filterMenu) {
	const defaultBtn = document.querySelector('.filter-btn[data-category="all"]');
	if (defaultBtn) defaultBtn.classList.add('active');

	// Here what makes actually filter happens on page load for "All"
	document.querySelectorAll('.list-item').forEach((item) => {
		item.style.display = 'flex';
	});

	// Set where .active happens
	filterMenu.addEventListener('click', (e) => {
		const buttonClicked = e.target.closest('.filter-btn');
		if (!buttonClicked) return;

		// Denote that we need data-category
		const category = buttonClicked.dataset.category;

		// Set adding the .active on click. 
		document.querySelectorAll('.filter-btn').forEach((filterButton) => {
			filterButton.classList.remove('active'); // it takes .filter-btn, finds all the sub classes added to that class and removes the specific one - .active
		});
		buttonClicked.classList.add('active');

		// Filtering happens here. Basically show/hide type of interaction
		const lsitItems = document.querySelectorAll('.list-item');

		lsitItems.forEach((item) => {
			if (category === 'all' || item.dataset.category === category) {
				item.style.display = 'flex';
			} else {
				item.style.display = 'none';
			}
		});
	});
}


// INTERSECTION OBSERVER
// 01. ADDITION - INTERSECTION OBSERVER. This wasnt working until I connected Intersection Observer to the fetch process. 
// 02. Before that .list-item did not appear in the DOM. Line 305
const observer = new IntersectionObserver ((entries)=>{
	entries.forEach((entry)=>{
		if(entry.isIntersecting){
			console.log(entry.target)
			entry.target.classList.add ('show')	
		} else {
			entry.target.classList.remove ('show')
		}
	})
}, {})

const listWrappers = document.querySelectorAll('.sizer-primary'); 
listWrappers.forEach(el => observer.observe(el))

// INTERSECTION OBSERVER for .nav.bottom
// Follow .hero and .footer sections
const heroTrigger = document.querySelector('.hero');
const footerTrigger = document.querySelector('footer');

let heroOut = false;
let footerIn = false;

function updateNav() {
    // Shiving nav only when .hero and footer are not visible
	document.documentElement.classList.toggle('nav-visible', heroOut && !footerIn);
}

if (heroTrigger) {
	const heroObserver = new IntersectionObserver(
		([entry]) => {
			heroOut = !entry.isIntersecting;
			updateNav();
		},
		{
    		threshold: 0,
    		rootMargin: "-60% 0% 0% 0%",
    	}
  	);

	heroObserver.observe(heroTrigger);
}

if (footerTrigger) {
	const footerObserver = new IntersectionObserver(
		([entry]) => {
			footerIn = entry.isIntersecting;
			updateNav();
		},
		{
    		threshold: 0,
    		rootMargin: "0% 0% 0% 0%",
    	}
  	);

	footerObserver.observe(footerTrigger);
}

// SCROLL DIRECTION CHECKER. Checks scroll direction 
let previousScroll = window.scrollY; // Sows how much has already been scrolled on the page

function updateScrollDir() {
	const y = window.scrollY;

	if (y === previousScroll) return;

	let dir;

	if (y > previousScroll) {
		dir = 'down';
	} else {
		dir = 'up';
	}

	// Set the data-scroll-dir attribute on <html>
	document.documentElement.setAttribute('data-scroll-dir', dir);

	previousScroll = y;
}

// The overal explanation is here - https://www.youtube.com/watch?v=1lUKqISgRH0
const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');

// What I added is this resize to male it canvas worked as fixed element
function resize() {
    const dpr = window.devicePixelRatio || 1;

    canvas.width  = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);

    canvas.style.width = '100vw';
    canvas.style.height = '100vh';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resize();
window.addEventListener('resize', resize);

ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 100;

let lastX = null;
let lastY = null;
let hue = 0;

// Here I make the line based on the coordinates
function draw(e) {
    const x = e.clientX;
    const y = e.clientY;

    // Here I set the staring apoint and the last point
    if (lastX === null || lastY === null) {
        lastX = x;
        lastY = y;
        return;
    }

    ctx.globalCompositeOperation = 'source-over';

    const color = `hsl(${hue}, 60%, 40%)`; // Here I set up the color cvalues
    ctx.strokeStyle = color;
    ctx.shadowBlur = 60;
    ctx.shadowColor = color;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // This stretches the line from last point to the new point
    lastX = x;
    lastY = y;
    // Moves the hue for the next stroke in a cycle of 0 to 359
    hue = (hue + 1) % 360;
}

// Here I set what triggers the drawing
window.addEventListener('mousemove', draw);
window.addEventListener('mouseleave', () => {
    lastX = null;
    lastY = null;
});

// Made it fade
const FADE_SECONDS = 0.8;
let lastTime = performance.now();

function fade(now) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    const a = Math.min(1, dt / FADE_SECONDS);

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out'; // It erasing, but dont know why not completely
    ctx.fillStyle = `rgba(0, 0, 0, ${a})`;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.restore();

    requestAnimationFrame(fade);
}

requestAnimationFrame(fade);