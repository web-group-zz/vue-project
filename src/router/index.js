import Vue from 'vue';
import VueRouter from 'vue-router';
import { routerMixin } from '../utils/utilsMixin';

Vue.use(VueRouter);




const myroutes = routerMixin();


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: myroutes
});

export default router
