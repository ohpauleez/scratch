
import javax.script.*;
import java.util.List;
import java.io.File;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.FileNotFoundException;

public class P2PNetPluginSystem
{

	//get all the directories in scripts
	
	//read their StartPoint text file
	//  which consists of an Engine, and a main script
	
	//run the script
	
	//let's get all of our engines
	final static ScriptEngineManager semgr = new ScriptEngineManager();
	ScriptEngine pyEngine = semgr.getEngineByName("python");
	ScriptEngine rbEngine =  semgr.getEngineByName("ruby");
	ScriptEngine ssEngine =  semgr.getEngineByName("scheme");
	ScriptEngine javaEngine =  semgr.getEngineByName("java");
	ScriptEngine stEngine =  semgr.getEngineByName("smalltalk");

	//List out the engines
	public static void listEngines()
	{
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

	private static void runPluginFromStartPoint(String startPointFile)
	{
		System.out.println("Starting to run the plugin...");
		boolean fileExists = (new File(startPointFile)).exists();
		if (fileExists)
		{
			//Read the first line of the file, it'll tell use the engine
			BufferedReader reader = null;
			try
			{
				reader = new BufferedReader(new FileReader(startPointFile));
				String engName = reader.readLine();
				String mainScript = (new File(startPointFile)).getParent() + "/" + reader.readLine();
				System.out.println("I'm going to try to run \"" + mainScript + "\" with engine: " + engName);
				System.out.println("Getting an engine for your plugin...");
				ScriptEngine pluginEngine = semgr.getEngineByName(engName);
				System.out.println("Running your plugin...");
				pluginEngine.eval(new FileReader(mainScript));
			} 
			catch (FileNotFoundException fnfe){ fnfe.printStackTrace(); }
			catch (ScriptException se) { se.printStackTrace(); }
			catch (IOException ioe) { ioe.printStackTrace(); }

		}
		else { System.out.println("The StartPoint file doesn't exist");}


	}

	private static String getStartPointFromDir(String directoryPath)
	{
		return directoryPath+"/StartPoint";
	}

	public static void runPlugin(String pluginName)
	{
		//The plugin name is the same as the directory name
		pluginName = "scripts/" + pluginName;
		System.out.println("Directory = " + pluginName);
		boolean exists = (new File(pluginName)).exists();
		System.out.println("Does this directory exist: " + exists); 
		runPluginFromStartPoint(getStartPointFromDir(pluginName));
	}


}
