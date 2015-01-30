/*
 * the hsl color pickr;
 * by benxshare at sangfor.com.cn
 */

(function($) {

	String.prototype.format = function()
	{
		var args = arguments;
		return this.replace(/%(\d+)/g,
			function(m, i) {
				return args[i];
			});
	};

	/*
	 *
	 * @param {type} o
	 * o = {
	 *  samples: ['#ff0000', '#00ff00', '#0000ff'],
	 *	defaults: '#ff0000',
	 *	nosamples: false,
	 *	callback: function(color){
	 *		//do something about this.color
	 *	}
	 * }
	 * @returns {_L6.$.fn}
	 */

	$.fn.sfColorPickr = function(o) {
		this.sfColorObj = $.sfColorPickr(this, o);
		return this;
	};
	$.sfColorPickr = function(container, o) {
		var container = $(container).get(0);
		return container.sfColorPickr || (container.sfColorPickr = new jQuery._sfColorPickr(container, o));
	};
	$._sfColorPickr = function(container, o) {
		var fb = this;
		var callback = o.callback;
		var samples = o.samples || [], de = [];
		var itpl = '<li sf:color="%0" style="background-color:%1;"></li>';
		$.each(samples, function(i, v) {
			de.push(itpl.format(v, v));
		});
		$(container).html('<div class="sf-colorpickr"><div class="sf-colorpickr-box"><div class="sf-cp-prev">&lsaquo;</div><div class="sf-cp-inner"><div class="sf-cp-list sf-cp-card"><ul>' + de.join("") + '<li class="sf-cp-custom"></li></ul></div><div class="sf-cp-define sf-cp-card"><div class="x-slide"><div name="hue" class="x-slide-btn"></div><div class="x-slide-bg sf-cp-huebar"></div></div><div class="x-slide"><div name="sat" class="x-slide-btn"></div><div rel="satuation" class="x-slide-bg"></div></div><div class="x-slide"><div name="light" class="x-slide-btn"></div><div rel="light" class="x-slide-bg"></div></div></div></div><div class="sf-cp-next">&rsaquo;</div></div></div>');
		var c = $(container), la = c.find('.sf-cp-prev'), ra = c.find('.sf-cp-next'),
			clist = c.find('.sf-cp-list'), cdef = c.find('.sf-cp-define'),
			bhue = c.find('[name="hue"]'),
			bsat = c.find('[name="sat"]'),
			blight = c.find('[name="light"]');
		var maxWidth = c.find('.x-slide-bg').width();
		var l = de.length;
		var now = 0; //0 -> list, 1 -> slider;
		clist.show();
		var cIndex = 0;
		if(o.nosamples){
			la.hide();
			ra.hide();
			clist.hide();
			cdef.show();
		}
		fb.moveList = function(dir) {
			var list = c.find('.sf-cp-list ul');
			cIndex = (dir == 'left') ? cIndex - 1 : cIndex + 1;
			if (Math.abs(cIndex) > (l - 5) || cIndex > 0) {
				cIndex = (dir == 'left') ? cIndex + 1 : cIndex - 1;
			}
			var x = 64 * cIndex;
			list.animate({left: x}, 225);
			fb.checkArrow();
		};
		fb.checkArrow = function() {

			if (Math.abs(cIndex) >= (l - 5)) {
				la.addClass('disabled');
				ra.removeClass('disabled');
			}

			if (cIndex >= 0) {
				ra.addClass('disabled');
				la.removeClass('disabled');
			}

			if(l < 5){
				la.addClass('disabled');
				ra.addClass('disabled');
			}
		};
		fb.checkArrow();
		fb.toggleCard = function(nm) {
			clist.show(), cdef.show();
			if (nm === 'list') {
				now = 0;
				ra.removeClass('disabled');
				clist.css({left: '-100%'}).animate({left: 0}, 225);
				cdef.css({left: 0}).animate({left: '100%'}, 300);
				fb.checkArrow();
			} else {
				now = 1;
				la.removeClass('disabled');
				ra.addClass('disabled');
				clist.css({left: '0%'}).animate({left: '-100%'}, 225);
				cdef.css({left: '100%'}).animate({left: '0'}, 300);
			}
		};
		function getColorIndex (color) {
			var index = samples.indexOf(color);
			return index < 0 ? samples.length : index;//返回自定义颜色的index
		}
		function selectIndex(index) {
			var li = clist.find('li')[index];
			clist.find('.seled').removeClass('seled');
			$(li).addClass('seled');
		}
		/**
		 * Change color with HTML syntax #123456
		 */
		fb.setColor = function(color, callback) {
			var unpack = fb.unpack(color),index = getColorIndex(color);
			if (fb.color !== color && unpack) {
				fb.color = color;
				fb.rgb = unpack;
				fb.hsl = fb.RGBToHSL(fb.rgb);
				fb.updateSat(fb.hsl);
				fb.updateLight(fb.hsl);
				fb.setHslPos(fb.hsl);
			}
			if (typeof callback === 'function') {
				callback(fb.color, index);
			}
			selectIndex(index);
			return this;
		};

		fb.updateValue = function(event) {
			if (this.value && this.value !== fb.color) {
				fb.setColor(this.value);
			}
		};
		/**
		 * Get absolute position of element
		 * @param {object} el description
		 */
		fb.absolutePosition = function(el) {
			var r = {x: el.offsetLeft, y: el.offsetTop};
			// Resolve relative to offsetParent
			if (el.offsetParent) {
				var tmp = fb.absolutePosition(el.offsetParent);
				r.x += tmp.x;
				r.y += tmp.y;
			}
			return r;
		};
		/* Various color utility functions */
		fb.pack = function(rgb) {
			var r = Math.round(rgb[0] * 255);
			var g = Math.round(rgb[1] * 255);
			var b = Math.round(rgb[2] * 255);
			return '#' + (r < 16 ? '0' : '') + r.toString(16) +
				(g < 16 ? '0' : '') + g.toString(16) +
				(b < 16 ? '0' : '') + b.toString(16);
		};

		fb.unpack = function(color) {
			if (color.length == 7) {
				return [parseInt('0x' + color.substring(1, 3)) / 255,
					parseInt('0x' + color.substring(3, 5)) / 255,
					parseInt('0x' + color.substring(5, 7)) / 255];
			}
			else if (color.length == 4) {
				return [parseInt('0x' + color.substring(1, 2)) / 15,
					parseInt('0x' + color.substring(2, 3)) / 15,
					parseInt('0x' + color.substring(3, 4)) / 15];
			}
		};
		fb.setHslPos = function(hsl) {
			var h = hsl[0], s = hsl[1], l = hsl[2];
			if (h < 0)
				h = 1 + h;
			if (s < 0)
				s = 1 + s;
			if(l<0){
				l = 1 + l;
			}
			bhue.css('left', h * maxWidth);
			bsat.css('left', s * maxWidth);
			blight.css('left', l * maxWidth);
		};
		fb.setHue = function(pos) {
			var h = pos / maxWidth;
			var t = fb.hsl;
			t[0] = h;
			fb.hsl = t;
			fb.setHslPos(fb.hsl);
		};
		fb.setSat = function(pos) {
			var h = pos / maxWidth;
			var t = fb.hsl;
			t[1] = h;
			fb.hsl = t;
			fb.setHslPos(fb.hsl);
		};

		fb.setLight = function(pos) {
			var h = pos / maxWidth;
			var t = fb.hsl;
			t[2] = h;
			fb.hsl = t;
			fb.setHslPos(fb.hsl);
		};
		fb.updateSat = function(hsl) {
			var css = "background: -webkit-linear-gradient(left, %0,%1,%2,%3,%4,%5); background: -moz-linear-gradient(left, %0,%1,%2,%3,%4,%5);background: -ms-linear-gradient(left, %0,%1,%2,%3,%4,%5);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=1, StartColorStr='%0', EndColorStr='%5')";
			var hue = hsl[0];
				var c0 = fb.pack(fb.HSLToRGB([hue, 0, .5])),
				c2 = fb.pack(fb.HSLToRGB([hue, .2, .5])),
				c4 = fb.pack(fb.HSLToRGB([hue, .4, .5])),
				c6 = fb.pack(fb.HSLToRGB([hue, .6, .5])),
				c8 = fb.pack(fb.HSLToRGB([hue, .8, .5])),
				c10 = fb.pack(fb.HSLToRGB([hue, 1, .5]));
			css = css.format(c0,c2,c4,c6,c8,c10);
			c.find('[rel="satuation"]').attr('style', css);
		};

		fb.updateLight = function(hsl){
			var css = "background: -webkit-linear-gradient(left, %0,%1,%2,%3,%4,%5); background: -moz-linear-gradient(left, %0,%1,%2,%3,%4,%5);background: -ms-linear-gradient(left, %0,%1,%2,%3,%4,%5);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=1, StartColorStr='%0', EndColorStr='%5')";
			var hue = hsl[0], sat = hsl[1];
			var c0 = fb.pack(fb.HSLToRGB([hue, sat, .0])),
			c2 = fb.pack(fb.HSLToRGB([hue, sat, .2])),
			c4 = fb.pack(fb.HSLToRGB([hue, sat, .4])),
			c6 = fb.pack(fb.HSLToRGB([hue, sat, .6])),
			c8 = fb.pack(fb.HSLToRGB([hue, sat, .8])),
			c10 = fb.pack(fb.HSLToRGB([hue, sat, 1]));
			css = css.format(c0,c2,c4,c6,c8,c10);
			c.find('[rel="light"]').attr('style', css);

		}

		fb.HSLToRGB = function(hsl) {
			var m1, m2, r, g, b;
			var h = hsl[0], s = hsl[1], l = hsl[2];
			m2 = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
			m1 = l * 2 - m2;
			return [this.hueToRGB(m1, m2, h + 0.33333),
				this.hueToRGB(m1, m2, h),
				this.hueToRGB(m1, m2, h - 0.33333)];
		};

		fb.hueToRGB = function(m1, m2, h) {
			h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
			if (h * 6 < 1)
				return m1 + (m2 - m1) * h * 6;
			if (h * 2 < 1)
				return m2;
			if (h * 3 < 2)
				return m1 + (m2 - m1) * (0.66666 - h) * 6;
			return m1;
		};

		fb.RGBToHSL = function(rgb) {
			var min, max, delta, h, s, l;
			var r = rgb[0], g = rgb[1], b = rgb[2];
			min = Math.min(r, Math.min(g, b));
			max = Math.max(r, Math.max(g, b));
			delta = max - min;
			l = (min + max) / 2;
			s = 0;
			if (l > 0 && l < 1) {
				s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
			}
			h = 0;
			if (delta > 0) {
				if (max == r && max != g)
					h += (g - b) / delta;
				if (max == g && max != b)
					h += (2 + (b - r) / delta);
				if (max == b && max != r)
					h += (4 + (r - g) / delta);
				h /= 6;
			}
			return [h, s, l];
		};


		//events binds
		la.on('click', function() {
			if (la.hasClass('disabled')) {
				return;
			}
			if (now == 0) {
				fb.moveList('left');
			} else {
				fb.toggleCard('list');
			}
		});
		ra.on('click', function() {
			if (ra.hasClass('disabled')) {
				return;
			}
			if (now == 0) {
				fb.moveList('right');
			} else {
				fb.toggleCard('define');
			}
		});
//bind the sample list;
		clist.find('li').on('click', function() {
			var me = $(this);
			c.find('.seled').removeClass('seled');
			me.addClass('seled');
			if (me.hasClass('sf-cp-custom')) {
				fb.toggleCard('define');
				return;
			}
			var color = me.attr('sf:color');
			fb.setColor(color, callback);
		});
		//slider draging
		var startLeft, startX;
		fb.mousedown = function(e, btn) {
			if (!document.dragging) {
				$(document).bind('mousemove', function(event) {
					event = event || window.event;
					fb.mousemove(event, btn);
				}).bind('mouseup', fb.mouseup);
				document.dragging = true;
			}
			var offset = btn.position();
			startLeft = offset.left;
			startX = e.clientX;
			return false;
		};
		fb.mouseup = function() {
			// Uncapture mouse
			$(document).unbind('mousemove', null);
			$(document).unbind('mouseup', null);
			document.dragging = false;
		};

		fb.mousemove = function(e, btn) {

			if (document.dragging === false)
				return;
			var deltaX = e.clientX - startX;
			var left = startLeft + deltaX, p;
			if (left > maxWidth) {
				left = maxWidth;
			}
			if (left < 0) {
				left = 0;
			}
			btn.css('left', left + 'px');
			if (btn.attr('name') === 'hue') {
				fb.setHue(left);
				fb.updateSat(fb.hsl);
				fb.updateLight(fb.hsl);
			} 

			if(btn.attr('name') == 'sat'){
				fb.setSat(left);								
				fb.updateLight(fb.hsl);
			}

			if(btn.attr('name') == 'light'){
				fb.setLight(left);
			}
			fb.color = fb.pack(fb.HSLToRGB(fb.hsl));
			if (typeof callback === 'function') {
				callback(fb.color);
			}
		};

		c.find('.x-slide-btn').on('mousedown', function(e) {
			e = e || window.event;
			//e.originalEvent.preventDefault();
			fb.mousedown(e, $(this));
			return false;
		});

		if (o.defaults) {
			fb.setColor(o.defaults, o.callback);
		}
	};
})(jQuery);
