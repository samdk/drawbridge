var database = require('./config').database;
var secret_key = "test";
var sys = require('sys');
//var gently = new (require('gently'));
var mysql= require('./lib/mysql');
var crypto = require ('crypto'); //node.js needs to be compiled with openssl support
var client = new mysql.Client();

client.host = database.host;
client.user = database.username;
client.port = database.port;
client.password = database.password;
client.database = database.name;


client.connect();

function esafe(cb){
    var callback = cb;
    return function(err, res, f){
        if(err) throw err;
        callback(res);
    };
}

exports.getSketchFromHash = function(hash, callback) {
	client.query('SELECT * FROM sketch WHERE hash = ?', [hash], function (err, results, fields){
		if(err) throw err;
		
		if(results.length == 1) {
			callback(results[0]);
		}
	});
}

exports.sha1 = function(x){
    return crypto.createHash('sha1').update(x+secret_key).digest('hex');
};

exports.getSketch = function (id, runFunction){
    client.query("select * from sketch where id = ?", [id], function(err, results, fields){
		if(err) throw err;
	
		if (results.length ===1) {
			runFunction(results);	
		}
    });
};


exports.addSketch = function (runFunction){
    var sql = "INSERT INTO sketch (hash, created_at, modified_at) values ('', NULL, NULL)";
	client.query (sql, function(err, results, fields){
		if(err) throw err;
			
		var insertId = results.insertId;
		
		sql = "UPDATE sketch SET hash=?, parent_id=?, root_id=? WHERE id=?";
		var sha1hash = exports.sha1(insertId);
		client.query(sql, [sha1hash, sha1hash, sha1hash, insertId], function(err, results, fields){
			if(err) throw err;				
			runFunction(sha1hash);
		});
    });
}


exports.addUser = function(user,sketch,runFunction) {
	client.query("INSERT INTO user(name,email) values (?, ?)", [user.name, user.email], function selectCb(err, results, fields) {
		if (err){
			throw err;
		}
		var userId = results.insertId;
			client.query("INSERT INTO user_to_sketch (user_id, sketch_id) values (?, ?)", [userId, sketch.id], function (err,results, fields){
				if (err){
					throw err;
				}
				var userObj = {id: userId, name: user.name, email: user.email};
				runFunction(userObj);
			});
		
	});
}


exports.leaveSketch = function(user_id, sketch_id, runFunction) {
    sql = "UPDATE user_to_sketch SET is_active = 0 WHERE user_id = ? AND sketch_id = ?";
	client.query (sql, [user_id, sketch_id], function (err, results, fields) {
		if(err)
			throw err;
		runFunction(user);
	});
}


exports.addSegment = function(sketch, segment, runFunction) {
	console.log(segment);
	client.query ("INSERT INTO segment (color, points) values(?,?)", [segment.color, JSON.stringify(segment.points)], 
		function(err, result, fields){
			if (err) throw err;
			var segmentId = result.insertId;
			exports.getSketchFromHash(sketch.revision_id, function (sketch){
			    var sql = "INSERT INTO sketch_to_segment (sketch_id, segment_id) values(?, ?)";
				client.query(sql, [sketch.id, segmentId], function (err, result, fields){
					if(err) throw err;
					runFunction({id: segmentId, color: segment.color, points: segment.points});
				});
			});
		});
}

exports.eachLeaf = function(rootId, cb){
    client.query("SELECT * FROM sketch WHERE root_id = ?", [rootId], function(err, res, f){
        if(err) throw err;
        for(var x in res){
            cb(res[x]);
        }
    });
}

exports.getPointsInSegment = function(segment, runFunction) {
	client.query("SELECT * FROM segment WHERE id = ?", [segment.segment_id], 
		function(err, results, fields) {
			if(err) throw err;

			if (results.length === 1) {
				runFunction(results[0]);
			}
		});

}

exports.getFullSketch = function(id, cb){
    client.query('SELECT * FROM segment JOIN sketch_to_segment ON segment.id = sketch_to_segment.segment_id WHERE sketch_to_segment.sketch_id = ?',
        [id], function(e,res,f){
            cb(res);
        });
}

