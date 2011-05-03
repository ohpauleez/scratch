#!/usr/bin/env ruby
#

#Note: I say this is ruby, but it's truthfully JRuby,
#You can change the path env to JRuby if you desire.
#

print "Starting the second script\n"

require "java"
print "trying to include all of java.\n"
print "This will cause name conflicts with things like 'String'\n"
print "\t...so we will put it in a module called 'Java'\n"
module Java
	include_package 'java'
end

include_class 'javax.script.ScriptEngineManager'
include_class 'javax.script.ScriptEngine'

print "Trying to get a Script Engine Manager...\n"
mgr = ScriptEngineManager.new

print "Trying to get a Python engine... in ruby\n"
pyEng = mgr.getEngineByName("python")

print "Evaluating python...\n"
pyEng.eval("print 'This is python inside a ruby script!'")

print "SUCCESS!\n"

