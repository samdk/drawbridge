var history  = {
	maxNum: 2,
	undoStack: [],
	redoStack: [],
	addTask: function (task) {
		if (this.undoStack.length >= this.maxNum){
			this.undoStack.splice(0,1);
		}
		this.undoStack.push(task);
	}
}




