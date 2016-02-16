/**
 * LBS fullPage
 * Date: 2014-11-24
 * ==================================================================
 * opts.direction 滚动方向 左右left 上下top 默认top
 * opts.wrapper 包装容器 一个字符ID 如'#fp_wrapper'
 * opts.pageShow 是否隐藏每页的内容 默认false
 * opts.pageClass 滚屏页的共同类名 默认'fp_page' (滚屏页的内容默认都隐藏时设置)
 * opts.mouseShow 是否滚动鼠标翻页 默认true
 * opts.navShow 是否显示导航指示 默认false
 * opts.navClass 导航指示容器的类名 默认'fp_navigation'
 * opts.arrowShow 是否显示下一页箭头 
 * opts.arrowClass 下一页箭头容器类名 默认'fp_arrow'
 * opts.titleShow 是否显示导航标题文本 默认false
 * opts.text 标题文本数组
 * opts.current 当前页/导航指示 类名 默认'fp_active'
 * opts.before 当前页变为前一页时 增加的类名 默认'fp_backwind'
 * opts.backwind 是否开启倒带模式 默认false 
 				如开启 当前页变为前一页时 删除opts.current类名并增加opts.before类名 
 * opts.delay 滚屏延迟时间 默认0.5s 开启倒带模式时有效 
 			 不小于每页动画元素的动画持续时间
 * opts.duration 滚屏持续时间 默认0.5s
 * opts.start(index) 滚动前执行函数 index为当前索引
 * opts.end(index) 滚动完成执行函数
 * ==================================================================
 * this.index 当前索引值(在哪一屏)
 * this.support3d 是否支持translate3d动画属性
 * this.addCss(css) 增加样式  addCss('div{width:100px;}')
 * this.scrollTo(index) 滚动到哪一屏 index从0开始
 * this.scrollToPrev() 滚动到上一页
 * this.scrollToNext() 滚动到下一页	
 * ==================================================================
 * 需要引入jquery
 * IE6~IE9 不支持css3动画
 * ==================================================================
 **/

