__base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('views/details-controls');
var v = require(__base + 'utils/validate-model');

function main(d){

    //validate the output to the 
    d = v(d, {
        "type" : "object",
        "properties" : {
            "id" : {
                "type": "string"
            },
            "edit" : {
                "type": "boolean"
            },
            "new" : {
                "type": "boolean"
            },
            "user" : {
                "type": "object"
            },
            "state" : {
                "type": "string"
            },
            "assignee" : {
                "type": "string"
            }
        }
    });

    d = setButtons(d);

    return v(d, {
        //validate the output to the view
    });
}

function setButtons(d){

    var assignedToMe = d.assignee === d.user.username ? true : false;
    var assignedToNobody = d.assignee === '' ? true : false;
    var assignedToOther = d.assignee !== '' && d.assignee !== d.user.username ? true : false;

    log('trace', 'd.user.username', d.user.username);
    log('trace', 'd.assignee ', d.assignee );

    d.addAssignment = function(){

        if( d.user.rolesObject.researcher 
            && d.state === 'new' 
            && assignedToNobody){
            
            return true;
        }

        if( d.user.rolesObject.editor
            && d.state === 'pending'
            && assignedToNobody){
            
            return true;
        }

        return false;

    }

    d.removeAssignment = function(){

        if( d.user.rolesObject.researcher 
            && d.state === 'new' 
            && assignedToMe){
            
            return true;
        }

        if( d.user.rolesObject.editor
            && d.state === 'pending'
            && assignedToMe){
            
            return true;
        }

        return false;

    }

    d.suggestEdits = function(){

        /*
        if( (assignedToOther
            || assignedToNobody)
            && d.state !== 'published' ){

            return false;
        }


        if( !d.new
            && !d.edit ){

            return true;
        }

        return false;
        */

        return d.edit ? false : true;

    }

    d.cancelButton = function(){

        if( d.edit
            && !d.new ){

            return true;
        }

        return false;
    }

    d.alreadyAssigned = function(){

        if( assignedToOther 
            && d.state !== 'published' 
            && !d.new){

            return true;
        }

        return false;
    }

    

    return d;
}

module.exports = main;