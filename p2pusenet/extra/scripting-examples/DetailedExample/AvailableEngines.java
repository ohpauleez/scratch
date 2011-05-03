
import javax.script.*;
import java.util.List;
import java.io.FileReader; //python will use this method
import java.io.InputStream; //ruby will use this method
import java.io.InputStreamReader;

//This is used to interact with python in the revvPyEngine() method
import org.python.core.*;

//This is used to interact with ruby in the revvRbEngine() method
import org.jruby.*;

public class AvailableEngines
{
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

	public static void testEngines() throws Exception
	{
		System.out.println("\n\tTesting the engines for evaluation\n");
		ScriptEngineManager mgr = new ScriptEngineManager();

		System.out.println("Trying to force JS");
		ScriptEngine jsEngine = mgr.getEngineByName("javascript");
		System.out.println("\tengine -> " + jsEngine);
		
		System.out.println("Trying to force Python");
		ScriptEngine pyEngine = mgr.getEngineByName("python");
		System.out.println("\tengine -> " + pyEngine);
		
		System.out.println("Trying to force Ruby");
		ScriptEngine rbEngine = mgr.getEngineByName("ruby");
		System.out.println("\tengine -> " + rbEngine);

		System.out.println("Trying to force Scheme");
		ScriptEngine ssEngine = mgr.getEngineByName("scheme");
		System.out.println("\tengine -> " + ssEngine);

		

		try
		{
			jsEngine.eval("println('hello from rhino/js')");
			pyEngine.eval("print 'hello from python'");
			rbEngine.eval("puts 'hello from ruby'");
			ssEngine.eval("(display \"Hello from scheme\")");
			ssEngine.eval("(newline)");

			System.out.print("Are you synced with JConsole:");
			System.in.read();
		} catch (ScriptException ex) {
			System.out.println("WE COULDN'T PRINT... EVAL FAILED\n\n");
			ex.printStackTrace();
		}
	}

