function GetByString(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var m = a[i];
        if (m in o) {
            o = o[m];
        } 
        else {
            return;
        }
    }
    return o;
}  