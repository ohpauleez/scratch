

import javax.script.*;
import java.util.List;
import java.io.FileReader; 

//import org.python.core.*;

import org.jruby.*;

public class ExampleOne
{
	
	//This just lists all the engines that your java 6 env can see and use.
	public static void listEngines() throws Exception
	{
		System.out.println("Sleeping for twenty seconds...");
		System.out.println("Starting our list manager..\n");
		ScriptEngineManager mgr = new ScriptEngineManager();
	    List<ScriptEngineFactory> factories = mgr.getEngineFactories();
		for (ScriptEngineFactory factory: factories) {
			System.out.println("ScriptEngineFactory Info");
			String engName = factory.getEngineName();
			String engVersion = factory.getEngineVersion();
			String langName = factory.getLanguageName();
			String langVersion = factory.getLanguageVersion();
			System.out.printf("\tScript Engine: %s (%s)\n", engName, engVersion);
			List<String> engNames = factory.getNames();
			for(String name: engNames) {
				System.out.printf("\tEngine Alias: %s\n", name);
			}
			System.out.printf("\tLanguage: %s (%s)\n", langName, langVersion);
		}
	}

	public static void testRuby() throws Exception
	{
		//Get a ruby engine
		ScriptEngineManager mgr = new ScriptEngineManager();
		ScriptEngine rbEngine =  mgr.getEngineByName("ruby");
		
		//Place global variables into the engine
		rbEngine.put("a",5);
		rbEngine.put("b",3);

		//Eval a simple statement and run a simple script
		rbEngine.eval("puts \" a + b= #{$a+$b} \"");
		rbEngine.eval( new FileReader("./example1.rb"));
		
		//Let's now obtain bindings to our engine.  This allows us to call methods and pull out variables
		Bindings rbBindings = rbEngine.getBindings(ScriptContext.ENGINE_SCOPE);

		//None of these actually come from deep in our ruby environment
		System.out.println("This is ruby's square: " + rbBindings.get("square"));
		
		//Obtain an invokable engine from out engine.  This let's us invoke methods inside our bindings
		Invocable rbInvEngine = (Invocable) rbEngine;
		
		//This next line works in linux, but not on the mac java6 beta.
		//If you use soylatte OpenJDK on the mac, it'll compile but fails to execute... closer at least
		System.out.println("Invoke function: " + rbInvEngine.invokeFunction("square", 5));
		//System.out.println("Invoke function: " + rbInvEngine.invoke("square", new Object[] {5}));
		
		//System.out.println("Our bindings: " + rbBindings.keySet());
		Object ourC = (Object) rbBindings.get("c");
		System.out.println("Our evaluated value of c is: " + ourC);

		//Our other python script, example2.py, attempts to call ruby.  Pretty cool huh?
		rbEngine.eval( new FileReader("./example2.rb") );
		System.out.println("Our ruby bindings: " + rbBindings.keySet());
	}
	

	public static void main (String[] args)
	{
		try {
			System.out.println("\n\tListing out engines...");
			listEngines();
			testRuby();
		}
		catch (Exception e) {
			System.out.println("\nWe're seeing the exception in MAIN!!!\n\n");
			e.printStackTrace();
		}
	}

}

