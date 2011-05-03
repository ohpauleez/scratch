;(define a 0)
;(define b 1)

(define c (+ a b) )
(var 'c c)

(define f (+ (var 'd) (var 'e)))
(var 'f f)

(begin
  (display "Hello from inside the Scheme script.")
  (newline)
  (display "C is a+b.  c = ")
  (display  c)
  (newline))

(define (square n)
  (* n n))

(var 'square square)

