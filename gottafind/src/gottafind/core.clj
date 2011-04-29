(ns gottafind.core
  (:use [net.cgrand.moustache :only (app)])
  (:require [lamina.core :as lamina]
            [aleph.http :as aleph]
            [gottafind.session :as session]))

(def broadcast-channel (lamina/channel))

(defn serve-session [resp-ch request session-id]
  "LOOK AT MATCHLEND TO SEE HOW TO PASS THE SESSION IN")

(defn init-session [resp-ch request]
  (future (let [session-id (session/create-session!)]
            (serve-session resp-ch request session-id))))

(def web-handler
  (app
    [""] {:get (aleph/wrap-aleph-handler init-session)}
    [session-key] {:get (aleph/wrap-aleph-handler serve-session)}))

(defn loc-handler [ch handshake]
  (lamina/receive ch
    (fn [location]
      (lamina/siphon ch broadcast-channel)
      (lamina/siphon broadcast-channel ch))))

