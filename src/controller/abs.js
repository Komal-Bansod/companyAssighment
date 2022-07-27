let allInvaitees = [{"a": 1}, {"a": 1}, {"a": 1}]

let arr = []
for(let i = 0; i<allInvaitees.length;i++){
    if(allInvaitees[i]){
        let temp = Object.values(allInvaitees[i])
        arr.push(...temp)
    
  }
}
console.log(arr)