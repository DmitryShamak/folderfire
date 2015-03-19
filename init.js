var fs = require("fs");

function Renamer() {
	var self = this;

	self.sayHello = function () {
		console.log("Hello from Folder File Renamer!!!");
	};

	self.findAndRenameFolders = function (folder, replace, char, callback) {
		self.getFolders(folder, replace, char);

		//return callback with results ???
		callback(null, "rename started...");
	};

	self.hasCharInString = function (str, char) {
		var res = str.indexOf(char) + 1;

		return res;
	};

	self.getFolders = function (folder, replace, char) {
		fs.exists(folder, function (exists) {
			if (exists) {
				fs.readdir(folder, function (err, files) {
					if (files && files.length) {
						for (var i = 0; i < files.length; i++) {
							if (self.hasCharInString(files[i], replace)) {
								self.renameFile(folder, files[i], replace, char, self.getFolders)
							}
						}
					}
				});
			}
		});
	};

	self.replaceAllInName = function (name, replace, char) {
		while ((name.indexOf(replace) + 1)) {
			name = name.replace(replace, char);
		};

		return name;
	};

	self.renameFile = function (path, fileName, replace, char, callback) {
		var fileNewName = self.replaceAllInName(fileName, replace, char);

		var innerFolder = path + fileNewName + "/";

		fs.rename(path + fileName, path + fileNewName, function (err) {
			if (err) return console.log("Error: %s", err);

			callback(innerFolder, replace, char);
		});
	};
};

module.exports = new Renamer();