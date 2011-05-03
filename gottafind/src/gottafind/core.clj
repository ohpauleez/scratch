(ns gottafind.core
  (:use [net.cgrand.moustache :only (app)])
  (:require [lamina.core :as lamina]
            [aleph.http :as aleph]
            [ring.util.response :as ring]
            [gottafind.session :as session]))

(def broadcast-channel (lamina/channel))
(def print-ch (lamina/channel))

(def flash-policy-resp "<?xml version=\"1.0\"?>
                       <!DOCTYPE cross-domain-policy SYSTEM \"http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd\">
                       <cross-domain-policy>
                       <allow-access-from domain='*' to-ports='*' />
                       </cross-domain-policy>\n\n\0")

;; this is only done for extra control over the filetype
;; The route could have easily been done:
;; [#"css|js" "filename"] {:get (fn  [resp] (ring/resource-response (:uri resp)))}
(defn serve-static [resp filename] 
  (if-let [resp (and 
                  (or (.endsWith filename "js") (.endsWith filename "css"))
                  (ring/content-type (ring/resource-response (:uri resp))
                                     (str "text/" (last (clojure.string/split
                                                          filename #"\.")))))]
    resp
    (ring/status (ring/response "file not found") 404)))

(defn serve-session [resp-ch request session-id]
  (lamina/enqueue resp-ch
    (ring/response (str "I got the following session: " session-id))))

(defn init-session [request]
  #_(future (if-let [session-entry (session/create-session!)] ; when done in a future, aleph will pass nil back
            (ring/redirect (str "/" (key session-entry)))
            (ring/status (ring/response "Unable to create a session") 406)))
  (if-let [session-entry (session/create-session!)]
    (ring/redirect (str "/session/" (key session-entry)))
    (ring/status (ring/response "Unable to create a session") 406)))

(def web-handler
  (aleph/wrap-ring-handler
    (app
      ;; the index page will actually get moved to the session lookup page, and index will be a landing page
      ;; or, index will just forard to the session page like it did before.
      [""] {:get (fn [resp] (ring/resource-response "html/index.html"))} ;this should get handled by the webserver/nginx really
      [#"css|js" filename] {:get (fn [resp] (serve-static resp filename))} ;this should get handled by the webserver/nginx really
      [#"swf" filename] {:get (fn [resp] (ring/resource-response (:uri resp)))}
      ["session"] {:get init-session} ;this should probably be a POST
      ["session" session-id] {:get (aleph/wrap-aleph-handler (fn [ch req] (serve-session ch req session-id)))})))

(defn loc-handler [ch handshake]
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

(defn flash-policy-handler [ch client-info]
  (lamina/receive-all ch
    #(when (= % "<policy-file-request/>\0")
       (lamina/enqueue-and-close ch flash-policy-resp))))

