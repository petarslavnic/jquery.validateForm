//************************
//***   Validate Form v1.1
//***   Author: Petar Slavnic
//***   
//************************

(function( $ ){
	
    var methods = {
        init : function( options ) { 
            //*** Each object
            this.each(function() {
                var $form = $(this);
                //*** Get all fields with "rules" tag
                var $fields = $form.find('[rules]');
                //*** Foreach all fields and apply event
                if (typeof options.event !== 'undefined') {
                    $.each($fields, function() {
                        //*** Set field in variable
                        var $field = $(this);
                        //*** Bind event to field
                        $field.bind('keyup change', options.event);
                    });
                }
                //*** Bind event to form
                $form.bind('submit', function(e) {
                    //*** Set variable to cellect error fields
                    var errObjects = new Array();
                    //*** Execute external "before" function
                    if (typeof options.before !== 'undefined') options.before(e);
                    //*** Set final status
                    var $status = true;
                    //*** Foreach all fields and apply rules
                    $.each($fields, function() {
                        //*** Set object
                        var $obj = this;
                        //*** Set field in variable
                        var $field = $(this);
                        //*** Get all field rules
                        var $rules = $field.attr('rules').split("|");
                        //var $required = ($.inArray('required', $rules) > -1) ? true : false;
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
                            // Call rule method
                            if (methods[$rule]($field.val(), $param) === false) {
                                errObjects.push($obj);
                                $status = false;
                            }
                        });
                    });	
					
                    //*** Execute external "complete" function
                    if (typeof options.complete !== 'undefined') options.complete(e);
					
                    //*** Return Final Result
                    if ($status) {
                        if (typeof options.success !== 'undefined') return options.success(e);
                    } else {
                        if (typeof options.error !== 'undefined') return options.error(e, errObjects);
                    }
					
                    //*** Trow exception if method not set
                    $.error( 'You need to set success and error method.' );
                });
            });
        },
        required : function( $str, $val ) {
            return (! /\S/.test($str)) ? false : true;
        },
        valid_email : function( $str, $val ) {
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
        valid_phone : function( $str, $val ) {
            return (! /^\+(?:[0-9] ?){6,14}[0-9]$/.test($str)) ? false : true;
        },
        valid_url : function( $str, $val ) {
            return (! /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test($str)) ? false : true;
        },
        integer : function( $str, $val ) {
            /* /^[\-+]?[0-9]+$/ */
            return (! /^\d+$/.test($str)) ? false : true;
        },
        exact_length : function( $str, $val ) {
            if ($val.match(/[^0-9]/)) return false;
            return ($str.length != $val) ? false : true;
        },
        alpha : function( $str, $val ) {
            return (! /^([a-z])+$/i.test($str)) ? false : true;
        },
        alpha_numeric : function( $str, $val ) {
            return (! /^([a-z0-9])+$/i.test($str)) ? false : true;
        },
        alpha_dash : function( $str, $val ) {
            return (! /^([-a-z0-9_-])+$/i.test($str)) ? false : true;
        },
        numeric : function( $str, $val ) {
            return (! /^[\-+]?[0-9]*\.?[0-9]+$/.test($str)) ? false : true;
        },
        decimal : function( $str, $val ) {
            return (! /^[\-+]?[0-9]+\.[0-9]+$/.test($str)) ? false : true;
        },
        is_natural : function( $str, $val ) {
            return (! /^[0-9]+$/.test($str)) ? false : true;
        },
        is_natural_no_zero : function( $str, $val ) {
            var $regex = /^[0-9]+$/;
            if (!$regex.test($str)) return false;
            if ($str == 0) return false;
            return true;
        },
        valid_base64 : function( $str, $val ) {
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
})( jQuery );