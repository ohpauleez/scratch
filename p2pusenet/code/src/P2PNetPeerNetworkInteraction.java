
import java.util.Hashtable;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.IOException;

// Event Bus Specifics
import org.bushe.swing.event.EventBus;
import org.bushe.swing.event.annotation.*;
import org.bushe.swing.event.generics.*;
import org.bushe.swing.exception.*;

// JXTA Specifics
import net.jxta.peergroup.PeerGroup;
import net.jxta.peergroup.PeerGroupFactory;
import net.jxta.exception.PeerGroupException;
import net.jxta.impl.peergroup.DefaultConfigurator;
import net.jxta.exception.ConfiguratorException;

// GISP Specifices
import com.axlight.jnushare.gisp.GISP;
import com.axlight.jnushare.gisp.GISPImpl;
import com.axlight.jnushare.gisp.ResultListener;

public class P2PNetPeerNetworkInteraction
{
	PeerGroup globalGroup;
	GISPImpl gisp;

	public P2PNetPeerNetworkInteraction()
	{
		AnnotationProcessor.process(this);
		try
		{
			PeerGroup group = PeerGroupFactory.newNetPeerGroup();
			initPNI(group);
		}
		catch (PeerGroupException pge)
		{ //What should we do?
			pge.printStackTrace();
		}
	}

	public P2PNetPeerNetworkInteraction(PeerGroup group)
	{
		AnnotationProcessor.process(this);
		initPNI(group);
	}

	private void initPNI(PeerGroup group)
	{
		globalGroup = group;
		gisp = new GISPImpl();
		gisp.init(group, null, null);
		gisp.startApp(null);
	}

	public void getNetID()
	{
		System.out.println("PeerGroup ID: " + globalGroup.getPeerGroupID());
	}

	private Hashtable getDirectory()
	{
		Hashtable<String, String> dir = null;
		String serDirectory = null;
		ByteArrayInputStream bin = null;
		
		System.out.println("Getting a listener");
		// Get a listener, access the DHT, and get the Serialized Directory
		P2PNetListener pl = new P2PNetListener();
		System.out.println("Getting the directory");
		gisp.query("directory", pl, 60000L);
		System.out.println("Trying to get the results");
		int cnt = 0;
		do
		{
			serDirectory = pl.getResult();

			try
			{
				Thread.sleep(2000);
			}
			catch (InterruptedException ie)
			{}
			cnt++;
		}while((serDirectory == null) && (serDirectory != "expired"));

		// If we were unable to get ther serialized Dictionary, just return a fresh one now
		if ((serDirectory == null) || (serDirectory == "expired"))
		{
			dir = new Hashtable<String, String>();
			return dir;
		}
		
		System.out.println("Getting the byte array");
		System.out.println("serDictionary: " + serDirectory);
		byte[] serDir = serDirectory.getBytes();
		System.out.println("SerDir: " + serDir);
		
		//Unserialize the directory
		bin = new ByteArrayInputStream(serDir);
		System.out.println("We havbe a new ByteArray");
		try
		{
			ObjectInputStream ois = new ObjectInputStream(bin);
			dir = (Hashtable<String, String>) ois.readObject();
			System.out.println("This is our directory: " + dir);
		}
		catch (IOException ioe)
		{
			//what should we do here?
			ioe.printStackTrace();
		}
		catch (ClassNotFoundException cnfe)
		{
			//What should we do here?
			cnfe.printStackTrace();
		}

		return dir;
	}
	private String serializeDirectory(Hashtable directory)
	{
		String serDirectory = null;
		ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
		try
		{
			ObjectOutputStream outStream = new ObjectOutputStream(byteStream);
			outStream.writeObject(directory);
			serDirectory = byteStream.toString();
			outStream.close();
		}
		catch (IOException ioe)
		{
			//TODO what should we do here? rethrow it for now
		}
		return serDirectory;
	}

	private void updateMostRecent(String dateString)
	{
		gisp.insert("most_recent", dateString);
	}
	private void addMessageToDirectory(P2PNetMessage message)
	{
		System.out.println("Getting the key and value");
		//NOTE: getTagsToString has a trailing space, so no need to add one
		String keyString = message.getTagsToString() + message.getAuthor() + " " + message.getSubject() + " " + message.getDate();
		String valueString = message.getID();
		

		System.out.println("Getting the directory");
		//Get the Directory and put the info in
		Hashtable<String, String> dir = getDirectory();
		System.out.println("Updating the directory");
		dir.put(keyString, valueString);

		System.out.println("Putting the directory back: " + dir);
		//put the directory back in the DHT
		String sd = serializeDirectory(dir);
		System.out.println("This will be the stored directory: " + sd);
		gisp.insert("directory", sd);
		try
		{
			Thread.sleep(10 * 1000);
		}catch (Exception e){}
		System.out.println("\nGetting the directory to see if we did change it");
		dir = getDirectory();
		System.out.println("Our directory: " + dir);
		sd = serializeDirectory(dir);
		System.out.println("This will be the stored directory: " + sd);
		gisp.insert("directory", sd);
	}

	@EventSubscriber(eventClass=SendMessageEvent.class)
	public void onEvent(SendMessageEvent sendMessageEvent)
	{
		System.out.println("Got a message");
		P2PNetMessage message = sendMessageEvent.getMessage();
		System.out.println("We got the message");
		try
		{
			System.out.println("Adding message to gisp");
			gisp.insert(message.getID(), message.getSerializedMessage());
			System.out.println("Adding message to the directory");
			addMessageToDirectory(message);
			EventBus.publish(new MessageToDatastoreEvent(message)); 
			System.out.println("We're all done here");
		}
		catch (IOException ioe)
		{
			//Serializing the message failed
			ioe.printStackTrace();
		}
		System.out.println("Updating most recent");
		updateMostRecent(message.getDate().toString());
		System.out.println("Done");
	}

	@EventSubscriber(eventClass=SearchNetEvent.class)
	public void onEvent(SearchNetEvent searchNetEvent)
	{
		System.out.println("Got a search");
		String searchPhrase = searchNetEvent.getSearch();
		System.out.println("Our search is: " + searchPhrase + ". Grabbing the directory to search");

		Hashtable<String, String> dir = getDirectory();
		System.out.println("Iterating over the the directory");
		for(String key : dir.keySet())
		{
			if (key.contains(searchPhrase))
			{
				System.out.println("Publishing a result that we found");
				//We got a result, publish to everyone who cares
				EventBus.publish(new SearchResultEvent(searchPhrase, key, dir.get(key))); 
			}
		}
		System.out.println("We're done searching.");
	}

}



