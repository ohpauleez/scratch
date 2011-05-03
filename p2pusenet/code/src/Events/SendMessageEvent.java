
public class SendMessageEvent extends P2PNetMessageEvent
{
	public SendMessageEvent(P2PNetMessage message)
	{
		super("SendMessageEvent", message);
	}

}

