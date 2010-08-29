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
			console.log("undo");
			console.log(task.segment);
			if (task.action == "segment_added"){
				UI.canvas.deleteSegment(task.segment.id);
				var lil = UI.variations[getRevisionId()];
                lil.context.drawImage(UI.canvas.canvas, 0, 0, lil.width, lil.height);

				UI.canvas.refresh();
				CommLink.reportSegmentDeleted(task.segment, task.sketch_revision_id, "undo");
			}else if (task.action == "segment_deleted") {
				UI.sketchCanvas(task.sketch_revision_id).addSegment(task.segment);
				var lil = UI.variations[getRevisionId()];
                lil.context.drawImage(UI.canvas.canvas, 0, 0, lil.width, lil.height);
				UI.canvas.refresh();
				CommLink.reportSegmentDrawn(task.segment, task.sketch_revision_id);
			}
			this.addRedoTask(task);
		}
	},
	redo: function() {
		if (this.redoStack.length > 0) {
			task = this.redoStack.pop();
			console.log(task);
			if (task.action == "segment_added") {
				UI.sketchCanvas(task.sketch_revision_id).addSegment(task.segment);
				var lil = UI.variations[getRevisionId()];
                lil.context.drawImage(UI.canvas.canvas, 0, 0, lil.width, lil.height);
				UI.canvas.refresh();
				CommLink.reportSegmentDrawn(task.segment, task.sketch_revision_id);
			}else if (task.action == "segment_deleted") {
				console.log(task.segment.id);
				UI.canvas.deleteSegment(task.segment.id);
				var lil = UI.variations[getRevisionId()];
                lil.context.drawImage(UI.canvas.canvas, 0, 0, lil.width, lil.height);

				UI.canvas.refresh();
				CommLink.reportSegmentDeleted(task.segment, task.sketch_revision_id);

			}
			console.log("redo");
			this.addUndoTask(task);
		}
	}

}