	public static void revvPyEngine() throws Exception
	{
		System.out.println("\n\n\tRevving Python\n");
		//This will show you how to: 
		//  1.)modify your scripting environment
		//  2.)call a script
		//  3.)call individual methods in a script
		//  TODO 4.)make one engine call into another (pass values between python and ruby)
		
		ScriptEngineManager mgr = new ScriptEngineManager();
		ScriptEngine pyEngine = mgr.getEngineByName("python");

		//Our python script, example1.py, evaluates c = a + b, but a and b are not defined.
		//We can modify out environment, so they exist
		pyEngine.put("a",2);
		pyEngine.put("b",3);

		//let's call our script now!, c should be 5
		pyEngine.eval( new FileReader("./example1.py") );

		//Let's now obtain bindings to our engine.  This allows us to call methods pull out variables
		Bindings pyBindings = pyEngine.getBindings(ScriptContext.ENGINE_SCOPE);

		Integer ourC = (Integer) pyBindings.get("c");
		Integer engC = (Integer) pyEngine.get("c");
		System.out.println("Our evaluated value of c is: " + ourC);
		System.out.println("The engine reports c as: " + engC);

		//now let's use ourC and square it using the square function in example1.py
		PyFunction square = (PyFunction) pyBindings.get("square");
		PyInteger ourVal = new PyInteger(ourC);
		Object retVal = square.__call__(ourVal);
		System.out.println("Our return value of squaring ourC is: " + retVal);
		System.out.println("The arg name of square is 'num'.  Let's analyze the state of 'num'");
		System.out.println("num = " + (Integer) pyBindings.get("num"));

		//Our other python script, example2.py, attempts to call ruby.  Pretty cool huh?
		pyEngine.eval( new FileReader("./example2.py") );
		System.out.println("Our python bindings: " + pyBindings.keySet());

	}
	public static void revvRbEngine() throws Exception
	{
		System.out.println("\n\n\tRevving Ruby\n");
		//This will show you how to: 
		//  1.)modify your scripting environment
		//  2.)call a script
		//  3.)call individual methods in a script
		//  TODO 4.)make one engine call into another (pass values between python and ruby)
		
		ScriptEngineManager mgr = new ScriptEngineManager();
		ScriptEngine rbEngine =  mgr.getEngineByName("ruby");

		//Our ruby script, example1.rb, evaluates c = a + b, but a and b are not defined.
		//We can modify out environment, so they exist
		rbEngine.put("a",5);
		rbEngine.put("b",3);
		
		//let's call our script now!, c should be 8
		//rbEngine.eval( new InputStreamReader( AvailableEngines.class.getClassLoader().getResourceAsStream("./example1.rb")));
		rbEngine.eval( new FileReader("./example1.rb"));
		//Let's now obtain bindings to our engine.  This allows us to call methods and pull out variables
		Bindings rbBindings = rbEngine.getBindings(ScriptContext.ENGINE_SCOPE);

		rbEngine.eval("def hello (message) puts 'Hello ' + message end");
		rbEngine.eval("hello('Paul')");
		//None of these actually come from deep in our ruby environment
		System.out.println("This is ruby's square: " + rbBindings.get("square"));
		System.out.println("This is ruby's hello: " + rbBindings.get("hello"));
		Invocable rbInvEngine = (Invocable) rbEngine;
		//This next line works in linux, but not on the mac java6 beta
		System.out.println("Invoke function: " + rbInvEngine.invokeFunction("square", 5));
		System.out.println("Invoke function: " + rbInvEngine.invoke("square", new Object[] {5}));
		
		//System.out.println("Our bindings: " + rbBindings.keySet());
		Object ourC = (Object) rbBindings.get("c");
		System.out.println("Our evaluated value of c is: " + ourC);

		//Our other python script, example2.py, attempts to call ruby.  Pretty cool huh?
		rbEngine.eval( new FileReader("./example2.rb") );
		System.out.println("Our ruby bindings: " + rbBindings.keySet());
	}
	public static void revvSsEngine() throws Exception
	{
		System.out.println("\n\n\tRevving Scheme\n");
		//This will show you how to: 
		//  1.)modify your scripting environment
		//  2.)call a script
		//  3.)call individual methods in a script
		//  TODO 4.)make one engine call into another (pass values between python and ruby)
		
		ScriptEngineManager mgr = new ScriptEngineManager();
		ScriptEngine ssEngine =  mgr.getEngineByName("scheme");

		//Our scheme script, example1.ss, evaluates c = a + b, but a and b are not defined.
		//We can modify out environment, so they exist
		ssEngine.eval("(define a 2)");
		ssEngine.eval("(var 'a 2)"); //Exposes the variable to the bindings, also, exposes global java variables to scheme
		ssEngine.eval("(define b 3)");
		ssEngine.eval("(var 'b b)"); //You can also expose the symbol as the variable name
		ssEngine.put("d",5); //this essentially does a var and creates symbols 'd and 'e
		ssEngine.put("e",6);
	
		System.out.println("Running the Script");
		//let's call our script now!, c should be 5
		ssEngine.eval( new FileReader("./example1.ss") );

		Bindings ssBindings = ssEngine.getBindings(ScriptContext.ENGINE_SCOPE);
		Object ourC = (Object) ssBindings.get("c");
		System.out.println("Our evaluated value of c is: " + ourC);
		Object ourF = (Object) ssBindings.get("f");
		System.out.println("Our evaluated value of f is: " + ourF);
		System.out.println("This is scheme's square: " + ssBindings.get("square"));

		//This scheme script will call java classes and execute python code inside of it.
		ssEngine.eval( new FileReader("./example2.ss") );
		System.out.println("Our scheme bindings: " + ssBindings.keySet());

	}


		


	public static void main (String[] args)
	{
		try {
			System.out.println("\n\tListing out engines...");
			listEngines();
			testEngines();
			revvPyEngine();
			revvRbEngine();
			revvSsEngine();
		}
		catch (Exception e) {
			System.out.println("\nWe're seeing the exception in MAIN!!!\n\n");
			e.printStackTrace();
		}
	}
}