exports.eachSegmentId = function(sketch, callback){
    sql = "SELECT segment_id FROM sketch_to_segment WHERE sketch_id = ?";
    client.query(sql, [sketch.id], function(err, results, fields){
	    if (err) throw err;
		
		for(x in results){
		    callback(results[x].segment_id);
		}
	});
}


exports.getSegmentIds = function(sketch, runFunction){
	client.query("SELECT segment_id FROM sketch_to_segment WHERE sketch_id = ?", [sketch.id],
		function(err, results, fields){
			if (err){
				throw err;
			}
			runFunction(results);
		}
	);
}

exports.createVariation = function(rev_id, callback){
	exports.getSketchFromHash(rev_id,function(sketch){
		var base_id = sketch.id;
		exports.addSketch(function(hsh){
			exports.eachSegmentId({id:base_id}, function(sid){
				var sql = "INSERT INTO sketch_to_segment(sketch_id, segment_id) VALUES ((select id from sketch where hash=?), ?)";
				client.query(sql, [hsh, sid], function(e,r,f){});
			});
			// update leaf to correct root/parent ids
			sql = "UPDATE sketch SET parent_id = ?, root_id = ? WHERE hash = ?";
			client.query(sql,[sketch.hash,sketch.root_id,hsh], function(err,results,fields) {
				if (err)
					throw err;
				exports.getSketchFromHash(hsh,function(leaf){
					leaf.hash = hsh;
					callback(leaf);
				});
			});
		});
	});
}

exports.mergeVariation = function(bottom_rev_id, top_rev_id, callback){
	exports.getSketchFromHash(bottom_rev_id,function(sketch_bot){
		exports.getSketchFromHash(top_rev_id,function(sketch_top){
			var base_bot_id = sketch_bot.id;
			var base_top_id = sketch_top.id;
			exports.addSketch(function(hsh){
				segments = [];
				exports.eachSegmentId({id:base_bot_id}, function(sid){
						var sql = "INSERT INTO sketch_to_segment(sketch_id, segment_id) VALUES ((select id from sketch where hash=?), ?)";
						client.query(sql, [hsh, sid], function(e,r,f){});
				});
				exports.eachSegmentId({id:base_top_id}, function(sid){
						var sql = "INSERT INTO sketch_to_segment(sketch_id, segment_id) VALUES ((select id from sketch where hash=?), ?)";
						client.query(sql, [hsh, sid], function(e,r,f){});
				});
				// update leaf to correct root/parent ids
				sql = "UPDATE sketch SET parent_id = ?, root_id = ? WHERE hash = ?";
				client.query(sql,[sketch_top.hash,sketch_top.root_id,hsh], function(err,results,fields) {
					if (err)
						throw err;
					exports.getSketchFromHash(hsh,function(leaf){
						leaf.hash = hsh;
						callback(leaf);
					});
				});
			});
		});
	});
}

exports.deleteSegment = function(sketch_revision_id, segment_id){
	//console.log(sketch_revision_id);
	//console.log(segment_id);
	exports.getSketchFromHash(sketch_revision_id, function(sketch) {
		client.query("DELETE FROM sketch_to_segment where sketch_id=? AND segment_id=?", [ sketch.id, segment_id]);
	});
    //client.query("DELETE FROM sketch_to_segment WHERE segment_id=? AND sketch_id=?",
    //            [segment_id, sketch_revision_id]);
}


exports.undeleteSegment = function (sketch_revision_id, segment, callback) {
		console.log(sketch_revision_id);
		console.log(segment);
		exports.getSketchFromHash(sketch_revision_id, function(sketch) {
			console.log(sketch);
			client.query("INSERT INTO sketch_to_segment(sketch_id, segment_id) values(?,?) ", [sketch.id, segment.id], function (err, result, fields) {
				if (err) throw err;
				callback(segment)
			});
		});
}

exports.saveImage = function(data, callback){
    client.query("INSERT INTO saved_sketch(`key`, data) VALUES(?, ?)", [exports.sha1(data), data], function(e,r,f){
        callback(exports.sha1(data));
    });
}

exports.getImage = function(key, callback){
    client.query("SELECT data FROM saved_sketch WHERE `key`=?", [key], function(e,r,f){
        callback(r[0].data); 
    });
}
