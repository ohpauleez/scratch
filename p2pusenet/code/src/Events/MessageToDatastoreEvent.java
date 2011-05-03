
public class MessageToDatastoreEvent extends P2PNetDatastoreEvent
{
	P2PNetMessage message = null;

	public MessageToDatastoreEvent(P2PNetMessage message)
	{
		super("MessageToDatastoreEvent", message.getID());
		this.message = message;
	}

	public P2PNetMessage getMessage()
	{
		return message;
	}

}

