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

There are two parts to node-devserver's configuration file `frontend` and `backend` (local / proxied). And example configuraton file could look like this:

```json
{
	"frontend" : {
		"root" : "root"
	},

	"backend" : {
		"^(?<vhost>\\w+)\\.local" : {
			"proxy" : {
				"host" : "${vhost}.remote",
				"port" : 80
			}
		}
	}
}
```

### `frontend` configuration

```json
"frontend" : {
	"root" : "root"
}
```

The `frontend` configuration section is quite straight forward - it contains one element called `root` that can be either a string or an array of strings that point out the location(s) where static files are served from.

### `backend` configuration

```json
"backend" : {
	"^(?<vhost>\\w+)\\.local" : {
		"proxy" : {
			"host" : "${vhost}.remote",
			"port" : 80
		}
	}
}
```

`backend` elements match url's to remote servers. Each key gets converted to a regular expression using [XRegExp](http://xregexp.com). Captures can later be used to replace placeholders.