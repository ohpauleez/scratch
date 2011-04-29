(ns ^{:doc "Used primarily for running/launching the severs"
      :author "Paul deGrandis"}
  gottafind.run
  (:require [gottafind.core :as gfc]
            [aleph.http :as aleph]))

(def ws-default-port 8888)
(def http-default-port 8080)

(defn start-http
  "Start the http server.
  Arguments:
    [port] - an int, the server's port number [http-default-port :: 8080]
  Notes:
    THIS WILL BLOCK --
      and is only meant for launching the server via the repl or lein-run"
  ([]
   (start-http http-default-port))
  ([port]
   (aleph/start-http-server gfc/web-handler {:port port})))

(defn start-ws
  "Start the websocket server.
  Arguments:
    [port] - an int, the server's port number [ws-default-port :: 8888]
  Notes:
    THIS WILL BLOCK --
      and is only meant for launching the server via the repl or lein-run"
  ([]
   (start-ws ws-default-port))
  ([port]
   aleph/start-http-server gfc/loc-handler {:port port :websocket true}))

(defn -main [& [server-type port]]
  (condp = server-type
    "ws"    (start-ws (or port ws-default-port))
    "http"  (start-http (or port http-default-port))
    (println "\nError: That server-type is not recogized")))

