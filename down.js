export function downLoadRequest(url, params) {
    var xhr = new XMLHttpRequest()
    xhr.open('post', url, true)
    xhr.setRequestHeader("content-type", 'application/x-wwww-form-urlencoded')
    xhr.responseType = 'arraybuffer'
    xhr.onload = function (e) {
        if (this.status = 200) {
            callbackFunc(true)
            var type = xhr.getResponseHeader('Content-Type')
            var blob = new Blob([this.response], { type: type })
            var URL = window.url || window.webkitURL;
            var downloadUrl = URL.createObjectURL(blob)
            var a = document.createElement('a')
            a.href = downloadUrl
            document.body.appendChild(a)
            a.click()
        }
    }
}