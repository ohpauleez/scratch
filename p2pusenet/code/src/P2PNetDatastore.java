

public abstract class P2PNetDatastore

{
	public abstract void put(P2PNetMessage message);
	public abstract P2PNetMessage get(String messageID);
	public abstract P2PNetMessage remove(String messageID);

	//Internal auxilary method on how a messae is stored
	protected abstract int store(P2PNetMessage message);

}


