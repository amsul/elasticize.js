/*!
    elasticize.js v2.0
    By Amsul (http://amsul.ca)

    Updated: 07 October, 2012

    (c) Amsul Naeem, 2012 - http://amsul.ca
    Licensed under MIT ("expat" flavour) license.
    Hosted on http://github.com/amsul/elasticize.js
*/

/*jshint
    debug: true,
    devel: true,
    browser: true
*/


(function( $, window, document, undefined ) {

    'use strict';

    var
        /**
         *  Elasticize a `textarea` to grow/shrink
         *  as the user types
         */
        Elasticize = function( textarea, options ) {

            var
                // Caching object
                CACHE = {},

                // The elastic constructor
                Elastic = function() {},

                // The elastic prototype
                E


            // Check if it is not a `textarea`
            if ( textarea.type !== 'textarea' ) { return false }


            //  Merge the options
            Elastic.options = $.extend( {}, $.fn.elasticize.defaults, options )


            // Create the prototype
            E = Elastic.prototype = {

                constructor: Elastic,


                /**
                 *  Create a new elastic textarea
                 *  and clone
                 */
                create: function( textarea ) {

                    // Store the initial height
                    CACHE.HEIGHT = getPixelValue( textarea, 'height' )

                    // Store as the min height
                    CACHE.MIN_HEIGHT = CACHE.HEIGHT

                    // Store the bottom padding
                    CACHE.PADDING_BOTTOM = Elastic.options.paddingBottom


                    // Create and store the textarea element
                    Elastic._textarea   =   textarea

                    // Create and store the jQuery textarea
                    Elastic.$textarea   =   $( textarea ).

                                                // Apply the default styling
                                                css({
                                                    boxSizing: 'border-box',
                                                    resize: 'none',
                                                    overflow: 'hidden',

                                                    // Given alignment to stop from bouncing
                                                    verticalAlign: 'top',

                                                    // Transition at speed given
                                                    transition: 'all ' + Elastic.options.transition + 's linear',

                                                    // Set the initial min height
                                                    minHeight: CACHE.MIN_HEIGHT + 'px'
                                                }).

                                                // Bind the events
                                                on({
                                                    'keydown keyup change cut': E.onChange,
                                                    'input paste': E.onPaste,
                                                    focusin: E.onFocus,
                                                    focusout: E.onBlur
                                                })


                    // Create and store a jQuery clone
                    Elastic.$clone  =   Elastic.$textarea.clone().

                                            // Apply the default styling
                                            css({
                                                height: 0
                                            }).

                                            // Bind the default state
                                            attr({
                                                tabindex: -1,
                                                disabled: true
                                            })

                    // Create and store the clone element
                    Elastic._clone  =   Elastic.$clone[ 0 ]


                    // Store the initial clone scroll height
                    CACHE.CLONE_SCROLL_HEIGHT = Elastic._clone.scrollHeight


                    Elastic.$textarea.

                        // Place the wrapped clone in the dom
                        after( Elastic.$clone.wrap( '<div style="height:0;overflow:hidden">' ).parent() ).

                        // Trigger a keydown on page load
                        trigger( 'keydown' )

                    return E
                }, //create


                /**
                 *  Update the `textarea` and clone values
                 */
                update: function() {

                    var
                        newScrollHeight,
                        clone = Elastic._clone,
                        textarea = Elastic._textarea


                    // Mirror over the value to the clone
                    clone.value = textarea.value


                    // Calculate the new scroll height
                    newScrollHeight = clone.scrollHeight + CACHE.PADDING_BOTTOM


                    // Compare the new scroll height to
                    // previous scroll height
                    if ( CACHE.CLONE_SCROLL_HEIGHT !== newScrollHeight ) {


                        console.log( CACHE.CLONE_SCROLL_HEIGHT, newScrollHeight )


                        // Set the new scroll height
                        CACHE.CLONE_SCROLL_HEIGHT = newScrollHeight


                        // Set the new height based on
                        // if the new scroll height is
                        // greater than the minimum height
                        CACHE.HEIGHT    =   ( CACHE.CLONE_SCROLL_HEIGHT > CACHE.MIN_HEIGHT ) ?

                                                // Set the height based on
                                                // original min height plus
                                                // the difference between
                                                // the clone scroll and offset
                                                CACHE.MIN_HEIGHT + ( clone.scrollHeight - clone.clientHeight ) :

                                                // Otherwise set the height to min height
                                                CACHE.MIN_HEIGHT


                        // Apply the new height as min height
                        textarea.style.minHeight = CACHE.HEIGHT + 'px'
                    }

                    return E
                }, //update


                /**
                 *  Expand `textarea` on focusin
                 */
                expand: function() {

                    // Increase the min height allowed
                    CACHE.MIN_HEIGHT += CACHE.PADDING_BOTTOM

                    // Expand the clone scroll height
                    CACHE.CLONE_SCROLL_HEIGHT += CACHE.PADDING_BOTTOM

                    // Trigger an update
                    E.update()

                    return E
                }, //expand


                /**
                 *  Shrink `textarea` on focusout
                 */
                shrink: function() {

                    // Decrease the min height allowed
                    CACHE.MIN_HEIGHT -= CACHE.PADDING_BOTTOM

                    // Shrink the clone scroll height
                    CACHE.CLONE_SCROLL_HEIGHT -= CACHE.PADDING_BOTTOM

                    // Trigger an update
                    E.update()

                    return E
                }, //shrink


                /**
                 *  Expand on focus
                 */
                onFocus: function( event ) {

                    E.expand()

                    return this
                }, //onFocus


                /**
                 *  Shrink on blur
                 */
                onBlur: function( event ) {

                    E.shrink()

                    return this
                }, //onFocus


                /**
                 *  Update a value on change
                 */
                onChange: function( event ) {

                    E.update()

                    return this
                }, //onChange


                /**
                 *  Update a value on paste
                 */
                onPaste: function( event ) {

                    // Wait a tick
                    setTimeout( E.update, 0 )

                    return this
                } //onPaste

            } // Elastic.prototype


            return new Elastic().create( textarea )
        } //Elasticize



    /**
     *  Extend jQuery
     */
    $.fn.elasticize = function ( options ) {
        return this.each( function() {
            if ( !$.data( this, 'elasticized' ) ) {
                $.data( this, 'elasticized', new Elasticize( this, options ) )
            }
            return this
        })
    }

    /**
     *  Set the defaults
     */
    $.fn.elasticize.defaults = {
        paddingBottom: 20,
        transition: 0.15
    }



    /**
     *  Helper function to get pixel value of a property
     */
    function getPixelValue( element, property ) {
        return parseInt( getComputedStyle( element, null ).getPropertyValue( property ), 10 )
    }



})( jQuery, window, document )




