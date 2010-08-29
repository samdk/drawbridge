window.DEBUG = false;

// by default, set mylogger to do nothing
logger = {};
logger.log = function(msg) {
	return false;
};

// if DEBUG is true and Firebug console is available, use it for logging
if (window.DEBUG && typeof(console) !== 'undefined') {
		mylogger = console;
}




