
import java.io.Serializable;
import java.io.ByteArrayOutputStream;
import java.io.ObjectOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.Vector;

/**
 * This class is the template for all messages that get
 * sent in the P2PNet system.
 *
 * @author Team:Firestone
 * @author Paul deGrandis
 *
 * @since 1.0
 **/
public abstract class P2PNetMessage implements Serializable
{
	private String mimeType = null;
	private Object payload = null;
	private String author = null;
	private String subject = null;
	private Date creationDate = new Date();
	private Vector<String> tags = new Vector<String>();
	//private static final long serialVersionUID = 0001L;

	/**
	 * The constructor of this message simply sets naive values
	 * using the mutator methods supplied.
	 * <p>
	 * This constructor serves as place holder and default
	 * constructor for all subclasses
	 *
	 * @pre There are no preconditions
	 * @post All values are set except the mimetype.
	 * 	This should be handled by the subclass.
	 *
	 * @param author 	The sender or author of the message
	 * @param subject 	The subject title of the message
	 * @param payload 	The body or payload of the message.
	 * 					Generic Object type is used to allow any object to be a payload
	 * @return given that this is an abstrct class, no new object is created.
	 **/
	//public P2PNetMessage(String author, String subject, Object payload)
	//{
	//	setAuthor(author);
	//	setSubject(subject);
	//	setPayload(payload);
	//}

	/**
	 * Set the mime type of the message.
	 * <p>
	 * Set the mime type for the message given the object type of
	 * the payload.
	 *
	 * @pre The payload should be set before the mimetype is set.
	 * 		This is currently not enforced however
	 * @post The mime type will no longer be null
	 *
	 * @param mimeType	the mime type of the payload you wish to set
	 **/
	protected void setMimeType(String mimeType)
	{
		this.mimeType = mimeType;
	}	
	/**
	 * Assign the message a payload or body.
	 * <p>
	 * This is currently set to accept a generic Object type,
	 * However, Specific message types should pass in objects
	 * of those specific types.  That is, a text based message should
	 * pass in a String object.
	 *
	 * @pre The author and subject should be assigned, but is
	 * 		not enforced at this moment
	 * @post The payload will no longer be null
	 *
	 * @param payload	The payload or body of the message
	 **/
	protected void setPayload(Object payload)
	{
		this.payload = payload;
	}
	/**
	 * Assign the author of this message.
	 *
	 * @pre There are no enforced or suggested preconditions
	 * @post The author is no longer null
	 *
	 * @param author	The author of the message
	 **/
	protected void setAuthor(String author)
	{
		this.author = author;
	}
	/**
	 *
	 * <p>
	 *
	 *
	 * @pre 
	 * @post
	 *
	 * @param one desc
	 * @return
	 **/
	protected void setSubject(String subject)
	{
		this.subject = subject;
	}
	/**
	 *
	 * <p>
	 *
	 *
	 * @pre 
	 * @post
	 *
	 * @param one desc
	 * @return
	 **/
	public void addTag(String tag)
	{
		if (tags.contains(tag))
		{
			// Don't add the duplicate
		}
		else
		{
			tags.add(tag);
		}
	}
	/**
	 *
	 * <p>
	 *
	 *
	 * @pre 
	 * @post
	 *
	 * @param one desc
	 * @return
	 **/
	public String removeTag(String tag)
	{
		String retString = null;

		if (tags.contains(tag))
		{
			tags.remove(tag);
			retString = tag;
		}

		return retString;
	}

	public String getMimeType()
	{
		return mimeType;
	}
	protected Object getRawPayload()
	{
		return payload;
	}
	public abstract Object getPayload();
	public String getAuthor()
	{
		return author;
	}
	public String getSubject()
	{
		return subject;
	}
	public Date getDate()
	{
		return creationDate;
	}
	public String getID()
	{
		return getSubject() + "_" + getDate().toString();
	}
	public String[] getTags()
	{
		return (String[])tags.toArray();
	}
	public String getTagsToString()
	{
		String retString = "";
		for (String tag : tags)
		{
			retString += tag + " ";
		}
		return retString;
	}
	public String getSerializedMessage() throws IOException
	{
		String retString = null;
		ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
		try
		{
			ObjectOutputStream outStream = new ObjectOutputStream(byteStream);
			outStream.writeObject(this);
			retString = byteStream.toString();
			outStream.close();
		}
		catch (IOException ioe)
		{
			//TODO what should we do here? rethrow it for now
			throw(ioe);
		}

		return retString;
	}

	public abstract String toString();
}

