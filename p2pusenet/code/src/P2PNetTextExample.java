
//General
import java.io.FileReader; 

// Scripting Specifics
import javax.script.*;
import org.jruby.*;
import org.python.core.*;

// Event Bus Specifics
import org.bushe.swing.event.EventBus;
import org.bushe.swing.event.annotation.*;
import org.bushe.swing.event.generics.*;
import org.bushe.swing.exception.*;

// JXTA Specifics
import net.jxta.peergroup.PeerGroup;
import net.jxta.peergroup.PeerGroupID;
import net.jxta.peergroup.PeerGroupFactory;
import net.jxta.document.Advertisement;
import net.jxta.discovery.DiscoveryService;
import net.jxta.discovery.DiscoveryListener;
import net.jxta.discovery.DiscoveryEvent;
import net.jxta.protocol.DiscoveryResponseMsg;
import net.jxta.protocol.PeerAdvertisement;
import net.jxta.impl.peergroup.StdPeerGroup;
import net.jxta.impl.peergroup.DefaultConfigurator;
import net.jxta.exception.ConfiguratorException;

// GISP Specifices
import com.axlight.jnushare.gisp.GISP;
import com.axlight.jnushare.gisp.GISPImpl;

/**
 * This is a text based example for the P2PNet System
 * <p>
 *
 * @author Team: Firestone
 * @author Paul deGrandis
 * @since 1.0
 **/
public class P2PNetTextExample
{

	/**
	 * This is the main method used to excute and run the system
	 *
	 * @pre There are currently no pre-conditions that must be satisfied
	 * @post The System will exit upon completion of this method
	 *
	 * @param args	An array of strings passed in on the command line
	 * @return void
	 **/
	public static void main (String[] args)
	{
		System.out.println("TODO");
		System.out.println("Trying to get the network up...");
		P2PNetPeerNetworkInteraction network = null;
		network = new P2PNetPeerNetworkInteraction();

		System.out.println("Network is up.");
		network.getNetID();
		System.out.println("Creating a message...");
		P2PNetTextMessage message = new P2PNetTextMessage("Paul", "Test", "This is a test");
		System.out.println("Created a message.  Here it is:\n" + message);
		System.out.println("Sending the message...");
		EventBus.publish(new SendMessageEvent(message));
		try { Thread.sleep(160 * 1000); } catch (Exception e) {}
		//System.out.println("Adding anoter message");
		//P2PNetTextMessage peppoMessage = new P2PNetTextMessage("Peppo", "Your Project", "You guys totally rock");
		//EventBus.publish(new SendMessageEvent(peppoMessage));
		
		//try { Thread.sleep(120 * 1000); } catch (Exception e) {}

		System.out.println("We have added a message....  let's search for it now");
		EventBus.publish(new SearchNetEvent("Paul"));

		try { Thread.sleep(50 * 1000); } catch (Exception e) {}
		
		System.out.println("Since we also sent that message, let's pull it from our database");
		EventBus.publish(new RequestMessageFromDatastoreEvent(message.getID()));
		System.out.println("If you see this, we made it");
		
		System.out.println("You can extend the system with any of these languages:");
		P2PNetPluginSystem.listEngines();
		System.out.println("\nHAVE AT IT!");
		P2PNetPluginSystem.runPlugin("HelloWorldPlugin");
		P2PNetPluginSystem.runPlugin("GUITestPlugin");

		System.out.println("\nThat's all we have, quit when you like"); 
	}

/*
	@EventSubscriber(eventClass=SearchResultEvent.class)
	public void onEvent(SearchResultEvent searchResultEvent)
	{
		System.out.println("We got a result.");
		System.out.println(searchResultEvent);
	}

	@EventSubscriber(eventClass=ProduceMessageFromDatastoreEvent.class)
	public void onEvent(ProduceMessageFromDatastoreEvent dsEvent)
	{
		System.out.println("We got something from the DS...");
		System.out.println("It was:\n" + dsEvent.getMessage());
	}
*/
}

