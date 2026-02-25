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
	// channelDescription.innerHTML = channelData.description.html - this did not allow me to costumize typo
	channelDescription.innerHTML = channelData.description.plain
	// channelCount.innerHTML = channelData.counts.blocks - NOT USING
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// ADDITION. Func setup for making thumbs for pdf and videos (uploaded)
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

// Building thumbnail based on the url for youtube
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
			<article class="sizer-primary img">
				<img class="other-marker-3" src="assets/blob-blue.svg" alt="" aria-hidden="true">
				<img class="other-marker-4" src="assets/blob-black.svg" alt="" aria-hidden="true">
				<div class="masked">
					<a href="${ blockData.source.url }" target="_blank">
						<img src="${ blockData.image.medium.src_2x }" alt="">
					</a>
				</div>
			</article>
		</li>
		`

		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}

	// Images!
	else if (blockData.type == 'Image') {
		let imageItem =
		`
		<li class="list-item" data-category="image">
            <article class="sizer-primary img">
				<img class="other-marker-1" src="assets/blob-gray.svg" alt="" aria-hidden="true">
				<img class="other-marker-2" src="assets/blob-orange.svg" alt="" aria-hidden="true">
				<div class="masked">
					<a href="https://www.are.na/block/${blockData.id}" target="_blank">
						<img src="${blockData.image.medium.src_2x}" alt="">
					</a>
                </div>
            </article>
        </li>
		`

		channelBlocks.insertAdjacentHTML('beforeend', imageItem)
	}

	// Text!
	else if (blockData.type == 'Text') {
		let textItem =
		`
		<li class="list-item" data-category="text">
			<article class="sizer-primary text text-marker">
				<a href="https://www.are.na/block/${blockData.id}" target="_blank">
					<button></button>
				</a>
			</article>
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
				<article class="sizer-primary vid">
					<img class="video-marker" src="assets/video-marker.svg" alt="" aria-hidden="true">
					<div class="masked">
						<a class="media-link" href="${href}" target="_blank">
							<img src="${thumb}" alt="${blockData.title}" loading="lazy">
						</a>
					</div>
				</article>
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
				<article class="sizer-primary doc">
					<img class="pdf-marker" src="assets/read-marker.svg" alt="" aria-hidden="true">
					<div class="masked">
						<a class="media-link" href="${pdfHref}" target="_blank" rel="noopener noreferrer">
							${imageSrc ? `<img src="${imageSrc}" alt="${blockData.title}" loading="lazy">` : ``}
						</a>
					</div>
				</article>
			</li>
			`

			channelBlocks.insertAdjacentHTML('beforeend', pdfItem);
		}

		// Uploaded audio!
			else if (contentType.includes('audio')) {
			let audioItem =
				`
				<li class="list-item" data-category="audio">
					<article class="sizer-primary img audio-marker">
						<a href="https://www.are.na/block/${blockData.id}" target="_blank">
							<button></button>
						</a>
					</article>
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
					<article class="sizer-primary vid">
						<img class="video-marker" src="assets/video-marker.svg" alt="" aria-hidden="true">
						<div class="masked">
							<a class="media-link" href="${href}" target="_blank" rel="noopener noreferrer">
								<img src="${thumb}" alt="${blockData.title}" loading="lazy">
							</a>
						</div>
					</article>
				</li>
			`

			channelBlocks.insertAdjacentHTML("beforeend", linkedVideoItem);
		}

		else if (embedType.includes('rich')) {
			let linkedAudioItem =
				`
				<li class="list-item" data-category="audio">
					<article class="sizer-primary img audio-marker">
						<a href="https://www.are.na/block/${blockData.id}" target="_blank">
							<button></button>
						</a>
					</article>
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