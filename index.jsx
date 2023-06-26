import { useEffect, useState, useRef } from 'react'
import { useFetchRequest } from 'HOOKS'


const Flag = () => {
    const [{ result: [{ operateInfo = [], checkInfos = [] }, setQuerymsg] }, querymsg] = useFetchRequest()
    const [currentArr, setCurrentArr] = useState([])
    useEffect(() => {
        getInit(params, querymsg,setCurrentArr)
    }, [])

    const getInit = (params,querymsg,setCurrentArr)=>{
        querymsg('getuserInfo',params,(res)=>{
            let {success}=res||[]
            if(success){
                let {operateInfo=[],checkInfos=[]}=res;
                setCurrentArr(operateInfo)
                return({operateInfo,checkInfos})
            }
        })
    }
}