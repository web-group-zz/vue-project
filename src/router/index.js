import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
Vue.use(VueRouter);

// 需要通过路由传参的自己配置(建议在views建一个独立的文件夹管理传参页面)
const routes = [];
// 匹配vue文件的路径
const regs = /\.\/([a-zA-Z]+\/)?([a-zA-Z]+).vue$/;
// 获取
const files = require.context('../views', true, /\.vue$/).keys();
console.log(files);

const myroutes = [];

files.forEach(path=>{
  let matchArr = path.match(regs);
  if(matchArr){
      const fileName = matchArr[2];
      const folderName = matchArr[1];
      
      if(folderName){ // 存在文件夹的情况
          if(fileName  === 'index' && (folderName.toLowerCase() === 'home' || folderName.toLowerCase() === 'index') ){
              myroutes.unshift({
                  path: '/',
                  name: folderName,
                  component: require(`../views/${folderName}${fileName}.vue`).default
              })
          }else{
              myroutes.push({
                  path: '/'+folderName.toLowerCase(),
                  name: folderName,
                  component: () => import(/* webpackChunkName: 'doc-[folderName]' */  `../views/${folderName}${fileName}.vue`)
              })
          }
      }else{
          if(fileName.toLowerCase() === 'home' || fileName.toLowerCase() === 'index'){
              myroutes.unshift({
                  path: '/',
                  name:fileName,
                  component: require(`../views/${fileName}.vue`).default
              })
          }else{
              myroutes.push({
                  path: '/'+fileName.toLowerCase(),
                  name:fileName,
                  component: () => import(/* webpackChunkName: 'doc-[request]' */  `../views/${fileName}.vue`)
              })
          }
      }
      
      
  }
});

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: myroutes.concat(routes)
});

export default router
