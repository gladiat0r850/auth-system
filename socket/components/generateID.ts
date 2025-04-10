const characters = [
  ..."abcdefghijklmnopqrstuvwxyz".split(""),
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
];
export default function generateID(){
    let stringIDArray = []
    for(let i = 0; i < 20; i++){
        stringIDArray.push(characters[Math.floor(Math.random() * characters.length)])
    }
    return stringIDArray.join("")
}