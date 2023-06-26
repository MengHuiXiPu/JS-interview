import { Component, useEffect, useState } from "react";
import { jumpRequest } from 'ConnectUtil'

export default useFetchRequest = (defaultVal = [], showError = true, isCamelize = false) => {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(defaultVal)
    const [error, setError] = useState({})
    const fetchRequest = (url, reqbody, handleRes = undefined, handleError = undefined, init = {}, ajaxEnd = '.ajax', timeout = 60000) => {
        if (loading) return

        let requestFunc = (pagination, isFirstSearch) => {
            setLoading(true)
            reqbody.PAGE_CODE = pageCode(pagination)
            jumpRequest(url, reqbody, init, async (res) => {
                let result = await handleRes(res);
                setResult(result);
                setLoading(false);

            }, (err) => {
                setError(err)
                MessageChannel.error(err.message)
                setLoading(false)
            })

        }
    }
    fetchRequest(reqbody?.PAGE_CODE, true)
    return [{ loading, result: [result, setResult], error }, fetchRequest]
}