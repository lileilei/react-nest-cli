import React from "react"
import { createAlova, useRequest } from 'alova';
import GlobalFetch from 'alova/GlobalFetch';
import ReactHook from 'alova/react';
import { getUser } from "./auth"

let _user = null

// 1. 创建alova实例
const alovaInstance = createAlova({
  // ReactHook用于创建ref状态，包括请求状态loading、响应数据data、请求错误对象error等
  statesHook: ReactHook,
  // 请求适配器，推荐使用fetch请求适配器
  requestAdapter: GlobalFetch(),
  // 全局的响应拦截器
  responded: {
    onSuccess: async (response, method) => {
      if (response.status >= 400) {
        return Promise.reject({ status: response.status, message: `url：${response.url} -[ status：${response.status} ]` })
      }
      return await response.json();
    }
  },

  beforeRequest(method) {
    if (!_user) {
      _user = getUser()
    }
    // 假设我们需要添加token到请求头
    method.config.headers["Content-Type"] = 'application/json;charset=UTF-8';
    method.config.headers["X-Tenant-Id"] = '1001';
    method.config.headers["X-Access-Token"] = (_user && _user.token)
  },
  localCache: {
    // 设置缓存模式为内存模式
    mode: 'memory',
    // 单位为毫秒
    // 当设置为`Infinity`，表示数据永不过期，设置为0或负数时表示不缓存
    expire: 0
  }
});


export default alovaInstance