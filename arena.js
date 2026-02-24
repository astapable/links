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
	// channelDescription.innerHTML = channelData.description.html
	channelDescription.innerHTML = channelData.description.plain
	// channelCount.innerHTML = channelData.counts.blocks
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// ADDITION. Func setup for making thumbs for pdf and videos
// Picking are.na img for covers
function pickArenaImage(blockData) {
	return (
    	blockData?.image?.large?.src ||
   		blockData?.image?.large?.url ||
    	blockData?.image?.display?.src ||
    	blockData?.image?.display?.url ||
    	blockData?.image?.thumb?.src ||
    	blockData?.image?.thumb?.url ||
    	blockData?.image?.medium?.src_2x ||
    	blockData?.image?.medium?.src ||
    	""
	);
}

// Adds url from are.na
function pickHref(blockData) {
	return blockData?.source?.url || blockData?.attachment?.url || blockData?.url || "";
}

// Picking a youtube video ID from usu url
function getYouTubeId(url = "") {
	try {
    	const u = new URL(url);
    	return (
    		u.searchParams.get("v") ||
    		u.pathname.match(/\/(embed|shorts)\/([^/?]+)/)?.[2] ||
    		(u.hostname.includes("youtu.be") ? u.pathname.split("/")[1] : null)
    	);
  	} catch {
   		return null;
  	}
}

// Building thumbnail based on the url
function getYouTubeThumbnailUrl(videoId, quality = "hqdefault") {
	return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

// Picking a thumbnail for video blocks
function pickVideoThumb(blockData) {
  	const href = pickHref(blockData);
  	const ytId = getYouTubeId(href);

	return (
   		pickArenaImage(blockData) ||
    	blockData?.embed?.thumbnail_url ||
    	(ytId ? getYouTubeThumbnailUrl(ytId, "hqdefault") : "")
	);
}

// Picking  cover image for PDFs
function pickPdfCover(blockData) {
	return pickArenaImage(blockData);
}



// Then our big function for specific-block-type rendering:
let renderBlock = (blockData) => {
	let channelBlocks = document.querySelector('#channel-blocks')

	// Links!
	if (blockData.type == 'Link') {
		let linkItem =
		`
		<li class="list-item" data-category="link">
			<header class="sizer-secondary">
				<p class="footnote">${ blockData.title }</p>
			</header>
			<article class="sizer-primary img">
				<a href="${ blockData.source.url }" target="_blank">
					<img src="${ blockData.image.medium.src_2x }" alt="">
				</a>
			</article>
			<header class="sizer-secondary">
				<p class="footnote">${ blockData.title }</p>
			</header>
		</li>
		`

		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
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
		let contentType = blockData?.attachment?.content_type || "";

		// Uploaded videos!
		if (contentType.includes('video')) {
			let href = blockData?.attachment?.url || "";
			let thumb = pickVideoThumb(blockData);
			let videoItem =
			`
			<li class="list-item" data-category="video">
				<header class="sizer-secondary">
					<p class="footnote">${blockData.title}</p>
				</header>
				<article class="sizer-primary vid">
					<a class="media-link" href="${href}" target="_blank" rel="noopener noreferrer">
						<img src="${thumb}" alt="${blockData.title}" loading="lazy">
					</a>
				</article>
				<header class="sizer-secondary">
					<p class="footnote">${blockData.title}</p>
				</header>
			</li>
			`

			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
		}

		// Uploaded PDFs!
		else if (contentType.includes('pdf')) {
			let imageSrc = pickArenaImage(blockData);
			let pdfHref  = pickHref(blockData);
			let pdfItem = 
			`
			<li class="list-item" data-category="text">
				<header class="sizer-secondary">
					<p class="footnote">${blockData.title}</p>
				</header>
				<article class="sizer-primary doc">
					<a class="media-link" href="${pdfHref}" target="_blank" rel="noopener noreferrer">
						${imageSrc ? `<img src="${imageSrc}" alt="${blockData.title}" loading="lazy">` : ``}
					</a>
				</article>
				<header class="sizer-secondary">
					<p class="footnote">${blockData.title}</p>
				</header>
			</li>
			`

			channelBlocks.insertAdjacentHTML('beforeend', pdfItem);
		}

		// Uploaded audio!
		else if (contentType.includes('audio')) {
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
		}
	}

	// Linked (embedded) media…
	else if (blockData.type == 'Embed') {
		let embedType = blockData.embed.type

		// Linked video!
		if (embedType.includes('video')) {
			let href  = pickHref(blockData);
			let thumb = pickVideoThumb(blockData);
			let linkedVideoItem = 
			`
				<li class="list-item" data-category="video">
					<header class="sizer-secondary">
						<p class="footnote">${blockData.title}</p>
					</header>
					<article class="sizer-primary vid">
						<a class="media-link" href="${href}" target="_blank" rel="noopener noreferrer">
							<img src="${thumb}" alt="${blockData.title}" loading="lazy">
						</a>
					</article>
					<header class="sizer-secondary">
						<p class="footnote">${blockData.title}</p>
					</header>
				</li>
			`

			channelBlocks.insertAdjacentHTML("beforeend", linkedVideoItem);
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
			<p></p>
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

// INTERSECTION OBSERVER for .nav.bottom
// Follow .hero section
// const heroTrigger = document.querySelector('.hero');

// if (heroTrigger) {
// 	const navObserver = new IntersectionObserver(
// 		([entry]) => {
// 			const showNav = entry.intersectionRatio < 0.8; 
// 			document.documentElement.classList.toggle('nav-visible', showNav); // When I scroll 20% of .hero appear
// 		},
// 			{threshold: [0.8] } // Use callbak on 80% of .hero appear when back
// 	);

// 	navObserver.observe(heroTrigger);
// }

const heroTrigger = document.querySelector('.hero');

if (heroTrigger) {
	const navObserver = new IntersectionObserver(
		([entry]) => {
		document.documentElement.classList.toggle('nav-visible', !entry.isIntersecting);
    },
    {
    	threshold: 0,
    	// Trigger on 60% viewport top
    	rootMargin: "-60% 0px 0px 0px",
    }
  );

  navObserver.observe(heroTrigger);
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



// https://www.youtube.com/watch?v=1lUKqISgRH0
// const canvas = document.querySelector('#draw');
// const ctx = canvas.getContext('2d')


// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// ctx.strokeStyle = '#bada55';
// ctx.lineJoin = 'round';
// ctx.lineCap = 'round';
// ctx.lineWidth = 100;

// let isDrawing = false;
// let lastX = 0;
// let lastY = 0;
// let hue = 0;
// let direction = true;

// function draw(e) {
// 	if(!isDrawing) return;
// 	ctx.strokeStyle = `hsl(${hue}, 100%, 50:)`;
// 	ctx.beginPath();
// 	ctx.moveTo(lastX, lastY);
// 	ctx.lineTo(e.offsetX, e.offsetY);
// 	ctx.stroke();
// 	[lastX, lastY] = [e.offsetX, e.offsetY];

// 	hue++;
// 	if (hue >= 360) {
// 		hue = 0;
// 	}
// }

// function clearCanvas() {
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
// }

// canvas.addEventListener('mousedown', (e) => {
// 	isDrawing = true;
// 	[lastX, lastY] = [e.offsetX, e.offsetY];
// });

// canvas.addEventListener('mousemove', draw);
// canvas.addEventListener('mouseup', () => {
// 	isDrawing = false;
// 	clearCanvas();
// });

// canvas.addEventListener('mouseout', () => {
// 	isDrawing = false;
// 	clearCanvas();
// });
