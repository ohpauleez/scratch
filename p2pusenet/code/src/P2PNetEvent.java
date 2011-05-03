
import java.util.Date;

public class P2PNetEvent
{
	private Date creationDate = new Date();
	private String eventTypeID = null;
	
	public P2PNetEvent(String eventTypeID)
	{
		this.eventTypeID = eventTypeID;
	}
	public String getEventType()
	{
		return eventTypeID;
	}
	public Date getDate()
	{
		return creationDate;
	}


}
