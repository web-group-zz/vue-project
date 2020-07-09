const GloblComponent = require.context('@/components',true,/\.vue$/).keys();
const files = require.context('@/views', true, /\.vue$/).keys();
const componentsFileNameReg = /\.\/([a-zA-Z]+).vue$/;
const routerFilesNameReg = /\.\/([a-zA-Z]+\/)?([a-zA-Z]+).vue$/;

// 注册全局组件（仅支持.vue文件形式）
function componentMixin(Vue){
	if(GloblComponent && GloblComponent.length > 0){
		GloblComponent.forEach(component=>{
			let filename = component.match(componentsFileNameReg)[1];
			component = component.replace(/\.\//,"");
			console.log(component, `@/components/${component}`);
			Vue.component(filename,require(`@/components/${component}`).default)
		});
	}
}

// 注册全局路由 （支持.vue文件和文件夹的形式）
function routerMixin(myroutes = []) {
	files.forEach(path=>{
		let matchArr = path.match(routerFilesNameReg);
		if(matchArr){
			const fileName = matchArr[2];
			let folderName = matchArr[1];
			
			if(folderName){ // 存在文件夹的情况
				folderName = folderName.replace(/\//g,'');
				if((folderName.toLowerCase() === 'home' || folderName.toLowerCase() === 'index') ){
					myroutes.unshift({
						path: '/',
						name: folderName,
						component: require(`@/views/${folderName}/index.vue`).default
					})
				}else if(fileName  === 'index'){
					myroutes.push({
						path: '/'+folderName.toLowerCase(),
						name: folderName,
						component: () => import(/* webpackChunkName: 'doc-[folderName]' */  `@/views/${folderName}/${fileName}.vue`)
					})
				}
			}else{
				if(fileName.toLowerCase() === 'home' || fileName.toLowerCase() === 'index'){
					myroutes.unshift({
						path: '/',
						name:fileName,
						component: require(`@/views/${fileName}.vue`).default
					})
				}else{
					myroutes.push({
						path: '/'+fileName.toLowerCase(),
						name:fileName,
						component: () => import(/* webpackChunkName: 'doc-[request]' */  `@/views/${fileName}.vue`)
					})
				}
			}
		}
	});
	return myroutes;
}

export {
	componentMixin,
	routerMixin
}
