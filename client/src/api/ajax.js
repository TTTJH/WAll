import axios from 'axios';

export default function(url, data = {}, type = 'GET'){
  return new Promise((resolve, reject) => {
    let result;
    if(type === 'GET'){
      let baseUrl = '';
  
      Object.keys(data).map(function(item, index){
        baseUrl += `${item}=${data[item]}& `;
      });
  
      baseUrl = url + baseUrl.slice(0,baseUrl.length-1);
  
       result =  axios.get(baseUrl);
  
    }else{
       result =  axios.post(url, data); 
    }
    result.then(function(value){
      resolve(value.data);
    },function(err){
      reject(err);
    })
  })
}