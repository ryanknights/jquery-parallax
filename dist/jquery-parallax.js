(function (document, window, $)
{	
	/*=================================
	=            Polyfills            =
	=================================*/
	
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

	// MIT license

	(function() {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }
	 
	    if (!window.requestAnimationFrame)
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
	              timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	 
	    if (!window.cancelAnimationFrame)
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        };
	}());

	if (!Function.prototype.bind)
	{
		Function.prototype.bind = function (context)
		{
			var fn = this;

			return function ()
			{
				return fn.apply(context, arguments);
			};
		};
	}

	function debounce (fn, delay) {
	  var timer = null;
	  return function () {
	    var context = this, args = arguments;
	    clearTimeout(timer);
	    timer = setTimeout(function () {
	      fn.apply(context, args);
	    }, delay);
	  };
	}

	/*==============================
	=            Plugin            =
	==============================*/
	
	function Parallax (el, options)
	{
		this.el  = el;
		this.$el = $(el);

		this.animationFrame    = null;
		this.scrolling         = false;

		this.currentTransforms = [];
		this.firstTops         = [];
		this.speeds            = [];

		this._setup();
		this._events();
	}

	Parallax.prototype._setup = function ()
	{	
		this.$window = $(window);

		this.lastScrollTop = null;

		this._cacheValues();
		this._parallax();
	};

	Parallax.prototype._events = function ()
	{
		this.$window.on('scroll.parallax.begin', this._beginScroll.bind(this));

		this.$window.on('scroll.parallax.debounce', debounce(function ()
		{
			cancelAnimationFrame(this.animationFrame);
			this.scrolling = false;
			this.$window.on('scroll.parallax.begin', this._beginScroll.bind(this));

		}.bind(this), 250));

		this.$window.on('resize.parallax', debounce(this.refresh.bind(this), 250));
	};

	Parallax.prototype._beginScroll = function ()
	{
		if (!this.scrolling)
		{
			this._go();
			this.scrolling = true;
			this.$window.off('scroll.parallax.begin');			
		}
	};

	Parallax.prototype._cacheValues = function ()
	{	
		var self = this;

		this.$el.each(function (index, el)
		{	
			var $this            = $(this),
				currentTransform = self.currentTransforms[index],
				offset           = $this.offset().top,
				top              = (currentTransform !== undefined)? offset - currentTransform : offset;

			self.firstTops[index] = top;
			self.speeds[index]    = $this.attr('data-speed');
		});
	};

	Parallax.prototype._go = function ()
	{	
		this.animationFrame = requestAnimationFrame(this._go.bind(this));
		this._parallax();
	};

	Parallax.prototype._isInView = function (el)
	{
	    var bounds = el.getBoundingClientRect();

	    return bounds.top < window.innerHeight && bounds.bottom > 0;
	};

	Parallax.prototype._parallax = function ()
	{
        var viewportTop = this.$window.scrollTop();

        if (viewportTop === this.lastScrollTop)
        {
        	return false;
        }

        this.lastScrollTop = viewportTop;
 		
 		for (var i = 0, l = this.$el.length; i < l; i++)
 		{
 			var el = this.$el[i];

			if (!this._isInView(el))
			{
				continue;
			}

			var $el = $(el);

			this.currentTransforms[i] = (viewportTop - this.firstTops[i]) * this.speeds[i];
				
			$el.css('transform','translate3d(0, ' + this.currentTransforms[i] +'px,0)'); 			
 		}
	};

	Parallax.prototype.refresh = function ()
	{	
		this.lastScrollTop = null;

		this._cacheValues();
		this._parallax();
	};

	function Plugin (options)
	{	
		var args = Array.prototype.slice.call(arguments, 1);

		var el   = $(this),
			data = el.data('parallax');

		if (!data)
		{
			el.data('parallax', (data = new Parallax(this, options)));
		}

		if (typeof options === "string")
		{
		    if (data[options] && options[0] !== '_')
		    {
		        data[options].apply(data, args);
		    }
		}		
	}	

	$.fn.jQueryParallax = Plugin;

}(document, window, jQuery));