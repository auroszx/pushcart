let xhr = new XHR();
function $(id) {
    return document.getElementById(id);
};
function sendGet(){
    if($('getCed').value.trim()!==''){
        xhr.get(`../db/getUser/${$('getCed').value.trim()}`,{},{}).then((data)=>{
            console.log(data);
        });
    }
    else{
        console.log('Value is null');
    }
};
function sendPost(){
    if($('ced').value.trim()!==''&&$('name').value.trim()!==''&&$('lastName').value.trim()!==''&&
    $('age').value.trim()!==''){
        xhr.post(`../db/createUser`,{
            ced:    parseInt($('ced').value.trim()),
            name:   $('name').value.trim(),
            lastname:$('lastName').value.trim(),
            age:    parseInt($('age').value.trim())
        },{'Content-Type':'application/json'}).then((data)=>{
            console.log(data);
        }); 
    }
    else{
        console.error('Complete los campos');
    } 
};
/*  Ejemplo basico de una promesa
    donde tenemos una funcion a, que llama a una funcion b;
    esta funcion b es la definicion de la promesa, la cual recibe un parametro 'msg'
    el cual va a verificar si esta vacio o no.
    
    En caso de que este sea distinto de '' la promesa hace resolve lo que lleva al
    then dentro de la funcion a, de lo contrario hace reject que lleva al catch
    dentro de la funcion a. 
*/
function a (){
 let value = $('promInp').value.trim();
    b(value).then((data)=>{
    console.log(`mensaje ${data} enviada desde promesa B`);
 }).catch((errorData)=>{
    console.log(`${errorData} enviada de error desde promesa B`);
 });
}
function b (msg){
    return new Promise((res,rej)=>{
        if(msg.trim()==='')
            rej(msg);
        else
            res(msg);
    });
}
$('promBut').addEventListener('click',a);
$('butGet').addEventListener('click',sendGet);
$('butPost').addEventListener('click',sendPost);