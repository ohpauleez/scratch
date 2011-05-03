
import java.util.Hashtable;


// Event Bus Specifics
import org.bushe.swing.event.EventBus;
import org.bushe.swing.event.annotation.*;
import org.bushe.swing.event.generics.*;
import org.bushe.swing.exception.*;

public class P2PNetHashtableDatastore extends P2PNetDatastore
{

	Hashtable<String, P2PNetMessage> ds = null;

	public P2PNetHashtableDatastore()
	{
		AnnotationProcessor.process(this);
		ds = new Hashtable<String, P2PNetMessage>();
	}

	protected int store(P2PNetMessage message)
	{
		ds.put(message.getID(), message);
		return 1;
	}

	
	public void put(P2PNetMessage message)
	{
		int status = store(message);
	}

	public P2PNetMessage get(String messageID)
	{
		return ds.get(messageID);
	}

	public P2PNetMessage remove(String messageID)
	{
		P2PNetMessage message = get(messageID);
		ds.remove(messageID);
		return message;
	}


	@EventSubscriber(eventClass=RequestMessageFromDatastoreEvent.class)
	public void onEvent(RequestMessageFromDatastoreEvent dsevent)
	{
		String messageID = dsevent.getMessageID();
		P2PNetMessage message = get(messageID);
		EventBus.publish(new ProduceMessageFromDatastoreEvent(message));
	}

	@EventSubscriber(eventClass=MessageToDatastoreEvent.class)
	public void onEvent(MessageToDatastoreEvent dsevent)
	{
		P2PNetMessage message = dsevent.getMessage();
		put(message);
	}

	@EventSubscriber(eventClass=RemoveMessageFromDatastoreEvent.class)
	public void onEvent(RemoveMessageFromDatastoreEvent dsevent)
	{
		remove(dsevent.getMessageID());
	}

}


