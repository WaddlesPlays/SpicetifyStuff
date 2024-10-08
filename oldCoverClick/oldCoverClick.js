(function oldCoverClick() {
    // Get the <button> element that the cover uses
	const coverButton = document.querySelector( '.HD9s7U5E1RLSWKpXmrqx, .Root__now-playing-bar [data-testid="cover-art-button"]' );
    
	// Ensure the UI is fully loaded, to prevent issues later.
	if ( !coverButton || !( Spicetify?.Player?.data && Spicetify?.Menu && Spicetify?.LocalStorage && Spicetify?.Platform ) ) {
		setTimeout( oldCoverClick, 1000 );
		return;
	}

    // Hook the cover on startup
    hookCoverButton();

    // Updates (or creates) the click event of the cover button
    function hookCoverButton() {
        // Navigates to the currently playing song on click
        coverButton.addEventListener("click", async (e) => {
            // Prevent the Now Playing panel from appearing
            e.stopImmediatePropagation();

            // Return early if data is not able to be operated on
            if (Spicetify.Player.data == null) {
                return;
            }

            // Get the context URL, as in where the current song is playing from
            let contextURI = Spicetify.Player.data.context.uri.split(":");
            let contextURL = `/${contextURI[1]}/${contextURI[2]}`;

            // Open the context URL, as in where the current song is playing from, if not there already
            if (!(Spicetify.Platform.History.location.pathname == contextURL)) {
                Spicetify.Platform.History.push(contextURL);
                // Wait a bit for the new page to load. Try increasing if you're constantly having to click twice!
                await sleep(200);
            }

            // Scroll to the song position
            let index = Spicetify.Player.data.index.itemIndex;
            let scrollBy = Math.max(0, index * 56.55); // NOTE This math isn't perfect, absurdly high indexes may not scroll enough for the song to be visible
            document.querySelector(".Root__main-view .main-view-container__scroll-node").childNodes[1].scroll(0, scrollBy); // I just know this won't work for long
        })
    }

    // Wait the specified amount, in ms
    function sleep(ms) {
        return new Promise(finish => { setTimeout(() => { finish(2) }, ms) });
    }

    // Rerun hookCoverButton everytime the song changes, to link to the new song
    Spicetify.Player.addEventListener("songchange", hookCoverButton);
})();
