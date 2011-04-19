(ns ^{:doc "Shared sessions and session management"
      :author "Paul deGrandis"}
  gottafind.session
  (:require [lamina.core :as lamina])
  (:import [com.eaio.uuid]))

;; The sessions are currently stored in an atom;
;; This could later be replaced with redis (which ingrates nicely with aleph)
;; The session map is structured like: 
;; {"123-some-uuid" {:ch (lamina/channel)
;;                   :user-count 10}}
(def live-sessions (atom {}))

(defn get-session
  "Fetch a session given its ID
  Arguments:
    session-id - a String, the ID of the target session
  Returns:
     - a MapEntry, [session-id {:ch the-channel :user-count n}]"
  [session-id]
  (find @live-sessions session-id))

(defn get-session-map
  "Fetches a session's stored map, given its ID.
  Like get-session, but just returns the associated map"
  [session-id]
  (val (get-session session-id)))

(defn destroy-session!
  "Removes a session from the atom'd map"
  [session-id]
  (swap! live-sessions dissoc session-id))
 
;; Sessions are created with an auto-generated UUID, or a named session.
;; If the session already exists, you're returned it, otherwise,
;;  a new session and channel is created
;; The new channel has an established callback for on-close which will
;; take care of all the bookkeeping.  When there are no more users, ie:
;; when a channel is closed as many times as it was opened,
;; destory the session, otherwise, just dec the user-count.
;; Note that the user-count is inc'd by the handler function.
(defn create-session!
  "Create shared sessions and their associated channel.
  Arguments:
    [session-id] - a String, the session's identifier. [auto-generated UUID]
  Returns:
    m - a Map, the stored session
  Notes:
    If the session already exists, it is returned."
  ([] (create-session (com.eaio.uuid.UUID.)))
  ([session-id]
   (let-if [r (get-session session-id)]
     r
     (let [ch (lamina/channel)
           callback (fn [] (if (< ((get-session-map session-id) :user-count) 1)
                       (destroy-session session-id)
                       (swap! live-sessions update-in [session-id :user-count] dec)))
           on-close-r (lamina/on-close ch callback)] 
       (swap! live-sessions assoc session-id {:ch ch, :user-count 0})))))

