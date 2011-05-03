#!/usr/bin/env python

import cmd

class P2PNetUI(cmd.Cmd):
	
	def __init__(self, username="anon"):
		#super(P2PNetUI, self).__init__()
		self.username = username
		self.intro = "Welcome to the P2PNet System"
		self.prompt = "p2pnet> "
		def blank() : pass
		self.emptyline = blank

	def do_send(self, message):
		subject = raw_input("Please enter your subject: ")
		print "From:", self.username
		print "Subject:", subject
		print "Message:", message
	def help_send(self):
		print "You need help"

if __name__ == "__main__":
	myGUI = P2PNetUI()
	myGUI.cmdloop()
elif __name__ == "main": #we're in java
	import javax.swing as swing
	myGUI = None
	try:
		username = swing.JOptionPane.showInputDialog("Enter your username: ")
		#myGUI = P2PNetUI(str(username))
	except:
		pass
		#myGUI = P2PNetUI()
	#myGUI.cmdloop()
