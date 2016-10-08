/****************************************************************************
	leaflet-control-boxmenu.js, Create Leaflet Control in a box with optional icons and size-toggle

	(c) 2015, FCOO

	https://github.com/FCOO/leaflet-control-boxmenu
	https://github.com/FCOO

****************************************************************************/

;(function ($, L, window, document, undefined) {
	"use strict";

L.Map.addInitHook(function () {
	this.options.controlBox = {
		list					: [],
		updateOnResize: false
	};
});

//L.Control.Box = L.Control.extend({
L.Control.Box = L.Control.ButtonGroup.extend({
	options: {
		width						: 0,
		height					: 0, //number or 'auto'
		scroll					: false,
		scrollX					: false,
		scrollY					: false,

		header					: '',
		icon						: 'plus',

		className				: '',
		cornerButtons		: {
												'pin'			: {icon:'thumb-tack',			color: '',		functionName: 'pin',					title: 'Pin the box'},
												'unpin'		:	{icon:'chevron-left',		color: '',		functionName: 'unpin',				title: 'Unpin the box'},
												'extend'	: {icon:'plus',						color: '',		functionName: 'extendBox',		title: 'Extend'},
												'diminish': {icon:'minus',					color: '',		functionName: 'diminishBox',	title: 'Diminish'},
												'close'		: {icon:'close',					color: 'red', functionName: 'close',				title: 'Close'}
											},

		open						: false,
		onClose					: null,
		onOpen					: null,
		singleBoxMode		: false,
		extendable			: false,
		extended				: false,
		pinable					: false,
		pined						: false,
		noMargin				: false,
		hiddenWhenClosed: false, 
		updateOnResize	: false,

	},

	//**************************************
	//initialize
	//**************************************
	initialize: function (options) {
		//Extend options with properties for leaflet-control-button-group
		$.extend( options, {
			className				: options.className,
			onClickObj			: {},
			separateButtons	: false,
			horizontal			: true,
			buttons					: [{
				icon			: options.icon,
				title			: options.header,
//				className	: '',
//				attr			: {},
//				href			: '',
				onClick		: this.open,
				context		: this
			}]
		});

		options.className = 'leaflet-control-boxmenu ' +
												(options.hiddenWhenClosed ? 'hidden-when-closed ' : '') +
												options.className;

		L.Control.ButtonGroup.prototype.initialize.call(this, options);
		L.Util.setOptions(this, options);

	
		this.pos			= this.options.position;
		this.vertPos	= this.options.position.indexOf('top') > -1 ? 'top' : 'bottom';
		this.horiPos	= this.options.position.indexOf('left') > -1 ? 'left' :
										this.options.position.indexOf('right') > -1 ? 'right' : 'center';

		//Adjust the icon for the unpin-button
		this.options.cornerButtons.unpin.icon =	'chevron-' + (this.pos == 'bottomcenter' ? 'down' : this.horiPos);

		this._maxWidth = 0;
		this._maxExtendedWidth = 0;

		this._initializing = true;
		this._open = false;
		this._extended = this.options.extended;
		this._pined = this.options.pined;

		this.contentsContainers = [];

		//Convert default boolean-options into functions
		var optionKeys = ['singleBoxMode', 'extendable', 'pinable', 'noMargin'],
				i, id,
				booleanAsFunction = function( value ){ return function(){ return value; }; };
		for (i=0; i<optionKeys.length; i++ ){
			id = optionKeys[i];
			if (typeof this.options[id] == 'boolean')
			  this.options[id] = booleanAsFunction(this.options[id]);
		}

	},

	//**************************************
	//onAdd
	//**************************************
	onAdd: function (map) {
		L.Control.ButtonGroup.prototype.onAdd.call(this, map);

		this.$container = $(this._container);

		//Stopping events from spilling through to the main map.
		L.DomEvent.disableClickPropagation(this._container);
		L.DomEvent.on(this._container, 'mousewheel', L.DomEvent.stopPropagation);


		//Create swipe-events to resize the box
		var closeDirection = 0,
				openDirection = 0;

		if (this.options.position.indexOf('top') > -1){
			closeDirection += window.Hammer.DIRECTION_UP;
			openDirection += window.Hammer.DIRECTION_DOWN;
		}
		if (this.options.position.indexOf('bottom') > -1){
			closeDirection += window.Hammer.DIRECTION_DOWN;
			openDirection += window.Hammer.DIRECTION_UP;
		}
		if (this.options.position.indexOf('left') > -1){
			closeDirection += window.Hammer.DIRECTION_LEFT;
			openDirection += window.Hammer.DIRECTION_RIGHT;
		}
		if (this.options.position.indexOf('right') > -1){
			closeDirection += window.Hammer.DIRECTION_RIGHT;
			openDirection += window.Hammer.DIRECTION_LEFT;
		}

		//Create the Hammer-manager object and adds two Hammer.Swipe Recognizer
		var mc =	new window.Hammer.Manager(this._container, {
								recognizers: [
									// RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
									[window.Hammer.Swipe, { event:'close',	direction: closeDirection	}],
									[window.Hammer.Swipe, { event:'open',		direction: openDirection	}],
								]
							});
		mc.on("close", $.proxy( this.close, this ) );
		mc.on("open", $.proxy( this.open, this ) );


		//Creating the header with icon
		this.$header =
			$('<div>')
				.addClass('leaflet-control-boxmenu-header')
				.append( $('<i>')
									.addClass('fa fa-'+this.options.icon)
									.on('click', $.proxy( this.close, this ) )
				)
				.append( this.options.header )
				.prependTo( this._container );



		//Create small leaflet-buttonGroup with close, open and pin-buttons
		var buttons = [], THIS = this;
		$.each( this.options.cornerButtons, function(id, options){
			buttons.push({
				id				: id,
				title			: options.title,
				icon			: options.icon,
				hidden		: false,
				hoverColor: options.color,
				onClick		: $.proxy( THIS[options.functionName], THIS ),
			});
		});

		this.buttonGroup = new L.Control.ButtonGroup({
					horizontal: true,
					small			: true,
					equalWidth: true,
					className	: '',
					buttons		: buttons
				});
				this.$header.append( this.buttonGroup._container );

		//Create default container for the contents
		this.$contentContainer = this.addContentsContainer( this.options );

		return this._container;
	},


	//**************************************
	//addTo
	//**************************************
	addTo: function (map) {
		L.Control.prototype.addTo.call(this, map);

		//Add to map's list of control-boxes
		map.options.controlBox.list.push(this);
		
		//Add onResize event to map to update boxes when the window-size is changed
		if (this.options.updateOnResize && !map.options.controlBox.updateOnResize){
			map.on('resize', function(){ 
				$.each(this.options.controlBox.list, function(index, box){
					if (box.options.updateOnResize)
						box._update();
				});
			});
			map.options.controlBox.updateOnResize = true;
		}


		//Save different control containers
		this.mapContainer = $(map.getContainer()).parent();
		
		
		this._initializing = false;
		if (this.options.open)
		  this.open();
		else
			this._update();

		return this;
	},


	//**************************************
	//addContentsContainer
	//**************************************
	addContentsContainer: function( options ){
		options = $.extend({
								onlyExtended	: false,
								neverExtended	: false,
								scroll				: false,
								scrollX				: false,
								scrollY				: false,
								width					: this.options.width,
							}, options);


		var $contentsContainer =
					$('<div>')
						.addClass(	'leaflet-control-boxmenu-container ' +
												(options.height == 'auto' ? 'auto' : 'fixed') + ' ' +
												(options.onlyExtended ? 'only-extended ' : '') +
												(options.neverExtended ? 'never-extended ' : '') +
												(options.scroll ? 'scroll ' : '') +
												(options.scrollX ? 'scroll-x ' : '') +
												(options.scrollY ? 'scroll-y ' : '') +
												(options.className || '')
						)
						.width( options.width + 'px')
						.css( 'max-width', options.width + 'px')
						.data('control-box-contents-options', options )
						.appendTo( this._container );

		if (options.height != 'auto'){
			$contentsContainer
				.height( options.height + 'px')
				.css( 'max-height', options.height + 'px');
		}

		if (!options.onlyExtended)
			this._maxWidth = Math.max( this._maxWidth, options.width );
		if (!options.neverExtended)
			this._maxExtendedWidth = Math.max( this._maxExtendedWidth, options.width );

		this.contentsContainers.push( $contentsContainer );

		if (this._map)
			this._update();

		return $contentsContainer;
	},

	//**************************************
	//close
	//**************************************
	close: function () {
		if (!this._open)
		  return;

		if (this._pined)
		  this.unpin();

		if (this.showSiblingsOnClose)
			this.$container.parent().siblings().find('.leaflet-control-boxmenu').show();
		this.showSiblingsOnClose = false;

		this._map.thaw();

		this._open = false;
		this.$container.removeClass('open');

		if (this.options.onClose)
			this.options.onClose( this );
	},

	//**************************************
	//open
	//**************************************
	open: function () {
		this._findOtherControls('left');


		if (this._initializing || this._open)
		  return;

		if ( this.options.singleBoxMode() || this.options.MANGLER ){
			//this.$container.parent().siblings().find('.leaflet-control-boxmenu').hide();
			this.showSiblingsOnClose = true;
		}

		this._open = true;
		this.$container.addClass('open');

		this._update();

		if (this.options.onOpen)
			this.options.onOpen( this );
	},

	//**************************************
	//extendBox / diminishBox
	//**************************************
	extendBox: function(){
		this._extended = true;
		this._update();
	},

	diminishBox: function(){
		this._extended = false;
		this._update();
	},

	//**************************************
	//pin
	//**************************************
	pin: function(){
		this._next = this.$container.next();
		this._parent = this.$container.parent();
		this._width = this.$container.outerWidth();
		this._height = this.$container.outerHeight();

		this.$container.detach();
		this.mapContainer.prepend( this.$container );

		this.$container.addClass('pin-'+this.pos);
		if ( this.pos == 'bottomcenter' ){
			this._map.bottomMargin( (this._height+2) + 'px' );

			this._map.panBy([0, -(this._height+2)/2], { animate: false } );

			//Update other pianble boxes
			var otherBoxes = this._findOtherControls( 'left right', 'top');
			$.each(otherBoxes,  function(index, box ){
				if (box.options.pinable())
				  box._update();
			});
	
		}
		else 
			this._map._setMargin(this.horiPos, (this._width+2) + 'px');

		this._pined = true;
		this._update();
	},

	//**************************************
	//unpin
	//**************************************
	unpin: function(){
		this.$container.detach();

		if (this._next.length)
		  this._next.before( this.$container );
		else
			this._parent.append( this.$container );

		this.$container.removeClass('pin-'+this.pos);
		if ( this.pos == 'bottomcenter' ){
			this._map.bottomMargin( 0 );

			this._map.panBy([0, (this._height+2)/2], { animate: false } );

			//Update other pianble boxes
			var otherBoxes = this._findOtherControls( 'left right', 'top');
			$.each(otherBoxes,  function(index, box ){
				if (box.options.pinable())
				  box._update();
			});

		}
		else
			this._map._setMargin(this.horiPos, 0);


		this._pined = false;
		this._update();
	},



	//**************************************
	//_update - update all parts of the control
	//**************************************
	_showButton: function( id, show ){ this.buttonGroup._showButton( this.buttonGroup.getButton( id ), show ); },

	_update: function(){

		//Show/hide top-rigth buttons
		var pinable = this.options.pinable(),
				extendable = this.options.extendable();

		//Close if pined but not pinable
		if (!pinable && this._pined){
		  this.close();//or unpin();
		}
		this._showButton('pin',		pinable && !this._pined);
		this._showButton('unpin', pinable && this._pined);

		this._showButton('extend',		extendable && !this._extended);
		this._showButton('diminish',	extendable && this._extended);

		//Update header
		this.$header.css({
			'max-width'			: this._extended ? this._maxExtendedWidth : this._maxWidth,
			'padding-right'	: $(this.buttonGroup._container).width() + 'px'
		});

		//Update padding-bottom to match map-margin
		if ((this.vertPos == 'top') && pinable)
			this.$container.css( 'padding-bottom', this._pined ? this._map.bottomMargin() : 0 );

		//Update no-margin
		this.$container.toggleClass('no-margin', this.options.noMargin() );

		//Update extended class
		this.$container.toggleClass('extended', (extendable && this._extended) );
	
	},

	//**************************************
	//_findOtherControls
	//**************************************
	_findOtherControls: function( horiPositions, vertPositions ){
		var result = [],	THIS = this;

		horiPositions = (horiPositions || 'left center right').split(' ');
		vertPositions = (vertPositions  || 'top bottom').split(' ');

		$.each( this._map.options.controlBox.list, function ( index, box ){
			if ( box !== THIS )
				for (var i=0; i<horiPositions.length; i++ )
					if ( box.horiPos == horiPositions[i] )
						for (var j=0; j<vertPositions.length; j++ )
							if ( box.vertPos == vertPositions[j] ){
								result.push( box );
								break;
							}
			});

		return result;
	}




});

}(jQuery, L, this, document));



