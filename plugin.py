#!/usr/bin/env python

class Plugin(object): pass
import imp, sys
def safe_import(name, globals=None, locals=None, fromlist=None):
    if name in acceptable_modules:
        # Fast path: see if the module has already been imported.
        try:
            return sys.modules[name]
        except KeyError:
            pass

        fp, pathname, description = imp.find_module(name)

        try:
            return imp.load_module(name, fp, pathname, description)
        finally:
            # Since we may exit via an exception, close fp explicitly.
            if fp:
                fp.close()


from RestrictedPython.Guards import safe_builtins
from RestrictedPython.Guards import full_write_guard
from RestrictedPython import compile_restricted
from RestrictedPython.PrintCollector import PrintCollector
import re, httplib, urllib, urllib2

available_modules = { 're':re,
                        'httplib':httplib,
                        'urllib':urllib,
                        'urllib2':urllib2
}

class PluginError(Exception): pass
class NotAPluginClassError(PluginError): pass
class NotAvailableError(PluginError): pass
class IllegalCallError(PluginError): pass

def illegal_call():
    raise IllegalCallError

restricted_globals = {}
restricted_globals['Plugin'] = Plugin
restricted_globals['__name__'] = __name__
restricted_globals['_print_'] = PrintCollector
restricted_globals['_getattr_'] = getattr
restricted_globals['_write_'] = full_write_guard
#restricted_globals['locals'] =  illegal_call
#restricted_globals['globals'] = illegal_call
#restricted_globals['dir'] = illegal_call
restricted_globals['__builtins__'] = safe_builtins
restricted_globals.update(available_modules)

MyPlugin = '''
class MyPlugin(Plugin):
    dog = 5
    def my_func(self):
        #print "dir:", dir()
        #print "globals:", globals()
        #print "locals:", locals()
        print "self:", self
        print "trying to open"
        print "dog", MyPlugin.dog
        #f = open("plugin.py", "r")
        print "importing urllib", urllib
        print "importing haslib"
        #import hashlib
        return printed
'''


def process_plugin(plugin_class):
    print "Starting dir", dir()
    print "Creating the code object..."
    code = compile_restricted(plugin_class, '<string>', 'exec')
    print "Excuting the code..."
    exec(code) in restricted_globals
    #print "res glob", restricted_globals
    print "NEW dir after exec:", dir()
    print "Creating new object"
    MyPlugin = restricted_globals.get("MyPlugin")
    print "NAME:", MyPlugin.__name__
    if not issubclass(MyPlugin, Plugin):
        raise NotAPluginClassError("This is not a subclass of Plugin")
    if hasattr(MyPlugin, "blah"):
        print "HAS IT"
    else:
        print "NO GO"
    mp = MyPlugin()
    print "Running the func"
    try:
        result = mp.my_func()
        print result
    except NameError, ne:
        raise NotAvailableError("Not available because %s" % ne)

if __name__ == "__main__":
    process_plugin(MyPlugin)
