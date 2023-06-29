/*
 * @Author: 阿磊--
 * @Date: 2021-07-16 09:44:33
 * @LastEditTime: 2021-07-21 09:52:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vite-cli/client/src/App.tsx
 */
import React, { useState, useEffect } from 'react'
import { Routes, Route, Outlet, Link } from "react-router-dom";
import {ConfigProvider} from "antd"
import Layout from "./layout"
import Login from "./login"
const pages = import.meta.globEager('./pages/**/*.jsx')
const routerData = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\.jsx$/)[1]
  return {
    name,
    path: name === 'index' ? '/' : `${name.toLowerCase()}`,
    exact: name === 'index' ? true : false,
    element: pages[path].default
  }
})

function App() {
  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: "#009999" } }}
    >
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />} >
          {routerData.map(function ({ path, element: Element }) {
            return (
              <Route key={path} path={path} element={<Element />} />
            )
          })}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </ConfigProvider>
  )
}



function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App
