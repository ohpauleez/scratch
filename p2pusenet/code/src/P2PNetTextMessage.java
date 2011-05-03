

public class P2PNetTextMessage extends P2PNetMessage
{

	//public P2PNetMessage(String author, String subject, Object payload)
	//{
	//	P2PNetTextMessage(author, subject, payload);
	//}
	private static final long serialVersionUID = 0001L;
	
	public P2PNetTextMessage(String author, String subject, String payload)
	{
		super.setAuthor(author);
		super.setSubject(subject);
		super.setPayload(payload);
		super.setMimeType("text/plain");
	}

	public Object getPayload()
	{

		return (String)super.getRawPayload();
	}
	
	public String toString()
	{
		String retString = "";
		retString += "Author: " + getAuthor() + "\n";
		retString += "Subject: " + getSubject() + "\n";
		retString += "Message:\n" + getPayload() + "\n";

		return retString;
	}

}

