/***********************************************
gruntfile.js for leaflet-control-boxmenu

https://github.com/FCOO/leaflet-control-boxmenu

***********************************************/

module.exports = function(grunt) {

	"use strict";



	//***********************************************
	grunt.initConfig({
		"fcoo_grunt_plugin":{
			default: {
				"isApplication"								: false,	//true for stand-alone applications. false for packages/plugins
				"haveJavaScript"							: true,		//true if the application/packages have js-files
				"haveStyleSheet"							: true,		//true if the application/packages have css and/or scss-files
				"haveGhPages"									: true,		//Only for packages: true if there is a branch "gh-pages" used for demos

				"minimizeBowerComponentsJS"		: true,		//Only for application: Minifies the bower components js-file
				"minimizeBowerComponentsCSS"	: true,		//Only for application: Minifies the bower components css-file

				"beforeProdCmd"								: "",			//Cmd to be run at the start of prod-task. Multi cmd can be seperated by "&"
				"beforeDevCmd"								: "",			//Cmd to be run at the start of dev-task
				"afterProdCmd"								: "",			//Cmd to be run at the end of prod-task
				"afterDevCmd"									: "",			//Cmd to be run at the end of dev-task

				"exitOnJSHintError"						: true,		//if false any error in JSHint will not exit the task
				"cleanUp"											: true,		//In debug: set to false
				"bowerCheckExistence"					: true,		//true=all bower components must be pressent. false=allows missing files (only in debug)
				"bowerDebugging"							: false
			}
		}

	});//end of grunt.initConfig({...

	//****************************************************************

	//Load grunt-packages
	grunt.loadNpmTasks('grunt-fcoo-grunt-plugin');

};