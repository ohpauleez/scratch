
public class ProduceMessageFromDatastoreEvent extends P2PNetMessageEvent
{
	public ProduceMessageFromDatastoreEvent(P2PNetMessage message)
	{
		super("SendMessageEvent", message);
	}

}

