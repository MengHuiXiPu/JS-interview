//http封装

// 类型1
import connect from 'xxx'
import qs from 'qs'
import React from 'react'

const showLoading = (t) => {
    const dom = document.createElement("div")
    dom.setAttribute("id", 'loading')
    if (t) {
        dom.setAttribute('class', 'trash')
    }
    document.body.appendChild(dom)
    ReactDOM.render(<Spin tip="请求中----" size='large' />, dom)
}

export function jumpRequest(url, reqBody, init, successCallback, failCalback, timeout = 30000) {
    const params = { REQ_BODY: reqBody }
    const body = qs.stringify({ REQ_BODY: JSON.stringify(params) })
    const myInit = {
        method: 'POST',
        Headers: {
            'content-type': 'applicatino/x-www-form-urlencoded',
            "jumpcloud-allowToken": 'API-TOKEN-CMTS-SZYF'
        },
        body,
        cache: 'no-cache',
        credentials: 'include'
    }
    const realInit = Object.assign(myInit, init)
    if (realInit.method === 'get') {
        delete realInit.body
    }
    connect.sendCustomRequest(url, realInit, successCallback, failCalback, timeout)
}


export function commonRequest(url, reqBody, init, successCallback, failCallback, timeout = 30000) {
    const myInit = {
        method: "POST",
        Headers: {
            'conent-type': 'application/json',
            'jumpcloud-allowToken': 'API-TOKEN-CMTS-SZYF'
        },
        body: JSON.stringify(reqBody),
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include'
    }
    const realInit = Object.assign(myInit, init)
    if (realInit.method === 'get') {
        delete realInit.body
    }

    connect.sendCustomRequest(url, realInit, successCallback, failCallback, timeout)
}

export function formDataRequest(url, formData, init, successCallback, failCalback, timeout = 30000) {
    const myInit = {
        method: 'POST',
        body: formData,
        mode: 'cors',
        cache: 'no-cache',
        header: {
            'jumpCloud-allowToken': "API-TOKEN-CMTS-SZYF"
        }
    }
    const realInit = Object.assign(myInit, init)
    connect.sendCustomRequest(url, realInit, successCallback, failCallback, timeout)
}
