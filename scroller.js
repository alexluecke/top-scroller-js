var TopScroller = (function($) {
	"use strict";

	var self = this;

	self.$control = null;
	self.$window = $(window);
	self.$body = (window.opera) ?
		document.compatMode == "CSS1Compat" ? $('html') : $('body') :
		$('html,body');

	self.control = {
		classes: [],
		title: 'Scroll Back to Top',
		object: null,
		html: 'BACK TO TOP',
		id: '#scroll-top',
		offx: 20,
		offy: 20,
		duration: {
			fade: {
				"in": 500,
				"out": 100,
			},
		}
	};

	self.config = {
		method: 'js', // method in [ 'css', 'js' ]
		scroll: {
			position: {
				start: 100, // Scroll position to show.
				to: 0, // How far from top to scroll.
			},
			duration: {
				slide: 1000,
			},
		},
	};

	self.state = {
		visible: false,
		in_progress: false,
	};

	self.scrollUp = function() {
		// Hide after click
		self.hide();

		// Make sure we don't show until after scrollUp finishes
		self.state.in_progress = true;

		if (self.config.method.js === 'js')
			self.$control.css({ opacity: 0 });

		var dest = isNaN(self.config.scroll.position.to) ?
			self.config.scroll.position.to :
			parseInt(self.config.scroll.position.to);

		// If the the destination is an object.
		if (typeof dest == "string" && $('#' + dest).length == 1)
			dest = $('#' + dest).offset().top;

		self.$body.animate({
			scrollTop: dest
		}, {
			duration: self.config.scroll.duration.slide,
			complete: function() {
				self.state.in_progress = false;
			},
		});
	};

	self.toggleControls = function() {
		var top_pos = self.$window.scrollTop();

		if (!this.css_fixed_pos_supported)
				this.keepFixed();

		if (top_pos >= self.config.scroll.position.start) {
			if (!self.state.visible && !self.state.in_progress) self.show();
		} else if (top_pos < self.config.scroll.position.start) {
			if (self.start.visible) self.hide();
		}
	};

	self.keepFixed = function() {
		var x = self.$window.scrollLeft() + self.$window.width() - self.$control.width() - self.control.offx;
		var y = self.$window.scrollTop() + self.$window.height() - self.$control.height() - self.control.offy;
		self.$control.css({ left: x+'px', top: y+'px'});
	};

	self.show_cb = function() {
		if (self.config.method.css === 'css') {
			return function() {
				self.state.visible = true;
				self.$control.addClass('visible');
			};
		} else {
			return function() {
				self.state.visible = true;
				self.$control.stop().animate({
					opacity: 1
				}, self.control.duration.fade.in);
			};
		}
	};

	self.hide_cb = function(args) {
		if (self.config.method.css === 'css') {
			return function() {
				self.state.visible = false;
				self.$control.addClass('visible');
			};
		} else {
			return function() {
				self.state.visible = false;
				self.$control.stop().animate({
					opacity: 0
				}, self.control.duration.fade.out);
			};
		}
	};

	self.init = function(args) {
		// TODO: extract args and override configurations.
		$(document).ready(function() {

			// TODO: Really these should be handled in CSS with shims
			var ie_browser = document.all;
			self.css_fixed_pos_supported = !ie_browser ||
				(ie_browser && document.compatMode=="CSS1Compat" && window.XMLHttpRequest);

			self.show = self.show_cb({});
			self.hide = self.hide_cb({});

			self.$control = $('<div>' + self.control.html + '</div>');
			self.$control.attr('id', self.control.id);

			if (self.control.classes.length > 0)
				self.$control.attr('class', self.control.classes.join(' '));

			// TODO: This should be done with CSS classes
			self.$control.css({
				//width: self.$control.width()+"px",
				position: self.css_fixed_pos_supported ? 'fixed' : 'absolute',
				bottom: self.control.offy + "px",
				right: self.control.offx + "px",
				cursor: 'pointer',
				zIndex: '100',
				opacity: 0,
			});

			self.$control.attr({ title: self.control.title });

			self.$control.click(function() {
				self.scrollUp();
			});

			self.$body.append(self.$control);

			self.$window.bind('scroll resize', function(e) {
				self.toggleControls();
			});
		});
	};

	return self;
})(jQuery);

TopScroller.init();
