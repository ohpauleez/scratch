(defproject gottafind "0.1.0-SNAPSHOT"
  :description "A location sharing servive"
  :url "http://github.com/ohpauleez/scratch/gottafind"
  :license {:name "Eclipse Public License - v 1.0"
            :url "http://www.eclipse.org/legal/epl-v10.html"
            :distribution :repo
            :comments "See the notice in README.md or details in LICENSE.html"}
  :dependencies [;[org.clojure/clojure "1.3.0-master-SNAPSHOT"]
                 [org.clojure/clojure "1.2.1"]
                 [aleph "0.1.5-SNAPSHOT"]
                 [clj-json "0.3.1"]]
  :dev-dependencies [[vimclojure/server "2.3.0-SNAPSHOT"]
                     [org.clojure/clojure-contrib "1.2.0"]
                     [org.clojure/clojure "1.3.0-alpha6"]
                     [org.clojure.contrib/repl-utils "1.3.0-alpha4"]
                     ;[org.clojure.contrib/repl-utils "1.3.0-SNAPSHOT"]
                     [lein-cdt "1.0.0"] ; use lein cdt to attach
                     [marginalia "0.5.0"]
                     ;[autodoc "0.7.1"]
                     ;[lein-multi "1.0.0"]
                     [lein-run "1.0.1-SNAPSHOT"]
                     ;[org.clojars.mjul/lein-cuke "1.1.0"]
                     [com.stuartsierra/lazytest "2.0.0-SNAPSHOT"]]
  :repositories {"stuartsierra-releases" "http://stuartsierra.com/maven2"
                 "stuartsierra-snapshots" "http://stuartsierra.com/m2snapshots"}
  ;:hooks  [leiningen.hooks.cdt]
  ;:cdt-debug-port 8022
  ;:warn-on-reflection true
  ;:jvm-opts ["-Xmx1g"]
  ;:jvm-opts ["-server" "-Xmx1g" "-XX:+UseConcMarkSweepGC" "-XX:+UseParNewGC" "-XX:+UseCompressedOops"]
  ;:jvm-opts ["-server" "-Xmx50mb" "-XX:+UseConcMarkSweepGC" "-XX:+UseParNewGC" "-XX:+UseCompressedOops"]
  ;:repl-port 4001
  ;:repl-host "127.0.0.1"
  :repl-init-script "script/repl_init.clj")

