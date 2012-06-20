(function($) {

	var Elasticize = function( elem, options ) {

		var self = {}


		// return false if it's not a textarea
		if ( elem.type !== 'textarea' ) { return false }


		// bind the default options
		self.options = $.extend( {}, defaults, options )


		// expand the textarea on focus
		self.expand = function() {

			var clone = self.$clone[0],
					elem = self.$elem[0]

			// calculate new height
			var newHeight = clone.scrollHeight + self.options.paddingBottom

			// apply new height
			elem.style.height = newHeight + 'px'

			// trigger an `change`
			self.$elem.trigger('change')

			return self
		}


		// shrink the textarea on blur
		self.shrink = function() {

			var clone = self.$clone[0],
					elem = self.$elem[0]

			// calculate new height
			var newHeight = ( firefox )
												? clone.fullHeight
												: clone.fullHeight - self.options.paddingBottom

			// apply new height
			elem.style.height = newHeight + 'px'

			return self
		}


		// resize the textarea on various events
		self.resize = function() {

			var clone = self.$clone[0],
					elem = self.$elem[0]
			
			// mirror to the clone
			clone.value = elem.value

			// reset the clone height
			clone.style.height = 0

			// calculate the full height
			clone.fullHeight = clone.scrollHeight + self.options.paddingBottom


			// check if there's an increase or decrease in height
			if ( clone.fullHeight !== elem.clientHeight ) {

				// update the elem height
				elem.style.height = ( firefox )
															? clone.fullHeight + self.options.paddingBottom + 'px'
															: clone.fullHeight + 'px'
			}

			return self
		}


		// initialize everything
		self.__proto__.initialize = (function() {

			// store the elem & clone
			self.$elem = $(elem)
			self.$clone = self.$elem.clone().attr('tabindex',-1)


			// create an parent div for the clone
			self.$clone.box = $('<div />').css({
				height: 0,
				overflow: 'hidden'
			}).html( self.$clone )


			// do stuff to the $elem
			self.$elem

				// print the clone
				.after( self.$clone.box )

				// prevent manual resize
				.css({
					resize: 'none',
					overflow: 'hidden'
				})

				// bind events
				.on({

					// bind resize events
					'keydown keyup change cut blur focus': self.resize,
					'input paste': function() { setTimeout( self.resize, 0 ) },

					// bind the expand and shrink events
					'focus': self.expand,
					'blur': self.shrink
				})

		})()


		return self
	},


	// set the defaults
	defaults = { 'paddingBottom': 16 },
	firefox = $.browser.mozilla


	// extend jquery
	$.fn.elasticize = function ( options ) {


		// go through each object passed and return it
    return this.each(function () {

    	// check if it hasnt been elasticized

      if ( !$.data(this, 'elasticized') ) {
        $.data(this, 'elasticized', Elasticize( this, options ) )
      }

    })
  }

})(jQuery)