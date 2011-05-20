(ns gottafind.core
  (:use [net.cgrand.moustache :only (app)])
  (:require [lamina.core :as lamina]
            [aleph.http :as aleph]
            [ring.util.response :as ring]
            [gottafind.session :as session]))

;; ## Channels and Responses

;; This broadcast channel echoes all messages back out to all all
;; connected clients.  It's for testing only, the actual reply
;; channel is established in the sessions.
(def broadcast-channel (lamina/channel))

;; The flash policy response is used when a websocket fails over
;; to a flash socket.
;;
;; This policy allows the client and the server communication to
;; continue via the flash socket in the same fashion the websocket
;; would have.
(def flash-policy-resp "<?xml version=\"1.0\"?>
                       <!DOCTYPE cross-domain-policy SYSTEM \"http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd\">
                       <cross-domain-policy>
                       <allow-access-from domain='*' to-ports='*' />
                       </cross-domain-policy>\n\n\0")

; This is only done for extra control over the filetype
; The route could have easily been done:
; [#"css|js" "filename"] {:get (fn  [resp] (ring/resource-response (:uri resp)))}
; (defn serve-static [resp filename] 
;   (if-let [resp (and 
;                   (or (.endsWith filename "js") (.endsWith filename "css"))
;                   (ring/content-type (ring/resource-response (:uri resp))
;                                      (str "text/" (last (clojure.string/split
;                                                           filename #"\.")))))]
;     resp
;     (ring/status (ring/response "file not found") 404)))

;; ## Route Actions

(defn serve-session
  "Serve up the requested location tracking session to the client  
  Arguments:  
    resp-ch - a Channel, the channel that the server response should be sent on  
    request - a Map, the request map built from Aleph (a Ring-style request)  
    session-id - a String, the session id key  
  Returns:  
    - a Map, the Ring Response with HTML body for a location tracking session"
  [resp-ch request session-id]
  (lamina/enqueue resp-ch
    (ring/response (str "I got the following session: " session-id))))

(defn init-session 
  "Intialize or restore a stored location session for a given request  
  Arguments:  
    request - a Map, the request map built from Aleph (a Ring-style request)  
  Returns:  
     - a Map, a Ring Response, containing either the tracking session,
              or a 406 Error is the session creation failed."
  [request]
  (if-let [[session-key :as session-entry] (session/create-session!)] ; perhaps decouple key-gen and create-session (to future the latter)
    (ring/redirect (str "/session/" session-key))
    (ring/status (ring/response "Unable to create a session") 406)))

;; ## Request Handlers

;; The index page will actually get moved to the session lookup page, and index will be a landing page
;; or, index will just forard to the session page like it did before.
;;
;; All of the routes except the session stuff should probably be handled
;; by a webserver, like nginx.
(def ^{:doc "The web request handler.  
            Note:  
              this is a ring-wrapped handler,
              using Moustache to handle routing"}
  web-handler
  (aleph/wrap-ring-handler
    (app
      [""] {:get (fn [resp] (ring/resource-response "index.html"))}
      [#"css|js|swf" filename] {:get (fn [resp] (ring/resource-response (:uri resp)))}
      ["session"] {:get init-session} ;this should probably be a POST
      ["session" session-id] {:get (aleph/wrap-aleph-handler (fn [ch req] (serve-session ch req session-id)))})))

(defn loc-handler 
  "The location handler is used for servicing websocket clients.  
  Arguments:  
    ch - Lamina Channel, the channel established with the client  
    handschake - map, the websocket handshake that was established  
  Notes:  
    If the data pasedd into the channel is a policy request from flash,
    (if the client was using a browser that didn't support websockets),
    this handler will automatically queue up the `flash-policy-resp` to
    the client, in addition to broadcasting the location data back out
    on the session's broadcast channel."
  [ch handshake]
  (lamina/receive ch
    (fn [location]
      (if (= location "<policy-file-request/>\0")
        (do
          (lamina/siphon ch broadcast-channel)
          (lamina/enqueue ch flash-policy-resp)
          (lamina/siphon broadcast-channel ch)))
        (do 
          (lamina/siphon ch broadcast-channel)
          (lamina/siphon broadcast-channel ch)))))

(defn flash-policy-handler
  "This is a TCP-based handler for flash-policy requests.  
  It only gets called on the policy port to mediate websocket failover.
  If this service or port is unreachable by the client, a policy request will
  occur on the location/websocket port.  
  Arguments:  
    ch - a Channel, the channel on which to send and receive the responses.  
    client-info - a Map, general client information"
  [ch client-info]
  (lamina/receive-all ch
    #(when (= % "<policy-file-request/>\0")
       (lamina/enqueue-and-close ch flash-policy-resp))))

