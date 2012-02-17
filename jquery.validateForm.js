//************************
//***   Validate Form v1.0
//***   Author: Petar Slavnic
//***   
//************************

(function( $ ){

    $.fn.validateForm = function(options) {  

        // Create some defaults, extending them with any options that were provided
        var settings = $.extend({
            'required'		: /\S/,
            'valid_phone'       : /^\+(?:[0-9] ?){6,14}[0-9]$/,
            'valid_email'       : /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/,
            'valid_url'         : /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
            'integer'           : /^\d+$/
        }, options);

        var status = true;
        var $form = $(this);
        var $input = $form.find('[rules]');
        $input.removeClass("warning");
        $.each($input, function() {
            var $obj = $(this);
            var $rules = $obj.attr('rules').split("|");
            var $required = ($.inArray('required', $rules) > -1) ? true : false;
            $.each($rules, function(index, rule) {
                var $regex;
                $.each(settings, function(key, regexpression) {
                    if (key == rule) { 
                        $regex = regexpression;
                    } 
                });
                if (typeof $regex != "undefined") {
                    if ($required) {
                        if (!$regex.test($obj.val())) {
                            if (!$obj.hasClass('warning')) {
                                $obj.addClass('warning');
                            }
                            status = false;
                        }
                    } else {
                        if ($obj.val() != "") {
                            if (!$regex.test($obj.val())) {
                                if (!$obj.hasClass('warning')) {
                                    $obj.addClass('warning');
                                }
                                status = false;
                            }
                        }
                    }
                } else {
                    var $matches = rule.substr(0,7);
                    if ($matches == 'matches') {
                        var $count = rule.length - 9;
                        var $match = rule.substr(8,$count);
                        var $object_to_match = $form.find('[name="'+$match+'"]');
                        if ($object_to_match.val() != $obj.val()) {
                            if (!$obj.hasClass('warning')) {
                                $obj.addClass('warning');
                            }
                            status = false;
                        }
                    }
                }
                if (status==false) {
                    $obj.bind('keyup change', function() {
                        $(this).removeClass('warning');
                    });
                }
            });
        });	
        //*** Return True or False
        return status;

    };
})( jQuery );