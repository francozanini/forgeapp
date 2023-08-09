package main

type Character struct {
	ID         string     `json:"id"`
	Name       string     `json:"name"`
	HP         HPTracking `json:"hp"`
	Attributes Attributes `json:"attributes"`
}

func main() {

}
