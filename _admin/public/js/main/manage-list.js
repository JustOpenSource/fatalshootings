require(['/js/config/require-config.js'], function($) {
	require(['jquery'], function($) {
	    function deleteEntry(){
	    	function confirmDelete(cb){
	    		if(confirm('Are you sure? This action cannot be undone.')){
	                cb();
		        }
	    	}

	    	function sendDelete(){
	    		console.log('works');
	    		/*
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
				*/
	    	}

	    	$(document).on('click', '.delete-link', function(e){
	            e.preventDefault();
	            var t = $(this);
	            console.log('current');
	            confirmDelete(sendDelete);
		    });
	    }

	    $(document).ready(function(){
	        deleteEntry();
	    });
	});
});