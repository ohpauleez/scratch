/*
 * Adapted and editted specifically for our code
 * Paul deGrandis
 * Dec 03 2007
 **/


/*
 * Copyright (c) 2001 Sun Microsystems, Inc.  All rights
 * reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in
 *    the documentation and/or other materials provided with the
 *    distribution.
 *
 * 3. The end-user documentation included with the redistribution,
 *    if any, must include the following acknowledgment:
 *       "This product includes software developed by the
 *       Sun Microsystems, Inc. for Project JXTA."
 *    Alternately, this acknowledgment may appear in the software itself,
 *    if and wherever such third-party acknowledgments normally appear.
 *
 * 4. The names "Sun", "Sun Microsystems, Inc.", "JXTA" and "Project JXTA" must
 *    not be used to endorse or promote products derived from this
 *    software without prior written permission. For written
 *    permission, please contact Project JXTA at http://www.jxta.org.
 *
 * 5. Products derived from this software may not be called "JXTA",
 *    nor may "JXTA" appear in their name, without prior written
 *    permission of Sun.
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL SUN MICROSYSTEMS OR
 * ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
 * USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 * ====================================================================
 *
 * This software consists of voluntary contributions made by many
 * individuals on behalf of Project JXTA.  For more
 * information on Project JXTA, please see
 * <http://www.jxta.org/>.
 *
 * This license is based on the BSD license adopted by the Apache Foundation.
 *
 * $Id: JxtaAppDemo.java,v 1.14 2003/02/08 19:58:13 hamada Exp $
 */
import java.util.Enumeration;

// Event Bus Specifics
import org.bushe.swing.event.EventBus;
import org.bushe.swing.event.annotation.*;
import org.bushe.swing.event.generics.*;
import org.bushe.swing.exception.*;

import net.jxta.peergroup.PeerGroup;
import net.jxta.peergroup.PeerGroupFactory;
import net.jxta.exception.PeerGroupException;
import net.jxta.document.Advertisement;
import net.jxta.discovery.DiscoveryService;
import net.jxta.discovery.DiscoveryListener;
import net.jxta.discovery.DiscoveryEvent;
import net.jxta.protocol.DiscoveryResponseMsg;
import net.jxta.protocol.PeerAdvertisement;

/**
 *  Illustrates how you would become a DiscoveryListener to discover new adverts 
 * when new JXTA peers, pipes etc join the network
 */

public class DiscoverPeers implements Runnable, DiscoveryListener {

    static PeerGroup platformGroup = null;
    static PeerGroup netPeerGroup  = null;

    DiscoveryService discovery;
    PeerAdvertisement padv;

    public DiscoverPeers() {
    }

    private void startJxta() {
        try {

            netPeerGroup = PeerGroupFactory.newNetPeerGroup();
            // rendezvous = netPeerGroup.getRendezVousService();
            // rendezvous.addListener( this );

            // uncomment the following line if you want to start the app defined
            // the NetPeerGroup Advertisement (by default it's the shell)
            // in our case we want use jxta directly.

            // netPeerGroup.startApp(null);


        } catch ( PeerGroupException e) {
            // could not instanciate the group, print the stack and exit
            System.out.println("fatal error : group creation failure");
            e.printStackTrace();
            System.exit(1);
        }

        // Let's get the discovery service we're going to need
        discovery = netPeerGroup.getDiscoveryService();
    }

	public DiscoveryService getDS()
	{
		return discovery;
	}

	public void getMessage()
	{
		System.out.println("We have added a message....  let's search for it now");
		EventBus.publish(new SearchNetEvent("Paul"));
		System.out.println("If you see this, we made it");
	}

	@EventSubscriber(eventClass=SearchResultEvent.class)
	public void onEvent(SearchResultEvent searchResultEvent)
	{
		System.out.println("We got a result.");
		System.out.println(searchResultEvent);
	}
    /**
     * This thread basically loops forever discovering peers
     * every minute, and displays the results.
     */

    public void run() {
        try {
            // Add ourselves as a DiscoveryListener for DiscoveryResponse events
            discovery.addDiscoveryListener(this);
            discovery.getRemoteAdvertisements(null,
                    DiscoveryService.PEER,
                    null,null, 1, null);

            //while (true) {
                // wait a bit before sending a discovery message
                try {
                    Thread.sleep(10 * 1000);
                } catch(Exception e) {
                }
                System.out.println("Sending a Discovery Message");
                // look for any peer
                discovery.getRemoteAdvertisements(
                        null,
                        DiscoveryService.PEER,
                        null,
                        null,
                        10,
                        null);

                /* uncomment the following for group discovery
                //look for any group*/

                discovery.getRemoteAdvertisements(null,
                DiscoveryService.GROUP,
                null, null, 5);
            //}
        } catch(Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * by implementing DiscoveryListener we must define this method
     * to deal to discovery responses
     */

    public void discoveryEvent(DiscoveryEvent ev) {
        int adCount=0;
        DiscoveryResponseMsg res = ev.getResponse();

        // Unpack the list
        Advertisement adv=null;
        Enumeration enuma = res.getAdvertisements();

        System.out.println ("Discovery Responses = ["+ res.getResponseCount() + "]");

        if (enuma != null ) {
            while (enuma.hasMoreElements()) {
                ++adCount;
                adv = (Advertisement) enuma.nextElement();
                // System.out.println (adv);
                String name="NOT A PEER ADVERT";
                if (adv instanceof PeerAdvertisement)
                    name = ((PeerAdvertisement)adv).getName();

                System.out.println ("Advert ["+ adCount + "]  from peer : "+ name);
            }
        }
    }

    static public void main(String args[]) {
        DiscoverPeers myapp  = new DiscoverPeers();
        myapp.startJxta();
        //myapp.run();
		try {
		Thread.sleep(10*1000);
		P2PNetPeerNetworkInteraction network = new P2PNetPeerNetworkInteraction(netPeerGroup);
		Thread.sleep(5*1000);
		} catch (Exception e) { e.printStackTrace(); }
		myapp.run();
		myapp.getMessage();
    }
}
