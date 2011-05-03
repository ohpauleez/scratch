#!/usr/bin/env python

# I say this is python, but it's truly jython.
# We're going to extensively call java code in here

print "Start of the example2.py script"
#from java import Object
#from java import System
#let's try this:
print "trying to import everything from java"
from java import *
from javax.script import *

print "Trying to create a script engine manager"
mgr = ScriptEngineManager()

print "Trying to get a ruby engine...  in python"
rbEng = mgr.getEngineByName("ruby");

print "Evaluating ruby..."
rbEng.eval("print 'Hello from ruby, inside a python script\n'")

print "Setting our variables to None"
mgr, rbEng = None, None

print "SUCCESS!!!!"


