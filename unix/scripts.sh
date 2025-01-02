alias runp="node playground.js"

myvar1=500
myvar2=500

x=120
y=150

sleep 4

echo $(( $x + $y ))

sleep 5

myfunc () {
    echo "this is a function"
    echo $1 | tr " " "\n"
    echo $(($myvar1+$myvar2))
}

myfunc "hello world"