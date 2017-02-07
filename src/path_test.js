"use strict";
const fs = require('fs');
const path = require('path');
const currentLocation = process.cwd();

let argv = require('optimist').default({
    'r': '',
    'url':''
}).argv;


let url = argv.url;



if(argv.r === 'rm'){
	rmDir(url,function(){

	});
}else{
	makeDir(url,function(err){
		console.log(err)
	});
}


function makeDir(url,cb){
		var arr = arr = url.split('/');
    var relativePos = ''
    
    //路径必须为相对路径，储存相对路径的位置
    	relativePos = arr.shift();
   
    	

   cycleMakeDir(url,arr,0);
    function cycleMakeDir(url,arr,pos){
    	// 从数组的第一位开始创建
    	fs.mkdir(relativePos+'/'+arr[pos],function(err){
    		if(!err){
    			// 如果成功了创先数组的下一位路径，如果超过数组的最大路径结束运行
    			if(pos>=(arr.length-1)){
    				return;
    			}

    			relativePos = relativePos+'/'+arr[pos];
    			cycleMakeDir(url,arr,pos+1)
    			//如果返回为空代表创建成功
    			if(cb){
    				cb();
    			}
    			
    		}else{
    			// 如果失败了创先数组的下一位路径，如果超过数组的最大路径结束运行
    			if(pos>=(arr.length-1)){
    				return;
    			}
    			cycleMakeDir(url,arr,pos+1)
    			if(cb){
    				cb(err);
    			}
    		}
    	});
    }




		
}




function rmDir(url,cb){
	fs.rmdir(url,function(err){
		if(!err){
			// 如果返回为空代表删除成功
			cb()
		}else{
			cb(err)
		}
	});
}

