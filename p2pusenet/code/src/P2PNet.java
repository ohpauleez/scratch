
// Event Bus Specifics
import org.bushe.swing.event.EventBus;
import org.bushe.swing.event.annotation.*;
import org.bushe.swing.event.generics.*;
import org.bushe.swing.exception.*;

// JXTA Specifics
import net.jxta.peergroup.PeerGroup;
import net.jxta.peergroup.PeerGroupID;
import net.jxta.peergroup.PeerGroupFactory;
import net.jxta.exception.PeerGroupException;
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
 * This is the main class for the P2PNet System
 * <p>
 * This class serves as the central point for the application.
 * It will be used to instantiate and launch a peer.  Also,
 * all global objects will be managed through this "central controller"
 *
 * @author Team: Firestone
 * @author Paul deGrandis
 * @since 1.0
 **/
public class P2PNet
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
		System.out.println("Please run the Text Example and/or the Service Discovery example");
		System.out.println("In 5 seconds, I'll start the Text Example Automatically");
		try { Thread.sleep(5 * 1000); } catch (Exception e) {}
		P2PNetTextExample.main(args);
	}

/*	
	@EventSubscriber(eventClass=SearchResultEvent.class)
	public void onEvent(SearchResultEvent searchResultEvent)
	{
		System.out.println("We got a result.");
		System.out.println(searchResultEvent);
	}
*/
}

