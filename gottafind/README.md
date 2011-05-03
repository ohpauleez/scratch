
gottafind - A location sharing service
======================================
GottaFind (gottafind.me / gottafind.us) is a location sharing service.  
Much like how one shares code or text samples using Gist and Pastie, GottaFind lets you anonymously share your location.

### Why would you share your location?
I travel a lot, and often times when traveling somewhere, I am planning on meeting up with someone. 
I'm not always familiar with the cities I visit, so I can have a difficult time locating my contact.  
GottaFind lets me instantly create a realtime location sharing session that my contact and I can use to locate each other.  

Other times I'll be at conferences, large business events, or parties, and I have a hard time locating a friend. 
GottaFind let's me find anyone I'm trying to meetup with safely, securely, and anonymously.

### Isn't this similar to Geoloqi?  What makes this better?

* GottaFind is a DEAD simple service designed to do one thing well.
* It should serve as working and living example of HTML5 technologies for all developers,
as well as a platform for new location innovations.
* Extra effort is made to show backend integration as well as deployment and scaling strategies.


Usage and Examples
==================
You can launch the Aleph Webserver and Web Socket server with:
    lein run :server gf
This will serve http requests on 8080, and web socket traffic on 8888.  
Now you should be able to browse to:
    http://localhost:8080
to use the webapp.  

You can optionally start just the http server
    lein run :server http
Or just the web socket server:
    lein run :server ws

Web socket traffic will be sent via a Flash socket if your browser does not supper web sockets.


Installation
============
### With Leiningen or Cake

TODO

### Via Source

TODO


TODO
====

* debug websocket server issues
* fix uncaught: `INVALID_STATE_ERR` on Web Socket
* integrate sessions correctly into aleph
* Google Maps integration
* style


Hacking
=======

### Using TMUX or screen

If you want to start a new tmux server, cd to the project root dir, just type:
    tmux -f tmux-screen/gottafind.tmux.conf
otherwise you can start a new session:
    tmux `cat tmux-screen/gottafind.tmux.newsession`
You can also use screen:
    screen -c tmux-screen/gottafind-screenrc -S gottafind


### VimClojure tips

Start a nailgun (which will also open a repl),
run the following command from the project root:
    script/nailgun
You can also run a rlwrap'd REPL that VimClojure can connect to:
    lein repl
And then call the Nailgun server function:
    (runnail)
or more commonly,
    (def nail (runnail))

Here are helpful commands
    * \rt - run tests in the given namespace
    * \lw - lookup word
    * \li - lookup interactive
    * \gw - goto word
    * \gi - goto word interactive
    * \sw - source lookup word
    * \mw - meta lookup work
    * \el - eval line
    * \ep - eval paragraph
    * \ef - eval file
    * \me - macroexpand
    * \m1 - macroexpand1
    * \rf - require the file
    * \tr - toggle rainbow paren

### Paredit.vim tips

I also make use of the paredit.vim file from the slimv.vim plugin. This assumes your <leader> is \
    * :call ToggleParedit - toggle it on and off.
    * \W wrap in paren (works with visual selection too)
    * \J join paren - (a)(b) -> (a b)
    * \O split paren - (a b) -> (a)(b)
    * \S splice paren - ((a b)) -> (a b)
Wrapping can also be tailored, and used on a visual block:
    * \w"
    * \w[
    * \w(


### Running the tests

From the project root, `./script/lazytest` will run all the tests.
To start a test watcher, `./script/lazytest-watch`


License
=======

    Copyright (C) 2010 Paul deGrandis. All rights reserved.
    Distributed under the Eclipse Public License, the same as Clojure.
	
	The use and distribution terms for this software are covered by the 
	Eclipse Public License 1.0 (http://opensource.org/licenses/eclipse-1.0.php) 
	which can be found in the file LICENSE.html at the root of this distribution. 
	By using this software in any fashion, you are agreeing to be bound by the terms of this license. 
	You must not remove this notice, or any other, from this software.

