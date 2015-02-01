require(['/js/config/require-config.js'], function($) {
	require(['jquery'], function($) {
	    $(document).ready(function(){
	        $(document).on('click','delete-link',function(e){
	            e.preventDefault();
	            var t = $(this);
	            if(confirm('Are you sure? This action cannot be undone.')){
	                $.ajax({
	                    url: t.attr('href'),
	                    type: 'DELETE',
	                    success: function(result) {
	                        if(result && result.success){
	                            t.closest('.list-group-item').fadeOut(400,function(){ $(this).remove() });
	                        }else{
	                            console.log(result);
	                        }
	                    }
	                });
		        }
		    });
	    });
	});
});