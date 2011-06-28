(defproject gottafind "0.1.0-SNAPSHOT"
  :description "A location sharing servive"
  :url "https://github.com/ohpauleez/scratch/tree/master/gottafind"
  :license {:name "Eclipse Public License - v 1.0"
            :url "http://www.eclipse.org/legal/epl-v10.html"
            :distribution :repo
            :comments "See the notice in README.md or details in LICENSE.html"}
  :dependencies [[aleph "0.1.5-SNAPSHOT"]
                 [net.cgrand/moustache "1.0.0"]
                 [ring/ring-core "0.3.8"]
                 ;[clj-json "0.3.1"]
                 [com.eaio.uuid/uuid "3.2"]]
  :dev-dependencies [[vimclojure/server "2.3.0-SNAPSHOT"]
                     [lein-cdt "1.0.0"] ; use lein cdt to attach
                     [marginalia "0.5.1"]
                     [org.clojars.rayne/autodoc "0.8.0-SNAPSHOT"]
                     [lein-multi "1.1.0-SNAPSHOT"]
                     ;[org.clojars.mjul/lein-cuke "1.1.0"]
                     [com.stuartsierra/lazytest "2.0.0-SNAPSHOT"]]
  :multi-deps {"1.2.1"  [[org.clojure/clojure "1.2.1"]
                         [org.clojure/clojure-contrib "1.2.0"]]
               "1.3"    [[org.clojure/clojure "1.3-beta1"]
                         [org.clojure.contrib/repl-utils "1.3.0-alpha4"]] }
  :repositories {"stuartsierra-releases" "http://stuartsierra.com/maven2"
                 "stuartsierra-snapshots" "http://stuartsierra.com/m2snapshots"}
  :autodoc {:name "GottaFind"
            :copyright "Paul deGrandis under EPL 1.0"
            :web-home "https://github.com/ohpauleez/scratch/tree/master/gottafind"
            :web-src-dir "https://github.com/ohpauleez/scratch/tree/master/gottafind"
            :output-path "docs"}
  ;:hooks  [leiningen.hooks.cdt]
  ;:cdt-debug-port 8022
  ;:warn-on-reflection true
  :run-aliases {:server gottafind.run}
  ;:jvm-opts ["-Xmx1g"]
  ;:jvm-opts ["-server" "-Xmx1g" "-XX:+UseConcMarkSweepGC" "-XX:+UseParNewGC" "-XX:+UseCompressedOops"]
  ;:jvm-opts ["-server" "-Xmx50mb" "-XX:+UseConcMarkSweepGC" "-XX:+UseParNewGC" "-XX:+UseCompressedOops"]
  ;:repl-port 4001
  ;:repl-host "127.0.0.1"
  :repl-init-script "script/repl_init.clj")

