(ns gottafind.session
  (:require [lamina.core :as lamina])
  (:import [com.eaio.uuid]))

(def live-sessions (atom {}))

(defn create-session
  ([] (create-session (com.eaio.uuid.UUID.)))
  ([session-id]
   (let-if [r (find @live-sessions session-id)]
     r
     (let [ch (lamina/channel)
           callback (fn [] (if (< (get-session-map session-id) 1)
                       (destroy-session session-id)
                       (swap! live-sessions update-in [session-id :users] dec)))
           on-close-r (lamina/on-close ch callback)] 
       (swap! live-sessions assoc session-id {:ch ch, :users 0})))))

(defn get-session
  ""
  [session-id]
  (find @live-sessions session-id))

(defn get-session-map
  ""
  [session-id]
  (val (get-session session-id)))

(defn destroy-session
  ""
  [session-id]
  (swap! live-sessions dissoc session-id))

