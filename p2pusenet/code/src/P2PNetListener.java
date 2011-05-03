
import com.axlight.jnushare.gisp.ResultListener;

public class P2PNetListener implements ResultListener
{

	String dhtEntry;

	public P2PNetListener()
	{
	}

	public void stringResult(String data){
		dhtEntry = data;
	}
	public void xmlResult(byte[] data){}
	public void queryExpired(){
		//What should we do here?
		dhtEntry = "expired";
	}
	public String getResult()
	{
		return dhtEntry;
	}
}

