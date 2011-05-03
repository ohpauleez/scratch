#!/usr/bin/env ruby
print "Hello from inside a ruby script\n"

#a and b get placed in the engine from inside of Java
$c = $a + $b
puts "C is a + b. c = " + $c.to_s
 
def itsquare (num)
	puts "I am in square"
	num*num
end

$square = method("itsquare") # expose the itsquare method as public, for bindings.
	#optionally, invocable can be used to avoid this method.


