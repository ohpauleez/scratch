
public class P2PNetMessageEvent extends P2PNetEvent
{
	P2PNetMessage message = null;
	public P2PNetMessageEvent(String messageEventTypeID, P2PNetMessage message)
	{
		super(messageEventTypeID);
		this.message = message;
	}
	public P2PNetMessage getMessage()
	{
		return message;
	}

}
