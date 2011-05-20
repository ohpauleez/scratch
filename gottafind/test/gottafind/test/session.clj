(ns gottafind.test.session
  (:require [gottafind.session :as session] :reload)
  (:use [lazytest.deftest :only (are)] ; these are done using expect
        [lazytest.expect.thrown :only (throws?)]
        [lazytest.describe :only  (describe testing given it)]))

(describe "GottaFind's internal sessions"
  (testing "Reading the session store"
    (given "There are sessions in the store" [session-id "key1"
                                              session-val {:ch 1 :user-count 2}
                                              ls (atom {session-id session-val})]
      (binding [session/*live-session* ls]
        (it "should be able fetch a session, given the session id string"
          (are [expected actual] (= expected actual)
               [session-id session-val] (session/get-session session-id)
               clojure.lang.MapEntry (type (session/get-session session-id))
               session-val (session/get-session-map session-id)))
        (it "should return nil for session ids that don't exist"
          (are [expected actual] (= expected actual)
               nil (session/get-session "some-key")
               nil (session/get-session-map "some-key")))))
    (given "The session store is empty"
      (it "should return nil for any requested key"
        (are [expected actual] (= expected actual)
             nil (session/get-session "some-key") ; TODO: use random here to fuzz some keys
             nil (session/get-session-map "some-key")))))
  
  (testing "Destroying stored sessions"
    (given "There are sessions in the store" [session-id1 "key1"
                                              session-id2 "key2"
                                              session-val {:ch 1 :user-count 2}
                                              ls (atom {session-id1 session-val
                                                        session-id2 session-val})]
      (binding [session/*live-session* ls]
        (it "should return the session map sans the newly destroyed session"
          (are [expected actual] (= expected actual)
               {session-id2 session-val} (session/destroy-session! session-id1) ; removes session-id1
               {session-id2 session-val} @session/*live-session* ; session-id1 is really gone
               {session-id2 session-val} (session/destroy-session! session-id1) ; removing again has no effect
               {} (session/destroy-session! session-id2) ; remove the last session
               ; there are no more sessions
               {} @session/*live-session*))))
      (given "The session store is empty"
        (it "should return back the empty session"
          (is (= {} (session/destroy-session! "some-key")))))))

