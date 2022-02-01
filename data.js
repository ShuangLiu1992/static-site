
  var Module = typeof ZNM !== 'undefined' ? ZNM : {};
  
  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }
  Module.expectedDataFileDownloads++;
  (function() {
   var loadPackage = function(metadata) {
  
      var PACKAGE_PATH;
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof location !== 'undefined') {
        // worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      } else {
        throw 'using preloaded data can only be done on a web page or in a web worker';
      }
      var PACKAGE_NAME = '/src/build/output/data.fs';
      var REMOTE_PACKAGE_BASE = 'data.fs';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
    
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
      var PACKAGE_UUID = metadata['package_uuid'];
    
      function fetchRemotePackage(packageName, packageSize, callback, errback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };
    
        var fetchedCallback = null;
        var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

        if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
          if (fetchedCallback) {
            fetchedCallback(data);
            fetchedCallback = null;
          } else {
            fetched = data;
          }
        }, handleError);
      
    function runWithFS() {
  
      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
  Module['FS_createPath']("/", "ui", true, true);
Module['FS_createPath']("/", "js", true, true);
Module['FS_createPath']("/", "primitives", true, true);

          /** @constructor */
          function DataRequest(start, end, audio) {
            this.start = start;
            this.end = end;
            this.audio = audio;
          }
          DataRequest.prototype = {
            requests: {},
            open: function(mode, name) {
              this.name = name;
              this.requests[name] = this;
              Module['addRunDependency']('fp ' + this.name);
            },
            send: function() {},
            onload: function() {
              var byteArray = this.byteArray.subarray(this.start, this.end);
              this.finish(byteArray);
            },
            finish: function(byteArray) {
              var that = this;
      
          Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
          Module['removeRunDependency']('fp ' + that.name);
  
              this.requests[this.name] = null;
            }
          };
      
              var files = metadata['files'];
              for (var i = 0; i < files.length; ++i) {
                new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio']).open('GET', files[i]['filename']);
              }
      
        
      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        
          // Reuse the bytearray from the XHR as the source for file reads.
          DataRequest.prototype.byteArray = byteArray;
    
            var files = metadata['files'];
            for (var i = 0; i < files.length; ++i) {
              DataRequest.prototype.requests[files[i].filename].onload();
            }
                Module['removeRunDependency']('datafile_/src/build/output/data.fs');

      };
      Module['addRunDependency']('datafile_/src/build/output/data.fs');
    
      if (!Module.preloadResults) Module.preloadResults = {};
    
        Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
        if (fetched) {
          processPackageData(fetched);
          fetched = null;
        } else {
          fetchedCallback = processPackageData;
        }
      
    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }
  
   }
   loadPackage({"files": [{"filename": "/ui/666b0705d2c9f90570a8792f61c28cd1", "start": 0, "end": 3748, "audio": 0}, {"filename": "/ui/e6074d1583418f6abd71f6334f6f643f", "start": 3748, "end": 114669, "audio": 0}, {"filename": "/ui/manifest.xml", "start": 114669, "end": 114669, "audio": 0}, {"filename": "/ui/113dff2a1b2970a35faef11abf68ff3f", "start": 114669, "end": 119741, "audio": 0}, {"filename": "/ui/9494f3611c83976b41f08707f687f042", "start": 119741, "end": 131323, "audio": 0}, {"filename": "/ui/84eeed828be9bc355fa2fb63b5534b4c", "start": 131323, "end": 136626, "audio": 0}, {"filename": "/ui/dae3618482ed4007faec43842d183482", "start": 136626, "end": 137991, "audio": 0}, {"filename": "/ui/3ddf702b1cb2a96facc1dab2d0b61daa", "start": 137991, "end": 139000, "audio": 0}, {"filename": "/ui/ef296adc6cc0a33ed7d2c1ceb2ce3c38", "start": 139000, "end": 152987, "audio": 0}, {"filename": "/ui/16a2ea76d912db66cb3cdc16db568c73", "start": 152987, "end": 154680, "audio": 0}, {"filename": "/ui/2eb77be4d93a758cc0a84e57b99d90a9", "start": 154680, "end": 163461, "audio": 0}, {"filename": "/ui/3535146b9897f1a8e8b58531b4bcde45", "start": 163461, "end": 166897, "audio": 0}, {"filename": "/ui/4207fc66b949c1bfd0fc61cd3334d46c", "start": 166897, "end": 173744, "audio": 0}, {"filename": "/ui/4f5dc679abc211e7c08ed4100dc8e25c", "start": 173744, "end": 175137, "audio": 0}, {"filename": "/ui/c0f517e88802c67258afdf65e8ee4039", "start": 175137, "end": 176618, "audio": 0}, {"filename": "/ui/a24e2f609cb676b83809c9f43038b83e", "start": 176618, "end": 183686, "audio": 0}, {"filename": "/ui/32df61ae8896650d3c5f6485f89346b0", "start": 183686, "end": 190732, "audio": 0}, {"filename": "/ui/b9a98ae5379b807ac59b03e872f18a2a", "start": 190732, "end": 202037, "audio": 0}, {"filename": "/ui/ae9ab513398c6895f7c8080319e5c42d", "start": 202037, "end": 215828, "audio": 0}, {"filename": "/ui/1dd69ff7b38bb4de98db325cb2207801", "start": 215828, "end": 216073, "audio": 0}, {"filename": "/ui/e1889ef699f83e9de391bf316582a6bc", "start": 216073, "end": 1560870, "audio": 0}, {"filename": "/ui/a38dbe77da9b64969a6e7c0f04007ddb", "start": 1560870, "end": 1572410, "audio": 0}, {"filename": "/ui/6417610a02b3751de1519fcf8d06b0e9", "start": 1572410, "end": 1585644, "audio": 0}, {"filename": "/js/ui.js", "start": 1585644, "end": 1705908, "audio": 0}, {"filename": "/js/zappar.js", "start": 1705908, "end": 1894812, "audio": 0}, {"filename": "/primitives/chunk3x3_v2.lua", "start": 1894812, "end": 1898340, "audio": 0}, {"filename": "/primitives/chunk3x2b.lua", "start": 1898340, "end": 1901514, "audio": 0}, {"filename": "/primitives/plane.aro", "start": 1901514, "end": 1901938, "audio": 0}, {"filename": "/primitives/circle.aro", "start": 1901938, "end": 1903836, "audio": 0}, {"filename": "/primitives/chunk3x2.lua", "start": 1903836, "end": 1907009, "audio": 0}, {"filename": "/primitives/chunk3x2_v2.lua", "start": 1907009, "end": 1910820, "audio": 0}, {"filename": "/primitives/chunk4x3.lua", "start": 1910820, "end": 1913998, "audio": 0}, {"filename": "/primitives/clock.lua", "start": 1913998, "end": 1918261, "audio": 0}, {"filename": "/primitives/chunk4x3_v2.lua", "start": 1918261, "end": 1922089, "audio": 0}, {"filename": "/primitives/chunk3x3.lua", "start": 1922089, "end": 1925204, "audio": 0}, {"filename": "/primitives/advent.lua", "start": 1925204, "end": 1925672, "audio": 0}, {"filename": "/primitives/brdftexture.png", "start": 1925672, "end": 1958454, "audio": 0}, {"filename": "/primitives/highscore.lua", "start": 1958454, "end": 1960958, "audio": 0}], "remote_package_size": 1960958, "package_uuid": "30bb94ff-a602-46a8-90c1-21ca0517ef19"});
  
  })();
  