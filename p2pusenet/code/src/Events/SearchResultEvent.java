

public class SearchResultEvent extends P2PNetSearchEvent
{
	String keywords, messageID;

	public SearchResultEvent(String search, String keywords, String messageID)
	{
		super("SearchResultEvent", search);
		this.keywords = keywords;
		this.messageID = messageID;
	}

	public String getKeywords()
	{
		return keywords;
	}

	public String getMessageID()
	{
		return messageID;
	}

	public String toString()
	{
		return getMessageID() + ": " + getKeywords();
	}

}

