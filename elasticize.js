/*!
 * elasticize.js v2.5.0 - 07 August, 2013
 * By Amsul (http://amsul.ca)
 * Hosted on https://github.com/amsul/elasticize.js
 * Licensed under MIT ("expat" flavour) license.
 */

/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true,
    unused: true,
    eqnull: true
*/


(function( $ ) {

    'use strict';


    var

        /**
         *  Elasticize a `textarea` to grow/shrink
         *  as the user types
         */
        Elasticize = function( $textarea, options ) {

            var
                // The heights to track
                heightLatest = 0,
                heightMinimum = 0,
                heightCompensation = 0,
                cloneScrollHeight = 0,

                // Create a reference to the actual node
                textarea = $textarea.css( 'overflowY', 'scroll' )[ 0 ],

                // Create a clone and disable it
                $clone = $textarea.clone().attr({
                    tabindex: -1,
                    disabled: true,
                    name: ''
                }),

                // Merge the settings
                settings = $.extend( {}, $.fn.elasticize.defaults, options ),

                // Update the clone value and textarea height
                update = function() {

                    // Copy the value over to the clone
                    // with lines and characters padding
                    $clone.val( textarea.value + Array( settings.charsPadding + 1 ).join( '_' ) + Array( settings.linesPadding + 1 ).join( '\n' ) )

                    // Then measure the new scroll height with the compensation
                    cloneScrollHeight = $clone[ 0 ].scrollHeight + heightCompensation

                    // Compare it to the latest height
                    if ( heightLatest != cloneScrollHeight ) {

                        // Update the latest height
                        heightLatest = cloneScrollHeight

                        // Set the textarea height
                        $textarea.outerHeight( cloneScrollHeight + 'px' )
                    }
                },

                // On a paste event, wait a tick then update the clone
                tickUpdate = function() {
                    setTimeout( update, 0 )
                },

                // Elastic constructor
                ElasticArea = function() {

                    // On the jQuery object of the textarea
                    $textarea.

                        // Apply the default styling
                        css({

                            // Prevent manual resizing
                            resize: 'none',

                            // Transition at speed given
                            transition: 'height ' + settings.transition + 's linear'
                        }).

                        // Bind the events
                        on({
                            'keydown keyup change cut': update,
                            'input paste': tickUpdate
                        }).

                        // Put the wrapped clone in the DOM
                        after( $clone.wrap( '<div style="height:0;overflow:hidden">' ).parent() )


                    // Calculate the clone's height without a value
                    heightMinimum = $clone.val( '' ).outerHeight()


                    // Get the height compensation between the scroll height
                    // without a value and the minimum height
                    heightCompensation = Math.abs( $clone[ 0 ].scrollHeight - heightMinimum )


                    // Store the latest height with the compensation
                    heightLatest = heightMinimum + heightCompensation


                    // Set the clone's height as the minimum height
                    $clone.css({
                        height: heightMinimum + 'px'
                    })


                    // Trigger an update after a tick
                    tickUpdate()


                    // Return the api
                    return {
                        update: update
                    }
                } //ElasticArea


            // Return a new elastic area
            return new ElasticArea()
        } //Elasticize




    /**
     *  Extend jQuery
     */
    $.fn.elasticize = function ( options ) {
        return this.each( function() {
            var $this = $( this )
            if ( this.type == 'textarea' && !$this.data( 'elasticized' ) ) {
                $this.data( 'elasticized', new Elasticize( $this, options ) )
            }
            return this
        })
    }


    /**
     *  Set the defaults
     */
    $.fn.elasticize.defaults = {
        charsPadding: 10,
        linesPadding: 1,
        transition: 0.15
    }



})( jQuery );