;(function($) {

	function support3d() {
		var el = document.createElement('p'),
			has3d,
			transforms = {
				'webkitTransform': '-webkit-transform',
				'OTransform': '-o-transform',
				'msTransform': '-ms-transform',
				'MozTransform': '-moz-transform',
				'transform': 'transform'
			};
		document.body.appendChild(el);
		for (var t in transforms) {
			if (el.style[t] !== undefined) {
				el.style[t] = 'translate3d(1px,1px,1px)';
				has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
			}
		}
		document.body.removeChild(el);
		return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
	}

	function addCSS(css) {
		var doc = document,
			head = doc.getElementsByTagName("head")[0],
			style = doc.createElement("style");
		style.type = "text/css";
		try {
			style.appendChild(document.createTextNode(css));
		} catch (ex) {
			style.styleSheet.cssText = css;
		};
		head.appendChild(style);
	}

	var fullPage = function(opts) {
		this.wrapper = $(opts.wrapper);
		this.pages = this.wrapper.children();
		this.length = this.pages.length;
		if (this.length < 1) return;
		this.direction = opts.direction || 'top';
		this.navShow = opts.navShow || false;
		this.navClass = opts.navClass || 'fp_navigation';
		this.arrowShow = opts.arrowShow || false;
		this.arrowClass = opts.arrowClass || 'fp_arrow';
		this.titleShow = opts.titleShow || false;
		this.titleShow && (this.text = opts.text || []);

		this.current = opts.current || 'fp_active';
		this.before = opts.before || 'fp_backwind';
		this.backwind = opts.backwind || false;
		this.delay = opts.delay || 500;
		this.interval = opts.interval || 1000;
		this.duration = opts.duration || 500;

		this.start = opts.start || function() {};
		this.end = opts.end || function() {};

		this.index = this.oIndex = 0;
		this.width = $(window).width();
		this.height = $(window).height();
		this.support3d = support3d();
		this.addCSS = addCSS;
		this.pageShow = opts.pageShow || false;
		this.pageClass = opts.pageClass || 'fp_page';
		this.mouseShow = opts.mouseShow === false ? false : true;

		this._init();
	};
	fullPage.prototype = {
		_init: function() {
			this.navShow && this._createNav();
			this.arrowShow && this._createArrow();
			this._initSet();
			this._bind();
		},
		_createNav: function() {
			this.nav = $('<ul class="' + this.navClass + '"></ul>').appendTo($('body').eq(0));
			for (var i = 0; i < this.length; i++) {
				if (!this.titleShow) {
					$('<li><a href="javascript:;">' + (i + 1) + '</a></li>').appendTo(this.nav);
				} else {
					$('<li><a href="javascript:;">' + (i + 1) + '</a><div>' + (this.text[i]) + '</div></li>').appendTo(this.nav);
				}
			}
			this.nav.css('margin-top', -this.nav.height() / 2);
			this.navs = this.nav.find('li');
		},
		_createArrow: function() {
			this.arrow = $('<div class="' + this.arrowClass + '"></div>').appendTo($('body').eq(0));
		},
		_initSet: function() {
			this.pages.eq(this.index).addClass(this.current);
			this.navShow && this.navs.eq(this.index).addClass(this.current);
			if (this.support3d) {
				if (this.pageShow) this.addCSS('.' + this.pageClass + ' *{visibility:hidden;} .' + this.current + ' *, .' + this.before + ' *{ visibility: visible;}');
			} else {
				this.wrapper.css('position', 'absolute');
			}
			this._set();
		},
		_set: function() {
			this.pages.css({
				width: this.width,
				height: this.height
			});
			if (this.direction === 'left') {
				this.wrapper.css({
					width: this.width * this.length,
					height: this.height
				});
				this.pages.css({
					float: 'left'
				});
			} else if (this.direction === 'top') {
				this.wrapper.css({
					width: this.width,
					height: this.height * this.length
				});
			}
		},
		_bind: function() {
			this._resize();
			this.mouseShow && this._mouseEvent();
			this.navShow && this._navEvent();
			this.arrowShow && this._arrowEvent();
			this.titleShow && this._titleEvent();
		},
		_resize: function() {
			var _this = this;
			$(window).on('resize', function() {
				_this.timer && clearTimeout(_this.timer);
				_this.timer = setTimeout(function() {
					_this.width = $(window).width();
					_this.height = $(window).height();
					_this._set();
					_this._scroll();
				}, 60);
			});
		},
		_mouseEvent: function() {
			var _this = this,
				mouseScroll = function(fn, s) {
					var time = +new Date(),
						x = 0,
						roll = function(e) {
							e = e || window.event;
							e.preventDefault ? e.preventDefault() : e.returnValue = false;
							x = e.wheelDelta ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
							if (+new Date() - time > (s || 1000)) {
								time = +new Date();
								fn(x);
							}
						};
					window.netscape ? _this.wrapper[0].addEventListener('DOMMouseScroll', roll, false) : _this.wrapper[0].onmousewheel = roll;
				};
			mouseScroll(function(x) {
				if (_this.isScroll) return;
				x < 0 ? _this.index++ : _this.index--;
				_this.index < 0 && (_this.index = 0);
				_this.index > _this.length - 1 && (_this.index = _this.length - 1);
				_this._animate();
			}, this.interval);
		},
		_navEvent: function() {
			var _this = this;
			this.nav.delegate('a', 'click', function() {
				if (_this.isScroll) return;
				_this.index = $(this).parent().index();
				_this._animate();
			});
		},
		_arrowEvent: function() {
			var _this = this;
			this.arrow.on('click', function() {
				_this.scrollToNext();
			});
		},
		_titleEvent: function() {
			var _this = this;
			this.nav.delegate('li', 'mouseover', function() {
				$(this).find('div').show();
			});
			this.nav.delegate('li', 'mouseout', function() {
				$(this).find('div').hide();
			});
		},
		_animateStart: function() {
			this.isScroll = true;
			this.start && this.start(this.index);
			this.backwind && this.pages.eq(this.oIndex).removeClass(this.current).addClass(this.before);
			this.navShow && this.navs.eq(this.oIndex).removeClass(this.current);
			this.navShow && this.navs.eq(this.index).addClass(this.current);
			this.arrowShow && this.arrow.fadeOut();
		},
		_animateEnd: function() {
			this.isScroll = false;
			this.backwind ? this.pages.eq(this.oIndex).removeClass(this.before) : this.pages.eq(this.oIndex).removeClass(this.current);
			this.pages.eq(this.index).addClass(this.current);
			this.arrowShow && ((this.index !== this.length - 1) && this.arrow.fadeIn());
			this.oIndex = this.index;
			this.end && this.end(this.index);
		},
		_animate: function() {
			var _this = this;
			if (this.index === this.oIndex) return;
			if (this.isScroll) return;
			this._animateStart();
			(this.backwind && this.support3d) ? setTimeout(function() {
				_this._scroll();
			}, this.delay): this._scroll();
		},
		_scroll: function() {
			var _this = this;
			if (this.support3d) {
				if (this.direction === 'left') {
					this.wrapper.css({
						transition: 'transform ' + this.duration + 'ms',
						transform: 'translate3d(' + (-this.index * this.width) + 'px,0,0)'
					});
				} else if (this.direction === 'top') {
					this.wrapper.css({
						transition: 'transform ' + this.duration + 'ms',
						transform: 'translate3d(0,' + (-this.index * this.height) + 'px,0)'
					});
				}
				setTimeout(function() {
					_this._animateEnd();
				}, this.duration);
			} else {
				if (this.direction === 'left') {
					this.wrapper.animate({
						left: -this.index * this.width
					}, this.duration, function() {
						_this._animateEnd();
					});
				} else if (this.direction === 'top') {
					this.wrapper.animate({
						top: -this.index * this.height
					}, this.duration, function() {
						_this._animateEnd();
					});
				}
			}
		},
		scrollToPrev: function() {
			this.index--;
			this.index < 0 && (this.index = 0);
			this._animate();
		},
		scrollToNext: function() {
			this.index++;
			this.index > this.length - 1 && (this.index = this.length - 1);
			this._animate();
		},
		scrollTo: function(index) {
			this.index = index;
			this._animate();
		}
	};
	window.fullPage = fullPage;
}(jQuery));