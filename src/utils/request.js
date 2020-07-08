// 封装axios
import axios from 'axios';

class HttpRequest {
	constructor() {
		this.baseURL = process.env.NODE_ENV === 'development' ? '开发接口地址' : '生产接口地址';
		this.timeout = 4000; // 超时时间
	}
	setInterceptors(instance){
		// 这里增加请求拦截器
		instance.interceptors.request.use(config=>{
			return config;
		});
		
		// 这里增加响应拦截器
		instance.interceptors.response.use(res=>{
			if(res.status === "200" || res.status === 200){
				return Promise.resolve(res.data);
			}else{
				return Promise.reject(res)
			}
		},err=>{
			// 单独处理其他状态码异常
			switch (err.response.status) {
				case '401':
					console.log(err);
					break;
				default:
					console.log(err);
					break;
			}
			return Promise.reject(err);
		})
	}
	mergeOptions(options){
		return {baseURL: this.baseURL, timeout: this.timeout, ...options}
	}
	// 保证实例的唯一性，彼此之间相互独立
	request(options){
		const instance = axios.create(options);
		this.setInterceptors(instance);
		const opts = this.mergeOptions(options);
		return instance(opts);
	}
	get(url,config){
		return this.request({
			methods: 'get',
			url,
			...config
		})
	}
	post(url,data){
		return this.request({
			methods: 'post',
			url,
			data
		})
	}
}

export default new HttpRequest;
