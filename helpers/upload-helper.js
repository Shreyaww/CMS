const path = require('path');

module.exports = {

    uploadDir :  path.join(__dirname, '../public/uploads/'),

    isEmpty: function(obj) {
        // Check if obj is null or undefined
        if (obj == null) {
            return true;
        }

        // Use Object.prototype.hasOwnProperty.call for safety
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true; // Explicitly return true if no properties are found
    }
}