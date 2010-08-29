window.DEBUG = false;


if (!window.DEBUG || typeof(console) == 'undefined') {
    console = {};
    console.log = function(msg) {
        return false;
    };
}


