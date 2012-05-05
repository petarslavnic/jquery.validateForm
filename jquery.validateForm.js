/**
 *   jQuery validateForm plugin v1.1
 *   Author: Petar Slavnic
 *   Email: petarslavnic@gmail.com
 *   License: GPL
 */

(function( $ ){
	
    var methods = {
        init : function( options ) { 
            //*** Default error messages
            var messages = $.extend({
                required: "The {0} field is required.",
                matches:  "The {0} field does not match the {1} field.",
                valid_email: "The {0} field must contain a valid email address.",
                min_length: "The {0} field must be at least {1} characters in length.",
                max_length: "The {0} field can not exceed {1} characters in length.",
                valid_phone: "The {0} field must contain a valid phone number.",
                valid_url: "The {0} field must contain a valid URL.",
                integer: "The {0} field must contain an integer.",
                exact_length: "The {0} field must be exactly {1} characters in length.",
                alpha: "The {0} field may only contain alphabetical characters.",
                alpha_numeric: "The {0} field may only contain alpha-numeric characters.",
                alpha_dash: "The {0} field may only contain alpha-numeric characters, underscores, and dashes.",
                numeric: "The {0} field must contain only numbers.",
                decimal: "The {0} field must contain a decimal number.",
                is_natural: "The {0} field must contain only positive numbers.",
                is_natural_no_zero: "The {0} field must contain a number greater than zero.",
                valid_base64: "The {0} field must contain valid base64."
            }, options.messages);
            //*** Each object
            this.each(function() {
                var $form = $(this);
                //*** Get all fields with "rules" tag
                var $fields = $form.find('[rules]');
                //*** Check if events is object and foreach it
                if (typeof options.events === 'object') {
                    $.each(options.events, function($event, $funct) {
                        //*** Foreach all fields and apply event
                        $.each($fields, function() {
                            //*** Set field in variable
                            var $field = $(this);
                            //*** Bind event to field
                            $field.bind($event, $funct);
                        });
                    });
                }
                //*** Bind event to form
                $form.bind('submit', function(e) {
                    //*** Set variable to cellect error fields
                    var errObjects = new Array();
                    //*** If is set, call before method
                    if (typeof options.before !== 'undefined') options.before();
                    //*** Set final status
                    var $status = true;
                    //*** Foreach all fields and apply rules
                    $.each($fields, function() {
                        //*** Set object
                        var $obj = this;
                        //*** Set field in variable
                        var $field = $(this);
                        //*** Check if field is not disabled
                        if (!$field.is(':disabled')) {
                            //*** Get all field rules
                            var $rules = $field.attr('rules').split("|");
                            //*** Check if field is required
                            var $required = ($.inArray('required', $rules) > -1) ? true : false;
                            //*** Set object messages
                            $obj.messages = new Array();
                            //*** Apply each rule on field
                            $.each($rules, function(index, $rule) {
                                //*** Set rule parameter
                                var $param = false;
                                //*** Extract rule parameter
                                var $match = $rule.match(/(.*?)\[(.*)\]/);
                                if ($match) {
                                    //*** Set rule name
                                    $rule = $match[1];
                                    //*** Set parameter value
                                    $param = $match[2];
                                }
                                //*** If field is not empty and
                                if ($required || $field.val() !== "") {
                                    // Call rule method
                                    if (methods[$rule]($field.val(), $param, $form) === false) {
                                        if (typeof messages[$rule] !== 'undefined') {
                                            var tmpmsg = messages[$rule];
                                            tmpmsg = tmpmsg.format($field.attr('name'), $param);
                                            $obj.messages.push(tmpmsg);
                                        }
                                        errObjects.push($obj);
                                        $status = false;
                                    }
                                }
                            });
                        }
                    });	
					
                    //*** If is set, call complete method
                    if (typeof options.complete !== 'undefined') options.complete();
					
                    //*** Return Final Result
                    if ($status === true) {
                        //*** If is set, call success method
                        if (typeof options.success !== 'undefined') return options.success(e, $form);
                    } else {
                        //*** Prevent form to submit
                        e.preventDefault();
                        //*** If is set, call error method with objects that not pass validation
                        if (typeof options.error !== 'undefined') return options.error(errObjects);
                    }
                });
            });
        },
        required : function( $str ) {
            return (! /\S/.test($str)) ? false : true;
        },
        matches : function( $str, $val, $form ) {
            var $match_field = $('[name='+$val+']', $form);
            if (typeof $match_field === 'undefined') return false;
            return ($str !== $match_field.val()) ? false : true;
        },
        valid_email : function( $str ) {
            return (! /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/.test($str)) ? false : true;
        },
        min_length : function( $str, $val ) {
            if ($val.match(/[^0-9]/)) return false;
            return ($str.length < $val) ? false : true;
        },
        max_length : function( $str, $val ) {
            if ($val.match(/[^0-9]/)) return false;
            return ($str.length > $val) ? false : true;
        },
        valid_phone : function( $str ) {
            return (! /^\+(?:[0-9] ?){6,14}[0-9]$/.test($str)) ? false : true;
        },
        valid_url : function( $str ) {
            return (! /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test($str)) ? false : true;
        },
        integer : function( $str ) {
            /* /^[\-+]?[0-9]+$/ */
            return (! /^\d+$/.test($str)) ? false : true;
        },
        exact_length : function( $str, $val ) {
            if ($val.match(/[^0-9]/)) return false;
            return ($str.length != $val) ? false : true;
        },
        alpha : function( $str ) {
            return (! /^([a-z])+$/i.test($str)) ? false : true;
        },
        alpha_numeric : function( $str ) {
            return (! /^([a-z0-9])+$/i.test($str)) ? false : true;
        },
        alpha_dash : function( $str ) {
            return (! /^([-a-z0-9_-])+$/i.test($str)) ? false : true;
        },
        numeric : function( $str ) {
            return (! /^[\-+]?[0-9]*\.?[0-9]+$/.test($str)) ? false : true;
        },
        decimal : function( $str ) {
            return (! /^[\-+]?[0-9]+\.[0-9]+$/.test($str)) ? false : true;
        },
        is_natural : function( $str ) {
            return (! /^[0-9]+$/.test($str)) ? false : true;
        },
        is_natural_no_zero : function( $str ) {
            var $regex = /^[0-9]+$/;
            if (!$regex.test($str)) return false;
            if ($str == 0) return false;
            return true;
        },
        valid_base64 : function( $str ) {
            return (! /[^a-zA-Z0-9\/\+=]/.test($str)) ? false : true;
        }
    };

    $.fn.validateForm = function( method ) {
    
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.validateForm' );
        }    
  
    };
    
    String.prototype.format = function() {
        var formatted = this;
        for(arg in arguments) {
            formatted = formatted.replace("{" + arg + "}", arguments[arg]);
        }
        return formatted;
    };

})( jQuery );