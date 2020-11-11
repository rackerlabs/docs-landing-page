
# Docs Landing Page

[![Netlify Status](https://api.netlify.com/api/v1/badges/eb173ccb-7245-4814-a785-038745e31662/deploy-status)](https://app.netlify.com/sites/docs-rackspace/deploys)


This repository contains the source code for https://docs.rackspace.com/ website.

The website generated using link:https://gohugo.io/[Hugo] and Webpack, and hosted on GitHub.

## Requirements

Developer Docs runs on top of Webpack.

### Install

```
npm install
```

##  Start local server

```
npm start
```

You should now be able to access developer docs running at link:http://localhost:1313/[http://localhost:1313]

This running instance should support live reload. Changes you make to files should be automatically updated in your running instance.

Some files may not be supported for live reload. If you are not automatically seeing your changes live you may need to restart the server. You can restart the server by pressing 'ctrl-c' and running `npm start`.

##  Project directory structure

```
├── [archetypes]- Directory where you define the content, tags, categories, etc.
├── [content] - Directory that contains the content of the site.
│   ├── [contribute]
│   ├── [documentation]
├── [layouts] - Directory that contains Go HTML/template library used to template and format the site.
├── [public] - (Doesn't exist until generated) Directory that contains the generated content for the site.  Should be part of your git.ignore file.
├── [scripts] - Directory that should scripts for generating swagger, tags, etc
├── [static] - Directory for any static files to be compiled into the web site (style sheets, JavaScript, images, robots.txt, fav icons, etc.).
├── [themes] - Directory that contains the site theme.  Themes override layouts.
├── Makefile
├── config.toml - Main configuration file, where you define the web site title, URL, language, etc.
├── README.md (This file)
```

