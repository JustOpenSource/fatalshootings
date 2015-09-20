{
    "id": "user.1",
    "type": "object",
    "properties": {

    	"username" : {
            "type": "string"
        },

    	"email" : {
            "type": "string"
        },

    	"password" : {
            "type": "string"
        },

        "roles" : {
            "enum": [
                "admin",
                "editor",
                "researcher"
            ]
        }
    }
}