webworks-ui
===========

GUI for the BlackBerry WebWorks SDK

Usage
=====

1) Copy contents into the webworks-ui directory within a WebWorks installation

2) Run `npm install` This will install package.json dependencies

3) Run `npm install -g grunt-cli` (May need sudo) This will install grunt

4) Run `grunt` This will build all the lib/ui js files into one file

5) Run `bin/start-ui`

A node server will be started at the port specified in config.json.

The script will also open the UI (public/index.html) in the browser.

