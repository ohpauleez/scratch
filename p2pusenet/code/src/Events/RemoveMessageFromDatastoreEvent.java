

public class RemoveMessageFromDatastoreEvent extends P2PNetDatastoreEvent
{
	public RemoveMessageFromDatastoreEvent(String messageID)
	{
		super("RemoveMessageFromDatastoreEvent", messageID);
	}

}
