(function( $, elementor ){

	"use strict";

	var CustWidget = {

		init: function() {
			var widgets = {
    			'custom-post-layout.default' : CustWidget.owlInit,
    			'tt-testimonials.default'    : CustWidget.testiSlider,
    			'tt-progress-bar.default'    : CustWidget.progressBar,
    			'tt-circle-bar.default'      : CustWidget.circleProgressBar,
    			'custom-map.default'         : CustWidget.initMap,
    		};
    		$.each( widgets, function( widget, callback ) {
    			window.elementorFrontend.hooks.addAction( 'frontend/element_ready/' + widget, callback );
    		});
		},
		owlInit: function( $scope ){
			var $carousels_collection = $('.owl-carousel', $scope);
			if( $carousels_collection.length && 'function' == typeof $.fn.owlCarousel ){
				$carousels_collection.each( function(el, index){
					var $this = $(this),
							$options = $this.data('owl-options'),
							$defaults = {
								loop:true,
								margin:20,
								nav:true,
								responsive:{
									0:{
										items:1
									},
									767:{
										items:2
									},
									1025:{
										items:3
									}
								}
							};
						$options = $.extend({}, $defaults, $options);
					$this.owlCarousel($options);
				});
			}
		},
		testiSlider: function( $scope ){
			var $carousels_collection = $('.tt-testimonials', $scope);
			if( $carousels_collection.length && 'function' == typeof $.fn.owlCarousel ){
				$carousels_collection.each( function(el, index){
					var $this = $(this),
							$options = $this.data('testimonials-options'),
							$defaults = {
								loop:true,
								margin:20,
								nav:true,
								responsive:{
									0:{
										items:1
									},
									767:{
										items:2
									},
									1025:{
										items:3
									}
								}
							};
						$options = $.extend({}, $defaults, $options);
					$this.owlCarousel($options);
				});
			}
		},
		progressBar: function( $scope ){
			var $target      = $scope.find( '.tt-progress-bar' ),
				percent      = $target.data( 'percent' ),
				type         = $target.data( 'type' ),
				deltaPercent = percent * 0.01;

			elementorFrontend.waypoint( $target, function( direction ) {
				var $this       = $( this ),
					animeObject = { charged: 0 },
					$statusBar  = $( '.tt-progress-bar-status-bar', $this ),
					$percent    = $( '.tt-progress-bar-percent-value', $this ),
					animeProgress,
					animePercent;

				if ( 'template_type_7' == type ) {
					$statusBar.css( {
						'height': percent + '%'
					} );
				} else {
					$statusBar.css( {
						'width': percent + '%'
					} );
				}

				animePercent = anime({
					targets: animeObject,
					charged: percent,
					round: 1,
					duration: 1000,
					easing: 'easeInOutQuad',
					update: function() {
						$percent.html( animeObject.charged );
					}
				});

			} );
		},
		circleProgressBar: function( $scope ) {
			var $progress = $scope.find( '.svg-circle-progress' );
			if ( ! $progress.length ) {
				return;
			}
			var $value        = $progress.find( '.circle-progress-value' ),
					percent       = parseInt( $value.data( 'value' ) ),
					radius        = parseInt( $progress.data( 'radius' ) ),
					circumference = parseInt( $progress.data( 'circumference' ) ),
					progress      = percent / 100,
					dashoffset    = circumference * ( 1 - progress ),
					duration      = $scope.find( '.tt-circle-progress-bar-wrap' ).data( 'duration' );
					console.log(percent);

			$value.css({
				'transitionDuration': duration + 'ms'
			});
			elementorFrontend.waypoint( $scope, function() {
				var $number = $scope.find( '.circle-counter-number' ),
					data = $number.data();
				var decimalDigits = data.toValue.toString().match( /\.(.*)/ );
				if ( decimalDigits ) {
					data.rounding = decimalDigits[1].length;
				}
				data.duration = duration;
				$number.numerator( data );
				$value.css({
					'strokeDashoffset': dashoffset
				});
			}, { offset: 'bottom-in-view' } );
		},
		initMap: function( $scope ){
			var $container = $scope.find( '.custom-map' ), map, settings, markers;
			if ( !window.google || !$container.length ) { return; }

			settings = $container.data( 'settings' );
			markers = $container.data( 'markers' );
			map  = new google.maps.Map( $container[0], settings );

			if ( markers ) {
				$.each( markers, function( index, pin ) {
					var marker, infowindow,
						pinData = {
						position: pin.position,
						map: map
					};
					if ( '' !== pin.image ) {
						pinData.icon = pin.image;
					}
					marker = new google.maps.Marker( pinData );
					if ( '' !== pin.desc ) {
						infowindow = new google.maps.InfoWindow({
							content: pin.desc,
							disableAutoPan: true
						});
					}
					marker.addListener( 'click', function() {
						infowindow.setOptions({ disableAutoPan: false });
						infowindow.open( map, marker );
					});
					if ( 'visible' === pin.state && '' !== pin.desc ) {
						infowindow.open( map, marker );
					}
				});
			}
		},
	};

	$( window ).on( 'elementor/frontend/init', CustWidget.init );

}(jQuery, window.elementorFrontend ) );