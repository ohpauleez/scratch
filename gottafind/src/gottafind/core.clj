(ns gottafind.core
  (:use [net.cgrand.moustache :only (app)])
  (:require [lamina.core :as lamina]
            [aleph.http :as aleph]
            [gottafind.session :as session]))

(def broadcast-channel (lamina/channel))

(defn serve-static [resp filename]
  {:status 200
   :headers {"content-type" "text/plain"}
   :body (str "Serve the JS and CSS from this function: " filename) })

(defn serve-session [resp-ch request session-id]
  (lamina/enqueue resp-ch
    {:status 200
     :headers {"content-type" "text/plain"}
     :body (str "I got the following session: " session-id)}))

(defn init-session [resp-ch request]
  (future (let [session-entry (session/create-session!)]
            (serve-session resp-ch request (key session-entry)))))

(def web-handler
  (aleph/wrap-ring-handler
    (app
      [#"css|js" filename] {:get (fn [resp] (serve-static resp filename))} ;this should get handled by the webserver really
      [session-id] {:get (aleph/wrap-aleph-handler (fn [ch req] (serve-session ch req session-id)))}
      [""] {:get (aleph/wrap-aleph-handler init-session)}
      )))

(defn loc-handler [ch handshake]
  (lamina/receive ch
    (fn [location]
      (lamina/siphon ch broadcast-channel)
      (lamina/siphon broadcast-channel ch))))

