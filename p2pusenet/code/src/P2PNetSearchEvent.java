
public class P2PNetSearchEvent extends P2PNetEvent
{
	String search = null;
	public P2PNetSearchEvent(String messageEventTypeID, String search)
	{
		super(messageEventTypeID);
		this.search = search;
	}
	public String getSearch()
	{
		return search;
	}

}

