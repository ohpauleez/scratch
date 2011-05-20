(ns ^{:doc "Shared sessions and session management"
      :author "Paul deGrandis"}
  gottafind.session
  (:require [lamina.core :as lamina])
  (:import [com.eaio.uuid]))

;; ## Storage
;; The sessions are currently stored in an atom;  
;; This could later be replaced with redis (which ingrates nicely with aleph)  
;; The session map is structured like:  
;;
;;      {"123-some-uuid" {:ch (lamina/channel)
;;                        :user-count 10}}
;;
;; The sessions store can be rebound,
;; to support multiple session stores by using `bind`
(def ^{:dynamic true} *live-sessions* (atom {}))
;(def ^:dynamic *live-sessions* (atom {})) ; Clojure 1.3 shorthand


;; ## CRUD operations
;; All of these methods should be far more functional,
;; taking a map-like structure as their first arg and applying functions
;; to that.  Encapsulating the atom is just a means to get something up
;; and running quickly

;; ### Read

(defn get-session
  "Fetch a session given its ID  
  Arguments:  
    session-id - a String, the ID of the target session  
  Returns:  
     - a MapEntry, [session-id {:ch the-channel :user-count n}]"
  {:added "0.1.0"}
  ([session-id]
   (find @*live-sessions* session-id)) )

(defn get-session-map
  "Fetches a session's stored map, given its ID.  
  Like get-session, but just returns the associated map  
  Arguments:  
    session-id - a String, the ID of the target session  
  Returns:  
     - a Map, {:ch the-channel :user-count n}"
  {:added "0.1.0"}
  ([session-id]
   (val (get-session session-id))))

;; ### Destroy

(defn destroy-session!
  "Removes a session from the atom'd map  
  Arguments:  
    session-id - a String, the ID of the target session"
  {:added "0.1.0"}
  ([session-id]
   (swap! *live-sessions* dissoc session-id)))

;; ### Create

;; Sessions are created with an auto-generated UUID
;; (or optionally, a named session.)  
;; If the session already exists, you're returned it, otherwise,
;;  a new session and channel is created  
;;
;; The new channel has an established callback for on-close which will
;; take care of all the bookkeeping when there are no more users, ie:  
;; when a channel is closed as many times as it was opened,
;; destory the session, otherwise, just dec the user-count.  
;; The callback will be called everytime a user closes the channel.
;; The user-count is zero based (this may change in the future).
;; Note that the user-count is inc'd by the handler function.
;;
;; SessionIDs are guaranteed to be Strings upon entering storage
(defn create-session!
  "Create shared sessions and their associated channel.  
  Arguments:  
    [session-id] - a String, the session's identifier. [auto-generated UUID]  
  Returns:  
    m - a MapEntry, the stored session  
  Notes:  
    If the session already exists, it is returned."
  {:added "0.1.0"}
  ([] (create-session! (str (com.eaio.uuid.UUID.))))
  ([session-id]
   {:pre [(string? session-id)]}
   (if-let [r (get-session session-id)]
     r
     (let [ch         (lamina/channel)
           callback   (fn [] (if (< ((get-session-map session-id) :user-count) 1)
                               (destroy-session! session-id)
                               (swap! *live-sessions* update-in [session-id :user-count] dec)))
           on-close-r (lamina/on-closed ch callback)
           fresh-map  (swap! *live-sessions* assoc session-id {:ch ch, :user-count 0})]
        (clojure.lang.MapEntry. session-id (fresh-map session-id))))))

