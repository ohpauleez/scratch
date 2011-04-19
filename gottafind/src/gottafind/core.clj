(ns gottafind.core
  (:require [lamina.core :as lamina]
            [aleph.http :as aleph]))

(def broadcast-channel (lamina/channel))

(defn loc-handler [ch handshake]
  (lamina/receive ch
    (fn [location]
      (lamina/siphon ch broadcast-channel)
      (lamina/siphon broadcast-channel ch))))

(def server (future aleph/start-http-server loc-handler {:port 8888 :websocket true}))

