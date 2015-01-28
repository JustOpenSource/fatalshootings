require(['jquery'], function($) {
    /*
	function saveAction(){
		var put_action = '.put-form';
        $(document).on('submit', put_action, function(e){
            e.preventDefault();

            console.log('entry id');
            console.log($('#fe_entry_id').value());
            
            alert('form submitted');
        });
	}

	function editAction(){
		var edit_action = '.edit-form';
        $(document).on('click', edit_action, function(e){
            e.preventDefault();
            
            var form = $(put_action);
            
            form.fadeOut(400, function(){
                $(this).closest('.single-view').addClass('editing');
                form.fadeIn();
            })
        });
	}

	function viewAction(){
		var view_action = '.view-link';
        $(document).on('click', view_action, function(e){
            e.preventDefault();
            
            var form = $(put_action);
            
            form.fadeOut(400, function(){
                $(this).closest('.single-view').removeClass('editing');
                form.fadeIn(400);
            })
        });
	}
	*/

    $(document).ready(function(){
        /*
        saveAction();
        editAction();
        viewAction();
        */
    });
});