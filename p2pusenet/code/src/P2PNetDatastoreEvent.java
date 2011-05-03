
public class P2PNetDatastoreEvent extends P2PNetEvent
{
	String messageID = null;
	public P2PNetDatastoreEvent(String messageEventTypeID, String messageID)
	{
		super(messageEventTypeID);
		this.messageID = messageID;
	}
	public String getMessageID()
	{
		return messageID;
	}

}

