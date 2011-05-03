

public class RequestMessageFromDatastoreEvent extends P2PNetDatastoreEvent
{
	public RequestMessageFromDatastoreEvent(String messageID)
	{
		super("RequestMessageFromDatastoreEvent", messageID);
	}

}

