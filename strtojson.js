/**
奴隶社会,非洲,古埃及文明,金字塔
,亚洲,两河流域文明,汉谟拉比法典
,,古印度,种姓制度
,,,佛教的创立
,欧洲,希腊,希腊城邦
,,,雅典民主
,,罗马,城邦
,,,帝国的征服与扩展
,,希腊罗马古典文化,建筑艺术
,,,公历
**/
function strtojson (str) {
    let arr = str.split('\n')
    /**
    ["奴隶社会,非洲,古埃及文明,金字塔",
    "       ,亚洲,两河流域文明,汉谟拉比法典",
    "       ,   ,古印度,种姓制度",
    "       ,   ,     ,佛教的创立",
    "       ,欧洲,希腊,希腊城邦",
    "       ,   ,    ,雅典民主",
    "       ,   ,罗马,城邦",
    "       ,   ,    ,帝国的征服与扩展",
    "       ,   ,希腊罗马古典文化,建筑艺术",
    "       ,   ,             ,公历"]
    **/
    let obj = []
    for (var i = 0; i < arr.length; i++) {
        let childObj = createChildObj(arr[i])
        let depth = findoutDepth(arr[i])
        let pathnames = getPathnames(depth, obj, [])
        changeTarget(0, pathnames, obj, childObj)
    }
    return JSON.stringify(obj[0])
    // return obj[0]
}
function changeTarget (index, pathnames, obj, target) {
    if (index === pathnames.length) {
        return obj.push(target)
    } else {
        let pathname = pathnames[index]
        return changeTarget(index + 1, pathnames, obj[pathname], target)
    }
}
function getPathnames (depth, obj, pathname) {
    if (depth === 0) {
        return pathname
    }
    if(obj instanceof Array) {
        let index = obj.length - 1
        let lastProp = findoutLastProp(obj[index])
        pathname.push(index)
        pathname.push(lastProp)
        return getPathnames(depth-1, obj[index][lastProp], pathname)
    } else {
        let lastProp = findoutLastProp(obj)
        pathname.push(lastProp)
        return getPathnames(depth-1, obj[lastProp], pathname)
    }
}
// 找出obj中最后一个property
function findoutLastProp (obj) {
    let arr = Object.keys(obj)
    return arr[arr.length - 1]
}
// 每一行找出有几个空字符串，即递进层级数
function findoutDepth (str) {
    let arr = str.split(',')
    // ["", "", "古印度", "种姓制度"]
    let depth = 0
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === '') {
            depth ++
        } else {
            return depth // 2
        }
    }
}
function createChildObj (str) {
    let arr = str.split(',')
    // let arr = ["奴隶社会", "非洲", "古埃及文明", "金字塔"]

    let childObj = concatObj(arr.length - 1, arr, [])
    return childObj

    // 从后往前 后面一个是前面一个的子节点 拼接目标obj
    function concatObj (index, arr, obj) {
        // 遇到空字符串停止解析
        if (arr[index] === '') {
            return obj[0]
        }
        if (index === arr.length - 1) {
            obj.push(arr[index])
            // ['a','b','c']
            return concatObj(index - 1, arr, obj)
        } else if (index > 0) {
            let temp = {}
            temp[arr[index]] = obj
            let arrx = []
            arrx.push(temp)
            // [{name: value}]
            return concatObj(index-1, arr, arrx)
        } else if (index === 0){
            let temp = {}
            temp[arr[index]] = obj
            // {name: value}
            return temp
        } else {
            // {name: value} || 'a':String
            return obj[0]
        }
    }
}
