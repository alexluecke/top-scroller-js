# Top Scroller

Append element to perform scroll to top functionality.

## Usage

Include this after you have included the script:

    (function(ts) {
		if (ts) ts.init();
	})(function($) { return $ ? new TopScroller($) : null; }(jQuery));
