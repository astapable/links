let channelSlug = 'murals-in-new-york-city' // The “slug” is just the end of the URL.
let myUsername = 'evgenii-astapov-lihxmzffeac' // For linking to your profile.



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (channelData) => {
	// Target some elements in your HTML:
	let channelTitle = document.querySelector('#channel-title')
	let channelDescription = document.querySelector('#channel-description')
	// let channelCount = document.querySelector('#channel-count')
	let channelLink = document.querySelector('#channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = channelData.title
	channelDescription.innerHTML = channelData.description.html
	// channelCount.innerHTML = channelData.counts.blocks
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (blockData) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.querySelector('#channel-blocks')

	// Links!
	if (blockData.type == 'Link') {
		// Declares a “template literal” of the dynamic HTML we want.
		let linkItem =
			`
			<li class="list-item" data-category="link">
				<header class="sizer-secondary">
					<p class="footnote">${ blockData.title }</p>
				</header>
				<article class="sizer-primary img">
					<a href="${blockData.source.url}" target="_blank">
						<img src="${ blockData.image.medium.src_2x }" alt="">
					</a>
				</article>
				<header class="sizer-secondary">
					<p class="footnote">${ blockData.title }</p>
				</header>
			</li>

			`

		// And puts it into the page!
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)

		// More on template literals:
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
	}

	// Images!
	else if (blockData.type == 'Image') {
		let imageItem =
		`
		<li class="list-item" data-category="image">
            <header class="sizer-secondary">
                <p class="footnote">${ blockData.title }</p>
            </header>
            <article class="sizer-primary img">
                <img src="${blockData.image.medium.src_2x}" alt="">
            </article>
            <header class="sizer-secondary">
            	<p class="footnote">${ blockData.title }</p>
            </header>
        </li>
		`

		channelBlocks.insertAdjacentHTML('beforeend', imageItem)
	}

	// Text!
	else if (blockData.type == 'Text') {
		let textItem =
		`
		<li class="list-item" data-category="text">
			<header class="sizer-secondary">
				<p class="footnote">${ blockData.title }</p>
			</header>
			<article class="sizer-primary txt">
				<p>${blockData.content.plain}</p>
				<p class="footnote">${ blockData.description.plain }</p>
			</article>
            <header class="sizer-secondary">
                <p class="footnote">${ blockData.title }</p>
             </header>
        </li>
		`

		channelBlocks.insertAdjacentHTML('beforeend', textItem)
	}

	// Uploaded (not linked) media…
	else if (blockData.type == 'Attachment') {
		let contentType = blockData.attachment.content_type // Save us some repetition.

		// Uploaded videos!
		if (contentType.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				<li class="list-item" data-category="video">
                    <header class="sizer-secondary">
                        <p class="footnote">${ blockData.title }</p>
                    </header>
                    <article class="sizer-primary vid">
                        <video controls src="${ blockData.attachment.url }"></video>
                    </article>
                    <header class="sizer-secondary">
                        <p class="footnote">${ blockData.title}</p>
                    </header>
                </li>
				`

			channelBlocks.insertAdjacentHTML('beforeend', videoItem)

			// More on `video`, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
		else if (contentType.includes('pdf')) {
			let pdfItem =
				`
				<li class="list-item" data-category="text">
                    <header class="sizer-secondary">
                        <p class="footnote">${ blockData.title }</p>
                    </header>
                    <article class="sizer-primary doc">
                        <iframe src="${ blockData.attachment.url }"></iframe>
                    </article>
                    <header class="sizer-secondary">
                        <p class="footnote">${ blockData.title }</p>
                    </header>
                </li>
				`

				channelBlocks.insertAdjacentHTML('beforeend', pdfItem)
		}

		// Uploaded audio!
		else if (contentType.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				<li class="list-item" data-category="audio">
                    <header class="sizer-secondary">
                        <p class="footnote">${ blockData.title }</p>
                    </header>
                    <article class="sizer-primary aud">
                        <audio controls src="${ blockData.attachment.url }"></audio>
                        <p class="footnote">${ blockData.description.plain }</p>
                    </article>
                    <header class="sizer-secondary">
                        <p class="footnote">${ blockData.title }</p>
                    </header>
                </li>
				`

			channelBlocks.insertAdjacentHTML('beforeend', audioItem)

			// More on`audio`:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

	// Linked (embedded) media…
	else if (blockData.type == 'Embed') {
		let embedType = blockData.embed.type

		// Linked video!
		if (embedType.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
			let linkedVideoItem =
				`
				<li class="list-item" data-category="video">
                    <header class="sizer-secondary">
                        <p class="footnote">${ blockData.title }</p>
                    </header>
                    <article class="sizer-primary vid">
						<a href="${ blockData.source.url }"></a>
                        ${ blockData.embed.html }
                    </article>
                    <header class="sizer-secondary">
                        <p class="footnote">${ blockData.title}</p>
                    </header>
                </li>
				`

			channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)

			// More on `iframe`:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
		}

		// Linked audio!
		else if (embedType.includes('rich')) {
			let linkedAudioItem =
				`
				<li class="list-item" data-category="audio">
                    <header class="sizer-secondary">
                        <p class="footnote">${ blockData.title }</p>
                    </header>
                    <article class="sizer-primary aud">
                        <a href="${ blockData.source.url }"></a>
                        <p class="footnote">${ blockData.description.plain }</p>
                    </article>
                    <header class="sizer-secondary">
                        <p class="footnote">${ blockData.title }</p>
                    </header>
                </li>
				`

			channelBlocks.insertAdjacentHTML('beforeend', linkedAudioItem)
		}
	}
}



// REMOVED_A function to display the owner/collaborator info:
let renderUser = (userData) => {
	let channelUsers = document.querySelector('#channel-users') // Container.

	let userAddress =
		`
		<address>
			<img src="${ userData.avatar }">
			<h3>${ userData.name }</h3>
			<p><a href="https://are.na/${ userData.slug }">Are.na profile ↗</a></p>
		</address>
		`

	channelUsers.insertAdjacentHTML('beforeend', userAddress)
}



// Finally, a helper function to fetch data from the API, then run a callback function with it:
let fetchJson = (url, callback) => {
	fetch(url, { cache: 'no-store' })
		.then((response) => response.json())
		.then((json) => callback(json))
}

// More on `fetch`:
// https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch



// Now that we have said all the things we *can* do, go get the channel data:
fetchJson(`https://api.are.na/v3/channels/${channelSlug}`, (json) => {
	console.log(json) // Always good to check your response!

	placeChannelInfo(json) // Pass all the data to the first function, above.
	renderUser(json.owner) // Pass just the nested object `.owner`.
})

// Get your info to put with the owner's:
fetchJson(`https://api.are.na/v3/users/${myUsername}/`, (json) => {
	console.log(json) // See what we get back.

	renderUser(json) // Pass this to the same function, no nesting.
})

// And the data for the blocks:
fetchJson(`https://api.are.na/v3/channels/${channelSlug}/contents?per=100&sort=position_desc`, (json) => {
	console.log(json) // See what we get back.

	// Loop through the nested `.data` array (list).
	json.data.forEach((blockData) => {
		// console.log(blockData) // The data for a single block.

		renderBlock(blockData) // Pass the single block’s data to the render function.
	})
	// 01. ADDITION FOR INTERSECTION OBSERVER. This connects Intersection Observer to my .list-items and follow when they enter the page
	// 02. Later when the .list-item enters viewport the callback triggers and it adds the .show class from line 350
	document.querySelectorAll('.sizer-primary').forEach(el => observer.observe(el))
})



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
// 02. Before that .list-item did not appear in the DOM. Line 296
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



// SCROLL DIRECTION CHECKER. Checks scroll direction 
let previousScroll = window.scrollY; // Sows how much has already been scrolled on the page

function updateScrollDir() {
	const y = window.scrollY;

	if (y === previousScroll) return; // <- важно

	let dir;

	if (y > previousScroll) {
		dir = "down";
	} else {
		dir = "up";
	}

	// Set the data-scroll-dir attribute on <html>
	document.documentElement.setAttribute("data-scroll-dir", dir);

	previousScroll = y;
}

updateScrollDir();
window.addEventListener("scroll", updateScrollDir, { passive: true });

// const flair = document.querySelector(".flair");

// let targetX = 0, targetY = 0;
// let currentX = 0, currentY = 0;

// const ease = 0.12;

// // СДВИГ относительно курсора
// const offsetX = 50;  // вправо
// const offsetY = 55;  // вниз

// window.addEventListener("mousemove", (e) => {
//   targetX = e.clientX + offsetX;
//   targetY = e.clientY + offsetY;
// }, { passive: true });

// function tick() {
//   currentX += (targetX - currentX) * ease;
//   currentY += (targetY - currentY) * ease;

//   flair.style.transform =
//     `translate(-50%, -50%) translate3d(${currentX}px, ${currentY}px, 0)`;

//   requestAnimationFrame(tick);
// }

// tick();




