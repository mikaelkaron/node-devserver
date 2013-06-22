[![Build Status](https://travis-ci.org/mikaelkaron/node-devserver.png)](https://travis-ci.org/mikaelkaron/node-devserver)
[![NPM version](https://badge.fury.io/js/devserver.png)](http://badge.fury.io/js/devserver)

# node-devserver

A simple development server geared towards front-end developers and ADD (Api Driven Development) applications.

## What's it for

For ADD applications front-end developers generally have no need for a full stack development environment, so a lot of front-end developers use a combination of a local http instance for static content, and a http proxy that forwards to the back-end.

node-devserver combines these two into one.

## How it works

When a request comes in node-devserver will first try to serve the request from the local filesystem, and if unsuccessfull proxy the request to a remote server. For example: let's say we get make a request to `http://some.domain.local/a/file.ext` (asuming that `some.domain.local` is pointing to our local machine) - node-devserver will try to serve the file from these locations (in order)

* `root/some.domain.com/a/file.ext`
* `root/domain.com/a/file.ext`
* `root/com/a/file.ext`
* `root/a/file.ext`

If none of these work the request will be proxied to a remote server.

## Configuration

The node-devserver configuration file is basically an array of middlewares to load (in order). And example configuraton file could look like this:

```json
[{
	"module" : "./middleware/frontend",
	"arguments" : [ "root" ]
}, {
	"module" : "./middleware/backend",
	"arguments" : [{
		"regexp" : "^(?<uat>cns-etuat-\\d+)\\.(?<vhost>.+)",
		"proxy" : {
			"host" : "${uat}.remote",
			"port" : 80
		}
	}]
}]
```

### `frontend` module configuration

The `frontend` middleware is responsible for serving local files.

The configuration is quite straight forward - `arguments` is an array of strings that point out the location(s) where static files are served from.

### `backend` module configuration

```json
{
	"regexp" : "^(?<uat>cns-etuat-\\d+)\\.(?<vhost>.+)",
	"proxy" : {
		"host" : "${uat}.remote",
		"port" : 80
	}
}
```

The `backend` middleware matches url's to remote servers.

Options are tried in order like this:

* parse `regexp` using [XRegExp](http://xregexp.com)
* match request agains `regexp` and store capture
* replace placeholders with captured elements
* proxy request using the `proxy` argument
