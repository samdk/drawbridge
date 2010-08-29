var draw_history  = {
	maxNum: 5,
	undoStack: [],
	redoStack: [],
	addUndoTask: function (task) {
		if (this.undoStack.length >= this.maxNum){
			this.undoStack.splice(0,1);
		}
		this.undoStack.push(task);
	},
	addRedoTask: function (task) {
		if (this.redoStack.length >= this.maxNum){
			this.redoStack.splice(0,1);
		}
		this.redoStack.push(task);
	},
	undo: function(runFunction) {
		if (this.undoStack.length > 0) {
			task = this.undoStack.pop();
			if (task.action == "segment_added"){
				console.log(task.segment.id);
				UI.canvas.deleteSegment(task.segment.id);
				UI.canvas.refresh();
				//var lil = UI.variations[getRevisionId()];
                //lil.context.drawImage(UI.canvas.canvas, 0, 0, lil.width, lil.height);

				CommLink.reportSegmentDeleted(task.segment.id, task.sketch_id);
			}
			console.log(task);
			this.addRedoTask(task);
		}
	},
	redo: function() {
		if (this.redoStack.length > 0) {
			task = this.redoStack.pop();
			console.log(task);
			this.addUndoTask(task);
		}
	}

}




