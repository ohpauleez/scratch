
// Event Bus Specifics
import org.bushe.swing.event.EventBus;
import org.bushe.swing.event.annotation.*;
import org.bushe.swing.event.generics.*;
import org.bushe.swing.exception.*;

public class P2PNetClientLibrary
{

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

}

