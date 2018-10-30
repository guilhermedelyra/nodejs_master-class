/*
 * Library for storing and editing data
 *
 */

// Dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

// Container for module (to be exported)
var lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname,'/../.data/');

// Write data to a file
lib.create = function(dir,file,data,callback,fn){
  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
    if(!err && fileDescriptor){
      // Convert data to string
      var stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData,function(err){
        if(!err){
          fs.close(fileDescriptor,function(err){
            if(!err){
              callback(false, fn);
            } else {
              callback('Error closing new file', fn);
            }
          });
        } else {
          callback('Error writing to new file', fn);
        }
      });
    } else {
      callback('Could not create new file, it may already exist', fn);
    }
  });
};

// Read data from a file
lib.read = function(dir,file,callback,fn){
  fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err,data){
    if(!err && data){
      var parsedData = helpers.parseJsonToObject(data);
      callback(false,parsedData,fn);
    } else {
      callback(err,data,fn);
    }
  });
};

// Update data in a file
lib.update = function(dir,file,data,callback,fn){

  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor){
    if(!err && fileDescriptor){
      // Convert data to string
      var stringData = JSON.stringify(data);

      // Truncate the file
      fs.truncate(fileDescriptor,function(err){
        if(!err){
          // Write to file and close it
          fs.writeFile(fileDescriptor, stringData,function(err){
            if(!err){
              fs.close(fileDescriptor,function(err){
                if(!err){
                  callback(false,fn);
                } else {
                  callback('Error closing existing file',fn);
                }
              });
            } else {
              callback('Error writing to existing file',fn);
            }
          });
        } else {
          callback('Error truncating file',fn);
        }
      });
    } else {
      callback('Could not open file for updating, it may not exist yet',fn);
    }
  });

};

// Delete a file
lib.delete = function(dir,file,callback,fn){

  // Unlink the file from the filesystem
  fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
    callback(err,fn);
  });

};

// List all the items in a directory
lib.list = function(dir,callback,fn){
  fs.readdir(lib.baseDir+dir+'/', function(err,data){
    if(!err && data && data.length > 0){
      var trimmedFileNames = [];
      data.forEach(function(fileName){
        trimmedFileNames.push(fileName.replace('.json',''));
      });
      callback(false,trimmedFileNames,fn);
    } else {
      callback(err,data,fn);
    }
  });
};

// Export the module
module.exports = lib;
