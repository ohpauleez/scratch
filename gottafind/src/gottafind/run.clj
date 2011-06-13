(ns ^{:doc "Used primarily for running/launching the severs"
      :author "Paul deGrandis"}
  gottafind.run
  (:require [gottafind.core :as gfc]
            [aleph.http :as aleph]
            [aleph.tcp :as alephtcp]
            [gloss.core :as gloss]))

(def ws-default-port 8888)
(def http-default-port 8080)

(defn start-http
  "Start the http server.
  Arguments:
    [port] - an int, the server's port number [http-default-port :: 8080]
  Returns:
     - an aleph.http.server
  Notes:
    This is only meant for launching the server via the repl or lein-run"
  ([]
   (start-http http-default-port))
  ([port]
   (aleph/start-http-server gfc/web-handler {:port port})))

(defn start-ws
  "Start the websocket server.
  Arguments:
    [port] - an int, the server's port number [ws-default-port :: 8888]
  Returns:
     - an aleph.http.server
  Notes:
    This is only meant for launching the server via the repl or lein-run"
  ([]
   (start-ws ws-default-port))
  ([port]
   (aleph/start-http-server gfc/loc-handler {:port port :websocket true})))

(defn start-policy
  ""
  []
  (alephtcp/start-tcp-server gfc/flash-policy-handler {:port 843, :frame (gloss/string  :utf-8 :delimiters  ["\r\n"])}))

(defn start-gottafind
  "Start the websocket server and the http server, on their default ports
  Returns:
     - a vector, [http-ret ws-ret], the results of starting the http server 
        and the ws server
  Notes:
    This is only meant for launching the server via the repl or lein-run"
  []
  (let [ws (start-ws) ; this entire let block could be: ((juxt start-ws start-http))
        http (start-http)]
    [http ws]))

(defn start-gottafind-root
  []
  (conj (start-gottafind) (start-policy)))

(defn -main [& [server-type port]]
  (case server-type
    "ws"      (start-ws (or port ws-default-port))
    "http"    (start-http (or port http-default-port))
    "policy"  (start-policy)
    "gf"      (start-gottafind)
    "gf-root" (start-gottafind-root)
    (println "\nError: That server-type is not recogized")))

