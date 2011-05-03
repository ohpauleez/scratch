;Scheme to java procedures
(import s2j)

;Java to scheme procedures
(import generic-procedures)

(begin
  (display "Start of the example2.ss script\nTrying to import java classes")
  (newline))


(define-java-classes
  (<engine> |javax.script.ScriptEngine|)
  (<engineManager> |javax.script.ScriptEngineManager|))


(begin
  (display "Creating the Script Engine Manager")
  (newline))

(define manager (java-new <engineManager>))
(define-generic-java-method get-engine |getEngineByName|)

(begin
  (display "Creating the Python Script Engine")
  (newline))


(define pyEngine (get-engine manager (->jstring "python")))
;(display pyEngine)
(define-generic-java-method eval-py |eval|)
(define pyEvalOut (eval-py pyEngine (->jstring "print 'Hello From python!, inside Scheme!'")))
(newline)(newline)

(display "SUCCESS!")
(newline)

