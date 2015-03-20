var fs = require("fs");

var argv = require("minimist")(process.argv.slice(2));

function Renamer() {
	var self = this;

	self.sayHello = function () {
		console.log("Hello from Folder File Renamer!!!");
	};

	self.findAndRenameFolders = function (folder, find, replace, callback) {
		self.getFolders(folder, find, replace);

		//return callback with results ???
		if (callback) callback(null, "rename started...");
		else console.log("rename DONE");
	};

	self.hasSubscrtInString = function (str, find) {
		var res = str.indexOf(find) + 1;

		return res;
	};

	self.getFolders = function (folder, find, replace) {
		fs.exists(folder, function (exists) {
			if (exists) {
				fs.readdir(folder, function (err, files) {
					if (files && files.length) {
						for (var i = 0; i < files.length; i++) {
							if (self.hasSubscrtInString(files[i], find)) {
								self.renameFile(folder, files[i], find, replace, self.getFolders)
							}
						}
					}
				});
			}
		});
	};

	self.replaceAllInName = function (name, find, replace) {
		while ((name.indexOf(find) + 1)) {
			name = name.replace(find, replace);
		};

		return name;
	};

	self.renameFile = function (path, fileName, find, replace, callback) {
		var fileNewName = self.replaceAllInName(fileName, find, replace);

		var innerFolder = path + fileNewName + "/";

		fs.rename(path + fileName, path + fileNewName, function (err) {
			if (err) return console.log("Error: %s", err);

			callback(innerFolder, find, replace);
		});
	};
};


module.exports = new Renamer();

if (argv._[0] && argv._[0] == "rename" && argv.find && argv.replace && argv.folder) {
	var renamer = new Renamer();
	renamer.findAndRenameFolders(argv.folder, argv.find, argv.replace);
} else {
	console.log("Something is missing: ", argv);
}